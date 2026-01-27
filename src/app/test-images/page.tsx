"use client";

import { useState, useEffect } from "react";
import { getCityImage, getPlaceImage } from "@/utils/image-helpers";

export default function TestImagesPage() {
  const [testResults, setTestResults] = useState<string[]>([]);

  useEffect(() => {
    const testImages = async () => {
      const results: string[] = [];
      
      try {
        // Test city image
        const cityImage = await getCityImage("San Francisco", "USA");
        if (cityImage) {
          results.push(`✅ City Image: ${cityImage.substring(0, 100)}...`);
        } else {
          results.push(`❌ City Image: No image found`);
        }
      } catch (error) {
        results.push(`❌ City Image Error: ${error}`);
      }

      try {
        // Test place image
        const placeImage = await getPlaceImage("Golden Gate Bridge");
        if (placeImage) {
          results.push(`✅ Place Image: ${placeImage.substring(0, 100)}...`);
        } else {
          results.push(`❌ Place Image: No image found`);
        }
      } catch (error) {
        results.push(`❌ Place Image Error: ${error}`);
      }

      // Check environment variables (server-side only)
      const unsplashKey = process.env.UNSPLASH_ACCESS_KEY;
      const pexelsKey = process.env.PEXELS_API_KEY;
      
      results.push(`🔑 Unsplash Key: ${unsplashKey ? '✅ Set' : '❌ Missing'}`);
      results.push(`🔑 Pexels Key: ${pexelsKey ? '✅ Set' : '❌ Missing'}`);

      setTestResults(results);
    };

    testImages();
  }, []);

  return (
    <div className="min-h-screen p-8 bg-surface">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">🔍 Image API Test</h1>
        
        <div className="bg-surface-secondary p-6 rounded-lg space-y-2">
          <h2 className="font-semibold mb-4">Test Results:</h2>
          {testResults.length === 0 ? (
            <p>Running tests...</p>
          ) : (
            testResults.map((result, index) => (
              <div key={index} className="p-2 bg-surface rounded text-sm">
                {result}
              </div>
            ))
          )}
        </div>

        <div className="mt-6 bg-surface-secondary p-6 rounded-lg">
          <h2 className="font-semibold mb-4">📋 Setup Instructions:</h2>
          <div className="space-y-2 text-sm">
            <p>1. Create/edit <code>.env.local</code> in your project root</p>
            <p>2. Add these lines:</p>
            <pre className="bg-surface p-2 rounded mt-2">
{`UNSPLASH_ACCESS_KEY=your_unsplash_access_key_here
PEXELS_API_KEY=your_pexels_api_key_here`}
            </pre>
            <p>3. Restart the dev server: <code>npm run dev</code></p>
            <p>4. Refresh this page to test again</p>
          </div>
        </div>
      </div>
    </div>
  );
}
