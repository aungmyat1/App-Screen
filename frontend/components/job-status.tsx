'use client';

import { useState, useEffect } from 'react';
import { ScreenshotJob } from '@/lib/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  ClockIcon, 
  FileDownIcon, 
  CheckCircleIcon, 
  XCircleIcon, 
  RefreshCwIcon 
} from 'lucide-react';
import { apiService } from '@/lib/api';

interface JobStatusProps {
  job: ScreenshotJob;
  onDownload: (jobId: string) => void;
  onRefresh: (jobId: string) => void;
}

export function JobStatus({ job, onDownload, onRefresh }: JobStatusProps) {
  const [status, setStatus] = useState<ScreenshotJob['status']>(job.status);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    setStatus(job.status);
  }, [job.status]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await onRefresh(job.id);
    } finally {
      setIsRefreshing(false);
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'completed':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case 'failed':
        return <XCircleIcon className="h-5 w-5 text-red-500" />;
      case 'processing':
        return <RefreshCwIcon className="h-5 w-5 text-blue-500 animate-spin" />;
      default:
        return <ClockIcon className="h-5 w-5 text-yellow-500" />;
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'completed':
        return 'Completed';
      case 'failed':
        return 'Failed';
      case 'processing':
        return 'Processing';
      default:
        return 'Pending';
    }
  };

  const getStatusClass = () => {
    switch (status) {
      case 'completed':
        return 'text-green-500';
      case 'failed':
        return 'text-red-500';
      case 'processing':
        return 'text-blue-500';
      default:
        return 'text-yellow-500';
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{job.appId}</CardTitle>
            <CardDescription>
              {new Date(job.createdAt).toLocaleString()} • {job.store}
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            {getStatusIcon()}
            <span className={`text-sm font-medium ${getStatusClass()}`}>
              {getStatusText()}
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center">
          <div className="text-sm text-muted-foreground">
            Job ID: {job.id}
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleRefresh}
              disabled={isRefreshing}
            >
              <RefreshCwIcon className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            {status === 'completed' && (
              <Button size="sm" onClick={() => onDownload(job.id)}>
                <FileDownIcon className="h-4 w-4 mr-2" />
                Download
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}