// Footer year
document.getElementById("year").textContent = new Date().getFullYear();

/* ───────────── Scroll-scrubbed runway ─────────────
   Maps scroll progress through the .runway section to the video's
   currentTime, so scrolling "walks" Osayi down the runway. Uses a
   light lerp for inertia and an all-intra MP4 so seeks are instant. */
(function () {
  const runway = document.getElementById("runway");
  if (!runway) return;
  const video = runway.querySelector(".runway__video");
  const cue = runway.querySelector(".runway__cue");
  const bar = runway.querySelector(".runway__bar span");

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce) return; // leave the poster frame in place, no scrubbing

  let duration = 0;
  let target = 0;
  let current = 0;
  let raf = null;

  video.addEventListener("loadedmetadata", () => {
    duration = video.duration || 0;
    onScroll();
  });

  // Prime decoding for iOS/Safari so currentTime seeking is allowed.
  video.addEventListener(
    "loadeddata",
    () => {
      video.play().then(() => video.pause()).catch(() => {});
    },
    { once: true }
  );

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
