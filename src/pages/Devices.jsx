import { useState, useMemo } from 'react';
import { 
  RadioTower, 
  Search, 
  MapPin, 
  Cpu, 
  Globe, 
  Navigation,
  Info
} from 'lucide-react';
import { cn } from '../utils/cn';
import { Card, CardContent } from '../components/ui/Card';
import { indiaMapData } from '../data/indiaMapData';

// 50 Devices (IDs 120-169) distributed across 15 states
const devicesData = [
  { id: 120, state: "Punjab" },
  { id: 121, state: "Punjab" },
  { id: 122, state: "Punjab" },
  { id: 123, state: "Haryana" },
  { id: 124, state: "Haryana" },
  { id: 125, state: "Rajasthan" },
  { id: 126, state: "Rajasthan" },
  { id: 127, state: "Rajasthan" },
  { id: 128, state: "Gujarat" },
  { id: 129, state: "Gujarat" },
  { id: 130, state: "Gujarat" },
  { id: 131, state: "Gujarat" },
  { id: 132, state: "Uttar Pradesh" },
  { id: 133, state: "Uttar Pradesh" },
  { id: 134, state: "Uttar Pradesh" },
  { id: 135, state: "Uttar Pradesh" },
  { id: 136, state: "Madhya Pradesh" },
  { id: 137, state: "Madhya Pradesh" },
  { id: 138, state: "Madhya Pradesh" },
  { id: 139, state: "Maharashtra" },
  { id: 140, state: "Maharashtra" },
  { id: 141, state: "Maharashtra" },
  { id: 142, state: "Maharashtra" },
  { id: 143, state: "Karnataka" },
  { id: 144, state: "Karnataka" },
  { id: 145, state: "Karnataka" },
  { id: 146, state: "Tamil Nadu" },
  { id: 147, state: "Tamil Nadu" },
  { id: 148, state: "Tamil Nadu" },
  { id: 149, state: "Tamil Nadu" },
  { id: 150, state: "Telangana" },
  { id: 151, state: "Telangana" },
  { id: 152, state: "Andhra Pradesh" },
  { id: 153, state: "Andhra Pradesh" },
  { id: 154, state: "Andhra Pradesh" },
  { id: 155, state: "Andhra Pradesh" },
  { id: 156, state: "Kerala" },
  { id: 157, state: "Kerala" },
  { id: 158, state: "Kerala" },
  { id: 159, state: "West Bengal" },
  { id: 160, state: "West Bengal" },
  { id: 161, state: "West Bengal" },
  { id: 162, state: "Odisha" },
  { id: 163, state: "Odisha" },
  { id: 164, state: "Odisha" },
  { id: 165, state: "Odisha" },
  { id: 166, state: "Assam" },
  { id: 167, state: "Assam" },
  { id: 168, state: "Assam" },
  { id: 169, state: "Assam" }
];

const stateCenters = {
  "Andaman and Nicobar Islands": { x: 521, y: 609 },
  "Andhra Pradesh": { x: 263, y: 500 },
  "Arunachal Pradesh": { x: 550, y: 224 },
  "Assam": { x: 516, y: 271 },
  "Bihar": { x: 369, y: 275 },
  "Chandigarh": { x: 180, y: 160 },
  "Chhattisgarh": { x: 296, y: 388 },
  "Daman and Diu": { x: 55, y: 391 },
  "Delhi": { x: 186, y: 210 },
  "Dadra and Nagar Haveli": { x: 102, y: 405 },
  "Goa": { x: 122, y: 512 },
  "Gujarat": { x: 66, y: 355 },
  "Himachal Pradesh": { x: 190, y: 133 },
  "Haryana": { x: 164, y: 194 },
  "Jharkhand": { x: 366, y: 327 },
  "Jammu and Kashmir": { x: 144, y: 88 },
  "Karnataka": { x: 170, y: 518 },
  "Kerala": { x: 166, y: 615 },
  "Ladakh": { x: 173, y: 60 },
  "Lakshadweep": { x: 99, y: 627 },
  "Maharashtra": { x: 179, y: 435 },
  "Meghalaya": { x: 485, y: 283 },
  "Manipur": { x: 537, y: 301 },
  "Madhya Pradesh": { x: 214, y: 319 },
  "Mizoram": { x: 516, y: 337 },
  "Nagaland": { x: 547, y: 270 },
  "Odisha": { x: 340, y: 405 },
  "Punjab": { x: 151, y: 152 },
  "Puducherry": { x: 268, y: 545 },
  "Rajasthan": { x: 119, y: 257 },
  "Sikkim": { x: 424, y: 235 },
  "Telangana": { x: 237, y: 457 },
  "Tamil Nadu": { x: 211, y: 609 },
  "Tripura": { x: 493, y: 325 },
  "Uttar Pradesh": { x: 265, y: 245 },
  "Uttarakhand": { x: 232, y: 176 },
  "West Bengal": { x: 412, y: 310 }
};

export default function Devices() {
  const [selectedState, setSelectedState] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Find unique states
  const totalLocations = useMemo(() => {
    const states = new Set(devicesData.map(d => d.state));
    return states.size;
  }, []);

  // Search logic to automatically select matching state
  const searchedState = useMemo(() => {
    if (!searchQuery) return null;
    const query = searchQuery.trim().toLowerCase();

    // Check exact state name match
    const exactState = Object.keys(stateCenters).find(state => 
      state.toLowerCase() === query
    );
    if (exactState) return exactState;

    // Check device ID match
    const matchingDevice = devicesData.find(d => 
      d.id.toString() === query
    );
    if (matchingDevice) return matchingDevice.state;

    // Check partial state name match
    const partialState = Object.keys(stateCenters).find(state => 
      state.toLowerCase().includes(query)
    );
    if (partialState) return partialState;

    return null;
  }, [searchQuery]);

  // Active state is derived from search match or selection
  const activeState = searchedState || selectedState;

  // Filter devices by selected/searched state
  const displayedDevices = useMemo(() => {
    if (!activeState) return devicesData;
    return devicesData.filter(d => d.state === activeState);
  }, [activeState]);

  // Compute zoom & translation transform based on selection/search
  const zoomTransform = useMemo(() => {
    if (!activeState || !stateCenters[activeState]) {
      return {
        transform: 'translate(0px, 0px) scale(1)',
        transformOrigin: 'center center',
        transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)'
      };
    }
    const center = stateCenters[activeState];
    const scale = 1.8;
    // Dimensions are 612 x 696 based on viewBox
    const tx = 306 - center.x * scale;
    const ty = 348 - center.y * scale;
    return {
      transform: `translate(${tx}px, ${ty}px) scale(${scale})`,
      transformOrigin: '0 0',
      transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)'
    };
  }, [activeState]);

  const handleStateClick = (stateName) => {
    setSearchQuery(''); // Clear search so clicking a state takes priority
    setSelectedState(stateName === selectedState ? null : stateName);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setSelectedState(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-foreground flex items-center gap-2">
          <RadioTower className="w-6 h-6 text-primary" />
          Livestock IoT Device Explorer
        </h1>
        <p className="text-sm text-muted-foreground">
          Geographic monitoring and asset mapping of deployed telemetric collar nodes across the subcontinent.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-card border-border shadow-sm">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Total Devices</p>
              <h3 className="text-2xl font-bold text-foreground mt-1">{devicesData.length}</h3>
            </div>
            <div className="p-2.5 bg-primary/10 rounded-lg text-primary">
              <Cpu className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border shadow-sm">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Total Locations</p>
              <h3 className="text-2xl font-bold text-foreground mt-1">{totalLocations} States</h3>
            </div>
            <div className="p-2.5 bg-primary/10 rounded-lg text-primary">
              <Globe className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        <Card className={cn(
          "bg-card border-border shadow-sm transition-colors duration-300",
          activeState ? "border-primary/30 bg-primary/5" : ""
        )}>
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Selected Location</p>
              <h3 className="text-xl font-bold text-foreground mt-1 truncate max-w-[200px]">
                {activeState || "All Locations"}
              </h3>
            </div>
            <div className={cn(
              "p-2.5 rounded-lg transition-colors",
              activeState ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
            )}>
              <MapPin className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Grid: Map & Side panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-auto lg:h-[680px]">
        {/* Map Explorer Area */}
        <Card className="lg:col-span-2 relative overflow-hidden bg-card border-border shadow-sm flex flex-col h-[400px] sm:h-[500px] lg:h-full">
          {/* Map Controls */}
          <div className="p-4 border-b border-border flex flex-col sm:flex-row gap-3 items-center justify-between bg-card z-10">
            <div className="relative w-full sm:max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search State or Device ID..."
                className="w-full bg-muted/50 border border-border rounded-full pl-9 pr-8 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button 
                  onClick={handleClearSearch}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-muted-foreground hover:text-foreground"
                >
                  Clear
                </button>
              )}
            </div>

            <div className="flex gap-2 items-center text-xs text-muted-foreground">
              <Navigation className="w-3.5 h-3.5" />
              <span>Click states or markers to zoom/explore</span>
              {activeState && (
                <button
                  onClick={handleClearSearch}
                  className="ml-2 px-2 py-1 bg-muted hover:bg-muted/80 rounded font-medium text-foreground transition-colors"
                >
                  Reset View
                </button>
              )}
            </div>
          </div>

          {/* Map Container */}
          <div className="flex-1 relative bg-gradient-to-br from-slate-50 to-slate-100 dark:from-zinc-950/20 dark:to-zinc-900/40 w-full h-full overflow-hidden flex items-center justify-center p-4 border border-border/50 rounded-lg">
            <div className="w-[90%] sm:w-[80%] h-[90%] sm:h-[80%] max-w-[580px] max-h-[660px] relative flex items-center justify-center">
              <svg 
                viewBox={indiaMapData.viewBox}
                className="w-full h-full object-contain drop-shadow-md select-none"
              >
                {/* SVG Transform group for Zoom & Translate */}
                <g style={zoomTransform}>
                  {/* Render State Paths translated from react-svgmap-india space to 0 0 612 696 */}
                  <g transform="translate(114, 50.4)">
                    {indiaMapData.locations.map((loc) => {
                      const isSelected = activeState === loc.name;
                      return (
                        <path
                          key={loc.id}
                          d={loc.path}
                          onClick={() => handleStateClick(loc.name)}
                          className={cn(
                            "transition-all duration-300 stroke-1 cursor-pointer focus:outline-none",
                            isSelected
                              ? "fill-primary/30 stroke-primary stroke-[1.5px]"
                              : "fill-slate-200/80 dark:fill-zinc-800/80 stroke-slate-400 dark:stroke-zinc-700 hover:fill-primary/15 dark:hover:fill-primary/20 hover:stroke-primary/50"
                          )}
                          title={loc.name}
                        />
                      );
                    })}
                  </g>

                  {/* Render Markers/Pins on state centers - filtered only to states with devices */}
                  {Object.entries(stateCenters)
                    .filter(([stateName]) => devicesData.some(d => d.state === stateName))
                    .map(([stateName, center]) => {
                      const isSelected = activeState === stateName;
                      const stateDevices = devicesData.filter(d => d.state === stateName);
                      
                      return (
                        <g 
                          key={stateName} 
                          transform={`translate(${center.x}, ${center.y})`}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleStateClick(stateName);
                          }}
                          className="cursor-pointer group"
                        >
                          {/* Pulse Ring with smooth scale-up hover */}
                          <circle 
                            r={isSelected ? 18 : 12} 
                            className={cn(
                              "fill-primary/20 transition-all duration-300 group-hover:scale-125",
                              isSelected ? "animate-pulse" : ""
                            )} 
                          />
                          {/* Outer Glow */}
                          <circle 
                            r={isSelected ? 8 : 6} 
                            className={cn(
                              "fill-primary transition-all duration-300 stroke-background group-hover:fill-primary/80 group-hover:scale-110",
                              isSelected ? "stroke-[2px]" : "stroke-1"
                            )} 
                          />
                          {/* Professional Hover Tooltip Overlay */}
                          <g 
                            transform="translate(0, -22)" 
                            className="pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-50"
                          >
                            <rect 
                              x="-70" 
                              y="-42" 
                              width="140" 
                              height="46" 
                              rx="6" 
                              className="fill-zinc-950/95 dark:fill-zinc-900/95 stroke-border/30 stroke shadow-xl"
                            />
                            <polygon 
                              points="-6,-4 6,-4 0,2" 
                              className="fill-zinc-950/95 dark:fill-zinc-900/95 stroke-border/30"
                            />
                            <text 
                              x="0" 
                              y="-28" 
                              textAnchor="middle" 
                              className="fill-zinc-50 font-bold text-[10px] tracking-wide"
                            >
                              {stateName}
                            </text>
                            <text 
                              x="0" 
                              y="-14" 
                              textAnchor="middle" 
                              className="fill-primary text-[8px] font-mono font-semibold"
                            >
                              Nodes: {stateDevices.map(d => d.id).join(', ')}
                            </text>
                          </g>
                        </g>
                      );
                    })}
                </g>
              </svg>
            </div>
          </div>
        </Card>

        {/* Side Panel: Device Details list */}
        <Card className="flex flex-col h-[350px] sm:h-[400px] lg:h-full overflow-hidden bg-card border-border shadow-sm">
          <div className="p-4 border-b border-border bg-muted/20 flex-shrink-0 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-foreground">
                {activeState ? `${activeState} Deployments` : "All Device Nodes"}
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Showing {displayedDevices.length} collar nodes
              </p>
            </div>
            {activeState && (
              <span className="text-[10px] font-bold uppercase tracking-wider bg-primary/10 text-primary px-2.5 py-1 rounded-full border border-primary/20">
                Filtered
              </span>
            )}
          </div>

          {/* List area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-none">
            {displayedDevices.length > 0 ? (
              displayedDevices.map((device) => {
                const isHighlighted = searchQuery && device.id.toString() === searchQuery.trim();
                
                return (
                  <div 
                    key={device.id} 
                    className={cn(
                      "flex items-center justify-between p-3.5 rounded-lg border transition-all duration-200",
                      isHighlighted 
                        ? "bg-primary/10 border-primary ring-2 ring-primary/20 scale-[1.02] shadow-sm"
                        : "bg-muted/30 dark:bg-muted/5 border-border hover:border-muted-foreground/30 hover:bg-muted/50"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "p-2 rounded-lg",
                        isHighlighted ? "bg-primary text-primary-foreground" : "bg-primary/10 text-primary"
                      )}>
                        <Cpu className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-mono text-sm font-bold text-foreground">
                          Node ID: #{device.id}
                        </div>
                        <div className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3 text-muted-foreground" />
                          <span>{device.state}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-12 text-muted-foreground flex flex-col items-center justify-center h-full gap-2">
                <Info className="w-8 h-8 text-muted" />
                <p className="text-sm font-medium">No matching devices found</p>
                <p className="text-xs max-w-[200px]">Try clearing your search query or choosing another state</p>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}