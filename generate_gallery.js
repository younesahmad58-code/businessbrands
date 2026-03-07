const fs = require('fs');
const path = require('path');

// Read products-data.js
const dataContent = fs.readFileSync(path.join(__dirname, 'js', 'products-data.js'), 'utf8');

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

// Generate HTML gallery
let html = `<!DOCTYPE html>
<html>
<head>
<title>Unmatched Images Gallery (${unmatched.length} images)</title>
<style>
body { background: #111; color: #fff; font-family: Arial; padding: 20px; }
h1 { text-align: center; }
.grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 15px; }
.card { background: #222; border-radius: 8px; overflow: hidden; }
.card img { width: 100%; height: 250px; object-fit: contain; background: #fff; }
.card .name { padding: 8px; font-size: 11px; word-break: break-all; text-align: center; }
.card .idx { color: #0af; font-weight: bold; }
</style>
</head>
<body>
<h1>Unmatched Images (${unmatched.length})</h1>
<div class="grid">
`;

unmatched.forEach((f, i) => {
  html += `<div class="card">
  <img src="poze%20site/${encodeURIComponent(f)}" loading="lazy" />
  <div class="name"><span class="idx">#${i+1}</span> ${f}</div>
</div>\n`;
});

html += '</div></body></html>';
fs.writeFileSync(path.join(__dirname, 'gallery.html'), html, 'utf8');
console.log('Generated gallery.html with', unmatched.length, 'unmatched images');
console.log('Open file:///c:/Users/Ahmad/Desktop/businessbrands/gallery.html in browser');
