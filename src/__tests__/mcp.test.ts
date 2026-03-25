import { describe, it, expect } from "vitest";
import { handleMcpRequest } from "../mcp";

describe("handleMcpRequest", () => {
  it("responds to initialize request with SSE stream", async () => {
    const request = new Request("https://frank-blechschmidt.com/mcp", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json, text/event-stream",
      },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: 1,
        method: "initialize",
        params: {
          protocolVersion: "2025-11-25",
          capabilities: {},
          clientInfo: { name: "test", version: "1.0.0" },
        },
      }),
    });

    const response = await handleMcpRequest(request);
    expect(response.status).toBe(200);

    const contentType = response.headers.get("content-type");
    expect(
      contentType?.includes("text/event-stream") ||
        contentType?.includes("application/json"),
    ).toBe(true);
  });

  it("responds to GET request", async () => {
    const request = new Request("https://frank-blechschmidt.com/mcp", {
      method: "GET",
      headers: { Accept: "text/event-stream" },
    });

    const response = await handleMcpRequest(request);
    // Stateless server returns 200 with SSE or 405
    expect([200, 405]).toContain(response.status);
  });

  it("rejects invalid JSON-RPC", async () => {
    const request = new Request("https://frank-blechschmidt.com/mcp", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json, text/event-stream",
      },
      body: JSON.stringify({ invalid: true }),
    });

    const response = await handleMcpRequest(request);
    expect(response.status).toBeGreaterThanOrEqual(400);
  });
});
