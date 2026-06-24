import { useState, useMemo, useEffect } from 'react';
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
import { MapContainer, TileLayer, Marker, Circle, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// 50 Devices partitioned non-sequentially around Punjab and Western UP regions
const devicesData = [
  // Ropar, Punjab (8 nodes)
  { id: 120, state: "Ropar" },
  { id: 128, state: "Ropar" },
  { id: 136, state: "Ropar" },
  { id: 144, state: "Ropar" },
  { id: 152, state: "Ropar" },
  { id: 160, state: "Ropar" },
  { id: 166, state: "Ropar" },
  { id: 169, state: "Ropar" },

  // Mohali, Punjab (7 nodes)
  { id: 121, state: "Mohali" },
  { id: 129, state: "Mohali" },
  { id: 137, state: "Mohali" },
  { id: 145, state: "Mohali" },
  { id: 153, state: "Mohali" },
  { id: 161, state: "Mohali" },
  { id: 167, state: "Mohali" },

  // Ludhiana, Punjab (7 nodes)
  { id: 122, state: "Ludhiana" },
  { id: 130, state: "Ludhiana" },
  { id: 138, state: "Ludhiana" },
  { id: 146, state: "Ludhiana" },
  { id: 154, state: "Ludhiana" },
  { id: 162, state: "Ludhiana" },
  { id: 168, state: "Ludhiana" },

  // Patiala, Punjab (6 nodes)
  { id: 123, state: "Patiala" },
  { id: 131, state: "Patiala" },
  { id: 139, state: "Patiala" },
  { id: 147, state: "Patiala" },
  { id: 155, state: "Patiala" },
  { id: 163, state: "Patiala" },

  // Jalandhar, Punjab (5 nodes)
  { id: 124, state: "Jalandhar" },
  { id: 132, state: "Jalandhar" },
  { id: 140, state: "Jalandhar" },
  { id: 148, state: "Jalandhar" },
  { id: 156, state: "Jalandhar" },

  // Amritsar, Punjab (5 nodes)
  { id: 125, state: "Amritsar" },
  { id: 133, state: "Amritsar" },
  { id: 141, state: "Amritsar" },
  { id: 149, state: "Amritsar" },
  { id: 157, state: "Amritsar" },

  // Bathinda, Punjab (4 nodes)
  { id: 126, state: "Bathinda" },
  { id: 134, state: "Bathinda" },
  { id: 142, state: "Bathinda" },
  { id: 150, state: "Bathinda" },

  // Saharanpur, Uttar Pradesh (3 nodes)
  { id: 127, state: "Saharanpur" },
  { id: 143, state: "Saharanpur" },
  { id: 158, state: "Saharanpur" },

  // Meerut, Uttar Pradesh (3 nodes)
  { id: 135, state: "Meerut" },
  { id: 151, state: "Meerut" },
  { id: 159, state: "Meerut" },

  // Noida, Uttar Pradesh (2 nodes)
  { id: 164, state: "Noida" },
  { id: 165, state: "Noida" }
];

// Geographic coordinates for the 10 pilot regions
const regionCoordinates = {
  "Ropar": [30.97, 76.53],
  "Mohali": [30.68, 76.72],
  "Ludhiana": [30.90, 75.86],
  "Patiala": [30.34, 76.39],
  "Jalandhar": [31.33, 75.58],
  "Amritsar": [31.63, 74.87],
  "Bathinda": [30.21, 74.95],
  "Saharanpur": [29.97, 77.55],
  "Meerut": [28.98, 77.71],
  "Noida": [28.54, 77.39]
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

// Map View Controller to center and zoom programmatically
function MapViewController({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center, zoom, { animate: true, duration: 1.0 });
    }
  }, [center, zoom, map]);
  return null;
}

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
    const exactState = Object.keys(regionCoordinates).find(state => 
      state.toLowerCase() === query
    );
    if (exactState) return exactState;

    // Check device ID match
    const matchingDevice = devicesData.find(d => 
      d.id.toString() === query
    );
    if (matchingDevice) return matchingDevice.state;

    // Check partial name match
    const partialState = Object.keys(regionCoordinates).find(state => 
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

  // Compute map center and zoom level dynamically
  const mapConfig = useMemo(() => {
    if (!activeState) {
      return { center: [30.2, 76.1], zoom: 7 };
    }
    if (regionCoordinates[activeState]) {
      return { center: regionCoordinates[activeState], zoom: 10 };
    }
    if (activeState === "Punjab") {
      return { center: [31.0, 75.8], zoom: 8 };
    }
    if (activeState === "Uttar Pradesh") {
      return { center: [29.3, 77.5], zoom: 9 };
    }
    return { center: [30.2, 76.1], zoom: 7 };
  }, [activeState]);

  const handleStateClick = (stateName) => {
    setSearchQuery(''); // Clear search so clicking a state takes priority
    setSelectedState(stateName === selectedState ? null : stateName);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setSelectedState(null);
  };

  // Custom marker generator with leaflet divIcon
  const createClusterIcon = (regionName, count) => {
    const isSelected = activeState === regionName;
    const isUP = regionToState[regionName] === "Uttar Pradesh";
    const colorClass = isUP
      ? (isSelected ? 'bg-amber-500 ring-4 ring-amber-500/30' : 'bg-amber-600')
      : (isSelected ? 'bg-emerald-500 ring-4 ring-emerald-500/30' : 'bg-emerald-600');

    return L.divIcon({
      html: `<div class="flex items-center justify-center w-8 h-8 rounded-full text-white font-bold text-sm shadow-md border border-white ${colorClass} transition-all duration-300 transform ${isSelected ? 'scale-110' : ''}">
               ${count}
             </div>`,
      className: 'custom-leaflet-icon-container',
      iconSize: [32, 32],
      iconAnchor: [16, 16]
    });
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
        <Card className="lg:col-span-2 relative overflow-hidden bg-card border-border shadow-sm flex flex-col h-[480px] sm:h-[580px] lg:h-full">
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
          <div className="flex-1 relative w-full h-full overflow-hidden border border-border/50 rounded-lg">
            <MapContainer
              center={mapConfig.center}
              zoom={mapConfig.zoom}
              scrollWheelZoom={true}
              className="w-full h-full z-0"
            >
              <MapViewController center={mapConfig.center} zoom={mapConfig.zoom} />
              
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              {/* Render Leaflet Markers for the 10 pilot regions */}
              {Object.entries(regionCoordinates).map(([regionName, coords]) => {
                const isSelected = activeState === regionName;
                const regionDevices = devicesData.filter(d => d.state === regionName);
                const isUP = regionToState[regionName] === "Uttar Pradesh";

                return (
                  <div key={regionName}>
                    <Marker
                      position={coords}
                      icon={createClusterIcon(regionName, regionDevices.length)}
                      eventHandlers={{
                        click: () => handleStateClick(regionName)
                      }}
                    />

                    {/* Dotted highlight ring around selected region marker */}
                    {isSelected && (
                      <Circle
                        center={coords}
                        radius={6000} // 6km highlighted boundary ring
                        pathOptions={{
                          color: isUP ? '#d97706' : '#059669',
                          fillColor: isUP ? '#fbbf24' : '#34d399',
                          fillOpacity: 0.15,
                          weight: 2,
                          dashArray: '5, 5'
                        }}
                      />
                    )}
                  </div>
                );
              })}
            </MapContainer>

            {/* Map Legend Overlay */}
            <div className="absolute bottom-4 left-4 z-[1000] bg-background/90 backdrop-blur-sm border border-border p-3 rounded-lg shadow-md text-[10px] space-y-1.5 pointer-events-auto select-none">
              <div className="font-semibold text-foreground">Deployment Legend</div>
              <div className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 rounded-full bg-emerald-600 border border-white inline-block"></span>
                <span className="text-muted-foreground font-medium">Punjab Deployment</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 rounded-full bg-amber-600 border border-white inline-block"></span>
                <span className="text-muted-foreground font-medium">Uttar Pradesh Deployment</span>
              </div>
            </div>
          </div>

          {/* Compact Region Summary grid below map */}
          <div className="p-4 border-t border-border bg-muted/10 grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs flex-shrink-0">
            {Object.keys(regionCoordinates).map((region) => {
              const count = devicesData.filter(d => d.state === region).length;
              const isRegionActive = activeState === region;
              return (
                <div 
                  key={region} 
                  onClick={() => handleStateClick(region)}
                  className={cn(
                    "flex items-center justify-between p-2 rounded border cursor-pointer transition-all hover:bg-muted/50 select-none",
                    isRegionActive 
                      ? "border-primary bg-primary/5 text-primary font-semibold shadow-sm"
                      : "border-border text-muted-foreground hover:text-foreground"
                  )}
                >
                  <span>{region}</span>
                  <span className="font-mono bg-muted dark:bg-zinc-800 px-1.5 py-0.5 rounded text-[10px] text-foreground font-semibold">
                    {count} Dev
                  </span>
                </div>
              );
            })}
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
                          Node {device.id}
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