# Giai đoạn 3 — Tính đúng đắn và kiểm thử

[Chỉ mục học tập](../INTERVIEW_PREP.md) · Nội dung được chuyển theo giai đoạn, không nâng mức hiểu.

Các câu trả lời/nhật ký bên dưới giữ bằng chứng tại thời điểm ghi; quyết định nghiệp vụ hiện hành tra README và chỉ mục DESIGN, không triển khai theo đề xuất cũ đã bị thay thế. Chỉ đọc câu/mục cần review, không nạp toàn bộ lịch sử để bắt đầu phiên.


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

## Nhu cầu đi chậm khi gặp khóa — 2026-11-04

- Sau trace refresh/logout và hai refresh dùng cùng token, người học nói: “Ok những hiểu rồi nhưng những phần có khoá thì hãy dừng lại đi chậm và giải thích để tôi hiểu nhé.” Ghi nhận tự xác nhận đã hình dung sau giải thích; chưa có lời giải thích độc lập/thực hành để nâng G3-04, chưa phải duyệt phương án khóa User cho auth.
- Yêu cầu mentor: mỗi khi gặp cơ chế khóa (database hoặc phối hợp frontend), dừng tại đoạn đó, giải thích phạm vi/tài nguyên bị khóa, request nào giữ/chờ, dữ liệu đọc lại sau chờ và khi nào nhả khóa; trace từng tình huống ngắn rồi chờ người học trước khi tăng độ khó. Khi code dùng demo local/test, không coi mô tả lý thuyết là demo đã chạy.

- Xác nhận tiếp theo cùng buổi: người học nói “Ok duyệt.” cho hướng khóa User phối hợp refresh/logout/reuse. Đã duyệt thiết kế; vẫn đi chậm/trace khi gặp khóa. Chưa có giải thích độc lập hoặc demo để nâng G3-04.

- Sau trace Web Lock chung auth: A refresh thành công rồi nhả khóa, B logout chờ và dùng cookie mới, người học xác nhận “Ok hình dung được rồi.” và hỏi tiến độ. Ghi nhận đã hình dung qua giải thích; chưa có tự giải thích/demo và chưa coi là duyệt toàn bộ logout đa tab. Giữ yêu cầu đi chậm ở đoạn có khóa.
