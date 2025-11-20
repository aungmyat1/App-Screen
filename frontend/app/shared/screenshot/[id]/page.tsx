"use client";

import { useState, useEffect } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Icons } from "@/components/icons";
import { toast } from "sonner";

// Mock screenshot data
const screenshot = {
  id: "1",
  url: "https://placehold.co/800x600",
  name: "App Homepage",
  createdAt: new Date(),
  owner: "John Doe"
};

export default function SharedScreenshotPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const screenshotId = params.id as string;
  const token = searchParams.get("token");
  const [permission, setPermission] = useState<"view" | "comment" | "edit">("view");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const validateToken = async () => {
      if (!token) {
        setError("No access token provided");
        setIsLoading(false);
        return;
      }

      try {
        // In a real implementation, this would call an API to validate the token
        console.log(`Validating token ${token} for screenshot ${screenshotId}`);
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // For demo purposes, we'll set a default permission
        setPermission("comment");
      } catch (err) {
        setError("Invalid or expired access token");
        toast.error("Invalid or expired access token");
      } finally {
        setIsLoading(false);
      }
    };

    validateToken();
  }, [screenshotId, token]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Icons.spinner className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Access Denied</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">{error}</p>
            <Button className="w-full mt-4" onClick={() => window.history.back()}>
              Go Back
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <Icons.image className="h-6 w-6" />
            <span className="font-bold">AppScreens</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              Shared by {screenshot.owner}
            </span>
            <Button variant="outline" size="sm">
              <Icons.download className="h-4 w-4 mr-2" />
              Download
            </Button>
          </div>
        </div>
      </header>

      <main className="container py-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold">{screenshot.name}</h1>
            <p className="text-muted-foreground">
              Created on {screenshot.createdAt.toLocaleDateString()}
            </p>
          </div>
        </div>

        <div className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Screenshot</CardTitle>
              <CardDescription>
                You have {permission} access to this screenshot
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg overflow-hidden">
                <img 
                  src={screenshot.url} 
                  alt={screenshot.name} 
                  className="w-full h-auto"
                />
              </div>
              
              <div className="mt-4 flex justify-end">
                <Button variant="outline" size="sm">
                  <Icons.flag className="h-4 w-4 mr-2" />
                  Report
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {permission !== "view" && (
          <div className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Comments</CardTitle>
                <CardDescription>
                  {permission === "comment" 
                    ? "Add a comment to this screenshot" 
                    : "Add or edit annotations on this screenshot"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Add a comment..."
                      className="flex-1 px-3 py-2 border rounded-md"
                    />
                    <Button>Post</Button>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="p-3 border rounded-md">
                      <div className="flex items-center gap-2">
                        <div className="font-medium">Jane Smith</div>
                        <div className="text-xs text-muted-foreground">
                          2 hours ago
                        </div>
                      </div>
                      <p className="mt-1">This button needs to be more prominent.</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
}