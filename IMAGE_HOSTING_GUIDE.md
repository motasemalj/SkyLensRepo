# Image Hosting Guide for Railway Deployment

## Problem
Git repositories aren't ideal for large binary files (images, videos). This guide provides solutions to host images externally while deploying on Railway.

---

## ⭐ **RECOMMENDED: Option 1 - Use Cloudinary (Free CDN)**

### Why Cloudinary?
- ✅ **Free tier**: 25GB storage, 25GB bandwidth/month
- ✅ **Automatic optimization**: Resizes, formats images automatically
- ✅ **Fast CDN**: Global delivery
- ✅ **Transformations**: On-the-fly image manipulation

### Setup Steps:

#### 1. Create Cloudinary Account
1. Go to [cloudinary.com](https://cloudinary.com)
2. Sign up for free account
3. Note your **Cloud Name** from dashboard

#### 2. Upload Your Images
```bash
# Install Cloudinary CLI
npm install -g cloudinary-cli

# Login
cloudinary config

# Upload all images from public folder
cloudinary upload_dir frontend/public -f skylens
```

Or upload manually via Cloudinary dashboard.

#### 3. Configure Environment Variables

**Railway Environment Variables:**
```env
NEXT_PUBLIC_IMAGE_BASE_URL=https://res.cloudinary.com/YOUR_CLOUD_NAME/image/upload/v1/skylens
```

**Local `.env.local`:**
```env
# Leave empty to use local images
NEXT_PUBLIC_IMAGE_BASE_URL=
```

#### 4. Update Your Code

Use the helper function in your components:
```tsx
import { getImageUrl, IMAGES } from '@/lib/imageConfig';

// In your component
<img src={getImageUrl(IMAGES.hero)} alt="Hero" />
```

---

## Option 2 - Download During Build (Current Setup)

This approach downloads images during Railway deployment.

### How it works:
1. Images are excluded from Git (`.gitignore`)
2. `download_images.sh` runs during Railway build
3. Images are downloaded from external URLs (Unsplash, S3, etc.)

### Setup:
Already configured! Just host your images somewhere and update URLs in `download_images.sh`

**Pros:**
- ✅ No Git bloat
- ✅ Simple setup

**Cons:**
- ❌ Slower builds (downloads every time)
- ❌ Need external hosting for source images

---

## Option 3 - Use Railway Volumes (Persistent Storage)

Good for images that rarely change.

### Setup:
1. Create a Railway Volume
2. Mount to `/app/frontend/public`
3. Upload images once via Railway CLI

**Pros:**
- ✅ Images persist across deployments
- ✅ No repeated downloads

**Cons:**
- ❌ More complex setup
- ❌ Extra cost for large volumes

---

## 🎯 Recommended Approach for Your Project

**For Production (Now):**
Use **Cloudinary** - Best performance, automatic optimization, free tier is generous.

**For Development (Local):**
Keep images in `frontend/public/` locally (already in `.gitignore`)

**For Quick Deploy (Testing):**
Use current setup with `download_images.sh` - already configured!

---

## Quick Start: Deploy to Railway NOW

### Using Current Setup (Download Images):

1. **Commit the changes:**
```bash
git add .
git commit -m "Configure image hosting for Railway"
git push origin main
```

2. **Deploy to Railway:**
- Connect your GitHub repo
- Railway will automatically detect `nixpacks.toml`
- Images will download during build
- App deploys! 🚀

### Using Cloudinary (Better):

1. **Upload images to Cloudinary**
2. **Set environment variable in Railway:**
   ```
   NEXT_PUBLIC_IMAGE_BASE_URL=https://res.cloudinary.com/YOUR_CLOUD_NAME/image/upload/v1/skylens
   ```
3. **Update image references to use `getImageUrl()`**
4. **Deploy!**

---

## Testing Locally

```bash
# Test with local images (default)
npm run dev

# Test with Cloudinary
NEXT_PUBLIC_IMAGE_BASE_URL=https://res.cloudinary.com/YOUR_CLOUD_NAME/image/upload/v1/skylens npm run dev
```

---

## File Size Guidelines

**Should commit to Git:**
- SVG icons (small, text-based)
- Favicons
- Small logos (<50KB)

**Should NOT commit to Git:**
- Photos (>100KB)
- Hero images (>500KB)
- Videos
- GIFs (large)

---

## Troubleshooting

### Images show 404 in production
- Check `NEXT_PUBLIC_IMAGE_BASE_URL` is set in Railway
- Verify images exist in Cloudinary
- Check image paths match exactly

### Build fails on Railway
- Check `download_images.sh` has execute permissions
- Verify URLs in download script are accessible
- Check Railway build logs

### Images slow to load
- Enable Cloudinary automatic format (WebP)
- Use responsive image URLs with width parameters
- Add Next.js Image component for optimization

---

## Need Help?

1. Check Railway build logs
2. Test locally first
3. Verify environment variables
4. Check image URLs are public

