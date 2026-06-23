import { useState, useEffect } from "react";
import {
  Database,
  Cpu,
  Clock,
  Calendar,
  SlidersHorizontal,
  Filter,
  RefreshCw
} from "lucide-react";
import { Card, CardContent } from "../components/ui/Card";

export default function Cows() {
  // Dropdown list of unique Node IDs
  const [nodeIds, setNodeIds] = useState([]);

  // eslint-disable-next-line no-unused-vars
  const [rawRecords, setRawRecords] = useState([]);
  const [filteredRecords, setFilteredRecords] = useState([]);

  // Loading & Error states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Filter form inputs - Defaulting to empty strings to allow unselected date/time queries
  const [nodeId, setNodeId] = useState("All");
  const [startDate, setStartDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endDate, setEndDate] = useState("");
  const [endTime, setEndTime] = useState("");

  // Applied filters (saved for display in Summary Cards)
  const [appliedFilters, setAppliedFilters] = useState({
    nodeId: "All",
    startDate: "",
    startTime: "",
    endDate: "",
    endTime: ""
  });

  // Pagination states
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(100);

  // Dynamic Explorer Mode: 'device' or 'telemetry'
  const [explorerMode, setExplorerMode] = useState("device");

  // Fetch telemetry logs from API based on filters
  const fetchTelemetry = async (node = nodeId, startD = startDate, startT = startTime, endD = endDate, endT = endTime, forcedMode = null) => {
    setLoading(true);
    setError(null);
    try {
      const isFilteredQuery = forcedMode
        ? (forcedMode === "telemetry")
        : (node !== "All" || startD !== "" || startT !== "" || endD !== "" || endT !== "");
      
      const params = new URLSearchParams();
      if (isFilteredQuery) {
        if (node !== "All") {
          params.append("NodeId", node);
        }
        if (startD) params.append("startDate", startD);
        if (startT) params.append("startTime", startT);
        if (endD) params.append("endDate", endD);
        if (endT) params.append("endTime", endT);
      }

      const url = isFilteredQuery
        ? `https://4cjxotmvk3.execute-api.us-east-1.amazonaws.com/gatecow?${params.toString()}`
        : `https://4cjxotmvk3.execute-api.us-east-1.amazonaws.com/gatecow`;

      console.log("Fetching URL:", url);
      const res = await fetch(url);
      if (!res.ok) {
        throw new Error("API request failed with status: " + res.status);
      }
      const responseData = await res.json();

      const data = Array.isArray(responseData)
        ? responseData
        : JSON.parse(responseData.body || "[]");

      console.log("DATA LENGTH =", data.length);

      let processedData = data;
      if (!isFilteredQuery) {
        // Mode: Device Explorer (unfiltered initial page load)
        // Extract unique Node IDs dynamically from the API response
        const ids = data.map(item => item.NodeId).filter(Boolean);
        const uniqueIds = [...new Set(ids)].sort((a, b) => Number(a) - Number(b));
        
        // Populate the dropdown list dynamically (only on initial load or reset)
        setNodeIds(uniqueIds);
        
        // Map unique IDs to row format for display in the table
        processedData = uniqueIds.map(id => ({ NodeId: id }));
      }

      setRawRecords(processedData);
      setAppliedFilters({
        nodeId: node,
        startDate: startD,
        startTime: startT,
        endDate: endD,
        endTime: endT
      });

      if (isFilteredQuery) {
        // Apply client-side filters on returned dataset to guarantee perfect matches
        processFilters(processedData, node, startD, startT, endD, endT);
      } else {
        setFilteredRecords(processedData);
      }
      setPage(1); // Reset page on query execution
      
      if (forcedMode) {
        setExplorerMode(forcedMode);
      } else {
        setExplorerMode(isFilteredQuery ? "telemetry" : "device");
      }
    } catch (err) {
      setError(err.message || "Failed to load telemetry logs.");
      setRawRecords([]);
      setFilteredRecords([]);
    } finally {
      setLoading(false);
    }
  };

  const processFilters = (data, node, startD, startT, endD, endT) => {
    let result = [...data];

    // Filter by Node ID (client side check)
    if (node !== "All") {
      result = result.filter(
        item => String(item.NodeId) === String(node)
      );
    }

    // Apply date and time boundaries only if they are explicitly chosen (non-empty)
    result = result.filter(item => {
      if (!item.TimeStamp) return true;
      const [datePart, timePart] = item.TimeStamp.split(" ");
      const t = timePart.substring(0, 5); // HH:MM
      const itemDateTime = `${datePart} ${t}`;

      // Start Boundary check
      if (startD) {
        const startComp = startT ? `${startD} ${startT}` : `${startD} 00:00`;
        if (itemDateTime < startComp) return false;
      } else if (startT) {
        // If start date is unselected but start time is selected, check time globally
        if (t < startT) return false;
      }

      // End Boundary check
      if (endD) {
        const endComp = endT ? `${endD} ${endT}` : `${endD} 23:59`;
        if (itemDateTime > endComp) return false;
      } else if (endT) {
        // If end date is unselected but end time is selected, check time globally
        if (t > endT) return false;
      }

      return true;
    });

    setFilteredRecords(result);
  };

  // Perform initial fetch on mount (NodeId=All, no dates/times selected)
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchTelemetry("All", "", "", "", "", "device");
    }, 0);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleApply = (e) => {
    if (e) e.preventDefault();
    fetchTelemetry(nodeId, startDate, startTime, endDate, endTime, "telemetry");
  };

  const handleReset = () => {
    setNodeId("All");
    setStartDate("");
    setStartTime("");
    setEndDate("");
    setEndTime("");
    fetchTelemetry("All", "", "", "", "", "device");
  };

  const handleSelectDevice = (selectedNodeId) => {
    setNodeId(selectedNodeId);
    fetchTelemetry(selectedNodeId, startDate, startTime, endDate, endTime, "telemetry");
  };

  // Derived metrics for summary cards
  const isFiltered = explorerMode === "telemetry";

  const totalRecordsFound = filteredRecords.length;
  const devicesFound = new Set(filteredRecords.map(r => r.NodeId)).size;
  const formattedStartRange = appliedFilters.startDate || appliedFilters.startTime
    ? `${appliedFilters.startDate || ""} ${appliedFilters.startTime || ""}`.trim()
    : "All / Unspecified";
  const formattedEndRange = appliedFilters.endDate || appliedFilters.endTime
    ? `${appliedFilters.endDate || ""} ${appliedFilters.endTime || ""}`.trim()
    : "All / Unspecified";

  // Pagination calculation
  const totalPages = Math.ceil(totalRecordsFound / pageSize) || 1;
  const currentPage = Math.min(page, totalPages);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalRecordsFound);
  const paginatedRecords = filteredRecords.slice(startIndex, endIndex);

  // Generate pagination pages display
  const getPageNumbers = () => {
    const list = [];
    const maxVisible = 5;
    let start = Math.max(1, currentPage - 2);
    let end = Math.min(totalPages, start + maxVisible - 1);

    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }
    for (let i = start; i <= end; i++) {
      list.push(i);
    }
    return list;
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-foreground">
          {isFiltered ? "Livestock Telemetry Explorer" : "Livestock Device Explorer"}
        </h1>
        <p className="text-sm text-muted-foreground">
          {isFiltered 
            ? "Filter and search livestock activity patterns and IoT sensor logs" 
            : "Explore unique gateway-less monitoring devices active on the farm"}
        </p>
      </div>

      {/* Filter Section */}
      <Card className="bg-card shadow-sm border border-border">
        <form onSubmit={handleApply} className="p-6 space-y-4">
          <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground border-b border-border pb-2 mb-2">
            <Filter className="w-4 h-4 text-primary" /> Telemetry Filtering
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Node ID Selection */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Node ID</label>
              <select
                className="w-full bg-card text-foreground border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                value={nodeId}
                onChange={(e) => {
                  const val = e.target.value;
                  setNodeId(val);
                  if (val !== "All") {
                    fetchTelemetry(val, startDate, startTime, endDate, endTime, "telemetry");
                  }
                }}
              >
                <option value="All">All Nodes</option>
                {nodeIds.map((id) => (
                  <option key={id} value={id}>
                    {id}
                  </option>
                ))}
              </select>
            </div>

            {/* Start Date */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Start Date</label>
              <input
                type="date"
                className="w-full bg-card text-foreground border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>

            {/* Start Time */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Start Time</label>
              <input
                type="time"
                className="w-full bg-card text-foreground border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
              />
            </div>

            {/* End Date */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">End Date</label>
              <input
                type="date"
                className="w-full bg-card text-foreground border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>

            {/* End Time */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">End Time</label>
              <input
                type="time"
                className="w-full bg-card text-foreground border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
              />
            </div>
          </div>

          <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={handleReset}
              className="w-full sm:w-auto bg-muted hover:bg-muted/80 text-foreground border border-border font-medium py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors text-sm"
            >
              <RefreshCw className="w-4 h-4" /> Reset Filter
            </button>
            <button
              type="submit"
              className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-2 px-5 rounded-lg flex items-center justify-center gap-2 transition-colors text-sm"
            >
              <Filter className="w-4 h-4" /> Apply Filter
            </button>
          </div>
        </form>
      </Card>

      {/* Summary Cards */}
      {isFiltered ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Total Records */}
          <Card className="bg-card">
            <CardContent className="p-5 flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-lg text-primary">
                <Database className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Total Records Found
                </div>
                <div className="text-2xl font-bold">{totalRecordsFound.toLocaleString()}</div>
              </div>
            </CardContent>
          </Card>

          {/* Devices Found */}
          <Card className="bg-card">
            <CardContent className="p-5 flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-lg text-blue-600">
                <Cpu className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Total Devices Found
                </div>
                <div className="text-2xl font-bold">{devicesFound}</div>
              </div>
            </CardContent>
          </Card>

          {/* Selected Node */}
          <Card className="bg-card">
            <CardContent className="p-5 flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-lg text-green-600">
                <SlidersHorizontal className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Selected Node</div>
                <div className="text-xl font-bold text-primary truncate max-w-[150px]">
                  {appliedFilters.nodeId === "All" ? "All Nodes" : appliedFilters.nodeId}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Date Ranges */}
          <Card className="bg-card">
            <CardContent className="p-5 space-y-2">
              <div className="flex items-center justify-between border-b border-border pb-1">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-muted-foreground" /> Start Range:
                </span>
                <span className="text-xs font-semibold text-foreground font-mono">{formattedStartRange}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-muted-foreground" /> End Range:
                </span>
                <span className="text-xs font-semibold text-foreground font-mono">{formattedEndRange}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Total Unique Devices */}
          <Card className="bg-card">
            <CardContent className="p-5 flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-lg text-primary">
                <Database className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Total Unique Devices
                </div>
                <div className="text-2xl font-bold">{totalRecordsFound.toLocaleString()}</div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Telemetry Table */}
      <Card className="bg-card overflow-hidden border border-border shadow-sm">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3 text-muted-foreground">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
              <span className="text-sm font-medium">Loading telemetry logs...</span>
            </div>
          ) : error ? (
            <div className="text-center py-16 text-red-500 font-medium px-4">
              Error fetching records: {error}
            </div>
          ) : paginatedRecords.length === 0 ? (
            <div className="text-center py-20 text-muted-foreground flex flex-col items-center justify-center gap-2">
              <Database className="w-10 h-10 text-muted/50" />
              <div className="text-sm font-semibold">No records found</div>
              <div className="text-xs max-w-sm">Try using different filters or reset.</div>
            </div>
          ) : (
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-muted-foreground uppercase bg-muted/40 border-b border-border">
                <tr>
                  <th className="px-6 py-4 font-semibold whitespace-nowrap">Node ID</th>
                  {isFiltered && (
                    <>
                      <th className="px-6 py-4 font-semibold whitespace-nowrap">Activity</th>
                      <th className="px-6 py-4 font-semibold whitespace-nowrap">Timestamp</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {paginatedRecords.map((item, index) => (
                  <tr 
                    key={index} 
                    className={`hover:bg-muted/30 transition-colors odd:bg-muted/10 ${!isFiltered ? "cursor-pointer" : ""}`}
                    onClick={() => {
                      if (!isFiltered) {
                        handleSelectDevice(item.NodeId);
                      }
                    }}
                  >
                    <td className={`px-6 py-3.5 font-semibold text-primary whitespace-nowrap ${!isFiltered ? "hover:underline" : ""}`}>{item.NodeId}</td>
                    {isFiltered && (
                      <>
                        <td className="px-6 py-3.5 whitespace-nowrap">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider border border-border bg-card shadow-sm">
                            <span className={`w-1.5 h-1.5 rounded-full ${item.ActivityLabel === "MOV" ? "bg-green-500" :
                              item.ActivityLabel === "FEP" ? "bg-amber-500" :
                                item.ActivityLabel === "REL" ? "bg-indigo-500" : "bg-muted-foreground"
                              }`} />
                            {item.ActivityLabel}
                          </span>
                        </td>
                        <td className="px-6 py-3.5 font-mono text-muted-foreground text-xs whitespace-nowrap">{item.TimeStamp}</td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination Panel */}
        {totalRecordsFound > 0 && !loading && !error && (
          <div className="px-6 py-4 border-t border-border bg-muted/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-sm text-muted-foreground">
            <div>
              Showing <span className="font-semibold text-foreground">{startIndex + 1}</span>–
              <span className="font-semibold text-foreground">{endIndex}</span> of{" "}
              <span className="font-semibold text-foreground">{totalRecordsFound.toLocaleString()}</span> {isFiltered ? "records" : "devices"}
            </div>

            {/* Pagination Controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1.5 border border-border rounded-lg bg-card hover:bg-muted text-foreground font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>

              <div className="hidden md:flex gap-1">
                {getPageNumbers().map((num) => (
                  <button
                    key={num}
                    onClick={() => setPage(num)}
                    className={`w-9 h-9 border rounded-lg font-semibold transition-colors ${currentPage === num
                      ? "bg-primary text-primary-foreground border-primary"
                      : "border-border bg-card hover:bg-muted text-foreground"
                      }`}
                  >
                    {num}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1.5 border border-border rounded-lg bg-card hover:bg-muted text-foreground font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </div>

            {/* Page Size Select */}
            <div className="flex items-center gap-2">
              <span>Page Size:</span>
              <select
                className="bg-card text-foreground border border-border rounded-lg px-2.5 py-1 text-sm focus:outline-none"
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setPage(1);
                }}
              >
                <option value={100}>100</option>
                <option value={500}>500</option>
                <option value={1000}>1000</option>
              </select>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}