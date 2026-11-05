# Kiểm chứng SQL migration Branch/Court — 2026-11-05

- Chạy tại thư mục gốc repo trên máy local: `bash scripts/check-branch-court-migration.sh`, exit 0.
- PostgreSQL 17.11 trong service db; database mới riêng: `football_booking_migration_test_20261105074139_11902`.
- Script thực thi SQL của hai migration User và Branch/Court bằng psql, không chạy Prisma migration engine hoặc tạo lịch sử `_prisma_migrations` trong DB test.
- 15 nhóm kiểm tra đạt: bốn nhóm dữ liệu hợp lệ/default và 11 trường hợp bị từ chối đúng SQLSTATE lẫn tên constraint. Script dừng với exit khác 0 khi sai kỳ vọng.

| Trường hợp | Kết quả thực tế |
| --- | --- |
| Loại sân 5/7/11, giá 1 và 536870911 | Chấp nhận |
| Bỏ qua isActive/createdAt | Điền true/thời điểm tạo |
| Tên giống nhau ở hai chi nhánh | Chấp nhận |
| `San A` và `Sân A` cùng chi nhánh | Chấp nhận, phân biệt dấu |
| Đổi tên thành `sân a` khi đã có ` Sân  A ` inactive | 23505, Court_branchId_normalizedName_key |
| Đổi tên thành `SÂN A` | 23505, cùng unique index |
| Đổi tên có tab/newline hoặc Unicode whitespace | Hai ca 23505, cùng unique index |
| Đổi loại sân thành 6 | 23514, Court_playersPerTeam_check |
| Đổi giá thành 0, -1, 536870912 | Ba ca 23514, Court_pricePerSlot_check |
| Gán branchId không tồn tại | 23503, Court_branchId_fkey |
| Xóa chi nhánh hoặc đổi ID đang có sân tham chiếu | Hai ca 23503, Court_branchId_fkey |

Sau ROLLBACK, DB test còn 0 Branch và 0 Court. Giữ DB test và cấu trúc bảng để kiểm tra; không drop/reset database nào. Truy vấn lại DB phát triển `football_booking` xác nhận chỉ có User và `_prisma_migrations`, chỉ migration User đã áp dụng.

Giới hạn: chưa test request/API/concurrency, chưa có validation backend hoặc ánh xạ lỗi HTTP; chưa demo query plan/index truy vấn. Các lỗi kỳ vọng chủ yếu kiểm tra đường UPDATE; dữ liệu hợp lệ được INSERT. Chưa áp dụng migration Branch/Court vào DB phát triển.
