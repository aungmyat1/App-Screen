"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Icons } from "@/components/icons";

interface Version {
  id: string;
  name: string;
  timestamp: Date;
  author: string;
  changes: string;
}

export function VersionHistory() {
  const [versions, setVersions] = useState<Version[]>([
    {
      id: "1",
      name: "Initial version",
      timestamp: new Date(Date.now() - 3600000),
      author: "John Doe",
      changes: "Created initial annotations"
    },
    {
      id: "2",
      name: "Added arrows",
      timestamp: new Date(Date.now() - 1800000),
      author: "Jane Smith",
      changes: "Added directional arrows to key elements"
    },
    {
      id: "3",
      name: "Redacted sensitive info",
      timestamp: new Date(Date.now() - 600000),
      author: "You",
      changes: "Blurred sensitive user information"
    }
  ]);
  
  const [selectedVersion, setSelectedVersion] = useState<string | null>(null);

  const restoreVersion = (versionId: string) => {
    // In a real implementation, this would restore the annotations from this version
    setSelectedVersion(versionId);
    alert(`Restored version ${versionId}`);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Version History</CardTitle>
        <CardDescription>
          Track and restore previous versions of your annotations
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {versions.map((version) => (
          <div 
            key={version.id} 
            className={`p-4 rounded-lg border ${
              selectedVersion === version.id 
                ? "border-primary bg-primary/5" 
                : "hover:bg-muted"
            }`}
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-medium">{version.name}</h3>
                <p className="text-sm text-muted-foreground">
                  by {version.author} • {version.timestamp.toLocaleString()}
                </p>
                <p className="text-sm mt-1">{version.changes}</p>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => restoreVersion(version.id)}
              >
                <Icons.refreshCw className="h-4 w-4 mr-1" />
                Restore
              </Button>
            </div>
          </div>
        ))}
        
        <div className="pt-4 border-t">
          <Button className="w-full">
            <Icons.plus className="h-4 w-4 mr-2" />
            Save Current Version
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}