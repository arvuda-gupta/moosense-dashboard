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

// 50 Devices (IDs 120-169) partitioned around Ropar and nearby pilot agricultural regions
const devicesData = [
  // Ropar (Rupnagar), Punjab (8 nodes)
  { id: 120, state: "Ropar (Rupnagar)" },
  { id: 121, state: "Ropar (Rupnagar)" },
  { id: 122, state: "Ropar (Rupnagar)" },
  { id: 123, state: "Ropar (Rupnagar)" },
  { id: 124, state: "Ropar (Rupnagar)" },
  { id: 125, state: "Ropar (Rupnagar)" },
  { id: 126, state: "Ropar (Rupnagar)" },
  { id: 127, state: "Ropar (Rupnagar)" },

  // Mohali, Punjab (6 nodes)
  { id: 128, state: "Mohali" },
  { id: 129, state: "Mohali" },
  { id: 130, state: "Mohali" },
  { id: 131, state: "Mohali" },
  { id: 132, state: "Mohali" },
  { id: 133, state: "Mohali" },

  // Patiala, Punjab (6 nodes)
  { id: 134, state: "Patiala" },
  { id: 135, state: "Patiala" },
  { id: 136, state: "Patiala" },
  { id: 137, state: "Patiala" },
  { id: 138, state: "Patiala" },
  { id: 139, state: "Patiala" },

  // Ludhiana, Punjab (6 nodes)
  { id: 140, state: "Ludhiana" },
  { id: 141, state: "Ludhiana" },
  { id: 142, state: "Ludhiana" },
  { id: 143, state: "Ludhiana" },
  { id: 144, state: "Ludhiana" },
  { id: 145, state: "Ludhiana" },

  // Jalandhar, Punjab (4 nodes)
  { id: 146, state: "Jalandhar" },
  { id: 147, state: "Jalandhar" },
  { id: 148, state: "Jalandhar" },
  { id: 149, state: "Jalandhar" },

  // Amritsar, Punjab (3 nodes)
  { id: 150, state: "Amritsar" },
  { id: 151, state: "Amritsar" },
  { id: 152, state: "Amritsar" },

  // Bathinda, Punjab (3 nodes)
  { id: 153, state: "Bathinda" },
  { id: 154, state: "Bathinda" },
  { id: 155, state: "Bathinda" },

  // Saharanpur, Uttar Pradesh (1 node)
  { id: 156, state: "Saharanpur" },

  // Meerut, Uttar Pradesh (1 node)
  { id: 157, state: "Meerut" },

  // Noida, Uttar Pradesh (1 node)
  { id: 158, state: "Noida" },

  // Ambala, Haryana (3 nodes)
  { id: 159, state: "Ambala" },
  { id: 160, state: "Ambala" },
  { id: 161, state: "Ambala" },

  // Kurukshetra, Haryana (3 nodes)
  { id: 162, state: "Kurukshetra" },
  { id: 163, state: "Kurukshetra" },
  { id: 164, state: "Kurukshetra" },

  // Una, Himachal Pradesh (3 nodes)
  { id: 165, state: "Una" },
  { id: 166, state: "Una" },
  { id: 167, state: "Una" },

  // Solan, Himachal Pradesh (2 nodes)
  { id: 168, state: "Solan" },
  { id: 169, state: "Solan" }
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
  "Ropar (Rupnagar)": { x: 162, y: 142 },
  "Mohali": { x: 166, y: 149 },
  "Patiala": { x: 160, y: 156 },
  "Ludhiana": { x: 153, y: 147 },
  "Jalandhar": { x: 148, y: 141 },
  "Amritsar": { x: 140, y: 137 },
  "Bathinda": { x: 142, y: 158 },
  "Saharanpur": { x: 181, y: 166 },
  "Meerut": { x: 188, y: 185 },
  "Noida": { x: 186, y: 202 },
  "Ambala": { x: 172, y: 154 },
  "Kurukshetra": { x: 174, y: 163 },
  "Una": { x: 164, y: 134 },
  "Solan": { x: 171, y: 142 }
};

const regionToState = {
  "Ropar (Rupnagar)": "Punjab",
  "Mohali": "Punjab",
  "Patiala": "Punjab",
  "Ludhiana": "Punjab",
  "Jalandhar": "Punjab",
  "Amritsar": "Punjab",
  "Bathinda": "Punjab",
  "Saharanpur": "Uttar Pradesh",
  "Meerut": "Uttar Pradesh",
  "Noida": "Uttar Pradesh",
  "Ambala": "Haryana",
  "Kurukshetra": "Haryana",
  "Una": "Himachal Pradesh",
  "Solan": "Himachal Pradesh"
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

  // Filter devices by selected/searched state - maps regions to states correctly
  const displayedDevices = useMemo(() => {
    if (!activeState) return devicesData;
    return devicesData.filter(d => 
      d.state === activeState || 
      regionToState[d.state] === activeState
    );
  }, [activeState]);

  // Compute zoom & translation transform based on selection/search
  const zoomTransform = useMemo(() => {
    // If no state/region is active, default to a focused, centered view on Punjab & surrounding areas
    if (!activeState) {
      const defaultCenter = { x: 162, y: 154 }; // Centroid of the pilot area
      const defaultScale = 3.2; // Zoomed in focus on Punjab/Haryana/HP/West UP
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
    const isState = ["Punjab", "Haryana", "Himachal Pradesh", "Uttar Pradesh"].includes(activeState);
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