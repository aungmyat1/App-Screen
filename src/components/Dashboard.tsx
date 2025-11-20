import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { screenshotAPI } from '../services/api';

interface ScreenshotJob {
  _id: string;
  appId: string;
  appUrl: string;
  store: 'google' | 'apple';
  status: 'pending' | 'processing' | 'completed' | 'failed';
  createdAt: string;
}

const Dashboard: React.FC = () => {
  const [appUrl, setAppUrl] = useState('');
  const [selectedStore, setSelectedStore] = useState<'google' | 'apple'>('google');
  const [jobs, setJobs] = useState<ScreenshotJob[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [jobsLoading, setJobsLoading] = useState(true);
  
  const { user, logout } = useAuth();

  useEffect(() => {
    fetchUserJobs();
  }, []);

  const fetchUserJobs = async () => {
    try {
      setJobsLoading(true);
      const response = await screenshotAPI.getUserJobs();
      setJobs(response.data);
    } catch (err) {
      console.error('Failed to fetch jobs', err);
    } finally {
      setJobsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setError('');
      setLoading(true);
      
      // Validate URL
      const googlePlayUrlRegex = /^https:\/\/play\.google\.com\/store\/apps\/details\?id=([a-zA-Z0-9._-]+)/;
      const appleStoreUrlRegex = /^https:\/\/apps\.apple\.com\/[a-z]{2,3}\/app\/[a-zA-Z0-9-]+\/id(\d+)/;
      
      let isValid = false;
      if (selectedStore === 'google') {
        isValid = googlePlayUrlRegex.test(appUrl) || /^([a-zA-Z0-9_]{1,}\.)+[a-zA-Z0-9_]{1,}$/.test(appUrl);
      } else {
        isValid = appleStoreUrlRegex.test(appUrl) || /^\d{9,10}$/.test(appUrl);
      }
      
      if (!isValid) {
        setError(`Please enter a valid ${selectedStore === 'google' ? 'Google Play' : 'Apple App Store'} URL or ID`);
        setLoading(false);
        return;
      }
      
      // Request screenshots
      await screenshotAPI.requestScreenshots({ url: appUrl, store: selectedStore });
      
      // Refresh jobs list
      fetchUserJobs();
      
      // Reset form
      setAppUrl('');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to request screenshots');
    }
    
    setLoading(false);
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 shadow">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            AppScreens Dashboard
          </h1>
          <div className="flex items-center space-x-4">
            <span className="text-gray-700 dark:text-gray-300">
              Welcome, {user?.name}
            </span>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100">
              {user?.subscription.plan.toUpperCase()}
            </span>
            <button
              onClick={handleLogout}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              Logout
            </button>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Request App Screenshots
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="rounded-md bg-red-50 p-4">
                <div className="text-sm text-red-700">{error}</div>
              </div>
            )}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-grow">
                <label htmlFor="app-url" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  App URL or ID
                </label>
                <input
                  type="text"
                  id="app-url"
                  value={appUrl}
                  onChange={(e) => setAppUrl(e.target.value)}
                  placeholder="Enter app URL or ID"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label htmlFor="store" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Store
                </label>
                <select
                  id="store"
                  value={selectedStore}
                  onChange={(e) => setSelectedStore(e.target.value as 'google' | 'apple')}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
                >
                  <option value="google">Google Play</option>
                  <option value="apple">Apple App Store</option>
                </select>
              </div>
            </div>
            <div>
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Requesting...
                  </>
                ) : 'Request Screenshots'}
              </button>
            </div>
          </form>
        </div>

        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Your Screenshot Requests
          </h2>
          {jobsLoading ? (
            <div className="flex justify-center py-8">
              <svg className="animate-spin h-8 w-8 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
          ) : jobs.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 dark:text-gray-400">
                You haven't requested any screenshots yet.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      App
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Store
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Date
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {jobs.map((job) => (
                    <tr key={job._id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                        {job.appId}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {job.store === 'google' ? 'Google Play' : 'Apple App Store'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          job.status === 'completed' ? 'bg-green-100 text-green-800' :
                          job.status === 'failed' ? 'bg-red-100 text-red-800' :
                          job.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {new Date(job.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {job.status === 'completed' ? (
                          <button className="text-primary hover:text-primary-700">
                            Download
                          </button>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;