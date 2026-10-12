import glob, re

for path in ['index.html'] + glob.glob('pages/*.html'):
    with open(path, 'r', encoding='utf-8') as f:
        text = f.read()
    if 'accordion' in text:
        matches = set(re.findall(r'class="([^"]*accordion[^"]*)"', text))
        print(f'{path}: {matches}')
