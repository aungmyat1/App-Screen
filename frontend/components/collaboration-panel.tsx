"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Icons } from "@/components/icons";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface Collaborator {
  id: string;
  name: string;
  color: string;
  online: boolean;
  lastActive: Date;
}

export function CollaborationPanel() {
  const [collaborators, setCollaborators] = useState<Collaborator[]>([
    {
      id: "1",
      name: "You",
      color: "#3b82f6",
      online: true,
      lastActive: new Date()
    },
    {
      id: "2",
      name: "John Doe",
      color: "#ef4444",
      online: true,
      lastActive: new Date(Date.now() - 10000)
    },
    {
      id: "3",
      name: "Jane Smith",
      color: "#10b981",
      online: false,
      lastActive: new Date(Date.now() - 300000)
    }
  ]);
  
  const [showPresence, setShowPresence] = useState(true);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setCollaborators(prev => 
        prev.map(collaborator => {
          if (collaborator.id === "2") {
            // Randomly update John's last active time to simulate activity
            return {
              ...collaborator,
              lastActive: new Date()
            };
          }
          return collaborator;
        })
      );
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const togglePresence = () => {
    setShowPresence(!showPresence);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Collaborators</CardTitle>
            <CardDescription>
              {collaborators.filter(c => c.online).length} online
            </CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={togglePresence}>
            {showPresence ? (
              <>
                <Icons.eye className="h-4 w-4 mr-2" />
                Hide Presence
              </>
            ) : (
              <>
                <Icons.eyeOff className="h-4 w-4 mr-2" />
                Show Presence
              </>
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {showPresence && collaborators.map((collaborator) => (
          <div 
            key={collaborator.id} 
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted"
          >
            <div className="relative">
              <Avatar>
                <AvatarFallback 
                  style={{ backgroundColor: collaborator.color }}
                  className="text-white font-medium"
                >
                  {collaborator.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              {collaborator.online && (
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <p className="font-medium truncate">{collaborator.name}</p>
                {collaborator.online && (
                  <span className="text-xs text-green-600">Online</span>
                )}
              </div>
              <p className="text-xs text-muted-foreground truncate">
                {collaborator.online 
                  ? "Active now" 
                  : `Last seen ${Math.floor((Date.now() - collaborator.lastActive.getTime()) / 60000)}m ago`}
              </p>
            </div>
          </div>
        ))}
        
        <div className="pt-4 border-t">
          <Button variant="outline" className="w-full">
            <Icons.userPlus className="h-4 w-4 mr-2" />
            Invite Collaborators
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}