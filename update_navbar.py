import re

with open("index.html", "r", encoding="utf-8") as f:
    content = f.read()

# Fix the mobile drawer links
content = content.replace('<li><a href="cloth.html">Specs</a></li>', '<li><a href="specs.html">Specs</a></li>')

# Fix megaFeatured image and text
content = content.replace('https://chromeindustries.com/cdn/shop/files/No_Comply_Skate_3x2_16x9.jpg?v=1716503837', 'https://images.unsplash.com/photo-1556906781-9a412961c28c?q=80&w=800&auto=format&fit=crop')

# Fix BAGS -> SPECS
content = content.replace('id="megaBags"', 'id="megaSpecs"')
content = content.replace('<a href="specs.html" class="nm-link" role="menuitem">BAGS</a>', '<a href="specs.html" class="nm-link" role="menuitem">SPECS</a>')
content = content.replace('https://chromeindustries.com/cdn/shop/files/Bags-MegaMenu-Desktop.jpg', 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?q=80&w=800&auto=format&fit=crop')
content = content.replace('<span class="img-overlay-text">ALL BAGS</span>', '<span class="img-overlay-text">ALL SPECS</span>')
content = content.replace('All Bags</a>', 'All Specs</a>')
content = content.replace('Backpacks</a>', 'Aviators</a>')
content = content.replace('Messengers</a>', 'Wayfarers</a>')
content = content.replace('Slings</a>', 'Round Glasses</a>')
content = content.replace('On-Bike Bags</a>', 'Computer Glasses</a>')
content = content.replace('Totes</a>', 'Premium Frames</a>')
content = content.replace('Waterproof Bags</a>', 'Polarized Lenses</a>')
content = content.replace('Swappable Buckle Bags</a>', 'Anti-Glare Glasses</a>')
content = content.replace('Tech &amp; Bag Organizers</a>', 'Eyewear Cases</a>')
content = content.replace('Bag Parts</a>', 'Cleaning Kits</a>')


# Fix SLINGS -> WATCHES
content = content.replace('id="megaSlings"', 'id="megaWatches"')
content = content.replace('<a href="watch.html" class="nm-link" role="menuitem">SLINGS</a>', '<a href="watch.html" class="nm-link" role="menuitem">WATCHES</a>')
content = content.replace('https://chromeindustries.com/cdn/shop/files/Slings-MegaMenu-Desktop.jpg', 'https://www.casio.com/content/casio/locales/in/en/products/watches/gshock/products/g-steel/2110d-series/_jcr_content/root/responsivegrid/container/container_395339144_/container/container_395339144_/container/container_1597587420/carousel/item_1725953510447.casiocoreimg.jpeg/1755498590940/gm-2110d-2b-square.jpeg')
content = content.replace('<span class="img-overlay-text">SLINGS</span>', '<span class="img-overlay-text">WATCHES</span>')
content = content.replace('<p class="mega-head">SHOP SLINGS</p>', '<p class="mega-head">SHOP WATCHES</p>')
content = content.replace('Mini Kadet</a>', 'Digital Watches</a>')
content = content.replace('Sabin Slings</a>', 'Analog Watches</a>')
content = content.replace('Tensile Collection</a>', 'Smartwatches</a>')
content = content.replace('Kadet Sling</a>', 'Limited Editions</a>')

# Fix ACCESSORIES -> CLOTHING
content = content.replace('id="megaAccessories"', 'id="megaClothing"')
content = content.replace('<a href="cloth.html" class="nm-link" role="menuitem">ACCESSORIES</a>', '<a href="cloth.html" class="nm-link" role="menuitem">CLOTHING</a>')
content = content.replace('https://chromeindustries.com/cdn/shop/files/Accessories-MegaMenu-Desktop.jpg', 'https://levi.in/cdn/shop/files/005RC0060_01_Styleshot_360x.jpg?v=1774432503&width=400')
content = content.replace('<span class="img-overlay-text">ACCESSORIES</span>', '<span class="img-overlay-text">CLOTHING</span>')
content = content.replace('All Accessories</a>', 'All Clothing</a>')
content = content.replace('Cycling Caps &amp; Hats</a>', 'Jackets &amp; Coats</a>')
content = content.replace('Cycle Gloves</a>', 'Shirts &amp; Polos</a>')
content = content.replace('Keychains &amp; Buckles</a>', 'T-Shirts</a>')
content = content.replace('Organizers &amp; Pouches</a>', 'Jeans &amp; Pants</a>')
content = content.replace('Merino Socks</a>', 'Activewear</a>')

# Fix SHOES
content = content.replace('https://chromeindustries.com/cdn/shop/files/Shoes-MegaMenu-Desktop.jpg', 'https://adn-static1.nykaa.com/nykdesignstudio-images/pub/media/catalog/product/5/3/5324c8eNike-HQ2592-601_1.jpg?rnd=20200526195200&tr=w-1080')

with open("index.html", "w", encoding="utf-8") as f:
    f.write(content)

print("Navbar mega menu updated successfully!")
