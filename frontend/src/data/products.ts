export interface ProductColor {
  color: string;
  value: string;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  subCategory: string;
  price: number;
  origPrice: number | null;
  badge: string;
  rating: number;
  reviews: number;
  imgs: string[];
  colors: ProductColor[];
  sizes: string[];
  features: string[];
}

export const products: Product[] = [
  // --- SHOES ---
  {
    id: "shoes_1",
    name: "Nike Air IQ3408 — Sport Blue",
    category: "shoes",
    subCategory: "sneaker",
    price: 12999,
    origPrice: null,
    badge: "NEW",
    rating: 5,
    reviews: 312,
    imgs: ["https://adn-static1.nykaa.com/nykdesignstudio-images/pub/media/catalog/product/5/3/5324c8eNike-IQ3408-286_1.jpg?rnd=20200526195200&tr=w-1536"],
    colors: [
      { color: "Sport Blue", value: "#4a7fc1" },
      { color: "Black", value: "#111" },
      { color: "White", value: "#fff;border-color:#ccc" }
    ],
    sizes: ["7", "8", "9", "10", "11"],
    features: ["Premium quality construction", "Built for comfort & durability", "Apex Gear approved logo detail"]
  },
  {
    id: "shoes_2",
    name: "Storm 415 Traction Boot",
    category: "shoes",
    subCategory: "boot",
    price: 17200,
    origPrice: null,
    badge: "WATERPROOF",
    rating: 5,
    reviews: 486,
    imgs: ["https://adn-static1.nykaa.com/nykdesignstudio-images/pub/media/catalog/product/5/3/5324c8eNike-HQ2592-601_1.jpg?rnd=20200526195200&tr=w-1080"],
    colors: [
      { color: "Black", value: "#111" },
      { color: "Olive", value: "#2E3524" },
      { color: "Brown", value: "#8B5A2B" }
    ],
    sizes: ["7", "8", "9", "10", "11"],
    features: ["Premium quality construction", "Built for comfort & durability", "Apex Gear approved logo detail"]
  },
  {
    id: "shoes_3",
    name: "Sylvan Sneaker — Ranger Green",
    category: "shoes",
    subCategory: "sneaker",
    price: 15600,
    origPrice: null,
    badge: "",
    rating: 5,
    reviews: 309,
    imgs: ["https://images-static.nykaa.com/uploads/7019e8e5-2115-4e1c-8a07-17c1fc1fcffd.png?tr=cm-pad_resize,w-900"],
    colors: [
      { color: "Ranger Green", value: "#5C7671" },
      { color: "Black", value: "#111" },
      { color: "Grey", value: "#B6B6B6" }
    ],
    sizes: ["7", "8", "9", "10", "11"],
    features: ["Premium quality construction", "Built for comfort & durability", "Apex Gear approved logo detail"]
  },
  {
    id: "shoes_4",
    name: "Foster High Top — Blacktop",
    category: "shoes",
    subCategory: "boot",
    price: 17100,
    origPrice: null,
    badge: "",
    rating: 4,
    reviews: 556,
    imgs: ["https://adn-static1.nykaa.com/nykdesignstudio-images/pub/media/catalog/product/5/3/5324c8eNike-IQ3408-286_1.jpg?rnd=20200526195200&tr=w-1536"],
    colors: [
      { color: "Black", value: "#111" },
      { color: "White", value: "#fff;border-color:#ccc" },
      { color: "Olive", value: "#2E3524" }
    ],
    sizes: ["7", "8", "9", "10", "11"],
    features: ["Premium quality construction", "Built for comfort & durability", "Apex Gear approved logo detail"]
  },
  {
    id: "shoes_5",
    name: "Naito Sneaker — Black",
    category: "shoes",
    subCategory: "sneaker",
    price: 10200,
    origPrice: 12600,
    badge: "SALE",
    rating: 5,
    reviews: 758,
    imgs: ["https://adn-static1.nykaa.com/nykdesignstudio-images/pub/media/catalog/product/5/3/5324c8eNike-HQ2592-601_1.jpg?rnd=20200526195200&tr=w-1080"],
    colors: [
      { color: "Black", value: "#111" },
      { color: "Olive", value: "#2E3524" },
      { color: "White", value: "#fff;border-color:#ccc" }
    ],
    sizes: ["7", "8", "9", "10", "11"],
    features: ["Premium quality construction", "Built for comfort & durability", "Apex Gear approved logo detail"]
  },
  {
    id: "shoes_6",
    name: "Dima 3.0 — Ranger Green",
    category: "shoes",
    subCategory: "bike",
    price: 17600,
    origPrice: null,
    badge: "BIKE",
    rating: 5,
    reviews: 668,
    imgs: ["https://images-static.nykaa.com/uploads/7019e8e5-2115-4e1c-8a07-17c1fc1fcffd.png?tr=cm-pad_resize,w-900"],
    colors: [
      { color: "Ranger Green", value: "#5C7671" },
      { color: "Black", value: "#111" },
      { color: "Grey", value: "#B6B6B6" }
    ],
    sizes: ["7", "8", "9", "10", "11"],
    features: ["Premium quality construction", "Built for comfort & durability", "Apex Gear approved logo detail"]
  },
  {
    id: "shoes_7",
    name: "Boyer Slip-On — Black",
    category: "shoes",
    subCategory: "sneaker",
    price: 15600,
    origPrice: null,
    badge: "",
    rating: 5,
    reviews: 551,
    imgs: ["https://adn-static1.nykaa.com/nykdesignstudio-images/pub/media/catalog/product/5/3/5324c8eNike-IQ3408-286_1.jpg?rnd=20200526195200&tr=w-1536"],
    colors: [
      { color: "Black", value: "#111" },
      { color: "Olive", value: "#2E3524" },
      { color: "White", value: "#fff;border-color:#ccc" }
    ],
    sizes: ["7", "8", "9", "10", "11"],
    features: ["Premium quality construction", "Built for comfort & durability", "Apex Gear approved logo detail"]
  },
  {
    id: "shoes_8",
    name: "415 Boot Stacked — White",
    category: "shoes",
    subCategory: "boot",
    price: 12600,
    origPrice: null,
    badge: "",
    rating: 5,
    reviews: 177,
    imgs: ["https://adn-static1.nykaa.com/nykdesignstudio-images/pub/media/catalog/product/5/3/5324c8eNike-HQ2592-601_1.jpg?rnd=20200526195200&tr=w-1080"],
    colors: [
      { color: "White", value: "#fff;border-color:#ccc" },
      { color: "Black", value: "#111" },
      { color: "Olive", value: "#2E3524" }
    ],
    sizes: ["7", "8", "9", "10", "11"],
    features: ["Premium quality construction", "Built for comfort & durability", "Apex Gear approved logo detail"]
  },
  {
    id: "shoes_9",
    name: "Vegan Canvas Low — Ecru",
    category: "shoes",
    subCategory: "vegan",
    price: 9800,
    origPrice: null,
    badge: "VEGAN",
    rating: 5,
    reviews: 392,
    imgs: ["https://adn-static1.nykaa.com/nykdesignstudio-images/pub/media/catalog/product/5/3/5324c8eNike-IQ3408-286_1.jpg?rnd=20200526195200&tr=w-1536"],
    colors: [
      { color: "Ecru", value: "#f5f0e8;border-color:#ccc" },
      { color: "Black", value: "#111" },
      { color: "Tan", value: "#c8b08a" }
    ],
    sizes: ["7", "8", "9", "10", "11"],
    features: ["Premium quality construction", "Built for comfort & durability", "Apex Gear approved logo detail"]
  },
  {
    id: "shoes_10",
    name: "Urban Bike Clipless — Ranger",
    category: "shoes",
    subCategory: "bike",
    price: 21400,
    origPrice: null,
    badge: "BIKE",
    rating: 5,
    reviews: 189,
    imgs: ["https://images-static.nykaa.com/uploads/7019e8e5-2115-4e1c-8a07-17c1fc1fcffd.png?tr=cm-pad_resize,w-900"],
    colors: [
      { color: "Ranger Green", value: "#5C7671" },
      { color: "Black", value: "#111" }
    ],
    sizes: ["7", "8", "9", "10", "11"],
    features: ["Premium quality construction", "Built for comfort & durability", "Apex Gear approved logo detail"]
  },
  {
    id: "shoes_11",
    name: "Leather Lace-Up Boot — Brown",
    category: "shoes",
    subCategory: "boot",
    price: 19800,
    origPrice: null,
    badge: "PREMIUM",
    rating: 5,
    reviews: 224,
    imgs: ["https://adn-static1.nykaa.com/nykdesignstudio-images/pub/media/catalog/product/5/3/5324c8eNike-IQ3408-286_1.jpg?rnd=20200526195200&tr=w-1536"],
    colors: [
      { color: "Brown", value: "#8B5A2B" },
      { color: "Black", value: "#111" }
    ],
    sizes: ["7", "8", "9", "10", "11"],
    features: ["Premium quality construction", "Built for comfort & durability", "Apex Gear approved logo detail"]
  },
  {
    id: "shoes_12",
    name: "Bromley Pro Vegan — White",
    category: "shoes",
    subCategory: "vegan",
    price: 14600,
    origPrice: null,
    badge: "",
    rating: 4,
    reviews: 478,
    imgs: ["https://adn-static1.nykaa.com/nykdesignstudio-images/pub/media/catalog/product/5/3/5324c8eNike-HQ2592-601_1.jpg?rnd=20200526195200&tr=w-1080"],
    colors: [
      { color: "White", value: "#fff;border-color:#ccc" },
      { color: "Black", value: "#111" },
      { color: "Olive", value: "#2E3524" }
    ],
    sizes: ["7", "8", "9", "10", "11"],
    features: ["Premium quality construction", "Built for comfort & durability", "Apex Gear approved logo detail"]
  },

  // --- WATCHES ---
  {
    id: "watches_1",
    name: "G-Shock Mudmaster",
    category: "watches",
    subCategory: "gshock",
    price: 24995,
    origPrice: null,
    badge: "NEW",
    rating: 5,
    reviews: 890,
    imgs: ["https://images.unsplash.com/photo-1612817158483-12d260ebdf70?w=600&q=80"],
    colors: [],
    sizes: ["One Size"],
    features: ["Premium quality construction", "Built for comfort & durability", "Apex Gear approved logo detail"]
  },
  {
    id: "watches_2",
    name: "G-Steel GST-B400",
    category: "watches",
    subCategory: "gsteel",
    price: 32000,
    origPrice: null,
    badge: "",
    rating: 5,
    reviews: 210,
    imgs: ["https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?w=600&q=80"],
    colors: [],
    sizes: ["One Size"],
    features: ["Premium quality construction", "Built for comfort & durability", "Apex Gear approved logo detail"]
  },
  {
    id: "watches_3",
    name: "Edifice Chronograph",
    category: "watches",
    subCategory: "edifice",
    price: 14500,
    origPrice: 18500,
    badge: "SALE",
    rating: 5,
    reviews: 415,
    imgs: ["https://images.unsplash.com/photo-1585123334904-845d60e97b29?w=600&q=80"],
    colors: [],
    sizes: ["One Size"],
    features: ["Premium quality construction", "Built for comfort & durability", "Apex Gear approved logo detail"]
  },
  {
    id: "watches_4",
    name: "Vintage Digital Gold",
    category: "watches",
    subCategory: "classic",
    price: 4295,
    origPrice: null,
    badge: "",
    rating: 5,
    reviews: 1120,
    imgs: ["https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=600&q=80"],
    colors: [],
    sizes: ["One Size"],
    features: ["Premium quality construction", "Built for comfort & durability", "Apex Gear approved logo detail"]
  },
  {
    id: "watches_5",
    name: "G-Shock GA-2100 (CasiOak)",
    category: "watches",
    subCategory: "gshock",
    price: 9995,
    origPrice: null,
    badge: "HOT",
    rating: 5,
    reviews: 2500,
    imgs: ["https://images.unsplash.com/photo-1547996160-81dfa63595aa?w=600&q=80"],
    colors: [],
    sizes: ["One Size"],
    features: ["Premium quality construction", "Built for comfort & durability", "Apex Gear approved logo detail"]
  },
  {
    id: "watches_6",
    name: "Edifice Sapphire Solar",
    category: "watches",
    subCategory: "edifice",
    price: 19995,
    origPrice: null,
    badge: "",
    rating: 5,
    reviews: 150,
    imgs: ["https://images.unsplash.com/photo-1551816230-ef5deaed4a26?w=600&q=80"],
    colors: [],
    sizes: ["One Size"],
    features: ["Premium quality construction", "Built for comfort & durability", "Apex Gear approved logo detail"]
  },
  {
    id: "watches_7",
    name: "G-Steel Carbon Core",
    category: "watches",
    subCategory: "gsteel",
    price: 28500,
    origPrice: null,
    badge: "NEW",
    rating: 5,
    reviews: 95,
    imgs: ["https://images.unsplash.com/photo-1547996160-81dfa63595aa?w=600&q=80"],
    colors: [],
    sizes: ["One Size"],
    features: ["Premium quality construction", "Built for comfort & durability", "Apex Gear approved logo detail"]
  },
  {
    id: "watches_8",
    name: "Silver Analog Classic",
    category: "watches",
    subCategory: "classic",
    price: 3495,
    origPrice: null,
    badge: "",
    rating: 5,
    reviews: 560,
    imgs: ["https://images.unsplash.com/photo-1591034284664-16e8a6b8a9a1?w=600&q=80"],
    colors: [],
    sizes: ["One Size"],
    features: ["Premium quality construction", "Built for comfort & durability", "Apex Gear approved logo detail"]
  },

  // --- CLOTHING ---
  {
    id: "clothes_1",
    name: "Classic Graphic Tee",
    category: "clothes",
    subCategory: "tops",
    price: 1299,
    origPrice: null,
    badge: "NEW",
    rating: 5,
    reviews: 312,
    imgs: ["https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80"],
    colors: [],
    sizes: ["S", "M", "L", "XL"],
    features: ["Premium quality construction", "Built for comfort & durability", "Apex Gear approved logo detail"]
  },
  {
    id: "clothes_2",
    name: "Slim Fit Denim",
    category: "clothes",
    subCategory: "bottoms",
    price: 2499,
    origPrice: null,
    badge: "",
    rating: 5,
    reviews: 125,
    imgs: ["https://images.unsplash.com/photo-1631729371254-42c2892f0e6e?w=600&q=80"],
    colors: [],
    sizes: ["S", "M", "L", "XL"],
    features: ["Premium quality construction", "Built for comfort & durability", "Apex Gear approved logo detail"]
  },
  {
    id: "clothes_3",
    name: "Urban Hooded Jacket",
    category: "clothes",
    subCategory: "outerwear",
    price: 4999,
    origPrice: null,
    badge: "HOT",
    rating: 5,
    reviews: 456,
    imgs: ["https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600&q=80"],
    colors: [],
    sizes: ["S", "M", "L", "XL"],
    features: ["Premium quality construction", "Built for comfort & durability", "Apex Gear approved logo detail"]
  },
  {
    id: "clothes_4",
    name: "Cotton Beanie",
    category: "clothes",
    subCategory: "accessories",
    price: 899,
    origPrice: null,
    badge: "",
    rating: 5,
    reviews: 89,
    imgs: ["https://images.unsplash.com/photo-1576871337622-98d48d1cf531?w=600&q=80"],
    colors: [],
    sizes: ["S", "M", "L", "XL"],
    features: ["Premium quality construction", "Built for comfort & durability", "Apex Gear approved logo detail"]
  },
  {
    id: "clothes_5",
    name: "Oversized Vintage Hoodie",
    category: "clothes",
    subCategory: "tops",
    price: 3499,
    origPrice: null,
    badge: "",
    rating: 5,
    reviews: 230,
    imgs: ["https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=600&q=80"],
    colors: [],
    sizes: ["S", "M", "L", "XL"],
    features: ["Premium quality construction", "Built for comfort & durability", "Apex Gear approved logo detail"]
  },
  {
    id: "clothes_6",
    name: "Waterproof Windbreaker",
    category: "clothes",
    subCategory: "outerwear",
    price: 5200,
    origPrice: 6500,
    badge: "SALE",
    rating: 5,
    reviews: 190,
    imgs: ["https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600&q=80"],
    colors: [],
    sizes: ["S", "M", "L", "XL"],
    features: ["Premium quality construction", "Built for comfort & durability", "Apex Gear approved logo detail"]
  },
  {
    id: "clothes_7",
    name: "Cargo Track Pants",
    category: "clothes",
    subCategory: "bottoms",
    price: 2199,
    origPrice: null,
    badge: "",
    rating: 5,
    reviews: 110,
    imgs: ["https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=600&q=80"],
    colors: [],
    sizes: ["S", "M", "L", "XL"],
    features: ["Premium quality construction", "Built for comfort & durability", "Apex Gear approved logo detail"]
  },
  {
    id: "clothes_8",
    name: "Premium Basic Polo",
    category: "clothes",
    subCategory: "tops",
    price: 1499,
    origPrice: null,
    badge: "",
    rating: 5,
    reviews: 340,
    imgs: ["https://images.unsplash.com/photo-1589902860314-e910697dea18?w=600&q=80"],
    colors: [],
    sizes: ["S", "M", "L", "XL"],
    features: ["Premium quality construction", "Built for comfort & durability", "Apex Gear approved logo detail"]
  },

  // --- SPECS ---
  {
    id: "specs_1",
    name: "Aviator Classic",
    category: "specs",
    subCategory: "sunglasses",
    price: 5499,
    origPrice: null,
    badge: "HOT",
    rating: 5,
    reviews: 670,
    imgs: ["https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=600&q=80"],
    colors: [],
    sizes: ["One Size"],
    features: ["Premium quality construction", "Built for comfort & durability", "Apex Gear approved logo detail"]
  },
  {
    id: "specs_2",
    name: "Blue Light Blockers",
    category: "specs",
    subCategory: "optical",
    price: 2999,
    origPrice: null,
    badge: "",
    rating: 5,
    reviews: 345,
    imgs: ["https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=600&q=80"],
    colors: [],
    sizes: ["One Size"],
    features: ["Premium quality construction", "Built for comfort & durability", "Apex Gear approved logo detail"]
  },
  {
    id: "specs_3",
    name: "Cycling Wraparound",
    category: "specs",
    subCategory: "sports",
    price: 4200,
    origPrice: null,
    badge: "NEW",
    rating: 5,
    reviews: 180,
    imgs: ["https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=600&q=80"],
    colors: [],
    sizes: ["One Size"],
    features: ["Premium quality construction", "Built for comfort & durability", "Apex Gear approved logo detail"]
  },
  {
    id: "specs_4",
    name: "Durable Flex Frames",
    category: "specs",
    subCategory: "kids",
    price: 1899,
    origPrice: null,
    badge: "",
    rating: 5,
    reviews: 420,
    imgs: ["https://images.unsplash.com/photo-1483095348487-53dbf97d8d5b?w=600&q=80"],
    colors: [],
    sizes: ["One Size"],
    features: ["Premium quality construction", "Built for comfort & durability", "Apex Gear approved logo detail"]
  },
  {
    id: "specs_5",
    name: "Retro Square Shades",
    category: "specs",
    subCategory: "sunglasses",
    price: 3499,
    origPrice: 4999,
    badge: "SALE",
    rating: 5,
    reviews: 290,
    imgs: ["https://images.unsplash.com/photo-1508296695146-257a814070b4?w=600&q=80"],
    colors: [],
    sizes: ["One Size"],
    features: ["Premium quality construction", "Built for comfort & durability", "Apex Gear approved logo detail"]
  },
  {
    id: "specs_6",
    name: "Titanium Half-Rim",
    category: "specs",
    subCategory: "optical",
    price: 6500,
    origPrice: null,
    badge: "",
    rating: 5,
    reviews: 150,
    imgs: ["https://images.unsplash.com/photo-1591076482161-42ce6da69f67?w=600&q=80"],
    colors: [],
    sizes: ["One Size"],
    features: ["Premium quality construction", "Built for comfort & durability", "Apex Gear approved logo detail"]
  },
  {
    id: "specs_7",
    name: "Polarized Wayfarer",
    category: "specs",
    subCategory: "sunglasses",
    price: 4999,
    origPrice: null,
    badge: "",
    rating: 5,
    reviews: 510,
    imgs: ["https://images.unsplash.com/photo-1577803645773-f96470509666?w=600&q=80"],
    colors: [],
    sizes: ["One Size"],
    features: ["Premium quality construction", "Built for comfort & durability", "Apex Gear approved logo detail"]
  },
  {
    id: "specs_8",
    name: "Polarized Ski Goggles",
    category: "specs",
    subCategory: "sports",
    price: 7200,
    origPrice: null,
    badge: "NEW",
    rating: 5,
    reviews: 85,
    imgs: ["https://images.unsplash.com/photo-1563720360172-67b8f3dce741?w=600&q=80"],
    colors: [],
    sizes: ["One Size"],
    features: ["Premium quality construction", "Built for comfort & durability", "Apex Gear approved logo detail"]
  }
];
