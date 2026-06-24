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

// 50 Devices (IDs 120-169) partitioned non-sequentially around Punjab and Western UP regions
const devicesData = [
  // Ropar, Punjab (6 nodes)
  { id: 120, state: "Ropar" },
  { id: 127, state: "Ropar" },
  { id: 135, state: "Ropar" },
  { id: 146, state: "Ropar" },
  { id: 153, state: "Ropar" },
  { id: 160, state: "Ropar" },

  // Mohali, Punjab (6 nodes)
  { id: 121, state: "Mohali" },
  { id: 128, state: "Mohali" },
  { id: 136, state: "Mohali" },
  { id: 147, state: "Mohali" },
  { id: 154, state: "Mohali" },
  { id: 161, state: "Mohali" },

  // Ludhiana, Punjab (6 nodes)
  { id: 122, state: "Ludhiana" },
  { id: 129, state: "Ludhiana" },
  { id: 137, state: "Ludhiana" },
  { id: 148, state: "Ludhiana" },
  { id: 155, state: "Ludhiana" },
  { id: 162, state: "Ludhiana" },

  // Patiala, Punjab (6 nodes)
  { id: 123, state: "Patiala" },
  { id: 130, state: "Patiala" },
  { id: 138, state: "Patiala" },
  { id: 149, state: "Patiala" },
  { id: 156, state: "Patiala" },
  { id: 163, state: "Patiala" },

  // Jalandhar, Punjab (6 nodes)
  { id: 124, state: "Jalandhar" },
  { id: 131, state: "Jalandhar" },
  { id: 139, state: "Jalandhar" },
  { id: 150, state: "Jalandhar" },
  { id: 157, state: "Jalandhar" },
  { id: 164, state: "Jalandhar" },

  // Amritsar, Punjab (6 nodes)
  { id: 125, state: "Amritsar" },
  { id: 132, state: "Amritsar" },
  { id: 140, state: "Amritsar" },
  { id: 151, state: "Amritsar" },
  { id: 158, state: "Amritsar" },
  { id: 165, state: "Amritsar" },

  // Bathinda, Punjab (6 nodes)
  { id: 126, state: "Bathinda" },
  { id: 133, state: "Bathinda" },
  { id: 141, state: "Bathinda" },
  { id: 152, state: "Bathinda" },
  { id: 159, state: "Bathinda" },
  { id: 166, state: "Bathinda" },

  // Saharanpur, Uttar Pradesh (3 nodes)
  { id: 134, state: "Saharanpur" },
  { id: 142, state: "Saharanpur" },
  { id: 167, state: "Saharanpur" },

  // Meerut, Uttar Pradesh (3 nodes)
  { id: 143, state: "Meerut" },
  { id: 144, state: "Meerut" },
  { id: 168, state: "Meerut" },

  // Noida, Uttar Pradesh (2 nodes)
  { id: 145, state: "Noida" },
  { id: 169, state: "Noida" }
];

const stateCenters = {
  // States centroids for broad queries
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
  "West Bengal": { x: 412, y: 310 },

  // Pilot deployment region centroids
  "Ropar": { x: 162, y: 142 },
  "Mohali": { x: 166, y: 149 },
  "Patiala": { x: 160, y: 156 },
  "Ludhiana": { x: 153, y: 147 },
  "Jalandhar": { x: 148, y: 141 },
  "Amritsar": { x: 140, y: 137 },
  "Bathinda": { x: 142, y: 158 },
  "Saharanpur": { x: 181, y: 166 },
  "Meerut": { x: 188, y: 185 },
  "Noida": { x: 186, y: 202 }
};

const regionToState = {
  "Ropar": "Punjab",
  "Mohali": "Punjab",
  "Patiala": "Punjab",
  "Ludhiana": "Punjab",
  "Jalandhar": "Punjab",
  "Amritsar": "Punjab",
  "Bathinda": "Punjab",
  "Saharanpur": "Uttar Pradesh",
  "Meerut": "Uttar Pradesh",
  "Noida": "Uttar Pradesh"
};

export default function Devices() {
  const [selectedState, setSelectedState] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Find unique regions count
  const totalRegions = useMemo(() => {
    const regions = new Set(devicesData.map(d => d.state));
    return regions.size;
  }, []);

  // Search logic to automatically select matching region/state
  const searchedState = useMemo(() => {
    if (!searchQuery) return null;
    const query = searchQuery.trim().toLowerCase();

    // Check exact region or state name match
    const exactState = Object.keys(stateCenters).find(state => 
      state.toLowerCase() === query
    );
    if (exactState) return exactState;

    // Check device ID match
    const matchingDevice = devicesData.find(d => 
      d.id.toString() === query
    );
    if (matchingDevice) return matchingDevice.state;

    // Check partial name match
    const partialState = Object.keys(stateCenters).find(state => 
      state.toLowerCase().includes(query)
    );
    if (partialState) return partialState;

    return null;
  }, [searchQuery]);

  // Active state/region is derived from search match or selection
  const activeState = searchedState || selectedState;

  // Filter devices by selected/searched state/region
  const displayedDevices = useMemo(() => {
    if (!activeState) return devicesData;
    return devicesData.filter(d => 
      d.state === activeState || 
      regionToState[d.state] === activeState
    );
  }, [activeState]);

  // Format the text for the Selected Location KPI card dynamically
  const selectedLocationText = useMemo(() => {
    if (!activeState) return "All Locations";
    if (regionToState[activeState]) {
      const parentState = regionToState[activeState];
      const stateAbbr = parentState === "Uttar Pradesh" ? "UP" : parentState;
      return `${activeState} (${stateAbbr})`;
    }
    return activeState;
  }, [activeState]);

  // Compute zoom & translation transform based on selection/search
  const zoomTransform = useMemo(() => {
    // If no state/region is active, default to a focused, centered view on Punjab & surrounding areas
    if (!activeState) {
      const defaultCenter = { x: 162, y: 154 }; // Centroid of the pilot area
      const defaultScale = 3.2; // Zoomed in focus on Punjab and Western UP
      const tx = 306 - defaultCenter.x * defaultScale;
      const ty = 348 - defaultCenter.y * defaultScale;
      return {
        transform: `translate(${tx}px, ${ty}px) scale(${defaultScale})`,
        transformOrigin: '0 0',
        transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)'
      };
    }

    const center = stateCenters[activeState];
    if (!center) {
      return {
        transform: 'translate(0px, 0px) scale(1)',
        transformOrigin: 'center center',
        transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)'
      };
    }
    
    // Zoom in closer for specific cities, moderate zoom for broad state selections
    const isState = ["Punjab", "Uttar Pradesh"].includes(activeState);
    const scale = isState ? 3.5 : 5.2;
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
          Geographic monitoring and asset mapping of deployed telemetric collar nodes across the pilot area.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-card border-border shadow-sm">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Total Devices</p>
              <h3 className="text-2xl font-bold text-foreground mt-1">{devicesData.length} Devices</h3>
            </div>
            <div className="p-2.5 bg-primary/10 rounded-lg text-primary">
              <Cpu className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border shadow-sm">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Total Regions</p>
              <h3 className="text-2xl font-bold text-foreground mt-1">{totalRegions} Regions</h3>
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
                {selectedLocationText}
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
                placeholder="Search Region or Device ID..."
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
              <span>Click regions or markers to zoom/explore</span>
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
                      const isSelected = activeState === loc.name || (activeState && regionToState[activeState] === loc.name);
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

                  {/* Render Markers/Pins on state centers - filtered only to states/regions with devices */}
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
                            r={isSelected ? 16 : 10} 
                            className={cn(
                              "fill-primary/20 transition-all duration-300 group-hover:scale-125",
                              isSelected ? "animate-pulse" : ""
                            )} 
                          />
                          {/* Outer Glow */}
                          <circle 
                            r={isSelected ? 10 : 7} 
                            className={cn(
                              "fill-primary transition-all duration-300 stroke-background group-hover:fill-primary/80 group-hover:scale-110",
                              isSelected ? "stroke-[2px]" : "stroke-1"
                            )} 
                          />
                          {/* Marker Count Text */}
                          <text
                            textAnchor="middle"
                            dominantBaseline="central"
                            className="fill-primary-foreground font-sans font-bold text-[6px] select-none pointer-events-none"
                          >
                            {stateDevices.length}
                          </text>

                          {/* Hover Tooltip Overlay */}
                          <g 
                            transform="translate(0, -20)" 
                            className="pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-50"
                          >
                            <rect 
                              x="-60" 
                              y="-36" 
                              width="120" 
                              height="38" 
                              rx="6" 
                              className="fill-zinc-950/95 dark:fill-zinc-900/95 stroke-border/30 stroke shadow-xl"
                            />
                            <polygon 
                              points="-5,-2 5,-2 0,3" 
                              className="fill-zinc-950/95 dark:fill-zinc-900/95 stroke-border/30"
                            />
                            <text 
                              x="0" 
                              y="-24" 
                              textAnchor="middle" 
                              className="fill-zinc-50 font-bold text-[9px] tracking-wide"
                            >
                              {stateName} ({regionToState[stateName] === "Uttar Pradesh" ? "UP" : regionToState[stateName]})
                            </text>
                            <text 
                              x="0" 
                              y="-12" 
                              textAnchor="middle" 
                              className="fill-primary text-[8px] font-mono font-semibold"
                            >
                              Devices: {stateDevices.length}
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
              <h3 className="font-bold text-foreground text-sm sm:text-base">
                {activeState ? `${activeState} Details` : "All Hub Deployments"}
              </h3>
              <p className="text-[10px] sm:text-xs text-muted-foreground mt-0.5">
                {activeState && regionToState[activeState]
                  ? `Region in ${regionToState[activeState]}`
                  : activeState
                  ? `State-level Overview`
                  : `Pilot Project Overview`}
              </p>
            </div>
            {activeState && (
              <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider bg-primary/10 text-primary px-2.5 py-1 rounded-full border border-primary/20">
                Active View
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