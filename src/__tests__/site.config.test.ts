import { describe, it, expect } from "vitest";
import { themeConfig, redirects } from "../site.config";

describe("themeConfig", () => {
  it("has required fields", () => {
    expect(themeConfig.title).toBe("Frank Blechschmidt");
    expect(themeConfig.description).toBe("Resume of Frank Blechschmidt.");
    expect(themeConfig.author).toBe("Frank Blechschmidt");
  });

  it("delegates favicon to astro-favicons plugin", () => {
    expect(themeConfig).not.toHaveProperty("favicon");
  });

  it("has SEO config", () => {
    expect(themeConfig.site).toBe("https://frank-blechschmidt.com");
    expect(themeConfig.openGraph?.image).toBe("/avatar.jpg");
    expect(themeConfig.twitter?.creator).toBe("@FraBle90");
  });

  it("has three nav items", () => {
    expect(themeConfig.nav).toHaveLength(3);
    expect(themeConfig.nav[0]).toEqual({ name: "About", url: "/about" });
    expect(themeConfig.nav[1]).toEqual({
      name: "Resume",
      url: "/resume_frank_blechschmidt.pdf",
    });
    expect(themeConfig.nav[2]).toEqual({ name: "Contact", url: "/contact" });
  });

  it("has footer config", () => {
    expect(themeConfig.footer).toEqual({
      text: "Privacy Policy",
      url: "https://www.iubenda.com/privacy-policy/35628899",
      blank: true,
    });
  });

  it("does not have Google Analytics or consent config", () => {
    expect(themeConfig).not.toHaveProperty("googleAnalyticsId");
    expect(themeConfig).not.toHaveProperty("consent");
  });
});

describe("redirects", () => {
  it("contains all expected subdomain mappings", () => {
    expect(Object.keys(redirects)).toHaveLength(7);
    expect(redirects.linkedin).toBe(
      "https://www.linkedin.com/in/fblechschmidt",
    );
    expect(redirects.github).toBe("https://github.com/FraBle");
    expect(redirects.twitter).toBe("https://twitter.com/FraBle90");
    expect(redirects.facebook).toBe("https://www.facebook.com/FraBle90");
    expect(redirects.youtube).toBe(
      "https://www.youtube.com/c/FrankBlechschmidt",
    );
    expect(redirects.soundcloud).toBe("https://soundcloud.com/frable90");
    expect(redirects.www).toBe("https://frank-blechschmidt.com");
  });

  it("all values are valid URLs", () => {
    for (const url of Object.values(redirects)) {
      expect(() => new URL(url)).not.toThrow();
    }
  });
});
