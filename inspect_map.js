import { indiaMapData } from './src/data/indiaMapData.js';
console.log("ViewBox:", indiaMapData.viewBox);
console.log("States (" + indiaMapData.locations.length + "):");
indiaMapData.locations.forEach(loc => {
  console.log(`- ${loc.name} (${loc.id}) path length: ${loc.path.length}`);
});
