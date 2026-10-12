import re

with open('pages/mold-inspection-testing.html', 'r', encoding='utf-8') as f:
    html = f.read()

# 1. Check sections
sections = re.findall(r'<section[^>]*>(.*?)</section>', html, re.DOTALL)
print(f'Total sections: {len(sections)}')

# 2. Check inline styles with width
for idx, line in enumerate(html.split('\n'), 1):
    m = re.findall(r'(?:min-)?width:\s*([0-9]+px)', line)
    for px in m:
        if int(px.replace('px','')) > 300:
            print(f'Line {idx}: width={px} -> {line.strip()[:100]}')

# 3. Check SVGs
for idx, line in enumerate(html.split('\n'), 1):
    if '<svg' in line and 'width=' in line:
        m = re.findall(r'width="([0-9]+)"', line)
        for px in m:
            if int(px) > 350:
                print(f'SVG Line {idx}: width={px} -> {line.strip()[:100]}')
