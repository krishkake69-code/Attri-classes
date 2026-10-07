const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, '../src/App.tsx');
let code = fs.readFileSync(file, 'utf8');

// replace the props passing in App.tsx
code = code.replace(/<Hero \/>/, '<Hero content={dynamicData?.heroContent} />');
code = code.replace(/<About \/>/, '<About content={dynamicData?.aboutContent} />');
code = code.replace(/<Method \/>/, '<Method methodology={dynamicData?.methodology} />');
code = code.replace(/<WhyChooseUs \/>/, '<WhyChooseUs features={dynamicData?.features} />');
code = code.replace(/<BatchSchedule \/>/, '<BatchSchedule batches={dynamicData?.batches} />');
code = code.replace(/<FAQ \/>/, '<FAQ faqs={dynamicData?.faqs} />');

fs.writeFileSync(file, code);
