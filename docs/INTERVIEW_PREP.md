# Học tập và review — chỉ mục

Mức hiểu giữ nguyên theo câu trả lời thực tế; không suy ra đã hiểu từ “Ok” hoặc code chạy. Hồ sơ chi tiết được tách theo giai đoạn, không cần đọc toàn bộ đầu phiên.

## Giai đoạn đang làm

- FB-003 DONE ngày 2026-11-05: ứng dụng local/seed/test và ảnh desktop có bằng chứng, review phần chính đạt; [kết luận và giới hạn mức hiểu](learning/stage-1.md#kết-luận-review-fb-003--2026-11-05). G1-07 vẫn cần ôn riêng.

- FB-002: G1-04/G1-05 đã giải thích được; G1-06 còn cần ôn. Đây là trạng thái của câu hỏi, không phải xác nhận đã triển khai toàn bộ tính năng.
- FB-000 vẫn IN_REVIEW: G0-05 cần luyện xác định kết quả mong đợi và tự kiểm chứng code AI.
- G3-04 còn cần ôn: có ví dụ hiểu COMMIT/ROLLBACK cơ bản; chưa chứng minh toàn bộ concurrency/khóa/ràng buộc.
- Không đổi trạng thái câu hỏi hoặc trả lời thay người học trong lần tổ chức tài liệu này.

- **G1-07 — ưu tiên ôn khi xin việc theo yêu cầu người học:** Prisma schema so với ràng buộc SQL, quy trình và lịch sử migration; [câu hỏi ôn gắn với Branch/Court thực tế](learning/stage-1.md#g1-07--ôn-prisma-và-sql-migration-khi-xin-việc). Cần ôn, chưa có câu trả lời độc lập.

- **Điểm dừng hiện hành 2026-11-11:** đã có ảnh đăng ký thành công/email trùng; vừa đổi FE sang Axios theo yêu cầu, chờ kiểm tra lại trình duyệt. Không trace FE quá sâu hoặc lấy học auth.test.ts làm điều kiện tiếp tục. [Review đăng ký và concurrency](learning/stage-1.md#review-đăng-ký-và-concurrency--2026-11-11) ghi riêng lời người học và phần mentor làm rõ; chưa kết luận hiểu toàn auth. FB-004 IN_PROGRESS; bằng chứng kỹ thuật/bước tiếp theo xem PROGRESS.

## Cần hướng dẫn trực quan khi code

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
