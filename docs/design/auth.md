# Auth: hợp đồng, cookie và các quyết định còn mở

[Chỉ mục thiết kế](../DESIGN.md) · Cập nhật 2026-11-04 · Chưa có code/migration/test.

Trạng thái hiện hành:

| Phần | Trạng thái |
| --- | --- |
| Register/login/me, luồng logout và 204/lặp | Đã duyệt theo hợp đồng từng mục |
| Access JWT 15 phút, refresh hạn trượt 7 ngày, hash/rotation/reuse | Đã duyệt hướng và hành vi reuse |
| Vite proxy local, cookie flags/header/Origin-Referer và CSRF 403 | Đã duyệt |
| Promise single flight trong một tab; Web Locks, AT riêng/R cookie chung | Đã đồng ý hướng, chưa hoàn tất mọi race/failure |
| Logout nhiều tab/BroadcastChannel, retry/mất phản hồi/fallback | Còn đề xuất/chi tiết chưa chốt |
| Bộ trường RefreshToken/familyId, hướng khóa User phối hợp auth | Đã duyệt; SQL/test và thứ tự kiểm tra chi tiết còn hoàn thiện |
| Hợp đồng refresh cơ bản (request/response và lỗi chính) | Đã duyệt; lỗi mạng/đa tab/xóa cookie trên lỗi còn mở |
| Hash mật khẩu/rate limit | Còn hoàn thiện |

Người học yêu cầu học trực quan phần khó khi code: demo từng tình huống, không bắt thuộc toàn bộ lý thuyết trước task độc lập. Quyết định cần để triển khai luồng vẫn phải được hoàn thiện trước khi code. Không coi bảng lỗi hoặc giao thức đa tab đã duyệt chỉ vì đồng ý hướng.

## Refresh token — phương án cơ bản đã duyệt 2026-11-02

Người học đã duyệt phương án mentor trình bày: access JWT 15 phút, refresh token hạn trượt 7 ngày tính từ lần cấp mới (thay hạn cố định theo quyết định 2026-11-04), rotation, cookie HttpOnly, lưu hash trong bảng riêng và logout thu hồi refresh của phiên hiện tại. Người học đã được thông báo access token có thể còn hiệu lực tối đa 15 phút sau logout. Đây là xác nhận thiết kế, chưa phải bằng chứng hiểu cơ chế hoặc triển khai. Reuse và chính sách cookie/CSRF đã được duyệt ở các mục riêng; đa tab và schema nhóm phiên còn phần phải hoàn thiện như bảng trạng thái đầu chương.

### Đổi từ hạn cố định sang hạn trượt — đã duyệt 2026-11-04

- Người học chọn “còn sử dụng thì được gia hạn thêm 7 ngày.” sau khi so sánh hai chính sách. Quyết định này thay hạn tuyệt đối 7 ngày từ lúc đăng nhập trước đây; các xác nhận cũ trong hồ sơ học/archive giữ nguyên như bằng chứng lịch sử.
- “Còn sử dụng” được thực hiện bằng refresh thành công: token mới có expiresAt = thời điểm cấp mới + 7 ngày. Chỉ gọi API bằng access token không tự sửa hạn refresh token; token đã hết hạn không được dùng để gia hạn.
- Ví dụ đăng nhập 01/11 09:00: R1 hết hạn 08/11 09:00; refresh thành công 01/11 09:15: R2 hết hạn 08/11 09:15. Cookie mới theo hạn R2; R1 giữ hạn cũ và đã có usedAt, không được dùng lại thành công.
- Giữ access 15 phút, rotation/hash/familyId và hướng khóa User đã duyệt. Không thêm hạn tối đa cố định của cả nhóm. Phiên có thể tiếp tục nếu refresh hợp lệ đều đặn, nhưng logout/reuse/thu hồi vẫn kết thúc quyền refresh.
- Lịch giữ/dọn hash token cũ cần rà theo hạn từng token khi triển khai; không dùng giả định mọi token cùng nhóm có chung expiresAt. Không tự xóa token đang còn cần cho phát hiện reuse. Chính sách mở rộng giữ lịch sử qua hạn token cũ chưa chốt.
- Chưa có code/migration/test; không nâng mức hiểu từ lựa chọn chính sách.

### Luồng cơ bản và chi tiết cần hoàn thiện

1. Đăng nhập tạo access token JWT 15 phút và refresh token ngẫu nhiên 32 byte (không bắt buộc là JWT). Mỗi lần đăng nhập tạo một nhóm phiên riêng, cho phép nhiều thiết bị; token đầu hạn 7 ngày từ đăng nhập; mỗi refresh thành công cấp token mới có hạn 7 ngày từ thời điểm cấp mới. Không gia hạn token đã hết hạn; chưa thêm hạn tối đa cố định cho cả nhóm.
2. Access token giữ trong bộ nhớ frontend, gửi Bearer khi gọi API; reload trang xin lại qua refresh cookie. Refresh token đặt trong cookie HttpOnly, Secure khi HTTPS, SameSite=Lax, phạm vi cookie/đường dẫn nhất quán; không trả refresh token trong JSON cho JS hoặc lưu localStorage. Cấu hình dev local phải được thiết kế và kiểm chứng riêng, không hạ Secure ở production.
3. POST refresh chỉ dùng refresh token hợp lệ, chưa dùng/thu hồi và chưa quá hạn để cấp access token mới cùng refresh token mới (rotation). Token cũ được đánh dấu đã dùng; tiêu thụ token cũ/ghi token mới phải nguyên tử, cùng token không được có hai refresh thành công.
4. Giữ hash token cũ đến hạn để phát hiện dùng lại. Nếu nhận token đã dùng, thu hồi cả nhóm phiên đó và buộc đăng nhập lại theo hành vi reuse đã duyệt; không khóa tài khoản hoặc thu hồi nhóm phiên thiết bị khác. Hai tab/request hợp lệ refresh đồng thời cũng có thể bị xem là reuse: frontend cần ngăn refresh đồng thời trong cùng nhóm phiên, chính sách xử lý mất phản hồi/retry và phối hợp nhiều tab phải chốt trước triển khai. Không âm thầm cho grace period.
5. POST logout thu hồi mọi refresh token trong nhóm phiên hiện tại, xóa cookie đúng phạm vi và access token trong frontend. JWT access token đã cấp vẫn có thể hợp lệ tối đa 15 phút nếu chỉ xác minh chữ ký/hạn; chưa cam kết vô hiệu hóa tức thì access token bị sao chép. Không thêm denylist/check phiên mọi API khi chưa có nhu cầu riêng.
6. Khách bị chặn đặt vẫn đăng nhập/refresh/xem/hủy hợp lệ; API tạo booking kiểm tra isBookingBlocked hiện hành. Auth refresh không được vượt qua quy tắc booking hoặc tự mở chặn.

### Bảng RefreshToken — bộ trường và hướng khóa DB đã duyệt

**Triển khai schema 2026-11-11:** đã thêm model RefreshToken và quan hệ User trong Prisma, format/validate pass. Đã tạo file SQL migration 20261111044031_add_refresh_token bằng diff hai schema local; đã áp dụng lên football_booking_test và kiểm chứng ràng buộc SQL bằng transaction rollback; đã backup/apply DB local và generate client thành công, dữ liệu cũ giữ nguyên; chưa code cấp refresh token. Index truy vấn dự kiến chưa được thêm.

| Trường | Ý nghĩa |
| --- | --- |
| `id` | Định danh bản ghi UUID |
| `userId` | FK tới User.id, một User có nhiều token theo phiên/rotation |
| `familyId` | Định danh nhóm phiên, giữ nguyên qua các lần rotation |
| `tokenHash` | Hash SHA-256 của token ngẫu nhiên đủ mạnh, unique; không lưu token rõ |
| `expiresAt` | Hạn của từng token; token mới được cấp khi đăng nhập/refresh thành công có hạn 7 ngày từ lần cấp đó |
| `usedAt` | Thời điểm token được đổi, null khi chưa dùng |
| `revokedAt` | Thời điểm thu hồi, null khi chưa thu hồi |
| `createdAt` | Thời điểm tạo bản ghi |

Token rõ chỉ xuất hiện khi tạo và trong cookie/request cần thiết; không log, không lưu database/URL. Dữ liệu hash của token ngẫu nhiên khác passwordHash: thuật toán hash mật khẩu vẫn phải chọn riêng. TTL cơ bản đã duyệt; bảng riêng/hash đã duyệt ở mức phương án, hành vi reuse đã duyệt; bộ trường/kiểu/default đã duyệt tại constraints.md; lựa chọn familyId thay chain đã duyệt bên dưới. Hướng khóa User đã duyệt; SQL/thứ tự kiểm tra chi tiết và hợp đồng refresh vẫn cần hoàn thiện trước nghiệm thu ERD/auth.

### Tổ chức nhóm bằng familyId — đã duyệt 2026-11-04

- Người học chọn “Ok vậy dùng familyId đi.” sau so sánh nhóm phiên với chain parentTokenId. Chốt giữ bảng RefreshToken hiện tại, không thêm liên kết parentTokenId/replacedById hoặc bảng phiên mới theo lựa chọn này.
- Mỗi lần đăng nhập tạo familyId UUID mới; mọi token qua rotation giữ cùng familyId và userId; expiresAt riêng cho từng token theo hạn trượt 7 ngày. Mỗi token vẫn có id/tokenHash riêng.
- usedAt xác định token đã đổi; familyId xác định nhóm cần thu hồi theo hành vi logout/reuse đã duyệt. Giữ hash token cũ đến hạn. Không cần lưu liên kết token nào thay thế token nào trong bản đầu.
- Hai tab dùng chung cookie hiện hành thuộc cùng nhóm; một lần đăng nhập khác tạo nhóm mới, không lấy tab/thiết bị làm khóa định danh tự động.
- Đây là chọn mô hình, chưa phải bằng chứng hiểu hoặc SQL/test. Phương án khóa User được duyệt riêng ở mục tiếp theo.

### Phối hợp auth bằng khóa User — đã duyệt 2026-11-04

- Dùng transaction ngắn; tra hash token để xác định User, khóa dòng User FOR UPDATE rồi đọc/kiểm tra lại token và trạng thái nhóm trước khi rotate/revoke. Không quyết định từ dữ liệu đã đọc trước chờ khóa.
- Tất cả đường ghi token vào nhóm hoặc thu hồi nhóm phải tuân theo cơ chế phối hợp này. Rotation đánh dấu usedAt và ghi token mới nguyên tử; logout/reuse thu hồi đúng nhóm. Không gửi token/cookie thành công trước commit. Chi tiết thứ tự kiểm tra/thời gian/SQL vẫn cần hoàn thiện khi triển khai.
- Nếu refresh commit trước, logout tiếp theo phải thu hồi cả token mới; nếu logout commit trước, refresh sau chờ khóa phải từ chối nhóm đã thu hồi. Reuse phải commit việc thu hồi rồi trả lỗi, không throw khiến rollback mất thu hồi.
- Đánh đổi: các nhóm phiên cùng User và transaction đặt sân đang dùng khóa User có thể phải chờ nhau. Không giữ khóa qua chờ người dùng hoặc tác vụ mạng. Người học xác nhận “Ok duyệt.” sau trace refresh/logout/reuse và yêu cầu đi chậm khi gặp khóa. Đây là duyệt hướng thiết kế, không phải bằng chứng thực hành. Cần kiểm thử PostgreSQL riêng; chưa có code/test.

### Việc cần hoàn thiện và kiểm thử

- API đăng nhập/refresh/logout, nguồn thời gian, kiểm tra expiry tại đúng ranh giới, response không cache dữ liệu token, không log cookie/Authorization, rate limit phù hợp khi triển khai. Không dùng access token thay refresh token hoặc ngược lại.
- Triển khai/kiểm chứng cookie và CSRF theo mục đã duyệt bên dưới, bao gồm Vite proxy local, custom header và Origin/Referer. Topology production là giả định same-origin cần kiểm chứng khi triển khai; không coi HttpOnly/SameSite tự giải quyết CSRF.
- Kiểm thử rotation, token hết hạn/sai/thu hồi, dùng lại token cũ thu hồi đúng nhóm phiên, hai refresh đồng thời, retry/mất kết nối/nhiều tab, logout không refresh lại được, nhóm phiên khác vẫn hoạt động, blocked user vẫn refresh nhưng không đặt mới. Dùng database test riêng, không ghi dữ liệu/token thật vào tài liệu.
- Model Prisma và SQL migration đã thêm ngày 2026-11-11; migration/ràng buộc đã kiểm chứng trên DB test và áp dụng DB local sau backup, đã generate client; chưa code cấp refresh token/test luồng. Khi triển khai bảng và luồng này cần đánh giá lại ước lượng dự án, không tự ghi số giờ mới.
- Tham khảo: [RFC 9700 §4.14](https://www.rfc-editor.org/rfc/rfc9700.html#section-4.14) mô tả bảo vệ refresh token/rotation trong OAuth; app này chưa triển khai OAuth, chỉ tham khảo nguyên tắc. [OWASP Session Management](https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html) về cookie HttpOnly/Secure/SameSite; [OWASP CSRF](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html) để hoàn thiện bảo vệ request dùng cookie.

## Đăng ký khách — hợp đồng API đã duyệt 2026-11-03

- Đã duyệt 2026-11-03: POST /auth/register công khai; body chỉ name/email/password, tất cả bắt buộc và đúng kiểu string; không nhận null hoặc field thừa (kể cả role/isBookingBlocked/passwordHash).
- name: trim, gộp khoảng trắng liên tiếp, sau chuẩn hóa dài 1–100 ký tự; tên hiển thị không unique, khách được trùng tên.
- email: trim, chuyển chữ thường toàn bộ theo chính sách đăng nhập của app; định dạng email hợp lệ, dài tối đa 254 ký tự. Lưu giá trị chuẩn hóa và dùng cùng quy tắc khi đăng nhập/seed/kiểm tra unique database; không tự bỏ dấu chấm hoặc phần +tag. Không tự coi validation định dạng chứng minh chủ sở hữu email; xác minh email chưa thuộc phạm vi.
- password — **điều chỉnh đã duyệt 2026-11-10, thay giới hạn 15–128 ký tự trước đây:** string có ít nhất 15 Unicode code point và tối đa 72 byte UTF-8 để dùng bcrypt. Cho phép khoảng trắng/Unicode, không trim/gộp khoảng trắng/chuyển hoa thường hoặc âm thầm cắt ngắn; vượt giới hạn trả 400/VALIDATION_ERROR. Không ép tổ hợp chữ hoa/chữ thường/số/ký tự đặc biệt. Frontend/backend phải dùng cùng quy tắc khi triển khai.
- Lựa chọn 15 ký tự vì bản đầu không có MFA, tham khảo [OWASP Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html). Người học chọn thư viện bcrypt và duyệt giới hạn 72 byte UTF-8 theo [tài liệu bcrypt](https://github.com/kelektiv/node.bcrypt.js#security-issues-and-concerns); giới hạn byte khiến tiếng Việt/emoji chứa được ít ký tự hơn ASCII. Không tuyên bố đáp ứng toàn bộ khuyến nghị OWASP. Đã duyệt bcrypt async với cost 12 và hash trực tiếp trong service register ngày 2026-11-10; chưa benchmark cost riêng. Biện pháp chống đoán mật khẩu còn chốt trước endpoint.
- Thiếu/sai/thừa field: 400/VALIDATION_ERROR với details theo field/message. Backend tự gán CUSTOMER/isBookingBlocked=false như phạm vi đã chốt. Response thành công, lỗi trùng email và đăng nhập riêng sau đăng ký đã duyệt ở dưới.
- Người học xác nhận “Ok.” cho bộ validation trên. Chưa triển khai/test; không áp validation đăng ký cho login một cách tự động.

### Response và hành vi sau đăng ký — đã duyệt 2026-11-03

- Thành công HTTP 201, success=true, message="Đăng ký thành công. Vui lòng đăng nhập.", data object gồm id/name/email/role/isBookingBlocked/createdAt. role=CUSTOMER, isBookingBlocked=false; email/name đã chuẩn hóa, createdAt UTC. Không trả password/passwordHash/token.
- Đã duyệt không tự đăng nhập sau đăng ký: không cấp access/refresh token hoặc đặt cookie phiên mới; giao diện chuyển sang màn hình đăng nhập. Nếu client đã có phiên, endpoint đăng ký không thay cookie/phiên hiện tại. Login/refresh giữ luồng riêng đã lên kế hoạch.
- Email đã tồn tại sau chuẩn hóa, dù tài khoản CUSTOMER hay ADMIN: 409/EMAIL_ALREADY_EXISTS, message="Email đã được sử dụng. Vui lòng đăng nhập hoặc dùng email khác." Không tạo User thứ hai. Database phải bảo vệ unique email, map đúng xung đột email kể cả đăng ký đồng thời; không chỉ kiểm tra SELECT trước insert.
- Body sai/thiếu/thừa: 400/VALIDATION_ERROR/details theo validation đã duyệt. Endpoint công khai không đòi access token.
- Cần hash mật khẩu trước lưu; đã chọn thư viện bcrypt ngày 2026-11-10; cost 12/async đã duyệt và hash trực tiếp trong service register; rate limit đăng ký đã chốt tại mục dưới; chi tiết endpoint còn hoàn thiện trong phần auth. Người học xác nhận “Ok.” cho response/lỗi và hành vi đăng nhập riêng sau đăng ký. Chưa triển khai endpoint.

### Rate limit đăng ký — đã duyệt 2026-11-10

- Dùng express-rate-limit ngay trong auth.routes.ts, trước validateBody/controller: tối đa 5 request tới POST /auth/register trong 15 phút cho mỗi IP theo cơ chế mặc định của thư viện. Đếm cả request bị validation từ chối; các endpoint khác không dùng chung limiter này.
- Vượt giới hạn trả 429, success=false, error.code=RATE_LIMIT_EXCEEDED, message="Bạn đã gửi quá nhiều yêu cầu đăng ký. Vui lòng thử lại sau."; giữ Retry-After do thư viện cung cấp.
- Bản đầu dùng MemoryStore mặc định cho một tiến trình local; restart làm mất bộ đếm. Nhiều người chung IP có thể bị tính chung, IPv6 dùng cách nhóm subnet mặc định của thư viện. Khi chạy nhiều instance phải review shared store/proxy; chưa mở trust proxy tùy ý.
- Đã cài dependency, kiểm tra TypeScript pass và chạy thử HTTP một lần trên app tạm: 5 request body sai đi tới validation/400, request thứ 6 trả 429 có Retry-After; không ghi DB hoặc thêm file test. Đã gắn authRouter vào app chính tại /auth; 9 test HTTP đăng ký đã pass trên PostgreSQL test, gồm rate limit và hai request đồng thời tranh cùng email (201/409, chỉ một User).

## Đăng nhập — POST /auth/login (hợp đồng chính đã duyệt 2026-11-03)

**Endpoint hoạt động — cập nhật 2026-11-11:** người học đã duyệt rate limit riêng cho login: 5 request/15 phút/IP sau CSRF, tính cả thành công/sai mật khẩu/body sai; vượt trả 429/RATE_LIMIT_EXCEEDED, có Retry-After. Dùng MemoryStore riêng với register; restart mất bộ đếm, chưa hỗ trợ nhiều instance. Đã gắn loginLimiter → validateBody(loginBodySchema) → loginController sau middleware CSRF. express.json chỉ parse JSON; form/text không được nhận và bị validation trả 400. Controller đặt Cache-Control: no-store trước gọi service. 7 test HTTP/PostgreSQL test cho login pass; toàn backend 87/87 test và TypeScript pass. FE login đã có form/route/state bộ nhớ và build/self-check giả lập pass; chưa login browser. Refresh/logout/me chưa có handler. Các ghi chú chưa mở route hoặc chưa test HTTP/DB bên dưới là trạng thái trước cập nhật này.

**Cập nhật triển khai 2026-11-11:** service đã tạo refresh token 32 byte/base64url, lưu SHA-256/familyId UUID mới/hạn 7 ngày; trả token và hạn nội bộ sang controller. Controller đặt cookie tên `refreshToken`, HttpOnly, SameSite=Lax, Path=/, không Domain, Expires dùng cùng hạn lưu DB; Secure khi NODE_ENV=production, local HTTP không Secure. Hai trường nội bộ được loại khỏi JSON. TypeScript và self-check controller/service giả lập với Express serialize cookie thật đã pass; chưa HTTP/browser hoặc kiểm chứng ghi phiên bằng PostgreSQL thật. Route login vẫn chưa gắn; CSRF/rate limit phải hoàn thiện trước khi mở endpoint. Các ghi chú chưa triển khai token/cookie bên dưới là trạng thái trước cập nhật này.

- Công khai, dùng chung CUSTOMER/ADMIN; body chỉ email/password, bắt buộc string, không null/field thừa. email chuẩn hóa/validate theo đăng ký; password giữ nguyên, không trim, không ép kiểm tra độ mạnh khi đăng nhập. **Giới hạn đã duyệt 2026-11-11:** password không rỗng, tối đa 72 byte UTF-8; không trim, không áp tối thiểu 15 của đăng ký thành lỗi validation ở login. Email trim/chữ thường/đúng định dạng/tối đa 254 ký tự. Người học chốt schema, chưa là bằng chứng hiểu độc lập. Đã viết loginBodySchema và LoginBody; chưa gắn endpoint.
- Thành công 200/success=true/message="Đăng nhập thành công", data {accessToken,tokenType:"Bearer",expiresIn:900,user:{id,name,email,role,isBookingBlocked}}. Access JWT 15 phút theo phương án đã duyệt.
- Cấp refresh token hạn 7 ngày từ lúc đăng nhập qua cookie HttpOnly, lưu hash token vào DB theo mô hình phiên đã đề xuất; không trả refresh token trong JSON, không trả password/hash. Chính sách cookie/CSRF đã duyệt ở mục riêng; nhóm phiên và trường token còn hoàn thiện, không suy ra đã xong từ response này.
- Email không có hoặc mật khẩu không khớp cùng trả 401/INVALID_CREDENTIALS, message="Email hoặc mật khẩu không đúng." Không cấp token khi thất bại. Body sai/thiếu/thừa trả 400/VALIDATION_ERROR/details.
- isBookingBlocked=true vẫn đăng nhập được; không tự đổi trạng thái chặn khi đăng nhập. Tạo booking luôn kiểm tra cờ hiện hành, không chỉ tin bản sao trong token/response.
- Hash/tham số, rate limit và xử lý phiên hiện tại khi đăng nhập lại còn thiết kế/kiểm chứng. Người học xác nhận “Ok.” cho body email/password, response 200/access token 15 phút/user, refresh cookie HttpOnly 7 ngày, lỗi 401/INVALID_CREDENTIALS và 400 validation, cho khách bị chặn đăng nhập. Schema đầu vào và phần service tìm user/so bcrypt đã triển khai/kiểm chứng riêng ngày 2026-11-11; service trả null khi thông tin sai; khi đúng ký access JWT HS256 hạn 900 giây (sub=user ID, role), trả accessToken/tokenType/expiresIn/user công khai. Đã có loginController trả 200/401 nhưng chưa gắn route. Refresh token/phiên/cookie và endpoint login chưa triển khai, chi tiết kỹ thuật còn review riêng.

## Tài khoản hiện tại — GET /auth/me (đã duyệt 2026-11-03)

- CUSTOMER/ADMIN có access token hợp lệ gọi bằng Authorization: Bearer <accessToken>; không nhận userId từ body/query để chọn tài khoản khác.
- Backend lấy userId từ JWT đã xác thực rồi đọc User hiện hành trong database; 200/success=true/message="Lấy thông tin tài khoản thành công", data {id,name,email,role,isBookingBlocked}, không trả passwordHash/token/lý do chặn/lịch sử.
- isBookingBlocked phản ánh lúc đọc database, giúp UI cập nhật trạng thái; khách bị chặn vẫn được gọi API này. Trạng thái có thể đổi sau response; API tạo booking luôn kiểm tra hiện hành độc lập.
- Thiếu/sai/hết hạn access token hoặc user không còn tồn tại: 401/UNAUTHENTICATED theo khung lỗi hiện có. Không yêu cầu refresh cookie để gọi /me và không dùng refresh token thay access token.
- Người học xác nhận “Ok.” cho endpoint, bộ trường, dùng access token lấy User hiện hành, lỗi 401 và khách bị chặn vẫn xem được. Chưa triển khai/test.

## Gia hạn phiên — POST /auth/refresh (hợp đồng cơ bản đã duyệt 2026-11-04)

### Làm rõ đề xuất người học 2026-11-03

Người học tự đề xuất refresh cấp mới cả accessToken và refreshToken, refresh token được lưu database. Đúng hướng rotation và quản lý phía server, nhất quán phương án cơ bản đã duyệt. Không coi là đã duyệt toàn bộ lỗi/cookie/CSRF/concurrency của hợp đồng refresh.

Mentor cụ thể hóa: access token mới trả trong JSON; refresh token mới gửi qua Set-Cookie HttpOnly. Database lưu hash token mới và metadata phiên/hạn, không lưu token rõ; đánh dấu token cũ usedAt và lưu hash token mới trong cùng transaction. Giữ hash token cũ đến hạn phục vụ phát hiện dùng lại, thay vì xóa dấu vết sau rotation. Chi tiết reuse/khóa/nhóm phiên vẫn cần review. Tham khảo cơ chế rotation trong RFC 9700 §4.14.2; app không tự nhận là triển khai OAuth.


- Không yêu cầu access token còn hạn, không dùng access token làm refresh; backend đọc refresh token từ cookie HttpOnly. Body không có token/userId; đã duyệt cho phép không body hoặc {}, từ chối field thừa bằng 400/VALIDATION_ERROR/details.
- Refresh token phải khớp hash trong database, chưa dùng/thu hồi, chưa hết hạn và thuộc User còn tồn tại. Chỉ rotate thành công nếu các điều kiện hợp lệ; kiểm tra/tiêu thụ token cũ/tạo token mới phải nguyên tử.
- Thành công 200/success=true/message="Gia hạn phiên thành công", data {accessToken,tokenType:"Bearer",expiresIn:900}; thay refresh cookie bằng token mới và làm token cũ không còn dùng để refresh thành công. Không trả refresh token trong JSON, không tạo User hoặc đổi trạng thái chặn.
- Refresh thành công cấp token mới với expiresAt = thời điểm cấp mới + 7 ngày; giữ familyId/userId, không sửa expiresAt của token cũ. CUSTOMER bị chặn đặt vẫn refresh được.
- Refresh token được xác định trong DB và đã hết hạn: 401/REFRESH_TOKEN_EXPIRED theo quyết định mới bên dưới. Cookie thiếu/token sai/thu hồi hoặc User không còn tồn tại vẫn 401/UNAUTHENTICATED; không cấp token mới. Không gán mã hết hạn cho token không xác định được hoặc mọi lỗi 401. Thứ tự phân loại token vừa hết hạn vừa đã dùng/thu hồi cần hoàn thiện cùng SQL trước triển khai.
- Hành vi reuse và cookie/CSRF đã duyệt ở mục riêng. Request đồng thời/mất phản hồi/retry/đa tab vẫn còn chi tiết phải hoàn thiện; không tự xóa cookie trên mọi 401 trước khi thiết kế đầy đủ concurrency.
- Người học xác nhận “Ok hợp lý chốt đi.” sau giải thích API contract và vai trò FB-002/004/009/014. Chốt hợp đồng cơ bản: request/response 200, lỗi 400 field thừa, 401 token không hợp lệ/reuse, 403 CSRF theo chính sách đã duyệt. Response refresh không kèm hồ sơ user; dùng GET /auth/me khi cần. expiresIn tính bằng giây. Không suy ra đã duyệt toàn bộ chính sách lỗi mạng/đa tab hoặc cách xóa cookie trên lỗi. Chưa triển khai/test.

### Rotation/hash — xác nhận tiếp tục 2026-11-03

Người học trả lời “Ok đi tiếp phần tiếp theo” sau giải thích cấp mới cả hai token, access JSON/refresh HttpOnly, DB lưu hash và đánh dấu cũ/ghi mới nguyên tử, giữ hash cũ đến hạn, hạn phiên tuyệt đối 7 ngày (đã bị thay bằng hạn trượt theo quyết định 2026-11-04). Ghi nhận đồng ý hướng này, chưa suy ra duyệt toàn bộ lỗi/cookie/CSRF/concurrency.

### Dùng lại refresh token cũ — hành vi đã duyệt 2026-11-03

- Mỗi lần đăng nhập tạo nhóm phiên riêng (familyId); các refresh token qua rotation trong lần đăng nhập đó thuộc cùng nhóm. Dùng lại token đã usedAt, còn trong hạn và thuộc nhóm chưa thu hồi: từ chối 401/UNAUTHENTICATED và thu hồi quyền refresh của toàn nhóm đó, gồm refresh token mới đã cấp. Không thu hồi nhóm của lần đăng nhập/thiết bị khác, không khóa tài khoản/chặn đặt.
- Không thể khẳng định đây là kẻ tấn công: retry mất phản hồi hoặc hai tab cùng gửi token cũ cũng có thể gây tình huống này. Frontend phải phối hợp một refresh cho mỗi phiên và không tự động retry refresh bằng token cũ; phối hợp đa tab/khóa và kiểm thử chi tiết để buổi sau.
- Không vô hiệu hóa tức thì access JWT đã cấp; theo giới hạn đã chốt, token đó có thể còn hợp lệ đến hết hạn (tối đa 15 phút). Không thêm denylist/kiểm tra phiên mọi API.
- Chưa thiết kế hoàn chỉnh cookie clearing/CSRF/grace period; không thêm grace period hoặc idempotency key trong đề xuất này. Không coi kiểm tra usedAt ngoài transaction đủ an toàn; revoke/rotate phải phối hợp khóa nhóm phiên khi triển khai.
- Người học xác nhận “Ok.” cho hành vi reuse: 401, thu hồi quyền refresh cả nhóm phiên liên quan, nhóm khác không ảnh hưởng, access đã cấp có thể còn hạn tối đa 15 phút. Các phần phối hợp nhiều tab/retry/khóa còn phải hoàn thiện; cookie/CSRF và logout đã được duyệt ở các mục riêng. Hợp đồng refresh đầy đủ chưa hoàn tất; FB-002 chưa DONE, chưa triển khai/test.

## Logout phiên hiện tại — luồng chính đã duyệt 2026-11-04

- Người học đề xuất thu hồi refresh ở A và giữ phiên B; xóa access token phía frontend A. Phạm vi này phù hợp phương án cơ bản đã duyệt.
- Luồng đã duyệt POST /auth/logout: backend lấy refresh token từ cookie HttpOnly, tra hash để xác định nhóm phiên A và thu hồi quyền refresh cả nhóm đó trong database. Không nhận userId/familyId do frontend chọn để quyết định nhóm bị thu hồi.
- Sau khi thu hồi thành công, backend gửi Set-Cookie hết hạn đúng tên/Path/Domain của cookie đã đặt để trình duyệt xóa cookie; JavaScript không tự xóa cookie HttpOnly. Frontend dọn access token trong bộ nhớ và trạng thái đăng nhập.
- Phiên đăng nhập B thuộc nhóm khác giữ nguyên. Xóa access token ở frontend A không thu hồi bản sao token đã cấp: bản sao còn có thể dùng tới expiresAt, tối đa phần thời gian còn lại của hạn 15 phút. Giữ lựa chọn hiện tại, chưa thêm denylist hoặc kiểm tra phiên cho mọi API.
- Người học xác nhận “Ok đồng ý.” cho luồng trên. Response/logout lặp đã được duyệt ở mục dưới; chính sách CSRF đã duyệt ở mục riêng; mã lỗi hệ thống chi tiết và phối hợp logout-refresh đồng thời còn thiết kế; chưa triển khai/test.

### Response và logout lặp — đã duyệt 2026-11-04

- POST /auth/logout không cần body hoặc access token còn hạn; định danh nhóm phiên bằng refresh cookie. Áp dụng kiểm tra nguồn request/CSRF theo chính sách đã duyệt bên dưới; không bỏ kiểm tra này vì không yêu cầu Bearer.
- Sau khi thu hồi thành công nhóm phiên xác định được, trả 204 No Content (không JSON), kèm Set-Cookie xóa refresh cookie đúng phạm vi.
- Nếu cookie thiếu, token không khớp bản ghi hoặc nhóm đã thu hồi: vẫn trả 204 và gửi xóa cookie; không có nhóm nhận diện được thì không thu hồi nhóm khác. Token đã hết hạn hoặc đã dùng mà còn tra được nhóm vẫn thu hồi nhóm đó trước khi trả thành công.
- Logout gửi lại sau lần thành công vẫn 204: kết quả mong muốn là phiên không refresh được nữa. Không yêu cầu access token còn hạn để người dùng đăng xuất.
- Lỗi database/hệ thống khi cần tra hoặc thu hồi không được báo 204 như thể đã thu hồi thành công. CSRF đã chốt 403/CSRF_VALIDATION_FAILED; mã lỗi hệ thống và phối hợp transaction với refresh còn thiết kế.

- Người học xác nhận “Ok.” cho response 204/no body, logout lặp/cookie thiếu/không khớp/đã thu hồi, không cần access còn hạn và lỗi DB không báo thành công. Chỉ ghi duyệt phần đã trình bày; CSRF đã duyệt ở mục riêng; mã lỗi hệ thống/concurrency còn thiết kế.

## Cookie và CSRF — chính sách đã duyệt 2026-11-04

**Điều chỉnh đã duyệt 2026-11-10:** người học yêu cầu tạm bỏ CSRF ở đăng ký để hoàn tất luồng cơ bản trước. POST /auth/register chỉ nhận JSON, không tạo phiên/cookie, tạm thời không bắt buộc Origin/Referer hoặc X-CSRF-Protection. Đã gỡ middleware CSRF chưa gắn route và APP_ORIGIN mẫu chưa dùng. Bảo vệ login/refresh/logout vẫn theo chính sách dưới đây và phải review trước khi triển khai phiên/cookie; quyết định này không miễn CSRF cho các endpoint đó. Bằng chứng trước khi gỡ: middleware qua kiểm tra TypeScript và assert trực tiếp một lần, chưa HTTP/browser/cookie.

Người học nói chưa rành CSRF, yêu cầu đề xuất phù hợp và giải thích lý do. Yêu cầu ban đầu không tự là bằng chứng đã hiểu. Sau phần giải thích và câu hỏi xác nhận rõ cả ba lớp, người học trả lời “Ok.”; ghi duyệt chính sách bên dưới, chưa có bằng chứng triển khai hoặc giải thích độc lập.

### Giả định triển khai và phạm vi

- Đề xuất frontend và API cùng origin: ví dụ minh họa https://booking.example, frontend ở /, API ở /api/* (prefix public minh họa, chưa đổi các route /auth/* trong tài liệu thành code). Caddy định tuyến API đến Express. Local dùng Vite proxy để trình duyệt gọi API qua cùng origin frontend — người học đã duyệt riêng lựa chọn này bằng “Ok dùng vite proxy”. Chưa thuê/chọn domain hoặc triển khai proxy.
- Origin là bộ scheme/host/port. Backend cấu hình APP_ORIGIN cho từng môi trường; không suy ra giá trị tin cậy từ Host/X-Forwarded-Host tùy ý. Proxy giữ nguyên Origin/Referer của trình duyệt. Không rewrite nguồn không tin cậy thành origin của app.
- Bảo vệ POST login/refresh/logout trước khi tạo/rotate/thu hồi phiên hoặc set/xóa cookie, gồm cả logout không có cookie. Register tạm miễn theo điều chỉnh 2026-11-10 ở trên. Các API đặt/hủy dùng Bearer vẫn kiểm tra xác thực/quyền như đã chốt; không chuyển chúng sang xác thực bằng cookie.

### Cơ chế đã duyệt

**Triển khai middleware 2026-11-11:** csrfProtection kiểm tra X-CSRF-Protection: 1 và Origin khớp APP_ORIGIN; chỉ dùng Referer khi không có Origin, từ chối thiếu/sai bằng 403/CSRF_VALIDATION_FAILED trước handler. Đã gắn bằng authRouter.post(['/login', '/refresh', '/logout'], csrfProtection); chưa có handler endpoint tương ứng nên request hợp lệ còn đi tiếp tới 404, không tạo/rotate/thu hồi phiên. Register không bị áp middleware. TypeScript và self-check 16 ca/request cùng phạm vi router giả lập pass; chưa kiểm chứng HTTP/browser. Kiểm tra Content-Type và rate limit login vẫn chưa triển khai.

1. Refresh cookie host-only (không Domain), Path=/, HttpOnly, SameSite=Lax và Secure trên HTTPS production. Cookie mới có thời hạn không vượt expiresAt của refresh token mới; cập nhật cookie theo hạn mới sau rotation thành công, không dùng phần thời gian còn lại của hạn đăng nhập ban đầu. Cookie xóa cùng tên/Path/Domain. Local HTTP có cấu hình riêng không Secure, chỉ dùng local; không hạ Secure production. Tên cookie cụ thể chốt khi triển khai.
2. FE gửi header X-CSRF-Protection: 1 trên các POST auth được bảo vệ. Backend bắt buộc đúng header; đây là giá trị cố định công khai, không phải token bí mật và không thay thế refresh/access token. Áp dụng cả refresh/logout không body. Login/register chỉ nhận application/json, không ngầm nhận form hoặc text/plain.
3. Backend kiểm tra Origin khớp chính xác APP_ORIGIN (scheme/host/port). Nếu không có Origin, parse Referer và so sánh origin. Origin null, sai định dạng, khác cấu hình hoặc thiếu cả hai thì từ chối; không fallback Referer để bỏ qua Origin đã có nhưng sai. Không so khớp bằng includes/đuôi tên miền.
4. Same-origin không cần mở CORS cho website khác. Không phản chiếu Origin tùy ý hoặc allowlist wildcard subdomain; nếu topology thay đổi phải review lại allowlist/preflight/credentials trước khi mở cross-origin. Custom header chặn form thường; browser muốn gửi header này cross-origin phải được CORS preflight cho phép, API không cấp phép nguồn lạ.
5. Vi phạm header/nguồn trả 403/CSRF_VALIDATION_FAILED theo khung error; không rotate/thu hồi/set/xóa cookie. Vì vậy quy tắc logout 204 chỉ áp dụng sau khi qua bảo vệ request, không miễn CSRF cho logout lặp.
6. Postman/curl/integration test gửi Origin hợp lệ và custom header để mô phỏng hợp đồng; không bypass bảo vệ chỉ vì thiếu Origin. Header có thể bị client ngoài trình duyệt giả mạo; cơ chế này ngăn CSRF bằng trình duyệt, không thay thế xác thực.

### Lý do và giới hạn

- HttpOnly ngăn JS đọc refresh cookie; nó không cấm trình duyệt gửi cookie. SameSite là lớp bổ sung, không đủ để tự chốt toàn bộ CSRF.
- OWASP nêu custom header là phương án cho AJAX/API không cần lưu thêm CSRF token; tính an toàn phụ thuộc CORS chặt. Kết hợp kiểm tra nguồn chính xác và same-origin phù hợp frontend React/Express nhỏ, không thêm kho token/endpoint cấp CSRF token trong phương án này.
- Không bảo đảm chống XSS: mã độc chạy ngay trong origin app có thể gửi request đúng header/nguồn. CSRF và XSS là hai vấn đề khác nhau.
- Đây là đề xuất có điều kiện, không tuyên bố tối ưu mọi hệ thống. Nếu bổ sung form submit trực tiếp, frontend khác origin hoặc client mới phải đánh giá lại.
- Nguồn đã đọc: https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html, các mục Custom Request Headers, SameSite, Verify Origin.

### Kiểm chứng khi có ứng dụng (chưa chạy)

- Request auth nguồn hợp lệ + header đúng hoạt động; thiếu/sai header, nguồn lạ, Origin null và thiếu cả Origin/Referer đều 403 trước thay đổi phiên/cookie; Referer hợp lệ chỉ dùng khi Origin vắng.
- Kiểm tra browser thật: form từ origin lạ không thay đổi phiên; fetch kèm custom header từ origin lạ bị chặn; nguồn cùng site khác subdomain cũng bị từ chối. Kiểm tra localhost qua Vite proxy và HTTPS qua Caddy không sửa sai Origin.
- Kiểm tra cookie flags, host-only/path, TTL còn lại, xóa cookie và logout 204 sau lớp bảo vệ. Dùng browser thật bên cạnh API test vì Supertest không mô phỏng SameSite/CORS.

### Vite proxy local — đã duyệt 2026-11-04

- FE gọi đường dẫn tương đối /api/* qua Vite; Vite chuyển tiếp tới Express. Port 5173/3000 chỉ là ví dụ, chưa có cấu hình hoặc tiến trình thực tế. Không hardcode FE gọi trực tiếp origin backend.
- Khi triển khai FB-003, xác định prefix/rewrite nhất quán với Express và bảo toàn Origin/Referer, kiểm tra Set-Cookie qua proxy. Vite proxy là công cụ local; production dự kiến dùng Caddy như roadmap, chưa triển khai.
- Lựa chọn proxy không tự cung cấp bảo vệ CSRF; custom header, kiểm tra nguồn và cookie flags đã được duyệt riêng sau phần giải thích cả ba lớp. Chưa thêm vite.config hoặc ứng dụng vì vẫn ở FB-002.

### Thứ tự kiểm tra CSRF — đã duyệt

- Với POST auth được bảo vệ: kiểm tra nguồn Origin/Referer đúng APP_ORIGIN và X-CSRF-Protection: 1 trước; không đạt trả 403/CSRF_VALIDATION_FAILED, không thay đổi cookie/phiên. Qua lớp này mới xử lý validation/auth/refresh/logout theo từng hợp đồng.
- Vì vậy POST logout hợp lệ về nguồn/header nhưng cookie đã mất trả 204; logout từ nguồn lạ trả 403 dù cookie có hay không. Frontend thêm header ở hàm gọi API dùng chung khi triển khai để tránh quên.
- Người học xác nhận “Ok.” sau câu hỏi rõ về áp dụng cả ba lớp cookie/header/kiểm tra nguồn. Ghi duyệt chính sách CSRF và thứ tự trên; chưa có code/test.

## Phối hợp refresh đồng thời — hướng đã đồng ý, chi tiết còn mở

- Một tab có thể đồng thời gọi nhiều API bằng access token đã hết hạn. Nếu mỗi request tự refresh, chúng có thể cùng gửi refresh token R1; request đầu rotate thành R2, request sau dùng lại R1 kích hoạt thu hồi nhóm phiên theo chính sách đã duyệt.
- Hướng trong một tab đã được người học duyệt bằng “Ok.” sau giải thích Promise/Axios: giữ chung một Promise refresh đang chạy (single flight); request khác chờ kết quả, nhận access mới rồi gửi lại request bị từ chối xác thực tối đa một lần. Không refresh cho 403/lỗi nghiệp vụ, không tự lặp refresh khi endpoint refresh thất bại.
- Chỉ gửi lại sau lỗi xác thực được backend trả trước xử lý nghiệp vụ; không tự retry mutation sau timeout/mất response vì không biết thao tác đã commit hay chưa. Mất response refresh không tự retry token cũ theo chính sách reuse nghiêm ngặt.
- Promise trong một tab không phối hợp các tab khác. Hướng Web Locks và AT riêng/R cookie chung đã đồng ý ở mục bên dưới; logout đồng thời và khóa nhóm phiên DB vẫn cần hoàn thiện. Chưa ghi toàn bộ concurrency đã giải quyết.

### Nhiều tab — hướng Web Locks đã được đồng ý tiếp tục 2026-11-04

- Các tab cùng origin trong cùng browser profile/storage context thường dùng chung refresh cookie, nhưng có bộ nhớ/Promise riêng. Khác trình duyệt/profile là nhóm phiên khác khi đăng nhập riêng, không nhầm với hai tab chia sẻ cookie.
- Đề xuất Web Locks API: các tab xin cùng tên khóa auth trước khi gửi refresh; một tab giữ khóa qua toàn bộ request/response, tab khác chờ. Sau khi browser đã xử lý Set-Cookie mới, nhả khóa. Tab kế tiếp gửi request mới bằng cookie hiện hành do browser tự gắn; không chụp token/cookie cũ trước khi chờ khóa.
- Bản đơn giản không cần truyền access token giữa các tab: tab chờ có thể refresh tiếp bằng cookie mới để lấy access riêng. Có thể nhiều lần rotation nối tiếp, nhưng tránh hai refresh đồng thời gửi cùng cookie. Chưa thêm cache access token trong localStorage hoặc BroadcastChannel truyền token.
- Web Locks yêu cầu secure context và hỗ trợ trình duyệt. Khi triển khai phải kiểm tra localhost/HTTPS và browser mục tiêu. Chưa chốt fallback cho trình duyệt không hỗ trợ, không âm thầm chạy refresh không khóa như thể đa tab vẫn an toàn.
- Đây là phối hợp client, không thay thế transaction/khóa nhóm phiên trong DB. Tab bị đóng hoặc mất response giữa request có thể để lại kết quả không xác định; không khẳng định khóa browser giải quyết retry/reuse mọi trường hợp. Theo hướng fail closed, không tự retry refresh đã mất response; chi tiết khôi phục/logout còn review.
- Logout/login dùng cùng vùng điều phối và thông báo thay đổi đăng nhập giữa tab còn thiết kế ở bước sau. Chưa ghi đa tab đầy đủ đã hoàn tất.
- Đã đọc MDN Web Locks API: https://developer.mozilla.org/en-US/docs/Web/API/Web_Locks_API và Broadcast Channel API: https://developer.mozilla.org/en-US/docs/Web/API/Broadcast_Channel_API. Chưa triển khai/test.

### Giải thích đề xuất Web Locks theo yêu cầu người học

- Người học chưa biết chọn cách phối hợp nhiều tab và yêu cầu mentor đề xuất/giải thích; chưa duyệt Web Locks chỉ từ yêu cầu này.
- Khuyến nghị giữ hai lớp FE: Promise dùng chung xử lý nhiều request trong một tab; Web Locks cho các tab của app lần lượt thực hiện refresh. Không thêm dependency để thực hiện hai cơ chế này; Axios chưa phải dependency đã cài/chốt của workspace.
- Ví dụ hai tab A1/A2 cùng browser profile chia sẻ refresh cookie R1: A1 giữ khóa và gửi refresh, nhận Set-Cookie R2; A2 chờ khóa, sau đó browser gửi cookie hiện hành R2 để lấy access riêng. Đây là hai lần refresh nối tiếp hợp lệ, không phải hai refresh cùng token R1. Browser tự quản lý cookie HttpOnly; FE không đọc hoặc chuyển refresh token.
- Web Lock là khóa điều phối JavaScript của browser, không phải khóa dòng DB. Request đi từ client khác vẫn có thể bỏ qua điều phối FE nên backend phải bảo đảm rotation nguyên tử và reuse theo chính sách đã chốt.
- Phần đề xuất này chỉ là luồng thành công của refresh đa tab; không hứa giải quyết request mất response, tab chết hoặc logout đồng thời. Các tình huống đó và browser thiếu Web Locks còn phải chốt, không coi toàn bộ auth hoàn tất.

### Ví dụ token nối tiếp giữa hai tab

- A1 giữ khóa: cookie R1 → refresh → access AT1 trong bộ nhớ A1, cookie chung R2; A1 nhả khóa.
- A2 được cấp khóa: cookie hiện hành R2 → refresh → access AT2 trong bộ nhớ A2, cookie chung R3; A2 nhả khóa.
- Kết quả: A1 dùng AT1, A2 dùng AT2; request refresh tiếp theo của bất kỳ tab nào gửi cookie hiện hành R3 khi được cấp khóa. Rotation refresh không tự thu hồi access AT1 đã cấp; access vẫn có thể hợp lệ tới expiresAt theo thiết kế stateless hiện tại.
- Dùng lại AT1 qua kênh liên tab là một phương án khác, không phải hướng đang đề xuất; hiện chưa thêm giao thức chia sẻ access. Ví dụ này làm rõ đề xuất, không tự ghi xác nhận câu hỏi của người học thành duyệt phương án.

### Xác nhận hướng đa tab và bước logout tiếp theo

- Sau ví dụ AT1/AT2 và R1/R2/R3, người học tự tóm tắt “mỗi tab sẽ có một AT riêng còn R là chung”, rồi yêu cầu “Ok tiếp tục đi”. Ghi nhận đúng mô hình và đồng ý tiếp tục theo hướng Web Locks/refresh nối tiếp, access riêng; chưa coi đã duyệt toàn bộ failure/fallback/concurrency DB.
- Đề xuất logout phải áp dụng cho mọi tab đang dùng cùng nhóm phiên/cookie trong cùng browser context. Không nhầm với trình duyệt/profile khác đăng nhập thành nhóm phiên khác, vốn giữ nguyên theo phạm vi logout hiện tại.
- Refresh/logout dùng chung tên Web Lock auth để không chạy song song giữa các tab hợp tác. Logout chờ refresh đã gửi hoàn tất nếu refresh giữ khóa trước; sau đó dùng cookie hiện hành để thu hồi nhóm và xóa cookie.
- Tab chủ động logout dừng tự refresh/retry và dọn access trong bộ nhớ; đề xuất dùng BroadcastChannel thông báo logout để các tab đang mở dọn access/trạng thái, hủy nhu cầu refresh đang chờ. Sau khi lấy khóa, request chờ phải kiểm tra lại trạng thái logout trước khi gửi; callback/response cũ không được khôi phục đăng nhập sau logout.
- BroadcastChannel chỉ gửi sự kiện đăng xuất, không truyền refresh/access token. Nó là thông báo giữa các tab đang tham gia, không phải cơ chế thu hồi server; race/sự kiện bỏ lỡ/tab bị treo cần cơ chế phiên bản trạng thái và kiểm chứng riêng trước triển khai. Chưa chốt giao thức chi tiết hoặc claim an toàn mọi interleaving.
- Nếu logout lỗi mạng/DB, FE có thể dọn trạng thái local nhưng không được tuyên bố đã thu hồi refresh thành công ở server. Quy tắc access đã cấp vẫn có thể hợp lệ tới expiresAt không thay đổi.
- Đây là đề xuất hành vi logout đa tab để review, chưa duyệt/triển khai/test. Nguồn BroadcastChannel đã đọc ở bước trước: https://developer.mozilla.org/en-US/docs/Web/API/Broadcast_Channel_API.

## Refresh/logout thất bại — bảng xử lý lỗi đã duyệt, giao thức đa tab/response cũ còn mở

### Timeout/mất phản hồi refresh — đã duyệt 2026-11-04

- Người học xác nhận “Ok duyệt.” cho tình huống frontend không nhận được kết quả refresh: không tự retry, dừng request đang chờ access mới và yêu cầu đăng nhập lại khi kết nối ổn định.
- Thông báo đề xuất đã duyệt: “Không thể xác minh phiên. Vui lòng đăng nhập lại khi kết nối ổn định.” Không khẳng định phiên hết hạn, transaction đã rollback hoặc server đã thu hồi phiên.
- Lý do: server có thể đã commit rotation R1 → R2 nhưng frontend không nhận được phản hồi/cookie; gửi lại R1 có thể kích hoạt reuse. Đây là chọn chính sách, chưa có demo/test.
- Chỉ chốt timeout/mất phản hồi; 5xx/401/403/logout lỗi và giao thức đa tab/response cũ còn review riêng. Không tự coi timeout/abort đã hủy request trên server. Cơ chế chặn refresh qua reload/đa tab và phối hợp đăng nhập mới vẫn phải hoàn thiện trước code.

### Refresh hết hạn — hành vi đã duyệt theo yêu cầu 2026-11-04

- Người học yêu cầu refresh trả 401 kèm code hết hạn thì frontend cho đăng nhập lại, ví dụ sau 7 ngày liên tục không sử dụng app. Mentor cụ thể hóa code REFRESH_TOKEN_EXPIRED theo quy ước code tiếng Anh hiện hành.
- Backend xác định token đã hết hạn, trả HTTP 401, body {success:false,error:{code:"REFRESH_TOKEN_EXPIRED",message:"Refresh token đã hết hạn. Vui lòng đăng nhập lại."}}. Frontend yêu cầu đăng nhập lại, không gọi refresh lặp để chữa lỗi hết hạn.
- Hạn trượt tính từ lần cấp token gần nhất sau đăng nhập/refresh thành công. Không có refresh thành công trong 7 ngày thì token hết hạn; chỉ mở app/gọi API bằng AT không tự sửa expiresAt.
- Nhánh hết hạn dùng mã riêng; token sai/thu hồi/reuse vẫn theo mã UNAUTHENTICATED và hành vi backend đã duyệt. FE cho token sai/thu hồi được chốt riêng bên dưới; giao thức đa tab/response cũ còn review. Không suy ra đã có code/test.

### Token sai/thu hồi — xử lý FE đã duyệt 2026-11-04

- Người học xác nhận “Ok.” cho refresh trả 401/UNAUTHENTICATED khi token sai hoặc đã thu hồi: frontend yêu cầu đăng nhập lại, thông báo “Không thể gia hạn phiên”, không gọi refresh lặp để xử lý chính 401 này.
- Giữ mã REFRESH_TOKEN_EXPIRED riêng cho nhánh hết hạn đã chốt. Không suy ra mọi lỗi 401 có nghĩa là hết hạn hoặc đã thu hồi cả nhóm. Giao thức đa tab/response cũ, xóa cookie và chi tiết dọn trạng thái vẫn cần hoàn thiện; chưa có code/test.

### 403, refresh 5xx và logout lỗi — đã duyệt 2026-11-04

Người học xác nhận “Ok.” cho bảng xử lý:

| Tình huống | Hành vi frontend đã duyệt |
| --- | --- |
| Refresh/logout 403/CSRF_VALIDATION_FAILED | Báo không thực hiện được yêu cầu; không tự refresh để chữa lỗi, không báo token hết hạn |
| Refresh 5xx | Không tự retry; báo không thể xác minh phiên, yêu cầu đăng nhập lại khi dịch vụ ổn định |
| Logout lỗi mạng/5xx | Dọn AT phía frontend, dừng tự refresh; báo chưa xác nhận đăng xuất trên server, cho người dùng thử logout lại |

Logout có thể gửi lại theo hợp đồng lặp đã duyệt; không suy ra refresh cũng retry được vì lần trước có thể đã commit rotation. Chưa có code/test. Cơ chế áp dụng qua nhiều tab/reload và response cũ còn phải hoàn thiện riêng, không tự coi bảng lỗi đã giải quyết mọi race.

### Phân biệt phản hồi xác định với kết quả chưa biết

- Refresh trả 401/UNAUTHENTICATED: server từ chối gia hạn theo hợp đồng. FE dừng refresh và request đang chờ, dọn access/trạng thái đăng nhập, thông báo các tab cùng phiên cần đăng nhập lại; không tự retry refresh. Không tự suy ra mọi 401 đã thu hồi cả nhóm (thu hồi nhóm là hành vi riêng khi reuse).
- Refresh lỗi mạng/timeout và 5xx đã duyệt: không kết luận token hết hạn hoặc transaction chưa commit. Ví dụ server đã rotate R1 thành R2 nhưng client không nhận response; tự gửi lại R1 có thể kích hoạt reuse. Bản đầu không tự retry refresh, dừng luồng request đang chờ và yêu cầu đăng nhập lại khi kết nối ổn định, kèm thông báo lỗi kết nối/xác minh phiên thay vì khẳng định phiên hết hạn.
- Refresh/logout trả 403/CSRF_VALIDATION_FAILED: không refresh tiếp để chữa lỗi. Thông báo không thực hiện được và kiểm tra cấu hình nguồn/header khi phát triển; không suy ra tài khoản bị chặn hoặc refresh hết hạn. Lớp CSRF từ chối trước thay đổi phiên/cookie.
- Logout nhận 204: xác nhận server đã xử lý theo hợp đồng, dọn trạng thái FE/các tab. Logout lỗi mạng/5xx: FE vẫn có thể dọn access local và dừng tự refresh, nhưng hiển thị chưa xác nhận đăng xuất trên server; cho phép người dùng gửi lại logout khi có mạng, vì logout đã chốt hành vi lặp. Không báo “đã thu hồi phiên” chỉ từ việc dọn FE.

### Ranh giới cần giữ khi triển khai

- Dọn bộ nhớ FE không xóa được cookie HttpOnly. Việc chặn tự refresh sau lỗi/ý định logout cần tồn tại qua reload và giữa tab; giao thức trạng thái không chứa token, đối chiếu thế hệ đăng nhập và khôi phục đăng nhập mới phải thiết kế trước code, không giả định BroadcastChannel một lần là đủ.
- Request đã gửi nhưng timeout/abort có thể vẫn chạy trên server. Không bắt đầu luồng đăng nhập mới hoặc cho response auth cũ ghi đè phiên mới mà chưa có quy tắc điều phối/đối chiếu; timeout không phải bằng chứng request server đã kết thúc. Chi tiết này còn thiết kế cùng khóa nhóm phiên và xử lý response cũ.
- Không tự retry thao tác tạo booking sau lỗi mạng/5xx. Retry request nghiệp vụ sau refresh thành công chỉ theo quy tắc lỗi xác thực trước xử lý và tối đa một lần đã chốt.
- Bảng hành vi lỗi đã duyệt theo các mục cụ thể; giao thức đa tab/response cũ chưa hoàn tất và chưa triển khai/test; giữ chính sách reuse nghiêm ngặt, chưa thêm grace period.

## Nhịp học auth — yêu cầu người học đã lưu

- Người học thấy phần lỗi refresh/logout rối, muốn học thêm và quan sát trực tiếp khi code sản phẩm. Đồng ý dời phần giải thích chi tiết và review hiểu sang lúc triển khai auth/FE liên quan; không yêu cầu học thuộc bảng lỗi để tiếp tục phần thiết kế độc lập.
- Bảng lỗi timeout/401/403/5xx và logout lỗi đã duyệt; cơ chế đa tab/reload/response cũ còn mở, không tự bỏ yêu cầu an toàn hoặc coi concurrency đã giải quyết. Trước khi triển khai các luồng đó, phải hoàn thiện quyết định còn mở và kiểm chứng browser/DB phù hợp.
- Khi code: chạy luồng login → API hết hạn → refresh thành công trước; tiếp đến mở hai tab, rồi mô phỏng lỗi mạng/logout trong lúc refresh. Mỗi lần chỉ thêm một tình huống, giải thích trạng thái FE/cookie/DB bằng dữ liệu test không lộ token. Không thêm giao thức phức tạp trước khi người học quan sát được vấn đề cụ thể.
- FB-002 vẫn IN_PROGRESS. Điểm bàn giao hiện hành ở PROGRESS; ERD cốt lõi đã tổng hợp trong data-model.md. Chưa khởi tạo app hoặc tự đánh dấu nghiệm thu thiết kế hoàn tất.
