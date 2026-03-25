import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { WebStandardStreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js";
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
            ...work.map((job) =>
              [
                `${job.position} at ${job.company} (${formatDateRange(job.startDate, job.endDate)}, ${job.location})`,
                ...(job.summary ? [job.summary] : []),
                ...job.highlights.map((h) => `- ${h}`),
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

  return server;
}

export async function handleMcpRequest(request: Request): Promise<Response> {
  const server = createServer();
  const transport = new WebStandardStreamableHTTPServerTransport({
    sessionIdGenerator: undefined,
  });

  await server.connect(transport);

  try {
    return await transport.handleRequest(request);
  } finally {
    await transport.close();
    await server.close();
  }
}
