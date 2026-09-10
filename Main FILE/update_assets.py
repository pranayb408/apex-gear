import re

def update_file(filename, replacements):
    print(f"Updating {filename}...")
    with open(filename, "r", encoding="utf-8") as f:
        content = f.read()
    
    original_length = len(content)
    for target, replacement in replacements.items():
        content = content.replace(target, replacement)
    
    if len(content) == original_length and replacements:
        # Check if anything actually changed
        print(f"Warning: No changes made to {filename} (length remained {original_length})")
    else:
        print(f"Success: {filename} updated.")
        
    with open(filename, "w", encoding="utf-8") as f:
        f.write(content)

# replacements for index.html
index_replacements = {
    'src="hero-bg.mp4"': 'src="story_video.mp4"',
    'href="cloth.html" class="ep-panel" id="epPackItUp"': 'href="specs.html" class="ep-panel" id="epPackItUp"',
    'https://images-static.nykaa.com/uploads/7019e8e5-2115-4e1c-8a07-17c1fc1fcffd.png?tr=cm-pad_resize,w-900': 'shoes.png',
    'https://www.casio.com/content/casio/locales/in/en/products/watches/gshock/_jcr_content/root/responsivegrid/carousel_copy/item_1721711027014.casiocoreimg.jpeg/1721711054880/desktop-icons.jpeg': 'watch.png',
    'https://levi.in/cdn/shop/files/Desktop_3_35972967-917a-49d5-83fa-039421309eb4.png?v=1770209930': 'clothes.png',
    'https://adn-static1.nykaa.com/nykdesignstudio-images/pub/media/catalog/product/5/3/5324c8eNike-IQ3408-286_1.jpg?rnd=20200526195200&tr=w-1536': 'shoes.png',
    'https://www.casio.com/content/dam/casio/product-info/locales/in/en/timepiece/product/watch/G/GM/GMW/gmw-bz5000d-1/assets/GMW-BZ5000D-1.png.transform/main-visual-pc/image.png': 'watch.png',
    'https://www.otticanet.com/cdn/shop/files/img_art_FE40181I_01A-large_f248291e-ad3d-4419-a259-c7176e0a598a.jpg?v=1761679913&width=1000': 'specs.png',
    'https://adn-static1.nykaa.com/nykdesignstudio-images/pub/media/catalog/product/5/3/5324c8eNike-IQ0547-045_1.jpg?rnd=20200526195200&tr=w-1536': 'clothes.png',
    'https://levi.in/cdn/shop/files/005RC0060_01_Styleshot_360x.jpg?v=1774432503&width=400': 'clothes.png',
    'https://images.unsplash.com/photo-1572635196237-14b3f281503f?q=80&w=800&auto=format&fit=crop': 'specs.png',
    'https://adn-static1.nykaa.com/nykdesignstudio-images/pub/media/catalog/product/5/3/5324c8eNike-HQ2592-601_1.jpg?rnd=20200526195200&tr=w-1080': 'shoes.png',
    'https://www.casio.com/content/casio/locales/in/en/products/watches/gshock/products/g-steel/2110d-series/_jcr_content/root/responsivegrid/container/container_395339144_/container/container_395339144_/container/container_1597587420/carousel/item_1725953510447.casiocoreimg.jpeg/1755498590940/gm-2110d-2b-square.jpeg': 'watch.png',
    'https://grandvision-media.imgix.net/asset/f0aa27e5-932f-45b8-a0a1-845f1cda4a06/original_png/8056376386387_00001.png?fit=fill&fm=png&w=877&h=493&auto=format': 'specs.png',
    'https://sunglassic.com/cdn/shop/files/Walter_Black_Orage_Square_Sunglasses_3.jpg?v=1775830614&width=1000': 'specs.png',
    'https://www.casio.com/content/dam/casio/product-info/locales/in/en/timepiece/product/watch/G/GA/GA2/ga-2100k-2a/assets/GA-2100K-2A.png.transform/product-panel/image.png': 'watch.png',
    'https://www.casio.com/content/dam/casio/product-info/locales/in/en/timepiece/product/watch/G/GM/GMS/gm-s2110bp-5a/assets/GM-S2110BP-5A.png.transform/main-visual-pc/image.png': 'watch.png',
    'https://www.casio.com/content/dam/casio/product-info/locales/in/en/timepiece/product/watch/G/GM/gm2/gm-2100m-1a/assets/GM-2100M-1A.png.transform/main-visual-pc/image.png': 'watch.png',
    'https://m.media-amazon.com/images/I/61fI8cozN8L._SX500_.jpg': 'watch.png',
    'https://adn-static1.nykaa.com/nykdesignstudio-images/pub/media/catalog/product/b/b/bb0549fNike-IR0817-100_1.jpg?rnd=20200526195200&tr=w-1536': 'shoes.png',
    'https://adn-static1.nykaa.com/nykdesignstudio-images/pub/media/catalog/product/5/3/5324c8eNike-DC9486-117_1.jpg?rnd=20200526195200&tr=w-1536': 'shoes.png',
    'https://adn-static1.nykaa.com/nykdesignstudio-images/pub/media/catalog/product/a/b/ab828aaNike-IO1866-100_1.jpg?rnd=20200526195200&tr=w-1536': 'shoes.png'
}

# replacements for sale.html
sale_replacements = {
    'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80': 'shoes.png',
    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80': 'watch.png',
    'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&q=80': 'clothes.png',
    'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600&q=80': 'specs.png',
    'https://adn-static1.nykaa.com/nykdesignstudio-images/pub/media/catalog/product/5/3/5324c8eNike-HQ2592-601_1.jpg?rnd=20200526195200&tr=w-1080': 'shoes.png',
    'https://images.unsplash.com/photo-1585123334904-845d60e97b29?w=600&q=80': 'watch.png',
    'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600&q=80': 'clothes.png',
    'https://images.unsplash.com/photo-1508296695146-257a814070b4?w=600&q=80': 'specs.png',
    'https://adn-static1.nykaa.com/nykdesignstudio-images/pub/media/catalog/product/5/3/5324c8eNike-IQ3408-286_1.jpg?rnd=20200526195200&tr=w-1536': 'shoes.png',
    'https://images-static.nykaa.com/uploads/7019e8e5-2115-4e1c-8a07-17c1fc1fcffd.png?tr=cm-pad_resize,w-900': 'shoes.png'
}

# replacements for admin.html
admin_replacements = {
    'var IMG_A = \'https://adn-static1.nykaa.com/nykdesignstudio-images/pub/media/catalog/product/5/3/5324c8eNike-IQ3408-286_1.jpg?rnd=20200526195200&tr=w-1536\';': "var IMG_A = 'shoes.png';",
    'var IMG_B = \'https://adn-static1.nykaa.com/nykdesignstudio-images/pub/media/catalog/product/5/3/5324c8eNike-HQ2592-601_1.jpg?rnd=20200526195200&tr=w-1080\';': "var IMG_B = 'shoes.png';",
    'var IMG_C = \'https://images-static.nykaa.com/uploads/7019e8e5-2115-4e1c-8a07-17c1fc1fcffd.png?tr=cm-pad_resize,w-900\';': "var IMG_C = 'shoes.png';",
    'https://www.otticanet.com/cdn/shop/files/img_art_FE40181I_01A-large_f248291e-ad3d-4419-a259-c7176e0a598a.jpg?v=1761679913&width=1000': 'specs.png',
    'https://chromeindustries.com/cdn/shop/files/Accessories-MegaMenu-Desktop.jpg': 'clothes.png',
    'https://www.casio.com/content/dam/casio/product-info/locales/in/en/timepiece/product/watch/G/GM/GMW/gmw-bz5000d-1/assets/GMW-BZ5000D-1.png.transform/main-visual-pc/image.png': 'watch.png'
}

update_file("index.html", index_replacements)
update_file("sale.html", sale_replacements)
update_file("admin.html", admin_replacements)
