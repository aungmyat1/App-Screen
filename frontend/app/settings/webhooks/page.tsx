"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Icons } from "@/components/icons";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";

interface Webhook {
  id: string;
  url: string;
  events: string[];
  active: boolean;
  createdAt: Date;
  lastDelivery?: Date;
  lastDeliveryStatus?: "success" | "failed";
}

export default function WebhookSettingsPage() {
  const [webhooks, setWebhooks] = useState<Webhook[]>([
    {
      id: "1",
      url: "https://api.example.com/webhooks",
      events: ["screenshot.job.completed", "screenshot.job.failed"],
      active: true,
      createdAt: new Date(Date.now() - 86400000),
      lastDelivery: new Date(Date.now() - 3600000),
      lastDeliveryStatus: "success"
    }
  ]);
  
  const [newWebhook, setNewWebhook] = useState({
    url: "",
    events: [] as string[],
    active: true
  });
  
  const [isCreating, setIsCreating] = useState(false);
  const [selectedEvents, setSelectedEvents] = useState<string[]>([]);

  const availableEvents = [
    { id: "screenshot.job.completed", name: "Screenshot Job Completed" },
    { id: "screenshot.job.failed", name: "Screenshot Job Failed" },
    { id: "screenshot.job.processing", name: "Screenshot Job Processing" },
    { id: "annotation.created", name: "Annotation Created" },
    { id: "annotation.updated", name: "Annotation Updated" }
  ];

  const addWebhook = async () => {
    if (!newWebhook.url) {
      toast.error("Please enter a webhook URL");
      return;
    }

    setIsCreating(true);
    
    try {
      // In a real implementation, this would call an API to create the webhook
      const webhook: Webhook = {
        id: (webhooks.length + 1).toString(),
        url: newWebhook.url,
        events: selectedEvents,
        active: newWebhook.active,
        createdAt: new Date()
      };
      
      setWebhooks([...webhooks, webhook]);
      setNewWebhook({ url: "", events: [], active: true });
      setSelectedEvents([]);
      
      toast.success("Webhook created successfully!");
    } catch (error) {
      toast.error("Failed to create webhook");
      console.error("Webhook creation error:", error);
    } finally {
      setIsCreating(false);
    }
  };

  const toggleWebhook = async (id: string, active: boolean) => {
    try {
      // In a real implementation, this would call an API to update the webhook
      setWebhooks(webhooks.map(w => 
        w.id === id ? { ...w, active } : w
      ));
      
      toast.success(`Webhook ${active ? 'enabled' : 'disabled'} successfully!`);
    } catch (error) {
      toast.error(`Failed to ${active ? 'enable' : 'disable'} webhook`);
      console.error("Webhook toggle error:", error);
    }
  };

  const deleteWebhook = async (id: string) => {
    try {
      // In a real implementation, this would call an API to delete the webhook
      setWebhooks(webhooks.filter(w => w.id !== id));
      
      toast.success("Webhook deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete webhook");
      console.error("Webhook deletion error:", error);
    }
  };

  const testWebhook = async (id: string) => {
    try {
      // In a real implementation, this would call an API to send a test event
      console.log(`Testing webhook ${id}`);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success("Test event sent successfully!");
    } catch (error) {
      toast.error("Failed to send test event");
      console.error("Webhook test error:", error);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Webhook Settings</h3>
        <p className="text-sm text-muted-foreground">
          Configure webhooks to receive real-time notifications about events in your account
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Create Webhook</CardTitle>
          <CardDescription>
            Add a new webhook to receive notifications
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="webhook-url">Webhook URL</Label>
            <Input
              id="webhook-url"
              value={newWebhook.url}
              onChange={(e) => setNewWebhook({...newWebhook, url: e.target.value})}
              placeholder="https://your-domain.com/webhook"
            />
          </div>
          
          <div className="space-y-2">
            <Label>Events</Label>
            <div className="space-y-2">
              {availableEvents.map((event) => (
                <div key={event.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id={event.id}
                      checked={selectedEvents.includes(event.id)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedEvents([...selectedEvents, event.id]);
                        } else {
                          setSelectedEvents(selectedEvents.filter(e => e !== event.id));
                        }
                      }}
                    />
                    <Label htmlFor={event.id}>{event.name}</Label>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch
              id="active"
              checked={newWebhook.active}
              onCheckedChange={(checked) => setNewWebhook({...newWebhook, active: checked})}
            />
            <Label htmlFor="active">Active</Label>
          </div>
          
          <Button 
            onClick={addWebhook} 
            disabled={isCreating}
            className="w-full"
          >
            {isCreating ? (
              <>
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              "Create Webhook"
            )}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Configured Webhooks</CardTitle>
          <CardDescription>
            Manage your existing webhooks
          </CardDescription>
        </CardHeader>
        <CardContent>
          {webhooks.length === 0 ? (
            <div className="text-center py-8">
              <Icons.webhook className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium">No webhooks</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Get started by creating a new webhook.
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>URL</TableHead>
                  <TableHead>Events</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Delivery</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {webhooks.map((webhook) => (
                  <TableRow key={webhook.id}>
                    <TableCell className="font-medium">{webhook.url}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {webhook.events.map((event) => (
                          <span 
                            key={event} 
                            className="inline-flex items-center rounded-full bg-secondary px-2 py-1 text-xs"
                          >
                            {event}
                          </span>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className={`h-2 w-2 rounded-full ${webhook.active ? 'bg-green-500' : 'bg-red-500'}`}></div>
                        {webhook.active ? 'Active' : 'Inactive'}
                      </div>
                    </TableCell>
                    <TableCell>
                      {webhook.lastDelivery ? (
                        <div>
                          <div>{webhook.lastDelivery.toLocaleDateString()}</div>
                          <div className="text-xs text-muted-foreground">
                            {webhook.lastDeliveryStatus === 'success' ? (
                              <span className="text-green-600">Success</span>
                            ) : (
                              <span className="text-red-600">Failed</span>
                            )}
                          </div>
                        </div>
                      ) : (
                        "Never"
                      )}
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => toggleWebhook(webhook.id, !webhook.active)}
                      >
                        {webhook.active ? 'Disable' : 'Enable'}
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => testWebhook(webhook.id)}
                      >
                        Test
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => deleteWebhook(webhook.id)}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}