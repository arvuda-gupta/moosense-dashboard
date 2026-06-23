import fs from 'fs';

const rawContent = fs.readFileSync('C:\\Users\\mrskm\\.gemini\\antigravity-ide\\brain\\4baf72ff-c881-4dab-9005-d900b17ae54c\\.system_generated\\steps\\578\\content.md', 'utf8');

const startIdx = rawContent.indexOf('const L={') + 'const L={'.length - 1;
let braceCount = 0;
let endIdx = -1;
for (let i = startIdx; i < rawContent.length; i++) {
  if (rawContent[i] === '{') braceCount++;
  else if (rawContent[i] === '}') {
    braceCount--;
    if (braceCount === 0) {
      endIdx = i;
      break;
    }
  }
}

if (endIdx !== -1) {
  const jsonStr = rawContent.substring(startIdx, endIdx + 1)
    .replace(/(\w+):/g, '"$1":')
    .replace(/'/g, '"')
    .replace(/\r?\n|\r/g, ' ');

  const data = JSON.parse(jsonStr);
  const centroids = {};

  const nameMapping = {
    AN: "Andaman and Nicobar Islands",
    AP: "Andhra Pradesh",
    AR: "Arunachal Pradesh",
    AS: "Assam",
    BR: "Bihar",
    CH: "Chandigarh",
    CT: "Chhattisgarh",
    DD: "Daman and Diu",
    DL: "Delhi",
    DN: "Dadra and Nagar Haveli",
    GA: "Goa",
    GJ: "Gujarat",
    HP: "Himachal Pradesh",
    HR: "Haryana",
    JH: "Jharkhand",
    JK: "Jammu and Kashmir",
    KA: "Karnataka",
    KL: "Kerala",
    LA: "Ladakh",
    LD: "Lakshadweep",
    MH: "Maharashtra",
    ML: "Meghalaya",
    MN: "Manipur",
    MP: "Madhya Pradesh",
    MZ: "Mizoram",
    NL: "Nagaland",
    OR: "Odisha",
    PB: "Punjab",
    PY: "Puducherry",
    RJ: "Rajasthan",
    SK: "Sikkim",
    TG: "Telangana",
    TN: "Tamil Nadu",
    TR: "Tripura",
    UP: "Uttar Pradesh",
    UT: "Uttarakhand",
    WB: "West Bengal"
  };

  Object.keys(data).forEach(k => {
    const path = data[k];
    // Find all coordinates using regex matching numbers
    // Coordinates look like -114 or 50.4 or 123,456
    const numbers = path.match(/-?\d+(\.\d+)?/g);
    if (numbers && numbers.length > 0) {
      let sumX = 0;
      let sumY = 0;
      let count = 0;
      
      // Let's do simple bounding box instead of average of all points, as it is more stable for large paths
      let minX = Infinity;
      let maxX = -Infinity;
      let minY = Infinity;
      let maxY = -Infinity;

      // We parse coordinates. The path format is "M x y ... l dx dy ..."
      // To get bounding box, let's parse the numbers in pairs or extract all odd/even numbers
      // A quick check: path can have absolute or relative points. Bounding box calculation from raw numbers can be slightly off but works as a good approximation.
      // Better: let's parse numbers as potential X and Y coordinate inputs.
      // Since SVG path coordinates alternate X and Y, we can treat even index numbers as X and odd as Y.
      for (let i = 0; i < numbers.length - 1; i += 2) {
        const valX = parseFloat(numbers[i]);
        const valY = parseFloat(numbers[i+1]);
        if (!isNaN(valX) && !isNaN(valY)) {
          // Note: relative values shouldn't be added to absolute bounds directly, but since we just want a rough centroid,
          // let's do a simple calculation.
          // Wait, is there a simpler way?
          // Since we want accurate centers for zoom, let's write a simple absolute state tracker to get true coordinates!
        }
      }

      // Let's do true path parsing to get absolute coordinates.
      let curX = 0;
      let curY = 0;
      let points = [];

      // Split path into commands and arguments
      const tokens = path.match(/[a-df-z]|-?\d+(\.\d+)?/gi);
      let cmd = '';
      if (tokens) {
        for (let i = 0; i < tokens.length; ) {
          const t = tokens[i];
          if (/[a-df-z]/i.test(t)) {
            cmd = t;
            i++;
          } else {
            // It's a coordinate
            if (cmd.toLowerCase() === 'm') {
              const x = parseFloat(tokens[i]);
              const y = parseFloat(tokens[i+1]);
              if (cmd === 'm') {
                curX += x;
                curY += y;
              } else {
                curX = x;
                curY = y;
              }
              points.push({ x: curX, y: curY });
              i += 2;
            } else if (cmd.toLowerCase() === 'l') {
              const x = parseFloat(tokens[i]);
              const y = parseFloat(tokens[i+1]);
              if (cmd === 'l') {
                curX += x;
                curY += y;
              } else {
                curX = x;
                curY = y;
              }
              points.push({ x: curX, y: curY });
              i += 2;
            } else if (cmd.toLowerCase() === 'h') {
              const x = parseFloat(tokens[i]);
              if (cmd === 'h') {
                curX += x;
              } else {
                curX = x;
              }
              points.push({ x: curX, y: curY });
              i += 1;
            } else if (cmd.toLowerCase() === 'v') {
              const y = parseFloat(tokens[i]);
              if (cmd === 'v') {
                curY += y;
              } else {
                curY = y;
              }
              points.push({ x: curX, y: curY });
              i += 1;
            } else if (cmd.toLowerCase() === 'c') {
              // Cubic bezier has 6 arguments: dx1 dy1 dx2 dy2 dx dy
              const dx = parseFloat(tokens[i+4]);
              const dy = parseFloat(tokens[i+5]);
              if (cmd === 'c') {
                curX += dx;
                curY += dy;
              } else {
                curX = dx;
                curY = dy;
              }
              points.push({ x: curX, y: curY });
              i += 6;
            } else {
              // fallback, skip token to avoid infinite loop
              i++;
            }
          }
        }
      }

      if (points.length > 0) {
        let minX = Math.min(...points.map(p => p.x));
        let maxX = Math.max(...points.map(p => p.x));
        let minY = Math.min(...points.map(p => p.y));
        let maxY = Math.max(...points.map(p => p.y));
        
        // Center shifted by +114, +50.4
        const centerX = Math.round((minX + maxX) / 2 + 114);
        const centerY = Math.round((minY + maxY) / 2 + 50.4);
        const stateName = nameMapping[k];
        centroids[stateName] = { x: centerX, y: centerY };
      }
    }
  });

  console.log("Calculated State Centers in 0 0 612 696 viewBox:");
  console.log(JSON.stringify(centroids, null, 2));
}
