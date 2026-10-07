const fs = require('fs');
const path = require('path');

// Hero.tsx
let heroFile = path.join(__dirname, '../src/components/Hero.tsx');
let heroCode = fs.readFileSync(heroFile, 'utf8');
heroCode = heroCode.replace('export default function Hero() {', `interface HeroProps {
  content?: { headline: string; subheadline: string };
}
export default function Hero({ content }: HeroProps) {`);
heroCode = heroCode.replace('Chemistry that makes<br className="hidden sm:block" /> sense.', '{content?.headline || "Chemistry that makes sense."}');
heroCode = heroCode.replace("We don't just teach equations. We build a fundamental understanding of matter that translates directly to top percentiles in NEET and JEE.", '{content?.subheadline || "We don\'t just teach equations. We build a fundamental understanding of matter that translates directly to top percentiles in NEET and JEE."}');
fs.writeFileSync(heroFile, heroCode);

// About.tsx
let aboutFile = path.join(__dirname, '../src/components/About.tsx');
let aboutCode = fs.readFileSync(aboutFile, 'utf8');
aboutCode = aboutCode.replace('export default function About() {', `interface AboutProps {
  content?: { heading: string; paragraph1: string; paragraph2: string };
}
export default function About({ content }: AboutProps) {`);
aboutCode = aboutCode.replace('A legacy of making chemistry intuitive', '{content?.heading || "A legacy of making chemistry intuitive"}');
aboutCode = aboutCode.replace('Since 2016, Attri Chemistry Classes has been breaking down complex chemical phenomena into logical, digestible concepts. We believe memorization is the enemy of science.', '{content?.paragraph1 || "Since 2016, Attri Chemistry Classes has been breaking down complex chemical phenomena into logical, digestible concepts. We believe memorization is the enemy of science."}');
aboutCode = aboutCode.replace("Our methodology focuses on the 'why' before the 'how'. When students understand the underlying physical reasons behind organic mechanisms or inorganic trends, chemistry transforms from a burden into a scoring subject.", "{content?.paragraph2 || \"Our methodology focuses on the 'why' before the 'how'. When students understand the underlying physical reasons behind organic mechanisms or inorganic trends, chemistry transforms from a burden into a scoring subject.\"}");
fs.writeFileSync(aboutFile, aboutCode);

// Method.tsx
let methodFile = path.join(__dirname, '../src/components/Method.tsx');
let methodCode = fs.readFileSync(methodFile, 'utf8');
methodCode = methodCode.replace('export default function Method() {', `import { MethodStep } from '../types';

interface MethodProps {
  methodology?: MethodStep[];
}
export default function Method({ methodology }: MethodProps) {`);
methodCode = methodCode.replace('METHOD_STEPS.map', '(methodology || METHOD_STEPS).map');
fs.writeFileSync(methodFile, methodCode);

// WhyChooseUs.tsx
let wcuFile = path.join(__dirname, '../src/components/WhyChooseUs.tsx');
let wcuCode = fs.readFileSync(wcuFile, 'utf8');
wcuCode = wcuCode.replace('export default function WhyChooseUs() {', `import { BentoFeature } from '../types';

interface WCUProps {
  features?: BentoFeature[];
}
export default function WhyChooseUs({ features }: WCUProps) {`);
wcuCode = wcuCode.replace('BENTO_FEATURES.map', '(features || BENTO_FEATURES).map');
fs.writeFileSync(wcuFile, wcuCode);

// BatchSchedule.tsx
let batchFile = path.join(__dirname, '../src/components/BatchSchedule.tsx');
let batchCode = fs.readFileSync(batchFile, 'utf8');
batchCode = batchCode.replace('export default function BatchSchedule() {', `import { BatchSlot } from '../types';

interface BatchProps {
  batches?: BatchSlot[];
}
export default function BatchSchedule({ batches }: BatchProps) {`);
batchCode = batchCode.replace('BATCH_SCHEDULE.map', '(batches || BATCH_SCHEDULE).map');
fs.writeFileSync(batchFile, batchCode);

// FAQ.tsx
let faqFile = path.join(__dirname, '../src/components/FAQ.tsx');
let faqCode = fs.readFileSync(faqFile, 'utf8');
faqCode = faqCode.replace('export default function FAQ() {', `import { FaqItem } from '../types';

interface FAQProps {
  faqs?: FaqItem[];
}
export default function FAQ({ faqs }: FAQProps) {`);
faqCode = faqCode.replace('FAQS.map', '(faqs || FAQS).map');
fs.writeFileSync(faqFile, faqCode);
