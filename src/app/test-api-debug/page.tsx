"use client";

import { useState, useEffect } from "react";

export default function TestApiDebugPage() {
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (message: string) => {
    setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  useEffect(() => {
    const testAPI = async () => {
      addLog("🔍 Testing API debug...");
      
      // Test the unified image API
      try {
        addLog("📡 Calling /api/images?query=London,GB");
        const response = await fetch('/api/images?query=London,GB');
        addLog(`📊 Response status: ${response.status}`);
        
        const contentType = response.headers.get('content-type');
        addLog(`📋 Content-Type: ${contentType}`);
        
        if (contentType?.includes('application/json')) {
          const data = await response.json();
          addLog(`✅ JSON Response: ${JSON.stringify(data).substring(0, 100)}...`);
        } else {
          const text = await response.text();
          addLog(`❌ Non-JSON Response (first 200 chars): ${text.substring(0, 200)}...`);
        }
      } catch (error) {
        addLog(`❌ Fetch Error: ${error}`);
      }

      // Test direct Unsplash API
      try {
        addLog("📡 Calling /api/images/unsplash?query=London");
        const response = await fetch('/api/images/unsplash?query=London');
        addLog(`📊 Unsplash API status: ${response.status}`);
        
        const contentType = response.headers.get('content-type');
        addLog(`📋 Unsplash Content-Type: ${contentType}`);
        
        if (contentType?.includes('application/json')) {
          const data = await response.json();
          addLog(`✅ Unsplash JSON: ${JSON.stringify(data).substring(0, 100)}...`);
        } else {
          const text = await response.text();
          addLog(`❌ Unsplash Non-JSON (first 200 chars): ${text.substring(0, 200)}...`);
        }
      } catch (error) {
        addLog(`❌ Unsplash Fetch Error: ${error}`);
      }

      addLog("🏁 API debug test completed!");
    };

    testAPI();
  }, []);

  return (
    <div className="min-h-screen p-8 bg-surface">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">🔍 API Debug Test</h1>
        
        <div className="bg-surface-secondary p-6 rounded-lg">
          <h2 className="font-semibold mb-4">API Test Logs:</h2>
          <div className="space-y-2 font-mono text-sm max-h-96 overflow-y-auto bg-black text-green-400 p-4 rounded">
            {logs.length === 0 ? (
              <p>Running tests...</p>
            ) : (
              logs.map((log, index) => (
                <div key={index} className="break-all">
                  {log}
                </div>
              ))
            )}
          </div>
        </div>

        <div className="mt-6 bg-surface-secondary p-6 rounded-lg">
          <h2 className="font-semibold mb-4">🔧 Manual Test:</h2>
          <p className="text-sm mb-2">Check the server console for detailed logging from the API routes.</p>
          <p className="text-sm">The logs above show what the browser receives.</p>
        </div>
      </div>
    </div>
  );
}
