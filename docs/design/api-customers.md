# API quản trị khách và lịch sử chặn

[Chỉ mục thiết kế](../DESIGN.md) · Cập nhật 2026-11-04 · Chưa có code/migration/test.

Chỉ chặn đặt mới; không khóa đăng nhập. Khách tự đăng ký, không có POST /admin/customers. API đã duyệt; chi tiết phối hợp request đồng thời còn review tại mục riêng.

## Hạn chế tài khoản — đã chốt chỉ chặn đặt mới 2026-11-02

- Người học chủ động phản biện mức khóa dư với nhu cầu bản đầu, sau xem xét đã chốt chỉ chặn đặt mới. Khung User đã bỏ các trường dành cho khóa; không có API hoặc nút khóa/mở khóa tài khoản.
- Chặn ngăn tạo booking mới, giữ đăng nhập/xem/hủy hợp lệ, booking và lịch sử. Admin hủy booking riêng nếu cần; mở chặn cho phép đặt mới khi thỏa các điều kiện khác.
- Kiểm tra chặn ở backend tại thời điểm tạo booking có hiệu lực với token cũ; cần kiểm thử khách đăng nhập trước khi bị chặn, sau đó đặt mới bị từ chối nhưng xem/hủy hợp lệ vẫn được. Cách xử lý request đặt đồng thời với thao tác chặn cần thiết kế rõ, chưa coi đã giải quyết bằng một cờ.
- Giữ giới hạn 3 booking tương lai và 120 phút/booking. Không thêm tự chặn, chấm điểm, soft-delete hoặc tình huống tài khoản bị chiếm quyền thành yêu cầu mới.
- Đây là thay đổi có chủ đích sau nghiệm thu FB-001; README/REQUIREMENTS/ROADMAP đã đồng bộ. Các câu trả lời và nhật ký cũ về hai hạn chế giữ làm lịch sử, không còn là chính sách hiện hành.

## API admin danh sách khách — GET /admin/customers (đã duyệt 2026-11-03)

- Chỉ ADMIN; 401/UNAUTHENTICATED nếu thiếu/sai/hết hạn token, 403/FORBIDDEN nếu không phải ADMIN; xác thực/quyền trước validation query. Chỉ lấy User.role=CUSTOMER, không liệt kê ADMIN.
- Query tùy chọn isBookingBlocked, chỉ chuỗi true/false; không gửi thì lấy cả khách bị chặn và không bị chặn đặt mới.
- page mặc định 1, limit mặc định 10/tối đa 50, số nguyên dương; sắp createdAt DESC, id DESC. Chưa thêm tìm kiếm tên/email ở bước này.
- 200/success=true/message="Lấy danh sách khách thành công", data array gồm id/name/email/isBookingBlocked/createdAt (UTC), meta {page,limit,total,totalPages}. total đếm CUSTOMER sau bộ lọc, totalPages=ceil(total/limit); rỗng hoặc trang vượt phạm vi trả data=[].
- Không trả passwordHash/token, không thêm lý do chặn trên User; tra lịch sử chặn qua API riêng sau đó.
- Query sai trả 400/VALIDATION_ERROR/details. Người học xác nhận “Ok.” cho hợp đồng danh sách khách. Chưa triển khai/test.

## Tạo tài khoản khách — quyết định phạm vi cập nhật 2026-11-03

- Người học hỏi mật khẩu khi admin tạo khách. Mentor nêu bất tiện admin biết mật khẩu trong khi bản đầu chưa có đổi mật khẩu, khuyên lấy khách tự đăng ký làm luồng chính. Người học yêu cầu làm theo đề xuất; áp dụng phương án khách tự đăng ký và bỏ chức năng admin tạo khách trong bản đầu.
- Bỏ POST /admin/customers cùng body/response/lỗi từng đề xuất cho endpoint này. Các phê duyệt trước về admin tạo khách đã được thay thế, không phải chức năng cần triển khai.
- Khách tự nhập name/email/password khi đăng ký; backend gán CUSTOMER và isBookingBlocked=false, sinh id/timestamps, hash mật khẩu; không nhận role/passwordHash/trạng thái chặn do client tự gán. Validation và hợp đồng đăng ký đã duyệt, xem auth.md.
- Không thêm cấp/gửi mật khẩu, email lời mời, bắt buộc đổi mật khẩu, đổi mật khẩu hoặc quên mật khẩu trong quyết định này. Admin ban đầu vẫn tạo qua seed theo cấu hình khi đến ticket liên quan.
- Admin vẫn được xem CUSTOMER, chặn/mở chặn đặt mới và tra lịch sử; không sửa tên/email/mật khẩu/role hoặc chặn ADMIN. Các hợp đồng GET /admin/customers và API booking-block/history đã duyệt giữ hiệu lực.
- Chưa có code/schema/test; đây là thay đổi phạm vi tài liệu.

## API admin chặn/mở chặn đặt — hợp đồng API đã duyệt, còn chi tiết concurrency

- Đã duyệt 2026-11-03: PATCH /admin/customers/:customerId/booking-block, chỉ ADMIN; đích phải là tài khoản CUSTOMER.
- Body chỉ gồm isBookingBlocked (boolean bắt buộc, true để chặn/false để mở) và reason (string bắt buộc, trim không rỗng). Không nhận role/name/email/password/actorId hoặc field thừa.
- Backend lấy actorId từ danh tính admin đã xác thực, action=BLOCK khi chuyển sang true và UNBLOCK khi chuyển sang false; cập nhật cờ và thêm BookingBlockHistory nguyên tử. Không lưu reason trên User.
- Khách vẫn đăng nhập/refresh/xem/hủy hợp lệ; booking hiện có không tự hủy. Tạo booking phải đọc trạng thái hiện hành, không chỉ dựa JWT cũ.
- Người học xác nhận “Ok.” cho endpoint/body/quyền và cập nhật cờ/lịch sử nguyên tử. Trạng thái đã giống yêu cầu được duyệt bên dưới; response chi tiết/lỗi và reason 1–500 đã được duyệt; concurrency còn review/kiểm chứng. Chưa triển khai/test.

### Trạng thái đã giống yêu cầu — đã duyệt 2026-11-03

- Nếu trạng thái hiện tại khác isBookingBlocked yêu cầu: cập nhật và thêm một dòng BLOCK/UNBLOCK với reason trong cùng transaction; 200 với data {id,isBookingBlocked,changed:true}.
- Nếu trạng thái đã giống yêu cầu: 200 với data {id,isBookingBlocked,changed:false}, message="Trạng thái chặn đặt đã đúng yêu cầu"; không update User/updatedAt và không thêm lịch sử. Đây là xác nhận trạng thái, không ghi nhận một lần chặn/mở chặn mới; reason vẫn phải hợp lệ nhưng không lưu cho thao tác không đổi trạng thái.
### Phối hợp request đồng thời — đề xuất còn cần review/kiểm chứng

- Đề xuất transaction khóa dòng User đích trước khi đọc trạng thái/so sánh, phối hợp với khóa User của đặt booking; hai request cùng đặt một trạng thái khi không có thao tác xen giữa chỉ tạo một sự kiện thay đổi.
- Không cam kết nhận diện mọi retry: nếu đã có thao tác đảo trạng thái xen giữa, request đặt trạng thái lại có thể là thay đổi mới. Chưa thêm idempotency key/version. Hai admin gửi trạng thái đối nghịch xử lý theo thứ tự lấy khóa, lịch sử ghi mỗi thay đổi thực sự; cần review/kiểm chứng riêng.
- Người học xác nhận “Ok.” cho bảng hành vi trạng thái và 200/changed=true hoặc false, reason vẫn hợp lệ. Quy tắc mọi lần chặn/mở chặn thành công ghi lịch sử áp dụng cho thay đổi thực sự, không cho xác nhận trạng thái đã đúng. Phối hợp request đồng thời ở trên vẫn là đề xuất, chưa có code/database để test.

### Response/lỗi và độ dài lý do — đã duyệt 2026-11-03

- 200, success=true, data {id,isBookingBlocked,changed}; message theo thao tác: "Chặn đặt sân thành công", "Mở chặn đặt sân thành công" hoặc "Trạng thái chặn đặt đã đúng yêu cầu" khi changed=false.
- Đã duyệt reason sau trim dài 1–500 ký tự, không gộp khoảng trắng bên trong.
- 400/VALIDATION_ERROR/details nếu customerId sai định dạng, body thiếu/sai/null/thừa hoặc reason không hợp lệ.
- 404/CUSTOMER_NOT_FOUND nếu ID đúng định dạng nhưng không có CUSTOMER tương ứng, gồm trường hợp ID thuộc ADMIN; không thay trạng thái/ghi lịch sử.
- 401/UNAUTHENTICATED nếu thiếu/sai/hết hạn token; 403/FORBIDDEN nếu người gọi không phải ADMIN. Xác thực/quyền trước validation và tra tài khoản đích.
- Chưa triển khai/test; không trả reason/lịch sử trong data cập nhật trạng thái, tra qua API lịch sử riêng.

Người học xác nhận “Ok.” cho response data id/isBookingBlocked/changed, các lỗi 400/404/401/403, thứ tự xác thực → quyền ADMIN → đầu vào → tài khoản đích → xử lý trạng thái/lịch sử và giới hạn reason 1–500 ký tự. Chưa triển khai/test.

## API admin lịch sử chặn đặt — đã duyệt 2026-11-03

- GET /admin/customers/:customerId/booking-block-history, chỉ ADMIN; khách không được xem lịch sử/lý do nội bộ.
- Validate customerId, page/limit; xác thực/quyền trước validation/tra đích. Đích phải là CUSTOMER; ID đúng định dạng nhưng không tồn tại hoặc thuộc ADMIN trả 404/CUSTOMER_NOT_FOUND.
- page mặc định 1, limit mặc định 10/tối đa 50, số nguyên dương. Sắp createdAt DESC rồi id DESC để phân trang có thứ tự ổn định; thứ tự phụ này không cam kết suy ra thứ tự transaction khi timestamp trùng. Chưa thêm bộ lọc action/date.
- 200/success=true/message="Lấy lịch sử chặn đặt thành công", data array gồm id/action/reason/createdAt (UTC)/actor {id,name}, meta {page,limit,total,totalPages}. actor là ADMIN đã thực hiện, thông tin tên hiện hành, không thêm snapshot tên hoặc email/hash/token.
- Chỉ lấy BookingBlockHistory.userId=customerId. total đếm lịch sử của khách đó, totalPages=ceil(total/limit); khách tồn tại chưa có lịch sử hoặc trang vượt phạm vi trả data=[].
- ID/query sai trả 400/VALIDATION_ERROR/details; xác thực sai 401/UNAUTHENTICATED, người gọi không phải ADMIN 403/FORBIDDEN. Không có API sửa/xóa lịch sử. Chưa triển khai/test.

Người học hỏi mục đích tra lịch sử; mentor giải thích dùng để biết ai chặn/mở chặn, khi nào và vì sao, trong khi User chỉ giữ trạng thái hiện tại. Người học xác nhận “À Ok hiểu rồi chốt đi.”, ghi duyệt hợp đồng API trên; chưa có câu trả lời giải thích độc lập hoặc code/test.
