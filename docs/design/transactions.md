# Transaction, hạn mức và cập nhật sân

[Chỉ mục thiết kế](../DESIGN.md) · Cập nhật 2026-11-04 · Chưa có code/migration/test.

Đã duyệt hướng khóa User để bảo vệ hạn mức và bảo vệ giá trong transaction ngắn. Thứ tự khóa đầy đủ giữa các luồng/SQL cụ thể và kiểm chứng đồng thời còn mở.

## Giới hạn 3 booking — đã duyệt hướng khóa dòng User 2026-11-03

### Xác nhận chính sách giữ chỗ 2026-11-03

Sau khi cân nhắc hạn chế giữ giờ cao điểm và nhu cầu khách đặt nhiều buổi, người học duyệt giữ tối đa 3 booking tương lai chưa hủy trên mỗi tài khoản cho bản đầu. Đặt con số tại một cấu hình backend tập trung để dễ điều chỉnh khi có phản hồi thực tế; giá trị hiện hành vẫn là 3, không cho client tự chọn hạn mức. Chưa cần thêm bảng cấu hình, dependency hoặc API quản trị cấu hình. Không bổ sung hạn mức theo ngày/giờ cao điểm. Booking đã bắt đầu hoặc đã hủy không tính; không phải 3 lượt mỗi tuần và không ngăn nhiều tài khoản. Chưa có dữ liệu chứng minh mức 3 tối ưu.

Response lỗi hạn mức đã duyệt trong [API booking](api-bookings.md). Chưa triển khai cấu hình hoặc test concurrency.


Mục tiêu: mỗi khách có tối đa 3 Booking với status=CONFIRMED và startAt lớn hơn thời điểm kiểm tra. Không cần bảng hoặc cột đếm mới. BookingSlot bảo vệ sân/slot, không bảo vệ tổng số booking của một tài khoản trên các slot khác nhau.

### Vấn đề và phương án

Khách đang có 2 booking tương lai, gửi hai request đặt các slot khác nhau. Nếu cả hai cùng đếm được 2 rồi tạo thêm thì kết quả là 4. Chỉ bọc COUNT và INSERT trong transaction ở Read Committed chưa đủ để loại bỏ tình huống này.

Người học đã duyệt luồng transaction: khóa User → đọc trạng thái chặn → đếm booking tương lai chưa hủy → kiểm tra điều kiện đặt → tạo Booking và toàn bộ BookingSlot → commit hoặc rollback. Đây là xác nhận hướng thiết kế, không phải bằng chứng thực thi hoặc hiểu độc lập mọi chi tiết isolation/SQL. Chi tiết kỹ thuật của phương án dùng dòng User làm điểm phối hợp, với transaction Read Committed:

1. Lấy userId từ danh tính đã xác thực; khóa đúng dòng User bằng SELECT ... FOR UPDATE với tham số truy vấn an toàn. Không khóa cả bảng User, không thêm trường isLocked hoặc thay đổi quyền đăng nhập.
2. Sau khi lấy được khóa, đọc trạng thái chặn hiện hành. Lấy thời điểm kiểm tra mới từ nguồn thời gian backend/database; không dùng thời điểm bắt đầu transaction trước lúc chờ khóa làm thời gian hiện tại. Khi dùng PostgreSQL cần phân biệt CURRENT_TIMESTAMP/now() cố định ở đầu transaction với clock_timestamp().
3. Bằng một câu truy vấn riêng SAU khi đã lấy được khóa, đếm Booking của khách với status=CONFIRMED và startAt > thời điểm kiểm tra. Ở Read Committed, câu đếm mới nhìn thấy booking mà request trước đã commit trước khi câu đếm bắt đầu. Không gộp khóa và đếm vào một câu dùng snapshot cũ.
4. Nếu số lượng >= 3 thì từ chối, không tạo Booking/BookingSlot. Mã lỗi 409/BOOKING_LIMIT_REACHED đã duyệt trong api-bookings.md.
5. Nếu còn chỗ trong hạn mức thì tiếp tục kiểm tra đầy đủ điều kiện đặt, tạo Booking và toàn bộ BookingSlot trong cùng transaction. Kiểm tra lại thời gian bắt đầu sau các lần chờ khóa tài nguyên liên quan; hướng khóa đọc Court/bảo vệ giá và trạng thái đã chốt ở mục Court thay đổi đồng thời, chi tiết phối hợp mọi luồng và kiểm chứng SQL vẫn còn mở.
6. Commit khi toàn bộ thành công; nếu lỗi thì rollback toàn bộ. Khóa được giải phóng khi transaction kết thúc; không gọi dịch vụ ngoài hoặc chờ thao tác frontend khi đang giữ khóa.

Mọi đường tạo booking đều phải tuân thủ cùng giao thức khóa User này; khóa không tự ngăn một đoạn code khác INSERT booking nếu đoạn code đó bỏ qua giao thức. Chưa có ràng buộc SQL trực tiếp bảo vệ hạn mức đếm.

Ví dụ kết quả mong đợi: R1 lấy khóa trước, đếm 2 và tạo booking thứ 3 rồi commit. R2 chờ khóa, sau đó đếm lại thấy 3 nên bị từ chối. Nếu R1 rollback do tranh slot thì R2 vẫn có thể đếm 2 và tiếp tục. Tài khoản khác khóa dòng User khác, không bị tuần tự hóa bởi cùng một khóa User.

Chặn/mở chặn phải phối hợp trên cùng dòng User: thao tác UPDATE cờ và ghi lịch sử trong transaction sẽ tranh khóa với tạo booking. Thứ tự lấy được khóa quyết định thao tác nào đi trước; nếu đặt giữ khóa trước thì có thể hoàn tất trước thao tác chặn, nếu chặn commit trước thì đặt phải đọc thấy bị chặn. Đây là đề xuất thứ tự xử lý, còn cần review riêng với luồng admin, chưa có test. Hủy chỉ giảm số booking được tính; phối hợp khóa giữa luồng hủy/đặt và thứ tự khóa toàn hệ thống cần hoàn thiện riêng để tránh deadlock.

Nguồn đã đọc: [PostgreSQL Row-Level Locks](https://www.postgresql.org/docs/current/explicit-locking.html#LOCKING-ROWS) và [Read Committed](https://www.postgresql.org/docs/current/transaction-iso.html#XACT-READ-COMMITTED). Hướng transaction/khóa User đã được duyệt; các chi tiết SQL vẫn chưa triển khai, không phải SQL đã chạy.

Kiểm tra cần làm khi triển khai trên database test riêng: tài khoản có 2 booking gửi hai request đồng thời tới slot khác nhau chỉ thêm tối đa 1 booking; rollback do tranh slot không tiêu hao hạn mức; booking hủy/đã bắt đầu không tính; tài khoản khác độc lập; thao tác chặn/đặt đồng thời tuân theo thứ tự đã chốt. Chưa thực hiện các test này.

## Court thay đổi đồng thời — chốt hướng transaction ngắn 2026-11-03

Người học làm rõ muốn bảo vệ giá trong transaction đặt chạy đồng thời với cập nhật admin. Mentor trước đó mở rộng sang báo giá trước đặt và TTL gây dư phạm vi; rút phương án báo giá/TTL khỏi thiết kế hiện hành. Không cần mã/bảng báo giá, không giữ giá từ lúc xem màn hình. Nhật ký trao đổi cũ giữ làm lịch sử, không phải yêu cầu hiện hành.

### Luồng đặt và cập nhật giá

1. BEGIN transaction Read Committed; khóa User FOR UPDATE, kiểm tra chặn và hạn mức theo luồng đã duyệt.
2. Khóa dòng Court bằng SELECT ... FOR SHARE và đọc pricePerSlot/isActive. Cách khóa chia sẻ là chi tiết kỹ thuật mentor đề xuất để nhiều khách vẫn đặt cùng Court ở các slot khác nhau; admin UPDATE Court phải chờ khóa này.
3. Nếu sân đang nhận đặt và đủ điều kiện thời gian/hạn mức/slot, tính tổng bằng giá Court vừa đọc và lưu snapshot Booking.pricePerSlot/totalPrice cùng toàn bộ BookingSlot. Lấy thời điểm kiểm tra mới sau chờ khóa; không tin userId/giá do body tự khai.
4. Commit toàn bộ khi thành công hoặc rollback toàn bộ khi lỗi; nhả khóa khi transaction kết thúc. Không chờ người dùng hoặc cổng thanh toán trong transaction.
5. Nếu đặt lấy khóa Court trước, admin cập nhật giá/isActive chờ đến khi transaction đặt kết thúc. Booking đã commit giữ nguyên giá cũ; admin đổi giá niêm yết cho các lần đặt sau. Nếu admin UPDATE và commit trước khi đặt lấy được khóa, đặt đọc giá/trạng thái mới. Không bảo đảm mọi request đặt luôn có ưu tiên so với admin.

Ví dụ: giá 150000/slot, đặt 60 phút tổng 300000. Transaction đặt đã lấy khóa trước thì Booking.totalPrice=300000; sau commit admin có thể đổi Court.pricePerSlot=180000, để booking 60 phút tạo sau dùng tổng 360000. Tổng Booking cũ không đổi thành 360000. Cách hiểu câu người học “giá sẽ thay đổi ... 360k” là giá áp dụng cho lần đặt sau; không sửa tổng lịch sử. Đơn vị niêm yết vẫn mỗi 30 phút.

### Phạm vi và kiểm chứng còn thiếu

- Giá từ frontend/Postman không phải nguồn chuẩn; backend tự đọc/tính từ Court. Snapshot bảo vệ giá sau commit.
- Khóa Court bảo vệ giá/trạng thái trong transaction, unique BookingSlot chống tranh slot, khóa User bảo vệ hạn mức; các vai trò khác nhau.
- Thứ tự khóa dự kiến User → Court → Booking/slot; phải rà cùng các luồng hủy/admin và xử lý deadlock/retry trước triển khai. Chưa có SQL thực thi hoặc test PostgreSQL.
- Thanh toán chỉ là ví dụ giả định, chưa thuộc bản đầu; không giữ khóa qua tác động ngoài database.
- Cần test đổi giá/vô hiệu hóa và đặt ở cả hai thứ tự, rollback của admin/đặt, hai khách đặt cùng Court khác slot, giữ giá Booking cũ.
- Nguồn cơ chế: [PostgreSQL Row-Level Locks — FOR SHARE](https://www.postgresql.org/docs/current/explicit-locking.html#LOCKING-ROWS).
