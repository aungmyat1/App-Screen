"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Icons } from "@/components/icons";
import { toast } from "sonner";

interface SharePermission {
  id: string;
  name: string;
  description: string;
}

export function ShareDialog({ screenshotId }: { screenshotId: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [permission, setPermission] = useState("view");
  const [shareLink, setShareLink] = useState("");
  const [embedCode, setEmbedCode] = useState("");
  const [isCopying, setIsCopying] = useState(false);

  const permissions: SharePermission[] = [
    {
      id: "view",
      name: "View Only",
      description: "Recipients can view the screenshot"
    },
    {
      id: "comment",
      name: "View & Comment",
      description: "Recipients can view and comment on the screenshot"
    },
    {
      id: "edit",
      name: "Edit",
      description: "Recipients can view, comment, and edit the screenshot"
    }
  ];

  const generateShareLink = () => {
    // In a real implementation, this would call an API to generate a shareable link
    const link = `${window.location.origin}/shared/screenshot/${screenshotId}?token=abc123`;
    setShareLink(link);
    
    // Generate embed code
    const code = `<iframe src="${link}" width="800" height="600" frameborder="0"></iframe>`;
    setEmbedCode(code);
  };

  const copyToClipboard = (text: string) => {
    setIsCopying(true);
    navigator.clipboard.writeText(text)
      .then(() => {
        toast.success("Copied to clipboard!");
      })
      .catch(() => {
        toast.error("Failed to copy to clipboard");
      })
      .finally(() => {
        setIsCopying(false);
      });
  };

  const handleShare = () => {
    generateShareLink();
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Icons.share className="h-4 w-4 mr-2" />
          Share
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share Screenshot</DialogTitle>
          <DialogDescription>
            Share this screenshot with others or embed it on your website.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="permission">Permission Level</Label>
            <Select value={permission} onValueChange={setPermission}>
              <SelectTrigger id="permission">
                <SelectValue placeholder="Select permission" />
              </SelectTrigger>
              <SelectContent>
                {permissions.map((perm) => (
                  <SelectItem key={perm.id} value={perm.id}>
                    <div>
                      <div className="font-medium">{perm.name}</div>
                      <div className="text-sm text-muted-foreground">{perm.description}</div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {shareLink && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="link">Share Link</Label>
                <div className="flex gap-2">
                  <Input id="link" value={shareLink} readOnly />
                  <Button 
                    variant="outline" 
                    onClick={() => copyToClipboard(shareLink)}
                    disabled={isCopying}
                  >
                    {isCopying ? (
                      <Icons.spinner className="h-4 w-4 animate-spin" />
                    ) : (
                      "Copy"
                    )}
                  </Button>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="embed">Embed Code</Label>
                <div className="flex gap-2">
                  <Input id="embed" value={embedCode} readOnly />
                  <Button 
                    variant="outline" 
                    onClick={() => copyToClipboard(embedCode)}
                    disabled={isCopying}
                  >
                    {isCopying ? (
                      <Icons.spinner className="h-4 w-4 animate-spin" />
                    ) : (
                      "Copy"
                    )}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
        
        <DialogFooter>
          {!shareLink ? (
            <Button onClick={handleShare}>Generate Share Link</Button>
          ) : (
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Close
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}