---
name: build-content-calendar
description: Scheduled routine of campaign-builder. Turn campaigns and assets into a two week schedule and a budget split.
metadata:
  internal: true
---

# build-content-calendar

Fires weekdays at 11:00 Asia/Karachi.

1. If a file named PAUSED exists in the agency folder, record `skipped-paused` and stop.
2. If the run already happened for today's date, record `skipped-already-ran` and stop.
3. Read: data/campaigns.json, data/out/ad_copy.md.
4. Places 4 assets per campaign on a calendar and shows each budget share. Items stay as drafts until a human approves.
5. Write: data/out/content_calendar.csv, data/out/campaign_plan.md.
6. Log status ok when clean, partial when something needs review, failed when it could not finish.

Log line (one per run, no emails, links, phone numbers or secrets):
`node scripts/runlog.mjs --agent campaign-builder --task "<one-line summary>" --status <ok|partial|failed>`

## Corrections
