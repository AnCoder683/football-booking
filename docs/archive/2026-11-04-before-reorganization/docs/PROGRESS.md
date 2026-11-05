# Tiến độ thực tập

## Trạng thái hiện tại

- **Cập nhật:** 2026-11-04.
- **Giai đoạn:** phân tích và thiết kế dữ liệu/API.
- **Ticket hiện tại:** FB-002 — IN_PROGRESS, dừng buổi theo yêu cầu người học ngày 2026-11-04. Đã duyệt UUID, ON DELETE cho chín FK hiện có và ON UPDATE RESTRICT; đã tiến thêm auth/cookie-CSRF và ERD cốt lõi. Kiểu cột timestamptz(3) mới là đề xuất chưa duyệt; còn ràng buộc/schema chi tiết, phần auth còn mở và nghiệm thu thiết kế. FB-001 DONE; FB-000 IN_REVIEW. Chưa triển khai ứng dụng.
- **Đã có:** bộ tài liệu chuẩn bị học tập, không phải sản phẩm đã triển khai.
- **Chưa có:** ứng dụng, test, CI, VPS/domain đã xác minh hoặc demo.
- **Vướng mắc:** chưa ghi nhận; cấu hình máy, GitHub và server sẽ kiểm tra khi đến ticket liên quan.
- **Bước tiếp theo khi quay lại:** review đề xuất timestamptz(3) cho các trường thời điểm, giữ UTC/API Z và Asia/Ho_Chi_Minh như quy tắc đã có. Dừng tại đây, không giao thêm việc trong lúc nghỉ; chưa có schema/migration/test.

## Ước lượng còn lại — cập nhật 2026-11-03

Dự báo hiện tại 50–80 giờ học/làm tập trung để hoàn tất cả bản đầu, CI, deploy thủ công, tài liệu/demo và CV/mock interview. Giữ khoảng dự báo đã trao đổi ngày 2026-11-02 vì chưa có giờ thực tế hoặc bằng chứng chạy local để hiệu chỉnh; không lấy số ticket hoàn thành làm tỷ lệ công sức. Ước lượng ban đầu 30–40 giờ trước mở rộng phạm vi không còn là cơ sở lịch hiện tại.

Sau buổi review API ngày 2026-11-03, giữ khoảng 50–80 giờ vì chưa có log giờ thực tế, code chạy hoặc dữ liệu tốc độ triển khai để hiệu chỉnh. Đã tiến thêm trong FB-002 (booking/chi nhánh/sân), nhưng availability, auth chi tiết, API quản trị sân/tài khoản/lịch sử chặn, ERD đầy đủ/kiểu ID/ràng buộc/thứ tự khóa và mô phỏng nghiệm thu vẫn còn. Đây là dự báo còn lại cho phạm vi hiện hành gồm playersPerTeam, không phải phép trừ số giờ đã học hoặc tỷ lệ ticket. Mốc có luồng local cơ bản sau FB-007 dự báo 23–35 giờ (FB-002 + FB-003–007), chưa bao gồm nghiệm thu chống trùng/test/CI/deploy đầy đủ.

| Phần còn lại | Giờ dự báo |
| --- | --- |
| Hoàn thiện FB-002, review API và auth chi tiết | 3–5 |
| FB-003–007: môi trường local, backend và UI tối giản | 20–30 |
| FB-008–009: chống trùng, integration test và sửa lỗi | 8–12 |
| FB-010–013: CI, VPS, HTTPS, cập nhật và backup/restore | 10–18 |
| FB-014–015: tài liệu, demo, CV và mock interview | 4–6 |
| Dự phòng lỗi môi trường và phần cần học thêm | 5–9 |
| **Tổng** | **50–80** |

Theo lịch 5 buổi/tuần: 2 giờ/buổi khoảng 5–8 tuần; 3 giờ/buổi khoảng 4–6 tuần (làm tròn để sắp lịch). Không gồm thời gian chờ mua/cấp VPS, domain, phản hồi hoặc ngày nghỉ. Giả định giữ scope hiện hành, không thêm thanh toán, báo giá/TTL hoặc kiến trúc mới. Cần ước lượng lại sau FB-003 và auth có bằng chứng chạy/test.

## Bàn giao phiên sau

### Điểm dừng mới nhất — kết thúc buổi 2026-11-04

- Người học yêu cầu “Dừng lại tại đây đi.”. Dừng mở thêm thiết kế hoặc giao bài. FB-002 vẫn IN_PROGRESS, chưa nghiệm thu/DONE.
- Đã chốt: UUID cho PK/FK; ON DELETE RESTRICT cho Court → Branch, Booking/BookingSlot → Court, bốn liên kết lịch sử → User và FK kép BookingSlot → Booking; ON DELETE CASCADE cho RefreshToken → User; ON UPDATE RESTRICT cho chín FK hiện có. Bảng tổng hợp ở DESIGN.
- Đã tiến thêm trong buổi: luồng logout/204/lặp, chính sách cookie/CSRF, hướng refresh trong tab/nhiều tab; ERD cốt lõi và ví dụ slot. Chi tiết lỗi auth/concurrency/response cũ/fallback vẫn còn mở; không suy ra mọi phần đã duyệt hoặc hiểu. Bảng xử lý lỗi vẫn là đề xuất.
- Điểm chờ hiện tại duy nhất: timestamptz(3) cho các trường thời điểm. Mentor đã giải thích ví dụ UTC/giờ Việt Nam; người học chưa duyệt, yêu cầu dừng. Khi quay lại chỉ review đề xuất này trước.
- Yêu cầu hướng dẫn đã lưu: khi code auth cần demo Promise/Web Locks/BroadcastChannel bằng hai tab; khi code booking cần quan sát DB trước/sau đặt–hủy–đặt lại và test tranh slot. Không ép thuộc lỗi auth trước task độc lập; hoàn thiện quyết định cần thiết trước code luồng liên quan.
- Chưa có app/schema/migration/DB test/CI/deploy hoặc Git repository sử dụng được theo kiểm tra buổi này. Bằng chứng hiện tại là đọc/ghi/đối chiếu tài liệu và tham khảo nguồn chính thức; không coi ví dụ là test đã chạy. Chưa commit/push.
- Các điểm bàn giao phía dưới là lịch sử hoặc hướng dẫn cho lúc triển khai, không phải việc cần làm trong lúc nghỉ.

### Lưu ý hướng dẫn BookingSlot khi code — yêu cầu người học 2026-11-04

- Người học yêu cầu nhìn trực quan vì còn chưa rõ truy vấn khi chưa có record, thời điểm tạo BookingSlot và phân biệt slot lịch sử/slot đang giữ chỗ. Không mặc định đã hiểu chỉ từ giải thích bằng chữ.
- Khi triển khai đặt/hủy (FB-006, kiểm chứng chống trùng FB-008), dùng database local/test và dữ liệu minh họa: xem bảng chưa có slot; gửi request đặt; xem một Booking và các BookingSlot mới; hủy để thấy releasedAt đổi; đặt lại để thấy dòng mới và lịch sử cũ cùng tồn tại.
- Mỗi bước cho xem request, truy vấn/kết quả và các dòng DB trước/sau, dùng đúng ngày/giờ cụ thể và phân biệt UTC/giờ Việt Nam. Không tạo sẵn toàn bộ slot trống. Sau luồng cơ bản mới thử hai request đồng thời để thấy vai trò unique index/rollback/409.
- Đây là kế hoạch hướng dẫn, chưa phải demo hoặc test đã chạy; không dùng DB production hoặc reset dữ liệu để minh họa.

### Lưu ý hướng dẫn khi triển khai auth — yêu cầu người học 2026-11-04

- Người học thấy phần lỗi refresh/logout rối và muốn quan sát khi code. Dời việc giải thích/review chi tiết sang demo thực tế; không ép học thuộc trước task độc lập. Bảng lỗi trong DESIGN vẫn chưa duyệt, phải chốt trước khi triển khai luồng liên quan.
- Phần Promise single flight/Web Locks/BroadcastChannel còn mới với người học. Khi code FB-004 và FE auth liên quan, dành thời gian giải thích từng cơ chế trước khi triển khai, không đưa trọn giải pháp để người học chỉ sao chép.
- Dùng ví dụ hai tab; quan sát AT trong bộ nhớ từng tab và refresh cookie chung mà không log/lộ token. Hướng dẫn từng bước gom request trong một tab, khóa giữa tab, rồi thông báo logout/dọn trạng thái và bỏ qua response cũ.
- Kiểm chứng trên browser thật: refresh đồng thời, logout khi refresh, tab đang chờ; giải thích kết quả mong đợi và cùng người học review. Các kiểm tra này chưa chạy; mức hiểu còn theo dõi riêng trong INTERVIEW_PREP.

### Điểm hiện hành — tiếp tục ngày 2026-11-04

- Đã đọc lại tài liệu và kiểm tra workspace: chỉ có tài liệu dự án; không tìm thấy package.json, mã ứng dụng hoặc Prisma trong phạm vi tìm kiếm; git status --short báo không phải Git repository. Phù hợp trạng thái chưa triển khai.
- Đã duyệt luồng chính POST /auth/logout: thu hồi refresh nhóm A trong DB, backend xóa cookie, FE dọn access; giữ B và giới hạn access tới expiry. Mức hiểu giữ nguyên theo bằng chứng trong INTERVIEW_PREP.
- Đã duyệt response 204 và logout lặp. Mentor đã ghi phương án cookie/CSRF theo yêu cầu người học; đã duyệt Vite proxy local và ba lớp CSRF sau câu hỏi xác nhận rõ. Chuyển sang refresh đồng thời. Phối hợp logout-refresh còn thiết kế.
- Các điểm bàn giao bên dưới là lịch sử.

### Điểm bàn giao mới nhất — sau khi chốt reuse ngày 2026-11-03

- Đã dừng buổi theo yêu cầu người học. FB-002 giữ IN_PROGRESS; không cần làm thêm trong lúc nghỉ.
- Chốt mới: đăng ký tự phục vụ, bỏ admin tạo khách; API admin tạo/sửa/liệt kê sân, xem khách/chặn/mở chặn/lịch sử; register/login/me; rotation cấp mới hai token, access JSON/refresh HttpOnly/DB hash; token cũ dùng lại trả 401 và thu hồi quyền refresh cả nhóm phiên, nhóm khác không ảnh hưởng.
- Chưa có code/test. Còn logout, hợp đồng refresh đầy đủ, cookie/CSRF và phối hợp nhiều tab/retry/khóa, ERD/schema/FK/index/CHECK và mô phỏng nghiệm thu. Không coi việc duyệt đề xuất chứng minh đã tự giải thích hoặc chạy được.
- Đúng một bước đầu buổi sau: chốt POST /auth/logout. Các mục bàn giao cũ bên dưới là lịch sử trước buổi tiếp tục, không phải điểm hiện hành.

### Bàn giao cũ trước buổi tiếp tục

- Người học yêu cầu tạm dừng ngày 2026-11-03. FB-002 giữ IN_PROGRESS; FB-001 DONE, FB-000 IN_REVIEW, FB-003–015 TODO. Chưa bắt đầu triển khai ứng dụng.
- Đã duyệt trong buổi: khung response success/error, lỗi validation 400 với details field/message; hợp đồng tạo booking và thứ tự kiểm tra, lịch cá nhân/phân trang, khách/admin hủy booking và hủy lặp, danh sách booking admin/thông tin khách/bộ lọc, danh sách chi nhánh, danh sách sân/lọc loại và chi tiết sân.
- Court bổ sung playersPerTeam số nguyên bắt buộc 5/7/11, số người mỗi đội, lưu trực tiếp trên Court. Đã đồng bộ README/REQUIREMENTS/ROADMAP/DESIGN. Chưa có schema/migration; không thêm kích thước sân hoặc mô hình chia sân.
- Giữ hạn mức 3 booking tương lai chưa hủy, con số ở cấu hình backend khi triển khai. Hướng khóa User/Court, snapshot giá và BookingSlot vẫn giữ; không thêm báo giá/TTL hoặc thanh toán.
- Người học tự giải thích đúng ADMIN bị trả FORBIDDEN trước validation body theo thứ tự đã chốt. Với hủy lặp/mất response, mentor đã giải thích và người học xác nhận hiểu; chưa coi là lời giải thích độc lập. Mức hiểu cụ thể ở INTERVIEW_PREP.
- Chưa duyệt đề xuất GET /courts/:courtId/availability?date=...&durationMinutes=90: công khai, kiểm tra ngày/thời lượng và đủ slot liên tiếp. Response chưa thiết kế. DESIGN đã lưu riêng đề xuất chờ review.
- Chưa có code, test, CI, deploy hoặc Git repository sử dụng được theo kiểm tra đầu buổi; các kiểm tra buổi này là đọc/ghi/đối chiếu tài liệu, không phải bằng chứng chạy API/PostgreSQL.
- Dự báo 50–80 giờ giữ nguyên, chưa có dữ liệu giờ thực tế để hiệu chỉnh. FB-002 chưa hoàn tất các API/schema/auth/khóa chi tiết; không tự đánh dấu DONE.
- Đúng một bước khi quay lại: review đầu vào/cách xác định giờ trống của đề xuất availability, chưa yêu cầu làm trong lúc nghỉ.

## Quy ước

`TODO`: chưa làm · `IN_PROGRESS`: đang làm · `IN_REVIEW`: chờ review/xác nhận hiểu · `DONE`: đạt tiêu chí và có bằng chứng · `BLOCKED`: có trở ngại cụ thể cần giải quyết.

Mặc định chỉ một ticket `IN_PROGRESS`. Ghi bằng chứng thực tế như file, lệnh/kết quả hoặc link CI/demo; không điền kết quả dự kiến. Mức hiểu xem riêng trong bộ câu hỏi.

## Bảng công việc

| Ticket | Công việc | Trạng thái | Giờ thực tế | Bằng chứng / ghi chú |
| --- | --- | --- | --- | --- |
| FB-000 | Tự đánh giá | IN_REVIEW | — | Đã review đủ và có ví dụ authentication; chờ xác nhận hiểu cách kiểm chứng code AI |
| FB-001 | Đặc tả nghiệp vụ | DONE | — | REQUIREMENTS.md đạt tiêu chí; người học trả lời đúng ranh giới hủy 18:00/18:01 cho booking 19:00; review ghi trong INTERVIEW_PREP |
| FB-002 | ERD và hợp đồng API | IN_PROGRESS | — | Đã tiếp tục ngày 2026-11-03; đã duyệt hợp đồng booking, chi nhánh, danh sách/chi tiết sân và playersPerTeam; tiếp tục review availability, còn auth/API quản trị/schema chi tiết; chưa triển khai |
| FB-003 | Môi trường local | TODO | — | — |
| FB-004 | Auth và phân quyền | TODO | — | — |
| FB-005 | Sân và giờ trống | TODO | — | — |
| FB-006 | Đặt, xem, hủy | TODO | — | — |
| FB-007 | Giao diện admin | TODO | — | — |
| FB-008 | Chống đặt trùng | TODO | — | — |
| FB-009 | Integration test | TODO | — | — |
| FB-010 | GitHub Actions | TODO | — | — |
| FB-011 | Chuẩn bị VPS | TODO | — | — |
| FB-012 | Deploy HTTPS | TODO | — | — |
| FB-013 | Vận hành và backup/restore | TODO | — | — |
| FB-014 | Tài liệu và demo | TODO | — | — |
| FB-015 | CV và mock interview | TODO | — | — |

## Nhật ký buổi học

Các mục nhật ký giữ nguyên quyết định ở thời điểm ghi. Quy tắc hủy hiện hành từ 2026-11-02 là trước giờ bắt đầu ít nhất 60 phút, thay thế quy tắc cũ chỉ cần trước giờ bắt đầu.

### 2026-10-31 — Tiếp tục FB-000

- AI hỗ trợ: đọc README, ROADMAP, PROGRESS, INTERNSHIP_GUIDE và INTERVIEW_PREP; xác định bước tự đánh giá.
- Đã kiểm tra: `rg --files` và `ls -la` cho thấy bộ tài liệu, chưa có mã ứng dụng hoặc `package.json`; `git status --short` báo thư mục chưa phải Git repository sử dụng được.
- Hạn chế: chưa có ứng dụng để chạy test; chưa có câu trả lời để đánh giá mức hiểu. Giữ nguyên trạng thái kiến thức trong INTERVIEW_PREP.
- Bước nhỏ tiếp theo: người học gửi câu trả lời G0-01 đến G0-05 để mentor review.

### 2026-10-31 — Review FB-000

- Người học đã làm: gửi năm câu tự đánh giá trong chat.
- AI hỗ trợ: ghi câu trả lời và review vào INTERVIEW_PREP; ghi mục tiêu, giới hạn Docker/deploy và phần còn thiếu.
- Đã kiểm tra: đối chiếu câu trả lời với tiêu chí FB-000; còn thiếu ví dụ phần tự triển khai và cách kiểm chứng code AI. Chưa có ứng dụng để chạy test.
- Trạng thái: IN_REVIEW; chưa xác nhận thành thạo công nghệ, chưa triển khai FB-001.
- Bước nhỏ tiếp theo: gửi một ví dụ tính năng từng làm, phân biệt phần tự viết/phần được hỗ trợ, kèm cách dự định kiểm chứng code AI.

### 2026-10-31 — Bổ sung tự đánh giá, bắt đầu FB-001

- Người học: tự viết authentication với AI hướng dẫn; từng dùng Postman, hiện đa số nhờ AI viết test/kiểm tra; nhận code AI rồi mới review.
- Mentor: đã có ví dụ đủ cho tự đánh giá; nhận diện rủi ro cùng bỏ sót yêu cầu khi AI viết cả code lẫn test. Review sau khi nhận code hợp lý; cần tự xác định kết quả mong đợi.
- Đã kiểm tra: đối chiếu nội dung bổ sung với G0-02/G0-05 và cập nhật INTERVIEW_PREP. Chưa kiểm chứng code cũ hoặc chạy test ứng dụng.
- Trạng thái: FB-000 IN_REVIEW chờ xác nhận hiểu cách kiểm chứng; phần cần ôn không chặn FB-001. Chưa có đặc tả do người học viết.
- Bước nhỏ tiếp theo: người học gửi bảng quyền CUSTOMER/ADMIN theo README để review.

### 2026-10-31 — FB-001: quyền hủy booking

- Người học trả lời đúng: khách không được hủy booking người khác; admin được phép.
- Đã kiểm tra: đối chiếu với quy tắc quyền trong README; ghi câu trả lời một phần G1-01 vào INTERVIEW_PREP. Chưa có code/test hay đặc tả hoàn chỉnh.
- Tiếp tục hướng dẫn bằng từng tình huống nhỏ thay cho yêu cầu viết cả bảng ngay.
- Bước nhỏ tiếp theo: người học giải thích khách có được hủy booking của mình khi trận đã bắt đầu không. FB-001 vẫn IN_PROGRESS.

### 2026-11-01 — Tiếp tục FB-001 từ điểm tạm dừng

- AI hỗ trợ: đọc lại tài liệu và xác định đang ở bước quyền hủy booking; không yêu cầu làm lại FB-000.
- Đã kiểm tra: `rg --files` với bộ lọc tài liệu và `package.json` chỉ tìm thấy bộ tài liệu; `git status --short` báo chưa phải Git repository. Chưa có ứng dụng để chạy test.
- Chưa có câu trả lời mới của người học; giữ nguyên đánh giá trong INTERVIEW_PREP và trạng thái FB-001 IN_PROGRESS.
- Bước nhỏ tiếp theo: trả lời tình huống khách hủy booking của chính mình lúc 19:05 khi slot bắt đầu lúc 19:00, kèm lý do; mentor đối chiếu quy tắc hủy trong README.

### 2026-11-01 — FB-001: review hủy sau giờ bắt đầu

- Người học trả lời: không cho hủy lúc 19:05 với slot 19:00–20:00 vì đang trong giờ booking.
- Đã kiểm tra: đối chiếu quy tắc README “Khách chỉ hủy trước giờ bắt đầu”; câu trả lời đúng. Đã ghi nhận trong INTERVIEW_PREP; chưa đánh giá đầy đủ quyền khách/admin, chưa có code/test.
- Trạng thái: FB-001 IN_PROGRESS; chưa có đặc tả hoàn chỉnh.
- Bước nhỏ tiếp theo: người học xét hai mốc 18:59 và đúng 19:00, rồi diễn đạt điều kiện so sánh thời gian cho phép hủy.

### 2026-11-01 — FB-001: review mốc thời gian hủy

- Người học trả lời đúng: booking bắt đầu 19:00 thì hủy lúc 18:59 được phép, đúng 19:00 bị từ chối.
- Đã kiểm tra: đối chiếu quy tắc “trước giờ bắt đầu” trong README. Mentor diễn đạt điều kiện `now < startAt`; người học chưa tự viết biểu thức. Cập nhật INTERVIEW_PREP theo đúng câu trả lời, chưa đánh dấu hiểu toàn bộ G1-01.
- Trạng thái: FB-001 IN_PROGRESS; chưa có code/test hoặc đặc tả hoàn chỉnh.
- Bước nhỏ tiếp theo: người học đề xuất cách lưu booking sau khi hủy thành công, kèm lý do; mentor đối chiếu yêu cầu giữ lịch sử trong README.

### 2026-11-01 — FB-001: giữ lịch sử sau khi hủy

- Người học chọn giữ bản ghi và đổi trạng thái; nêu mục đích lưu thông tin hủy để kiểm tra hành vi lạm dụng, đồng thời đề cập nhu cầu dời giờ.
- Review: đúng phần giữ lịch sử theo README. Mentor làm rõ bản đầu chưa có chức năng đổi giờ và một lần hủy chưa đủ kết luận lạm dụng; chưa thêm nghiệp vụ xử phạt hoặc chống lạm dụng.
- Đã kiểm tra: đối chiếu quy tắc lưu lịch sử và hủy/đặt lại trong README; cập nhật câu trả lời một phần G1-04 thành Cần ôn. Chưa có code/test; FB-001 vẫn IN_PROGRESS.
- Bước nhỏ tiếp theo: người học xét khách B đặt slot 19:00–20:00 sau khi khách A hủy lúc 18:00, giải thích booking đã hủy có còn giữ slot không.

### 2026-11-01 — FB-001: hủy cho phép đặt lại

- Người học trả lời đúng: booking A đã hủy không ngăn B đặt lại; giữ sân trống sẽ ảnh hưởng doanh thu.
- AI hỗ trợ: tổng hợp phần đã review thành bản nháp REQUIREMENTS.md, gồm quyền hủy, mốc thời gian, lưu lịch sử và hủy/đặt lại. Chưa viết thay các phần người học chưa trả lời.
- Đã kiểm tra: đối chiếu với README về hủy cho phép đặt lại; cập nhật INTERVIEW_PREP. Đây là review đặc tả, chưa có code/test chứng minh hành vi. FB-001 vẫn IN_PROGRESS.
- Bước nhỏ tiếp theo: người học giải thích giá booking cũ khi admin đổi giá sân từ 300.000đ lên 350.000đ/giờ.

### 2026-11-01 — FB-001: giá lịch sử

- Người học trả lời đúng: booking cũ giữ giá cũ để thống kê lịch sử; đổi giá sân không thay đổi booking trước đó.
- AI hỗ trợ: bổ sung quy tắc và ví dụ 300.000đ/350.000đ vào REQUIREMENTS.md; ghi G1-05 đã giải thích được theo câu trả lời thực tế.
- Review bổ sung: giá đã chốt với khách cần giữ nguyên; tổng giá booking chưa đồng nghĩa tiền thực thu, vì chưa có thanh toán. Chưa thêm chức năng báo cáo doanh thu.
- Đã kiểm tra: đối chiếu quy tắc giá lịch sử trong README. Chưa có code/test; FB-001 vẫn IN_PROGRESS.
- Bước nhỏ tiếp theo: người học đề xuất cách backend xác định giá khi frontend gửi 1.000đ trong khi giá sân là 350.000đ/giờ.

### 2026-11-01 — FB-001: nguồn giá đáng tin

- Người học đề xuất so sánh giá frontend gửi với giá niêm yết, trả lỗi nếu thấp hơn.
- Review: đúng hướng kiểm tra phía server; chưa đủ vì giá gửi cao hơn cũng có thể sai. Mentor giải thích backend tự tính giá từ dữ liệu sân theo README, không lấy giá frontend làm nguồn tính tiền.
- Đã kiểm tra: đối chiếu README; cập nhật REQUIREMENTS.md và ghi câu trả lời một phần G2-05 ở mức Cần ôn. Chưa có xác nhận hiểu quy tắc tự tính giá hoặc code/test. FB-001 vẫn IN_PROGRESS.
- Bước nhỏ tiếp theo: người học giải thích backend xác định giá một giờ khi request chỉ có courtId và startAt, không có price.

### 2026-11-01 — FB-001: áp dụng giá theo sân

- Người học hỏi lại ý nghĩa câu hỏi và từ Court; mentor giải thích Court là sân, courtId là mã sân, kèm bảng giá sân A/B.
- Người học trả lời đúng: booking một giờ của sân B là 250.000đ theo bảng giá ví dụ.
- Đã kiểm tra: đối chiếu câu trả lời với dữ liệu ví dụ và quy tắc giá trong README; cập nhật REQUIREMENTS.md và INTERVIEW_PREP. Chỉ xác nhận áp dụng đúng ví dụ, chưa xác nhận hiểu lý do không tin giá frontend. Chưa có code/test; FB-001 vẫn IN_PROGRESS.
- Bước nhỏ tiếp theo: người học giải thích vì sao backend lấy giá từ database thay vì tin giá frontend gửi.

### 2026-11-01 — FB-001: lý do không tin giá frontend

- Người học giải thích frontend có thể gửi dữ liệu rác/sai sự thật, backend có quy tắc và ràng buộc đã quy định.
- Review: đúng lý do không tin đầu vào; mentor làm rõ backend thực thi quy tắc, đọc giá sân từ database, ràng buộc database hỗ trợ tính hợp lệ.
- Đã kiểm tra: đối chiếu README và cập nhật REQUIREMENTS.md, INTERVIEW_PREP. Phần nguồn giá đã giải thích được; G2-05 còn Cần ôn do chưa review đủ thời gian. Chưa có code/test; FB-001 vẫn IN_PROGRESS.
- Thao tác tài liệu: lệnh python không có trên máy và không sửa file; chạy lại bằng python3 thành công.
- Bước nhỏ tiếp theo: người học nêu kết quả mong đợi khi hai khách đặt cùng sân/cùng giờ; chưa yêu cầu giải pháp kỹ thuật.

### 2026-11-01 — FB-001: kết quả khi tranh slot

- Người học đề xuất request chạm database trước được booking.
- Review: đúng hướng chỉ một người thắng; mentor làm rõ thứ tự đến database chưa bảo đảm thứ tự ghi thành công. Với hai request hợp lệ: một thành công, một nhận 409, chỉ một booking hiệu lực.
- Đã kiểm tra: đối chiếu quy tắc tranh slot trong README; cập nhật bản nháp REQUIREMENTS.md và câu trả lời một phần G1-02. Chưa có kiểm chứng PostgreSQL/request đồng thời; chưa xác nhận người học hiểu cơ chế database. FB-001 vẫn IN_PROGRESS.
- Bước nhỏ tiếp theo: người học xét booking đã có và yêu cầu đặt mới khi admin vô hiệu hóa sân.

### 2026-11-01 — FB-001: sân vô hiệu hóa

- Người học: booking có sẵn của A không được giữ; B không được tạo booking mới.
- Review: đúng phần B bị chặn đặt mới; cần sửa phần A. Đối chiếu README: vô hiệu hóa sân giữ booking có sẵn và lịch sử; hủy booking là thao tác riêng.
- Đã cập nhật REQUIREMENTS.md và G1-02 ở mức Cần ôn trong INTERVIEW_PREP; chưa nhận được lời giải thích lại sau review. Chưa có code/test; FB-001 vẫn IN_PROGRESS.
- Bước nhỏ tiếp theo: người học giải thích sự khác nhau giữa vô hiệu hóa sân và hủy booking.

### 2026-11-01 — FB-001: phân biệt vô hiệu hóa sân và hủy booking

- Người học giải thích lại đúng: vô hiệu hóa sân giữ booking; hủy booking và thông báo là thao tác khác.
- Mentor làm rõ: hủy riêng chỉ khi cần, không tự động hoặc bắt buộc sau vô hiệu hóa; chức năng tự động gửi thông báo chưa nằm trong bản đầu.
- Đã kiểm tra: đối chiếu quy tắc README, cập nhật REQUIREMENTS.md và INTERVIEW_PREP theo câu trả lời. Chưa review đủ điều kiện đặt sân, chưa có code/test; FB-001 vẫn IN_PROGRESS.
- Bước nhỏ tiếp theo: người học xét slot 18:00–19:00 và 19:00–20:00 khi hiện tại là 18:30, chỉ theo điều kiện thời gian.

### 2026-11-01 — FB-001: giờ bắt đầu phải ở tương lai

- Người học chọn đúng slot 19:00–20:00 khi hiện tại 18:30; chưa tự nêu lý do.
- Mentor giải thích slot 18:00–19:00 đã bắt đầu nên không được đặt dù còn trống.
- Đã kiểm tra: đối chiếu điều kiện giờ bắt đầu trong README; cập nhật REQUIREMENTS.md và phần G1-02 trong INTERVIEW_PREP. Chưa có code/test; FB-001 vẫn IN_PROGRESS.
- Bước nhỏ tiếp theo: xét ngày 08/11 và 09/11 khi hôm nay 01/11 theo giờ Việt Nam, theo cửa sổ hôm nay đến hôm nay + 7 ngày.

### 2026-11-01 — FB-001: giới hạn ngày đặt

- Người học trả lời 09/11 được đặt, sau đó làm rõ đã hiểu câu hỏi thành việc người khác được đặt trùng ngày đó.
- Điều chỉnh review: chưa đủ căn cứ kết luận người học tính sai giới hạn ngày. Mentor đã giải thích theo README: 01/11 + 7 ngày = 08/11; 09/11 ngoài cửa sổ đặt. Chưa có câu trả lời đúng trọng tâm để đánh giá mức hiểu giới hạn này.
- Đã kiểm tra: đối chiếu quy tắc hôm nay đến hết hôm nay + 7 ngày theo giờ Việt Nam; cập nhật REQUIREMENTS.md và G1-02 trong INTERVIEW_PREP. Chưa có code/test; FB-001 vẫn IN_PROGRESS.
- Bước nhỏ tiếp theo: giả sử hôm nay 02/11, người học xác định ngày cuối được phép đặt.

### 2026-11-01 — Làm rõ hiểu nhầm câu hỏi ngày đặt

- Người học làm rõ đang nghĩ đến người khác đặt trùng, không phải tính ngày cuối được đặt trước.
- Mentor sửa ghi chú REQUIREMENTS.md, INTERVIEW_PREP và nhật ký trên: rút nhận xét tính sai ngày; giữ phần này chưa đánh giá được.
- Bước nhỏ tiếp theo: chỉ xét một khách và một sân hoàn toàn trống; nếu hôm nay 02/11, xác định ngày cuối được phép đặt theo quy tắc hôm nay + 7 ngày. Không xét tranh slot.
- Chưa có code/test; FB-001 vẫn IN_PROGRESS.

### 2026-11-01 — FB-001: xác nhận giới hạn ngày đặt

- Người học tính đúng: nếu hôm nay 02/11 thì ngày cuối là 09/11, giải thích bằng `2 + 7`.
- Đã kiểm tra: đối chiếu quy tắc hôm nay + 7 ngày trong README; cập nhật REQUIREMENTS.md và INTERVIEW_PREP, ghi nhận đã áp dụng đúng giới hạn ngày sau khi làm rõ câu hỏi.
- Chưa có code/test; chưa review đủ giờ hoạt động. FB-001 vẫn IN_PROGRESS.
- Bước nhỏ tiếp theo: xét hai slot ngày mai 21:00–22:00 và 22:00–23:00 khi sân mở 06:00–22:00, mỗi slot một giờ.

### 2026-11-01 — FB-001: giới hạn giờ hoạt động

- Người học chọn đúng slot 21:00–22:00 khi sân mở 06:00–22:00; không chọn 22:00–23:00.
- Mentor giải thích slot đầu kết thúc đúng giờ đóng cửa, slot sau vượt giờ hoạt động; người học chưa tự nêu lý do.
- Đã kiểm tra: đối chiếu README, cập nhật REQUIREMENTS.md và phần G1-02 trong INTERVIEW_PREP. Chưa có code/test; FB-001 vẫn IN_PROGRESS.
- Bước nhỏ tiếp theo: xét slot ngày mai 19:30–20:30 theo quy tắc bắt đầu đúng giờ, kèm lý do.

### 2026-11-01 — FB-001: đổi sang slot cơ sở 30 phút

- Người học đề xuất slot 30 phút, hỏi đặt 90 phút và xác nhận chọn giờ bắt đầu/thời lượng theo bội số 30 phút để tăng lựa chọn. Chưa có bằng chứng rằng thay đổi này thu hút thêm khách.
- Đã đổi quy tắc README và REQUIREMENTS: bắt đầu ở phút 00/30, thời lượng là bội số dương của 30 phút, trong 06:00–22:00 cùng ngày; giá theo thời lượng. Giữ cửa sổ ngày đặt, giá lịch sử, quyền hủy và sân vô hiệu hóa.
- Đã cập nhật ROADMAP, hướng dẫn chống trùng trong AGENTS và G1-03 trong INTERVIEW_PREP. Không dùng unique trên giờ bắt đầu booking để bảo vệ chồng lấn; chốt mô hình ở FB-002, triển khai và kiểm tra PostgreSQL thật ở FB-008.
- Đã kiểm tra bằng script `python3`: link Markdown nội bộ trong sáu file vừa cập nhật tồn tại; README không còn quy tắc slot một giờ bắt đầu đúng giờ, ROADMAP không còn giới hạn 06:00–21:00 và README/ROADMAP/AGENTS đều có quy tắc 30 phút. Kết quả PASS; đây là kiểm tra tài liệu, chưa phải test ứng dụng.
- Mentor giải thích đặt nhiều slot phải nguyên tử; chưa xác nhận người học hiểu phần chồng lấn/database. Chưa chốt đơn vị tiền/làm tròn; để FB-002. Chưa có code/test, FB-001 vẫn IN_PROGRESS.
- Các ghi chú slot một giờ trong nhật ký trước đây là lịch sử, đã được thay thế bởi quyết định mới.
- Bước nhỏ tiếp theo: xét A đặt 19:00–20:00, B đặt 19:30–21:00 cùng sân, nêu kết quả và lý do.

### 2026-11-01 — FB-001: nhận diện booking chồng lấn

- Người học từ chối đúng B đặt 19:30–21:00 khi A đã đặt 19:00–20:00 cùng sân, lý do A đã đặt trước.
- Mentor chỉ rõ phần trùng 19:30–20:00; từ chối toàn bộ yêu cầu B thay vì tự rút ngắn thời lượng.
- Đã kiểm tra: đối chiếu quy tắc mọi slot phải trống trong README; cập nhật REQUIREMENTS.md và G1-03 trong INTERVIEW_PREP. Chưa xác nhận hiểu trường hợp tiếp giáp hoặc cơ chế database, chưa có code/test; FB-001 vẫn IN_PROGRESS.
- Bước nhỏ tiếp theo: xét B bắt đầu 20:00 đúng lúc A kết thúc, khoảng 20:00–21:30 còn trống.

### 2026-11-01 — FB-001: hai booking tiếp giáp

- Người học chấp nhận đúng B đặt 20:00–21:30 sau A đặt 19:00–20:00, vì A đã kết thúc và sân còn trống.
- Review: giờ kết thúc booking trước bằng giờ bắt đầu booking sau không chồng lấn. Đã phân biệt được tiếp giáp với chồng lấn trong hai ví dụ, chưa xác nhận hiểu cơ chế database.
- Đã kiểm tra: đối chiếu quy tắc slot 30 phút trong README, cập nhật REQUIREMENTS.md và G1-03 trong INTERVIEW_PREP. Chưa có code/test; FB-001 vẫn IN_PROGRESS.
- Bước nhỏ tiếp theo: tính giá 90 phút với giá sân 300.000đ/giờ và giải thích cách tính.

### 2026-11-01 — FB-001: niêm yết giá mỗi 30 phút

- Người học yêu cầu đổi đơn vị niêm yết từ giá mỗi giờ thành giá mỗi 30 phút để dễ tính; đã áp dụng vào README, REQUIREMENTS và ROADMAP.
- Công thức mới: tổng giá = giá mỗi slot × số slot; số slot = thời lượng phút / 30. Giữ quy tắc backend tự tính và lưu giá tại thời điểm đặt; đổi giá sân không sửa booking cũ.
- Cập nhật INTERVIEW_PREP theo đúng quyết định của người học; chưa xác nhận tự tính được giá 90 phút. Các ví dụ giá giờ trong nhật ký/review cũ là lịch sử.
- Đã kiểm tra bằng `python3`: công thức giá trong README/REQUIREMENTS, phép tính ví dụ 90 phút và link Markdown nội bộ trong năm tài liệu cập nhật đều PASS. Đây là kiểm tra tài liệu, chưa phải test ứng dụng.
- Chưa có ứng dụng, dữ liệu hoặc migration cần chuyển đổi; FB-001 vẫn IN_PROGRESS. Cách lưu tiền/validation giá sẽ chốt ở FB-002.
- Bước nhỏ tiếp theo: với giá 150.000đ/30 phút, người học tính số slot và tổng giá cho booking 90 phút.

### 2026-11-01 — FB-001: tính giá theo số slot

- Người học xác nhận giữ giá mỗi 30 phút, sau đó tính đúng booking 90 phút bằng 150.000đ × 3 slot.
- Mentor xác nhận tổng giá 450.000đ. Đã đối chiếu phép tính với quy tắc giá mới trong README; cập nhật REQUIREMENTS.md và INTERVIEW_PREP theo câu trả lời thực tế.
- Chưa có code/test; chưa review việc đặt nhiều slot phải thành công toàn bộ hoặc không giữ slot nào. FB-001 vẫn IN_PROGRESS.
- Bước nhỏ tiếp theo: xét booking 19:00–20:30 có slot giữa đã bị đặt, nêu kết quả cho toàn bộ yêu cầu và hai slot còn trống.

### 2026-11-01 — Kết thúc buổi theo yêu cầu người học

- Người học yêu cầu dừng để buổi khác học tiếp. Đã lưu điểm bàn giao và cập nhật mô tả ticket hiện tại.
- Đã có bằng chứng học tập: câu trả lời trong chat được ghi theo mức hiểu thực tế trong INTERVIEW_PREP và bản nháp REQUIREMENTS; quy tắc mới đã cập nhật README/ROADMAP/AGENTS.
- Kiểm tra đã chạy trong buổi: script python3 kiểm tra công thức, phép tính ví dụ và link tài liệu đạt; chưa có ứng dụng để chạy test. Không chốt DONE, không tự commit/push.
- Phần chưa trả lời: đặt nhiều slot khi slot giữa đã bị chiếm. Chờ buổi sau, không yêu cầu làm tiếp ngay.

### 2026-11-02 — Tiếp tục FB-001

- Đã đọc lại tài liệu tiến độ, lộ trình, hướng dẫn và phần review liên quan; tiếp tục tình huống đặt 90 phút khi slot giữa đã bị chiếm.
- Đã kiểm tra: `rg --files` và `ls -la` cho thấy chỉ có tài liệu, chưa có ứng dụng hoặc `package.json`; `git status --short` báo chưa phải Git repository sử dụng được.
- FB-001 giữ IN_PROGRESS. Chưa có câu trả lời mới để cập nhật mức hiểu trong INTERVIEW_PREP; chưa có ứng dụng để chạy test.
- Bước nhỏ tiếp theo: người học chọn cách xử lý toàn bộ yêu cầu 19:00–20:30 khi 19:30–20:00 đã bị đặt, kèm lý do và trạng thái hai slot còn trống.

### 2026-11-02 — FB-001: giải thích nhu cầu đặt liên tục

- Người học chưa biết chọn cách xử lý vì chưa rõ cách vận hành sân bóng thực tế; chưa có câu trả lời nghiệp vụ để xác nhận hiểu.
- Mentor giải thích theo quy tắc project đã chốt: khách yêu cầu 90 phút liên tục, hai slot rời rạc không đáp ứng yêu cầu; từ chối toàn bộ và không giữ slot nào cho yêu cầu thất bại. Khách có thể chọn giờ khác rồi gửi yêu cầu mới.
- Đã đối chiếu README và REQUIREMENTS về đặt toàn bộ hoặc không đặt; cập nhật INTERVIEW_PREP ở mức Cần ôn. Không khẳng định đây là cách vận hành của mọi sân thực tế; chưa có code/test.
- FB-001 giữ IN_PROGRESS. Bước nhỏ tiếp theo: người học xác định hai slot đầu/cuối có đáp ứng yêu cầu 90 phút liên tục không.

### 2026-11-02 — FB-001: review nhu cầu chơi liên tục

- Người học giải thích đúng: khách cần chơi liên tục 90 phút từ 19:00 đến 20:30; có phần trùng nên không đặt được, muốn chơi liên tục phải chọn khoảng khác không bị trùng.
- Mentor xác nhận từ chối toàn bộ và không giữ hai slot còn trống cho yêu cầu thất bại. Chưa đánh giá hiểu cơ chế transaction/database hoặc tự diễn đạt trạng thái dữ liệu.
- Đã đối chiếu README, bổ sung REQUIREMENTS và ghi nhận câu trả lời thực tế trong INTERVIEW_PREP. Kiểm tra tài liệu bằng assertion khi cập nhật; chưa có ứng dụng để chạy test. FB-001 giữ IN_PROGRESS.
- Bước nhỏ tiếp theo: người học nêu các thông tin khách cần chọn/gửi khi đặt sân, chưa cần code hay tên trường API.

### 2026-11-02 — FB-001: ý tưởng giao diện chọn giờ

- Người học đề xuất trục thời gian ngang từ mở cửa đến kết thúc cho thuê, chia block 30 phút; đỏ là không được chọn, xanh là đang chọn, không màu là trống.
- Đã ghi ý tưởng vào REQUIREMENTS và câu trả lời liên quan trong INTERVIEW_PREP; chưa đánh giá là đã thiết kế đủ đầu vào API. Chưa có giao diện/code/test.
- Review: mô tả rõ trạng thái hiển thị khi chọn giờ; còn thiếu cách xác định sân/ngày của lịch. FB-001 giữ IN_PROGRESS.
- Bước nhỏ tiếp theo: người học mô tả cách chọn sân và ngày trước khi xem trục thời gian.

### 2026-11-02 — FB-001: chọn sân từ grid

- Người học đề xuất hiển thị các sân dạng grid, chọn sân rồi xem chi tiết giờ còn trống của sân đó.
- Đã cập nhật REQUIREMENTS và INTERVIEW_PREP theo đề xuất thực tế; bước chọn sân đã rõ, cách chọn ngày còn thiếu. Đối chiếu luồng với phạm vi nhiều sân trong README; chưa có giao diện/code/test. FB-001 giữ IN_PROGRESS.
- Bước nhỏ tiếp theo: người học mô tả cách chọn ngày trong màn hình chi tiết sân để xem lịch trống.

### 2026-11-02 — FB-001: thống nhất cách chọn ngày

- Người học đồng ý gợi ý mentor: chi tiết sân mặc định xem hôm nay, có ô chọn ngày; đổi ngày thì cập nhật lịch trống/đã đặt của sân đang xem.
- Đã cập nhật REQUIREMENTS và INTERVIEW_PREP; đây là lựa chọn giao diện được xác nhận, không phải bằng chứng đã hiểu validation ngày/giờ hoặc hợp đồng API. Giữ nguyên mức hiểu và FB-001 IN_PROGRESS.
- Đã kiểm tra nội dung cập nhật bằng cách đọc lại và assertion; chưa có ứng dụng để chạy test.
- Bước nhỏ tiếp theo: người học nêu thông tin khách cần thấy trước khi xác nhận gửi yêu cầu đặt sân.

### 2026-11-02 — FB-001: nội dung xác nhận đặt sân

- Người học đề xuất làm nổi bật ngày, giờ bắt đầu–kết thúc và giá khi xác nhận.
- Mentor bổ sung tên sân và đề xuất ghi rõ tổng giá: ví dụ 90 phút với 150.000đ/30 phút là 450.000đ. Không ghi nhận phần bổ sung là câu trả lời của người học.
- Đã cập nhật REQUIREMENTS, INTERVIEW_PREP và đối chiếu phép tính với quy tắc README; kiểm tra nội dung bằng assertion. Chưa có giao diện/code/test; FB-001 giữ IN_PROGRESS.
- Bước nhỏ tiếp theo: người học nêu phản hồi giao diện khi khách xác nhận nhưng một slot vừa bị người khác đặt thành công.

### 2026-11-02 — FB-001: thông báo khi tranh slot

- Người học đề xuất thông báo có người đặt trước với giọng nhí nhảnh, kèm “bạn đã chậm một bước”; nêu ý định chuyển cảm giác tiêu cực sang sự đắn đo của khách và phỏng đoán phần lớn từ chối do tranh slot.
- Mentor phản biện: tránh trách khách; chưa có dữ liệu về tỷ lệ lỗi. Phân biệt tranh slot với sân vô hiệu hóa, thời gian không hợp lệ, phiên đăng nhập hết hạn và kết quả chưa rõ khi mất kết nối. Đề xuất lời nhắn trung tính, tải lại lịch và cho chọn lại; đây chưa phải phần người học tự giải thích.
- Đã đối chiếu điều kiện sân/thời gian trong README, cập nhật REQUIREMENTS và chuyển G2-06 sang Cần ôn theo câu trả lời thực tế. Kiểm tra tài liệu bằng assertion; chưa có ứng dụng để chạy test. FB-001 giữ IN_PROGRESS.
- Bước nhỏ tiếp theo: người học nêu cách cập nhật các block khi backend báo một slot trong lựa chọn vừa bị đặt.

### 2026-11-02 — FB-001: thông báo bảo trì

- Người học đề xuất thông báo đơn giản sân đang bảo trì và xin lỗi vì bất tiện.
- Mentor xác nhận cho trường hợp đã biết bảo trì; phân biệt với sân vô hiệu hóa chưa biết lý do và slot bị người khác đặt. Không mở rộng chức năng bảo trì.
- Đã cập nhật REQUIREMENTS và INTERVIEW_PREP, kiểm tra nội dung bằng assertion; chưa có code/test. FB-001 giữ IN_PROGRESS, G2-06 Cần ôn.
- Bước nhỏ tiếp theo giữ nguyên: người học nêu cách cập nhật block đang xanh khi slot đó vừa bị người khác đặt.

### 2026-11-02 — FB-001: chọn thời lượng trước giờ bắt đầu

- Người học yêu cầu mentor cung cấp luôn giải pháp xử lý xung đột; đã nhận giải pháp nhưng chưa trả lời xác nhận hiểu. Nay đề xuất hỏi thời lượng chơi trước khi cho chọn khung giờ.
- Luồng cập nhật: chọn sân → ngày → thời lượng → giờ bắt đầu → xác nhận. Mentor đề xuất tự chọn các block liên tiếp theo thời lượng, chỉ cho chọn giờ bắt đầu đủ trống và đúng quy tắc thời gian. Không thay đổi nghiệp vụ slot/giá 30 phút.
- Đã bổ sung REQUIREMENTS gồm giải pháp xung đột đã cung cấp, ghi rõ nguồn người học/mentor trong INTERVIEW_PREP. Kiểm tra nội dung bằng assertion; chưa có giao diện/code/test. FB-001 giữ IN_PROGRESS, chưa nâng mức hiểu do chỉ có lời giải mentor.
- Bước nhỏ tiếp theo: review ví dụ chọn thời lượng 90 phút rồi giờ bắt đầu; chưa yêu cầu code.

### 2026-11-02 — FB-001: chốt luồng chọn giờ và xử lý conflict

- Người học xác nhận chốt phương án chọn thời lượng trước giờ bắt đầu và xử lý conflict, nhận xét phù hợp để khách ít hoang mang. Đây là nhận định thiết kế, chưa có kiểm chứng trải nghiệm người dùng.
- Đã cập nhật REQUIREMENTS từ đề xuất thành luồng đã xác nhận; ghi nguồn quyết định trong INTERVIEW_PREP, không tự nâng mức hiểu hoặc chốt DONE.
- Kiểm tra tài liệu: assertion xác nhận luồng chốt, quy tắc nhiều slot và 409 vẫn có trong đặc tả. Chưa có ứng dụng để chạy test; FB-001 IN_PROGRESS. Còn thiếu quyền đầy đủ và đầu vào/kết quả/lỗi của luồng đặt/hủy.
- Bước nhỏ tiếp theo: người học thử nêu dữ liệu frontend cần gửi backend lúc xác nhận đặt sân, chưa cần code.
- Gợi ý commit khi đã khởi tạo Git: `docs: define booking selection and conflict flow`. Không commit/push.

### 2026-11-02 — FB-001: bản nháp đầu vào đặt sân

- Người học nêu thông tin khách hàng, sân, ngày, thời lượng, giờ bắt đầu; yêu cầu mentor bổ sung phần thiếu.
- Mentor đề xuất body gồm mã sân, thời điểm bắt đầu có múi giờ rõ ràng, thời lượng phút; danh tính lấy từ JWT đã xác thực. Backend đọc giá sân và tự tính giờ kết thúc/tổng giá. Tên trường chỉ minh họa; hợp đồng API chốt ở FB-002.
- Đã cập nhật REQUIREMENTS/INTERVIEW_PREP, không coi lời giải mentor là mức hiểu đã được xác nhận. FB-001 IN_PROGRESS.
- Đã kiểm tra bằng Python: ví dụ 19:00 ngày 03/11/2026 UTC+7 bằng 12:00 UTC và thời lượng 90 phút kết thúc 20:30. Chưa có code/test ứng dụng.
- Bước nhỏ tiếp theo: người học giải thích vì sao lấy danh tính từ JWT đã xác thực thay vì userId trong body.

### 2026-11-02 — FB-001: xác nhận nguồn danh tính người đặt

- Người học chỉ rõ userId đã nằm trong token và xác nhận sau khi mentor giải thích: backend xác thực token, lấy ID để gắn booking; body gồm courtId/startAt/durationMinutes.
- Đã cập nhật REQUIREMENTS và INTERVIEW_PREP, phân biệt xác nhận quyết định với tự giải thích cơ chế JWT/quyền. Không nâng mức hiểu hoặc đánh dấu DONE chỉ từ câu xác nhận.
- Đã kiểm tra nội dung ba tài liệu bằng assertion; chưa có ứng dụng để chạy test. FB-001 IN_PROGRESS, còn thiếu kết quả/lỗi và quyền đầy đủ.
- Bước nhỏ tiếp theo: người học nêu thông tin khách cần nhận sau khi đặt sân thành công.

### 2026-11-02 — FB-001: màn hình đặt sân thành công

- Người học đề xuất giao diện xác nhận lại ngày, giờ, tiền sau khi đặt thành công.
- Mentor bổ sung mã booking, tên sân, thời lượng, trạng thái và nút xem lịch đặt cá nhân; dữ liệu hiển thị lấy từ booking backend đã lưu, không yêu cầu xác nhận đặt thêm lần nữa. Các chi tiết bổ sung chưa có xác nhận riêng của người học.
- Đã cập nhật REQUIREMENTS, INTERVIEW_PREP và kiểm tra nội dung bằng assertion; chưa có giao diện/code/test. FB-001 IN_PROGRESS, chưa nâng mức hiểu từ lời giải mentor.
- Bước nhỏ tiếp theo: người học chọn cách xem các booking đã đặt khi quay lại ứng dụng.

### 2026-11-02 — FB-001: xác nhận mục Lịch đặt của tôi

- Người học xác nhận có mục Lịch đặt của tôi để quay lại xem booking cá nhân, đúng phạm vi README.
- Mentor bổ sung gợi ý thông tin mỗi booking và nhắc backend bảo vệ quyền sở hữu; chưa ghi nhận là người học tự giải thích cơ chế quyền. Quy tắc hủy/giữ lịch sử không đổi.
- Đã cập nhật REQUIREMENTS, INTERVIEW_PREP và kiểm tra nội dung bằng assertion; chưa có giao diện/code/test. FB-001 giữ IN_PROGRESS.
- Bước nhỏ tiếp theo: chốt vị trí nút hủy và thao tác xác nhận hủy trong lịch cá nhân.

### 2026-11-02 — FB-001: xác nhận thao tác hủy

- Người học đồng ý đề xuất nút hủy kèm hộp xác nhận. Chưa chọn riêng vị trí nút; mentor chọn mặc định trên từng booking của danh sách cho app nhỏ, không ghi là lựa chọn vị trí do người học nêu.
- Đã cụ thể hóa REQUIREMENTS: hộp hiện sân/ngày/giờ và hai lựa chọn giữ/hủy; chỉ cập nhật đã hủy sau thành công backend. Backend kiểm tra quyền, thời gian; giữ lịch sử và giải phóng toàn bộ slot theo quy tắc hiện có.
- Đã cập nhật INTERVIEW_PREP, kiểm tra nội dung bằng assertion. Chưa có giao diện/code/test; mức hiểu không tự nâng, FB-001 IN_PROGRESS.
- Bước nhỏ tiếp theo: người học nêu các việc admin cần làm để hoàn thiện bảng quyền FB-001.

### 2026-11-02 — FB-001: đề xuất chức năng admin

- Người học đề xuất trạng thái sân bảo trì, đánh dấu khách xấu/troll, tạo/xóa mềm tài khoản và thêm sân ở chi nhánh khác; yêu cầu bổ sung tính năng.
- Mentor đối chiếu README/ROADMAP: bản đầu quản lý sân trong một cơ sở, xem/lọc/hủy booking toàn hệ thống; chưa có quản lý tài khoản hay nhiều chi nhánh. Đề xuất hoãn các phần mở rộng, dùng vô hiệu hóa sân để ngừng nhận đặt khi bảo trì mà giữ booking hiện có.
- Đã ghi rõ đề xuất chưa chốt vào REQUIREMENTS, cập nhật câu trả lời thực tế trong INTERVIEW_PREP; chưa thay README/roadmap hoặc triển khai tính năng mới. Kiểm tra tài liệu bằng assertion, chưa có code/test.
- FB-001 IN_PROGRESS. Bước nhỏ tiếp theo: người học quyết định giữ phạm vi bản đầu hay mở rộng; mentor khuyến nghị giữ bản đầu.

### 2026-11-02 — FB-001: bổ sung quản lý tài khoản và nhóm địa điểm

- Người học quyết định thêm quản lý tài khoản; đề xuất địa chỉ sân và bộ chọn chi nhánh trước khi chọn sân. Phạm vi trước đây là một cơ sở đã được thay đổi có chủ đích trong README/ROADMAP.
- Chi nhánh giới hạn ở nhóm địa điểm để chọn/lọc sân, admin toàn hệ thống; chưa bổ sung mô hình chủ sân hay quyền riêng theo chi nhánh. Cần tên/nhóm địa điểm để nhiều sân cùng nơi xuất hiện chung trong bộ chọn; schema chốt FB-002.
- Đã cập nhật README, REQUIREMENTS, ROADMAP, INTERVIEW_PREP. Quản lý tài khoản gồm xem/tạo tài khoản khách, đánh dấu hành vi và xóa mềm; còn chờ quy tắc chặn đặt/đăng nhập, booking hiện có và khôi phục. Không tự quyết định hậu quả lên tài khoản/booking.
- Ước lượng 30–40 giờ cũ cần đánh giá lại sau khi chốt quy tắc bổ sung; chưa tự tạo số giờ mới. Kiểm tra tài liệu bằng assertion; chưa có code/test. FB-001 IN_PROGRESS, mức hiểu giữ nguyên.
- Bước nhỏ tiếp theo: người học quyết định đánh dấu khách xấu/troll chỉ ghi nhận hay chặn đặt mới.

### 2026-11-02 — FB-001: tách ghi chú khách và chặn đặt mới

- Người học đồng ý đề xuất tách ghi chú hành vi và chặn đặt mới. Ghi chú không tự chặn; thao tác chặn đặt ngăn tạo booking mới.
- Đã cập nhật README, REQUIREMENTS, ROADMAP và INTERVIEW_PREP để phản ánh quyết định. Chưa quyết định quyền đăng nhập/xem/hủy, mở chặn, xóa mềm hoặc tác động lên booking đã có.
- Kiểm tra tài liệu bằng assertion xác nhận tách hai thao tác; chưa có ứng dụng để chạy test. FB-001 giữ IN_PROGRESS; không nâng mức hiểu chỉ vì xác nhận lựa chọn.
- Bước nhỏ tiếp theo: người học quyết định giữ hay tự hủy booking hiện có khi chặn đặt mới; mentor đề xuất giữ, hủy riêng nếu cần.

### 2026-11-02 — FB-001: giữ booking khi chặn đặt mới

- Người học đồng ý giữ nguyên booking hiện có khi chặn khách đặt mới; admin hủy riêng nếu cần.
- Đã cập nhật README, REQUIREMENTS và INTERVIEW_PREP theo xác nhận. Không suy rộng quyết định này sang xóa mềm tài khoản.
- Kiểm tra nội dung bằng assertion; chưa có code/test ứng dụng. FB-001 IN_PROGRESS, giữ nguyên mức hiểu.
- Bước nhỏ tiếp theo: chốt quyền đăng nhập/xem/hủy của khách bị chặn đặt mới; mentor đề xuất vẫn cho phép, với điều kiện hủy hiện có.

### 2026-11-02 — FB-001: chốt quy tắc chặn đặt mới

- Người học hỏi tính hợp lý của chặn đặt, rồi đồng ý sau giải thích: admin chặn/mở chặn thủ công và ghi lý do; chỉ chặn tạo booking mới, vẫn cho khách đăng nhập/xem/hủy booking hợp lệ, giữ booking cũ.
- Không tự động đánh giá/chấm điểm; một lần hủy đúng quy định không đủ để kết luận phá app. Xóa mềm là thao tác riêng, chưa có quy tắc được chốt.
- Đã cập nhật README, REQUIREMENTS, ROADMAP, INTERVIEW_PREP; kiểm tra bằng assertion sự hiện diện các quy tắc đã xác nhận. Chưa có ứng dụng để chạy test; FB-001 IN_PROGRESS, không tự nâng mức hiểu từ xác nhận ngắn.
- Bước nhỏ tiếp theo: người học làm rõ mục đích xóa mềm tài khoản so với chặn đặt mới.

### 2026-11-02 — FB-001: làm rõ tài khoản vi phạm nghiêm trọng

- Người học nêu mục đích xóa mềm là xử lý khách không trả tiền khi trả tại sân, phá hoại sân hoặc ẩu đả.
- Mentor phân biệt chặn đặt mới đã chốt với đề xuất khóa tài khoản (cấm đăng nhập/API cần đăng nhập), giữ lịch sử. Chưa tự bổ sung trạng thái khóa, chưa chốt cách xử lý token cũ/booking cũ hoặc xóa mềm.
- Ghi nhận không trả tiền có thể là lý do admin nhập thủ công; chưa có quyết định thêm luồng chọn thanh toán/trạng thái tiền, README vẫn chưa có chức năng thanh toán.
- Đã cập nhật REQUIREMENTS/INTERVIEW_PREP, kiểm tra bằng assertion; chưa có code/test, FB-001 IN_PROGRESS.
- Bước nhỏ tiếp theo: người học chọn chỉ chặn đặt mới hay thêm mức khóa toàn bộ tài khoản cho vi phạm nghiêm trọng.

### 2026-11-02 — FB-001: chốt khóa tài khoản vi phạm

- Người học đồng ý thêm mức khóa tài khoản cho vi phạm nghiêm trọng: chặn đăng nhập/API cần đăng nhập kể cả token đã cấp; giữ tài khoản, lịch sử và booking, admin hủy booking riêng nếu cần.
- Đã cập nhật README/REQUIREMENTS/ROADMAP: phân biệt khóa với chặn đặt mới, thay ý định xóa mềm để xử phạt bằng khóa tài khoản. Nhu cầu xóa mềm khác chưa chốt; chưa thêm luồng thanh toán.
- Đã ghi nhận xác nhận thực tế trong INTERVIEW_PREP, không nâng mức hiểu về JWT chỉ vì đồng ý. Kiểm tra tài liệu bằng assertion; chưa có ứng dụng để chạy test. FB-001 IN_PROGRESS.
- Bước nhỏ tiếp theo: chốt mở khóa và trạng thái chặn đặt sau mở khóa; mentor đề xuất hai hạn chế độc lập, mở khóa không tự mở chặn đặt mới.

### 2026-11-02 — FB-001: quyền admin gỡ hạn chế độc lập

- Người học đồng ý mở khóa không tự mở chặn đặt và hỏi xác nhận admin vẫn được thay đổi chặn đặt mới. Mentor xác nhận admin chặn/mở chặn, khóa/mở khóa độc lập, có ghi lý do.
- Quy tắc: mở khóa không tự mở chặn đặt; mở chặn đặt không tự mở khóa. Chỉ tài khoản không bị khóa và không bị chặn đặt mới được tạo booking, ngoài các điều kiện nghiệp vụ khác.
- Đã cập nhật README, REQUIREMENTS, ROADMAP, INTERVIEW_PREP; kiểm tra tài liệu bằng assertion, chưa có code/test. FB-001 IN_PROGRESS, giữ nguyên mức hiểu.
- Bước nhỏ tiếp theo: review ví dụ tài khoản đã mở khóa nhưng còn bị chặn đặt mới.

### 2026-11-02 — Tạm dừng nghỉ trưa theo yêu cầu người học

- Người học hỏi số bước/câu hỏi còn lại rồi yêu cầu tạm dừng nghỉ trưa. Đã lưu điểm bàn giao, không yêu cầu trả lời thêm trong lúc nghỉ.
- Đã chốt trong buổi: chọn sân/ngày/thời lượng trước giờ bắt đầu, thông tin xác nhận/thành công, xử lý conflict, lịch cá nhân và xác nhận hủy; bổ sung nhóm sân theo địa điểm và quản lý tài khoản. Admin ghi chú, chặn/mở chặn đặt và khóa/mở khóa tài khoản có lý do; hai hạn chế độc lập, giữ lịch sử/booking cũ. Khóa có hiệu lực với token cũ; chặn đặt vẫn cho đăng nhập/xem/hủy booking hợp lệ.
- Chưa có ứng dụng, test, CI hoặc Git repository sử dụng được. Kiểm tra thực sự trong buổi: đọc tài liệu/trạng thái thư mục, các assertion nội dung tài liệu và ví dụ chuyển UTC+7 sang UTC, tính giờ kết thúc/giá. Không có test backend/PostgreSQL hoặc bằng chứng trải nghiệm người dùng.
- FB-001 giữ IN_PROGRESS; FB-000 IN_REVIEW. INTERVIEW_PREP đã ghi câu trả lời/xác nhận thực tế; không tự nâng mức hiểu từ việc đồng ý phương án. Chưa có quyết định cuối về nhu cầu xóa mềm riêng, không coi đó là tính năng đã chốt.
- Cách tiếp tục đã đề xuất: (1) mentor tổng hợp đặc tả gọn từ các quyết định hiện có; (2) người học trả lời một lượt 3 tình huống review về đặt chồng lấn, hủy và hạn chế tài khoản; (3) chỉnh phần thiếu rồi nghiệm thu theo tiêu chí, không tự đánh dấu DONE trước review.
- Đúng một bước tiếp theo khi người học quay lại: mentor tổng hợp bản đặc tả FB-001 để review. Chưa bắt đầu bước này trong giờ nghỉ.
- Gợi ý commit khi có Git: `docs: specify booking flow and customer restrictions`. Chưa commit/push.

### 2026-11-02 — Tiếp tục và tổng hợp FB-001 để review

- Người học yêu cầu tiếp tục sau giờ nghỉ. Mentor bổ sung bản tổng hợp ở đầu REQUIREMENTS: quyền, đầu vào/kết quả đặt và hủy, nhóm từ chối, quy tắc slot/giá/thời gian và bảng hạn chế tài khoản; giữ nguồn câu trả lời trong các mục cũ.
- Đã kiểm tra local: `rg --files` chỉ thấy tài liệu; `git status --short` báo chưa phải Git repository. Đã đọc/đối chiếu README, ROADMAP và tài liệu học; assertion bằng `python3` xác nhận các mục tổng hợp và trạng thái tiến độ có trong tài liệu. Lệnh `python` không có trên máy, đã chuyển sang `python3`. Chưa có ứng dụng để chạy test.
- FB-001 giữ IN_PROGRESS; chưa có câu trả lời mới nên giữ nguyên mức hiểu trong INTERVIEW_PREP. Còn cần chốt nội dung/quyền xem ghi chú khách; không tự thêm xóa mềm hoặc trạng thái bảo trì riêng.
- Bước nhỏ tiếp theo: người học trả lời một lượt ba tình huống review về chồng lấn, hủy đúng giờ bắt đầu và mở khóa nhưng còn chặn đặt.
- Gợi ý commit khi có Git: `docs: consolidate FB-001 requirements for review`. Chưa commit/push.

### 2026-11-02 — Review chồng lấn và giải thích hủy/hạn chế tài khoản

- Người học trả lời đúng B không đặt được vì đã có người thuê; chưa tự trả lời việc giữ đoạn không trùng. Mentor bổ sung từ chối toàn bộ, không giữ slot cho B.
- Người học yêu cầu đề xuất cho câu 2 và 3. Mentor cung cấp quy tắc đã chốt: khách hủy đúng giờ bắt đầu bị từ chối, giữ nguyên booking/slot; mở khóa nhưng còn chặn đặt cho phép đăng nhập/xem/hủy hợp lệ, vẫn cấm đặt mới cho đến khi admin mở chặn riêng kèm lý do.
- Đã cập nhật INTERVIEW_PREP theo đúng nguồn câu trả lời, giữ nguyên mức hiểu và FB-001 IN_PROGRESS. Đối chiếu README/REQUIREMENTS; assertion bằng `python3` kiểm tra ghi nhận mới và bước tiếp theo. Chưa có code/test ứng dụng.
- Bước nhỏ tiếp theo: người học diễn đạt lại vì sao mở khóa chưa đủ để đặt mới khi còn bị chặn đặt.
- Gợi ý commit khi có Git: `docs: record FB-001 scenario review`. Chưa commit/push.

### 2026-11-02 — Hiểu hạn chế độc lập, thảo luận hạn hủy

- Người học giải thích lại đúng: mở khóa cho đăng nhập, còn chặn đặt thì cần admin mở chặn riêng mới đặt mới được. Đã ghi bằng chứng hiểu ở mức nghiệp vụ trong INTERVIEW_PREP; chưa có bằng chứng triển khai JWT.
- Người học đề xuất không cho hủy quá sát giờ: A hủy 18:59 cho booking 19:00 có thể khiến sân bỏ trống dù B từng có nhu cầu. Mentor ghi nhận rủi ro và đưa lựa chọn ngưỡng hủy để thảo luận; chưa coi đây là số liệu vận hành hoặc quyết định cuối.
- README/REQUIREMENTS vẫn áp dụng khách hủy trước giờ bắt đầu. Nếu chốt ngưỡng mới sẽ cập nhật đồng bộ tài liệu và ví dụ ranh giới; chưa thêm đặt cọc, phí hủy hay danh sách chờ.
- Đã kiểm tra ghi nhận bằng assertion `python3`; chưa có code/test ứng dụng. FB-001 giữ IN_PROGRESS.
- Bước nhỏ tiếp theo: người học chọn ngưỡng hủy trước giờ bắt đầu.
- Gợi ý commit khi có Git: `docs: record cancellation cutoff discussion`. Chưa commit/push.

### 2026-11-02 — Chốt hạn hủy 60 phút

- Người học chọn 60 phút. Đã cập nhật README, REQUIREMENTS, ROADMAP và INTERVIEW_PREP: khách hủy booking còn hiệu lực của mình khi còn ít nhất 60 phút, backend quyết định tại thời điểm xử lý. Đúng hạn được hủy, sau hạn từ chối và giữ nguyên booking/slot; admin hủy riêng không bị giới hạn này.
- Mentor cụ thể hóa ví dụ booking 19:00: 17:59:59 và 18:00 được hủy, 18:00:01 trở đi không được; giao diện hiển thị hạn hủy trước xác nhận đặt. Hệ quả: booking đặt khi còn dưới 60 phút vẫn được đặt nếu hợp lệ nhưng khách không thể tự hủy. Không thêm phí hủy/đặt cọc hoặc cấm đặt sát giờ.
- Giữ các câu trả lời/nhật ký cũ với chú thích đã bị thay thế, không viết lại lịch sử hiểu của người học. Chưa nâng mức hiểu từ việc chọn ngưỡng; FB-001 IN_PROGRESS.
- Kiểm tra thực sự: `rg` rà soát quy tắc hủy, `python3` assertion đồng bộ tài liệu và phép tính ranh giới 60 phút. Chưa có ứng dụng/test backend.
- Bước nhỏ tiếp theo: người học chốt nội dung/quyền xem ghi chú khách; mentor đề xuất chỉ admin xem/ghi, ghi sự việc cụ thể.
- Gợi ý commit khi có Git: `docs: require 60-minute notice for customer cancellation`. Chưa commit/push.

### 2026-11-02 — Thảo luận đổi giờ sau khi đặt sát giờ

- Người học nêu trường hợp 18:45 đặt 19:00 rồi muốn dời sang 19:30 vì không kịp đến. Chưa đồng ý hay từ chối đề xuất quyền xem ghi chú khách ở bước trước.
- Mentor đề xuất giữ bản đầu đơn giản: khách liên hệ admin để xem xét hủy riêng, sau đó khách đặt lại; chưa thêm API đổi giờ hay quyền admin đặt hộ. Đã ghi rõ rủi ro mất giờ mới giữa hai thao tác và không tự hủy lịch cũ nếu giờ mới không trống. Phương án đang thảo luận, chưa đổi quy tắc đã chốt.
- Nếu tự đổi giờ: cần chính sách chống lách hạn hủy và đổi slot nguyên tử; chưa chốt điều kiện/giá/lịch sử. Chưa triển khai.
- Đã kiểm tra bằng `python3` nội dung ghi nhận có trong REQUIREMENTS, INTERVIEW_PREP và PROGRESS; chưa có code/test backend. FB-001 IN_PROGRESS.
- Bước nhỏ tiếp theo: người học chọn xử lý qua admin trong bản đầu hay bổ sung tự đổi giờ với chính sách riêng.
- Gợi ý commit khi có Git: `docs: record last-minute rescheduling scenario`. Chưa commit/push.

### 2026-11-02 — Chốt đổi giờ qua admin và cảnh báo đặt sát giờ

- Người học chọn phương án liên hệ admin xem xét hủy ngoại lệ rồi khách đặt lại, kèm đúng câu cảnh báo đã đề xuất. Đã cập nhật README, REQUIREMENTS, ROADMAP và INTERVIEW_PREP; chưa thêm tự đổi giờ/admin đặt hộ/kênh hỗ trợ trong app.
- Mentor cụ thể hóa: kiểm tra toàn bộ khoảng mới, không tính slot đang thuộc booking cũ là tranh chấp với chính nó; nếu khoảng mới không hợp lệ thì giữ booking cũ. Hủy rồi đặt lại không nguyên tử, không bảo đảm giữ giờ mới; nếu đặt lại thua thì không tự khôi phục booking cũ, giá booking mới theo giá hiện hành.
- Cảnh báo xuất hiện trước xác nhận khi còn dưới 60 phút, đúng hạn chưa qua hạn; không cấm đặt sát giờ hoặc tạo thời gian ân hạn. Màn hình cần cập nhật cảnh báo nếu đang mở vượt hạn.
- Kiểm tra thực sự: `python3` assertion câu cảnh báo có trong README/REQUIREMENTS/ROADMAP, không còn mục đổi giờ ở trạng thái chờ chốt; đối chiếu phép tính trước/đúng/sau hạn. Chưa có UI/backend để chạy test. FB-001 IN_PROGRESS, mức hiểu không tự nâng từ lời giải mentor.
- Bước nhỏ tiếp theo: người học chốt nội dung/quyền xem ghi chú khách; đề xuất chỉ admin xem/ghi và ghi sự việc cụ thể.
- Gợi ý commit khi có Git: `docs: define admin-assisted rescheduling and late-booking warning`. Chưa commit/push.

### 2026-11-02 — Chốt ghi chú khách, chuyển FB-001 sang IN_REVIEW

- Người học đồng ý ghi chú chỉ admin xem/ghi và mô tả sự việc cụ thể. Đã đồng bộ README, REQUIREMENTS, ROADMAP; backend phải bảo vệ API và không trả ghi chú cho khách. Ghi chú không tự chặn đặt/khóa; không thêm tự chấm điểm hay tính năng mới.
- Đã rà soát FB-001 theo ROADMAP: có quyền, đầu vào/kết quả/nhóm lỗi đặt và hủy, quy tắc giá/thời gian, các ví dụ chồng lấn/tiếp giáp/hủy đặt lại. Chuyển IN_REVIEW, chưa DONE; chờ người học áp dụng ranh giới hủy 60 phút. Không đòi code/test ứng dụng cho ticket đặc tả.
- INTERVIEW_PREP ghi đúng xác nhận của người học, không tự nâng mức hiểu RBAC. Kiểm tra thực sự: `python3` assertion quy tắc ghi chú và trạng thái thống nhất, rà các dòng còn chờ chốt trong đặc tả. Chưa có ứng dụng để test quyền truy cập.
- Bước nhỏ tiếp theo: người học trả lời booking 19:00 tự hủy lúc đúng 18:00 và 18:01 có được không, kèm lý do.
- Gợi ý commit khi có Git: `docs: finalize FB-001 specification for review`. Chưa commit/push.

### 2026-11-02 — Nghiệm thu FB-001, bắt đầu FB-002

- Người học trả lời đúng: booking 19:00 hủy đúng 18:00 được, 18:01 không được; mentor bổ sung phép tính còn 60/59 phút. Đã cập nhật bằng chứng trong INTERVIEW_PREP, không tự nâng mức hiểu các phần chưa review.
- Đối chiếu tiêu chí ROADMAP: REQUIREMENTS có quyền, đầu vào/kết quả/lỗi đặt/hủy, quy tắc giá/thời gian và ví dụ tranh slot; đã review phần nghiệp vụ chính và ranh giới chính sách mới. FB-001 chuyển DONE; chưa có bằng chứng triển khai, không yêu cầu test ứng dụng cho ticket đặc tả.
- FB-002 IN_PROGRESS ở bước thảo luận quan hệ dữ liệu; chưa tạo DESIGN hay schema. FB-000 giữ IN_REVIEW, phần ôn cách kiểm chứng code AI theo dõi riêng.
- Đã kiểm tra bằng `python3`: trạng thái đặc tả/bảng tiến độ thống nhất, bằng chứng review có trong tài liệu; phép tính 19:00 trừ 18:00/18:01 tương ứng 60/59 phút. Chưa có code/test backend.
- Bước nhỏ tiếp theo: người học mô tả quan hệ User–Booking–Court theo số lượng liên kết, chưa viết schema.
- Gợi ý commit khi có Git: `docs: accept FB-001 requirements and record review evidence`. Chưa commit/push.

### 2026-11-02 — FB-002: quan hệ User–Booking

- Người học tự nêu: User có nhiều Booking, mỗi Booking chỉ thuộc một User. Mentor xác nhận đúng quan hệ một–nhiều; chưa có câu trả lời về Court–Booking hoặc thiết kế khóa ngoại.
- “Nhiều booking” là số lượng liên kết, mỗi lần đặt vẫn phải thỏa quy tắc nghiệp vụ; chưa thêm giới hạn số booking mỗi khách hoặc quy tắc chống trùng lịch cá nhân.
- Đã cập nhật INTERVIEW_PREP theo câu trả lời thực tế, giữ G1-04 Cần ôn và FB-002 IN_PROGRESS. Chưa tạo schema/DESIGN hoặc viết code thay người học.
- Kiểm tra: assertion `python3` xác nhận ghi nhận quan hệ và bước tiếp theo trong tài liệu; chưa có test ứng dụng.
- Bước nhỏ tiếp theo: người học mô tả quan hệ Court–Booking theo số lượng liên kết.
- Gợi ý commit khi có Git: `docs: record User–Booking relationship review`. Chưa commit/push.

### 2026-11-02 — FB-002: thảo luận chống chiếm chỗ

- Người học tạm dừng câu Court–Booking để nêu rủi ro một tài khoản đặt kín lịch rồi không đến, đề xuất giới hạn. Mentor làm rõ cửa sổ đặt chỉ hôm nay đến hôm nay + 7 ngày, nhưng rủi ro vẫn tồn tại.
- Đã ghi mục đề xuất tại REQUIREMENTS và câu trả lời thực tế tại INTERVIEW_PREP. Ngưỡng 3 booking tương lai chưa hủy do mentor đề xuất, chưa chốt; số booking không tự giới hạn thời lượng, nhiều tài khoản có thể lách giới hạn mỗi tài khoản. Chưa thay README/ROADMAP hoặc đánh dấu rủi ro đã giải quyết.
- Nếu chốt cần cập nhật phạm vi và thiết kế bảo vệ trước request đồng thời cùng tài khoản. Không tự thêm đặt cọc/xác minh điện thoại/trạng thái no-show.
- Kiểm tra: `python3` assertion đề xuất được ghi rõ chưa chốt; chưa có code/test ứng dụng. FB-002 IN_PROGRESS, nghiệm thu FB-001 trước đó phản ánh phạm vi tại thời điểm nghiệm thu.
- Bước nhỏ tiếp theo: người học phản hồi đề xuất giới hạn giữ chỗ; Court–Booking còn chờ.
- Gợi ý commit khi có Git: `docs: record booking-hoarding risk and quota proposal`. Chưa commit/push.

### 2026-11-02 — FB-002: chốt giới hạn 3 booking tương lai

- Người học đồng ý đề xuất tối đa 3 booking chưa hủy có giờ bắt đầu trong tương lai mỗi tài khoản khách. Chưa chọn thời lượng tối đa, không tự suy ra ngưỡng. Đã cập nhật README, REQUIREMENTS, ROADMAP và ghi nguồn xác nhận trong INTERVIEW_PREP.
- Chốt cách đếm theo thời điểm backend xử lý; hủy thành công hoặc booking bắt đầu thì không còn tính. Đủ 3 từ chối đặt thêm, không giữ slot. Cần bảo vệ request đồng thời cùng tài khoản; chưa chốt cơ chế/mã HTTP hoặc viết code.
- Thêm kịch bản nghiệm thu sau này: có 2 booking tương lai, hai request hợp lệ đồng thời đặt sân/giờ khác nhau chỉ thêm được tối đa 1. Không coi giới hạn mỗi tài khoản là đã ngăn được nhiều tài khoản hoặc booking quá dài.
- Kiểm tra: assertion `python3` xác nhận ngưỡng/cách đếm có trong tài liệu và thời lượng vẫn chưa chốt. Chưa có test backend/PostgreSQL. FB-002 IN_PROGRESS; FB-001 DONE là nghiệm thu đặc tả trước đó, bổ sung này được ghi rõ.
- Bước nhỏ tiếp theo: người học chọn thời lượng tối đa mỗi booking, chưa viết schema.
- Gợi ý commit khi có Git: `docs: cap future uncancelled bookings at three per customer`. Chưa commit/push.

### 2026-11-02 — FB-002: mentor đề xuất thời lượng tối đa

- Người học cho biết chưa từng đi đá bóng/vận hành sân và yêu cầu đề xuất. Mentor đề xuất tối đa 120 phút, lựa chọn 30/60/90/120; chưa tự coi là quyết định đã chốt hoặc cập nhật README/ROADMAP.
- Tra cứu web thực sự: điều khoản Liget+ mục 6.6.1(b) có khoảng đặt 30–120 phút, mẫu đặt sân định kỳ Banks O’ Dee có 60/90/120 phút; liên kết và giới hạn suy luận ghi trong REQUIREMENTS. Ví dụ nước ngoài không chứng minh chuẩn vận hành Việt Nam hoặc hiệu quả chống lạm dụng.
- Lý do đề xuất: giữ độ linh hoạt nhưng giới hạn thời gian một booking; 3 booking × 120 phút = 360 phút giữ chỗ tương lai mỗi tài khoản nếu chốt ngưỡng này, không phải hạn mức mỗi ngày. Chưa giải quyết nhiều tài khoản.
- Kiểm tra: assertion `python3` đề xuất có nhãn chưa chốt và hai nguồn được ghi lại; chưa có code/test ứng dụng. FB-002 IN_PROGRESS.
- Bước nhỏ tiếp theo: người học phản hồi đề xuất 120 phút.
- Gợi ý commit khi có Git: `docs: propose a two-hour booking duration limit`. Chưa commit/push.

### 2026-11-02 — FB-002: chốt tối đa 120 phút mỗi booking

- Người học đồng ý đề xuất 120 phút; cập nhật README, REQUIREMENTS, ROADMAP và nguồn xác nhận trong INTERVIEW_PREP. Cho chọn 30/60/90/120 phút, không thêm ngoại lệ vượt ngưỡng. Giữ giờ hoạt động, cửa sổ đặt, quy tắc hủy và giới hạn 3 booking tương lai.
- Mentor cụ thể hóa backend từ chối thời lượng sai, không tạo booking/giữ slot; UI chỉ cho bốn lựa chọn. Ví dụ 120 phút: 20:00–22:00 hợp lệ về giờ hoạt động, 20:30–22:30 không hợp lệ. 3 × 120 = 360 phút giữ chỗ tương lai mỗi tài khoản, không phải hạn mức mỗi ngày và không bảo đảm chống nhiều tài khoản.
- Kiểm tra thực sự: assertion `python3` đối chiếu quy tắc 120 phút trong các tài liệu, không còn nhãn thời lượng chờ chốt ở đặc tả/phần bàn giao; tính 3 × 120 và hai ví dụ giờ kết thúc. Chưa có code/test backend. FB-002 IN_PROGRESS, mức hiểu không tự nâng từ xác nhận lựa chọn.
- Bước nhỏ tiếp theo: người học mô tả quan hệ Court–Booking theo số lượng liên kết; User–Booking một–nhiều đã review đúng.
- Gợi ý commit khi có Git: `docs: limit each booking to 120 minutes`. Chưa commit/push.

### 2026-11-02 — FB-002: quan hệ Court–Booking và ERD ban đầu

- Người học tự nêu một Court có nhiều Booking, mỗi Booking thuộc đúng một Court; đúng quan hệ một–nhiều. Kết hợp User–Booking và phần giữ lịch sử đã review, G1-04 chuyển Đã giải thích được ở mức quan hệ/nghiệp vụ; chưa xác nhận hiểu khóa ngoại/cơ chế triển khai.
- Mentor tạo DESIGN.md với hai quan hệ Mermaid và danh sách phần thiết kế còn thiếu; cụ thể hóa 0 hoặc nhiều vì User/Court có thể chưa có booking. Chưa chốt khóa ngoại, không viết schema/API thay người học.
- Kiểm tra thực sự: assertion `python3` đối chiếu hai cạnh Mermaid với câu trả lời, trạng thái G1-04 và liên kết/bằng chứng tiến độ. Chưa render sơ đồ bằng công cụ, chưa có migration/test ứng dụng. FB-002 IN_PROGRESS.
- Bước nhỏ tiếp theo: người học đề xuất bảng chứa khóa ngoại nối Booking với User/Court và tên trường.
- Gợi ý commit khi có Git: `docs: sketch User Court Booking relationships`. Chưa commit/push.

### 2026-11-02 — FB-002: khóa ngoại User trong Booking

- Người học tự xác định đặt `userId` ở Booking, giải thích đúng quan hệ một–nhiều. Mentor cụ thể hóa tham chiếu `User.id`, bắt buộc theo quan hệ hiện có; chưa chốt kiểu ID/hành vi xóa/migration.
- Cập nhật DESIGN và bằng chứng hiểu trong INTERVIEW_PREP. Khóa ngoại không tự bảo vệ giới hạn 3 booking hoặc quyền sở hữu; chưa coi là đã triển khai các quy tắc đó.
- Kiểm tra: assertion `python3` xác nhận vị trí/tên/tham chiếu được ghi trong DESIGN và bước tiếp theo trong PROGRESS; chưa có code/test database. FB-002 IN_PROGRESS.
- Bước nhỏ tiếp theo: người học đề xuất vị trí/tên khóa ngoại Court và đích tham chiếu.
- Gợi ý commit khi có Git: `docs: define booking user foreign key`. Chưa commit/push.

### 2026-11-02 — FB-002: khóa ngoại Court ở phía nhiều

- Người học tự giải thích đúng mỗi Booking có một Court, mỗi Court có nhiều Booking nên khóa ngoại ở phía nhiều (Booking). Mentor bổ sung `courtId` tham chiếu `Court.id`, không ghi tên/đích là phần người học tự trả lời.
- DESIGN ghi hai liên kết và thêm trường FK vào Mermaid bằng kiểu ID placeholder, chưa chốt kiểu dữ liệu/schema/migration. INTERVIEW_PREP lưu đúng bằng chứng hiểu, chưa nâng mức hiểu triển khai.
- Kiểm tra: assertion `python3` đối chiếu hai FK và bước tiếp theo; chưa render Mermaid hoặc chạy test database. FB-002 IN_PROGRESS.
- Bước nhỏ tiếp theo: người học đề xuất thông tin thời gian Booking cần lưu, tên trường/cách biểu diễn bằng lời.
- Gợi ý commit khi có Git: `docs: define booking court foreign key`. Chưa commit/push.

### 2026-11-02 — FB-002: mentor đề xuất dữ liệu thời gian

- Người học yêu cầu đề xuất trực tiếp. Mentor bổ sung DESIGN: startAt/endAt/createdAt, backend tính endAt từ thời lượng 30/60/90/120; không lưu thêm durationMinutes riêng, suy ra từ hai thời điểm. Lưu UTC, kiểm tra/hiển thị giờ Việt Nam, createdAt do server/DB gán.
- Có ví dụ ngày 03/11/2026 19:00–20:30 Việt Nam = 12:00–13:30 UTC, 90 phút/3 slot; hạn hủy dựa startAt, không dựa createdAt. Trường hủy xem xét cùng trạng thái ở bước sau. Chưa chốt kiểu cột PostgreSQL/Prisma hoặc triển khai.
- INTERVIEW_PREP ghi rõ nguồn mentor, không nâng mức hiểu. FB-002 IN_PROGRESS.
- Kiểm tra thực sự: `python3` tính ví dụ UTC+7 → UTC, 90 phút/3 slot và hạn 18:00 Việt Nam; assertion ba trường có trong DESIGN. Chưa có test backend/database.
- Bước nhỏ tiếp theo: người học đề xuất trạng thái Booking cho đặt thành công/hủy.
- Gợi ý commit khi có Git: `docs: propose booking time fields`. Chưa commit/push.

### 2026-11-02 — FB-002: đề xuất trọn phần trạng thái để duyệt

- Người học yêu cầu mentor đề xuất để chỉ duyệt phần trạng thái. Đã bổ sung DESIGN với CONFIRMED/CANCELLED, cancelledAt và cancelledById, chuyển trạng thái một chiều khi hủy, giữ người đặt ban đầu và lịch sử, hủy/giải phóng slot nguyên tử.
- Đề xuất suy ra sắp tới/đang diễn ra/đã kết thúc từ startAt/endAt thay vì lưu COMPLETED; không có pending thanh toán/no-show/tác vụ nền đổi trạng thái. Đã kết thúc không chứng minh đã đến hay trả tiền. Hạn mức 3 chỉ đếm CONFIRMED có startAt > now.
- Phương án đang chờ duyệt; INTERVIEW_PREP ghi đúng nguồn mentor, không nâng mức hiểu. Không tự thêm trường lý do hủy bắt buộc. FB-002 IN_PROGRESS.
- Kiểm tra: assertion `python3` các trường/trạng thái có trong DESIGN; phép kiểm tra ví dụ nhãn trước/đúng startAt/đúng endAt và loại CANCELLED khỏi hạn mức. Đây chỉ là phép kiểm tra phương án, chưa có code/test backend hoặc migration.
- Bước nhỏ tiếp theo: người học duyệt trọn phương án trạng thái/thông tin hủy.
- Gợi ý commit khi có Git: `docs: propose booking status and cancellation metadata`. Chưa commit/push.

### 2026-11-02 — FB-002: duyệt trạng thái và thông tin hủy

- Người học xác nhận duyệt phương án CONFIRMED/CANCELLED, cancelledAt/cancelledById và nhãn thời gian suy ra. DESIGN đổi từ chờ duyệt sang đã duyệt; không thêm trạng thái hoặc mở rộng nghiệp vụ.
- INTERVIEW_PREP ghi rõ xác nhận thiết kế do mentor cung cấp; chưa nâng mức hiểu chuyển trạng thái/transaction từ câu duyệt. FB-002 IN_PROGRESS, chưa có schema/migration/API.
- Kiểm tra thực sự: assertion `python3` trạng thái duyệt trong DESIGN và bước tiếp theo trong PROGRESS; chưa có test backend/database.
- Bước nhỏ tiếp theo: người học đề xuất thông tin giá ở Court/Booking để giữ giá lịch sử khi admin cập nhật giá sân.
- Gợi ý commit khi có Git: `docs: approve booking status and cancellation metadata`. Chưa commit/push.

### 2026-11-02 — FB-002: nguồn giá Court và snapshot Booking

- Người học nêu admin sửa giá Court, Booking lấy nguồn từ Court. Mentor xác nhận đúng nguồn và làm rõ thời điểm: đọc khi tạo, lưu bản sao trong Booking; khi xem booking cũ dùng bản sao, không tính theo Court hiện tại. Không suy diễn câu trả lời thành quyết định tính giá động.
- DESIGN thêm phương án Court.pricePerSlot, Booking.pricePerSlot/totalPrice; chưa được duyệt riêng, chưa chốt kiểu tiền/validation. Ví dụ 150.000 × 3 = 450.000, sau đổi Court lên 175.000 booking cũ giữ nguyên, booking mới 90 phút là 525.000. Giữ giá khi hủy, không gọi tổng giá là tiền đã thu.
- INTERVIEW_PREP ghi đúng phần người học/mentor; G1-05 giữ mức theo bằng chứng trước. FB-002 IN_PROGRESS.
- Kiểm tra: assertion `python3` ba trường có trong DESIGN và phép tính giá cũ/mới; chưa có test backend/database hoặc kiểm chứng đổi giá đồng thời.
- Bước nhỏ tiếp theo: người học xác nhận phương án snapshot giá trước khi chốt kiểu tiền.
- Gợi ý commit khi có Git: `docs: clarify court pricing and booking price snapshots`. Chưa commit/push.

### 2026-11-02 — FB-002: duyệt giá lịch sử

- Người học hỏi xác nhận giá Court tăng không đổi dữ liệu Booking cũ, rồi đồng ý sau giải thích. Chốt phương án Court.pricePerSlot và snapshot Booking.pricePerSlot/totalPrice; dữ liệu giá booking cũ giữ nguyên, giá mới chỉ cho booking tạo sau theo nguồn giá lúc đặt.
- DESIGN chuyển phần giá từ chờ review sang đã duyệt. INTERVIEW_PREP ghi đúng nguồn phương án mentor và câu xác nhận người học; không tự nâng mức hiểu kiểu tiền/schema. Chưa chốt kiểu tiền, validation hoặc triển khai.
- Kiểm tra: assertion `python3` nhãn đã duyệt và bước tiếp theo thống nhất; chưa có test backend/database. FB-002 IN_PROGRESS.
- Bước nhỏ tiếp theo: chốt kiểu dữ liệu tiền và validation.
- Gợi ý commit khi có Git: `docs: approve booking price snapshots`. Chưa commit/push.

### 2026-11-02 — FB-002: duyệt số nguyên VND

- Người học đồng ý lưu tiền bằng số nguyên VND, ví dụ 150000 là 150.000đ. DESIGN ghi áp dụng cho giá Court và hai trường giá lịch sử Booking; không dùng số thực làm dữ liệu tiền chuẩn.
- Chưa chọn kiểu cột PostgreSQL/Prisma hoặc tự thêm ngưỡng giá. Giá 0/giới hạn trên còn cần chốt; tổng giá tối đa 4 slot phải nằm trong miền biểu diễn/tính toán chính xác. Chưa có schema/validation thực thi.
- INTERVIEW_PREP ghi đúng xác nhận lựa chọn mentor cung cấp, không tự nâng mức hiểu. FB-002 IN_PROGRESS.
- Kiểm tra: assertion `python3` đơn vị VND/ba trường giá và bước tiếp theo thống nhất; chưa có test backend/database.
- Bước nhỏ tiếp theo: người học chốt giá mỗi slot có cho bằng 0 hay phải lớn hơn 0.
- Gợi ý commit khi có Git: `docs: use integer VND for court and booking prices`. Chưa commit/push.

### 2026-11-02 — FB-002: làm rõ slot và chốt giá mỗi slot > 0

- Người học hỏi slot/trường nằm ở bảng nào. Mentor giải thích slot là khoảng cơ sở 30 phút, pricePerSlot là giá Court và bản sao Booking; bảng lưu chiếm slot vẫn chưa thiết kế. Sau giải thích người học xác nhận hiểu và đồng ý giá phải > 0.
- Đồng bộ README, DESIGN, ROADMAP và ghi nhận thực tế trong INTERVIEW_PREP: giá nguyên VND > 0, không nhận 0/âm/phần lẻ đồng hoặc sai kiểu. Tổng giá backend tính × số slot 1–4 cũng > 0; chưa thêm ràng buộc hay viết code.
- Chưa chọn kiểu cột/giới hạn trên, chưa coi xác nhận là hiểu cơ chế bảng slot/validation DB. FB-002 IN_PROGRESS.
- Kiểm tra thực sự: assertion `python3` quy tắc giá dương có trong README/DESIGN/ROADMAP và bước tiếp theo cập nhật; chưa có test backend/database.
- Bước nhỏ tiếp theo: xem xét đề xuất kiểu cột và giới hạn trên tiền để tránh vượt miền biểu diễn.
- Gợi ý commit khi có Git: `docs: require positive integer VND slot prices`. Chưa commit/push.

### 2026-11-02 — FB-002: chọn kiểu cột tiền và trần kỹ thuật

- Người học yêu cầu mentor làm tiếp. Đã tra tài liệu chính thức PostgreSQL về miền integer và Prisma về ánh xạ Int → integer, ghi liên kết trong DESIGN; không chốt phiên bản/cài dependency.
- Chọn cả ba cột tiền PostgreSQL integer/Prisma Int. Giới hạn kỹ thuật mỗi slot 1–536870911 = floor(2147483647/4); tổng 4 slot tối đa 2147483644. Không tự đề xuất giá bán thị trường. README/REQUIREMENTS/ROADMAP đồng bộ phạm vi, DESIGN mô tả validation và CHECK cần triển khai.
- Kiểm tra thực sự: `python3` đối chiếu bốn tài liệu, phép chia lấy phần nguyên, các giá trị biên và hệ số 1–4; chưa có database/schema/migration, nên không có bằng chứng SQL CHECK hoặc test API. Không dùng phép tính minh họa làm bằng chứng DB đã bảo vệ.
- INTERVIEW_PREP ghi rõ đây là lựa chọn kỹ thuật mentor thực hiện theo yêu cầu, không nâng mức hiểu người học. FB-002 IN_PROGRESS.
- Bước nhỏ tiếp theo: người học đề xuất cách liên kết Court với chi nhánh/địa điểm.
- Gợi ý commit khi có Git: `docs: specify integer VND bounds and price validation`. Chưa commit/push.

### 2026-11-02 — FB-002: chọn bảng riêng cho chi nhánh

- Người học tự đề xuất bảng chi nhánh riêng liên kết Court. Đã ghi vào DESIGN; mentor đề xuất tên code Branch và giải thích dùng định danh nhóm chung, tránh lặp tên trên Court. Chưa chốt số lượng liên kết, trường hay FK thay người học.
- Giữ địa chỉ Court và quyền admin toàn hệ thống theo phạm vi hiện hành; không tự thêm chủ sân/quyền theo chi nhánh hoặc chuyển địa chỉ giữa bảng.
- INTERVIEW_PREP ghi đúng phần người học tự đề xuất. FB-002 IN_PROGRESS.
- Kiểm tra thực sự: assertion `python3` lựa chọn bảng riêng có trong DESIGN và bước tiếp theo trong PROGRESS; chưa có schema/migration/test database.
- Bước nhỏ tiếp theo: người học xác định số lượng liên kết Branch–Court và phía đặt khóa ngoại.
- Gợi ý commit khi có Git: `docs: model branches as separate court groups`. Chưa commit/push.

### 2026-11-02 — FB-002: quan hệ Branch–Court

- Người học tự trả lời đúng Branch có nhiều Court, mỗi Court thuộc một Branch, khóa ngoại ở Court. Mentor cụ thể hóa Court.branchId → Branch.id, bắt buộc theo quan hệ; chi nhánh mới có thể chưa có Court.
- Cập nhật cạnh và trường FK trong Mermaid DESIGN; kiểu ID vẫn placeholder, hành vi xóa/cập nhật chưa chốt. INTERVIEW_PREP ghi nhận khả năng vận dụng quan hệ một–nhiều, phân biệt tên trường do mentor bổ sung.
- Kiểm tra thực sự: assertion `python3` cạnh Branch–Court, trường branchId và đích tham chiếu có trong DESIGN, bước tiếp theo cập nhật. Chưa render sơ đồ/chạy migration/test database. FB-002 IN_PROGRESS.
- Bước nhỏ tiếp theo: người học đề xuất thông tin tối thiểu cho Branch/Court ngoài id/khóa ngoại/giá đã có.
- Gợi ý commit khi có Git: `docs: define branch court relationship`. Chưa commit/push.

### 2026-11-02 — FB-002: đề xuất bộ trường Branch/Court

- Theo yêu cầu người học, mentor bổ sung DESIGN với Branch(id/name/createdAt/updatedAt), Court(id/branchId/name/address/pricePerSlot/isActive/createdAt/updatedAt). Đề xuất tối thiểu, đang chờ duyệt; không thêm ảnh/loại sân/giờ riêng hoặc trạng thái chi nhánh.
- Giữ địa chỉ Court, không tạo hai nguồn địa chỉ Branch/Court; isActive=false chỉ chặn đặt mới, giữ lịch sử/booking cũ. Metadata thời điểm do server/DB gán, UTC; chưa thay thế lịch sử audit. Quy tắc độ dài/trùng tên, kiểu ID và FK vẫn cần chốt.
- INTERVIEW_PREP ghi đúng nguồn mentor, không nâng mức hiểu. FB-002 IN_PROGRESS, chưa có schema/code.
- Kiểm tra thực sự: assertion `python3` các trường đề xuất và nhãn chờ duyệt có trong DESIGN, PROGRESS có bước duyệt. Chưa render sơ đồ/chạy test database.
- Bước nhỏ tiếp theo: người học duyệt bộ trường Branch/Court.
- Gợi ý commit khi có Git: `docs: propose minimal branch and court fields`. Chưa commit/push.

### 2026-11-02 — FB-002: sửa địa chỉ về Branch theo phản biện người học

- Người học hỏi address nên nằm ở chi nhánh. Mentor ghi nhận đề xuất trước để ở Court gây lặp dữ liệu khi các sân cùng địa điểm; sửa DESIGN thành Branch.address, bỏ Court.address, Court hiển thị địa chỉ qua branchId.
- Đồng bộ README/REQUIREMENTS/ROADMAP để phân biệt hiển thị địa chỉ cho sân với nơi lưu địa chỉ chung; không thêm ngoại lệ địa chỉ riêng cho Court. Bộ trường còn lại vẫn chờ duyệt, không coi câu phản biện là đã duyệt tất cả.
- INTERVIEW_PREP ghi đúng phản biện của người học; chưa có schema/migration/test. FB-002 IN_PROGRESS.
- Kiểm tra thực sự: assertion `python3` bảng Branch có address, bảng Court không có address, mô tả lấy qua branchId và các tài liệu liên quan khớp. Chưa có test database/API.
- Bước nhỏ tiếp theo: người học duyệt bộ trường Branch/Court đã sửa.
- Gợi ý commit khi có Git: `docs: store shared court address on branch`. Chưa commit/push.

### 2026-11-02 — FB-002: duyệt Branch/Court, đề xuất User

- Người học duyệt bộ trường Branch/Court đã sửa address về Branch. DESIGN chuyển mục sang đã duyệt, không coi đồng ý là tự giải thích schema/validation.
- Mentor đề xuất khung User để duyệt một lượt: id/name/email/passwordHash/role, hai cờ isBookingBlocked/isLocked độc lập với lý do gần nhất và timestamps. Email làm định danh đăng nhập là đề xuất chưa chốt; không thêm phone/refresh token/soft-delete.
- Ghi rõ reason gần nhất không phải lịch sử đầy đủ, ghi chú khách là nhu cầu riêng; cách lưu ghi chú/lịch sử mọi thao tác cần chốt ở bước sau. Chưa coi khung User là schema đáp ứng xong toàn bộ nghiệp vụ.
- Kiểm tra: assertion `python3` Branch/Court đã duyệt, khung User chờ duyệt và bước tiếp theo khớp. Chưa có schema/migration/test database. FB-002 IN_PROGRESS.
- Bước nhỏ tiếp theo: người học duyệt khung trường User.
- Gợi ý commit khi có Git: `docs: approve branch court fields and propose user fields`. Chưa commit/push.

### 2026-11-02 — FB-002: xem xét bỏ mức khóa tài khoản

- Người học hỏi lý do chặn/khóa rồi nhận xét chỉ cần chặn và yêu cầu đánh giá mức khóa có dư không. Mentor khuyến nghị bản đầu chỉ chặn đặt mới, vì đáp ứng nhu cầu ngăn giữ thêm chỗ và cho phép khách xem/hủy booking hợp lệ; chưa có nhu cầu cốt lõi riêng cấm toàn bộ API cá nhân.
- Đã ghi đề xuất và tác động cần sửa trong DESIGN; chưa tự đổi README/REQUIREMENTS/ROADMAP hoặc coi đã chốt bỏ khóa. isLocked/lockReason vẫn thuộc phương án User chưa duyệt, cần loại bỏ nếu chính sách đổi được chốt. Không thêm case bảo mật do mentor tự nêu vào phạm vi.
- INTERVIEW_PREP ghi đây là phản biện phạm vi, không phải mất hiểu biết về hai hạn chế độc lập trước đó. FB-002 IN_PROGRESS, chưa có schema/code/test.
- Kiểm tra: assertion `python3` mục xem xét có nhãn chưa chốt, bước tiếp theo thống nhất. Chưa có test ứng dụng.
- Bước nhỏ tiếp theo: người học chốt chỉ chặn đặt mới và bỏ mức khóa tài khoản.
- Gợi ý commit khi có Git: `docs: review account restriction scope`. Chưa commit/push.

### 2026-11-02 — FB-002: chốt chỉ chặn đặt mới, bỏ khóa tài khoản

- Người học xác nhận rõ bỏ mức khóa. Đã sửa README, REQUIREMENTS, DESIGN và ROADMAP: bỏ trường isLocked/lockReason, API/UI khóa/mở khóa và các tiêu chí/test dành cho khóa.
- Giữ chặn/mở chặn đặt thủ công kèm lý do mọi lần, quyền đăng nhập/xem/hủy hợp lệ, booking và lịch sử; backend đọc trạng thái chặn hiện hành khi tạo booking, kể cả token cấp trước khi chặn. Giữ hạn hủy 60 phút, tối đa 3 booking tương lai và 120 phút/booking.
- Các mục lịch sử review/nhật ký cũ giữ nguyên với chú thích đã thay đổi chính sách. INTERVIEW_PREP ghi đúng quyết định đơn giản hóa của người học, không tự nâng mức hiểu cơ chế. Khung User còn lại chưa duyệt toàn bộ.
- Kiểm tra thực sự: `rg` rà nội dung về khóa, assertion `python3` khung User không còn hai trường khóa, bảng hạn chế chỉ còn hai trạng thái chặn/không chặn và ROADMAP không còn yêu cầu test khóa. Chưa có schema/migration/API để test; FB-002 IN_PROGRESS.
- Bước nhỏ tiếp theo: người học duyệt khung User đã sửa.
- Gợi ý commit khi có Git: `docs: simplify account restrictions to booking blocks`. Chưa commit/push.

### 2026-11-02 — FB-002: duyệt User, bổ sung refresh token

- Người học duyệt khung User sau khi bỏ mức khóa và yêu cầu thêm refresh token. Đã cập nhật README/REQUIREMENTS/ROADMAP để đưa refresh/logout vào phạm vi và bỏ quyết định hoãn refresh, không xin lại quyền thêm chức năng.
- DESIGN ghi phương án mentor để duyệt chi tiết: access JWT 15 phút, refresh ngẫu nhiên trong HttpOnly cookie 7 ngày tuyệt đối, rotation, hash token trong bảng RefreshToken riêng với nhóm phiên; phát hiện reuse và thu hồi nhóm, logout. Chưa coi TTL/cookie/schema đã được người học chọn.
- Nêu rõ logout chỉ chặn refresh còn access đã cấp có thể còn hiệu lực đến hết hạn; chặn đặt không chặn refresh, vẫn phải kiểm tra trạng thái hiện hành. Ghi nhận việc phải chốt CSRF, race/retry/mất phản hồi/nhiều tab trước triển khai, chưa cam kết đã xử lý.
- Đã tra nguồn chính thức RFC 9700 và OWASP Session Management, liên kết trong DESIGN; không coi app là OAuth server. Assertion `python3` xác nhận User đã duyệt, scope refresh không còn bị loại khỏi README, FB-004/009 có phạm vi kiểm tra mới. Chưa có code/schema/test backend. Cần đánh giá lại ước lượng sau chốt chi tiết, chưa tự ghi số giờ.
- INTERVIEW_PREP ghi đúng phần người học yêu cầu/phần mentor đề xuất, không tự nâng mức hiểu. FB-002 IN_PROGRESS.
- Bước nhỏ tiếp theo: người học review phương án refresh token.
- Gợi ý commit khi có Git: `docs: add refresh token scope and session design proposal`. Chưa commit/push.

### 2026-11-02 — FB-002: duyệt refresh cơ bản

- Người học đồng ý phương án đã trình bày: access JWT 15 phút, refresh 7 ngày tuyệt đối từ lúc đăng nhập, rotation, cookie HttpOnly và bảng riêng chỉ lưu hash, logout thu hồi refresh phiên hiện tại. Đã cập nhật DESIGN/README/REQUIREMENTS, ghi rõ access đã cấp có thể còn hiệu lực tối đa 15 phút sau logout.
- Không tự coi chi tiết nhóm phiên/reuse/nhiều tab, cookie/CSRF hoặc tên trường bảng đã được review đầy đủ; tiếp tục hoàn thiện trước schema/API. INTERVIEW_PREP ghi đây là xác nhận thiết kế mentor cung cấp, không nâng mức hiểu.
- Kiểm tra thực sự: assertion `python3` thời hạn/rotation và nhãn đã duyệt đồng bộ ba tài liệu, bước tiếp theo trong PROGRESS cập nhật. Chưa có code/schema/migration/test auth. FB-002 IN_PROGRESS.
- Mentor đã bổ sung đề xuất CustomerNote (ghi chú từng sự việc) và BookingBlockHistory (admin/action/reason/thời điểm), chỉ admin truy cập; chờ người học duyệt, chưa thêm schema. Assertion kiểm tra hai mục bảng có trong DESIGN.
- Bước nhỏ tiếp theo: người học duyệt hai bảng ghi chú/lịch sử chặn.
- Gợi ý commit khi có Git: `docs: approve basic refresh token lifecycle`. Chưa commit/push.

### 2026-11-02 — FB-002: ghi chú ngoài app, giữ BookingBlockHistory

- Sau trao đổi/tracing, người học xác định CustomerNote có thể quản lý bằng app khác, BookingBlockHistory giữ trong hệ thống. Đã cập nhật README/REQUIREMENTS/DESIGN/ROADMAP: bỏ bảng/API/UI ghi chú, giữ lịch sử chặn/mở chặn nội bộ. Không chọn hay tích hợp app ngoài.
- DESIGN cụ thể hóa lịch sử gồm id/userId/actorId/action/reason/createdAt; chỉ admin truy cập, thêm tự động khi thao tác thành công, không có API sửa/xóa riêng. Không cần noteId, không thêm dòng lịch sử khi khách bị từ chối đặt. Trạng thái/lý do User cùng dòng lịch sử phải cập nhật nguyên tử; API lặp/concurrency còn phải chốt.
- INTERVIEW_PREP ghi đúng thay đổi phạm vi người học quyết định, không tự nâng mức hiểu transaction/FK. Lịch sử trao đổi trước về CustomerNote giữ làm bằng chứng cũ, không còn là phạm vi hiện hành. FB-002 IN_PROGRESS.
- Kiểm tra thực sự: `rg` rà nội dung ghi chú, assertion `python3` bảng thiết kế CustomerNote không còn, BookingBlockHistory đủ trường và ROADMAP không còn chức năng ghi chú trong app. Chưa có schema/migration/API/test database.
- Bước nhỏ tiếp theo: người học đề xuất cách lưu các slot 30 phút bị booking chiếm để database bảo vệ chồng lấn.
- Gợi ý commit khi có Git: `docs: keep booking block history and remove customer notes scope`. Chưa commit/push.

### 2026-11-02 — FB-002: xem lại lý do chặn sau khi mở chặn

- Người học hỏi lý do có cần tham chiếu BookingBlockHistory và vì sao trường reason vẫn còn sau mở chặn. Mentor ghi nhận khung trước giữ lý do gần nhất dễ gây nhầm với lý do chặn hiện hành.
- Đề xuất chỉ giữ User.isBookingBlocked, bỏ User.bookingBlockReason; lý do từng lần BLOCK/UNBLOCK lưu trên lịch sử, history.userId đã nối với User nên chưa cần FK ngược. Mở chặn đổi cờ + thêm UNBLOCK nguyên tử, không xóa lý do BLOCK cũ. Đề xuất chưa chốt, chưa sửa khung User/quy tắc transaction hiện hành.
- DESIGN ghi rõ cách hiển thị không dùng lý do UNBLOCK như lý do đang bị chặn; truy vấn thứ tự sự kiện/index/request đồng thời còn phải thiết kế, chưa có code. INTERVIEW_PREP ghi phản biện thực tế, không tự nâng mức hiểu triển khai. FB-002 IN_PROGRESS.
- Kiểm tra: assertion `python3` đề xuất có nhãn chờ duyệt và bước tiếp theo thống nhất; chưa có schema/migration/test database.
- Bước nhỏ tiếp theo: người học duyệt bỏ trường lý do trùng trên User; thiết kế slot còn chờ.
- Gợi ý commit khi có Git: `docs: review booking block reason storage`. Chưa commit/push.

### 2026-11-02 — FB-002: duyệt bỏ bookingBlockReason trên User

- Người học đồng ý phương án chỉ giữ User.isBookingBlocked, lý do từng lần BLOCK/UNBLOCK lưu trên BookingBlockHistory.reason. Đã bỏ trường lý do trong khung User và sửa quy tắc transaction/mô tả liên quan ở README/REQUIREMENTS/DESIGN/ROADMAP.
- Mở chặn đặt cờ false và thêm UNBLOCK kèm lý do, không xóa lý do BLOCK cũ khỏi lịch sử. Không thêm FK ngược từ User hoặc liên kết noteId. Kiểm tra đặt dựa trên cờ hiện hành, không cần đọc lịch sử mỗi lần.
- INTERVIEW_PREP ghi đúng xác nhận sau phản biện, không tự nâng mức hiểu implementation. FB-002 IN_PROGRESS, chưa có schema/migration/API.
- Kiểm tra thực sự: assertion `python3` bảng User không còn bookingBlockReason, lịch sử có reason, không còn quy tắc cập nhật lý do gần nhất trên User trong tài liệu hiện hành. Chưa có test database.
- Bước nhỏ tiếp theo: người học đề xuất cách lưu từng slot 30 phút bị booking chiếm để chống chồng lấn.
- Gợi ý commit khi có Git: `docs: keep booking block reasons only in history`. Chưa commit/push.

### 2026-11-02 — Tạm dừng theo yêu cầu người học tại FB-002

- Người học yêu cầu tạm dừng; đã lưu điểm bàn giao, không giao thêm bài hoặc tiếp tục thiết kế trong lúc nghỉ.
- Đã có trong tài liệu: quan hệ User–Booking, Court–Booking, Branch–Court; khóa ngoại ban đầu; bộ trường Branch/Court (địa chỉ ở Branch), User chỉ chặn đặt mới; bỏ CustomerNote, giữ BookingBlockHistory, lý do chỉ trên lịch sử, User không còn bookingBlockReason/isLocked/lockReason.
- Booking có phương án startAt/endAt/createdAt, trạng thái CONFIRMED/CANCELLED và thông tin hủy; giá lịch sử đã duyệt, tiền số nguyên VND dương với kiểu integer/Int và trần kỹ thuật. Giới hạn 3 booking tương lai, tối đa 120 phút/booking, hạn tự hủy 60 phút; đổi giờ qua admin hủy rồi khách đặt lại, không giữ trước giờ mới.
- Auth cơ bản đã duyệt access 15 phút/refresh hạn tuyệt đối 7 ngày/rotation/cookie HttpOnly/hash token riêng/logout. Chi tiết CSRF, reuse/request đồng thời/nhiều tab, kiểu ID/index/FK, hợp đồng API và cách xử lý chặn đồng thời còn chưa hoàn thiện. Thời gian Booking là phương án mentor cung cấp, chưa có xác nhận hiểu độc lập.
- Kiểm tra thực sự trong buổi: đọc/rà tài liệu bằng rg, assertion python3 nội dung/miền giá/biên thời gian và phép tính minh họa, tra tài liệu chính thức PostgreSQL/Prisma/RFC/OWASP. Chưa có ứng dụng, schema, migration, test backend/PostgreSQL, CI, demo hoặc Git repository sử dụng được; không coi tài liệu là bằng chứng thực thi.
- FB-002 giữ IN_PROGRESS; FB-001 DONE theo nghiệm thu đặc tả trước đó, các thay đổi sau được ghi rõ; FB-000 IN_REVIEW. INTERVIEW_PREP đã ghi câu trả lời/xác nhận thực tế, không nâng mức hiểu từ lời giải mentor hoặc câu duyệt.
- Đúng một bước khi quay lại: tiếp tục FB-002, thiết kế cách lưu các slot 30 phút bị booking chiếm để chống chồng lấn; dùng ví dụ 19:00–20:30. Chưa bắt đầu thiết kế bảng slot.
- Gợi ý commit khi có Git: `docs: checkpoint FB-002 design decisions`. Chưa commit/push.

### 2026-11-02 — Kết thúc buổi, lưu ước lượng còn lại

- Người học yêu cầu dừng và tiếp tục vào buổi khác. Không tiếp tục thiết kế hoặc giao câu hỏi trong lúc nghỉ.
- Đã trao đổi ước lượng còn lại 50–80 giờ theo phạm vi hiện tại và cách người học làm/mentor hướng dẫn-review; đây là dự báo, không phải giờ thực tế hoặc cam kết hạn. Các phần ước tính: thiết kế 3–5h, backend/UI 20–30h, chống trùng/test/sửa lỗi 8–12h, CI/deploy 10–18h, tài liệu/demo/CV 4–6h, dự phòng 5–9h. Cần ước lượng lại sau FB-003 và auth có bằng chứng thực tế.
- Trạng thái giữ nguyên FB-002 IN_PROGRESS, tạm dừng; FB-001 DONE, FB-000 IN_REVIEW. Không có thay đổi code/schema/test/deploy trong phần trao đổi này; chưa có Git repository sử dụng được. Không cập nhật mức hiểu từ lời xác nhận nghỉ/ước lượng.
- Điểm tiếp tục: thiết kế slot 30 phút bị booking chiếm để chống chồng lấn, ví dụ 19:00–20:30 chiếm 3 slot. Sau đó hoàn thiện chi tiết refresh, ràng buộc/ID/index, API và review FB-002.
- Kiểm tra thực sự: assertion `python3` điểm dừng và tổng khoảng ước lượng 50–80h có trong tài liệu; không có test ứng dụng.
- Gợi ý commit khi có Git: `docs: save FB-002 handoff and remaining effort estimate`. Chưa commit/push.

### 2026-11-03 — Tiếp tục FB-002: mô hình slot chiếm chỗ

- Người học yêu cầu tiếp tục. Đã đọc lại tài liệu và xác nhận điểm bàn giao là thiết kế slot 30 phút, chưa bắt đầu FB-003 hoặc viết code thay người học.
- Kiểm tra thực sự: `rg --files` chỉ thấy các tài liệu project; `git status --short` báo không phải Git repository. Chưa có package.json/schema/migration hoặc test ứng dụng để chạy.
- Bước nhỏ tiếp theo: người học phác thảo thông tin cần lưu cho các slot của booking sân A ngày 03/11/2026 19:00–20:30; dùng booking 19:30–20:00 cùng sân để kiểm tra cách phát hiện chồng lấn. Chưa chốt bảng/index hoặc cung cấp lời giải hoàn chỉnh.
- FB-002 giữ IN_PROGRESS. Chưa có câu trả lời kiến thức mới nên không đổi mức hiểu trong INTERVIEW_PREP.
- Gợi ý commit khi có Git: `docs: resume FB-002 occupied slot design`. Chưa commit/push.

### 2026-11-03 — FB-002: review thông tin thời gian của slot

- Người học nêu ngày/giờ quan trọng để FE hiển thị chính xác. Ghi nhận đúng phần thời gian; chưa coi là đã thiết kế đủ trường hoặc hiểu chống trùng database.
- Mentor bổ sung mục đích kiểm tra chiếm chỗ ở backend; bước tiếp theo là người học xác định thông tin phân biệt slot sân A và sân B cùng ngày/giờ. Chưa cung cấp schema hoàn chỉnh hoặc đổi DESIGN.
- INTERVIEW_PREP đã ghi câu trả lời thực tế, giữ nguyên mức hiểu. FB-002 IN_PROGRESS; chưa có code/migration/test.
- Kiểm tra thực sự: đọc các mục liên quan, ghi và đọc lại hai file bằng Python; chưa kiểm tra PostgreSQL/API.
- Gợi ý commit khi có Git: `docs: record occupied slot time review`. Chưa commit/push.

### 2026-11-03 — FB-002: nhận diện sân của slot

- Người học đề xuất tên sân/id sân. Mentor xác nhận ID phù hợp để nhận diện sân, cụ thể hóa courtId → Court.id; tên phục vụ hiển thị qua quan hệ, không cần lưu lặp trên từng dòng slot trong hướng thiết kế này.
- Đã ghi câu trả lời thực tế trong INTERVIEW_PREP, không tự nâng mức hiểu FK/index. Chưa chốt toàn bộ bảng slot hoặc sửa DESIGN.
- Bước nhỏ tiếp theo: người học xác định thông tin liên kết slot với booking để hủy đúng ba slot của booking 19:00–20:30, không ảnh hưởng booking khác.
- Kiểm tra thực sự: Python ghi/đọc lại nội dung PROGRESS và INTERVIEW_PREP; chưa có schema/migration hoặc test PostgreSQL/API. FB-002 IN_PROGRESS.
- Gợi ý commit khi có Git: `docs: record court identification for occupied slots`. Chưa commit/push.

### 2026-11-03 — FB-002: đề xuất bảng đặt sân để duyệt

- Theo yêu cầu trực tiếp, mentor bổ sung DESIGN: tổng hợp Court/Booking đã review và bảng mới BookingSlot(id/bookingId/courtId/startAt/releasedAt). Đề xuất giữ lịch sử slot, partial unique index sân/thời điểm khi releasedAt null, FK kép để sân của slot khớp booking, ghi/hủy nhiều slot nguyên tử.
- Có dữ liệu minh họa 19:00–20:30 và tranh slot giữa, phân biệt cùng giờ khác sân/tiếp giáp. Không tạo sẵn slot trống; backend sinh đủ slot. Giới hạn 3 booking, chặn/đổi giá đồng thời vẫn còn thiết kế riêng.
- Chỉ là đề xuất chờ duyệt; chưa tạo schema/migration hoặc chạy test PostgreSQL/API. INTERVIEW_PREP ghi đúng nguồn mentor, không nâng mức hiểu. FB-002 IN_PROGRESS.
- Kiểm tra thực sự: đọc DESIGN, tra tài liệu chính thức PostgreSQL CREATE INDEX, Python kiểm tra mục bảng/index/nhãn chờ duyệt đã ghi trong tài liệu. Không coi SQL minh họa là migration đã chạy.
- Bước nhỏ tiếp theo: người học duyệt hình dạng BookingSlot và cách giải phóng slot khi hủy.
- Gợi ý commit khi có Git: `docs: propose occupied booking slots and cancellation lifecycle`. Chưa commit/push.

### 2026-11-03 — FB-002: đổi nhịp giảng giải theo yêu cầu người học

- Người học yêu cầu giải thích chậm từng bước phân tích và quy tắc thiết kế để hiểu nguồn gốc đề xuất, không chỉ nhận kết quả/bảng rồi duyệt. Tiếp tục vai trò mentor, chưa coi BookingSlot đã được duyệt.
- Điểm giảng tiếp theo: phân biệt quy tắc nghiệp vụ/bất biến (cùng sân không có hai booking hiệu lực chồng lấn) với phương án biểu diễn dữ liệu; dùng ví dụ chồng lấn và tiếp giáp để kiểm tra trước khi bàn đến ràng buộc/concurrency và chọn bảng.
- Chưa có câu trả lời mới chứng minh hiểu cơ chế; ghi yêu cầu học trong INTERVIEW_PREP, giữ nguyên mức hiểu. FB-002 IN_PROGRESS; chưa đổi schema/code hoặc chạy test.
- Kiểm tra thực sự: Python ghi/đọc lại ghi nhận và điểm tiếp tục trong tài liệu; không có test ứng dụng.
- Bước nhỏ tiếp theo: người học thử áp dụng quy tắc không chồng lấn cho hai khoảng giờ, nêu lý do.
- Gợi ý commit khi có Git: `docs: clarify stepwise booking design review`. Chưa commit/push.

### 2026-11-03 — FB-002: ôn lại chồng lấn và tiếp giáp

- Với booking sân A 19:00–20:30 chưa hủy, người học chấp nhận cả hai yêu cầu mới 19:30–20:00 và 20:30–21:00. Review: đúng yêu cầu tiếp giáp, cần sửa yêu cầu nằm trong khoảng đã chiếm.
- Mentor chỉ rõ phần trùng bằng các slot 30 phút. INTERVIEW_PREP ghi câu trả lời thực tế và giữ G1-03 Cần ôn; không suy diễn nguyên nhân nhầm hoặc xóa các câu trả lời đúng trước đây.
- Bước nhỏ tiếp theo: người học kiểm tra một yêu cầu 20:00–21:00 trên cùng sân để xác định phần trùng; chưa chuyển sang thiết kế bảng/index hoặc coi BookingSlot đã duyệt.
- Kiểm tra thực sự: Python ghi/đọc lại hai tài liệu; không có code/migration/test ứng dụng. FB-002 IN_PROGRESS.
- Gợi ý commit khi có Git: `docs: record overlap invariant review`. Chưa commit/push.

### 2026-11-03 — FB-002: chọn phương án 2, BookingSlot

- Người học chọn rõ phương án thêm BookingSlot và dùng partial unique index trên courtId/startAt khi releasedAt null. Cập nhật DESIGN và sơ đồ quan hệ; mỗi Booking thành công có 1–4 slot, giữ dòng slot khi hủy.
- Bộ trường cơ sở: id/bookingId/courtId/startAt/releasedAt. Đặt ghi toàn bộ booking/slot hoặc rollback; hủy cập nhật trạng thái/thông tin hủy và giải phóng mọi slot nguyên tử. Chi tiết SQL/FK/kiểu ID vẫn cần hoàn thiện; lựa chọn phương án không tự xác nhận hiểu cơ chế.
- INTERVIEW_PREP ghi đúng quyết định; giữ nguyên mức hiểu. FB-002 IN_PROGRESS, chưa có schema/migration hoặc test PostgreSQL/API. Nhật ký cũ chờ duyệt giữ làm lịch sử.
- Kiểm tra thực sự: Python kiểm tra nhãn đã chọn, trường BookingSlot, điều kiện index, quan hệ có slot và bước tiếp theo đồng bộ trong tài liệu. Không chạy test ứng dụng vì chưa có ứng dụng.
- Bước nhỏ tiếp theo: thiết kế transaction tạo booking để giới hạn 3 booking tương lai vẫn đúng khi cùng tài khoản gửi request đồng thời.
- Gợi ý commit khi có Git: `docs: select booking slot model for overlap protection`. Chưa commit/push.

### 2026-11-03 — FB-002: đề xuất phối hợp request cho giới hạn 3 booking

- Người học yêu cầu tiếp tục. Đã đọc điểm bàn giao/tài liệu; rg --files vẫn chỉ có tài liệu, git status --short báo chưa phải Git repository. Chưa có ứng dụng hoặc lệnh test.
- DESIGN bổ sung đề xuất chờ duyệt: Read Committed, khóa dòng User bằng SELECT FOR UPDATE trước khi đếm, đếm bằng câu truy vấn riêng sau khóa và tạo booking/slot trong cùng transaction. Minh họa khách có 2 booking gửi hai request tới các slot khác nhau.
- Ghi rõ khác biệt với unique slot, yêu cầu mọi đường tạo cùng tuân thủ giao thức khóa, thời điểm kiểm tra sau chờ khóa, rollback không giữ slot, phạm vi chưa giải quyết của khóa Court/hủy/deadlock. Không thêm bảng/cột đếm/dependency.
- Kiểm tra thực sự: đọc tài liệu PostgreSQL về row lock/Read Committed; Python kiểm tra mục đề xuất và điểm tiếp tục được ghi. Chưa chạy PostgreSQL hoặc test request đồng thời.
- INTERVIEW_PREP ghi đây là phương án mentor, chưa có câu trả lời review mới; không nâng mức hiểu. FB-002 IN_PROGRESS.
- Bước nhỏ tiếp theo: người học review đề xuất khóa dòng User cho hạn mức 3 booking.
- Gợi ý commit khi có Git: `docs: propose user row locking for booking limit`. Chưa commit/push.

### 2026-11-03 — FB-002: học nền tảng transaction trước khóa dòng

- Người học nói chưa hình dung transaction và yêu cầu tìm video YouTube để học. Tạm gác review khóa dòng User; đề xuất đó vẫn chưa duyệt, không đánh dấu ticket BLOCKED.
- Đã tìm video từ chính kênh tác giả: HowKteam, “Bài 32: Transaction trong SQL” (https://www.youtube.com/watch?v=q5YGcrrPZSE), tiếng Việt, dùng SQL Server; Hussein Nasser, “Relational Database ACID Transactions (Explained by Example)” (https://www.youtube.com/watch?v=pomxJOFVcQs), tiếng Anh. Mô tả video thứ hai có chương 2:00 Transaction, 4:30 Atomicity, 7:00 Isolation; đề xuất ban đầu chỉ xem 2:00–7:00.
- Tra thêm tutorial Transactions chính thức PostgreSQL. Dùng ví dụ tạo Booking và các BookingSlot: commit khi đủ, rollback khi thất bại; chưa học sâu isolation/lock.
- Kiểm tra thực sự: tìm web, đọc tiêu đề/mô tả/chương video và tài liệu PostgreSQL; chưa xem toàn bộ video hoặc xác nhận phụ đề. Chưa có bài thực hành/test database.
- INTERVIEW_PREP ghi đúng việc chưa hình dung transaction; không coi đã học xong hoặc chưa từng học tất cả kiến thức database. FB-002 IN_PROGRESS.
- Bước nhỏ tiếp theo: người học xem video HowKteam, tập trung ý nghĩa BEGIN/COMMIT/ROLLBACK, rồi diễn đạt ngắn điều xảy ra khi tạo slot giữa thất bại.
- Gợi ý commit khi có Git: `docs: add introductory transaction learning resources`. Chưa commit/push.

### 2026-11-03 — FB-002: review COMMIT và ROLLBACK

- Người học giải thích COMMIT xác nhận chuỗi thao tác thành công khi không lỗi giữa chừng; ROLLBACK quay về trước chuỗi thao tác, ví như Ctrl+Z. Đúng ý chính về xác nhận/hủy thay đổi trong transaction; không suy diễn đã xem hết video hoặc đã thực hành.
- Mentor làm rõ phạm vi rollback của transaction chưa commit và tính tường minh của commit. Không mở rộng sang isolation/row lock trước khi người học áp dụng được vào booking.
- INTERVIEW_PREP chuyển G3-04 từ Chưa học sang Cần ôn dựa trên lời giải thích thực tế; chưa xác nhận hiểu toàn bộ transaction/ràng buộc. FB-002 IN_PROGRESS; phương án khóa User chưa duyệt.
- Kiểm tra thực sự: Python ghi/đọc lại mục review và trạng thái G3-04; chưa có code/test PostgreSQL.
- Bước nhỏ tiếp theo: người học nêu dữ liệu còn lại khi transaction đã tạo Booking và slot đầu nhưng tạo slot thứ hai lỗi rồi rollback.
- Gợi ý commit khi có Git: `docs: record commit rollback understanding review`. Chưa commit/push.

### 2026-11-03 — FB-002: áp dụng đúng rollback vào booking

- Người học trả lời “Không” khi hỏi Booking B1 và slot 19:00 vừa tạo có còn sau rollback do slot 19:30 lỗi hay không. Đúng việc transaction không để lại các bản ghi mới thành công một phần.
- INTERVIEW_PREP ghi bằng chứng áp dụng rollback/all-or-nothing; giữ G3-04 Cần ôn vì chưa review đầy đủ ràng buộc/concurrency, chưa có thực hành database.
- Bước nhỏ tiếp theo: review đề xuất khóa dòng User để kiểm tra giới hạn 3 booking theo thứ tự khi request đồng thời. Phân biệt atomicity với phối hợp concurrency; chưa coi khóa User đã duyệt.
- Kiểm tra thực sự: Python ghi/đọc lại câu trả lời và điểm tiếp tục; không chạy test ứng dụng. FB-002 IN_PROGRESS.
- Gợi ý commit khi có Git: `docs: record booking rollback example review`. Chưa commit/push.

### 2026-11-03 — FB-002: làm rõ khái niệm khóa dòng

- Người học chưa hình dung khóa dòng User. Chưa duyệt đề xuất; mentor giải thích trực quan hai transaction cùng yêu cầu khóa một bản ghi, chờ/nhả khóa khi commit hoặc rollback.
- Làm rõ đây là khóa database tạm thời trên dòng User, không khóa đăng nhập, không thêm isLocked; SELECT thông thường vẫn có thể đọc, giao thức đặt phải cùng xin khóa trước khi đếm.
- INTERVIEW_PREP ghi đúng phần chưa rõ, giữ nguyên bằng chứng đã hiểu rollback cơ bản và G3-04 Cần ôn. Chưa có SQL/code/test PostgreSQL; FB-002 IN_PROGRESS.
- Kiểm tra thực sự: Python ghi/đọc lại câu hỏi và điểm học tiếp; cơ chế giải thích dựa trên tài liệu PostgreSQL row locking đã đọc trong phiên.
- Bước nhỏ tiếp theo: người học phân biệt chờ cùng dòng User với xử lý request của User khác; chưa duyệt cơ chế thay người học.
- Gợi ý commit khi có Git: `docs: clarify row locking learning checkpoint`. Chưa commit/push.

### 2026-11-03 — FB-002: xác nhận đã hình dung khóa dòng

- Người học nói “Ok tôi hiểu rồi” sau giải thích khóa dòng. Ghi nhận phản hồi, không tự coi đã giải thích độc lập concurrency hoặc đã duyệt phương án khóa User.
- INTERVIEW_PREP giữ G3-04 Cần ôn và bằng chứng hiểu rollback đã có. DESIGN giữ đề xuất khóa User chờ duyệt; chưa tạo code/schema/migration/test database.
- Kiểm tra thực sự: Python ghi/đọc lại xác nhận và bước tiếp tục trong hai tài liệu. FB-002 IN_PROGRESS.
- Bước nhỏ tiếp theo: người học chốt luồng transaction khóa User → đọc chặn → đếm booking tương lai → tạo Booking/BookingSlot → commit hoặc rollback.
- Gợi ý commit khi có Git: `docs: record row lock explanation acknowledgment`. Chưa commit/push.

### 2026-11-03 — FB-002: duyệt hướng transaction khóa User

- Người học xác nhận “Ok được rồi” sau đề nghị chốt luồng khóa User → đọc chặn → đếm booking tương lai chưa hủy → kiểm tra điều kiện còn lại → tạo Booking và toàn bộ BookingSlot → commit/rollback.
- DESIGN chuyển hướng khóa User bảo vệ hạn mức sang đã duyệt; chi tiết SQL/isolation/chặn đồng thời/khóa Court/hủy/thứ tự khóa vẫn cần hoàn thiện và kiểm thử, không coi được duyệt toàn bộ hoặc đã chạy database.
- INTERVIEW_PREP ghi quyết định thực tế, giữ G3-04 Cần ôn, không nâng hiểu biết từ câu duyệt. FB-002 IN_PROGRESS; chưa có ứng dụng/schema/migration/test.
- Kiểm tra thực sự: Python đọc/ghi và assertion nhãn duyệt, luồng đã chốt và điểm tiếp tục giữa DESIGN/PROGRESS/INTERVIEW_PREP; chưa test PostgreSQL/request đồng thời.
- Bước nhỏ tiếp theo: thiết kế xử lý đọc trạng thái/giá Court khi admin đổi giá hoặc vô hiệu hóa sân đồng thời với đặt sân.
- Gợi ý commit khi có Git: `docs: approve user locking transaction design`. Chưa commit/push.

### 2026-11-03 — FB-002: đề xuất phối hợp đọc Court với cập nhật admin

- Người học đồng ý tiếp tục. Mentor bổ sung DESIGN đề xuất chờ duyệt: khóa User rồi đọc Court dưới khóa FOR SHARE, giữ đến commit/rollback. Giá/isActive ổn định trong lần đặt; UPDATE admin đi trước thì đọc dữ liệu mới, đặt lấy khóa trước thì admin chờ.
- Có ví dụ giá 150000 → 180000/slot cho booking 60 phút, tổng 300000 hoặc 360000 theo thứ tự xử lý. Giá khác UI và cách xác nhận cần chốt riêng ở API; chưa thêm cơ chế giữ giá hoặc tự thay scope.
- Kiểm tra thực sự: đọc lại DESIGN, tra tài liệu PostgreSQL row locking xác nhận FOR SHARE chặn UPDATE nhưng cho phép đọc khóa chia sẻ khác; Python ghi/đọc lại mục đề xuất và điểm tiếp tục. Chưa chạy PostgreSQL/API/test concurrency.
- INTERVIEW_PREP ghi đúng phần mentor cung cấp, không tự nâng mức hiểu hoặc coi đã duyệt. FB-002 IN_PROGRESS.
- Bước nhỏ tiếp theo: người học review nguyên tắc giá/trạng thái Court theo thứ tự xử lý giữa đặt và cập nhật admin.
- Gợi ý commit khi có Git: `docs: propose court locking for price and availability updates`. Chưa commit/push.

### 2026-11-03 — FB-002: làm rõ kỳ vọng đặt trước cập nhật giá

- Người học nói đặt sân thành công phải xảy ra trước khi giá cập nhật. Mentor xác nhận điều này áp dụng khi transaction đặt đã giữ khóa đọc Court trước; không yêu cầu duyệt tiếp trước khi làm rõ phạm vi kỳ vọng.
- DESIGN/INTERVIEW_PREP ghi phản hồi thực tế; chưa tự coi là duyệt giữ giá từ lúc xem UI hoặc ưu tiên mọi request đặt. Mô hình Court vẫn đang review; chưa thay README/REQUIREMENTS.
- Kiểm tra thực sự: Python ghi/đọc lại ba tài liệu; chưa có code/migration/test database. FB-002 IN_PROGRESS, mức hiểu giữ nguyên.
- Bước nhỏ tiếp theo: người học xác định đang nói giai đoạn backend xử lý đặt hay từ lúc khách xem giá trên giao diện.
- Gợi ý commit khi có Git: `docs: clarify booking price protection expectation`. Chưa commit/push.

### 2026-11-03 — FB-002: phân biệt giữ khóa và giữ giá khi giả định thanh toán

- Người học giải thích admin phải chờ transaction đặt giữ khóa đến đặt/thanh toán xong mới đổi giá; thanh toán nêu dưới dạng giả định. Đúng thứ tự chờ khóa khi đặt đi trước; chưa đúng nếu kéo dài khóa Court qua khách/cổng thanh toán ngoài database.
- Mentor làm rõ snapshot giá/tổng trên Booking bảo vệ giá sau commit; transaction đặt kết thúc và nhả khóa rồi admin có thể đổi giá Court. Không cần đợi thanh toán để bảo vệ giá đã chốt. Thanh toán thực tế/giữ chỗ/hết hạn vẫn ngoài bản đầu, không tự thêm bảng/trạng thái/API.
- DESIGN và INTERVIEW_PREP ghi phản hồi/điểm cần sửa; chưa duyệt toàn bộ phương án Court, không đổi đơn vị giá theo ví dụ 180k/h. FB-002 IN_PROGRESS, không nâng mức hiểu tự động.
- Kiểm tra thực sự: Python ghi/đọc lại ba tài liệu; chưa chạy code/PostgreSQL/test thanh toán.
- Bước nhỏ tiếp theo: người học xác nhận phân biệt snapshot Booking giữ giá với khóa Court tạm thời, trước khi chốt xử lý cập nhật Court đồng thời.
- Gợi ý commit khi có Git: `docs: distinguish booking price snapshot from database lock lifetime`. Chưa commit/push.

### 2026-11-03 — FB-002: tiếp tục xử lý giá khác màn hình

- Người học phản hồi “Ok” sau giải thích snapshot Booking bảo vệ giá sau khi nhả khóa Court. Ghi nhận xác nhận, không tự đánh giá đã giải thích độc lập hoặc duyệt mọi chi tiết khóa Court.
- Bước tiếp theo chuyển sang quyết định trải nghiệm/API: khách thấy tổng 300000, trước lúc bấm đặt admin đổi khiến tổng hiện hành là 360000. Mentor đề xuất báo giá thay đổi, không tạo booking/giữ slot và yêu cầu khách xác nhận lại giá mới; đang chờ người học chọn, chưa sửa quy tắc README/REQUIREMENTS hoặc thêm trường request.
- INTERVIEW_PREP giữ mức hiểu và ghi đúng phản hồi. FB-002 IN_PROGRESS; chưa có code/migration/test database hoặc thanh toán.
- Kiểm tra thực sự: Python ghi/đọc lại hai tài liệu; đây là tình huống thiết kế, không phải kết quả test.
- Bước nhỏ tiếp theo: người học duyệt hoặc điều chỉnh cách báo giá thay đổi trước khi tạo booking.
- Gợi ý commit khi có Git: `docs: checkpoint price snapshot review and stale price decision`. Chưa commit/push.

### 2026-11-03 — FB-002: yêu cầu giữ giá khách đã xem

- Người học yêu cầu khách xem 300k thì bấm đặt vẫn 300k, từ chối đề xuất chỉ báo giá mới khi admin cập nhật. Đã đồng bộ README/REQUIREMENTS/DESIGN/ROADMAP: cần báo giá backend có thể xác thực trước tạo booking; không lấy giá frontend tự gửi làm chuẩn.
- DESIGN đánh dấu phương án đọc giá Court mới là đề xuất trước thay đổi, cần cập nhật cho báo giá. Không giữ khóa Court lúc chờ khách; báo giá không giữ slot. Chưa chốt TTL, phạm vi, cách lưu/ký, dùng lại hoặc API; không tự thêm bảng/dependency/thanh toán hay bảo đảm giá vô hạn.
- INTERVIEW_PREP ghi đúng quyết định nghiệp vụ, không nâng mức hiểu triển khai. FB-002 IN_PROGRESS.
- Kiểm tra thực sự: Python ghi/đọc lại và assertion yêu cầu giữ giá, nhãn chưa chốt trong các tài liệu; chưa có test PostgreSQL/API.
- Bước nhỏ tiếp theo: người học chốt thời hạn báo giá; mentor có thể đề xuất 5 phút để thảo luận, chưa coi đây là yêu cầu đã được duyệt.
- Gợi ý commit khi có Git: `docs: require honoring server issued displayed prices`. Chưa commit/push.

### 2026-11-03 — FB-002: làm rõ giá tự gửi và báo giá hợp lệ

- Người học nêu tình huống BE đã đổi thành 360k, user dùng Postman gửi 300k. Mentor giải thích không tin giá client, chỉ dùng dữ liệu báo giá backend xác thực; báo giá 300k đã cấp còn hợp lệ vẫn dùng được bất kể client, đúng chính sách giữ giá đã yêu cầu.
- DESIGN ghi các điểm cần kiểm tra user/sân/giờ/thời lượng/hạn/dùng lại; chưa tự chọn cách lưu/ký hoặc TTL. INTERVIEW_PREP ghi câu hỏi thực tế, không tự coi người học đã giải thích cơ chế.
- Kiểm tra thực sự: Python ghi/đọc lại ba tài liệu; ví dụ báo giá là minh họa, chưa có endpoint/quote database/test Postman. FB-002 IN_PROGRESS.
- Bước nhỏ tiếp theo: tiếp tục chốt thời hạn báo giá sau khi làm rõ ranh giới giá client và báo giá backend.
- Gợi ý commit khi có Git: `docs: clarify quote validation across api clients`. Chưa commit/push.

### 2026-11-03 — FB-002: làm rõ phạm vi giữ khóa với báo giá

- Người học hỏi giữ khóa thế nào chuẩn. DESIGN bổ sung luồng đề xuất: báo giá và đặt là hai request, không giữ khóa giữa hai request; khi đặt khóa User FOR UPDATE, xác thực quote, đọc Court FOR SHARE để kiểm tra trạng thái, đếm hạn mức/kiểm tra thời gian rồi tạo Booking/slot nguyên tử, nhả khóa khi transaction kết thúc.
- Giá snapshot lấy báo giá xác thực; khóa Court không buộc dùng giá Court mới. Báo giá còn hạn không bảo đảm slot/sân hoạt động. Cách lưu/ký/TTL/tiêu thụ quote/thứ tự khóa cần hoàn thiện; chưa tự chọn bảng mới hoặc duyệt thay người học.
- INTERVIEW_PREP ghi đúng câu hỏi, không nâng mức hiểu. Kiểm tra thực sự: Python ghi/đọc lại ba tài liệu; cơ chế khóa dựa tài liệu PostgreSQL đã đọc. Chưa có code/test database; FB-002 IN_PROGRESS.
- Bước nhỏ tiếp theo: chốt thời hạn báo giá để hoàn thiện điều kiện hợp lệ khi bấm đặt; chưa áp dụng mặc định 5 phút.
- Gợi ý commit khi có Git: `docs: define lock boundaries for quoted bookings`. Chưa commit/push.

### 2026-11-03 — FB-002: chuyển sang chọn thời hạn báo giá

- Người học nói “Ok” sau giải thích phạm vi khóa ngắn và báo giá. Ghi nhận phản hồi, chưa suy diễn đã giải thích độc lập hoặc duyệt mọi chi tiết SQL/quote.
- Mentor đề xuất để review: báo giá hiệu lực 5 phút từ lúc backend cấp; còn hạn dùng giá đã báo dù Court đổi giá, hết hạn không tạo booking và lấy báo giá mới để khách xác nhận. Báo giá không giữ slot, không gia hạn tự động khi admin đổi giá. TTL 5 phút và hành vi hết hạn chưa duyệt, chưa thay README/REQUIREMENTS.
- INTERVIEW_PREP ghi xác nhận thực tế, giữ mức hiểu. FB-002 IN_PROGRESS; chưa có schema/code/test.
- Kiểm tra thực sự: Python ghi/đọc lại PROGRESS và INTERVIEW_PREP; chưa kiểm chứng thời hạn bằng database/API.
- Bước nhỏ tiếp theo: người học chọn thời hạn báo giá 5 phút hoặc nêu thời hạn khác.
- Gợi ý commit khi có Git: `docs: checkpoint quote lifetime decision`. Chưa commit/push.

### 2026-11-03 — FB-002: rút báo giá/TTL, trở lại transaction đặt

- Người học phản biện quote/TTL rườm rà và làm rõ muốn transaction đặt chốt giá cũ trước khi admin đang chờ cập nhật. Mentor ghi nhận đã mở rộng quá xa, rút cơ chế báo giá/TTL khỏi yêu cầu hiện hành.
- Đồng bộ README/REQUIREMENTS/ROADMAP/DESIGN: khóa Court khi đọc/tính/lưu snapshot trong transaction; nhả khóa khi commit/rollback, admin chờ nếu transaction đặt giữ khóa trước. Nếu admin commit trước thì đặt đọc giá mới, không bảo đảm ưu tiên đặt ở mọi thứ tự.
- Ví dụ diễn giải Booking cũ tổng 300k, admin đổi giá niêm yết khiến booking mới cùng thời lượng tổng 360k; không sửa tổng cũ. Thanh toán vẫn giả định ngoài scope, đơn vị vẫn mỗi 30 phút.
- INTERVIEW_PREP ghi phản biện/cách hiểu, không nâng mức hiểu kỹ thuật. Nhật ký quote/TTL trước giữ lịch sử, không còn là kế hoạch. FB-002 IN_PROGRESS; chưa có code/test database.
- Kiểm tra thực sự: Python ghi/đọc và assertion loại yêu cầu quote hiện hành khỏi README/REQUIREMENTS/ROADMAP, thay section Court trong DESIGN, đồng bộ bước tiếp tục. Không có test API/PostgreSQL.
- Bước nhỏ tiếp theo: thiết kế request/response/lỗi cho POST tạo booking.
- Gợi ý commit khi có Git: `docs: simplify price consistency to booking transaction`. Chưa commit/push.

### 2026-11-03 — FB-002: tổng hợp toàn bộ ticket và dự báo còn lại

- Người học yêu cầu xem toàn bộ ticket, vị trí hiện tại và thời gian còn lại. Đã đọc ROADMAP và PROGRESS: FB-000 IN_REVIEW, FB-001 DONE, FB-002 IN_PROGRESS, FB-003–015 TODO; chưa có sản phẩm chạy được.
- Lưu dự báo 50–80 giờ còn lại, chia nhóm và quy đổi lịch 5 buổi/tuần. Đây là dự báo, không phải số giờ đã làm hoặc cam kết hạn; chưa có dữ liệu thời gian thực để trừ giờ từ dự báo cũ. Bảng 30–40 giờ ban đầu giữ nhãn lịch sử trong ROADMAP, không dùng làm lịch hiện tại.
- Không đổi trạng thái ticket hoặc mức hiểu từ yêu cầu xem tiến độ. INTERVIEW_PREP không có câu trả lời kiến thức mới nên giữ nguyên.
- Kiểm tra thực sự: đọc toàn bộ ROADMAP và bảng trạng thái; Python kiểm tra tổng khoảng giờ 50–80 và đủ 16 mã ticket. Không chạy test ứng dụng.
- Bước nhỏ tiếp theo: thiết kế request/response/lỗi cho POST tạo booking.
- Gợi ý commit khi có Git: `docs: refresh roadmap checkpoint and remaining effort forecast`. Chưa commit/push.

### 2026-11-03 — Kết thúc buổi theo yêu cầu người học

- Người học yêu cầu dừng tại đây, buổi sau tiếp tục. Đã lưu điểm bàn giao, không thiết kế/triển khai thêm hoặc giao câu hỏi trong lúc nghỉ.
- Điểm đã bàn: BookingSlot bảo vệ từng slot 30 phút bằng partial unique index; transaction đặt toàn bộ hoặc không giữ slot nào; khóa User bảo vệ hạn mức 3 booking; khóa Court khi đọc giá/trạng thái và lưu snapshot trước khi admin đang chờ cập nhật. Báo giá/TTL đã rút khỏi scope; thanh toán chỉ là giả định, chưa thuộc bản đầu.
- Người học đã giải thích COMMIT/ROLLBACK và áp dụng đúng rollback vào ví dụ Booking/slot. Các xác nhận hiểu/duyệt cơ chế khóa không được tự nâng thành bằng chứng hiểu độc lập; INTERVIEW_PREP giữ đánh giá thực tế.
- FB-002 giữ IN_PROGRESS, tạm dừng; FB-001 DONE, FB-000 IN_REVIEW; FB-003–015 TODO. Hiện chỉ có tài liệu, chưa có code/schema/migration/test/CI/deploy hoặc Git repository sử dụng được.
- Dự báo còn lại 50–80 giờ, chưa phải giờ đã làm hoặc cam kết hạn; phân rã ở mục ước lượng. Đánh giá lại sau FB-003 và auth chạy được.
- Kiểm tra thực sự cuối buổi: Python kiểm tra nhãn tạm dừng, điểm bàn giao và trạng thái ticket trong PROGRESS; chưa chạy test ứng dụng/database vì chưa có ứng dụng. Không commit/push.
- Đúng một bước khi quay lại: thiết kế request/response/lỗi cho POST tạo booking. Không yêu cầu làm trong lúc nghỉ.
- Gợi ý commit khi có Git: `docs: save FB-002 session handoff`. Chưa commit/push.

### 2026-11-03 — Tiếp tục FB-002: hợp đồng API tạo booking

- Đọc lại tài liệu và kiểm tra workspace: hiện chỉ có tài liệu; git status báo chưa phải Git repository. Chưa có ứng dụng/test để chạy.
- Tiếp tục đúng điểm bàn giao: POST tạo booking. Body courtId/startAt/durationMinutes và danh tính từ JWT đã được bàn trước, không yêu cầu duyệt lại.
- Bước nhỏ giao người học: phác thảo HTTP status và dữ liệu response khi đặt thành công, cùng response khi một slot trong khoảng yêu cầu vừa bị người khác đặt. Chưa chốt toàn bộ API hoặc viết code.
- Chưa có câu trả lời kiến thức mới; giữ nguyên INTERVIEW_PREP và mức hiểu. FB-002 giữ IN_PROGRESS.
- Kiểm tra thực sự: đọc tài liệu bằng sed/rg, liệt kê file bằng rg --files; git status --short báo không phải Git repository. Lệnh python không có trên máy, dùng python3 cập nhật và đọc lại điểm tiếp tục. Không chạy test API/PostgreSQL.
- Gợi ý commit khi có Git: `docs: resume booking API contract review`. Chưa commit/push.

### 2026-11-03 — FB-002: review bản nháp response chuẩn hóa

- Người học chọn đúng 201/409 cho tạo thành công/tranh slot và đề xuất success/message/data hoặc success/error để chuẩn hóa cho FE. Ghi bản nháp trong DESIGN, chưa chốt mọi response API.
- Mentor gợi ý data object cho một booking và error.code ổn định bên cạnh message. Chờ người học chọn các trường data; không tự hoàn tất hợp đồng thay người học.
- INTERVIEW_PREP chuyển G1-06 từ Chưa học sang Cần ôn dựa trên bản nháp thực tế; chưa đánh giá đã hiểu đầy đủ hợp đồng API. FB-002 giữ IN_PROGRESS.
- Kiểm tra thực sự: python3 cập nhật/đọc lại ba tài liệu và assertion nội dung; chưa có API/test PostgreSQL để chạy.
- Bước tiếp theo: người học phác thảo các trường data cho booking tạo thành công.
- Gợi ý commit khi có Git: `docs: review booking response envelope`. Chưa commit/push.

### 2026-11-03 — FB-002: chốt khung response tạm thời

- Người học đồng ý tạm chuẩn hóa success/message/data và success/error(code/message), để mở rộng phân trang hoặc lỗi validation sau. DESIGN ghi quyết định hiện hành; chưa tự chọn kiểu phân trang, cấu trúc validation hay dependency.
- INTERVIEW_PREP ghi phản hồi thực tế, giữ G1-06 Cần ôn. FB-002 vẫn IN_PROGRESS; chưa triển khai API.
- Kiểm tra thực sự: python3 cập nhật/đọc lại ba tài liệu và assertion nội dung. Không chạy test ứng dụng vì chưa có code.
- Bước nhỏ tiếp theo: người học chọn các trường data trong response tạo booking thành công.
- Gợi ý commit khi có Git: `docs: agree on initial API response convention`. Chưa commit/push.

### 2026-11-03 — FB-002: đề xuất data của booking mới

- Theo yêu cầu người học, mentor đề xuất data object chứa booking và thông tin sân/chi nhánh để xác nhận, thời gian UTC, giá snapshot; phân biệt với array của API danh sách. DESIGN ghi đề xuất chưa duyệt.
- INTERVIEW_PREP ghi câu hỏi thực tế, giữ Cần ôn. FB-002 IN_PROGRESS, chưa có API/test.
- Kiểm tra thực sự: python3 cập nhật và đọc lại ba tài liệu; assertion nội dung đạt. Không chạy test ứng dụng.
- Bước nhỏ tiếp theo: người học review bộ trường data được đề xuất.
- Gợi ý commit khi có Git: `docs: propose booking creation response data`. Chưa commit/push.

### 2026-11-03 — FB-002: duyệt data tạo booking

- Người học xác nhận “Ok được rồi đó”; DESIGN chuyển bộ trường data của response 201 sang đã duyệt: id, court/branch, startAt/endAt, durationMinutes, status, pricePerSlot/totalPrice, createdAt. Giữ UTC, tiền nguyên VND và giá snapshot Booking; kiểu ID chưa chốt.
- INTERVIEW_PREP ghi xác nhận, giữ G1-06 Cần ôn; không tự nâng mức hiểu từ việc duyệt. FB-002 vẫn IN_PROGRESS vì hợp đồng API và các phần thiết kế khác chưa đầy đủ.
- Kiểm tra thực sự: python3 cập nhật/đọc lại ba tài liệu và assertion nhãn duyệt/điểm tiếp tục; chưa có API để chạy test.
- Bước nhỏ tiếp theo: thiết kế lỗi validation đầu vào POST tạo booking theo khung error đã chốt.
- Gợi ý commit khi có Git: `docs: approve booking creation response data`. Chưa commit/push.

### 2026-11-03 — FB-002: gợi ý lỗi validation

- Người học chưa nhớ cách trả lỗi durationMinutes=45, yêu cầu gợi ý. Mentor đưa hướng HTTP 400, VALIDATION_ERROR và details array với field/message; chưa chốt thay người học.
- INTERVIEW_PREP ghi đúng mức cần ôn. FB-002 IN_PROGRESS; chưa triển khai/test response.
- Kiểm tra thực sự: python3 cập nhật/đọc lại PROGRESS và INTERVIEW_PREP bằng assertion; không có test API.
- Bước nhỏ tiếp theo: người học điền message cho lỗi durationMinutes không thuộc 30/60/90/120.
- Gợi ý commit khi có Git: `docs: record validation response learning checkpoint`. Chưa commit/push.

### 2026-11-03 — FB-002: duyệt response lỗi validation

- Người học xác nhận “Đồng ý” với đề xuất HTTP 400 Bad Request, success=false, error.code=VALIDATION_ERROR, error.message chung và error.details array gồm field/message cho lỗi cụ thể từng trường. DESIGN lưu ví dụ durationMinutes=45 và cập nhật ghi chú validation chưa chốt trước đó.
- INTERVIEW_PREP ghi quyết định thực tế, giữ G1-06 Cần ôn; chưa tự nâng mức hiểu từ phản hồi duyệt. FB-002 IN_PROGRESS.
- Kiểm tra thực sự: python3 cập nhật/đọc lại ba tài liệu và assertion nội dung; chưa có API để chạy test.
- Bước nhỏ tiếp theo: thiết kế lỗi từ chối tạo booking khi khách đã có đủ 3 booking tương lai chưa hủy.
- Gợi ý commit khi có Git: `docs: approve validation error response contract`. Chưa commit/push.

### 2026-11-03 — FB-002: xem lại giới hạn giữ chỗ

- Người học nêu đánh đổi: bỏ giới hạn có thể cho một tài khoản giữ giờ cao điểm cả tuần; giữ mức 3 có thể gây cảm giác quá ít. Đây là yêu cầu thảo luận, chưa quyết định đổi quy tắc README/REQUIREMENTS/DESIGN.
- Giới hạn hiện hành vẫn là 3 booking tương lai chưa hủy trên mỗi tài khoản, không phải 3 lượt mỗi tuần. Chưa duyệt BOOKING_LIMIT_REACHED hoặc response của lỗi này.
- Chưa có dữ liệu người dùng thực tế để kết luận mức 3 phù hợp. Chưa thêm hạn mức ngày/giờ cao điểm/đặt cọc hoặc chống nhiều tài khoản.
- Kiểm tra thực sự: python3 cập nhật/đọc lại nhật ký và điểm tiếp tục; không thay đổi code hoặc chạy test. FB-002 IN_PROGRESS.
- Bước nhỏ tiếp theo: người học quyết định giữ hay điều chỉnh giới hạn giữ chỗ.
- Gợi ý commit khi có Git: `docs: record booking limit tradeoff discussion`. Chưa commit/push.

### 2026-11-03 — FB-002: giữ giới hạn 3 và cấu hình backend

- Người học duyệt giữ giới hạn 3 booking tương lai chưa hủy, con số đặt trong cấu hình backend tập trung để dễ điều chỉnh khi có phản hồi thực tế. Không thêm hạn mức ngày/giờ cao điểm. README/REQUIREMENTS đang quy định 3 nên không cần đổi nghiệp vụ; DESIGN bổ sung quyết định cấu hình.
- Chưa coi phản hồi này là duyệt response lỗi 409/BOOKING_LIMIT_REACHED; chưa triển khai cấu hình, API hoặc test đồng thời.
- INTERVIEW_PREP ghi xác nhận, giữ nguyên mức hiểu kỹ thuật. FB-002 IN_PROGRESS.
- Kiểm tra thực sự: rg đối chiếu README/DESIGN/PROGRESS; python3 cập nhật/đọc lại ba tài liệu và assertion nội dung. Không chạy test ứng dụng.
- Bước nhỏ tiếp theo: người học review response lỗi hạn mức đã đề xuất.
- Gợi ý commit khi có Git: `docs: confirm configurable booking limit of three`. Chưa commit/push.

### 2026-11-03 — FB-002: duyệt lỗi đạt giới hạn booking

- Người học xác nhận “Oke duyệt” với HTTP 409 Conflict, success=false, error.code=BOOKING_LIMIT_REACHED và message đạt giới hạn; số trong message lấy từ cùng cấu hình hạn mức. Không có details, không tạo booking/giữ slot khi từ chối.
- DESIGN ghi hợp đồng đã duyệt và cập nhật ghi chú chờ review trước đó. INTERVIEW_PREP ghi xác nhận, giữ G1-06 Cần ôn; FB-002 IN_PROGRESS.
- Kiểm tra thực sự: python3 cập nhật/đọc lại ba tài liệu, assertion nội dung đạt. Chưa có API/database để chạy test.
- Bước nhỏ tiếp theo: thiết kế response từ chối đặt mới khi tài khoản đang bị chặn đặt.
- Gợi ý commit khi có Git: `docs: approve booking limit error response`. Chưa commit/push.

### 2026-11-03 — FB-002: chốt lỗi bị chặn và giải thích 403

- Người học đồng ý response 403/BOOKING_BLOCKED, hỏi ý nghĩa Forbidden và xác nhận đã hiểu sau giải thích 401/403/409. DESIGN lưu hợp đồng; không trả lý do nội bộ, vẫn cho xem/hủy hợp lệ.
- INTERVIEW_PREP ghi phản hồi thực tế, giữ Cần ôn; không coi xác nhận là lời giải thích độc lập. FB-002 IN_PROGRESS.
- Kiểm tra thực sự: python3 cập nhật/đọc lại ba tài liệu, assertion nội dung đạt. Chưa có API để test.
- Bước nhỏ tiếp theo: review đề xuất lỗi khi sân đã bị vô hiệu hóa trước lúc đặt.
- Gợi ý commit khi có Git: `docs: approve booking blocked error response`. Chưa commit/push.

### 2026-11-03 — FB-002: duyệt lỗi sân vô hiệu hóa

- Người học xác nhận “Ok duyệt” với HTTP 409/COURT_INACTIVE và message sân không nhận booking mới. DESIGN ghi hợp đồng; không tạo booking/giữ slot khi từ chối, giữ booking có sẵn và lịch sử.
- INTERVIEW_PREP ghi quyết định, giữ G1-06 Cần ôn. FB-002 IN_PROGRESS.
- Kiểm tra thực sự: python3 cập nhật/đọc lại ba tài liệu và assertion nội dung đạt. Chưa có API để chạy test.
- Bước nhỏ tiếp theo: review response khi courtId đúng định dạng nhưng không có sân tương ứng.
- Gợi ý commit khi có Git: `docs: approve inactive court error response`. Chưa commit/push.

### 2026-11-03 — FB-002: duyệt lỗi không tìm thấy sân

- Người học duyệt HTTP 404/COURT_NOT_FOUND với message “Không tìm thấy sân.” khi courtId đúng định dạng nhưng sân không tồn tại; sai định dạng vẫn là 400/VALIDATION_ERROR. DESIGN ghi hợp đồng, kiểu ID chưa chốt.
- INTERVIEW_PREP ghi quyết định, giữ G1-06 Cần ôn. FB-002 IN_PROGRESS.
- Kiểm tra thực sự: python3 cập nhật/đọc lại ba tài liệu và assertion nội dung đạt. Chưa có API để chạy test.
- Bước nhỏ tiếp theo: review lỗi thời gian đặt sân, bắt đầu với startAt đã qua khi backend kiểm tra.
- Gợi ý commit khi có Git: `docs: approve court not found error response`. Chưa commit/push.

### 2026-11-03 — FB-002: duyệt lỗi giờ bắt đầu không ở tương lai

- Người học xác nhận “Ừm ok.” với HTTP 400/VALIDATION_ERROR và details startAt: “Giờ bắt đầu phải nằm trong tương lai.” Áp dụng startAt <= thời điểm backend kiểm tra, kiểm tra lại sau chờ khóa; không tạo booking/giữ slot khi từ chối.
- DESIGN ghi hợp đồng; INTERVIEW_PREP giữ G1-06 Cần ôn, không nâng mức hiểu từ lời duyệt. FB-002 IN_PROGRESS.
- Kiểm tra thực sự: python3 cập nhật/đọc lại ba tài liệu và assertion nội dung đạt. Chưa có API để chạy test.
- Bước nhỏ tiếp theo: review nhóm lỗi thời gian còn lại: cửa sổ ngày, mốc 00/30 và giờ mở cửa.
- Gợi ý commit khi có Git: `docs: approve booking start time validation response`. Chưa commit/push.

### 2026-11-03 — FB-002: duyệt nhóm lỗi thời gian còn lại

- Người học duyệt nhóm 400/VALIDATION_ERROR cho cửa sổ hôm nay đến hôm nay+7, mốc 00/30 chính xác, bắt đầu trước 06:00 và kết thúc quá 22:00 cùng ngày theo giờ Việt Nam. DESIGN lưu field/message; không làm tròn input, không tạo booking/giữ slot khi từ chối.
- INTERVIEW_PREP ghi xác nhận, giữ G1-06 Cần ôn. FB-002 IN_PROGRESS; chưa có API hoặc test.
- Kiểm tra thực sự: python3 cập nhật/đọc lại ba tài liệu và assertion nội dung đạt; không chạy test ứng dụng.
- Bước nhỏ tiếp theo: tổng hợp hợp đồng POST /bookings, rà soát phần request/xác thực còn thiếu trước khi chuyển API khác.
- Gợi ý commit khi có Git: `docs: approve booking time validation rules`. Chưa commit/push.

### 2026-11-03 — FB-002: duyệt lỗi chưa xác thực

- Người học duyệt HTTP 401/UNAUTHENTICATED cho thiếu token, token không hợp lệ/hết hạn; message hướng dẫn đăng nhập lại. DESIGN ghi hợp đồng và ghi chú FE có thể refresh trước, cơ chế refresh/retry còn cần thiết kế riêng.
- INTERVIEW_PREP ghi xác nhận, giữ G1-06 Cần ôn. FB-002 IN_PROGRESS.
- Kiểm tra thực sự: python3 cập nhật/đọc lại ba tài liệu và assertion nội dung đạt. Chưa có API để test.
- Bước nhỏ tiếp theo: review validation body POST /bookings: trường bắt buộc, kiểu dữ liệu, startAt có múi giờ.
- Gợi ý commit khi có Git: `docs: approve unauthenticated booking response`. Chưa commit/push.

### 2026-11-03 — FB-002: duyệt validation body tạo booking

- Người học duyệt courtId/startAt/durationMinutes bắt buộc, startAt ISO 8601 có múi giờ, durationMinutes là number thuộc 30/60/90/120 và từ chối trường ngoài hợp đồng bằng 400/VALIDATION_ERROR. DESIGN tổng hợp request, giữ kiểu ID chờ chốt.
- Backend lấy danh tính từ JWT, tự tính endAt/giá và gán trạng thái. Chưa triển khai parser/validation/API hoặc chọn thêm dependency.
- INTERVIEW_PREP ghi phản hồi, giữ G1-06 Cần ôn. FB-002 IN_PROGRESS.
- Kiểm tra thực sự: python3 cập nhật/đọc lại ba tài liệu và assertion nội dung đạt; chưa có API để chạy test.
- Bước nhỏ tiếp theo: chốt quyền theo vai trò của POST /bookings, đối chiếu phạm vi chưa có admin đặt hộ.
- Gợi ý commit khi có Git: `docs: approve booking request validation contract`. Chưa commit/push.

### 2026-11-03 — FB-002: duyệt quyền tạo booking

- Người học chốt POST /bookings chỉ cho CUSTOMER; ADMIN gọi endpoint nhận 403/FORBIDDEN với thông báo không có quyền. Không bổ sung admin đặt hộ. DESIGN ghi hợp đồng và cập nhật ghi chú quyền còn chờ trước đó.
- INTERVIEW_PREP ghi quyết định, giữ G1-06 Cần ôn; không suy diễn thành bằng chứng hiểu middleware. FB-002 IN_PROGRESS.
- Kiểm tra thực sự: python3 cập nhật/đọc lại ba tài liệu và assertion nội dung đạt. Chưa có ứng dụng để test quyền/API.
- Bước nhỏ tiếp theo: review thứ tự kiểm tra/trả lỗi khi nhiều điều kiện đặt không hợp lệ cùng lúc.
- Gợi ý commit khi có Git: `docs: approve customer-only booking creation`. Chưa commit/push.

### 2026-11-03 — FB-002: duyệt thứ tự xử lý tạo booking

- Người học duyệt thứ tự xác thực, vai trò, body, khóa User/kiểm tra chặn, đọc Court dưới khóa/kiểm tra sân, kiểm tra lại thời gian/đếm hạn mức, tạo booking/slot nguyên tử. DESIGN ghi rõ trả lỗi gặp trước và chỉ trả 201 sau commit.
- INTERVIEW_PREP ghi phản hồi duyệt, giữ G1-06 Cần ôn. FB-002 IN_PROGRESS; chưa nghiệm thu toàn bộ thiết kế API hoặc triển khai.
- Kiểm tra thực sự: python3 cập nhật/đọc lại ba tài liệu và assertion nội dung đạt. Chưa có API/database để chạy test.
- Bước nhỏ tiếp theo: người học xác định lỗi trả trước khi ADMIN có token hợp lệ gửi durationMinutes=45.
- Gợi ý commit khi có Git: `docs: approve booking creation processing order`. Chưa commit/push.

### 2026-11-03 — FB-002: review đúng thứ tự quyền trước validation

- Với ADMIN có token hợp lệ gửi durationMinutes=45, người học trả lời đúng FORBIDDEN trước vì không có quyền nên chưa cần validate body. Mentor xác nhận HTTP 403 theo thứ tự hợp đồng đã chốt.
- INTERVIEW_PREP ghi bằng chứng giải thích độc lập trong tình huống cụ thể, giữ G1-06 Cần ôn cho phạm vi còn lại. Không đổi thiết kế hoặc tự đánh dấu FB-002 DONE; ticket giữ IN_PROGRESS.
- Kiểm tra thực sự: python3 cập nhật/đọc lại hai tài liệu và assertion nội dung đạt; chưa có API để test.
- Bước nhỏ tiếp theo: thiết kế API xem danh sách booking cá nhân.
- Gợi ý commit khi có Git: `docs: record authorization order review evidence`. Chưa commit/push.

### 2026-11-03 — FB-002: duyệt phạm vi API lịch cá nhân

- Người học duyệt GET /bookings/me chỉ cho CUSTOMER, userId từ JWT đã xác thực, không nhận userId từ query. Trả HTTP 200/data array gồm booking của chính khách, cả đã hủy/đã qua; chưa có booking trả array rỗng.
- DESIGN ghi hợp đồng cơ bản, giữ phần trường/sắp xếp/lọc/phân trang chưa chốt. INTERVIEW_PREP ghi xác nhận, giữ G1-06 Cần ôn. FB-002 IN_PROGRESS.
- Kiểm tra thực sự: python3 cập nhật/đọc lại ba tài liệu và assertion nội dung đạt. Chưa có API để test.
- Bước nhỏ tiếp theo: review bộ trường từng booking và thứ tự mặc định của GET /bookings/me.
- Gợi ý commit khi có Git: `docs: approve personal booking list API scope`. Chưa commit/push.

### 2026-11-03 — FB-002: duyệt dữ liệu và sắp xếp lịch cá nhân

- Người học duyệt bộ trường như response tạo booking, thêm cancelledAt/null, sắp xếp createdAt DESC với id phụ; giữ CONFIRMED/CANCELLED và suy ra nhãn thời gian. DESIGN ghi quyết định, chưa chốt phân trang/lọc.
- INTERVIEW_PREP ghi xác nhận, giữ G1-06 Cần ôn. FB-002 IN_PROGRESS.
- Kiểm tra thực sự: python3 cập nhật/đọc lại ba tài liệu và assertion nội dung đạt. Chưa có API để test.
- Bước nhỏ tiếp theo: review phân trang GET /bookings/me và metadata response danh sách.
- Gợi ý commit khi có Git: `docs: approve personal booking list fields and ordering`. Chưa commit/push.

### 2026-11-03 — FB-002: duyệt phân trang lịch cá nhân

- Người học duyệt GET /bookings/me với page=1/limit=10 mặc định, limit tối đa 50, kiểm tra số nguyên dương, 400/VALIDATION_ERROR khi sai. Response thêm meta page/limit/total/totalPages; total chỉ đếm booking của khách hiện tại, trang vượt phạm vi trả 200/data rỗng.
- DESIGN chốt createdAt DESC/id DESC và ví dụ metadata. Không tự thêm bộ lọc hoặc áp dụng limit cho endpoint khác. INTERVIEW_PREP ghi xác nhận, giữ Cần ôn; FB-002 IN_PROGRESS.
- Kiểm tra thực sự: python3 cập nhật/đọc lại ba tài liệu và assertion nội dung đạt. Chưa có API để test.
- Bước nhỏ tiếp theo: thiết kế API khách hủy booking của mình.
- Gợi ý commit khi có Git: `docs: approve personal booking pagination contract`. Chưa commit/push.

### 2026-11-03 — FB-002: duyệt hợp đồng cơ bản hủy booking

- Người học yêu cầu giải thích response 200/data booking sau cập nhật và transaction hủy/giải phóng slot; sau minh họa xác nhận “Ok được duyệt.”.
- DESIGN ghi POST /bookings/:bookingId/cancel chỉ cho CUSTOMER hủy booking mình, không body, hạn ít nhất 60 phút; trả 200 với booking CANCELLED/cancelledAt sau commit. Cập nhật booking và releasedAt toàn bộ slot nguyên tử, lỗi rollback, giữ lịch sử.
- Các lỗi/quyền sở hữu/hủy trùng và chi tiết khóa chưa đầy đủ. INTERVIEW_PREP giữ Cần ôn, không coi duyệt là giải thích độc lập. FB-002 IN_PROGRESS.
- Kiểm tra thực sự: python3 cập nhật/đọc lại ba tài liệu và assertion nội dung đạt; chưa có API/PostgreSQL để test.
- Bước nhỏ tiếp theo: review lỗi khi booking không tồn tại hoặc không thuộc khách đang đăng nhập.
- Gợi ý commit khi có Git: `docs: approve customer booking cancellation contract`. Chưa commit/push.

### 2026-11-03 — FB-002: duyệt kiểm tra chủ sở hữu khi hủy

- Sau câu hỏi ai tìm booking và giải thích luồng FE/backend/database, người học duyệt backend tìm theo bookingId URL và userId JWT; không tồn tại/không thuộc khách đều trả 404/BOOKING_NOT_FOUND. ID sai định dạng trả 400/VALIDATION_ERROR.
- DESIGN ghi hợp đồng; INTERVIEW_PREP ghi phản hồi sau giải thích, giữ Cần ôn. FB-002 IN_PROGRESS, chưa có test quyền sở hữu.
- Kiểm tra thực sự: python3 cập nhật/đọc lại ba tài liệu và assertion nội dung đạt. Chưa có API để test.
- Bước nhỏ tiếp theo: review lỗi yêu cầu hủy sau hạn 60 phút.
- Gợi ý commit khi có Git: `docs: approve cancellation ownership error response`. Chưa commit/push.

### 2026-11-03 — FB-002: duyệt lỗi quá hạn hủy

- Sau giải thích lý do lựa chọn 409, người học duyệt CANCELLATION_DEADLINE_PASSED và thông báo hạn hủy ít nhất 60 phút. DESIGN ghi mốc đúng 60 phút hợp lệ, quá hạn không sửa booking/slot; admin hủy riêng theo quyền đã chốt.
- INTERVIEW_PREP ghi phản hồi thực tế, giữ Cần ôn. FB-002 IN_PROGRESS; hủy lặp và thứ tự xử lý còn cần thiết kế.
- Kiểm tra thực sự: python3 cập nhật/đọc lại ba tài liệu và assertion nội dung đạt. Chưa có API để test.
- Bước nhỏ tiếp theo: review hành vi hủy lặp và hai request hủy đồng thời.
- Gợi ý commit khi có Git: `docs: approve cancellation deadline error response`. Chưa commit/push.

### 2026-11-03 — FB-002: duyệt hủy lặp và hủy đồng thời

- Người học duyệt 200 khi booking của mình đã CANCELLED, message “Booking đã được hủy.”, giữ cancelledAt/người hủy ban đầu và không giải phóng slot lần nữa. Kiểm tra đã hủy trước hạn 60 phút; quyền sở hữu vẫn kiểm tra trước khi trả dữ liệu.
- DESIGN ghi hướng khóa Booking phối hợp hai request hủy, request sau kiểm tra lại sau chờ; chi tiết thứ tự khóa chung và SQL còn cần hoàn thiện. INTERVIEW_PREP giữ Cần ôn, ghi xác nhận đúng phạm vi.
- Kiểm tra thực sự: python3 cập nhật/đọc lại ba tài liệu và assertion nội dung đạt. Chưa có API/PostgreSQL để test. FB-002 IN_PROGRESS.
- Bước nhỏ tiếp theo: người học review ví dụ gửi lại yêu cầu hủy sau hạn khi lần hủy đầu đã thành công.
- Gợi ý commit khi có Git: `docs: approve repeated cancellation behavior`. Chưa commit/push.

### 2026-11-03 — FB-002: gợi ý áp dụng hủy lặp sau mất response

- Người học chưa biết trả lời ví dụ hủy/commit 17:59 rồi gửi lại 18:01 cho booking 19:00, yêu cầu gợi ý. Mentor giải thích áp dụng hợp đồng đã duyệt: trả 200, giữ cancelledAt=17:59; mất response không hoàn tác commit.
- Không yêu cầu duyệt lại quy tắc đã chốt. INTERVIEW_PREP ghi rõ đây là hướng dẫn, giữ Cần ôn; FB-002 IN_PROGRESS.
- Kiểm tra thực sự: python3 cập nhật/đọc lại hai tài liệu và assertion nội dung đạt; chưa có API để test.
- Bước nhỏ tiếp theo: người học xác nhận lại điểm còn vướng về response mất so với dữ liệu đã commit.
- Gợi ý commit khi có Git: `docs: record repeated cancellation review guidance`. Chưa commit/push.

### 2026-11-03 — FB-002: xác nhận áp dụng hủy lặp khi mất response

- Người học xác nhận đã hiểu và duyệt cách xử lý ví dụ: đã hủy/commit 17:59, gửi lại 18:01 thì trả 200 và giữ cancelledAt ban đầu. Đây là xác nhận lại quy tắc hủy lặp đã có, không đổi hợp đồng DESIGN.
- INTERVIEW_PREP ghi đúng phản hồi sau hướng dẫn, giữ Cần ôn; FB-002 IN_PROGRESS.
- Kiểm tra thực sự: python3 cập nhật/đọc lại hai tài liệu và assertion nội dung đạt. Chưa có API để test.
- Bước nhỏ tiếp theo: review hợp đồng cơ bản API admin hủy booking.
- Gợi ý commit khi có Git: `docs: confirm cancellation retry review checkpoint`. Chưa commit/push.

### 2026-11-03 — FB-002: duyệt API admin hủy booking

- Người học duyệt POST /admin/bookings/:bookingId/cancel chỉ ADMIN, hủy mọi khách không giới hạn 60 phút, không body, cancelledById từ JWT; 200 với booking đã hủy, transaction giải phóng slot nguyên tử, giữ thông tin hủy ban đầu nếu lặp, 404 nếu không tồn tại.
- DESIGN ghi hợp đồng cơ bản; không tự thêm lý do hủy/đặt hộ hoặc hạn thời gian mới. INTERVIEW_PREP ghi xác nhận, giữ Cần ôn. FB-002 IN_PROGRESS.
- Kiểm tra thực sự: python3 cập nhật/đọc lại ba tài liệu và assertion nội dung đạt. Chưa có API để test.
- Bước nhỏ tiếp theo: review API danh sách booking toàn hệ thống cho admin.
- Gợi ý commit khi có Git: `docs: approve admin booking cancellation contract`. Chưa commit/push.

### 2026-11-03 — FB-002: duyệt phạm vi danh sách booking admin

- Người học duyệt GET /admin/bookings chỉ ADMIN, xem booking mọi khách gồm đã hủy/đã qua, page/limit mặc định 1/10 và limit tối đa 50, createdAt DESC/id DESC, response 200/data array/meta.
- DESIGN lưu hợp đồng cơ bản; bộ trường khách và bộ lọc còn chờ. Đã đối chiếu User có id/name/email/isBookingBlocked, chưa có phone. INTERVIEW_PREP giữ Cần ôn. FB-002 IN_PROGRESS.
- Kiểm tra thực sự: sed đọc bộ trường User; python3 cập nhật/đọc lại ba tài liệu và assertion nội dung đạt. Chưa có API để test.
- Bước nhỏ tiếp theo: review thông tin khách trong mỗi booking của danh sách admin.
- Gợi ý commit khi có Git: `docs: approve admin booking list scope`. Chưa commit/push.

### 2026-11-03 — FB-002: duyệt dữ liệu khách trong booking admin

- Người học duyệt tái dùng bộ trường lịch cá nhân và thêm customer {id, name, email, isBookingBlocked}. Thông tin tài khoản hiện hành, giá Booking vẫn là snapshot; không trả passwordHash/token.
- DESIGN lưu quyết định và cập nhật mục trường khách còn chờ. INTERVIEW_PREP giữ Cần ôn; FB-002 IN_PROGRESS.
- Kiểm tra thực sự: python3 cập nhật/đọc lại ba tài liệu và assertion nội dung đạt. Chưa có API để test.
- Bước nhỏ tiếp theo: review bộ lọc cơ bản cho GET /admin/bookings.
- Gợi ý commit khi có Git: `docs: approve customer fields in admin booking list`. Chưa commit/push.

### 2026-11-03 — FB-002: duyệt bộ lọc booking admin

- Người học duyệt query tùy chọn branchId/courtId/userId/status/date, kết hợp AND; date theo ngày bắt đầu booking giờ Việt Nam. Không lọc thì xem toàn hệ thống có phân trang; sai định dạng trả 400, không khớp trả 200/data rỗng, total sau lọc.
- DESIGN ghi bộ lọc, làm rõ khoảng ngày [đầu ngày, đầu ngày kế tiếp) theo giờ Việt Nam chuyển UTC, cập nhật ghi chú chờ lọc trước đó. Chưa thêm tìm kiếm tự do hoặc khoảng ngày.
- INTERVIEW_PREP ghi xác nhận, giữ Cần ôn; FB-002 IN_PROGRESS.
- Kiểm tra thực sự: python3 cập nhật/đọc lại ba tài liệu và assertion nội dung đạt. Chưa có API để test.
- Bước nhỏ tiếp theo: review API danh sách chi nhánh cho luồng chọn chi nhánh → sân.
- Gợi ý commit khi có Git: `docs: approve admin booking list filters`. Chưa commit/push.

### 2026-11-03 — FB-002: duyệt danh sách chi nhánh

- Người học duyệt GET /branches công khai, trả 200/data array id/name/address, rỗng khi chưa có chi nhánh; name ASC/id ASC, chưa phân trang bản đầu. Đặt sân vẫn cần đăng nhập theo hợp đồng riêng.
- DESIGN ghi hợp đồng, không tự thêm isActive/lọc ẩn Branch. INTERVIEW_PREP ghi xác nhận, giữ Cần ôn. FB-002 IN_PROGRESS.
- Kiểm tra thực sự: python3 cập nhật/đọc lại ba tài liệu và assertion nội dung đạt. Chưa có API để test.
- Bước nhỏ tiếp theo: review API danh sách sân theo chi nhánh.
- Gợi ý commit khi có Git: `docs: approve public branch list contract`. Chưa commit/push.

### 2026-11-03 — FB-002: bổ sung loại sân 5/7/11

- Người học yêu cầu Court phân loại theo số người mỗi đội: 5/7/11. Đã đồng bộ yêu cầu tại README/REQUIREMENTS/ROADMAP; DESIGN bỏ loại sân khỏi danh sách ngoài scope và ghi đề xuất playersPerTeam số nguyên 5/7/11 chờ duyệt.
- Không thêm kích thước cụ thể, bảng loại sân, dependency, tự tính giá hay cơ chế chia sân lớn thành sân nhỏ. Bộ lọc loại và hợp đồng GET /courts chưa được duyệt.
- INTERVIEW_PREP ghi yêu cầu thực tế, không tự nâng mức hiểu. FB-002 IN_PROGRESS.
- Kiểm tra thực sự: rg/sed đối chiếu phạm vi và Court; python3 cập nhật/đọc lại sáu tài liệu và assertion nội dung đạt. Chưa có ứng dụng để test.
- Bước nhỏ tiếp theo: người học review trường playersPerTeam, rồi tiếp tục GET /courts.
- Gợi ý commit khi có Git: `docs: add five seven and eleven-a-side court requirement`. Chưa commit/push.

### 2026-11-03 — FB-002: duyệt playersPerTeam trên Court

- Người học yêu cầu lưu phương án playersPerTeam: số nguyên bắt buộc 5/7/11, số người mỗi đội, admin chọn loại, lưu trực tiếp Court không có bảng loại riêng/giá trị mặc định. Thiết kế yêu cầu validation backend và ràng buộc database khi triển khai.
- DESIGN cập nhật cả bộ trường Court và mục loại sân; README/REQUIREMENTS chuyển từ chờ chốt sang quyết định hiện hành. Chưa triển khai schema/migration/code; hợp đồng GET /courts và bộ lọc loại vẫn cần review.
- INTERVIEW_PREP ghi xác nhận, giữ nguyên mức hiểu kỹ thuật; FB-002 IN_PROGRESS.
- Kiểm tra thực sự: sed/rg đối chiếu Court và nhãn chờ; python3 cập nhật/đọc lại năm tài liệu và assertion nội dung đạt. Không có API để chạy test.
- Bước nhỏ tiếp theo: tiếp tục GET /courts với playersPerTeam trong thông tin sân.
- Gợi ý commit khi có Git: `docs: approve court playersPerTeam field`. Chưa commit/push.

### 2026-11-03 — FB-002: tiếp tục đề xuất GET /courts

- Theo yêu cầu tiếp tục, DESIGN tổng hợp bản đề xuất GET /courts công khai chỉ sân hoạt động, thêm playersPerTeam vào response, đề xuất query lọc loại bên cạnh branchId, phân trang và sắp xếp name ASC/id ASC.
- Đây là bản chờ duyệt, không suy diễn đã duyệt endpoint/bộ lọc từ việc chốt trường Court. Chưa có câu trả lời kiến thức mới nên giữ nguyên INTERVIEW_PREP.
- Kiểm tra thực sự: python3 cập nhật/đọc lại DESIGN/PROGRESS và assertion nội dung đạt. Chưa có API để test; FB-002 IN_PROGRESS.
- Bước nhỏ tiếp theo: người học review hợp đồng GET /courts và bộ lọc loại sân.
- Gợi ý commit khi có Git: `docs: propose court list API with team size filter`. Chưa commit/push.

### 2026-11-03 — FB-002: duyệt danh sách sân và lọc loại

- Người học duyệt GET /courts công khai, chỉ sân hoạt động, lọc branchId/playersPerTeam tùy chọn bằng AND, loại 5/7/11; phân trang mặc định 1/10 tối đa 50, name ASC/id ASC. Response gồm playersPerTeam, giá hiện hành và Branch; 200/data/meta, 400 khi query sai, rỗng khi không khớp.
- DESIGN chuyển mục endpoint sang đã duyệt. INTERVIEW_PREP ghi quyết định, giữ Cần ôn; FB-002 IN_PROGRESS.
- Kiểm tra thực sự: python3 cập nhật/đọc lại ba tài liệu và assertion nội dung đạt. Chưa có API để test.
- Bước nhỏ tiếp theo: review GET /courts/:courtId.
- Gợi ý commit khi có Git: `docs: approve court list and team size filter`. Chưa commit/push.

### 2026-11-03 — FB-002: duyệt API chi tiết sân

- Người học duyệt GET /courts/:courtId công khai, trả 200/data object theo bộ trường sân; 400 khi ID sai định dạng, 404 khi không tồn tại. Sân vô hiệu hóa vẫn 200/isActive=false để xem đường dẫn cũ, POST đặt vẫn kiểm tra/từ chối theo hợp đồng.
- DESIGN ghi quyết định, giờ trống tách API riêng. INTERVIEW_PREP giữ Cần ôn; FB-002 IN_PROGRESS.
- Kiểm tra thực sự: python3 cập nhật/đọc lại ba tài liệu và assertion nội dung đạt. Chưa có API để test.
- Bước nhỏ tiếp theo: review đầu vào API giờ trống theo ngày và thời lượng.
- Gợi ý commit khi có Git: `docs: approve public court detail contract`. Chưa commit/push.

### 2026-11-03 — Kết thúc buổi sau khi duyệt chi tiết sân

- Người học yêu cầu tạm dừng và buổi sau tiếp tục. Dừng thiết kế thêm, lưu điểm bàn giao ở đầu PROGRESS và đề xuất availability chưa duyệt trong DESIGN.
- Buổi này đã duyệt các hợp đồng API booking/chi nhánh/sân nêu ở bàn giao; bổ sung Court.playersPerTeam. Chưa triển khai ứng dụng, schema/migration, test, CI hoặc deploy. FB-002 IN_PROGRESS.
- INTERVIEW_PREP giữ đánh giá theo câu trả lời thực tế; không nâng mức hiểu từ các phản hồi duyệt. Không tự trả lời suy ngẫm của người học.
- Kiểm tra thực sự cuối buổi: python3 đọc lại/assertion nhãn tạm dừng, đề xuất availability chưa duyệt và các mục bàn giao. Chưa có API để chạy test. Không commit/push.
- Bước nhỏ buổi sau: review đề xuất đầu vào và cách xác định giờ trống của availability.
- Gợi ý commit khi có Git: `docs: save availability API design handoff`.

### 2026-11-03 — Tổng quan vị trí sau buổi review API

- Người học yêu cầu xem toàn bộ chặng, vị trí hiện tại và ước tính còn lại. Đã đối chiếu ROADMAP, trạng thái PROGRESS và file thực tế: FB-000 IN_REVIEW, FB-001 DONE, FB-002 IN_PROGRESS đang tạm dừng, FB-003–015 TODO. Chưa có ứng dụng/Git repository sử dụng được.
- Cập nhật dòng FB-002 trong bảng công việc để khớp các hợp đồng API vừa duyệt; chưa coi FB-002 hoàn thành. Không tính phần trăm sản phẩm bằng số ticket.
- Giữ dự báo còn lại 50–80 giờ cho bản đầu hoàn chỉnh; mốc luồng local cơ bản 23–35 giờ theo nhóm dự báo hiện hành, chưa phải bản đã nghiệm thu. Chưa có số giờ thực tế để trừ hoặc chứng minh tiến độ theo thời gian.
- Kiểm tra thực sự: đọc ROADMAP/PROGRESS/INTERVIEW_PREP, rg --files chỉ thấy AGENTS/README ngoài docs, git status báo không phải Git repository; python3 kiểm tra đủ 16 ticket, tổng khoảng giờ và đọc lại nhật ký. Không chạy test ứng dụng.
- Không có câu trả lời kiến thức mới; giữ nguyên INTERVIEW_PREP. Giữ yêu cầu tạm dừng; không thiết kế thêm API.
- Đúng một bước buổi sau: review đề xuất availability đã lưu.
- Gợi ý commit khi có Git: `docs: refresh project position and remaining effort checkpoint`. Chưa commit/push.

Mẫu ghi buổi học tiếp theo:

```text
Ngày / buổi:
Ticket:
Mục tiêu buổi:
Người học đã làm:
AI hỗ trợ:
Đã kiểm tra (lệnh/thao tác + kết quả):
Bằng chứng:
Chưa kiểm tra / hạn chế:
Thời gian thực tế:
Điều người học tự giải thích được:
Câu hỏi còn cần ôn:
Vướng mắc và thử nghiệm đã làm:
Trạng thái sau buổi:
Bước nhỏ tiếp theo:
```

## Vướng mắc

Chưa có. Khi phát sinh, ghi: ticket, mong đợi, thực tế, log đã che secret, giả thuyết đã kiểm tra và thông tin cần hỗ trợ.

## Quyết định đã chốt

| Quyết định | Lý do / nguồn |
| --- | --- |
| Đặt sân bóng đá, nhóm sân theo chi nhánh/địa điểm (bổ sung 2026-11-02), slot cơ sở 30 phút; booking có thời lượng là bội số dương của 30 phút | Người học xác nhận đổi quy tắc ngày 2026-11-01, thay cho slot một giờ; chọn nhiều slot liên tiếp, đặt toàn bộ hoặc không đặt |
| Giá niêm yết mỗi 30 phút; tổng giá bằng giá mỗi slot × số slot | Người học yêu cầu và xác nhận ngày 2026-11-01; lưu giá lịch sử của booking |
| Giữ Express/TypeScript, Prisma/PostgreSQL, React | Dựa trên kỹ năng hiện tại |
| CI trước, deploy thủ công sau; chưa tự động deploy | CI/deploy là kiến thức mới |
| Chống trùng tại database, có test đồng thời | Trọng tâm tính đúng đắn của nghiệp vụ |
| Khoảng 30–40 giờ, VPS dự trù tối đa 200.000đ/tháng | Ước lượng học tập; giá dịch vụ chưa kiểm tra, domain riêng |

Chi tiết phát sinh trong triển khai ghi thêm tại đây và liên kết DESIGN nếu có. Không thuê VPS trước khi đến bước cần dùng.

### 2026-11-03 — Tiếp tục FB-002 từ điểm bàn giao availability

- Người học yêu cầu tiếp tục project. Đã đọc tài liệu tiến độ, roadmap, hướng dẫn và phần thiết kế/câu hỏi liên quan; tiếp tục review đầu vào/cách xác định giờ trống, chưa duyệt hợp đồng mới.
- Kiểm tra thực sự trên local: rg/ls xác nhận workspace chỉ có tài liệu, chưa có package.json/code; git status --short trả fatal: not a git repository. Chưa có ứng dụng để chạy test.
- DESIGN còn mục bước tiếp theo trỏ về POST booking đã review; đã sửa chỉ dẫn sang availability theo điểm bàn giao hiện hành.
- Chưa có câu trả lời kiến thức mới; giữ nguyên mức hiểu trong INTERVIEW_PREP. FB-002 giữ IN_PROGRESS.
- Bước nhỏ tiếp theo: người học xác định các giờ bắt đầu hợp lệ cho booking 90 phút khi sân đã có booking 19:00–20:00, để review cách ghép các slot liên tiếp.
- Gợi ý commit khi có Git: docs: resume availability contract review. Chưa commit/push.

### 2026-11-03 — Đề xuất cách trả giờ trống theo thời lượng

- Người học hỏi cách xét trùng và yêu cầu phương án. DESIGN bổ sung ví dụ 90 phút, quy tắc hai khoảng tiếp giáp, đề xuất data.availableStarts chứa startAt/endAt UTC theo ngày Việt Nam và thời lượng yêu cầu. Chưa duyệt, chưa triển khai.
- INTERVIEW_PREP ghi đúng yêu cầu/câu hỏi, giữ mức hiểu hiện hành; không ghi lời giải mentor thành câu trả lời người học.
- Kiểm tra thực sự: đọc phần liên quan, cập nhật/đọc lại DESIGN, INTERVIEW_PREP, PROGRESS và assertion nội dung. Chưa có ứng dụng/API để test. FB-002 IN_PROGRESS.
- Bước tiếp theo: người học review đề xuất API chỉ trả những giờ bắt đầu đủ toàn bộ thời lượng còn trống.
- Gợi ý commit khi có Git: docs: propose duration-based availability response. Chưa commit/push.

### 2026-11-03 — Duyệt luồng chọn thời lượng trước khi chọn giờ

- Người học diễn giải chọn thời lượng trước rồi chọn giờ; sau giải thích hệ thống lọc giờ hợp lệ trước khi chọn, xác nhận “đúng rồi”. DESIGN ghi duyệt luồng; chưa coi là duyệt toàn bộ response/mã lỗi/endpoint.
- INTERVIEW_PREP ghi phản hồi thực tế, giữ G1-03/G1-06 Cần ôn; chưa có bài áp dụng độc lập hoặc code/test. FB-002 IN_PROGRESS.
- Kiểm tra thực sự: đọc phần liên quan, cập nhật và đọc lại ba tài liệu bằng Python/assertion. Không chạy test ứng dụng vì chưa có code.
- Bước tiếp theo: người học review hợp đồng availability với đầu vào ngày/thời lượng và danh sách availableStarts.
- Gợi ý commit khi có Git: docs: approve duration-first booking selection flow. Chưa commit/push.

### 2026-11-03 — Duyệt danh sách availableStarts

- Người học xác nhận “Ok được duyệt.” cho danh sách availableStarts gồm startAt/endAt, sắp sớm đến muộn, trả [] nếu không có khoảng phù hợp. DESIGN ghi duyệt đúng phần này; đầu vào, các trường bao ngoài và lỗi còn review.
- INTERVIEW_PREP ghi phản hồi thực tế; không nâng mức hiểu từ việc duyệt đề xuất. FB-002 IN_PROGRESS.
- Kiểm tra thực sự: đọc/cập nhật/đọc lại ba tài liệu và assertion nội dung bằng Python. Chưa có code để chạy test API.
- Bước tiếp theo: người học review quy tắc đầu vào ngày và thời lượng của availability.
- Gợi ý commit khi có Git: docs: approve available start list response. Chưa commit/push.

### 2026-11-03 — Duyệt validation ngày/thời lượng availability

- Người học xác nhận “Ok.” cho date/durationMinutes bắt buộc, ngày lịch YYYY-MM-DD từ hôm nay đến +7 theo giờ Việt Nam, thời lượng 30/60/90/120; sai/thiếu trả 400/VALIDATION_ERROR kèm trường lỗi, hôm nay chỉ trả giờ tương lai. DESIGN đã ghi duyệt.
- Bổ sung đề xuất chờ review cho courtId sai định dạng, sân không tồn tại/vô hiệu hóa và thứ tự kiểm tra. FB-002 IN_PROGRESS; chưa có code/test.
- INTERVIEW_PREP ghi quyết định thực tế, không nâng mức hiểu từ xác nhận duyệt.
- Kiểm tra thực sự: đọc/cập nhật/đọc lại ba tài liệu và assertion nội dung bằng Python; không có API để test.
- Bước tiếp theo: người học review đề xuất lỗi courtId/trạng thái sân của availability.
- Gợi ý commit khi có Git: docs: approve availability input validation. Chưa commit/push.

### 2026-11-03 — Duyệt lỗi courtId và trạng thái sân cho availability

- Người học xác nhận “Ok hợp lý.” cho bảng lỗi courtId sai định dạng 400/VALIDATION_ERROR, sân không tồn tại 404/COURT_NOT_FOUND, sân ngừng nhận đặt 409/COURT_INACTIVE; validate đầu vào trước, rồi tìm sân/kiểm tra trạng thái. Sân hoạt động nhưng không có giờ phù hợp trả 200/availableStarts=[]. DESIGN đã ghi duyệt.
- INTERVIEW_PREP ghi quyết định; không nâng mức hiểu từ xác nhận. FB-002 IN_PROGRESS; chưa triển khai.
- Kiểm tra thực sự: đọc/cập nhật/đọc lại ba tài liệu bằng Python và assertion; chưa có API để test.
- Bước tiếp theo: người học review endpoint công khai và khung response success/data của availability.
- Gợi ý commit khi có Git: docs: approve availability court error handling. Chưa commit/push.

### 2026-11-03 — Duyệt endpoint và khung response availability

- Người học xác nhận “Oke.” cho GET /courts/:courtId/availability công khai, HTTP 200 theo khung success/message/data; data gồm courtId/date/durationMinutes/availableStarts, startAt/endAt UTC và giao diện dùng giờ Việt Nam. DESIGN đã ghi duyệt, bỏ các nhãn chờ review đã lỗi thời trong phần availability.
- Hợp đồng availability đã duyệt; FB-002 vẫn IN_PROGRESS vì còn API quản trị/auth/schema/ràng buộc chi tiết và nghiệm thu thiết kế. Chưa có code/test.
- INTERVIEW_PREP ghi xác nhận thực tế, không nâng mức hiểu chỉ vì duyệt thiết kế.
- Kiểm tra thực sự: đọc/cập nhật/đọc lại ba tài liệu bằng Python và assertion nội dung; chưa có ứng dụng để chạy test.
- Bước tiếp theo: người học trả lời tình huống giờ vừa bị người khác đặt sau khi tải availability; ôn này không chặn thiết kế API quản trị sân tiếp theo.
- Gợi ý commit khi có Git: docs: approve public availability API contract. Chưa commit/push.

### 2026-11-03 — Review tình huống bị đặt trước sau khi xem availability

- Người học đề xuất thông báo đã có người đặt trước và chọn sân/giờ khác. Đúng phần nhận diện xung đột và hướng phục hồi; chưa nêu mã HTTP hoặc cập nhật lịch.
- Mentor bổ sung theo DESIGN hiện hành: 409/BOOKING_SLOT_CONFLICT, rollback toàn bộ; giao diện thông báo, tải lại availability theo lựa chọn hiện tại, bỏ giờ không còn hợp lệ và yêu cầu chọn lại. Không tự thay sân/giờ hoặc tự gửi lại request đặt. Đây là giải thích mentor, chưa phải phần người học tự trả lời.
- INTERVIEW_PREP ghi đúng/thiếu, G2-06 giữ Cần ôn. FB-002 IN_PROGRESS; phần ôn không chặn API quản trị sân.
- Kiểm tra thực sự: rg/đọc đối chiếu mã lỗi và rollback trong DESIGN, cập nhật/đọc lại PROGRESS/INTERVIEW_PREP bằng Python/assertion. Chưa có ứng dụng để test.
- Bước tiếp theo: người học nêu các trường admin cần gửi để tạo sân, làm đầu vào thiết kế POST /admin/courts.
- Gợi ý commit khi có Git: docs: record availability conflict recovery review. Chưa commit/push.

### 2026-11-03 — Đề xuất body admin tạo sân

- Người học nêu tên/địa chỉ/giá, yêu cầu bổ sung từ bảng Court để duyệt. Mentor đối chiếu thiết kế: địa chỉ thuộc Branch; body tạo Court dùng branchId/name/playersPerTeam/pricePerSlot, isActive tùy chọn mặc định true, cho phép false. id/timestamps do hệ thống sinh.
- DESIGN ghi riêng đề xuất POST /admin/courts chờ duyệt; không thêm trường nghiệp vụ/dependency/unique tên. Response và validation/lỗi chi tiết còn review.
- INTERVIEW_PREP ghi câu trả lời thực tế và điểm cần chỉnh về vị trí địa chỉ; không nâng mức hiểu. FB-002 IN_PROGRESS.
- Kiểm tra thực sự: đọc/rg đối chiếu Court, Branch, loại sân và miền giá; cập nhật/đọc lại ba tài liệu bằng Python/assertion. Chưa có code/API để test.
- Bước tiếp theo: người học duyệt bộ trường body tạo sân, gồm isActive tùy chọn mặc định true.
- Gợi ý commit khi có Git: docs: propose admin court creation input. Chưa commit/push.

### 2026-11-03 — Duyệt đầu vào và quyền API tạo sân

- Người học xác nhận “Ok hợp lý.” cho đề xuất POST /admin/courts chỉ ADMIN, body branchId/name/playersPerTeam/pricePerSlot và isActive tùy chọn mặc định true. DESIGN ghi duyệt; địa chỉ qua Branch, id/timestamps do hệ thống sinh.
- Đề xuất tiếp response 201/data object như chi tiết sân, 400/VALIDATION_ERROR khi body sai, 404/BRANCH_NOT_FOUND khi chi nhánh không tồn tại, kiểm tra xác thực/quyền trước body. Chuẩn hóa mã 401 trong đề xuất thành UNAUTHENTICATED theo hợp đồng hiện có (thay UNAUTHORIZED ghi nhầm). Các mã lỗi/response còn chờ duyệt.
- INTERVIEW_PREP ghi quyết định, không nâng mức hiểu. FB-002 IN_PROGRESS; độ dài tên/trùng tên/field thừa còn chốt.
- Kiểm tra thực sự: đọc đối chiếu Court, quyền và mã 401 hiện hành; cập nhật/đọc lại ba tài liệu bằng Python/assertion. Chưa có API/code để test.
- Bước tiếp theo: người học review response thành công và các lỗi chính của POST /admin/courts.
- Gợi ý commit khi có Git: docs: approve admin court creation body. Chưa commit/push.

### 2026-11-03 — Duyệt response và lỗi API tạo sân

- Người học xác nhận “Ok duyệt.” cho response 201/data object sân như GET chi tiết, lỗi 400/VALIDATION_ERROR, 404/BRANCH_NOT_FOUND, 401/UNAUTHENTICATED, 403/FORBIDDEN và thứ tự kiểm tra. DESIGN đã chuyển phần này sang đã duyệt.
- Đề xuất còn chờ duyệt: tên sau trim dài 1–100, chưa cấm trùng tên, từ chối field ngoài body bằng 400/details. Không thêm unique/dependency/code.
- INTERVIEW_PREP ghi xác nhận thực tế, không nâng mức hiểu. FB-002 IN_PROGRESS.
- Kiểm tra thực sự: đọc/cập nhật/đọc lại ba tài liệu bằng Python/assertion; chưa có ứng dụng để test API.
- Bước tiếp theo: người học chọn quy tắc tên và field thừa của body tạo sân.
- Gợi ý commit khi có Git: docs: approve court creation response and errors. Chưa commit/push.

### 2026-11-03 — Yêu cầu cấm trùng tên sân

- Người học từ chối cho phép trùng tên để hạn chế rủi ro/hiểu lầm. Đã ghi yêu cầu trong README/REQUIREMENTS/DESIGN, bỏ đề xuất cho phép trùng. Chưa tự coi người học đã chọn phạm vi toàn hệ thống hay trong chi nhánh.
- Mentor đề xuất tên duy nhất toàn hệ thống, gồm sân vô hiệu hóa, trim/gộp khoảng trắng và so sánh không phân biệt hoa thường (vẫn phân biệt dấu), lỗi 409/COURT_NAME_CONFLICT; database phải bảo vệ uniqueness khi triển khai. Đây là chi tiết chờ duyệt, chưa có SQL/schema/code.
- INTERVIEW_PREP ghi quyết định/lý do thực tế, không tự nâng mức hiểu ràng buộc/concurrency. FB-002 IN_PROGRESS.
- Kiểm tra thực sự: đọc/cập nhật/đọc lại năm tài liệu bằng Python/assertion; chưa có API/database để test.
- Bước tiếp theo: người học duyệt phạm vi và quy tắc so sánh tên sân cùng lỗi trùng.
- Gợi ý commit khi có Git: docs: require unique court names pending comparison policy. Chưa commit/push.

### 2026-11-03 — Chốt tên sân duy nhất trong chi nhánh

- Người học hỏi tính hợp lý của cấm trùng toàn hệ thống. Mentor điều chỉnh khuyến nghị theo mô hình Branch; người học đồng ý “Ừm.” với duy nhất trong mỗi chi nhánh, cho trùng giữa các chi nhánh, gồm sân ngừng nhận đặt, chuẩn hóa khoảng trắng và so sánh không phân biệt hoa/thường. Thay đề xuất duy nhất toàn hệ thống.
- Đồng bộ README/REQUIREMENTS/DESIGN; giao diện hiển thị sân cùng chi nhánh. Khi triển khai cần database bảo vệ cặp chi nhánh/tên chuẩn hóa khi tạo/đổi tên/chuyển chi nhánh. Chưa có SQL/schema/code/test.
- INTERVIEW_PREP ghi quyết định thực tế, không tự nâng mức hiểu constraint/concurrency. FB-002 IN_PROGRESS.
- Kiểm tra thực sự: rg đối chiếu các chỗ nhắc trùng tên, cập nhật/đọc lại năm tài liệu bằng Python/assertion; chưa có ứng dụng để test. Nhật ký cũ giữ làm lịch sử, quy tắc hiện hành ghi ở đầu PROGRESS và DESIGN.
- Bước tiếp theo: người học duyệt giới hạn tên 1–100, từ chối field thừa và lỗi trùng 409/COURT_NAME_CONFLICT.
- Gợi ý commit khi có Git: docs: scope court name uniqueness to each branch. Chưa commit/push.

### 2026-11-03 — Chốt validation chi tiết tạo sân

- Người học xác nhận “Ok.” cho tên 1–100 sau chuẩn hóa, từ chối field thừa bằng 400/VALIDATION_ERROR/details và lỗi trùng 409/COURT_NAME_CONFLICT. DESIGN đã bỏ nhãn chờ duyệt của hợp đồng tạo sân.
- Đề xuất bước kế tiếp PATCH sửa sân theo trường gửi lên; chưa cho đổi branchId vì Court/Branch hiện hành là nguồn địa điểm booking. Giới hạn này chờ duyệt, chưa đổi quy tắc nghiệp vụ trong README/REQUIREMENTS.
- INTERVIEW_PREP ghi quyết định, không nâng mức hiểu từ xác nhận. FB-002 IN_PROGRESS; chưa có code/schema/test.
- Kiểm tra thực sự: đọc/cập nhật/đọc lại ba tài liệu bằng Python/assertion; chưa có ứng dụng để test.
- Bước tiếp theo: người học duyệt bộ trường và giới hạn sửa sân.
- Gợi ý commit khi có Git: docs: finalize court creation validation contract. Chưa commit/push.

### 2026-11-03 — Duyệt bộ trường và giới hạn sửa sân

- Người học xác nhận “Ok.” cho PATCH chỉ ADMIN, sửa name/playersPerTeam/pricePerSlot/isActive, ít nhất một trường, validation như tạo sân, trường không gửi giữ nguyên; không tự áp mặc định isActive=true. Không cho đổi branchId trong bản đầu.
- Đồng bộ README/REQUIREMENTS/DESIGN về giới hạn chuyển chi nhánh; giá lịch sử/booking hiện có giữ quy tắc đã chốt. Bỏ các diễn đạt hiện hành ngụ ý cho phép chuyển chi nhánh.
- DESIGN đề xuất response 200/data sân sau lưu, lỗi 401/403/400/404/409 và cập nhật nhiều trường nguyên tử, không coi tên hiện có của chính sân là trùng. Các chi tiết này chờ duyệt; chưa có code/test.
- INTERVIEW_PREP ghi xác nhận thực tế, không nâng mức hiểu. FB-002 IN_PROGRESS.
- Kiểm tra thực sự: đọc/cập nhật/đọc lại năm tài liệu bằng Python/assertion; chưa có API/database để test.
- Bước tiếp theo: người học review response/lỗi và tính nguyên tử của PATCH sửa sân.
- Gợi ý commit khi có Git: docs: approve court update fields and fixed branch. Chưa commit/push.

### 2026-11-03 — Duyệt response/lỗi và tính nguyên tử sửa sân

- Người học xác nhận “Ok.” cho response 200/data sân sau cập nhật, lỗi 400/404/409/401/403 và quy tắc cập nhật nhiều trường toàn bộ hoặc không đổi gì. DESIGN ghi hợp đồng PATCH đã duyệt, chưa triển khai/test SQL/concurrency.
- Đề xuất bước kế tiếp GET /admin/courts: chỉ ADMIN, xem cả sân vô hiệu hóa, bộ lọc branchId/playersPerTeam/isActive kết hợp AND, phân trang tương tự GET /courts. Đề xuất chờ duyệt.
- INTERVIEW_PREP ghi xác nhận thực tế, không nâng mức hiểu từ đồng ý thiết kế. FB-002 IN_PROGRESS.
- Kiểm tra thực sự: đọc/đối chiếu danh sách sân công khai, cập nhật/đọc lại ba tài liệu bằng Python/assertion; chưa có API để test.
- Bước tiếp theo: người học duyệt hợp đồng danh sách sân admin.
- Gợi ý commit khi có Git: docs: approve court update response and atomicity. Chưa commit/push.

### 2026-11-03 — Duyệt danh sách sân quản trị

- Người học xác nhận “Ok.” cho GET /admin/courts chỉ ADMIN, mặc định gồm sân hoạt động/vô hiệu hóa, lọc branchId/playersPerTeam/isActive kết hợp AND, phân trang/sắp xếp/data/meta và lỗi 400/401/403. DESIGN chuyển sang đã duyệt.
- Bước kế tiếp đề xuất GET /admin/customers: chỉ CUSTOMER, lọc isBookingBlocked, data không có hash/token/lý do chặn trên User, phân trang và sắp mới nhất. Chưa duyệt/triển khai.
- INTERVIEW_PREP ghi xác nhận thực tế, không nâng mức hiểu. FB-002 IN_PROGRESS.
- Kiểm tra thực sự: đọc đối chiếu User và phạm vi quản lý khách trong REQUIREMENTS, cập nhật/đọc lại ba tài liệu bằng Python/assertion; chưa có API để test.
- Bước tiếp theo: người học review hợp đồng danh sách khách admin.
- Gợi ý commit khi có Git: docs: approve admin court listing contract. Chưa commit/push.

### 2026-11-03 — Duyệt danh sách tài khoản khách

- Người học xác nhận “Ok.” cho GET /admin/customers chỉ ADMIN, chỉ liệt kê CUSTOMER, lọc isBookingBlocked, phân trang/sắp mới nhất, data id/name/email/isBookingBlocked/createdAt, meta và lỗi 400/401/403. DESIGN chuyển sang đã duyệt.
- Đề xuất bước kế tiếp POST /admin/customers body name/email/password; backend gán CUSTOMER và chưa chặn đặt, không tự đăng nhập khách/thay phiên admin. Validation tên/email/password và response/lỗi còn review. Chưa triển khai.
- INTERVIEW_PREP ghi quyết định, không nâng mức hiểu từ xác nhận. FB-002 IN_PROGRESS.
- Kiểm tra thực sự: đọc đối chiếu User và phạm vi tạo khách, cập nhật/đọc lại ba tài liệu bằng Python/assertion; chưa có API để test.
- Bước tiếp theo: người học duyệt body và hành vi tạo tài khoản khách.
- Gợi ý commit khi có Git: docs: approve admin customer listing contract. Chưa commit/push.

### 2026-11-03 — Duyệt tạo khách và phạm vi cập nhật tài khoản

- Người học hỏi admin chỉ cập nhật isBookingBlocked cho CUSTOMER; sau giải thích xác nhận “Ok duyệt.”. Ghi duyệt body/hành vi tạo khách và phạm vi admin sau tạo chỉ chặn/mở chặn đặt mới, không sửa tên/email/mật khẩu/role hoặc chặn ADMIN. Mỗi lần thành công cần lý do/lịch sử nguyên tử.
- Đồng bộ README/REQUIREMENTS/DESIGN; validation/response/lỗi tạo khách vẫn còn chốt cùng auth.
- Đề xuất PATCH /admin/customers/:customerId/booking-block với body isBookingBlocked/reason; actorId lấy từ JWT, reason chỉ ở lịch sử. Body/endpoint này chờ duyệt; retry/trạng thái giống hiện tại/concurrency chưa chốt.
- INTERVIEW_PREP ghi phản hồi thực tế, không nâng mức hiểu. FB-002 IN_PROGRESS.
- Kiểm tra thực sự: đọc đối chiếu User/BookingBlockHistory và phạm vi, cập nhật/đọc lại năm tài liệu bằng Python/assertion; chưa có API/database để test.
- Bước tiếp theo: người học duyệt đầu vào API chặn/mở chặn.
- Gợi ý commit khi có Git: docs: approve admin customer management scope. Chưa commit/push.

### 2026-11-03 — Duyệt endpoint/body chặn và mở chặn đặt

- Người học xác nhận “Ok.” cho PATCH /admin/customers/:customerId/booking-block, chỉ ADMIN/đích CUSTOMER, body isBookingBlocked boolean và reason bắt buộc không rỗng; actor từ danh tính xác thực, cập nhật/lịch sử nguyên tử. DESIGN ghi duyệt.
- Đề xuất trạng thái đã giống yêu cầu trả 200/changed=false, không update/lịch sử; đổi trạng thái trả changed=true và ghi một sự kiện. Reason vẫn validate. Chờ duyệt, chưa đổi quy tắc README/REQUIREMENTS.
- Đề xuất đọc/so sánh dưới khóa User để phối hợp với đặt booking; không cam kết dedup request qua thao tác đảo trạng thái xen giữa. Concurrency chi tiết vẫn cần review/kiểm chứng.
- INTERVIEW_PREP ghi phản hồi thực tế, không nâng mức hiểu. FB-002 IN_PROGRESS.
- Kiểm tra thực sự: đọc/cập nhật/đọc lại ba tài liệu bằng Python/assertion; chưa có API/database để test.
- Bước tiếp theo: người học review hành vi khi trạng thái đã giống yêu cầu.
- Gợi ý commit khi có Git: docs: approve customer booking block input contract. Chưa commit/push.

### 2026-11-03 — Duyệt thao tác chặn không đổi trạng thái

- Người học xác nhận “Ok.” cho bảng trạng thái, giữ nguyên/không thêm lịch sử khi trạng thái đã giống yêu cầu, HTTP 200/changed=false; có thay đổi thì changed=true và ghi lịch sử, reason luôn hợp lệ.
- Đồng bộ README/REQUIREMENTS/DESIGN, làm rõ lịch sử chỉ ghi thay đổi thực sự. Khóa/phối hợp request đồng thời vẫn là đề xuất cần review/kiểm chứng; không suy ra đã duyệt toàn bộ kỹ thuật từ phản hồi này.
- Đề xuất response data id/isBookingBlocked/changed, reason sau trim 1–500, lỗi 400/401/403/404 (đích ADMIN cũng CUSTOMER_NOT_FOUND). Các chi tiết này chờ duyệt.
- INTERVIEW_PREP ghi quyết định, không nâng mức hiểu retry/transaction từ xác nhận. FB-002 IN_PROGRESS.
- Kiểm tra thực sự: đọc/cập nhật/đọc lại năm tài liệu bằng Python/assertion; chưa có API/database để test.
- Bước tiếp theo: người học duyệt response/lỗi và giới hạn reason của API chặn/mở chặn.
- Gợi ý commit khi có Git: docs: approve unchanged booking block state behavior. Chưa commit/push.

### 2026-11-03 — Duyệt response/lỗi và giới hạn lý do chặn đặt

- Người học xác nhận “Ok.” cho response 200/data id/isBookingBlocked/changed, reason trim dài 1–500, lỗi 400/404/401/403 và thứ tự xác thực/quyền/đầu vào/đích/trạng thái-lịch sử. DESIGN chuyển phần này sang đã duyệt; concurrency chi tiết vẫn chưa review/kiểm chứng.
- Đề xuất tiếp API GET lịch sử chặn theo customerId, chỉ ADMIN, data gồm action/reason/time/actor, phân trang và lỗi nhất quán. Chưa duyệt/triển khai.
- INTERVIEW_PREP ghi phản hồi thực tế, không nâng mức hiểu từ duyệt thiết kế. FB-002 IN_PROGRESS.
- Kiểm tra thực sự: đọc đối chiếu BookingBlockHistory và hợp đồng chặn, cập nhật/đọc lại ba tài liệu bằng Python/assertion; chưa có API/database để test.
- Bước tiếp theo: người học review hợp đồng API lịch sử chặn/mở chặn của khách.
- Gợi ý commit khi có Git: docs: approve booking block response and validation. Chưa commit/push.

### 2026-11-03 — Chốt API xem lịch sử chặn đặt

- Người học hỏi mục đích lịch sử, mentor giải thích truy ai thao tác/khi nào/vì sao, khác với trạng thái hiện tại trên User. Người học xác nhận “À Ok hiểu rồi chốt đi.”. DESIGN ghi duyệt GET lịch sử chỉ ADMIN, data/action/reason/time/actor, phân trang và lỗi; không sửa/xóa lịch sử.
- INTERVIEW_PREP ghi câu hỏi/xác nhận, không ghi giải thích mentor thành câu trả lời độc lập hoặc nâng mức hiểu. FB-002 IN_PROGRESS.
- Đề xuất phần tiếp theo response/lỗi tạo khách: 201/data tài khoản, 409/EMAIL_ALREADY_EXISTS, 400/401/403. Validation tên/email/password vẫn cần chốt cùng auth. Chưa có code/test.
- Kiểm tra thực sự: đọc/cập nhật/đọc lại ba tài liệu bằng Python/assertion; chưa có API/database để test.
- Bước tiếp theo: người học review response/lỗi tạo tài khoản khách.
- Gợi ý commit khi có Git: docs: approve customer booking block history API. Chưa commit/push.

### 2026-11-03 — Bỏ admin tạo khách, khách tự đặt mật khẩu khi đăng ký

- Người học hỏi mật khẩu được cấp ra sao. Mentor giải thích đề xuất cũ yêu cầu admin nhập, nêu nhược điểm và khuyên khách tự đăng ký là luồng chính. Người học yêu cầu làm theo đề xuất; áp dụng phương án bỏ admin tạo khách, khách tự đăng ký/tự đặt mật khẩu.
- Đồng bộ README/REQUIREMENTS/ROADMAP/DESIGN và tiến độ hiện hành. DESIGN gỡ hợp đồng POST /admin/customers, giữ quyết định thay thế; nhật ký cũ là lịch sử, không còn chỉ dẫn triển khai admin tạo khách.
- Không thêm đổi mật khẩu, quên mật khẩu hoặc email lời mời; admin vẫn xem khách/chặn/mở chặn/tra lịch sử. Chưa đổi code vì workspace chưa có ứng dụng.
- INTERVIEW_PREP ghi câu hỏi/quyết định thực tế, không nâng mức hiểu. FB-002 IN_PROGRESS.
- Kiểm tra thực sự: rg/đọc đối chiếu các tài liệu liên quan, cập nhật/đọc lại sáu tài liệu bằng Python/assertion. Chưa có API/database để test.
- Bước tiếp theo: người học review validation đăng ký name/email/password.
- Gợi ý commit khi có Git: docs: use customer self-registration instead of admin account creation. Chưa commit/push.

### 2026-11-03 — Đối chiếu nghiệm thu FB-002

- Người học hỏi FB-002 đã xong chưa. Đối chiếu ROADMAP và DESIGN: chưa xong, giữ IN_PROGRESS. Đã chốt phần lớn nghiệp vụ/mô hình cốt lõi và hợp đồng API booking/sân/quản trị khách; admin tạo khách đã bỏ.
- Còn bốn nhóm bàn giao: (1) hợp đồng auth đăng ký/đăng nhập/me/refresh/logout và validation; cookie/CSRF, rotation/reuse/refresh đồng thời; (2) ERD đầy đủ gồm lịch sử chặn/token, kiểu ID, FK/hành vi xóa/index/CHECK và thứ tự khóa; (3) mô phỏng nghiệm thu ba tình huống FB-001 bằng dữ liệu mẫu trong mô hình đã hoàn thiện; (4) review G1-04–06 và xác nhận hiểu phần chính trên bằng chứng thực tế. Câu cần ôn theo dõi riêng, không yêu cầu thuộc hết mới tiến hành phần độc lập.
- DESIGN còn một số ghi chú chờ chốt đã lỗi thời (ví dụ trường trạng thái/giá/UTC và độ dài reason đã được duyệt ở các mục chi tiết); không coi chúng là task mới hoặc làm lại. Cần tổng hợp bản thiết kế cuối trước review.
- FB-002 là ticket thiết kế: chưa có code/migration/test chạy không tự là lý do thiếu nghiệm thu; triển khai/chứng minh PostgreSQL thuộc ticket sau.
- Kiểm tra thực sự: đọc ROADMAP/DESIGN/PROGRESS và rg các điểm chưa chốt, cập nhật/đọc lại tiến độ bằng Python/assertion. Không chạy test vì thay đổi chỉ tài liệu. Không có câu trả lời kiến thức mới để cập nhật mức hiểu.
- Bước tiếp theo: chốt hợp đồng đăng ký khách, bắt đầu từ validation name/email/password.
- Gợi ý commit khi có Git: docs: record remaining FB-002 acceptance work. Chưa commit/push.

### 2026-11-03 — Đề xuất validation đăng ký khách

- Theo yêu cầu tiếp tục FB-002, đối chiếu User/quyết định khách tự đăng ký và tra nguồn OWASP Authentication Cheat Sheet về độ dài/thành phần mật khẩu.
- DESIGN bổ sung đề xuất POST /auth/register công khai, body name/email/password; name chuẩn hóa 1–100, email trim/lowercase/định dạng hợp lệ/tối đa 254 và unique theo giá trị chuẩn hóa, password 15–128 ký tự giữ nguyên nội dung/không ép thành phần. Sai/thiếu/thừa trả 400/details. Đề xuất chờ duyệt.
- Chưa chọn dependency/hash hoặc thay code. Chưa có câu trả lời kiến thức mới; INTERVIEW_PREP giữ nguyên. FB-002 IN_PROGRESS.
- Kiểm tra thực sự: đọc DESIGN/PROGRESS, tìm kiếm web nguồn OWASP, cập nhật/đọc lại DESIGN/PROGRESS bằng Python/assertion. Chưa có API/database để test.
- Bước tiếp theo: người học review bộ validation đăng ký.
- Gợi ý commit khi có Git: docs: propose customer registration validation. Chưa commit/push.

### 2026-11-03 — Duyệt validation đăng ký khách

- Người học xác nhận “Ok.” cho name chuẩn hóa 1–100, email trim/lowercase/định dạng/tối đa 254, password 15–128 giữ nguyên nội dung, ba string bắt buộc và lỗi 400/VALIDATION_ERROR/details khi sai/thiếu/thừa. DESIGN ghi duyệt; chưa triển khai.
- Đề xuất response 201/data tài khoản, 409/EMAIL_ALREADY_EXISTS và đăng nhập riêng sau đăng ký (không cấp token/cookie phiên mới qua register). Các phần này chờ duyệt.
- INTERVIEW_PREP ghi quyết định thực tế, không tự nâng mức hiểu validation/hash từ xác nhận. FB-002 IN_PROGRESS.
- Kiểm tra thực sự: đọc đối chiếu phần đăng ký/User, cập nhật/đọc lại ba tài liệu bằng Python/assertion; chưa có API/database để test.
- Bước tiếp theo: người học review response và hành vi sau đăng ký.
- Gợi ý commit khi có Git: docs: approve customer registration validation. Chưa commit/push.

### 2026-11-03 — Duyệt response và hành vi đăng ký

- Người học xác nhận “Ok.” cho register 201/data tài khoản, lỗi 409/EMAIL_ALREADY_EXISTS (gồm email ADMIN), 400/VALIDATION_ERROR, backend gán CUSTOMER/chưa chặn và chuyển sang đăng nhập, không tự cấp token/phiên sau đăng ký. DESIGN ghi hợp đồng register đã duyệt; hash/rate limit còn thiết kế.
- Đề xuất tiếp POST /auth/login body email/password, 200/data accessToken/loại/hạn/user và refresh cookie HttpOnly; 401/INVALID_CREDENTIALS chung cho email không có/sai mật khẩu, 400 body sai, khách bị chặn vẫn đăng nhập. Chờ duyệt; không tự chốt cookie/CSRF/hash/phiên chi tiết.
- INTERVIEW_PREP ghi phản hồi thực tế, không nâng mức hiểu. FB-002 IN_PROGRESS.
- Kiểm tra thực sự: đọc đối chiếu đăng ký và phương án auth 15 phút/7 ngày, cập nhật/đọc lại ba tài liệu bằng Python/assertion; chưa có API/database để test.
- Bước tiếp theo: người học review hợp đồng đăng nhập.
- Gợi ý commit khi có Git: docs: approve registration response and sign-in flow. Chưa commit/push.

### 2026-11-03 — Duyệt hợp đồng chính đăng nhập

- Người học xác nhận “Ok.” cho POST /auth/login dùng chung CUSTOMER/ADMIN, email/password, 200/access token 15 phút/thông tin user, refresh HttpOnly 7 ngày, sai thông tin chung 401/INVALID_CREDENTIALS, body sai 400 và khách bị chặn vẫn đăng nhập. DESIGN ghi duyệt hợp đồng chính.
- Không tự coi cookie/CSRF/nhóm phiên/hash/rate limit hoặc giới hạn chi tiết password login đã duyệt hết; các mục này còn review.
- Đề xuất GET /auth/me dùng access Bearer, danh tính từ JWT và User đọc DB hiện hành, data không có hash/token/lý do chặn, lỗi 401. Chờ duyệt.
- INTERVIEW_PREP ghi quyết định thực tế, không nâng mức hiểu từ xác nhận. FB-002 IN_PROGRESS.
- Kiểm tra thực sự: đọc đối chiếu login/refresh/User, cập nhật/đọc lại ba tài liệu bằng Python/assertion; chưa có API/database để test.
- Bước tiếp theo: người học review hợp đồng GET /auth/me.
- Gợi ý commit khi có Git: docs: approve login API contract. Chưa commit/push.

### 2026-11-03 — Duyệt API thông tin tài khoản hiện tại

- Người học xác nhận “Ok.” cho GET /auth/me dùng Bearer access token, đọc User hiện hành, response id/name/email/role/isBookingBlocked, 401 khi xác thực sai hoặc User không tồn tại; khách bị chặn vẫn xem được. DESIGN ghi duyệt.
- Đề xuất hợp đồng cơ bản POST /auth/refresh: đọc cookie, không yêu cầu access còn hạn, 200/access token 15 phút và rotate refresh, không gia hạn vượt 7 ngày từ đăng nhập; token thiếu/sai/hết hạn/thu hồi trả 401. Chờ duyệt; reuse/concurrency/cookie-CSRF còn review riêng.
- INTERVIEW_PREP ghi phản hồi thực tế, không nâng mức hiểu từ xác nhận. FB-002 IN_PROGRESS.
- Kiểm tra thực sự: đọc đối chiếu me/thiết kế refresh, cập nhật/đọc lại ba tài liệu bằng Python/assertion; chưa có API/database để test.
- Bước tiếp theo: người học review hợp đồng refresh cơ bản.
- Gợi ý commit khi có Git: docs: approve current user API contract. Chưa commit/push.

### 2026-11-03 — Người học đề xuất cấp mới cả hai token và lưu refresh trong DB

- Người học tự đề xuất refresh nên cấp accessToken + refreshToken mới và lưu refresh token database. Đúng hướng rotation/quản lý server, không chỉ là đồng ý phương án mentor; chưa nêu hash/lưu token cũ/transaction hoặc xử lý reuse.
- Mentor làm rõ cách truyền: access JSON, refresh qua Set-Cookie HttpOnly; DB lưu hash/metadata, đánh dấu token cũ đã dùng và ghi token mới nguyên tử, giữ hash cũ đến hạn. Đây là phần cụ thể hóa mentor, không gán cho người học.
- DESIGN/INTERVIEW_PREP ghi bằng chứng này; hợp đồng refresh chi tiết vẫn chờ chốt. FB-002 IN_PROGRESS, chưa có code/test.
- Kiểm tra thực sự: đọc thiết kế refresh/RefreshToken, mở RFC 9700 và tìm phần rotation §4.14.2, cập nhật/đọc lại ba tài liệu bằng Python/assertion; chưa có API/database để test.
- Bước tiếp theo: chốt luồng rotation/hash và hành vi khi refresh token cũ bị dùng lại.
- Gợi ý commit khi có Git: docs: clarify dual token renewal and refresh token persistence. Chưa commit/push.

### 2026-11-03 — Chuẩn bị điểm dừng sau đề xuất xử lý token cũ

- Người học đồng ý đi tiếp sau phần rotation/hash, hỏi sắp xong chưa vì session dài và muốn đến điểm dừng. Giới hạn buổi này thêm đúng một bước: đề xuất xử lý token cũ dùng lại, rồi lưu bàn giao. Không coi toàn bộ FB-002 hoặc nhóm auth đã xong.
- Ghi nhận đồng ý hướng cấp mới hai token/hash/transaction/giữ token cũ. DESIGN đề xuất reuse token đã dùng trả 401 và thu hồi refresh cả nhóm phiên hiện tại, nhóm khác không ảnh hưởng, access đã cấp còn hạn tối đa 15 phút. Đề xuất reuse chờ duyệt.
- Làm rõ retry/hai tab hợp lệ cũng có thể kích hoạt reuse; buổi sau chốt phối hợp frontend/DB và cookie-CSRF/logout. Chưa có code/test; không hứa phát hiện chính xác ai là attacker.
- INTERVIEW_PREP ghi phản hồi thực tế, không nâng mức hiểu chỉ từ đồng ý tiếp tục. FB-002 IN_PROGRESS.
- Kiểm tra thực sự: đọc phần refresh/tiến độ, cập nhật/đọc lại ba tài liệu bằng Python/assertion; chưa có API/database để test.
- Bước tiếp theo duy nhất trong buổi: người học duyệt hành vi reuse, sau đó dừng và giữ điểm bàn giao.
- Gợi ý commit khi có Git: docs: record refresh token reuse proposal and session handoff. Chưa commit/push.

### 2026-11-03 — Duyệt reuse và kết thúc buổi

- Người học xác nhận “Ok.” cho đề xuất reuse: trả 401 khi refresh token đã dùng bị gửi lại, thu hồi refresh nhóm phiên liên quan (gồm token mới), không ảnh hưởng nhóm phiên khác; access JWT đã cấp còn có thể hợp lệ tối đa 15 phút. DESIGN ghi duyệt hành vi, chưa coi chi tiết retry/đa tab/khóa/cookie-CSRF đã giải quyết.
- Dừng buổi đúng yêu cầu session dài; cập nhật điểm bàn giao đầu PROGRESS, không mở thêm thiết kế hoặc giao bài trong lúc nghỉ. FB-002 giữ IN_PROGRESS, chưa DONE.
- INTERVIEW_PREP ghi xác nhận thực tế, không nâng mức hiểu từ đồng ý phương án. Chưa có câu trả lời suy ngẫm để ghi thay người học.
- Kiểm tra thực sự: đọc/cập nhật/đọc lại DESIGN/PROGRESS/INTERVIEW_PREP bằng Python/assertion; chưa có code/API/database để test.
- Bước đầu tiên khi quay lại: chốt hợp đồng POST /auth/logout.
- Gợi ý commit khi có Git: docs: approve refresh reuse policy and save session handoff. Chưa commit/push.

### 2026-11-04 — Tiếp tục từ hợp đồng logout

- Đọc README/ROADMAP/PROGRESS, hướng dẫn thực tập và phần thiết kế/auth, review kiến thức liên quan. FB-002 giữ IN_PROGRESS.
- Kiểm tra thực sự trên local: rg --files và git status --short; chưa có ứng dụng hoặc Git repository sử dụng được. Đọc lại tài liệu sau cập nhật; không chạy test vì chưa có ứng dụng và chỉ sửa tiến độ.
- Chưa chốt thêm hợp đồng logout; chưa có câu trả lời kiến thức mới nên không đổi INTERVIEW_PREP.
- Bước tiếp theo duy nhất: người học phác thảo logout phiên A khi phiên B vẫn đăng nhập để mentor review.
- Gợi ý commit khi có Git: docs: resume FB-002 logout design review. Chưa commit/push.

### 2026-11-04 — Review câu trả lời logout phiên A/B

- Người học chọn thu hồi refresh A, giữ B (chưa chắc), xóa access ở FE A và thừa nhận chưa biết thêm. Đúng phạm vi và thao tác dọn FE; cần bổ sung thu hồi trong DB khác xóa cookie, access bị sao chép không mất hiệu lực chỉ vì FE xóa.
- DESIGN ghi đề xuất luồng logout, INTERVIEW_PREP ghi câu trả lời thực tế và phần mentor bổ sung; không nâng mức hiểu hoặc đánh dấu hợp đồng đã duyệt. FB-002 IN_PROGRESS.
- Kiểm tra thực sự: đọc các phần auth và cập nhật/đọc lại ba tài liệu bằng Python; chưa có ứng dụng để chạy test.
- Bước tiếp theo duy nhất: người học review luồng logout vừa cụ thể hóa. Response/lỗi/CSRF/concurrency còn thiếu.
- Gợi ý commit khi có Git: docs: clarify current-session logout and token limits. Chưa commit/push.

### 2026-11-04 — Duyệt luồng chính logout

- Người học xác nhận “Ok đồng ý.” cho thu hồi refresh nhóm hiện tại trong DB, xóa cookie bằng backend và dọn access FE, giữ phiên B; không cam kết thu hồi tức thì access đã cấp. DESIGN ghi duyệt luồng chính.
- Đề xuất response 204/no body, không cần access còn hạn; logout lặp/cookie thiếu/không khớp/đã thu hồi vẫn 204, không thu hồi nhóm khác. Lỗi DB không được coi thành công; CSRF và concurrency còn thiết kế. Đề xuất chưa duyệt.
- INTERVIEW_PREP ghi đúng xác nhận, không nâng mức hiểu. FB-002 IN_PROGRESS.
- Kiểm tra thực sự: đọc phần liên quan và dùng Python cập nhật/đọc lại ba tài liệu; chưa có code/API để test.
- Bước tiếp theo: người học review response và logout lặp.
- Gợi ý commit khi có Git: docs: approve current-session logout flow. Chưa commit/push.

### 2026-11-04 — Duyệt response logout và chuyển sang CSRF

- Người học xác nhận “Ok.” cho đề xuất response/logout lặp; DESIGN ghi duyệt đúng phạm vi đã trình bày. Không suy ra mã lỗi CSRF/hệ thống hoặc concurrency đã hoàn tất.
- INTERVIEW_PREP ghi xác nhận, giữ mức hiểu; FB-002 IN_PROGRESS.
- Kiểm tra thực sự: đọc phần liên quan, mở OWASP CSRF Prevention Cheat Sheet, cập nhật và đọc lại ba tài liệu bằng Python. Chưa có ứng dụng để test.
- Bước tiếp theo duy nhất: người học trả lời HttpOnly có đủ ngăn CSRF không và vì sao; chưa yêu cầu biết chi tiết triển khai.
- Gợi ý commit khi có Git: docs: approve logout response and repeat behavior. Chưa commit/push.

### 2026-11-04 — Đề xuất cookie/CSRF theo yêu cầu người học

- Người học chưa rành CSRF, yêu cầu đề xuất và giải thích; không ép tự thiết kế bảo mật. Mentor đọc OWASP và ghi phương án same-origin + custom header + kiểm tra Origin/Referer, cookie host-only/HttpOnly/Secure/Lax, lỗi 403 trước tác động phiên/cookie. Đây là đề xuất chờ review, chưa tự đổi thành đã duyệt.
- INTERVIEW_PREP ghi đúng nguồn kiến thức, không nâng mức hiểu. FB-002 IN_PROGRESS; chưa thêm dependency, code hoặc thay đổi server.
- Kiểm tra thực sự: mở OWASP CSRF Prevention Cheat Sheet, rg/đọc thiết kế cookie hiện có, cập nhật/đọc lại DESIGN/PROGRESS/INTERVIEW_PREP bằng Python. Các test API/browser chỉ là kế hoạch, chưa chạy.
- Bước tiếp theo duy nhất: người học review phương án CSRF sau giải thích. Còn phối hợp đa tab/refresh-logout và schema/nghiệm thu thiết kế.
- Gợi ý commit khi có Git: docs: propose same-origin cookie and CSRF protection. Chưa commit/push.

### 2026-11-04 — Duyệt Vite proxy cho local

- Sau câu hỏi origin, mentor giải thích scheme/hostname/port và ví dụ khác port. Người học chọn dùng Vite proxy; DESIGN ghi duyệt riêng cách gọi API local cùng origin qua proxy.
- Chưa có ứng dụng/vite.config để cấu hình; không khởi tạo FB-003 khi FB-002 chưa nghiệm thu. Không suy ra proxy thay thế CSRF hoặc toàn bộ đề xuất đã được duyệt.
- INTERVIEW_PREP ghi câu hỏi và lựa chọn thực tế, không nâng mức hiểu. FB-002 IN_PROGRESS.
- Kiểm tra thực sự: rg/đọc và Python cập nhật/đọc lại ba tài liệu. Chưa chạy test hoặc proxy.
- Bước tiếp theo duy nhất: review cookie flags, custom header và kiểm tra nguồn của đề xuất CSRF còn lại.
- Gợi ý commit khi có Git: docs: approve Vite proxy for local API requests. Chưa commit/push.

### 2026-11-04 — Cụ thể hóa thứ tự bảo vệ CSRF

- Người học trả lời “Ok.” sau bước bàn giao review CSRF. Tiếp tục giải thích ba lớp cookie/header/nguồn và thứ tự CSRF trước xử lý phiên; chưa suy ra đã duyệt toàn bộ chính sách.
- DESIGN bổ sung ví dụ phân biệt logout hợp lệ nhưng cookie mất (204) với nguồn lạ (403), và hướng thêm custom header tại hàm gọi API dùng chung khi triển khai.
- Kiểm tra thực sự: Python cập nhật/đọc lại DESIGN/PROGRESS. Chỉ sửa tài liệu, chưa có code/test. Không có câu trả lời kiến thức mới để thay đổi mức hiểu trong INTERVIEW_PREP. FB-002 IN_PROGRESS.
- Bước tiếp theo duy nhất: người học review bản tóm tắt chính sách CSRF để chốt hợp đồng. Gợi ý commit khi có Git: docs: clarify CSRF checks before session mutations. Chưa commit/push.

### 2026-11-04 — Duyệt ba lớp CSRF và giải thích refresh đồng thời

- Người học xác nhận “Ok.” cho câu hỏi áp dụng cả cookie/header/kiểm tra nguồn. DESIGN ghi chính sách đã duyệt; INTERVIEW_PREP ghi xác nhận, không nâng mức hiểu. FB-002 IN_PROGRESS.
- Đề xuất dùng chung Promise refresh trong một tab để các request không tự gửi cùng refresh token; giải thích nguy cơ token cũ bị xem là reuse. Hướng này chưa được người học duyệt; chưa giải quyết nhiều tab hoặc khóa DB.
- Không tự retry mutation sau timeout/mất response hoặc lặp refresh khi thất bại; retry request nghiệp vụ chỉ sau lỗi xác thực trước xử lý nghiệp vụ, tối đa một lần. Chưa triển khai/test.
- Kiểm tra thực sự: Python cập nhật/đọc lại ba tài liệu. Chỉ thay đổi tài liệu, không có ứng dụng để test.
- Bước tiếp theo duy nhất: review hướng một refresh đang chạy trong một tab. Gợi ý commit khi có Git: docs: approve CSRF policy and outline refresh coordination. Chưa commit/push.

### 2026-11-04 — Duyệt single flight trong một tab, đề xuất Web Locks

- Người học nhận định Promise/Axios chủ yếu xử lý FE; sau giải thích bổ sung backend/đa tab trả lời “Ok.”. Ghi duyệt hướng single flight trong một tab, INTERVIEW_PREP ghi đúng bằng chứng, không suy ra đã làm được toàn bộ concurrency.
- DESIGN đề xuất Web Locks cho các tab gửi refresh lần lượt bằng cookie browser hiện hành. Cho phép rotation nối tiếp để tránh thêm chia sẻ access token, chưa chốt đồng bộ logout/login/fallback hoặc khóa DB. Phương án đa tab chờ review.
- Kiểm tra thực sự: đọc MDN Web Locks/Broadcast Channel, đọc DESIGN/PROGRESS, Python cập nhật/đọc lại ba tài liệu. Chưa có code/browser test. FB-002 IN_PROGRESS.
- Bước tiếp theo duy nhất: người học review cách khóa refresh giữa tab. Gợi ý commit khi có Git: docs: approve single-flight refresh and propose cross-tab locking. Chưa commit/push.

### 2026-11-04 — Giải thích lựa chọn phối hợp nhiều tab

- Người học chưa biết lựa chọn và yêu cầu đề xuất/giải thích. Giữ khuyến nghị Promise trong tab + Web Locks giữa tab; DESIGN ghi ví dụ hai tab chia sẻ cookie R1/R2, access riêng và phân biệt khóa browser với DB.
- Không tự ghi Web Locks đã duyệt. INTERVIEW_PREP ghi đúng yêu cầu/giải thích, giữ mức hiểu; FB-002 IN_PROGRESS.
- Kiểm tra thực sự: Python cập nhật/đọc lại ba tài liệu, đối chiếu ví dụ với hướng đã ghi và MDN đã đọc ở bước trước. Chưa có code/test, chưa thêm dependency.
- Bước tiếp theo duy nhất: người học review lựa chọn Web Locks sau giải thích cụ thể. Còn failure/logout/fallback và khóa DB; chưa hoàn tất auth.
- Gợi ý commit khi có Git: docs: explain cross-tab refresh coordination. Chưa commit/push.

### 2026-11-04 — Làm rõ A2 refresh tiếp hay dùng access của A1

- Người học hỏi phạm vi cookie, sau giải thích đã tự mô tả thứ tự A1 giữ khóa/nhận token rồi A2 tiếp tục; hỏi A2 dùng refresh mới để cấp bộ khác hay dùng bộ A1. Ghi nhận hiểu một phần thứ tự, không tự nâng thành hiểu toàn bộ đa tab.
- Mentor làm rõ phương án hiện tại: A1 nhận AT1/R2, A2 sau khi lấy khóa dùng cookie R2 nhận AT2/R3; AT1 không tự mất hiệu lực do refresh của A2. Cookie chung R3, access trong bộ nhớ mỗi tab riêng. DESIGN bổ sung ví dụ, INTERVIEW_PREP ghi đúng nguồn phần hiểu/phần giải thích.
- Kiểm tra thực sự: Python cập nhật/đọc lại ba tài liệu. Chưa có code/test. FB-002 IN_PROGRESS; chưa tự ghi Web Locks đã duyệt từ câu hỏi.
- Bước tiếp theo duy nhất: người học review lựa chọn refresh nối tiếp bằng cookie chung, access riêng mỗi tab. Gợi ý commit khi có Git: docs: clarify sequential refresh token rotation across tabs. Chưa commit/push.

### 2026-11-04 — Xác nhận AT riêng/R chung, tiếp tục logout đa tab

- Người học tự tóm tắt đúng AT riêng từng tab/R cookie chung, rồi yêu cầu tiếp tục. INTERVIEW_PREP ghi bằng chứng hiểu mô hình này; DESIGN ghi đồng ý tiếp tục hướng Web Locks, không tự coi toàn bộ concurrency đã chốt.
- Đề xuất bước tiếp: logout ảnh hưởng mọi tab cùng phiên/cookie, browser/profile khác vẫn giữ phiên riêng; refresh/logout dùng chung khóa, BroadcastChannel báo tab khác dọn access và dừng refresh chờ. Giao thức xử lý missed event/response cũ/failure còn hoàn thiện trước triển khai; chưa ghi đề xuất logout đa tab đã duyệt.
- Kiểm tra thực sự: đọc thiết kế/tiến độ, Python cập nhật/đọc lại ba tài liệu, đối chiếu API BroadcastChannel với MDN đã đọc. Chưa chạy code/test. FB-002 IN_PROGRESS.
- Bước tiếp theo duy nhất: người học review hành vi logout các tab cùng phiên. Gợi ý commit khi có Git: docs: record cross-tab token understanding and propose coordinated logout. Chưa commit/push.

### 2026-11-04 — Lưu yêu cầu hướng dẫn kỹ auth đa tab khi code

- Người học xác nhận phần này mới và yêu cầu tập trung hướng dẫn khi triển khai. Đã lưu nhắc việc tại phần bàn giao PROGRESS và INTERVIEW_PREP; không coi đây là bằng chứng thành thạo hoặc duyệt thêm giao thức concurrency.
- Kiểm tra thực sự: Python cập nhật/đọc lại hai tài liệu. Không thay code hoặc chạy test vì workspace chưa có ứng dụng. FB-002 giữ IN_PROGRESS.
- Bước tiếp theo duy nhất: tiếp tục hoàn thiện thiết kế xử lý refresh/logout khi request thất bại. Các ghi chú demo/test là kế hoạch triển khai sau, chưa phải bằng chứng.
- Gợi ý commit khi có Git: docs: record guided learning focus for cross-tab auth. Chưa commit/push.

### 2026-11-04 — Đề xuất hành vi khi refresh/logout thất bại

- Theo yêu cầu tiếp tục, đối chiếu chính sách reuse/retry đã ghi và đề xuất phân biệt refresh 401 với lỗi mạng/5xx chưa rõ kết quả; không tự retry refresh, không khẳng định token hết hạn chỉ từ timeout. CSRF 403 không kích hoạt refresh.
- Logout 204 xác nhận theo hợp đồng; lỗi mạng/5xx có thể dọn FE nhưng không báo đã thu hồi server, cho gửi lại logout theo quy tắc lặp. DESIGN ghi đề xuất và giới hạn dọn bộ nhớ không xóa HttpOnly cookie.
- Còn cần chốt cơ chế duy trì trạng thái dừng tự refresh qua reload/tab, response auth cũ và login mới, khóa nhóm phiên DB/fallback; không coi BroadcastChannel giải quyết mọi race.
- Kiểm tra thực sự: rg/đọc thiết kế retry và Python cập nhật/đọc lại DESIGN/PROGRESS. Chưa có code/test hoặc câu trả lời kiến thức mới; INTERVIEW_PREP giữ nguyên. FB-002 IN_PROGRESS.
- Bước tiếp theo duy nhất: người học review bảng hành vi lỗi. Gợi ý commit khi có Git: docs: propose refresh and logout failure handling. Chưa commit/push.

### 2026-11-04 — Chuyển phần học lỗi auth sang demo lúc code

- Người học muốn học trực quan khi code vì phần lỗi đang rối. Đã ghi nhận trong DESIGN/INTERVIEW_PREP và phần bàn giao; giữ yêu cầu hướng dẫn kỹ, chia luồng thành công/hai tab/lỗi mạng thành các bước riêng.
- Không coi bảng lỗi đã duyệt hoặc mức hiểu đã tăng. Không tiếp tục hỏi thêm lý thuyết auth trong bước hiện tại; FB-002 IN_PROGRESS, các quyết định lỗi/concurrency vẫn phải hoàn thiện trước code luồng liên quan.
- Kiểm tra thực sự: đọc ERD hiện hành và bàn giao, Python cập nhật/đọc lại ba tài liệu. Chưa thay code/chạy test.
- Bước tiếp theo duy nhất: tổng hợp ERD cốt lõi từ các quyết định đã có. Gợi ý commit khi có Git: docs: defer detailed auth learning to implementation demos. Chưa commit/push.

### 2026-11-04 — Tổng hợp ERD cốt lõi

- Theo yêu cầu bước tiếp theo, đọc đối chiếu bộ trường/quan hệ hiện có và thêm mục ERD cốt lõi gần đầu DESIGN: Branch/User/Court/Booking/BookingSlot, gồm hai quan hệ người đặt/người hủy; lược timestamps phụ để dễ đọc, không đổi bộ trường đã có.
- Giữ hai bảng hỗ trợ BookingBlockHistory/RefreshToken theo thiết kế chi tiết; chưa tự thêm Session hoặc chốt kiểu ID. Nêu rõ FK kép, partial unique index và giới hạn số slot không tự được bảo đảm chỉ bởi hình ERD.
- Thêm dữ liệu minh họa B1 90 phút với ba slot 19:00/19:30/20:00, UTC tương ứng; đây là ví dụ chưa chạy, không phải dữ liệu DB hoặc test thành công.
- Kiểm tra thực sự: rg và đọc các mục trường/quan hệ, Python cập nhật/đọc lại DESIGN/PROGRESS; kiểm tra các cạnh/slot minh họa bằng assertion văn bản. Chưa render Mermaid, chưa có schema/DB để chạy test. Không có câu trả lời mới nên không đổi mức hiểu INTERVIEW_PREP. FB-002 IN_PROGRESS.
- Bước tiếp theo duy nhất: người học mô tả cách hủy B1 trên Booking/BookingSlot từ sơ đồ. Gợi ý commit khi có Git: docs: consolidate core booking ERD and sample slots. Chưa commit/push.

### 2026-11-04 — Review ý tưởng status trên BookingSlot

- Người học đề xuất không có slot thì đặt, có slot phân biệt đã hủy/đã đặt bằng status. Ghi nhận đúng ý tưởng hiệu lực/lịch sử, còn thiếu cập nhật Booking và bảo vệ toàn bộ slot trước request đồng thời.
- DESIGN giải thích giữ releasedAt đã có thay vì thêm status lặp, hủy cập nhật Booking và mọi slot nguyên tử, đặt lại tạo dòng mới. Query không thay ràng buộc DB; giữ partial unique index/transaction/xung đột 409 đã chọn.
- INTERVIEW_PREP ghi đúng phần người học tự nêu và phần mentor bổ sung, không nâng toàn bộ mức hiểu. FB-002 IN_PROGRESS.
- Kiểm tra thực sự: đọc bộ trường/SQL minh họa và Python cập nhật/đọc lại ba tài liệu. Chưa có migration/database/code để test; không có bằng chứng chống trùng thực thi.
- Bước tiếp theo duy nhất: review releasedAt và lý do vẫn cần ràng buộc DB khi hai request cùng thấy trống. Gợi ý commit khi có Git: docs: clarify released slots and rebooking history. Chưa commit/push.

### 2026-11-04 — Lưu yêu cầu demo trực quan BookingSlot khi code

- Người học lần lượt hỏi điều kiện releasedAt, mỗi lần đặt có phải kiểm tra BookingSlot, có tạo record trước không và kiểm tra khi không có slot bị chiếm thế nào. Mentor giải thích truy vấn không tìm thấy dòng đang chiếm nghĩa là khoảng trống, chỉ tạo record khi đặt trong transaction; query trước không thay ràng buộc DB.
- Người học yêu cầu nhìn trực quan khi code. Đã lưu nhắc việc demo DB trước/sau đặt, hủy, đặt lại và sau đó request đồng thời ở phần bàn giao; chưa đánh dấu đã hiểu hoặc test thành công.
- Kiểm tra thực sự: Python cập nhật/đọc lại PROGRESS/INTERVIEW_PREP; không có ứng dụng/database để demo hoặc test. FB-002 IN_PROGRESS.
- Bước tiếp theo duy nhất: tiếp tục thiết kế độc lập bằng việc chốt kiểu ID cho các bảng; chưa giao bài lý thuyết BookingSlot thêm trong lúc này.
- Gợi ý commit khi có Git: docs: record visual learning plan for booking slots. Chưa commit/push.

### 2026-11-04 — Đề xuất kiểu ID nhất quán

- Người học đồng ý chuyển sang bước ID. Đọc đối chiếu ví dụ API/ERD: kiểu ID vẫn placeholder, chưa có lựa chọn trước đó.
- DESIGN ghi đề xuất UUID cho PK/FK, PostgreSQL uuid/Prisma String @db.Uuid/API string; so sánh số tự tăng, nhắc quyền sở hữu độc lập với độ khó đoán và khác biệt default Prisma/DB. Chưa coi người học đã chọn UUID chỉ từ đồng ý bước tiếp theo.
- Kiểm tra thực sự: rg/đọc tài liệu, mở tài liệu Prisma chính thức, Python cập nhật/đọc lại DESIGN/PROGRESS. Chưa có schema/migration/test; INTERVIEW_PREP không có câu trả lời kiến thức mới để đổi mức hiểu.
- Bước tiếp theo duy nhất: người học nêu lựa chọn ID. Gợi ý commit khi có Git: docs: propose consistent UUID identifiers. Chưa commit/push.

### 2026-11-04 — Duyệt UUID cho ID

- Người học xác nhận “Ok UUID.”. DESIGN ghi duyệt UUID cho PK/FK của các bảng hiện có, PostgreSQL uuid/Prisma String @db.Uuid/API string; đồng bộ các ghi chú ID chờ chốt trong mô hình/API. Không tạo schema hoặc chốt cơ chế default DB từ lựa chọn này.
- INTERVIEW_PREP ghi quyết định, không nâng mức hiểu từ đồng ý. FB-002 IN_PROGRESS.
- Kiểm tra thực sự: rg các ghi chú ID/FK, Python cập nhật/đọc lại ba tài liệu và kiểm tra không còn các câu ID chờ chốt phổ biến trong DESIGN. Chưa có migration/code để test.
- Bước tiếp theo duy nhất: người học chọn hành vi DB khi xóa Court có Booking, giải thích dựa trên yêu cầu giữ lịch sử. Gợi ý commit khi có Git: docs: approve UUID identifiers across the data model. Chưa commit/push.

### 2026-11-04 — Review đánh đổi RESTRICT/CASCADE cho sân

- Người học nêu rủi ro rối danh sách khi giữ sân cũ và mất lịch sử khi xóa dây chuyền, yêu cầu đề xuất cho 10–20 sân giả định. Ghi nhận lập luận vào INTERVIEW_PREP, không coi đây là số liệu thực tế hay duyệt phương án.
- DESIGN khuyến nghị RESTRICT cho FK Booking/BookingSlot → Court; ngừng nhận đặt dùng isActive=false, nhãn/bộ lọc rõ. Giữ mặc định GET /admin/courts trả tất cả như hợp đồng cũ; không thêm soft delete/archive/DELETE API hoặc báo cáo doanh thu. Booking tương lai không tự hủy, giá trị booking không đồng nghĩa tiền thực thu.
- Kiểm tra thực sự: rg/đọc phạm vi và GET /admin/courts, mở PostgreSQL Constraints mục Foreign Keys, Python cập nhật/đọc lại ba tài liệu. Chưa có schema/DB để test; khuyến nghị chưa được người học duyệt. FB-002 IN_PROGRESS.
- Bước tiếp theo duy nhất: người học review chọn RESTRICT + isActive theo khuyến nghị. Gợi ý commit khi có Git: docs: recommend retaining court history with restrictive foreign keys. Chưa commit/push.

### 2026-11-04 — Duyệt RESTRICT cho các FK đến Court

- Sau khi hỏi/được xác nhận RESTRICT không cấm xóa khi mọi tham chiếu đã bị xóa, người học chọn “Ok chọn RESTRICT.”. DESIGN ghi duyệt Booking.courtId → Court.id và BookingSlot.courtId → Court.id; không áp dụng ngầm cho các FK khác.
- Giữ isActive=false để ngừng nhận đặt và không thêm API xóa sân/lịch sử. INTERVIEW_PREP ghi đúng câu hỏi/lựa chọn, nhận diện hiểu một phần ranh giới FK, không tự nâng toàn bộ mức hiểu.
- Bổ sung đề xuất bước tiếp theo Court.branchId → Branch.id RESTRICT vì Branch giữ địa chỉ chung; chưa duyệt. Không thêm tính năng quản lý/xóa Branch hoặc Branch.isActive.
- Kiểm tra thực sự: đọc mục hiện hành, Python cập nhật/đọc lại ba tài liệu và assertion xác nhận trạng thái duyệt. Chưa có schema/migration/DB để test. FB-002 IN_PROGRESS.
- Bước tiếp theo duy nhất: người học review RESTRICT cho Court → Branch. Gợi ý commit khi có Git: docs: approve restrictive court foreign keys. Chưa commit/push.

### 2026-11-04 — Duyệt RESTRICT cho Court → Branch

- Người học xác nhận “Ok.”. DESIGN ghi duyệt ON DELETE RESTRICT cho Court.branchId → Branch.id; INTERVIEW_PREP ghi quyết định, không nâng mức hiểu từ xác nhận.
- Đề xuất tiếp nhóm FK lịch sử tới User: Booking.userId/cancelledById và BookingBlockHistory.userId/actorId dùng RESTRICT để giữ danh tính liên quan. Chưa duyệt nhóm này; không thêm xóa/khóa tài khoản hoặc soft delete. RefreshToken/BookingSlot → Booking còn review riêng.
- Kiểm tra thực sự: Python cập nhật/đọc lại ba tài liệu, assertion xác nhận trạng thái duyệt và mục đề xuất. Chưa có schema/migration/DB để test. FB-002 IN_PROGRESS.
- Bước tiếp theo duy nhất: người học review nhóm FK lịch sử → User. Gợi ý commit khi có Git: docs: approve restrictive branch foreign key. Chưa commit/push.

### 2026-11-04 — Làm rõ khả năng xóa tài khoản tương lai

- Người học hỏi tương lai có xóa tài khoản thì làm gì. DESIGN ghi phân biệt ngừng sử dụng/ẩn danh/xóa vật lý; hướng giữ User.id nếu cần lịch sử, còn DELETE thật cần thiết kế FK/quy trình/migration rõ, không mặc định CASCADE.
- Không thêm deletedAt/trạng thái khóa/xóa tài khoản hoặc đổi chính sách JWT trong bản đầu. Không dùng isBookingBlocked như cờ vô hiệu hóa đăng nhập. INTERVIEW_PREP ghi câu hỏi thực tế, không nâng mức hiểu hoặc coi nhóm FK → User đã duyệt.
- Kiểm tra thực sự: Python cập nhật/đọc lại ba tài liệu, đối chiếu giữ lịch sử và phạm vi hiện tại; chỉ ghi định hướng tương lai, chưa có code/schema/test. FB-002 IN_PROGRESS.
- Bước tiếp theo duy nhất: quay lại review RESTRICT cho nhóm FK lịch sử → User trong bản đầu. Gợi ý commit khi có Git: docs: explain future account deletion options without expanding scope. Chưa commit/push.

### 2026-11-04 — Duyệt RESTRICT cho nhóm lịch sử → User

- Người học xác nhận “Ok chọn RESTRICT luôn đi.” sau giải thích xóa tài khoản tương lai. DESIGN ghi duyệt bốn FK Booking.userId/cancelledById và BookingBlockHistory.userId/actorId → User.id; không tự mở rộng sang FK token hoặc slot.
- INTERVIEW_PREP ghi lựa chọn, không nâng mức hiểu chỉ từ đồng ý. Không thêm xóa/khóa tài khoản/soft delete hoặc thay phạm vi hiện tại.
- Bổ sung đề xuất bước tiếp: RESTRICT cho FK kép BookingSlot → Booking để tránh xóa booking còn slot; giữ hủy bằng cập nhật trạng thái/giải phóng slot trong transaction như đã chốt. Chưa duyệt đề xuất này.
- Kiểm tra thực sự: đọc mục FK hiện hành, Python cập nhật/đọc lại ba tài liệu và kiểm tra các dòng trạng thái. Chưa có schema/migration/DB để test. FB-002 IN_PROGRESS.
- Bước tiếp theo duy nhất: người học review FK BookingSlot → Booking. Gợi ý commit khi có Git: docs: approve restrictive user history foreign keys. Chưa commit/push.

### 2026-11-04 — Duyệt RESTRICT cho BookingSlot → Booking

- Người học xác nhận “Ok.”. DESIGN ghi duyệt ON DELETE RESTRICT cho FK kép BookingSlot(bookingId,courtId) → Booking(id,courtId); giữ hủy bằng UPDATE Booking/slot nguyên tử. INTERVIEW_PREP ghi quyết định, không nâng mức hiểu từ xác nhận.
- Đề xuất tiếp FK RefreshToken.userId → User.id CASCADE do token phụ thuộc tài khoản; chỉ xảy ra nếu xóa vật lý User được phép, không vượt FK lịch sử RESTRICT và không thay logout/reuse. Chưa duyệt, không thêm chức năng xóa tài khoản.
- Kiểm tra thực sự: Python cập nhật/đọc lại ba tài liệu, assertion trạng thái duyệt và đề xuất. Chưa có migration/schema/DB để test. FB-002 IN_PROGRESS.
- Bước tiếp theo duy nhất: người học review FK RefreshToken → User. Gợi ý commit khi có Git: docs: approve restrictive booking slot foreign key. Chưa commit/push.

### 2026-11-04 — Duyệt CASCADE cho RefreshToken → User, tổng hợp ON DELETE

- Người học hỏi lại ý nghĩa CASCADE, sau giải thích xác nhận “Ok.”. DESIGN ghi duyệt RefreshToken.userId → User.id ON DELETE CASCADE, không đổi phạm vi xóa tài khoản hoặc cơ chế logout.
- Tổng hợp chín FK hiện có vào bảng ON DELETE: tám RESTRICT, một CASCADE; không tự tạo bảng nhóm phiên/FK familyId. INTERVIEW_PREP ghi đúng câu hỏi và quyết định, không nâng toàn bộ mức hiểu FK.
- Đề xuất bước tiếp: UUID id không sửa qua API, ON UPDATE RESTRICT trên các FK; phân biệt cập nhật khóa với sửa tên/giá và giới hạn khi chưa có tham chiếu. Chưa duyệt phần ON UPDATE.
- Kiểm tra thực sự: Python cập nhật/đọc lại ba tài liệu, kiểm tra chín dòng FK và số RESTRICT/CASCADE trong bảng tổng hợp. Chưa có schema/migration/DB để test. FB-002 IN_PROGRESS.
- Bước tiếp theo duy nhất: người học review quy tắc cập nhật ID. Gợi ý commit khi có Git: docs: approve refresh token cascade and consolidate deletion rules. Chưa commit/push.

### 2026-11-04 — Duyệt ON UPDATE, đề xuất kiểu cột thời gian

- Người học xác nhận “Ok..”. DESIGN ghi duyệt UUID id bất biến ở API, ON UPDATE RESTRICT cho chín FK đã tổng hợp, nêu rõ không cấm sửa tên/giá/trạng thái. INTERVIEW_PREP ghi quyết định, không nâng mức hiểu từ đồng ý.
- Đề xuất kiểu PostgreSQL timestamptz(3) cho thời điểm, giữ chính sách UTC/Asia/Ho_Chi_Minh đã có; chưa duyệt phần kiểu cột. Giải thích timezone phiên ảnh hưởng hiển thị, không giữ tên zone đầu vào, không tự bảo vệ validation giờ/slot.
- Kiểm tra thực sự: đọc thiết kế hiện hành, mở PostgreSQL datetime và Prisma PostgreSQL; tìm UTC behavior trong PostgreSQL (trang overview Prisma không có Timestamptz, nên chưa dùng trang đó làm bằng chứng native mapping). Python cập nhật/đọc lại ba tài liệu và assertion trạng thái. Chưa có schema/migration/DB để test. FB-002 IN_PROGRESS.
- Bước tiếp theo duy nhất: người học review kiểu cột thời gian. Gợi ý commit khi có Git: docs: approve update restrictions and propose timestamp types. Chưa commit/push.

### 2026-11-04 — Dừng buổi và lưu điểm bàn giao

- Người học yêu cầu dừng tại đề xuất kiểu cột thời gian. Ghi rõ timestamptz(3) chưa duyệt, không chuyển thành quyết định hoặc DONE. Tổng hợp các lựa chọn ID/FK đã duyệt và yêu cầu học trực quan khi code ở điểm bàn giao đầu tài liệu.
- Giữ FB-002 IN_PROGRESS, không mở thêm thiết kế/giao bài. Không có câu trả lời kiến thức mới hoặc suy ngẫm để ghi thay người học; INTERVIEW_PREP giữ mức hiểu thực tế đã ghi trong buổi.
- Kiểm tra thực sự: Python cập nhật/đọc lại PROGRESS và assertion điểm dừng, đối chiếu mục ON UPDATE/thời gian trong DESIGN. Chỉ sửa tài liệu tiến độ; chưa có app/schema để chạy test.
- Đúng một bước khi quay lại: review đề xuất timestamptz(3). Không yêu cầu làm trong lúc nghỉ.
- Gợi ý commit khi có Git: docs: save FB-002 handoff after identifier and foreign key review. Chưa commit/push.

### 2026-11-04 — Đối chiếu mức hoàn tất FB-002 sau khi dừng buổi

- Người học hỏi sắp xong FB-002 chưa. Chỉ kiểm tra tiến độ, không tự tiếp tục thiết kế hoặc hủy yêu cầu dừng. Đối chiếu ROADMAP, DESIGN và phần review INTERVIEW_PREP: đã có phần lớn nghiệp vụ/API/mô hình; chưa đủ nghiệm thu, giữ IN_PROGRESS.
- Đã có bằng chứng tài liệu: luồng booking/court/branch/quản trị khách, giá lịch sử, slot/chống trùng và hạn mức ở mức thiết kế; register/login/me/logout, cookie/CSRF và hướng refresh; ERD cốt lõi, UUID, ON DELETE/UPDATE.
- Còn ba nhóm bàn giao: (1) hợp nhất thiết kế cuối gồm ERD cả bảy bảng hiện có, kiểu thời gian đang chờ duyệt, bảng required/nullable/default/unique/CHECK và thứ tự khóa nhất quán; (2) kết luận hợp đồng auth/refresh và các quyết định server/nhóm phiên còn mở ở mức đủ triển khai, giữ phần học chi tiết FE/lỗi mạng cho demo lúc code như yêu cầu; (3) mô phỏng tập trung ba tình huống FB-001 và review G1-04–06/xác nhận hiểu phần chính. Không biến trạng thái Cần ôn thành yêu cầu thuộc toàn bộ lý thuyết để qua ticket.
- Có ghi chú cũ chưa đồng bộ với mục mới (ví dụ ID chưa chốt trong body ví dụ, RefreshToken FK còn review dù mục sau đã duyệt); đây là việc tổng hợp/dọn bản thiết kế, không phải quyết định cần hỏi lại. Không lấy mọi câu “chưa” trong lịch sử làm task mới.
- Đề xuất cách tiếp tục: gom các quyết định liên quan để review theo nhóm, tránh kéo dài bằng xác nhận từng FK/trường riêng. Không thêm phạm vi và không hứa số buổi/tỷ lệ hoàn thành khi chưa có cơ sở. FB-002 là ticket thiết kế, thiếu app/test chưa tự là lý do chưa đạt.
- Kiểm tra thực sự: đọc tiêu chí FB-002/PROGRESS/ERD, rg các mục thiết kế còn mở, đọc trạng thái G1-04–06; Python cập nhật/đọc lại tiến độ. Không sửa thiết kế hoặc mức hiểu; chưa chạy test vì chỉ audit tài liệu.
- Giữ đúng điểm dừng: khi người học quay lại, bước đầu là review timestamptz(3), sau đó tổng hợp các quyết định theo nhóm. Không giao việc trong lúc nghỉ.
- Gợi ý commit khi có Git: docs: audit remaining FB-002 acceptance work. Chưa commit/push.
