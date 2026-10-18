from pathlib import Path
from PIL import Image

source = Path('/home/ubuntu/upload/pasted_file_kkj6qm_image.png')
target = Path('/home/ubuntu/fitpath-india/assets/images/hiit-cardio.png')
target.parent.mkdir(parents=True, exist_ok=True)

image = Image.open(source).convert('RGBA')
image.thumbnail((1024, 768), Image.Resampling.LANCZOS)
image.save(target, format='PNG', optimize=True, compress_level=9)
print(f'{target} {target.stat().st_size} bytes {image.size}')
