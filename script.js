// Tengo algo que decirte
// Los textos se cambian directamente en index.html.

(() => {
  "use strict";

  const body = document.body;
  const intro = document.getElementById("intro");
  const reveal = document.getElementById("reveal");
  const revealBtn = document.getElementById("reveal-btn");
  const bigHeart = document.getElementById("big-heart");
  const message = document.getElementById("message");
  const fx = document.getElementById("fx");

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const COLORS = ["#C8475A", "#E07A85", "#EFE6DF", "#D9A5A0"];

  // Menos partículas en dispositivos modestos o pantallas pequeñas
  const lowPower =
    (navigator.hardwareConcurrency || 4) <= 4 || Math.min(window.innerWidth, window.innerHeight) < 480;
  const EMBER_COUNT = lowPower ? 14 : 22;
  const MAX_FLOATING = lowPower ? 9 : 14;

  // Momentos de la secuencia (ms desde que aparece la segunda pantalla)
  const T_HEART_FILLS = 1400;
  const T_AMBIENT = 3000;
  const T_DONE = 4600;

  let state = "intro"; // intro → revealing → revealed
  let floatTimer = null;

  const rand = (min, max) => min + Math.random() * (max - min);
  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

  const later = (fn, ms) => setTimeout(fn, ms);

  // ── Divide el mensaje en letras para revelarlo poco a poco ──
  function splitMessage() {
    const text = message.textContent.trim();
    message.setAttribute("aria-label", text);
    message.textContent = "";

    const segment =
      "Segmenter" in Intl
        ? (s) => Array.from(new Intl.Segmenter("es", { granularity: "grapheme" }).segment(s), (g) => g.segment)
        : (s) => Array.from(s);

    let i = 0;
    text.split(/\s+/).forEach((word, w, words) => {
      const wordEl = document.createElement("span");
      wordEl.className = "word";
      wordEl.setAttribute("aria-hidden", "true");
      segment(word).forEach((ch) => {
        const chEl = document.createElement("span");
        chEl.className = /\p{Extended_Pictographic}/u.test(ch) ? "ch emoji" : "ch";
        chEl.textContent = ch;
        chEl.style.setProperty("--i", i++);
        wordEl.appendChild(chEl);
      });
      message.appendChild(wordEl);
      if (w < words.length - 1) message.appendChild(document.createTextNode(" "));
    });
  }

  // ── Partículas ──
  // Se quitan al terminar su animación, con un respaldo por si el navegador
  // pausa las animaciones (p. ej. en una pestaña en segundo plano).
  function removeLater(el, maxMs) {
    el.addEventListener("animationend", () => el.remove(), { once: true });
    setTimeout(() => el.remove(), maxMs + 600);
  }

  // Chispas que salen del corazón cuando late
  function embers(cx, cy) {
    const reach = Math.min(window.innerWidth, window.innerHeight) * 0.4;
    const frag = document.createDocumentFragment();

    for (let i = 0; i < EMBER_COUNT; i++) {
      const angle = (i / EMBER_COUNT) * Math.PI * 2 + rand(-0.25, 0.25);
      const dist = rand(0.45, 1) * reach;
      const dur = rand(1.6, 2.8);
      const el = document.createElement("div");
      el.className = "p-ember";
      el.style.cssText = [
        `--x:${cx}px`,
        `--y:${cy}px`,
        `--dx:${(Math.cos(angle) * dist).toFixed(1)}px`,
        `--dy:${(Math.sin(angle) * dist - rand(20, 70)).toFixed(1)}px`,
        `--size:${rand(2, 4.5).toFixed(1)}px`,
        `--dur:${dur.toFixed(2)}s`,
        `--delay:${rand(0, 0.15).toFixed(2)}s`,
        `--o:${rand(0.6, 1).toFixed(2)}`,
        `--c:${pick(COLORS)}`,
      ].join(";");
      removeLater(el, (dur + 0.2) * 1000);
      frag.appendChild(el);
    }
    fx.appendChild(frag);
  }

  // Puntos de luz que suben despacio de fondo
  function floatEmber() {
    if (fx.querySelectorAll(".p-float").length >= MAX_FLOATING) return;
    const dur = rand(9, 15);
    const el = document.createElement("div");
    el.className = "p-float";
    el.style.cssText = [
      `--x:${rand(3, 97).toFixed(1)}%`,
      `--size:${rand(1.5, 3.5).toFixed(1)}px`,
      `--dur:${dur.toFixed(1)}s`,
      `--drift:${rand(-40, 40).toFixed(0)}px`,
      `--o:${rand(0.25, 0.6).toFixed(2)}`,
      `--c:${pick(COLORS)}`,
    ].join(";");
    removeLater(el, dur * 1000);
    fx.appendChild(el);
  }

  function scheduleFloating() {
    floatTimer = setTimeout(() => {
      if (state !== "revealed") return;
      if (!document.hidden) floatEmber();
      scheduleFloating();
    }, rand(700, 1500));
  }

  // ── Revelar ──
  function startReveal() {
    if (state !== "intro") return;
    state = "revealing";
    revealBtn.disabled = true;

    body.classList.add("is-leaving");

    const calm = reducedMotion.matches;

    later(() => {
      intro.hidden = true;
      reveal.hidden = false;

      // El corazón aparece en el centro de la pantalla y después sube a su sitio
      const rect = bigHeart.getBoundingClientRect();
      const offset = window.innerHeight / 2 - (rect.top + rect.height / 2);
      bigHeart.style.setProperty("--dy", `${offset.toFixed(1)}px`);

      void reveal.offsetWidth; // reinicia las animaciones
      reveal.classList.add("is-on");
      body.classList.add("is-revealed");
      reveal.focus({ preventScroll: true });

      if (calm) {
        later(() => { state = "revealed"; }, 1400);
        return;
      }

      later(() => {
        embers(window.innerWidth / 2, window.innerHeight / 2);
        if (navigator.vibrate) {
          try { navigator.vibrate(20); } catch (_) { /* opcional */ }
        }
      }, T_HEART_FILLS);

      later(() => {
        floatEmber();
        floatEmber();
      }, T_AMBIENT);

      later(() => {
        state = "revealed";
        scheduleFloating();
      }, T_DONE);
    }, calm ? 300 : 650);
  }

  splitMessage();
  reveal.setAttribute("tabindex", "-1");
  revealBtn.addEventListener("click", startReveal);
})();
