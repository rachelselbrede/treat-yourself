/* ============================================================
   Treat Yourself: Honey the bear, plus the little delights
   (confetti, the flying treat, moods, streak, share card).
   ============================================================ */

(function () {
  "use strict";

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  // ---------- Honey the bear ----------

  const EYES = {
    happy:
      '<g class="bear-eyes">' +
      '<circle cx="47" cy="48" r="3.6" fill="#3b2420"/><circle cx="48.2" cy="46.8" r="1.2" fill="#fff"/>' +
      '<circle cx="73" cy="48" r="3.6" fill="#3b2420"/><circle cx="74.2" cy="46.8" r="1.2" fill="#fff"/></g>',
    content:
      '<g fill="none" stroke="#3b2420" stroke-width="2.6" stroke-linecap="round">' +
      '<path d="M43 49 Q47 44.5 51 49"/><path d="M69 49 Q73 44.5 77 49"/></g>',
    ohmy:
      '<g class="bear-eyes">' +
      '<circle cx="47" cy="48" r="4.6" fill="#3b2420"/><circle cx="48.6" cy="46.4" r="1.6" fill="#fff"/><circle cx="45.6" cy="49.8" r=".8" fill="#fff"/>' +
      '<circle cx="73" cy="48" r="4.6" fill="#3b2420"/><circle cx="74.6" cy="46.4" r="1.6" fill="#fff"/><circle cx="71.6" cy="49.8" r=".8" fill="#fff"/></g>' +
      '<g fill="none" stroke="#a87858" stroke-width="2" stroke-linecap="round">' +
      '<path d="M42 39 Q46 36 50 38"/><path d="M70 38 Q74 36 78 39"/></g>',
    sleepy:
      '<g fill="none" stroke="#3b2420" stroke-width="2.6" stroke-linecap="round">' +
      '<path d="M43 47 Q47 51 51 47"/><path d="M69 47 Q73 51 77 47"/></g>',
  };

  const MOUTH = {
    happy: '<path d="M53.5 64 Q60 73 66.5 64 Z" fill="#e0607e" stroke="#6b3e2e" stroke-width="1.6" stroke-linejoin="round"/>',
    content: '<path d="M55 65 Q60 70 65 65" stroke="#6b3e2e" stroke-width="2" fill="none" stroke-linecap="round"/>',
    ohmy: '<ellipse cx="60" cy="67" rx="3.2" ry="3.8" fill="#e0607e" stroke="#6b3e2e" stroke-width="1.4"/>',
    sleepy:
      '<path d="M56 65.5 Q60 68.5 64 65.5" stroke="#6b3e2e" stroke-width="2" fill="none" stroke-linecap="round"/>' +
      '<g class="bear-z" fill="#a993e0" font-family="Fredoka, sans-serif" font-weight="700">' +
      '<text x="96" y="66" font-size="12">z</text><text x="105" y="56" font-size="9">z</text></g>',
  };

  function bearSVG(mood, label) {
    mood = EYES[mood] ? mood : "happy";
    const a11y = label
      ? 'role="img" aria-label="' + label + '"'
      : 'aria-hidden="true" focusable="false"';
    return (
      '<svg class="bear bear--' + mood + '" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" ' + a11y + ">" +
      // ears
      '<circle cx="30" cy="28" r="15" fill="#e8c39e"/><circle cx="30" cy="28" r="8" fill="#f7a8bf"/>' +
      '<circle cx="90" cy="28" r="15" fill="#e8c39e"/><circle cx="90" cy="28" r="8" fill="#f7a8bf"/>' +
      // body + head
      '<ellipse cx="60" cy="96" rx="30" ry="22" fill="#e8c39e"/>' +
      '<circle cx="60" cy="52" r="32" fill="#efcfac"/>' +
      // bow on her right ear
      '<g transform="translate(92 20) rotate(18)">' +
      '<path d="M0 0 L-13 -8 Q-16 0 -13 8 Z" fill="#ff7fa8"/><path d="M0 0 L13 -8 Q16 0 13 8 Z" fill="#ff7fa8"/>' +
      '<circle r="4" fill="#ff5c93"/></g>' +
      // muzzle + nose
      '<ellipse cx="60" cy="63" rx="13" ry="10" fill="#fbe8d4"/>' +
      '<ellipse cx="60" cy="58" rx="4" ry="3" fill="#6b3e2e"/>' +
      MOUTH[mood] +
      EYES[mood] +
      // blush
      '<ellipse cx="38" cy="60" rx="' + (mood === "ohmy" ? 7.5 : 6) + '" ry="3.6" fill="#ff9fb8" opacity=".75"/>' +
      '<ellipse cx="82" cy="60" rx="' + (mood === "ohmy" ? 7.5 : 6) + '" ry="3.6" fill="#ff9fb8" opacity=".75"/>' +
      // cupcake
      '<g transform="translate(9 17) scale(.85)">' +
      '<path d="M47 92 L73 92 L69 112 L51 112 Z" fill="#c9b6f2"/>' +
      '<path d="M52 92 L54 112 M60 92 L60 112 M68 92 L66 112" stroke="#a993e0" stroke-width="1.5"/>' +
      '<path d="M44 93 Q44 80 52 80 Q54 72 60 74 Q66 72 68 80 Q76 80 76 93 Z" fill="#ffb3cc"/>' +
      '<circle cx="60" cy="72" r="4" fill="#ff4f7b"/><circle cx="58.6" cy="70.6" r="1.2" fill="#fff" opacity=".8"/>' +
      '<g stroke-width="2" stroke-linecap="round">' +
      '<path d="M52 85 l3 -1" stroke="#7fd8be"/><path d="M63 83 l2 2" stroke="#ffd65c"/>' +
      '<path d="M68 88 l3 0" stroke="#9ec9ff"/><path d="M56 89 l1 2" stroke="#ffd65c"/></g></g>' +
      // paws hugging it
      '<ellipse cx="42" cy="96" rx="8" ry="7" fill="#e8c39e"/><ellipse cx="78" cy="96" rx="8" ry="7" fill="#e8c39e"/>' +
      "</svg>"
    );
  }

  // The scale's percentage decides her face. Always kind.
  function moodFor(pct) {
    if (pct <= 40) return "happy";
    if (pct <= 75) return "content";
    if (pct <= 100) return "ohmy";
    return "sleepy";
  }

  const MOOD_LABEL = {
    happy: "Honey the bear, smiling",
    content: "Honey the bear, looking content",
    ohmy: "Honey the bear, saying oh my",
    sleepy: "Honey the bear, sleepy and cosy",
  };

  const MOOD_SAYS = {
    happy: "Yay, treats! 💕",
    content: "Mmm, so sweet 🍯",
    ohmy: "Oh my! 🎀",
    sleepy: "Sugar nap time 💤",
  };

  let currentMood = null;

  function setMood(pct) {
    const box = document.getElementById("scale-bear");
    if (!box) return;
    const mood = moodFor(pct);
    if (mood === currentMood) return;
    currentMood = mood;
    box.innerHTML = bearSVG(mood, MOOD_LABEL[mood]) +
      '<span class="bear-says" aria-hidden="true">' + MOOD_SAYS[mood] + "</span>";
    restartClass(box, "bear-pop");
  }

  function restartClass(node, cls) {
    node.classList.remove(cls);
    void node.offsetWidth;
    node.classList.add(cls);
  }

  // ---------- confetti + the treat flying into the jar ----------

  const SPRINKLES = ["#ff9ec4", "#c9b3f2", "#8fd8c4", "#ffd98e", "#ffb08a", "#9ec9ff", "#ff7fa8"];

  function celebrate(sourceEl, treat) {
    const header = document.getElementById("mascot");
    if (sourceEl) restartClass(sourceEl, "squish");
    if (header) restartClass(header, "wiggle");
    if (reduceMotion.matches || !sourceEl) return;

    const r = sourceEl.getBoundingClientRect();
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height / 2;

    for (let i = 0; i < 18; i++) {
      const bit = document.createElement("span");
      bit.className = "sprinkle-bit";
      bit.style.background = SPRINKLES[i % SPRINKLES.length];
      bit.style.left = cx + "px";
      bit.style.top = cy + "px";
      if (i % 3 === 0) bit.classList.add("round");
      document.body.appendChild(bit);

      const angle = Math.random() * Math.PI * 2;
      const dist = 40 + Math.random() * 60;
      const dx = Math.cos(angle) * dist;
      const dy = Math.sin(angle) * dist - 20;
      const spin = (Math.random() * 540 - 270) | 0;
      bit.animate(
        [
          { transform: "translate(-50%, -50%) rotate(0deg) scale(1)", opacity: 1 },
          { transform: "translate(calc(-50% + " + dx + "px), calc(-50% + " + (dy + 30) + "px)) rotate(" + spin + "deg) scale(.6)", opacity: 0 },
        ],
        { duration: 700 + Math.random() * 300, easing: "cubic-bezier(.2,.7,.4,1)" }
      ).onfinish = () => bit.remove();
    }

    // Fly the emoji into the jar, if the jar is on screen.
    const jar = document.querySelector(".scale-track");
    if (!jar) return;
    const j = jar.getBoundingClientRect();
    if (j.bottom < 0 || j.top > window.innerHeight) return;

    const fly = document.createElement("span");
    fly.className = "flying-treat";
    fly.textContent = (treat && treat.emoji) || "🍬";
    fly.setAttribute("aria-hidden", "true");
    fly.style.left = cx + "px";
    fly.style.top = cy + "px";
    document.body.appendChild(fly);

    const tx = j.left + j.width / 2 - cx;
    const ty = j.top + j.height * 0.35 - cy;
    fly.animate(
      [
        { transform: "translate(-50%, -50%) scale(1)", opacity: 1 },
        { transform: "translate(calc(-50% + " + tx * 0.5 + "px), calc(-50% + " + (ty * 0.5 - 90) + "px)) scale(1.4) rotate(-12deg)", opacity: 1, offset: 0.5 },
        { transform: "translate(calc(-50% + " + tx + "px), calc(-50% + " + ty + "px)) scale(.5) rotate(10deg)", opacity: 0.2 },
      ],
      { duration: 750, easing: "cubic-bezier(.4,0,.6,1)" }
    ).onfinish = () => fly.remove();
  }

  // ---------- sweet streak ----------

  // Days in a row with logged treats at or under the goal. Today only counts
  // once it has something logged, so the streak doesn't vanish at breakfast.
  function streak(days, limit, todayKey) {
    let count = 0;
    const d = new Date();
    for (let i = 0; i < 366; i++) {
      const key = todayKey(d);
      const list = days[key] || [];
      const total = list.reduce((s, e) => s + Number(e.sugar || 0), 0);
      if (i === 0 && list.length === 0) { d.setDate(d.getDate() - 1); continue; }
      if (list.length === 0 || total > limit) break;
      count++;
      d.setDate(d.getDate() - 1);
    }
    return count;
  }

  function renderStreak(days, limit, todayKey) {
    const badge = document.getElementById("streak-badge");
    if (!badge) return;
    const n = streak(days, limit, todayKey);
    const num = document.getElementById("streak-num");
    const word = document.getElementById("streak-word");
    num.textContent = n;
    word.textContent = n === 1 ? "day" : "days";
    badge.hidden = n === 0;
    badge.setAttribute("aria-label", "Sweet streak: " + n + " " + (n === 1 ? "day" : "days") + " in a row within your goal");
  }

  // ---------- share card ----------

  function loadImage(src) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    });
  }

  function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }

  async function shareCard(info) {
    const W = 1080, H = 1350;
    const canvas = document.createElement("canvas");
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext("2d");

    try {
      await Promise.all([
        document.fonts.load('700 60px "Fredoka"'),
        document.fonts.load('80px "Pacifico"'),
        document.fonts.load('700 30px "Nunito"'),
      ]);
    } catch (e) { /* fall back to system fonts */ }

    // Strawberry milk background with polka dots.
    const bg = ctx.createLinearGradient(0, 0, W, H);
    bg.addColorStop(0, "#ffe3ef");
    bg.addColorStop(1, "#ece2ff");
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = "rgba(255,255,255,.55)";
    for (let y = 20; y < H; y += 54) {
      for (let x = (y / 54) % 2 ? 47 : 20; x < W; x += 54) {
        ctx.beginPath(); ctx.arc(x, y, 5, 0, Math.PI * 2); ctx.fill();
      }
    }

    // Card.
    ctx.save();
    ctx.shadowColor = "rgba(240,110,169,.25)";
    ctx.shadowBlur = 50;
    ctx.shadowOffsetY = 16;
    roundRect(ctx, 70, 300, W - 140, H - 400, 56);
    ctx.fillStyle = "#fffaf7";
    ctx.fill();
    ctx.restore();

    // Bear.
    const mood = moodFor(info.pct);
    const svg = bearSVG(mood).replace('aria-hidden="true" focusable="false"', "");
    const img = await loadImage("data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg));
    ctx.drawImage(img, W / 2 - 170, 20, 340, 340);

    ctx.textAlign = "center";
    ctx.fillStyle = "#c2367a";
    ctx.font = '84px "Pacifico", cursive';
    ctx.fillText("My sweet day", W / 2, 455);

    ctx.fillStyle = "#7a5f6e";
    ctx.font = '700 32px "Nunito", sans-serif';
    ctx.fillText(info.dateLabel, W / 2, 510);

    // Total.
    ctx.fillStyle = "#4a3340";
    ctx.font = '700 120px "Fredoka", sans-serif';
    ctx.fillText(info.total + " g", W / 2, 650);
    ctx.fillStyle = "#7a5f6e";
    ctx.font = '700 34px "Nunito", sans-serif';
    ctx.fillText("of sugar · goal " + info.limit + " g", W / 2, 705);

    // Progress pill.
    const bx = 170, by = 745, bw = W - 340, bh = 40;
    roundRect(ctx, bx, by, bw, bh, 20);
    ctx.fillStyle = "#f6e6ef";
    ctx.fill();
    const fillW = Math.max(bh, Math.min(1, info.pct / 100) * bw);
    const pg = ctx.createLinearGradient(bx, 0, bx + bw, 0);
    pg.addColorStop(0, "#8fd8c4");
    pg.addColorStop(0.5, "#ffd98e");
    pg.addColorStop(1, "#ff9ec4");
    roundRect(ctx, bx, by, fillW, bh, 20);
    ctx.fillStyle = pg;
    ctx.fill();

    // Treat list.
    ctx.textAlign = "left";
    const items = info.entries.slice(0, 6);
    let y = 860;
    ctx.font = '700 36px "Nunito", sans-serif';
    if (items.length === 0) {
      ctx.textAlign = "center";
      ctx.fillStyle = "#7a5f6e";
      ctx.fillText("No treats yet. A fresh, sweet start 🌸", W / 2, y + 40);
    }
    items.forEach((e) => {
      ctx.fillStyle = "#4a3340";
      ctx.fillText(e.emoji + "  " + e.name, 170, y);
      ctx.textAlign = "right";
      ctx.fillStyle = "#c2367a";
      ctx.fillText(e.sugar + " g", W - 170, y);
      ctx.textAlign = "left";
      y += 58;
    });
    if (info.entries.length > items.length) {
      ctx.fillStyle = "#7a5f6e";
      ctx.font = '700 30px "Nunito", sans-serif';
      ctx.fillText("+ " + (info.entries.length - items.length) + " more", 170, y);
    }

    ctx.textAlign = "center";
    ctx.fillStyle = "#c2367a";
    ctx.font = '600 38px "Fredoka", sans-serif';
    ctx.fillText(info.message, W / 2, H - 150, W - 220);
    ctx.fillStyle = "#7a5f6e";
    ctx.font = '700 28px "Nunito", sans-serif';
    ctx.fillText("Treat Yourself 🍭 a sweet little sugar tracker", W / 2, H - 48);

    return new Promise((resolve) => canvas.toBlob(resolve, "image/png"));
  }

  async function downloadShareCard(info) {
    const blob = await shareCard(info);
    if (!blob) return;
    const file = new File([blob], "my-sweet-day.png", { type: "image/png" });
    if (navigator.canShare && navigator.canShare({ files: [file] }) && matchMedia("(pointer: coarse)").matches) {
      try { await navigator.share({ files: [file], title: "My sweet day" }); return; }
      catch (e) { if (e.name === "AbortError") return; }
    }
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "my-sweet-day.png";
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 2000);
  }

  // ---------- put Honey in her spots ----------

  function fillBears() {
    document.querySelectorAll("[data-bear]").forEach((node) => {
      node.innerHTML = bearSVG(node.dataset.bear);
    });
  }

  window.Honey = { bearSVG, setMood, celebrate, renderStreak, downloadShareCard, fillBears };
})();
