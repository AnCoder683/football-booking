# Hướng dẫn làm việc như intern

Bạn là người chịu trách nhiệm sản phẩm và hiểu code. AI đóng vai mentor/reviewer. Mục tiêu mỗi buổi là hoàn thành một bước có bằng chứng và giải thích được nó.

## Buổi đầu tiên: FB-000

1. Đọc README, không cài thêm công nghệ ở bước này.
2. Mở [câu hỏi giai đoạn 0](learning/stage-0.md); [chỉ mục học tập](INTERVIEW_PREP.md) dẫn tới các giai đoạn khác.
3. Trả lời năm câu bằng ví dụ thực tế, có thể trả lời “chưa biết/chưa làm”. Không cần diễn đạt như bài phỏng vấn hoàn chỉnh.
4. Gửi câu trả lời cho mentor hoặc ghi vào vùng trả lời của file để được review.
5. Sau review, cập nhật tiến độ và chuyển sang FB-001.

**Đầu ra cần gửi:** câu trả lời G0-01 đến G0-05. Chưa cần repository GitHub, VPS hoặc code.

## Buổi tiếp theo: FB-001

Thời gian dự kiến 45–60 phút. Viết đặc tả bằng ngôn ngữ tự nhiên trước, chưa cần Prisma schema.

1. Liệt kê quyền của khách và admin.
2. Mô tả một lần đặt sân: khách chọn gì, server kiểm tra gì, dữ liệu nào được lưu, khách thấy kết quả gì.
3. Mô tả việc hủy lịch và các trường hợp phải từ chối.
4. Viết ít nhất ba ví dụ có dữ liệu thời gian cụ thể, gồm hai khách đặt cùng sân/cùng slot. Kết quả mong đợi phải rõ.
5. Đối chiếu README rồi gửi mentor review. Khi thực hiện ticket, lưu thành `docs/REQUIREMENTS.md`.

**Tự kiểm tra:** người khác đọc có thể biết khi nào booking được chấp nhận và khi nào bị từ chối không?

## Nhịp làm việc mỗi buổi

### Đầu buổi — khoảng 5 phút

- Đọc PROGRESS, chọn ticket đủ điều kiện và một đầu ra vừa sức trong buổi.
- Nêu cách định làm, phần chưa chắc và điều cần kiểm chứng.
- Không nhận nhiều tính năng cùng lúc. Có thể chia một ticket thành nhiều buổi.

### Trong buổi

1. Xác định một hành vi và ví dụ đầu vào/kết quả.
2. Tự phác thảo phương án; nhờ AI review nếu cần.
3. Thực hiện thay đổi nhỏ, đọc diff và chạy kiểm tra phù hợp.
4. Nếu sai, thu thập bằng chứng rồi đặt giả thuyết; thay một yếu tố để kiểm tra.
5. Trước khi nhận code từ AI, giải thích được nó thay đổi hành vi gì và vì sao cần.

Nếu mắc khoảng 20–30 phút mà không có thêm thông tin, báo vướng mắc thay vì thử ngẫu nhiên liên tục. Không phải đợi đủ thời gian khi lỗi liên quan dữ liệu hoặc server.

### Cuối buổi — khoảng 10 phút

- Demo/check kết quả theo tiêu chí ticket, ghi kiểm tra chưa thực hiện.
- Tự đọc diff để tìm code thừa, log debug, secret hoặc thay đổi ngoài phạm vi.
- Gửi mentor review; trả lời vài câu gắn với phần vừa làm.
- Cập nhật PROGRESS, ghi câu cần ôn và đề xuất một bước tiếp theo.
- Khi đã có Git, lưu thay đổi bằng commit có ý nghĩa sau khi review; không đưa secret vào Git.

## Mẫu báo cáo và PR

### Báo cáo ngắn

```text
Ticket:
Đã làm:
Đã kiểm tra / bằng chứng:
Tiếp theo:
Đang vướng: (không có thì ghi không)
```

### Khi cần giúp debug

```text
Ticket / mục tiêu:
Mong đợi:
Thực tế:
Các bước tái hiện:
Thông báo lỗi đã che secret:
Đoạn code liên quan:
Giả thuyết và kiểm tra đã thử:
```

### Mô tả PR khi đã dùng GitHub

```text
Vấn đề / yêu cầu:
Hành vi sau thay đổi:
Cách kiểm tra và kết quả:
Ảnh/demo nếu hữu ích:
Giới hạn / phần cần reviewer chú ý:
Ticket:
```

## Làm cùng AI

### Trước khi viết code

> Tôi đang làm ticket […]. Tôi hiểu yêu cầu là […] và định làm […]. Hãy chỉ ra thiếu sót, giải thích tradeoff và đề xuất bước nhỏ đầu tiên. Chưa viết code.

### Khi muốn tự viết

> Chỉ gợi ý cho bước […], không đưa lời giải hoàn chỉnh. Cho tôi tiêu chí kiểm tra và chờ tôi gửi kết quả.

### Khi muốn AI triển khai một phần

> Hãy triển khai phần […] trong ticket […]. Giữ kiến trúc hiện tại, giải thích trước khi thêm dependency. Sau đó nêu thay đổi, kiểm tra thực sự đã chạy và những điều tôi cần hiểu.

### Khi debug

> Đây là mong đợi, thực tế, bước tái hiện và log đã che secret: […]. Hãy đề xuất nguyên nhân cùng phép kiểm tra phân biệt chúng trước khi sửa.

### Khi review

> Review theo tiêu chí ticket […]. Kiểm tra lỗi nghiệp vụ, quyền truy cập và test. Chọn ba câu hỏi liên quan để kiểm tra xem tôi có hiểu code không; chờ tôi trả lời trước khi cho đáp án.

AI có thể sai hoặc đề xuất quá mức cần thiết. Khi gặp một khái niệm mới, yêu cầu ví dụ nhỏ và đối chiếu với hành vi đang chạy. Không chấp nhận một giải pháp chỉ vì code chạy lần đầu.

## Khi học GitHub Actions và deploy

- Học CI qua workflow của chính project: sự kiện kích hoạt → môi trường runner → các bước kiểm tra → log.
- Trước mỗi lệnh mới hỏi: chạy trên local, runner hay VPS? Thay đổi gì? Dấu hiệu thành công là gì? Có ảnh hưởng dữ liệu/dịch vụ khác không?
- Deploy thủ công trước để hiểu image, cấu hình, migration, reverse proxy, DNS/HTTPS và log.
- Chưa thuê VPS ở giai đoạn đầu. Khi đến FB-011, kiểm tra giá hiện tại, ngân sách và domain trước khi phát sinh phí.
- Không gửi `.env`, mật khẩu, private key hoặc token. Che secret trong ảnh/log. Dùng cấu hình mẫu khi nhờ review.
- Không dùng DB production để chạy test/reset, không xóa volume để sửa lỗi, không restore đè dữ liệu đang dùng khi chưa có kế hoạch.

## Review kiến thức và CV

Mỗi chặng dùng bộ câu hỏi tương ứng; chưa cần trả lời phần chưa học. Mentor đánh giá đúng/thiếu/cần sửa, người học cập nhật bằng lời của mình và gắn bằng chứng.

Ticket hoàn thành chức năng có thể chờ ở `IN_REVIEW`. Câu hỏi còn cần ôn được ghi riêng để ôn lại; không biến việc học thành thi thuộc đáp án.

Khi viết CV, dùng cấu trúc: **đã xây gì + giải quyết vấn đề nào + bằng cách nào + bằng chứng nếu có**. Chỉ ghi CI/deploy sau khi thực hiện thật, không tự thêm số liệu hoặc gọi app là phục vụ production nếu chỉ có demo.
