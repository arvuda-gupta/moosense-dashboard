import fs from 'fs';

const rawContent = fs.readFileSync('C:\\Users\\mrskm\\.gemini\\antigravity-ide\\brain\\4baf72ff-c881-4dab-9005-d900b17ae54c\\.system_generated\\steps\\562\\content.md', 'utf8');
const jsonPart = rawContent.substring(rawContent.indexOf('export default') + 'export default '.length).trim();
const mapData = JSON.parse(jsonPart);

console.log("ViewBox:", mapData.viewBox);
console.log("Total states/locations:", mapData.locations.length);
mapData.locations.forEach(loc => {
  console.log(`- "${loc.name}" (id: "${loc.id}")`);
});
