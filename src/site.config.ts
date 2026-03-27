import type { PortfolioConfig } from "dev-portfolio-ai";
import { basics } from "./resume";

export const themeConfig: PortfolioConfig = {
  title: basics.name,
  description: `Resume of ${basics.name}.`,
  author: basics.name,
  site: basics.url,
  theme: "default",
  nav: [],
  footer: {
    text: "Privacy Policy",
    url: "https://www.iubenda.com/privacy-policy/35628899",
    blank: true,
  },
  openGraph: {
    image: "/avatar.jpg",
    type: "website",
    locale: "en_US",
    siteName: basics.name,
  },
  twitter: {
    card: "summary",
    creator: /* v8 ignore next */ `@${basics.profiles.find((p) => p.network === "X")?.username ?? ""}`,
  },
  socialProfiles: basics.profiles.map((p) => p.url),
};

export const redirects: Record<string, string> = {
  linkedin: "https://www.linkedin.com/in/fblechschmidt",
  github: "https://github.com/FraBle",
  twitter: "https://x.com/FraBle90",
  facebook: "https://www.facebook.com/FraBle90",
  youtube: "https://www.youtube.com/c/FrankBlechschmidt",
  soundcloud: "https://soundcloud.com/frable90",
  www: "https://frank-blechschmidt.com",
};
