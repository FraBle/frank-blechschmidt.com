import type { APIRoute } from "astro";
import {
  basics,
  work,
  education,
  patents,
  projects,
  technicalSkills,
  formatDateRange,
} from "../resume";

export const prerender = true;

export const GET: APIRoute = () => {
  const lines = [
    `# ${basics.name}`,
    `> ${basics.summary}`,
    "",
    `- Location: ${basics.location.city}, ${basics.location.region}`,
    `- Current Role: ${work[0].position} at ${work[0].company}`,
    `- Email: ${basics.email}`,
    "",
    "## Experience",
    "",
    ...work.map((job) => {
      const period = formatDateRange(job.startDate, job.endDate);
      return `- **${job.position}** at ${job.company} (${period})`;
    }),
    "",
    "## Education",
    "",
    ...education.map(
      (edu) => `- ${edu.studyType}, ${edu.area} — ${edu.institution} (${edu.endDate.split("-")[0]})`,
    ),
    "",
    "## Open Source",
    "",
    ...projects.map((p) => `- [${p.name}](${p.url}): ${p.description}`),
    "",
    "## Patents",
    "",
    ...patents.map((p) => {
      const links = p.numbers.map((n) => `[${n.id}](${n.url})`).join(", ");
      return `- ${p.name} (${p.numbers[0].id}) — ${links}`;
    }),
    "",
    "## Technical Skills",
    "",
    ...technicalSkills.map((cat) => `- **${cat.name}:** ${cat.keywords.join(", ")}`),
    "",
    "## Links",
    "",
    ...basics.profiles.map((p) => `- [${p.network}](${p.url})`),
    `- [Full Profile (llms-full.txt)](${basics.url}/llms-full.txt)`,
    `- [JSON Resume](${basics.url}/resume.json)`,
    `- [MCP Server](${basics.url}/.well-known/mcp.json)`,
    "",
  ];

  return new Response(lines.join("\n"), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
};
