import { useState } from 'react';
import { Card, CardContent } from '../components/ui/Card';
import { cows } from '../data/mockData';
import { cn } from '../utils/cn';
import { MapPin, Info } from 'lucide-react';

export default function FarmMap() {
  const [selectedZone, setSelectedZone] = useState(null);

  const zones = [
    { id: 'Barn A', name: 'Barn A (Main)', x: 10, y: 10, w: 30, h: 40, color: 'bg-blue-100/50 border-blue-300' },
    { id: 'Barn B', name: 'Barn B (Maternity)', x: 10, y: 55, w: 30, h: 35, color: 'bg-purple-100/50 border-purple-300' },
    { id: 'Grazing Zone', name: 'Open Pasture', x: 45, y: 10, w: 50, h: 50, color: 'bg-green-100/50 border-green-300' },
    { id: 'Water Zone', name: 'Water Troughs', x: 45, y: 65, w: 20, h: 25, color: 'bg-cyan-100/50 border-cyan-300' },
    { id: 'Feeding Zone', name: 'Feeding Stations', x: 70, y: 65, w: 25, h: 25, color: 'bg-orange-100/50 border-orange-300' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Digital Twin Map</h1>
        <p className="text-sm text-muted-foreground">Live geospatial visualization of herd movement</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[700px]">
        {/* Map Area */}
        <Card className="lg:col-span-3 relative overflow-hidden bg-[#f8fafc] flex flex-col">
          <div className="p-4 border-b border-border flex justify-between items-center bg-card z-10">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
                <span className="w-2 h-2 rounded-full bg-green-500"></span> Healthy
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
                <span className="w-2 h-2 rounded-full bg-yellow-500"></span> Warning
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span> Critical
              </div>
            </div>
          </div>
          
          <div className="flex-1 relative w-full h-full p-4">
            <div className="absolute inset-4 border-2 border-dashed border-gray-200 rounded-xl">
              {zones.map(zone => (
                <div 
                  key={zone.id}
                  className={cn("absolute border-2 rounded-lg cursor-pointer transition-all", zone.color, selectedZone === zone.id ? "ring-2 ring-primary ring-offset-2" : "hover:bg-opacity-70")}
                  style={{ left: `${zone.x}%`, top: `${zone.y}%`, width: `${zone.w}%`, height: `${zone.h}%` }}
                  onClick={() => setSelectedZone(zone.id)}
                >
                  <div className="p-2 text-xs font-bold text-gray-700/70">{zone.name}</div>
                </div>
              ))}

              {/* Render cows as dots */}
              {cows.map(cow => {
                const zone = zones.find(z => z.id === cow.location) || zones[0];
                // Random position within zone
                // Note: we use consistent seeded pseudo-randomness or just CSS positioning based on ID length
                const seed = cow.id.charCodeAt(cow.id.length-1);
                const rx = zone.x + 2 + (seed % (zone.w - 4));
                const ry = zone.y + 2 + ((seed * 3) % (zone.h - 4));
                
                return (
                  <div
                    key={cow.id}
                    className={cn(
                      "absolute w-2 h-2 rounded-full shadow-sm transform -translate-x-1/2 -translate-y-1/2 transition-all cursor-pointer hover:scale-150 z-20",
                      cow.healthScore < 50 ? "bg-red-500 animate-pulse" : cow.healthScore < 70 ? "bg-yellow-500" : "bg-green-500",
                      selectedZone && cow.location !== selectedZone ? "opacity-20" : "opacity-100"
                    )}
                    style={{ left: `${rx}%`, top: `${ry}%` }}
                    title={`${cow.name} (${cow.id})`}
                  />
                );
              })}
            </div>
          </div>
        </Card>

        {/* Info Panel */}
        <div className="space-y-4 flex flex-col h-full overflow-hidden">
          <Card className="flex-shrink-0">
            <CardContent className="p-4">
              <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground flex items-center gap-2 mb-4">
                <MapPin className="w-4 h-4" /> Zone Intelligence
              </h3>
              {selectedZone ? (
                <div className="space-y-3">
                  <div className="text-xl font-bold">{selectedZone}</div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-muted p-2 rounded text-center">
                      <div className="text-2xl font-bold text-primary">{cows.filter(c => c.location === selectedZone).length}</div>
                      <div className="text-xs text-muted-foreground">Headcount</div>
                    </div>
                    <div className="bg-red-50 p-2 rounded text-center">
                      <div className="text-2xl font-bold text-red-600">{cows.filter(c => c.location === selectedZone && c.healthScore < 50).length}</div>
                      <div className="text-xs text-red-600/70">At Risk</div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-sm text-muted-foreground flex flex-col items-center justify-center py-6 text-center gap-2">
                  <Info className="w-8 h-8 text-muted" />
                  Select a zone on the map to view detailed analytics.
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card className="flex-1 overflow-hidden flex flex-col">
            <div className="p-4 border-b border-border bg-muted/30 flex-shrink-0">
              <h3 className="font-semibold text-sm">Zone Activity Stream</h3>
            </div>
            <div className="p-4 overflow-y-auto space-y-3">
              {cows.filter(c => !selectedZone || c.location === selectedZone).slice(0, 10).map(cow => (
                <div key={cow.id} className="flex items-center gap-3 border-b border-border pb-3 last:border-0 last:pb-0">
                  <div className={cn(
                    "w-2 h-2 rounded-full flex-shrink-0",
                    cow.healthScore < 50 ? "bg-red-500" : "bg-green-500"
                  )} />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-foreground truncate">{cow.id} {cow.name}</div>
                    <div className="text-xs text-muted-foreground truncate">{cow.status} • {cow.location}</div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}