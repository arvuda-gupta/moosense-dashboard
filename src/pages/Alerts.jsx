import { BellRing, ShieldAlert, Thermometer, BatteryLow } from 'lucide-react';
import { alerts } from '../data/mockData';
import { cn } from '../utils/cn';

export default function Alerts() {
  const getIcon = (type) => {
    switch(type) {
      case 'Health': return <Thermometer className="w-5 h-5 text-red-500" />;
      case 'Device': return <BatteryLow className="w-5 h-5 text-orange-500" />;
      case 'Behavior': return <ShieldAlert className="w-5 h-5 text-yellow-500" />;
      default: return <BellRing className="w-5 h-5 text-blue-500" />;
    }
  };

  const getSeverityStyle = (severity) => {
    switch(severity) {
      case 'Critical': return 'bg-red-50 text-red-700 border-red-200';
      case 'High': return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'Medium': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      default: return 'bg-blue-50 text-blue-700 border-blue-200';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <BellRing className="w-6 h-6 text-primary" />
          Alert Center
        </h1>
        <p className="text-sm text-muted-foreground">Actionable intelligence and critical notifications</p>
      </div>

      <div className="bg-card rounded-xl border border-border shadow-sm divide-y divide-border">
        {alerts.map((alert) => (
          <div key={alert.id} className="p-4 sm:p-6 flex items-start gap-4 hover:bg-muted/30 transition-colors">
            <div className="p-3 bg-muted rounded-full">
              {getIcon(alert.type)}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1">
                <span className="font-semibold text-foreground">{alert.type} Alert</span>
                <span className={cn("px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border", getSeverityStyle(alert.severity))}>
                  {alert.severity}
                </span>
              </div>
              <p className="text-sm text-muted-foreground mb-2">{alert.message}</p>
              <div className="text-xs text-muted-foreground font-medium">{alert.time}</div>
            </div>
            <button className="text-sm font-medium text-primary hover:text-primary/80">
              Acknowledge
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}