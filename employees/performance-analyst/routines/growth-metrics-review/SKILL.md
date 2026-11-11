---
name: growth-metrics-review
description: Scheduled routine of performance-analyst. Measure CTR, CPC, CPA and ROAS per campaign and flag bottlenecks.
metadata:
  internal: true
---

# growth-metrics-review

Fires weekdays at 16:00 Asia/Karachi.

1. If a file named PAUSED exists in the agency folder, record `skipped-paused` and stop.
2. If the run already happened for today's date, record `skipped-already-ran` and stop.
3. Read: data/out/metrics_clean.csv.
4. Aggregates the cleaned metrics, finds the best ROAS, and flags any campaign below the 1.5x ROAS or 1 percent CTR target.
5. Write: data/out/performance_report.json.
6. Log status ok when clean, partial when something needs review, failed when it could not finish.

Log line (one per run, no emails, links, phone numbers or secrets):
`node scripts/runlog.mjs --agent performance-analyst --task "<one-line summary>" --status <ok|partial|failed>`

## Corrections
