"""
Regenerates the temporary brand assets in /public from the values below.
Run after changing the studio name:  python3 scripts/make-brand-assets.py
(Needs Pillow; fonts are converted from the installed @fontsource packages.)
"""
from PIL import Image, ImageDraw, ImageFont
import os

NAME = "Amogh Studio"
MARK = "A"
LINE = "Custom software, backend systems,\nAPIs, automation and AI integration."
HARBOUR, DECK, SIGNAL, FOG, FOG2, CHART = "#0b1a2b", "#11253a", "#ffb547", "#e6edf4", "#aebdcc", "#8db7e0"
F = os.path.join(os.path.dirname(__file__), ".fonts")
OUT = os.path.join(os.path.dirname(__file__), "..", "public")

def font(name, size):
    return ImageFont.truetype(os.path.join(F, name), size)

def mark(size, radius_ratio=0.22):
    s = size * 4
    img = Image.new("RGBA", (s, s), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    d.rounded_rectangle([0, 0, s - 1, s - 1], radius=int(s * radius_ratio), fill=SIGNAL)
    f = font("brico700.ttf", int(s * 0.62))
    bbox = d.textbbox((0, 0), MARK, font=f)
    w, h = bbox[2] - bbox[0], bbox[3] - bbox[1]
    d.text(((s - w) / 2 - bbox[0], (s - h) / 2 - bbox[1] - s * 0.01), MARK, font=f, fill=HARBOUR)
    return img.resize((size, size), Image.LANCZOS)

# Favicons
mark(32).save(os.path.join(OUT, "favicon-32.png"))
touch = Image.new("RGBA", (180, 180), HARBOUR)
touch.paste(mark(132, 0.2), (24, 24), mark(132, 0.2))
touch.convert("RGB").save(os.path.join(OUT, "apple-touch-icon.png"))
for size in (192, 512):
    im = Image.new("RGBA", (size, size), HARBOUR)
    m = mark(int(size * 0.7), 0.2)
    im.paste(m, (int(size * 0.15),) * 2, m)
    im.convert("RGB").save(os.path.join(OUT, f"icon-{size}.png"))

# Open Graph image 1200x630
W, H = 1200, 630
og = Image.new("RGB", (W, H), HARBOUR)
d = ImageDraw.Draw(og, "RGBA")
for x in range(0, W, 60):
    d.line([(x, 0), (x, H)], fill=(141, 183, 224, 22))
for y in range(0, H, 60):
    d.line([(0, y), (W, y)], fill=(141, 183, 224, 22))
# trace rows on the right
rows = [("0 ms", "gateway", 1), ("3 ms", "verify", 1), ("9 ms", "queue", 1), ("41 ms", "worker", 1), ("60 ms", "audit", 2)]
x0, y0 = 760, 150
d.rounded_rectangle([x0 - 30, y0 - 40, x0 + 380, y0 + 330], radius=18, fill=DECK, outline=(141, 183, 224, 80), width=2)
mono = font("plex400.ttf", 24)
for i, (t, c, s) in enumerate(rows):
    y = y0 + i * 60
    d.text((x0, y), t, font=mono, fill="#8397ab")
    d.text((x0 + 110, y), c, font=mono, fill=CHART)
    d.rounded_rectangle([x0 + 320, y + 8, x0 + 334, y + 22], radius=3, fill=SIGNAL if s == 2 else "#7fd1a8")
m = mark(72)
og.paste(m, (80, 80), m)
d.text((172, 96), NAME, font=font("brico700.ttf", 40), fill=FOG)
d.multiline_text((80, 250), "Software that\nmoves business\nforward", font=font("brico700.ttf", 78), fill=FOG, spacing=6)
d.multiline_text((80, 520), LINE, font=font("plex400.ttf", 26), fill=FOG2, spacing=8)
os.makedirs(os.path.join(OUT, "assets", "images"), exist_ok=True)
og.save(os.path.join(OUT, "assets", "images", "og-image.png"), optimize=True)
print("brand assets written")
