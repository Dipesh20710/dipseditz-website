from PIL import Image

src = Image.open('spiderman-logo.png').convert('RGBA')
bg = (7, 7, 13, 255)

for size in (192, 512):
    canvas = Image.new('RGBA', (size, size), bg)
    scale = 0.78
    max_dim = int(size * scale)
    w = max_dim
    h = int(w * src.height / src.width)
    if h > max_dim:
        h = max_dim
        w = int(h * src.width / src.height)
    resized = src.resize((w, h), Image.LANCZOS)
    x = (size - w) // 2
    y = (size - h) // 2
    canvas.paste(resized, (x, y), resized)
    canvas.convert('RGB').save('app-icon-%d.png' % size, 'PNG')
    print('saved', size, canvas.size)
