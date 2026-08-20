const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// The file got corrupted with multiple passes of bad encoding.
// Replace bad patterns with proper characters
html = html.replace(/Ã¢â‚¬â€ /g, '—');
html = html.replace(/A,\?\?/g, '—');
html = html.replace(/A\?-/g, '↗');
html = html.replace(/A,\?/g, '—');
html = html.replace(/A\?/g, '↓');
html = html.replace(/\?"/g, '—');
html = html.replace(/\+-/g, '↗');

html = html.replace(/New message from portfolio[^"]+Selva Kumar R"/, 'New message from portfolio — Selva Kumar R"');
html = html.replace(/>LinkedIn[^<]+</, '>LinkedIn ↗<');
html = html.replace(/>GitHub[^<]+</, '>GitHub ↗<');

// Education row dash
html = html.replace(/2024.*2028/, '2024 &ndash; 2028');

fs.writeFileSync('index.html', html, 'utf8');
console.log('Fixed encoding in index.html');
