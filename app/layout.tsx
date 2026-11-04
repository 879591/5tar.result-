import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://5tarresult.com"),
  title: {
    default: "5tarResult — आपके सपनों की तैयारी, एक ही जगह!",
    template: "%s | 5tarResult",
  },
  description:
    "5tarResult educational portal for Sarkari Results, Exams, Admissions, Jobs, Mock Tests, and Study Material.",
  keywords: [
    "5tarResult",
    "Sarkari Result",
    "Sarkari Job 2026",
    "Admit Card",
    "Navodaya Vidyalaya JNVST",
    "SSC GD",
    "UP Police Bharti",
    "Railway RRB",
    "Free Mock Test",
    "Study Material Hindi",
  ],
  authors: [{ name: "Suraj Maurya" }],
  creator: "Suraj Maurya",
  publisher: "5tarResult",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: "5tarResult — आपके सपनों की तैयारी, एक ही जगह!",
    description:
      "5tarResult educational portal for Sarkari Results, Exams, Admissions, Jobs, Mock Tests, and Study Material.",
    url: "https://5tarresult.com",
    siteName: "5tarResult",
    locale: "hi_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "5tarResult — आपके सपनों की तैयारी, एक ही जगह!",
    description:
      "5tarResult educational portal for Sarkari Results, Exams, Admissions, Jobs, Mock Tests, and Study Material.",
  },
  icons: {
    icon: "/logo.svg",
    apple: "/logo.svg",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": "https://5tarresult.com/#website",
      "url": "https://5tarresult.com",
      "name": "5tarResult",
      "description": "भारत का विश्वसनीय शैक्षिक एवं सरकारी नौकरी अलर्ट पोर्टल",
      "inLanguage": "hi-IN",
      "potentialAction": {
        "@type": "SearchAction",
        "target": "https://5tarresult.com/jobs?q={search_term_string}",
        "query-input": "required name=search_term_string",
      },
    },
    {
      "@type": "EducationalOrganization",
      "@id": "https://5tarresult.com/#organization",
      "name": "5tarResult",
      "url": "https://5tarresult.com",
      "logo": "https://5tarresult.com/logo.svg",
      "founder": {
        "@type": "Person",
        "name": "Suraj Maurya",
      },
      "sameAs": [],
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="hi">
      <head>
        <link rel="icon" href="/logo.svg" type="image/svg+xml" />
        <meta name="theme-color" content="#0b1c2c" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="bg-navy text-[#f5f7fa] min-h-screen flex flex-col antialiased">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
