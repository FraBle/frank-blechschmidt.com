import type { ResearcherConfig } from "astro-researcher-theme";

export const themeConfig: ResearcherConfig = {
  title: "Frank Blechschmidt",
  description: "Resume of Frank Blechschmidt.",
  author: "Frank Blechschmidt",
  site: "https://frank-blechschmidt.com",
  favicon: "/favicon.ico",
  googleAnalyticsId: "G-CDE67XQDXJ",
  nav: [
    { name: "About", url: "/about" },
    { name: "Resume", url: "/resume_frank_blechschmidt.pdf" },
    { name: "Contact", url: "/contact" },
  ],
  footer: {
    text: "Privacy Policy",
    url: "https://www.iubenda.com/privacy-policy/35628899",
    blank: true,
  },
  openGraph: {
    image: "/avatar.jpg",
    type: "website",
    locale: "en_US",
    siteName: "Frank Blechschmidt",
  },
  twitter: {
    card: "summary",
    creator: "@FraBle90",
  },
  consent: {
    items: [
      {
        title: "Google Analytics",
        description:
          "We'd like to set Google Analytics cookies to help us to improve the website by collecting and reporting information on how you use it. For more information on how these cookies work please see the 'Privacy' page. The cookies collect information in an anonymous form.",
        isFunctional: false,
        script: "https://www.googletagmanager.com/gtag/js",
      },
    ],
  },
};

export const redirects: Record<string, string> = {
  linkedin: "https://www.linkedin.com/in/fblechschmidt",
  github: "https://github.com/FraBle",
  twitter: "https://twitter.com/FraBle90",
  facebook: "https://www.facebook.com/FraBle90",
  youtube: "https://www.youtube.com/c/FrankBlechschmidt",
  soundcloud: "https://soundcloud.com/frable90",
  www: "https://frank-blechschmidt.com",
};
