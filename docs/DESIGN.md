# Thiết kế dữ liệu và API — chỉ mục FB-002

**Trạng thái: IN_REVIEW.** Đã có lượt review G1-04–06, chờ xác nhận cuối phần chính; auth còn mở bàn giao FB-004 và thứ tự khóa hợp nhất cần chốt trước triển khai liên quan. Đây là thiết kế, chưa có ứng dụng/schema/migration/test. Phạm vi nghiệp vụ theo [README](../README.md) và [REQUIREMENTS](REQUIREMENTS.md). Không đọc toàn bộ các chương đầu mỗi phiên: chọn đúng chủ đề bên dưới.

## Điểm dừng hiện tại

- Đã tiếp tục phiên và tạo [bản review tổng hợp FB-002](design/fb-002-review.md): ERD đủ bảy bảng, bảng quy ước/ràng buộc, ba mô phỏng nghiệp vụ và các nhóm quyết định còn mở. Chưa có phản hồi duyệt mới; phần đa tab vẫn còn mở.

- Đã duyệt UUID, ON DELETE cho chín FK, ON UPDATE RESTRICT và [timestamptz(3) cho các trường thời điểm](design/constraints.md#time-type).
- Người học đã tiếp tục phiên và đồng ý kiểu thời gian và required/nullable/default cho các trường, gồm bốn default DB CUSTOMER/false/true/CONFIRMED; chưa kiểm chứng mức hiểu qua code/demo.
- Đã duyệt nhóm ràng buộc thời gian/trạng thái và phân chia CHECK–transaction–validation tại [ràng buộc](design/constraints.md).
- CHECK giá/enum/unique đã duyệt; index hỗ trợ truy vấn chỉ dự kiến, cần demo rồi quyết định khi triển khai.
- Kiểu cột ngoài thời gian đã duyệt: text/boolean, familyId uuid, playersPerTeam integer + CHECK.
- Đã chọn familyId thay chain, giữ bảng RefreshToken; hướng khóa User cho auth đã duyệt; SQL/test còn thiếu.
- Hợp đồng cơ bản POST /auth/refresh và không tự retry khi timeout/mất phản hồi đã duyệt; bảng lỗi 403/5xx/logout lỗi đã duyệt, đa tab và xóa cookie trên lỗi còn mở.
- Refresh đã đổi sang hạn trượt 7 ngày từ mỗi lần cấp mới, thay hạn cố định từ đăng nhập; xem auth.md.
- Refresh hết hạn: đã chốt 401/REFRESH_TOKEN_EXPIRED → yêu cầu đăng nhập lại; thay mã UNAUTHENTICATED cũ riêng nhánh hết hạn.
- Token sai/thu hồi: đã chốt 401/UNAUTHENTICATED → yêu cầu đăng nhập lại, không refresh lặp.
- Người học đã hình dung trace Web Lock A refresh trước → B logout chờ; chưa duyệt toàn bộ logout đa tab.
- Điều chỉnh bàn giao sau phản hồi “Okay”: chuyển auth còn mở sang chốt qua demo trước code tương ứng ở FB-004; xem ROADMAP. Không coi giao thức đã duyệt/hoàn tất. Bước tiếp theo: review G1-04–06 bằng câu trả lời thực tế của người học; thứ tự khóa hợp nhất vẫn cần chốt trước triển khai liên quan.

## Đọc theo chủ đề

| Cần làm | Tài liệu | Trạng thái chính |
| --- | --- | --- |
| ERD cốt lõi, trường dữ liệu, giá lịch sử | [Mô hình](design/data-model.md) | Bộ trường/nghiệp vụ đã review; ERD đầy đủ bảy bảng còn hoàn thiện |
| ID, ON DELETE/UPDATE, kiểu thời gian | [Ràng buộc](design/constraints.md) | UUID/FK/timestamptz(3) đã duyệt; required/nullable/default đã duyệt; CHECK/enum/unique đã duyệt; kiểu cột đã duyệt; SQL và index truy vấn còn hoàn thiện |
| Slot hiệu lực, hủy/đặt lại, SQL chống trùng | [BookingSlot](design/booking-slots.md) | Đã chọn releasedAt và partial unique index, chưa có migration/test |
| Hạn mức 3, giá/trạng thái sân đồng thời | [Transaction](design/transactions.md) | Đã chốt hướng; thứ tự khóa chung/SQL/test còn mở |
| Khung success/error/validation | [Response chung](design/api-common.md) | Đã duyệt khung; logout 204 là ngoại lệ không JSON |
| Tạo/xem/hủy booking, admin booking | [API booking](design/api-bookings.md) | Hợp đồng đã duyệt theo từng mục; chưa triển khai |
| Chi nhánh, sân, availability, admin sân | [API sân](design/api-courts.md) | Đã duyệt hợp đồng, query/validation/quyền |
| Xem khách, chặn/mở, lịch sử | [API khách](design/api-customers.md) | API đã duyệt; concurrency chi tiết còn mở |
| Register/login/me/refresh/logout, cookie/CSRF | [Auth](design/auth.md) | Có phần đã duyệt và phần đề xuất; xem bảng trạng thái đầu chương |

## Các quyết định cần nhớ

- Booking dài chiếm đủ 1–4 slot 30 phút; tạo/hủy nguyên tử. Database bảo vệ slot hiệu lực, xung đột 409; kiểm tra trống trước không thay unique index.
- Không tạo sẵn các slot trống. releasedAt=null là còn giữ chỗ; hủy giữ dòng lịch sử, đặt lại tạo dòng mới.
- Snapshot giá được chốt trong transaction đọc Court; không có quote/TTL hoặc giữ khóa qua thanh toán. Bản đầu chưa có thanh toán.
- Chỉ chặn đặt mới, không khóa đăng nhập; lý do ở BookingBlockHistory, không ở User. Không admin tạo khách, không thêm xóa tài khoản/soft delete.
- Khách xem danh sách sân hoạt động; admin bỏ isActive vẫn xem tất cả. Vô hiệu hóa không tự hủy booking.
- Access JWT 15 phút, refresh hạn trượt 7 ngày từ lần cấp mới/rotation/hash. Reuse thu hồi nhóm phiên; access đã cấp có thể còn hạn. Cookie/CSRF đã duyệt; không suy ra mọi lỗi/đa tab đã giải quyết.

## Còn để nghiệm thu FB-002

1. Tổng hợp ERD đủ bảy bảng, kiểu cột/required/nullable/default/unique/CHECK/index và thứ tự khóa nhất quán; không hỏi lại lựa chọn đã duyệt.
2. Theo điều chỉnh bàn giao 2026-11-04, chuyển auth còn mở sang FB-004, chốt qua demo trước code từng luồng. Giữ rõ các phần chưa duyệt; thứ tự khóa hợp nhất phải chốt trước triển khai liên quan. Không coi việc chuyển giao là đã hoàn thiện giao thức.
3. Mô phỏng ba tình huống FB-001 bằng dữ liệu mẫu và review G1-04–06/xác nhận hiểu phần chính. Không biến Cần ôn thành yêu cầu thuộc toàn bộ lý thuyết.

Không yêu cầu có ứng dụng/test chạy để hoàn tất ticket thiết kế; khi triển khai sau đó phải có bằng chứng PostgreSQL thật và test đồng thời.

## Tra lịch sử khi cần

[Bản nguyên gốc đầy đủ](archive/2026-11-04-before-reorganization/docs/DESIGN.md) giữ cả các phương án đã thay thế và lý do trao đổi. [Bản đồ di chuyển](archive/2026-11-04-before-reorganization/REORGANIZATION.md) chỉ nơi đọc từng mục. Mục đã duyệt/chưa duyệt trong chỉ mục và chương hiện hành có ưu tiên hơn câu “bước tiếp theo” cũ trong lịch sử.
