---
name: market-intel-sweep
description: Scheduled routine of market-researcher. Study competitors, pricing and audience gaps so every campaign starts from evidence.
metadata:
  internal: true
---

# market-intel-sweep

Fires weekdays at 09:00 Asia/Karachi.

1. If a file named PAUSED exists in the agency folder, record `skipped-paused` and stop.
2. If the run already happened for today's date, record `skipped-already-ran` and stop.
3. Read: data/brand.json, data/competitors.json.
4. Compares our price with competitors, finds the biggest competitor audience, and lists weaknesses we can own. Never states a figure without a source row.
5. Write: data/out/market_brief.md.
6. Log status ok when clean, partial when something needs review, failed when it could not finish.

Log line (one per run, no emails, links, phone numbers or secrets):
`node scripts/runlog.mjs --agent market-researcher --task "<one-line summary>" --status <ok|partial|failed>`

## Corrections
