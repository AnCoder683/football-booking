# Đặc tả nghiệp vụ — FB-001

Trạng thái: DONE — đã tổng hợp đặc tả, đối chiếu tiêu chí FB-001 và review phần chính; người học áp dụng đúng ranh giới hạn hủy 60 phút ngày 2026-11-02. Đối chiếu với [README](../README.md). Phần mentor giải thích được ghi rõ; chưa có ứng dụng/test.

## Bản tổng hợp để review — 2026-11-02

Mentor tổng hợp từ README và các quyết định bên dưới; kết quả review thực tế được ghi trong INTERVIEW_PREP. Các mục sau bản tổng hợp giữ lại nguồn câu trả lời và lịch sử giải thích.

### Quyền và phạm vi

| Chủ thể | Quyền trong bản đầu |
| --- | --- |
| Khách | Đăng ký/đăng nhập, chọn chi nhánh → sân → ngày → thời lượng → giờ bắt đầu, xem giờ trống, đặt sân, xem/hủy booking của mình theo điều kiện |
| Admin | Tạo/cập nhật/vô hiệu hóa sân, quản lý sân theo địa điểm và địa chỉ; xem/lọc booking theo ngày/sân, hủy booking toàn hệ thống |
| Admin quản lý khách | Xem tài khoản khách (khách tự đăng ký); chặn/mở chặn đặt mới, mỗi lần ghi lý do và lưu BookingBlockHistory; admin xem lịch sử |

Quyền phải được kiểm tra ở backend. Khách không được xem/hủy booking của người khác hoặc gọi chức năng admin. Admin quản lý toàn hệ thống; chưa phân quyền riêng theo chi nhánh.

### Loại sân — bổ sung theo yêu cầu ngày 2026-11-03

Court phân loại sân 5/7/11 theo số người mỗi đội; sân 5 nghĩa là 5 người mỗi bên, không phải tổng 5 người trên sân. Admin khai báo loại khi tạo/cập nhật; khách xem loại trong thông tin sân. Chưa thêm kích thước cụ thể, tính giá tự động theo loại hoặc mô hình chia một sân lớn thành nhiều sân nhỏ. Đã chốt tại FB-002: lưu trực tiếp Court.playersPerTeam, số nguyên bắt buộc thuộc 5/7/11, không tự mặc định; kiểm tra backend và ràng buộc database khi triển khai.

### Luồng đặt sân

1. Khách chọn chi nhánh, sân, ngày, thời lượng rồi giờ bắt đầu; xem tên sân, khoảng giờ, tổng giá và hạn hủy trước khi xác nhận. Nếu còn dưới 60 phút, hiển thị cảnh báo đã qua hạn tự hủy theo mục đổi giờ qua admin bên dưới.
2. Đầu vào tối thiểu: mã sân, thời điểm bắt đầu có múi giờ rõ ràng và thời lượng phút. Backend lấy danh tính từ JWT đã xác thực, đọc giá Court trong transaction có khóa, tự tính giờ kết thúc/tổng giá và lưu snapshot vào Booking. Tên trường và hợp đồng API chốt tại FB-002.
3. Backend kiểm tra tài khoản được phép đặt và chưa đủ 3 booking tương lai chưa hủy, sân hoạt động, thời gian hợp lệ và toàn bộ slot còn trống khi ghi booking.
4. Thành công: lưu booking cùng giá lịch sử và chiếm toàn bộ slot liên tiếp; trả dữ liệu đã lưu để hiển thị kết quả và truy cập Lịch đặt của tôi. Không xác nhận đặt thêm lần nữa.
5. Nếu tranh bất kỳ slot nào: từ chối toàn bộ bằng `409`, không giữ slot dở dang. Giao diện thông báo, tải lại lịch, bỏ lựa chọn giờ cũ, giữ sân/ngày/thời lượng để chọn lại; chỉ cho xác nhận khi lựa chọn mới hợp lệ.

### Quy tắc kiểm tra

- Giờ Việt Nam `Asia/Ho_Chi_Minh`; thời điểm lưu UTC. Ngày được đặt: hôm nay đến hôm nay + 7 ngày; giờ bắt đầu phải ở tương lai.
- Mở cửa 06:00–22:00; bắt đầu phút 00/30; thời lượng là 30, 60, 90 hoặc 120 phút, tối đa 120 phút mỗi booking; kết thúc trong cùng ngày, không muộn hơn 22:00.
- Mọi slot 30 phút của booking phải trống; hai khoảng tiếp giáp được phép. Database phải bảo vệ từng slot; mô hình chốt FB-002, triển khai và test đồng thời tại FB-008.
- Tổng giá = giá mỗi 30 phút × thời lượng / 30; lưu giá tại thời điểm đặt. Đổi giá sân không đổi booking cũ.
- Vô hiệu hóa sân chỉ ngừng nhận đặt mới; không tự hủy booking hiện có.

### Luồng hủy và kết quả từ chối

- Khách gửi mã booking và xác nhận hủy. Backend kiểm tra danh tính, quyền sở hữu, booking còn hiệu lực và còn ít nhất 60 phút đến giờ bắt đầu (`now <= startAt - 60 phút`), tính theo thời điểm backend xử lý. Admin được hủy booking toàn hệ thống; không tự áp giới hạn thời gian của khách cho admin.
- Thành công: giữ lịch sử, chuyển trạng thái đã hủy và giải phóng toàn bộ slot. Giao diện chỉ cập nhật đã hủy sau phản hồi thành công.
- Đặt bị từ chối khi dữ liệu/thời gian không hợp lệ, sân ngừng nhận đặt, tài khoản không được phép, đã đủ 3 booking tương lai chưa hủy hoặc có slot bị chiếm. Hủy bị từ chối khi booking không tồn tại, thiếu quyền, đã hủy hoặc khách hủy khi còn dưới 60 phút đến giờ bắt đầu. Các lỗi không làm phát sinh booking/giữ slot hay thay đổi booking trái phép.
- Thiếu token hoặc token không hợp lệ/hết hạn: từ chối API cần đăng nhập. Mã HTTP và cấu trúc lỗi ngoài `409` sẽ chốt FB-002. Mất kết nối có thể chưa rõ kết quả; không tự kết luận đặt thất bại hay tranh slot.

### Hạn chế tài khoản

| Trạng thái | Đăng nhập/API cá nhân | Đặt mới | Booking hiện có |
| --- | --- | --- | --- |
| Không chặn đặt | Cho phép theo quyền | Cho phép nếu đủ điều kiện khác | Giữ nguyên; khách hủy theo quy tắc |
| Bị chặn đặt | Cho phép xem/hủy hợp lệ | Từ chối | Giữ nguyên |

Người học chuyển ghi chú khách ra ngoài app tại FB-002 ngày 2026-11-02; không có CustomerNote/API ghi chú hoặc tích hợp app khác. Giữ BookingBlockHistory nội bộ chỉ admin truy cập để lưu ai chặn/mở chặn, lúc nào và lý do. Người học chốt chỉ chặn đặt mới, bỏ mức khóa tài khoản tại FB-002 ngày 2026-11-02. Trạng thái chặn được backend kiểm tra hiện hành khi tạo booking, kể cả token cũ; không chặn đăng nhập/API xem hoặc hủy hợp lệ. Không tự chấm điểm khách hoặc dùng xóa mềm để xử phạt.

### Phần cần review và chưa chốt

- Đã review: người học từ chối đúng booking chồng lấn và từng tự giải thích đúng hai hạn chế độc lập trong phạm vi cũ; sau đó chủ động chọn chỉ giữ chặn đặt mới tại FB-002. Người học chọn hạn hủy 60 phút sau thảo luận rủi ro hủy sát giờ; biểu thức và ví dụ ranh giới do mentor cụ thể hóa, chưa coi là lời giải độc lập của người học. FB-001 đã nghiệm thu; chi tiết kết quả review xem mục Nghiệm thu cuối tài liệu.
- Theo điều chỉnh FB-002, ghi chú khách ngoài phạm vi app; chỉ giữ lịch sử chặn/mở chặn nội bộ. Xóa mềm ngoài xử phạt không thuộc phạm vi đã chốt của bản đầu. Trạng thái bảo trì riêng chưa chốt, hiện dùng vô hiệu hóa sân.
- Chưa có code/test; các ví dụ chỉ là kết quả nghiệp vụ mong đợi. Schema, API và cách lưu tiền thuộc FB-002; chưa mở rộng thanh toán hoặc tự động gửi thông báo.

## Hủy booking

- Khách chỉ được hủy booking của chính mình; admin được hủy booking của người khác.
- Người học chốt ngày 2026-11-02: khách chỉ được hủy trước giờ bắt đầu ít nhất 60 phút. Backend kiểm tra tại thời điểm xử lý: `now <= startAt - 60 phút`. Với booking 19:00–20:00, 17:59:59 và đúng 18:00 được hủy; 18:00:01, 18:59 và từ 19:00 trở đi bị từ chối, giữ nguyên booking/slot. Quy tắc này thay thế điều kiện cũ chỉ cần trước giờ bắt đầu; admin vẫn có quyền hủy riêng, không bị giới hạn 60 phút.
- Giao diện hiển thị hạn hủy trước khi xác nhận đặt; nút hủy chỉ cho thao tác khi còn đủ 60 phút. Backend vẫn kiểm tra lại dù hộp xác nhận được mở trước hạn. Booking đặt khi còn dưới 60 phút đến giờ bắt đầu không có thời gian tự hủy; không thêm điều kiện cấm đặt sát giờ.
- Khi hủy, giữ bản ghi và đổi trạng thái để lưu lịch sử.
- Booking đã hủy không còn giữ bất kỳ slot cơ sở nào đã chiếm; người khác có thể đặt lại nếu thỏa các điều kiện đặt sân còn lại.

## Thời gian đặt

- Sân mở 06:00–22:00. Quy tắc mới do người học xác nhận: slot cơ sở 30 phút; chọn giờ bắt đầu ở phút 00 hoặc 30 và thời lượng là 30, 60, 90 hoặc 120 phút, tối đa 120 phút mỗi booking. Booking phải kết thúc không muộn hơn 22:00 trong cùng ngày. Quy tắc này thay thế slot một giờ bắt đầu đúng giờ.
- Người học chọn đúng slot ngày mai 21:00–22:00 được phép đặt, không chọn 22:00–23:00. Mentor giải thích giới hạn đóng cửa; ví dụ này vẫn đúng theo quy tắc mới.
- Ví dụ mentor: 19:00–20:30 chiếm ba slot cơ sở liên tiếp. Tất cả phải trống; đặt thành công toàn bộ hoặc không giữ slot nào. Hai booking bắt đầu khác giờ vẫn có thể chồng lấn, cần kiểm tra mọi slot bị chiếm. Cơ chế database chốt tại FB-002; chưa có code hoặc xác nhận hiểu cơ chế từ người học.
- Giờ bắt đầu slot phải nằm trong tương lai theo README.
- Ngày đặt nằm từ hôm nay đến hết hôm nay + 7 ngày theo giờ Việt Nam. Nếu hôm nay 01/11, ngày cuối là 08/11, không phải 09/11. Đây là ví dụ mentor giải thích; người học làm rõ đã hiểu câu hỏi thành việc người khác đặt trùng ngày đó. Chưa đánh giá được mức hiểu giới hạn ngày đặt từ câu trả lời này.
- Sau khi làm rõ câu hỏi, người học tính đúng: nếu hôm nay 02/11, ngày cuối được phép đặt là 09/11 (`2 + 7`). Đã áp dụng đúng quy tắc giới hạn ngày; các điều kiện giờ bắt đầu và giờ hoạt động vẫn áp dụng.
- Ví dụ: hiện tại 18:30 hôm nay, sân hoạt động và hai slot đều trống. Người học chọn đúng slot 19:00–20:00 để đặt. Mentor giải thích slot 18:00–19:00 đã bắt đầu nên không được đặt; người học chưa tự nêu lý do.

## Giá booking

- Chốt phạm vi FB-002 ngày 2026-11-03: bảo vệ giá trong transaction đặt. Nếu transaction đặt đã khóa đọc Court trước, nó đọc giá hiện hành, tính/lưu snapshot Booking rồi commit/rollback mới nhả khóa; admin chờ khóa để cập nhật sau đó. Nếu admin cập nhật và commit trước, request đặt đọc giá mới. Không có cơ chế báo giá riêng, giữ giá từ lúc xem màn hình hoặc thời hạn 5 phút; không tin giá frontend gửi. Chưa triển khai.

- Booking giữ giá tại thời điểm đặt; đổi giá sân không thay đổi giá booking cũ.
- Theo yêu cầu mới của người học, niêm yết giá mỗi 30 phút thay cho giá mỗi giờ. Tổng giá = giá mỗi slot × số slot; số slot = thời lượng phút / 30. Ví dụ mentor: 150.000đ/30 phút, đặt 90 phút gồm ba slot thì tổng giá 450.000đ. Người học đã tự tính đúng booking 90 phút: 150.000đ × 3; mentor nêu kết quả 450.000đ. Thiết kế tiền tại FB-002: số nguyên VND, mỗi slot từ 1 đến 536.870.911 để tổng tối đa 4 slot không tràn PostgreSQL integer; tổng do backend tính, kiểm tra đúng snapshot × số slot. Xem DESIGN; chưa có ràng buộc DB/validation triển khai.
- Theo README, backend tự tính giá từ dữ liệu sân và lưu vào booking, không dùng giá frontend làm nguồn tính tiền. Sau khi mentor giải thích Court là sân và courtId là mã sân, người học xác định đúng booking một giờ của sân B có giá 250.000đ theo dữ liệu ví dụ. Người học giải thích đúng rằng frontend có thể gửi dữ liệu sai; backend phải áp dụng quy tắc và tự xác định giá từ database.
- Ví dụ theo đơn vị giá mới: sân có giá 150.000đ/30 phút, A đặt một giờ gồm hai slot với tổng giá 300.000đ. Sau đó admin đổi giá lên 175.000đ/30 phút; booking A vẫn giữ tổng giá 300.000đ. Các ví dụ theo giá giờ trong phần review trước là lịch sử, nguyên tắc giữ giá không đổi.
- Người học giải thích cần giữ giá cũ cho thống kê lịch sử. Mentor bổ sung: giữ đúng số tiền đã chốt với khách; bản đầu chưa có thanh toán nên tổng giá booking chưa đồng nghĩa tiền thực thu. Chưa thiết kế báo cáo doanh thu.

## Sân vô hiệu hóa

- Theo README, sân vô hiệu hóa không nhận booking mới, giữ nguyên booking có sẵn và lịch sử.
- Người học xác định đúng B không được đặt mới, nhưng cho rằng booking cũ của A không được giữ. Mentor đã sửa theo README: vô hiệu hóa sân không tự hủy booking; admin có thể hủy bằng thao tác riêng.
- Sau review, người học giải thích lại đúng rằng vô hiệu hóa sân giữ booking và hủy booking là thao tác khác; đồng thời đề cập thông báo cho khách. Mentor làm rõ hủy riêng chỉ thực hiện nếu cần; tự động gửi thông báo chưa thuộc bản đầu.

## Tình huống đã review

Theo quy tắc slot 30 phút mới: A đã đặt 19:00–20:00, B muốn đặt 19:30–21:00 cùng sân. Người học từ chối B vì sân đã được A đặt trước. Mentor xác định rõ phần chồng lấn là 19:30–20:00; phải từ chối toàn bộ yêu cầu của B, không tự cắt thành phần thời gian còn trống. Trường hợp tiếp giáp: A đặt 19:00–20:00, B đặt 20:00–21:30; khoảng sau 20:00 trống và các điều kiện khác hợp lệ. Người học chấp nhận đúng booking B vì A đã kết thúc và sân còn trống. Hai booking có thể tiếp giáp, giờ kết thúc booking trước bằng giờ bắt đầu booking sau không tính là chồng lấn.

A đặt sân cho slot 19:00–20:00, rồi hủy thành công lúc 18:00. Lúc 18:05, B muốn đặt cùng sân và slot: booking đã hủy của A không ngăn B đặt. Người học giải thích rằng giữ slot sau khi hủy sẽ để sân trống và ảnh hưởng doanh thu.

Hai khách A và B cùng thấy một slot trống và gửi yêu cầu đặt cùng sân/cùng giờ gần như đồng thời. Người học đề xuất request chạm database trước được booking. Mentor làm rõ: với hai yêu cầu đều hợp lệ, chỉ một request tạo booking thành công; request còn lại nhận `409 Conflict`, database chỉ có một booking hiệu lực cho sân/slot đó. Thứ tự đến database chưa bảo đảm thứ tự ghi thành công. Phần diễn đạt chính xác và mã lỗi do mentor bổ sung, chưa phải lời giải thích lại của người học.

Đây là kết quả mong đợi ở mức đặc tả, chưa có code hoặc test xác minh.

### Đặt 90 phút khi slot giữa đã bị chiếm

Khách muốn đặt 19:00–20:30; 19:00–19:30 và 20:00–20:30 trống, nhưng 19:30–20:00 đã có booking khác. Người học giải thích đúng: khách cần chơi liên tục 90 phút trong khoảng đã chọn; phần trùng khiến yêu cầu không đáp ứng được, nên khách cần chọn khoảng khác không chồng lấn. Theo quy tắc README, hệ thống từ chối toàn bộ và không giữ hai slot còn trống cho yêu cầu này. Phần không giữ slot là quy tắc mentor xác nhận; chưa có code/test hoặc review cơ chế database.

## Luồng giao diện chọn giờ đã chốt

- Hiển thị các sân dạng grid; khách chọn một sân rồi xem chi tiết giờ còn trống của sân đó. Người học đồng ý với gợi ý mentor: màn hình chi tiết sân mặc định hiện hôm nay, có ô chọn ngày phía trên; đổi ngày thì cập nhật lịch trống/đã đặt của sân đang xem.
- Người học đề xuất chọn thời lượng trước khi chọn khung giờ. Luồng cập nhật: chọn chi nhánh/địa điểm → chọn sân → chọn ngày → chọn thời lượng (30, 60, 90 hoặc 120 phút) → chọn giờ bắt đầu → kiểm tra thông tin và xác nhận.
- Mentor đề xuất: khi chọn giờ bắt đầu, tự chọn toàn bộ các block liên tiếp đủ thời lượng; chỉ cho chọn giờ bắt đầu nếu mọi block cần dùng đều trống và nằm trong giới hạn thời gian của README. Giữ trục block để hiển thị lịch; khách không cần tự ghép từng block. Phương án do mentor cụ thể hóa và người học xác nhận chốt ngày 2026-11-02; chưa triển khai hoặc kiểm chứng bằng code/test.
- Hiển thị trục thời gian ngang từ giờ mở cửa đến giờ kết thúc cho thuê, chia thành các block 30 phút.
- Block đỏ: không được chọn vì đã có người đặt; block xanh: khách đang chọn; block không màu: còn trống.
- Luồng giao diện đã được người học xác nhận, chưa triển khai. Đã thống nhất luồng chọn sân từ grid, cách chọn ngày và bổ sung thời lượng trước khi chọn giờ. Người học đã chốt thao tác tự chọn các block liên tiếp theo thời lượng. Lịch trống hiển thị không bảo đảm booking thành công; backend phải kiểm tra và bảo vệ slot lúc ghi. Các điều kiện thời gian và sân hoạt động trong README vẫn áp dụng.

## Thông tin trước khi xác nhận đặt sân

- Người học đề xuất làm nổi bật ngày, giờ bắt đầu–kết thúc và giá trước khi khách xác nhận.
- Mentor bổ sung tên sân để khách kiểm tra đúng sân; đề xuất ghi rõ tổng giá booking. Với ví dụ sân A, 19:00–20:30, giá 150.000đ/30 phút: thời lượng 90 phút, tổng giá 450.000đ. Tên sân và cách ghi rõ tổng giá do mentor bổ sung trong luồng được người học xác nhận chốt; không coi đây là lời giải thích độc lập của người học.
- Khi lịch hiển thị trống nhưng người khác đặt trước lúc xác nhận, người học đề xuất thông báo “Rất tiếc sân đã được đặt bạn đã chậm một bước”. Mentor đề xuất sửa thành “Tiếc quá, khung giờ này vừa có người đặt. Bạn chọn khung giờ khác nhé!” để giải thích xung đột mà không trách khách; đồng thời tải lại lịch, đánh dấu slot vừa bị chiếm và cho chọn lại. Luồng xử lý xung đột bên dưới đã được người học xác nhận chốt ngày 2026-11-02.
- Chỉ dùng thông báo tranh slot khi backend xác nhận xung đột; các nguyên nhân khác cần thông báo tương ứng. Chưa có dữ liệu về tỷ lệ từng loại lỗi, chưa có giao diện/code/test.

## Xử lý khi slot vừa bị người khác đặt

Giải pháp mentor cung cấp theo yêu cầu người học và được người học xác nhận chốt ngày 2026-11-02. Chưa review cơ chế backend hoặc có code/test:

1. Backend từ chối toàn bộ yêu cầu với `409 Conflict`, không giữ slot nào cho yêu cầu thất bại.
2. Hiện “Tiếc quá, một phần khung giờ bạn chọn vừa có người đặt. Vui lòng chọn lại.”
3. Tải lại lịch sân trong ngày đang xem, xóa lựa chọn giờ cũ; block vừa bị chiếm chuyển đỏ, các block còn trống trở về không màu.
4. Giữ ngày, sân và thời lượng để khách chọn giờ bắt đầu khác; vô hiệu hóa nút xác nhận đến khi có lựa chọn hợp lệ. Giữ thời lượng thuộc luồng đã chốt.

## Thông báo sân bảo trì

- Người học đề xuất thông báo đơn giản rằng sân đang bảo trì và xin lỗi vì bất tiện. Phù hợp khi đã xác định sân bảo trì; không dùng lý do bảo trì thay cho xung đột booking.
- Mentor lưu ý trạng thái vô hiệu hóa sân chưa tự chứng minh nguyên nhân là bảo trì. Nếu chỉ biết sân vô hiệu hóa, dùng thông báo sân tạm ngừng nhận đặt; chưa bổ sung trường lý do hoặc chức năng quản lý bảo trì.

## Đầu vào yêu cầu đặt sân

Người học nêu: thông tin khách hàng, thông tin sân, ngày, thời lượng và giờ bắt đầu. Mentor cụ thể hóa cho phạm vi bản đầu:

- Khách phải đăng nhập. Backend xác định người đặt từ JWT đã xác thực; không dùng `userId`, tên hoặc vai trò do body gửi làm danh tính người đặt. Chưa chốt cách lưu/truyền token ở FB-004.
- Frontend gửi mã sân, thời điểm bắt đầu và thời lượng phút. Ví dụ tên trường để minh họa: `courtId`, `startAt`, `durationMinutes`; hợp đồng API chính thức chốt ở FB-002.
- Ngày và giờ được chọn theo Asia/Ho_Chi_Minh, ghép thành thời điểm bắt đầu có múi giờ rõ ràng. Ví dụ 03/11/2026 lúc 19:00 giờ Việt Nam: `2026-11-03T19:00:00+07:00`, tương đương `2026-11-03T12:00:00Z`. Không cần gửi thêm ngày riêng nếu `startAt` đã chứa đủ ngày và giờ.
- Backend tự tính giờ kết thúc từ thời điểm bắt đầu và thời lượng; tự đọc giá sân, tính tổng giá và lưu giá lịch sử. Không nhận giá hoặc giờ kết thúc frontend gửi làm nguồn quyết định.
- Backend kiểm tra quyền, sân hoạt động, thời gian hợp lệ và bảo vệ toàn bộ slot khi ghi booking. Lịch frontend chỉ phục vụ lựa chọn, không thay thế kiểm tra backend.

Phần chi tiết do mentor bổ sung theo yêu cầu người học. Người học chỉ rõ userId đã nằm trong token, sau giải thích đã xác nhận danh tính lấy từ token được backend xác thực và body chỉ cần courtId/startAt/durationMinutes. Chưa có schema, code hoặc test; chưa review độc lập cơ chế kiểm tra JWT.

## Kết quả đặt sân thành công

- Người học đề xuất hiển thị giao diện xác nhận lại ngày, giờ và tiền sau khi đặt thành công.
- Mentor bổ sung thông tin: mã booking, tên sân, ngày, giờ bắt đầu–kết thúc, thời lượng, tổng giá đã chốt và trạng thái đã xác nhận; có nút xem lịch đặt của tôi. Đây là chi tiết mentor đề xuất, chưa có xác nhận riêng của người học.
- Backend trả dữ liệu booking đã lưu; màn hình thành công dùng dữ liệu phản hồi này, chỉ hiện sau khi backend xác nhận đặt thành công. Không yêu cầu khách xác nhận lần thứ hai.
- Ví dụ: sân A, 03/11/2026, 19:00–20:30 giờ Việt Nam, 90 phút, tổng 450.000đ với giá 150.000đ/30 phút. Mã booking do backend tạo, không tự tạo mã mẫu làm bằng chứng booking thực tế.
- Chưa có code/test; hợp đồng response và mã HTTP chính thức chốt tại FB-002.

## Lịch đặt của tôi

- Người học xác nhận có mục “Lịch đặt của tôi” để khách quay lại xem các booking cá nhân; đây là luồng đã có trong phạm vi README, không mở rộng tính năng.
- Chỉ hiển thị booking thuộc người đang đăng nhập; backend kiểm tra danh tính/quyền, không chỉ lọc bằng giao diện.
- Mentor đề xuất mỗi booking hiển thị mã booking, tên sân, ngày, giờ bắt đầu–kết thúc, tổng giá đã chốt và trạng thái; giữ booking đã hủy trong lịch sử theo quy tắc hiện có. Chi tiết hiển thị do mentor bổ sung, chưa có xác nhận riêng.
- Người học đồng ý có nút hủy kèm hộp xác nhận. Người học chưa chọn riêng vị trí nút; mentor chọn phương án đơn giản cho bản đầu: nút “Hủy booking” trên từng booking trong danh sách, chỉ cho thao tác khi booking còn hiệu lực và còn ít nhất 60 phút đến giờ bắt đầu.
- Hộp xác nhận hiển thị tên sân, ngày, giờ bắt đầu–kết thúc, với hai nút “Giữ booking” và “Xác nhận hủy”. Chọn giữ thì đóng hộp, không thay đổi booking.
- Sau khi backend xác nhận hủy thành công, cập nhật trạng thái đã hủy, giữ booking trong lịch sử và giải phóng toàn bộ slot. Backend vẫn phải kiểm tra quyền sở hữu và thời gian tại thời điểm xử lý; nếu hủy thất bại, không tự hiển thị đã hủy mà thông báo nguyên nhân tương ứng. Phần chi tiết trạng thái do mentor cụ thể hóa từ quy tắc hiện có, chưa có code/test.
- Chưa có giao diện/code/test.

## Quyền admin và ý tưởng mở rộng

### Phạm vi bản đầu theo README

- Tạo sân, cập nhật thông tin/giá sân và vô hiệu hóa sân để ngừng nhận booking mới; giữ lịch sử và booking có sẵn. Nếu sân cần bảo trì, bản đầu có thể dùng thao tác vô hiệu hóa; trạng thái riêng và lý do bảo trì chưa được chốt.
- Xem booking toàn hệ thống, lọc theo ngày/sân và hủy booking của khách. Các quyền này phải được kiểm tra ở backend.
- Thêm sân mới với địa chỉ, nhóm theo chi nhánh/địa điểm để khách lọc trước khi chọn sân. Người học yêu cầu bổ sung ngày 2026-11-02; admin vẫn quản lý toàn hệ thống, chưa có quyền riêng theo chi nhánh. Tại FB-002, địa chỉ chung lưu ở Branch.address; Court liên kết chi nhánh và hiển thị địa chỉ qua liên kết này, không lưu lặp Court.address.

### Phạm vi bổ sung theo quyết định người học ngày 2026-11-02 (lịch sử; bản đầu hiện hành ở dưới)

- Đặt sân thành trạng thái bảo trì.
- Đánh dấu khách hàng xấu/troll; tạo tài khoản và xóa mềm tài khoản.
- Thêm sân, có thể ở chi nhánh khác.

Sau đề xuất hoãn của mentor, người học quyết định đưa quản lý tài khoản vào bản đầu; chi nhánh được giới hạn thành nhóm sân theo địa điểm, hiển thị địa chỉ cho sân và bước chọn chi nhánh trước chọn sân. Người học làm rõ tại FB-002: địa chỉ chung lưu ở Branch, Court lấy qua liên kết chi nhánh README và ROADMAP đã được cập nhật theo quyết định này. Không thêm chủ sân, tài khoản hay quyền admin riêng cho từng chi nhánh.

Quản lý tài khoản khách gồm xem tài khoản khách (khách tự đăng ký), chặn/mở chặn đặt mới thủ công và tra lịch sử thao tác, ghi lý do mọi lần thành công. Người học chốt bỏ mức khóa tài khoản tại FB-002 ngày 2026-11-02 để giữ phạm vi đơn giản. Khách bị chặn vẫn đăng nhập/xem/hủy booking của mình theo hạn 60 phút; không được tạo booking mới, kể cả dùng token đã có từ trước. Giữ booking và lịch sử, admin hủy riêng nếu cần. Không quản lý ghi chú khách trong app, không tự chấm điểm/chặn hoặc dùng xóa mềm để xử phạt. Xóa mềm ngoài xử phạt và trạng thái bảo trì riêng chưa thuộc phạm vi đã chốt.

Địa chỉ riêng lẻ chưa xác định được nhóm chi nhánh để hiển thị bộ chọn; cần tên/định danh nhóm địa điểm dùng chung cho các sân cùng nơi. Đây là nhu cầu thiết kế để xem xét ở FB-002, chưa mặc định thêm bảng hoặc dependency.

Mentor gợi ý hiển thị số booking hiệu lực trong ngày và bộ lọc booking đã hủy như tiện ích nhỏ sau luồng chính, chưa đưa vào tiêu chí bản đầu. Tổng tiền booking không được gọi là tiền đã thu vì chưa có thanh toán.

## Xử lý khách vi phạm — chỉ chặn đặt mới

- Các ví dụ người học nêu gồm không trả tiền tại sân, phá hoại hoặc ẩu đả. Admin có thể quản lý ghi chú sự việc ngoài app, rồi quyết định chặn đặt mới trong app kèm lý do; hệ thống lưu lịch sử thao tác, không tự động suy ra mức xử lý từ một lần hủy đúng quy định.
- Mọi lần chặn/mở chặn thuộc quyền admin, đều ghi lý do. Chặn chỉ ngăn tạo booking mới, giữ đăng nhập/xem/hủy hợp lệ và toàn bộ booking/lịch sử; admin hủy riêng nếu cần. Backend kiểm tra trạng thái chặn hiện tại lúc tạo booking, không chỉ tin cờ trong token cũ.
- Lịch sử quyết định: từng chốt thêm khóa tài khoản, nhưng người học phản biện mức này không cần thiết và chốt bỏ tại FB-002 ngày 2026-11-02. Quy tắc hiện hành không có khóa/mở khóa hoặc cấm toàn bộ API cá nhân do chặn đặt.
- Việc không trả tiền được ghi nhận thủ công, chưa thêm thanh toán hoặc trạng thái tiền đã thu. Không thêm soft-delete làm hình thức xử phạt.
- Chưa có code/test; không coi cập nhật tài liệu là đã thực thi kiểm tra trạng thái hoặc quyền admin.

## Đổi giờ qua admin và cảnh báo đặt sát giờ — đã chốt 2026-11-02

- Người học chọn phương án đầu: khách muốn đổi giờ liên hệ admin để xem xét hủy ngoại lệ, sau đó khách tự đặt lại. Bản đầu chưa có API tự đổi giờ, admin đặt hộ hoặc kênh liên hệ/ticket hỗ trợ trong ứng dụng.
- Ví dụ: lúc 18:45 A đặt 19:00–20:00, sau đó muốn chuyển sang 19:30–20:30. Admin kiểm tra toàn bộ khoảng mới theo thời lượng và quy tắc đặt; phần 19:30–20:00 đang thuộc booking cũ của A không tính là xung đột với chính booking đó khi xem xét khả năng dời. Nếu phần còn lại bị chiếm hoặc khoảng mới không hợp lệ, giữ booking cũ.
- Nếu admin đồng ý hỗ trợ, giải thích rủi ro rồi hủy booking cũ bằng quyền admin. Hủy giữ lịch sử và giải phóng toàn bộ slot; khách đặt lại theo quy tắc và giá hiện hành, booking mới chỉ thành công khi backend xác nhận.
- Hủy và đặt lại là hai thao tác riêng: không giữ trước hay cam kết giờ mới, request khác có thể đặt trước. Nếu đặt lại thất bại, booking cũ vẫn đã hủy, không tự khôi phục hoặc giữ slot. Chưa thêm luồng đổi giờ nguyên tử.
- Trước khi khách xác nhận đặt, hiển thị hạn hủy. Nếu còn dưới 60 phút đến giờ bắt đầu, hiện rõ: “Booking này đã qua hạn tự hủy. Vui lòng kiểm tra kỹ giờ đến.” Ví dụ 18:45 đặt 19:00 phải thấy cảnh báo; đúng 18:00 cho 19:00 chưa qua hạn. Cảnh báo dựa trên thời điểm hiện tại của màn hình và cập nhật nếu màn hình còn mở khi vượt hạn; backend vẫn quyết định quyền hủy theo thời điểm xử lý thực tế.
- Cảnh báo không cấm đặt sát giờ và không tạo thời gian ân hạn để hủy. Admin xem xét ngoại lệ, không bảo đảm mọi yêu cầu đổi đều được chấp thuận. Cơ chế kiểm thử UI/API sẽ thực hiện khi có ứng dụng.

## Giới hạn giữ chỗ mỗi khách — chốt bổ sung tại FB-002 ngày 2026-11-02

- Người học tự nêu rủi ro một tài khoản đặt kín nhiều thời gian rồi không đến và đồng ý giới hạn 3 booking tương lai chưa hủy mỗi tài khoản. Đây là bổ sung phạm vi sau nghiệm thu FB-001, chưa có triển khai; thời lượng tối đa 120 phút đã được người học chốt cùng ngày.
- Cửa sổ hiện hành chỉ hôm nay đến hết hôm nay + 7 ngày, không phải cả tháng; vẫn có thể lạm dụng trong cửa sổ đó. Giới hạn mỗi tài khoản chỉ giảm mức chiếm chỗ, không ngăn được người tạo nhiều tài khoản.
- Người học chốt tối đa 3 booking chưa hủy có giờ bắt đầu trong tương lai mỗi tài khoản khách. Ngưỡng 3 là quyết định thiết kế, chưa có dữ liệu vận hành chứng minh hiệu quả. Backend kiểm tra tại thời điểm xử lý; khi đã đủ 3 thì từ chối đặt thêm, không tạo booking/giữ slot. Hủy thành công hoặc booking bắt đầu thì không còn tính vào số này. Không giới hạn tổng số booking trong lịch sử, không tự thêm trạng thái no-show.
- Kết hợp giới hạn 3 booking với tối đa 120 phút mỗi booking, tổng thời lượng giữ chỗ chưa bắt đầu/chưa hủy mỗi tài khoản không vượt 360 phút. Không coi là hạn mức mỗi ngày hoặc đã giải quyết việc tạo nhiều tài khoản.
- Không đến nhận sân: admin có thể ghi chú ngoài app và cân nhắc chặn đặt trong app kèm lý do được lưu lịch sử; không tự chặn/phạt vì một lần hủy đúng quy định. Chưa thêm đặt cọc, xác minh điện thoại hoặc tự động đánh giá.
- FB-002 phải thiết kế cách thực thi không vượt 3 khi cùng tài khoản gửi nhiều request đồng thời, bên cạnh ràng buộc chống trùng slot. Ví dụ đang có 2 booking được tính, gửi đồng thời hai yêu cầu hợp lệ cho hai sân/khung giờ khác nhau: chỉ một được thành công, tổng không vượt 3; request bị từ chối không giữ slot. Chưa chốt cơ chế/mã lỗi cho vượt giới hạn hoặc triển khai. Không đồng nhất lỗi vượt giới hạn với xung đột slot.

## Thời lượng tối đa — đã chốt 2026-11-02

- Người học cho biết chưa từng đi đá bóng/vận hành sân và yêu cầu mentor đề xuất. Sau đề xuất của mentor, người học đồng ý tối đa 120 phút mỗi booking; giữ đơn vị 30 phút, cho chọn 30/60/90/120. Đây là quyết định thiết kế cho bản đầu, chưa có dữ liệu vận hành chứng minh là ngưỡng tối ưu.
- Tham khảo điều khoản do đơn vị vận hành Liget+ công bố, mục 6.6.1(b), có khoảng đặt 30–120 phút: https://ligetplusz.hu/media/dokumentumok/VLZ_ASZF_vasarlas_EN.pdf . Đây là ví dụ ở nước ngoài, không đại diện mọi sân hoặc thực tiễn Việt Nam. Banks O’ Dee cũng có mẫu đặt sân định kỳ với lựa chọn 60/90/120 phút: https://www.banksodee.co.uk/wp-content/uploads/2022/11/BOD_Pitch-Block-Booking-Application-form.pdf . Không áp dụng điều kiện hợp đồng/hủy của các nguồn này cho app.
- Lý do chọn 120: vẫn hỗ trợ lựa chọn 60/90 phút và thêm khoảng dài hơn, không cho một booking giữ nhiều giờ tùy ý; dễ kiểm tra cùng slot cơ sở. Kết hợp tối đa 3 booking tương lai thì tổng thời lượng tương lai đang giữ không vượt 360 phút trên mỗi tài khoản. Đây là phép tính, không phải giới hạn mỗi ngày hay bằng chứng chống nhiều tài khoản.
- Không thêm ngoại lệ vượt 120 phút, đặt giải hoặc admin đặt hộ. Backend từ chối thời lượng ngoài 30/60/90/120, kể cả gọi API trực tiếp, không tạo booking/giữ slot. Giao diện chỉ cho chọn bốn giá trị này. Các điều kiện thời gian khác vẫn áp dụng: booking 120 phút bắt đầu 20:00 được phép kết thúc 22:00 nếu hợp lệ; bắt đầu 20:30 kết thúc 22:30 bị từ chối. Chốt validation/API tại FB-002 và kiểm thử thực tế khi có ứng dụng.

## Lịch sử chặn/mở chặn — giữ trong app, không có CustomerNote

- Người học xác định ghi chú khách có thể quản lý ở app khác, còn BookingBlockHistory giữ trong hệ thống. Không chọn app khác, tạo dữ liệu hay xây tích hợp bên ngoài.
- Mỗi thao tác chặn/mở chặn thành công ghi khách bị tác động, admin thực hiện, BLOCK/UNBLOCK, lý do không rỗng và thời điểm server. Chỉ admin xem lịch sử; không công khai lịch sử/lý do nội bộ cho khách. Khách bị chặn nhận thông báo phù hợp khi đặt, không tự gửi cảnh báo ngay khi admin thao tác.
- Cập nhật User.isBookingBlocked và thêm lịch sử với reason trong cùng transaction. User không có bookingBlockReason, lý do chỉ lưu trong BookingBlockHistory. Lỗi thì không đổi trạng thái hoặc ghi lịch sử thành công một phần. Không tạo lịch sử chặn mới cho mỗi lần khách bị từ chối đặt.
- Không cần liên kết noteId hoặc bằng chứng từ app ghi chú; lý do nhập ngay trong thao tác chặn/mở chặn. Phần xử lý thao tác lặp, độ dài lý do và hợp đồng API còn cần thiết kế.

## Auth bổ sung tại FB-002: refresh token và đăng xuất

- Người học duyệt khung User chỉ chặn đặt mới và yêu cầu thêm refresh token ngày 2026-11-02. Refresh token đã thuộc phạm vi bản đầu, thay quyết định hoãn trước đó; phương án cơ bản đã duyệt: access JWT 15 phút, refresh token hạn tuyệt đối 7 ngày từ lúc đăng nhập, rotation, cookie HttpOnly và bảng riêng lưu hash; xem DESIGN để phân biệt phần đã duyệt/chi tiết còn thiết kế.
- Mục tiêu: access token hết hạn thì có thể xin access token mới bằng refresh token còn hiệu lực; refresh token sai/hết hạn/đã thu hồi không cấp token mới. Đăng xuất thu hồi quyền refresh của phiên hiện tại và xóa thông tin đăng nhập phía trình duyệt.
- Chặn đặt mới vẫn cho đăng nhập/refresh/xem/hủy hợp lệ; backend kiểm tra trạng thái chặn hiện hành khi tạo booking kể cả sau refresh. Không đưa mức khóa tài khoản trở lại.
- Đã duyệt thời hạn 15 phút/7 ngày và rotation. Logout thu hồi refresh của phiên hiện tại, access token đã cấp có thể tiếp tục hợp lệ tối đa 15 phút. Chi tiết reuse/request đồng thời, cookie/CSRF, API và kiểu ID chưa hoàn thiện. Không lưu token rõ trong database/log hoặc coi đã có chức năng khi chưa triển khai/test.

## Nghiệm thu FB-001

- Đã có bảng quyền, luồng đặt/hủy với đầu vào/kết quả/nhóm lỗi, quy tắc thời gian/giá và hạn chế tài khoản (ghi chú đã được chuyển ngoài app tại FB-002, giữ lịch sử chặn); xử lý đổi giờ qua admin đã chốt. Các ví dụ review về chồng lấn, tiếp giáp và hủy/đặt lại nằm ở trên.
- Người học đã từ chối đúng booking chồng lấn, giải thích tính liên tục của booking và từng giải thích đúng hai hạn chế độc lập theo phạm vi cũ (mức khóa đã được bỏ tại FB-002). Người học tự phát hiện rủi ro hủy sát giờ rồi chọn ngưỡng 60 phút; người học tự trả lời đúng ranh giới mới: booking 19:00 hủy đúng 18:00 được phép, 18:01 không được. Mentor bổ sung phép tính tương ứng còn 60 và 59 phút.
- FB-001 DONE ngày 2026-11-02: bản đặc tả đạt tiêu chí bàn giao và đã có câu trả lời thực tế về phần nghiệp vụ chính. Mức hiểu chi tiết tiếp tục theo dõi riêng, không coi đã hiểu cơ chế triển khai. Hợp đồng API/schema/cách lưu tiền thuộc FB-002; không coi chưa có code/test ứng dụng là thiếu bàn giao của ticket đặc tả. Cơ chế database/test đồng thời sẽ phải có bằng chứng khi triển khai.

### Quyết định tên sân — 2026-11-03

Đã chốt tên sân duy nhất trong mỗi chi nhánh, kể cả sân ngừng nhận đặt; khác chi nhánh được trùng tên. Chuẩn hóa khoảng trắng (bỏ đầu/cuối, gộp khoảng trắng liên tiếp) và so sánh không phân biệt hoa/thường, vẫn phân biệt dấu tiếng Việt. Giao diện xác nhận/xem booking hiển thị tên sân cùng chi nhánh để tránh nhầm. Áp dụng khi tạo/đổi tên; bản đầu không cho chuyển Court sang chi nhánh khác để tránh thay đổi địa điểm booking hiện có; khi triển khai phải bảo vệ bằng ràng buộc database theo chi nhánh và tên chuẩn hóa. Chưa có schema hoặc ràng buộc được triển khai; chi tiết tại docs/DESIGN.md.

### Sửa thông tin sân — đã duyệt 2026-11-03

Admin được sửa tên, loại sân, giá mỗi 30 phút và trạng thái nhận đặt; chỉ cập nhật các trường được gửi. Bản đầu không cho sửa branchId. Đổi giá không đổi giá lịch sử booking; ngừng nhận đặt không tự hủy booking có sẵn. Chi tiết hợp đồng PATCH tại docs/DESIGN.md; chưa triển khai.

### Quyền admin với tài khoản khách — đã duyệt 2026-11-03

Khách tự đăng ký và tự đặt mật khẩu; backend gán role=CUSTOMER và isBookingBlocked=false. Bản đầu bỏ chức năng admin tạo tài khoản khách, không có POST /admin/customers. Admin được xem khách, chặn/mở chặn đặt mới cho CUSTOMER và xem lịch sử; mỗi lần thay đổi trạng thái cần lý do và BookingBlockHistory trong cùng transaction. Chưa có admin sửa tên/email/mật khẩu, đổi role hoặc chặn ADMIN. Không bổ sung luồng lời mời/email cấp mật khẩu, đổi mật khẩu hoặc quên mật khẩu trong quyết định này. Đây là phạm vi thiết kế, chưa triển khai API.

### Gửi lại trạng thái chặn đặt — đã duyệt 2026-11-03

Nếu trạng thái CUSTOMER đã giống isBookingBlocked yêu cầu, API trả 200/changed=false, giữ nguyên và không thêm lịch sử; reason vẫn bắt buộc hợp lệ. Khi trạng thái thay đổi, trả 200/changed=true và cập nhật cờ/ghi BLOCK hoặc UNBLOCK với lý do trong cùng transaction. Quy tắc “mọi lần chặn/mở chặn thành công đều ghi lịch sử” áp dụng cho thay đổi thực sự; xác nhận trạng thái sẵn có không là lần thay đổi mới. Không cam kết dedup một retry nếu đã có thao tác đảo trạng thái xen giữa. Chưa triển khai/test.
