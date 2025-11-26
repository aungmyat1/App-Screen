'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/auth-context';

export default function SettingsPage() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [notificationPreferences, setNotificationPreferences] = useState({
    emailNotifications: true,
    appUpdates: true,
    securityAlerts: true,
  });
  
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState('');

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveSuccess(false);
    setSaveError('');
    
    try {
      // Simulate API call to update profile
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app, you would call an API to update the user's profile
      setSaveSuccess(true);
    } catch (err) {
      setSaveError('Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSavePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      setSaveError('New passwords do not match');
      return;
    }
    
    setIsSaving(true);
    setSaveSuccess(false);
    setSaveError('');
    
    try {
      // Simulate API call to update password
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Reset password fields
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      
      setSaveSuccess(true);
    } catch (err) {
      setSaveError('Failed to update password');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveNotifications = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveSuccess(false);
    setSaveError('');
    
    try {
      // Simulate API call to update notification preferences
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSaveSuccess(true);
    } catch (err) {
      setSaveError('Failed to update notification preferences');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      return;
    }
    
    try {
      // Simulate API call to delete account
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Log the user out
      await logout();
    } catch (err) {
      setSaveError('Failed to delete account');
    }
  };

  const tabs = [
    { id: 'profile', name: 'Profile' },
    { id: 'password', name: 'Password' },
    { id: 'notifications', name: 'Notifications' },
    { id: 'billing', name: 'Billing' },
    { id: 'security', name: 'Security' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-white shadow dark:bg-gray-800">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Settings</h1>
        </div>
      </header>
      
      <main>
        <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="rounded-lg bg-white shadow dark:bg-gray-800">
              <div className="border-b border-gray-200 dark:border-gray-700">
                <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`${
                        activeTab === tab.id
                          ? 'border-indigo-500 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400'
                          : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400 dark:hover:border-gray-300 dark:hover:text-gray-300'
                      } whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium`}
                    >
                      {tab.name}
                    </button>
                  ))}
                </nav>
              </div>
              
              <div className="p-6">
                {saveSuccess && (
                  <div className="rounded-md bg-green-50 p-4 mb-6">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-green-800">Settings saved successfully!</p>
                      </div>
                    </div>
                  </div>
                )}
                
                {saveError && (
                  <div className="rounded-md bg-red-50 p-4 mb-6">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-red-800">{saveError}</h3>
                      </div>
                    </div>
                  </div>
                )}
                
                {activeTab === 'profile' && (
                  <form onSubmit={handleSaveProfile}>
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Profile Information</h3>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                          Update your profile information.
                        </p>
                      </div>
                      
                      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                        <div>
                          <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Name
                          </label>
                          <div className="mt-1">
                            <input
                              type="text"
                              id="name"
                              value={name}
                              onChange={(e) => setName(e.target.value)}
                              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:text-sm"
                            />
                          </div>
                        </div>
                        
                        <div>
                          <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Email address
                          </label>
                          <div className="mt-1">
                            <input
                              type="email"
                              id="email"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:text-sm"
                            />
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex justify-end">
                        <button
                          type="submit"
                          disabled={isSaving}
                          className="ml-3 inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 dark:bg-indigo-500 dark:hover:bg-indigo-400"
                        >
                          {isSaving ? 'Saving...' : 'Save'}
                        </button>
                      </div>
                    </div>
                  </form>
                )}
                
                {activeTab === 'password' && (
                  <form onSubmit={handleSavePassword}>
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Change Password</h3>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                          Update your password associated with your account.
                        </p>
                      </div>
                      
                      <div className="space-y-6">
                        <div>
                          <label htmlFor="current-password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Current Password
                          </label>
                          <div className="mt-1">
                            <input
                              type="password"
                              id="current-password"
                              value={currentPassword}
                              onChange={(e) => setCurrentPassword(e.target.value)}
                              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:text-sm"
                            />
                          </div>
                        </div>
                        
                        <div>
                          <label htmlFor="new-password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            New Password
                          </label>
                          <div className="mt-1">
                            <input
                              type="password"
                              id="new-password"
                              value={newPassword}
                              onChange={(e) => setNewPassword(e.target.value)}
                              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:text-sm"
                            />
                          </div>
                        </div>
                        
                        <div>
                          <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Confirm New Password
                          </label>
                          <div className="mt-1">
                            <input
                              type="password"
                              id="confirm-password"
                              value={confirmPassword}
                              onChange={(e) => setConfirmPassword(e.target.value)}
                              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:text-sm"
                            />
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex justify-end">
                        <button
                          type="submit"
                          disabled={isSaving}
                          className="ml-3 inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 dark:bg-indigo-500 dark:hover:bg-indigo-400"
                        >
                          {isSaving ? 'Saving...' : 'Save'}
                        </button>
                      </div>
                    </div>
                  </form>
                )}
                
                {activeTab === 'notifications' && (
                  <form onSubmit={handleSaveNotifications}>
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Notification Preferences</h3>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                          Configure how you receive notifications.
                        </p>
                      </div>
                      
                      <div className="space-y-4">
                        <fieldset>
                          <legend className="text-base font-medium text-gray-900 dark:text-white">Email Notifications</legend>
                          <div className="mt-4 space-y-4">
                            <div className="relative flex items-start">
                              <div className="flex h-5 items-center">
                                <input
                                  id="email-notifications"
                                  name="email-notifications"
                                  type="checkbox"
                                  checked={notificationPreferences.emailNotifications}
                                  onChange={(e) => setNotificationPreferences({
                                    ...notificationPreferences,
                                    emailNotifications: e.target.checked
                                  })}
                                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700"
                                />
                              </div>
                              <div className="ml-3 text-sm">
                                <label htmlFor="email-notifications" className="font-medium text-gray-700 dark:text-gray-300">
                                  Email notifications
                                </label>
                                <p className="text-gray-500 dark:text-gray-400">
                                  Receive email notifications about your account activity.
                                </p>
                              </div>
                            </div>
                            
                            <div className="relative flex items-start">
                              <div className="flex h-5 items-center">
                                <input
                                  id="app-updates"
                                  name="app-updates"
                                  type="checkbox"
                                  checked={notificationPreferences.appUpdates}
                                  onChange={(e) => setNotificationPreferences({
                                    ...notificationPreferences,
                                    appUpdates: e.target.checked
                                  })}
                                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700"
                                />
                              </div>
                              <div className="ml-3 text-sm">
                                <label htmlFor="app-updates" className="font-medium text-gray-700 dark:text-gray-300">
                                  App updates
                                </label>
                                <p className="text-gray-500 dark:text-gray-400">
                                  Receive notifications about new features and updates.
                                </p>
                              </div>
                            </div>
                            
                            <div className="relative flex items-start">
                              <div className="flex h-5 items-center">
                                <input
                                  id="security-alerts"
                                  name="security-alerts"
                                  type="checkbox"
                                  checked={notificationPreferences.securityAlerts}
                                  onChange={(e) => setNotificationPreferences({
                                    ...notificationPreferences,
                                    securityAlerts: e.target.checked
                                  })}
                                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700"
                                />
                              </div>
                              <div className="ml-3 text-sm">
                                <label htmlFor="security-alerts" className="font-medium text-gray-700 dark:text-gray-300">
                                  Security alerts
                                </label>
                                <p className="text-gray-500 dark:text-gray-400">
                                  Receive important security notifications.
                                </p>
                              </div>
                            </div>
                          </div>
                        </fieldset>
                      </div>
                      
                      <div className="flex justify-end">
                        <button
                          type="submit"
                          disabled={isSaving}
                          className="ml-3 inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 dark:bg-indigo-500 dark:hover:bg-indigo-400"
                        >
                          {isSaving ? 'Saving...' : 'Save'}
                        </button>
                      </div>
                    </div>
                  </form>
                )}
                
                {activeTab === 'security' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white">Security</h3>
                      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        Manage your account security settings.
                      </p>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-sm font-medium text-gray-900 dark:text-white">Two-factor authentication</h4>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Add an extra layer of security to your account.
                          </p>
                        </div>
                        <button
                          type="button"
                          className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:bg-indigo-500 dark:hover:bg-indigo-400"
                        >
                          Enable
                        </button>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-sm font-medium text-gray-900 dark:text-white">Active sessions</h4>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            View and manage devices connected to your account.
                          </p>
                        </div>
                        <button
                          type="button"
                          className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
                        >
                          View
                        </button>
                      </div>
                      
                      <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
                        <h4 className="text-sm font-medium text-red-600 dark:text-red-400">Danger Zone</h4>
                        <div className="mt-4 flex items-center justify-between">
                          <div>
                            <h5 className="text-sm font-medium text-gray-900 dark:text-white">Delete account</h5>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              Permanently delete your account and all associated data.
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={handleDeleteAccount}
                            className="inline-flex items-center rounded-md border border-transparent bg-red-600 px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:bg-red-500 dark:hover:bg-red-400"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                {activeTab === 'billing' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white">Billing Information</h3>
                      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        Manage your billing information and payment methods.
                      </p>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-sm font-medium text-gray-900 dark:text-white">Payment methods</h4>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Add or remove payment methods.
                          </p>
                        </div>
                        <a
                          href="/billing"
                          className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:bg-indigo-500 dark:hover:bg-indigo-400"
                        >
                          Manage
                        </a>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-sm font-medium text-gray-900 dark:text-white">Invoices</h4>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            View and download your invoices.
                          </p>
                        </div>
                        <a
                          href="/billing"
                          className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:bg-indigo-500 dark:hover:bg-indigo-400"
                        >
                          View
                        </a>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}