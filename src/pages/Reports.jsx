import { FileText, Download, Share2, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';

export default function Reports() {
  const reports = [
    { title: 'Daily Health Summary', desc: 'Aggregated health scores and critical alerts for the last 24h.', freq: 'Daily' },
    { title: 'Weekly Activity Trends', desc: 'Behavioral classification distribution across the herd.', freq: 'Weekly' },
    { title: 'Estrus Detection Log', desc: 'Predicted estrus events and confidence metrics.', freq: 'Weekly' },
    { title: 'Device Telemetry Audit', desc: 'Battery levels, signal strength, and hardware diagnostics.', freq: 'Monthly' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <FileText className="w-6 h-6 text-primary" />
          Report Generation Center
        </h1>
        <p className="text-sm text-muted-foreground">Automated compliance and research documentation</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {reports.map((r, i) => (
          <Card key={i} className="group hover:border-primary/50 transition-colors">
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">{r.title}</CardTitle>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-muted text-muted-foreground px-2 py-1 rounded">
                  {r.freq}
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-6">{r.desc}</p>
              <div className="flex gap-2">
                <button className="flex-1 bg-primary/10 hover:bg-primary/20 text-primary font-medium py-2 px-3 rounded-lg flex items-center justify-center gap-2 transition-colors text-sm">
                  <Download className="w-4 h-4" />
                  PDF
                </button>
                <button className="flex-1 bg-muted hover:bg-muted/80 text-foreground font-medium py-2 px-3 rounded-lg flex items-center justify-center gap-2 transition-colors text-sm">
                  <Download className="w-4 h-4" />
                  CSV
                </button>
                <button className="p-2 border border-border hover:bg-muted text-muted-foreground rounded-lg transition-colors">
                  <Share2 className="w-4 h-4" />
                </button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}