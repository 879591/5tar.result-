import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://5tarresult.com";

  const routes = [
    "",
    "/jobs",
    "/exams",
    "/results",
    "/admissions",
    "/study-material",
    "/mock-tests",
    "/tools",
    "/ai-help",
    "/about",
    "/contact",
    "/privacy-policy",
    "/terms",
    "/disclaimer",
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" || route === "/jobs" || route === "/results" ? "daily" : "weekly",
    priority: route === "" ? 1.0 : route === "/jobs" || route === "/results" ? 0.9 : 0.8,
  }));
}
