# Giai đoạn 1 — Phân tích và thiết kế

[Chỉ mục học tập](../INTERVIEW_PREP.md) · Nội dung được chuyển theo giai đoạn, không nâng mức hiểu.

Các câu trả lời/nhật ký bên dưới giữ bằng chứng tại thời điểm ghi; quyết định nghiệp vụ hiện hành tra README và chỉ mục DESIGN, không triển khai theo đề xuất cũ đã bị thay thế. Chỉ đọc câu/mục cần review, không nạp toàn bộ lịch sử để bắt đầu phiên.


Chính sách hiện hành từ quyết định FB-002 ngày 2026-11-02: chỉ chặn đặt mới, bỏ mức khóa tài khoản; ghi chú khách ngoài app, giữ BookingBlockHistory trong hệ thống. Ghi nhận cũ về khóa/hai hạn chế bên dưới là lịch sử câu trả lời, không áp dụng cho thiết kế hiện tại.


Liên quan: FB-001–003.

| Mã | Câu hỏi | Trạng thái |
| --- | --- | --- |
| G1-01 | Ai dùng hệ thống? Khách và admin có quyền gì khác nhau? | Chưa học |
| G1-02 | Một lượt đặt sân hợp lệ cần thỏa mãn những điều kiện nào? | Cần ôn |
| G1-03 | Vì sao chọn slot cơ sở 30 phút và cho đặt nhiều slot liên tiếp? Lựa chọn này đem lại lợi ích và yêu cầu kiểm tra gì? | Cần ôn |
| G1-04 | User, Court và Booking liên hệ thế nào? Vì sao giữ booking khi khách hủy? | Đã giải thích được |
| G1-05 | Vì sao giá booking cần lưu tại thời điểm đặt? | Đã giải thích được |
| G1-06 | Bạn thiết kế API đặt/hủy thế nào và trả lỗi gì khi yêu cầu không hợp lệ? | Cần ôn |
| G1-07 | Khi nào khai báo ràng buộc bằng Prisma schema, khi nào bổ sung SQL migration? Bạn tạo, kiểm chứng và giữ lịch sử migration thế nào? | Cần ôn |

## Nhu cầu học Compose — 2026-11-04

Người học gửi ảnh compose.yaml, hỏi có cần hiểu từng cú pháp và yêu cầu buổi sau giải thích. Mentor nêu mục tiêu đọc hiểu/sửa có chủ đích/kiểm chứng, không học thuộc. Chưa có câu trả lời thực hành hoặc bằng chứng hiểu Compose. Buổi sau giải thích từng phần trước khi chạy DB: bắt đầu image/environment, tiếp đến ports/volumes/command/healthcheck; làm rõ thụt lề YAML, ${VAR:-default}, ${VAR:?message} và $$ khi gặp. Gắn mỗi phần với kết quả quan sát thực tế, giữ nhịp từng bước.

### Câu trả lời của người học

- FB-002 / áp dụng G1-06 ngày 2026-11-04: người học trả lời “userId BE lấy từ accessToken” và sau 409 “không để lại slot nào hết”. Đúng nguồn danh tính và không giữ slot khi đặt thất bại; backend phải xác thực token trước khi dùng userId. Chưa tự nêu rõ rollback cả Booking hoặc ba field body, mentor bổ sung hai điểm này; không ghi thành lời người học. G1-06 giữ Cần ôn phần diễn đạt hợp đồng đầy đủ, không chặn bước môi trường độc lập. FB-002 chuyển IN_REVIEW chờ xác nhận cuối phần chính; chưa có code/test.

- FB-002 / review tổng hợp cuối ticket ngày 2026-11-04:
  - G1-04: người học mô tả khách chọn sân, đặt rồi chọn sân khác; giữ Booking/BookingSlot cũ để theo dõi hành vi khách. Đúng ý giữ lịch sử, chưa diễn đạt rõ mỗi Booking thuộc một User/một Court và một User/Court có nhiều Booking. Mentor bổ sung lịch sử đặt/hủy và giải phóng slot qua releasedAt, không chỉ theo dõi hành vi. Giữ trạng thái Đã giải thích được từ bằng chứng trước, chưa suy ra đã hiểu toàn bộ slot/khóa.
  - G1-05: người học nói booking cũ lấy giá trước khi DB thay đổi, tính totalPrice rồi nhả khóa để cập nhật giá sân. Đúng hướng transaction tạo booking bảo vệ snapshot; chưa trả lời số tiền hoặc phân biệt lúc tạo với lúc đọc booking cũ. Mentor bổ sung: lúc tạo lưu pricePerSlot/totalPrice vào Booking; lúc đọc dùng snapshot đã lưu, ví dụ 90 phút × 150000/slot = 450000 dù Court đã lên 180000. Giữ trạng thái hiện hành; không coi lời mentor là câu trả lời người học.
  - G1-06: người học nêu request có sân/khoảng thời gian, trùng slot giữa trả 409; hủy trước giờ chơi một giờ và chỉ hủy booking của mình. Đúng hướng input/xung đột/quyền và hạn hủy. Còn thiếu ba field chính xác, rollback toàn bộ khi tranh slot, nguồn danh tính JWT/đối chiếu chủ sở hữu và kết quả tình huống 18:01. Mentor làm rõ ít nhất 60 phút (đúng 18:00 vẫn hợp lệ), 18:01 trả 409/giữ dữ liệu, khách truy vấn booking theo id và userId từ JWT. Giữ Cần ôn, chờ áp dụng vào một tình huống ngắn; chưa có code/test.

- FB-002 / duyệt ON UPDATE ngày 2026-11-04: người học xác nhận “Ok..” cho UUID id không sửa qua API và ON UPDATE RESTRICT trên các FK hiện có. Ghi quyết định; chưa có giải thích độc lập mới hoặc migration/test, giữ mức hiểu hiện hành.

- FB-002 / duyệt RefreshToken → User ngày 2026-11-04: người học kiểm tra lại CASCADE nghĩa là xóa User thì các refresh token liên quan xóa theo có đúng không; sau giải thích thêm RESTRICT lịch sử có thể làm cả lệnh DELETE thất bại, trả lời “Ok.”. Ghi duyệt ON DELETE CASCADE cho RefreshToken.userId → User.id; nhận diện đúng ý nghĩa xóa dây chuyền ở quan hệ này, chưa có code/test hoặc bằng chứng hiểu mọi tương tác FK, giữ mức hiểu tổng thể.

- FB-002 / duyệt BookingSlot → Booking ngày 2026-11-04: người học xác nhận “Ok.” cho ON DELETE RESTRICT trên FK kép BookingSlot(bookingId,courtId) → Booking(id,courtId), giữ hủy bằng cập nhật trạng thái/giải phóng slot. Ghi quyết định, chưa có giải thích độc lập mới hoặc test; giữ mức hiểu hiện hành.

- FB-002 / duyệt FK lịch sử → User ngày 2026-11-04: sau trao đổi xóa tài khoản tương lai, người học xác nhận “Ok chọn RESTRICT luôn đi.”. Ghi duyệt bốn FK Booking.userId/cancelledById và BookingBlockHistory.userId/actorId → User.id; không suy ra RefreshToken → User hoặc các quan hệ khác đã được chốt. Không có lời giải thích độc lập mới hoặc migration/test; giữ mức hiểu hiện hành.

- FB-002 / hỏi khả năng xóa tài khoản tương lai ngày 2026-11-04: người học hỏi khi bổ sung xóa tài khoản thì xử lý ra sao với RESTRICT. Ghi nhận câu hỏi về mở rộng/chính sách dữ liệu, chưa coi là yêu cầu thêm tính năng hoặc duyệt FK lịch sử → User. Mentor phân biệt ngừng sử dụng/ẩn danh/xóa vật lý và đề xuất giữ ID liên kết lịch sử nếu cần; chưa có câu trả lời áp dụng hoặc test, giữ mức hiểu hiện hành.

- FB-002 / duyệt Court → Branch ngày 2026-11-04: người học xác nhận “Ok.” cho ON DELETE RESTRICT khi Branch còn Court tham chiếu, kể cả Court ngừng nhận đặt. Ghi nhận duyệt hành vi xóa để giữ liên kết địa điểm; chưa có giải thích độc lập mới hoặc migration/test, giữ mức hiểu hiện hành.

- FB-002 / chọn RESTRICT cho Court ngày 2026-11-04: người học hỏi RESTRICT vẫn cho xóa Court sau khi xóa dữ liệu tham chiếu có đúng không. Đúng hướng hiểu ranh giới: ràng buộc bảo vệ khi còn tham chiếu, không cấm xóa tuyệt đối. Mentor xác nhận, giải thích cần xóa mọi tham chiếu và API bản đầu không cung cấp luồng xóa sân/lịch sử. Người học xác nhận “Ok chọn RESTRICT.” cho Booking/BookingSlot → Court. Ghi nhận hiểu một phần tác dụng FK và quyết định; chưa có schema/DB test, không suy ra đã hiểu toàn bộ hành vi xóa/transaction.

- FB-002 / đánh đổi xóa sân ngày 2026-11-04: người học nêu RESTRICT giữ sân ngừng hoạt động dễ gây rối/nhầm, CASCADE mất lịch sử hoạt động/thông tin phục vụ thống kê; yêu cầu khuyến nghị cho 10–20 sân giả định. Đúng về rủi ro mất dữ liệu của xóa dây chuyền và nhu cầu phân biệt dữ liệu hoạt động/lịch sử. Cần phân biệt RESTRICT là ràng buộc xóa, còn isActive/query/UI điều khiển nhận đặt/hiển thị; giữ dữ liệu không tự là lỗi hoặc gây nhầm nếu trạng thái rõ. Mentor đề xuất RESTRICT và giữ isActive/bộ lọc, chưa có lựa chọn duyệt hoặc test. Không suy ra totalPrice là doanh thu thực thu vì chưa thanh toán; ghi nhận hiểu một phần đánh đổi, giữ mức hiểu tổng thể.

- FB-002 / chọn UUID ngày 2026-11-04: người học xác nhận “Ok UUID.” cho đề xuất ID nhất quán trên PK/FK các bảng. Ghi nhận quyết định kiểu dữ liệu, chưa coi là giải thích độc lập về UUID, validation hay default Prisma/DB; giữ mức hiểu hiện hành. Chưa có schema/test.

- FB-002 / cần demo BookingSlot khi code ngày 2026-11-04: người học hỏi về releasedAt, truy vấn bảng mỗi lần đặt, có cần tạo record trước và cách kiểm tra khi không có slot đang chiếm; sau giải thích yêu cầu nhìn trực quan khi code. Ghi nhận còn cần quan sát luồng record/truy vấn, không tự đánh dấu đã hiểu. Khi FB-006/FB-008, demo DB trước/sau đặt–hủy–đặt lại, rồi kiểm tra request đồng thời/unique index/rollback bằng DB local/test; giữ mức hiểu hiện hành.

- FB-002 / slot đã hủy và đặt lại ngày 2026-11-04: người học đề xuất kiểm tra BookingSlot: không có thì đặt, có thì phân biệt đã hủy/đã đặt bằng status, slot đã hủy cho đặt lại. Đúng ý tưởng phân biệt bản ghi chiếm chỗ còn hiệu lực và lịch sử đã giải phóng. Còn thiếu kiểm tra toàn bộ các slot của booking, chống race bằng DB và cập nhật Booking/slot nguyên tử; chưa nêu cách cập nhật Booking. Mentor đề xuất giữ releasedAt đã có thay vì thêm status lặp: null còn chiếm chỗ, có thời điểm đã giải phóng; Booking.status vẫn CONFIRMED/CANCELLED. Đặt lại tạo Booking/slot mới, không tái sử dụng dòng lịch sử cũ. Đây là phần mentor bổ sung; ghi nhận hiểu một phần, chưa có code/test hoặc duyệt thêm thay đổi schema.

- FB-002 / điều chỉnh cách học lỗi auth ngày 2026-11-04: người học thấy phần lỗi refresh/logout rối, muốn học thêm và nhìn trực quan khi code sản phẩm. Chấp nhận học theo demo từng tình huống ở lúc triển khai, không ép thuộc toàn bộ lý thuyết trước task độc lập. Chưa có câu trả lời kiến thức mới nên giữ mức hiểu; bảng chính sách lỗi vẫn là đề xuất chưa duyệt, không ghi đã hiểu/hoàn tất auth.

- FB-002 / yêu cầu học kỹ khi code auth đa tab ngày 2026-11-04: người học nói phần này mới và yêu cầu khi code tập trung hướng dẫn. Ưu tiên tại FB-004/phần FE auth liên quan: chia nhỏ Promise single flight, Web Locks và BroadcastChannel; giải thích trước code, demo hai tab, theo dõi token/cookie bằng dữ liệu test không lộ token và kiểm tra logout/refresh đồng thời. Chưa đánh dấu đã hiểu BroadcastChannel hoặc toàn bộ concurrency từ phản hồi này.

- FB-002 / tự tóm tắt AT và cookie chung ngày 2026-11-04: người học nói “mỗi tab sẽ có một AT riêng còn R là chung”, sau xác nhận yêu cầu “Ok tiếp tục đi”. Đúng mô hình lưu token đang chọn cho các tab cùng browser profile: access trong bộ nhớ riêng, refresh cookie chung. Có bằng chứng tự diễn đạt phần này, đồng ý tiếp tục hướng Web Locks; không suy rộng thành đã hiểu/triển khai logout/failure/DB hoặc nâng toàn bộ mức hiểu auth.

- FB-002 / áp dụng luồng hai tab ngày 2026-11-04: sau khi hỏi cookie có riêng từng tab không và được giải thích cookie dùng chung/bộ nhớ riêng, người học tự mô tả A1 lấy khóa, nhận bộ token mới rồi A2 tiếp tục; hỏi A2 refresh tiếp hay dùng access A1. Đúng thứ tự khóa và nhận diện hai lựa chọn chia sẻ access/refresh nối tiếp. Cần chỉnh diễn đạt: A1 nhả khóa rồi A2 được cấp khóa; không phải A2 “được nhả khóa”. Theo phương án đề xuất, A2 dùng cookie R2 để nhận access riêng và R3; access A1 vẫn còn hiệu lực tới expiry. Phần kết luận này do mentor bổ sung, chưa phải người học tự trả lời hoặc duyệt toàn bộ phương án. Ghi nhận bằng chứng hiểu một phần luồng, giữ mức hiểu tổng thể; chưa có code/test.

- FB-002 / yêu cầu giải thích Web Locks ngày 2026-11-04: người học nói chưa biết và yêu cầu mentor đề xuất/giải thích. Mentor khuyến nghị Promise trong tab + Web Locks giữa tab, giải thích cookie chung, access riêng và khóa browser khác khóa DB. Đây là giải thích mentor, chưa có bằng chứng người học tự giải thích, duyệt hoặc triển khai đa tab; giữ mức hiểu hiện hành.

- FB-002 / single flight ngày 2026-11-04: người học hỏi cơ chế chủ yếu ở FE bằng Promise + Axios có đúng không. Mentor xác nhận, giải thích interceptor/chờ Promise/retry một lần, backend vẫn bảo đảm rotation nguyên tử và Promise không dùng chung giữa tab. Người học trả lời “Ok.”; ghi duyệt hướng một tab, ghi nhận xác định đúng vị trí xử lý FE, chưa có code/test hoặc giải thích độc lập về đa tab. Giữ mức hiểu tổng thể hiện hành.

- FB-002 / duyệt ba lớp CSRF ngày 2026-11-04: người học trả lời “Ok.” cho câu hỏi rõ áp dụng cookie flags, custom header và kiểm tra Origin/Referer trước thay đổi phiên/cookie, nguồn không tin cậy trả 403. Ghi duyệt chính sách; chưa có giải thích độc lập hoặc test, giữ mức hiểu hiện hành. Chuyển sang giải thích refresh đồng thời.

- FB-002 / origin và Vite proxy ngày 2026-11-04: người học hỏi “Origin là gì? port hả?”. Mentor giải thích origin gồm scheme/hostname/port, path không thuộc origin; hai port khác nhau là khác origin và Vite proxy giúp FE gọi API qua origin frontend. Người học chọn “Ok dùng vite proxy”. Ghi nhận duyệt proxy local, chưa có giải thích độc lập hoặc chạy cấu hình; không suy ra duyệt toàn bộ CSRF, giữ mức hiểu hiện hành.

- FB-002 / CSRF ngày 2026-11-04: người học nói không rành CSRF/bảo mật và yêu cầu mentor đề xuất, giải thích. Mentor đề xuất same-origin, refresh cookie HttpOnly/Secure/SameSite=Lax/host-only, custom header kết hợp kiểm tra Origin/Referer chính xác và không mở CORS nguồn lạ. Đây là kiến thức mentor cung cấp, chưa phải câu trả lời hoặc quyết định duyệt của người học; giữ mức hiểu hiện hành, chưa có code/test.

- FB-002 / duyệt response logout ngày 2026-11-04: người học xác nhận “Ok.” cho 204/no body khi thành công hoặc logout lặp/cookie thiếu/đã thu hồi, không yêu cầu access còn hạn và không báo thành công nếu DB lỗi. Ghi nhận quyết định; chưa có lời giải thích độc lập hoặc test mới, giữ mức hiểu hiện hành. Bước học tiếp: cookie HttpOnly và CSRF.

- FB-002 / duyệt luồng logout ngày 2026-11-04: người học xác nhận “Ok đồng ý.” sau giải thích thu hồi refresh nhóm A trong DB, backend xóa cookie HttpOnly và FE dọn access, giữ B; access bị sao chép còn có thể hợp lệ tới expiry. Ghi nhận duyệt luồng, chưa có giải thích độc lập mới hoặc test; giữ mức hiểu hiện hành. Response/logout lặp còn chờ review.

- FB-002 / logout ngày 2026-11-04: người học đề xuất thu hồi refresh ở A, giữ B nhưng nói chưa chắc; với access token, đề xuất xóa ở frontend A và thừa nhận chưa biết thêm. Đúng phạm vi phiên hiện tại và thao tác dọn access phía FE. Còn thiếu phân biệt thu hồi refresh trong database với xóa cookie, và access bị sao chép vẫn có thể hợp lệ đến hết hạn. Mentor bổ sung các điểm này; chưa có xác nhận áp dụng hoặc test, giữ mức hiểu hiện hành.

- FB-002 / duyệt reuse và dừng buổi ngày 2026-11-03: người học xác nhận “Ok.” cho token refresh cũ dùng lại trả 401, thu hồi refresh nhóm phiên đó, giữ nhóm khác; access đã cấp còn hạn tối đa 15 phút. Ghi nhận duyệt hành vi và kết thúc buổi, chưa có lời giải thích độc lập/test reuse/concurrency; giữ mức hiểu hiện hành.

- FB-002 / xác nhận rotation và điểm dừng ngày 2026-11-03: người học trả lời “Ok đi tiếp phần tiếp theo” sau giải thích cấp mới cả hai token, lưu hash/metadata, đánh dấu cũ/ghi mới nguyên tử, giữ hash cũ và hạn tuyệt đối 7 ngày; yêu cầu tìm điểm dừng vì session dài. Ghi nhận đồng ý hướng thiết kế, chưa có lời giải thích độc lập mới hoặc test; reuse/concurrency còn chờ review, giữ mức hiểu hiện hành.

- FB-002 / đề xuất rotation ngày 2026-11-03: người học tự đề xuất khi refresh cấp mới accessToken và refreshToken, lưu refresh token trong database. Đúng ý cơ bản rotation và quản lý token server. Chưa nêu hash/đánh dấu token cũ/transaction/reuse; mentor bổ sung access JSON, refresh Set-Cookie HttpOnly, DB lưu hash và metadata, đánh dấu cũ/ghi mới nguyên tử, giữ hash cũ đến hạn. Ghi nhận bằng chứng một phần, chưa có thực hành/test hoặc giải thích đầy đủ JWT/refresh/concurrency, giữ mức hiểu tổng thể hiện hành.

- FB-002 / auth me ngày 2026-11-03: người học xác nhận “Ok.” cho GET /auth/me dùng access token, đọc User hiện hành, bộ trường tài khoản và lỗi 401; khách bị chặn vẫn gọi được. Ghi nhận duyệt hợp đồng, chưa có giải thích độc lập/test mới; giữ mức hiểu hiện hành.

- FB-002 / hợp đồng login ngày 2026-11-03: người học xác nhận “Ok.” cho POST /auth/login, response access token/user và refresh cookie, lỗi 401 thông tin sai/400 body sai, khách bị chặn vẫn đăng nhập. Ghi nhận duyệt hợp đồng chính; chưa có giải thích độc lập mới hoặc test JWT/refresh/cookie, giữ mức hiểu hiện hành.

- FB-002 / response đăng ký ngày 2026-11-03: người học xác nhận “Ok.” cho 201/data khách, 409 email đã tồn tại, 400 validation và đăng nhập riêng sau đăng ký. Ghi nhận duyệt hợp đồng; chưa có lời giải thích độc lập hoặc test mới, giữ mức hiểu hiện hành.

- FB-002 / validation đăng ký ngày 2026-11-03: người học xác nhận “Ok.” cho đề xuất name/email/password và lỗi validation: name chuẩn hóa 1–100, email trim/lowercase/đúng định dạng/tối đa 254, password 15–128 giữ nguyên nội dung, không nhận trường thừa. Ghi nhận duyệt thiết kế, chưa có giải thích độc lập hoặc thực hành/test mới; giữ mức hiểu hiện hành.

- FB-002 / thay đổi tạo tài khoản ngày 2026-11-03: người học hỏi mật khẩu do admin tạo được cấp thế nào. Sau giải thích admin biết mật khẩu và khuyến nghị khách tự đăng ký, người học yêu cầu làm theo đề xuất; áp dụng bỏ admin tạo khách, khách tự đặt mật khẩu. Các ghi nhận duyệt admin tạo khách trước đó là lịch sử đã thay thế. Không có câu trả lời độc lập/test mới về hash hoặc xác thực; giữ mức hiểu hiện hành.

- FB-002 / mục đích lịch sử chặn ngày 2026-11-03: người học hỏi xem booking-block history để làm gì; mentor giải thích ai thao tác/khi nào/vì sao và phân biệt cờ hiện tại trên User. Người học xác nhận “À Ok hiểu rồi chốt đi.” cho API lịch sử. Chưa có giải thích độc lập hoặc code/test mới, giữ mức hiểu hiện hành.

- FB-002 / response chặn đặt ngày 2026-11-03: người học xác nhận “Ok.” cho response 200/data id/isBookingBlocked/changed, reason 1–500 sau trim, các lỗi 400/404/401/403 và thứ tự kiểm tra. Ghi nhận duyệt hợp đồng; chưa có giải thích độc lập/test mới, giữ mức hiểu hiện hành.

- FB-002 / trạng thái chặn không đổi ngày 2026-11-03: người học xác nhận “Ok.” cho 200/changed=false không thêm lịch sử khi trạng thái đã đúng, changed=true ghi lịch sử khi thay đổi, reason vẫn hợp lệ. Ghi nhận duyệt hành vi; chưa có lời giải thích độc lập/test retry hoặc concurrency, giữ mức hiểu hiện hành.

- FB-002 / body chặn đặt ngày 2026-11-03: người học xác nhận “Ok.” cho endpoint PATCH booking-block, body isBookingBlocked/reason, chỉ ADMIN/đích CUSTOMER và cập nhật trạng thái/lịch sử nguyên tử. Ghi nhận duyệt thiết kế, chưa có câu trả lời độc lập về retry/concurrency hoặc test; giữ mức hiểu hiện hành.

- FB-002 / quyền quản lý khách ngày 2026-11-03: người học hỏi admin chỉ cập nhật isBookingBlocked cho CUSTOMER, sau giải thích xác nhận “Ok duyệt.”. Ghi duyệt tạo CUSTOMER và phạm vi sau tạo chỉ chặn/mở chặn có lý do/lịch sử; chưa có admin sửa hồ sơ/role hoặc chặn ADMIN. Chưa có giải thích độc lập mới hoặc test transaction/RBAC, giữ mức hiểu hiện hành.

- FB-002 / danh sách khách ngày 2026-11-03: người học xác nhận “Ok.” cho GET /admin/customers chỉ ADMIN, lọc chặn đặt, phân trang/data/meta và lỗi; không trả mật khẩu/hash/token. Ghi nhận duyệt hợp đồng, chưa có giải thích độc lập/test mới; giữ mức hiểu hiện hành.

- FB-002 / danh sách sân admin ngày 2026-11-03: người học xác nhận “Ok.” cho GET /admin/courts gồm sân vô hiệu hóa, lọc branchId/playersPerTeam/isActive, phân trang, data/meta và lỗi. Ghi nhận duyệt hợp đồng; chưa có lời giải thích độc lập/test mới, giữ mức hiểu hiện hành.

- FB-002 / response sửa sân ngày 2026-11-03: người học xác nhận “Ok.” cho response 200, các lỗi và cập nhật nhiều trường nguyên tử (ví dụ tên trùng thì giá cũng không đổi). Ghi nhận duyệt thiết kế, chưa có lời giải thích độc lập mới/test transaction hoặc concurrency; giữ mức hiểu hiện hành.

- FB-002 / body sửa sân ngày 2026-11-03: người học xác nhận “Ok.” cho PATCH chỉ ADMIN, sửa name/playersPerTeam/pricePerSlot/isActive, trường không gửi giữ nguyên, ít nhất một trường, không áp mặc định isActive và không cho đổi branchId. Ghi nhận duyệt thiết kế; chưa có giải thích độc lập/test mới, giữ mức hiểu hiện hành.

- FB-002 / validation chi tiết tạo sân ngày 2026-11-03: người học xác nhận “Ok.” cho tên 1–100 sau chuẩn hóa, lỗi 400 khi field thừa, 409/COURT_NAME_CONFLICT khi trùng trong chi nhánh. Ghi nhận duyệt hợp đồng; chưa có giải thích độc lập/test mới, giữ mức hiểu hiện hành.

- FB-002 / phạm vi tên duy nhất ngày 2026-11-03: người học hỏi khuyến nghị có hợp lý không; mentor sửa từ toàn hệ thống sang trong mỗi chi nhánh và giải thích mô hình Branch. Người học đồng ý “Ừm.”. Ghi nhận duyệt chính sách cùng chuẩn hóa/hiển thị chi nhánh đã đề xuất; chưa có giải thích độc lập mới về unique/concurrency, giữ mức hiểu hiện hành. Ghi nhận trước về phạm vi chờ chốt là lịch sử.

- FB-002 / tên sân duy nhất ngày 2026-11-03: người học chọn cấm trùng tên vì muốn hạn chế rủi ro/hiểu lầm. Ghi nhận quyết định nghiệp vụ, chưa nêu rõ phạm vi hoặc chuẩn hóa; không coi là đã hiểu unique index/concurrency. Chi tiết toàn hệ thống, chuẩn hóa và 409 do mentor đề xuất, chờ duyệt; giữ mức hiểu hiện hành.

- FB-002 / response tạo sân ngày 2026-11-03: người học xác nhận “Ok duyệt.” cho response 201/data sân, các mã lỗi validation/chi nhánh/xác thực/quyền và thứ tự kiểm tra. Đây là duyệt thiết kế, chưa có lời giải thích độc lập/test mới; giữ mức hiểu hiện hành.

- FB-002 / duyệt tạo sân ngày 2026-11-03: người học xác nhận “Ok hợp lý.” cho POST /admin/courts chỉ ADMIN, body branchId/name/playersPerTeam/pricePerSlot và isActive tùy chọn mặc định true, địa chỉ từ Branch. Ghi nhận duyệt thiết kế, chưa có giải thích độc lập/test mới; giữ mức hiểu hiện hành.

- FB-002 / body tạo sân ngày 2026-11-03: người học nêu tên/địa chỉ/giá và yêu cầu mentor bổ sung từ Court để duyệt. Đúng phần tên/giá; cần chỉnh địa chỉ thuộc Branch, Court liên kết qua branchId theo thiết kế đã chốt. Mentor đề xuất thêm playersPerTeam và isActive tùy chọn; chưa duyệt hoặc có giải thích độc lập mới, giữ mức hiểu hiện hành.

- FB-002 / khung API availability ngày 2026-11-03: người học xác nhận “Oke.” cho endpoint GET công khai, khung 200/success/message/data gồm courtId/date/durationMinutes/availableStarts và thời điểm UTC/UI giờ Việt Nam. Ghi nhận duyệt hợp đồng; chưa có giải thích độc lập mới hoặc thực hành, giữ mức hiểu hiện hành.

- FB-002 / lỗi sân availability ngày 2026-11-03: người học xác nhận “Ok hợp lý.” cho lỗi courtId/trạng thái sân và thứ tự validate → tìm sân → kiểm tra trạng thái, phân biệt sân hoạt động hết giờ với sân vô hiệu hóa. Đây là duyệt đề xuất, chưa có giải thích độc lập hoặc test; giữ mức hiểu hiện hành.

- FB-002 / validation availability ngày 2026-11-03: người học xác nhận “Ok.” cho quy tắc date/durationMinutes và lỗi 400/VALIDATION_ERROR, chỉ trả giờ tương lai khi chọn hôm nay. Đây là duyệt thiết kế; chưa có giải thích độc lập/test, giữ mức hiểu hiện hành.

- FB-002 / response availability ngày 2026-11-03: người học duyệt availableStarts là danh sách startAt/endAt sắp sớm đến muộn, rỗng nếu không còn giờ phù hợp. Ghi nhận quyết định, chưa có giải thích độc lập hoặc test; giữ G1-03/G1-06 Cần ôn.

- FB-002 / duyệt luồng chọn giờ ngày 2026-11-03: người học diễn giải chọn thời lượng trước rồi chọn giờ để đánh giá có thuê được; mentor làm rõ backend lọc giờ đủ thời lượng trước khi khách chọn, người học xác nhận “đúng rồi”. Ghi nhận duyệt luồng, chưa có ví dụ tự áp dụng về chồng lấn hoặc giải thích lại việc kiểm tra khi đặt; giữ G1-03/G1-06 Cần ôn. Không suy ra duyệt response/mã lỗi.

- FB-002 / availability ngày 2026-11-03: người học chưa rõ bài tập, hỏi 18:30–20:00 có trùng booking 19:00–20:00 và yêu cầu đề xuất. Mentor giải thích có trùng; hai khoảng tiếp giáp không trùng, đề xuất API trả các giờ bắt đầu đủ thời lượng liên tiếp. Chưa có câu trả lời áp dụng hoặc duyệt; G1-03/G1-06 giữ Cần ôn.

- FB-002 / nền tảng transaction ngày 2026-11-03: người học nói chưa hình dung transaction và yêu cầu video YouTube. Mentor chuyển sang BEGIN/COMMIT/ROLLBACK với ví dụ Booking/BookingSlot, cung cấp video HowKteam và đoạn 2:00–7:00 của Hussein Nasser. Chưa có câu trả lời giải thích hoặc bài thực hành; không đánh dấu đã hiểu transaction/ACID/row lock, chưa duyệt phương án khóa User.
- FB-002 / giới hạn 3 booking ngày 2026-11-03: khi người học yêu cầu tiếp tục, mentor đề xuất khóa dòng User trong transaction Read Committed trước khi đếm và tạo booking; minh họa hai request cùng thấy 2 booking nếu không phối hợp. Chưa có câu trả lời hoặc quyết định duyệt của người học; không tự đánh giá đã hiểu row lock/isolation/transaction.
- FB-002 / chọn phương án chống trùng ngày 2026-11-03: sau khi mentor so sánh exclusion constraint trên Booking với bảng BookingSlot và partial unique index, người học chọn phương án 2. Đã chốt hướng mô hình BookingSlot; không coi lựa chọn là bằng chứng tự giải thích concurrency/transaction/index hoặc duyệt mọi chi tiết SQL/FK. Giữ nguyên mức hiểu, các mục chờ duyệt trước đây là lịch sử trước quyết định này.
- FB-002 / ôn bất biến chồng lấn ngày 2026-11-03: khi sân A đã có booking 19:00–20:30 chưa hủy, người học trả lời cả yêu cầu 19:30–20:00 và 20:30–21:00 đều được chấp nhận. Review: đúng trường hợp tiếp giáp 20:30–21:00; cần sửa trường hợp 19:30–20:00 vì toàn bộ khoảng này nằm trong booking đang có. Mentor minh họa từng slot và sẽ kiểm tra lại với một ví dụ nhỏ. Giữ G1-03 Cần ôn; chưa chuyển sang cơ chế bảng/index, không xóa bằng chứng trả lời đúng trước đây.
- FB-002 / yêu cầu cách giảng ngày 2026-11-03: người học yêu cầu phân tích từng bước và giải thích quy tắc dẫn đến đề xuất BookingSlot, thay vì chỉ đưa kết quả để duyệt. Đây là yêu cầu về cách học, không phải bằng chứng đã hiểu hoặc đã duyệt mô hình. Mentor quay lại bất biến không chồng lấn và ví dụ trước khi lựa chọn bảng/ràng buộc; giữ nguyên mức hiểu.
- FB-002 / yêu cầu đề xuất bảng ngày 2026-11-03: người học yêu cầu mentor phác thảo các bảng để duyệt. Mentor tổng hợp Court/Booking đã có và đề xuất BookingSlot(id/bookingId/courtId/startAt/releasedAt), partial unique index cho slot chưa giải phóng, ghi/hủy nguyên tử và giữ lịch sử. Đây là phương án mentor cung cấp, đang chờ duyệt; không ghi thành câu trả lời hoặc mức hiểu độc lập của người học.
- FB-002 / nhận diện sân của slot ngày 2026-11-03: người học đề xuất tên sân và id sân để phân biệt các slot cùng ngày/giờ trên sân khác nhau. Đúng về nhận diện sân; mentor cụ thể hóa courtId liên kết Court.id, giải thích tên có thể trùng/đổi và lấy qua quan hệ để hiển thị. Chưa coi là người học tự xác định FK hoặc ràng buộc unique. Bước tiếp theo là xác định liên kết slot với booking để hủy đúng các slot; giữ nguyên mức hiểu tổng thể.
- FB-002 / slot chiếm chỗ ngày 2026-11-03: người học xác định ngày và giờ là quan trọng để hiển thị chính xác cho FE. Đúng về thông tin thời gian; chưa liệt kê trường cụ thể, sân hoặc booking liên quan, chưa giải thích cơ chế chống trùng. Mentor bổ sung mục đích backend kiểm tra chiếm chỗ và đưa ví dụ hai sân cùng thời điểm để người học xác định thông tin còn thiếu. Giữ nguyên mức hiểu; chưa chốt schema/index.
- Duyệt bỏ lý do trùng ngày 2026-11-02: người học đồng ý bỏ User.bookingBlockReason, giữ isBookingBlocked hiện tại và reason trong từng dòng BookingBlockHistory; không cần User tham chiếu ngược lịch sử. Đây là quyết định thiết kế sau phản biện của người học, chưa có lời giải thích độc lập về transaction/truy vấn/index; không nâng mức hiểu triển khai. Ghi nhận trước về reason gần nhất trên User đã bị thay thế.
- FB-002 / phản biện lý do chặn ngày 2026-11-02: người học hỏi có cần tham chiếu lịch sử và tại sao reason vẫn còn sau mở chặn. Đã nhận ra mâu thuẫn ngữ nghĩa của trường lý do gần nhất so với trạng thái hiện tại. Mentor đề xuất bỏ User.bookingBlockReason, giữ cờ User và reason trên từng sự kiện lịch sử, FK history.userId đủ liên kết; chưa được người học duyệt. Không coi câu hỏi là đã tự thiết kế transaction/truy vấn lịch sử.
- Chốt phạm vi ghi chú/lịch sử ngày 2026-11-02: sau trao đổi công dụng và tracing, người học xác định CustomerNote có thể quản lý ở app khác, BookingBlockHistory giữ trong hệ thống. Đã bỏ ghi chú khỏi phạm vi app, giữ lịch sử chặn/mở chặn; không chọn hay tích hợp app bên ngoài. Các trường/transaction do mentor đề xuất, không tự coi người học đã giải thích cơ chế DB. Những xác nhận ghi chú nội bộ trước đây là lịch sử, đã được thay đổi phạm vi.
- Đề xuất lưu ghi chú/lịch sử ngày 2026-11-02: mentor cung cấp CustomerNote và BookingBlockHistory để review sau khi duyệt auth; chưa có câu trả lời/duyệt của người học về hai bảng này, không tự nâng mức hiểu audit/transaction.
- Duyệt auth cơ bản ngày 2026-11-02: người học đồng ý phương án access 15 phút, refresh hạn tuyệt đối 7 ngày, rotation, HttpOnly cookie và bảng riêng lưu hash; được thông báo logout thu hồi refresh còn access có thể sống tối đa 15 phút. Đây là xác nhận phương án mentor, chưa tự giải thích rotation/CSRF/reuse hoặc có code/test. Không coi chi tiết xử lý đồng thời/đa tab và các trường bảng là đã được review riêng. Giữ nguyên mức hiểu.
- FB-002 / duyệt User và thêm refresh ngày 2026-11-02: người học duyệt khung User chỉ chặn đặt mới rồi yêu cầu thêm refresh token. Đã mở rộng phạm vi auth có refresh/logout; phương án thời hạn 15 phút/7 ngày, rotation/cookie và bảng token riêng là đề xuất mentor, chưa duyệt chi tiết. Không ghi User có một trường token rõ, không tự coi người học đã hiểu rotation/CSRF/thu hồi JWT hoặc nâng mức hiểu.
- Chốt bỏ mức khóa ngày 2026-11-02: người học xác nhận chỉ chặn đặt mới, bỏ khóa tài khoản sau khi chủ động phản biện mức khóa dư với bản đầu. Đã sửa khung User bỏ isLocked/lockReason và đồng bộ chính sách; giữ isBookingBlocked, lý do chặn/mở chặn, quyền đăng nhập/xem/hủy hợp lệ và giữ booking. Bằng chứng trước về hiểu hai cờ độc lập vẫn là lịch sử học, không phải chính sách hiện hành. User còn lại chưa được duyệt toàn bộ, không tự nâng mức hiểu JWT/concurrency từ câu xác nhận.
- FB-002 / xem lại hai hạn chế ngày 2026-11-02: người học hỏi lý do chặn/khóa rồi nhận xét chỉ cần chặn, khóa có vẻ dư và yêu cầu xem xét. Mentor khuyến nghị bỏ mức khóa cho bản đầu do chưa có mục tiêu cốt lõi riêng cần cấm toàn bộ API cá nhân; chưa chốt thay đổi. Không rút lại bằng chứng người học trước đó hiểu hai cờ độc lập: đây là đánh giá lại phạm vi, không phải lỗi kiến thức. User vẫn chưa duyệt; chưa đổi mức hiểu.
- Duyệt Branch/Court ngày 2026-11-02: người học duyệt toàn bộ bộ trường đã sửa, Branch có address, Court lấy địa chỉ qua branchId. Các trường còn lại do mentor đề xuất; đây là xác nhận thiết kế, không tự nâng mức hiểu schema/validation. Mentor tiếp tục đề xuất User, đang chờ duyệt, chưa coi các trường auth/hạn chế là người học tự thiết kế.
- FB-002 / vị trí địa chỉ ngày 2026-11-02: người học phản biện address nên đặt ở chi nhánh. Mentor đồng ý theo mô hình một Branch là một địa điểm có nhiều Court; sửa thành Branch.address, Court lấy địa chỉ qua branchId, tránh lặp địa chỉ. Đây là phản biện thiết kế thực tế của người học, không phải tự động đồng ý toàn bộ các trường Branch/Court còn lại. Chưa có schema/test.
- FB-002 / trường Branch–Court ngày 2026-11-02: người học yêu cầu mentor đề xuất. Mentor cung cấp Branch(id/name/createdAt/updatedAt), Court(id/branchId/name/address/pricePerSlot/isActive/createdAt/updatedAt), giải thích vô hiệu hóa sân và giữ địa chỉ Court. Đang chờ duyệt; không coi các trường là người học tự thiết kế hoặc bằng chứng hiểu timestamp/validation.
- FB-002 / Branch–Court ngày 2026-11-02: người học tự xác định Branch có nhiều Court, mỗi Court thuộc một Branch, khóa ngoại ở Court. Đúng quan hệ và vị trí FK; mentor bổ sung tên Court.branchId, đích Branch.id và phía Branch có thể chưa có Court. Chưa coi tên/kiểu ID/hành vi xóa là phần người học tự thiết kế. Đã có bằng chứng vận dụng lại quan hệ một–nhiều, chưa có schema/migration/test.
- FB-002 / nhóm địa điểm ngày 2026-11-02: người học tự đề xuất bảng chi nhánh riêng rồi liên kết với Court. Mentor nhận xét phù hợp nhu cầu nhóm sân và tránh lặp tên, đề xuất tên code Branch. Chưa có câu trả lời về số lượng liên kết/khóa ngoại hoặc trường Branch, không ghi phần này đã hiểu đủ thiết kế quan hệ. Chưa mở rộng quyền theo chi nhánh.
- FB-002 / kiểu cột tiền ngày 2026-11-02: người học yêu cầu mentor làm tiếp phần kiểu cột/trần giá. Mentor tra nguồn PostgreSQL/Prisma và chọn integer/Int, trần giá mỗi slot floor(2147483647/4) = 536870911, tổng 4 slot tối đa 2147483644; đã cập nhật thiết kế và quy tắc kỹ thuật, chưa triển khai. Không ghi là người học tự chọn hoặc đã hiểu tràn số/SQL CHECK; cần ôn bằng ví dụ sau.
- FB-002 / giá dương ngày 2026-11-02: người học hỏi slot là gì/trường nằm ở đâu; mentor phân biệt slot cơ sở 30 phút với Court.pricePerSlot và bản sao Booking.pricePerSlot, tổng Booking.totalPrice. Sau giải thích, người học nói đã hiểu và đồng ý “slot phải lớn hơn 0”, được diễn đạt chính xác là giá mỗi slot > 0. Chốt không nhận giá 0/âm/phần lẻ đồng; không coi xác nhận này là bằng chứng tự thiết kế bảng slot hoặc ràng buộc DB. Kiểu cột/giới hạn trên chưa chốt, không nâng mức hiểu chỉ từ xác nhận.
- Duyệt đơn vị tiền ngày 2026-11-02: người học đồng ý đề xuất số nguyên VND, ví dụ 150000 là 150.000đ. Đây là xác nhận lựa chọn mentor cung cấp; chưa tự giải thích sai số dấu phẩy động hoặc chọn kiểu cột/ràng buộc. Không nâng mức hiểu từ câu đồng ý; giá 0/giới hạn trên chưa chốt.
- Duyệt giá lịch sử ngày 2026-11-02: người học hỏi xác nhận tăng giá Court thì dữ liệu Booking cũ vẫn giữ nguyên, sau giải thích đã đồng ý. Ghi nhận đã duyệt phương án Court.pricePerSlot, Booking.pricePerSlot/totalPrice theo đề xuất mentor; giữ G1-05 theo bằng chứng trước, chưa tự nâng mức hiểu kiểu tiền/schema hoặc coi câu xác nhận là tự thiết kế snapshot.
- FB-002 / giá lịch sử ngày 2026-11-02: người học nêu admin sửa giá Court, Booking phải lấy nguồn giá từ Court. Đúng nguồn giá, chưa nêu thời điểm đọc hoặc trường snapshot; không kết luận người học chọn tính lại giá động. Mentor phân biệt lấy khi tạo/lưu vào Booking với đọc Court mỗi lần xem, đề xuất Court.pricePerSlot và Booking.pricePerSlot/totalPrice. Giữ G1-05 Đã giải thích được theo bằng chứng trước, không rút lại hay tự nâng mức hiểu thiết kế tiền từ câu trả lời này.
- Duyệt trạng thái ngày 2026-11-02: người học xác nhận duyệt trọn phương án CONFIRMED/CANCELLED, cancelledAt/cancelledById, nhãn thời gian suy ra và giữ lịch sử. Đây là xác nhận thiết kế do mentor cung cấp, chưa có lời giải thích độc lập về chuyển trạng thái/transaction hoặc code/test; không nâng mức hiểu chỉ từ câu duyệt.
- FB-002 / trạng thái ngày 2026-11-02: người học yêu cầu mentor đề xuất trọn phần để chỉ duyệt. Mentor đề xuất CONFIRMED/CANCELLED, cancelledAt/cancelledById và nhãn sắp tới/đang diễn ra/đã kết thúc suy ra từ thời gian. Chưa được người học duyệt, chưa coi là hiểu enum/chuyển trạng thái/transaction hoặc nâng mức hiểu.
- FB-002 / dữ liệu thời gian ngày 2026-11-02: người học yêu cầu “đề xuất luôn”, chưa tự đề xuất trường. Mentor cung cấp `startAt`, `endAt`, `createdAt`, backend tính kết thúc từ thời lượng, lưu UTC/hiển thị giờ Việt Nam; thời lượng suy ra từ hiệu hai thời điểm. Không ghi phương án mentor thành bằng chứng người học hiểu thời gian/múi giờ hoặc nâng mức hiểu. Chưa có schema/test backend.
- FB-002 / khóa ngoại Court ngày 2026-11-02: người học giải thích đúng khóa ngoại nằm phía nhiều (Booking) vì mỗi Booking chỉ có một Court, mỗi Court có nhiều Booking. Mentor bổ sung tên `Booking.courtId` và tham chiếu `Court.id`; chưa ghi tên/đích tham chiếu là câu trả lời độc lập của người học. Đã có bằng chứng hiểu vị trí khóa ngoại hai quan hệ; kiểu ID/schema/migration còn chưa học ở ticket này.
- FB-002 / khóa ngoại User ngày 2026-11-02: người học tự đặt khóa ngoại ở Booking, tên `userId`, giải thích đúng do User–Booking một–nhiều và mỗi Booking thuộc một User. Mentor bổ sung đích tham chiếu `User.id`, tính bắt buộc và việc khóa ngoại không tự giới hạn số booking/kiểm tra quyền. Đã có bằng chứng hiểu vị trí/tên khóa ngoại User; chưa có câu trả lời về Court, kiểu ID hoặc hành vi xóa.
- FB-002 / G1-04 — Court–Booking ngày 2026-11-02: người học tự xác định một Court có nhiều Booking, mỗi Booking thuộc đúng một Court. Đúng quan hệ một–nhiều; kết hợp câu User–Booking trước đó, đã mô tả đúng hai quan hệ lõi và trước đó giải thích giữ lịch sử khi hủy. G1-04 chuyển Đã giải thích được ở mức quan hệ/nghiệp vụ; chưa xác nhận hiểu khóa ngoại, migration hoặc cơ chế chống trùng. Mentor cụ thể hóa 0 hoặc nhiều và vẽ Mermaid trong DESIGN; chưa phải người học tự vẽ ERD.
- Chốt thời lượng ngày 2026-11-02: người học đồng ý tối đa 120 phút mỗi booking, lựa chọn 30/60/90/120 theo đề xuất mentor. Kết hợp 3 booking tương lai chưa hủy thì giữ tối đa 360 phút mỗi tài khoản; đây là hệ quả tính toán do mentor nêu, chưa phải câu trả lời độc lập. Chưa nâng mức hiểu validation hay cơ chế chống lạm dụng, chưa có code/test.
- Đề xuất thời lượng ngày 2026-11-02: người học nói chưa từng đi đá bóng/vận hành sân và yêu cầu mentor đề xuất. Mentor đề xuất 120 phút sau khi tra cứu ví dụ chính sách của đơn vị vận hành; không coi là kinh nghiệm người học, chuẩn ngành hoặc quyết định đã chốt. Chưa thay mức hiểu.
- Chốt giới hạn giữ chỗ ngày 2026-11-02: người học đồng ý đề xuất tối đa 3 booking tương lai chưa hủy mỗi tài khoản khách. Chưa trả lời thời lượng tối đa, không coi câu đồng ý là chọn một ngưỡng thời lượng. Mentor cụ thể hóa kiểm tra đồng thời và cách đếm; chưa có lời giải độc lập/cơ chế code của người học, giữ nguyên mức hiểu.
- FB-002 / rủi ro giữ chỗ ngày 2026-11-02: người học tự phát hiện một tài khoản có thể chiếm nhiều khung giờ rồi không đến và đề xuất giới hạn. Đúng về rủi ro; ví dụ cả tháng vượt cửa sổ đặt hiện tại hôm nay đến hôm nay + 7 ngày. Mentor phân biệt giới hạn mỗi tài khoản với chống nhiều tài khoản, đề xuất ngưỡng để thảo luận; chưa có quyết định cuối hoặc bằng chứng triển khai.
- FB-002 / G1-04 ngày 2026-11-02: người học tự xác định một User có thể có nhiều Booking, mỗi Booking thuộc đúng một User. Đúng quan hệ một–nhiều User–Booking; chưa trả lời Court–Booking, chưa chốt khóa ngoại/schema. Từ “thoải mái” được hiểu là quan hệ cho phép nhiều bản ghi, không bỏ các điều kiện thời gian, tài khoản, slot hay các quy tắc đặt đã chốt; chưa thêm giới hạn số booking mỗi khách. Giữ G1-04 Cần ôn đến khi review đủ quan hệ còn lại.
- Review ranh giới hủy ngày 2026-11-02: người học tự trả lời “đúng 18:00 thì vẫn được, còn 18:01 thì không” cho booking bắt đầu 19:00. Đúng theo hạn ít nhất 60 phút; mentor bổ sung 18:00 còn 60 phút, 18:01 còn 59 phút. Đã áp dụng đúng ranh giới mới. FB-001 nghiệm thu DONE dựa trên đặc tả và review nghiệp vụ; G1-02/G1-03 giữ Cần ôn cho các phần chưa giải thích đủ, chưa xác nhận hiểu transaction/database/API.
- Chốt ghi chú khách ngày 2026-11-02: người học đồng ý ghi chú chỉ admin xem/ghi, mô tả sự việc cụ thể. Mentor cụ thể hóa bảo vệ bằng backend, không trả ghi chú cho khách và không tự hạn chế tài khoản. Đây là xác nhận phạm vi, chưa phải lời giải độc lập về RBAC/API; giữ nguyên mức hiểu. FB-001 chuyển IN_REVIEW sau rà soát tài liệu, còn chờ review ranh giới hạn hủy 60 phút.
- Chốt xử lý đổi giờ ngày 2026-11-02: người học chọn liên hệ admin trong bản đầu và yêu cầu cảnh báo trước xác nhận đặt sát giờ: “Booking này đã qua hạn tự hủy. Vui lòng kiểm tra kỹ giờ đến.” Chưa thêm tự đổi giờ/admin đặt hộ. Mentor cụ thể hóa hai thao tác hủy/đặt lại không giữ giờ mới, đặt lại dùng giá hiện hành và ranh giới cảnh báo dưới 60 phút; các chi tiết này chưa phải lời giải độc lập của người học. Giữ nguyên mức hiểu, chưa có UI/code/test.
- Thảo luận đổi giờ ngày 2026-11-02: người học tự phát hiện tình huống đặt sát giờ (18:45 đặt 19:00) rồi muốn dời sang 19:30 vì không kịp đến. Đây là đề xuất cần chốt nghiệp vụ, chưa phải xác nhận thêm chức năng. Mentor phân biệt đổi giờ với hủy và chỉ ra khả năng lách hạn hủy nếu đổi tự do; chưa coi phần phân tích mentor là câu trả lời của người học.
- Quy tắc hủy hiện hành, chốt ngày 2026-11-02: người học chọn hạn 60 phút sau khi tự nêu rủi ro hủy sát giờ. Mentor cụ thể hóa `now <= startAt - 60 phút`: booking 19:00 được hủy đến đúng 18:00, sau đó từ chối; admin được hủy riêng. Các ghi nhận 18:59 được hủy và `now < startAt` bên dưới thuộc quy tắc cũ, không còn áp dụng. Đã có bằng chứng người học phân tích rủi ro và chọn chính sách; chưa có câu trả lời độc lập về biểu thức/ranh giới hoặc code/test, không tự nâng mức hiểu toàn bộ câu hỏi.

- Xác nhận mở hạn chế ngày 2026-11-02: người học đồng ý mở khóa không tự mở chặn đặt và hỏi admin có được thay đổi chặn đặt mới không. Mentor xác nhận admin chặn/mở chặn và khóa/mở khóa độc lập, có lý do; mở chặn không tự mở khóa. Ghi nhận quyết định, chưa có bài giải thích hoặc code/test kiểm tra tổ hợp quyền; giữ nguyên mức hiểu.
- Xác nhận khóa tài khoản ngày 2026-11-02: người học đồng ý thêm mức khóa cho vi phạm nghiêm trọng, chặn đăng nhập/API cần đăng nhập kể cả token cũ; giữ tài khoản, lịch sử và không tự hủy booking. Đã phân biệt quyết định này với chặn đặt mới; xóa mềm không dùng xử phạt. Đây là xác nhận sau giải thích, chưa có lời giải thích độc lập về cơ chế vô hiệu hóa token hoặc code/test; giữ nguyên mức hiểu.
- Làm rõ mục đích xóa mềm: người học nêu không trả tiền khi trả tại sân, phá hoại sân và ẩu đả. Mentor phân biệt mục đích hạn chế tài khoản vi phạm với xóa mềm; đề xuất khóa tài khoản nếu cần cấm đăng nhập/API, chưa được chốt. Chưa có câu trả lời về hiệu lực token cũ, xử lý booking hoặc luồng thanh toán; giữ nguyên mức hiểu.
- Chốt quy tắc chặn đặt ngày 2026-11-02: sau khi hỏi tính hợp lý và nhận giải thích, người học đồng ý admin chặn/mở chặn thủ công, ghi lý do; chỉ chặn đặt mới, khách vẫn đăng nhập/xem/hủy booking cũ theo quy định. Không tự động chấm điểm; một lần hủy đúng hạn không đủ kết luận phá app. Đây là xác nhận quyết định sau giải thích, chưa phải tự giải thích cách thực thi hoặc bằng chứng code/test; giữ nguyên mức hiểu. Xóa mềm chưa chốt.
- Xác nhận tác động chặn đặt ngày 2026-11-02: người học đồng ý giữ nguyên booking hiện có khi chặn đặt mới; admin hủy riêng nếu cần. Quyết định này chưa áp dụng sang xóa mềm và chưa chốt quyền đăng nhập/xem/hủy. Không có lời giải thích cơ chế hoặc code/test mới; giữ nguyên mức hiểu.
- Xác nhận quản lý khách ngày 2026-11-02: người học đồng ý đề xuất tách ghi chú hành vi và chặn đặt mới thành hai thao tác; ghi chú không tự chặn. Chưa trả lời tác động lên booking hiện có, quyền đăng nhập/xem/hủy hoặc cách thực thi backend. Đây là quyết định nghiệp vụ được xác nhận, giữ nguyên mức hiểu.
- Quyết định phạm vi bổ sung ngày 2026-11-02: người học yêu cầu thêm quản lý tài khoản vào bản đầu; đề xuất địa chỉ trên sân và bộ chọn chi nhánh trước chọn sân. Mentor làm rõ cần nhóm địa điểm dùng chung để lọc, chưa quyết định schema. Quy tắc đánh dấu/xóa mềm và booking hiện có còn cần người học quyết định; chưa có bằng chứng thực thi quyền hoặc code/test, giữ nguyên mức hiểu.
- Bổ sung G1-01 về admin: người học đề xuất đặt sân bảo trì, đánh dấu khách xấu/troll, tạo/xóa mềm tài khoản và thêm sân có thể ở chi nhánh khác. Đã nêu nhu cầu vận hành; chưa liệt kê quyền xem/hủy booking toàn hệ thống và cập nhật giá theo README. Mentor đối chiếu phạm vi một cơ sở, đề xuất hoãn quản lý tài khoản và nhiều chi nhánh; chưa có quyết định của người học. Không coi đề xuất tính năng là bằng chứng hiểu cách thực thi quyền hoặc mô hình dữ liệu; giữ trạng thái câu hỏi.
- Bổ sung review ngày 2026-11-02: người học tự diễn đạt đúng sau mở khóa khách đăng nhập lại được, muốn đặt mới admin cần mở chặn đặt nữa (trong tình huống vẫn còn bị chặn đặt). Đã xác nhận hiểu sự độc lập của hai hạn chế ở mức nghiệp vụ; chưa đánh giá cơ chế JWT/code. Người học đề xuất cấm hủy sát giờ vì A hủy lúc 18:59 cho booking 19:00 có thể khiến sân không kịp nhận B; đây là rủi ro được lập luận, chưa có dữ liệu vận hành chứng minh tỷ lệ slot bỏ trống. Ngưỡng hủy chưa chốt, chưa thay quy tắc README.
- Review tổng hợp FB-001 ngày 2026-11-02: người học từ chối đúng B đặt 19:30–21:00 khi A giữ 19:00–20:00 cùng sân, vì đã có người thuê. Mentor chỉ rõ phần trùng 19:30–20:00 và bổ sung từ chối toàn bộ, không giữ đoạn 20:00–21:00; người học chưa tự trả lời phần giữ slot. Với câu hủy đúng 19:00 và mở khóa nhưng còn chặn đặt, người học yêu cầu mentor đề xuất, chưa đưa lời giải mới. Mentor giải thích theo quy tắc đã chốt: hủy đúng giờ bắt đầu bị từ chối, booking/slot giữ nguyên; chỉ mở khóa thì được đăng nhập/xem/hủy hợp lệ nhưng chưa được đặt mới cho đến khi admin mở chặn đặt riêng. Không rút lại kết quả review hủy trước đây; giữ nguyên mức hiểu, chưa coi lời giải mentor là bằng chứng người học tự giải thích.
- G1-01: Khách không được hủy booking của người khác; admin được phép. Bổ sung 2026-11-01: với booking 19:00–20:00, lúc 19:05 không cho khách hủy vì đang trong giờ booking; lúc 18:59 cho hủy, đúng 19:00 từ chối. Mentor: đúng theo README, đã xét đúng mốc trước và đúng giờ bắt đầu. Điều kiện `now < startAt` do mentor diễn đạt, chưa phải biểu thức người học tự viết. Mới trả lời phần quyền hủy, chưa đánh giá toàn bộ quyền khách/admin.
- G1-02: Khi hai khách tranh cùng sân/slot, người học đề xuất request chạm database trước được booking. Mentor: đúng hướng chỉ một người thắng; làm rõ thứ tự đến database không bảo đảm thứ tự ghi thành công. Với hai request hợp lệ, một tạo booking thành công, request còn lại nhận 409 và chỉ có một booking hiệu lực. Phần làm rõ và mã lỗi do mentor bổ sung; chưa đánh giá đầy đủ điều kiện đặt hợp lệ, chưa có code/test.
  Bổ sung review G1-02 về sân vô hiệu hóa: ban đầu người học cho rằng không giữ booking A, đúng phần chặn B đặt mới. Sau review, người học giải thích lại đúng: vô hiệu hóa sân giữ booking, admin hủy riêng và thông báo là thao tác khác. Mentor làm rõ admin chỉ hủy nếu cần, không bắt buộc; tự động gửi thông báo chưa thuộc bản đầu. Đã phân biệt được vô hiệu hóa sân với hủy booking; chưa review đủ các điều kiện đặt hợp lệ, chưa có code/test.
  Bổ sung điều kiện thời gian: lúc 18:30, với hai slot trống 18:00–19:00 và 19:00–20:00, người học chọn đúng 19:00–20:00. Mentor giải thích giờ bắt đầu phải ở tương lai; người học chưa tự nêu lý do. Khi xét ngày 08/11 và 09/11, người học làm rõ đã hiểu câu hỏi thành việc người khác đặt trùng ngày đó. Rút lại nhận xét cho rằng người học tính sai giới hạn ngày; chưa có câu trả lời đúng trọng tâm để đánh giá phần này. Mentor đã giải thích hôm nay 01/11 thì ngày cuối là 08/11. Chưa review giờ mở cửa; giữ Cần ôn do chưa review đủ điều kiện đặt hợp lệ.
  Sau khi làm rõ câu hỏi, người học tính đúng hôm nay 02/11 thì ngày cuối là 09/11, giải thích `2 + 7`. Đã áp dụng đúng giới hạn ngày đặt; phần này không còn ở mức chưa đánh giá. G1-02 vẫn Cần ôn vì chưa review đầy đủ các điều kiện, gồm giờ mở cửa.
  Bổ sung giờ hoạt động: người học chọn đúng slot 21:00–22:00, không chọn 22:00–23:00 khi sân mở 06:00–22:00. Mentor giải thích giới hạn giờ đóng cửa; người học chưa tự nêu lý do. Chưa review điều kiện slot bắt đầu đúng giờ.
- G1-03: Ban đầu người học chưa biết quy tắc slot bắt đầu đúng giờ; sau đó đề xuất đổi sang slot 30 phút và hỏi trường hợp đặt 90 phút. Đã xác nhận chọn giờ bắt đầu và thời lượng theo bội số 30 phút để khách có thêm lựa chọn. Mentor giải thích booking 90 phút chiếm ba slot liên tiếp, phải trống toàn bộ và đặt nguyên tử; người học sau đó từ chối đúng yêu cầu B đặt 19:30–21:00 khi A đã đặt 19:00–20:00 cùng sân, vì A đã đặt trước. Mentor chỉ rõ phần trùng 19:30–20:00. Đã nhận ra xung đột trong ví dụ. Với A đặt 19:00–20:00, B đặt 20:00–21:30, người học chấp nhận đúng vì A đã kết thúc và sân sau 20:00 còn trống. Đã phân biệt được chồng lấn và tiếp giáp; chưa review việc đặt nguyên tử hoặc cơ chế database. Nhận định thu hút khách là kỳ vọng sản phẩm, chưa có dữ liệu kiểm chứng. Quy tắc mới thay thế slot một giờ bắt đầu đúng giờ; các ghi chú review trước đó là lịch sử.
- Bổ sung G1-03 ngày 2026-11-02: với tình huống đặt 19:00–20:30 nhưng slot giữa đã bị chiếm, người học chưa biết chọn cách xử lý vì chưa rõ cách vận hành sân thực tế. Mentor giải thích theo phạm vi project: khách yêu cầu một khoảng chơi liên tục; từ chối toàn bộ, không giữ hai slot rời rạc. Đây là phần mentor giải thích, chưa có câu trả lời xác nhận hiểu; giữ Cần ôn, chưa đánh giá cơ chế database.
- Bổ sung G1-03 ngày 2026-11-02 sau giải thích: người học nêu đúng khách cần chơi liên tục 90 phút trong khoảng 19:00–20:30; vì có phần trùng nên không đáp ứng được, khách phải chọn khoảng khác không bị trùng ở giữa. Đã giải thích được nhu cầu liên tục và lý do không tự chia booking thành các khoảng rời rạc. Mentor xác nhận yêu cầu thất bại không giữ hai slot còn trống; người học chưa tự diễn đạt trạng thái lưu dữ liệu hoặc cơ chế transaction/database. Giữ Cần ôn cho các phần chưa review.
- G1-04: Người học chọn giữ bản ghi và đổi trạng thái khi hủy, để lưu thông tin người dùng đã hủy và hỗ trợ kiểm tra hành vi cố tình phá app; cũng đề cập nhu cầu dời giờ. Mentor: đúng phần giữ lịch sử; dời giờ chưa thuộc chức năng bản đầu, một lần hủy không đủ kết luận lạm dụng. Bổ sung: người học giải thích booking A đã hủy không ngăn B đặt lại, vì để sân trống ảnh hưởng doanh thu; đúng theo README. Chưa trả lời phần quan hệ User–Court–Booking; chưa kiểm chứng bằng code.
- G1-05: Booking cũ của A phải giữ giá cũ; người học giải thích cần giữ giá để thống kê doanh thu, việc đổi giá không liên quan đến lịch sử trước đó. Review 2026-11-01: đúng quy tắc lưu giá tại thời điểm đặt trong README. Mentor bổ sung mục đích giữ số tiền đã chốt với khách và phân biệt tổng giá booking với tiền thực thu vì bản đầu chưa có thanh toán. Bằng chứng: câu trả lời trong chat và ví dụ trong REQUIREMENTS.md; chưa kiểm chứng bằng code/test.
  Cập nhật đơn vị giá: người học đề xuất niêm yết giá mỗi 30 phút để dễ tính, thay cho giá mỗi giờ. Quy tắc mới là tổng giá = giá mỗi slot × số slot. Sau khi xác nhận giữ quy tắc, người học tính đúng booking 90 phút: 150.000đ × 3 slot; mentor nêu kết quả 450.000đ. Đã áp dụng đúng công thức theo đơn vị mới, chưa có code/test. Không thay đổi đánh giá đã hiểu nguyên tắc giữ giá lịch sử.
- Xác nhận ngày 2026-11-02: người học chốt luồng chọn thời lượng trước giờ bắt đầu và cách xử lý conflict đã đề xuất, nhận xét hợp lý và giảm hoang mang cho khách. Đây là quyết định được xác nhận, chưa có dữ liệu trải nghiệm khách hàng hoặc lời giải thích về cơ chế backend. Giữ nguyên mức hiểu G1-03/G1-06/G2-06; không tự nâng trạng thái vì đồng ý phương án.
- Bổ sung G1-03/G1-06: người học đề xuất hỏi thời lượng chơi trước khi chọn khung giờ. Mentor cụ thể hóa thành chọn thời lượng rồi giờ bắt đầu, tự tô các block liên tiếp và chỉ cho chọn khoảng đủ trống theo README. Chưa có xác nhận hiểu phần thuật toán hoặc thiết kế API; giữ nguyên trạng thái câu hỏi.
- Xác nhận nguồn danh tính ngày 2026-11-02: người học chỉ rõ userId nằm trong token. Mentor giải thích backend kiểm tra chữ ký/hạn token rồi lấy ID, không tin userId trong body; người học trả lời “đúng vậy”. Ghi nhận đã xác nhận quyết định danh tính từ token và body gồm courtId/startAt/durationMinutes; chưa coi xác nhận ngắn là bằng chứng tự giải thích cơ chế JWT hoặc kiểm tra quyền. Giữ nguyên mức hiểu, chưa có code/test.
- Bổ sung đầu vào đặt sân G1-06/G2-04/G2-05: người học nêu thông tin khách hàng, sân, ngày, thời lượng và giờ bắt đầu, yêu cầu mentor bổ sung. Mentor phân biệt body gồm mã sân/thời điểm bắt đầu/thời lượng; danh tính từ JWT đã xác thực; backend tự tính giờ kết thúc và giá. Minh họa ghép ngày/giờ theo Asia/Ho_Chi_Minh thành startAt có offset. Chưa có lời giải thích lại hoặc code/test để xác nhận hiểu cách bảo vệ danh tính và hợp đồng API; giữ nguyên mức hiểu.
- Bổ sung giao diện hủy: người học đồng ý đề xuất nút hủy và hộp xác nhận, chưa chọn vị trí nút giữa danh sách/chi tiết. Mentor chọn mặc định nút trên danh sách cho bản đầu, cụ thể hóa trạng thái sau phản hồi backend. Đây là xác nhận giao diện, chưa có lời giải thích mới về quyền/thời gian/transaction; giữ nguyên mức hiểu.
- Bổ sung luồng lịch cá nhân: người học xác nhận có mục “Lịch đặt của tôi” để xem lại booking. Mentor nhắc quyền sở hữu phải được backend bảo vệ, không chỉ lọc giao diện; đây chưa phải lời giải thích về kiểm tra quyền từ người học. Không thay đổi trạng thái hiểu chỉ vì đồng ý tính năng.
- Bổ sung kết quả đặt sân G1-06: người học đề xuất giao diện xác nhận lại ngày, giờ, tiền sau khi đặt thành công. Mentor bổ sung mã booking, tên sân, thời lượng, trạng thái, nút xem lịch cá nhân; dùng dữ liệu booking backend đã lưu và chỉ hiển thị thành công khi có phản hồi thành công. Chưa tự thiết kế response/mã lỗi hoặc có code/test; giữ nguyên trạng thái câu hỏi.
- G1-06: Khi được hỏi thông tin khách cần chọn để đặt sân, người học đề xuất giao diện trục thời gian ngang, chia block 30 phút; đỏ là không được chọn, xanh là đang chọn, không màu là trống. Bổ sung: người học chọn hiển thị các sân dạng grid, chọn một sân rồi xem chi tiết giờ trống của sân đó. Đã xác định bước chọn sân. Người học đồng ý gợi ý mentor: mặc định xem hôm nay, có ô chọn ngày; đổi ngày thì cập nhật lịch sân đang xem. Đây là xác nhận lựa chọn giao diện, chưa phải tự giải thích validation thời gian hay thiết kế request/response/lỗi; giữ Chưa học cho hợp đồng API.

- Review G1-06 ngày 2026-11-03: người học tự chọn đúng 201 cho tạo booking thành công, 409 cho tranh slot và đề xuất chuẩn hóa response cho FE (success/message/data hoặc success/error). Chuyển G1-06 sang Cần ôn: đã có bản nháp mã HTTP/envelope; data đang để array rỗng, trường booking và error.code chưa hoàn thiện. Mentor gợi ý object cho một booking và mã lỗi ổn định để FE phân nhánh; chưa coi phần gợi ý là câu trả lời của người học. Chưa có code/test API.

- G1-06 bổ sung ngày 2026-11-03: người học đồng ý tạm chốt khung response đang bàn và hỏi khả năng mở rộng phân trang/chi tiết lỗi validation về sau. Mentor xác nhận có thể bổ sung ở API liên quan, giữ ý nghĩa/kiểu trường đã dùng. Ghi nhận quyết định, giữ Cần ôn; chưa có lời giải thích độc lập về thiết kế phân trang hoặc validation và chưa có code/test.

- G1-06 bổ sung: người học còn hỏi data có phải array và yêu cầu mentor đề xuất. Mentor phân biệt object cho một booking với array cho danh sách, đề xuất các trường response xác nhận. Giữ Cần ôn; chưa coi đề xuất là phần người học tự giải thích hoặc đã duyệt.

- G1-06 bổ sung: người học duyệt bộ trường data tạo booking do mentor đề xuất (“Ok được rồi đó”). Ghi nhận quyết định; giữ Cần ôn vì chưa có lời giải thích độc lập mới hoặc code/test API.

- G1-06 / validation: với durationMinutes=45, người học nói không nhớ và xin gợi ý. Mentor gợi ý dùng HTTP 400 cho đầu vào không hợp lệ, error.code=VALIDATION_ERROR và error.details là array các object field/message; người học điền thông báo cho durationMinutes. Đây là hướng dẫn, chưa phải câu trả lời độc lập hoặc quyết định đã duyệt; giữ Cần ôn.

- G1-06 / validation: người học yêu cầu mentor đề xuất rồi xác nhận “Đồng ý” với HTTP 400, VALIDATION_ERROR, message chung và details array gồm field/message. Đã duyệt quy ước thiết kế; giữ Cần ôn vì chưa có lời giải thích độc lập hoặc code/test.

- FB-002 / giới hạn giữ chỗ: người học tự nêu đánh đổi giữa nguy cơ một tài khoản giữ giờ cao điểm cả tuần khi bỏ hạn mức và trải nghiệm ít lựa chọn nếu chỉ giữ 3 booking. Ghi nhận lập luận sản phẩm, chưa có số liệu kiểm chứng hoặc quyết định đổi giới hạn; không suy diễn thành bằng chứng hiểu concurrency. Giữ nguyên mức hiểu kỹ thuật.

- FB-002 / giới hạn giữ chỗ: người học xác nhận “Ok như vậy đi” với hướng giữ mức 3 booking tương lai chưa hủy và đặt con số trong cấu hình backend để dễ điều chỉnh. Ghi nhận quyết định sau thảo luận đánh đổi; giữ nguyên mức hiểu kỹ thuật, chưa có giải thích concurrency mới hoặc test.

- G1-06 / lỗi hạn mức: người học xác nhận “Oke duyệt” với HTTP 409, BOOKING_LIMIT_REACHED và thông báo đạt giới hạn lấy số từ cấu hình, không có details. Ghi nhận duyệt hợp đồng, giữ Cần ôn; chưa có lời giải thích độc lập mới hoặc test.

- G1-06 / 403: người học đồng ý response BOOKING_BLOCKED, hỏi ý nghĩa 403 và Forbidden rồi nói “Ok hiểu rồi câu hỏi tiếp theo” sau giải thích khác biệt 401/403/409. Ghi nhận xác nhận hiểu; giữ Cần ôn vì chưa có giải thích độc lập hoặc thực hành.

- G1-06 / sân vô hiệu hóa: người học xác nhận “Ok duyệt” với HTTP 409, COURT_INACTIVE và thông báo sân không nhận booking mới. Ghi nhận duyệt thiết kế; giữ Cần ôn vì chưa có giải thích độc lập hoặc test mới.

- G1-06 / không tìm thấy sân: người học duyệt HTTP 404/COURT_NOT_FOUND cho courtId đúng định dạng nhưng không có sân tương ứng, sau giải thích phân biệt với lỗi định dạng 400. Ghi nhận duyệt thiết kế; giữ Cần ôn, chưa có lời giải thích độc lập hoặc test mới.

- G1-06 / giờ bắt đầu: người học xác nhận “Ừm ok.” với HTTP 400/VALIDATION_ERROR, details tại startAt và thông báo phải nằm trong tương lai, có kiểm tra lại sau chờ khóa. Ghi nhận duyệt thiết kế; giữ Cần ôn, chưa có giải thích độc lập hoặc test mới.

- G1-06 / nhóm lỗi thời gian: người học xác nhận “Ok.” với 400/VALIDATION_ERROR cho cửa sổ ngày, mốc 00/30, bắt đầu trước 06:00 và kết thúc sau 22:00 cùng ngày theo giờ Việt Nam; lỗi kết thúc gắn durationMinutes. Ghi nhận duyệt thiết kế, giữ Cần ôn vì chưa có giải thích độc lập hoặc test mới.

- G1-06 / xác thực: người học duyệt HTTP 401/UNAUTHENTICATED cho thiếu access token hoặc token không hợp lệ/hết hạn. Ghi nhận quyết định; giữ Cần ôn, chưa có giải thích độc lập hoặc test. Phối hợp refresh/retry còn cần thiết kế riêng.

- G1-06 / request tạo booking: người học duyệt ba trường bắt buộc courtId/startAt/durationMinutes, thời điểm ISO 8601 có múi giờ, không ép chuỗi thời lượng thành số và từ chối trường ngoài hợp đồng bằng 400/VALIDATION_ERROR. Danh tính từ JWT, dữ liệu dẫn xuất do backend tính. Ghi nhận quyết định, giữ Cần ôn; chưa có giải thích độc lập hoặc test mới.

- G1-06 / quyền tạo booking: người học duyệt POST /bookings chỉ cho CUSTOMER; ADMIN nhận 403/FORBIDDEN, chưa có admin đặt hộ. Ghi nhận duyệt thiết kế; giữ Cần ôn, chưa có giải thích độc lập hoặc test quyền mới.

- G1-06 / thứ tự xử lý: người học duyệt thứ tự xác thực → vai trò → body → khóa User/kiểm tra chặn → khóa Court/kiểm tra sân → kiểm tra lại thời gian/đếm hạn mức → tạo Booking/slot nguyên tử. Ghi nhận quyết định; giữ Cần ôn, chưa có giải thích độc lập hoặc test mới. Bước review nhỏ: ADMIN có access token hợp lệ gửi durationMinutes=45 thì lỗi nào được trả trước.

- G1-06 / áp dụng thứ tự xử lý: với ADMIN có access token hợp lệ gửi durationMinutes=45, người học tự trả lời “FORBIDDEN trước vì không có quyền rồi thì kiểm tra VALIDATE làm gì”. Đúng: theo hợp đồng đã chốt, trả 403/FORBIDDEN tại bước vai trò, chưa chạy validation body ở bước tiếp theo. Đây là bằng chứng giải thích độc lập về thứ tự authorization/validation trong tình huống cụ thể; không suy rộng thành đã hiểu toàn bộ validation, middleware hoặc transaction. G1-06 giữ Cần ôn cho các phần còn lại; chưa có code/test.

- G1-06 / lịch cá nhân: người học duyệt GET /bookings/me chỉ cho CUSTOMER, danh tính từ JWT, không nhận userId từ query, trả 200/data array gồm cả booking đã hủy/đã qua và array rỗng khi chưa có booking. Ghi nhận duyệt thiết kế; giữ Cần ôn, chưa có giải thích độc lập hoặc test quyền sở hữu mới.

- G1-06 / dữ liệu lịch cá nhân: người học duyệt tái dùng bộ trường booking, thêm cancelledAt/null, createdAt DESC với id làm tiêu chí phụ và suy ra nhãn theo thời gian thay vì thêm status database. Ghi nhận quyết định; giữ Cần ôn, chưa có giải thích độc lập hoặc test mới.

- G1-06 / phân trang lịch cá nhân: người học duyệt page mặc định 1, limit mặc định 10/tối đa 50, số nguyên dương, 400 khi sai, meta page/limit/total/totalPages và trang vượt phạm vi trả 200/data rỗng; sắp xếp createdAt DESC/id DESC. Ghi nhận quyết định; giữ Cần ôn, chưa có giải thích độc lập hoặc test mới.

- G1-06 / hủy booking: người học hỏi ý nghĩa response 200 với booking sau cập nhật và transaction hủy/giải phóng slot; mentor giải thích bằng booking 19:00–20:00 và rollback khi giải phóng slot lỗi. Người học xác nhận “Ok được duyệt.” với hợp đồng cơ bản. Ghi nhận quyết định và xác nhận sau giải thích; giữ Cần ôn, chưa có lời giải thích độc lập mới hoặc test transaction hủy.

- G1-06 / quyền sở hữu khi hủy: người học hỏi ai tìm booking; mentor giải thích FE gửi bookingId, backend lấy userId từ JWT và tìm theo cả hai trong database, không tin việc FE hiển thị nút. Sau giải thích người học duyệt 404/BOOKING_NOT_FOUND cho booking không tồn tại hoặc thuộc khách khác, 400 khi ID sai định dạng. Giữ Cần ôn; chưa có giải thích độc lập hoặc test quyền sở hữu mới.

- G1-06 / quá hạn hủy: người học hỏi vì sao dùng 409, mentor giải thích xung đột với điều kiện hiện tại của booking và phân biệt 400/403; sau đó người học duyệt 409/CANCELLATION_DEADLINE_PASSED, đúng 60 phút vẫn hợp lệ. Ghi nhận duyệt sau giải thích, giữ Cần ôn; không rút lại bằng chứng đã hiểu mốc hủy trong FB-001, chưa có test hoặc giải thích độc lập mới về HTTP.

- G1-06 / hủy lặp: người học duyệt trả 200 cho booking của mình đã CANCELLED, giữ thông tin hủy ban đầu, không giải phóng slot lần nữa, kiểm tra trạng thái đã hủy trước hạn thời gian. Duyệt hướng khóa Booking phối hợp hủy đồng thời. Ghi nhận quyết định, giữ Cần ôn; chưa có giải thích độc lập hoặc test concurrency mới.

- G1-06 / áp dụng hủy lặp: với booking 19:00 đã hủy/commit lúc 17:59, mất response và gửi lại lúc 18:01, người học chưa biết và xin gợi ý/đề xuất. Mentor giải thích theo hợp đồng đã duyệt: trả 200 vì booking đã CANCELLED, giữ cancelledAt=17:59, không kiểm tra hạn để từ chối lại hoặc cập nhật thời điểm hủy. Phân biệt response mất với transaction thất bại; nếu lần đầu chưa commit thì kiểm tra trạng thái/thời gian hiện tại. Đây là phần mentor cung cấp, không phải lời giải thích độc lập; giữ Cần ôn.

- G1-06 / mất response khi hủy: sau giải thích ví dụ 17:59 commit, 18:01 gửi lại, người học nói “à Ok hiểu rồi duyệt phương án này đi.”. Ghi nhận xác nhận hiểu và duyệt áp dụng quy tắc 200/giữ cancelledAt ban đầu; chưa có giải thích độc lập mới, giữ Cần ôn. Không đổi quy tắc đã duyệt trước đó.

- G1-06 / admin hủy booking: người học duyệt POST /admin/bookings/:bookingId/cancel chỉ ADMIN, hủy booking mọi khách không giới hạn 60 phút, không body, danh tính người hủy từ JWT, transaction nguyên tử, 200 khi hủy/lặp và 404 khi không tồn tại. Ghi nhận quyết định; giữ Cần ôn, chưa có giải thích độc lập hoặc test quyền mới.

- G1-06 / danh sách admin: người học duyệt GET /admin/bookings chỉ ADMIN, xem mọi khách kể cả đã hủy/đã qua, page/limit như lịch cá nhân, createdAt DESC/id DESC, response 200/data array/meta. Bộ trường khách và bộ lọc chờ chốt; giữ Cần ôn, chưa có giải thích độc lập hoặc test mới.

- G1-06 / dữ liệu khách trong booking admin: người học duyệt customer gồm id/name/email/isBookingBlocked, dùng dữ liệu tài khoản hiện hành, không trả passwordHash/token. Ghi nhận quyết định; giữ Cần ôn, chưa có giải thích độc lập hoặc test mới.

- G1-06 / bộ lọc booking admin: người học duyệt query tùy chọn branchId/courtId/userId/status/date, kết hợp AND, date theo ngày bắt đầu giờ Việt Nam, 400 khi sai định dạng, 200/data rỗng khi không có kết quả và total sau lọc. Ghi nhận quyết định; giữ Cần ôn, chưa có giải thích độc lập hoặc test mới.

- G1-06 / danh sách chi nhánh: người học duyệt GET /branches công khai, response 200/data array id/name/address, rỗng khi chưa có dữ liệu, name ASC/id ASC và chưa phân trang bản đầu. Ghi nhận quyết định; giữ Cần ôn, chưa có giải thích độc lập hoặc test mới.

- FB-002 / loại sân: người học yêu cầu thêm loại sân 5/7/11, tự làm rõ sân 5 là mỗi bên 5 người. Ghi nhận yêu cầu nghiệp vụ; mentor đề xuất playersPerTeam số nguyên thuộc 5/7/11, chưa được duyệt tên trường/cách lưu. Giữ nguyên mức hiểu kỹ thuật; chưa có code/test hoặc bằng chứng về kích thước sân chuẩn.

- FB-002 / playersPerTeam: người học xác nhận “Ok lưu cách này đi.”, duyệt lưu trực tiếp Court.playersPerTeam số nguyên bắt buộc thuộc 5/7/11, admin chọn loại, không cần bảng riêng và bảo vệ backend/database khi triển khai. Ghi nhận quyết định; giữ nguyên mức hiểu kỹ thuật, chưa có giải thích độc lập hoặc test mới.

- G1-06 / danh sách sân: người học duyệt GET /courts công khai chỉ sân hoạt động, query branchId/playersPerTeam tùy chọn kết hợp AND, loại 5/7/11, phân trang 1/10 tối đa 50, name ASC/id ASC, bộ trường Court/Branch, response 200/data/meta, 400 khi query sai và data rỗng khi không khớp. Ghi nhận quyết định; giữ Cần ôn, chưa có giải thích độc lập hoặc test mới.

- G1-06 / chi tiết sân: người học duyệt GET /courts/:courtId công khai, 200/data object như bộ trường danh sách, 400 ID sai định dạng, 404 không tồn tại; sân vô hiệu hóa vẫn 200/isActive=false và không nhận đặt mới. Giờ trống lấy API riêng. Ghi nhận quyết định; giữ Cần ôn, chưa có giải thích độc lập hoặc test mới.

### Review và bằng chứng

- Nhận xét mentor:
- Cần làm rõ / ôn lại:
- Ngày review / ôn lại:
- Bằng chứng: đặc tả, ERD, API; chưa có.
- **Nguyên liệu CV sau khi làm:** bài toán, phạm vi và trách nhiệm thiết kế. Ghi rõ nếu mới ở mức thiết kế.

## Nhu cầu học index — 2026-11-04

- Lời người học: “Phần này mới đối với tôi khi nào làm tới thì nhớ chỉ rõ để tôi thấy và hiểu.” Sau giải thích index thường/unique index, người học yêu cầu demo khi triển khai; chưa có câu trả lời tự giải thích hoặc demo để đánh giá mức hiểu. Không nâng trạng thái câu hỏi.
- Kế hoạch mentor: khi viết query/schema/migration tương ứng, chỉ rõ query cần phục vụ, thứ tự cột và index được tạo; so sánh EXPLAIN (ANALYZE, BUFFERS) trước/sau trên dữ liệu local/test. Giải thích database có thể chọn quét bảng với bảng nhỏ; không hứa index luôn được dùng hoặc luôn nhanh hơn. Cho người học quan sát unique index từ chối dữ liệu trùng, phân biệt với index thường và nhắc chi phí dung lượng/cập nhật khi ghi. Demo chưa chạy.
- Yêu cầu học này không phải duyệt danh sách CHECK/unique/index đang đề xuất tại FB-002.

## Trao đổi kiểu cột — 2026-11-04

- Người học giải thích: “Enum dành cho string còn integer + CHECK dành cho number điều này khỏi làm BE phải chuyển từ chuổi sang số rồi lưu vào db.”
- Nhận xét mentor: đúng về lợi ích giữ playersPerTeam là số xuyên suốt API/backend/DB; cần sửa cách tổng quát string→enum, number→CHECK. CHECK cũng áp dụng cho chuỗi; chọn kiểu theo ý nghĩa dữ liệu. Mentor đã giải thích lại; chưa có câu trả lời tự giải thích sau chỉnh sửa để xác nhận hiểu đầy đủ. Không nâng trạng thái câu hỏi.
- Sau đó người học duyệt bảng kiểu cột; xác nhận thiết kế không thay bằng chứng mức hiểu.

## Thay chính sách hạn refresh — 2026-11-04

- Người học hỏi R2 cấp lúc 01/11 09:15 có phải hết hạn 08/11 09:15 không, rồi chọn “còn sử dụng thì được gia hạn thêm 7 ngày.” Mentor làm rõ refresh thành công mới gia hạn qua token mới; lựa chọn thay hạn cố định 7 ngày trong các ghi nhận cũ. Giữ nguyên bằng chứng lịch sử, dùng quyết định mới trong auth.md làm nguồn hiện hành. Chưa có demo hoặc trả lời độc lập về toàn bộ expiry/reuse để nâng mức hiểu.

- Cùng buổi, người học đề xuất khi refresh token trả 401 kèm code hết hạn (ví dụ không sử dụng app 7 ngày) thì yêu cầu đăng nhập lại. Ghi nhận phân biệt được nhánh hết hạn và phản ứng đăng nhập lại; mentor cụ thể hóa REFRESH_TOKEN_EXPIRED và nhắc hạn tính từ lần cấp mới sau refresh thành công. Chưa có demo/giải thích đầy đủ token thu hồi/reuse hoặc giao thức đa tab để nâng trạng thái câu hỏi.

## Review backend local — 2026-11-05

- Người học xác định `{status: "ok"}` là nội dung response; chưa tự chỉ ra dòng chọn handler/gửi response. Mentor giải thích `app.get` và `res.status(200).json(...)`.
- Người học giải thích `app.listen` là mở cổng lắng nghe 3000. Callback khi bắt đầu listen thành công và lý do tách app/server do mentor bổ sung, chưa có lời giải thích độc lập.
- Người học trả lời đúng: health hiện chỉ kết luận kết nối được BE, không chứng minh kết nối database. Handler hiện không truy vấn DB.
- Chưa review migration/seed hoặc kết nối Prisma; không nâng mức hiểu các câu ERD/API từ bằng chứng này.

## Review kết nối Prisma — 2026-11-05

Xem thêm [G1-07 — ôn Prisma và SQL migration khi xin việc](#g1-07--ôn-prisma-và-sql-migration-khi-xin-việc).

- Người học trả lời SELECT 1 thành công nghĩa là “DB đang chạy ổn”. Đúng hướng; mentor bổ sung phạm vi bằng chứng: backend kết nối, xác thực và chạy truy vấn đơn giản thành công; chưa chứng minh cấu trúc bảng/nghiệp vụ. Chưa có lời diễn giải độc lập đủ ba phần.
- Mentor đã giới thiệu schema mô tả model, generate sinh client, migration đổi cấu trúc DB. Câu hỏi “chỉ sửa schema rồi generate thì đã có bảng mới chưa?” chưa được trả lời vì người học yêu cầu dừng buổi. Chưa ghi nhận hiểu migration/seed.
- Khi tiếp tục buổi 2026-11-05, người học trả lời PostgreSQL chưa có bảng User vì generate chỉ tạo API để giao tiếp với database. Đúng: phân biệt được sinh Prisma Client với thay đổi cấu trúc DB. Mentor làm rõ generate không chạy SQL tạo bảng; chưa có bằng chứng người học thực hành migration hoặc phân biệt migration với seed.
- Cùng buổi, người học yêu cầu mentor viết model User để duyệt, sau đó xác nhận “ok duyệt” cho model gồm tám trường và enum Role, bao gồm Prisma sinh UUID. Mentor ghi schema và chạy validate/generate/typecheck/build thành công; chưa migration. Đây là xác nhận phương án, chưa phải bằng chứng người học tự viết hoặc giải thích từng annotation.
- Review SQL User: sau giải thích, người học tự diễn đạt Prisma tự sinh UUID/thời điểm và SQL trực tiếp vẫn thêm được nếu cung cấp hai trường id/updatedAt. Đúng hướng về hai đường ghi; mentor chỉnh `TIMESTAMPTZ(3)` là kiểu cột, giá trị updatedAt do Prisma điền, createdAt có default database. Chưa kiểm chứng bằng insert thực tế. Theo yêu cầu “ok chuẩn bị đi”, mentor chuẩn bị file migration, chưa áp dụng; chưa ghi nhận hiểu quy trình migration/seed.

## G1-07 — Ôn Prisma và SQL migration khi xin việc

Liên quan seed FB-003 ngày 2026-11-05: người học yêu cầu mentor seed dữ liệu mẫu và chỉ vị trí file. Mentor tạo `backend/src/seed.ts` dùng upsert theo ID cố định/update rỗng trong transaction, chạy hai lần thành công và đối chiếu DB không trùng (1 Branch/3 Court). Chưa có câu trả lời người học về seed/upsert, không nâng mức hiểu từ kết quả chạy. Bước review: giải thích where/create/update trong seed và phân biệt thêm dữ liệu với migration tạo cấu trúc.

**Yêu cầu người học ngày 2026-11-05:** sau khi xem ràng buộc Branch/Court, hỏi có phải ràng buộc đặc biệt cần viết trong SQL, rồi yêu cầu ghi chú để chú ý khi ôn project xin việc. **Trạng thái: Cần ôn.** Đã nghe giải thích và xem test do mentor chạy; chưa tự giải thích hoặc viết SQL này.

Nội dung mentor đã giải thích, dùng làm gợi ý ôn (không phải câu trả lời của người học):

- Prisma schema mô tả được PK, unique đơn/ghép thông thường và FK qua `@id`, `@unique`/`@@unique`, `@relation`. Phần Prisma schema chưa biểu diễn được cần giữ trong SQL migration.
- Trong project: CHECK loại sân 5/7/11, CHECK miền giá và unique index trên branchId/tên chuẩn hóa được bổ sung tại [migration Branch/Court](../../backend/prisma/migrations/20261105073601_create_branch_court/migration.sql). Partial unique index BookingSlot với releasedAt IS NULL thuộc kế hoạch, chưa triển khai.
- Quy trình local: sửa schema → `prisma migrate dev --name <name> --create-only` → đọc/bổ sung SQL → kiểm chứng trên DB test riêng → `prisma migrate dev` để áp dụng. Prisma 7 chạy generate riêng; generate không tạo bảng. Lưu migration cùng code trong Git để tái tạo ràng buộc ở môi trường khác.
- Chỉ sửa file migration còn chưa áp dụng/chia sẻ; thay đổi sau khi đã áp dụng cần migration mới. SQL tùy chỉnh phải được giữ khi phát triển tiếp, không coi schema.prisma là toàn bộ ràng buộc DB.
- Bằng chứng chạy thật và giới hạn xem [biên bản kiểm chứng Branch/Court](../BRANCH_COURT_TEST.md). Test chạy được chưa chứng minh người học đã hiểu hoặc đã viết độc lập.

Khi ôn/mock interview, để người học trả lời trước:

1. Chỉ vào CHECK loại sân và unique tên chuẩn hóa: vì sao chúng nằm trong migration SQL? Database hay Prisma thực thi chúng?
2. Chỉ sửa schema rồi generate có tạo ràng buộc mới trong DB không? Vai trò của schema, Client, migration và `_prisma_migrations` khác nhau thế nào?
3. Muốn đổi CHECK sau khi migration đã áp dụng thì làm gì? Vì sao không sửa migration cũ?
4. Chọn một ca test trùng tên hoặc FK, nêu đầu vào, kết quả mong đợi, tên ràng buộc/mã lỗi và giải thích bằng code thật.

Chỉ cập nhật mức hiểu sau câu trả lời thực tế; không chặn task độc lập trong lúc còn cần ôn.

### Review seed — 2026-11-05

- Sau khi mentor giải thích where/create/update trong upsert, người học trả lời “Không” cho tình huống sửa giá Sân 5 Demo trong file từ 150000 thành 180000 rồi chạy seed lại. Đúng về kết quả: update rỗng giữ giá bản ghi đã có. Mentor nhắc lại lý do; chưa có lời giải thích độc lập về ID cố định, transaction hoặc phân biệt migration/seed, không nâng mức hiểu toàn bộ từ câu trả lời này.

### Frontend local — 2026-11-05

- Người học yêu cầu triển khai frontend tối thiểu sau khi được giới thiệu React hiển thị giao diện, Vite chạy dev/build. Mentor tạo thư mục frontend, trang tiếng Việt, CSS và cấu hình. Build/typecheck và HTTP dev pass; công cụ browser chưa kết nối nên chưa demo trực quan. Chưa có câu trả lời độc lập của người học về main/App/Vite hoặc kết nối frontend–API; không nâng mức hiểu từ yêu cầu làm hoặc code chạy. Bước sau review đường Browser → Express → Prisma → PostgreSQL để hiển thị sân mẫu, không đưa secret DB vào frontend.
- Tiếp nối theo yêu cầu người học: mentor triển khai GET /courts, proxy Vite và CourtsSection fetch/thẻ sân/trạng thái tải-lỗi-rỗng/phân trang. Đã giải thích đường Browser → Vite → Express → Prisma → PostgreSQL và giới hạn dữ liệu trả (giá hiện hành, chưa giờ trống/giữ chỗ). Build và test API DB riêng pass, HTTP qua Vite nhận ba sân seed; browser không khả dụng nên chưa demo render/tương tác. Chưa có câu trả lời độc lập của người học về luồng này, giữ mức hiểu hiện hành; cần xác nhận giao diện trước review FB-003.

### Xác nhận giao diện và review FB-003 — 2026-11-05

- Ảnh người học gửi xác nhận trang local hiển thị đủ Sân 11/5/7 Demo, chi nhánh/địa chỉ minh họa, giá 400000/150000/250000 VND mỗi 30 phút và tổng 3 sân hoạt động. Đây là bằng chứng render desktop, chưa phải lời giải thích độc lập về frontend–API–DB hoặc nghiệm thu mobile/retry/phân trang.
- FB-003 chuyển IN_REVIEW. Ba câu review đang chờ người học trả lời: (1) migration khác seed thế nào; (2) đường tải dữ liệu từ React tới PostgreSQL và nơi giữ mật khẩu DB; (3) khi chỉ backend dừng thì giao diện phản ứng gì và cần khởi động thành phần nào. Chưa đánh dấu đã hiểu hoặc tự trả lời thay người học.

### Câu trả lời review FB-003 — 2026-11-05

- Câu 1, người học: “Migration chỉ tạo khung cho database chưa có dữ liệu, còn seed thì thêm dữ liệu vào các khung đó.” Đúng phân biệt cấu trúc với dữ liệu mẫu; cần sửa giới hạn “chỉ tạo”/“chưa có dữ liệu”: migration còn thay đổi bảng/cột/ràng buộc của DB đã có dữ liệu, không yêu cầu DB rỗng. Phần bổ sung do mentor giải thích, chưa có lời diễn đạt lại của người học.
- Câu 2, người học xác định backend gọi DB qua Prisma Client trong router courts, REST endpoint và component/useEffect/fetch gọi API. Đúng các thành phần chính; tên/path nói chưa chính xác và còn thiếu proxy/chiều request-response/nơi giữ mật khẩu. Mentor đối chiếu tên thực tế createCourtsRouter, CourtsSection, GET /courts và fetch /api/courts; giải thích useEffect gọi fetch/cập nhật state, JSX render theo state. Chưa có câu trả lời về nơi giữ mật khẩu DB.
- Câu 3, người học trả lời giao diện báo thử lại sau ít phút và cần khởi động lại backend. Đúng cho request mới khi backend dừng. Mentor bổ sung trang đã tải xong có thể giữ dữ liệu cũ cho tới khi có request mới; frontend chưa polling.
- Đã có bằng chứng hiểu cơ bản cấu trúc/dữ liệu mẫu, các thành phần tải sân và xử lý backend dừng. FB-003 giữ IN_REVIEW; đúng một câu hỏi tiếp theo: mật khẩu PostgreSQL nằm ở phía nào và React có cần nhận mật khẩu đó không? Không nâng G1-07 thành đã giải thích được toàn bộ SQL/migration từ lượt này.

### Kết luận review FB-003 — 2026-11-05

- Người học: “Mật khẩu của PostgreSQL được dùng được giữ ở file .env và React không cần nhận mật khẩu này để hiển thị sân, backend sẽ đảm nhận điều đó.” Đúng vị trí secret và ranh giới frontend/backend theo cấu hình thực tế.
- Kết hợp ba câu trả lời review và bằng chứng ứng dụng/DB/test/ảnh desktop: đủ nghiệm thu phần chính môi trường local, FB-003 DONE. Người học đã phân biệt cấu trúc/dữ liệu mẫu, xác định các thành phần tải sân, biết khởi động backend khi request thất bại và không đưa mật khẩu DB cho React. Phần bổ sung migration thay đổi DB đã có dữ liệu/proxy/useEffect vẫn là giải thích mentor; không suy ra đã tự giải thích đầy đủ G1-07 hoặc transaction/index. Các mục cần ôn tiếp tục theo dõi riêng.

### Tổ chức module sau FB-003 — 2026-11-05

- Người học nhận xét backend chưa tổ chức đầy đủ theo module và yêu cầu “thêm control luôn khỏi repository cũng được”. Chốt có controller, không repository; mentor tách routes/validation/controller/service cho courts và dời config/lib/scripts. File seed hiện hành là `backend/src/scripts/seed.ts`, thay vị trí `backend/src/seed.ts` trong các ghi nhận lịch sử phía trên.
- Các kiểm chứng refactor được ghi tại PROGRESS/README; chưa có lời giải thích độc lập của người học về trách nhiệm controller/service hoặc truyền dữ liệu qua res.locals. Không coi yêu cầu thêm lớp hay test pass là bằng chứng đã hiểu. Module auth sẽ theo cấu trúc này khi triển khai; chưa code auth.

### Chọn Zod — 2026-11-05

- Người học yêu cầu dùng Zod cho validation. Mentor cài Zod 4.6.7, chuyển GET /courts sang schema/safeParse, suy kiểu bằng z.infer và map issues thành error.details field/message. Check/build và 34 kiểm tra API đạt; chưa có lời giải thích hoặc thực hành schema Zod của người học. Ghi quyết định công cụ, không tự đánh dấu đã hiểu runtime validation/type inference.

### Chọn Vitest/Supertest — 2026-11-05

- Người học yêu cầu “dùng vitest/supertest luôn”. Mentor chuyển test API sân sang TypeScript/Vitest/Supertest, giữ PostgreSQL test riêng và các hành vi đã kiểm tra. Check/build pass, npm test 33 pass; khác số 34 cũ do describe không tính là một test cha. Chưa có lời giải thích hoặc bài test người học tự viết; chỉ ghi quyết định công cụ, không nâng mức hiểu. Quy ước lỗi dùng chung còn chờ chốt trước auth.

### Nhu cầu hiểu test và điểm dừng — 2026-11-05

- Người học hỏi có cần biết ý nghĩa từng đoạn test. Mentor giới thiệu mục tiêu đọc được dữ liệu chuẩn bị, request, assertion, lỗi test phát hiện và giới hạn thật/mock; giới thiệu test/describe/hooks/Supertest/expect/vi.spyOn. Đây là giải thích mentor, chưa phải bằng chứng người học đã hiểu các API test.
- Câu review “Vì sao test GET /courts cần có cả sân hoạt động và sân ngừng hoạt động trong DB test?” chưa được trả lời vì người học yêu cầu dừng session dài. Buổi sau bắt đầu bằng câu này, không tự trả lời thay hoặc nâng mức hiểu từ 33 test pass.

### Đọc test từng phần — 2026-11-06

- Người học phản hồi review nhiều phần một lượt khó tracing, yêu cầu cùng viết/đọc từng phần nhỏ. Đã trao đổi test/expect, Supertest, createApp và đường truyền tên DB qua shell; các câu “Ok” không được coi là giải thích độc lập.
- Người học chọn DB test cố định `football_booking_test` thay tên ngẫu nhiên. Mentor thực hiện thay đổi; lần tiếp theo đọc helper cấu hình DB test từng đoạn nhỏ. Câu hỏi về dữ liệu sân active/inactive vẫn chưa có câu trả lời; chưa nâng mức hiểu.

- Tiếp nối 2026-11-06: người học vẫn thấy cấu hình test phức tạp và yêu cầu đơn giản hơn. Mentor bỏ shell/fixture SQL, chuyển chuẩn bị dữ liệu sang Prisma trong tests/setup.ts để file test tập trung vào request/assertion. Chưa có câu trả lời mới để đánh giá mức hiểu; tiếp tục từng đoạn nhỏ.

- Tiếp nối yêu cầu phù hợp intern: mentor tách bài test thành các hành vi nhỏ, viết request và response trực tiếp, giữ validation theo bảng/spy ở cuối để học sau. 41 test pass là bằng chứng code, chưa là bằng chứng người học hiểu. Bước học kế tiếp chỉ đọc request trong bài đầu.

### Tracing cấu hình DB test và bàn giao — 2026-11-06

> Cập nhật sau đó ngày 2026-11-06: người học yêu cầu gỡ bộ test và cấu hình test. Phần dưới giữ bằng chứng học lịch sử; không tiếp tục tracing các file đã gỡ, không nâng mức hiểu.

- Người học yêu cầu khai báo TEST_DATABASE_URL riêng, phản ánh các kiểm tra an toàn làm rối/nản. Sau khi mentor trình bày toàn luồng quá dài, người học yêu cầu mỗi lượt một đoạn rất nhỏ, chờ hỏi/xác nhận rồi mới tiếp tục; cuối buổi nhắc lưu quy tắc này cho các yêu cầu tracing sau.
- Lời người học: “giờ process.env sẽ có đầy đủ các biến đã khai báo trong .env”; mentor xác nhận và bổ sung giá trị là chuỗi. Đây là bằng chứng hiểu riêng bước nạp biến, không suy ra đã hiểu toàn bộ cấu hình/test.
- Mentor đã giải thích new URL/loadEnvFile, tên DB mong đợi, khai báo hàm, đọc biến, các điều kiện bảo vệ và return url. Người học xác nhận/cho phép tiếp tục từng đoạn; chưa có lời giải thích độc lập cho toàn bộ hàm, không nâng trạng thái câu hỏi từ các câu “Ok”.
- Dừng ngay sau khi mentor giới thiệu `datasource: { url: getTestDatabaseUrl() }` trong prisma.test.config.ts; chưa nhận xác nhận hiểu riêng dòng này. Buổi sau xác nhận lại đúng dòng này rồi chờ, chưa đi sang migrate/setup. Câu review active/inactive vẫn chưa trả lời.
