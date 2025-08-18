# Hướng dẫn khắc phục bot Messenger không phản hồi trên Render

## Vấn đề đã phát hiện
✅ Bot code hoạt động hoàn hảo trên development
✅ Signature verification đã được sửa
❌ Deployment trên Render có thể thiếu cấu hình

## Bước 1: Kiểm tra URL Render

1. Đăng nhập vào [Render Dashboard](https://dashboard.render.com/)
2. Tìm app của bạn (tên giống như repository GitHub)
3. Copy URL chính xác (dạng: `https://your-app-name.onrender.com`)

## Bước 2: Cấu hình Environment Variables trên Render

Vào Settings > Environment Variables và thêm:

```
NODE_ENV=production
pageAccessToken=EAAJ901cZAQYIBPN4uZAQBbAWDkYZBtqI7IfRoOPZCM6OEc4LgyVMpGmk0eD3eLi27NqzMDVJRJgmWLUVfSNzGoSVTqCVPUk3KusHR6SQAiWKPmBiEtnCHAaJgh2T4BZCuYmiDXSDZARCyzWRXaCZB9a0ikTV0dAajblqNEkvcGJeblEIVqRw0qVzyFVN4SZBIukdCYOeQiUBSgZDZD
appSecret=2dc8fd6f712cc891c410590683e944e8
pageId=775431008983105
geminiApiKey=AIzaSyBRDRtTyyedD7he5OSj87ELaq0DSfkUIsw
verifyToken=my_verify_token_2024
geminiModel=gemini-2.0-flash-exp
temperature=0.7
maxTokens=1000
safetySettings=BLOCK_MEDIUM_AND_ABOVE
systemPrompt=Bạn là trợ lý AI thông minh cho Facebook Messenger. Hãy trả lời bằng tiếng Việt một cách tự nhiên, thân thiện và hữu ích.
```

## Bước 3: Cập nhật Facebook Webhook

1. Vào [Facebook Developer Console](https://developers.facebook.com/)
2. Chọn app của bạn > Products > Messenger > Settings
3. Tại phần Webhooks, click "Edit Subscription"
4. **Callback URL**: `https://your-render-app-name.onrender.com/api/webhook`
5. **Verify Token**: `my_verify_token_2024`
6. **Subscription Fields**: Tích chọn `messages` và `messaging_postbacks`
7. Click "Verify and Save"

## Bước 4: Test Webhook

Sau khi cập nhật, test bằng cách:

1. Truy cập: `https://your-render-app-name.onrender.com/api/health`
2. Nếu thấy response JSON = bot đang hoạt động
3. Thử nhắn tin cho Facebook Page để test

## Các lỗi phổ biến

### Lỗi "Webhook URL couldn't be validated"
- Kiểm tra URL có đúng không
- Đảm bảo Render app đang chạy (không sleep)
- Thử lại sau vài phút

### Lỗi "Token verification failed" 
- Verify Token phải chính xác là: `my_verify_token_2024`
- Case-sensitive, không có space thừa

### App bị sleep trên Render (Free tier)
- App free sẽ sleep sau 15 phút không hoạt động
- Khi Facebook gửi webhook tới app đang sleep = không có response
- Solution: Upgrade plan hoặc dùng service khác để ping app định kỳ

## Kiểm tra logs

Vào Render Dashboard > App > Logs để xem:
- App có start thành công không
- Có lỗi gì khi Facebook gửi webhook không

Nếu thấy lỗi, copy paste để được hỗ trợ thêm.