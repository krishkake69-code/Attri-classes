const fs = require('fs');
const path = require('path');

const dataStorePath = path.join(__dirname, '../src/data-store.json');
const dataStore = JSON.parse(fs.readFileSync(dataStorePath, 'utf8'));

dataStore.siteContent = {
  bannerText: "Admissions open for 2026-2027 academic session. Limited seats per batch.",
  heroHeadline: "Chemistry that makes sense.",
  heroSubheadline: "We don't just teach equations. We build a fundamental understanding of matter that translates directly to top percentiles in NEET and JEE.",
  aboutHeading: "A legacy of making chemistry intuitive",
  aboutParagraph1: "Since 2016, Attri Chemistry Classes has been breaking down complex chemical phenomena into logical, digestible concepts. We believe memorization is the enemy of science.",
  aboutParagraph2: "Our methodology focuses on the 'why' before the 'how'. When students understand the underlying physical reasons behind organic mechanisms or inorganic trends, chemistry transforms from a burden into a scoring subject."
};

dataStore.stats = [
  { label: "Students Mentored", value: "12K+", detail: "Across NEET & JEE" },
  { label: "Best Rank", value: "AIR 42", detail: "In NEET UG" },
  { label: "Success Rate", value: "92%", detail: "Cleared Cutoff" },
  { label: "Top Percentile", value: "99.8", detail: "In JEE Mains" }
];

dataStore.methodology = [
  { title: "Conceptual Deconstruction", detail: "Breaking complex topics into fundamental principles." },
  { title: "Active Recall", detail: "Regular testing and memory reinforcement." },
  { title: "Personalized Analysis", detail: "Identifying weak spots and targeted improvement." },
  { title: "Board & Competitive Sync", detail: "Balancing school scores with entrance preparation." }
];

dataStore.features = [
  { title: "Micro Batches", description: "Never more than 25 students.", stat: "25", statLabel: "Max batch size", variant: "plain" },
  { title: "Doubt Resolution", description: "1-on-1 sessions every weekend.", stat: "24/7", statLabel: "Chat support", variant: "plain" }
];

dataStore.faqs = [
  { question: "What is the batch size?", answer: "We maintain a strict limit of 25 students per batch." },
  { question: "Do you provide study material?", answer: "Yes, comprehensive printed modules are provided." }
];

dataStore.batches = [
  { id: "batch-1", batch: "NEET Elite", audience: "Class 12", days: "Mon/Wed/Fri", time: "4 PM - 6 PM", seatsLeft: 5, seatsTotal: 25, mode: "Offline" }
];

fs.writeFileSync(dataStorePath, JSON.stringify(dataStore, null, 2));
console.log("data-store.json updated");
