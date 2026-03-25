import type { APIRoute } from "astro";
import {
  basics,
  work,
  education,
  patents,
  projects,
  technicalSkills,
} from "../resume";

export const prerender = true;

export const GET: APIRoute = () => {
  const jsonResume = {
    $schema: "https://raw.githubusercontent.com/jsonresume/resume-schema/v1.0.0/schema.json",
    basics: {
      name: basics.name,
      label: basics.label,
      image: basics.image,
      email: basics.email,
      phone: basics.phone,
      url: basics.url,
      summary: basics.summary,
      location: {
        city: basics.location.city,
        region: basics.location.region,
        countryCode: basics.location.countryCode,
      },
      profiles: basics.profiles.map((p) => ({
        network: p.network,
        username: p.username,
        url: p.url,
      })),
    },
    work: work.map((job) => ({
      name: job.company,
      position: job.position,
      url: job.url,
      startDate: job.startDate,
      ...(job.endDate ? { endDate: job.endDate } : {}),
      summary: job.summary,
      highlights: job.highlights,
    })),
    education: education.map((edu) => ({
      institution: edu.institution,
      url: edu.url,
      area: edu.area,
      studyType: edu.studyType,
      endDate: edu.endDate,
    })),
    skills: technicalSkills.map((cat) => ({
      name: cat.name,
      keywords: cat.keywords,
    })),
    projects: projects.map((p) => ({
      name: p.name,
      url: p.url,
      description: p.description,
      type: "open-source",
    })),
    patents: patents.map((p) => ({
      name: p.name,
      date: p.issuedDate,
      numbers: p.numbers.map((n) => n.id),
    })),
    meta: {
      canonical: `${basics.url}/resume.json`,
      version: "v1.0.0",
      lastModified: new Date().toISOString().split("T")[0],
    },
  };

  return new Response(JSON.stringify(jsonResume, null, 2), {
    headers: { "Content-Type": "application/json" },
  });
};
