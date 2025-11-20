"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AnnotationCanvas } from "@/components/annotation-canvas";
import { VersionHistory } from "@/components/version-history";
import { CollaborationPanel } from "@/components/collaboration-panel";
import { Icons } from "@/components/icons";

// Mock screenshot data
const screenshot = {
  id: "1",
  url: "https://placehold.co/800x600",
  name: "App Homepage",
  createdAt: new Date(),
};

export default function AnnotateScreenshotPage() {
  const params = useParams();
  const screenshotId = params.id as string;
  const [activeTab, setActiveTab] = useState("annotate");

  return (
    <div className="container py-6 space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold">{screenshot.name}</h1>
          <p className="text-muted-foreground">
            Created on {screenshot.createdAt.toLocaleDateString()}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Icons.download className="h-4 w-4 mr-2" />
            Download
          </Button>
          <Button>
            <Icons.save className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="annotate">Annotate</TabsTrigger>
          <TabsTrigger value="versions">Versions</TabsTrigger>
          <TabsTrigger value="collaborators">Collaborators</TabsTrigger>
        </TabsList>
        
        <TabsContent value="annotate" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Annotation Tools</CardTitle>
              <CardDescription>
                Draw on the screenshot to highlight or hide elements
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AnnotationCanvas imageUrl={screenshot.url} />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="versions">
          <VersionHistory />
        </TabsContent>
        
        <TabsContent value="collaborators">
          <CollaborationPanel />
        </TabsContent>
      </Tabs>
    </div>
  );
}