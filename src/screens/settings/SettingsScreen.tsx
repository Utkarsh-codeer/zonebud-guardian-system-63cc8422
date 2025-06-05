
import React, { useState } from 'react';
import Navigation from '../../components/layout/Navigation';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Switch } from '../../components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Slider } from '../../components/ui/slider';
import { useTheme } from '../../contexts/ThemeContext';
import { useToast } from '../../components/ui/use-toast';

const SettingsScreen: React.FC = () => {
  const { theme, setTheme, toggleTheme } = useTheme();
  const { toast } = useToast();
  const [trackingInterval, setTrackingInterval] = useState(15);
  const [notificationSettings, setNotificationSettings] = useState({
    hazardAlerts: true,
    zoneEntryExit: true,
    documentUpdates: true,
    broadcastMessages: true,
  });
  const [language, setLanguage] = useState('en-GB');
  const [autoLogout, setAutoLogout] = useState(30);
  const [fontScale, setFontScale] = useState(100);

  const handleToggleSetting = (setting: string) => {
    setNotificationSettings(prev => ({
      ...prev,
      [setting]: !prev[setting as keyof typeof prev],
    }));
  };

  const handleSaveSettings = () => {
    toast({
      title: "Settings Saved",
      description: "Your preferences have been updated successfully.",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navigation />
      
      <main className="max-w-3xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Settings</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Customize your application preferences
          </p>
        </div>

        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Appearance</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Dark Mode</h3>
                  <p className="text-sm text-muted-foreground">
                    Toggle between light and dark themes
                  </p>
                </div>
                <Switch
                  checked={theme === 'dark'}
                  onCheckedChange={toggleTheme}
                />
              </div>

              <div>
                <h3 className="font-medium mb-2">Theme Selection</h3>
                <Select value={theme} onValueChange={setTheme}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose theme" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <h3 className="font-medium mb-2">Font Size</h3>
                <div className="flex items-center space-x-4">
                  <span className="text-sm">A</span>
                  <Slider
                    value={[fontScale]}
                    min={80}
                    max={120}
                    step={5}
                    onValueChange={values => setFontScale(values[0])}
                    className="flex-1"
                  />
                  <span className="text-lg">A</span>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Current scale: {fontScale}%
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Notifications</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Hazard Alerts</h3>
                  <p className="text-sm text-muted-foreground">
                    Receive alerts for new hazard reports
                  </p>
                </div>
                <Switch
                  checked={notificationSettings.hazardAlerts}
                  onCheckedChange={() => handleToggleSetting('hazardAlerts')}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Zone Entry/Exit</h3>
                  <p className="text-sm text-muted-foreground">
                    Notify when entering or exiting zones
                  </p>
                </div>
                <Switch
                  checked={notificationSettings.zoneEntryExit}
                  onCheckedChange={() => handleToggleSetting('zoneEntryExit')}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Document Updates</h3>
                  <p className="text-sm text-muted-foreground">
                    Get notified when documents are added or updated
                  </p>
                </div>
                <Switch
                  checked={notificationSettings.documentUpdates}
                  onCheckedChange={() => handleToggleSetting('documentUpdates')}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Broadcast Messages</h3>
                  <p className="text-sm text-muted-foreground">
                    Receive messages from zone managers
                  </p>
                </div>
                <Switch
                  checked={notificationSettings.broadcastMessages}
                  onCheckedChange={() => handleToggleSetting('broadcastMessages')}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Location Tracking</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-medium mb-2">Location Update Interval</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  How often your location is tracked while in a zone
                </p>
                <Select
                  value={trackingInterval.toString()}
                  onValueChange={(value) => setTrackingInterval(Number(value))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select interval" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">Every 5 minutes</SelectItem>
                    <SelectItem value="10">Every 10 minutes</SelectItem>
                    <SelectItem value="15">Every 15 minutes</SelectItem>
                    <SelectItem value="30">Every 30 minutes</SelectItem>
                    <SelectItem value="60">Every 60 minutes</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Button variant="outline" className="w-full">
                  Request Location Permissions
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Language & Region</CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                <h3 className="font-medium mb-2">Language</h3>
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en-GB">English (UK)</SelectItem>
                    <SelectItem value="en-US">English (US)</SelectItem>
                    <SelectItem value="fr-FR">French</SelectItem>
                    <SelectItem value="de-DE">German</SelectItem>
                    <SelectItem value="es-ES">Spanish</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Security</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-medium mb-2">Auto-Logout</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Automatically log out after period of inactivity
                </p>
                <Select
                  value={autoLogout.toString()}
                  onValueChange={(value) => setAutoLogout(Number(value))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select time" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15">15 minutes</SelectItem>
                    <SelectItem value="30">30 minutes</SelectItem>
                    <SelectItem value="60">1 hour</SelectItem>
                    <SelectItem value="120">2 hours</SelectItem>
                    <SelectItem value="0">Never</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Logout on Zone Exit</h3>
                  <p className="text-sm text-muted-foreground">
                    Automatically log out when leaving an active zone
                  </p>
                </div>
                <Switch defaultChecked={false} />
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end space-x-4">
            <Button variant="outline">Reset to Defaults</Button>
            <Button onClick={handleSaveSettings}>Save Settings</Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SettingsScreen;
