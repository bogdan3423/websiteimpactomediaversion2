"""
One-off asset preparation for the ImpactoMedia website.

Reads the original website (strictly read-only) from ../websiteimpactoinitial
and writes optimised derivatives into src/assets and public/media.

Requirements: Python 3 with Pillow, ffmpeg on PATH.
Run from the project root:  python3 scripts/prepare-assets.py
"""
from pathlib import Path
import shutil
import subprocess

from PIL import Image, ImageChops, ImageDraw, ImageOps

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT.parent / "websiteimpactoinitial" / "assets"
OUT_IMG = ROOT / "src" / "assets"
OUT_PUB = ROOT / "public" / "media"


def ensure(path: Path) -> Path:
    path.parent.mkdir(parents=True, exist_ok=True)
    return path


def save_webp(img: Image.Image, dest: Path, quality: int = 82) -> None:
    img.save(ensure(dest), "WEBP", quality=quality, method=6)
    print("wrote", dest.relative_to(ROOT), img.size)


def crop_ratio(img: Image.Image, ratio: float, cx: float = 0.5, cy: float = 0.5) -> Image.Image:
    """Crop to width/height == ratio around a focal point (0..1)."""
    w, h = img.size
    if w / h > ratio:
        nw, nh = int(h * ratio), h
    else:
        nw, nh = w, int(w / ratio)
    left = min(max(int(cx * w - nw / 2), 0), w - nw)
    top = min(max(int(cy * h - nh / 2), 0), h - nh)
    return img.crop((left, top, left + nw, top + nh))


def trim_dark_bars(img: Image.Image, threshold: int = 18) -> Image.Image:
    gray = img.convert("L")
    w, h = gray.size
    rows = [sum(gray.getpixel((x, y)) for x in range(0, w, 4)) / (w / 4) for y in range(h)]
    top = next(y for y in range(h) if rows[y] > threshold)
    bottom = next(y for y in range(h - 1, -1, -1) if rows[y] > threshold)
    return img.crop((0, top, w, bottom + 1))


def trim_dark_columns(img: Image.Image, threshold: int = 18) -> Image.Image:
    gray = img.convert("L")
    w, h = gray.size
    cols = [sum(gray.getpixel((x, y)) for y in range(0, h, 4)) / (h / 4) for x in range(w)]
    left = next(x for x in range(w) if cols[x] > threshold)
    right = next(x for x in range(w - 1, -1, -1) if cols[x] > threshold)
    return img.crop((left, 0, right + 1, h))


def trim_transparent(img: Image.Image, pad: int = 0) -> Image.Image:
    bbox = img.getchannel("A").point(lambda a: 255 if a > 8 else 0).getbbox()
    img = img.crop(bbox) if bbox else img
    if pad:
        canvas = Image.new("RGBA", (img.width + 2 * pad, img.height + 2 * pad), (0, 0, 0, 0))
        canvas.paste(img, (pad, pad))
        img = canvas
    return img


def flood_background_to_alpha(img: Image.Image, tolerance: int = 24) -> Image.Image:
    """Make the background connected to the image edges transparent."""
    img = img.convert("RGBA")
    marker = (255, 0, 255, 0)
    w, h = img.size
    for seed in [(0, 0), (w - 1, 0), (0, h - 1), (w - 1, h - 1)]:
        if img.getpixel(seed)[3] != 0:
            ImageDraw.floodfill(img, seed, marker, thresh=tolerance)
    data = [(0, 0, 0, 0) if px == marker else px for px in img.getdata()]
    img.putdata(data)
    return img


# Brand logo ---------------------------------------------------------------
# The original PNG already has a transparent surround; the "MEDIA" box is opaque white.
logo = Image.open(SRC / "images/logos/logoimpactomedia.png").convert("RGBA")
logo = trim_transparent(logo)
logo.save(ensure(OUT_IMG / "brand/logo-on-light.png"), optimize=True)
r, g, b, a = logo.split()
inverted = Image.merge("RGBA", (*ImageOps.invert(Image.merge("RGB", (r, g, b))).split(), a))
inverted.save(ensure(OUT_IMG / "brand/logo-on-dark.png"), optimize=True)
print("logo", logo.size)

# Team -----------------------------------------------------------------------
bogdan = Image.open(SRC / "images/team/rusbogdanimpacto.webp").convert("RGB")
save_webp(crop_ratio(bogdan, 4 / 5, cx=0.53, cy=0.5).resize((1280, 1600), Image.LANCZOS), OUT_IMG / "team/bogdan-rus.webp")
irina = Image.open(SRC / "images/team/irinablagaimpacto.jpg").convert("RGB")
save_webp(crop_ratio(irina, 4 / 5, cx=0.48, cy=0.5), OUT_IMG / "team/irina-blaga.webp")
vlad = Image.open(SRC / "images/team/vladpotraimpacto.webp").convert("RGB")
save_webp(crop_ratio(vlad, 4 / 5, cx=0.5, cy=0.35), OUT_IMG / "team/vlad-potra.webp")

# Services -------------------------------------------------------------------
bts = trim_dark_bars(Image.open(SRC / "images/services/marketingvideo.jpeg").convert("RGB"))
save_webp(bts, OUT_IMG / "services/video-behind-the-scenes.webp")

# Client logos ---------------------------------------------------------------
clients = {
    "luxura-invest": "luxura-invest.webp",
    "doctor-usi": "logodoctorusi.webp",
    "coolinaria": "coolinaria-restaurant-logo-1-jpg (1).jpg",
    "som-in-via": "som-in-via.webp",
    "foraje-apa": "foraje-apa.webp",
    "mvp-design": "mvpdesignlogo.webp",
    "golden-hands": "golden-hands.webp",
    "ozon": "ozon.webp",
    "arca-seniorilor": "arcaseniorilorlogo.png",
    "remotrail": "logoremotrail .webp",
    "abt-trans": "logo_abttrans.png",
}
for slug, file in clients.items():
    img = Image.open(SRC / "images/logos" / file).convert("RGBA")
    if slug in {"arca-seniorilor", "abt-trans"}:
        img = flood_background_to_alpha(img, tolerance=30)
    if slug == "remotrail":
        # The original artwork uses near-white letters meant for dark backgrounds.
        px = [(150, 150, 150, a) if a > 0 and min(r, g, b) > 185 else (r, g, b, a) for r, g, b, a in img.getdata()]
        img.putdata(px)
    img = trim_transparent(img)
    img.thumbnail((640, 320), Image.LANCZOS)
    img.save(ensure(OUT_IMG / f"clients/{slug}.png"), optimize=True)
    print("client", slug, img.size)
shutil.copyfile(SRC / "images/logos/winedistrict-logo_color_onblack.svg", ensure(ROOT / "public/media/clients/wine-district.svg"))
