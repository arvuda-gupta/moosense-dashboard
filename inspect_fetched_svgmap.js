import fs from 'fs';

const rawContent = fs.readFileSync('C:\\Users\\mrskm\\.gemini\\antigravity-ide\\brain\\4baf72ff-c881-4dab-9005-d900b17ae54c\\.system_generated\\steps\\578\\content.md', 'utf8');

// Find const L = { ... }
const startIdx = rawContent.indexOf('const L={') + 'const L={'.length - 1;
// Find matching closing brace
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
    .replace(/(\w+):/g, '"$1":') // Quote keys
    .replace(/'/g, '"') // Replace single quotes
    .replace(/\r?\n|\r/g, ' '); // Clean newlines

  try {
    const data = JSON.parse(jsonStr);
    console.log("Keys in react-svgmap-india paths object (Total " + Object.keys(data).length + "):");
    Object.keys(data).forEach(k => {
      console.log(`- ${k}: path length ${data[k].length}`);
    });
  } catch (err) {
    console.error("Error parsing JSON:", err);
    // Print fallback substring
    console.log("Substring around start:", rawContent.substring(startIdx, startIdx + 100));
  }
} else {
  console.log("Could not find brace matching end.");
}
