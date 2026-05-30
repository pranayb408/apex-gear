import re
import json

files = {
    "shoes": "shoes.html",
    "watches": "watch.html",
    "clothes": "cloth.html",
    "specs": "specs.html"
}

all_products = {}

for category, filename in files.items():
    print(f"\n==================== {category} ({filename}) ====================")
    with open(filename, "r", encoding="utf-8") as f:
        content = f.read()
    
    cards = content.split('<article class="prod-card"')
    category_products = []
    
    for idx, card in enumerate(cards[1:], 1):
        card_content = card.split('</article>')[0]
        
        # Attributes in article tag
        cat_match = re.search(r'data-cat=["\']([^"\']+)["\']', card)
        name_match = re.search(r'data-name=["\']([^"\']+)["\']', card)
        price_match = re.search(r'data-price=["\']([^"\']+)["\']', card)
        img_match = re.search(r'data-img=["\']([^"\']+)["\']', card)
        
        # In case they are not in the tag
        sub_cat = cat_match.group(1).strip() if cat_match else ""
        name = name_match.group(1).strip() if name_match else "Unknown"
        price_str = price_match.group(1).strip() if price_match else "0"
        img = img_match.group(1).strip() if img_match else ""
        
        # Parse price as number
        price = int(price_str.replace("₹", "").replace(",", "").strip())
        
        # Ratings
        rating_match = re.search(r'class=["\']rev-count["\'][^>]*>\(([^)]+)\)<', card_content)
        reviews = int(rating_match.group(1).strip()) if rating_match else 0
        
        stars_match = re.search(r'class=["\']stars["\'][^>]*>([^<]+)<', card_content)
        stars_str = stars_match.group(1).strip() if stars_match else "★★★★★"
        rating = stars_str.count("★")
        
        # Original price (for sale)
        orig_match = re.search(r'class=["\']pc-orig["\'][^>]*>([^<]+)<', card_content)
        orig_price = None
        if orig_match:
            orig_price = int(orig_match.group(1).replace("₹", "").replace(",", "").strip())
        
        # Badges
        badge_match = re.search(r'class=["\']pc-badge[^"\']*["\'][^>]*>([^<]+)<', card_content)
        badge = badge_match.group(1).strip() if badge_match else ""
        
        # Swatches
        swatches = []
        swatches_raw = re.findall(r'style=["\']background:([^"\']+)["\']\s+title=["\']([^"\']+)["\']', card_content)
        for bg, title in swatches_raw:
            swatches.append({"color": title, "value": bg})
            
        category_products.append({
            "id": f"{category}_{idx}",
            "name": name,
            "category": category,
            "subCategory": sub_cat,
            "price": price,
            "origPrice": orig_price,
            "badge": badge,
            "rating": rating,
            "reviews": reviews,
            "imgs": [img] if img else [],
            "colors": swatches,
            "sizes": ["S", "M", "L", "XL"] if category == "clothes" else ["7", "8", "9", "10", "11"] if category == "shoes" else ["One Size"],
            "features": ["Premium quality construction", "Built for comfort & durability", "Apex Gear approved logo detail"]
        })
        
    all_products[category] = category_products
    print(f"Extracted {len(category_products)} products.")

# Print to JSON file for easy copy pasting
with open("scratch/extracted_products.json", "w", encoding="utf-8") as out:
    json.dump(all_products, out, indent=2)
print("\nSaved output to scratch/extracted_products.json")
