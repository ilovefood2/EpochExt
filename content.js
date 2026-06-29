(function () {
  "use strict";

  const DEFAULTS = { tz: "America/New_York", pinOnClick: true };
  const config = { ...DEFAULTS };

  // Match a standalone run of 10, 13, 16, or 19 digits anywhere in the text.
  // 10 = seconds, 13 = milliseconds, 16 = microseconds, 19 = nanoseconds.
  const EPOCH_RE = /(?<!\d)(\d{10}|\d{13}|\d{16}|\d{19})(?!\d)/;

  // Sane bounds so we don't light up on random ID-looking numbers:
  // 2001-09-09 .. 2100-01-01 (in ms).
  const MIN_MS = 1000000000000;
  const MAX_MS = 4102444800000;

  // ---- settings -----------------------------------------------------------
  function resolvedTz() {
    return config.tz === "auto"
      ? Intl.DateTimeFormat().resolvedOptions().timeZone
      : config.tz;
  }

  if (chrome.storage && chrome.storage.sync) {
    chrome.storage.sync.get(DEFAULTS, (cfg) => Object.assign(config, cfg));
    chrome.storage.onChanged.addListener((changes, area) => {
      if (area !== "sync") return;
      for (const key in changes) config[key] = changes[key].newValue;
    });
  }

  // ---- tooltip element ----------------------------------------------------
  let tooltip = null;
  let pinned = false;
  let activeDigits = null;

  function getTooltip() {
    if (tooltip && document.body.contains(tooltip)) return tooltip;
    tooltip = document.createElement("div");
    tooltip.id = "epoch-hover-tooltip";
    document.body.appendChild(tooltip);
    return tooltip;
  }

  function hide() {
    pinned = false;
    activeDigits = null;
    if (tooltip) {
      tooltip.classList.remove("visible", "pinned");
      tooltip.style.pointerEvents = "none";
    }
  }

  // ---- conversion ---------------------------------------------------------
  function toMillis(digits) {
    const len = digits.length;
    const n = Number(digits);
    if (len === 10) return n * 1000;
    if (len === 13) return n;
    if (len === 16) return Math.floor(n / 1000);
    if (len === 19) return Math.floor(n / 1000000);
    return NaN;
  }

  function buildContent(digits) {
    const ms = toMillis(digits);
    if (!Number.isFinite(ms) || ms < MIN_MS || ms > MAX_MS) return null;

    const date = new Date(ms);
    const tz = resolvedTz();

    // Date/time without the timezone suffix; we append a highlighted
    // abbreviation ourselves below (medium time keeps seconds, drops the zone).
    const datetime = new Intl.DateTimeFormat("en-US", {
      timeZone: tz,
      dateStyle: "full",
      timeStyle: "medium",
    }).format(date);

    const parts = new Intl.DateTimeFormat("en-US", {
      timeZone: tz,
      timeZoneName: "short",
    }).formatToParts(date);
    const abbr = (parts.find((p) => p.type === "timeZoneName") || {}).value || tz;

    const unitName =
      digits.length === 10 ? "seconds" :
      digits.length === 13 ? "milliseconds" :
      digits.length === 16 ? "microseconds" : "nanoseconds";

    const closeBtn = pinned ? '<span class="eh-close" title="Close">&times;</span>' : "";

    return (
      closeBtn +
      `<span class="eh-row">${datetime} <span class="eh-tz">${abbr}</span></span>` +
      `<span class="eh-row eh-muted">epoch ${digits} (${unitName})</span>`
    );
  }

  function findEpochInElement(el) {
    if (!el || el.nodeType !== 1) return null;
    const text = (el.textContent || "").trim();
    if (text.length === 0 || text.length > 64) return null;
    const m = EPOCH_RE.exec(text);
    return m ? m[1] : null;
  }

  // ---- positioning --------------------------------------------------------
  function position(clientX, clientY) {
    const t = getTooltip();
    const pad = 14;
    let x = clientX + pad;
    let y = clientY + pad;
    const rect = t.getBoundingClientRect();
    if (x + rect.width > window.innerWidth) x = clientX - rect.width - pad;
    if (y + rect.height > window.innerHeight) y = clientY - rect.height - pad;
    t.style.left = Math.max(0, x) + "px";
    t.style.top = Math.max(0, y) + "px";
  }

  function show(digits, clientX, clientY, asPinned) {
    pinned = !!asPinned;
    const html = buildContent(digits);
    if (!html) {
      pinned = false;
      return false;
    }
    activeDigits = digits;
    const t = getTooltip();
    t.innerHTML = html;
    t.classList.toggle("pinned", pinned);
    t.style.pointerEvents = pinned ? "auto" : "none";
    position(clientX, clientY);
    t.classList.add("visible");
    return true;
  }

  // ---- events -------------------------------------------------------------
  document.addEventListener(
    "mouseover",
    function (e) {
      if (pinned) return;
      const digits = findEpochInElement(e.target);
      if (!digits) return;
      show(digits, e.clientX, e.clientY, false);
    },
    true
  );

  document.addEventListener(
    "mousemove",
    function (e) {
      if (pinned || !activeDigits) return;
      if (findEpochInElement(e.target) !== activeDigits) {
        hide();
        return;
      }
      position(e.clientX, e.clientY);
    },
    true
  );

  document.addEventListener(
    "mouseout",
    function () {
      if (pinned) return;
      hide();
    },
    true
  );

  document.addEventListener(
    "click",
    function (e) {
      // Click the close button (×) inside a pinned tooltip.
      if (pinned && tooltip && tooltip.contains(e.target)) {
        if (e.target.classList && e.target.classList.contains("eh-close")) {
          e.preventDefault();
          e.stopPropagation();
          hide();
        }
        return;
      }

      if (!config.pinOnClick) return;

      const digits = findEpochInElement(e.target);
      if (digits) {
        // Pin onto this timestamp without following the AWS link.
        e.preventDefault();
        e.stopPropagation();
        show(digits, e.clientX, e.clientY, true);
      } else if (pinned) {
        // Clicked elsewhere: dismiss the pinned note.
        hide();
      }
    },
    true
  );

  window.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && pinned) hide();
  });

  window.addEventListener("scroll", function () { if (!pinned) hide(); }, true);
})();
