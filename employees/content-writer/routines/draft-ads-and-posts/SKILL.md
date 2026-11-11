---
name: draft-ads-and-posts
description: Scheduled routine of content-writer. Write ad headlines, body copy and social post drafts in the brand voice.
metadata:
  internal: true
---

# draft-ads-and-posts

Fires weekdays at 10:00 Asia/Karachi.

1. If a file named PAUSED exists in the agency folder, record `skipped-paused` and stop.
2. If the run already happened for today's date, record `skipped-already-ran` and stop.
3. Read: data/brand.json, data/campaigns.json.
4. Writes 3 headlines per campaign and one social post per campaign. Every draft is held. Never uses banned claims from brand.json.
5. Write: data/out/ad_copy.md, data/out/social_posts.md.
6. Log status ok when clean, partial when something needs review, failed when it could not finish.

Log line (one per run, no emails, links, phone numbers or secrets):
`node scripts/runlog.mjs --agent content-writer --task "<one-line summary>" --status <ok|partial|failed>`

## Corrections
