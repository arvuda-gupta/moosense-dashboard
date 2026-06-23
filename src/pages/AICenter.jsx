import { BrainCircuit, Sparkles, Activity, Eye, ShieldAlert, Cpu } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';

export default function AICenter() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <BrainCircuit className="w-6 h-6 text-indigo-500" />
            AI Intelligence Center
          </h1>
          <p className="text-sm text-muted-foreground">Edge ML models and predictive livestock intelligence</p>
        </div>
        <div className="flex items-center gap-2 text-sm font-semibold bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-full border border-indigo-100">
          <Sparkles className="w-4 h-4" />
          TinyML Models Active
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

        {/* Health Risk Prediction */}
        <Card className="border-indigo-100 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-bl-full -z-10"></div>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-indigo-900">
              <Activity className="w-5 h-5 text-indigo-500" />
              Health Risk Prediction
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-end">
              <div>
                <div className="text-3xl font-bold text-foreground">94.2%</div>
                <div className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Model Confidence</div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-green-600">Low Risk</div>
                <div className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Current State</div>
              </div>
            </div>
            <div className="p-3 bg-muted/50 rounded-lg border border-border text-xs text-muted-foreground leading-relaxed">
              <strong>Explanation:</strong> Accelerometer variance within normal physiological bounds. Rumination cycles match historical healthy baseline.
            </div>
          </CardContent>
        </Card>

        {/* Estrus Prediction */}
        <Card className="border-pink-100 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-pink-500/5 rounded-bl-full -z-10"></div>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-pink-900">
              <Eye className="w-5 h-5 text-pink-500" />
              Estrus Prediction
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-end">
              <div>
                <div className="text-3xl font-bold text-foreground">98.1%</div>
                <div className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Model Confidence</div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-pink-600">3 Detections</div>
                <div className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Last 24h</div>
              </div>
            </div>
            <div className="p-3 bg-pink-50 rounded-lg border border-pink-100 text-xs text-pink-900 leading-relaxed">
              <strong>Insights:</strong> Cows #BS-2041, #BS-2102 exhibiting hyper-activity patterns consistent with estrus onset.
            </div>
          </CardContent>
        </Card>

        {/* Anomaly Detection */}
        <Card className="border-orange-100 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 rounded-bl-full -z-10"></div>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-900">
              <ShieldAlert className="w-5 h-5 text-orange-500" />
              Anomaly Detection
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-end">
              <div>
                <div className="text-3xl font-bold text-foreground">2</div>
                <div className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Active Anomalies</div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-orange-600">Isolation Forest</div>
                <div className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Model Used</div>
              </div>
            </div>
            <div className="p-3 bg-orange-50 rounded-lg border border-orange-100 text-xs text-orange-900 leading-relaxed">
              <strong>Alert:</strong> Sub-herd in Barn A exhibiting synchronized decreased resting time. Potential environmental stressor.
            </div>
          </CardContent>
        </Card>

        {/* Edge AI Performance */}
        <Card className="md:col-span-2 lg:col-span-3 border-slate-200">
          <CardHeader className="border-b border-border bg-slate-50/50">
            <CardTitle className="flex items-center gap-2">
              <Cpu className="w-5 h-5 text-slate-600" />
              On-Device Inference Metrics
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-border">
              <div className="p-6 text-center">
                <div className="text-3xl font-bold text-foreground mb-1">12 ms</div>
                <div className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Avg Inference Time</div>
              </div>
              <div className="p-6 text-center">
                <div className="text-3xl font-bold text-foreground mb-1">&lt; 100 KB</div>
                <div className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Model Payload Size</div>
              </div>
              <div className="p-6 text-center">
                <div className="text-3xl font-bold text-foreground mb-1">99.2%</div>
                <div className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Classification Acc.</div>
              </div>
              <div className="p-6 text-center">
                <div className="text-3xl font-bold text-green-600 mb-1">98%</div>
                <div className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Data Compression Ratio</div>
              </div>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}