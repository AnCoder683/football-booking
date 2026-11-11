# Quy ước response API

[Chỉ mục thiết kế](../DESIGN.md) · Đã duyệt khung · Chưa có API/test.

Quy ước dưới đây là hiện hành; các endpoint có ngoại lệ rõ như logout 204 không có JSON.

### Chốt khung tạm thời

Người học đồng ý tạm dùng success response gồm success=true, message, data; error response gồm success=false và error với code/message. data là object cho một tài nguyên, array cho danh sách. HTTP status phản ánh kết quả thực tế, không trả mọi trường hợp bằng 200. Với tạo booking: 201 khi thành công, 409 khi tranh slot.

Cho phép mở rộng có chủ đích khi đến API liên quan: metadata phân trang ở response danh sách, chi tiết lỗi từng trường bên trong error cho validation. Phân trang đã duyệt theo từng endpoint; chưa chọn thư viện. Cấu trúc chi tiết validation đã được duyệt ở mục Lỗi validation bên dưới. Giữ ý nghĩa và kiểu của các trường đã dùng; không yêu cầu FE phân nhánh theo message. Không trả lỗi SQL, stack trace hoặc dữ liệu nhạy cảm.

Đây là quy ước thiết kế đã duyệt, chưa có API triển khai hoặc kiểm thử. Các đề xuất khung cũ được giữ trong archive; khung trong mục này là quyết định hiện hành.

### Lỗi validation — đã duyệt 2026-11-03

Dùng HTTP 400 Bad Request cho lỗi validation đầu vào. Response giữ success=false, error.code=VALIDATION_ERROR, error.message là thông báo chung; thêm error.details khi có lỗi cụ thể theo trường. details là array các object field/message, cho phép FE gắn thông báo vào ô tương ứng và trả nhiều lỗi cùng lúc.

Ví dụ durationMinutes=45:

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Dữ liệu không hợp lệ",
    "details": [
      {
        "field": "durationMinutes",
        "message": "Thời lượng phải là 30, 60, 90 hoặc 120 phút."
      }
    ]
  }
}
```

Người học xác nhận “Đồng ý” với đề xuất này. Chưa triển khai/test và chưa chọn thư viện validation. Không áp dụng 400 cho mọi lỗi nghiệp vụ: tranh slot vẫn là 409 theo quyết định trước.

### Lỗi đọc JSON — triển khai 2026-11-10

- JSON sai cú pháp: HTTP 400, error.code=INVALID_JSON, message="Nội dung JSON không hợp lệ."
- Body vượt giới hạn express.json mặc định 100kb: HTTP 413, error.code=PAYLOAD_TOO_LARGE, message="Nội dung yêu cầu quá lớn."
- Giữ cấu trúc success=false/error.code/error.message; không trả nội dung body gây lỗi, stack hoặc thông tin nội bộ. Chỉ map hai loại lỗi parser này; lỗi khác giữ 500/INTERNAL_ERROR.
