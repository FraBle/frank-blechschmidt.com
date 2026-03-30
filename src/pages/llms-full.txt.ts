import type { APIRoute } from "astro";
import {
  basics,
  work,
  education,
  patents,
  projects,
  technicalSkills,
  managerToolbox,
  formatDateRange,
} from "../resume";

export const prerender = true;

export const GET: APIRoute = () => {
  const lines = [
    `# ${basics.name}`,
    "",
    `> ${basics.summary}`,
    "",
    `- Location: ${basics.location.city}, ${basics.location.region}`,
    `- Email: ${basics.email}`,
    `- Website: ${basics.url}`,
    ...basics.profiles.map((p) => `- ${p.network}: ${p.url}`),
    "",
    "---",
    "",
    "## Experience",
    "",
    ...work.flatMap((job) => {
      const period = formatDateRange(job.startDate, job.endDate);
      const block = [
        `### ${job.position} at ${job.company}`,
        `${job.location} | ${period}`,
        "",
      ];
      if (job.summary) {
        block.push(job.summary, "");
      }
      if (job.responsibilities.length > 0) {
        block.push("**Responsibilities:**", "");
        block.push(...job.responsibilities.map((r) => `- ${r}`), "");
      }
      if (job.achievements.length > 0) {
        block.push("**Achievements:**", "");
        block.push(...job.achievements.map((a) => `- ${a}`), "");
      }
      return block;
    }),
    "---",
    "",
    "## Education",
    "",
    ...education.flatMap((edu) => {
      const period = formatDateRange(edu.startDate, edu.endDate);
      return [
        `### ${edu.studyType}, ${edu.area}`,
        `${edu.institution} (${edu.location}) | ${period}`,
        "",
      ];
    }),
    "---",
    "",
    "## Patents",
    "",
    ...patents.flatMap((p) => [
      `### ${p.name}`,
      `Filed: ${formatDateRange(p.filedDate, "").split(" — ")[0]} | Issued: ${formatDateRange(p.issuedDate, "").split(" — ")[0]}`,
      "",
      "Systems and methods for processing natural language queries through dynamic knowledge graphs to enable intelligent, conversational interactions with enterprise resource planning data.",
      "",
      "Patent numbers: " + p.numbers.map((n) => `[${n.id}](${n.url})`).join(", "),
      "",
    ]),
    "---",
    "",
    "## Open Source Projects",
    "",
    ...projects.flatMap((p) => [`- [${p.name}](${p.url}): ${p.description}`, ""]),
    "---",
    "",
    "## Manager Toolbox",
    "",
    ...managerToolbox.map((cat) => `- **${cat.name}:** ${cat.keywords.join(", ")}`),
    "",
    "---",
    "",
    "## Technical Skills",
    "",
    ...technicalSkills.map((cat) => `- **${cat.name}:** ${cat.keywords.join(", ")}`),
    "",
    "---",
    "",
    "## Machine-Readable Endpoints",
    "",
    `- [JSON Resume](${basics.url}/resume.json): Structured resume data (JSON Resume Schema v1.0.0)`,
    `- [LLMs.txt](${basics.url}/llms.txt): Concise LLM-friendly profile`,
    `- [MCP Server](${basics.url}/.well-known/mcp.json): Model Context Protocol endpoint`,
    `- [Agent Skills](${basics.url}/.well-known/skills/index.json): Agent Skills Discovery`,
    "",
  ];

  return new Response(lines.join("\n"), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
};
