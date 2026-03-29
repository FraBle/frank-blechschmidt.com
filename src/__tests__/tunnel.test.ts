import { describe, it, expect, vi } from "vitest";
import { parseDsn, handleTunnelRequest } from "../tunnel";

const TEST_DSN = "https://abc123@o123.ingest.us.sentry.io/456";
const VALID_CONFIG = parseDsn(TEST_DSN)!;

function makeEnvelope(dsn: string): string {
  return JSON.stringify({ dsn }) + "\n{}";
}

describe("parseDsn", () => {
  it("parses a valid DSN", () => {
    const result = parseDsn(TEST_DSN);
    expect(result).toEqual({
      host: "o123.ingest.us.sentry.io",
      projectId: "456",
    });
  });

  it("returns null for undefined", () => {
    expect(parseDsn(undefined)).toBeNull();
  });

  it("returns null for empty string", () => {
    expect(parseDsn("")).toBeNull();
  });

  it("returns null for invalid URL", () => {
    expect(parseDsn("not-a-url")).toBeNull();
  });
});

describe("handleTunnelRequest", () => {
  it("returns 500 when DSN config is null", async () => {
    const request = new Request("https://example.com/tunnel", { method: "POST" });
    const response = await handleTunnelRequest(request, null);
    expect(response.status).toBe(500);
  });

  it("returns 400 for invalid DSN host", async () => {
    const envelope = makeEnvelope("https://key@evil.example.com/456");
    const request = new Request("https://example.com/tunnel", {
      method: "POST",
      body: envelope,
    });
    const response = await handleTunnelRequest(request, VALID_CONFIG);
    expect(response.status).toBe(400);
    expect(await response.text()).toBe("Invalid DSN host");
  });

  it("returns 400 for invalid project ID", async () => {
    const envelope = makeEnvelope("https://key@o123.ingest.us.sentry.io/999");
    const request = new Request("https://example.com/tunnel", {
      method: "POST",
      body: envelope,
    });
    const response = await handleTunnelRequest(request, VALID_CONFIG);
    expect(response.status).toBe(400);
    expect(await response.text()).toBe("Invalid project");
  });

  it("returns 400 for malformed JSON", async () => {
    const request = new Request("https://example.com/tunnel", {
      method: "POST",
      body: "not json",
    });
    const response = await handleTunnelRequest(request, VALID_CONFIG);
    expect(response.status).toBe(400);
    expect(await response.text()).toBe("Invalid envelope");
  });

  it("forwards valid envelope upstream", async () => {
    const envelope = makeEnvelope(TEST_DSN);
    const request = new Request("https://example.com/tunnel", {
      method: "POST",
      body: envelope,
    });

    const mockFetch = vi.fn().mockResolvedValue(new Response("ok", { status: 200 }));
    vi.stubGlobal("fetch", mockFetch);

    const response = await handleTunnelRequest(request, VALID_CONFIG);
    expect(response.status).toBe(200);
    expect(mockFetch).toHaveBeenCalledWith(
      "https://o123.ingest.us.sentry.io/api/456/envelope/",
      expect.objectContaining({ method: "POST" }),
    );

    vi.unstubAllGlobals();
  });

  it("returns 502 on upstream fetch failure", async () => {
    const envelope = makeEnvelope(TEST_DSN);
    const request = new Request("https://example.com/tunnel", {
      method: "POST",
      body: envelope,
    });

    const mockFetch = vi.fn().mockRejectedValue(new Error("network error"));
    vi.stubGlobal("fetch", mockFetch);

    const response = await handleTunnelRequest(request, VALID_CONFIG);
    expect(response.status).toBe(502);
    expect(await response.text()).toBe("Upstream error");

    vi.unstubAllGlobals();
  });
});
