/* =========================================================
   Dips Editz — site script
   ========================================================= */

const CHANNEL_URL = 'https://www.youtube.com/@dipseditz_23';
const BOOKING_RECIPIENT = 'dipesh23.in@gmail.com';

const SHOWREEL_VIDEO_ID = 'Cr29h8OBS5c'; // Replace with your dedicated showreel ID when available.
const VIDEOS = [
  { id: 'Cr29h8OBS5c', title: 'Featured Edit #1', category: 'shorts', featured: true, caseStudy: { brief: 'Add the real project brief here.', techniques: 'Add editing techniques used.', tools: 'Add software/tools used.', result: 'Add a short result description here.' } },
  { id: 'ByOrCR9hIPU', title: 'Featured Edit #2', category: 'cricket', featured: true, caseStudy: { brief: 'Add the real project brief here.', techniques: 'Add editing techniques used.', tools: 'Add software/tools used.', result: 'Add a short result description here.' } },
  { id: 'NG9s67F8lXY', title: 'Featured Edit #3', category: 'gaming', caseStudy: { brief: 'Add the real project brief here.', techniques: 'Add editing techniques used.', tools: 'Add software/tools used.', result: 'Add a short result description here.' } },
  { id: 't4mJi_dXHLA', title: 'Featured Edit #4', category: 'shorts', caseStudy: { brief: 'Add the real project brief here.', techniques: 'Add editing techniques used.', tools: 'Add software/tools used.', result: 'Add a short result description here.' } },
  { id: '83H67UDMYyM', title: 'Featured Edit #5', category: 'other', caseStudy: { brief: 'Add the real project brief here.', techniques: 'Add editing techniques used.', tools: 'Add software/tools used.', result: 'Add a short result description here.' } },
  { id: '9wU6SdHDACE', title: 'Featured Edit #6', category: 'other', caseStudy: { brief: 'Add the real project brief here.', techniques: 'Add editing techniques used.', tools: 'Add software/tools used.', result: 'Add a short result description here.' } },
];

const SOCIAL = {
  youtube: 'https://www.youtube.com/@dipseditz_23',
  email: 'mailto:dipesh23.in@gmail.com',
  phone: 'tel:+917305855341',
  whatsapp: 'https://wa.me/917305855341',
};

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

function wireSubscribe() {
  ['navSubscribe', 'heroSubscribe', 'aboutSubscribe', 'footerSubscribe', 'moreVideos'].forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.setAttribute('href', CHANNEL_URL);
  });
  const ytCard = document.querySelector('.social-card[data-social="youtube"]');
  if (ytCard) ytCard.setAttribute('href', SOCIAL.youtube);
}
function wireSocial() {
  Object.keys(SOCIAL).forEach((key) => {
    const card = document.querySelector(`.social-card[data-social="${key}"]`);
    if (card && SOCIAL[key] && SOCIAL[key] !== '#') card.setAttribute('href', SOCIAL[key]);
  });
}

const FAV_KEY = 'dipseditz_favs';
function getFavs() {
  try { return JSON.parse(localStorage.getItem(FAV_KEY) || '[]'); }
  catch (e) { return []; }
}
function setFavs(arr) {
  try { localStorage.setItem(FAV_KEY, JSON.stringify(arr)); } catch (e) { /* ignore */ }
}
function isFav(id) { return getFavs().includes(id); }
function toggleFav(id) {
  const favs = getFavs();
  const i = favs.indexOf(id);
  if (i >= 0) favs.splice(i, 1); else favs.push(id);
  setFavs(favs);
}

let currentFilter = 'all';
let currentSearch = '';
let currentSort = 'featured';

function thumbUrl(id) { return `https://i.ytimg.com/vi/${encodeURIComponent(id)}/hqdefault.jpg`; }
function watchUrl(id) { return `https://www.youtube.com/shorts/${encodeURIComponent(id)}`; }

function renderVideos() {
  const grid = document.getElementById('videoGrid');
  const empty = document.getElementById('videoEmpty');
  if (!grid) return;
  grid.innerHTML = '';

  const favs = getFavs();
  let filtered = VIDEOS.filter((v) => {
    const matchesSearch = !currentSearch || v.title.toLowerCase().includes(currentSearch.toLowerCase()) || v.category.toLowerCase().includes(currentSearch.toLowerCase());
    let matchesFilter = true;
    if (currentFilter === 'favourites') matchesFilter = favs.includes(v.id);
    else if (currentFilter !== 'all') matchesFilter = v.category === currentFilter;
    return matchesSearch && matchesFilter;
  });

  if (currentSort === 'title') {
    filtered = filtered.slice().sort((a, b) => a.title.localeCompare(b.title));
  } else if (currentSort === 'newest') {
    filtered = filtered.slice().sort((a, b) => VIDEOS.indexOf(b) - VIDEOS.indexOf(a));
  } else if (currentSort === 'oldest') {
    filtered = filtered.slice().sort((a, b) => VIDEOS.indexOf(a) - VIDEOS.indexOf(b));
  } else {
    filtered = filtered.slice().sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
  }

  const countEl = document.getElementById('resultCount');
  if (countEl) countEl.textContent = filtered.length + ' video' + (filtered.length === 1 ? '' : 's') + ' shown';

  if (filtered.length === 0) { if (empty) empty.hidden = false; }
  else { if (empty) empty.hidden = true; }

  filtered.forEach((v, i) => {
    const isPlaceholder = !v.id || v.id.startsWith('YOUR_VIDEO_ID');
    const card = document.createElement('article');
    card.className = 'video-card reveal';

    if (isPlaceholder) {
      card.innerHTML = `
        <div class="video-placeholder">
          <strong>Video ${i + 1}</strong>
          <span>Replace placeholder ID in script.js</span>
        </div>
        <div class="video-info">
          <div class="video-title">${escapeHtml(v.title)}</div>
          <div class="video-meta">Not configured</div>
        </div>`;
      grid.appendChild(card);
      return;
    }

    const fav = isFav(v.id);
    const a = document.createElement('a');
    a.href = watchUrl(v.id);
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    a.className = 'video-card reveal';
    a.dataset.id = v.id;
    a.innerHTML = `
      <div class="video-thumb">
        <img src="${thumbUrl(v.id)}" alt="${escapeHtml(v.title)}" loading="lazy" decoding="async" onerror="this.style.display='none'" />
        <div class="play-overlay"><div class="play-btn"><svg width="22" height="22" viewBox="0 0 24 24" fill="white"><path d="M8 5v14l11-7z"/></svg></div></div>
        <button class="fav-btn ${fav ? 'active' : ''}" data-fav="${v.id}" aria-label="Toggle favourite" type="button">${fav ? '❤' : '♡'}</button>
      </div>
      <div class="video-info">
        ${v.featured ? '<span class="video-featured">Featured Edit</span>' : ''}
        <div class="video-title">${escapeHtml(v.title)}</div>
        <span class="video-category">${escapeHtml(v.category)}</span>
        <button type="button" class="case-study-btn" data-case="${escapeHtml(v.id)}">View Case Study</button>
        <div class="video-meta">Watch on YouTube ↗</div>
      </div>`;
    a.addEventListener('click', (e) => {
      if (e.target.closest('.fav-btn')) return;
      e.preventDefault();
      openVideoModal(v);
    });
    grid.appendChild(a);
  });

  grid.querySelectorAll('.fav-btn').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const id = btn.getAttribute('data-fav');
      toggleFav(id);
      const now = isFav(id);
      btn.classList.toggle('active', now);
      btn.textContent = now ? '❤' : '♡';
      if (currentFilter === 'favourites') renderVideos();
    });
  });

  grid.querySelectorAll('.case-study-btn').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      openCaseStudy(btn.getAttribute('data-case'));
    });
  });

  try { observeReveal(); } catch (e) { console.error("init failed:", e); }
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/* ---------- video modal ---------- */
let lastFocusedElement = null;
function openVideoModal(v) {
  const backdrop = document.getElementById('videoModal');
  const container = document.getElementById('modalVideo');
  const title = document.getElementById('modalTitle');
  if (!backdrop || !container) return;
  lastFocusedElement = document.activeElement;
  closeCaseStudy();
  currentModalVideo = v;
  if (title) title.textContent = v.title;
  container.innerHTML = `<iframe src="https://www.youtube.com/embed/${encodeURIComponent(v.id)}?autoplay=1" title="${escapeHtml(v.title)}" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen loading="lazy"></iframe>`;
  const info = backdrop.querySelector('.modal-info');
  if (info) {
    const related = VIDEOS.filter((x) => x.id !== v.id && x.category === v.category).slice(0, 3);
    info.innerHTML = `
      <div class="video-title" id="modalTitle">${escapeHtml(v.title)}</div>
      <div class="modal-actions">
        <a class="btn btn-primary btn-sm" href="${watchUrl(v.id)}" target="_blank" rel="noopener noreferrer">Watch on YouTube</a>
        <button type="button" class="btn btn-ghost btn-sm" id="shareVideoBtn">Share</button>
      </div>
      ${related.length ? '<div class="related-projects"><h4>Related projects</h4><div class="related-list">' + related.map((r) => `<button type="button" class="related-btn" data-video="${escapeHtml(r.id)}">${escapeHtml(r.title)}</button>`).join('') + '</div></div>' : ''}
    `;
    const shareBtn = info.querySelector('#shareVideoBtn');
    if (shareBtn) shareBtn.addEventListener('click', () => shareVideo(v));
    info.querySelectorAll('.related-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const rv = VIDEOS.find((x) => x.id === btn.getAttribute('data-video'));
        if (rv) openVideoModal(rv);
      });
    });
  }
  backdrop.classList.add('open');
  document.body.style.overflow = 'hidden';
  const closeBtn = document.getElementById('modalClose');
  if (closeBtn) setTimeout(() => closeBtn.focus(), 50);
}
function closeVideoModal() {
  const backdrop = document.getElementById('videoModal');
  const container = document.getElementById('modalVideo');
  if (backdrop) backdrop.classList.remove('open');
  if (container) container.innerHTML = '';
  currentModalVideo = null;
  document.body.style.overflow = '';
  if (lastFocusedElement && typeof lastFocusedElement.focus === 'function') {
    lastFocusedElement.focus();
    lastFocusedElement = null;
  }
}
function shareVideo(v) {
  const url = watchUrl(v.id);
  if (navigator.share) {
    navigator.share({ title: v.title, text: 'Check out this edit by Dips Editz', url }).catch(() => {});
  } else if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(url).then(() => {
      const btn = document.getElementById('shareVideoBtn');
      if (btn) { const old = btn.textContent; btn.textContent = 'Link copied'; setTimeout(() => { btn.textContent = old; }, 1600); }
    }).catch(() => { window.prompt('Copy this link:', url); });
  } else {
    window.prompt('Copy this link:', url);
  }
}
/* ---------- service pick ---------- */
function setupServicePicks() {
  document.querySelectorAll('.pick-service, .service-pick').forEach((btn) => {
    btn.addEventListener('click', () => {
      const svc = btn.getAttribute('data-service');
      const select = document.getElementById('serviceSelect');
      if (select && svc) select.value = svc;
      document.querySelectorAll('.service-pick').forEach((c) => c.classList.remove('active'));
      if (btn.classList.contains('service-pick')) btn.classList.add('active');
      const book = document.getElementById('book');
      if (book) book.scrollIntoView({ behavior: 'smooth' });
      if (select) setTimeout(() => select.focus(), 400);
    });
  });

}

/* ---------- booking ---------- */
const lastBookingMailto = { value: '' };

function setupBooking() {
  const form = document.getElementById('bookingForm');
  if (!form) return;
  const serviceSelect = document.getElementById('serviceSelect');
  const dateInput = document.getElementById('deliveryDate');
  const status = document.getElementById('bookingStatus');
  const reviewBox = document.getElementById('reviewBox');
  const reviewContent = document.getElementById('reviewContent');
  const reviewBtn = document.getElementById('reviewBtn');
  const editReview = document.getElementById('editReview');
  const reopenBtn = document.getElementById('reopenEmail');
  const editBtn = document.getElementById('editRequest');
  const prevStepBtn = document.getElementById('prevStepBtn');
  const nextStepBtn = document.getElementById('nextStepBtn');

  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  if (dateInput) dateInput.min = yyyy + '-' + mm + '-' + dd;

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
    const name = (document.getElementById('customerName')?.value || '').trim();
    const email = (document.getElementById('customerEmail')?.value || '').trim();
    const service = serviceSelect ? serviceSelect.value : '';
    const date = dateInput ? dateInput.value : '';
    const desc = (document.getElementById('projectDescription')?.value || '').trim();
    const source = (document.getElementById('sourceLink')?.value || '').trim();
    const ref = (document.getElementById('referenceLink')?.value || '').trim();
    const permEl = document.getElementById('permission');
    const perm = permEl ? permEl.checked : false;

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

  const stepFieldIds = {
    1: ['customerName', 'customerEmail'],
    2: ['serviceSelect', 'style'],
    3: ['duration', 'budget', 'deliveryDate'],
    4: ['projectDescription', 'sourceLink', 'referenceLink', 'additional', 'permission']
  };

  function fieldWrap(id) {
    const el = document.getElementById(id);
    return el ? el.closest('.form-field') : null;
  }

  function validateStep(step) {
    // reuse full validation but only enforce fields in this step
    // We'll do targeted checks.
    let ok = true;
    if (step === 1) {
      const name = (document.getElementById('customerName')?.value || '').trim();
      const email = (document.getElementById('customerEmail')?.value || '').trim();
      if (!name) { setError('customerName', 'Please enter your name.'); ok = false; }
      else setError('customerName', '');
      if (!email) { setError('customerEmail', 'Please enter your email.'); ok = false; }
      else if (!/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(email)) { setError('customerEmail', 'Please enter a valid email address.'); ok = false; }
      else setError('customerEmail', '');
    } else if (step === 2) {
      const service = serviceSelect ? serviceSelect.value : '';
      if (!service) { setError('serviceSelect', 'Please select a service.'); ok = false; }
      else setError('serviceSelect', '');
    } else if (step === 3) {
      const date = dateInput ? dateInput.value : '';
      if (!date) { setError('deliveryDate', 'Please choose a delivery date.'); ok = false; }
      else {
        const chosen = new Date(date + 'T00:00:00');
        const todayDate = new Date(); todayDate.setHours(0,0,0,0);
        if (chosen < todayDate) { setError('deliveryDate', 'Please choose a future date.'); ok = false; }
        else setError('deliveryDate', '');
      }
    } else if (step === 4) {
      const desc = (document.getElementById('projectDescription')?.value || '').trim();
      const source = (document.getElementById('sourceLink')?.value || '').trim();
      const ref = (document.getElementById('referenceLink')?.value || '').trim();
      const permEl = document.getElementById('permission');
      const perm = permEl ? permEl.checked : false;
      if (!desc) { setError('projectDescription', 'Please describe your project.'); ok = false; }
      else setError('projectDescription', '');
      if (source && !isValidUrl(source)) { setError('sourceLink', 'Please enter a valid URL.'); ok = false; }
      else setError('sourceLink', '');
      if (ref && !isValidUrl(ref)) { setError('referenceLink', 'Please enter a valid URL.'); ok = false; }
      else setError('referenceLink', '');
      if (!perm) { setError('permission', 'You must confirm permission to share footage.'); ok = false; }
      else setError('permission', '');
    }
    return ok;
  }

  let currentBookingStep = 1;
  function showBookingStep(step) {
    currentBookingStep = step;
    Object.keys(stepFieldIds).forEach((s) => {
      stepFieldIds[s].forEach((id) => {
        const wrap = fieldWrap(id);
        if (wrap) wrap.hidden = (Number(s) !== step);
      });
    });
    if (reviewBox) reviewBox.hidden = (step !== 5);
    const stepper = document.getElementById('formStepper');
    if (stepper) {
      stepper.querySelectorAll('.step').forEach((el) => {
        const n = Number(el.getAttribute('data-step'));
        el.classList.toggle('active', n === step);
        el.classList.toggle('done', n < step);
      });
    }
    if (prevStepBtn) prevStepBtn.hidden = (step <= 1 || step === 5);
    if (nextStepBtn) nextStepBtn.hidden = (step >= 4);
    if (reviewBtn) reviewBtn.hidden = (step !== 4);
    if (step === 5) {
      // populate review
      showReview();
    }
  }

  // step navigation
  if (nextStepBtn) nextStepBtn.addEventListener('click', () => {
    if (!validateStep(currentBookingStep)) return;
    if (currentBookingStep < 4) showBookingStep(currentBookingStep + 1);
    else if (currentBookingStep === 4) {
      if (!validate()) return;
      showBookingStep(5);
    }
  });
  if (prevStepBtn) prevStepBtn.addEventListener('click', () => {
    if (currentBookingStep > 1) showBookingStep(currentBookingStep - 1);
  });
  if (reviewBtn) reviewBtn.addEventListener('click', () => {
    if (!validateStep(4)) return;
    if (!validate()) return;
    showBookingStep(5);
  });
  if (editReview) editReview.addEventListener('click', () => {
    if (reviewBox) reviewBox.hidden = true;
    showBookingStep(4);
    form.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  showBookingStep(1);

  function buildMailto() {
    const name = (document.getElementById('customerName')?.value || '').trim();
    const email = (document.getElementById('customerEmail')?.value || '').trim();
    const service = serviceSelect ? serviceSelect.value : '';
    const date = dateInput ? dateInput.value : '';
    const desc = (document.getElementById('projectDescription')?.value || '').trim();
    const source = (document.getElementById('sourceLink')?.value || '').trim();
    const ref = (document.getElementById('referenceLink')?.value || '').trim();
    const duration = (document.getElementById('duration')?.value || '').trim();
    const style = (document.getElementById('style')?.value || '').trim();
    const budget = document.getElementById('budget')?.value || '';
    const additional = (document.getElementById('additional')?.value || '').trim();

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

  function showReview() {
    if (!validate()) return;
    if (!reviewContent) return;
    const name = (document.getElementById('customerName')?.value || '').trim();
    const email = (document.getElementById('customerEmail')?.value || '').trim();
    const service = serviceSelect ? serviceSelect.value : '';
    const date = dateInput ? dateInput.value : '';
    const desc = (document.getElementById('projectDescription')?.value || '').trim();
    const source = (document.getElementById('sourceLink')?.value || '').trim();
    const ref = (document.getElementById('referenceLink')?.value || '').trim();
    const duration = (document.getElementById('duration')?.value || '').trim();
    const style = (document.getElementById('style')?.value || '').trim();
    const budget = document.getElementById('budget')?.value || '';
    const additional = (document.getElementById('additional')?.value || '').trim();

    const rows = [
      ['Service', service],
      ['Name', name],
      ['Email', email],
      ['Delivery Date', date],
      ['Description', desc],
      ['Source Footage', source || 'Not provided'],
      ['Reference Video', ref || 'Not provided'],
      ['Duration', duration || 'Not provided'],
      ['Style', style || 'Not provided'],
      ['Budget Range', budget],
      ['Additional Instructions', additional || 'None'],
    ];
    reviewContent.innerHTML = rows.map(([l, v]) =>
      `<div class="review-row"><span class="review-label">${escapeHtml(l)}</span><span class="review-value">${escapeHtml(v)}</span></div>`
    ).join('');
    if (reviewBox) reviewBox.hidden = false;
    reviewBox.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  if (form) form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!validate()) return;
    const mailto = buildMailto();
    lastBookingMailto.value = mailto;
    window.location.href = mailto;
    if (reviewBox) reviewBox.hidden = true;
    if (status) {
      status.hidden = false;
      status.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });

  if (reopenBtn) reopenBtn.addEventListener('click', () => {
    if (lastBookingMailto.value) window.location.href = lastBookingMailto.value;
  });

  if (editBtn) editBtn.addEventListener('click', () => {
    if (status) status.hidden = true;
    if (reviewBox) reviewBox.hidden = true;
    form.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  form.addEventListener('reset', () => {
    ['customerName', 'customerEmail', 'serviceSelect', 'deliveryDate', 'projectDescription', 'sourceLink', 'referenceLink', 'permission'].forEach((id) => setError(id, ''));
    if (reviewBox) reviewBox.hidden = true;
    if (status) status.hidden = true;
    showBookingStep(1);
  });
}
/* ---------- scroll reveal ---------- */
let revealObserver;
function observeReveal() {
  const els = $$('.reveal:not(.in)');
  if (!('IntersectionObserver' in window)) {
    els.forEach((el) => el.classList.add('in'));
    return;
  }
  if (!revealObserver) {
    revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          revealObserver.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  }
  els.forEach((el) => revealObserver.observe(el));
}

/* ---------- mobile nav ---------- */
function setupNav() {
  const toggle = document.getElementById('menuToggle');
  const links = document.getElementById('navLinks');
  if (!toggle || !links) return;
  function closeMenu() {
    links.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('menu-open');
    document.body.style.overflow = '';
  }
  function openMenu() {
    links.classList.add('open');
    toggle.setAttribute('aria-expanded', 'true');
    document.body.classList.add('menu-open');
    document.body.style.overflow = 'hidden';
  }
  toggle.addEventListener('click', () => {
    if (links.classList.contains('open')) closeMenu();
    else openMenu();
  });
  $$('#navLinks a').forEach((a) => a.addEventListener('click', () => {
    closeMenu();
  }));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && links.classList.contains('open')) closeMenu();
  });
}

/* ---------- navbar shadow ---------- */
function setupNavbarScroll() {
  const nav = document.getElementById('navbar');
  if (!nav) return;
  const onScroll = () => {
    nav.style.boxShadow = window.scrollY > 10 ? '0 8px 30px rgba(0,0,0,0.35)' : 'none';
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* ---------- modal wiring ---------- */
function setupModal() {
  const backdrop = document.getElementById('videoModal');
  const closeBtn = document.getElementById('modalClose');
  if (closeBtn) closeBtn.addEventListener('click', closeVideoModal);
  if (backdrop) backdrop.addEventListener('click', (e) => {
    if (e.target === backdrop) closeVideoModal();
  });
  const caseBackdrop = document.getElementById('caseStudyModal');
  const caseClose = document.getElementById('caseStudyClose');
  if (caseClose) caseClose.addEventListener('click', closeCaseStudy);
  if (caseBackdrop) caseBackdrop.addEventListener('click', (e) => {
    if (e.target === caseBackdrop) closeCaseStudy();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') { closeVideoModal(); closeCaseStudy(); }
  });
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Tab') return;
    const openModal = document.querySelector('.modal-backdrop.open .modal');
    if (!openModal) return;
    const focusable = openModal.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])');
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  });
}

/* ---------- filters & search ---------- */
function setupFilters() {
  const bar = document.getElementById('filterBar');
  if (bar) bar.querySelectorAll('.filter-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      bar.querySelectorAll('.filter-btn').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      currentFilter = btn.getAttribute('data-filter') || 'all';
      renderVideos();
    });
  });
  const search = document.getElementById('videoSearch');
  if (search) search.addEventListener('input', (e) => {
    currentSearch = e.target.value || '';
    renderVideos();
  });
  const sort = document.getElementById('videoSort');
  if (sort) sort.addEventListener('change', (e) => {
    currentSort = e.target.value || 'featured';
    renderVideos();
  });
  const clearBtn = document.getElementById('clearFiltersBtn');
  if (clearBtn) clearBtn.addEventListener('click', () => {
    currentFilter = 'all';
    currentSearch = '';
    currentSort = 'featured';
    const searchInput = document.getElementById('videoSearch');
    if (searchInput) searchInput.value = '';
    if (sort) sort.value = 'featured';
    const bar = document.getElementById('filterBar');
    if (bar) {
      bar.querySelectorAll('.filter-btn').forEach((b) => b.classList.remove('active'));
      const allBtn = bar.querySelector('[data-filter="all"]');
      if (allBtn) allBtn.classList.add('active');
    }
    renderVideos();
  });
}


/* ---------- notifications ---------- */
function setupNotifications() {
  const btn = document.getElementById('notifBtn');
  const status = document.getElementById('notifStatus');
  if (!btn) return;
  btn.addEventListener('click', async () => {
    if (!('Notification' in window)) {
      if (status) status.textContent = 'Notifications are not supported in this browser.';
      return;
    }
    try {
      const perm = await Notification.requestPermission();
      if (status) status.textContent = perm === 'granted' ? 'Notifications enabled.' : 'Notifications not enabled.';
    } catch (e) {
      if (status) status.textContent = 'Could not request notification permission.';
    }
  });
}

/* ---------- PWA install ---------- */
let deferredInstallPrompt = null;
function setupInstall() {
  const btn = document.getElementById('installBtn');
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredInstallPrompt = e;
    if (btn) btn.hidden = false;
  });
  if (btn) btn.addEventListener('click', async () => {
    if (!deferredInstallPrompt) return;
    deferredInstallPrompt.prompt();
    try { await deferredInstallPrompt.userChoice; } catch (e) { /* ignore */ }
    deferredInstallPrompt = null;
    btn.hidden = true;
  });
}

/* ---------- service worker ---------- */
function registerServiceWorker() {
  if (!('serviceWorker' in navigator)) return;
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    window.location.reload();
  });
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./service-worker.js?v=37', { updateViaCache: 'none' }).then((reg) => {
      reg.addEventListener('updatefound', () => {
        const newWorker = reg.installing;
        if (!newWorker) return;
        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            newWorker.postMessage({ type: 'SKIP_WAITING' });
          }
        });
      });
    }).catch(() => {});
  });
}

/* ---------- 3D tilt interactions ---------- */
function setupTilt() {
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (window.matchMedia && window.matchMedia('(pointer: coarse)').matches) return;
  const targets = document.querySelectorAll('.hero-logo-wrap, .service-card, .video-card, .social-card, .about-card');
  targets.forEach((el) => {
    el.classList.add('tilt');
    let raf = null;
    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        el.style.transform = 'perspective(1000px) rotateX(' + (-y * 9).toFixed(2) + 'deg) rotateY(' + (x * 9).toFixed(2) + 'deg) translateZ(6px)';
      });
    });
    el.addEventListener('mouseleave', () => {
      if (raf) cancelAnimationFrame(raf);
      el.style.transform = '';
    });
  });
}

/* ---------- hero parallax ---------- */
function setupHeroParallax() {
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (window.matchMedia && window.matchMedia('(pointer: coarse)').matches) return;
  const hero = document.querySelector('.hero');
  const scene = document.querySelector('.hero-scene');
  if (!hero || !scene) return;
  let raf = null;
  hero.addEventListener('mousemove', (e) => {
    const rect = hero.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    if (raf) cancelAnimationFrame(raf);
    raf = requestAnimationFrame(() => {
      scene.style.transform = 'translate3d(' + (x * 20).toFixed(1) + 'px, ' + (y * 14).toFixed(1) + 'px, 0) rotateX(' + (y * -6).toFixed(2) + 'deg) rotateY(' + (x * 6).toFixed(2) + 'deg)';
    });
  });
  hero.addEventListener('mouseleave', () => {
    if (raf) cancelAnimationFrame(raf);
    scene.style.transform = '';
  });
}

/* ---------- background parallax ---------- */
function setupBackgroundParallax() {
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (window.matchMedia && window.matchMedia('(pointer: coarse)').matches) return;
  const orbs = Array.from(document.querySelectorAll('.orb'));
  if (!orbs.length) return;
  let raf = null;
  let mx = 0, my = 0, sy = 0;
  function update() {
    raf = null;
    const scrollFactor = Math.min(sy / 600, 1);
    orbs.forEach((orb, i) => {
      const f = (i + 1) * 0.35;
      const x = mx * 18 * f;
      const y = my * 12 * f + scrollFactor * 12 * (i + 1);
      orb.style.transform = 'translate3d(' + x.toFixed(1) + 'px, ' + y.toFixed(1) + 'px, 0)';
    });
  }
  window.addEventListener('mousemove', (e) => {
    mx = (e.clientX / window.innerWidth - 0.5);
    my = (e.clientY / window.innerHeight - 0.5);
    if (!raf) raf = requestAnimationFrame(update);
  }, { passive: true });
  window.addEventListener('scroll', () => {
    sy = window.scrollY;
    if (!raf) raf = requestAnimationFrame(update);
  }, { passive: true });
}

/* ---------- visitor feedback ---------- */
function setupFeedback() {
  const form = document.getElementById('feedbackForm');
  const nameInput = document.getElementById('feedbackName');
  const textInput = document.getElementById('feedbackText');
  const ratingInput = document.getElementById('feedbackRating');
  const starButtons = Array.from(document.querySelectorAll('.star-btn'));
  const status = document.getElementById('feedbackStatus');
  if (!form) return;

  let selectedRating = 0;

  function setError(id, msg) {
    const el = document.getElementById('err-' + id);
    if (el) el.textContent = msg;
    const input = document.getElementById(id);
    if (input) input.classList.toggle('invalid', !!msg);
  }

  function clearErrors() {
    setError('feedbackName', '');
    setError('feedbackRating', '');
    setError('feedbackText', '');
  }

  function updateStars(value) {
    selectedRating = value;
    if (ratingInput) ratingInput.value = value ? String(value) : '';
    starButtons.forEach((btn) => {
      const r = Number(btn.getAttribute('data-rating'));
      btn.classList.toggle('active', r <= value);
      btn.setAttribute('aria-checked', r === value ? 'true' : 'false');
    });
    if (value) setError('feedbackRating', '');
  }

  starButtons.forEach((btn) => {
    btn.setAttribute('role', 'radio');
    btn.setAttribute('aria-checked', 'false');
    btn.addEventListener('click', () => updateStars(Number(btn.getAttribute('data-rating'))));
    btn.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        updateStars(Number(btn.getAttribute('data-rating')));
      }
      if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
        e.preventDefault();
        const next = Math.min(5, (selectedRating || 0) + 1);
        updateStars(next);
        starButtons[next - 1]?.focus();
      }
      if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
        e.preventDefault();
        const prev = Math.max(1, (selectedRating || 1) - 1);
        updateStars(prev);
        starButtons[prev - 1]?.focus();
      }
    });
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    clearErrors();
    let ok = true;
    const name = (nameInput?.value || '').trim();
    const text = (textInput?.value || '').trim();
    if (!name) { setError('feedbackName', 'Please enter your name.'); ok = false; }
    if (!selectedRating) { setError('feedbackRating', 'Please select a rating.'); ok = false; }
    if (!text) { setError('feedbackText', 'Please share your feedback.'); ok = false; }
    if (!ok) return;

    const submitBtn = document.getElementById('feedbackSubmitBtn');
    if (submitBtn) submitBtn.disabled = true;

    const config = window.SUPABASE_CONFIG || { url: '', anonKey: '' };
    const client = (config.url && config.anonKey && window.supabase) ? window.supabase.createClient(config.url, config.anonKey) : null;

    if (client) {
      try {
        const { error } = await client.from('feedback').insert({
          display_name: name,
          rating: selectedRating,
          review_text: text,
          status: 'pending'
        });
        if (error) throw error;
        if (status) {
          status.hidden = false;
          status.innerHTML = '<h3>Feedback submitted</h3><p>Thank you. Your review is pending moderation and will appear only after approval.</p>';
          status.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
        form.reset();
        updateStars(0);
        clearErrors();
      } catch (err) {
        if (status) {
          status.hidden = false;
          status.innerHTML = '<h3>Feedback could not be saved</h3><p>' + (err?.message || 'Please try again.') + '</p><p>You can still send your feedback by email to dipesh23.in@gmail.com.</p>';
          status.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      } finally {
        if (submitBtn) submitBtn.disabled = false;
      }
      return;
    }

    const subject = 'Dips Editz Visitor Feedback - ' + name + ' - ' + selectedRating + ' stars';
    const body = [
      'Dips Editz Visitor Feedback',
      '',
      'Name: ' + name,
      'Rating: ' + selectedRating + ' / 5',
      '',
      'Feedback:',
      text,
      '',
      '---',
      'Submitted from the Dips Editz website feedback form. This review is pending approval and has not been published.',
    ].join('\\n');
    const mailto = 'mailto:' + BOOKING_RECIPIENT + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
    window.location.href = mailto;
    if (status) {
      status.hidden = false;
      status.innerHTML = '<h3>Feedback ready to send</h3><p>Your email app should open with your feedback addressed to <strong>dipesh23.in@gmail.com</strong>. Please review the details and press <strong>Send</strong>.</p><p>Your review has not been published yet and will only appear after approval.</p>';
      status.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    if (submitBtn) submitBtn.disabled = false;
  });

  // Load approved reviews if a backend is configured.
  async function loadApprovedReviews() {
    const container = document.getElementById('approvedReviews');
    if (!container) return;
    const config = window.SUPABASE_CONFIG || { url: '', anonKey: '' };
    if (!config.url || !config.anonKey || !window.supabase) {
      container.innerHTML = '';
      return;
    }
    const client = window.supabase.createClient(config.url, config.anonKey);
    try {
      const { data, error } = await client
        .from('feedback')
        .select('display_name, rating, review_text, created_at')
        .eq('status', 'approved')
        .order('created_at', { ascending: false });
      if (error || !data || !data.length) {
        container.innerHTML = '';
        return;
      }
      container.innerHTML = data.map((r) => {
        const stars = '★'.repeat(r.rating) + '☆'.repeat(5 - r.rating);
        return '<article class="review-card"><div class="review-stars">' + escapeHtml(stars) + '</div><div class="review-author">' + escapeHtml(r.display_name) + '</div><p class="review-text">' + escapeHtml(r.review_text) + '</p></article>';
      }).join('');
    } catch (e) {
      container.innerHTML = '';
    }
  }
  loadApprovedReviews();

  const resetBtn = document.getElementById('feedbackResetBtn');
  if (resetBtn) resetBtn.addEventListener('click', () => {
    if (nameInput) nameInput.value = '';
    if (textInput) textInput.value = '';
    updateStars(0);
    clearErrors();
    if (status) status.hidden = true;
  });
}

/* ---------- theme toggle ---------- */
function setupThemeToggle() {
  const btn = document.getElementById('themeToggle');
  console.log('Theme toggle button:', btn);
  if (!btn) return;
  console.log('Theme toggle initialized');
  function applyTheme(theme, persist) {
    console.log('applyTheme:', theme);
    document.documentElement.setAttribute('data-theme', theme);
    btn.textContent = theme === 'dark' ? '☀' : '🌙';
    btn.setAttribute('aria-pressed', theme === 'dark' ? 'true' : 'false');
    btn.setAttribute('aria-label', theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme');
    if (persist) {
      try { localStorage.setItem('dipseditz_theme', theme); } catch (e) { /* ignore */ }
    }
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', theme === 'dark' ? '#0B0D10' : '#F4F5F6');
  }
  const initial = document.documentElement.getAttribute('data-theme') || 'light';
  applyTheme(initial, false);
  btn.addEventListener('click', (e) => {
    console.log('Theme toggle clicked');
    const current = document.documentElement.getAttribute('data-theme') || 'light';
    applyTheme(current === 'dark' ? 'light' : 'dark', true);
    console.log('Theme after click:', document.documentElement.getAttribute('data-theme'), 'localStorage:', localStorage.getItem('dipseditz_theme'));
  });
}

/* ---------- showreel ---------- */
function setupShowreel() {
  const playBtn = document.getElementById('showreelPlay');
  const thumb = document.getElementById('showreelThumb');
  const frame = document.getElementById('showreelFrame');
  if (!playBtn || !thumb || !frame) return;
  const id = (typeof SHOWREEL_VIDEO_ID !== 'undefined' && SHOWREEL_VIDEO_ID) ? SHOWREEL_VIDEO_ID : (VIDEOS[0] ? VIDEOS[0].id : '');
  if (!id) return;
  const qualities = ['maxresdefault', 'sddefault', 'hqdefault'];
  let qualityIndex = 0;
  function tryQuality() {
    if (qualityIndex >= qualities.length) {
      thumb.style.display = 'none';
      if (fallback) fallback.hidden = false;
      return;
    }
    const quality = qualities[qualityIndex];
    const testImg = new Image();
    testImg.onload = () => {
      thumb.src = 'https://i.ytimg.com/vi/' + encodeURIComponent(id) + '/' + quality + '.jpg';
      thumb.decoding = 'async';
      thumb.style.display = '';
      if (fallback) fallback.hidden = true;
    };
    testImg.onerror = () => {
      qualityIndex += 1;
      tryQuality();
    };
    testImg.src = 'https://i.ytimg.com/vi/' + encodeURIComponent(id) + '/' + quality + '.jpg';
  }
  const fallback = document.getElementById('showreelFallback');
  thumb.onerror = () => {
    thumb.style.display = 'none';
    if (fallback) fallback.hidden = false;
  };
  tryQuality();
  playBtn.addEventListener('click', () => {
    frame.innerHTML = '<iframe src="https://www.youtube.com/embed/' + encodeURIComponent(id) + '?autoplay=1" title="Showreel video" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen loading="lazy"></iframe>';
  }, { once: true });
}

/* ---------- case study ---------- */
function openCaseStudy(id) {
  const v = VIDEOS.find((x) => x.id === id);
  const modal = document.getElementById('caseStudyModal');
  const content = document.getElementById('caseStudyContent');
  if (!v || !modal || !content) return;
  const cs = v.caseStudy || {};
  const whatsappMsg = encodeURIComponent('Hi Dips Editz, I am interested in a custom video edit similar to ' + v.title + '. Could you share the next steps?');
  const whatsappUrl = 'https://wa.me/917305855341?text=' + whatsappMsg;
  content.innerHTML = `
    <h3>${escapeHtml(v.title)}</h3>
    <p><strong>Category:</strong> ${escapeHtml(v.category)}</p>
    <p><strong>Project brief:</strong> ${escapeHtml(cs.brief || 'Add the real project brief here.')}</p>
    <p><strong>Techniques:</strong> ${escapeHtml(cs.techniques || 'Add editing techniques used.')}</p>
    <p><strong>Tools:</strong> ${escapeHtml(cs.tools || 'Add software/tools used.')}</p>
    <p><strong>Result:</strong> ${escapeHtml(cs.result || 'Add a short result description here.')}</p>
    <p class="case-study-note">Case-study details are editable placeholders. Replace them with real project information in script.js.</p>
    <div class="case-study-actions">
      <a class="btn btn-primary" href="#book" data-service="${escapeHtml(v.category)}">Discuss a Similar Project</a>
      <a class="btn btn-ghost whatsapp-preview" href="${whatsappUrl}" target="_blank" rel="noopener noreferrer" data-whatsapp-message="Hi Dips Editz, I am interested in a custom video edit similar to ${escapeHtml(v.title)}. Could you share the next steps?">Enquire on WhatsApp</a>
    </div>
  `;
  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
  // preselect service if possible
  const serviceMap = { shorts: 'Shorts/Reels', cricket: 'Cricket Edits', gaming: 'Gaming Montages' };
  // no-op placeholder for future service preselection
}
function closeCaseStudy() {
  const modal = document.getElementById('caseStudyModal');
  if (modal) modal.classList.remove('open');
  document.body.style.overflow = '';
}
/* ---------- WhatsApp enquiry ---------- */
function setupWhatsAppEnquiry() {
  document.querySelectorAll('.whatsapp-enquiry').forEach((link) => {
    const card = link.closest('.service-card');
    const serviceBtn = card ? card.querySelector('[data-service]') : null;
    const service = serviceBtn ? serviceBtn.getAttribute('data-service') : 'custom video editing';
    const msg = 'Hi Dips Editz, I am interested in a custom video edit. Service: ' + service + '. Could you share the next steps?';
    link.href = 'https://wa.me/917305855341?text=' + encodeURIComponent(msg);
    link.setAttribute('data-whatsapp-message', msg);
  });
}
/* ---------- custom cursor ---------- */
function setupCustomCursor() {
  const cursor = document.getElementById('customCursor');
  if (!cursor) return;
  if (window.matchMedia && (window.matchMedia('(pointer: coarse)').matches || window.matchMedia('(prefers-reduced-motion: reduce)').matches)) return;
  cursor.classList.add('active');
  let x = 0, y = 0, tx = 0, ty = 0, raf = null;
  window.addEventListener('mousemove', (e) => { tx = e.clientX; ty = e.clientY; if (!raf) raf = requestAnimationFrame(update); }, { passive: true });
  function update() {
    x += (tx - x) * 0.18;
    y += (ty - y) * 0.18;
    cursor.style.left = x + 'px';
    cursor.style.top = y + 'px';
    if (Math.abs(tx - x) > 0.1 || Math.abs(ty - y) > 0.1) raf = requestAnimationFrame(update);
    else raf = null;
  }
  document.querySelectorAll('a, button, [role="button"], input, select, textarea, summary').forEach((el) => {
    el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
  });
}

/* ---------- easter eggs ---------- */
function setupEasterEggs() {
  const logo = document.querySelector('.logo');
  let clicks = 0;
  if (logo) {
    logo.addEventListener('click', () => {
      clicks += 1;
      if (clicks >= 5) {
        clicks = 0;
        showCreatorNote('Thanks for exploring Dips Editz. Keep creating.');
      }
    });
  }
  document.addEventListener('keydown', (e) => {
    if (e.key.toLowerCase() === 'd' && !e.ctrlKey && !e.metaKey && !e.altKey) {
      const active = document.activeElement;
      const tag = active ? active.tagName.toLowerCase() : '';
      if (tag === 'input' || tag === 'textarea' || tag === 'select') return;
      showCreatorNote('Creator mode: Dips Editz. Keep editing, keep learning.');
    }
  });
}
function showCreatorNote(text) {
  let note = document.getElementById('creatorNote');
  if (!note) {
    note = document.createElement('div');
    note.id = 'creatorNote';
    note.className = 'creator-note';
    note.setAttribute('role', 'status');
    document.body.appendChild(note);
  }
  note.textContent = text;
  note.classList.add('show');
  clearTimeout(note._timer);
  note._timer = setTimeout(() => note.classList.remove('show'), 2600);
}

/* ---------- back to top ---------- */
function setupBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;
  function update() {
    if (window.scrollY > 420) btn.classList.add('visible');
    else btn.classList.remove('visible');
  }
  window.addEventListener('scroll', update, { passive: true });
  update();
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

/* ---------- active nav ---------- */
function setupActiveNav() {
  const links = Array.from(document.querySelectorAll('#navLinks a[href^="#"]'));
  const sections = links.map((a) => document.querySelector(a.getAttribute('href'))).filter(Boolean);
  if (!sections.length) return;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const id = '#' + entry.target.id;
      links.forEach((a) => a.classList.toggle('active', a.getAttribute('href') === id));
    });
  }, { rootMargin: '-35% 0px -55% 0px', threshold: 0.01 });
  sections.forEach((s) => observer.observe(s));
}

/* ---------- WhatsApp preview ---------- */
function setupWhatsAppPreview() {
  const modal = document.getElementById('whatsappModal');
  const closeBtn = document.getElementById('whatsappClose');
  const cancelBtn = document.getElementById('whatsappCancelBtn');
  const openBtn = document.getElementById('whatsappOpenBtn');
  const textarea = document.getElementById('whatsappMessage');
  if (!modal || !textarea || !openBtn) return;

  let currentMessage = '';
  function openPreview(message) {
    currentMessage = message || '';
    textarea.value = currentMessage;
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closePreview() {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }

  document.addEventListener('click', (e) => {
    const link = e.target.closest('.whatsapp-preview');
    if (!link) return;
    e.preventDefault();
    const msg = link.getAttribute('data-whatsapp-message') || link.getAttribute('data-service') || 'Hi Dips Editz, I would like to enquire about a custom video edit.';
    openPreview(msg);
  });

  if (closeBtn) closeBtn.addEventListener('click', closePreview);
  if (cancelBtn) cancelBtn.addEventListener('click', closePreview);
  modal.addEventListener('click', (e) => { if (e.target === modal) closePreview(); });
  openBtn.addEventListener('click', () => {
    const msg = textarea.value.trim();
    const url = 'https://wa.me/917305855341?text=' + encodeURIComponent(msg);
    window.open(url, '_blank', 'noopener,noreferrer');
    closePreview();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('open')) closePreview();
  });
}

/* ---------- copy actions ---------- */
function setupCopyActions() {
  const emailBtn = document.getElementById('copyEmailBtn');
  const phoneBtn = document.getElementById('copyPhoneBtn');
  function copy(text, btn) {
    if (!btn) return;
    btn.addEventListener('click', (e) => e.stopPropagation());
    const done = () => { const old = btn.textContent; btn.textContent = text === 'dipesh23.in@gmail.com' ? 'Email copied!' : 'Phone number copied!'; setTimeout(() => { btn.textContent = old; }, 1400); };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(done).catch(() => { window.prompt('Copy this:', text); });
    } else {
      window.prompt('Copy this:', text);
    }
  }
  if (emailBtn) emailBtn.addEventListener('click', (e) => { e.stopPropagation(); copy('dipesh23.in@gmail.com', emailBtn); });
  if (phoneBtn) phoneBtn.addEventListener('click', (e) => { e.stopPropagation(); copy('+917305855341', phoneBtn); });
}

/* ---------- hero scroll arrow ---------- */
function setupHeroScrollArrow() {
  const btn = document.getElementById('heroScrollArrow');
  if (!btn) return;
  const nextSection = document.getElementById('showreel') || document.querySelector('main section:nth-of-type(2)');
  const footer = document.querySelector('footer');
  if (!nextSection) { btn.remove(); return; }
  function update() {
    const footerTop = footer ? footer.getBoundingClientRect().top + window.scrollY : document.documentElement.scrollHeight;
    const hide = window.scrollY + window.innerHeight > footerTop - 80;
    if (hide) btn.classList.remove('visible');
    else btn.classList.add('visible');
  }
  btn.addEventListener('click', () => {
    nextSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
  window.addEventListener('scroll', update, { passive: true });
  update();
}

/* ---------- copy protection ---------- */
function setupCopyProtection() {
  document.addEventListener('copy', (e) => {
    const active = document.activeElement;
    const editable = !!active && (active.tagName === 'INPUT' || active.tagName === 'TEXTAREA' || active.tagName === 'SELECT' || active.isContentEditable);
    if (!editable) e.preventDefault();
  });
}

/* ---------- init ---------- */
document.addEventListener('DOMContentLoaded', () => {
  try { wireSubscribe(); } catch (e) { console.error("init failed:", e); }
  try { wireSocial(); } catch (e) { console.error("init failed:", e); }
  try { renderVideos(); } catch (e) { console.error("init failed:", e); }
  try { setupNav(); } catch (e) { console.error("init failed:", e); }
  try { setupModal(); } catch (e) { console.error("init failed:", e); }
  try { setupFilters(); } catch (e) { console.error('Filters setup failed:', e); }
  try { setupServicePicks(); } catch (e) { console.error("init failed:", e); }
  try { setupBooking(); } catch (e) { console.error("init failed:", e); }
  try { observeReveal(); } catch (e) { console.error("init failed:", e); }
  try { setupNavbarScroll(); } catch (e) { console.error("init failed:", e); }
  try { setupNotifications(); } catch (e) { console.error("init failed:", e); }
  try { setupHeroParallax(); } catch (e) { console.error("init failed:", e); }
  try { setupBackgroundParallax(); } catch (e) { console.error("init failed:", e); }
  try { setupFeedback(); } catch (e) { console.error("init failed:", e); }
  try { setupShowreel(); } catch (e) { console.error("init failed:", e); }
  try { setupWhatsAppEnquiry(); } catch (e) { console.error("init failed:", e); }
  try { setupThemeToggle(); } catch (e) { console.error("init failed:", e); }
  try { setupCustomCursor(); } catch (e) { console.error("init failed:", e); }
  try { setupEasterEggs(); } catch (e) { console.error("init failed:", e); }
  try { setupBackToTop(); } catch (e) { console.error("init failed:", e); }
  try { setupActiveNav(); } catch (e) { console.error("init failed:", e); }
  try { setupWhatsAppPreview(); } catch (e) { console.error("init failed:", e); }
  try { setupCopyActions(); } catch (e) { console.error("init failed:", e); }
  try { setupCopyProtection(); } catch (e) { console.error("init failed:", e); }
  try { setupHeroScrollArrow(); } catch (e) { console.error("init failed:", e); }
  try { setupTilt(); } catch (e) { console.error("init failed:", e); }
  try { setupInstall(); } catch (e) { console.error("init failed:", e); }
  registerServiceWorker();

  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();
});
