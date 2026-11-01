p = r'c:\Users\dipes\Python\dipseditz-website\index.html'
s = open(p, encoding='utf-8').read()
s = s.replace('class="btn btn-ghost btn-sm whatsapp-enquiry"', 'class="btn btn-ghost btn-sm whatsapp-enquiry whatsapp-preview"')
open(p, 'w', encoding='utf-8').write(s)
print('done')