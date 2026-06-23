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

  const locations = Object.keys(data).map(k => {
    return {
      name: nameMapping[k],
      id: k.toLowerCase(),
      path: data[k].trim()
    };
  });

  const outputObj = {
    viewBox: "0 0 612 696",
    locations: locations
  };

  const outputCode = `// Geographically accurate India state paths from react-svgmap-india
export const indiaMapData = ${JSON.stringify(outputObj, null, 2)};
`;

  fs.writeFileSync('src/data/indiaMapData.js', outputCode, 'utf8');
  console.log("Successfully wrote src/data/indiaMapData.js!");
}
