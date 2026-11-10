# Football Booking — nhật ký thực tập Backend

Ứng dụng đặt sân bóng đá cho một cơ sở có nhiều sân. Mục tiêu là tự xây dựng, kiểm thử, triển khai và giải thích được một backend để đưa vào CV Backend intern.

**Trạng thái:** FB-003 DONE; FB-004 TODO; FB-002 IN_REVIEW. Đã có backend/frontend local và API danh sách sân; bộ test tự động đã gỡ theo yêu cầu ngày 2026-11-06. Chưa có CI hoặc bản deploy. Trạng thái/bằng chứng và dự báo hiện hành ở [PROGRESS](docs/PROGRESS.md).

## Bắt đầu từ đây

- **Tiếp tục project:** đọc [PROGRESS](docs/PROGRESS.md) để lấy ticket/điểm dừng, rồi [DESIGN](docs/DESIGN.md) để mở đúng chủ đề. Không đọc toàn bộ archive đầu phiên.
- **Lần đầu tham gia:** đọc [hướng dẫn thực tập](docs/INTERNSHIP_GUIDE.md), xem [lộ trình](docs/ROADMAP.md) và [hồ sơ học tập](docs/INTERVIEW_PREP.md). Không bắt người đang làm ticket hiện tại quay lại giai đoạn 0.
- Phạm vi nghiệp vụ hiện hành ở phần dưới và [REQUIREMENTS](docs/REQUIREMENTS.md); nhật ký cũ được giữ tại [archive](docs/archive/README.md).

Có thể mở phiên bằng: “Đọc AGENTS.md và PROGRESS.md, tiếp tục từ điểm bàn giao; chỉ mở tài liệu liên quan đến bước hiện tại.”

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
| CI | GitHub Actions: kiểm tra kiểu, build (chưa triển khai) |
| Deploy | VPS Linux, Docker Compose, Caddy và HTTPS |

Backend dùng access token JWT có thời hạn, refresh token và đăng xuất theo yêu cầu bổ sung của người học tại FB-002 ngày 2026-11-02; hash mật khẩu và kiểm tra quyền phía server. Phương án cơ bản đã duyệt: access JWT 15 phút, refresh token hạn trượt 7 ngày tính từ lần cấp mới, rotation sau mỗi lần refresh, cookie HttpOnly và database lưu hash token riêng; logout thu hồi refresh của phiên hiện tại, access đã cấp có thể còn hiệu lực tối đa 15 phút. Chi tiết cookie/CSRF, reuse/request đồng thời, schema và API còn cần hoàn thiện trong DESIGN; chưa triển khai. Không thêm refreshToken vào User dưới dạng một token rõ; mô hình phiên/token cần thiết kế riêng.

## Tổ chức backend

Quyết định đã duyệt và các điểm còn mở được tổng hợp tại [kiến trúc backend](docs/design/backend-architecture.md); phần đề xuất cần review trước khi triển khai auth.

Đã thống nhất có controller, không thêm repository. Cấu trúc hiện có:

```text
backend/src/
├── app.ts
├── server.ts
├── config/
│   └── database-config.ts
├── lib/
│   └── prisma.ts
├── middlewares/
│   └── validate-query.ts
├── scripts/
│   ├── check-db.ts
│   └── seed.ts
├── generated/prisma/          # Prisma sinh, Git bỏ qua
└── modules/
    └── courts/
        ├── courts.routes.ts
        ├── courts.schema.ts
        ├── courts.controller.ts
        └── courts.service.ts
```

- Routes khai báo URL/method và nối validation với controller.
- Schema (`courts.schema.ts`) khai báo quy tắc query và kiểu dữ liệu đầu ra. Middleware dùng chung `validateQuery(schema)` trong `middlewares/validate-query.ts` dùng safeParse để kiểm tra/parse query, trả 400 nếu sai; nếu đúng, đưa dữ liệu đã parse vào `res.locals.query` rồi gọi `next()`.
- Controller lấy dữ liệu đã kiểm tra, gọi service và chọn HTTP status/JSON response. Lỗi async chuyển tới error handler chung trong app.
- App/router export trực tiếp; controller gọi hàm service, service dùng Prisma chung từ `lib/prisma.ts`, không truyền client qua chuỗi factory.
- Service xử lý quy tắc truy vấn (chỉ sân hoạt động, lọc/phân trang) và gọi Prisma trực tiếp; không phụ thuộc Express request/response.
- `config` đọc cấu hình; `lib` khởi tạo Prisma dùng chung; `scripts` chứa các lệnh chạy riêng. `app.ts` gắn module/error handler; `server.ts` mở cổng.

Ví dụ request: `GET /courts` → `validateQuery(listCourtsQuerySchema)` → controller `listCourts` → service `listCourts` → Prisma/PostgreSQL → controller trả JSON. Module auth sẽ theo cùng cách chia khi được triển khai; hiện chưa tạo module rỗng.

## Cách chạy và demo

**FB-003 đã hoàn tất.** PostgreSQL local đã chạy và backend Express/TypeScript tối thiểu có `GET /health`. Đã kiểm chứng SELECT 1 qua Prisma và áp dụng migration User. Migration Branch/Court đã kiểm tra SQL trên DB test riêng và áp dụng thành công vào DB phát triển; đã xác nhận PK/FK/CHECK/unique thực tế. Đã seed một chi nhánh và ba sân demo, chạy lại không tạo trùng. Frontend React/Vite đã gọi GET /courts để hiển thị sân từ PostgreSQL. Bộ test tự động đã gỡ theo yêu cầu; chưa có auth/booking.

Chạy các lệnh sau trên **máy local**, tại thư mục gốc repo:

```bash
# Lần đầu: tạo .env từ mẫu và thay mật khẩu trước khi chạy DB.
# Nếu đã có .env thì giữ nguyên, không chép đè.
cp -n .env.example .env
# Mở .env và thay CHANGE_ME_LOCAL_ONLY bằng mật khẩu local.
docker compose config --quiet
docker compose up -d db
docker compose ps
```

Compose dùng PostgreSQL 17, bind `127.0.0.1:55435`, volume `football-booking_pgdata`, timezone UTC. Mong đợi service db có trạng thái `healthy`. Thiếu mật khẩu/rỗng sẽ bị Compose từ chối; cổng bị chiếm khiến container không khởi chạy được. `.env` không được commit. Đổi mật khẩu trong file sau lần khởi tạo không tự đổi mật khẩu trong PostgreSQL. Không xóa volume để xử lý lỗi.

Chạy backend trong terminal local:

```bash
cd backend
npm ci
npx --no-install prisma generate
npm run dev
```

Mong đợi log `Backend listening at http://127.0.0.1:3000`. Nếu báo `EADDRINUSE`, kiểm tra chương trình đang chiếm cổng 3000. Dừng bằng Ctrl+C. `tsx watch` chạy TypeScript và tự khởi động lại khi sửa code; dùng `npm run check` để kiểm tra kiểu.

Trong terminal local khác:

```bash
curl --include http://127.0.0.1:3000/health
```

Mong đợi HTTP `200` và `{"status":"ok"}`. Endpoint chỉ xác nhận backend nhận request, chưa truy vấn database. Nếu không kết nối được, kiểm tra backend còn chạy và đúng cổng.

Kiểm tra kiểu tại `backend/` trên máy local:

```bash
npm run check
```

Backend hiện chỉ giữ ba script `dev`, `test`, `check` cho phần đang học. Không có hook tự sinh Prisma Client; chạy `npx --no-install prisma generate` sau khi cài dependency hoặc thay đổi schema. Script build/start sẽ bổ sung khi học tới phần đó.

Đã kiểm chứng ngày 2026-11-05: PostgreSQL healthy; psql trong container xác nhận database/user `football_booking` và UTC; backend check/build pass, cả start và dev trả HTTP 200 với JSON mong đợi. Đã kiểm chứng kết nối PostgreSQL từ backend qua Prisma bằng SELECT 1 (xem bên dưới).

### Chạy frontend React/Vite

Chạy trên **máy local** trong terminal riêng, từ thư mục gốc repo:

```bash
cd frontend
npm ci
npm run dev
```

Mở <http://127.0.0.1:5173/>. Mong đợi trang tiếng Việt Football Booking hiển thị ba sân demo, địa chỉ chi nhánh và giá mỗi 30 phút sau khi DB đã migrate/seed và backend đang chạy. Có trạng thái đang tải, lỗi với nút thử lại và danh sách rỗng. Vite phục vụ giao diện; backend vẫn chạy riêng tại cổng 3000, PostgreSQL tại 55435. Frontend không đọc `.env` gốc hoặc kết nối thẳng database.

Nếu cổng 5173 bị chiếm, Vite báo lỗi thay vì tự chuyển cổng (`strictPort`); kiểm tra tiến trình trước khi chạy lại. Dừng dev bằng Ctrl+C. Node yêu cầu theo `frontend/package.json`; Vite 8 hỗ trợ Node 22.12+ ([tài liệu Vite](https://vite.dev/guide/)).

Kiểm tra trên **máy local** tại `frontend/`:

```bash
npm run check
npm run build
npm run preview
```

`check` kiểm tra TypeScript; `build` kiểm tra kiểu rồi tạo `frontend/dist/`. `preview` phục vụ bản build tại <http://127.0.0.1:4173/>, cần build trước; đây là server xem thử trên local. Không dùng dev/preview làm cấu hình deploy.

Các file chính:

- `frontend/index.html`: trang HTML gốc và phần tử `root`.
- `frontend/src/main.tsx`: gắn React vào `root`.
- `frontend/src/App.tsx`: khung trang.
- `frontend/src/CourtsSection.tsx`: fetch danh sách sân, trạng thái tải/lỗi/rỗng, thẻ sân và phân trang.
- `frontend/src/styles.css`: màu sắc, bố cục và CSS cho màn hình nhỏ.
- `frontend/vite.config.ts`: plugin React và cổng local.

Đã chạy 2026-11-05: npm install báo 0 vulnerabilities; `npm run build` (gồm check) exit 0. Dev server sẵn sàng; HTTP trang gốc, main.tsx, App.tsx và CSS đều 200. Công cụ trình duyệt báo browser access host unavailable nên chưa xác nhận render, tương tác hoặc bố cục mobile trực quan. Chưa chạy preview.

### API danh sách sân và kết nối frontend

Backend có `GET /courts` công khai theo [hợp đồng đã duyệt](docs/design/api-courts.md#api-danh-sách-sân--get-courts-đã-duyệt-2026-11-03). Chỉ trả sân hoạt động; lọc `branchId`/`playersPerTeam` kết hợp AND; mặc định page=1/limit=10, tối đa limit=50; sắp xếp name/id tăng dần. Query sai trả 400/VALIDATION_ERROR/details; không khớp hoặc trang vượt phạm vi trả 200/data rỗng. HTTP 500 dùng JSON INTERNAL_ERROR chung, không trả SQL/stack/secret.

Chạy trên **máy local**, khi backend đang chạy:

```bash
curl --include 'http://127.0.0.1:3000/courts?playersPerTeam=5'
curl --include 'http://127.0.0.1:5173/api/courts'
```

Mong đợi HTTP 200, `success: true`, `data` sân và `meta` phân trang. Vite chuyển `/api/courts` sang Express `/courts` qua [server.proxy](https://vite.dev/config/server-options#server-proxy); trình duyệt chỉ gọi cùng origin 5173. Nếu proxy trả 502, kiểm tra backend cổng 3000; nếu backend trả 500, kiểm tra PostgreSQL và migration. Không cần thêm mật khẩu DB vào frontend. Khi deploy sẽ cần cấu hình reverse proxy tương ứng; Vite dev proxy không được đóng gói vào file frontend.

Đường chạy: `CourtsSection.tsx` → Vite proxy → `app.ts` → courts routes/validation/controller/service → Prisma → PostgreSQL → JSON → thẻ sân. Đây là giá hiện hành, chưa có giờ trống hoặc giữ chỗ/giữ giá. UI hiện chưa có bộ lọc; chỉ phân trang, API đã hỗ trợ bộ lọc.

Bộ test cũ đã được gỡ ngày 2026-11-06. Ngày 2026-11-09 đã cài lại Vitest/Supertest và thêm `npm test` (chạy tại backend). Bài đầu ở `backend/tests/courts.test.ts` tạo một chi nhánh với sân active/inactive, gọi GET /courts theo branchId và kiểm tra chỉ trả sân active; xác nhận DB thực tế là football_booking_test trước khi ghi, dọn riêng dữ liệu vừa tạo trong finally và disconnect sau test. DB test `football_booking_test` đã tạo lại và áp dụng hai migration; script test đặt `NODE_ENV=test` để chọn `TEST_DATABASE_URL` trong `.env` gốc. Kiểm tra kiểu source bằng `npm run check` (chưa bao gồm thư mục tests); kiểm tra API thủ công bằng các lệnh HTTP ở trên.

### Kiểm tra kết nối Prisma với DB local

Backend dùng Node 22.12+ trong nhánh 22 hoặc Node 24+, Prisma 7.10.1 và adapter PostgreSQL. Node tự đọc `.env` ở thư mục gốc repo; cấu hình trong `backend/src/config/database-config.ts` ghép POSTGRES_USER/PASSWORD/DB và DB_PORT thành URL kết nối tới `127.0.0.1`. Không cần tạo thêm `.env` trong backend hoặc nhập lại mật khẩu. Hiện cấu hình này dành cho backend chạy trực tiếp trên máy local.

Chạy trên **máy local** từ thư mục gốc repo:

```bash
docker compose up -d --wait db
cd backend
npm ci
npx --no-install prisma generate
npx --no-install tsx src/scripts/check-db.ts
```

Sau khi sinh Prisma Client, lệnh `tsx` chạy `SELECT 1 AS value` và đóng kết nối. Mong đợi `Database connection OK: SELECT 1 returned 1`, exit 0. Nó không mở HTTP server, tạo bảng hoặc sửa dữ liệu. Nếu lỗi, kiểm tra service db đang healthy, cổng và các biến `.env`; không gửi mật khẩu hoặc URL kết nối trong log. Lượt kiểm tra 2026-11-05 ban đầu thất bại khi DB đang dừng; khởi động lại DB healthy rồi chạy lại đã pass.

`prisma/schema.prisma` hiện có User/Role, Branch và Court; hai migration đã áp dụng local. `npx --no-install prisma generate` sinh mã client vào `backend/src/generated/prisma/` (Git bỏ qua). Generate chỉ sinh code, không phải migration.

### Seed dữ liệu sân mẫu

File dữ liệu và logic seed: [`backend/src/scripts/seed.ts`](backend/src/scripts/seed.ts). Lệnh được khai báo tại `backend/prisma.config.ts` trong `migrations.seed`.

Chạy trên **máy local**, từ thư mục gốc repo sau khi DB healthy và đã áp dụng migration:

```bash
cd backend
npx --no-install prisma generate
npx --no-install prisma db seed
```

Lệnh sinh Prisma Client rồi chạy `prisma db seed` → `tsx src/scripts/seed.ts`, thêm một Chi nhánh Demo với địa chỉ minh họa và ba sân 5/7/11 có giá mẫu 150.000/250.000/400.000 VND mỗi 30 phút. Mong đợi `Seed OK` và bảng ba sân, exit 0. Nếu thiếu bảng hoặc DB chưa chạy, seed báo lỗi; kiểm tra migration/kết nối và không gửi secret trong log.

Seed dùng UUID cố định và `upsert` theo ID với `update: {}`: thêm bản ghi còn thiếu, giữ bản ghi đã có và các chỉnh sửa về sau. Các bản ghi được thêm trong một transaction; không xóa dữ liệu. Nếu đã có tên demo trùng dưới ID khác, unique index sẽ từ chối và rollback thay vì tạo trùng. Muốn đổi giá trong DB của bản ghi đã seed phải cập nhật riêng, sửa giá trong file rồi chạy lại không ghi đè bản ghi cũ.

Đã kiểm chứng 2026-11-05: check/build pass; chạy seed hai lần exit 0; psql xác nhận 1 Branch, 3 Court, 0 User. Chưa kiểm tra rollback lỗi seed hoặc tạo tài khoản demo.


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
