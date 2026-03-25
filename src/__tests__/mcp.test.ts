import { describe, it, expect } from "vitest";
import { handleMcpRequest } from "../mcp";

describe("MCP server", () => {
  it("returns 200 for initialize POST", async () => {
    const response = await handleMcpRequest(
      new Request("https://frank-blechschmidt.com/mcp", {
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
      }),
    );
    expect(response.status).toBe(200);
    expect(response.headers.get("content-type")).toContain("text/event-stream");
  });

  it("returns response for GET", async () => {
    const response = await handleMcpRequest(
      new Request("https://frank-blechschmidt.com/mcp", {
        method: "GET",
        headers: { Accept: "text/event-stream" },
      }),
    );
    expect([200, 405]).toContain(response.status);
  });

  it("rejects invalid JSON-RPC", async () => {
    const response = await handleMcpRequest(
      new Request("https://frank-blechschmidt.com/mcp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json, text/event-stream",
        },
        body: JSON.stringify({ invalid: true }),
      }),
    );
    expect(response.status).toBeGreaterThanOrEqual(400);
  });
});
