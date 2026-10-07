const fs = require('fs');
const path = require('path');
const dataStorePath = path.join(__dirname, '../src/data-store.json');
const dataStore = JSON.parse(fs.readFileSync(dataStorePath, 'utf8'));

dataStore.heroContent = {
  headline: "Chemistry that makes sense.",
  subheadline: "We don't just teach equations. We build a fundamental understanding of matter that translates directly to top percentiles in NEET and JEE."
};

dataStore.aboutContent = {
  heading: "A legacy of making chemistry intuitive",
  paragraph1: "Since 2016, Attri Chemistry Classes has been breaking down complex chemical phenomena into logical, digestible concepts. We believe memorization is the enemy of science.",
  paragraph2: "Our methodology focuses on the 'why' before the 'how'. When students understand the underlying physical reasons behind organic mechanisms or inorganic trends, chemistry transforms from a burden into a scoring subject."
};

dataStore.stats = [
  { label: "Students Mentored", value: "12K+", note: "Across NEET & JEE" },
  { label: "Best Rank", value: "AIR 42", note: "In NEET UG" },
  { label: "Success Rate", value: "92%", note: "Cleared Cutoff" },
  { label: "Top Percentile", value: "99.8", note: "In JEE Mains" }
];

dataStore.methodology = [
  { title: "Diagnose", detail: "A baseline paper and a chapter-wise gap map in the first week, so teaching starts from where the student actually is." },
  { title: "Build", detail: "Concepts from first principles. Derivations on the board, mechanisms drawn step by step, no shortcut before the logic." },
  { title: "Drill", detail: "Daily practice problems with video solutions, weekly timed sets and a personal error notebook that travels with you." },
  { title: "Simulate", detail: "Full NEET and JEE pattern papers every Sunday, graded on the same marking scheme as the real examination." }
];

dataStore.features = [
  { title: "Micro batches", description: "Never more than 25 students. Personal attention isn't a promise, it's structurally guaranteed.", stat: "25", statLabel: "max batch size", variant: "plain" },
  { title: "Doubt resolution", description: "1-on-1 sessions every weekend. We don't move to the next chapter until every hand goes down.", stat: "24/7", statLabel: "WhatsApp support", variant: "plain" }
];

dataStore.faqs = [
  { question: "How large are the batches?", answer: "Batches are capped at 18 students for entrance programmes and 20 for board and foundation programmes. Seats are not added mid-session." },
  { question: "Can my child attend a demo before enrolling?", answer: "Yes. Every student gets three free demo lectures and one doubt session before the fee is due. No card or advance payment is collected for the demo." }
];

dataStore.batches = [
  { id: "batch-1", batch: "NEET Elite", audience: "Class 12", days: "Mon, Wed, Fri", time: "4:00 - 5:30 PM", seatsLeft: 5, seatsTotal: 25, mode: "Offline" },
  { id: "batch-2", batch: "JEE Advanced", audience: "Class 11", days: "Tue, Thu, Sat", time: "6:00 - 7:30 PM", seatsLeft: 2, seatsTotal: 20, mode: "Hybrid" }
];

fs.writeFileSync(dataStorePath, JSON.stringify(dataStore, null, 2));
