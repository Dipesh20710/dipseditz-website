p = r'c:\Users\dipes\Python\dipseditz-website\index.html'
s = open(p, encoding='utf-8').read()
old = "          </div>\n        </div>\n      </div>\n    </section>"
new = "          </div>\n        </div>\n        <div class=\"reviews-list reveal\" id=\"approvedReviews\" aria-live=\"polite\"></div>\n      </div>\n    </section>"
i = s.rfind(old)
assert i != -1, 'pattern not found'
s = s[:i] + new + s[i+len(old):]
open(p, 'w', encoding='utf-8').write(s)
print('done')