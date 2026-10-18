from pathlib import Path
from PIL import Image

project = Path('/home/ubuntu/fitpath-india')
source = project / 'assets/images/icon.png'
image = Image.open(source).convert('RGB')
image.thumbnail((512, 512), Image.Resampling.LANCZOS)
for name in ('icon.png', 'splash-icon.png', 'favicon.png', 'android-icon-foreground.png'):
    destination = project / 'assets/images' / name
    image.save(destination, format='PNG', optimize=True, compress_level=9)
print(f'optimized {image.width}x{image.height} logo copies')
for name in ('icon.png', 'splash-icon.png', 'favicon.png', 'android-icon-foreground.png'):
    destination = project / 'assets/images' / name
    print(destination.name, destination.stat().st_size)
