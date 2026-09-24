export type Tone = "accent" | "ink" | "paper";

export type ServiceKey =
  | "content"
  | "social"
  | "branding"
  | "personal"
  | "influencer"
  | "video";

export type Service = {
  key: ServiceKey;
  name: string;
  line: string;
  clients: string[];
  note?: string;
};

export const services: Service[] = [
  {
    key: "social",
    name: "Social media management",
    line: "We run the calendar, the posting and the replies, so your page stays active every week, festival season included.",
    clients: [
      "Aasife and Brothers Biriyani",
      "Meat Mr. Dosa",
      "2021 Mobiles",
      "NS Catering",
      "Krishna Catering",
      "Sowndarya Catering",
      "Dharma Catering",
      "Meenakshi Catering",
    ],
  },
  {
    key: "content",
    name: "Content creation",
    line: "Reels, carousels and stories planned around what your customers actually look for, then shot and cut for each platform.",
    clients: [],
    note: "Behind every feed and campaign we run",
  },
  {
    key: "influencer",
    name: "Influencer marketing",
    line: "We match you with creators your audience already follows, brief them properly and follow up on how every post performs.",
    clients: [
      "Senthil Balaji",
      "Pollachi Mahendran",
      "Ilyzly",
      "Aasife Biriyani",
      "Supreme",
      "LIK, the movie",
      "Ne Forever",
    ],
  },
  {
    key: "video",
    name: "Video production",
    line: "Music videos, product shoots and event films, from the first storyboard to the final colour grade.",
    clients: [
      "A new Tamil Christian song",
      "A new car shoot",
      "Birthday events",
      "New shop openings",
    ],
  },
  {
    key: "personal",
    name: "Personal branding",
    line: "For founders and coaches who want to be the face of their work. We shape the story, then help you tell it on camera.",
    clients: ["Ajay, founder of Naina Kadai", "Joel Prince, purpose coach"],
  },
  {
    key: "branding",
    name: "Branding",
    line: "Logo, colours, type and tone of voice, built as one system so every post looks like it came from you.",
    clients: [],
    note: "From the first logo sketch to a full launch kit",
  },
];

export const serviceName = (key: ServiceKey) =>
  services.find((s) => s.key === key)?.name ?? key;

// Every name in the brief, deduplicated. Aasife Biriyani appears once.
export const clients = [
  "Aasife and Brothers Biriyani",
  "Meat Mr. Dosa",
  "2021 Mobiles",
  "Senthil Balaji",
  "NS Catering",
  "LIK",
  "Krishna Catering",
  "Pollachi Mahendran",
  "Sowndarya Catering",
  "Ilyzly",
  "Dharma Catering",
  "Supreme",
  "Meenakshi Catering",
  "Ne Forever",
  "Naina Kadai",
  "Joel Prince",
];

export type Media = {
  kind: "video" | "image";
  src: string;
  poster?: string;
};

export type WorkItem = {
  title: string;
  detail: string;
  service: string;
  tone: Tone;
  tamil?: string;
  // Drop real footage in /public/work and point to it here, e.g.
  // media: { kind: "video", src: "/work/christian-song.mp4", poster: "/work/christian-song.jpg" }
  media?: Media;
};

export const work: WorkItem[] = [
  {
    title: "Tamil Christian song",
    detail: "Full music video, shoot to final cut",
    service: "Video production",
    tone: "ink",
    tamil: "பாடல்",
  },
  {
    title: "LIK",
    detail: "Film promotion through creators",
    service: "Influencer marketing",
    tone: "accent",
  },
  {
    title: "Aasife and Brothers Biriyani",
    detail: "Monthly social plus a creator campaign",
    service: "Social media and influencer",
    tone: "paper",
    tamil: "பிரியாணி",
  },
  {
    title: "Joel Prince",
    detail: "Personal brand for a purpose coach",
    service: "Personal branding",
    tone: "ink",
  },
  {
    title: "Senthil Balaji",
    detail: "Influencer campaign",
    service: "Influencer marketing",
    tone: "accent",
  },
  {
    title: "Five caterers",
    detail: "NS, Krishna, Sowndarya, Dharma and Meenakshi Catering",
    service: "Social media management",
    tone: "paper",
  },
  {
    title: "New car shoot",
    detail: "Launch video for social",
    service: "Video production",
    tone: "ink",
  },
  {
    title: "Ajay",
    detail: "Founder of Naina Kadai",
    service: "Personal branding",
    tone: "accent",
  },
  {
    title: "Openings and birthdays",
    detail: "Event films for shop launches and celebrations",
    service: "Video production",
    tone: "paper",
  },
];

// What rolls through the hero viewfinder.
export const feed: { title: string; tag: string; tone: Tone; tamil?: string }[] = [
  { title: "Aasife and Brothers Biriyani", tag: "Social media", tone: "accent", tamil: "பிரியாணி" },
  { title: "LIK", tag: "Influencer campaign", tone: "ink" },
  { title: "Tamil Christian song", tag: "Video production", tone: "paper", tamil: "பாடல்" },
  { title: "Joel Prince", tag: "Personal branding", tone: "accent" },
  { title: "Meenakshi Catering", tag: "Social media", tone: "ink" },
  { title: "Senthil Balaji", tag: "Influencer campaign", tone: "paper" },
  { title: "New car shoot", tag: "Video production", tone: "accent" },
  { title: "Naina Kadai", tag: "Personal branding", tone: "ink" },
  { title: "2021 Mobiles", tag: "Social media", tone: "paper" },
  { title: "Ne Forever", tag: "Influencer campaign", tone: "accent" },
];

export const stats = [
  { n: 8, label: "brands trust us to run their social media" },
  { n: 7, label: "influencer campaigns, from a film launch to biriyani" },
  { n: 5, label: "catering companies on our posting calendar" },
  { n: 2, label: "founders we made the face of their business" },
];

export const goals: { id: string; label: string; services: ServiceKey[] }[] = [
  { id: "orders", label: "More orders from my page", services: ["social", "content"] },
  { id: "launch", label: "A launch people talk about", services: ["influencer", "video"] },
  { id: "face", label: "To be the face of my business", services: ["personal", "content"] },
  { id: "brand", label: "A brand that looks the part", services: ["branding"] },
  { id: "film", label: "A song, event or shoot filmed", services: ["video"] },
];
