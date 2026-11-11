# AI Marketing Agency - 8 autonomous AI employees

An AI marketing agency built on the [markfulton/ai-employees](https://github.com/markfulton/ai-employees) kit format
(ROLE.md, SCHEDULE.md, `routines/<id>/SKILL.md`, a shared run log). It runs a brand launch for a fictional coffee brand,
BrightBrew: market research, ad copy, campaign calendar, lead parsing, inbox triage, tracking audit and growth metrics.
One employee is the Project Manager: it audits the other seven, logs every run to a Google Sheet and emails a daily brief.

> The upstream repo ships 8 roles for other jobs (GTM, SEO, Sales and more). The 8 marketing employees here are
> new kits written in the same folder format, with a custom Google Sheet bridge and email bridge.

## The team

| # | Employee | Role | Output |
|---|---|---|---|
| 1 | marketing-chief-of-staff | Project Manager | Sheet ledger rows + daily email brief |
| 2 | market-researcher | Lead Researcher | `market_brief.md` |
| 3 | content-writer | Content Writer | `ad_copy.md`, `social_posts.md` |
| 4 | performance-analyst | Performance Analyst | `performance_report.json` |
| 5 | campaign-builder | Campaign Builder | `content_calendar.csv`, `campaign_plan.md` |
| 6 | technical-auditor | Technical Auditor | `audit_report.md`, `metrics_clean.csv` |
| 7 | social-triage | Support Triage | `triage.csv`, `triage_summary.md` |
| 8 | outbound-strategist | Outbound Strategist | `target_accounts.csv`, `account_profiles.md` |

## Architecture

```
employees/*  (ROLE.md + routines)  ->  scripts/agents.mjs  ->  data/out/*
                                         |
                                   scripts/runlog.mjs  -> runlog.jsonl
                                         |
                              scripts/sheet_bridge.mjs  -> Apps Script web app -> Google Sheet "Ledger"
                                                                  [Timestamp | Agent Name | Task Performed | Output Status]
marketing-chief-of-staff -> scripts/daily_brief.mjs -> Apps Script MailApp -> your inbox
```

## Quick start

```bash
node scripts/runlog.mjs --selftest      # expect: PASS runlog selftest
node scripts/run_all.mjs                # runs all 8 employees, logs, builds the brief
```

To connect the Google Sheet and email, follow `docs/RUNBOOK.md` (about 15 minutes), then:

```bash
export SHEET_WEBHOOK_URL="https://script.google.com/macros/s/XXXX/exec"
export WEBHOOK_SECRET="<value printed by setup() in Apps Script>"
node scripts/run_all.mjs
```

Rows that could not be delivered are kept in `data/ledger-queue.csv`; send them later with
`node scripts/sheet_bridge.mjs --flush`.

## Running with Claude Code (the ai-employees way)

Open Claude Code in this folder and say: *"Install the Marketing Agency from this folder."* Each employee's routine is a
scheduled job with the prompt `Read employees/<id>/routines/<routine>/SKILL.md and follow it.` Fire times are in
`SCHEDULE.md`. `.installed.json` records the installed roster.

## Safety

- All brand, lead and message data is fictional sample data and stays on this machine.
- Ads, posts, replies and outreach are drafts. Nothing is published, sent or spent.
- The email bridge sends only to the Google account that owns the script.
- The run logger refuses any record that contains an email, phone number, URL or secret.
