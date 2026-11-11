---
name: triage-social-inbox
description: Scheduled routine of social-triage. Sort incoming messages by category and priority and draft quick replies.
metadata:
  internal: true
---

# triage-social-inbox

Fires weekdays at 13:00 Asia/Karachi.

1. If a file named PAUSED exists in the agency folder, record `skipped-paused` and stop.
2. If the run already happened for today's date, record `skipped-already-ran` and stop.
3. Read: data/inbox_messages.json.
4. Labels each message as Complaint, Sales lead, Question, Praise or Spam, orders them by priority and drafts a reply. Replies are never sent.
5. Write: data/out/triage.csv, data/out/triage_summary.md.
6. Log status ok when clean, partial when something needs review, failed when it could not finish.

Log line (one per run, no emails, links, phone numbers or secrets):
`node scripts/runlog.mjs --agent social-triage --task "<one-line summary>" --status <ok|partial|failed>`

## Corrections
