/* ============================================================
   Treat Yourself — app logic
   Everything lives in localStorage. No network, no accounts.
   ============================================================ */

(function () {
  "use strict";

  const STORAGE_KEY = "treat-yourself/v1";
  const DEFAULT_LIMIT = 25;      // AHA guideline for women, in grams of added sugar
  const KEEP_DAYS = 30;

  // ---------- storage ----------

  function todayKey(d) {
    const t = d || new Date();
    return [
      t.getFullYear(),
      String(t.getMonth() + 1).padStart(2, "0"),
      String(t.getDate()).padStart(2, "0"),
    ].join("-");
  }

  function blankState() {
    return { limit: DEFAULT_LIMIT, days: {}, custom: [], profile: null };
  }

  function load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return blankState();
      const parsed = JSON.parse(raw);
      return {
        limit: Number(parsed.limit) > 0 ? Number(parsed.limit) : DEFAULT_LIMIT,
        days: parsed.days && typeof parsed.days === "object" ? parsed.days : {},
        custom: Array.isArray(parsed.custom) ? parsed.custom : [],
        profile: normalizeProfile(parsed.profile),
      };
    } catch (err) {
      console.warn("Could not read saved data, starting fresh.", err);
      return blankState();
    }
  }

  function save() {
    // Keep storage tidy: only the most recent KEEP_DAYS days.
    const keys = Object.keys(state.days).sort();
    while (keys.length > KEEP_DAYS) delete state.days[keys.shift()];
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      return true;
    } catch (err) {
      console.warn("Could not save. Private browsing?", err);
      return false;
    }
  }

  const state = load();
  let currentDay = todayKey();
  let activeCategory = "All";
  let searchTerm = "";

  function entriesForToday() {
    if (!state.days[currentDay]) state.days[currentDay] = [];
    return state.days[currentDay];
  }

  function totalForDay(key) {
    const list = state.days[key] || [];
    return list.reduce((sum, e) => sum + Number(e.sugar || 0), 0);
  }

  // ---------- elements ----------

  const $ = (id) => document.getElementById(id);

  const el = {
    todayLabel: $("today-label"),
    settingsBtn: $("settings-btn"),
    settingsPanel: $("settings-panel"),
    limitInput: $("limit-input"),
    limitSave: $("limit-save"),
    categories: $("categories"),
    treatGrid: $("treat-grid"),
    noResults: $("no-results"),
    search: $("search"),
    customForm: $("custom-form"),
    customName: $("custom-name"),
    customSugar: $("custom-sugar"),
    customEmoji: $("custom-emoji"),
    customDetails: $("custom-treat"),
    logList: $("log-list"),
    logEmpty: $("log-empty"),
    clearDay: $("clear-day"),
    totalNumber: $("total-number"),
    totalLimit: $("total-limit"),
    scaleTrack: document.querySelector(".scale-track"),
    scaleFill: $("scale-fill"),
    scaleLimitLine: $("scale-limit-line"),
    scaleTicks: $("scale-ticks"),
    scaleReadout: $("scale-readout"),
    scalePct: $("scale-pct"),
    scaleZone: $("scale-zone"),
    scaleMessage: $("scale-message"),
    scaleRemaining: $("scale-remaining"),
    historyChart: $("history-chart"),
    historyAvg: $("history-avg"),
    toast: $("toast"),
    shareBtn: $("share-btn"),
  };

  // ---------- helpers ----------

  const round = (n) => Math.round(n * 10) / 10;

  function fmt(n) {
    const r = round(n);
    return Number.isInteger(r) ? String(r) : r.toFixed(1);
  }

  let toastTimer;
  function toast(msg) {
    el.toast.textContent = msg;
    el.toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.toast.classList.remove("show"), 2200);
  }

  function allTreats() {
    return TREATS.concat(state.custom.map((c) => Object.assign({}, c, { cat: "Yours" })));
  }

  // ---------- the scale ----------

  // Zones are deliberately gentle. The point is awareness, not guilt.
  const ZONES = [
    {
      max: 0,  cls: "zone-easy",  label: "Fresh start",
      msgs: ["A brand new day of sweetness. 🌸"],
    },
    {
      max: 40, cls: "zone-easy",  label: "Easy going",
      msgs: [
        "Plenty of room left. Enjoy it. 🍵",
        "Nice and steady so far. 🌿",
        "You're cruising. 💚",
      ],
    },
    {
      max: 70, cls: "zone-going", label: "Getting sweet",
      msgs: [
        "A good amount of sweet today — still comfortably in range. 🍯",
        "Over halfway to your goal. Worth a glance before the next one. 🧁",
        "Sweet so far, and nothing to worry about. 🌼",
      ],
    },
    {
      max: 95, cls: "zone-close", label: "Nearly there",
      msgs: [
        "Getting close to your goal. Maybe save the rest for later? 🍊",
        "Almost at your number for today. 🫖",
        "Close to the line — your call from here. 💛",
      ],
    },
    {
      max: 110, cls: "zone-at",   label: "At your goal",
      msgs: [
        "That's your goal for today. 🎀",
        "Right about at your number. Nicely tracked. ✨",
      ],
    },
    {
      max: Infinity, cls: "zone-over", label: "Past your goal",
      msgs: [
        "Past your goal today — and that's genuinely okay. Tomorrow resets. 💗",
        "Over the line. One day doesn't undo anything. 🌙",
        "A sweeter day than usual. Be kind to yourself about it. 🩷",
      ],
    },
  ];

  function zoneFor(pct) {
    if (pct <= 0) return ZONES[0];
    return ZONES.find((z) => pct <= z.max) || ZONES[ZONES.length - 1];
  }

  let lastZoneLabel = null;

  function renderScale(animate) {
    const total = totalForDay(currentDay);
    const limit = state.limit;
    const pct = limit > 0 ? (total / limit) * 100 : 0;
    const zone = zoneFor(pct);

    // The track shows up to 125% of the goal so going over is still visible.
    const trackMax = limit * 1.25;
    const fillPct = Math.min(100, (total / trackMax) * 100);

    el.scaleFill.style.height = fillPct + "%";
    el.scaleTrack.className = "scale-track " + zone.cls;
    el.scaleLimitLine.style.bottom = (100 / 1.25) + "%";

    el.scalePct.textContent = Math.round(pct);
    if (window.Honey) Honey.setMood(pct);
    el.scaleZone.textContent = zone.label;

    el.scaleReadout.setAttribute("aria-valuenow", fmt(total));
    el.scaleReadout.setAttribute("aria-valuemax", fmt(limit));
    el.scaleReadout.setAttribute(
      "aria-valuetext",
      fmt(total) + " of " + fmt(limit) + " grams — " + zone.label
    );

    // Only reroll the message when the zone changes, so it doesn't flicker.
    if (zone.label !== lastZoneLabel) {
      el.scaleMessage.textContent = zone.msgs[Math.floor(Math.random() * zone.msgs.length)];
      lastZoneLabel = zone.label;
    }

    const left = limit - total;
    el.scaleRemaining.textContent =
      total === 0 ? ""
      : left > 0 ? fmt(left) + " g left before your goal"
      : fmt(Math.abs(left)) + " g past your goal";

    if (animate) {
      el.scaleTrack.classList.remove("pulse");
      void el.scaleTrack.offsetWidth; // restart the animation
      el.scaleTrack.classList.add("pulse");
    }
  }

  function renderTicks() {
    const frag = document.createDocumentFragment();
    // Ticks at 25 / 50 / 75 / 100 / 125 percent of the goal.
    [25, 50, 75, 100, 125].forEach((p) => {
      const tick = document.createElement("div");
      tick.className = "scale-tick";
      tick.style.bottom = (p / 1.25) + "%";
      frag.appendChild(tick);
    });
    el.scaleTicks.replaceChildren(frag);
  }

  // ---------- picker ----------

  function renderCategories() {
    const frag = document.createDocumentFragment();
    CATEGORY_ORDER.forEach((cat) => {
      if (cat === "Yours" && state.custom.length === 0) return;
      const btn = document.createElement("button");
      btn.className = "cat-btn";
      btn.type = "button";
      btn.role = "tab";
      btn.textContent = cat;
      btn.setAttribute("aria-selected", String(cat === activeCategory));
      btn.addEventListener("click", () => {
        activeCategory = cat;
        renderCategories();
        renderTreats();
      });
      frag.appendChild(btn);
    });
    el.categories.replaceChildren(frag);
  }

  function renderTreats() {
    const term = searchTerm.trim().toLowerCase();
    const list = allTreats().filter((t) => {
      const inCat = activeCategory === "All" || t.cat === activeCategory;
      const inSearch = !term || t.name.toLowerCase().includes(term);
      return inCat && inSearch;
    });

    const frag = document.createDocumentFragment();
    list.forEach((treat) => {
      const li = document.createElement("li");

      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "treat-card";
      btn.dataset.cat = treat.cat;
      btn.addEventListener("click", () => addTreat(treat, btn));

      const emoji = document.createElement("span");
      emoji.className = "treat-emoji";
      emoji.textContent = treat.emoji || "🍬";
      emoji.setAttribute("aria-hidden", "true");

      const name = document.createElement("span");
      name.className = "treat-name";
      name.textContent = treat.name;

      const sugar = document.createElement("span");
      sugar.className = "treat-sugar";
      sugar.textContent = fmt(treat.sugar) + " g sugar";

      btn.append(emoji, name, sugar);

      if (treat.serving) {
        const serving = document.createElement("span");
        serving.className = "treat-serving";
        serving.textContent = treat.serving;
        btn.appendChild(serving);
      }

      li.appendChild(btn);

      if (treat.cat === "Yours") {
        const del = document.createElement("button");
        del.type = "button";
        del.className = "remove-custom";
        del.textContent = "✕";
        del.title = "Delete this custom treat";
        del.setAttribute("aria-label", "Delete " + treat.name);
        del.addEventListener("click", (e) => {
          e.stopPropagation();
          removeCustom(treat.id);
        });
        li.appendChild(del);
        li.style.position = "relative";
      }

      frag.appendChild(li);
    });

    el.treatGrid.replaceChildren(frag);
    el.noResults.hidden = list.length > 0;
  }

  // ---------- today's log ----------

  function addTreat(treat, sourceEl) {
    rolloverIfNeeded();
    entriesForToday().push({
      id: "e" + Date.now() + Math.random().toString(36).slice(2, 6),
      name: treat.name,
      emoji: treat.emoji || "🍬",
      sugar: Number(treat.sugar),
      t: Date.now(),
    });
    save();
    renderLog();
    renderScale(true);
    renderHistory();
    toast(treat.emoji + "  " + treat.name + " · +" + fmt(treat.sugar) + " g");
    if (window.Honey) Honey.celebrate(sourceEl, treat);
  }

  function removeEntry(id) {
    const list = entriesForToday();
    const i = list.findIndex((e) => e.id === id);
    if (i === -1) return;
    const [gone] = list.splice(i, 1);
    save();
    renderLog();
    renderScale(false);
    renderHistory();
    toast("Removed " + gone.name);
  }

  function renderLog() {
    const list = entriesForToday().slice().sort((a, b) => b.t - a.t);
    const total = totalForDay(currentDay);

    el.totalNumber.textContent = fmt(total);
    el.totalLimit.textContent = fmt(state.limit);
    el.logEmpty.hidden = list.length > 0;

    const frag = document.createDocumentFragment();
    list.forEach((entry) => {
      const li = document.createElement("li");
      li.className = "log-item";

      const emoji = document.createElement("span");
      emoji.className = "log-emoji";
      emoji.textContent = entry.emoji;
      emoji.setAttribute("aria-hidden", "true");

      const body = document.createElement("div");
      body.className = "log-body";

      const name = document.createElement("span");
      name.className = "log-name";
      name.textContent = entry.name;

      const time = document.createElement("span");
      time.className = "log-time";
      time.textContent = new Date(entry.t).toLocaleTimeString([], {
        hour: "numeric",
        minute: "2-digit",
      });

      body.append(name, time);

      const sugar = document.createElement("span");
      sugar.className = "log-sugar";
      sugar.textContent = fmt(entry.sugar) + " g";

      const del = document.createElement("button");
      del.type = "button";
      del.className = "log-remove";
      del.textContent = "✕";
      del.setAttribute("aria-label", "Remove " + entry.name);
      del.addEventListener("click", () => removeEntry(entry.id));

      li.append(emoji, body, sugar, del);
      frag.appendChild(li);
    });

    el.logList.replaceChildren(frag);
  }

  // ---------- history ----------

  function renderHistory() {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = todayKey(d);
      days.push({ key, label: d.toLocaleDateString([], { weekday: "narrow" }), total: totalForDay(key) });
    }

    const peak = Math.max(state.limit, ...days.map((d) => d.total), 1);
    const frag = document.createDocumentFragment();

    days.forEach((d) => {
      const col = document.createElement("div");
      col.className = "hist-col";

      const val = document.createElement("span");
      val.className = "hist-val";
      val.textContent = d.total > 0 ? fmt(d.total) : "";

      const bar = document.createElement("div");
      bar.className = "hist-bar"
        + (d.total === 0 ? " empty" : "")
        + (d.total > state.limit ? " over" : "")
        + (d.key === currentDay ? " today" : "");
      bar.style.height = Math.max(4, (d.total / peak) * 62) + "px";
      bar.title = d.key + ": " + fmt(d.total) + " g";

      const label = document.createElement("span");
      label.className = "hist-label";
      label.textContent = d.label;

      col.append(val, bar, label);
      frag.appendChild(col);
    });

    el.historyChart.replaceChildren(frag);

    const logged = days.filter((d) => d.total > 0);
    el.historyAvg.textContent = logged.length
      ? "Average on days you logged: " + fmt(days.reduce((s, d) => s + d.total, 0) / logged.length) + " g"
      : "Log a treat and your week starts filling in.";

    if (window.Honey) Honey.renderStreak(state.days, state.limit, todayKey);
  }

  // ---------- custom treats ----------

  function addCustom(e) {
    e.preventDefault();
    const name = el.customName.value.trim();
    const sugar = Number(el.customSugar.value);
    if (!name || !isFinite(sugar) || sugar < 0) return;

    state.custom.push({
      id: "c" + Date.now(),
      name: name.slice(0, 40),
      emoji: el.customEmoji.value.trim() || "🍬",
      sugar: round(sugar),
      serving: "your treat",
    });
    save();

    el.customForm.reset();
    activeCategory = "Yours";
    searchTerm = "";
    el.search.value = "";
    renderCategories();
    renderTreats();
    toast("Added " + name + " to your treats");
  }

  function removeCustom(id) {
    const i = state.custom.findIndex((c) => c.id === id);
    if (i === -1) return;
    const [gone] = state.custom.splice(i, 1);
    if (state.custom.length === 0 && activeCategory === "Yours") activeCategory = "All";
    save();
    renderCategories();
    renderTreats();
    toast("Deleted " + gone.name);
  }

  // ---------- day rollover ----------

  function rolloverIfNeeded() {
    const now = todayKey();
    if (now === currentDay) return false;
    currentDay = now;
    lastZoneLabel = null;
    renderTodayLabel();
    renderLog();
    renderScale(false);
    renderHistory();
    return true;
  }

  function renderTodayLabel() {
    el.todayLabel.textContent = new Date().toLocaleDateString([], {
      weekday: "long",
      month: "short",
      day: "numeric",
    });
  }

  // ---------- optional health profile ----------
  function normalizeProfile(value) {
    if (!value || typeof value !== "object" || Array.isArray(value)) return null;
    const age = value.age == null || value.age === "" ? null : Number(value.age);
    const weight = value.weight == null || value.weight === "" ? null : Number(value.weight);
    const histories = ["", "none", "prediabetes", "type1", "type2", "gestational", "past-gestational"];
    return {
      age: Number.isInteger(age) && age >= 1 && age <= 120 ? age : null,
      weight: Number.isFinite(weight) && weight > 0 && weight <= 1500 ? weight : null,
      weightUnit: value.weightUnit === "lb" ? "lb" : "kg",
      diabetes: histories.includes(value.diabetes) ? value.diabetes : "",
      familyHistory: ["yes", "no"].includes(value.familyHistory) ? value.familyHistory : "",
    };
  }

  function renderProfile() {
    const profile = state.profile || {};
    $("profile-age").value = profile.age ?? "";
    $("profile-weight").value = profile.weight ?? "";
    $("profile-unit").value = profile.weightUnit || "kg";
    $("profile-diabetes").value = profile.diabetes || "";
    $("profile-family").value = profile.familyHistory || "";
  }

  function saveProfile(event) {
    event.preventDefault();
    const ageText = $("profile-age").value.trim();
    const weightText = $("profile-weight").value.trim();
    const age = ageText === "" ? null : Number(ageText);
    const weight = weightText === "" ? null : Number(weightText);
    if (ageText !== "" && (!Number.isInteger(age) || age < 1 || age > 120)) {
      $("profile-status").textContent = "Enter an age from 1 to 120, or leave it blank.";
      $("profile-age").focus();
      return;
    }
    if (weightText !== "" && (!Number.isFinite(weight) || weight <= 0 || weight > 1500)) {
      $("profile-status").textContent = "Enter a weight above 0 and at most 1500, or leave it blank.";
      $("profile-weight").focus();
      return;
    }
    state.profile = normalizeProfile({ age, weight, weightUnit: $("profile-unit").value,
      diabetes: $("profile-diabetes").value, familyHistory: $("profile-family").value });
    $("profile-status").textContent = save()
      ? "Health profile saved in this browser."
      : "Profile updated for this session, but browser storage is unavailable. It will not persist after reload.";
  }

  // ---------- settings ----------

  function setLimit(value) {
    const n = Number(value);
    if (!isFinite(n) || n <= 0) {
      toast("Pick a number above 0");
      return;
    }
    state.limit = Math.min(300, round(n));
    el.limitInput.value = state.limit;
    lastZoneLabel = null;
    save();
    renderLog();
    renderTicks();
    renderScale(false);
    renderHistory();
    toast("Daily goal set to " + fmt(state.limit) + " g");
  }

  function wireUp() {
    $("profile-form").addEventListener("submit", saveProfile);
    $("profile-clear").addEventListener("click", () => {
      state.profile = null;
      const stored = save();
      renderProfile();
      $("profile-status").textContent = stored ? "Health profile cleared." : "Cleared for this session, but saved browser data could not be updated.";
    });
    el.settingsBtn.addEventListener("click", () => {
      const open = el.settingsPanel.hidden;
      el.settingsPanel.hidden = !open;
      el.settingsBtn.setAttribute("aria-expanded", String(open));
      if (open) el.limitInput.focus();
    });

    el.limitSave.addEventListener("click", () => setLimit(el.limitInput.value));
    el.limitInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") { e.preventDefault(); setLimit(el.limitInput.value); }
    });

    el.settingsPanel.querySelectorAll("[data-limit]").forEach((btn) => {
      btn.addEventListener("click", () => setLimit(btn.dataset.limit));
    });

    el.search.addEventListener("input", () => {
      searchTerm = el.search.value;
      renderTreats();
    });

    el.customForm.addEventListener("submit", addCustom);

    el.clearDay.addEventListener("click", () => {
      if (entriesForToday().length === 0) return;
      state.days[currentDay] = [];
      lastZoneLabel = null;
      save();
      renderLog();
      renderScale(false);
      renderHistory();
      toast("Cleared today");
    });

    if (el.shareBtn && window.Honey) {
      el.shareBtn.addEventListener("click", async () => {
        const total = totalForDay(currentDay);
        el.shareBtn.disabled = true;
        try {
          await Honey.downloadShareCard({
            total: fmt(total),
            limit: fmt(state.limit),
            pct: state.limit > 0 ? (total / state.limit) * 100 : 0,
            dateLabel: el.todayLabel.textContent,
            message: el.scaleMessage.textContent,
            entries: entriesForToday().slice().sort((a, b) => a.t - b.t)
              .map((e) => ({ emoji: e.emoji, name: e.name, sugar: fmt(e.sugar) })),
          });
          toast("Your sweet day card is ready 📸");
        } catch (err) {
          console.warn("Could not make the share card.", err);
          toast("Couldn't make the card this time");
        } finally {
          el.shareBtn.disabled = false;
        }
      });
    }

    // Catch a day change while the tab is left open overnight.
    setInterval(rolloverIfNeeded, 60 * 1000);
    document.addEventListener("visibilitychange", () => {
      if (!document.hidden) rolloverIfNeeded();
    });
  }

  // ---------- start ----------

  if (window.Honey) Honey.fillBears();
  el.limitInput.value = state.limit;
  renderProfile();
  renderTodayLabel();
  renderCategories();
  renderTreats();
  renderLog();
  renderTicks();
  renderScale(false);
  renderHistory();
  wireUp();
})();
