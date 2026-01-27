# 📷 Unsplash API Setup Guide

## 🔑 **Required Environment Variables**

Add these to your `.env.local` file:

```bash
# Unsplash API (Primary Image Provider)
UNSPLASH_ACCESS_KEY=your_unsplash_access_key_here

# Pexels API (Fallback Image Provider)  
PEXELS_API_KEY=your_pexels_api_key_here
```

---

## 🚀 **How to Get API Keys**

### **1. Unsplash API (Primary)**

1. **Sign Up**: Go to [Unsplash Developers](https://unsplash.com/developers)
2. **Create Application**: 
   - Click "New Application"
   - Choose "Non-commercial" or "Commercial" based on your use case
   - Fill in application details
3. **Get Access Key**: 
   - Go to your application dashboard
   - Copy the "Access Key" 
   - Add to `UNSPLASH_ACCESS_KEY`

### **2. Pexels API (Fallback)**

1. **Sign Up**: Go to [Pexels API](https://www.pexels.com/api/)
2. **Request API Key**:
   - Click "Request API Key"
   - Fill in your information
   - Wait for approval (usually instant)
3. **Get API Key**:
   - Copy your API key
   - Add to `PEXELS_API_KEY`

---

## 📋 **Usage Examples**

### **In Components:**

```tsx
// Enhanced CityCard with Unsplash
<EnhancedCityCard 
  city={city} 
  useUnsplash={true} 
/>

// Enhanced PlaceCard with Unsplash  
<EnhancedPlaceCard 
  place={place} 
  useUnsplash={true} 
/>
```

### **Direct API Calls:**

```tsx
import { getCityImage, getPlaceImage } from '@/utils/image-helpers';

// Get city image
const cityImageUrl = await getCityImage('San Francisco', 'USA');

// Get place image
const placeImageUrl = await getPlaceImage('Golden Gate Bridge');
```

---

## 🎯 **Features Implemented**

### **✅ Primary Features:**
- **Unsplash Integration** - High-quality travel photos
- **Pexels Fallback** - Backup when Unsplash fails
- **Smart Query Building** - Optimized search terms
- **Database Caching** - Save URLs to avoid repeated calls
- **Error Handling** - Graceful fallbacks

### **✅ Component Integration:**
- **Enhanced CityCard** - Auto-fetches city images
- **Enhanced PlaceCard** - Auto-fetches place images
- **Loading States** - Shows loading while fetching
- **Fallback Images** - Default images when API fails

### **✅ Optimization:**
- **Query Optimization** - City name + country + keywords
- **Image Size Selection** - Appropriate sizes for cards
- **Caching Strategy** - Database storage for fetched URLs
- **Rate Limiting** - Built-in API rate limit handling

---

## 🔄 **How It Works**

### **1. Image Request Flow:**
```
Component Request → Check Database → Try Unsplash → Fallback to Pexels → Save to DB
```

### **2. Query Building:**
- **Cities**: "San Francisco USA city skyline architecture"
- **Places**: "Golden Gate Bridge travel destination landmark"

### **3. Caching Strategy:**
- First request: API call → Save to database
- Subsequent requests: Database lookup (no API call)

---

## 🎨 **Image Categories Used**

### **Unsplash Categories:**
- `city` - For city skylines and urban scenes
- `travel` - For travel destinations and landmarks
- `architecture` - For buildings and structures
- `nature` - For natural landscapes

### **Pexels Categories:**
- Uses same categories as Unsplash
- Automatic orientation matching
- High-quality image selection

---

## 🚨 **Important Notes**

### **API Rate Limits:**
- **Unsplash**: 50 requests/hour (free tier)
- **Pexels**: 200 requests/hour (free tier)

### **Attribution Requirements:**
- **Unsplash**: Attribution included in API response
- **Pexels**: No attribution required but appreciated

### **Best Practices:**
- **Use caching** to avoid rate limits
- **Implement fallbacks** for API failures
- **Optimize queries** for better results
- **Monitor usage** to stay within limits

---

## 🛠️ **Troubleshooting**

### **No Images Found:**
- Check API keys are correct
- Verify query terms are specific
- Check rate limits haven't been exceeded

### **API Errors:**
- Check network connectivity
- Verify API key permissions
- Check service status pages

### **Slow Loading:**
- Implement better caching
- Use smaller image sizes
- Add loading states

---

## 🎉 **Next Steps**

1. **Add API Keys** to your `.env.local`
2. **Update Components** to use enhanced versions
3. **Test Integration** with your cities and places
4. **Monitor Usage** to stay within API limits
5. **Optimize Caching** for better performance

---

**📷 Your image integration is ready! Add the API keys and start enjoying beautiful travel photos in your app!**
