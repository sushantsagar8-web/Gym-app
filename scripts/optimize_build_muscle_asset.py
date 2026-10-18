from PIL import Image
from pathlib import Path

source = Path('/home/ubuntu/upload/pasted_file_UzP6Wh_image.png')
target = Path('/home/ubuntu/fitpath-india/assets/images/build-muscle.png')
target.parent.mkdir(parents=True, exist_ok=True)

image = Image.open(source).convert('RGBA')
image.thumbnail((768, 768), Image.Resampling.LANCZOS)
image.save(target, format='PNG', optimize=True, compress_level=9)
print(f'{target} {target.stat().st_size} bytes {image.size}')
