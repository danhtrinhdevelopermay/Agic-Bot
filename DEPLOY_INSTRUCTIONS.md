# Hướng dẫn Deploy Bot lên Render

## ✅ Build đã test thành công!

### Bước 1: Push code lên GitHub
```bash
git add .
git commit -m "Fixed build for Render deployment"
git push origin main
```

### Bước 2: Redeploy trên Render
1. Vào Render Dashboard của bạn
2. Tìm service `facebook-messenger-bot`
3. Nhấn "Manual Deploy" > "Deploy latest commit"
4. Hoặc trigger một commit mới để auto-deploy

### Bước 3: Kiểm tra deployment
Sau khi deploy thành công, test các endpoint:
- Health check: `https://your-app.onrender.com/api/test`
- Config: `https://your-app.onrender.com/api/config`

### Bước 4: Cập nhật Facebook Webhook
1. Vào Facebook Developer Console
2. Webhooks section
3. Edit webhook URL thành: `https://your-app.onrender.com/api/webhook`
4. Verify token: `my_verify_token_2024`
5. Subscribe to events: `messages`, `messaging_postbacks`

### Bước 5: Test Bot
Gửi tin nhắn "xin chào" đến Facebook Page để test!

## Build Command đã sửa:
```
npm install && npx vite build && npx esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist
```

## Lỗi đã khắc phục:
- ✅ Sử dụng `npx` thay vì command trực tiếp
- ✅ Build client và server tách biệt
- ✅ Config tự động load từ file