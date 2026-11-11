# Giai đoạn 2 — Xây dựng tính năng

[Chỉ mục học tập](../INTERVIEW_PREP.md) · Nội dung được chuyển theo giai đoạn, không nâng mức hiểu.

Các câu trả lời/nhật ký bên dưới giữ bằng chứng tại thời điểm ghi; quyết định nghiệp vụ hiện hành tra README và chỉ mục DESIGN, không triển khai theo đề xuất cũ đã bị thay thế. Chỉ đọc câu/mục cần review, không nạp toàn bộ lịch sử để bắt đầu phiên.


Liên quan: FB-004–007.

## Bàn giao tracing login — buổi sau

- **Yêu cầu người học 2026-11-11:** buổi sau trace luồng login, tiếp đến backend/tests/auth.login.test.ts, rồi giải thích backend/src/middlewares/csrf-protection.ts. Không bắt đầu giải thích ngay trong lượt bàn giao.
- Bắt đầu từ POST /auth/login trong backend/src/modules/auth/auth.routes.ts; mỗi lượt một dòng/điều kiện, dùng giá trị cụ thể trước–sau, hỏi đã hiểu/chỗ cần hỏi và chờ xác nhận. Không giảng trước toàn bộ luồng; không trace FE sâu trừ khi được yêu cầu.
- Đây là kế hoạch học, chưa có bằng chứng diễn giải độc lập và không nâng trạng thái câu hỏi. Chưa có xác nhận người học đã đăng nhập thành công trên trình duyệt.

## CSRF — cần giải thích lại khi người học yêu cầu

- **Yêu cầu người học 2026-11-11:** đồng ý gắn bảo vệ riêng cho các đường dẫn auth và yêu cầu ghi chú để khi cần mentor giải thích lại. Chưa có diễn giải độc lập; không đánh dấu đã hiểu CSRF từ lời đồng ý.
- Khi được hỏi lại, giải thích từng phần nhỏ: cookie tự gửi và CSRF là gì; APP_ORIGIN dùng làm gì; vì sao X-CSRF-Protection: 1 là header công khai; kiểm tra Origin/Referer; vì sao gắn riêng login/refresh/logout trong auth.routes.ts thay vì toàn app.ts. Dùng ví dụ cụ thể rồi chờ người học trước phần tiếp theo.
- Code để đối chiếu: backend/src/config/auth-config.ts, backend/src/middlewares/csrf-protection.ts và backend/src/modules/auth/auth.routes.ts. Register tạm miễn CSRF theo quyết định hiện hành; middleware đã gắn theo đường dẫn POST, login đã mở sau khi thêm rate limit, refresh/logout chưa có handler.

| Mã | Câu hỏi | Trạng thái |
| --- | --- | --- |
| G2-01 | Một request đặt sân đi qua những lớp nào trong ứng dụng? | Chưa học |
| G2-02 | Bạn chia module thế nào? Controller và service chịu trách nhiệm gì? | Chưa học |
| G2-03 | JWT xác thực người dùng thế nào? Quyền được kiểm tra ở đâu? | Chưa học |
| G2-04 | Làm sao ngăn khách xem hoặc hủy booking của người khác? | Chưa học |
| G2-05 | Backend kiểm tra thời gian và tính giá thế nào? Vì sao không tin giá frontend gửi? | Cần ôn |
| G2-06 | Khi API lỗi hoặc slot vừa bị đặt, giao diện phản hồi thế nào? | Cần ôn |

### Câu trả lời của người học

- G2-01:
- G2-02:
- G2-03:
- G2-04:
- G2-05: Trong bước đặc tả FB-001, người học đề xuất so sánh giá frontend gửi với giá niêm yết và trả lỗi nếu nhỏ hơn. Review 2026-11-01: đúng hướng kiểm tra phía server, nhưng chỉ chặn giá thấp hơn vẫn có thể nhận giá sai cao hơn. Mentor giải thích backend phải tự tính giá từ dữ liệu sân theo README, không lấy giá frontend làm nguồn tính tiền. Sau khi làm rõ Court là sân và courtId là mã sân, người học trả lời đúng giá booking một giờ của sân B là 250.000đ theo bảng giá database trong ví dụ. Bổ sung: người học giải thích backend có quy tắc/ràng buộc, còn frontend có thể gửi dữ liệu rác hoặc sai sự thật. Mentor: đúng lý do không tin dữ liệu đầu vào; backend thực thi quy tắc và lấy giá sân từ database, ràng buộc database hỗ trợ tính hợp lệ. Đã giải thích được phần nguồn giá; giữ Cần ôn vì chưa review đủ phần thời gian và chưa có code/test.
- Review G2-06 ngày 2026-11-03 / availability thay đổi: người học đề xuất thông báo “xin lỗi đã có người đặt trước bạn rồi vui lòng chọn sân khác hoặc giờ khác”. Đúng: nhận diện khoảng đã bị người khác đặt và hướng dẫn chọn lại, thông báo không trách khách. Còn thiếu mã lỗi và cập nhật lịch/lựa chọn; mentor bổ sung theo hợp đồng đã chốt: 409/BOOKING_SLOT_CONFLICT, rollback toàn bộ, tải lại availability, bỏ lựa chọn hết trống và yêu cầu chọn lại; không tự đổi sân/giờ hoặc tự gửi lại booking. Giữ Cần ôn vì chưa có câu trả lời độc lập cho toàn bộ luồng hoặc test.
- Bổ sung G2-06: người học yêu cầu mentor nói luôn giải pháp; mentor đã cung cấp luồng 409 → thông báo → tải lại lịch → xóa lựa chọn cũ/cập nhật màu → khóa xác nhận đến khi chọn lại hợp lệ. Đây là lời giải mentor, chưa phải câu trả lời chứng minh mức hiểu của người học.
- Bổ sung G2-06: người học đề xuất thông báo sân đang bảo trì và xin lỗi vì bất tiện. Mentor xác nhận phù hợp khi biết sân thực sự bảo trì; nếu chỉ biết sân vô hiệu hóa thì thông báo tạm ngừng nhận đặt, không suy diễn nguyên nhân. Chưa có câu trả lời về cập nhật block vừa bị người khác đặt; giữ Cần ôn.
- G2-06: Trong đặc tả FB-001, người học đề xuất làm nổi bật ngày, giờ bắt đầu–kết thúc và giá trước khi xác nhận; mentor bổ sung tên sân và tổng giá. Với slot vừa bị đặt, người học đề xuất “Rất tiếc sân đã được đặt bạn đã chậm một bước”, muốn giọng nhí nhảnh và chuyển cảm giác tiêu cực khỏi hệ thống sang sự đắn đo của khách. Người học cho rằng phần lớn từ chối do người khác nhanh tay hơn; chưa có dữ liệu để xác nhận tỷ lệ này. Review mentor: đúng phần thông báo có người đặt trước trong tình huống xung đột; không nên trách khách hoặc gán mọi lỗi cho tranh slot. README còn có điều kiện sân vô hiệu hóa, thời gian hợp lệ; phiên đăng nhập hết hạn cũng có thể chặn thao tác. Lỗi mất kết nối có thể chưa xác định được kết quả đặt. Mentor đề xuất thông báo trung tính và cập nhật lịch để chọn lại; người học chưa trả lời phần cập nhật giao diện. Chuyển Cần ôn; chưa có code/test.

### Review và bằng chứng

- Nhận xét mentor:
- Cần làm rõ / ôn lại:
- Ngày review / ôn lại:
- Bằng chứng: code, API, demo luồng; chưa có.
- **Nguyên liệu CV sau khi làm:** tính năng đã chạy và công nghệ thực sự sử dụng. Chưa nhận có cơ chế chống tranh slot cho tới khi FB-008 được kiểm chứng.
