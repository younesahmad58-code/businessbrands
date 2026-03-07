const fs = require('fs');
const path = require('path');

// Read products-data.js
let dataContent = fs.readFileSync(path.join(__dirname, 'js', 'products-data.js'), 'utf8');

// Get all actual files in poze site root
const pozeDir = path.join(__dirname, 'poze site');
const allFiles = fs.readdirSync(pozeDir).filter(f => {
  const stat = fs.statSync(path.join(pozeDir, f));
  return stat.isFile();
});

// Build a map: timestamp-without-millis -> actual filename
// e.g., "2026-01-27T131610" -> "Web_Photo_Editor - 2026-01-27T131610.499.jpg"
const timestampMap = {};
allFiles.forEach(f => {
  // Match pattern: Web_Photo_Editor - YYYY-MM-DDTHHMMSS.mmm.jpg
  const m = f.match(/^(Web_Photo_Editor - \d{4}-\d{2}-\d{2}T\d{6})\.\d{3}\.jpg$/);
  if (m) {
    if (!timestampMap[m[1]]) timestampMap[m[1]] = [];
    timestampMap[m[1]].push(f);
  }
});

// Find all .000.jpg references in products-data.js and replace with actual filenames
let fixCount = 0;
let unfixable = [];
const regex000 = /Web_Photo_Editor%20-%20(\d{4}-\d{2}-\d{2}T\d{6})\.000\.jpg/g;
let match;
const replacements = [];

while ((match = regex000.exec(dataContent)) !== null) {
  const tsKey = 'Web_Photo_Editor - ' + match[1];
  const actualFiles = timestampMap[tsKey];
  if (actualFiles && actualFiles.length >= 1) {
    const actualFile = actualFiles[0]; // Use first match
    const encodedActual = 'Web_Photo_Editor%20-%20' + match[1] + '.' + actualFile.match(/\.(\d{3})\.jpg$/)[1] + '.jpg';
    replacements.push({
      from: match[0],
      to: encodedActual,
      ts: match[1]
    });
    fixCount++;
  } else {
    unfixable.push(match[0]);
  }
}

// Apply replacements
replacements.forEach(r => {
  dataContent = dataContent.replace(r.from, r.to);
});

console.log('Fixed', fixCount, 'filename references');
if (unfixable.length > 0) {
  console.log('Unfixable (no matching file found):', unfixable.length);
  unfixable.forEach(u => console.log('  ', u));
}

// Write back
fs.writeFileSync(path.join(__dirname, 'js', 'products-data.js'), dataContent, 'utf8');
console.log('products-data.js updated successfully!');

// Now re-check: find truly unmatched images
const imageRefs = new Set();
const regex2 = /"(poze%20site\/[^"]+)"/g;
let match2;
while ((match2 = regex2.exec(dataContent)) !== null) {
  imageRefs.add(decodeURIComponent(match2[1]));
}

const imageFiles = allFiles.filter(f => /\.(jpg|jpeg|png|webp)$/i.test(f));
const stillUnmatched = [];
imageFiles.forEach(f => {
  const relPath = 'poze site/' + f;
  if (!imageRefs.has(relPath)) {
    stillUnmatched.push(f);
  }
});

console.log('\n=== STILL UNMATCHED AFTER FIX ===');
console.log('Count:', stillUnmatched.length);
stillUnmatched.forEach(f => console.log(f));

// Check for same-size potential duplicates among unmatched
const sizeMap = {};
stillUnmatched.forEach(f => {
  const stat = fs.statSync(path.join(pozeDir, f));
  sizeMap[f] = stat.size;
});

// Find files with same size among the entire image set to detect duplicates
const allSizes = {};
imageFiles.forEach(f => {
  const stat = fs.statSync(path.join(pozeDir, f));
  if (!allSizes[stat.size]) allSizes[stat.size] = [];
  allSizes[stat.size].push(f);
});

console.log('\n=== SAME-SIZE DUPLICATES (among all images) ===');
Object.entries(allSizes).filter(([k, v]) => v.length > 1).forEach(([size, files]) => {
  console.log(`Size ${size}: ${files.join(' | ')}`);
});
