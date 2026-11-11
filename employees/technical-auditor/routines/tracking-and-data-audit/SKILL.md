---
name: tracking-and-data-audit
description: Scheduled routine of technical-auditor. Catch broken tracking, data mismatches and non-compliant copy before they cost money.
metadata:
  internal: true
---

# tracking-and-data-audit

Fires weekdays at 15:00 Asia/Karachi.

1. If a file named PAUSED exists in the agency folder, record `skipped-paused` and stop.
2. If the run already happened for today's date, record `skipped-already-ran` and stop.
3. Read: data/campaigns.json, data/campaign_metrics.csv, data/out/ad_copy.md.
4. Checks UTM parameters on every landing link, removes impossible metric rows (clicks above impressions), checks ad length limits and banned claims.
5. Write: data/out/audit_report.md, data/out/metrics_clean.csv.
6. Log status ok when clean, partial when something needs review, failed when it could not finish.

Log line (one per run, no emails, links, phone numbers or secrets):
`node scripts/runlog.mjs --agent technical-auditor --task "<one-line summary>" --status <ok|partial|failed>`

## Corrections
