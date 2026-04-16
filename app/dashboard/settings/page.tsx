'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Bell, Shield, User, Key, Globe } from 'lucide-react';
import { QuickActions } from '@/components/dashboard/quick-actions';

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    companyName: 'DemonForge',
    timezone: 'UTC-7',
    darkMode: true,
    emailNotifications: true,
    discordNotifications: false,
    slackNotifications: false,
    twoFactorEnabled: false,
  });

  const saveSettings = async (section: string) => {
    console.log(`Saving ${section} settings:`, settings);
    // API call would go here
  };

  const updatePassword = async () => {
    const currentPassword = (document.getElementById('current-password') as HTMLInputElement)?.value;
    const newPassword = (document.getElementById('new-password') as HTMLInputElement)?.value;
    
    if (!currentPassword || !newPassword) {
      alert('Please fill in all password fields');
      return;
    }

    console.log('Updating password');
    // API call would go here
  };

  const generateApiKey = async () => {
    console.log('Generating new API key');
    // API call would go here
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground mt-2">
          Configure your DemonForge Engine preferences
        </p>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="api">API</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>Basic configuration options</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="company-name">Company Name</Label>
                <Input 
                  id="company-name" 
                  value={settings.companyName}
                  onChange={(e) => setSettings({ ...settings, companyName: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="timezone">Timezone</Label>
                <Input 
                  id="timezone" 
                  value={settings.timezone}
                  onChange={(e) => setSettings({ ...settings, timezone: e.target.value })}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="dark-mode">Dark Mode</Label>
                  <p className="text-sm text-muted-foreground">Enable dark theme</p>
                </div>
                <Switch 
                  id="dark-mode" 
                  checked={settings.darkMode}
                  onCheckedChange={(checked) => setSettings({ ...settings, darkMode: checked })}
                />
              </div>
              <Button className="w-full" onClick={() => saveSettings('general')}>Save General Settings</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>Configure how you receive alerts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Bell className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <Label htmlFor="email-notif">Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive alerts via email</p>
                  </div>
                </div>
                <Switch 
                  id="email-notif" 
                  checked={settings.emailNotifications}
                  onCheckedChange={(checked) => setSettings({ ...settings, emailNotifications: checked })}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Bell className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <Label htmlFor="discord-notif">Discord Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive alerts via Discord webhook</p>
                  </div>
                </div>
                <Switch 
                  id="discord-notif" 
                  checked={settings.discordNotifications}
                  onCheckedChange={(checked) => setSettings({ ...settings, discordNotifications: checked })}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Bell className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <Label htmlFor="slack-notif">Slack Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive alerts via Slack webhook</p>
                  </div>
                </div>
                <Switch 
                  id="slack-notif" 
                  checked={settings.slackNotifications}
                  onCheckedChange={(checked) => setSettings({ ...settings, slackNotifications: checked })}
                />
              </div>
              <div className="space-y-2 pt-4">
                <Label htmlFor="webhook-url">Webhook URL</Label>
                <Input 
                  id="webhook-url" 
                  value="https://discord.com/api/webhooks/1494308253528621177/4BFwRz8RTkH9GIsK_U8qfWonrZzcvxzHXMbVpBzkXg_Zhiyuh_iJLHxsfUkLVOnJ0iuj" 
                  readOnly 
                  className="bg-muted"
                />
                <p className="text-xs text-muted-foreground">Discord webhook is pre-configured and cannot be changed</p>
              </div>
              <Button className="w-full" onClick={() => saveSettings('notifications')}>Save Notification Settings</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <QuickActions />
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>Manage your security preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Shield className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <Label htmlFor="2fa">Two-Factor Authentication</Label>
                    <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
                  </div>
                </div>
                <Switch 
                  id="2fa" 
                  checked={settings.twoFactorEnabled}
                  onCheckedChange={(checked) => setSettings({ ...settings, twoFactorEnabled: checked })}
                />
              </div>
              <div className="space-y-2 pt-4">
                <Label htmlFor="current-password">Current Password</Label>
                <Input id="current-password" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-password">New Password</Label>
                <Input id="new-password" type="password" />
              </div>
              <Button onClick={updatePassword}>Update Password</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="api" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>API Access</CardTitle>
              <CardDescription>Manage your API keys and integrations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="api-key">API Key</Label>
                <Input id="api-key" defaultValue="df_sk_1234567890abcdef" readOnly />
              </div>
              <Button variant="outline" onClick={generateApiKey}>
                <Key className="h-4 w-4 mr-2" />
                Generate New API Key
              </Button>
              <div className="pt-4">
                <Label>Active Integrations</Label>
                <div className="mt-2 space-y-2">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Globe className="h-5 w-5 text-muted-foreground" />
                      <span>Custom Webhook</span>
                    </div>
                    <Badge variant="default">Connected</Badge>
                  </div>
                </div>
              </div>
              <Button className="w-full" onClick={() => saveSettings('api')}>Save API Settings</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
