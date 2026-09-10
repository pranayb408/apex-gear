import glob
import re
import os
import urllib.request

html_files = glob.glob("*.html")
print("HTML Files found:", html_files)

for f in html_files:
    print(f"\n=== Scanning {f} ===")
    content = open(f, encoding="utf-8").read()
    
    # Simple regex for img tags
    img_tags = re.findall(r'<img[^>]+>', content)
    for tag in img_tags:
        src_match = re.search(r'src=["\']([^"\']+)["\']', tag)
        if src_match:
            src = src_match.group(1)
            # Check if local file exists or external url is used
            if not src.startswith("http") and not src.startswith("data:"):
                exists = os.path.exists(src)
                print(f"Local Image: {src} -> {'EXISTS' if exists else 'MISSING'}")
            else:
                # Just print external URL
                print(f"External Image: {src[:100]}...")
