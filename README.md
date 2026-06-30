# EpochExt

A lightweight Chrome extension that converts epoch timestamps into
human-readable local time on **any website**. Hover any text containing a Unix
timestamp and a tooltip shows the full date and time in your chosen timezone.

By default it renders **US Eastern** time using the `America/New_York` zone, so
it automatically shows **EDT** in summer and **EST** in winter — daylight saving
is handled for you.

---

## Features

- **Hover to convert** — Point at any name that is (or contains) an epoch
  timestamp and a tooltip appears with the full date/time and the active
  timezone abbreviation (e.g. EDT/EST).
- **Multiple precisions** — Detects 10-digit (seconds), 13-digit
  (milliseconds), 16-digit (microseconds), and 19-digit (nanoseconds)
  timestamps.
- **Configurable timezone** — Choose from Eastern, Central, Mountain, Pacific,
  UTC, London, Central Europe, India, China, Japan, or **Auto** (your browser's
  current zone) via the toolbar popup.
- **Pin on click** — Off by default; enable it in the popup. When on, click a
  timestamp to keep the tooltip open (and suppress the underlying link
  navigation). Dismiss with the **×**, the `Esc` key, or by clicking elsewhere.
- **Noise-resistant** — Only recognizes values in a sensible date range
  (~2001–2100) so it won't light up on random ID-like numbers.

---

## Installation

This extension is distributed as an unpacked Chrome extension.

1. **Download the source.** Clone the repository or download it as a ZIP and
   extract it:

   ```bash
   git clone https://github.com/ilovefood2/epochext.git
   ```

2. Open `chrome://extensions` in Chrome (or any Chromium-based browser such as
   Edge or Brave).
3. Enable **Developer mode** using the toggle in the top-right corner.
4. Click **Load unpacked** and select the folder that contains
   `manifest.json` (the project's root directory).
5. The **EpochExt** card will appear in your extensions list.

Open any page that shows Unix timestamps and hover one to confirm it's working.

> **Updating the code?** After editing any file, click the **reload** (↻) icon
> on the extension card to apply your changes.

---

## Usage

1. Click the **EpochExt** toolbar icon to open settings.
2. Pick your **display timezone** and toggle **Pin tooltip on click**.
3. Browse any site and **hover** a timestamp to see the conversion.
4. With pinning enabled, **click** a timestamp to keep the note open; dismiss it
   with the **×**, `Esc`, or a click elsewhere.

---

## Testing

Open `test.html` in your browser (double-click it) and hover the sample rows to
verify the conversion logic against a few known timestamps.

---

## Configuration

The extension is intentionally simple to customize:

- **Matched sites** — Defined by the `matches` array in `manifest.json`. Out of
  the box it runs on **all** sites (`http://*/*` and `https://*/*`). Narrow this
  to specific domains if you'd rather limit where it activates.
- **Detection bounds** — The accepted timestamp range (years ~2001–2100) and the
  recognized digit lengths are defined near the top of `content.js`.

---

## Project structure

| File          | Purpose                                                        |
| ------------- | -------------------------------------------------------------- |
| `manifest.json` | Extension manifest (Manifest V3) and content-script matches. |
| `content.js`  | Timestamp detection, conversion, and tooltip behavior.         |
| `tooltip.css` | Styling for the hover/pinned tooltip.                          |
| `popup.html`  | Toolbar popup UI (timezone selector, pin toggle).              |
| `popup.js`    | Loads and persists settings via `chrome.storage.sync`.         |
| `test.html`   | Standalone page for testing the conversion.                    |

---

## Permissions

The extension requests only the `storage` permission, used to save your
timezone and pin preferences across sessions.
