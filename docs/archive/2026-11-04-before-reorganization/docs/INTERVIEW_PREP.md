# Câu hỏi theo giai đoạn và nguyên liệu CV

Đây là sổ tự đánh giá, không phải đáp án để học thuộc. Hiện chưa có ứng dụng, nên bắt đầu từ giai đoạn 0; các câu sau là mục tiêu học tương lai.

## Cách dùng

- Mỗi câu có trạng thái: `Chưa học`, `Cần ôn`, `Đã giải thích được`.
- Ban đầu tất cả là `Chưa học`: chưa có câu trả lời/review trong project, không có nghĩa bạn chưa từng biết khái niệm.
- Viết câu trả lời ngắn bằng lời của mình, dẫn chứng bằng file, test, quyết định hoặc log đã loại secret. Có thể để “chưa có trải nghiệm” khi phù hợp.
- Cuối giai đoạn mentor chọn 3–5 câu để trao đổi, hỏi tiếp dựa trên code thực tế. Không cần một phiên hỏi hết mọi câu.
- Sau review ghi điểm đúng, phần thiếu, điều cần kiểm chứng và ngày ôn lại. Không tự đánh dấu hiểu chỉ vì code chạy.
- CV chỉ sử dụng công việc có bằng chứng; mẫu ý bên dưới chưa phải thành tích đã đạt.

## Giai đoạn 0 — Bắt đầu

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

## Giai đoạn 1 — Phân tích và thiết kế

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

### Câu trả lời của người học

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

## Giai đoạn 2 — Xây dựng tính năng

Liên quan: FB-004–007.

| Mã | Câu hỏi | Trạng thái |
| --- | --- | --- |
| G2-01 | Một request đặt sân đi qua những lớp nào trong ứng dụng? | Chưa học |
| G2-02 | Bạn chia module thế nào? Controller và service chịu trách nhiệm gì? | Chưa học |
| G2-03 | JWT xác thực người dùng thế nào? Quyền được kiểm tra ở đâu? | Chưa học |
| G2-04 | Làm sao ngăn khách xem hoặc hủy booking của người khác? | Chưa học |
| G2-05 | Backend kiểm tra thời gian và tính giá thế nào? Vì sao không tin giá frontend gửi? | Cần ôn |
| G2-06 | Khi API lỗi hoặc slot vừa bị đặt, giao diện phản hồi thế nào? | Cần ôn |

### Câu trả lời của người học

- G2-01:
- G2-02:
- G2-03:
- G2-04:
- G2-05: Trong bước đặc tả FB-001, người học đề xuất so sánh giá frontend gửi với giá niêm yết và trả lỗi nếu nhỏ hơn. Review 2026-11-01: đúng hướng kiểm tra phía server, nhưng chỉ chặn giá thấp hơn vẫn có thể nhận giá sai cao hơn. Mentor giải thích backend phải tự tính giá từ dữ liệu sân theo README, không lấy giá frontend làm nguồn tính tiền. Sau khi làm rõ Court là sân và courtId là mã sân, người học trả lời đúng giá booking một giờ của sân B là 250.000đ theo bảng giá database trong ví dụ. Bổ sung: người học giải thích backend có quy tắc/ràng buộc, còn frontend có thể gửi dữ liệu rác hoặc sai sự thật. Mentor: đúng lý do không tin dữ liệu đầu vào; backend thực thi quy tắc và lấy giá sân từ database, ràng buộc database hỗ trợ tính hợp lệ. Đã giải thích được phần nguồn giá; giữ Cần ôn vì chưa review đủ phần thời gian và chưa có code/test.
- Review G2-06 ngày 2026-11-03 / availability thay đổi: người học đề xuất thông báo “xin lỗi đã có người đặt trước bạn rồi vui lòng chọn sân khác hoặc giờ khác”. Đúng: nhận diện khoảng đã bị người khác đặt và hướng dẫn chọn lại, thông báo không trách khách. Còn thiếu mã lỗi và cập nhật lịch/lựa chọn; mentor bổ sung theo hợp đồng đã chốt: 409/BOOKING_SLOT_CONFLICT, rollback toàn bộ, tải lại availability, bỏ lựa chọn hết trống và yêu cầu chọn lại; không tự đổi sân/giờ hoặc tự gửi lại booking. Giữ Cần ôn vì chưa có câu trả lời độc lập cho toàn bộ luồng hoặc test.
- Bổ sung G2-06: người học yêu cầu mentor nói luôn giải pháp; mentor đã cung cấp luồng 409 → thông báo → tải lại lịch → xóa lựa chọn cũ/cập nhật màu → khóa xác nhận đến khi chọn lại hợp lệ. Đây là lời giải mentor, chưa phải câu trả lời chứng minh mức hiểu của người học.
- Bổ sung G2-06: người học đề xuất thông báo sân đang bảo trì và xin lỗi vì bất tiện. Mentor xác nhận phù hợp khi biết sân thực sự bảo trì; nếu chỉ biết sân vô hiệu hóa thì thông báo tạm ngừng nhận đặt, không suy diễn nguyên nhân. Chưa có câu trả lời về cập nhật block vừa bị người khác đặt; giữ Cần ôn.
- G2-06: Trong đặc tả FB-001, người học đề xuất làm nổi bật ngày, giờ bắt đầu–kết thúc và giá trước khi xác nhận; mentor bổ sung tên sân và tổng giá. Với slot vừa bị đặt, người học đề xuất “Rất tiếc sân đã được đặt bạn đã chậm một bước”, muốn giọng nhí nhảnh và chuyển cảm giác tiêu cực khỏi hệ thống sang sự đắn đo của khách. Người học cho rằng phần lớn từ chối do người khác nhanh tay hơn; chưa có dữ liệu để xác nhận tỷ lệ này. Review mentor: đúng phần thông báo có người đặt trước trong tình huống xung đột; không nên trách khách hoặc gán mọi lỗi cho tranh slot. README còn có điều kiện sân vô hiệu hóa, thời gian hợp lệ; phiên đăng nhập hết hạn cũng có thể chặn thao tác. Lỗi mất kết nối có thể chưa xác định được kết quả đặt. Mentor đề xuất thông báo trung tính và cập nhật lịch để chọn lại; người học chưa trả lời phần cập nhật giao diện. Chuyển Cần ôn; chưa có code/test.

### Review và bằng chứng

- Nhận xét mentor:
- Cần làm rõ / ôn lại:
- Ngày review / ôn lại:
- Bằng chứng: code, API, demo luồng; chưa có.
- **Nguyên liệu CV sau khi làm:** tính năng đã chạy và công nghệ thực sự sử dụng. Chưa nhận có cơ chế chống tranh slot cho tới khi FB-008 được kiểm chứng.

## Giai đoạn 3 — Tính đúng đắn và kiểm thử

Liên quan: FB-008–009.

| Mã | Câu hỏi | Trạng thái |
| --- | --- | --- |
| G3-01 | Vì sao kiểm tra slot còn trống rồi insert vẫn có thể gây đặt trùng? | Chưa học |
| G3-02 | Database bảo đảm một booking hiệu lực cho mỗi sân/giờ bằng cách nào? | Chưa học |
| G3-03 | Sau khi hủy, vì sao khách có thể đặt lại slot đó? | Chưa học |
| G3-04 | Khi nào transaction cần thiết? Ràng buộc database giải quyết phần nào? | Cần ôn |
| G3-05 | Bạn kiểm thử hai request đồng thời thế nào? Kết quả mong đợi là gì? | Chưa học |
| G3-06 | Vì sao dùng DB riêng cho test? Mock không kiểm chứng được điều gì ở đây? | Chưa học |
| G3-07 | Kể một lỗi thực tế bạn phát hiện qua test và cách sửa. Nếu chưa gặp, hãy nói rõ. | Chưa học |

### Câu trả lời của người học

- G3-01:
- G3-02:
- G3-03:
- FB-002 / làm rõ phạm vi, bỏ báo giá ngày 2026-11-03: người học phản biện giải pháp quote/TTL rườm rà và mô tả transaction đặt đồng thời admin đổi giá, đặt chốt giá cũ trước rồi admin mới cập nhật. Đúng hướng bảo vệ giá trong transaction và admin chờ nếu đặt giữ khóa trước. Mentor rút quote/TTL, diễn giải ví dụ Booking cũ tổng 300k, giá niêm yết mới áp dụng cho booking sau tổng 360k; không tự đổi snapshot Booking cũ. Không coi là người học đã tự thiết kế FOR SHARE/isolation hoặc có thực hành; giữ mức hiểu hiện hành. Các ghi nhận trước về giữ giá từ màn hình đã được thay thế bởi phạm vi transaction này.
- FB-002 / xác nhận sau giải thích phạm vi khóa ngày 2026-11-03: người học nói “Ok” sau luồng báo giá riêng và giữ khóa ngắn khi đặt. Chưa có lời giải thích áp dụng mới, không nâng mức hiểu hoặc coi mọi chi tiết SQL được duyệt. Mentor chuyển sang đề xuất TTL báo giá 5 phút và hành vi hết hạn để người học chọn; chưa chốt TTL.
- FB-002 / hỏi phạm vi giữ khóa ngày 2026-11-03: người học hỏi giữ khóa thế nào mới chuẩn sau yêu cầu giữ giá và ví dụ Postman. Mentor đề xuất tách báo giá khỏi transaction đặt, khóa User/Court chỉ trong transaction ngắn; Court bảo vệ isActive, giá Booking lấy báo giá xác thực; admin không chờ khách xem/thanh toán. Chưa có câu trả lời áp dụng hoặc xác nhận duyệt chi tiết; không nâng mức hiểu, TTL/cơ chế quote vẫn chưa chốt.
- FB-002 / giả mạo giá qua Postman ngày 2026-11-03: người học hỏi khi BE đã đổi giá thành 360k thì user dùng Postman gửi giá 300k sẽ thế nào. Đã đặt đúng câu hỏi về ranh giới tin cậy client; chưa coi là tự giải thích được cách xác thực quote. Mentor phân biệt con số giá tự gửi không được tin với báo giá backend đã cấp còn hợp lệ, ràng buộc đúng user/sân/giờ/thời lượng và chính sách dùng lại. Báo giá cũ hợp lệ được dùng theo yêu cầu giữ giá; quote giả/hết hạn/sai phạm vi bị từ chối. TTL và cách lưu/xác thực vẫn chưa chốt.
- FB-002 / yêu cầu giữ giá đã xem ngày 2026-11-03: người học từ chối phương án thông báo giá mới để xác nhận lại khi admin đổi giá trước lúc bấm đặt; yêu cầu khách thấy 300k thì đặt phải là 300k. Ghi nhận thay đổi nghiệp vụ giữ giá trước tạo booking, cần báo giá backend xác thực. Thời hạn/phạm vi/cách lưu/API chưa chốt; không suy diễn người học đã thiết kế quote/TTL hoặc chấp nhận giá frontend làm nguồn chuẩn. Giữ mức hiểu hiện hành.
- FB-002 / xác nhận phân biệt khóa và snapshot ngày 2026-11-03: người học nói “Ok” sau giải thích transaction đặt chốt giá Booking rồi nhả khóa, giá Court thay đổi không sửa số tiền Booking cũ. Chưa có lời giải thích độc lập mới, giữ mức hiểu hiện hành; không coi là duyệt toàn bộ chi tiết Court hoặc thêm thanh toán. Bước tiếp theo là chọn hành vi khi giá frontend đang xem khác giá backend hiện hành trước tạo booking.
- FB-002 / giữ khóa qua thanh toán ngày 2026-11-03: người học mô tả khách đặt giữ khóa, admin cập nhật giá phải chờ đến đặt và thanh toán xong rồi nhả khóa; thanh toán được nêu là giả định. Đúng thứ tự chờ khóa khi đặt lấy khóa Court trước. Cần sửa thời gian giữ khóa: không kéo dài transaction Court qua chờ thanh toán bên ngoài; mentor giải thích snapshot giá Booking bảo vệ số tiền sau commit, admin đổi Court không ảnh hưởng. Chưa có xác nhận hiểu giới hạn transaction hoặc duyệt phương án Court; không coi ví dụ là yêu cầu thêm thanh toán/đổi đơn vị giá. Giữ mức hiểu hiện hành.
- FB-002 / phản hồi thứ tự đổi giá ngày 2026-11-03: người học nêu đặt sân thành công phải diễn ra trước khi giá cập nhật. Mentor xác nhận phù hợp khi transaction đặt đã giữ khóa đọc Court trước; cần làm rõ mốc bảo vệ giá là xử lý request/đọc giá hay xem màn hình. Chưa coi đây là duyệt toàn bộ phương án, yêu cầu giữ giá theo UI hoặc bằng chứng hiểu các chế độ khóa.
- FB-002 / đọc Court đồng thời ngày 2026-11-03: người học đồng ý tiếp tục bước Court; mentor đề xuất khóa đọc FOR SHARE sau khóa User để snapshot giá/trạng thái nhất quán với UPDATE admin. Chưa có câu trả lời giải thích hoặc quyết định duyệt chính sách; giữ mức hiểu hiện hành, không suy diễn từ “Ok”.
- G3-04 / duyệt hướng transaction ngày 2026-11-03: người học trả lời “Ok được rồi” cho đề nghị chốt khóa User → đọc chặn → đếm booking tương lai → kiểm tra điều kiện còn lại → tạo Booking/BookingSlot → commit hoặc rollback. Ghi nhận đã duyệt hướng thiết kế, không suy ra đã tự giải thích isolation/concurrency hoặc đã triển khai; G3-04 giữ Cần ôn, bằng chứng áp dụng rollback trước đó giữ nguyên.
- G3-04 / xác nhận sau giải thích khóa ngày 2026-11-03: người học nói “Ok tôi hiểu rồi” sau ví dụ hai request cùng khóa U1 và tài khoản khác khóa U2. Ghi nhận xác nhận đã hình dung; chưa có lời giải thích độc lập hoặc thực hành để nâng mức hiểu, chưa coi đây là phê duyệt phương án. Giữ Cần ôn; bước tiếp theo là chốt hướng transaction/khóa User.
- G3-04 / khóa dòng User ngày 2026-11-03: người học nói chưa biết khái niệm khóa và chưa hình dung được “khóa dòng User trước khi đếm”. Mentor chuyển sang giải thích khóa bản ghi database: hai transaction cùng yêu cầu khóa xung đột trên cùng dòng thì bên sau chờ đến khi bên trước commit/rollback; không phải khóa tài khoản hoặc thêm cờ vào User, SELECT thông thường không nhất thiết bị chặn. Chưa có câu trả lời áp dụng; không xác nhận hiểu hoặc duyệt phương án, giữ Cần ôn.
- G3-04 bổ sung ngày 2026-11-03: với transaction tạo Booking B1 và slot 19:00 thành công, tạo slot 19:30 lỗi rồi rollback, người học trả lời “Không” khi hỏi Booking B1 và slot vừa tạo có còn không. Đúng: đã áp dụng được rollback/all-or-nothing vào ví dụ project. Chưa có thực hành hoặc lời giải thích về request đồng thời/ràng buộc, giữ Cần ôn cho toàn bộ G3-04.
- G3-04: Ngày 2026-11-03, người học giải thích COMMIT là xác nhận chuỗi thao tác thành công khi không có lỗi giữa các hành động con; ROLLBACK quay về trạng thái trước chuỗi thao tác, ví như Ctrl+Z. Đúng ý cơ bản về xác nhận thay đổi và hủy toàn bộ thay đổi của transaction. Mentor làm rõ COMMIT cần được thực hiện và thành công mới xác nhận lưu, không có lỗi không có nghĩa tự commit một transaction tường minh; rollback chỉ hủy thay đổi database của transaction đang xét, không hủy giao dịch khác, tác động ngoài DB hoặc undo transaction đã commit. Chưa có ví dụ người học tự áp dụng vào Booking/BookingSlot, chưa xác nhận hiểu isolation/khóa/ràng buộc hoặc thực hành; chuyển Cần ôn, chưa Đã giải thích được toàn bộ câu hỏi.
- G3-05:
- G3-06:
- G3-07:

### Review và bằng chứng

- Nhận xét mentor:
- Cần làm rõ / ôn lại:
- Ngày review / ôn lại:
- Bằng chứng: migration, test, kết quả chạy và lỗi thực tế; chưa có.
- **Nguyên liệu CV sau khi làm:** cơ chế chống trùng và nhóm nghiệp vụ được test. Test hai request không chứng minh hệ thống chịu tải lớn.

## Giai đoạn 4 — GitHub Actions và CI

Liên quan: FB-010.

| Mã | Câu hỏi | Trạng thái |
| --- | --- | --- |
| G4-01 | CI giải quyết vấn đề gì so với chỉ chạy test trên máy cá nhân? | Chưa học |
| G4-02 | Workflow, job, step và runner khác nhau thế nào? | Chưa học |
| G4-03 | Workflow chạy khi nào và thực hiện những kiểm tra gì? | Chưa học |
| G4-04 | PostgreSQL phục vụ test được khởi tạo và chuẩn bị dữ liệu ra sao? | Chưa học |
| G4-05 | Khi local chạy được nhưng CI thất bại, bạn tìm nguyên nhân thế nào? | Chưa học |
| G4-06 | CI khác tự động deploy ở điểm nào? | Chưa học |

### Câu trả lời của người học

- G4-01:
- G4-02:
- G4-03:
- G4-04:
- G4-05:
- G4-06:

### Review và bằng chứng

- Nhận xét mentor:
- Cần làm rõ / ôn lại:
- Ngày review / ôn lại:
- Bằng chứng: workflow, link run thành công và ví dụ đọc/sửa lỗi; chưa có.
- **Nguyên liệu CV sau khi làm:** các bước kiểm tra tự động thực tế. Không ghi tự động deploy nếu chỉ có CI.

## Giai đoạn 5 — Deploy VPS lần đầu

Liên quan: FB-011–013.

| Mã | Câu hỏi | Trạng thái |
| --- | --- | --- |
| G5-01 | Đường đi từ trình duyệt tới backend và database trên VPS như thế nào? | Chưa học |
| G5-02 | Dockerfile, image, container và Docker Compose khác nhau thế nào? | Chưa học |
| G5-03 | Reverse proxy làm gì? Domain và HTTPS tham gia luồng truy cập ra sao? | Chưa học |
| G5-04 | Cấu hình và secret được cung cấp ở đâu? Cổng nào được public? | Chưa học |
| G5-05 | Vì sao dữ liệu còn sau khi thay container? Bạn kiểm chứng thế nào? | Chưa học |
| G5-06 | Bạn cập nhật app và chạy migration ra sao? Làm gì nếu cập nhật lỗi? | Chưa học |
| G5-07 | App không truy cập được: bạn kiểm tra gì và theo thứ tự nào? | Chưa học |
| G5-08 | Bạn đã backup và khôi phục thử database thế nào? | Chưa học |

### Câu trả lời của người học

- G5-01:
- G5-02:
- G5-03:
- G5-04:
- G5-05:
- G5-06:
- G5-07:
- G5-08:

### Review và bằng chứng

- Nhận xét mentor:
- Cần làm rõ / ôn lại:
- Ngày review / ôn lại:
- Bằng chứng: URL, cấu hình không chứa secret, runbook, kết quả restore thử; chưa có.
- **Nguyên liệu CV sau khi làm:** những phần triển khai/vận hành đã trực tiếp thực hiện. Có volume không đồng nghĩa đã có backup.

## Giai đoạn 6 — CV và mock interview

Liên quan: FB-014–015.

| Mã | Câu hỏi | Trạng thái |
| --- | --- | --- |
| G6-01 | Giới thiệu project trong 60–90 giây: bài toán, người dùng và phần bạn làm. | Chưa học |
| G6-02 | Quyết định kỹ thuật đáng nói nhất là gì? Bạn cân nhắc phương án nào khác? | Chưa học |
| G6-03 | Lỗi khó nhất bạn thực tế gặp là gì? Bạn tìm và kiểm chứng cách sửa ra sao? | Chưa học |
| G6-04 | Bạn tự làm phần nào, AI hỗ trợ phần nào và bạn kiểm tra kết quả AI thế nào? | Chưa học |
| G6-05 | Giới hạn của hệ thống là gì? Có thêm thời gian, bạn ưu tiên cải thiện gì? | Chưa học |
| G6-06 | Từng phát biểu trong CV được chứng minh bằng code, test hoặc demo nào? | Chưa học |

### Câu trả lời của người học

- G6-01:
- G6-02:
- G6-03:
- G6-04:
- G6-05:
- G6-06:

### Review và bằng chứng

- Nhận xét mentor:
- Cần làm rõ / ôn lại:
- Ngày review / ôn lại:
- Bằng chứng: README, demo, ghi chú kỹ thuật và số liệu đã đo nếu có; chưa có.
- **CV:** sau FB-015, soạn 2–3 bullet từ kết quả đã hoàn thành. Chưa có nội dung thành tích để điền ở thời điểm bắt đầu.

## Mẫu đánh giá một câu trả lời

```text
Mã câu:
Câu trả lời người học:
Đúng:
Thiếu / cần sửa:
Bằng chứng thực tế:
Bài kiểm chứng nhỏ nếu cần:
Trạng thái mới:
Ngày review / ngày ôn lại:
```

## Nguyên tắc viết CV cuối project

- Dùng động từ và phạm vi cụ thể: xây API nào, bảo vệ quy tắc nào, tự động hóa bước nào.
- Chỉ ghi số liệu nếu có phương pháp đo, môi trường và kết quả lưu lại; số test không phải bằng chứng đầy đủ về chất lượng hoặc hiệu năng.
- Phân biệt thiết kế, triển khai local, demo online và vận hành thực tế.
- Có thể nói rõ dùng AI để hỗ trợ; chịu trách nhiệm giải thích và kiểm chứng phần code được dùng.
- Nếu một phần chưa xong, mô tả tiến độ đúng thực tế hoặc chưa đưa phần đó vào CV.
