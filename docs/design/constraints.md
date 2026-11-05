# ID, khóa ngoại và kiểu cột

[Chỉ mục thiết kế](../DESIGN.md) · Cập nhật 2026-11-04 · Chưa có schema/migration/test.

## Đã duyệt: UUID và hành vi khóa ngoại

## Kiểu ID — đã duyệt UUID 2026-11-04

- Triển khai User ngày 2026-11-05: người học duyệt `@default(uuid()) @db.Uuid`, Prisma sinh ID khi create; insert SQL trực tiếp phải cung cấp UUID. Đã ghi model User vào schema, chưa tạo/ap dụng migration. Cơ chế sinh ID các model còn lại sẽ đối chiếu khi triển khai.
- Người học xác nhận “Ok UUID.”, chốt UUID. Các ví dụ B1/C1/U1 trước đây là nhãn minh họa, không phải định dạng request thật. Dùng UUID nhất quán cho PK của User/Branch/Court/Booking/BookingSlot/BookingBlockHistory/RefreshToken và các FK tương ứng.
- PostgreSQL dùng uuid; Prisma biểu diễn String với @db.Uuid; API nhận/trả chuỗi UUID. Có thể dùng @default(uuid()) để Prisma tạo UUID khi create; đây là default ở Prisma, không tự trở thành default sinh ID khi insert SQL trực tiếp. Chốt cơ chế sinh cụ thể/migration cùng môi trường thực tế trước triển khai; chưa cần dependency UUID riêng.
- So sánh để review: số nguyên tự tăng ngắn/dễ đọc; UUID dài hơn nhưng không thể hiện thứ tự tăng 1/2/3 và thuận tiện khi muốn cấp ID ngẫu nhiên. Cả hai đều đủ dùng cho quy mô app; chọn UUID là khuyến nghị nhất quán, không yêu cầu phân tán hoặc giả định số tự tăng không an toàn.
- ID khó đoán không thay thế xác thực/kiểm tra chủ sở hữu; query Booking của khách vẫn ràng buộc userId từ JWT. UUID cũng không dùng làm refresh token: token ngẫu nhiên/hash vẫn theo thiết kế auth riêng.
- Theo lựa chọn UUID: input ID sai định dạng trả 400/VALIDATION_ERROR, UUID hợp lệ nhưng không tìm thấy trả 404 theo hợp đồng endpoint đã chốt; bộ lọc danh sách có thể trả data rỗng như hợp đồng riêng. Các placeholder trong ví dụ không phải ID thật; chưa có schema được triển khai.
- Nguồn đã đọc: https://www.prisma.io/docs/orm/v7/prisma-schema/data-model/unsupported-database-features (Prisma-level uuid() so với default DB). Chưa tạo schema/chạy migration/test. Phiên bản dependency của project chưa chốt/cài.

## Tổng hợp ON DELETE đã duyệt — 2026-11-04

| Bảng/trường tham chiếu | Bảng/trường được tham chiếu | ON DELETE |
| --- | --- | --- |
| Court.branchId | Branch.id | RESTRICT |
| Booking.userId | User.id | RESTRICT |
| Booking.courtId | Court.id | RESTRICT |
| Booking.cancelledById | User.id | RESTRICT |
| BookingSlot(bookingId,courtId) | Booking(id,courtId) | RESTRICT |
| BookingSlot.courtId | Court.id | RESTRICT |
| BookingBlockHistory.userId | User.id | RESTRICT |
| BookingBlockHistory.actorId | User.id | RESTRICT |
| RefreshToken.userId | User.id | CASCADE |

Đây là tổng hợp các FK hiện có, không phải bằng chứng schema/migration đã chạy. FK kép bảo đảm slot khớp sân của booking; UNIQUE Booking(id,courtId) cần triển khai cùng FK. familyId hiện là mã nhóm phiên, chưa có bảng nhóm riêng hoặc FK mới để tự thêm vào bảng này.

## ON UPDATE và tính bất biến của ID — đã duyệt 2026-11-04

- Người học xác nhận “Ok..”: UUID id của bản ghi được cấp một lần, không có API sửa id. Dùng ON UPDATE RESTRICT cho các FK trong bảng tổng hợp để từ chối đổi khóa được tham chiếu khi còn bản ghi con; không tự cập nhật dây chuyền ID.
- ON UPDATE RESTRICT chỉ bảo vệ các giá trị khóa được FK tham chiếu, không cấm sửa tên/giá/trạng thái. Với FK kép Booking(id,courtId), thay đổi giá trị cặp được tham chiếu khi còn slot cũng bị chặn; app vốn không cho đổi sân của booking.
- Ràng buộc FK không tự cấm đổi ID của bản ghi chưa có tham chiếu; tính bất biến vẫn là hợp đồng app, không tuyên bố RESTRICT khóa toàn bộ mọi thay đổi ID. Chưa đề xuất thêm trigger cho mục đích này.
- Đã duyệt ON UPDATE RESTRICT cho chín FK trong bảng tổng hợp; chưa triển khai/test. Tiếp tục kiểu cột thời gian/ràng buộc và nghiệm thu thiết kế, không tự đánh dấu FB-002 hoàn tất chỉ vì xong hành vi FK.

## Ý nghĩa và phạm vi

- RESTRICT từ chối xóa khi còn bản ghi tham chiếu; không cấm xóa tuyệt đối nếu người vận hành đã xóa hết tham chiếu. API bản đầu không cung cấp xóa sân, User hoặc lịch sử.
- Court ngừng nhận đặt dùng isActive=false; khách chỉ thấy sân hoạt động trong danh sách, admin có bộ lọc/nhãn. GET /admin/courts bỏ isActive vẫn trả tất cả. Không tự hủy booking tương lai; admin hủy riêng nếu cần.
- Hủy Booking cập nhật status/thông tin hủy và releasedAt mọi slot trong cùng transaction; không DELETE để hủy.
- Booking.cancelledById có thể null khi chưa hủy; khi đã có người hủy vẫn giữ FK đó bằng RESTRICT.
- CASCADE RefreshToken → User chỉ áp dụng khi DELETE User thành công, không vượt RESTRICT của lịch sử; nếu lệnh DELETE bị từ chối thì không có phần xóa token riêng được commit. Logout/reuse vẫn thu hồi nhóm phiên, không xóa User hoặc xóa dấu vết hash token cũ trước hạn.
- Không thêm chức năng xóa tài khoản/soft delete/khóa đăng nhập từ các lựa chọn FK. Nếu sau này cần xóa tài khoản, phải chốt yêu cầu giữ lịch sử/ẩn danh/xóa vật lý và xử lý phiên rõ; xem [thảo luận nguyên bản](../archive/2026-11-04-before-reorganization/docs/DESIGN.md).
- Ràng buộc DB chống trùng/giá/thời gian không được thay bằng kiểm tra FE. Slot: xem [SQL partial unique index và FK kép](booking-slots.md). Giá nguyên VND/trần Int: xem [mô hình](data-model.md).

<a id="time-type"></a>

## Kiểu cột thời gian — đã duyệt 2026-11-04

- Giữ quy tắc đã chốt: lưu thời điểm theo UTC, API trả ISO 8601 UTC với Z; hiển thị và tính quy tắc ngày/giờ theo Asia/Ho_Chi_Minh. Đã duyệt dùng PostgreSQL timestamptz(3) cho mọi trường biểu diễn thời điểm, tức timestamp with time zone với độ chính xác 3 chữ số phần lẻ giây.
- Áp dụng cho createdAt/updatedAt, Booking.startAt/endAt/cancelledAt, BookingSlot.startAt/releasedAt, BookingBlockHistory.createdAt, RefreshToken.createdAt/expiresAt/usedAt/revokedAt ở những bảng có các trường đó. Giữ nullable/required theo thiết kế, không thêm trường mới chỉ vì danh sách này.
- timestamptz biểu diễn một thời điểm, lưu nội bộ UTC, không giữ nguyên tên múi giờ hoặc offset đầu vào; khi query bằng công cụ DB có thể hiển thị theo timezone phiên kết nối. Chuẩn hóa timezone kết nối UTC khi triển khai để dễ quan sát, không nhầm đó là điều kiện duy nhất để lưu đúng.
- Ví dụ 2026-11-06T19:00:00+07:00 và 2026-11-06T12:00:00Z là cùng thời điểm. Không lưu mỗi chuỗi 19:00 hoặc tách date/time thành nguồn chuẩn của booking.
- Kiểu cột không tự bảo vệ mốc slot 00/30, giờ hoạt động/cửa sổ ngày hoặc hạn hủy; vẫn cần validation/ràng buộc tương ứng. Độ chính xác cột không thay cho validation input trước khi làm tròn/lưu. Không cộng thêm 7 giờ trước khi ghi một Date đã biểu diễn đúng instant.
- Người học xác nhận “Ok.” sau giải thích về UTC/giờ Việt Nam và tránh cộng 7 giờ hai lần. Chốt đề xuất timestamptz(3) ở trên; đây là đồng ý lựa chọn, chưa phải bằng chứng tự giải thích hoặc kiểm chứng qua code/demo.
- Ánh xạ native type Prisma và cách triển khai timestamps sẽ xác nhận với phiên bản project khi triển khai. Chưa có schema/migration/DB để kiểm thử.
- Nguồn đã đọc: https://www.postgresql.org/docs/current/datatype-datetime.html mục Time Stamps và precision. Kiểm thử sau này cần round-trip cùng instant từ hai offset và kiểm tra giờ Việt Nam/UTC ở biên ngày; đây là kế hoạch, chưa chạy.

## Required/nullable/default cho thời gian — đã duyệt 2026-11-04

Người học xác nhận “Ok.” cho bảng đề xuất dưới đây. Đây là quyết định thiết kế, chưa phải bằng chứng tự giải thích hoặc schema/test đã chạy. Mọi trường dùng timestamptz(3); chỉ áp dụng tại bảng đã có trường đó, không thêm cột mới.

| Trường | Cho phép null | Giá trị khi tạo / cập nhật |
| --- | --- | --- |
| createdAt tại các bảng đã có trường này | Không | Database mặc định thời gian hiện tại; giữ nguyên về sau |
| User/Branch/Court.updatedAt | Không | Backend/Prisma điền ngay khi tạo và cập nhật khi sửa bản ghi; chưa dùng trigger DB |
| Booking.startAt | Không | Khách chọn, backend kiểm tra; không có default thời gian hiện tại |
| Booking.endAt | Không | Backend tính startAt + thời lượng; không có default thời gian hiện tại |
| BookingSlot.startAt | Không | Backend sinh đủ các mốc 30 phút của booking; không có default thời gian hiện tại |
| Booking.cancelledAt | Có | Ban đầu null; backend điền khi hủy thành công |
| BookingSlot.releasedAt | Có | Ban đầu null; khi hủy điền cùng thời điểm với cancelledAt cho mọi slot, trong cùng transaction |
| RefreshToken.expiresAt | Không | Backend tính hạn của token: lúc đăng nhập hoặc refresh thành công + 7 ngày; rotation không sửa expiresAt của token cũ (quyết định hạn trượt thay hạn cố định ngày 2026-11-04) |
| RefreshToken.usedAt | Có | Ban đầu null; điền khi token được đổi thành công |
| RefreshToken.revokedAt | Có | Ban đầu null; điền khi thu hồi |

- Backend quản lý các timestamp hệ thống; không dùng giá trị frontend gửi cho createdAt/updatedAt hoặc thời điểm hủy/thu hồi. Không dùng ngày giả cho sự kiện chưa xảy ra.
- Bảng này không chốt thêm schema nhóm phiên hoặc cơ chế khóa refresh còn mở. Cách ánh xạ Prisma/SQL cụ thể kiểm tra khi triển khai.

## Ràng buộc thời gian/trạng thái — đã duyệt 2026-11-04

Người học đã duyệt hai quy tắc đầu, sau đó xác nhận “Ok.” cho nhóm đề xuất còn lại. Đây là quyết định thiết kế, chưa có SQL migration/test và chưa chứng minh mức hiểu qua demo.

### CHECK tại database, kèm validation backend

- Booking.endAt > Booking.startAt; thời lượng chỉ 30/60/90/120 phút.
- Booking.startAt và BookingSlot.startAt đúng mốc phút 00/30, giây và phần lẻ giây bằng 0. endAt suy ra từ startAt và thời lượng hợp lệ.
- Khoảng Booking nằm trong cùng ngày Asia/Ho_Chi_Minh, bắt đầu không trước 06:00 và kết thúc không sau 22:00. Kết thúc đúng 22:00 hợp lệ. CHECK phải dùng múi giờ nghiệp vụ tường minh, không phụ thuộc timezone phiên kết nối.
- status=CONFIRMED: cancelledAt và cancelledById đều null.
- status=CANCELLED: cancelledAt và cancelledById đều có giá trị.

### Transaction và kiểm tra lúc đặt

- Hủy cập nhật status, cancelledAt/cancelledById và releasedAt của toàn bộ slot cùng transaction; releasedAt dùng cùng thời điểm cancelledAt. CHECK thông thường không tự đồng bộ nhiều bản ghi/bảng.
- Backend kiểm tra startAt ở tương lai khi đặt; không dùng CHECK startAt > now() để diễn tả điều kiện chỉ xét lúc đặt.
- Không suy ra các quy tắc này đã bảo đảm đủ slot: backend vẫn phải sinh đúng dãy slot và database bảo vệ xung đột bằng partial unique index đã chọn.

## Required/nullable/default ngoài thời gian — đã duyệt 2026-11-04

Người học xác nhận “Ok duyệt.” cho bảng dưới đây và bốn default tại database. Đây là quyết định thiết kế, chưa có schema/migration/test hoặc bằng chứng tự giải thích của người học. Các trường thời gian giữ theo mục đã duyệt phía trên.

| Bảng | Trường NOT NULL, không có default | Default tại database (NOT NULL) | Trường nullable ngoài thời gian |
| --- | --- | --- | --- |
| User | name, email, passwordHash | role=CUSTOMER; isBookingBlocked=false | Không có |
| Branch | name, address | Không có | Không có |
| Court | branchId, name, playersPerTeam, pricePerSlot | isActive=true | Không có |
| Booking | userId, courtId, pricePerSlot, totalPrice | status=CONFIRMED | cancelledById, ban đầu null; phải có khi CANCELLED |
| BookingSlot | bookingId, courtId | Không có | Không có |
| BookingBlockHistory | userId, actorId, action, reason | Không có | Không có |
| RefreshToken | userId, familyId, tokenHash | Không có | Không có |

- id tại cả bảy bảng là UUID NOT NULL, hệ thống tự sinh; cơ chế sinh cụ thể Prisma/database còn xác nhận khi triển khai. Không suy ra familyId có default UUID cho mỗi token: backend tạo nhóm lúc đăng nhập và giữ nguyên qua rotation.
- Không có default nghĩa là backend phải cung cấp giá trị hợp lệ, không mặc định loại sân/giá/lý do. Booking.pricePerSlot là snapshot từ Court, totalPrice do backend tính trong transaction.
- Đăng ký công khai chỉ tạo CUSTOMER và không nhận role/isBookingBlocked từ body; tạo admin phải có chủ đích. Court mặc định hoạt động nhưng admin có thể chọn false khi tạo.
- Backend lấy Booking.userId và BookingBlockHistory.actorId từ danh tính xác thực. action là BLOCK/UNBLOCK, reason bắt buộc theo validation đã duyệt.
- Bộ trường RefreshToken này không đồng nghĩa đã duyệt đầy đủ cấu trúc nhóm phiên hoặc cơ chế khóa/thu hồi còn mở trong auth.md.

## CHECK/enum và unique — đã duyệt 2026-11-04

Sau khi được đề xuất chốt hai nhóm bảo vệ dữ liệu và giữ index truy vấn ở mức dự kiến, người học xác nhận “Ok duyệt.”. Không coi là đã duyệt triển khai toàn bộ index truy vấn hoặc đã hiểu index qua demo.

| Trường | Ràng buộc đã duyệt |
| --- | --- |
| Court.pricePerSlot, Booking.pricePerSlot | integer, CHECK từ 1 đến 536870911 |
| Booking.totalPrice | integer, CHECK từ 1 đến 2147483644 và bằng giá snapshot × số slot suy ra từ thời lượng hợp lệ |
| Court.playersPerTeam | CHECK chỉ 5/7/11 |
| User.role | Enum CUSTOMER/ADMIN |
| Booking.status | Enum CONFIRMED/CANCELLED |
| BookingBlockHistory.action | Enum BLOCK/UNBLOCK |

- CHECK phép nhân tổng phải dùng toán hạng đủ rộng để không tràn trước khi từ chối dữ liệu sai; xem data-model.md. Chưa có SQL/test.
- UNIQUE User.email trên email lưu đã trim/chuyển chữ thường; backend dùng cùng chuẩn hóa khi đăng ký/đăng nhập/seed.
- Unique index tên sân theo branchId và biểu thức tên chuẩn hóa: trim/gộp khoảng trắng, không phân biệt hoa/thường, vẫn phân biệt dấu; áp dụng cả sân vô hiệu hóa. Giữ name hiển thị, không thêm cột khóa tên. Biểu thức SQL/collation cụ thể phải kiểm chứng cùng validation khi triển khai.
- Bản triển khai chuẩn bị 2026-11-05: migration `20261105073601_create_branch_court` dùng regexp_replace với tập whitespace tương ứng JavaScript /\s+/gu, btrim, lower với collation PostgreSQL 17 `pg_c_utf8`, rồi so sánh key bằng `C`. Backend khi viết phải dùng cùng quy tắc khoảng trắng; chưa có validation backend. Sáu SELECT trên PostgreSQL 17.11 xác nhận tiếng Việt/hoa-thường/phân biệt dấu/tab/newline/Unicode whitespace; chưa kiểm chứng ràng buộc bằng insert hoặc áp dụng migration này. Không coi unique index biểu thức là index được Prisma schema mô tả đầy đủ; giữ SQL migration khi sửa schema.
- UNIQUE RefreshToken.tokenHash.
- UNIQUE BookingSlot(bookingId,startAt).
- Partial unique index BookingSlot(courtId,startAt) WHERE releasedAt IS NULL.
- UNIQUE Booking(id,courtId) phục vụ FK kép từ BookingSlot.
- Không unique tên User hoặc tên Branch theo phạm vi hiện tại.

## Index truy vấn — dự kiến, chưa duyệt tạo từng index

Khi có query/schema/migration thực tế, demo trước/sau cho người học rồi quyết định từng index. Không tạo trùng index đã được PK/unique hỗ trợ. Chưa có dữ liệu hoặc kế hoạch thực thi để đánh giá hiệu năng.

| Index dự kiến | Query phục vụ |
| --- | --- |
| Booking(userId,createdAt DESC,id DESC) | Danh sách booking cá nhân |
| Booking(userId,status,startAt) | Đếm booking tương lai chưa hủy theo khách |
| Booking(createdAt DESC,id DESC) | Danh sách booking admin |
| Booking(startAt) | Lọc theo ngày |
| Booking(courtId,startAt) | Lịch theo sân/ngày |
| BookingBlockHistory(userId,createdAt DESC,id DESC) | Lịch sử chặn/mở của khách |
| RefreshToken(familyId) | Tra/thu hồi theo nhóm phiên |
| RefreshToken(userId) | Tra theo tài khoản |

## Kiểu cột ngoài thời gian — đã duyệt 2026-11-04

Người học xác nhận “Ok duyệt.” cho bảng kiểu cột sau trao đổi integer + CHECK so với enum.

| Nhóm trường | Kiểu PostgreSQL |
| --- | --- |
| Tên, email, địa chỉ, reason | text; giữ validation/giới hạn từng trường đã chốt, không tự bỏ giới hạn vì dùng text |
| passwordHash, tokenHash | text; lưu hash, không lưu mật khẩu/token rõ |
| isActive, isBookingBlocked | boolean |
| RefreshToken.familyId | uuid; backend tạo nhóm lúc đăng nhập, giữ nguyên qua rotation |
| Court.playersPerTeam | integer kèm CHECK IN (5,7,11) đã duyệt |

ID/FK uuid, tiền integer, thời điểm timestamptz(3) và role/status/action enum giữ theo quyết định đã duyệt. Không suy ra cấu trúc/khóa nhóm phiên đã hoàn tất. Chưa có schema/migration/test.

## Còn phải hoàn thiện

- Cập nhật sau kiểm chứng 2026-11-05: đã áp dụng migration Branch/Court vào DB local bằng migrate dev, exit 0. Truy vấn catalog xác nhận PK/FK RESTRICT, hai CHECK và unique tên chuẩn hóa đúng. Branch/Court còn 0 bản ghi; chưa seed/validation backend, chưa nâng mức hiểu người học từ code chạy.
- Kiểm chứng SQL Branch/Court ngày 2026-11-05: 15 nhóm kiểm tra CHECK/FK/unique/default trên PostgreSQL test riêng đạt, dữ liệu thử rollback; [bằng chứng và giới hạn](../BRANCH_COURT_TEST.md). Chưa áp dụng migration Branch/Court vào DB phát triển, chưa có validation backend hoặc bằng chứng người học đã giải thích index.
- Hoàn thiện nhóm phiên/khóa auth cùng ERD tổng hợp; cụ thể hóa SQL cho CHECK/enum/unique đã duyệt, kiểm chứng biểu thức unique tên sân và đánh giá index dự kiến khi có query; không suy ra schema xong từ bảng FK.
- Cơ chế sinh UUID, triển khai default timestamps và ánh xạ Prisma sẽ xác nhận khi triển khai; chưa có dependency/version được cài.
- Kiểm chứng FK và CHECK bằng migration trên PostgreSQL test riêng; các ví dụ hiện tại không phải kết quả test.
