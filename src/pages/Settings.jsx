import { Settings as SettingsIcon, User, Bell, Shield, Paintbrush } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';

export default function Settings() {
  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <SettingsIcon className="w-6 h-6 text-primary" />
          System Settings
        </h1>
        <p className="text-sm text-muted-foreground">Manage your account, organization, and preferences</p>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-64 space-y-1">
          <button className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg bg-primary/10 text-primary">
            <User className="w-4 h-4" /> Profile
          </button>
          <button className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
            <Paintbrush className="w-4 h-4" /> Appearance
          </button>
          <button className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
            <Bell className="w-4 h-4" /> Notifications
          </button>
          <button className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
            <Shield className="w-4 h-4" /> Security
          </button>
        </div>

        <Card className="flex-1">
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">First Name</label>
                <input type="text" className="w-full border border-border rounded-lg p-2.5 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary" defaultValue="Sarah" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Last Name</label>
                <input type="text" className="w-full border border-border rounded-lg p-2.5 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary" defaultValue="Jenkins" />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Email Address</label>
              <input type="email" className="w-full border border-border rounded-lg p-2.5 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary" defaultValue="s.jenkins@iitr.ac.in" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Organization Role</label>
              <input type="text" className="w-full border border-border rounded-lg p-2.5 text-sm bg-muted/50 cursor-not-allowed" defaultValue="Senior Veterinarian / Researcher" disabled />
            </div>
            <div className="pt-4 flex justify-end">
              <button className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-2 px-4 rounded-lg transition-colors">
                Save Changes
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}