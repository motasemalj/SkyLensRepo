# 🌐 Connect GoDaddy Domain to Railway Frontend

## 📋 Prerequisites

- GoDaddy domain (e.g., `skylens.com`)
- Access to GoDaddy DNS management
- Railway frontend deployed and working

---

## 🚀 Step-by-Step Guide

### **Step 1: Add Custom Domain in Railway**

1. Go to **Railway Dashboard**
2. Select your **Frontend Service**
3. Click on **Settings** tab
4. Scroll down to **Networking** section
5. Find **Custom Domain** or **Domains**
6. Click **"+ Generate Domain"** if you don't have one yet (this gives you the Railway default domain)
7. Click **"+ Add Custom Domain"** or **"Add Domain"**
8. Enter your domain:
   - For main domain: `skylens.com`
   - For subdomain: `www.skylens.com`
   - **Recommended:** Add both `skylens.com` AND `www.skylens.com`

9. Click **"Add"**

---

### **Step 2: Get DNS Records from Railway**

After adding your domain, Railway will show you the DNS records you need to configure:

#### **For Root Domain (`skylens.com`):**

Railway will provide **A Records** or **CNAME** (depending on their setup):

**Option A: A Records** (Most common)
```
Type: A
Name: @ (or leave blank)
Value: [Railway's IP addresses - shown in Railway dashboard]
TTL: 3600 (or Auto)
```

**Option B: CNAME + ALIAS** (If Railway uses this)
```
Type: CNAME or ALIAS
Name: @ (or leave blank)
Target: [Railway's domain - e.g., frontend-production.up.railway.app]
TTL: 3600 (or Auto)
```

#### **For Subdomain (`www.skylens.com`):**

```
Type: CNAME
Name: www
Target: [Railway's domain - shown in Railway dashboard]
TTL: 3600 (or Auto)
```

**⚠️ Important:** Copy these exact values from Railway! They will be specific to your deployment.

---

### **Step 3: Configure DNS in GoDaddy**

1. **Log in to GoDaddy:**
   - Go to https://www.godaddy.com
   - Sign in to your account

2. **Access DNS Management:**
   - Click on your **Profile Icon** (top right)
   - Select **"My Products"**
   - Find your domain (e.g., `skylens.com`)
   - Click **"DNS"** or **"Manage DNS"**

3. **Add/Edit DNS Records:**

#### **For Root Domain (`skylens.com`):**

**If Railway gave you A Records:**
- Click **"Add"** button
- Select **Type:** `A`
- **Name:** `@` (this represents the root domain)
- **Value:** Paste Railway's IP address
- **TTL:** `1 Hour` or `3600 seconds`
- Click **"Save"**

**Repeat for all A records** if Railway provides multiple IP addresses.

**If Railway uses CNAME/ALIAS:**
- GoDaddy doesn't support ALIAS records on root domains
- You'll need to use A records instead
- Railway will show you the A record values to use

#### **For Subdomain (`www.skylens.com`):**

- Click **"Add"** button
- Select **Type:** `CNAME`
- **Name:** `www`
- **Value:** Paste Railway's target domain (e.g., `frontend-production.up.railway.app`)
- **TTL:** `1 Hour`
- Click **"Save"**

4. **Remove Conflicting Records:**
   - Look for existing `A` or `CNAME` records with `@` or `www`
   - Delete or modify them if they point to different destinations
   - **Don't delete** MX records (email) or TXT records (verification)

---

### **Step 4: Wait for DNS Propagation**

DNS changes can take time to propagate:
- **Minimum:** 10-30 minutes
- **Maximum:** 24-48 hours (rare)
- **Typical:** 1-4 hours

**During this time:**
- Your domain might show "Site not found" or "Connection error"
- This is normal! Be patient.

---

### **Step 5: Verify Domain Configuration**

#### **Check DNS Propagation:**

**Using online tools:**
- Visit: https://dnschecker.org
- Enter your domain: `skylens.com`
- Check if the records point to Railway

**Using command line:**
```bash
# Check A record
dig skylens.com

# Check CNAME record
dig www.skylens.com

# Check from specific DNS server
dig @8.8.8.8 skylens.com
```

**Expected output:**
```
;; ANSWER SECTION:
skylens.com.  3600  IN  A  [Railway's IP]
www.skylens.com.  3600  IN  CNAME  frontend-production.up.railway.app
```

#### **Check in Browser:**

1. Visit your domain: `https://skylens.com`
2. Also try: `https://www.skylens.com`
3. Both should show your SkyLens website

**✅ Success indicators:**
- Website loads correctly
- Images from Cloudinary display
- No SSL/TLS warnings (Railway provides automatic HTTPS)

---

### **Step 6: Update Environment Variables (IMPORTANT!)**

After your domain is working, you MUST update the backend CORS configuration:

#### **Backend Service:**

1. Go to Railway → **Backend Service** → **Variables**
2. Update `FRONTEND_URL`:
   ```
   FRONTEND_URL=https://skylens.com
   ```
   Or if using www subdomain:
   ```
   FRONTEND_URL=https://www.skylens.com
   ```

3. **Add multiple origins** if you want both to work:
   - Unfortunately, Railway doesn't support multiple CORS origins easily
   - Choose one primary domain (recommended: `skylens.com`)
   - Or update backend to accept both (see Step 7)

4. Click **"Save"**
5. Backend will automatically redeploy

---

### **Step 7: Update Backend CORS for Multiple Domains (Optional)**

If you want both `skylens.com` and `www.skylens.com` to work:

Update `backend/app.js`:

```javascript
// CORS configuration for Railway with multiple origins
const allowedOrigins = [
  process.env.FRONTEND_URL || 'http://localhost:3000',
  'https://skylens.com',
  'https://www.skylens.com',
  'https://skylensrepo-production.up.railway.app' // Keep Railway URL for backup
];

console.log('🔒 CORS configured for origins:', allowedOrigins);

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, curl, etc.)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
```

Then commit and push:
```bash
git add backend/app.js
git commit -m "Update CORS to support multiple domains"
git push origin main
```

---

### **Step 8: Update Frontend Environment Variables (If Needed)**

The frontend should already work with the new domain, but verify:

1. Go to Railway → **Frontend Service** → **Variables**
2. Verify these are still correct:
   ```
   NEXT_PUBLIC_API_URL=https://meticulous-creativity-production.up.railway.app
   NEXT_PUBLIC_IMAGE_BASE_URL=https://res.cloudinary.com/dm2sd9t1n/image/upload
   ```

**Note:** You DON'T need to change these! The frontend URL changes, but the API URL stays the same (backend Railway URL).

---

### **Step 9: Test Everything**

After DNS propagation and environment updates:

1. **Visit your custom domain:**
   - `https://skylens.com`
   - `https://www.skylens.com`

2. **Test all functionality:**
   - ✅ Homepage loads
   - ✅ Images display
   - ✅ Sign up works
   - ✅ Sign in works
   - ✅ Create order works
   - ✅ No CORS errors in browser console

3. **Check browser console:**
   - Press F12 → Console
   - Should see: `🔧 Environment Configuration: API_URL: https://meticulous-creativity-production.up.railway.app`
   - No CORS errors

4. **Test from different devices:**
   - Desktop browser
   - Mobile phone
   - Different networks (WiFi, mobile data)

---

## 🎯 Quick Reference

### **GoDaddy DNS Records to Add:**

| Type | Name | Value | TTL |
|------|------|-------|-----|
| A | @ | [Railway's IP from dashboard] | 3600 |
| CNAME | www | [Railway frontend domain] | 3600 |

### **Railway Environment Variables to Update:**

**Backend Service:**
```
FRONTEND_URL=https://skylens.com
```

**Frontend Service:**
```
(No changes needed - keep existing values)
```

---

## 🐛 Troubleshooting

### **Issue: Domain shows "Site not found"**

**Possible causes:**
1. DNS not yet propagated (wait longer)
2. DNS records incorrect
3. Domain not added in Railway

**Fixes:**
- Wait 30 minutes to 2 hours
- Double-check DNS records match Railway's values exactly
- Verify domain is added in Railway → Frontend → Settings → Domains

---

### **Issue: Domain loads but shows "This site can't be reached"**

**Possible causes:**
- DNS pointing to wrong destination
- Railway domain not verified

**Fixes:**
- Check DNS with `dig skylens.com` or dnschecker.org
- Ensure CNAME points to Railway's domain exactly
- In Railway, check domain status (should show green checkmark)

---

### **Issue: Domain loads but CORS errors appear**

**Symptoms:**
```
Access to fetch at '...' from origin 'https://skylens.com' has been blocked by CORS policy
```

**Fix:**
1. Update backend `FRONTEND_URL` to your custom domain
2. Redeploy backend (Railway does this automatically)
3. Wait for backend to restart (~1 minute)
4. Hard refresh browser (Ctrl+Shift+R or Cmd+Shift+R)

---

### **Issue: SSL/HTTPS certificate error**

**Symptoms:**
- "Your connection is not private"
- "NET::ERR_CERT_AUTHORITY_INVALID"

**Fix:**
- Railway automatically provisions SSL certificates via Let's Encrypt
- This can take 5-15 minutes after DNS is configured
- Wait for Railway to show "SSL Certificate: Active" in domain settings
- If it's been >2 hours, remove and re-add the domain in Railway

---

### **Issue: www works but root domain doesn't (or vice versa)**

**Fix:**
- Ensure you added BOTH `skylens.com` AND `www.skylens.com` in Railway
- Ensure BOTH A record (@) AND CNAME record (www) are in GoDaddy
- Some users prefer to redirect one to the other (see Step 10)

---

## 🔀 Step 10: Set Up Domain Redirect (Optional)

You can redirect one version to the other (e.g., `skylens.com` → `www.skylens.com` or vice versa).

### **Option A: Redirect www to non-www (Recommended)**

**In GoDaddy:**
1. Keep both DNS records active
2. Use GoDaddy's forwarding feature:
   - Go to **My Products** → Your Domain → **Manage**
   - Find **Forwarding** section
   - Click **"Add Forwarding"**
   - Forward `www.skylens.com` → `https://skylens.com`
   - Choose **"Permanent (301)"**

**In Railway:**
- Keep both domains added
- Railway will handle the redirect automatically if configured

### **Option B: Redirect non-www to www**

Same process, but forward `skylens.com` → `https://www.skylens.com`

---

## ✅ Final Checklist

- [ ] Domain added in Railway (both `skylens.com` and `www.skylens.com`)
- [ ] A record added in GoDaddy for root domain
- [ ] CNAME record added in GoDaddy for www subdomain
- [ ] DNS propagation complete (check with dnschecker.org)
- [ ] Backend `FRONTEND_URL` updated to custom domain
- [ ] Backend redeployed
- [ ] Website loads on custom domain
- [ ] No CORS errors
- [ ] All functionality tested (sign up, sign in, create order)
- [ ] SSL certificate active (HTTPS works)
- [ ] Tested on multiple devices

---

## 🎉 Success!

When everything is configured correctly:

1. ✅ `https://skylens.com` loads your website
2. ✅ `https://www.skylens.com` loads your website
3. ✅ Railway URL still works: `https://skylensrepo-production.up.railway.app`
4. ✅ All API calls work without CORS errors
5. ✅ SSL certificate is valid (green padlock in browser)
6. ✅ Images load from Cloudinary
7. ✅ Sign up, sign in, and all features work

---

## 📞 Additional Resources

- **Railway Custom Domains Docs:** https://docs.railway.app/deploy/exposing-your-app#custom-domains
- **GoDaddy DNS Management:** https://www.godaddy.com/help/manage-dns-680
- **DNS Checker:** https://dnschecker.org
- **SSL Checker:** https://www.sslshopper.com/ssl-checker.html

---

**Good luck setting up your custom domain! Let me know if you encounter any issues.** 🚀

