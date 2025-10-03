# Cloudinary Setup Instructions

## Step 1: Get Your Credentials

1. Go to [Cloudinary Dashboard](https://console.cloudinary.com/)
2. Sign in with your account
3. On the dashboard, you'll see:
   - **Cloud Name**: dm2sd9t1n ✅ (you already have this)
   - **API Key**: (copy this)
   - **API Secret**: (copy this - click "Show" to reveal)

## Step 2: Configure Cloudinary CLI

Run this command and enter your credentials when prompted:

```bash
cloudinary config
```

When prompted, enter:
- Cloud name: `dm2sd9t1n`
- API Key: (paste your API Key)
- API Secret: (paste your API Secret)

## Step 3: Upload Images

After configuration, run:

```bash
./upload_images_now.sh
```

This will upload all your images to Cloudinary.

## Alternative: Manual Upload via Web Interface

If you prefer not to use CLI:

1. Go to [Cloudinary Media Library](https://console.cloudinary.com/console/media_library)
2. Create a folder called "skylens"
3. Drag and drop all images from `frontend/public/` into the folder
4. Make sure to maintain the folder structure (about/, optimized/, services/)

## Step 4: Configure Environment Variables

**For Local Development** (create `.env.local` in frontend folder):
```bash
NEXT_PUBLIC_IMAGE_BASE_URL=https://res.cloudinary.com/dm2sd9t1n/image/upload
```

**For Railway Deployment**:
1. Go to your Railway project
2. Go to Variables tab
3. Add variable:
   - Key: `NEXT_PUBLIC_IMAGE_BASE_URL`
   - Value: `https://res.cloudinary.com/dm2sd9t1n/image/upload`

## Step 5: Test

Your images will be available at URLs like:
- `https://res.cloudinary.com/dm2sd9t1n/image/upload/skylens/hero-drone.jpg`
- `https://res.cloudinary.com/dm2sd9t1n/image/upload/skylens/aerial-photography.jpg`

Test one in your browser to make sure it works!

