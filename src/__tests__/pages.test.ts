import { describe, it, expect } from "vitest";
import { GET as getResumeJson } from "../pages/resume.json";
import { GET as getAiPlugin } from "../pages/.well-known/ai-plugin.json";
import { GET as getMcpJson } from "../pages/.well-known/mcp.json";
import { GET as getSecurityTxt } from "../pages/.well-known/security.txt";
import { GET as getWebfinger } from "../pages/.well-known/webfinger";

// Minimal mock for Astro's APIContext
const mockContext = (urlStr: string) =>
  ({
    url: new URL(urlStr),
    request: new Request(urlStr),
  }) as Parameters<typeof getWebfinger>[0];

describe("resume.json", () => {
  it("returns valid JSON Resume format", async () => {
    const response = getResumeJson(mockContext("https://frank-blechschmidt.com/resume.json"));
    const body = await response.json();

    expect(body.$schema).toContain("jsonresume");
    expect(body.basics.name).toBe("Frank Blechschmidt");
    expect(body.basics.label).toBe("Engineering Manager");
    expect(body.basics.profiles).toHaveLength(3);
    expect(body.work.length).toBeGreaterThan(0);
    expect(body.work[0].name).toBe("Lattice");
    expect(body.work[0]).not.toHaveProperty("endDate");
    expect(body.work[1]).toHaveProperty("endDate");
    expect(body.education).toHaveLength(2);
    expect(body.skills.length).toBeGreaterThan(0);
    expect(body.projects).toHaveLength(2);
    expect(body.patents).toHaveLength(1);
    expect(body.meta.canonical).toContain("resume.json");
  });

  it("returns application/json content type", () => {
    const response = getResumeJson(mockContext("https://frank-blechschmidt.com/resume.json"));
    expect(response.headers.get("content-type")).toBe("application/json");
  });
});

describe("ai-plugin.json", () => {
  it("returns valid plugin manifest", async () => {
    const response = getAiPlugin(mockContext("https://frank-blechschmidt.com/.well-known/ai-plugin.json"));
    const body = await response.json();

    expect(body.schema_version).toBe("v1");
    expect(body.name_for_model).toBe("frank_blechschmidt");
    expect(body.auth.type).toBe("none");
    expect(body.api.url).toContain("llms.txt");
    expect(body.contact_email).toBeTruthy();
  });
});

describe("mcp.json", () => {
  it("returns MCP discovery info", async () => {
    const response = getMcpJson(mockContext("https://frank-blechschmidt.com/.well-known/mcp.json"));
    const body = await response.json();

    expect(body.url).toBe("https://frank-blechschmidt.com/mcp");
    expect(body.transport).toBe("streamable-http");
    expect(body.version).toBe("2025-11-25");
  });
});

describe("security.txt", () => {
  it("returns RFC 9116 formatted text", async () => {
    const response = getSecurityTxt(mockContext("https://frank-blechschmidt.com/.well-known/security.txt"));
    const body = await response.text();

    expect(body).toContain("Contact: mailto:");
    expect(body).toContain("Expires:");
    expect(body).toContain("Preferred-Languages: en, de");
    expect(body).toContain("Canonical:");
    expect(response.headers.get("content-type")).toBe("text/plain");
  });
});

describe("webfinger", () => {
  it("resolves acct: resource", () => {
    const response = getWebfinger(
      mockContext("https://frank-blechschmidt.com/.well-known/webfinger?resource=acct:frank@frank-blechschmidt.com"),
    );
    expect(response.status).toBe(200);
    expect(response.headers.get("content-type")).toBe("application/jrd+json");
    expect(response.headers.get("access-control-allow-origin")).toBe("*");
  });

  it("resolves https: resource", async () => {
    const response = getWebfinger(
      mockContext("https://frank-blechschmidt.com/.well-known/webfinger?resource=https://frank-blechschmidt.com"),
    );
    const body = await response.json();

    expect(body.subject).toBe("acct:frank@frank-blechschmidt.com");
    expect(body.links).toHaveLength(3);
    expect(body.links[0].rel).toContain("profile-page");
  });

  it("returns 404 for unknown resource", async () => {
    const response = getWebfinger(
      mockContext("https://frank-blechschmidt.com/.well-known/webfinger?resource=acct:unknown@example.com"),
    );
    expect(response.status).toBe(404);
    const body = await response.json();
    expect(body.error).toBe("Resource not found");
  });

  it("returns 404 for missing resource param", () => {
    const response = getWebfinger(
      mockContext("https://frank-blechschmidt.com/.well-known/webfinger"),
    );
    expect(response.status).toBe(404);
  });
});

