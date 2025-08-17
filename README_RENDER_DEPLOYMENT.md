# Deploy Facebook Messenger Bot lên Render

## Bước 1: Chuẩn bị Repository
1. Push code này lên GitHub repository của bạn
2. Đảm bảo file `render.yaml` và `config.json` đã có trong repository

## Bước 2: Tạo Web Service trên Render
1. Đăng nhập vào [Render.com](https://render.com)
2. Chọn "New" > "Web Service"
3. Connect GitHub repository của bạn
4. Cấu hình như sau:
   - **Name**: `facebook-messenger-bot`
   - **Environment**: `Node`
   - **Build Command**: `npm install && npx vite build && npx esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist`
   - **Start Command**: `npm start`
   - **Plan**: Free (hoặc trả phí nếu cần)

## Bước 3: Environment Variables
Thêm các biến môi trường sau trong Render:
```
NODE_ENV=production
PORT=10000
```

## Bước 4: Deploy
1. Click "Create Web Service"
2. Render sẽ tự động build và deploy
3. Sau khi deploy thành công, bạn sẽ có URL như: `https://facebook-messenger-bot-xxxx.onrender.com`

## Bước 5: Cập nhật Facebook Webhook
1. Vào Facebook Developer Console
2. Tìm phần Webhooks của Page
3. Cập nhật Webhook URL thành: `https://your-app-name.onrender.com/api/webhook`
4. Verify Token vẫn là: `my_verify_token_2024`
5. Subscribe to events: `messages`, `messaging_postbacks`

## Bước 6: Test Bot
Sau khi deploy thành công:
1. Gửi tin nhắn test đến Facebook Page
2. Kiểm tra logs trong Render Dashboard
3. Bot sẽ tự động phản hồi bằng Gemini AI

## Webhook URL cuối cùng
```
https://your-app-name.onrender.com/api/webhook
```

## Test Endpoints
- Health check: `https://your-app-name.onrender.com/api/test`
- Config: `https://your-app-name.onrender.com/api/config`

## Lưu ý quan trọng
- File `config.json` chứa API keys sẽ được load tự động
- Render Free plan có thể sleep sau 15 phút không hoạt động
- Để bot luôn hoạt động, cân nhắng upgrade lên paid plan