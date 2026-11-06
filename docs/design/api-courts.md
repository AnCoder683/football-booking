# API chi nhánh và sân

[Chỉ mục thiết kế](../DESIGN.md) · Cập nhật 2026-11-04 · Chưa có code/migration/test.

Các hợp đồng và validation bên dưới đã duyệt. Khách chỉ xem danh sách sân hoạt động; admin bỏ bộ lọc isActive thì xem tất cả. Không đổi mặc định API trong lần tổ chức tài liệu này.

## API danh sách chi nhánh — GET /branches

### Hợp đồng — đã duyệt 2026-11-03

- Cho phép xem khi chưa đăng nhập; thao tác đặt sân vẫn yêu cầu CUSTOMER đã xác thực theo hợp đồng riêng.
- Trả HTTP 200 với success=true, message="Lấy danh sách chi nhánh thành công", data array; mỗi phần tử chỉ gồm id, name, address.
- Không có chi nhánh trả data=[], không phải 404. Sắp xếp name ASC, id ASC.
- Bản đầu trả toàn bộ chi nhánh, chưa phân trang theo phạm vi một hệ thống nhỏ. Branch chưa có isActive theo thiết kế đã chốt; không tự thêm lọc chi nhánh đang hoạt động hoặc ẩn chi nhánh không có sân hoạt động.

Người học xác nhận “OK duyệt.”. Đây là hợp đồng thiết kế, chưa triển khai/test.

## Loại sân — trường và cách lưu đã duyệt 2026-11-03

Người học yêu cầu Court có loại 5/7/11, biểu thị số người mỗi đội. Người học xác nhận “Ok lưu cách này đi.”, chốt trường playersPerTeam và cách lưu trực tiếp trên Court; đã cập nhật bộ trường Court.

playersPerTeam: số nguyên bắt buộc, chỉ nhận 5, 7 hoặc 11, không tự mặc định; admin khai báo khi tạo/cập nhật sân. Lưu trực tiếp trên Court, không cần bảng loại sân riêng. Khi triển khai bảo vệ bằng validation backend và ràng buộc database. Thông tin sân hiển thị playersPerTeam để FE trình bày loại. Đề xuất bổ sung trường vào các object court lồng trong response booking sẽ đồng bộ khi rà soát hợp đồng API; chưa yêu cầu snapshot loại trên Booking.

Query playersPerTeam và hợp đồng GET /courts đã duyệt tại mục bên dưới. Giá vẫn theo Court.pricePerSlot, không suy giá từ loại; chưa thêm chiều dài/rộng hoặc mô hình sân lớn chia sân nhỏ/chiếm chỗ liên sân. Chưa có schema/migration/code/test.

## API danh sách sân — GET /courts (đã duyệt 2026-11-03)

Triển khai local 2026-11-05: đã có GET /courts và frontend đọc danh sách, bộ test API đã gỡ theo yêu cầu ngày 2026-11-06; kết quả cũ chỉ là bằng chứng lịch sử tại PROGRESS. Đã kiểm tra HTTP trực tiếp/qua Vite trả dữ liệu seed; chưa kiểm chứng trình duyệt do browser host unavailable. Bộ lọc hiện có ở API; UI mới phân trang. Xem [cách chạy và giới hạn](../../README.md#api-danh-sách-sân-và-kết-nối-frontend). Các API quản trị/chi tiết/giờ trống trong chương này vẫn chưa triển khai.

Người học xác nhận “Ok duyệt.” với toàn bộ hợp đồng danh sách sân và bộ lọc playersPerTeam sau khi đã chốt trường trên Court.

- Công khai, chỉ trả Court có isActive=true. API quản trị danh sách sân vô hiệu hóa thiết kế riêng.
- Query tùy chọn branchId và playersPerTeam, kết hợp AND. Không có branchId thì xem sân hoạt động toàn hệ thống; không có playersPerTeam thì không lọc loại. playersPerTeam chỉ nhận biểu diễn query của 5/7/11, parse/validate rõ ràng vì query HTTP là chuỗi. Không tự mặc định loại sân.
- Phân trang page=1/limit=10 mặc định, limit tối đa 50; page/limit số nguyên dương. Sắp xếp name ASC, id ASC.
- Mỗi phần tử data gồm id, name, playersPerTeam, pricePerSlot, isActive, branch {id, name, address}. Giá là giá niêm yết hiện hành mỗi 30 phút; không phải báo giá giữ giá hoặc dữ liệu giờ trống.
- Thành công HTTP 200, success=true, message="Lấy danh sách sân thành công", data array, meta {page, limit, total, totalPages}; total chỉ đếm sân hoạt động sau bộ lọc.
- Query sai định dạng/giá trị trả 400/VALIDATION_ERROR với details tương ứng. Không khớp bộ lọc (kể cả branchId đúng định dạng nhưng không tồn tại), không có sân hoạt động hoặc trang vượt phạm vi đều trả 200/data=[] và meta tương ứng.
- Xem giờ trống theo ngày qua API riêng, chưa thiết kế trong mục này. Chưa triển khai/test.

## API chi tiết sân — GET /courts/:courtId

### Hợp đồng — đã duyệt 2026-11-03

- Công khai. Thành công HTTP 200, success=true, message="Lấy thông tin sân thành công", data object dùng bộ trường sân như GET /courts: id, name, playersPerTeam, pricePerSlot, isActive, branch {id, name, address}.
- courtId sai định dạng trả 400/VALIDATION_ERROR; đúng định dạng nhưng không tồn tại trả 404/COURT_NOT_FOUND. Kiểu ID đã chốt UUID ngày 2026-11-04.
- Sân vô hiệu hóa vẫn trả 200/isActive=false để khách mở đường dẫn cũ biết sân đã ngừng nhận đặt; không đồng nghĩa được tạo booking. POST tạo booking vẫn kiểm tra trạng thái hiện hành và từ chối 409/COURT_INACTIVE.
- Chỉ trả thông tin sân, không gộp giờ trống theo ngày; API availability thiết kế riêng.

Người học xác nhận “Ok duyệt.”. Chưa triển khai/test.

## API giờ trống — hợp đồng đã duyệt 2026-11-03

### Luồng chọn giờ — đã duyệt 2026-11-03

Khách chọn sân và ngày → chọn thời lượng 30/60/90/120 phút → backend lọc các giờ bắt đầu đủ toàn bộ thời lượng trống liên tục → khách chọn giờ và xác nhận đặt. Giao diện có thể chỉ hiển thị giờ hợp lệ hoặc vô hiệu hóa giờ không hợp lệ. Backend kiểm tra lại khi tạo booking vì availability không giữ chỗ.

Người học diễn giải luồng chọn thời lượng trước rồi chọn giờ và xác nhận “đúng rồi” sau khi mentor làm rõ hệ thống lọc trước. Ghi nhận duyệt luồng này; response availableStarts và các lỗi đã được duyệt riêng bên dưới; endpoint/quyền công khai và các trường response bao ngoài đã được duyệt sau đó bằng phản hồi “Oke.”. Chưa triển khai/test.

### Hợp đồng API — đã duyệt 2026-11-03

Đã duyệt endpoint công khai (không yêu cầu đăng nhập), đầu vào và các lỗi sau:

- GET /courts/:courtId/availability?date=2026-11-04&durationMinutes=90, công khai.
- date bắt buộc, ngày lịch hợp lệ YYYY-MM-DD theo Asia/Ho_Chi_Minh, từ hôm nay đến hôm nay + 7 ngày (gồm hai đầu). Đã duyệt 2026-11-03.
- durationMinutes bắt buộc, chỉ nhận 30/60/90/120; backend parse/validate rõ ràng. Đã duyệt 2026-11-03.
- Xác định giờ bắt đầu còn đủ slot 30 phút liên tiếp cho thời lượng chọn; vẫn áp dụng tương lai, mở cửa/kết thúc cùng ngày theo quy tắc hiện hành.
- Đã duyệt 2026-11-03: date/durationMinutes thiếu hoặc sai trả 400/VALIDATION_ERROR, kèm details theo trường. Nếu chọn hôm nay, chỉ trả giờ bắt đầu trong tương lai. Người học xác nhận “Ok.”; chưa triển khai/test.
- Đã duyệt 2026-11-03: courtId sai định dạng trả 400/VALIDATION_ERROR; sân không tồn tại trả 404/COURT_NOT_FOUND; sân vô hiệu hóa trả 409/COURT_INACTIVE. Validate đầu vào trước, sau đó tìm sân và kiểm tra isActive. Sân hoạt động nhưng hết giờ phù hợp trả 200 với availableStarts=[]. Người học xác nhận “Ok hợp lý.”. Kiểu ID đã chốt UUID; chưa triển khai/test.
- Availability chỉ phản ánh lúc truy vấn, không giữ slot; POST đặt vẫn bảo vệ bằng transaction và ràng buộc database.

### Danh sách giờ bắt đầu — đã duyệt 2026-11-03

Người học xác nhận “Ok được duyệt.” cho response availableStarts: array các object gồm startAt và endAt theo thời lượng chọn, sắp từ sớm đến muộn; không có giờ phù hợp trả []. Giao diện dùng danh sách rỗng để báo “Không còn giờ trống cho thời lượng này”. Cấu trúc danh sách được duyệt trước; endpoint, các trường bao ngoài và mã lỗi được duyệt riêng ở các mục tương ứng. Chưa triển khai/test.

### Cách xác định giờ trống và response — đã duyệt 2026-11-03

- Khoảng đặt tính từ giờ bắt đầu, không chiếm thời điểm kết thúc: hai booking tiếp giáp được phép. Cùng sân, booking chưa hủy có khoảng cũ và khoảng mới trùng khi newStart < existingEnd và newEnd > existingStart.
- Ví dụ sân có booking 19:00–20:00, khách chọn 90 phút: 17:30–19:00 và 20:00–21:30 không trùng; 18:00–19:30 và 18:30–20:00 trùng. Vẫn phải đáp ứng các điều kiện thời gian/trạng thái sân khác.
- Backend duyệt các giờ bắt đầu cách nhau 30 phút, chỉ trả khoảng đủ toàn bộ slot liên tiếp cho durationMinutes; bỏ khoảng quá khứ, trùng hoặc kết thúc sau 22:00.
- Đã duyệt thành công HTTP 200 với success=true, message="Lấy giờ trống thành công", data object gồm courtId, date, durationMinutes, availableStarts. availableStarts là array các object {startAt, endAt}, sắp tăng dần theo startAt; thời điểm ISO 8601 UTC, date là ngày theo Asia/Ho_Chi_Minh. Không có khoảng phù hợp trả array rỗng.
- Kết quả phục vụ chọn giờ; không giữ chỗ hoặc bảo đảm request đặt sau đó thành công. POST đặt kiểm tra lại và trả 409 nếu slot đã bị chiếm.

Người học hỏi có tính là trùng và yêu cầu đề xuất phương án; mentor cung cấp giải thích/đề xuất trên. Luồng chọn thời lượng/lọc giờ đã được duyệt ở trên; danh sách availableStarts cũng đã duyệt; endpoint công khai và khung response đã được duyệt bằng phản hồi “Oke.”. Thiết kế hợp đồng availability đã duyệt; chưa có code hoặc kết quả test, kiểu ID toàn hệ thống đã chốt UUID ngày 2026-11-04.

## API admin tạo sân — POST /admin/courts (hợp đồng đã duyệt 2026-11-03)

Người học nêu tên/địa chỉ/giá và yêu cầu mentor bổ sung dựa trên Court để duyệt. Địa chỉ đã chốt ở Branch; tạo Court chọn branchId, không gửi địa chỉ riêng.

- Đã duyệt 2026-11-03: POST /admin/courts chỉ dành cho ADMIN. Mã lỗi đã duyệt theo quy ước hiện hành: CUSTOMER trả 403/FORBIDDEN, thiếu/sai/hết hạn xác thực trả 401/UNAUTHENTICATED; kiểm tra xác thực → quyền → validation body. Chưa triển khai/test.
- Body đã duyệt 2026-11-03 qua phản hồi “Ok hợp lý.”: branchId bắt buộc, tham chiếu chi nhánh tồn tại; name bắt buộc, string trim rồi không rỗng; playersPerTeam bắt buộc, số nguyên 5/7/11; pricePerSlot bắt buộc, số nguyên VND từ 1 đến 536870911, giá mỗi 30 phút; isActive tùy chọn, boolean, bỏ qua thì mặc định true, cho phép false để tạo sân chưa nhận đặt.
- Không nhận id/createdAt/updatedAt do client tự gán; backend/database sinh. Body không có address vì nguồn địa chỉ là Branch.address. Không thêm ảnh/mô tả/tiện ích/giờ mở cửa riêng.
- Ví dụ body: {"branchId":"<branch-id>","name":"Sân A","playersPerTeam":7,"pricePerSlot":150000,"isActive":true}. Nhãn ID minh họa; kiểu ID đã chốt UUID.
- Validation tên và field ngoài hợp đồng đã duyệt ở dưới; chưa triển khai unique/schema/code/test hoặc thêm dependency.

### Response và lỗi — đã duyệt 2026-11-03

- Thành công HTTP 201, success=true, message="Tạo sân thành công", data object gồm id, name, playersPerTeam, pricePerSlot, isActive, branch {id, name, address}; nhất quán bộ trường GET /courts/:courtId. Phản ánh sân đã lưu thành công, không phải body được echo lại.
- Body thiếu/sai trường hoặc branchId sai định dạng: 400/VALIDATION_ERROR, details theo field/message hiện hành.
- branchId đúng định dạng nhưng không tồn tại: 404/BRANCH_NOT_FOUND; không tạo Court.
- Xác thực/quyền thất bại dùng mã đã duyệt ở trên; không đọc chi nhánh hoặc tạo sân khi bị từ chối.
- Validation chi tiết và lỗi trùng đã được duyệt bên dưới; chưa triển khai ràng buộc hoặc test.

Người học xác nhận “Ok duyệt.” cho response 201, các mã lỗi 400/404/401/403 và thứ tự xác thực → quyền ADMIN → validation body → tìm Branch → tạo Court. Chưa triển khai/test.

### Tên sân duy nhất — đã duyệt 2026-11-03

- Người học yêu cầu cấm trùng để tránh hiểu lầm, sau đó đồng ý “Ừm.” với khuyến nghị chỉ duy nhất trong mỗi chi nhánh. Thay thế đề xuất duy nhất toàn hệ thống.
- Cùng Branch không được có hai sân trùng tên, kể cả Court.isActive=false; khác Branch được trùng. Chuẩn hóa khoảng trắng: trim và gộp khoảng trắng liên tiếp; so sánh không phân biệt hoa/thường, vẫn phân biệt dấu tiếng Việt. Giữ chữ hoa/thường cho tên hiển thị. Ví dụ “ Sân  A ” và “sân a” là trùng nếu cùng chi nhánh.
- Khi triển khai, database phải bảo vệ tính duy nhất trên branchId và tên chuẩn hóa, kể cả request đồng thời. Áp dụng cùng quy tắc khi tạo/đổi tên, cập nhật thông tin liên quan nguyên tử; bản đầu không cho đổi branchId theo quyết định ở mục sửa sân. Kiểm tra trước bằng SELECT không thay thế ràng buộc database. Chưa chốt biểu thức/cột/index SQL hoặc chạy migration.
- Giao diện xác nhận/xem booking hiển thị tên sân cùng chi nhánh, dùng dữ liệu court/branch đã có; không bổ sung snapshot tên/địa chỉ.
- Mã lỗi trùng đã duyệt 2026-11-03: 409/COURT_NAME_CONFLICT, message="Tên sân đã tồn tại trong chi nhánh này. Vui lòng chọn tên khác." Chỉ map vi phạm ràng buộc tên tương ứng sang mã này, không map mọi lỗi DB thành trùng tên.

### Validation chi tiết — đã duyệt 2026-11-03

- name sau chuẩn hóa khoảng trắng dài từ 1 đến 100 ký tự.
- Body chỉ nhận branchId/name/playersPerTeam/pricePerSlot/isActive. Gửi field ngoài danh sách (kể cả address/id/createdAt/updatedAt) trả 400/VALIDATION_ERROR với details theo trường; không âm thầm lưu hoặc bỏ qua. Chưa triển khai/test.


Người học xác nhận “Ok.” cho tên 1–100 ký tự sau chuẩn hóa, từ chối field thừa bằng 400/VALIDATION_ERROR với details và lỗi trùng 409/COURT_NAME_CONFLICT. Hợp đồng tạo sân đã duyệt; chưa triển khai/test.

## API admin sửa sân — hợp đồng đã duyệt 2026-11-03

- Đã duyệt 2026-11-03: PATCH /admin/courts/:courtId, chỉ ADMIN; PATCH nhận những trường cần đổi, trường không gửi giữ nguyên.
- Body đã duyệt cho bản đầu: name, playersPerTeam, pricePerSlot, isActive; ít nhất một trường, không nhận null hoặc field thừa. Khi gửi field phải validate theo quy tắc tạo sân; không áp mặc định isActive=true trong PATCH.
- Đã duyệt không cho đổi branchId qua API này: booking liên kết Court và đọc Branch hiện hành, đổi chi nhánh có thể làm địa điểm booking hiện có thay đổi. Người học xác nhận “Ok.” cho bộ trường và giới hạn sửa sân. Không thêm snapshot/chuyển sân.
- Đổi giá không đổi snapshot giá booking cũ; isActive=false không tự hủy booking. Các quy tắc đã chốt này giữ nguyên.

### Response và lỗi sửa sân — đã duyệt 2026-11-03

- Thành công HTTP 200, success=true, message="Cập nhật sân thành công", data object sân sau cập nhật theo bộ trường API chi tiết/tạo sân: id/name/playersPerTeam/pricePerSlot/isActive/branch {id,name,address}.
- 401/UNAUTHENTICATED nếu thiếu/sai/hết hạn token; 403/FORBIDDEN nếu không phải ADMIN.
- 400/VALIDATION_ERROR với details khi courtId sai định dạng, body rỗng, field không hợp lệ/null/thừa, hoặc gửi branchId.
- 404/COURT_NOT_FOUND nếu courtId đúng định dạng nhưng không tồn tại.
- 409/COURT_NAME_CONFLICT nếu tên sau chuẩn hóa trùng với sân khác trong cùng chi nhánh, kể cả sân vô hiệu hóa. Giữ nguyên tên hiện có của chính sân không tính là trùng.
- Thứ tự: xác thực → quyền ADMIN → validate ID/body → tìm Court → cập nhật và bảo vệ unique tên tại database → trả dữ liệu sau lưu. Cập nhật nhiều trường nguyên tử: bất kỳ lỗi nào không được để lại thay đổi một phần. Chi tiết SQL/khóa và test concurrent update vẫn còn thiết kế/kiểm chứng khi triển khai.
- Người học xác nhận “Ok.” cho response, các lỗi và quy tắc cập nhật nhiều trường thành công toàn bộ hoặc không đổi gì. Chưa triển khai/test; không coi đã kiểm chứng SQL/khóa hoặc request đồng thời.

## API admin danh sách sân — GET /admin/courts (đã duyệt 2026-11-03)

- Chỉ ADMIN; 401/UNAUTHENTICATED nếu thiếu/sai/hết hạn token, 403/FORBIDDEN nếu không phải ADMIN; xác thực/quyền trước validation query.
- Mặc định xem tất cả sân, gồm isActive=true và false. Query tùy chọn branchId, playersPerTeam (5/7/11), isActive (chuỗi chính xác true/false); các bộ lọc kết hợp AND. Bỏ isActive thì không lọc trạng thái, không tự hiểu false là bỏ bộ lọc.
- Phân trang như GET /courts: page mặc định 1, limit mặc định 10/tối đa 50; số nguyên dương, name ASC rồi id ASC.
- 200/success=true/message="Lấy danh sách sân thành công", data array theo bộ trường GET /courts, meta {page,limit,total,totalPages}; total đếm sau tất cả bộ lọc, totalPages=ceil(total/limit). Không khớp hoặc trang vượt phạm vi trả data=[]; branchId đúng định dạng nhưng không tồn tại cũng trả danh sách rỗng.
- Query sai định dạng/giá trị trả 400/VALIDATION_ERROR với details. Người học xác nhận “Ok.” cho hợp đồng danh sách sân admin. Chưa triển khai/test.
