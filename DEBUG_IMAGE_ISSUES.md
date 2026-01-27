# 🔍 Debug Image Issues

## 🚨 **Current Status:**
Server is running but images might not be working. Let's debug step by step.

## 🧪 **Debug Steps:**

### **1. Check if Server is Running:**
```bash
# Should see server logs
npm run dev
```

### **2. Test API Endpoints:**
Visit these URLs in your browser:

#### **Test Helper API:**
```
http://localhost:3001/api/test-helper
```
Should show:
```json
{
  "success": true,
  "tests": {
    "cityImage": "✅ Success" | "❌ Failed",
    "placeImage": "✅ Success" | "❌ Failed", 
    "unsplashKey": "✅ Set" | "❌ Missing",
    "pexelsKey": "✅ Set" | "❌ Missing"
  }
}
```

#### **Debug Images Page:**
```
http://localhost:3001/debug-images
```
This page will run comprehensive tests and show detailed logs.

### **3. Check .env.local:**
Make sure your `.env.local` has:
```bash
UNSPLASH_ACCESS_KEY=your_unsplash_access_key_here
PEXELS_API_KEY=your_pexels_api_key_here
```

**IMPORTANT:** No `NEXT_PUBLIC_` prefix!

### **4. Manual API Tests:**
```bash
# Test Unsplash directly
curl "http://localhost:3001/api/images/unsplash?query=San Francisco"

# Test Pexels directly  
curl "http://localhost:3001/api/images/pexels?query=Paris"

# Test unified API
curl "http://localhost:3001/api/images?query=London&fallback=true"
```

## 🔧 **Common Issues:**

### **Issue 1: API Keys Missing**
- **Symptom:** "❌ Missing" for keys
- **Fix:** Add keys to `.env.local` and restart server

### **Issue 2: Wrong Variable Names**
- **Symptom:** Keys not found
- **Fix:** Use `UNSPLASH_ACCESS_KEY` (not `NEXT_PUBLIC_`)

### **Issue 3: Server Not Restarted**
- **Symptom:** Old environment variables
- **Fix:** Stop and restart `npm run dev`

### **Issue 4: API Rate Limits**
- **Symptom:** "Too many requests"
- **Fix:** Wait and try again (rate limited)

## 🎯 **What to Tell Me:**

When you test, please tell me:
1. **What do you see at `/api/test-helper`?**
2. **What do you see at `/debug-images`?**
3. **Any error messages in browser console?**
4. **Any error messages in server logs?**

## 🚀 **Quick Test:**

1. **Visit:** `http://localhost:3001/debug-images`
2. **Wait for tests to complete**
3. **Share the results**

This will tell us exactly what's wrong!
