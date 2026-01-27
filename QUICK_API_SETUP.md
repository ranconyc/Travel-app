# 🚀 Quick API Setup - Get Images Working NOW!

## 🔑 **Add These to Your .env.local File:**

```bash
NEXT_PUBLIC_UNSPLASH_ACCESS_KEY=your_unsplash_access_key_here
NEXT_PUBLIC_PEXELS_API_KEY=your_pexels_api_key_here
```

> **Note**: The `NEXT_PUBLIC_` prefix makes the keys available in the browser (needed for client-side image fetching).

---

## 📋 **Step-by-Step Setup:**

### **1. Get Unsplash API Key (2 minutes):**
1. Go to: https://unsplash.com/developers
2. Click "New Application"
3. Choose "Non-commercial" (free for development)
4. Fill in:
   - Application Name: "Travel App"
   - Description: "Travel app showing beautiful city photos"
   - Website: "http://localhost:3000"
5. Accept terms
6. Copy the **Access Key** (not the Secret Key)
7. Add to your `.env.local`

### **2. Get Pexels API Key (2 minutes):**
1. Go to: https://www.pexels.com/api/
2. Click "Request API Key"
3. Fill in:
   - Your name
   - Email
   - Website: "http://localhost:3000"
   - How you'll use: "Travel app development"
4. Submit and wait for approval (usually instant)
5. Copy the API key
6. Add to your `.env.local`

---

## 🛠️ **Common Issues & Fixes:**

### **Issue 1: Using .env instead of .env.local**
```bash
# ❌ WRONG - .env (might be gitignored)
# ✅ CORRECT - .env.local (never gitignored)
```

### **Issue 2: Wrong key from Unsplash**
```bash
# ❌ WRONG - Secret Key (starts with sk_)
# ✅ CORRECT - Access Key (starts with public_)
```

### **Issue 3: Missing NEXT_PUBLIC_ prefix**
```bash
# ❌ WRONG - UNSPLASH_ACCESS_KEY
# ✅ CORRECT - NEXT_PUBLIC_UNSPLASH_ACCESS_KEY
```

### **Issue 4: Server not restarted**
```bash
# After adding keys, ALWAYS restart:
npm run dev
```

---

## 🔍 **Test Your Setup:**

### **1. Check if keys are working:**
```bash
# Restart your dev server
npm run dev

# Check console for these messages:
✅ Found image via Unsplash: "San Francisco"
# OR
⚠️ Unsplash API key not found  # ← Add keys
```

### **2. Test in browser:**
1. Go to: http://localhost:3001/cities
2. Should see loading states, then beautiful city photos
3. Go to: http://localhost:3001/countries/usa
4. Should see city images in the cities section

---

## 🚨 **If Still Not Working:**

### **Check 1: Verify .env.local exists**
```bash
# In your project root, run:
ls -la .env.local

# Should see the file. If not:
touch .env.local
```

### **Check 2: Verify keys are correct**
```bash
# Unsplash keys start with: public_
# Pexels keys start with: 563492ad6f91700001000001
```

### **Check 3: Check console errors**
Open browser dev tools (F12) and look for:
- Network tab: Failed API calls
- Console: Error messages

---

## 🎯 **Working Example .env.local:**

```bash
# Copy this format with your actual keys:
NEXT_PUBLIC_UNSPLASH_ACCESS_KEY=public_abc123def456ghi789
NEXT_PUBLIC_PEXELS_API_KEY=563492ad6f91700001000001abc123def456
```

---

## 📞 **Need Help?**

### **Debug Steps:**
1. **Restart server** after adding keys
2. **Check browser console** for errors
3. **Verify key format** is correct
4. **Test API keys** manually

### **Manual API Test:**
```bash
# Test Unsplash key:
curl -H "Authorization: Client-ID YOUR_KEY" \
     "https://api.unsplash.com/search/photos?query=san francisco&per_page=1"

# Should return JSON with photo data
```

---

**🚀 Add your API keys to `.env.local`, restart the server, and your cities will have beautiful images!**

**If you're still stuck, tell me what error messages you see in the console!**
