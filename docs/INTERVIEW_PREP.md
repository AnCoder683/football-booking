# Học tập và review — chỉ mục

Mức hiểu giữ nguyên theo câu trả lời thực tế; không suy ra đã hiểu từ “Ok” hoặc code chạy. Hồ sơ chi tiết được tách theo giai đoạn, không cần đọc toàn bộ đầu phiên.

## Giai đoạn đang làm

- **Ưu tiên hiện hành — dừng cuối buổi 2026-11-17:** người học yêu cầu buổi sau tracing lại từ đầu nội dung hôm nay. Bắt đầu mục đích tách Booking/BookingSlot với một đơn 90 phút/ba slot; từng đoạn nhỏ rồi chờ, mức Backend intern, không yêu cầu thuộc SQL. Sau đó mới quan hệ Prisma/FK/courtId, schema/CHECK, service availability và FE; thay ưu tiên demo FE trước. Chưa nâng mức hiểu từ xác nhận hoặc test pass; [hồ sơ học](learning/stage-2.md#review-availability--2026-11-17), bằng chứng kỹ thuật tại PROGRESS.

- **Bàn giao buổi sau — 2026-11-17:** người học tạm dừng sau khi viết đủ endpoint FB-005, yêu cầu tracing availability khi tiếp tục. Theo yêu cầu bổ sung, bắt đầu bằng schema BookingStatus/Booking/BookingSlot và các quan hệ User/Court, sau đó migration 20261117050000_create_booking_slots (FK/CHECK/unique, đã áp dụng test/local); mỗi lượt một phần nhỏ rồi chờ. Sau phần database mới tracing getCourtAvailability từ findUnique; chưa làm UI hoặc API đặt/hủy. Mức hiểu không tăng từ test pass; chi tiết tại [stage-2](learning/stage-2.md#review-availability--2026-11-17).

- **FB-005 — availability, 2026-11-17:** agent đã triển khai slot/ngày, migration Booking/BookingSlot và kiểm chứng HTTP/DB; chưa là bằng chứng người học hiểu schema/khóa/index. Vẫn cần demo trực quan request/DB trước–sau, releasedAt và EXPLAIN như yêu cầu phía dưới; bàn giao tại [stage-2](learning/stage-2.md#review-availability--2026-11-17).

- **FB-005 — review tạo sân, 2026-11-17:** đã có diễn giải độc lập về xác thực/quyền ADMIN, kiểm tra chi nhánh, tạo sân và lỗi chi nhánh bị xóa; còn bổ sung vị trí validation và phân biệt map 409 với throw lỗi khác. Bằng chứng tại [stage-2](learning/stage-2.md#review-api-admin-tạo-sân--2026-11-17); không suy ra đã hiểu index/concurrency.

- FB-003 DONE ngày 2026-11-05: ứng dụng local/seed/test và ảnh desktop có bằng chứng, review phần chính đạt; [kết luận và giới hạn mức hiểu](learning/stage-1.md#kết-luận-review-fb-003--2026-11-05). G1-07 vẫn cần ôn riêng.

- FB-002: G1-04/G1-05 đã giải thích được; G1-06 còn cần ôn. Đây là trạng thái của câu hỏi, không phải xác nhận đã triển khai toàn bộ tính năng.
- FB-000 vẫn IN_REVIEW: G0-05 cần luyện xác định kết quả mong đợi và tự kiểm chứng code AI.
- G3-04 còn cần ôn: có ví dụ hiểu COMMIT/ROLLBACK cơ bản; chưa chứng minh toàn bộ concurrency/khóa/ràng buộc.
- Không đổi trạng thái câu hỏi hoặc trả lời thay người học trong lần tổ chức tài liệu này.

- **G1-07 — ưu tiên ôn khi xin việc theo yêu cầu người học:** Prisma schema so với ràng buộc SQL, quy trình và lịch sử migration; [câu hỏi ôn gắn với Branch/Court thực tế](learning/stage-1.md#g1-07--ôn-prisma-và-sql-migration-khi-xin-việc). Cần ôn, chưa có câu trả lời độc lập.

- **Điểm dừng hiện hành 2026-11-16:** FB-004 DONE theo yêu cầu rõ của người học, phạm vi Backend intern; backend 129/129 test và TypeScript pass, HTTP/DB logout-refresh đồng thời pass, seed ADMIN và demo browser cơ bản có bằng chứng. Browser mất mạng/đóng tab/response cookie muộn hoãn và chưa có fallback thiếu Web Locks; giới hạn tại [PROGRESS](PROGRESS.md). Không nâng mức hiểu FE hoặc câu hỏi từ trạng thái DONE; bằng chứng độc lập tại [stage-2](learning/stage-2.md). Bước tiếp theo: đọc phạm vi FB-005, chọn một luồng BE nhỏ; ownership/chặn đặt mới học ở FB-006.

## Cần hướng dẫn trực quan khi code

- **Nhịp review hiện hành — 2026-11-16:** người học yêu cầu viết trọn một luồng trước rồi nghỉ, buổi sau tracing từng bước. Đã viết refresh; **một bước tiếp theo:** nhánh 401 trong AuthProvider response interceptor, mỗi lượt một đoạn nhỏ rồi chờ. Chưa mở F5/test nâng cao. Review Context và bằng chứng hiểu Web Locks/Promise tại [stage-2](learning/stage-2.md#bàn-giao-tracing-login--buổi-sau); không nâng mức hiểu từ lời “Ok”.

- **CSRF/CORS — nội dung cần ôn:** đã có review độc lập một số nhánh CSRF và phân biệt GET Accept/POST JSON về preflight, vai trò BE/trình duyệt; chưa demo browser. Xem [bằng chứng và yêu cầu trực quan](learning/stage-2.md#csrf--cần-giải-thích-lại-khi-người-học-yêu-cầu).

- **Mỗi khi gặp khóa:** dừng lại, đi chậm, trace từng request giữ/chờ/đọc lại/nhả khóa; chờ người học trước khi thêm tình huống. Áp dụng cho khóa DB và phối hợp frontend; xem [yêu cầu và bằng chứng](learning/stage-3.md#nhu-cầu-đi-chậm-khi-gặp-khóa--2026-11-04). Không nâng mức hiểu từ xác nhận đã hình dung.

- **Auth (FB-004 và FE liên quan):** Promise single flight → Web Locks → BroadcastChannel; demo hai tab, AT trong bộ nhớ riêng và refresh cookie chung, logout/response cũ/mất mạng. Chỉ dùng dữ liệu test, không log token.
- **BookingSlot (FB-006/008):** xem DB trước/sau đặt → hủy → đặt lại, releasedAt/null và kết quả truy vấn rỗng; sau luồng cơ bản mới chạy request đồng thời/unique index/rollback/409.
- **Index (khi triển khai query/schema/migration):** người học xác nhận đây là kiến thức mới, cần demo query và kế hoạch thực thi trước/sau index, thứ tự cột, index thường so với unique và chi phí khi ghi. Chi tiết bằng chứng/kế hoạch tại [hồ sơ giai đoạn 1](learning/stage-1.md#nhu-cầu-học-index--2026-11-04); chưa demo, chưa xác nhận hiểu.
- Người học thấy lỗi auth nâng cao rối, muốn học qua sản phẩm chạy. Không ép thuộc hết trước task độc lập; vẫn hoàn thiện quyết định cần thiết trước triển khai luồng tương ứng. Các demo/test trên chưa chạy.

## Hồ sơ theo giai đoạn

| Giai đoạn | Đọc khi | Hồ sơ gốc theo giai đoạn |
| --- | --- | --- |
| 0 | Tự đánh giá, kiểm chứng code AI | [Câu hỏi và bằng chứng](learning/stage-0.md) |
| 1 | Nghiệp vụ, ERD, API, local | [Câu hỏi và bằng chứng](learning/stage-1.md) |
| 2 | Xây tính năng, FE xử lý 409 | [Câu hỏi và bằng chứng](learning/stage-2.md) |
| 3 | Transaction, chống trùng, test | [Câu hỏi và bằng chứng](learning/stage-3.md) |
| 4 | GitHub Actions | [Câu hỏi và bằng chứng](learning/stage-4.md) |
| 5 | VPS/deploy | [Câu hỏi và bằng chứng](learning/stage-5.md) |
| 6 | CV/mock interview | [Câu hỏi và bằng chứng](learning/stage-6.md) |

[Cách ghi review/CV](learning/review-guide.md). Khi review, dùng rg tìm mã câu rồi đọc đoạn liên quan; chỉ đọc cả giai đoạn khi cần tổng hợp bằng chứng.

## Bảo toàn lịch sử

Toàn bộ nội dung trước khi tách được giữ [nguyên bản](archive/2026-11-04-before-reorganization/docs/INTERVIEW_PREP.md). Hồ sơ stage-0…6 giữ nguyên bảng trạng thái và các câu trả lời; quyết định đã thay thế không tự trở thành yêu cầu hiện hành.

- Review backend local FB-003 ngày 2026-11-05: [bằng chứng listen/health và phần mentor bổ sung](learning/stage-1.md#review-backend-local--2026-11-05); chưa review Prisma/migration/seed.

- Review Prisma local FB-003 ngày 2026-11-05: [bằng chứng SELECT 1, phân biệt generate/tạo bảng và Prisma/SQL trực tiếp](learning/stage-1.md#review-kết-nối-prisma--2026-11-05).
