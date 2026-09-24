// Business details. Anything left as an empty string is hidden on the site,
// so fill these in as they are confirmed rather than guessing.
export const site: Record<
  "name" | "url" | "region" | "email" | "phone" | "whatsapp" | "instagram" | "youtube" | "address" | "legalUpdated",
  string
> = {
  name: "JustCliks",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  region: "Tamil Nadu",
  email: "", // e.g. hello@justcliks.com
  phone: "", // e.g. +91 98xxx xxxxx
  whatsapp: "", // digits only with country code, e.g. 9198xxxxxxxx
  instagram: "", // full profile URL
  youtube: "", // full channel URL
  address: "", // shown in the footer and legal pages when set
  legalUpdated: "24 September 2026",
};

export const whatsappLink = site.whatsapp
  ? `https://wa.me/${site.whatsapp}`
  : "";
