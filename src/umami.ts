const SCRIPT_UPSTREAM = "https://cloud.umami.is/script.js";
const EVENT_UPSTREAM = "https://api-gateway.umami.dev/api/send";
const MAX_BODY_SIZE = 65536; // 64KB

export async function handleScriptProxy(): Promise<Response> {
  try {
    const response = await fetch(SCRIPT_UPSTREAM);

    if (!response.ok) {
      return new Response("Upstream error", { status: 502 });
    }

    return new Response(response.body, {
      headers: {
        "Content-Type": "application/javascript",
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch {
    return new Response("Upstream error", { status: 502 });
  }
}

export async function validateEventBody(
  request: Request,
  expectedWebsiteId: string,
): Promise<{ body: string } | Response> {
  const contentType = request.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) {
    return new Response("Invalid content type", { status: 400 });
  }

  const body = await request.text();
  if (body.length > MAX_BODY_SIZE) {
    return new Response("Payload too large", { status: 413 });
  }

  const parsed = JSON.parse(body);
  if (parsed?.payload?.website !== expectedWebsiteId) {
    return new Response("Forbidden", { status: 403 });
  }

  return { body };
}

export async function handleEventProxy(
  request: Request,
  expectedWebsiteId: string,
): Promise<Response> {
  try {
    const result = await validateEventBody(request, expectedWebsiteId);
    if (result instanceof Response) return result;

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    const userAgent = request.headers.get("user-agent");
    if (userAgent) {
      headers["User-Agent"] = userAgent;
    }

    const response = await fetch(EVENT_UPSTREAM, {
      method: "POST",
      body: result.body,
      headers,
    });

    return new Response(response.body, { status: response.status });
  } catch (err) {
    if (err instanceof SyntaxError) {
      return new Response("Invalid JSON", { status: 400 });
    }
    return new Response("Upstream error", { status: 502 });
  }
}
