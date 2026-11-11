---
name: marketing-daily-audit-and-brief
description: Scheduled routine of marketing-chief-of-staff. Audit all 7 other employees, keep the Google Sheet ledger current, and email the owner one scannable brief every weekday.
metadata:
  internal: true
---

# marketing-daily-audit-and-brief

Fires weekdays at 18:00 Asia/Karachi.

1. If a file named PAUSED exists in the agency folder, record `skipped-paused` and stop.
2. If the run already happened for today's date, record `skipped-already-ran` and stop.
3. Read: runlog.jsonl (all agents), data/out/audit_report.md, data/out/performance_report.json.
4. Checks that each of the 7 workers logged a run today. Marks any silent agent MISSING. Writes the brief with NEEDS ATTENTION first. Posts one ledger row per run and sends the email.
5. Write: Google Sheet ledger rows (Timestamp | Agent Name | Task Performed | Output Status), briefs/YYYY-MM-DD.md, daily email.
6. Log status ok when clean, partial when something needs review, failed when it could not finish.

Log line (one per run, no emails, links, phone numbers or secrets):
`node scripts/run_all.mjs (the Project Manager step runs last)`

## Corrections
