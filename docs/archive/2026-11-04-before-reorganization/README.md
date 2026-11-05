# Football Booking — nhật ký thực tập Backend

Ứng dụng đặt sân bóng đá cho một cơ sở có nhiều sân. Mục tiêu là tự xây dựng, kiểm thử, triển khai và giải thích được một backend để đưa vào CV Backend intern.

**Trạng thái:** mới chuẩn bị tài liệu; chưa có ứng dụng, test, workflow CI hoặc bản deploy. Ước lượng ban đầu 30–40 giờ; cần đánh giá lại sau khi chốt phần quản lý tài khoản nhóm sân theo địa điểm và refresh token bổ sung ngày 2026-11-02.

## Bắt đầu từ đây

1. Đọc [hướng dẫn thực tập](docs/INTERNSHIP_GUIDE.md).
2. Xem [lộ trình và ticket](docs/ROADMAP.md).
3. Làm phần **Giai đoạn 0** trong [bộ câu hỏi](docs/INTERVIEW_PREP.md).
4. Gửi câu trả lời để mentor review rồi bắt đầu `FB-001`.
5. Ghi kết quả mỗi buổi vào [tiến độ](docs/PROGRESS.md).

Bạn có thể mở phiên AI bằng yêu cầu:

> Đọc AGENTS.md và tài liệu tiến độ. Hướng dẫn tôi giai đoạn 0 như một intern mới bắt đầu. Chỉ giao một bước nhỏ, chưa viết code thay tôi.

## Xuất phát điểm

- Hướng ứng tuyển: Backend intern.
- Stack quen thuộc: TypeScript, Express, Prisma, PostgreSQL, REST API, JWT, RBAC, Dockerfile, Docker Compose, Vitest và module architecture.
- Đã tự làm CRUD/auth và từng test API; có kiến thức React.
- Chưa deploy, chưa sử dụng GitHub Actions; cần học thông qua project.
- Dự kiến học thêm cách deploy thủ công lên VPS. Ngân sách VPS tối đa khoảng 200.000đ/tháng, domain tính riêng; chưa chọn hay thuê dịch vụ.

## Phạm vi bản đầu

- Một hệ thống có các sân được nhóm theo chi nhánh/địa điểm; khách chọn chi nhánh trước khi chọn sân. Mỗi chi nhánh là một địa điểm, lưu địa chỉ chung ở Branch; sân liên kết chi nhánh để khách xem địa chỉ nơi đến, không lưu lặp địa chỉ trên từng Court. Hai vai trò `CUSTOMER` và `ADMIN`, admin quản lý toàn hệ thống; chưa tách quyền theo chi nhánh. Cách lưu nhóm địa điểm chốt tại FB-002.
- Khách đăng ký/đăng nhập, gia hạn phiên bằng refresh token và đăng xuất, xem sân và slot trống, đặt sân, xem/hủy booking cá nhân.
- Admin tạo/cập nhật/vô hiệu hóa sân, xem và hủy booking toàn hệ thống; xem tài khoản khách (khách tự đăng ký) và chặn/mở chặn đặt mới. Ghi chú khách quản lý ngoài app, không có CustomerNote hoặc tích hợp app ghi chú trong bản đầu. Hệ thống giữ BookingBlockHistory để admin tra ai chặn/mở chặn, khi nào và vì sao; User chỉ giữ cờ isBookingBlocked hiện tại, không lưu trùng lý do trên User. Chặn/mở chặn do admin thực hiện thủ công, mọi lần thành công đều ghi lý do vào lịch sử cùng giao dịch cập nhật trạng thái; khách bị chặn vẫn đăng nhập, xem và hủy booking của mình trước giờ bắt đầu ít nhất 60 phút. Chặn đặt không tự hủy booking hoặc xóa lịch sử; admin hủy riêng nếu cần. Backend kiểm tra trạng thái chặn hiện hành khi tạo booking, kể cả dùng token đã cấp trước khi chặn; chỉ ẩn nút hoặc lưu cờ trong JWT là chưa đủ. Người học chốt bỏ mức khóa tài khoản tại FB-002 ngày 2026-11-02; bản đầu chỉ có hạn chế chặn đặt mới. Không tự chấm điểm/chặn vì một lần hủy đúng quy định, không dùng xóa mềm để xử phạt; xóa mềm ngoài xử phạt chưa thuộc phạm vi đã chốt.
- Mở cửa 06:00–22:00 giờ Việt Nam. Slot cơ sở dài 30 phút, bắt đầu ở phút 00 hoặc 30, từ 06:00 đến 21:30. Khách chọn giờ bắt đầu và thời lượng là 30, 60, 90 hoặc 120 phút (tối đa 120 phút mỗi booking); toàn bộ booking phải kết thúc không muộn hơn 22:00 trong cùng ngày.
- Cho đặt từ thời điểm hiện tại đến hết ngày thứ 7 tính từ hôm nay: ngày hôm nay đến hôm nay + 7 ngày theo `Asia/Ho_Chi_Minh`. Giờ bắt đầu phải nằm trong tương lai.
- Mỗi tài khoản khách được giữ tối đa 3 booking chưa hủy có giờ bắt đầu trong tương lai. Khi đã đủ 3, backend từ chối đặt thêm và không giữ slot; booking đã hủy hoặc đã bắt đầu không còn tính vào giới hạn. Kiểm tra giới hạn phải an toàn khi cùng tài khoản gửi nhiều request đồng thời. Đây là giới hạn giữ chỗ mỗi tài khoản, không giới hạn lịch sử và không tự ngăn được nhiều tài khoản. Mỗi booking tối đa 120 phút; kết hợp giới hạn 3 booking thì mỗi tài khoản giữ tối đa 360 phút chơi chưa bắt đầu, chưa hủy. Đây không phải hạn mức mỗi ngày và không tự ngăn được nhiều tài khoản.
- Khách chỉ được hủy booking còn hiệu lực của mình trước giờ bắt đầu ít nhất 60 phút, tính theo thời điểm backend xử lý. Booking 19:00 được hủy đến đúng 18:00; sau 18:00 bị từ chối và giữ nguyên booking/slot. Admin có quyền hủy riêng, không bị giới hạn 60 phút; lưu lịch sử thay vì xóa. Giao diện hiển thị hạn hủy trước khi khách xác nhận đặt. Booking tạo khi còn dưới 60 phút đến giờ bắt đầu vẫn được phép nếu đủ điều kiện đặt, nhưng khách không thể tự hủy theo hạn này.
- Nhu cầu đổi giờ trong bản đầu: khách liên hệ admin để xem xét hủy ngoại lệ, sau đó khách tự đặt lại theo luồng thông thường. Chưa có tự đổi giờ hoặc admin đặt hộ. Kiểm tra khoảng mới trước khi hủy; nếu không trống thì giữ booking cũ. Hủy rồi đặt lại là hai thao tác riêng, không bảo đảm giữ được giờ mới. Khi còn dưới 60 phút đến giờ bắt đầu, màn hình trước xác nhận đặt hiển thị: “Booking này đã qua hạn tự hủy. Vui lòng kiểm tra kỹ giờ đến.” Cảnh báo không cấm đặt nếu đủ điều kiện khác.
- Giá niêm yết theo mỗi slot 30 phút của từng sân, lưu bằng số nguyên VND và phải lớn hơn 0 (không nhận giá 0, số âm hoặc phần lẻ đồng); backend tính tổng giá = giá mỗi slot × số slot (thời lượng phút / 30), rồi lưu giá tại thời điểm đặt. Đổi giá sân không đổi booking cũ. Thiết kế FB-002 dùng PostgreSQL integer/Prisma Int: giá mỗi slot từ 1 đến 536.870.911 VND, tổng tối đa 4 slot là 2.147.483.644 VND để nằm trong miền biểu diễn. Đây là trần kỹ thuật, không phải giá bán đề xuất; chi tiết ở docs/DESIGN.md. Chưa triển khai schema/validation.
- Chốt phạm vi FB-002 ngày 2026-11-03: bảo vệ giá trong transaction đặt. Nếu transaction đặt đã khóa đọc Court trước, nó đọc giá hiện hành, tính/lưu snapshot Booking rồi commit/rollback mới nhả khóa; admin chờ khóa để cập nhật sau đó. Nếu admin cập nhật và commit trước, request đặt đọc giá mới. Không có cơ chế báo giá riêng, giữ giá từ lúc xem màn hình hoặc thời hạn 5 phút; không tin giá frontend gửi. Chưa triển khai.
- Sân vô hiệu hóa không nhận booking mới; giữ nguyên lịch sử và booking có sẵn.
- Thời điểm lưu UTC, quy tắc ngày/giờ và giao diện dùng `Asia/Ho_Chi_Minh`.
- Chỉ một booking đang hiệu lực được chiếm mỗi sân/slot cơ sở 30 phút. Booking dài chiếm các slot liên tiếp; phải đặt thành công toàn bộ hoặc không đặt slot nào. Hủy booking giải phóng toàn bộ các slot đã chiếm để đặt lại. Tranh bất kỳ slot nào trả lỗi `409` cho request thua.
- Chưa làm thanh toán, đặt cọc, tìm đối thủ, chia đội, đặt lặp lại, quản trị nhiều chủ sân hoặc phân quyền riêng theo chi nhánh, giờ linh hoạt hoặc quên mật khẩu.

### Bổ sung loại sân — 2026-11-03

Mỗi Court có loại sân 5, 7 hoặc 11, biểu thị số người mỗi đội (sân 5 là 5 người mỗi bên). Admin khai báo loại sân khi tạo/cập nhật; thông tin sân hiển thị loại để khách chọn phù hợp. Chưa quy định kích thước chiều dài/rộng hoặc tự tính giá theo loại; giá vẫn do từng Court niêm yết. Đã chốt trường Court.playersPerTeam: số nguyên bắt buộc thuộc 5/7/11, không tự mặc định; lưu trực tiếp trên Court và bảo vệ bằng validation backend/ràng buộc database khi triển khai. Chưa có schema/code.

## Công nghệ dự kiến

| Phần | Công nghệ |
| --- | --- |
| Backend | TypeScript, Express, Prisma, PostgreSQL |
| Tổ chức | Module `auth`, `courts`, `bookings` |
| Frontend | React + Vite, giao diện tối giản |
| Test | Vitest + Supertest, PostgreSQL riêng cho integration test |
| CI | GitHub Actions: kiểm tra kiểu, test, build |
| Deploy | VPS Linux, Docker Compose, Caddy và HTTPS |

Backend dùng access token JWT có thời hạn, refresh token và đăng xuất theo yêu cầu bổ sung của người học tại FB-002 ngày 2026-11-02; hash mật khẩu và kiểm tra quyền phía server. Phương án cơ bản đã duyệt: access JWT 15 phút, refresh token hạn tuyệt đối 7 ngày, rotation sau mỗi lần refresh, cookie HttpOnly và database lưu hash token riêng; logout thu hồi refresh của phiên hiện tại, access đã cấp có thể còn hiệu lực tối đa 15 phút. Chi tiết cookie/CSRF, reuse/request đồng thời, schema và API còn cần hoàn thiện trong DESIGN; chưa triển khai. Không thêm refreshToken vào User dưới dạng một token rõ; mô hình phiên/token cần thiết kế riêng.

## Cách chạy, test và demo

**Chưa thiết lập.** Không có lệnh cài đặt/chạy/test để sử dụng ở giai đoạn tài liệu. Khi có ứng dụng, cập nhật bằng các lệnh đã chạy và kiểm chứng thực tế.

## Khi nào đủ để đưa vào CV?

Có luồng đặt/hủy hoạt động, test nghiệp vụ chính, tài liệu chạy local và bằng chứng phần việc đã làm. Chỉ ghi deploy/CI khi đã thực hiện thành công. Không tự điền số người dùng, tải chịu được hoặc tỷ lệ cải thiện.

Quy tắc dành cho AI nằm trong [AGENTS.md](AGENTS.md).

### Quyết định tên sân — 2026-11-03

Đã chốt tên sân duy nhất trong mỗi chi nhánh, kể cả sân ngừng nhận đặt; khác chi nhánh được trùng tên. Chuẩn hóa khoảng trắng (bỏ đầu/cuối, gộp khoảng trắng liên tiếp) và so sánh không phân biệt hoa/thường, vẫn phân biệt dấu tiếng Việt. Giao diện xác nhận/xem booking hiển thị tên sân cùng chi nhánh để tránh nhầm. Áp dụng khi tạo/đổi tên; bản đầu không cho chuyển Court sang chi nhánh khác để tránh thay đổi địa điểm booking hiện có; khi triển khai phải bảo vệ bằng ràng buộc database theo chi nhánh và tên chuẩn hóa. Chưa có schema hoặc ràng buộc được triển khai; chi tiết tại docs/DESIGN.md.

### Sửa thông tin sân — đã duyệt 2026-11-03

Admin được sửa tên, loại sân, giá mỗi 30 phút và trạng thái nhận đặt; chỉ cập nhật các trường được gửi. Bản đầu không cho sửa branchId. Đổi giá không đổi giá lịch sử booking; ngừng nhận đặt không tự hủy booking có sẵn. Chi tiết hợp đồng PATCH tại docs/DESIGN.md; chưa triển khai.

### Quyền admin với tài khoản khách — đã duyệt 2026-11-03

Khách tự đăng ký và tự đặt mật khẩu; backend gán role=CUSTOMER và isBookingBlocked=false. Bản đầu bỏ chức năng admin tạo tài khoản khách, không có POST /admin/customers. Admin được xem khách, chặn/mở chặn đặt mới cho CUSTOMER và xem lịch sử; mỗi lần thay đổi trạng thái cần lý do và BookingBlockHistory trong cùng transaction. Chưa có admin sửa tên/email/mật khẩu, đổi role hoặc chặn ADMIN. Không bổ sung luồng lời mời/email cấp mật khẩu, đổi mật khẩu hoặc quên mật khẩu trong quyết định này. Đây là phạm vi thiết kế, chưa triển khai API.

### Gửi lại trạng thái chặn đặt — đã duyệt 2026-11-03

Nếu trạng thái CUSTOMER đã giống isBookingBlocked yêu cầu, API trả 200/changed=false, giữ nguyên và không thêm lịch sử; reason vẫn bắt buộc hợp lệ. Khi trạng thái thay đổi, trả 200/changed=true và cập nhật cờ/ghi BLOCK hoặc UNBLOCK với lý do trong cùng transaction. Quy tắc “mọi lần chặn/mở chặn thành công đều ghi lịch sử” áp dụng cho thay đổi thực sự; xác nhận trạng thái sẵn có không là lần thay đổi mới. Không cam kết dedup một retry nếu đã có thao tác đảo trạng thái xen giữa. Chưa triển khai/test.
