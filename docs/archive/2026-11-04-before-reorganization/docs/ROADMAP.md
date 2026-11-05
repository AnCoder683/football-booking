# Lộ trình thực tập

Đọc [README](../README.md) để biết phạm vi. Theo dõi trạng thái ở [PROGRESS](PROGRESS.md), luyện câu hỏi tại [INTERVIEW_PREP](INTERVIEW_PREP.md).

Thời gian là ước lượng, không phải hạn bắt buộc. Ước lượng ban đầu 30–40 giờ gồm giai đoạn 0; cần ước lượng lại sau khi chốt quy tắc quản lý tài khoản và nhóm sân theo địa điểm và refresh token bổ sung ngày 2026-11-02. Nếu vượt dự kiến, cập nhật số giờ và nguyên nhân; không bỏ kiểm tra để bám lịch.

**Cập nhật 2026-11-03:** đang ở FB-002. Dự báo còn lại là 50–80 giờ cho phạm vi hiện tại và cách học có hướng dẫn/review; xem bảng phân rã ở [PROGRESS](PROGRESS.md). Bảng giờ dưới đây là ước lượng ban đầu trước mở rộng phạm vi, không phải dự báo còn lại hiện tại.

| Giai đoạn | Ticket | Giờ dự kiến |
| --- | --- | --- |
| 0 — Tự đánh giá | FB-000 | 0,5 |
| 1 — Phân tích và nền tảng | FB-001–003 | 3–4 |
| 2 — Tính năng | FB-004–007 | 8–10 |
| 3 — Tính đúng đắn và test | FB-008–009 | 5–6 |
| 4 — CI | FB-010 | 2–3 |
| 5 — VPS | FB-011–013 | 6–8 |
| 6 — Hồ sơ | FB-014–015 | 3–4 |

## Giai đoạn 0 — Xuất phát điểm

### FB-000 — Tự đánh giá

- **Mục tiêu:** phân biệt phần đã tự làm và phần cần học.
- **Cần hiểu:** kinh nghiệm thực tế khác với đã nghe tên công nghệ.
- **Bắt đầu khi:** đã đọc README và hướng dẫn thực tập.
- **Các bước:** trả lời G0-01 đến G0-05 bằng trải nghiệm thật; ghi điều chưa biết; gửi mentor review.
- **Bàn giao:** câu trả lời trong bộ câu hỏi hoặc nội dung gửi mentor để ghi lại.
- **Nghiệm thu/kiểm tra:** mỗi kỹ năng được nhắc có ví dụ hoặc được ghi chưa từng làm; có mục tiêu học rõ. Mentor xác nhận đã review.
- **Review:** toàn bộ câu hỏi giai đoạn 0; chưa cần code.

## Giai đoạn 1 — Phân tích và nền tảng

### FB-001 — Đặc tả nghiệp vụ (45–60 phút)

- **Mục tiêu:** hiểu hệ thống trước khi viết schema.
- **Cần hiểu:** actor, luồng thành công, điều kiện từ chối và acceptance criteria.
- **Bắt đầu khi:** đã review FB-000.
- **Các bước:** viết quyền khách/admin; mô tả đặt và hủy; liệt kê quy tắc thời gian/giá; viết ba tình huống kiểm tra, có hai khách tranh slot.
- **Bàn giao:** `docs/REQUIREMENTS.md` được tạo khi thực hiện ticket.
- **Nghiệm thu/kiểm tra:** không mâu thuẫn README; có đầu vào, kết quả và lỗi cho đặt/hủy; mentor đi qua các ví dụ cụ thể.
- **Review:** G1-01 đến G1-03.

### FB-002 — ERD và hợp đồng API

Chốt ngày 2026-11-03: thiết kế transaction đọc giá Court dưới khóa và lưu snapshot Booking trước khi admin cập nhật; không thêm báo giá riêng hoặc TTL giữ giá. Thanh toán vẫn ngoài bản đầu.

- **Mục tiêu:** chuyển nghiệp vụ thành mô hình dữ liệu và API nhỏ gọn.
- **Cần hiểu:** khóa, quan hệ, trạng thái booking, mã HTTP và quyền sở hữu.
- **Bắt đầu khi:** FB-001 đã review.
- **Các bước:** vẽ User–Court–Booking; chốt cách biểu diễn nhóm chi nhánh/địa chỉ sân, lịch sử BookingBlockHistory (ghi chú khách ngoài app), chặn/mở chặn đặt mới (backend kiểm tra hiện hành lúc đặt, kể cả token cũ; bỏ mức khóa tài khoản theo quyết định FB-002); xóa mềm chỉ thiết kế nếu có nhu cầu riêng được chốt theo nghiệp vụ FB-001; xác định trường bắt buộc, giá mỗi slot 30 phút và tổng giá lịch sử, tiền số nguyên VND với giá mỗi slot > 0, PostgreSQL integer/Prisma Int với giá mỗi slot tối đa 536.870.911 và tổng tối đa 2.147.483.644, validation/ràng buộc giá, thời điểm, trạng thái và cách biểu diễn các slot 30 phút liên tiếp của booking; thiết kế giới hạn 3 booking tương lai chưa hủy mỗi khách, an toàn với request đồng thời cùng tài khoản, và giới hạn thời lượng 30/60/90/120 phút, tối đa 120 phút mỗi booking; thiết kế refresh token/phiên, rotation/thu hồi/cookie/CSRF và API login/refresh/logout; liệt kê API auth, sân, slot, booking cá nhân và admin; viết ví dụ request/response/lỗi; ghi quyết định còn tranh luận.
- **Bàn giao:** `docs/DESIGN.md` chứa Mermaid ERD và thiết kế API. Chưa cần OpenAPI hoàn chỉnh.
- **Nghiệm thu/kiểm tra:** mô hình diễn đạt được hủy/đặt lại, đổi giá, vô hiệu hóa sân, lọc sân theo địa điểm, quản lý tài khoản và phân quyền; mô phỏng ba tình huống FB-001 bằng dữ liệu mẫu.
- **Review:** G1-04 đến G1-06.

### FB-003 — Môi trường local

- **Mục tiêu:** có nền tảng chạy được trước khi thêm tính năng.
- **Cần hiểu:** cấu hình môi trường, migration, seed, port và kết nối container.
- **Bắt đầu khi:** FB-002 đã review.
- **Các bước:** khởi tạo Express/TypeScript và React/Vite; cấu hình Prisma/PostgreSQL local qua Compose; tạo migration và seed; bổ sung `.env.example`, `.gitignore`; tạo endpoint health đơn giản.
- **Bàn giao:** ứng dụng tối thiểu, migration/seed và hướng dẫn chạy local đã kiểm chứng.
- **Nghiệm thu/kiểm tra:** backend khởi động, frontend mở được, đọc được dữ liệu sân mẫu; không có secret trong file theo dõi.
- **Review:** giải thích đường kết nối API–database và phân biệt migration với seed.

## Giai đoạn 2 — Một luồng hoàn chỉnh

### FB-004 — Đăng ký, đăng nhập và phân quyền

- **Mục tiêu:** xác định đúng người dùng và vai trò.
- **Cần hiểu:** hash mật khẩu, access JWT có hạn, refresh token, rotation/thu hồi phiên, cookie/CSRF và authentication/authorization.
- **Bắt đầu khi:** FB-003 chạy được.
- **Các bước:** làm đăng ký, đăng nhập, lấy user hiện tại, refresh và logout; chốt quyết định lưu token, thời hạn phiên, rotation/reuse, bảo vệ cookie/CSRF và phối hợp refresh; thêm middleware xác thực/quyền; seed admin theo cấu hình không lộ secret.
- **Bàn giao:** module auth và luồng đăng nhập React tối giản.
- **Nghiệm thu/kiểm tra:** mật khẩu không lưu dạng rõ; đăng ký không tự cấp admin; sai mật khẩu/token thiếu, hỏng hoặc hết hạn bị từ chối; API admin chặn khách; refresh hợp lệ cấp token mới, token sai/hết hạn/thu hồi bị từ chối, rotation/reuse và request đồng thời theo DESIGN đã chốt; logout không refresh lại được, xác minh giới hạn hiệu lực access token sau logout; cookie/CSRF và retry/nhiều tab có kiểm tra thực tế.
- **Review:** G2-02 đến G2-04.

### FB-005 — Sân và giờ trống

Bổ sung phạm vi 2026-11-03: Court có loại sân 5/7/11 (số người mỗi đội); admin khai báo loại, khách xem trong thông tin sân. Thiết kế trường/validation tại FB-002, triển khai cùng quản lý sân. Chưa thêm kích thước sân cụ thể.


- **Mục tiêu:** khách biết sân nào và giờ nào có thể đặt.
- **Cần hiểu:** validation, ngày theo múi giờ, phân biệt thông tin hiển thị với bảo đảm lúc ghi.
- **Bắt đầu khi:** FB-004 sẵn sàng.
- **Các bước:** admin tạo/sửa/vô hiệu hóa sân; khách xem danh sách/chi tiết; sinh slot theo ngày và đối chiếu booking; làm UI chọn chi nhánh/địa điểm → sân → ngày; hiển thị địa chỉ chi nhánh khi xem sân (lưu Branch.address, lấy qua Court.branchId).
- **Bàn giao:** module courts, API availability và giao diện xem slot.
- **Nghiệm thu/kiểm tra:** hiển thị slot 30 phút bắt đầu từ 06:00 đến 21:30; booking bắt đầu ở phút 00/30 và có thời lượng 30, 60, 90 hoặc 120 phút, kết thúc không muộn hơn 22:00; slot quá khứ/ngoài cửa sổ đặt không nhận đặt; sân vô hiệu hóa không nhận lịch mới; lịch sử không bị xóa.
- **Review:** G1-03 và G2-05.

### FB-006 — Đặt, xem và hủy booking

- **Mục tiêu:** hoàn tất luồng nghiệp vụ cốt lõi.
- **Cần hiểu:** kiểm tra phía server, quyền sở hữu, snapshot giá và trạng thái.
- **Bắt đầu khi:** FB-005 chạy được.
- **Các bước:** đặt bằng sân/giờ bắt đầu/thời lượng 30, 60, 90 hoặc 120 phút; backend tính giá mỗi slot 30 phút × số slot và gắn user từ JWT; lấy lịch cá nhân; giới hạn 3 booking tương lai chưa hủy mỗi khách; hủy trước giờ bắt đầu ít nhất 60 phút; làm UI xác nhận, lịch cá nhân, lỗi và tải lại slot; hiển thị hạn hủy và cảnh báo “Booking này đã qua hạn tự hủy. Vui lòng kiểm tra kỹ giờ đến.” trước xác nhận nếu còn dưới 60 phút.
- **Bàn giao:** module bookings và luồng React đặt → xem → hủy.
- **Nghiệm thu/kiểm tra:** reload còn dữ liệu; khách không giả user/giá, xem/hủy của người khác; khách chỉ hủy khi còn ít nhất 60 phút, đúng ranh giới được phép và sau ranh giới bị từ chối; admin hủy riêng không bị giới hạn này; hủy không xóa lịch sử và giải phóng toàn bộ slot của booking. Ghi rõ chống tranh slot sẽ hoàn thiện tại FB-008.
- **Review:** G2-01, G2-04 đến G2-06.

### FB-007 — Hoàn thiện luồng admin

- **Mục tiêu:** vận hành demo bằng giao diện đơn giản.
- **Cần hiểu:** lọc dữ liệu, giới hạn quyền và thông báo lỗi.
- **Bắt đầu khi:** FB-006 chạy được.
- **Các bước:** nối UI admin với quản lý sân và địa điểm; bổ sung xem tài khoản khách (khách tự đăng ký, bỏ admin tạo khách theo quyết định FB-002 ngày 2026-11-03), xem lịch sử BookingBlockHistory chỉ dành cho admin và chặn/mở chặn đặt mới theo quy tắc hiện hành (đã bỏ mức khóa tại FB-002); xem booking theo ngày/sân; hủy booking, gồm ngoại lệ khi khách liên hệ xin đổi giờ theo REQUIREMENTS (admin hủy riêng rồi khách tự đặt lại, chưa có đổi giờ tự động/đặt hộ); hiển thị trạng thái tải, lỗi và rỗng.
- **Bàn giao:** bảng admin tối giản, không đầu tư trang trí.
- **Nghiệm thu/kiểm tra:** đi hết luồng khách và admin; gọi trực tiếp API vẫn bị kiểm tra quyền, không chỉ ẩn nút trên UI; quản lý tài khoản tuân thủ quy tắc đã chốt: khách không đọc lịch sử chặn nội bộ kể cả gọi API trực tiếp; cập nhật User.isBookingBlocked và thêm lịch sử có reason nguyên tử (không lưu lý do trên User), thao tác thất bại không để dữ liệu nửa chừng; không có CustomerNote trong app; admin chặn/mở chặn thủ công và ghi lý do; khách bị chặn không đặt mới nhưng vẫn đăng nhập/xem/hủy booking hợp lệ, giữ booking hiện có; backend kiểm tra trạng thái chặn hiện tại khi đặt kể cả token cấp trước khi chặn; mở chặn cho đặt mới khi đủ điều kiện khác; không có thao tác khóa/mở khóa tài khoản; xóa mềm chỉ bổ sung nếu chốt nhu cầu riêng ở FB-001.
- **Review:** chọn 3–5 câu giai đoạn 2 dựa trên code thực tế.

## Giai đoạn 3 — Tính đúng đắn và kiểm thử

### FB-008 — Chống đặt trùng ở database

- **Mục tiêu:** hai request tranh ít nhất một slot 30 phút chỉ có một booking thành công; không giữ slot dở dang.
- **Cần hiểu:** race condition, unique constraint/index và vai trò của transaction.
- **Bắt đầu khi:** FB-006 có luồng đặt/hủy; có thể thực hiện trước FB-007 nếu thuận tiện.
- **Các bước:** minh họa vấn đề check-rồi-insert; thêm ràng buộc database bằng SQL migration theo mô hình đã chốt ở FB-002 để bảo vệ từng slot 30 phút bị chiếm; nếu lưu từng slot, dùng partial unique index trên sân/thời điểm slot hiệu lực; unique trên giờ bắt đầu booking riêng lẻ không đủ; bảo đảm ghi nhiều slot nguyên tử; chuyển xung đột sang `409`; xem xét tính nhất quán khi đặt đồng thời với cập nhật sân; ghi quyết định và giới hạn.
- **Bàn giao:** migration, xử lý lỗi và giải thích cơ chế trong DESIGN.
- **Nghiệm thu/kiểm tra:** test request đồng thời bằng PostgreSQL thật: một thành công, một `409`, một booking hiệu lực cho phần thời gian tranh chấp; kiểm tra cả booking khác giờ bắt đầu nhưng chồng lấn, request thua không giữ slot dở dang; hủy giải phóng đủ các slot và đặt lại được. Migration dựng mới được từ đầu. Kiểm tra giới hạn mỗi tài khoản: đang có 2 booking tương lai, hai request hợp lệ đồng thời cho sân/giờ khác nhau chỉ thêm tối đa 1 booking; request thua không giữ slot.
- **Review:** G3-01 đến G3-05; không dùng test đơn lẻ làm bằng chứng chịu tải.

### FB-009 — Bộ integration test

- **Mục tiêu:** bảo vệ quy tắc cốt lõi, dễ chạy lại.
- **Cần hiểu:** setup/cleanup, test isolation, dữ liệu thời gian ổn định và giới hạn mock.
- **Bắt đầu khi:** FB-008 và các luồng API đã sẵn sàng.
- **Các bước:** cấu hình Vitest/Supertest với DB riêng; bổ sung test auth gồm refresh/rotation/reuse/logout/expiry và cookie/CSRF, ownership/admin, slot, sân inactive, hủy/đặt lại, giá cũ, tính giá theo số slot 30 phút, slot liên tiếp, hủy giải phóng đủ slot và tranh slot chồng lấn; kiểm tra giá số nguyên VND > 0 (từ chối 0, âm, phần lẻ đồng, dữ liệu sai kiểu và vượt trần 536.870.911/slot, kiểm tra tổng tại trần cho đủ 4 slot), snapshot/tổng giá tính phía server; kiểm tra thời lượng hợp lệ 30/60/90/120, từ chối 0/45/150 phút, kiểm tra ranh giới đóng cửa với booking 120 phút; kiểm tra giới hạn 3 booking tương lai chưa hủy mỗi khách, hủy/bắt đầu giải phóng hạn mức và request đồng thời cùng tài khoản; kiểm tra lỗi trả về; bổ sung test lọc sân theo địa điểm và quyền admin xem lịch sử chặn và chặn/mở chặn, mọi thao tác thành công ghi đúng actor/khách/action/reason/thời điểm; không có API sửa/xóa lịch sử; kiểm tra nguyên tử giữa trạng thái User và lịch sử; tác động chặn đặt: token cấp trước khi chặn vẫn không đặt mới được, nhưng đăng nhập/xem/hủy hợp lệ vẫn được; giữ booking cũ, mở chặn đặt lại khi đủ điều kiện. Kiểm thử không dựa chỉ vào cờ cũ trong JWT; không còn tính năng khóa tài khoản.
- **Bàn giao:** test có lệnh chạy được ghi trong README.
- **Nghiệm thu/kiểm tra:** chạy độc lập từ DB test sạch; có bảo vệ tránh nhầm production; không phụ thuộc thứ tự test hoặc dữ liệu thủ công. Kiểm tra ranh giới giờ/ngày và hạn hủy 60 phút bằng mốc thời gian kiểm soát được: trước/đúng/sau hạn, booking đặt khi còn dưới 60 phút, khách bị chặn đặt và quyền hủy riêng của admin. Kiểm tra cảnh báo đặt sát giờ trước/đúng/sau hạn, gồm màn hình đang mở vượt hạn; kiểm tra luồng admin hủy rồi khách đặt lại không được cam kết giữ giờ mới.
- **Review:** G3-06, G3-07 và 3 câu còn yếu trong giai đoạn.

## Giai đoạn 4 — CI

### FB-010 — Học và thiết lập GitHub Actions

- **Mục tiêu:** push/PR được kiểm tra tự động.
- **Cần hiểu:** workflow, event, job, step, runner, service DB; CI khác CD.
- **Bắt đầu khi:** test/build/kiểm tra kiểu chạy local; đã có repository GitHub hoặc thiết lập cùng người học khi bắt đầu ticket.
- **Các bước:** giải thích sơ đồ workflow; chọn phiên bản Node phù hợp project và lockfile; cấu hình cài dependencies, DB test/migration, typecheck, test, build; đọc log khi lỗi.
- **Bàn giao:** workflow và hướng dẫn xem kết quả.
- **Nghiệm thu/kiểm tra:** có run thật thành công trên GitHub; tạo lỗi typecheck hoặc test có chủ đích trên nhánh để quan sát thất bại, sửa và chạy lại; giữ bằng chứng. Chưa tự động deploy.
- **Review:** chọn 3–5 câu giai đoạn 4.

## Giai đoạn 5 — Deploy thủ công

### FB-011 — Chuẩn bị VPS và bản đóng gói

- **Mục tiêu:** hiểu môi trường đích và các thao tác trước khi triển khai.
- **Cần hiểu:** SSH key, user, port/firewall, DNS, container network và volume.
- **Bắt đầu khi:** CI hoạt động, người học xác nhận ngân sách và dịch vụ định sử dụng.
- **Các bước:** kiểm tra giá/điều kiện hiện tại trước khi thuê; người học tự mua/cấp quyền; kiểm tra OS, tài nguyên và dịch vụ sẵn có; chuẩn bị Dockerfile/Compose production, cấu hình mẫu và domain.
- **Bàn giao:** cấu hình đóng gói và `docs/DEPLOYMENT.md`, không chứa thông tin đăng nhập.
- **Nghiệm thu/kiểm tra:** image build được; người học giải thích vai trò từng service và nơi lưu dữ liệu; không đụng dịch vụ cũ hoặc mở DB ra internet; chưa thay firewall trước khi xác minh cách duy trì SSH.
- **Review:** G5-01 đến G5-04.

### FB-012 — Chạy app qua HTTPS

- **Mục tiêu:** demo công khai truy cập được từ máy khác.
- **Cần hiểu:** reverse proxy, DNS/TLS, biến môi trường, migration production và log.
- **Bắt đầu khi:** FB-011 sẵn sàng, domain trỏ đúng và phạm vi thao tác server được giao rõ.
- **Các bước:** cung cấp secret trên server; chạy Compose, migration, seed demo; cấu hình Caddy/HTTPS; dùng dữ liệu demo, không dùng dữ liệu cá nhân thật.
- **Bàn giao:** URL demo, quy trình triển khai thủ công, bước kiểm tra sức khỏe và log.
- **Nghiệm thu/kiểm tra:** từ máy khác đăng nhập → đặt → xem → hủy; API admin được bảo vệ; HTTPS hoạt động; chỉ public cổng cần thiết; khởi động lại container giữ dữ liệu.
- **Review:** G5-01, G5-03 đến G5-05.

### FB-013 — Cập nhật, chẩn đoán và backup/restore

- **Mục tiêu:** không chỉ chạy được một lần mà còn biết vận hành cơ bản.
- **Cần hiểu:** vòng đời dữ liệu, backup khác volume, rollback app khác rollback schema.
- **Bắt đầu khi:** FB-012 hoạt động.
- **Các bước:** cập nhật một thay đổi nhỏ; ghi quy trình migration và phương án quay lại bản app trước tương thích; backup PostgreSQL; restore vào DB/môi trường riêng; mô phỏng một lỗi dịch vụ và đọc log.
- **Bàn giao:** runbook cập nhật, xử lý lỗi và backup/restore trong DEPLOYMENT.
- **Nghiệm thu/kiểm tra:** khôi phục thử thấy đúng dữ liệu; có ghi thời điểm và kết quả; không ghi đè DB đang dùng để thử; mô tả được giới hạn rollback khi schema thay đổi.
- **Review:** G5-06 đến G5-08; ôn 3–5 câu giai đoạn 5.

## Giai đoạn 6 — Hồ sơ và phỏng vấn

### FB-014 — Tài liệu và demo

- **Mục tiêu:** người chưa biết project có thể đánh giá và chạy thử.
- **Cần hiểu:** tài liệu tái lập được khác với mô tả chung.
- **Bắt đầu khi:** các luồng chính, test, CI và deploy đã có bằng chứng.
- **Các bước:** hoàn thiện README, ERD, OpenAPI, hướng dẫn seed/test/deploy; quay video demo khoảng 3–5 phút; nêu giới hạn; chỉ công bố tài khoản demo quyền phù hợp.
- **Bàn giao:** tài liệu, đặc tả API và demo.
- **Nghiệm thu/kiểm tra:** làm theo README từ môi trường sạch; link đúng; tài liệu API khớp hành vi; không lộ secret hoặc tài khoản quản trị production.
- **Review:** G6-01, G6-05 và phần trình bày luồng demo.

### FB-015 — CV và mock interview

- **Mục tiêu:** mô tả trung thực và giải thích được project.
- **Cần hiểu:** phát biểu có bằng chứng và phân biệt trách nhiệm cá nhân/AI.
- **Bắt đầu khi:** FB-014 có kết quả và câu trả lời các chặng đã được ghi nhận.
- **Các bước:** tự giới thiệu 60–90 giây; viết 2–3 bullet CV từ kết quả thực; mentor hỏi giai đoạn 6 và đào sâu code/test/deploy; sửa những phát biểu chưa có bằng chứng.
- **Bàn giao:** `docs/CV_NOTES.md` và ghi chú mock interview khi làm ticket.
- **Nghiệm thu/kiểm tra:** từng bullet có bằng chứng; không bịa số liệu; người học giải thích được phần AI hỗ trợ và lỗi thực tế đã gặp. Nếu chưa gặp lỗi đáng kể, ghi đúng điều đó.
- **Review:** G6-01 đến G6-06.

## Quy tắc hoàn thành

Task chạy được nhưng chờ review đặt `IN_REVIEW`. Chỉ `DONE` khi đạt tiêu chí, có bằng chứng và người học xác nhận hiểu phần chính. Theo dõi câu hỏi cần ôn riêng; không bắt thuộc câu trả lời mới được làm task độc lập.
