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
  Object.keys(data).forEach(k => {
    const path = data[k];
    // Find all uppercase letters except M
    const uppercaseLetters = path.match(/[A-LN-Z]/g);
    if (uppercaseLetters) {
      console.log(`State ${k} has uppercase commands:`, uppercaseLetters.slice(0, 10));
    }
  });
}
