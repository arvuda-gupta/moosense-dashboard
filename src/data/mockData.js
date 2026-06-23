export const generateCows = (count = 120) => {
  const breeds = ['Holstein Friesian', 'Jersey', 'Angus', 'Guernsey'];
  const statuses = ['Active', 'Resting', 'Grazing', 'Critical'];
  const locations = ['Barn A', 'Barn B', 'Grazing Zone', 'Water Zone', 'Feeding Zone', 'Research Zone'];
  const names = ['Bessie', 'Luna', 'Bellamy', 'Shadow', 'Clover', 'Daisy', 'Stella', 'Ruby', 'Penny', 'Rosie'];

  return Array.from({ length: count }).map((_, i) => {
    const id = `#BS-${2000 + i}`;
    const healthScore = Math.floor(Math.random() * 30) + 70; // 70 to 99
    return {
      id,
      name: names[Math.floor(Math.random() * names.length)],
      breed: breeds[Math.floor(Math.random() * breeds.length)],
      age: (Math.random() * 5 + 1).toFixed(1) + ' yrs',
      healthScore: Math.random() > 0.95 ? Math.floor(Math.random() * 30) + 40 : healthScore, // Few critical
      status: statuses[Math.floor(Math.random() * statuses.length)],
      battery: Math.floor(Math.random() * 100),
      lastSync: new Date(Date.now() - Math.floor(Math.random() * 10000000)).toISOString(),
      location: locations[Math.floor(Math.random() * locations.length)],
      estrusProbability: Math.floor(Math.random() * 100),
      activityScore: Math.floor(Math.random() * 40) + 60,
      weight: Math.floor(Math.random() * 200) + 500,
      lactationCycle: Math.floor(Math.random() * 4) + 1,
      lastCalving: Math.floor(Math.random() * 300) + ' Days Ago',
      illnessRisk: Math.floor(Math.random() * 20),
      anomalyScore: (Math.random() * 10).toFixed(1),
      deviceMac: `A4:C1:38:00:${Math.floor(Math.random()*255).toString(16).padStart(2,'0')}:${Math.floor(Math.random()*255).toString(16).padStart(2,'0')}`.toUpperCase()
    };
  });
};

export const cows = generateCows(120);

export const alerts = [
  { id: 1, type: 'Health', message: 'Cow #BS-2015 shows abnormal rumen temperature.', severity: 'Critical', time: '10 mins ago' },
  { id: 2, type: 'Device', message: 'Low battery on Collar SN-441 (Cow #BS-2088).', severity: 'Medium', time: '1 hour ago' },
  { id: 3, type: 'Behavior', message: 'Decreased rumination activity detected in Barn A.', severity: 'High', time: '2 hours ago' },
  { id: 4, type: 'System', message: 'Data sync completed successfully across all zones.', severity: 'Low', time: '5 hours ago' },
];

export const activityData = [
  { time: '00:00', movement: 20, feeding: 10, resting: 70 },
  { time: '04:00', movement: 30, feeding: 20, resting: 50 },
  { time: '08:00', movement: 80, feeding: 60, resting: 10 },
  { time: '12:00', movement: 60, feeding: 40, resting: 30 },
  { time: '16:00', movement: 90, feeding: 50, resting: 10 },
  { time: '20:00', movement: 40, feeding: 30, resting: 40 },
  { time: '23:59', movement: 15, feeding: 10, resting: 75 },
];

export const herdAnalytics = [
  { month: 'Jan', healthy: 950, critical: 10, resting: 200 },
  { month: 'Feb', healthy: 960, critical: 8, resting: 210 },
  { month: 'Mar', healthy: 940, critical: 15, resting: 190 },
  { month: 'Apr', healthy: 980, critical: 5, resting: 220 },
  { month: 'May', healthy: 975, critical: 6, resting: 215 },
  { month: 'Jun', healthy: 990, critical: 4, resting: 205 },
];
