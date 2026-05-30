import re

files = ["cloth.html", "specs.html", "watch.html"]

for filename in files:
    print(f"\n==================== {filename} ====================")
    with open(filename, "r", encoding="utf-8") as f:
        content = f.read()
    
    # We want to find each product card and extract details
    # E.g.
    # <div class="prod-card" ...>
    # ...
    # <img ... src="..." />
    # ...
    # <div class="pc-name">Product Name</div>
    # ...
    # <div class="pc-price">...</div>
    
    # Let's split content by '<div class="prod-card'
    cards = content.split('<div class="prod-card')
    for idx, card in enumerate(cards[1:], 1):
        # Only take up to the next card or some limit
        card_content = card[:2000] # chunk of the card
        
        name_match = re.search(r'class=["\']pc-name["\'][^>]*>([^<]+)<', card_content)
        img_match = re.search(r'<img[^>]+src=["\']([^"\']+)["\']', card_content)
        price_match = re.search(r'class=["\']pc-price["\'][^>]*>([^<]+)<', card_content)
        
        name = name_match.group(1).strip() if name_match else "Unknown"
        img = img_match.group(1).strip() if img_match else "No Image"
        price = price_match.group(1).strip() if price_match else "No Price"
        
        print(f"Product {idx}:")
        print(f"  Name:  {name}")
        print(f"  Image: {img}")
        print(f"  Price: {price}")
