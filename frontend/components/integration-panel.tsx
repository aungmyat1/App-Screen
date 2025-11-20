"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Icons } from "@/components/icons";
import { toast } from "sonner";

export function IntegrationPanel() {
  const [slackWebhook, setSlackWebhook] = useState("");
  const [discordWebhook, setDiscordWebhook] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const saveIntegrations = async () => {
    setIsSaving(true);
    
    try {
      // In a real implementation, this would call an API to save the webhook URLs
      console.log("Saving integrations:", { slackWebhook, discordWebhook });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success("Integrations saved successfully!");
    } catch (error) {
      toast.error("Failed to save integrations");
      console.error("Integration save error:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const testSlackIntegration = async () => {
    try {
      // In a real implementation, this would send a test message to Slack
      console.log("Testing Slack integration");
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success("Test message sent to Slack!");
    } catch (error) {
      toast.error("Failed to send test message to Slack");
      console.error("Slack test error:", error);
    }
  };

  const testDiscordIntegration = async () => {
    try {
      // In a real implementation, this would send a test message to Discord
      console.log("Testing Discord integration");
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success("Test message sent to Discord!");
    } catch (error) {
      toast.error("Failed to send test message to Discord");
      console.error("Discord test error:", error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Integrations</CardTitle>
        <CardDescription>
          Connect with your favorite tools to get notified when screenshots are ready
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Icons.slack className="h-5 w-5 text-purple-500" />
              <Label htmlFor="slack-webhook">Slack Webhook URL</Label>
            </div>
            <div className="flex gap-2">
              <Input
                id="slack-webhook"
                value={slackWebhook}
                onChange={(e) => setSlackWebhook(e.target.value)}
                placeholder="https://hooks.slack.com/services/..."
              />
              <Button 
                variant="outline" 
                onClick={testSlackIntegration}
                disabled={!slackWebhook}
              >
                Test
              </Button>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Icons.discord className="h-5 w-5 text-indigo-500" />
              <Label htmlFor="discord-webhook">Discord Webhook URL</Label>
            </div>
            <div className="flex gap-2">
              <Input
                id="discord-webhook"
                value={discordWebhook}
                onChange={(e) => setDiscordWebhook(e.target.value)}
                placeholder="https://discord.com/api/webhooks/..."
              />
              <Button 
                variant="outline" 
                onClick={testDiscordIntegration}
                disabled={!discordWebhook}
              >
                Test
              </Button>
            </div>
          </div>
        </div>
        
        <div className="pt-4 border-t">
          <Button 
            onClick={saveIntegrations} 
            disabled={isSaving}
            className="w-full"
          >
            {isSaving ? (
              <>
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Integrations"
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}