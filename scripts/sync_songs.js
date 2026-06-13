const fs = require('fs');
const path = require('path');

const repoRoot = path.resolve(__dirname, '..');
const songsDir = path.join(repoRoot, 'songs');
const htmlPath = path.join(repoRoot, 'birthday-ummah.html');
const exts = ['.mp3', '.m4a', '.wav', '.ogg', '.flac', '.aac'];

if (!fs.existsSync(htmlPath)) {
  console.error('Error: birthday-ummah.html not found in', repoRoot);
  process.exit(1);
}
if (!fs.existsSync(songsDir)) {
  console.error('Error: songs directory not found at', songsDir);
  process.exit(1);
}

let files = fs.readdirSync(songsDir).filter(f => exts.includes(path.extname(f).toLowerCase()));
files = files.sort();

const formatted = files.map(f => `  '${f.replace(/'/g, "\\'")}'`).join(',\n');
const newArray = `const SONG_FILES = [\n${formatted}\n];`;

const html = fs.readFileSync(htmlPath, 'utf8');
const updated = html.replace(/const\s+SONG_FILES\s*=\s*\[[\s\S]*?\];/m, newArray);

if (html === updated) {
  console.log('No changes to SONG_FILES.');
} else {
  fs.writeFileSync(htmlPath, updated, 'utf8');
  console.log('Updated SONG_FILES in birthday-ummah.html with', files.length, 'files.');
}
