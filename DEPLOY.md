# Vercel.com ga Deploy qilish

## 1. Vercel.com'ga kirish

1. [Vercel.com](https://vercel.com) ga kiring
2. **Add New** → **Project** ni tanlang
3. GitHub repository'ni import qiling

## 2. Sozlamalar

### Project Settings:
- **Framework Preset**: `Next.js`
- **Root Directory**: `horse-frontend`
- **Build Command**: `npm run build` (default)
- **Output Directory**: `.next` (default)
- **Install Command**: `npm install` (default)

### Environment Variables:

Production uchun:

```bash
NEXT_PUBLIC_API_URL=https://horse-backend-8rok.onrender.com
```

## 3. Deploy qilish

1. **Deploy** tugmasini bosing
2. Vercel avtomatik build va deploy qiladi
3. Deploy tugagach, URL paydo bo'ladi: `https://your-project.vercel.app`

## 4. Backend'ni yangilash

Backend deploy bo'lgandan keyin, backend `.env` faylida frontend URL'ni yangilang:

Render.com → Service → Environment → Edit:

```bash
APP_URL=https://your-project.vercel.app
CORS_ORIGIN=https://your-project.vercel.app
```

## 5. Custom Domain (ixtiyoriy)

Vercel Dashboard → Project → Settings → Domains:
- Custom domain qo'shing (masalan: `otbozor.uz`)
- DNS sozlamalarini yangilang

## Vercel CLI orqali deploy (ixtiyoriy)

```bash
# Vercel CLI o'rnatish
npm i -g vercel

# Login
vercel login

# Deploy
cd horse-frontend
vercel

# Production deploy
vercel --prod
```

## Environment Variables (Vercel Dashboard'da)

1. Project → Settings → Environment Variables
2. Quyidagilarni qo'shing:

```bash
NEXT_PUBLIC_API_URL=https://horse-backend-8rok.onrender.com
```

## Muhim eslatmalar:

- ✅ Vercel avtomatik HTTPS qo'shadi
- ✅ Har bir git push avtomatik deploy qiladi
- ✅ Preview deployments har bir PR uchun
- ✅ Edge Network orqali tez yuklash
- ✅ Automatic image optimization

## Troubleshooting:

### Build xatosi:
```bash
# Local'da build qilib ko'ring
npm run build
```

### API connection xatosi:
```bash
# NEXT_PUBLIC_API_URL to'g'ri ekanligini tekshiring
# Backend CORS sozlamalarini tekshiring
```

### Environment variable ko'rinmayapti:
```bash
# Vercel'da redeploy qiling
# Environment variable'lar faqat build vaqtida o'qiladi
```

## Production Checklist:

- [ ] Backend URL to'g'ri sozlangan
- [ ] Backend CORS frontend URL'ni qabul qiladi
- [ ] Environment variables to'g'ri
- [ ] Build local'da ishlayapti
- [ ] API endpoints test qilindi
- [ ] Images va static files ishlayapti
- [ ] SEO metadata to'g'ri
- [ ] Analytics qo'shilgan (ixtiyoriy)
