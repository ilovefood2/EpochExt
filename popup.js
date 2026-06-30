const DEFAULTS = { tz: "America/New_York", pinOnClick: false };

const tzEl = document.getElementById("tz");
const pinEl = document.getElementById("pin");
const savedEl = document.getElementById("saved");

let savedTimer = null;
function flashSaved() {
  savedEl.textContent = "Saved";
  clearTimeout(savedTimer);
  savedTimer = setTimeout(() => (savedEl.textContent = ""), 1200);
}

chrome.storage.sync.get(DEFAULTS, (cfg) => {
  tzEl.value = cfg.tz;
  pinEl.checked = cfg.pinOnClick;
});

tzEl.addEventListener("change", () => {
  chrome.storage.sync.set({ tz: tzEl.value }, flashSaved);
});

pinEl.addEventListener("change", () => {
  chrome.storage.sync.set({ pinOnClick: pinEl.checked }, flashSaved);
});
