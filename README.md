# Dips Editz — Website

A premium, dark black & purple website for the Dips Editz YouTube channel.
Built with HTML, CSS, and JavaScript only.

## Preview in Chrome

### Option 1 — Open the file directly
1. Open Chrome.
2. Press `Ctrl + O` (or drag the file into the window).
3. Select `index.html` inside this folder.
4. The site opens locally.

> Some browsers restrict certain features when opened via `file://`. If anything looks off, use Option 2.

### Option 2 — Local server (recommended)
Using Python (already installed):
```powershell
cd "c:\Users\dipes\Python\dipseditz-website"
python -m http.server 8000
```
Then open Chrome and visit: http://localhost:8000

Using Node (if installed):
```powershell
npx serve .
```

Using VS Code: install the "Live Server" extension, right-click `index.html` → "Open with Live Server".

## Customize

- **YouTube channel URL**: already set in `js/script.js` → `CHANNEL_URL`.
- **Featured videos**: edit the `VIDEOS` array in `js/script.js`. Replace `YOUR_VIDEO_ID_1` etc. with real YouTube video IDs (the part after `v=` in a video URL).
- **Social links**: edit the `SOCIAL` object in `js/script.js`.
- **Text / about**: edit `index.html`.
- **Colors**: edit CSS variables at the top of `css/style.css`.

## Files
- `index.html` — page structure
- `css/style.css` — styling (dark black + purple theme)
- `js/script.js` — interactivity, video rendering, animations
