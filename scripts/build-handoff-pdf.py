#!/usr/bin/env python3
# Build the illustrated handoff PDF: markdown -> styled HTML (with an embedded
# phone-screenshot gallery) -> Chrome print-to-pdf.
import base64, re, subprocess, pathlib, markdown

ROOT = pathlib.Path(__file__).resolve().parent.parent
SHOTS = pathlib.Path('/tmp/amiboli_shots')
MD = ROOT / 'AMIBOLI_DEV_HANDOFF.md'
HTML = pathlib.Path('/tmp/handoff.html')
PDF = ROOT / 'AMIBOLI_DEV_HANDOFF.pdf'
CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'

def datauri(name):
    b = (SHOTS / f'{name}.png').read_bytes()
    return 'data:image/png;base64,' + base64.b64encode(b).decode()

GALLERY = [
    ('splash', 'Splash', 'Animated Ami logo. Auto-advances to Home.'),
    ('onboarding', 'Onboarding', '3 swipeable slides, skippable.'),
    ('auth', 'Auth (UI only)', 'Any tap → Home.'),
    ('home', 'Home — book feed', 'Scroll-snap, one book per screen, big moving character.'),
    ('book', 'Book detail', 'Recap/intro + vertical scene path.'),
    ('play', 'Scene player', 'Header · shadow-theatre stage · caption (mic mode).'),
    ('score', 'Result', 'Streak-up animation + seal + breakdown.'),
    ('store', 'Store', 'Premium books, Buy → library.'),
    ('leaderboard', 'Leaderboard', 'Pinned rank, filter chips, medals.'),
    ('profile', 'Profile', 'Stats, skills, coaching cards.'),
    ('plans', 'Plans', 'Free vs Pro.'),
]

body = markdown.markdown(
    MD.read_text(encoding='utf-8'),
    extensions=['extra', 'tables', 'fenced_code', 'sane_lists', 'toc'],
)

# Drop the first H1 (we render our own cover) and inject the play shot into §9.
body = re.sub(r'<h1[^>]*>.*?</h1>', '', body, count=1, flags=re.S)
play_fig = (
    f'<figure class="inline-shot"><img src="{datauri("play")}"/>'
    f'<figcaption>The scene player — the fixed 3-zone layout (header · stage · caption in mic mode).</figcaption></figure>'
)
body = re.sub(r'(<h2[^>]*>9\..*?THE SCENE ENGINE.*?</h2>)', r'\1' + play_fig, body, count=1, flags=re.S)

cards = '\n'.join(
    f'<figure class="shot"><img src="{datauri(n)}"/><figcaption><b>{t}</b><span>{d}</span></figcaption></figure>'
    for (n, t, d) in GALLERY
)

html = f'''<!doctype html><html><head><meta charset="utf-8">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&family=Lora:ital,wght@0,400;0,600;1,400&family=JetBrains+Mono:wght@400;600&display=swap" rel="stylesheet">
<style>
  :root {{ --v:#4A35B0; --vl:#7C5CDB; --teal:#2ABFA8; --gold:#E8920A; --coral:#D85A30;
           --ink:#1A1040; --soft:#5A4D8A; --bg:#F6F4FF; --border:#E2DEFF; }}
  @page {{ size: A4; margin: 16mm 14mm; }}
  * {{ box-sizing: border-box; }}
  body {{ font-family:'Nunito',system-ui,sans-serif; color:var(--ink); font-size:10.5px; line-height:1.5; }}
  h1,h2,h3,h4 {{ font-family:'Nunito'; font-weight:800; color:var(--ink); line-height:1.2; }}
  h2 {{ font-size:17px; color:var(--v); margin:22px 0 8px; padding-top:6px; border-top:2px solid var(--border); }}
  h3 {{ font-size:13px; margin:14px 0 5px; }}
  h4 {{ font-size:11.5px; margin:10px 0 4px; color:var(--soft); }}
  p, li {{ font-size:10.5px; }}
  a {{ color:var(--v); text-decoration:none; }}
  code {{ font-family:'JetBrains Mono',monospace; font-size:9px; background:#EEEAFF; color:#3A28A0; padding:1px 4px; border-radius:4px; }}
  pre {{ background:#1A1040; color:#EAE6FF; padding:10px 12px; border-radius:10px; overflow:hidden;
         font-family:'JetBrains Mono',monospace; font-size:8.4px; line-height:1.45; page-break-inside:avoid; white-space:pre-wrap; }}
  pre code {{ background:none; color:inherit; padding:0; font-size:8.4px; }}
  table {{ border-collapse:collapse; width:100%; margin:8px 0; font-size:9.3px; page-break-inside:avoid; }}
  th,td {{ border:1px solid var(--border); padding:4px 7px; text-align:left; vertical-align:top; }}
  th {{ background:#EEEAFF; color:var(--v); font-weight:800; }}
  blockquote {{ margin:8px 0; padding:8px 12px; background:#EEEAFF; border-left:4px solid var(--v);
                border-radius:0 8px 8px 0; color:var(--soft); font-size:10px; }}
  hr {{ border:none; border-top:1px solid var(--border); margin:14px 0; }}
  ul,ol {{ padding-left:18px; }}
  /* cover */
  .cover {{ text-align:center; padding:30mm 0 12mm; page-break-after:always; }}
  .cover .logo {{ font-family:'Nunito'; font-weight:900; font-size:46px; color:var(--v); letter-spacing:-1px; }}
  .cover .sub {{ font-size:13px; color:var(--soft); margin-top:4px; }}
  .cover .pills span {{ display:inline-block; margin:14px 5px 0; padding:5px 12px; border-radius:999px;
                        background:#EEEAFF; color:var(--v); font-weight:800; font-size:10px; }}
  .cover .hero {{ width:150px; border-radius:18px; box-shadow:0 16px 40px -16px rgba(74,53,176,.5); margin:18px 0; }}
  .cover .meta {{ margin-top:18px; font-size:10px; color:var(--soft); }}
  /* gallery */
  .gallery {{ display:flex; flex-wrap:wrap; gap:9px; page-break-after:always; }}
  .shot {{ width:31%; margin:0; }}
  .shot img {{ width:100%; border-radius:10px; border:1px solid var(--border); box-shadow:0 6px 16px -8px rgba(26,16,64,.3); }}
  .shot figcaption {{ font-size:8.5px; margin-top:3px; }}
  .shot figcaption b {{ display:block; color:var(--ink); font-size:9.2px; }}
  .shot figcaption span {{ color:var(--soft); }}
  .inline-shot {{ float:right; width:118px; margin:0 0 8px 12px; }}
  .inline-shot img {{ width:100%; border-radius:10px; border:1px solid var(--border); }}
  .inline-shot figcaption {{ font-size:8px; color:var(--soft); margin-top:3px; text-align:center; }}
  .section-title {{ font-size:15px; color:var(--v); font-weight:900; margin:0 0 10px; }}
</style></head><body>
  <div class="cover">
    <div class="logo">Amiboli</div>
    <div class="sub">Developer Handoff Specification</div>
    <img class="hero" src="{datauri('home')}"/>
    <div class="pills"><span>Flutter app</span><span>FastAPI backend</span><span>Brand v2</span></div>
    <div class="meta">Build a functional app matching this prototype.<br>
      Live reference: amiboli-app-prototype.vercel.app</div>
  </div>
  <div>
    <div class="section-title">Screen gallery — what you're building</div>
    <div class="gallery">{cards}</div>
  </div>
  {body}
</body></html>'''

HTML.write_text(html, encoding='utf-8')
subprocess.run([
    CHROME, '--headless=new', '--disable-gpu', '--no-pdf-header-footer',
    f'--print-to-pdf={PDF}', HTML.as_uri(),
], check=True, capture_output=True)
print('PDF:', PDF, PDF.stat().st_size, 'bytes')
