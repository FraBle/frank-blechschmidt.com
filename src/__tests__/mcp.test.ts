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
    const contentType = response.headers.get("content-type") ?? "";
    expect(
      contentType.includes("text/event-stream") || contentType.includes("application/json"),
    ).toBe(true);
  });

  it("returns 204 for OPTIONS (CORS preflight)", async () => {
    const response = await handleMcpRequest(
      new Request("https://frank-blechschmidt.com/mcp", {
        method: "OPTIONS",
        headers: {
          Origin: "https://example.com",
          "Access-Control-Request-Method": "POST",
        },
      }),
    );
    expect(response.status).toBe(204);
    expect(response.headers.get("access-control-allow-origin")).toBe("*");
    expect(response.headers.get("access-control-allow-methods")).toContain("POST");
    expect(response.headers.get("access-control-allow-headers")).toContain("Mcp-Protocol-Version");
    expect(response.headers.get("access-control-allow-headers")).toContain("Last-Event-ID");
    expect(response.headers.get("access-control-expose-headers")).toContain("Mcp-Protocol-Version");
  });

  it("includes CORS headers in POST response", async () => {
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
    expect(response.headers.get("access-control-allow-origin")).toBe("*");
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

  it("returns empty tools list", async () => {
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
          method: "tools/list",
          params: {},
        }),
      }),
    );
    expect(response.status).toBe(200);
    const text = await response.text();
    const data = JSON.parse(text.split("data: ")[1]);
    expect(data.result.tools).toEqual([]);
  });

  it("returns empty prompts list", async () => {
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
          method: "prompts/list",
          params: {},
        }),
      }),
    );
    expect(response.status).toBe(200);
    const text = await response.text();
    const data = JSON.parse(text.split("data: ")[1]);
    expect(data.result.prompts).toEqual([]);
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
