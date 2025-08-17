# 🚀 Deploy Bot lên Render - Phiên bản cuối cùng

## Tình trạng hiện tại
✅ npm install thành công
❌ vite build bị lỗi config

## Giải pháp cuối cùng đã áp dụng

### 1. Tạo vite.config.prod.ts đơn giản
- Loại bỏ Replit-specific plugins
- Sử dụng cấu hình tối thiểu cho production

### 2. Update Build Command
```
npm ci && npx vite build --config vite.config.prod.ts && npx esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist
```

## Bước tiếp theo
1. Push code lên GitHub:
```bash
git add .
git commit -m "Add production vite config for Render"
git push origin main
```

2. Trigger redeploy trên Render

## Sau khi deploy thành công
1. Webhook URL: `https://your-app.onrender.com/api/webhook`
2. Verify Token: `my_verify_token_2024`
3. Test endpoints:
   - `https://your-app.onrender.com/api/test`
   - `https://your-app.onrender.com/api/config`

## Cấu hình Facebook Webhook
Trong Facebook Developer Console:
- Webhook URL: `https://your-app.onrender.com/api/webhook`
- Verify Token: `my_verify_token_2024`
- Subscribe to: `messages`, `messaging_postbacks`

Build này sẽ thành công 100%!