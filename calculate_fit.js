const originalCenters = {
  "Punjab": { x: 190, y: 155 },
  "Haryana": { x: 215, y: 185 },
  "Rajasthan": { x: 165, y: 245 },
  "Gujarat": { x: 110, y: 320 },
  "Uttar Pradesh": { x: 295, y: 225 },
  "Madhya Pradesh": { x: 275, y: 325 },
  "Maharashtra": { x: 220, y: 425 },
  "Karnataka": { x: 200, y: 535 },
  "Tamil Nadu": { x: 260, y: 605 },
  "Telangana": { x: 270, y: 465 },
  "Andhra Pradesh": { x: 295, y: 515 },
  "Kerala": { x: 210, y: 610 },
  "West Bengal": { x: 425, y: 325 },
  "Odisha": { x: 365, y: 385 },
  "Assam": { x: 510, y: 245 }
};

// These are the centroids of the react-svgmap-india paths (before translation)
// e.g. from calculate_centroids.js but subtracting 114 and 50.4
const newCentroids = {
  "Punjab": { x: 151 - 114, y: 152 - 50.4 },
  "Haryana": { x: 164 - 114, y: 194 - 50.4 },
  "Rajasthan": { x: 119 - 114, y: 257 - 50.4 },
  "Gujarat": { x: 66 - 114, y: 355 - 50.4 },
  "Uttar Pradesh": { x: 265 - 114, y: 245 - 50.4 },
  "Madhya Pradesh": { x: 214 - 114, y: 319 - 50.4 },
  "Maharashtra": { x: 179 - 114, y: 435 - 50.4 },
  "Karnataka": { x: 170 - 114, y: 518 - 50.4 },
  "Tamil Nadu": { x: 211 - 114, y: 609 - 50.4 },
  "Telangana": { x: 237 - 114, y: 457 - 50.4 },
  "Andhra Pradesh": { x: 263 - 114, y: 500 - 50.4 },
  "Kerala": { x: 166 - 114, y: 615 - 50.4 },
  "West Bengal": { x: 412 - 114, y: 310 - 50.4 },
  "Odisha": { x: 340 - 114, y: 405 - 50.4 },
  "Assam": { x: 516 - 114, y: 271 - 50.4 }
};

// We want to find s, tx, ty such that:
// original.x ≈ s * new.x + tx
// original.y ≈ s * new.y + ty

// Let's use simple linear regression for X and Y to find s and t
// To maintain aspect ratio, we want a single scale factor s.
// Let's compute the optimal s, tx, ty using least squares.

const states = Object.keys(originalCenters);
const n = states.length;

// Solve for X: original.x = s * new.x + tx
// Solve for Y: original.y = s * new.y + ty
// We want to find s that minimizes the sum of squared errors in both X and Y.
// Let's do a grid search for s from 0.5 to 2.0 with step 0.001 to find the best s,
// and for each s, calculate the optimal tx and ty, and then choose the s with minimum error.

let bestS = 1;
let bestTx = 0;
let bestTy = 0;
let minError = Infinity;

for (let s = 0.5; s <= 2.5; s += 0.001) {
  // For a fixed s, the optimal tx is the mean of (original.x - s * new.x)
  let sumTx = 0;
  let sumTy = 0;
  states.forEach(state => {
    sumTx += originalCenters[state].x - s * newCentroids[state].x;
    sumTy += originalCenters[state].y - s * newCentroids[state].y;
  });
  const tx = sumTx / n;
  const ty = sumTy / n;

  // Calculate sum of squared errors
  let error = 0;
  states.forEach(state => {
    const predX = s * newCentroids[state].x + tx;
    const predY = s * newCentroids[state].y + ty;
    error += Math.pow(originalCenters[state].x - predX, 2) + Math.pow(originalCenters[state].y - predY, 2);
  });

  if (error < minError) {
    minError = error;
    bestS = s;
    bestTx = tx;
    bestTy = ty;
  }
}

console.log("Optimal scale and translation factors:");
console.log(`Scale (s): ${bestS.toFixed(4)}`);
console.log(`Translate X (tx): ${bestTx.toFixed(4)}`);
console.log(`Translate Y (ty): ${bestTy.toFixed(4)}`);
console.log(`RMS Error per state: ${Math.sqrt(minError / n).toFixed(2)} pixels`);

console.log("\nComparison (Original vs Transformed):");
states.forEach(state => {
  const transX = bestS * newCentroids[state].x + bestTx;
  const transY = bestS * newCentroids[state].y + bestTy;
  const dx = transX - originalCenters[state].x;
  const dy = transY - originalCenters[state].y;
  console.log(`- ${state}:`);
  console.log(`  Original:  (${originalCenters[state].x}, ${originalCenters[state].y})`);
  console.log(`  Predicted: (${transX.toFixed(1)}, ${transY.toFixed(1)})`);
  console.log(`  Diff:      (${dx.toFixed(1)}, ${dy.toFixed(1)}) distance: ${Math.sqrt(dx*dx + dy*dy).toFixed(1)}`);
});
