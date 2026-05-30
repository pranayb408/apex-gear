import glob
import re
import os
import urllib.request
import sys

html_files = glob.glob("*.html")
print("HTML Files:", html_files)

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3'
}

for f in html_files:
    print(f"\n=== Scanning {f} ===")
    content = open(f, encoding="utf-8").read()
    
    # Extract all src values in <img ... src="url"> or similar tags
    urls = re.findall(r'<img[^>]+src=["\']([^"\']+)["\']', content)
    # Also find style backgrounds if any
    bg_urls = re.findall(r'url\(["\']?([^"\')]+)["\']?\)', content)
    all_urls = list(set(urls + bg_urls))
    
    for url in all_urls:
        if "${" in url or "item.img" in url or "src" in url or "imgs[0]" in url or "p.img" in url:
            continue # ignore JS template strings
            
        if not url.startswith("http") and not url.startswith("data:"):
            # Check local file
            exists = os.path.exists(url)
            print(f"Local Asset: {url} -> {'EXISTS' if exists else 'MISSING'}")
        elif url.startswith("http"):
            # Ping URL
            try:
                req = urllib.request.Request(url, headers=headers)
                with urllib.request.urlopen(req, timeout=3) as response:
                    status = response.status
                print(f"External URL: {url[:60]}... -> STATUS {status}")
            except Exception as e:
                print(f"External URL: {url[:60]}... -> FAILED ({e})")
