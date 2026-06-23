import { useParams, Link } from 'react-router-dom';
import { ChevronLeft, Edit3, ShieldAlert, Thermometer, BrainCircuit, Watch, Activity, BatteryFull, Radio, RefreshCw } from 'lucide-react';
import { cows, activityData } from '../data/mockData';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function CowProfile() {
  const { id } = useParams();
  const cow = cows.find(c => c.id === id) || cows[0];

  return (
    <div className="space-y-6">
      {/* Breadcrumb & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link to="/cows" className="hover:text-foreground flex items-center gap-1">
            <ChevronLeft className="w-4 h-4" />
            Herd Management
          </Link>
          <span>/</span>
          <span className="text-foreground font-semibold">{cow.name} ({cow.id})</span>
        </div>
        <div className="flex gap-2">
          <button className="bg-card border border-border hover:bg-muted text-foreground font-medium py-2 px-4 rounded-lg flex items-center gap-2 transition-colors">
            <RefreshCw className="w-4 h-4" />
            Full Logs
          </button>
          <button className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-2 px-4 rounded-lg flex items-center gap-2 transition-colors">
            <Edit3 className="w-4 h-4" />
            Update Metadata
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Identity */}
        <div className="space-y-6 lg:col-span-1">
          <Card className="overflow-hidden">
            <div className="h-48 relative bg-green-900/10">
              <img 
                src="https://images.unsplash.com/photo-1546445317-29f4545e9d53?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                alt="Cow" 
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider">
                TAG: {cow.id.replace('#', '')}
              </div>
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                <div className="text-white/80 text-xs font-bold uppercase tracking-wider mb-1">Genotype</div>
                <div className="text-white font-medium">{cow.breed} [Purebred]</div>
              </div>
            </div>
            
            <CardContent className="p-0">
              <div className="grid grid-cols-2 divide-x divide-y divide-border">
                <div className="p-4">
                  <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Age</div>
                  <div className="font-semibold text-foreground">{cow.age}</div>
                </div>
                <div className="p-4">
                  <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Weight</div>
                  <div className="font-semibold text-foreground">{cow.weight} kg</div>
                </div>
                <div className="p-4">
                  <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Lactation</div>
                  <div className="font-semibold text-foreground">Cycle {cow.lactationCycle}</div>
                </div>
                <div className="p-4">
                  <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Last Calving</div>
                  <div className="font-semibold text-foreground">{cow.lastCalving}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BrainCircuit className="w-5 h-5 text-primary" />
                AI Predictive Intelligence
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-muted-foreground font-semibold uppercase tracking-wider">Estrus Probability</span>
                    <span className="font-bold text-primary">{cow.estrusProbability}%</span>
                  </div>
                  <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                    <div className="bg-primary h-full rounded-full" style={{ width: `${cow.estrusProbability}%` }}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-muted-foreground font-semibold uppercase tracking-wider">Illness Risk</span>
                    <span className="font-bold text-red-500">{cow.illnessRisk}%</span>
                  </div>
                  <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                    <div className="bg-red-500 h-full rounded-full" style={{ width: `${cow.illnessRisk}%` }}></div>
                  </div>
                  {cow.illnessRisk > 10 && (
                     <div className="mt-2 text-xs text-red-600 bg-red-50 px-2 py-1.5 rounded flex items-start gap-1.5">
                       <Thermometer className="w-4 h-4 shrink-0" />
                       Rumen temp elevated (39.2°C).
                     </div>
                  )}
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-muted-foreground font-semibold uppercase tracking-wider">Anomaly Score</span>
                    <span className="font-bold text-yellow-600">{cow.anomalyScore}/10</span>
                  </div>
                  <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                    <div className="bg-yellow-500 h-full rounded-full" style={{ width: `${(cow.anomalyScore/10)*100}%` }}></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Health & Analytics */}
        <div className="space-y-6 lg:col-span-2">
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="flex flex-col items-center justify-center p-6 text-center">
              <div className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mb-2">Health Score</div>
              <div className="relative w-24 h-24 flex items-center justify-center mb-2">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="40" fill="transparent" stroke="#f1f5f9" strokeWidth="8" />
                  <circle 
                    cx="50" cy="50" r="40" fill="transparent" 
                    stroke={cow.healthScore >= 80 ? "#10b981" : cow.healthScore >= 50 ? "#eab308" : "#ef4444"} 
                    strokeWidth="8" 
                    strokeDasharray={`${2 * Math.PI * 40}`}
                    strokeDashoffset={`${2 * Math.PI * 40 * (1 - cow.healthScore/100)}`}
                    strokeLinecap="round"
                  />
                </svg>
                <span className="absolute text-3xl font-bold">{cow.healthScore}</span>
              </div>
            </Card>

            <Card className="p-6 flex flex-col justify-center">
              <div className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mb-2">Activity Score</div>
              <div className="text-3xl font-bold mb-2 flex items-baseline gap-1">
                {cow.activityScore} <span className="text-sm text-muted-foreground font-normal">/ 100</span>
              </div>
              <div className="w-full h-1.5 bg-muted rounded-full mb-3">
                <div className="bg-blue-500 h-full rounded-full" style={{ width: `${cow.activityScore}%` }}></div>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Daily activity is {cow.activityScore > 50 ? 'above' : 'below'} herd average.
              </p>
            </Card>

            <Card className="p-6 flex flex-col justify-center">
              <div className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-green-600" /> Current Risk
              </div>
              <div className="text-2xl font-bold text-green-700 mb-2">NEGLIGIBLE</div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                No active anomalies detected in last 48h cycle.
              </p>
            </Card>
          </div>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle>24-Hour Behavioral Analytics</CardTitle>
              <div className="flex gap-2">
                <span className="text-[10px] font-bold px-2 py-1 bg-primary/10 text-primary rounded">MOVEMENT</span>
                <span className="text-[10px] font-bold px-2 py-1 bg-muted text-muted-foreground rounded hover:bg-muted/80 cursor-pointer">FEEDING</span>
                <span className="text-[10px] font-bold px-2 py-1 bg-muted text-muted-foreground rounded hover:bg-muted/80 cursor-pointer">RESTING</span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={activityData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                    <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
                    <Tooltip cursor={{ fill: '#f1f5f9' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                    <Bar dataKey="movement" fill="#10b981" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Watch className="w-5 h-5 text-primary" />
                Linked IoT Hardware
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 border border-border rounded-xl p-4 flex items-center gap-4 bg-muted/20">
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                    <Watch className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div className="font-semibold text-foreground">Smart Collar Gen 4</div>
                      <div className="text-green-600 font-bold text-sm flex items-center gap-1"><BatteryFull className="w-4 h-4"/> {cow.battery}%</div>
                    </div>
                    <div className="text-xs text-muted-foreground font-mono">MAC: {cow.deviceMac}</div>
                  </div>
                </div>

                <div className="flex-1 border border-border rounded-xl p-4 bg-muted/20">
                  <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Telemetry Status</div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-foreground flex items-center gap-2"><Radio className="w-4 h-4 text-primary"/> Signal Strength</span>
                    <span className="text-sm font-semibold">-62 dBm</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-foreground flex items-center gap-2"><Activity className="w-4 h-4 text-primary"/> Last Sync</span>
                    <span className="text-sm font-semibold text-green-600">Just now</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}