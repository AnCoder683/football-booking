# Giai đoạn 0 — Bắt đầu

[Chỉ mục học tập](../INTERVIEW_PREP.md) · Nội dung được chuyển theo giai đoạn, không nâng mức hiểu.

Các câu trả lời/nhật ký bên dưới giữ bằng chứng tại thời điểm ghi; quyết định nghiệp vụ hiện hành tra README và chỉ mục DESIGN, không triển khai theo đề xuất cũ đã bị thay thế. Chỉ đọc câu/mục cần review, không nạp toàn bộ lịch sử để bắt đầu phiên.


Liên quan: FB-000. Trả lời trước khi viết code.

| Mã | Câu hỏi | Trạng thái |
| --- | --- | --- |
| G0-01 | Bạn muốn ứng tuyển Backend intern và muốn project này chứng minh điều gì? | Đã giải thích được |
| G0-02 | Trong REST API, Prisma, PostgreSQL, JWT, RBAC, Docker và Vitest, phần nào bạn đã tự làm? Cho ví dụ cụ thể. | Đã giải thích được |
| G0-03 | Phần nào bạn mới hiểu khái niệm hoặc còn phụ thuộc nhiều vào hướng dẫn? | Đã giải thích được |
| G0-04 | Vì sao bạn chọn bài toán đặt sân bóng đá? | Đã giải thích được |
| G0-05 | Bạn sẽ dùng AI như thế nào để vẫn hiểu và tự bảo trì code? | Cần ôn |

### Câu trả lời của người học

- G0-01: Muốn chứng minh nắm kiến thức trong phạm vi project và tự build sản phẩm nhỏ-vừa giải quyết vấn đề thực tế.
- G0-02: Có thể đọc hiểu luồng REST API, Prisma, PostgreSQL, JWT, RBAC, Docker, Vitest; ví dụ từng tự viết toàn bộ phần kiểm tra authentication, AI hướng dẫn và giải thích các giai đoạn trong luồng xác thực. Từng kiểm tra bằng Postman; hiện đa số nhờ AI kiểm tra và viết test.
- G0-03: Còn cần hỗ trợ Docker một chút; chưa biết deploy và chưa từng deploy.
- G0-04: Bài toán nhỏ, nhanh để kiểm chứng năng lực.
- G0-05: Dùng AI phân module, ghi vào một file rồi làm từng phần nhỏ để dễ quản lý. Chưa làm gì trước khi nhận code AI; nhận code rồi mới review.

### Review và bằng chứng

- Nhận xét mentor: mục tiêu và phần cần học rõ. G0-02 đã có ví dụ tự làm authentication với AI hướng dẫn; đây là kinh nghiệm người học thuật lại, chưa kiểm chứng code cũ. G0-05 chia nhỏ và review sau khi nhận code là hợp lý; cần luyện xác định hành vi mong đợi và kiểm tra test AI có bao phủ đúng hành vi đó. Code và test cùng do AI tạo có thể cùng bỏ sót một yêu cầu.
- Cần làm rõ / ôn lại: G0-05 tiếp tục luyện trong ticket thực tế. Gợi ý mentor: trước khi giao phần code, nêu đầu vào/kết quả mong đợi; sau khi nhận, đọc code/test, tự chạy và giải thích ít nhất một trường hợp bị từ chối. Đây chưa phải cam kết hoặc kỹ năng đã được người học xác nhận.
- Ngày review / ôn lại: 2026-10-31; đã review bổ sung. Tự đánh giá đủ để bắt đầu FB-001; còn chờ người học xác nhận hiểu cách kiểm chứng trước khi chốt DONE FB-000.
- Bằng chứng: câu trả lời trong chat về mục tiêu, authentication, Postman và cách dùng AI. Không có code/test cũ để xác minh; trạng thái giai đoạn 0 không xác nhận thành thạo kỹ thuật ở giai đoạn sau.
- **CV:** chưa mô tả project như sản phẩm đã hoàn thành.
