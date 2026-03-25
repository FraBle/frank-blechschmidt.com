import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { WebStandardStreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js";

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
            "Frank Blechschmidt — Engineering Manager",
            "Location: Sunnyvale, CA",
            "Email: contact@frank-blechschmidt.com",
            "Phone: +1 (650) 213-2619",
            "",
            "Currently Engineering Manager at Lattice (Jan 2022–Present), leading Developer Experience (7 engineers) and Cloud Engineering (8 engineers) teams.",
            "",
            "Previously at Box as Engineering Manager and Tech Lead Manager for Kubernetes Engineering (2019–2022).",
            "",
            "Before that, Lead Software Engineer at SAP Conversational AI (2016–2019), spearheading SAP's Conversational AI initiative.",
            "",
            "Education:",
            "- MS Computer Science, University of Illinois Urbana-Champaign (2021)",
            "- BS IT-Systems Engineering, Hasso Plattner Institute, University of Potsdam (2014)",
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
            "- Languages: Python, TypeScript, JavaScript, Go, GraphQL",
            "- Databases: PostgreSQL, Redis, MySQL, Timescale",
            "- Frameworks: FastAPI, Node.js, Express, React, Tornado",
            "- DevOps: Terraform, Ansible, Docker, Git",
            "- CI/CD: GitHub Actions, ArgoCD, CircleCI",
            "- Cloud: Kubernetes, GCP, AWS",
            "- NLP: SpaCy, Rasa, CoreNLP, Duckling, SUTime",
            "- ML/AI: TensorFlow, Keras, scikit-learn",
            "- Observability: Datadog, Grafana, ELK, Prometheus, Sentry",
            "",
            "Manager Toolbox:",
            "- Goal Setting: OKRs, SMART Goals",
            "- Agile: Kanban, Scrum, eXtreme Programming",
            "- Prioritization: RICE, Eisenhower Matrix, MoSCoW",
            "- Decision Making: SPADE, DACI, RACI",
            "- Metrics: DORA, SLAs & SLOs",
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
            "Email: contact@frank-blechschmidt.com",
            "Phone: +1 (650) 213-2619",
            "",
            "Links:",
            "- LinkedIn: https://www.linkedin.com/in/fblechschmidt",
            "- GitHub: https://github.com/FraBle",
            "- Twitter: https://twitter.com/FraBle90",
            "",
            "Subdomain shortcuts:",
            "- linkedin.frank-blechschmidt.com",
            "- github.frank-blechschmidt.com",
            "- twitter.frank-blechschmidt.com",
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
          text: [
            "Cognitive Enterprise System",
            "Filed: March 2017 | Issued: May 2018",
            "US 20190332956, US 20180144053, US 20180144257",
          ].join("\n"),
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
          text: [
            "python-sutime (https://github.com/FraBle/python-sutime)",
            "Python wrapper for Stanford's NLP library SUTime. Officially mentioned on Stanford NLP website. ~4,500 downloads/month.",
            "",
            "python-duckling (https://github.com/FraBle/python-duckling)",
            "Python wrapper for wit.ai's NLP library Duckling. Used by Rasa NLU. ~1,000 downloads/month.",
          ].join("\n"),
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
