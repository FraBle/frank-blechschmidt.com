import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { WebStandardStreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js";
import {
  ListToolsRequestSchema,
  ListPromptsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import {
  basics,
  work,
  education,
  patents,
  projects,
  managerToolbox,
  technicalSkills,
  formatDateRange,
} from "./resume";

function createServer(): McpServer {
  const server = new McpServer({
    name: "frank-blechschmidt",
    version: "1.0.0",
  });

  server.registerResource(
    "about",
    "resume://about",
    {
      description: "Professional background and experience of Frank Blechschmidt",
      mimeType: "text/plain",
    },
    async () => ({
      contents: [
        {
          uri: "resume://about",
          text: [
            `${basics.name} — ${basics.label}`,
            `Location: ${basics.location.city}, ${basics.location.region}`,
            `Email: ${basics.email}`,
            `Phone: ${basics.phone}`,
            "",
            basics.summary,
            "",
            ...work.map((job) =>
              [
                `${job.position} at ${job.company} (${formatDateRange(job.startDate, job.endDate)}, ${job.location})`,
                ...(job.summary ? [job.summary] : []),
                ...job.responsibilities.map((r) => `- ${r}`),
                ...job.achievements.map((a) => `- ${a}`),
                "",
              ].join("\n"),
            ),
            "Education:",
            ...education.map(
              (e) => `- ${e.studyType} ${e.area}, ${e.institution} (${e.endDate.split("-")[0]})`,
            ),
          ].join("\n"),
        },
      ],
    }),
  );

  server.registerResource(
    "skills",
    "resume://skills",
    {
      description: "Technical skills and manager toolbox",
      mimeType: "text/plain",
    },
    async () => ({
      contents: [
        {
          uri: "resume://skills",
          text: [
            "Technical Skills:",
            ...technicalSkills.map((cat) => `- ${cat.name}: ${cat.keywords.join(", ")}`),
            "",
            "Manager Toolbox:",
            ...managerToolbox.map((cat) => `- ${cat.name}: ${cat.keywords.join(", ")}`),
          ].join("\n"),
        },
      ],
    }),
  );

  server.registerResource(
    "contact",
    "resume://contact",
    {
      description: "Contact information and social links",
      mimeType: "text/plain",
    },
    async () => ({
      contents: [
        {
          uri: "resume://contact",
          text: [
            `Email: ${basics.email}`,
            `Phone: ${basics.phone}`,
            "",
            "Links:",
            ...basics.profiles.map((p) => `- ${p.network}: ${p.url}`),
            "",
            "Subdomain shortcuts:",
            ...basics.profiles.map(
              (p) => `- ${p.network.toLowerCase()}.frank-blechschmidt.com`,
            ),
          ].join("\n"),
        },
      ],
    }),
  );

  server.registerResource(
    "patents",
    "resume://patents",
    {
      description: "Patents filed by Frank Blechschmidt",
      mimeType: "text/plain",
    },
    async () => ({
      contents: [
        {
          uri: "resume://patents",
          text: patents
            .map(
              (p) =>
                `${p.name}\nFiled: ${formatDateRange(p.filedDate, "").split(" — ")[0]} | Issued: ${formatDateRange(p.issuedDate, "").split(" — ")[0]}\n${p.numbers.map((n) => n.id).join(", ")}`,
            )
            .join("\n\n"),
        },
      ],
    }),
  );

  server.registerResource(
    "open-source",
    "resume://open-source",
    {
      description: "Open source projects by Frank Blechschmidt",
      mimeType: "text/plain",
    },
    async () => ({
      contents: [
        {
          uri: "resume://open-source",
          text: projects
            .map((p) => `${p.name} (${p.url})\n${p.description}`)
            .join("\n\n"),
        },
      ],
    }),
  );

  // Register empty tool/prompt list handlers so clients that probe all
  // capabilities (e.g. MCP Playground) get empty lists instead of errors.
  server.server.registerCapabilities({ tools: {}, prompts: {} });
  server.server.setRequestHandler(ListToolsRequestSchema, () => ({ tools: [] }));
  server.server.setRequestHandler(ListPromptsRequestSchema, () => ({ prompts: [] }));

  return server;
}

const CORS_HEADERS: Record<string, string> = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Accept, Mcp-Session-Id, Mcp-Protocol-Version, Last-Event-ID",
  "Access-Control-Expose-Headers": "Mcp-Session-Id, Mcp-Protocol-Version",
};

export async function handleMcpRequest(request: Request): Promise<Response> {
  // Handle CORS preflight
  if (request.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: CORS_HEADERS });
  }

  // Ensure Accept header includes both required MIME types.
  // Some clients (e.g. MCP Playground) omit one, causing the SDK to reject with 406.
  const accept = request.headers.get("accept") ?? "";
  if (!accept.includes("application/json") || !accept.includes("text/event-stream")) {
    const headers = new Headers(request.headers);
    headers.set("Accept", "application/json, text/event-stream");
    request = new Request(request, { headers });
  }

  const server = createServer();
  const transport = new WebStandardStreamableHTTPServerTransport({
    sessionIdGenerator: undefined,
  });

  await server.connect(transport);

  const response = await transport.handleRequest(request);

  // Add CORS headers to the response
  const headers = new Headers(response.headers);
  for (const [key, value] of Object.entries(CORS_HEADERS)) {
    headers.set(key, value);
  }

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}
