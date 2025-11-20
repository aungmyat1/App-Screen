'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  PlayIcon, 
  AppleIcon, 
  DownloadIcon,
  LogOutIcon,
  RefreshCwIcon
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { apiService, ScreenshotJob } from '@/lib/api';
import { JobStatus } from '@/components/job-status';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [appUrl, setAppUrl] = useState('');
  const [selectedStore, setSelectedStore] = useState<'google' | 'apple'>('google');
  const [isLoading, setIsLoading] = useState(false);
  const [jobs, setJobs] = useState<ScreenshotJob[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const handleDownload = async () => {
    setError(null);
    setIsLoading(true);

    try {
      const result = await apiService.requestScreenshots({
        url: appUrl,
        store: selectedStore
      });
      
      alert(result.message);
      setAppUrl('');
      refreshJobs();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to request screenshots');
    } finally {
      setIsLoading(false);
    }
  };

  const refreshJobs = async () => {
    try {
      setIsRefreshing(true);
      const userJobs = await apiService.getUserScreenshotJobs();
      setJobs(userJobs);
    } catch (err) {
      console.error('Failed to refresh jobs:', err);
    } finally {
      setIsRefreshing(false);
    }
  };

  const downloadJob = async (jobId: string) => {
    try {
      const blob = await apiService.downloadScreenshots(jobId);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `screenshots-${jobId}.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to download screenshots');
    }
  };

  const refreshJob = async (jobId: string) => {
    try {
      const updatedJob = await apiService.getScreenshotJob(jobId);
      setJobs(prevJobs => 
        prevJobs.map(job => job.id === jobId ? updatedJob : job)
      );
    } catch (err) {
      console.error('Failed to refresh job:', err);
    }
  };

  useEffect(() => {
    if (user) {
      refreshJobs();
    }
  }, [user]);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Access Denied</h1>
          <p className="mt-2 text-muted-foreground">You must be logged in to view this page.</p>
          <Button className="mt-4" onClick={() => router.push('/')}>
            Go Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">AppScreens</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm">Welcome, {user.name}</span>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOutIcon className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Card className="max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle>Request App Screenshots</CardTitle>
            <CardDescription>
              Enter the app URL or ID to download screenshots from the app store
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="app-url">App URL or ID</Label>
                <Input
                  id="app-url"
                  type="text"
                  value={appUrl}
                  onChange={(e) => setAppUrl(e.target.value)}
                  placeholder="Enter app URL or ID..."
                  disabled={isLoading}
                />
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-grow">
                  <Label>Store</Label>
                  <div className="flex gap-2 mt-2">
                    <Button
                      variant={selectedStore === 'google' ? 'default' : 'outline'}
                      onClick={() => setSelectedStore('google')}
                      className="flex items-center gap-2"
                    >
                      <PlayIcon className="h-4 w-4" />
                      Google Play
                    </Button>
                    <Button
                      variant={selectedStore === 'apple' ? 'default' : 'outline'}
                      onClick={() => setSelectedStore('apple')}
                      className="flex items-center gap-2"
                    >
                      <AppleIcon className="h-4 w-4" />
                      Apple App Store
                    </Button>
                  </div>
                </div>
              </div>
              
              {error && <p className="text-red-500">{error}</p>}
              
              <Button 
                className="w-full"
                onClick={handleDownload}
                disabled={isLoading || !appUrl}
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                    Requesting Screenshots...
                  </div>
                ) : (
                  <div className="flex items-center">
                    <DownloadIcon className="mr-2 h-5 w-5" />
                    Request Screenshots
                  </div>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <div className="mt-8 max-w-3xl mx-auto">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Your Recent Requests</CardTitle>
                  <CardDescription>
                    View the status of your screenshot requests
                  </CardDescription>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={refreshJobs}
                  disabled={isRefreshing}
                >
                  <RefreshCwIcon className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                  Refresh
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {jobs.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">
                    No recent requests found. Submit a request above to get started.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {jobs.map((job) => (
                    <JobStatus 
                      key={job.id} 
                      job={job} 
                      onDownload={downloadJob}
                      onRefresh={refreshJob}
                    />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}