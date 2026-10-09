const fs = require('fs');

const files = ['index.html', 'script.js', 'styles.css'];
let totalMatches = 0;
const report = [];

files.forEach(f => {
  const content = fs.readFileSync(f, 'utf8');
  const matches = [...content.matchAll(/blockchain/gi)];
  totalMatches += matches.length;
  report.push(`${f}: ${matches.length} matches`);
});

report.push(`Total matches: ${totalMatches}`);
fs.writeFileSync('scratch/match_count.txt', report.join('\n'));

