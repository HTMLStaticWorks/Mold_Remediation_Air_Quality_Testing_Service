import re

with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Check for SVGs, tables, images with large widths
for m in re.finditer(r'(width|max-width|min-width):\s*([0-9]+)px', content):
    val = int(m.group(2))
    if val > 360:
        print('Inline large width:', m.group(0))

for m in re.finditer(r'<svg[^>]*width=["\']([0-9]+)["\']', content):
    val = int(m.group(1))
    if val > 360:
        print('Large SVG width:', val, m.group(0)[:60])

for m in re.finditer(r'<img[^>]*width=["\']([0-9]+)["\']', content):
    val = int(m.group(1))
    if val > 360:
        print('Large img width:', val, m.group(0)[:60])
