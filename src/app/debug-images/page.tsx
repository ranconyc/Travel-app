"use client";

import { useState, useEffect } from "react";

export default function DebugImagesPage() {
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (message: string) => {
    setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  useEffect(() => {
    const testAPI = async () => {
      addLog("🔍 Starting API tests...");
      
      // Test 1: Check if API keys are available on server
      try {
        const response = await fetch('/api/images/unsplash?query=test');
        const data = await response.json();
        
        if (response.ok) {
          addLog(`✅ Unsplash API responded: ${JSON.stringify(data).substring(0, 100)}...`);
        } else {
          addLog(`❌ Unsplash API error (${response.status}): ${data.error || 'Unknown error'}`);
        }
      } catch (error) {
        addLog(`❌ Unsplash API fetch error: ${error}`);
      }

      // Test 2: Test Pexels API
      try {
        const response = await fetch('/api/images/pexels?query=test');
        const data = await response.json();
        
        if (response.ok) {
          addLog(`✅ Pexels API responded: ${JSON.stringify(data).substring(0, 100)}...`);
        } else {
          addLog(`❌ Pexels API error (${response.status}): ${data.error || 'Unknown error'}`);
        }
      } catch (error) {
        addLog(`❌ Pexels API fetch error: ${error}`);
      }

      // Test 3: Test unified API
      try {
        const response = await fetch('/api/images?query=San Francisco&fallback=true');
        const data = await response.json();
        
        if (response.ok) {
          addLog(`✅ Unified API responded: ${JSON.stringify(data).substring(0, 150)}...`);
        } else {
          addLog(`❌ Unified API error (${response.status}): ${data.error || 'Unknown error'}`);
        }
      } catch (error) {
        addLog(`❌ Unified API fetch error: ${error}`);
      }

      // Test 4: Test helper function
      try {
        const response = await fetch('/api/test-helper');
        const data = await response.json();
        addLog(`✅ Helper function test: ${JSON.stringify(data)}`);
      } catch (error) {
        addLog(`❌ Helper function test error: ${error}`);
      }

      addLog("🏁 API tests completed!");
    };

    testAPI();
  }, []);

  return (
    <div className="min-h-screen p-8 bg-surface">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">🔍 Image API Debug</h1>
        
        <div className="bg-surface-secondary p-6 rounded-lg">
          <h2 className="font-semibold mb-4">API Test Logs:</h2>
          <div className="space-y-2 font-mono text-sm max-h-96 overflow-y-auto">
            {logs.length === 0 ? (
              <p>Running tests...</p>
            ) : (
              logs.map((log, index) => (
                <div key={index} className={`p-2 rounded ${
                  log.includes('✅') ? 'bg-green-100 text-green-800' :
                  log.includes('❌') ? 'bg-red-100 text-red-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {log}
                </div>
              ))
            )}
          </div>
        </div>

        <div className="mt-6 bg-surface-secondary p-6 rounded-lg">
          <h2 className="font-semibold mb-4">🔧 Manual Tests:</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium">Test Unsplash API:</h3>
              <code className="text-sm bg-surface p-2 rounded block">
                GET /api/images/unsplash?query=San Francisco
              </code>
            </div>
            <div>
              <h3 className="font-medium">Test Pexels API:</h3>
              <code className="text-sm bg-surface p-2 rounded block">
                GET /api/images/pexels?query=Paris
              </code>
            </div>
            <div>
              <h3 className="font-medium">Test Unified API:</h3>
              <code className="text-sm bg-surface p-2 rounded block">
                GET /api/images?query=London&fallback=true
              </code>
            </div>
          </div>
        </div>

        <div className="mt-6 bg-surface-secondary p-6 rounded-lg">
          <h2 className="font-semibold mb-4">📋 Environment Check:</h2>
          <p className="text-sm">Check your .env.local file has:</p>
          <pre className="bg-surface p-2 rounded mt-2 text-sm">
{`UNSPLASH_ACCESS_KEY=your_unsplash_access_key_here
PEXELS_API_KEY=your_pexels_api_key_here`}
          </pre>
          <p className="text-sm mt-2">Make sure there are no NEXT_PUBLIC_ prefixes!</p>
        </div>
      </div>
    </div>
  );
}
