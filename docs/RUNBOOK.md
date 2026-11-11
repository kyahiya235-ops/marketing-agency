# Runbook: connect the Sheet, email, GitHub and record the video

Follow in order. Each step says what to capture for the submission.

## 0. Run it locally first (2 min)
```
node scripts/runlog.mjs --selftest
node scripts/run_all.mjs
```
Expect `PASS runlog selftest`, then 8 lines ending `sheet: queued locally` (the Sheet is not connected yet), then the brief.

## 1. Create the Google Sheet and the bridge (10 min)
1. Go to sheets.new and name it **Marketing Agency Ledger**.
2. Extensions > Apps Script. Delete the sample code and paste all of `apps-script/Code.gs`. Save (Ctrl+S).
3. Click the gear icon (Project Settings), tick **Show "appsscript.json" manifest file in editor**. Back in the editor open
   `appsscript.json`, replace its content with the content of `apps-script/appsscript.json`, and save. (This avoids the
   "You do not have permission to call ScriptApp.getProjectTriggers" error.)
4. Open `Code.gs`, choose **setup** in the function dropdown, click Run. On the permission screen tick **Select all**, then scroll down and click **Continue**.
5. Execution log shows `WEBHOOK_SECRET = ...`. Copy that value. The `Ledger` tab appears in the Sheet (press F5).
6. Deploy > New deployment > type **Web app** > Execute as **Me** > Who has access **Anyone** > Deploy. Copy the `/exec` URL.
7. Test: open the `/exec` URL in a browser tab. You should see `{"ok":true,"service":"Marketing Agency ledger bridge",...}`.
8. Share the Sheet: Share > General access > Anyone with the link > Viewer. Copy the link for your submission.

## 2. Run the agency with Sheet and email connected (2 min)
Windows (cmd), in the project folder, no quotes:
```
set SHEET_WEBHOOK_URL=<the /exec URL>
set WEBHOOK_SECRET=<the secret>
del runlog.jsonl
del data\ledger-queue.csv
node scripts/run_all.mjs
```
Expected: 8 lines ending `sheet: row added`, the brief, then `EMAIL: sent via Apps Script`.
Check: 8 new rows on the Ledger tab and an email titled `[Marketing Agency] Daily brief <date>` in your inbox (check Spam).
Take a screenshot of the Sheet and of the email (Print > Save as PDF gives an email copy).
If rows were queued: `node scripts/sheet_bridge.mjs --flush`.

## 3. Make the daily email automatic
`setup()` installed a trigger that emails a brief from the Sheet every day at about 18:30, even when your laptop is off.
Also run the agency on a second day so the inbox shows two confirmation emails.

## 4. Push to GitHub
Create an empty repo named `marketing-agency` on github.com (no README), then in the project folder:
```
git init
git config user.name "Your Name"
git config user.email "you@example.com"
git add .
git commit -m "AI Marketing Agency: 8 AI employees, sheet and email bridges"
git branch -M main
git remote add origin https://github.com/<your-username>/marketing-agency.git
git push -u origin main
```
Confirm `.installed.json`, `scripts/`, `apps-script/` and `employees/` are visible. Never put the webhook URL or secret in a file.

## 5. Screen recording (5 to 8 minutes)
Prepare: set the two variables in the terminal, run `cls`, open tabs for the Sheet, Gmail and the GitHub repo.
Record with Windows+G or OBS, in this order:
1. Folder tree and `.installed.json` (8 employees).
2. Terminal: `node scripts/runlog.mjs --selftest`, then `node scripts/run_all.mjs`. Say what each agent does as its line appears.
3. `data\out` files: open `content_calendar.csv`, `audit_report.md`, `triage.csv`.
4. The Google Sheet with the new rows (press F5).
5. Gmail with the daily brief.
6. The GitHub repo page.

## 6. Submission checklist
- [ ] 1-page agency plan (`docs/Marketing_Agency_Plan.pdf` or .docx)
- [ ] Google Sheet link and confirmation email copies
- [ ] GitHub link (shows `.installed.json`, scripts, apps-script)
- [ ] Screen recording video
- [ ] PPT (`docs/Marketing_Agency_Presentation.pptx`) with your GitHub username and Sheet link on the last slide
