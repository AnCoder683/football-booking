# API booking

[Chỉ mục thiết kế](../DESIGN.md) · [Khung response](api-common.md) · Chưa có API/test.

Các hợp đồng bên dưới đã được duyệt ở mức ghi rõ trong từng mục. ID hiện dùng UUID; mọi nhãn B1/C1/U1 chỉ là minh họa. Khóa/SQL/test thực thi xem [transaction](transactions.md) và [BookingSlot](booking-slots.md).

## Tạo booking — POST /bookings

### Data tạo booking — đã duyệt 2026-11-03

Người học hỏi data có phải array và yêu cầu đề xuất. POST tạo một booking trả data object; API danh sách mới trả data array. Đề xuất data gồm id, court {id, name, branch {id, name, address}}, startAt, endAt, durationMinutes, status, pricePerSlot, totalPrice, createdAt. Thời điểm response dùng ISO 8601 UTC, UI hiển thị Asia/Ho_Chi_Minh; tiền số nguyên VND. Các giá trị phản ánh booking đã commit, pricePerSlot/totalPrice lấy snapshot Booking; durationMinutes suy ra từ startAt/endAt. Thông tin sân/chi nhánh lồng để FE hiển thị xác nhận, không phải snapshot lịch sử tên/địa chỉ. Nhãn ID trong ví dụ chỉ minh họa; ID database đã chốt UUID. Không trả passwordHash hoặc token. Người học đã duyệt bộ trường này bằng phản hồi “Ok được rồi đó”. Đây là hợp đồng thiết kế, chưa triển khai/test; kiểu ID đã chốt UUID ngày 2026-11-04.

### Lỗi đạt giới hạn booking — đã duyệt 2026-11-03

Khi khách đã có đủ số booking CONFIRMED với startAt trong tương lai theo hạn mức cấu hình hiện hành (3), POST tạo booking trả HTTP 409 Conflict:

```json
{
  "success": false,
  "error": {
    "code": "BOOKING_LIMIT_REACHED",
    "message": "Bạn đã đạt giới hạn 3 booking chưa bắt đầu và chưa hủy."
  }
}
```

Số trong message lấy từ cấu hình backend cùng nguồn với hạn mức kiểm tra; code giữ ổn định. Không có details vì đây là lỗi hạn mức nghiệp vụ, không phải lỗi từng trường. Không tạo Booking hoặc giữ slot nào khi từ chối. Kiểm tra hạn mức dưới khóa User theo hướng transaction đã duyệt để xử lý request đồng thời.

Người học xác nhận “Oke duyệt”. Đây là hợp đồng thiết kế; chưa triển khai hoặc kiểm thử API/database.

### Lỗi tài khoản bị chặn đặt mới — đã duyệt 2026-11-03

POST tạo booking trả HTTP 403 Forbidden khi khách đã được xác thực nhưng trạng thái hiện hành isBookingBlocked=true:

```json
{
  "success": false,
  "error": {
    "code": "BOOKING_BLOCKED",
    "message": "Tài khoản của bạn hiện bị chặn đặt mới. Vui lòng liên hệ quản trị viên."
  }
}
```

Không trả lý do nội bộ trong BookingBlockHistory. Khách vẫn được đăng nhập, xem và hủy booking đúng quy định. Đọc trạng thái hiện hành trong transaction theo hướng khóa User đã duyệt, kể cả khi dùng access token được cấp trước lúc chặn; không tạo booking hoặc giữ slot khi từ chối. Người học phản hồi đồng ý, hỏi ý nghĩa 403/Forbidden rồi xác nhận đã hiểu và yêu cầu tiếp tục. Chưa triển khai/test.

### Lỗi sân vô hiệu hóa — đã duyệt 2026-11-03

POST tạo booking trả HTTP 409 Conflict khi sân tồn tại nhưng isActive=false tại lúc kiểm tra trạng thái hiện hành dưới khóa Court:

```json
{
  "success": false,
  "error": {
    "code": "COURT_INACTIVE",
    "message": "Sân hiện không nhận booking mới. Vui lòng chọn sân khác."
  }
}
```

Không tạo booking hoặc giữ slot nào khi từ chối. Booking có sẵn và lịch sử vẫn giữ nguyên. Phối hợp với cập nhật admin theo thứ tự khóa Court đã chốt; không bảo đảm mọi request đặt luôn đi trước thao tác vô hiệu hóa. Người học xác nhận “Ok duyệt”. Đây là hợp đồng thiết kế, chưa triển khai/test.

### Lỗi không tìm thấy sân — đã duyệt 2026-11-03

POST tạo booking trả HTTP 404 Not Found khi courtId đúng định dạng đã quy định nhưng không có sân tương ứng:

```json
{
  "success": false,
  "error": {
    "code": "COURT_NOT_FOUND",
    "message": "Không tìm thấy sân."
  }
}
```

courtId sai định dạng trả 400/VALIDATION_ERROR theo quy ước validation; kiểu ID đã chốt UUID ngày 2026-11-04. Không tạo booking hoặc giữ slot khi từ chối. Người học xác nhận “Ok duyệt.”. Đây là hợp đồng thiết kế, chưa triển khai/test.

### Lỗi giờ bắt đầu không ở tương lai — đã duyệt 2026-11-03

POST tạo booking trả HTTP 400 với success=false, error.code=VALIDATION_ERROR, error.message="Dữ liệu không hợp lệ", error.details=[{"field":"startAt","message":"Giờ bắt đầu phải nằm trong tương lai."}] khi startAt <= thời điểm backend kiểm tra.

Kiểm tra lại thời gian sau các lần chờ khóa database; không chỉ dựa vào thời điểm client gửi hoặc thời điểm transaction bắt đầu. Không tạo booking hoặc giữ slot nào khi từ chối. Người học xác nhận “Ừm ok.”. Đây là hợp đồng thiết kế, chưa triển khai/test.

### Các lỗi thời gian còn lại — đã duyệt 2026-11-03

POST tạo booking dùng HTTP 400/VALIDATION_ERROR, message chung “Dữ liệu không hợp lệ”, details array gồm field/message theo khung đã duyệt:

| field | Điều kiện không hợp lệ | message |
| --- | --- | --- |
| startAt | Ngày ngoài hôm nay đến hôm nay + 7 ngày (bao gồm hai đầu) theo Asia/Ho_Chi_Minh | Chỉ được đặt từ hôm nay đến hết ngày thứ 7 tính từ hôm nay. |
| startAt | Không đúng mốc 00/30 phút hoặc giây/phần lẻ giây khác 0 | Giờ bắt đầu phải đúng mốc 00 hoặc 30 phút, với giây bằng 0. |
| startAt | Bắt đầu trước 06:00 | Giờ bắt đầu không được trước 06:00. |
| durationMinutes | endAt do backend tính vượt 22:00 cùng ngày | Vui lòng chọn thời lượng để booking kết thúc không muộn hơn 22:00 cùng ngày. |

Các quy tắc ngày/giờ tính theo Asia/Ho_Chi_Minh, dữ liệu thời điểm lưu/trả UTC. Mốc giờ phải khớp chính xác slot cơ sở 30 phút; không tự làm tròn input. Không tạo booking hoặc giữ slot khi từ chối. Người học xác nhận “Ok.” với nhóm lỗi; chưa triển khai/test. Thông báo gắn durationMinutes cho lỗi kết thúc sau giờ đóng cửa theo đề xuất đã duyệt; FE có thể cần người dùng điều chỉnh cả giờ bắt đầu nếu không còn thời lượng hợp lệ.

### Lỗi chưa xác thực hợp lệ — đã duyệt 2026-11-03

POST tạo booking yêu cầu access token hợp lệ. Thiếu token, token không hợp lệ hoặc hết hạn trả HTTP 401 Unauthorized:

```json
{
  "success": false,
  "error": {
    "code": "UNAUTHENTICATED",
    "message": "Phiên đăng nhập không hợp lệ hoặc đã hết hạn. Vui lòng đăng nhập lại."
  }
}
```

Từ chối trước khi xử lý đặt sân, không tạo booking hoặc giữ slot. FE có thể thử refresh khi nhận 401 và chỉ yêu cầu đăng nhập lại nếu refresh thất bại; cơ chế phối hợp refresh/retry vẫn cần hoàn thiện trong phần auth, không coi đã triển khai hoặc tự động an toàn để retry mọi request. Người học xác nhận “Ok”. Chưa triển khai/test.

### Request tạo booking — đã duyệt 2026-11-03

POST /bookings yêu cầu access token hợp lệ và body JSON object chỉ gồm ba trường bắt buộc:

| Trường | Quy tắc |
| --- | --- |
| courtId | Chuỗi UUID hợp lệ theo định dạng đã chọn. |
| startAt | Chuỗi ISO 8601 biểu diễn thời điểm hợp lệ, có múi giờ rõ ràng (Z hoặc offset), ví dụ 2026-11-04T19:00:00+07:00 hoặc thời điểm UTC tương đương. Áp dụng thêm quy tắc ngày/giờ đã duyệt. |
| durationMinutes | JSON number, một trong 30/60/90/120; không ép chuỗi "60" thành số. |

Thiếu trường, null, sai kiểu, thời điểm không hợp lệ/thiếu múi giờ hoặc trường ngoài hợp đồng trả 400/VALIDATION_ERROR theo khung details đã chốt. Backend lấy userId từ access JWT đã xác thực, tự tính endAt và giá, tự gán trạng thái; client không gửi userId/endAt/pricePerSlot/totalPrice/status. Không làm tròn hoặc tự sửa thời điểm đầu vào. Chi tiết parser ISO 8601 và định dạng ID cần kiểm chứng khi triển khai; không thêm dependency lúc này.

Người học xác nhận “Ok được.” với nhóm quy tắc. Đây là hợp đồng thiết kế, chưa triển khai/test. Quyền theo vai trò đã duyệt ở mục bên dưới; thứ tự trả lỗi khi có nhiều điều kiện không hợp lệ đã được duyệt ở mục Thứ tự xử lý POST /bookings.

### Quyền tạo booking — đã duyệt 2026-11-03

POST /bookings chỉ dành cho CUSTOMER đã xác thực. ADMIN không được tạo booking qua endpoint này; bản đầu chưa có admin đặt hộ. Tài khoản đã xác thực nhưng sai vai trò trả HTTP 403 Forbidden:

```json
{
  "success": false,
  "error": {
    "code": "FORBIDDEN",
    "message": "Bạn không có quyền thực hiện thao tác này."
  }
}
```

Phân biệt với 401/UNAUTHENTICATED khi chưa xác thực hợp lệ và 403/BOOKING_BLOCKED khi CUSTOMER bị chặn đặt mới. Không tạo booking hoặc giữ slot khi từ chối. Người học xác nhận “Ok phần quyền như vậy đi.”. Chưa triển khai/test middleware hoặc API.

### Thứ tự xử lý POST /bookings — đã duyệt 2026-11-03

1. Xác thực access token; không hợp lệ trả 401/UNAUTHENTICATED.
2. Kiểm tra vai trò CUSTOMER; sai vai trò trả 403/FORBIDDEN.
3. Validate body theo hợp đồng; lỗi trả 400/VALIDATION_ERROR.
4. Bắt đầu transaction, khóa User theo hướng đã chốt rồi kiểm tra trạng thái chặn hiện hành; bị chặn trả 403/BOOKING_BLOCKED.
5. Đọc Court dưới khóa; không tồn tại trả 404/COURT_NOT_FOUND, không hoạt động trả 409/COURT_INACTIVE.
6. Kiểm tra lại thời gian sau các lần chờ khóa; không hợp lệ trả 400/VALIDATION_ERROR. Sau đó đếm booking CONFIRMED có startAt trong tương lai bằng câu truy vấn riêng sau khóa User; đủ hạn mức trả 409/BOOKING_LIMIT_REACHED.
7. Tính/lưu giá snapshot, tạo Booking và toàn bộ BookingSlot trong cùng transaction; tranh slot rollback toàn bộ và trả 409/BOOKING_SLOT_CONFLICT; chỉ sau commit thành công mới trả 201.

Nếu nhiều điều kiện nghiệp vụ cùng không hợp lệ, trả lỗi ở bước gặp trước; ví dụ khách bị chặn đồng thời đủ hạn mức nhận BOOKING_BLOCKED. Validation có thể trả nhiều lỗi theo trường trong details như khung đã duyệt. Từ chối trong transaction phải kết thúc transaction và nhả khóa, không để lại booking/slot. Không map mọi lỗi database thành tranh slot; lỗi kỹ thuật ngoài các tình huống này chưa được chốt trong mục này.

Người học xác nhận “Ok.” với thứ tự. Đây là thiết kế chưa triển khai/test, chưa phải bằng chứng chạy PostgreSQL hoặc request đồng thời.

## API lịch đặt cá nhân — GET /bookings/me

### Phạm vi và quyền — đã duyệt 2026-11-03

- Chỉ CUSTOMER đã xác thực được gọi. Áp dụng khung lỗi 401/UNAUTHENTICATED và 403/FORBIDDEN cho xác thực/vai trò không hợp lệ.
- Lấy userId từ access JWT đã xác thực; không nhận userId từ query để chọn chủ sở hữu danh sách. Backend luôn giới hạn truy vấn theo khách đang đăng nhập, không chỉ lọc ở FE.
- Trả booking của chính khách, gồm cả booking đã hủy và đã qua. Khách bị chặn đặt mới vẫn được xem lịch cá nhân theo quy tắc hiện hành.
- Thành công trả HTTP 200 với success=true, message, data là array; chưa có booking trả data=[] (không phải 404).
- Người học xác nhận “Ok duyệt.”. Bộ trường, sắp xếp và phân trang đã duyệt ở các mục bên dưới; bộ lọc lịch cá nhân còn chưa chốt, không suy ra từ bộ lọc admin; chưa triển khai/test.

### Dữ liệu và sắp xếp lịch cá nhân — đã duyệt 2026-11-03

Mỗi phần tử data của GET /bookings/me dùng bộ trường như response tạo booking: id, court {id, name, branch {id, name, address}}, startAt, endAt, durationMinutes, status, pricePerSlot, totalPrice, createdAt; thêm cancelledAt (thời điểm UTC hoặc null khi chưa hủy). Giá lấy snapshot Booking, tên/địa chỉ sân/chi nhánh không được cam kết là snapshot lịch sử. Không trả thông tin người hủy hoặc lý do nội bộ trong bộ trường này.

Sắp xếp createdAt DESC, id làm tiêu chí phụ (đề xuất cụ thể hướng id DESC khi chốt phân trang). status lưu vẫn là CONFIRMED/CANCELLED; nhãn Sắp diễn ra/Đang diễn ra/Đã kết thúc suy ra từ thời gian cho booking chưa hủy, không thêm trạng thái database mới. Người học xác nhận “Ok duyệt.”. Phân trang đã duyệt ở mục bên dưới; bộ lọc lịch cá nhân còn chưa chốt, không suy ra từ bộ lọc admin; chưa triển khai/test.

### Phân trang lịch cá nhân — đã duyệt 2026-11-03

GET /bookings/me?page=1&limit=10 dùng phân trang theo trang:

- page mặc định 1; limit mặc định 10, tối đa 50. Giá trị query phải biểu diễn số nguyên dương hợp lệ; không chấp nhận giá trị rác bằng cách parse một phần hoặc làm tròn. Sai trả HTTP 400/VALIDATION_ERROR với details trỏ page/limit. Query HTTP là chuỗi nên cần parse/validate rõ ràng, khác quy tắc durationMinutes trong JSON body.
- Sắp xếp createdAt DESC, id DESC.
- Response HTTP 200 giữ success/message/data; thêm meta cùng cấp data gồm page, limit, total, totalPages. total chỉ đếm booking của khách đang đăng nhập; totalPages=ceil(total/limit), bằng 0 khi total=0.
- Trang vượt số trang hiện có trả 200/data=[] và metadata tương ứng, không trả 404.

Ví dụ danh sách rỗng:

```json
{
  "success": true,
  "message": "Lấy lịch đặt thành công",
  "data": [],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 0,
    "totalPages": 0
  }
}
```

Người học xác nhận “Ok duyệt.”. Không tự áp dụng cấu hình limit này cho mọi endpoint danh sách chưa được thiết kế. Chưa triển khai/test; cách bảo đảm data/total cùng snapshot khi có thay đổi đồng thời cần quyết định khi triển khai, không cam kết phân trang giữ nguyên kết quả qua nhiều request.

## API khách hủy booking — POST /bookings/:bookingId/cancel

### Hợp đồng cơ bản — đã duyệt 2026-11-03

- CUSTOMER đã xác thực chỉ được hủy booking của chính mình; danh tính lấy từ JWT. Không cần body. Admin dùng API quản trị riêng, chưa thiết kế tại mục này.
- Booking còn hiệu lực và khách còn ít nhất 60 phút trước startAt tại thời điểm backend kiểm tra mới được hủy; đúng 60 phút vẫn hợp lệ. Kiểm tra lại trạng thái/quyền/thời gian trong transaction sau chờ khóa; chi tiết phối hợp khóa và hủy trùng còn cần hoàn thiện.
- Thành công trả HTTP 200, success=true, message="Hủy booking thành công", data là object booking sau cập nhật, tái dùng bộ trường booking đã chốt và thêm cancelledAt. status=CANCELLED, cancelledAt là thời điểm hủy UTC; database ghi cancelledById theo thiết kế hiện có, không mặc định trả trường này cho khách.
- Giữ lịch sử Booking/BookingSlot, không xóa booking. Trong cùng transaction: cập nhật status/cancelledAt/cancelledById và gán releasedAt cho mọi BookingSlot của booking để giải phóng chỗ. Commit toàn bộ mới trả thành công; lỗi rollback toàn bộ, giữ trạng thái/slot trước thao tác hủy.
- Ví dụ booking 19:00–20:00 giữ slot 19:00 và 19:30: nếu giải phóng một slot lỗi, rollback cả cập nhật booking và giải phóng slot còn lại. Ví dụ là mô phỏng, chưa phải test thực tế.

Người học yêu cầu giải thích response sau cập nhật và transaction hủy; sau giải thích xác nhận “Ok được duyệt.”. Hợp đồng cơ bản đã duyệt; lỗi không tìm thấy/không sở hữu/quá hạn/hủy trùng đã duyệt ở các mục riêng; thứ tự khóa chung/SQL còn hoàn thiện. Chưa triển khai/test API hoặc PostgreSQL.

### Không tìm thấy booking thuộc khách — đã duyệt 2026-11-03

Với POST /bookings/:bookingId/cancel, backend lấy bookingId từ URL, userId từ JWT đã xác thực, tìm booking theo cả hai giá trị. Booking không tồn tại hoặc thuộc người khác đều trả HTTP 404 Not Found:

```json
{
  "success": false,
  "error": {
    "code": "BOOKING_NOT_FOUND",
    "message": "Không tìm thấy booking."
  }
}
```

Không tiết lộ booking của khách khác có tồn tại hay không; không sửa booking/slot khi từ chối. bookingId sai định dạng trả 400/VALIDATION_ERROR; kiểu ID đã chốt UUID ngày 2026-11-04. FE gửi ID của booking được bấm Hủy nhưng backend phải tự bảo vệ quyền sở hữu, kể cả request bị sửa qua Postman. Người học hỏi ai tìm booking; sau giải thích luồng FE → backend → database xác nhận “Ok được duyệt.”. Chưa triển khai/test.

### Lỗi quá hạn tự hủy — đã duyệt 2026-11-03

Với booking còn hiệu lực thuộc CUSTOMER đang đăng nhập, nếu thời gian còn lại đến startAt nhỏ hơn 60 phút tại lúc backend kiểm tra sau chờ khóa, POST /bookings/:bookingId/cancel trả HTTP 409 Conflict:

```json
{
  "success": false,
  "error": {
    "code": "CANCELLATION_DEADLINE_PASSED",
    "message": "Đã quá hạn tự hủy. Booking chỉ được hủy trước giờ bắt đầu ít nhất 60 phút."
  }
}
```

Đúng 60 phút vẫn được hủy: booking 19:00 hủy lúc 18:00 hợp lệ, lúc 18:00:01 bị từ chối. Booking đã bắt đầu cũng đã qua hạn. Không đổi booking hoặc giải phóng slot khi từ chối. Mã 409 là lựa chọn hợp đồng cho xung đột với điều kiện hiện tại của booking, không phải khẳng định HTTP bắt buộc mọi API dùng mã này. Admin hủy riêng không bị hạn 60 phút theo phạm vi hiện hành.

Người học hỏi vì sao dùng 409; sau giải thích xác nhận “Ok duyệt.”. Chưa triển khai/test; hành vi hủy lặp và thứ tự kiểm tra trạng thái/thời gian cần chốt tiếp.

### Hủy lặp và hủy đồng thời — đã duyệt 2026-11-03

Với booking thuộc CUSTOMER đang đăng nhập đã ở trạng thái CANCELLED, POST /bookings/:bookingId/cancel trả HTTP 200, success=true, message="Booking đã được hủy.", data là booking hiện có theo bộ trường response hủy đã chốt.

- Giữ nguyên cancelledAt/cancelledById ban đầu; không cập nhật hoặc giải phóng slot thêm lần nữa. Áp dụng cả khi lần hủy trước do admin thực hiện.
- Kiểm tra quyền sở hữu trước khi trả dữ liệu. Kiểm tra CANCELLED trước hạn 60 phút; gửi lại sau hạn vẫn nhận 200 nếu đã hủy. Booking không thuộc khách vẫn trả 404 theo hợp đồng.
- Hai request hủy đồng thời phối hợp bằng khóa dòng Booking trong transaction: request sau chờ request trước kết thúc rồi đọc/kiểm tra lại trạng thái, chỉ một lần chuyển CONFIRMED → CANCELLED. Nếu request trước rollback, request sau kiểm tra lại trạng thái và thời gian hiện hành, không mặc định thành công.
- Hữu ích khi hủy lần đầu đã commit nhưng response bị mất và client gửi lại. Không cam kết mọi request lỗi mạng đã hủy thành công; client dựa vào response thành công hoặc truy vấn lại.

Người học xác nhận “Ok duyệt.”. Chưa triển khai/test PostgreSQL; thứ tự khóa chung giữa tạo/hủy/admin và SQL cụ thể vẫn cần hoàn thiện để tránh xung đột khóa.

## API admin hủy booking — POST /admin/bookings/:bookingId/cancel

### Hợp đồng cơ bản — đã duyệt 2026-11-03

- Chỉ ADMIN đã xác thực; sai xác thực/vai trò áp dụng 401/UNAUTHENTICATED hoặc 403/FORBIDDEN theo khung đã chốt. Admin được hủy booking của mọi khách, không kiểm tra booking.userId bằng danh tính admin.
- Không cần body. Lưu cancelledById từ JWT admin đã xác thực; không nhận danh tính người hủy từ client.
- Không bị giới hạn trước startAt ít nhất 60 phút như CUSTOMER. Chưa thêm hạn thời gian khác tại hợp đồng này.
- Thành công trả HTTP 200, success=true, message="Hủy booking thành công", data là booking CANCELLED/cancelledAt theo bộ trường response hủy đã chốt. Không tự bổ sung trường customer hoặc cancelledById vào response khi chưa thiết kế.
- Cập nhật Booking và giải phóng toàn bộ BookingSlot trong cùng transaction; chỉ trả thành công sau commit, lỗi rollback. Phối hợp khóa Booking với thao tác hủy của khách, kiểm tra lại trạng thái sau chờ khóa; thứ tự khóa chung/SQL còn cần hoàn thiện.
- Booking đã CANCELLED trả 200, message="Booking đã được hủy.", giữ cancelledAt/cancelledById ban đầu, không giải phóng slot lần nữa.
- Booking không tồn tại trả 404/BOOKING_NOT_FOUND. bookingId sai định dạng trả 400/VALIDATION_ERROR; kiểu ID đã chốt UUID.

Người học xác nhận “Ok duyệt.”. Đây là hợp đồng cơ bản đã duyệt, chưa triển khai/test. Không thêm yêu cầu lý do hủy hoặc admin đặt hộ.

## API danh sách booking quản trị — GET /admin/bookings

### Phạm vi cơ bản — đã duyệt 2026-11-03

- Chỉ ADMIN đã xác thực; áp dụng 401/UNAUTHENTICATED hoặc 403/FORBIDDEN khi không đủ điều kiện.
- Xem booking toàn hệ thống, gồm booking đã hủy và đã qua, không giới hạn theo userId của admin.
- GET /admin/bookings?page=1&limit=10: page mặc định 1, limit mặc định 10/tối đa 50; validation số nguyên dương và lỗi 400/VALIDATION_ERROR như GET /bookings/me.
- Sắp xếp createdAt DESC, id DESC. Trả HTTP 200 với success/message/data array và meta {page, limit, total, totalPages}; total đếm trong phạm vi toàn hệ thống (và theo bộ lọc nếu sau này được chốt). Danh sách rỗng/trang vượt phạm vi trả data=[], không phải 404.
- Bộ trường khách và các bộ lọc đã duyệt ở các mục bên dưới. Không tự trả passwordHash/token hoặc toàn bộ User.

Người học xác nhận “Ok duyệt.”. Đây là hợp đồng cơ bản, chưa triển khai/test.

### Dữ liệu booking quản trị — đã duyệt 2026-11-03

Mỗi phần tử data của GET /admin/bookings tái dùng bộ trường lịch cá nhân đã chốt (gồm cancelledAt), thêm customer object gồm id, name, email, isBookingBlocked. Thông tin customer là dữ liệu tài khoản hiện hành, không phải snapshot lúc đặt. Giá vẫn lấy snapshot Booking; không trả passwordHash hoặc token, không trả toàn bộ User tự động.

Ví dụ phần bổ sung:

```json
{
  "customer": {
    "id": "user-example",
    "name": "Nguyễn Văn A",
    "email": "a@example.com",
    "isBookingBlocked": false
  }
}
```

Người học xác nhận “Ok luôn.”. Bộ lọc đã duyệt ở mục bên dưới; chưa triển khai/test.

### Bộ lọc booking quản trị — đã duyệt 2026-11-03

GET /admin/bookings hỗ trợ các query tùy chọn, kết hợp bằng AND:

| Query | Ý nghĩa |
| --- | --- |
| branchId | Booking tại chi nhánh, qua Court.branchId. |
| courtId | Booking của sân. |
| userId | Booking của khách. |
| status | CONFIRMED hoặc CANCELLED. |
| date | Ngày bắt đầu booking, YYYY-MM-DD theo Asia/Ho_Chi_Minh. |

Không truyền bộ lọc thì xem toàn hệ thống theo phân trang đã chốt. Giá trị sai định dạng trả 400/VALIDATION_ERROR với details tương ứng. Không có kết quả trả 200/data=[]; meta.total đếm sau khi áp dụng toàn bộ bộ lọc. Bộ lọc ID đúng định dạng nhưng không khớp dữ liệu trả danh sách rỗng, không phải thao tác truy xuất một tài nguyên riêng. date phải là ngày lịch hợp lệ, chuyển khoảng đầu ngày đến đầu ngày kế tiếp theo giờ Việt Nam sang UTC để lọc startAt theo [đầu ngày, đầu ngày kế tiếp); không lọc theo ngày UTC hoặc createdAt.

Người học xác nhận “Ok duyẹt.”. Chưa thêm tìm kiếm tự do/khoảng ngày/lọc theo nhãn thời gian; chưa triển khai/test.
