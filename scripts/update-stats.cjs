const fs = require('fs');
const path = require('path');

let file = path.join(__dirname, '../src/components/Stats.tsx');
let code = fs.readFileSync(file, 'utf8');

code = code.replace(/interface StatsProps {[\s\S]*?}/, `interface StatsProps {
  stats?: { label: string; value: string; note: string }[];
}`);

code = code.replace(/const statsList = \[[\s\S]*?\];/, `const statsList = stats && stats.length > 0 ? stats : [
    { label: 'Students mentored', value: '1,240', note: 'across all batches since 2016' },
    { label: 'Cleared their target exam', value: '94.6%', note: 'board and entrance students combined' },
    { label: 'Years teaching chemistry', value: '11 yrs', note: 'sole faculty for every batch' },
    { label: 'Selections in NEET and JEE', value: '268', note: 'IITs, NITs and government medical colleges' }
  ];`);

fs.writeFileSync(file, code);
