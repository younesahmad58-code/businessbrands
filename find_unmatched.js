const fs = require('fs');
const path = require('path');

// Read products-data.js
const dataContent = fs.readFileSync(path.join(__dirname, 'js', 'products-data.js'), 'utf8');

// Extract all image paths referenced in products-data.js
const imageRefs = new Set();
const regex = /"(poze%20site\/[^"]+)"/g;
let match;
while ((match = regex.exec(dataContent)) !== null) {
  imageRefs.add(decodeURIComponent(match[1]));
}

console.log('Total image references in products-data.js:', imageRefs.size);

// Get all files in poze site root (not subfolders)
const pozeDir = path.join(__dirname, 'poze site');
const allFiles = fs.readdirSync(pozeDir);
const imageFiles = allFiles.filter(f => {
  const stat = fs.statSync(path.join(pozeDir, f));
  return stat.isFile() && /\.(jpg|jpeg|png|webp)$/i.test(f);
});

console.log('Total image files in poze site root:', imageFiles.length);

// Find unmatched
const unmatched = [];
imageFiles.forEach(f => {
  const relPath = 'poze site/' + f;
  if (!imageRefs.has(relPath)) {
    unmatched.push(f);
  }
});

console.log('\n=== UNMATCHED IMAGES (not in products-data.js) ===');
console.log('Count:', unmatched.length);
unmatched.forEach(f => console.log(f));

// Also check for duplicates in products-data.js (same image used twice)
const imageCount = {};
const regex2 = /"(poze%20site\/[^"]+)"/g;
let match2;
while ((match2 = regex2.exec(dataContent)) !== null) {
  const decoded = decodeURIComponent(match2[1]);
  imageCount[decoded] = (imageCount[decoded] || 0) + 1;
}
const duplicates = Object.entries(imageCount).filter(([k, v]) => v > 1);
if (duplicates.length > 0) {
  console.log('\n=== DUPLICATE IMAGE REFERENCES ===');
  duplicates.forEach(([img, count]) => console.log(`${count}x: ${img}`));
}

// Check for file size duplicates (potential visual duplicates)
const sizeMap = {};
imageFiles.forEach(f => {
  const stat = fs.statSync(path.join(pozeDir, f));
  if (!sizeMap[stat.size]) sizeMap[stat.size] = [];
  sizeMap[stat.size].push(f);
});
const sizeDupes = Object.entries(sizeMap).filter(([k, v]) => v.length > 1);
if (sizeDupes.length > 0) {
  console.log('\n=== SAME-SIZE FILES (potential duplicates) ===');
  sizeDupes.forEach(([size, files]) => {
    console.log(`Size ${size} bytes: ${files.join(' | ')}`);
  });
}
