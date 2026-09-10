import urllib.request
import os
import shutil

images = {
    # Shoes
    "shoe-air-max-moto-2k.jpg": "https://adn-static1.nykaa.com/nykdesignstudio-images/pub/media/catalog/product/a/d/ad22b92Nike-IO9279-011_1.jpg?rnd=20200526195200&tr=w-1536",
    "shoe-air-max-90-ltr.jpg": "https://adn-static1.nykaa.com/nykdesignstudio-images/pub/media/catalog/product/a/d/ad22b92Nike-CD6864-028_1.jpg?rnd=20200526195200&tr=w-1536",
    "shoe-air-max-90.jpg": "https://adn-static1.nykaa.com/nykdesignstudio-images/pub/media/catalog/product/3/2/32d6286Nike-IR5598-001_1.jpg?rnd=20200526195200&tr=w-1536",
    "shoe-air-jordan-1-low.jpg": "https://adn-static1.nykaa.com/nykdesignstudio-images/pub/media/catalog/product/a/d/ad22b92Nike-DC0774-101_1.jpg?rnd=20200526195200&tr=w-1536",
    "shoe-af1-fj4146-133.jpg": "https://adn-static1.nykaa.com/nykdesignstudio-images/pub/media/catalog/product/a/d/ad22b92Nike-FJ4146-133_1.jpg?rnd=20200526195200&tr=w-1536",
    "shoe-af1-fj4146-132.jpg": "https://adn-static1.nykaa.com/nykdesignstudio-images/pub/media/catalog/product/7/1/71f6d8eNike-FJ4146-132_1.jpg?rnd=20200526195200&tr=w-1536",
    "shoe-af1-ct2302-100.jpg": "https://adn-static1.nykaa.com/nykdesignstudio-images/pub/media/catalog/product/a/d/ad22b92Nike-CT2302-100_1.jpg?rnd=20200526195200&tr=w-1536",
    "shoe-af1-iv5102-100.jpg": "https://adn-static1.nykaa.com/nykdesignstudio-images/pub/media/catalog/product/7/1/71f6d8eNike-IV5102-100_1.jpg?rnd=20200526195200&tr=w-1536",

    # Watches
    "watch-gbm-2100a-2b.png": "https://www.casio.com/content/dam/casio/product-info/locales/in/en/timepiece/product/watch/G/GB/gbm/gbm-2100a-2b/assets/GBM-2100A-2B.png.transform/main-visual-sp/image.png",
    "watch-gbm-2100a-4b.png": "https://www.casio.com/content/dam/casio/product-info/locales/in/en/timepiece/product/watch/G/GB/gbm/gbm-2100a-4b/assets/GBM-2100A-4B.png.transform/main-visual-sp/image.png",
    "watch-mtg-b4000bd-1a.png": "https://www.casio.com/content/dam/casio/product-info/locales/in/en/timepiece/product/watch/M/MT/MTG/mtg-b4000bd-1a/assets/MTG-B4000BD-1A.png.transform/main-visual-sp/image.png",
    "watch-mtg-b4000-1a.png": "https://www.casio.com/content/dam/casio/product-info/locales/in/en/timepiece/product/watch/M/MT/MTG/mtg-b4000-1a/assets/MTG-B4000-1A.png.transform/main-visual-sp/image.png",

    # Cloths
    "cloth-hot-wheels-dare.jpg": "https://prod-img.thesouledstore.com/public/theSoul/uploads/catalog/product/1788878349_1194964.jpg?w=768&dpr=2",
    "cloth-kung-fu-panda.jpg": "https://prod-img.thesouledstore.com/public/theSoul/uploads/catalog/product/1788591274_8954302.jpg?w=768&dpr=2",
    "cloth-dbz-super-saiyan.jpg": "https://prod-img.thesouledstore.com/public/theSoul/uploads/catalog/product/1788414691_6112680.jpg?w=768&dpr=2",
    "cloth-dbz-goku.jpg": "https://prod-img.thesouledstore.com/public/theSoul/uploads/catalog/product/1786515306_1842781.jpg?w=768&dpr=2",
    "cloth-mortal-kombat.jpg": "https://prod-img.thesouledstore.com/public/theSoul/uploads/catalog/product/1788587988_7656541.jpg?w=768&dpr=2"
}

target_dirs = [
    r"c:\Users\Lenovo\OneDrive\Documents\E com project\Main FILE",
    r"c:\Users\Lenovo\OneDrive\Documents\E com project\frontend\public"
]

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
}

for fname, url in images.items():
    print(f"Downloading {fname}...")
    try:
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req, timeout=15) as resp:
            data = resp.read()
            for d in target_dirs:
                out_path = os.path.join(d, fname)
                with open(out_path, 'wb') as f:
                    f.write(data)
            print(f"  Saved {fname} ({len(data)} bytes)")
    except Exception as e:
        print(f"  Error downloading {fname}: {e}")

print("All downloads complete!")
