const fs = require('fs');
const path = require('path');

// Read current data
let dataContent = fs.readFileSync(path.join(__dirname, 'js', 'products-data.js'), 'utf8');

// Extract all currently referenced images
const imageRefs = new Set();
const regex = /"(poze%20site\/[^"]+)"/g;
let match;
while ((match = regex.exec(dataContent)) !== null) {
  imageRefs.add(decodeURIComponent(match[1]));
}

// Get all unmatched files
const pozeDir = path.join(__dirname, 'poze site');
const allFiles = fs.readdirSync(pozeDir).filter(f => {
  try {
    const stat = fs.statSync(path.join(pozeDir, f));
    return stat.isFile() && /\.(jpg|jpeg|png|webp)$/i.test(f);
  } catch(e) { return false; }
});
const unmatched = allFiles.filter(f => !imageRefs.has('poze site/' + f));

// Known duplicate files to skip (same-size analysis)
const skipFiles = new Set([
  'Web_Photo_Editor - 2026-01-30T164310.685.jpg',
  'Web_Photo_Editor - 2026-01-27T154347.995.jpg',
  'Web_Photo_Editor - 2026-02-04T132654.346.jpg',
  'Web_Photo_Editor - 2026-02-02T154008.876.jpg',
  'Web_Photo_Editor - 2026-03-02T124757.774.jpg',
]);

// Known collage/marketing images to skip
const collageFiles = new Set([
  'Web_Photo_Editor (50).jpg',  // ACE+Lenor+Persil
  'Web_Photo_Editor (51).jpg',  // ACE+Lenor+Persil variant
  'Web_Photo_Editor (100).jpg', // Ariel Professional (duplicate of existing p108)
  'Web_Photo_Editor - 2026-03-02T095856.514.jpg', // Persil+Asevi+Yumos collage
  'Web_Photo_Editor - 2026-03-03T155746.784.jpg', // Pachet Ingrijire Completa collage
  'Web_Photo_Editor - 2026-03-03T164038.519.jpg', // Marketing collage
  'Web_Photo_Editor - 2026-03-04T102642.433.jpg', // Marketing collage
  'Web_Photo_Editor-2.webp', // WebP duplicate
  'Web_Photo_Editor-2026-02-04T131359.276.webp', // WebP duplicate
  'Web_Photo_Editor-2026-02-04T154109.530.webp', // WebP duplicate of boxa ZQS4271
  'Web_Photo_Editor.jpg', // Generic unnamed
]);

// Also check if (37).jpg is a duplicate of p185 Fairy Rodie
// (89) is duplicate of p303 Dermomed Sensualità Argan  
const extraDuplicates = new Set([
  'Web_Photo_Editor (37).jpg',  // Fairy Rodie - duplicate of p185
  'Web_Photo_Editor (89).jpg',  // Dermomed Argan - duplicate of p303  
]);

const filtered = unmatched.filter(f => !skipFiles.has(f) && !collageFiles.has(f) && !extraDuplicates.has(f));

// Parse and sort by timestamp
function parseTs(f) {
  const m = f.match(/(\d{4}-\d{2}-\d{2})T(\d{2})(\d{2})(\d{2})/);
  if (m) return new Date(`${m[1]}T${m[2]}:${m[3]}:${m[4]}`);
  const m2 = f.match(/\((\d+)\)/);
  if (m2) return new Date(2026, 0, 1, 0, 0, parseInt(m2[1])); // sort numberd by number
  return new Date(2026, 0, 1);
}

const sorted = filtered.sort((a, b) => parseTs(a) - parseTs(b));

// Group by timestamp proximity (10 min)
const groups = [];
let cur = [];
for (const f of sorted) {
  if (cur.length === 0) { cur.push(f); continue; }
  const lastTs = parseTs(cur[cur.length - 1]);
  const thisTs = parseTs(f);
  if ((thisTs - lastTs) / 60000 <= 10) {
    cur.push(f);
  } else {
    groups.push([...cur]);
    cur = [f];
  }
}
if (cur.length > 0) groups.push(cur);

// Get max id
let maxId = 0;
const idRegex = /id: "p(\d+)"/g;
let idMatch;
while ((idMatch = idRegex.exec(dataContent)) !== null) {
  maxId = Math.max(maxId, parseInt(idMatch[1]));
}

console.log(`Filtered: ${filtered.length} images in ${groups.length} groups`);
console.log(`Starting from p${maxId + 1}`);

// Build new entries
let nextId = maxId + 1;
const entries = [];

for (const group of groups) {
  const images = group.map(f => 'poze%20site/' + f.replace(/ /g, '%20'));
  entries.push({
    id: `p${nextId}`,
    images: images,
    files: group,
    count: group.length
  });
  nextId++;
}

// Build the JS code to append
let newCode = '\n  // ========== PRODUSE NOU ADAUGATE (necesita verificare nume) ==========\n';

for (const e of entries) {
  const imgStr = e.images.map(i => `"${i}"`).join(', ');
  newCode += `  { id: "${e.id}", name: "Produs Nou ${e.id.substring(1)}", category: "altele", images: [${imgStr}], brand: "" },\n`;
}

// Insert before the closing ];
dataContent = dataContent.replace(/\n\];\s*$/, newCode + '];\n');

fs.writeFileSync(path.join(__dirname, 'js', 'products-data.js'), dataContent, 'utf8');
console.log(`Added ${entries.length} new product entries to products-data.js`);
console.log('Products range: p' + (maxId + 1) + ' to p' + (nextId - 1));

// Print summary
entries.forEach(e => {
  console.log(`${e.id} (${e.count} img): ${e.files[0]}`);
});
