// Usage: node scripts/build_dashboard.mjs
// Reads runlog.jsonl, .installed.json, data/out/*, briefs/* and writes dashboard/data.json
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const read = (p, fallback = "") => { try { return fs.readFileSync(path.join(root, p), "utf8"); } catch { return fallback; } };
const list = (d) => { try { return fs.readdirSync(path.join(root, d)); } catch { return []; } };

// installed roster
let installed = {};
try { installed = JSON.parse(read(".installed.json", read("_installed.json", "{}"))); } catch {}

// run log
const runs = read("runlog.jsonl").split("\n").filter(Boolean).map((l) => {
  try { return JSON.parse(l); } catch { return null; }
}).filter(Boolean).sort((a, b) => String(b.timestamp).localeCompare(String(a.timestamp)));

// employees + latest run each
const employees = (installed.employees || []).map((e) => {
  const last = runs.find((r) => r.agent === e.id);
  return { id: e.id, role: e.role, routine: e.routine, schedule: e.schedule,
    isProjectManager: !!e.isProjectManager,
    status: last ? last.status : "pending", task: last ? last.task : "Has not run yet",
    lastRun: last ? last.timestamp : null };
});

// which files belong to which employee (from README)
const owners = {
  "market_brief.md": "market-researcher",
  "ad_copy.md": "content-writer", "social_posts.md": "content-writer",
  "content_calendar.csv": "campaign-builder", "campaign_plan.md": "campaign-builder",
  "target_accounts.csv": "outbound-strategist", "account_profiles.md": "outbound-strategist",
  "triage.csv": "social-triage", "triage_summary.md": "social-triage",
  "audit_report.md": "technical-auditor", "metrics_clean.csv": "technical-auditor",
  "performance_report.json": "performance-analyst",
};
const MAX = 20000;
const outputs = list("data/out").filter((f) => !f.startsWith(".")).map((f) => {
  const text = read(`data/out/${f}`);
  return { file: f, agent: owners[f] || "unknown", size: text.length,
    truncated: text.length > MAX, content: text.slice(0, MAX) };
});

// latest brief
const briefFiles = list("briefs").filter((f) => f.endsWith(".md") || f.endsWith(".txt")).sort();
const latest = briefFiles.at(-1);
const brief = latest ? { file: latest, content: read(`briefs/${latest}`) } : null;

const counts = runs.reduce((a, r) => (a[r.status] = (a[r.status] || 0) + 1, a), {});
const data = {
  generatedAt: new Date().toISOString(),
  agency: installed.agency || "Marketing Agency",
  brand: installed.brand || "",
  timezone: installed.timezone || "",
  employees, runs, outputs, brief, counts,
};

fs.mkdirSync(path.join(root, "dashboard"), { recursive: true });
fs.writeFileSync(path.join(root, "dashboard/data.json"), JSON.stringify(data, null, 2));
console.log(`dashboard/data.json written: ${employees.length} employees, ${runs.length} runs, ${outputs.length} outputs`);
