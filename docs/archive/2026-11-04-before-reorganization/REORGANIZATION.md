# Tổ chức tài liệu ngày 2026-11-04

Yêu cầu: tối ưu context đầu phiên, giữ nguyên nghiệp vụ/bằng chứng/mức hiểu. Không thay đổi quyết định thiết kế hoặc tự tiếp tục buổi FB-002 đã dừng.

## Bảo toàn

- Tám file gốc được sao chép nguyên bytes, SHA-256 ghi trong manifest.json. Đây là lịch sử, không phải nguồn hướng dẫn hiện hành.
- Tất cả mục cấp hai trong DESIGN gốc có đường dẫn đích hoặc ghi rõ giữ ở lịch sử trong bảng dưới. Không xóa các đề xuất cũ/lý do; các mục điều hướng đã lỗi thời được thay bằng chỉ mục hiện hành.
- Toàn bộ bảy giai đoạn câu hỏi/câu trả lời được chuyển theo khối; bảng trạng thái câu hỏi được đối chiếu nguyên hàng, không nâng mức hiểu. Hướng dẫn review/CV chuyển sang learning/review-guide.md.
- README giữ nguyên phần xuất phát điểm/phạm vi nghiệp vụ phía dưới, chỉ sửa trạng thái/lối vào. REQUIREMENTS chỉ sửa một câu tóm tắt hủy lặp lỗi thời cho khớp hợp đồng 200 đã duyệt, không đổi quy tắc mới; nguyên bản vẫn ở snapshot. Tiêu chí ticket ROADMAP giữ nguyên, chỉ cập nhật cách đọc/vị trí bàn giao thiết kế.
- timestamptz(3) vẫn chưa duyệt; FB-002 IN_PROGRESS; lỗi auth/đa tab chưa hoàn tất. Các yêu cầu demo trực quan auth và BookingSlot giữ trong bàn giao/chỉ mục học tập.

## Bản đồ mục DESIGN gốc

| Mục gốc | Nơi đọc sau tổ chức |
| --- | --- |
| ERD cốt lõi — bản tổng hợp để review 2026-11-04 | docs/design/data-model.md (moved) |
| Dữ liệu thời gian Booking — mentor đề xuất theo yêu cầu người học | docs/design/data-model.md (moved) |
| Trạng thái và thông tin hủy — đã duyệt 2026-11-02 | docs/design/data-model.md (moved) |
| Giá lịch sử — đã duyệt 2026-11-02 | docs/design/data-model.md (moved) |
| Biểu diễn tiền — đã duyệt 2026-11-02 | docs/design/data-model.md (moved) |
| Thông tin Branch và Court — đã duyệt 2026-11-02 | docs/design/data-model.md (moved) |
| Trường User — đã duyệt 2026-11-02 | docs/design/data-model.md (moved) |
| Lịch sử chặn — giữ BookingBlockHistory, bỏ CustomerNote | docs/design/data-model.md (moved) |
| Lý do chỉ lưu trên lịch sử — đã duyệt 2026-11-02 | docs/design/data-model.md (moved) |
| Bảng phục vụ đặt sân — đã chọn phương án BookingSlot 2026-11-03 | docs/design/booking-slots.md (moved) |
| Review cách biểu diễn slot được đặt lại — 2026-11-04 | docs/design/booking-slots.md (moved) |
| Giới hạn 3 booking — đã duyệt hướng khóa dòng User 2026-11-03 | docs/design/transactions.md (moved) |
| Court thay đổi đồng thời — chốt hướng transaction ngắn 2026-11-03 | docs/design/transactions.md (moved) |
| Quy ước response — khung tạm thời đã duyệt 2026-11-03 | docs/design/api-common.md, docs/design/api-bookings.md (split; introductory review retained in snapshot) |
| API lịch đặt cá nhân — GET /bookings/me | docs/design/api-bookings.md (moved) |
| API khách hủy booking — POST /bookings/:bookingId/cancel | docs/design/api-bookings.md (moved) |
| API admin hủy booking — POST /admin/bookings/:bookingId/cancel | docs/design/api-bookings.md (moved) |
| API danh sách booking quản trị — GET /admin/bookings | docs/design/api-bookings.md (moved) |
| API danh sách chi nhánh — GET /branches | docs/design/api-courts.md (moved) |
| Loại sân — trường và cách lưu đã duyệt 2026-11-03 | docs/design/api-courts.md (moved) |
| API danh sách sân — GET /courts (đã duyệt 2026-11-03) | docs/design/api-courts.md (moved) |
| API chi tiết sân — GET /courts/:courtId | docs/design/api-courts.md (moved) |
| API giờ trống — hợp đồng đã duyệt 2026-11-03 | docs/design/api-courts.md (moved) |
| API admin tạo sân — POST /admin/courts (hợp đồng đã duyệt 2026-11-03) | docs/design/api-courts.md (moved) |
| API admin sửa sân — hợp đồng đã duyệt 2026-11-03 | docs/design/api-courts.md (moved) |
| API admin danh sách sân — GET /admin/courts (đã duyệt 2026-11-03) | docs/design/api-courts.md (moved) |
| Hạn chế tài khoản — đã chốt chỉ chặn đặt mới 2026-11-02 | docs/design/api-customers.md (moved) |
| API admin danh sách khách — GET /admin/customers (đã duyệt 2026-11-03) | docs/design/api-customers.md (moved) |
| Tạo tài khoản khách — quyết định phạm vi cập nhật 2026-11-03 | docs/design/api-customers.md (moved) |
| API admin chặn/mở chặn đặt — hợp đồng API đã duyệt, còn chi tiết concurrency | docs/design/api-customers.md (moved) |
| API admin lịch sử chặn đặt — đã duyệt 2026-11-03 | docs/design/api-customers.md (moved) |
| Refresh token — phương án cơ bản đã duyệt 2026-11-02 | docs/design/auth.md (moved) |
| Đăng ký khách — hợp đồng API đã duyệt 2026-11-03 | docs/design/auth.md (moved) |
| Đăng nhập — POST /auth/login (hợp đồng chính đã duyệt 2026-11-03) | docs/design/auth.md (moved) |
| Tài khoản hiện tại — GET /auth/me (đã duyệt 2026-11-03) | docs/design/auth.md (moved) |
| Gia hạn phiên — POST /auth/refresh (đề xuất hợp đồng cơ bản chờ duyệt) | docs/design/auth.md (moved) |
| Logout phiên hiện tại — luồng chính đã duyệt 2026-11-04 | docs/design/auth.md (moved) |
| Cookie và CSRF — chính sách đã duyệt 2026-11-04 | docs/design/auth.md (moved) |
| Phối hợp refresh đồng thời — bước giải thích tiếp theo, chưa chốt đầy đủ | docs/design/auth.md (moved) |
| Refresh/logout thất bại — chính sách đề xuất để review 2026-11-04 | docs/design/auth.md (moved) |
| Điều chỉnh nhịp học auth — yêu cầu người học 2026-11-04 | docs/design/auth.md (moved) |
| Kiểu ID — đã duyệt UUID 2026-11-04 | docs/design/constraints.md (consolidated; complete discussion retained in snapshot) |
| Xóa Court có lịch sử — đã duyệt RESTRICT 2026-11-04 | docs/design/constraints.md (consolidated; complete discussion retained in snapshot) |
| Khóa ngoại Court → Branch — đã duyệt RESTRICT 2026-11-04 | docs/design/constraints.md (consolidated; complete discussion retained in snapshot) |
| Khóa ngoại lịch sử → User — đã duyệt RESTRICT 2026-11-04 | docs/design/constraints.md (consolidated; complete discussion retained in snapshot) |
| BookingSlot → Booking — đã duyệt RESTRICT 2026-11-04 | docs/design/constraints.md (consolidated; complete discussion retained in snapshot) |
| RefreshToken → User — đã duyệt CASCADE 2026-11-04 | docs/design/constraints.md (consolidated; complete discussion retained in snapshot) |
| Tổng hợp ON DELETE đã duyệt — 2026-11-04 | docs/design/constraints.md (consolidated; complete discussion retained in snapshot) |
| ON UPDATE và tính bất biến của ID — đã duyệt 2026-11-04 | docs/design/constraints.md (consolidated; complete discussion retained in snapshot) |
| Kiểu cột thời gian — đề xuất để review 2026-11-04 | docs/design/constraints.md (consolidated; complete discussion retained in snapshot) |
| Quan hệ đã review | docs/archive/2026-11-04-before-reorganization/docs/DESIGN.md (historical review/navigation; current counterpart in DESIGN index or topic files) |
| Khóa ngoại đã review | docs/archive/2026-11-04-before-reorganization/docs/DESIGN.md (historical review/navigation; current counterpart in DESIGN index or topic files) |
| Nhóm chi nhánh/địa điểm — bảng riêng đã được người học chọn | docs/archive/2026-11-04-before-reorganization/docs/DESIGN.md (historical review/navigation; current counterpart in DESIGN index or topic files) |
| Bước thiết kế tiếp theo | docs/archive/2026-11-04-before-reorganization/docs/DESIGN.md (historical review/navigation; current counterpart in DESIGN index or topic files) |
| Phần còn phải thiết kế trong FB-002 | docs/archive/2026-11-04-before-reorganization/docs/DESIGN.md (historical review/navigation; current counterpart in DESIGN index or topic files) |

## Kiểm tra thực sự

- Đã chạy script tổ chức và kiểm tra tài liệu: hash tám snapshot, ánh xạ 55 mục DESIGN; giữ nguyên toàn bộ nội dung bảy giai đoạn và 44 hàng trạng thái; giữ 16 trạng thái ticket, 12 ví dụ SQL/JSON, chín quyết định ON DELETE và ON UPDATE; kiểm tra liên kết nội bộ/anchor/code fence. Kết quả chi tiết: [validation.json](validation.json).
- Kiểm tra không đổi các phần mentor/chất lượng/CI/VPS trong AGENTS; phạm vi README giữ nguyên; REQUIREMENTS chỉ đồng bộ hủy lặp 200 đã duyệt; tiêu chí nghiệm thu FB-002 không thay đổi. Không đánh dấu auth/ràng buộc đã triển khai, timestamptz(3) vẫn chưa duyệt.
- Không có ứng dụng/schema/database để test; không chạy test API/DB và không tạo benchmark hiệu năng sản phẩm. Không commit/push.

## Lượng đọc trước/sau

Đo cùng bốn file AGENTS/ROADMAP/PROGRESS/DESIGN bằng bộ ước lượng đầu ra của exec_command: khoảng 110.392 → 10.052 token, giảm 90,9%. Chỉ AGENTS + PROGRESS + chỉ mục DESIGN khoảng 4.459 token, rồi đọc đúng ticket/chương liên quan theo nhu cầu. Cùng bảy file vào trước/sau: khoảng 140.724 → 15.927 token.

Đây là ước lượng nội dung văn bản, không phải token tính phí của một request/session; chưa gồm system/hội thoại/code/tool schemas. Không cam kết mọi phiên giảm cùng tỷ lệ. Chi tiết phạm vi và phương pháp: [context-metrics.json](context-metrics.json). Archive và các chương vẫn tồn tại trên đĩa; không nạp toàn bộ chúng theo mặc định.

## Quy tắc bảo trì

- Cập nhật đúng chương hiện hành khi quyết định đổi, đánh dấu rõ đã duyệt/chưa duyệt. Không nhân bản toàn bộ quyết định/lời giải thích trong PROGRESS.
- Gộp ghi tiến độ theo buổi/thay đổi có ý nghĩa; nếu cần lưu chi tiết mới, tạo nhật ký archive riêng thay vì sửa snapshot nguyên bản này.
- Chỉ đổi mức hiểu từ câu trả lời/bằng chứng thực tế; tra hồ sơ stage tương ứng khi review. Giữ nhu cầu demo trực quan ở chỉ mục học tập.
