---
name: parse-leads-and-targets
description: Scheduled routine of outbound-strategist. Parse lead forms, drop invalid and duplicate entries, score the rest and write baseline profiles.
metadata:
  internal: true
---

# parse-leads-and-targets

Fires weekdays at 12:00 Asia/Karachi.

1. If a file named PAUSED exists in the agency folder, record `skipped-paused` and stop.
2. If the run already happened for today's date, record `skipped-already-ran` and stop.
3. Read: data/lead_forms.json.
4. Validates emails, removes duplicates, scores by size, interest, source and city, and assigns tier A, B or C with a next step.
5. Write: data/out/target_accounts.csv, data/out/account_profiles.md.
6. Log status ok when clean, partial when something needs review, failed when it could not finish.

Log line (one per run, no emails, links, phone numbers or secrets):
`node scripts/runlog.mjs --agent outbound-strategist --task "<one-line summary>" --status <ok|partial|failed>`

## Corrections
