"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Icons } from "@/components/icons";

export default function ApiDocumentationPage() {
  return (
    <div className="container py-8 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">API Documentation</h1>
        <p className="text-muted-foreground">
          Integrate AppScreens into your workflow with our REST API
        </p>
      </div>

      <Tabs defaultValue="authentication">
        <TabsList>
          <TabsTrigger value="authentication">Authentication</TabsTrigger>
          <TabsTrigger value="endpoints">Endpoints</TabsTrigger>
          <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
          <TabsTrigger value="examples">Examples</TabsTrigger>
        </TabsList>

        <TabsContent value="authentication" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Authentication</CardTitle>
              <CardDescription>
                All API requests must be authenticated using an API key
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-lg font-medium mb-2">API Key</h3>
                <p className="text-sm text-muted-foreground">
                  To authenticate with the API, include your API key in the Authorization header:
                </p>
                <div className="mt-2 p-4 bg-muted rounded-md font-mono text-sm">
                  Authorization: Bearer YOUR_API_KEY
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2">Getting an API Key</h3>
                <p className="text-sm text-muted-foreground">
                  Generate an API key from your account settings:
                </p>
                <ol className="mt-2 list-decimal list-inside space-y-1 text-sm">
                  <li>Go to your Profile Settings</li>
                  <li>Navigate to the API Keys section</li>
                  <li>Click "Generate New Key"</li>
                  <li>Give your key a name and set permissions</li>
                  <li>Copy the generated key and store it securely</li>
                </ol>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="endpoints" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>API Endpoints</CardTitle>
              <CardDescription>
                Available endpoints for interacting with the AppScreens API
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">POST</Badge>
                      <h3 className="font-mono font-medium">/api/v1/screenshots</h3>
                    </div>
                    <Badge variant="outline">Authentication Required</Badge>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Create a new screenshot job
                  </p>
                  <div className="mt-3">
                    <h4 className="text-sm font-medium">Request Body</h4>
                    <pre className="mt-2 p-4 bg-muted rounded-md text-xs overflow-x-auto">
{`{
  "url": "https://example.com",
  "devices": ["iphone12", "pixel5"],
  "locales": ["en-US", "es-ES"],
  "fullPage": true
}`}
                    </pre>
                  </div>
                  <div className="mt-3">
                    <h4 className="text-sm font-medium">Response</h4>
                    <pre className="mt-2 p-4 bg-muted rounded-md text-xs overflow-x-auto">
{`{
  "id": "job_123456",
  "status": "processing",
  "estimatedCompletion": "2023-06-01T12:00:00Z"
}`}
                    </pre>
                  </div>
                </div>

                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">GET</Badge>
                      <h3 className="font-mono font-medium">/api/v1/screenshots/{`{id}`}</h3>
                    </div>
                    <Badge variant="outline">Authentication Required</Badge>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Get the status and results of a screenshot job
                  </p>
                  <div className="mt-3">
                    <h4 className="text-sm font-medium">Response</h4>
                    <pre className="mt-2 p-4 bg-muted rounded-md text-xs overflow-x-auto">
{`{
  "id": "job_123456",
  "url": "https://example.com",
  "status": "completed",
  "screenshots": [
    {
      "id": "screenshot_789",
      "device": "iphone12",
      "locale": "en-US",
      "url": "https://cdn.example.com/screenshot_789.png"
    }
  ],
  "createdAt": "2023-06-01T11:00:00Z",
  "completedAt": "2023-06-01T11:05:00Z"
}`}
                    </pre>
                  </div>
                </div>

                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">GET</Badge>
                      <h3 className="font-mono font-medium">/api/v1/screenshots</h3>
                    </div>
                    <Badge variant="outline">Authentication Required</Badge>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">
                    List all screenshot jobs
                  </p>
                  <div className="mt-3">
                    <h4 className="text-sm font-medium">Query Parameters</h4>
                    <ul className="mt-2 text-xs space-y-1">
                      <li><code>limit</code> - Number of jobs to return (default: 10)</li>
                      <li><code>offset</code> - Offset for pagination (default: 0)</li>
                      <li><code>status</code> - Filter by status (processing, completed, failed)</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="webhooks" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Webhooks</CardTitle>
              <CardDescription>
                Receive real-time notifications about screenshot job events
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-lg font-medium mb-2">Configuring Webhooks</h3>
                <p className="text-sm text-muted-foreground">
                  Set up webhooks in your account settings to receive notifications when screenshot jobs are completed.
                </p>
                <ol className="mt-2 list-decimal list-inside space-y-1 text-sm">
                  <li>Go to your Profile Settings</li>
                  <li>Navigate to the Webhooks section</li>
                  <li>Click "Add Webhook"</li>
                  <li>Enter your webhook URL</li>
                  <li>Select the events you want to receive</li>
                  <li>Save your webhook</li>
                </ol>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2">Webhook Events</h3>
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center gap-2">
                      <Icons.image className="h-4 w-4" />
                      <h4 className="font-medium">screenshot.job.completed</h4>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Sent when a screenshot job has completed successfully
                    </p>
                    <pre className="mt-2 p-4 bg-muted rounded-md text-xs overflow-x-auto">
{`{
  "event": "screenshot.job.completed",
  "timestamp": "2023-06-01T12:00:00Z",
  "data": {
    "jobId": "job_123456",
    "url": "https://example.com",
    "screenshots": [
      {
        "id": "screenshot_789",
        "device": "iphone12",
        "locale": "en-US",
        "url": "https://cdn.example.com/screenshot_789.png"
      }
    ]
  }
}`}
                    </pre>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center gap-2">
                      <Icons.alertCircle className="h-4 w-4" />
                      <h4 className="font-medium">screenshot.job.failed</h4>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Sent when a screenshot job has failed
                    </p>
                    <pre className="mt-2 p-4 bg-muted rounded-md text-xs overflow-x-auto">
{`{
  "event": "screenshot.job.failed",
  "timestamp": "2023-06-01T12:00:00Z",
  "data": {
    "jobId": "job_123456",
    "url": "https://example.com",
    "error": "Failed to load page"
  }
}`}
                    </pre>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2">Webhook Security</h3>
                <p className="text-sm text-muted-foreground">
                  To verify that a webhook request came from AppScreens, we include a signature in the header:
                </p>
                <div className="mt-2 p-4 bg-muted rounded-md font-mono text-sm">
                  X-AppScreens-Signature: sha256=&lt;signature&gt;
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  You can verify this signature using your webhook secret, which you can find in your account settings.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="examples" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Code Examples</CardTitle>
              <CardDescription>
                Example implementations in various programming languages
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Tabs defaultValue="javascript">
                <TabsList>
                  <TabsTrigger value="javascript">JavaScript</TabsTrigger>
                  <TabsTrigger value="python">Python</TabsTrigger>
                  <TabsTrigger value="curl">cURL</TabsTrigger>
                </TabsList>
                
                <TabsContent value="javascript">
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-medium mb-2">Create a Screenshot Job</h3>
                      <pre className="p-4 bg-muted rounded-md text-xs overflow-x-auto">
{`const response = await fetch('https://api.appscreens.com/api/v1/screenshots', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    url: 'https://example.com',
    devices: ['iphone12', 'pixel5'],
    locales: ['en-US', 'es-ES'],
    fullPage: true
  })
});

const data = await response.json();
console.log('Job ID:', data.id);`}
                      </pre>
                    </div>
                    
                    <div>
                      <h3 className="font-medium mb-2">Get Job Status</h3>
                      <pre className="p-4 bg-muted rounded-md text-xs overflow-x-auto">
{`const response = await fetch(\`https://api.appscreens.com/api/v1/screenshots/\${jobId}\`, {
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY'
  }
});

const data = await response.json();
console.log('Job status:', data.status);`}
                      </pre>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="python">
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-medium mb-2">Create a Screenshot Job</h3>
                      <pre className="p-4 bg-muted rounded-md text-xs overflow-x-auto">
{`import requests

url = "https://api.appscreens.com/api/v1/screenshots"
headers = {
    "Authorization": "Bearer YOUR_API_KEY",
    "Content-Type": "application/json"
}
data = {
    "url": "https://example.com",
    "devices": ["iphone12", "pixel5"],
    "locales": ["en-US", "es-ES"],
    "fullPage": True
}

response = requests.post(url, json=data, headers=headers)
job_id = response.json()["id"]
print(f"Job ID: {job_id}")`}
                      </pre>
                    </div>
                    
                    <div>
                      <h3 className="font-medium mb-2">Get Job Status</h3>
                      <pre className="p-4 bg-muted rounded-md text-xs overflow-x-auto">
{`import requests

url = f"https://api.appscreens.com/api/v1/screenshots/{job_id}"
headers = {
    "Authorization": "Bearer YOUR_API_KEY"
}

response = requests.get(url, headers=headers)
status = response.json()["status"]
print(f"Job status: {status}")`}
                      </pre>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="curl">
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-medium mb-2">Create a Screenshot Job</h3>
                      <pre className="p-4 bg-muted rounded-md text-xs overflow-x-auto">
{`curl -X POST https://api.appscreens.com/api/v1/screenshots \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "url": "https://example.com",
    "devices": ["iphone12", "pixel5"],
    "locales": ["en-US", "es-ES"],
    "fullPage": true
  }'`}
                      </pre>
                    </div>
                    
                    <div>
                      <h3 className="font-medium mb-2">Get Job Status</h3>
                      <pre className="p-4 bg-muted rounded-md text-xs overflow-x-auto">
{`curl https://api.appscreens.com/api/v1/screenshots/{job_id} \\
  -H "Authorization: Bearer YOUR_API_KEY"`}
                      </pre>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}