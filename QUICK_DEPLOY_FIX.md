# 🚀 Sửa lỗi Deploy Render ngay lập tức

## Vấn đề hiện tại
Render đang sử dụng build command cũ từ repository chưa được cập nhật.

## Giải pháp nhanh nhất

### Option 1: Cập nhật trực tiếp trên Render Dashboard
1. Vào Render Dashboard
2. Chọn service `facebook-messenger-bot`
3. Vào tab "Settings"
4. Tìm phần "Build & Deploy"
5. Thay đổi **Build Command** thành:
```
npm ci && npx vite build && npx esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist
```
6. Nhấn "Save Changes"
7. Nhấn "Manual Deploy"

### Option 2: Push code mới (khuyến nghị)
```bash
# Trong terminal local
git add .
git commit -m "Fix Render build command"
git push origin main
```

## URL webhook sau khi deploy thành công:
```
https://facebook-messenger-bot-xxxx.onrender.com/api/webhook
```

## Verify Token:
```
my_verify_token_2024
```

## Test ngay sau deploy:
1. `https://your-app.onrender.com/api/test` - phải trả về JSON
2. `https://your-app.onrender.com/api/config` - phải có config bot
3. Cập nhật webhook URL trong Facebook Developer Console
4. Gửi tin nhắn test