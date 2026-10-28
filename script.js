/* =========================================================
   Dips Editz — site script
   Customize the values below to match your channel.
   ========================================================= */

// Your YouTube channel URL (used by all Subscribe buttons)
const CHANNEL_URL = "https://www.youtube.com/@dipseditz_23";

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


/* ---------- booking ---------- */
const BOOKING_RECIPIENT = 'dipesh23.in@gmail.com';
let lastBookingMailto = '';

function setupBooking() {
  const form = document.getElementById('bookingForm');
  if (!form) return;
  const serviceSelect = document.getElementById('serviceSelect');
  const dateInput = document.getElementById('deliveryDate');
  const status = document.getElementById('bookingStatus');
  const reopenBtn = document.getElementById('reopenEmail');
  const editBtn = document.getElementById('editRequest');

  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  if (dateInput) dateInput.min = yyyy + '-' + mm + '-' + dd;

  document.querySelectorAll('.service-card').forEach((card) => {
    card.addEventListener('click', () => {
      const svc = card.getAttribute('data-service');
      if (serviceSelect) serviceSelect.value = svc;
      document.querySelectorAll('.service-card').forEach((c) => c.classList.remove('active'));
      card.classList.add('active');
      setError('serviceSelect', '');
      const wrap = document.getElementById('bookingFormWrap');
      if (wrap) wrap.scrollIntoView({ behavior: 'smooth', block: 'start' });
      if (serviceSelect) serviceSelect.focus();
    });
  });

  function setError(id, msg) {
    const el = document.getElementById('err-' + id);
    if (el) el.textContent = msg;
    const input = document.getElementById(id);
    if (input) input.classList.toggle('invalid', !!msg);
  }

  ['customerName', 'customerEmail', 'serviceSelect', 'deliveryDate', 'projectDescription', 'sourceLink', 'referenceLink', 'permission'].forEach((id) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.addEventListener('input', () => setError(id, ''));
    el.addEventListener('change', () => setError(id, ''));
  });

  function isValidEmail(v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); }
  function isValidUrl(v) {
    if (!v) return true;
    try { new URL(v); return true; } catch (e) { return false; }
  }

  function validate() {
    let ok = true;
    const name = document.getElementById('customerName').value.trim();
    const email = document.getElementById('customerEmail').value.trim();
    const service = serviceSelect.value;
    const date = dateInput.value;
    const desc = document.getElementById('projectDescription').value.trim();
    const source = document.getElementById('sourceLink').value.trim();
    const ref = document.getElementById('referenceLink').value.trim();
    const perm = document.getElementById('permission').checked;

    if (!name) { setError('customerName', 'Please enter your name.'); ok = false; }
    else setError('customerName', '');
    if (!email) { setError('customerEmail', 'Please enter your email.'); ok = false; }
    else if (!isValidEmail(email)) { setError('customerEmail', 'Please enter a valid email address.'); ok = false; }
    else setError('customerEmail', '');
    if (!service) { setError('serviceSelect', 'Please select a service.'); ok = false; }
    else setError('serviceSelect', '');
    if (!date) { setError('deliveryDate', 'Please choose a delivery date.'); ok = false; }
    else {
      const chosen = new Date(date + 'T00:00:00');
      const todayDate = new Date(); todayDate.setHours(0, 0, 0, 0);
      if (chosen < todayDate) { setError('deliveryDate', 'Please choose a future date.'); ok = false; }
      else setError('deliveryDate', '');
    }
    if (!desc) { setError('projectDescription', 'Please describe your project.'); ok = false; }
    else setError('projectDescription', '');
    if (!isValidUrl(source)) { setError('sourceLink', 'Please enter a valid URL.'); ok = false; }
    else setError('sourceLink', '');
    if (!isValidUrl(ref)) { setError('referenceLink', 'Please enter a valid URL.'); ok = false; }
    else setError('referenceLink', '');
    if (!perm) { setError('permission', 'You must confirm permission to share footage.'); ok = false; }
    else setError('permission', '');
    return ok;
  }

  function buildMailto() {
    const name = document.getElementById('customerName').value.trim();
    const email = document.getElementById('customerEmail').value.trim();
    const service = serviceSelect.value;
    const date = dateInput.value;
    const desc = document.getElementById('projectDescription').value.trim();
    const source = document.getElementById('sourceLink').value.trim();
    const ref = document.getElementById('referenceLink').value.trim();
    const duration = document.getElementById('duration').value.trim();
    const style = document.getElementById('style').value.trim();
    const budget = document.getElementById('budget').value;
    const additional = document.getElementById('additional').value.trim();

    const subject = 'Dips Editz Booking Request - ' + service + ' - ' + name;

    const lines = [];
    lines.push('Dips Editz Booking Request');
    lines.push('');
    lines.push('Service: ' + service);
    lines.push('Customer Name: ' + name);
    lines.push('Customer Email: ' + email);
    lines.push('');
    lines.push('Project Details:');
    lines.push(desc);
    lines.push('');
    lines.push('Desired Delivery Date: ' + date);
    lines.push('Source Footage Link: ' + (source || 'Not provided'));
    lines.push('Reference Video Link: ' + (ref || 'Not provided'));
    lines.push('Approximate Final Duration: ' + (duration || 'Not provided'));
    lines.push('Preferred Editing Style: ' + (style || 'Not provided'));
    lines.push('Budget Range: ' + budget);
    lines.push('');
    lines.push('Additional Instructions:');
    lines.push(additional || 'None');
    lines.push('');
    lines.push('Permission to share submitted footage/links: Yes');
    lines.push('');
    lines.push('---');
    lines.push('This email was prepared by the Dips Editz website booking form. No data was stored or sent automatically.');

    const body = lines.join('\n');
    return 'mailto:' + BOOKING_RECIPIENT + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
  }

  function openEmail() {
    if (!validate()) return false;
    const url = buildMailto();
    if (url.length > 1900) {
      alert('Your request is too long for an email link. Please shorten the description or email ' + BOOKING_RECIPIENT + ' directly.');
      return false;
    }
    lastBookingMailto = url;
    window.location.href = url;
    return true;
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!openEmail()) return;
    if (status) {
      form.hidden = true;
      status.hidden = false;
      status.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });

  if (reopenBtn) reopenBtn.addEventListener('click', () => {
    if (lastBookingMailto) window.location.href = lastBookingMailto;
    else openEmail();
  });
  if (editBtn) editBtn.addEventListener('click', () => {
    if (status) status.hidden = true;
    form.hidden = false;
    form.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  form.addEventListener('reset', () => {
    document.querySelectorAll('.field-error').forEach((el) => { el.textContent = ''; });
    document.querySelectorAll('.invalid').forEach((el) => el.classList.remove('invalid'));
    document.querySelectorAll('.service-card').forEach((c) => c.classList.remove('active'));
    if (status) { status.hidden = true; form.hidden = false; }
    lastBookingMailto = '';
  });
}

document.addEventListener('DOMContentLoaded', setupBooking);


