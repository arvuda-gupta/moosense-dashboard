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
  let overallMinX = Infinity;
  let overallMaxX = -Infinity;
  let overallMinY = Infinity;
  let overallMaxY = -Infinity;

  Object.keys(data).forEach(k => {
    const path = data[k];
    const tokens = path.match(/[a-df-z]|-?\d+(\.\d+)?/gi);
    let cmd = '';
    let curX = 0;
    let curY = 0;
    if (tokens) {
      for (let i = 0; i < tokens.length; ) {
        const t = tokens[i];
        if (/[a-df-z]/i.test(t)) {
          cmd = t;
          i++;
        } else {
          if (cmd.toLowerCase() === 'm' || cmd.toLowerCase() === 'l') {
            const x = parseFloat(tokens[i]);
            const y = parseFloat(tokens[i+1]);
            if (cmd === 'm' || cmd === 'l') {
              curX += x;
              curY += y;
            } else {
              curX = x;
              curY = y;
            }
            overallMinX = Math.min(overallMinX, curX);
            overallMaxX = Math.max(overallMaxX, curX);
            overallMinY = Math.min(overallMinY, curY);
            overallMaxY = Math.max(overallMaxY, curY);
            i += 2;
          } else if (cmd.toLowerCase() === 'h') {
            const x = parseFloat(tokens[i]);
            if (cmd === 'h') curX += x;
            else curX = x;
            overallMinX = Math.min(overallMinX, curX);
            overallMaxX = Math.max(overallMaxX, curX);
            i += 1;
          } else if (cmd.toLowerCase() === 'v') {
            const y = parseFloat(tokens[i]);
            if (cmd === 'v') curY += y;
            else curY = y;
            overallMinY = Math.min(overallMinY, curY);
            overallMaxY = Math.max(overallMaxY, curY);
            i += 1;
          } else if (cmd.toLowerCase() === 'c') {
            const dx = parseFloat(tokens[i+4]);
            const dy = parseFloat(tokens[i+5]);
            if (cmd === 'c') {
              curX += dx;
              curY += dy;
            } else {
              curX = dx;
              curY = dy;
            }
            overallMinX = Math.min(overallMinX, curX);
            overallMaxX = Math.max(overallMaxX, curX);
            overallMinY = Math.min(overallMinY, curY);
            overallMaxY = Math.max(overallMaxY, curY);
            i += 6;
          } else {
            i++;
          }
        }
      }
    }
  });

  console.log("Original bounds in react-svgmap-india:");
  console.log(`MinX: ${overallMinX}, MaxX: ${overallMaxX}, Width: ${overallMaxX - overallMinX}`);
  console.log(`MinY: ${overallMinY}, MaxY: ${overallMaxY}, Height: ${overallMaxY - overallMinY}`);

  console.log("\nTranslated bounds (+114, +50.4):");
  console.log(`MinX: ${overallMinX + 114}, MaxX: ${overallMaxX + 114}, Width: ${overallMaxX - overallMinX}`);
  console.log(`MinY: ${overallMinY + 50.4}, MaxY: ${overallMaxY + 50.4}, Height: ${overallMaxY - overallMinY}`);
}
