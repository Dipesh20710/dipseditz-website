/* =========================================================
   Dips Editz — site script
   Customize the values below to match your channel.
   ========================================================= */

// Your YouTube channel URL (used by all Subscribe buttons)
const CHANNEL_URL = "https://youtube.com/@dipseditz_23?si=DDHzcY0lzmBWJB4L";

// Featured videos: replace the placeholder IDs with your real YouTube video IDs.
// Find a video ID in its URL: youtube.com/watch?v=VIDEO_ID
const VIDEOS = [
  { id: "Cr29h8OBS5c", title: "Featured Edit #1" },
  { id: "ByOrCR9hIPU", title: "Featured Edit #2" },
  { id: "NG9s67F8lXY", title: "Featured Edit #3" },
  { id: "t4mJi_dXHLA", title: "Featured Edit #4" },
  { id: "83H67UDMYyM", title: "Featured Edit #5" },
  { id: "9wU6SdHDACE", title: "Featured Edit #6 — Add your title" },
];

// Social links (replace # with your real profile URLs)
const SOCIAL = {
  youtube: "https://www.youtube.com/@dipseditz_23",
  email: "mailto:dipesh23.in@gmail.com",
};

/* ---------- helpers ---------- */
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

/* ---------- wire subscribe buttons ---------- */
function wireSubscribe() {
  const ids = ["navSubscribe", "heroSubscribe", "aboutSubscribe", "footerSubscribe", "moreVideos"];
  ids.forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.setAttribute("href", CHANNEL_URL);
  });
  const ytCard = document.querySelector('.social-card[data-social="youtube"]');
  if (ytCard) ytCard.setAttribute("href", SOCIAL.youtube);
}

/* ---------- wire social cards ---------- */
function wireSocial() {
  Object.keys(SOCIAL).forEach((key) => {
    const card = document.querySelector(`.social-card[data-social="${key}"]`);
    if (card && SOCIAL[key] && SOCIAL[key] !== "#") card.setAttribute("href", SOCIAL[key]);
  });
}

/* ---------- render videos ---------- */
function thumbUrl(id) {
  return `https://i.ytimg.com/vi/${encodeURIComponent(id)}/hqdefault.jpg`;
}
function watchUrl(id) {
  return `https://www.youtube.com/shorts/${encodeURIComponent(id)}`;
}

function renderVideos() {
  const grid = document.getElementById("videoGrid");
  if (!grid) return;
  grid.innerHTML = "";

  VIDEOS.forEach((v, i) => {
    const isPlaceholder = !v.id || v.id.startsWith("YOUR_VIDEO_ID");
    const card = document.createElement("article");
    card.className = "video-card reveal";

    if (isPlaceholder) {
      card.innerHTML = `
        <div class="video-placeholder">
          <strong>Video ${i + 1}</strong>
          <span>Replace placeholder ID in js/script.js</span>
        </div>
        <div class="video-info">
          <div class="video-title">${escapeHtml(v.title)}</div>
          <div class="video-meta">Not configured</div>
        </div>`;
      grid.appendChild(card);
      return;
    }

    const a = document.createElement("a");
    a.href = watchUrl(v.id);
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    a.className = "video-card reveal";
    a.innerHTML = `
      <div class="video-thumb">
        <img src="${thumbUrl(v.id)}" alt="${escapeHtml(v.title)}" loading="lazy" />
        <div class="play-overlay"><div class="play-btn"><svg width="22" height="22" viewBox="0 0 24 24" fill="white"><path d="M8 5v14l11-7z"/></svg></div></div>
      </div>
      <div class="video-info">
        <div class="video-title">${escapeHtml(v.title)}</div>
        <div class="video-meta">Watch on YouTube ↗</div>
      </div>`;
    grid.appendChild(a);
  });

  observeReveal();
}

/* ---------- mobile nav ---------- */
function setupNav() {
  const toggle = document.getElementById("menuToggle");
  const links = document.getElementById("navLinks");
  if (!toggle || !links) return;
  toggle.addEventListener("click", () => {
    const open = links.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(open));
  });
  $$("#navLinks a").forEach((a) =>
    a.addEventListener("click", () => {
      links.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    })
  );
}

/* ---------- scroll reveal ---------- */
let revealObserver;
function observeReveal() {
  const els = $$(".reveal:not(.in)");
  if (!revealObserver) {
    revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            revealObserver.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
  }
  els.forEach((el) => revealObserver.observe(el));
}

/* ---------- animated counters ---------- */
function animateCounters() {
  const nums = $$(".stat-num[data-count]");
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      const el = e.target;
      const target = parseInt(el.getAttribute("data-count"), 10) || 0;
      const duration = 1400;
      const start = performance.now();
      function tick(now) {
        const p = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.floor(eased * target);
        if (p < 1) requestAnimationFrame(tick);
        else el.textContent = target;
      }
      requestAnimationFrame(tick);
      io.unobserve(el);
    });
  }, { threshold: 0.4 });
  nums.forEach((n) => io.observe(n));
}

/* ---------- navbar shadow on scroll ---------- */
function setupNavbarScroll() {
  const nav = document.getElementById("navbar");
  if (!nav) return;
  const onScroll = () => {
    nav.style.boxShadow = window.scrollY > 10 ? "0 8px 30px rgba(0,0,0,0.35)" : "none";
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
}

/* ---------- init ---------- */
document.addEventListener("DOMContentLoaded", () => {
  wireSubscribe();
  wireSocial();
  renderVideos();
  setupNav();
  observeReveal();
  animateCounters();
  setupNavbarScroll();

  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();
});
function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

