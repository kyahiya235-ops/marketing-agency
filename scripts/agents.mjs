// Worker logic for the 8 AI Marketing Agency employees (brand: BrightBrew, a fictional demo brand).
// Each function does real work on the local data folder and returns { task, status }.
// Only the one-line task description and status go to the ledger (runlog.mjs refuses emails, URLs, phone numbers, secrets).
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const D = (...p) => path.join(ROOT, 'data', ...p);
const OUT = D('out');
fs.mkdirSync(OUT, { recursive: true });

const readJson = (f) => JSON.parse(fs.readFileSync(f, 'utf8'));
const writeOut = (name, text) => fs.writeFileSync(path.join(OUT, name), text);
const readCsv = (f) => {
  const [head, ...lines] = fs.readFileSync(f, 'utf8').trim().split('\n');
  const cols = head.split(',');
  return lines.map((l) => Object.fromEntries(l.split(',').map((v, i) => [cols[i], v])));
};
const toCsv = (rows) => rows.map((r) => r.map((v) => `"${v}"`).join(',')).join('\n') + '\n';
const brand = () => readJson(D('brand.json'));
const campaigns = () => readJson(D('campaigns.json'));
const pct = (n, d) => (d ? Math.round((n / d) * 1000) / 10 : 0);

// ---------- 2. Market Researcher (Lead Researcher) ----------
export function marketResearcher() {
  const b = brand();
  const comps = readJson(D('competitors.json'));
  const avg = Math.round(comps.reduce((s, c) => s + c.price_pkr, 0) / comps.length);
  const top = [...comps].sort((a, b2) => b2.followers - a.followers)[0];
  const weak = {};
  comps.forEach((c) => (weak[c.weakness] = (weak[c.weakness] || 0) + 1));
  const commonWeak = Object.entries(weak).sort((a, b2) => b2[1] - a[1])[0];
  const gaps = comps.filter((c) => /discount|price/.test(c.weakness + ' ')).length;
  let md = `# Market brief: ${b.name}\n\n## Price position\n- Our price: PKR ${b.price_pkr}. Competitor average: PKR ${avg}. We are ${b.price_pkr < avg ? 'below' : 'above'} average by PKR ${Math.abs(avg - b.price_pkr)}.\n`;
  md += `- Cheapest: ${[...comps].sort((a, b2) => a.price_pkr - b2.price_pkr)[0].name}. Most expensive: ${[...comps].sort((a, b2) => b2.price_pkr - a.price_pkr)[0].name}.\n\n`;
  md += `## Competitor reach\n- Biggest audience: ${top.name} (${top.followers.toLocaleString()} followers) on ${top.channels.join(' and ')}.\n\n## Gaps we can own\n`;
  md += `- ${commonWeak[1]} competitors share this weakness: "${commonWeak[0]}". Lead with fast local delivery.\n`;
  md += `- ${gaps} competitor(s) offer no student pricing. Test a student offer.\n\n## Recommended angle\nFast, fresh, fairly priced cold brew for ${b.audience.toLowerCase()} in ${b.city}.\n`;
  writeOut('market_brief.md', md);
  return { task: `Profiled ${comps.length} competitors and found ${commonWeak[1] + gaps} positioning gaps`, status: 'ok' };
}

// ---------- 3. Content Writer ----------
export function contentWriter() {
  const b = brand();
  const heads = {
    'Instagram Ads': ['Cold brew, made for your day', 'Fresh in Islamabad, fast to you', 'Meet BrightBrew: smooth, never bitter'],
    'Google Search': ['Cold Brew Coffee Islamabad', 'Fresh Cold Brew Delivered', 'Premium Cold Brew Coffee Islamabad'],
    Email: ['Your first BrightBrew is on us', 'Cold brew, delivered cold', 'Welcome to BrightBrew'],
    TikTok: ['Taste test: BrightBrew vs the rest', 'POV: your 3pm coffee is sorted', 'Creators try BrightBrew'],
  };
  let ads = `# Ad copy (all drafts held for approval)\nTone: ${b.tone}\n\n`;
  let posts = '# Social post drafts (held)\n\n';
  let n = 0;
  for (const c of campaigns()) {
    ads += `## ${c.id} ${c.name} (${c.channel})\n`;
    (heads[c.channel] || []).forEach((h, i) => { ads += `- Headline ${i + 1}: ${h}\n`; n++; });
    ads += `- Body: ${b.product} at PKR ${b.price_pkr}. Order today and taste the difference.\n- CTA: Order now\n\n`;
    posts += `### ${c.channel} post for ${c.name}\nSay hello to ${b.name}, the cold brew built for busy days in ${b.city}. Tap to order your first bottle.\n#coldbrew #${b.name.toLowerCase()} #${b.city.toLowerCase()}\n\n`;
  }
  writeOut('ad_copy.md', ads);
  writeOut('social_posts.md', posts);
  return { task: `Drafted ${n} ad headlines and ${campaigns().length} social posts (all held for approval)`, status: 'ok' };
}

// ---------- 4. Performance Analyst ----------
export function performanceAnalyst() {
  const cleanFile = path.join(OUT, 'metrics_clean.csv');
  const rows = readCsv(fs.existsSync(cleanFile) ? cleanFile : D('campaign_metrics.csv'));
  const agg = {};
  for (const r of rows) {
    const a = (agg[r.campaign_id] ||= { channel: r.channel, spend: 0, impressions: 0, clicks: 0, conversions: 0, revenue: 0 });
    for (const k of ['spend', 'impressions', 'clicks', 'conversions', 'revenue']) a[k] += Number(r[k]);
  }
  const report = {}; const flags = [];
  for (const [id, a] of Object.entries(agg)) {
    const m = { channel: a.channel, spend: a.spend, ctr_pct: pct(a.clicks, a.impressions), cpc: Math.round((a.spend / a.clicks) * 10) / 10,
      cpa: Math.round(a.spend / Math.max(1, a.conversions)), roas: Math.round((a.revenue / a.spend) * 100) / 100 };
    report[id] = m;
    if (m.roas < 1.5) flags.push(`Bottleneck: ${id} ${a.channel} ROAS ${m.roas}x is below 1.5x target. Pause or rework creative`);
    if (m.ctr_pct < 1) flags.push(`Bottleneck: ${id} ${a.channel} CTR ${m.ctr_pct}% is below 1%. Test new hooks`);
  }
  const best = Object.entries(report).sort((a, b2) => b2[1].roas - a[1].roas)[0];
  writeOut('performance_report.json', JSON.stringify({ campaigns: report, best_roas: { id: best[0], roas: best[1].roas }, flags }, null, 2));
  return { task: `Analysed ${Object.keys(report).length} campaigns across channels, best ROAS ${best[1].roas}x, flagged ${flags.length} bottleneck(s)`, status: 'ok' };
}

// ---------- 5. Campaign Builder ----------
export function campaignBuilder() {
  const start = new Date(); start.setHours(0, 0, 0, 0);
  const rows = [['date', 'campaign', 'channel', 'asset', 'status']];
  const assets = ['Hero video', 'Static post', 'Story', 'Reminder post'];
  for (const c of campaigns()) {
    for (let i = 0; i < 4; i++) {
      const d = new Date(start); d.setDate(d.getDate() + c.start_offset_days + i * 2);
      rows.push([d.toISOString().slice(0, 10), c.id, c.channel, c.channel === 'Email' ? `Email ${i + 1}` : assets[i], 'Scheduled draft (awaiting approval)']);
    }
  }
  fs.writeFileSync(path.join(OUT, 'content_calendar.csv'), toCsv(rows));
  const plan = campaigns().map((c) => `- ${c.id} ${c.name}: ${c.channel}, budget PKR ${c.budget_pkr.toLocaleString()}, ${((c.budget_pkr / campaigns().reduce((s, x) => s + x.budget_pkr, 0)) * 100).toFixed(0)}% of total`).join('\n');
  writeOut('campaign_plan.md', `# Campaign plan: ${brand().name}\n\nGoal: ${brand().goal}\n\n${plan}\n\nAll items are drafts. A human approves before anything is published or spent.\n`);
  return { task: `Built a 2 week content calendar with ${rows.length - 1} scheduled drafts across ${campaigns().length} campaigns`, status: 'ok' };
}

// ---------- 6. Technical Auditor (Marketing Ops) ----------
export function technicalAuditor() {
  const issues = [];
  for (const c of campaigns()) if (!/utm_source=.+utm_medium=.+utm_campaign=/.test(c.landing_url)) issues.push(`${c.id}: landing link is missing UTM tracking parameters`);
  const rows = readCsv(D('campaign_metrics.csv'));
  const clean = [];
  for (const r of rows) {
    if (Number(r.clicks) > Number(r.impressions)) issues.push(`${r.campaign_id} on ${r.date}: clicks exceed impressions (data error, row removed from clean file)`);
    else clean.push(r);
  }
  fs.writeFileSync(path.join(OUT, 'metrics_clean.csv'), ['campaign_id,channel,date,spend,impressions,clicks,conversions,revenue', ...clean.map((r) => Object.values(r).join(','))].join('\n') + '\n');
  const ads = fs.readFileSync(path.join(OUT, 'ad_copy.md'), 'utf8');
  let section = '';
  for (const line of ads.split('\n')) {
    if (line.startsWith('## ')) section = line;
    const m = line.match(/^- Headline \d: (.+)$/);
    if (m && /Google/.test(section) && m[1].length > 30) issues.push(`${section.slice(3, 9)}: Google headline is ${m[1].length} characters, limit is 30`);
  }
  for (const w of brand().banned_claims) if (ads.toLowerCase().includes(w.toLowerCase())) issues.push(`Ad copy contains banned claim "${w}"`);
  writeOut('audit_report.md', `# Marketing ops audit\n\n${issues.length ? issues.map((i) => `- ${i}`).join('\n') : 'No issues found.'}\n`);
  return { task: `Audited tracking links, metrics data and ad copy, found ${issues.length} issue(s) and wrote a cleaned metrics file`, status: issues.length ? 'partial' : 'ok' };
}

// ---------- 7. Social Triage ----------
const RULES = [
  ['Spam', /http|crypto|free followers/i, 'Ignore', 'Hide'],
  ['Complaint', /late|leak|refund|wrong|broken|stale/i, 'High', 'We are sorry about this. Please send your order number by DM and we will fix it today.'],
  ['Sales lead', /bulk|office|partner|stock|wholesale/i, 'High', 'Thank you for reaching out. Our team will send bulk and partner pricing within one business day.'],
  ['Question', /\?|where|how much|do you/i, 'Medium', 'Thanks for asking! We deliver across Islamabad and Rawalpindi, and student pricing is coming soon.'],
  ['Praise', /love|great|best|amazing/i, 'Low', 'Thank you so much! We are glad you enjoy it.'],
];
export function socialTriage() {
  const msgs = readJson(D('inbox_messages.json'));
  const rows = [['id', 'channel', 'category', 'priority', 'draft_reply']];
  const tally = {};
  for (const m of msgs) {
    const [cat, , pri, reply] = RULES.find((r) => r[1].test(m.text)) || ['Other', null, 'Low', 'Thanks for your message!'];
    tally[cat] = (tally[cat] || 0) + 1;
    rows.push([m.id, m.channel, cat, pri, reply]);
  }
  const order = { High: 0, Medium: 1, Low: 2, Ignore: 3 };
  const sorted = [rows[0], ...rows.slice(1).sort((a, b2) => order[a[3]] - order[b2[3]])];
  fs.writeFileSync(path.join(OUT, 'triage.csv'), toCsv(sorted));
  writeOut('triage_summary.md', `# Inbox triage\n\n${Object.entries(tally).map(([k, v]) => `- ${k}: ${v}`).join('\n')}\n\nReplies are drafts and are held for a human to send.\n`);
  return { task: `Triaged ${msgs.length} messages (${tally.Complaint || 0} complaints, ${tally['Sales lead'] || 0} sales leads), replies drafted and held`, status: 'ok' };
}

// ---------- 8. Outbound Strategist ----------
export function outboundStrategist() {
  const leads = readJson(D('lead_forms.json'));
  const seen = new Set(); const rows = [['company', 'contact', 'city', 'score', 'tier', 'interest']]; let invalid = 0, dupes = 0;
  const profiles = ['# Baseline account profiles\n'];
  for (const l of leads) {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(l.email)) { invalid++; continue; }
    if (seen.has(l.email.toLowerCase())) { dupes++; continue; }
    seen.add(l.email.toLowerCase());
    let score = l.employees >= 50 ? 40 : l.employees >= 10 ? 25 : 10;
    if (/bulk|office|subscription/i.test(l.interest)) score += 30; else if (/cafe|retail|stock/i.test(l.interest)) score += 20;
    score += l.source === 'referral' ? 20 : 10;
    if (['Islamabad', 'Rawalpindi', 'Lahore'].includes(l.city)) score += 10;
    const tier = score >= 80 ? 'A' : score >= 55 ? 'B' : 'C';
    rows.push([l.company, l.name, l.city, score, tier, l.interest]);
    profiles.push(`## ${l.company} (${tier})\n- Contact: ${l.name}, ${l.city}\n- Size: ${l.employees} people\n- Interest: ${l.interest}\n- Source: ${l.source}\n- Next step: ${tier === 'A' ? 'personal call and bulk offer' : tier === 'B' ? 'send sample pack' : 'add to nurture email'}\n`);
  }
  fs.writeFileSync(path.join(OUT, 'target_accounts.csv'), toCsv(rows));
  writeOut('account_profiles.md', profiles.join('\n'));
  return { task: `Parsed ${leads.length} lead forms into ${rows.length - 1} target accounts (${invalid} invalid, ${dupes} duplicate removed)`, status: 'ok' };
}
