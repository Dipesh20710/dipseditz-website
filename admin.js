let client = null;
let selectedOrderId = null;

function getClient() {
  const config = window.SUPABASE_CONFIG || { url: '', anonKey: '' };
  if (!config.url || !config.anonKey || !window.supabase) return null;
  if (!client) client = window.supabase.createClient(config.url, config.anonKey);
  return client;
}

const signedOut = document.getElementById('adminSignedOut');
const signedIn = document.getElementById('adminSignedIn');
const authForm = document.getElementById('adminAuthForm');
const emailInput = document.getElementById('adminEmail');
const passwordInput = document.getElementById('adminPassword');
const authMessage = document.getElementById('adminAuthMessage');
const refreshBtn = document.getElementById('adminRefreshBtn');
const signOutBtn = document.getElementById('adminSignOutBtn');
const userLabel = document.getElementById('adminUserLabel');
const ordersEl = document.getElementById('adminOrders');
const editor = document.getElementById('adminEditor');
const statusSelect = document.getElementById('adminStatus');
const noteInput = document.getElementById('adminNote');
const deliveryInput = document.getElementById('adminDelivery');
const saveBtn = document.getElementById('adminSaveBtn');
const saveMessage = document.getElementById('adminSaveMessage');

async function loadOrders() {
  const c = getClient();
  if (!c) { ordersEl.innerHTML = '<p class="orders-note">Configure Supabase credentials first.</p>'; return; }
  ordersEl.innerHTML = '<p class="orders-note">Loading...</p>';
  const { data, error } = await c.from('orders').select('*').order('created_at', { ascending: false });
  if (error) { ordersEl.innerHTML = '<p class="orders-note">' + error.message + '</p>'; return; }
  if (!data || !data.length) { ordersEl.innerHTML = '<p class="orders-note">No orders found.</p>'; return; }
  ordersEl.innerHTML = data.map((o) => `
    <article class="order-card">
      <h4>${o.order_ref} — ${o.service}</h4>
      <span class="order-status">${o.status}</span>
      <div class="order-meta">
        <div><strong>Customer:</strong> ${o.customer_id}</div>
        <div><strong>Submitted:</strong> ${new Date(o.created_at).toLocaleString()}</div>
        <div><strong>Delivery:</strong> ${o.delivery_date || 'Not set'}</div>
        <div><strong>Note:</strong> ${o.status_note || 'None'}</div>
      </div>
      <div class="form-actions" style="margin-top:10px;">
        <button type="button" class="btn btn-ghost btn-sm" data-edit="${o.id}">Edit</button>
      </div>
    </article>
  `).join('');
  ordersEl.querySelectorAll('[data-edit]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-edit');
      const order = data.find((o) => o.id === id);
      if (!order) return;
      selectedOrderId = id;
      statusSelect.value = order.status;
      noteInput.value = order.status_note || '';
      deliveryInput.value = order.estimated_delivery_date || '';
      editor.hidden = false;
      editor.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
}

async function checkAdmin() {
  const c = getClient();
  if (!c) return false;
  const { data } = await c.auth.getSession();
  if (!data?.session?.user) return false;
  const { data: profile } = await c.from('profiles').select('role').eq('id', data.session.user.id).single();
  return profile?.role === 'admin';
}

if (authForm) {
  authForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const c = getClient();
    if (!c) { authMessage.textContent = 'Configure Supabase credentials first.'; return; }
    authMessage.textContent = 'Signing in...';
    const { data, error } = await c.auth.signInWithPassword({
      email: emailInput.value.trim(),
      password: passwordInput.value
    });
    if (error) { authMessage.textContent = error.message; return; }
    const admin = await checkAdmin();
    if (!admin) {
      await c.auth.signOut();
      authMessage.textContent = 'This account is not an authorized administrator.';
      return;
    }
    signedOut.hidden = true;
    signedIn.hidden = false;
    userLabel.textContent = data.user.email;
    authMessage.textContent = '';
    loadOrders();
  });
}

if (signOutBtn) {
  signOutBtn.addEventListener('click', async () => {
    const c = getClient();
    if (c) await c.auth.signOut();
    signedOut.hidden = false;
    signedIn.hidden = true;
    editor.hidden = true;
  });
}
if (refreshBtn) refreshBtn.addEventListener('click', loadOrders);
if (saveBtn) {
  saveBtn.addEventListener('click', async () => {
    const c = getClient();
    if (!c || !selectedOrderId) return;
    saveMessage.textContent = 'Saving...';
    const { error } = await c.from('orders').update({
      status: statusSelect.value,
      status_note: noteInput.value.trim() || null,
      estimated_delivery_date: deliveryInput.value || null
    }).eq('id', selectedOrderId);
    if (error) saveMessage.textContent = error.message;
    else {
      saveMessage.textContent = 'Order updated.';
      loadOrders();
    }
  });
}