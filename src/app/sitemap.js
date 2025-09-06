import { SITE_URL } from "@/config/site";

export default async function sitemap() {
  const base = SITE_URL.replace(/\/$/, "");
  const now = new Date().toISOString();
  const urls = [
    "/",
    "/construction",
    "/renovation",
    "/depannage",
    "/hivernage",
    "/entretien",
    "/terrasses",
    "/nos-realisations",
    "/contact",
  ];
  return urls.map((path, i) => ({
    url: `${base}${path}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: path === "/" ? 1.0 : 0.8,
  }));
}
