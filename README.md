# Epoch Hover (EDT/EST)

Chrome extension that shows a hovering note converting epoch-timestamp folder/file
names to **US Eastern time** while browsing the AWS web console. It uses the
`America/New_York` zone, so it automatically renders **EDT** in summer and **EST**
in winter (DST is handled for you).

## What it does
- Hover any name that is (or contains) an epoch timestamp — 10-digit (seconds),
  13-digit (ms), 16-digit (µs), or 19-digit (ns) — and a tooltip appears with the
  full date/time and the active abbreviation (EDT/EST, etc.).
- **Toolbar popup** (click the extension icon): pick the display timezone
  (Eastern by default, plus Central/Mountain/Pacific/UTC/London/CET/India/China/
  Japan, or "Auto" = this browser's zone) and toggle **pin-on-click**.
- **Pin on click** (on by default): clicking a timestamp keeps the note open
  (and suppresses the AWS link navigation). Dismiss with the ×, `Esc`, or by
  clicking elsewhere.

## Install (unpacked)
1. Open `chrome://extensions` in Chrome.
2. Toggle **Developer mode** on (top-right).
3. Click **Load unpacked**.
4. Select this folder: `C:\Users\Kelvin\EpochExt`.
5. Open the AWS console (e.g. an S3 bucket listing) and hover a timestamp name.

If you change the code, click the **reload** icon on the extension card.

## Test without AWS
Open `test.html` in Chrome (double-click it) and hover the sample rows to verify
the conversion logic.

## Scope / tweaks
- Domains are limited to `*.aws.amazon.com` in `manifest.json` — add more
  `matches` there if your console runs on a different host.
- Detection bounds (year ~2001–2100) and digit lengths live at the top of
  `content.js`.
