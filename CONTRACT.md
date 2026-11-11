# Contract

## Roster (8 employees)
| # | Employee | Role | Routine |
|---|---|---|---|
| 1 | marketing-chief-of-staff | Project Manager (Chief of Staff) | marketing-daily-audit-and-brief |
| 2 | market-researcher | Lead Researcher (Market Intelligence) | market-intel-sweep |
| 3 | content-writer | Content Writer (Ads and Social) | draft-ads-and-posts |
| 4 | campaign-builder | Campaign Builder (Calendar and Scheduling) | build-content-calendar |
| 5 | outbound-strategist | Outbound Strategist (Lead Forms and Target Accounts) | parse-leads-and-targets |
| 6 | social-triage | Support Triage (Social Inbox) | triage-social-inbox |
| 7 | technical-auditor | Technical Auditor (Marketing Ops) | tracking-and-data-audit |
| 8 | performance-analyst | Performance Analyst (Growth Metrics) | growth-metrics-review |

## Who writes what
- Each worker writes only its own files under data/out/ and one line to runlog.jsonl.
- Only the Chief of Staff writes briefs/ and sends the daily email.
- Only scripts/runlog.mjs writes to the Google Sheet ledger (columns: Timestamp | Agent Name | Task Performed | Output Status).

## The two guardrails
1. Outbound actions (send, post, submit, publish, spend) are held for the owner.
2. Credentials are never created, entered or stored. Brand and customer data stay on this machine.

## Statuses
ok, partial, failed, skipped-already-ran, blocked-login
