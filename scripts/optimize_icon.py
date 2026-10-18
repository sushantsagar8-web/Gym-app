from PIL import Image
from pathlib import Path

source = Path('/home/ubuntu/fitpath-india/assets/images/icon.png')
image = Image.open(source).convert('RGBA')
image.thumbnail((512, 512), Image.Resampling.LANCZOS)
image = image.quantize(colors=128, method=Image.Quantize.FASTOCTREE).convert('RGBA')
for name in ['icon.png', 'splash-icon.png', 'favicon.png', 'android-icon-foreground.png']:
    target = Path('/home/ubuntu/fitpath-india/assets/images') / name
    image.save(target, format='PNG', optimize=True, compress_level=9)
