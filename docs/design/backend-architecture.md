# Kiến trúc backend

**Trạng thái:** bản tổng hợp để review trước FB-004, ngày 2026-11-05. Phần đã duyệt giữ nguyên; đề xuất bên dưới chưa được coi là đã duyệt. Phạm vi là Express/TypeScript + Prisma/PostgreSQL cho một app nhỏ.

## Đã thống nhất và có code

| Quyết định | Hiện hành |
| --- | --- |
| Tổ chức theo nghiệp vụ | modules/courts; auth và bookings thêm khi triển khai |
| Các lớp | routes → validation middleware → controller → service → Prisma; có controller, không repository |
| Routes | Khai báo URL/method và nối middleware/controller |
| Validation | Đã duyệt Zod ngày 2026-11-05; schema kiểm tra/parse input HTTP, middleware trả 400/details và chuyển dữ liệu đã parse qua res.locals; kiểu TypeScript suy ra bằng z.infer |
| Controller | Nhận dữ liệu đã kiểm tra, gọi service, trả HTTP/JSON |
| Service | Xử lý quy tắc nghiệp vụ/truy vấn, gọi Prisma trực tiếp; không dùng Express req/res |
| Khởi tạo | app.ts gắn routes/error handler; server.ts mở cổng; export app/router và các hàm trực tiếp; service dùng Prisma chung từ lib/prisma.ts |
| Phần dùng chung | config đọc cấu hình; lib khởi tạo Prisma; scripts chứa seed/check-db |
| Response | Theo api-common.md và contract từng endpoint; không trả SQL/stack/secret |

Ví dụ hiện có: [routes](../../backend/src/modules/courts/courts.routes.ts), [validation](../../backend/src/modules/courts/courts.validation.ts), [controller](../../backend/src/modules/courts/courts.controller.ts), [service](../../backend/src/modules/courts/courts.service.ts). Cây thư mục đầy đủ nằm tại [README](../../README.md#tổ-chức-backend).

## Validation bằng Zod — đã duyệt 2026-11-05

Người học yêu cầu “validate bằng zod đi”. Đã cài Zod 4.6.7 và chuyển GET /courts sang schema trong courts.validation.ts:

- Schema đặt trong module, dùng safeParse; dữ liệu hợp lệ truyền qua res.locals, không sửa trực tiếp req.query.
- Kiểu đầu ra suy ra từ schema bằng z.infer, tránh viết type trùng với schema.
- Middleware map issues thành error.details gồm field/message; giữ 400/VALIDATION_ERROR theo api-common.md, không trả toàn bộ lỗi nội bộ hoặc raw input.
- Query số được kiểm tra chuỗi trước khi transform sang number; giữ nguyên quy tắc/default/bộ lọc đã duyệt. Không dùng ép kiểu để biến chuỗi rỗng/array/chuỗi rác thành số hợp lệ.
- Zod kiểm tra input; CHECK/FK/unique trong PostgreSQL vẫn bảo vệ dữ liệu. Các kiểm tra nghiệp vụ và quyền vẫn thuộc service/middleware tương ứng.

Nguồn cách dùng: [Zod safeParse, transform và type inference](https://zod.dev/basics). Kiểm chứng: check/build pass, 34 test API pass trên DB riêng. Chưa triển khai schema auth hoặc nâng mức hiểu người học từ yêu cầu chọn thư viện.

## Đề xuất chốt trước khi thêm auth

| Điểm | Đề xuất và lý do | Cần xác nhận |
| --- | --- | --- |
| Kiểu tổ chức ứng dụng | Một backend Express, một PostgreSQL; giữ module theo nghiệp vụ, không tạo thêm service triển khai độc lập | Giữ quy mô nhỏ, một vòng chạy local/deploy |
| Mã dùng chung | Middleware xác thực/quyền và xử lý lỗi đặt trong src/middlewares; chỉ tách helper dùng chung khi đã có nhu cầu thực tế | Chốt vị trí để tránh mỗi module đặt khác nhau |
| Lỗi nghiệp vụ | Service phát lỗi có code nghiệp vụ; controller không viết lại các catch giống nhau; error middleware chung ánh xạ HTTP theo contract | Cần chốt hình thức lỗi dùng chung trước register; lỗi kỹ thuật vẫn 500 an toàn |
| Gọi giữa module | Không import routes/controller của module khác; gọi hàm service có mục đích rõ khi cần | Không tạo vòng phụ thuộc giữa auth/courts/bookings |
| Transaction | Service phụ trách một thao tác nghiệp vụ nguyên tử; các bước cùng thao tác dùng cùng transaction client | Chi tiết thứ tự khóa hiện còn mở, chốt trước luồng tương ứng; không tự duyệt SQL/khóa từ quy ước tổ chức |
| Quy tắc mở rộng | Dùng cùng bộ routes/validation/controller/service cho tính năng tiếp theo; không sinh module/lớp rỗng hoặc thêm repository | Chỉ đổi khung khi có lý do cụ thể và được người học đồng ý |

Các đề xuất này chưa được triển khai chỉ vì xuất hiện trong tài liệu.

## Điểm còn mở cần giải quyết đúng lúc

- **Hash mật khẩu trước register:** thuật toán/tham số/thư viện chưa chốt; hỏi kinh nghiệm người học, giải thích và chọn rồi mới code. Rate limit/body parsing/error mapping cho register cần được chốt cùng endpoint.
- **JWT/refresh/logout trước từng luồng:** giữ phần đã duyệt tại auth.md; các quyết định nhóm phiên, đa tab và thứ tự kiểm tra còn mở không được tự lấp bằng lựa chọn kiến trúc.
- **SQL đặc biệt:** CHECK/expression index/partial unique index giữ trong migration SQL. Không sửa lịch sử migration đã áp dụng; kiểm chứng thay đổi trên PostgreSQL test riêng.

## Cách dùng làm chuẩn triển khai

Validation đã chốt Zod; bộ test và cấu hình Vitest/Supertest đã gỡ theo yêu cầu ngày 2026-11-06; sau khi người học duyệt các đề xuất còn lại, ghi quyết định tại đây. Trước mỗi ticket chỉ đọc phần liên quan và contract tương ứng, rồi thêm code vào cấu trúc đã thống nhất. Không thiết kế lại toàn bộ BE cho mỗi endpoint. Phần cần ôn kiến thức theo dõi riêng tại docs/learning; chưa hiểu mọi chi tiết không chặn các task độc lập.
