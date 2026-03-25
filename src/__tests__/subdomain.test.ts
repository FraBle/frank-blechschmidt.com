import { describe, it, expect, vi } from "vitest";
import { extractSubdomain, handleSubdomain } from "../subdomain";

describe("extractSubdomain", () => {
  it("extracts subdomain from production domain", () => {
    expect(extractSubdomain("linkedin.frank-blechschmidt.com")).toBe(
      "linkedin",
    );
    expect(extractSubdomain("github.frank-blechschmidt.com")).toBe("github");
    expect(extractSubdomain("www.frank-blechschmidt.com")).toBe("www");
  });

  it("extracts subdomain from localhost", () => {
    expect(extractSubdomain("linkedin.localhost")).toBe("linkedin");
    expect(extractSubdomain("github.localhost")).toBe("github");
  });

  it("returns null for bare domain", () => {
    expect(extractSubdomain("frank-blechschmidt.com")).toBeNull();
  });

  it("returns null for unrelated hosts", () => {
    expect(extractSubdomain("example.com")).toBeNull();
    expect(extractSubdomain("localhost")).toBeNull();
  });
});

describe("handleSubdomain", () => {
  function makeContext(url: string) {
    return {
      request: new Request(url),
      redirect: vi.fn(
        (target: string, status: number) =>
          new Response(null, {
            status,
            headers: { Location: target },
          }),
      ),
    };
  }

  const next = vi.fn(() =>
    Promise.resolve(new Response("OK", { status: 200 })),
  );

  it("redirects known subdomains on production domain", async () => {
    const ctx = makeContext("https://linkedin.frank-blechschmidt.com/");
    const response = await handleSubdomain(ctx, next);

    expect(ctx.redirect).toHaveBeenCalledWith(
      "https://www.linkedin.com/in/fblechschmidt",
      302,
    );
    expect(response.status).toBe(302);
  });

  it("redirects known subdomains on localhost", async () => {
    const ctx = makeContext("http://github.localhost/");
    const response = await handleSubdomain(ctx, next);

    expect(ctx.redirect).toHaveBeenCalledWith(
      "https://github.com/FraBle",
      302,
    );
    expect(response.status).toBe(302);
  });

  it("returns 404 for unknown subdomains", async () => {
    const ctx = makeContext("https://unknown.frank-blechschmidt.com/");
    const response = await handleSubdomain(ctx, next);

    expect(response.status).toBe(404);
    expect(await response.text()).toBe("Not Found");
    expect(ctx.redirect).not.toHaveBeenCalled();
  });

  it("redirects www subdomain to main site", async () => {
    const ctx = makeContext("https://www.frank-blechschmidt.com/");
    const response = await handleSubdomain(ctx, next);

    expect(ctx.redirect).toHaveBeenCalledWith(
      "https://frank-blechschmidt.com",
      302,
    );
    expect(response.status).toBe(302);
  });

  it("passes through for bare domain (no subdomain)", async () => {
    next.mockClear();
    const ctx = makeContext("https://frank-blechschmidt.com/about");
    await handleSubdomain(ctx, next);

    expect(next).toHaveBeenCalled();
    expect(ctx.redirect).not.toHaveBeenCalled();
  });

  it("passes through for localhost without subdomain", async () => {
    next.mockClear();
    const ctx = makeContext("http://localhost:4321/about");
    await handleSubdomain(ctx, next);

    expect(next).toHaveBeenCalled();
    expect(ctx.redirect).not.toHaveBeenCalled();
  });

  it("redirects all configured subdomains correctly", async () => {
    const subdomains = [
      "linkedin",
      "github",
      "twitter",
      "facebook",
      "youtube",
      "soundcloud",
    ];
    for (const sub of subdomains) {
      const ctx = makeContext(`https://${sub}.frank-blechschmidt.com/`);
      const response = await handleSubdomain(ctx, next);
      expect(response.status).toBe(302);
      expect(ctx.redirect).toHaveBeenCalled();
    }
  });
});
