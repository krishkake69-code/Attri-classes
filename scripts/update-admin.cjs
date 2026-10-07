const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, '../src/components/AdminPanel.tsx');
let code = fs.readFileSync(file, 'utf8');

// 1. Add new state tabs to type
code = code.replace(/type TabType = 'general' \| 'courses' \| 'results' \| 'testimonials' \| 'gallery' \| 'mailbox';/, 
  "type TabType = 'general' | 'courses' | 'results' | 'testimonials' | 'gallery' | 'mailbox' | 'siteContent' | 'batches' | 'faqs';");

// 2. Add new tabs to sidebar
const newTabs = `
                  <button
                    onClick={() => setActiveTab('siteContent')}
                    className={\`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-colors flex items-center gap-3 \${
                      activeTab === 'siteContent' 
                        ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' 
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                    }\`}
                  >
                    <Settings className="h-4 w-4" />
                    Site Content
                  </button>
                  <button
                    onClick={() => setActiveTab('batches')}
                    className={\`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-colors flex items-center gap-3 \${
                      activeTab === 'batches' 
                        ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' 
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                    }\`}
                  >
                    <Calendar className="h-4 w-4" />
                    Batches
                  </button>
                  <button
                    onClick={() => setActiveTab('faqs')}
                    className={\`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-colors flex items-center gap-3 \${
                      activeTab === 'faqs' 
                        ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' 
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                    }\`}
                  >
                    <MessageCircle className="h-4 w-4" />
                    FAQs
                  </button>
`;
code = code.replace(/(\s*<button[\s\S]*?activeTab === 'mailbox'[\s\S]*?<\/button>)/, "$1" + newTabs);

// 3. Import new icons
code = code.replace(/import \{([\s\S]*?)\} from 'lucide-react';/, "import { $1, Settings, Calendar, MessageCircle } from 'lucide-react';");

// 4. Initialize formData with new fields
code = code.replace(/const \[formData, setFormData\] = useState<any>\(\{/, `const [formData, setFormData] = useState<any>({
    heroContent: { headline: '', subheadline: '' },
    aboutContent: { heading: '', paragraph1: '', paragraph2: '' },
    stats: [],
    methodology: [],
    features: [],
    faqs: [],
    batches: [],`);

code = code.replace(/if \(initialData\) \{[\s\S]*?setFormData\(\{/, `if (initialData) {
      setFormData({
        ...initialData,
        heroContent: initialData.heroContent || { headline: '', subheadline: '' },
        aboutContent: initialData.aboutContent || { heading: '', paragraph1: '', paragraph2: '' },
        stats: initialData.stats || [],
        methodology: initialData.methodology || [],
        features: initialData.features || [],
        faqs: initialData.faqs || [],
        batches: initialData.batches || [],`);

fs.writeFileSync(file, code);
