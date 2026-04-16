# Next.js Cache Qo'llanma - Otbozor Loyihasi

## 📦 Next.js Loyihangizda Qanday Ma'lumotlar Cache'lanadi

### 1. **Fetch Cache** (Data Cache)
**Joylashuv:** `.next/cache/fetch-cache/`

**Nima saqlanadi:**
- API'dan olingan ma'lumotlar (JSON response'lar)
- Server Component'larda fetch() orqali olingan data

**Loyihangizda:**
```typescript
// app/page.tsx
async function getRecentListings() {
    const res = await fetch('http://localhost:5000/api/listings/featured', {
        next: { revalidate: 120 }, // ← 120 soniya (2 daqiqa) cache
    });
    return res.json();
}

async function getRecentBlogPosts() {
    const res = await fetch('http://localhost:5000/api/blog/posts', {
        next: { revalidate: 300 }, // ← 300 soniya (5 daqiqa) cache
    });
    return res.json();
}
```

**Cache'langan ma'lumotlar:**
- ✅ Featured listings (2 daqiqa)
- ✅ Blog posts (5 daqiqa)
- ✅ Products (2 daqiqa)
- ✅ Events (5 daqiqa)
- ✅ Regions, Breeds (1 soat)

### 2. **Image Cache**
**Joylashuv:** `.next/cache/images/`

**Nima saqlanadi:**
- Next.js Image component orqali optimize qilingan rasmlar
- Cloudinary, Unsplash va boshqa remote rasmlar

**Loyihangizda:**
```javascript
// next.config.js
images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 3600, // ← 1 soat cache
    remotePatterns: [
        { hostname: 'res.cloudinary.com' },
        { hostname: 'otbozor.uz' },
        // ...
    ],
}
```

**Cache'langan rasmlar:**
- ✅ Ot rasmlari (Cloudinary)
- ✅ Blog cover images
- ✅ Product images
- ✅ User avatars

### 3. **Full Route Cache** (HTML)
**Joylashuv:** `.next/server/app/`

**Nima saqlanadi:**
- Static sahifalar (HTML + RSC Payload)
- Server Component render natijalari

**Loyihangizda:**
- ✅ Home page (`/`)
- ✅ Blog posts (`/blog/[slug]`)
- ✅ Static pages (`/privacy`, `/terms`)
- ❌ Dynamic pages (`/ot/[slug]`) - har safar yangi render

### 4. **Router Cache** (Client-side)
**Joylashuv:** Browser memory (RAM)

**Nima saqlanadi:**
- Foydalanuvchi tashrif buyurgan sahifalar
- Prefetch qilingan sahifalar

**Ishlash muddati:**
- Static pages: 5 daqiqa
- Dynamic pages: 30 soniya

## 🔄 Cache Strategiyalari Loyihangizda

### API Fetch Cache (`lib/api.ts`)
```typescript
export async function apiFetch<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
    const hasRevalidate = (init as any)?.next?.revalidate !== undefined;
    
    const doFetch = () => fetch(url, {
        ...init,
        // Agar revalidate berilmagan bo'lsa, cache'lama
        ...(hasRevalidate ? {} : { cache: init.cache ?? 'no-store' }),
        credentials: 'include',
    });
}
```

**Default xatti-harakat:**
- ❌ `no-store` - Cache'lanmaydi (auth, user-specific data)
- ✅ `revalidate: N` - N soniya cache'lanadi (public data)

### Hozirgi Cache Vaqtlari

| Ma'lumot | Cache Vaqti | Sabab |
|----------|-------------|-------|
| Featured listings | 120s (2 min) | Tez-tez yangilanadi |
| Blog posts | 300s (5 min) | Kam yangilanadi |
| Products | 120s (2 min) | Tez-tez yangilanadi |
| Events | 300s (5 min) | Kam yangilanadi |
| Regions/Breeds | 3600s (1 soat) | Deyarli o'zgarmaydi |
| Images | 3600s (1 soat) | Static content |
| User data | `no-store` | Har doim yangi |

## 🗑️ Cache'ni Tozalash

### 1. Development'da
```bash
# Barcha cache'ni o'chirish
rm -rf horse/horse-frontend/.next

# Faqat fetch cache
rm -rf horse/horse-frontend/.next/cache/fetch-cache

# Faqat image cache
rm -rf horse/horse-frontend/.next/cache/images
```

### 2. Production'da (Vercel)
- Vercel dashboard → Deployments → "Redeploy"
- Yoki: `vercel --prod --force`

### 3. Programmatik (On-Demand Revalidation)
```typescript
// app/api/revalidate/route.ts
import { revalidatePath, revalidateTag } from 'next/cache';

export async function POST(request: Request) {
    const { path, tag } = await request.json();
    
    if (path) {
        revalidatePath(path); // Muayyan sahifani yangilash
    }
    
    if (tag) {
        revalidateTag(tag); // Tag bo'yicha yangilash
    }
    
    return Response.json({ revalidated: true });
}
```

## 🎯 Cache Muammolarini Hal Qilish

### Muammo 1: Yangi e'lon qo'shildi, lekin ko'rinmayapti
**Sabab:** Featured listings 2 daqiqa cache'langan

**Yechim:**
```typescript
// Backend'da e'lon approve qilinganda
await fetch('http://localhost:3000/api/revalidate', {
    method: 'POST',
    body: JSON.stringify({ path: '/' }),
});
```

### Muammo 2: Rasm yangilandi, lekin eski rasm ko'rsatilmoqda
**Sabab:** Image cache 1 soat

**Yechim:**
```typescript
// Rasm URL'iga timestamp qo'shish
<Image 
    src={`${imageUrl}?t=${Date.now()}`} 
    alt="..." 
/>
```

### Muammo 3: User ma'lumotlari yangilanmayapti
**Sabab:** `no-store` ishlatilmagan

**Yechim:**
```typescript
// lib/api.ts - User data uchun
export async function getCurrentUser() {
    return apiFetch('/api/auth/me', {
        cache: 'no-store', // ← Har doim yangi
    });
}
```

## 📊 Cache Hajmi

Loyihangizda hozirda:
- **Fetch cache:** ~60 fayl (API responses)
- **Image cache:** Rasmlar soni bo'yicha
- **Build cache:** ~500MB (webpack, swc)

## ⚡ Optimal Cache Strategiyasi

### Tez o'zgaruvchi ma'lumotlar (Real-time)
```typescript
cache: 'no-store'  // Har doim yangi
```
**Misol:** User profil, favorites, cart

### O'rtacha o'zgaruvchi (Semi-dynamic)
```typescript
next: { revalidate: 60-300 }  // 1-5 daqiqa
```
**Misol:** Listings, products, blog posts

### Kam o'zgaruvchi (Static)
```typescript
next: { revalidate: 3600 }  // 1 soat
```
**Misol:** Regions, breeds, categories

### Deyarli o'zgarmaydi (Permanent)
```typescript
cache: 'force-cache'  // Abadiy cache
```
**Misol:** Static assets, logos

## 🔧 Tavsiyalar

1. **ISR (Incremental Static Regeneration) ishlatish**
   - Static sahifalarni cache'lash
   - Background'da yangilash

2. **On-Demand Revalidation qo'shish**
   - Admin e'lon approve qilganda
   - Yangi content qo'shilganda

3. **Cache Tags ishlatish**
   ```typescript
   fetch(url, {
       next: { 
           revalidate: 60,
           tags: ['listings', 'featured']
       }
   });
   
   // Keyin:
   revalidateTag('listings');
   ```

4. **Monitoring qo'shish**
   - Cache hit/miss ratio
   - Cache size
   - Performance metrics

## 🚀 Production Optimizatsiya

```javascript
// next.config.js
module.exports = {
    // Static sahifalarni cache'lash
    generateStaticParams: true,
    
    // Image optimization
    images: {
        minimumCacheTTL: 86400, // 24 soat
        deviceSizes: [640, 750, 828, 1080, 1200],
        imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    },
    
    // Compression
    compress: true,
    
    // Headers
    async headers() {
        return [
            {
                source: '/static/:path*',
                headers: [
                    {
                        key: 'Cache-Control',
                        value: 'public, max-age=31536000, immutable',
                    },
                ],
            },
        ];
    },
};
```

## 📝 Xulosa

Next.js cache loyihangizda:
- ✅ API responses (60-300s)
- ✅ Images (1 soat)
- ✅ Static pages (build time)
- ❌ User-specific data (no cache)

Cache'ni to'g'ri boshqarish orqali:
- 🚀 Tezlik oshadi
- 💰 Server load kamayadi
- 😊 User experience yaxshilanadi
