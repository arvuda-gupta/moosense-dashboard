import { Activity, RadioTower, AlertCircle, Database, Layers, Percent } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { activityData } from '../data/mockData';
import { useState, useEffect } from 'react';
import { cn } from '../utils/cn';

// Custom Tooltip component for BarChart
const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card border border-border p-3 rounded-lg shadow-md text-sm font-semibold">
        <p className="text-foreground">Activity: {payload[0].payload.activity}</p>
        <p className="text-primary font-bold">Count: {payload[0].payload.count}</p>
      </div>
    );
  }
  return null;
};

export default function Dashboard() {
  const [activities, setActivities] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  
  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        "/api/telemetry.json"
      );
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      const data = await response.json();
      if (Array.isArray(data) && data.length > 0) {
        setActivities(data);
        setHasError(false);
      } else {
        throw new Error("Invalid or empty data returned");
      }
    } catch (error) {
      console.error("ERROR fetching dashboard live activities:", error);
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchData();
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const activeNodes = new Set(activities.map(item => Number(item.NodeId)).filter(id => !isNaN(id) && id >= 120 && id <= 169));
  const activeDevices = activeNodes.size;
  const totalDevicesCount = 50;
  
  const activityCounts = {};
  activities.forEach((item) => {
    const label = item.ActivityLabel;
    if (label) {
      if (!activityCounts[label]) {
        activityCounts[label] = 0;
      }
      activityCounts[label]++;
    }
  });

  const activityTypes = new Set(activities.map(item => item.ActivityLabel).filter(Boolean)).size;

  const chartData = Object.keys(activityCounts).map((label) => ({
    activity: label,
    count: activityCounts[label],
  }));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">System Overview</h1>
          <div className="mt-2 flex flex-wrap gap-2 items-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-100 border border-green-300">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-semibold text-green-700">
                Live Telemetry Events: {activities.length}
              </span>
            </div>
            {hasError && (
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-xs font-semibold shadow-sm">
                <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                <span>Unable to refresh live data. Showing last available telemetry.</span>
              </div>
            )}
          </div>
          <p className="text-sm text-muted-foreground mt-1.5">Real-time gateway-less telemetry streams</p>
        </div>
        <button 
          onClick={fetchData}
          disabled={isLoading}
          className="bg-primary hover:bg-primary/90 disabled:opacity-50 text-primary-foreground font-medium py-2 px-4 rounded-lg flex items-center gap-2 transition-colors shadow-sm"
        >
          <Activity className={cn("w-4 h-4", isLoading && "animate-spin")} />
          {isLoading ? "Updating..." : "Monitor Live"}
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Telemetry Events</div>
              <div className="p-2 bg-primary/10 rounded-lg text-primary">
                <Database className="w-5 h-5" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold">{activities.length}</span>
              <span className="text-xs text-muted-foreground">Total telemetry rows from API</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Active Devices</div>
              <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                <RadioTower className="w-5 h-5" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold">{activeDevices}</span>
              <span className="text-xs text-muted-foreground">Unique NodeIds</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Activity Types</div>
              <div className="p-2 bg-amber-100 rounded-lg text-amber-600">
                <Layers className="w-5 h-5" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-amber-600">{activityTypes}</span>
              <span className="text-xs text-muted-foreground">Unique ActivityLabels</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-green-200 shadow-sm relative overflow-hidden">
          <div className="absolute inset-x-0 bottom-0 h-1 bg-green-500"></div>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Reporting Devices</div>
              <div className="p-2 bg-green-50 rounded-lg text-green-600">
                <Percent className="w-5 h-5" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-green-700 font-mono">{activeDevices} / {totalDevicesCount}</span>
              <span className="text-xs text-muted-foreground">({((activeDevices / totalDevicesCount) * 100).toFixed(1)}% active ratio)</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Herd Activity Profile (24h)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={activityData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorMovement" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorResting" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                  <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
                  <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  <Area type="monotone" dataKey="movement" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorMovement)" />
                  <Area type="monotone" dataKey="resting" stroke="#6366f1" strokeWidth={2} fillOpacity={1} fill="url(#colorResting)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Live Activity Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                  <XAxis dataKey="activity" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f3f4f6' }} />
                  <Bar dataKey="count" fill="#34d399" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}