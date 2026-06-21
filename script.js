// Always open at the top (Safari/iOS can otherwise restore or jump scroll).
if ("scrollRestoration" in history) history.scrollRestoration = "manual";
window.addEventListener("load", () => {
  if (!location.hash) window.scrollTo(0, 0);
});

// Footer year
document.getElementById("year").textContent = new Date().getFullYear();

/* ───────────── Runway ─────────────
   Desktop (fine pointer): scroll position scrubs the video's currentTime,
   so scrolling "walks" Osayi down the runway (all-intra MP4 = instant seek).
   Mobile/touch: iOS won't paint scrubbed video frames (shows black), so
   instead we autoplay-loop the clip, muted & inline, only while it's on
   screen. Reduced-motion: leave the static poster frame. */
(function () {
  const runway = document.getElementById("runway");
  if (!runway) return;
  const video = runway.querySelector(".runway__video");
  const cue = runway.querySelector(".runway__cue");
  const bar = runway.querySelector(".runway__bar span");

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const touch =
    window.matchMedia("(pointer: coarse)").matches || window.innerWidth < 760;

  if (reduce) return; // keep the poster, no motion

  // ---- Mobile / touch: autoplay-loop in view ----
  if (touch) {
    video.loop = true;
    video.muted = true;
    video.setAttribute("muted", "");
    if (cue) cue.style.display = "none";
    const stage = runway.querySelector(".runway__stage");
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) video.play().catch(() => {});
          else video.pause();
        });
      },
      { threshold: 0.2 }
    );
    io.observe(stage);
    return;
  }

  // ---- Desktop: scroll-scrub ----
  let duration = 0;
  let target = 0;
  let current = 0;
  let raf = null;

  video.addEventListener("loadedmetadata", () => {
    duration = video.duration || 0;
    onScroll();
  });

  function sectionProgress() {
    const rect = runway.getBoundingClientRect();
    const scrollable = runway.offsetHeight - window.innerHeight;
    if (scrollable <= 0) return 0;
    return Math.min(1, Math.max(0, -rect.top / scrollable));
  }

  function loop() {
    current += (target - current) * 0.15;
    if (Math.abs(target - current) < 0.012) current = target;
    if (duration) video.currentTime = current;
    raf = Math.abs(target - current) > 0.006 ? requestAnimationFrame(loop) : null;
  }

  function onScroll() {
    if (!duration) return;
    const p = sectionProgress();
    target = p * duration;
    if (bar) bar.style.width = (p * 100).toFixed(1) + "%";
    if (cue) cue.style.opacity = p > 0.02 ? "0" : "1";
    if (!raf) raf = requestAnimationFrame(loop);
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
})();
