// Custom cursor — dot follows instantly, ring lags with easing.
// Hover [data-cursor="label"] to grow the ring and reveal a label.
let started = false;
export function initCursor(opts = {}) {
  if (started) return;
  // Only on devices with a fine pointer (desktop) and no reduced-motion preference quirks
  if (!window.matchMedia || !window.matchMedia("(pointer: fine)").matches) return;
  started = true;
  const accent = opts.accent || "#e7522d";
  const ink = opts.ink || "#18170f";

  const dot = document.createElement("div");
  const ring = document.createElement("div");
  const label = document.createElement("span");
  ring.appendChild(label);

  Object.assign(dot.style, {
    position: "fixed", top: "0", left: "0", width: "7px", height: "7px",
    borderRadius: "50%", background: ink, pointerEvents: "none",
    zIndex: "2147483646", transform: "translate(-50%,-50%)",
    transition: "opacity .3s ease, background .3s ease", mixBlendMode: "normal"
  });
  Object.assign(ring.style, {
    position: "fixed", top: "0", left: "0", width: "38px", height: "38px",
    borderRadius: "999px", border: "1px solid " + ink, pointerEvents: "none",
    zIndex: "2147483645", transform: "translate(-50%,-50%) scale(1)",
    transformOrigin: "center", display: "flex", alignItems: "center",
    justifyContent: "center", boxSizing: "border-box",
    transition: "width .32s cubic-bezier(.22,1,.36,1), height .32s cubic-bezier(.22,1,.36,1), background .3s ease, border-color .3s ease, opacity .3s ease",
    background: "transparent", overflow: "hidden"
  });
  Object.assign(label.style, {
    color: "#fff", fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
    fontSize: "11px", fontWeight: "600", letterSpacing: "0.06em",
    textTransform: "uppercase", opacity: "0", transition: "opacity .2s ease",
    whiteSpace: "nowrap", pointerEvents: "none", transform: "translateZ(0)"
  });
  document.body.appendChild(dot);
  document.body.appendChild(ring);

  let mx = window.innerWidth / 2, my = window.innerHeight / 2;
  let rx = mx, ry = my;
  let visible = false;

  window.addEventListener("mousemove", (e) => {
    mx = e.clientX; my = e.clientY;
    if (!visible) { visible = true; dot.style.opacity = "1"; ring.style.opacity = "1"; }
    dot.style.left = mx + "px"; dot.style.top = my + "px";
  }, { passive: true });

  window.addEventListener("mouseleave", () => {
    visible = false; dot.style.opacity = "0"; ring.style.opacity = "0";
  });
  window.addEventListener("mouseenter", () => {
    visible = true; dot.style.opacity = "1"; ring.style.opacity = "1";
  });

  function raf() {
    rx += (mx - rx) * 0.18; ry += (my - ry) * 0.18;
    ring.style.left = rx + "px"; ring.style.top = ry + "px";
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  function setBig(text) {
    ring.style.width = "84px"; ring.style.height = "84px";
    ring.style.background = accent; ring.style.borderColor = accent;
    label.textContent = text || ""; label.style.opacity = text ? "1" : "0";
    dot.style.opacity = "0";
  }
  function setLink() {
    ring.style.width = "58px"; ring.style.height = "58px";
    ring.style.background = "transparent"; ring.style.borderColor = ink;
    label.style.opacity = "0"; label.textContent = "";
    dot.style.opacity = "1";
  }
  function setIdle() {
    ring.style.width = "38px"; ring.style.height = "38px";
    ring.style.background = "transparent"; ring.style.borderColor = ink;
    label.style.opacity = "0"; label.textContent = "";
    dot.style.opacity = "1";
  }

  // Delegated hover detection
  document.addEventListener("mouseover", (e) => {
    const c = e.target.closest("[data-cursor]");
    if (c) { setBig(c.getAttribute("data-cursor")); return; }
    const l = e.target.closest("a, button, [data-cursor-link], input, textarea, label");
    if (l) { setLink(); return; }
    setIdle();
  });
  document.addEventListener("mouseout", (e) => {
    // when leaving to no relevant target, reset is handled by next mouseover; ensure reset on body
    const to = e.relatedTarget;
    if (!to || to === document.body || to === document.documentElement) setIdle();
  });

  window.addEventListener("mousedown", () => { ring.style.transform = "translate(-50%,-50%) scale(.82)"; });
  window.addEventListener("mouseup", () => { ring.style.transform = "translate(-50%,-50%) scale(1)"; });
}
