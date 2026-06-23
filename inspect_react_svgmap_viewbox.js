import fs from 'fs';

const rawContent = fs.readFileSync('C:\\Users\\mrskm\\.gemini\\antigravity-ide\\brain\\4baf72ff-c881-4dab-9005-d900b17ae54c\\.system_generated\\steps\\578\\content.md', 'utf8');

const regex = /viewBox|viewbox|width|height|0\s+0\s+\d+/gi;
let match;
while ((match = regex.exec(rawContent)) !== null) {
  console.log(`Found match: "${match[0]}" at index ${match.index}`);
  console.log(rawContent.substring(match.index - 50, match.index + 50));
}
