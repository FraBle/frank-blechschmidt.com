interface DsnConfig {
  host: string;
  projectId: string;
}

export function parseDsn(dsn: string | undefined): DsnConfig | null {
  try {
    if (!dsn) return null;
    const url = new URL(dsn);
    return { host: url.hostname, projectId: url.pathname.replace("/", "") };
  } catch {
    return null;
  }
}

export async function handleTunnelRequest(
  request: Request,
  expectedDsn: DsnConfig | null,
): Promise<Response> {
  if (!expectedDsn) {
    return new Response("Sentry tunnel not configured", { status: 500 });
  }

  try {
    const envelope = await request.text();
    const header = JSON.parse(envelope.split("\n")[0]);

    const dsn = new URL(header.dsn);
    if (dsn.hostname !== expectedDsn.host) {
      return new Response("Invalid DSN host", { status: 400 });
    }

    const projectId = dsn.pathname.replace("/", "");
    if (projectId !== expectedDsn.projectId) {
      return new Response("Invalid project", { status: 400 });
    }

    const upstream = `https://${expectedDsn.host}/api/${projectId}/envelope/`;
    const response = await fetch(upstream, {
      method: "POST",
      body: envelope,
      headers: { "Content-Type": "application/x-sentry-envelope" },
    });

    return new Response(response.body, { status: response.status });
  } catch (err) {
    console.error("Sentry tunnel error:", err);
    const status = err instanceof SyntaxError ? 400 : 502;
    const message = err instanceof SyntaxError ? "Invalid envelope" : "Upstream error";
    return new Response(message, { status });
  }
}
