import { describe, it, expect, vi } from "vitest";
import { handleScriptProxy, handleEventProxy } from "../umami";

const TEST_WEBSITE_ID = "test-website-id";

function makeEventBody(websiteId: string): string {
  return JSON.stringify({
    type: "event",
    payload: { website: websiteId, hostname: "example.com", url: "/" },
  });
}

function makeRequest(
  body: string,
  contentType = "application/json",
): Request {
  return new Request("https://example.com/a/api/send", {
    method: "POST",
    body,
    headers: { "Content-Type": contentType },
  });
}

describe("handleScriptProxy", () => {
  it("returns script with correct headers on success", async () => {
    const mockFetch = vi.fn().mockResolvedValue(
      new Response("console.log('umami')", { status: 200 }),
    );
    vi.stubGlobal("fetch", mockFetch);

    const response = await handleScriptProxy();
    expect(response.status).toBe(200);
    expect(response.headers.get("content-type")).toBe("application/javascript");
    expect(response.headers.get("cache-control")).toBe("public, max-age=3600");
    expect(await response.text()).toBe("console.log('umami')");
    expect(mockFetch).toHaveBeenCalledWith("https://cloud.umami.is/script.js");

    vi.unstubAllGlobals();
  });

  it("returns 502 when upstream returns non-ok", async () => {
    const mockFetch = vi.fn().mockResolvedValue(new Response("", { status: 500 }));
    vi.stubGlobal("fetch", mockFetch);

    const response = await handleScriptProxy();
    expect(response.status).toBe(502);

    vi.unstubAllGlobals();
  });

  it("returns 502 on fetch failure", async () => {
    const mockFetch = vi.fn().mockRejectedValue(new Error("network error"));
    vi.stubGlobal("fetch", mockFetch);

    const response = await handleScriptProxy();
    expect(response.status).toBe(502);
    expect(await response.text()).toBe("Upstream error");

    vi.unstubAllGlobals();
  });
});

describe("handleEventProxy", () => {
  it("returns 400 for non-JSON content type", async () => {
    const request = makeRequest("data", "text/plain");
    const response = await handleEventProxy(request, TEST_WEBSITE_ID);
    expect(response.status).toBe(400);
    expect(await response.text()).toBe("Invalid content type");
  });

  it("returns 400 when content-type header is missing", async () => {
    const request = new Request("https://example.com/a/api/send", {
      method: "POST",
      body: "data",
    });
    request.headers.delete("content-type");
    const response = await handleEventProxy(request, TEST_WEBSITE_ID);
    expect(response.status).toBe(400);
    expect(await response.text()).toBe("Invalid content type");
  });

  it("returns 413 when body exceeds limit", async () => {
    const largeBody = `{"payload":{"website":"${TEST_WEBSITE_ID}","data":"${"x".repeat(65536)}"}}`;
    const request = makeRequest(largeBody);
    const response = await handleEventProxy(request, TEST_WEBSITE_ID);
    expect(response.status).toBe(413);
  });

  it("returns 400 for invalid JSON", async () => {
    const request = makeRequest("not json");
    const response = await handleEventProxy(request, TEST_WEBSITE_ID);
    expect(response.status).toBe(400);
    expect(await response.text()).toBe("Invalid JSON");
  });

  it("returns 403 for wrong website ID", async () => {
    const body = makeEventBody("wrong-id");
    const request = makeRequest(body);
    const response = await handleEventProxy(request, TEST_WEBSITE_ID);
    expect(response.status).toBe(403);
    expect(await response.text()).toBe("Forbidden");
  });

  it("returns 403 for non-object JSON (null)", async () => {
    const request = makeRequest("null");
    const response = await handleEventProxy(request, TEST_WEBSITE_ID);
    expect(response.status).toBe(403);
  });

  it("returns 403 for JSON without payload", async () => {
    const request = makeRequest(JSON.stringify({ type: "event" }));
    const response = await handleEventProxy(request, TEST_WEBSITE_ID);
    expect(response.status).toBe(403);
  });

  it("forwards valid request upstream", async () => {
    const body = makeEventBody(TEST_WEBSITE_ID);
    const request = makeRequest(body);

    const mockFetch = vi.fn().mockResolvedValue(new Response("ok", { status: 200 }));
    vi.stubGlobal("fetch", mockFetch);

    const response = await handleEventProxy(request, TEST_WEBSITE_ID);
    expect(response.status).toBe(200);
    expect(mockFetch).toHaveBeenCalledWith(
      "https://api-gateway.umami.dev/api/send",
      expect.objectContaining({ method: "POST" }),
    );

    vi.unstubAllGlobals();
  });

  it("returns 502 on upstream fetch failure", async () => {
    const body = makeEventBody(TEST_WEBSITE_ID);
    const request = makeRequest(body);

    const mockFetch = vi.fn().mockRejectedValue(new Error("network error"));
    vi.stubGlobal("fetch", mockFetch);

    const response = await handleEventProxy(request, TEST_WEBSITE_ID);
    expect(response.status).toBe(502);
    expect(await response.text()).toBe("Upstream error");

    vi.unstubAllGlobals();
  });
});
