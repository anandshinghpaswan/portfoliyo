from pathlib import Path
from playwright.sync_api import sync_playwright
from PIL import Image
base=Path('/mnt/data/anand_uiux_portfolio_v3')
with sync_playwright() as p:
 browser=p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox'])
 page=browser.new_page(viewport={'width':1400,'height':850},device_scale_factor=1.2)
 page.set_content((base/'mockups.html').read_text(),wait_until='load')
 for id, file in [('staff','staffflow'),('task','taskline'),('care','carepath'),('shop','everyday-shop'),('log','elogbook')]:
  path=base/'assets'/f'{file}.png'
  page.locator(f'#{id}').screenshot(path=str(path))
  Image.open(path).convert('RGB').save(base/'assets'/f'{file}.webp','WEBP',quality=88,method=6)
  print(file, (base/'assets'/f'{file}.webp').stat().st_size)
 browser.close()
