const fs = require('fs');
const path = require('path');

// Read products-data.js
let dataContent = fs.readFileSync(path.join(__dirname, 'js', 'products-data.js'), 'utf8');

// Extract all image paths referenced
const imageRefs = new Set();
const regex = /"(poze%20site\/[^"]+)"/g;
let match;
while ((match = regex.exec(dataContent)) !== null) {
  imageRefs.add(decodeURIComponent(match[1]));
}

// Get all unmatched files
const pozeDir = path.join(__dirname, 'poze site');
const allFiles = fs.readdirSync(pozeDir).filter(f => {
  const stat = fs.statSync(path.join(pozeDir, f));
  return stat.isFile() && /\.(jpg|jpeg|png|webp)$/i.test(f);
});

const unmatched = allFiles.filter(f => !imageRefs.has('poze site/' + f));
console.log('Total unmatched:', unmatched.length);

// Get the highest product id currently used
const idRegex = /id: "p(\d+)"/g;
let maxId = 0;
let idMatch;
while ((idMatch = idRegex.exec(dataContent)) !== null) {
  const num = parseInt(idMatch[1]);
  if (num > maxId) maxId = num;
}
console.log('Current max product id: p' + maxId);

// Parse timestamps from filenames and group by proximity
function parseTimestamp(filename) {
  // Match: Web_Photo_Editor - YYYY-MM-DDTHHMMSS.mmm.jpg
  const m = filename.match(/(\d{4}-\d{2}-\d{2})T(\d{2})(\d{2})(\d{2})/);
  if (m) {
    const [_, date, h, min, s] = m;
    return new Date(`${date}T${h}:${min}:${s}`);
  }
  // Match: Web_Photo_Editor (NN).jpg
  const m2 = filename.match(/\((\d+)\)/);
  if (m2) return null; // numbered files, no timestamp
  return null;
}

// Group unmatched images by proximity (within 10 minutes = same product shoot)
const groups = [];
let currentGroup = [];

// Sort unmatched by timestamp first, numbered ones last
const withTs = unmatched.map(f => ({ name: f, ts: parseTimestamp(f) }));
const numbered = withTs.filter(x => !x.ts);
const dated = withTs.filter(x => x.ts).sort((a, b) => a.ts - b.ts);

// Group dated images (within 10 min gap = same product)
for (let i = 0; i < dated.length; i++) {
  if (currentGroup.length === 0) {
    currentGroup.push(dated[i]);
  } else {
    const lastTs = currentGroup[currentGroup.length - 1].ts;
    const diff = (dated[i].ts - lastTs) / 60000; // minutes
    if (diff <= 10) {
      currentGroup.push(dated[i]);
    } else {
      groups.push(currentGroup);
      currentGroup = [dated[i]];
    }
  }
}
if (currentGroup.length > 0) groups.push(currentGroup);

// Add numbered files as individual groups
numbered.forEach(n => groups.push([n]));

console.log('Image groups formed:', groups.length);

// Known duplicates from file-size analysis - skip these exact files
const duplicateSkipList = new Set([
  'Web_Photo_Editor - 2026-01-30T164310.685.jpg', // duplicate of 163740
  'Web_Photo_Editor - 2026-01-27T154347.995.jpg', // duplicate of 154025
  'Web_Photo_Editor - 2026-02-04T132654.346.jpg', // duplicate of 132444
  'Web_Photo_Editor - 2026-02-02T154008.876.jpg', // duplicate of 153936
  'Web_Photo_Editor - 2026-03-02T124757.774.jpg', // duplicate of 124423
]);

// Known collage files - mark them
const collageFiles = new Set([
  'Web_Photo_Editor (50).jpg',
  'Web_Photo_Editor (51).jpg',
  'Web_Photo_Editor (100).jpg',
]);

// Generate product entries
let nextId = maxId + 1;
const newEntries = [];

for (const group of groups) {
  // Filter out duplicates
  const files = group.map(g => g.name).filter(f => !duplicateSkipList.has(f));
  if (files.length === 0) continue;
  
  // Determine if collage
  const isCollage = files.some(f => collageFiles.has(f));
  
  // Create image paths
  const images = files.map(f => 'poze%20site/' + encodeURIComponent(f).replace(/%20/g, '%20'));
  
  // Generate entry (will need manual naming later - for now use placeholder)
  const productName = isCollage ? `Collage Produse ${nextId}` : `Produs Nou ${nextId}`;
  const category = isCollage ? 'altele' : 'altele';
  
  newEntries.push({
    id: `p${nextId}`,
    name: productName,
    category: category,
    images: images,
    brand: '',
    isCollage: isCollage,
    fileNames: files
  });
  nextId++;
}

console.log('New product entries to add:', newEntries.length);

// Print summary of groups for review
newEntries.forEach(e => {
  const label = e.isCollage ? ' [COLLAGE]' : '';
  console.log(`${e.id}: ${e.fileNames.length} images${label}`);
  e.fileNames.forEach(f => console.log(`  - ${f}`));
});

// Write the grouped entries to a JSON file for review
fs.writeFileSync(path.join(__dirname, 'new_entries.json'), JSON.stringify(newEntries, null, 2), 'utf8');
console.log('\nSaved new_entries.json for review');
