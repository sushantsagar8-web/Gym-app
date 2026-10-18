from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
ASSET_DIR = ROOT / "assets" / "images"
TARGETS = [
    ("build-muscle.png", "build-muscle.webp"),
    ("hiit-cardio.png", "hiit-cardio.webp"),
]
MAX_DIMENSION = 768
QUALITY = 82

for source_name, target_name in TARGETS:
    source = ASSET_DIR / source_name
    target = ASSET_DIR / target_name
    with Image.open(source) as image:
        rgba = image.convert("RGBA")
        rgba.thumbnail((MAX_DIMENSION, MAX_DIMENSION), Image.Resampling.LANCZOS)
        rgba.save(target, "WEBP", quality=QUALITY, method=6)
        print(f"{source_name}: {image.size} -> {rgba.size}; {source.stat().st_size} -> {target.stat().st_size} bytes")
        if rgba.mode != "RGBA":
            raise RuntimeError(f"Transparency was not preserved for {target_name}")
        if target.stat().st_size >= source.stat().st_size:
            raise RuntimeError(f"Optimized asset is not smaller: {target_name}")

print("Home-card image optimization complete")
