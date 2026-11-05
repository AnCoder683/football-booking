# Giai đoạn 2 — Xây dựng tính năng

[Chỉ mục học tập](../INTERVIEW_PREP.md) · Nội dung được chuyển theo giai đoạn, không nâng mức hiểu.

Các câu trả lời/nhật ký bên dưới giữ bằng chứng tại thời điểm ghi; quyết định nghiệp vụ hiện hành tra README và chỉ mục DESIGN, không triển khai theo đề xuất cũ đã bị thay thế. Chỉ đọc câu/mục cần review, không nạp toàn bộ lịch sử để bắt đầu phiên.


Liên quan: FB-004–007.

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
