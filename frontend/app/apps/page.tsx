'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/auth-context';

export default function AppsPage() {
  const { user } = useAuth();
  const [appId, setAppId] = useState('');
  const [platform, setPlatform] = useState('ios');
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!appId.trim()) {
      setError('Please enter an app ID');
      return;
    }
    
    setIsProcessing(true);
    setError('');
    setResult(null);
    
    try {
      // Simulate API call to process app screenshots
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setResult({
        appId,
        platform,
        screenshots: [
          { id: 1, url: 'https://placehold.co/300x600?text=Screenshot+1' },
          { id: 2, url: 'https://placehold.co/300x600?text=Screenshot+2' },
          { id: 3, url: 'https://placehold.co/300x600?text=Screenshot+3' },
          { id: 4, url: 'https://placehold.co/300x600?text=Screenshot+4' },
        ],
        downloadUrl: '#'
      });
    } catch (err) {
      setError('Failed to process app screenshots');
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-white shadow dark:bg-gray-800">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">My Apps</h1>
        </div>
      </header>
      
      <main>
        <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Download App Screenshots</h2>
              <p className="mt-1 text-gray-600 dark:text-gray-400">
                Enter the app ID and platform to download screenshots from the app store.
              </p>
              
              <form onSubmit={handleSubmit} className="mt-6">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label htmlFor="appId" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      App ID
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        id="appId"
                        value={appId}
                        onChange={(e) => setAppId(e.target.value)}
                        placeholder="com.example.app"
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:text-sm"
                      />
                    </div>
                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                      Enter the bundle ID for iOS or package name for Android
                    </p>
                  </div>
                  
                  <div>
                    <label htmlFor="platform" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Platform
                    </label>
                    <div className="mt-1">
                      <select
                        id="platform"
                        value={platform}
                        onChange={(e) => setPlatform(e.target.value)}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:text-sm"
                      >
                        <option value="ios">iOS (App Store)</option>
                        <option value="android">Android (Google Play)</option>
                      </select>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6">
                  <button
                    type="submit"
                    disabled={isProcessing}
                    className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 dark:bg-indigo-500 dark:hover:bg-indigo-400"
                  >
                    {isProcessing ? (
                      <>
                        <svg className="mr-2 h-4 w-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing...
                      </>
                    ) : (
                      'Download Screenshots'
                    )}
                  </button>
                </div>
                
                {error && (
                  <div className="mt-4 rounded-md bg-red-50 p-4">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-red-800">{error}</h3>
                      </div>
                    </div>
                  </div>
                )}
              </form>
              
              {result && (
                <div className="mt-8">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                      Screenshots for {result.appId} ({result.platform})
                    </h3>
                    <a
                      href={result.downloadUrl}
                      className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:bg-indigo-500 dark:hover:bg-indigo-400"
                    >
                      Download All
                    </a>
                  </div>
                  
                  <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                    {result.screenshots.map((screenshot: any) => (
                      <div key={screenshot.id} className="overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-700">
                        <img
                          src={screenshot.url}
                          alt={`Screenshot ${screenshot.id}`}
                          className="h-60 w-full object-contain"
                        />
                        <div className="p-2 text-center">
                          <a
                            href={screenshot.url}
                            download
                            className="text-sm font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
                          >
                            Download
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            <div className="mt-8 rounded-lg bg-white p-6 shadow dark:bg-gray-800">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Saved Apps</h2>
              <p className="mt-1 text-gray-600 dark:text-gray-400">
                Your previously processed apps
              </p>
              
              <div className="mt-4">
                <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                  <li className="py-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center dark:bg-indigo-900/30">
                          <span className="text-indigo-800 font-medium dark:text-indigo-200">A</span>
                        </div>
                        <div className="ml-4">
                          <h3 className="text-sm font-medium text-gray-900 dark:text-white">com.example.app1</h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">iOS • Last updated: 2023-05-15</p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300">
                          Download
                        </button>
                        <button className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
                          <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </li>
                  
                  <li className="py-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center dark:bg-indigo-900/30">
                          <span className="text-indigo-800 font-medium dark:text-indigo-200">B</span>
                        </div>
                        <div className="ml-4">
                          <h3 className="text-sm font-medium text-gray-900 dark:text-white">com.example.app2</h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Android • Last updated: 2023-05-10</p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300">
                          Download
                        </button>
                        <button className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
                          <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}