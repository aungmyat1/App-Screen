'use client';

import { useAuth } from '@/contexts/auth-context';
import { WithRole, WithPermission } from '@/components/access-control';

export default function DashboardPage() {
  return (
    <WithRole roles={['admin', 'user', 'support', 'billing']} fallback={<Unauthorized />}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <header className="bg-white shadow dark:bg-gray-800">
          <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Dashboard</h1>
          </div>
        </header>
        <main>
          <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
            <div className="px-4 py-6 sm:px-0">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                <WithPermission permissions={['read:apps']}>
                  <div className="overflow-hidden rounded-lg bg-white shadow dark:bg-gray-800">
                    <div className="px-4 py-5 sm:p-6">
                      <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white">My Apps</h3>
                      <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                        <p>Manage your mobile applications</p>
                      </div>
                      <div className="mt-4">
                        <a
                          href="/apps"
                          className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        >
                          View Apps
                        </a>
                      </div>
                    </div>
                  </div>
                </WithPermission>
                
                <WithPermission permissions={['read:screenshots']}>
                  <div className="overflow-hidden rounded-lg bg-white shadow dark:bg-gray-800">
                    <div className="px-4 py-5 sm:p-6">
                      <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white">Screenshots</h3>
                      <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                        <p>Download and manage screenshots</p>
                      </div>
                      <div className="mt-4">
                        <a
                          href="/screenshots"
                          className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        >
                          View Screenshots
                        </a>
                      </div>
                    </div>
                  </div>
                </WithPermission>
                
                <WithPermission permissions={['read:subscriptions']}>
                  <div className="overflow-hidden rounded-lg bg-white shadow dark:bg-gray-800">
                    <div className="px-4 py-5 sm:p-6">
                      <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white">Billing</h3>
                      <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                        <p>Manage your subscription and payments</p>
                      </div>
                      <div className="mt-4">
                        <a
                          href="/billing"
                          className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        >
                          Manage Billing
                        </a>
                      </div>
                    </div>
                  </div>
                </WithPermission>
                
                <WithRole roles={['admin']}>
                  <div className="overflow-hidden rounded-lg bg-white shadow dark:bg-gray-800">
                    <div className="px-4 py-5 sm:p-6">
                      <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white">Admin Panel</h3>
                      <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                        <p>System administration tools</p>
                      </div>
                      <div className="mt-4">
                        <a
                          href="/admin"
                          className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        >
                          Access Admin Panel
                        </a>
                      </div>
                    </div>
                  </div>
                </WithRole>
                
                <WithRole roles={['support']}>
                  <div className="overflow-hidden rounded-lg bg-white shadow dark:bg-gray-800">
                    <div className="px-4 py-5 sm:p-6">
                      <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white">Support Panel</h3>
                      <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                        <p>User support tools</p>
                      </div>
                      <div className="mt-4">
                        <a
                          href="/support"
                          className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        >
                          Access Support Panel
                        </a>
                      </div>
                    </div>
                  </div>
                </WithRole>
                
                <WithRole roles={['billing']}>
                  <div className="overflow-hidden rounded-lg bg-white shadow dark:bg-gray-800">
                    <div className="px-4 py-5 sm:p-6">
                      <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white">Billing Management</h3>
                      <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                        <p>Financial management tools</p>
                      </div>
                      <div className="mt-4">
                        <a
                          href="/billing-management"
                          className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        >
                          Manage Billing
                        </a>
                      </div>
                    </div>
                  </div>
                </WithRole>
              </div>
            </div>
          </div>
        </main>
      </div>
    </WithRole>
  );
}

function Unauthorized() {
  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900 dark:text-white">
          Access Denied
        </h2>
      </div>
      
      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <div className="rounded-md bg-red-50 p-4">
          <div className="text-sm font-medium text-red-800">
            You don't have permission to access this page.
          </div>
        </div>
        
        <div className="mt-6">
          <a
            href="/"
            className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Return to Home
          </a>
        </div>
      </div>
    </div>
  );
}