p = r'c:\Users\dipes\Python\dipseditz-website\index.html'
s = open(p, encoding='utf-8').read()
marker = '  </noscript>'
block = '''  <!-- WhatsApp Preview Modal -->
  <div class="modal-backdrop" id="whatsappModal" role="dialog" aria-modal="true" aria-label="Review WhatsApp message">
    <div class="modal">
      <button class="modal-close" id="whatsappClose" aria-label="Close">×</button>
      <div class="modal-info">
        <h3>Review WhatsApp message</h3>
        <p>WhatsApp will open with this draft. You can edit it before sending.</p>
        <textarea id="whatsappMessage" rows="5"></textarea>
        <div class="form-actions">
          <button type="button" class="btn btn-primary" id="whatsappOpenBtn">Open WhatsApp</button>
          <button type="button" class="btn btn-ghost" id="whatsappCancelBtn">Cancel</button>
        </div>
      </div>
    </div>
  </div>

'''
i = s.find(marker)
assert i != -1
s = s[:i] + block + s[i:]
open(p, 'w', encoding='utf-8').write(s)
print('done')