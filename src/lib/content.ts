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
  serviceKey: ServiceKey;
  format: "reel" | "post" | "carousel";
  caption: string;
  tone: Tone;
  tamil?: string;
  // Drop real footage in /public/work and point to it here, e.g.
  // media: { kind: "video", src: "/work/christian-song.mp4", poster: "/work/christian-song.jpg" }
  media?: Media;
};

export const work: WorkItem[] = [
  {
    title: "Tamil Christian song",
    serviceKey: "video",
    format: "reel",
    caption: "A new Tamil Christian song, produced end to end. We handled the concept, the shoot, the edit and the final colour grade.",
    detail: "Full music video, shoot to final cut",
    service: "Video production",
    tone: "ink",
    tamil: "பாடல்",
  },
  {
    title: "LIK",
    media: { kind: "image", src: "/work/LIK.jpeg" },
    serviceKey: "influencer",
    format: "reel",
    caption: "Creator-led promotion for LIK, Love Insurance Kompany. We picked creators whose audiences go to the movies, briefed them properly and kept every post on schedule.",
    detail: "Film promotion through creators",
    service: "Influencer marketing",
    tone: "accent",
  },
  {
    title: "Aasife and Brothers Biriyani",
    serviceKey: "social",
    format: "carousel",
    caption: "We run the Aasife and Brothers page every month, and brought in creators for a campaign on top. More biriyani on more feeds.",
    detail: "Monthly social plus a creator campaign",
    service: "Social media and influencer",
    tone: "paper",
    tamil: "பிரியாணி",
  },
  {
    title: "Joel Prince",
    serviceKey: "personal",
    format: "post",
    caption: "Personal branding for a purpose coach. We shaped Joel's story and help him tell it on camera, week after week.",
    detail: "Personal brand for a purpose coach",
    service: "Personal branding",
    tone: "ink",
  },
  {
    title: "Senthil Balaji",
    serviceKey: "influencer",
    format: "reel",
    caption: "An influencer campaign, planned and briefed by us, with creators chosen for the audience it needed to reach.",
    detail: "Influencer campaign",
    service: "Influencer marketing",
    tone: "accent",
  },
  {
    title: "Five caterers",
    serviceKey: "social",
    format: "carousel",
    caption: "NS, Krishna, Sowndarya, Dharma and Meenakshi Catering all trust us with their social media. Five kitchens, five different feeds.",
    detail: "NS, Krishna, Sowndarya, Dharma and Meenakshi Catering",
    service: "Social media management",
    tone: "paper",
  },
  {
    title: "New car shoot",
    serviceKey: "video",
    format: "reel",
    caption: "A launch video for a new car, shot and cut for social.",
    detail: "Launch video for social",
    service: "Video production",
    tone: "ink",
  },
  {
    title: "Ajay",
    serviceKey: "personal",
    format: "post",
    caption: "Ajay founded Naina Kadai. We are making him the face of it, on camera and on the feed.",
    detail: "Founder of Naina Kadai",
    service: "Personal branding",
    tone: "accent",
  },
  {
    title: "Openings and birthdays",
    serviceKey: "video",
    format: "reel",
    caption: "Event films for shop openings and birthdays, cut short and sharp for the feed.",
    detail: "Event films for shop launches and celebrations",
    service: "Video production",
    tone: "paper",
  },
];

export type FeedItem = {
  kind: "client" | "noise";
  title: string;
  tag: string;
  tone: Tone;
  tamil?: string;
  // A real cover for the post, when we have one.
  image?: string;
};

// Real client posts, the ones the feed stops on.
const clientPosts: FeedItem[] = [
  { kind: "client", title: "Aasife and Brothers Biriyani", tag: "Social media", tone: "accent", tamil: "பிரியாணி" },
  { kind: "client", title: "LIK", tag: "Influencer campaign", tone: "ink", image: "/work/LIK.jpeg" },
  { kind: "client", title: "Tamil Christian song", tag: "Video production", tone: "accent", tamil: "பாடல்" },
  { kind: "client", title: "Joel Prince", tag: "Personal branding", tone: "ink" },
  { kind: "client", title: "Meenakshi Catering", tag: "Social media", tone: "accent" },
  { kind: "client", title: "Senthil Balaji", tag: "Influencer campaign", tone: "ink" },
  { kind: "client", title: "New car shoot", tag: "Video production", tone: "accent" },
  { kind: "client", title: "Naina Kadai", tag: "Personal branding", tone: "ink" },
  { kind: "client", title: "2021 Mobiles", tag: "Social media", tone: "accent" },
  { kind: "client", title: "Ne Forever", tag: "Influencer campaign", tone: "ink" },
];

// Everybody else's posts. The ones people scroll straight past.
const noise = [
  "Good morning!",
  "Sale ends soon",
  "Link in bio",
  "Throwback Thursday",
  "Tag a friend",
  "Happy Monday",
  "Coming soon",
  "Weekend vibes",
  "Don't miss out",
  "New post",
  "Swipe for more",
  "Guess what?",
];

// Three generic posts between every client post.
export const feed: FeedItem[] = clientPosts.flatMap((c, i) => [
  c,
  ...[0, 1, 2].map((j) => ({
    kind: "noise" as const,
    title: noise[(i * 3 + j) % noise.length],
    tag: j === 1 ? "Sponsored" : "Suggested",
    tone: "paper" as const,
  })),
]);

export const noisePosts = noise;

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

// "Tagged": everyone JustCliks has worked with, and what for.
export const tagged: { name: string; did: string; tone: Tone }[] = [
  { name: "Aasife and Brothers Biriyani", did: "Social media and creators", tone: "accent" },
  { name: "Meat Mr. Dosa", did: "Social media", tone: "ink" },
  { name: "2021 Mobiles", did: "Social media", tone: "paper" },
  { name: "NS Catering", did: "Social media", tone: "accent" },
  { name: "Krishna Catering", did: "Social media", tone: "ink" },
  { name: "Sowndarya Catering", did: "Social media", tone: "paper" },
  { name: "Dharma Catering", did: "Social media", tone: "accent" },
  { name: "Meenakshi Catering", did: "Social media", tone: "ink" },
  { name: "Senthil Balaji", did: "Influencer campaign", tone: "paper" },
  { name: "Pollachi Mahendran", did: "Influencer campaign", tone: "accent" },
  { name: "Ilyzly", did: "Influencer campaign", tone: "ink" },
  { name: "Supreme", did: "Influencer campaign", tone: "paper" },
  { name: "LIK", did: "Film promotion with creators", tone: "accent" },
  { name: "Ne Forever", did: "Influencer campaign", tone: "ink" },
  { name: "Naina Kadai", did: "Personal branding for Ajay", tone: "paper" },
  { name: "Joel Prince", did: "Personal branding", tone: "accent" },
];

// Profile counts, all taken from the client list above.
export const counts = [
  { n: 16, label: "Clients" },
  { n: 8, label: "Feeds we run" },
  { n: 7, label: "Creator campaigns" },
];

// Short labels for the highlight tiles, keyed by service.
export const highlightLabel: Record<ServiceKey, string> = {
  social: "Social",
  content: "Content",
  influencer: "Creators",
  video: "Video",
  personal: "Founders",
  branding: "Branding",
};
