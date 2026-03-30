import { describe, it, expect } from "vitest";
import {
  basics,
  work,
  education,
  patents,
  projects,
  managerToolbox,
  technicalSkills,
  formatDateRange,
} from "../resume";

describe("basics", () => {
  it("has required personal info", () => {
    expect(basics.name).toBe("Frank Blechschmidt");
    expect(basics.label).toBe("Scaling platform teams and cloud infrastructure");
    expect(basics.email).toBe("contact@frank-blechschmidt.com");
    expect(basics.phone).toBe("+1 (650) 213-2619");
    expect(basics.url).toBe("https://frank-blechschmidt.com");
    expect(basics.image).toBe("https://frank-blechschmidt.com/avatar.jpg");
  });

  it("has location", () => {
    expect(basics.location.city).toBe("Sunnyvale");
    expect(basics.location.region).toBe("CA");
    expect(basics.location.countryCode).toBe("US");
  });

  it("has three social profiles", () => {
    expect(basics.profiles).toHaveLength(3);
    expect(basics.profiles.map((p) => p.network)).toEqual([
      "LinkedIn",
      "GitHub",
      "X",
    ]);
    expect(basics.profiles.every((p) => p.url && p.username)).toBe(true);
  });
});

describe("work", () => {
  it("has eight positions", () => {
    expect(work).toHaveLength(8);
  });

  it("has most recent position first", () => {
    expect(work[0].company).toBe("dbt Labs");
    expect(work[0].endDate).toBe("");
  });

  it("all positions have required fields", () => {
    for (const job of work) {
      expect(job.company).toBeTruthy();
      expect(job.position).toBeTruthy();
      expect(job.url).toBeTruthy();
      expect(job.startDate).toMatch(/^\d{4}-\d{2}$/);
      expect(job.location).toBeTruthy();
      expect(job.responsibilities.length + job.achievements.length).toBeGreaterThan(0);
    }
  });
});

describe("education", () => {
  it("has two entries", () => {
    expect(education).toHaveLength(2);
  });

  it("has UIUC and HPI", () => {
    expect(education[0].institution).toContain("Illinois");
    expect(education[1].institution).toContain("Hasso Plattner");
  });
});

describe("patents", () => {
  it("has one patent with four numbers", () => {
    expect(patents).toHaveLength(1);
    expect(patents[0].name).toBe("Cognitive Enterprise System");
    expect(patents[0].numbers).toHaveLength(4);
  });
});

describe("projects", () => {
  it("has two open source projects", () => {
    expect(projects).toHaveLength(2);
    expect(projects[0].name).toBe("python-sutime");
    expect(projects[1].name).toBe("python-duckling");
  });
});

describe("managerToolbox", () => {
  it("has twelve categories", () => {
    expect(managerToolbox).toHaveLength(12);
  });

  it("each category has keywords", () => {
    for (const cat of managerToolbox) {
      expect(cat.name).toBeTruthy();
      expect(cat.keywords.length).toBeGreaterThan(0);
    }
  });
});

describe("technicalSkills", () => {
  it("has eleven categories", () => {
    expect(technicalSkills).toHaveLength(11);
  });

  it("each category has keywords", () => {
    for (const cat of technicalSkills) {
      expect(cat.name).toBeTruthy();
      expect(cat.keywords.length).toBeGreaterThan(0);
    }
  });
});

describe("formatDateRange", () => {
  it("formats a range with both dates", () => {
    expect(formatDateRange("2022-01", "2023-06")).toBe(
      "January 2022 — June 2023",
    );
  });

  it("formats an open-ended range", () => {
    expect(formatDateRange("2022-01", "")).toBe("January 2022 — Present");
  });

  it("handles all months correctly", () => {
    expect(formatDateRange("2020-12", "")).toContain("December");
    expect(formatDateRange("2020-01", "")).toContain("January");
  });

  it("throws on malformed date", () => {
    expect(() => formatDateRange("bad", "")).toThrow("Invalid date format");
  });
});
