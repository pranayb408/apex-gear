'use client';

import { useEffect, useState } from 'react';
import { products, Product } from '@/data/products';

export default function Home() {
  const [recommendations, setRecommendations] = useState<Product[]>([]);

  useEffect(() => {
    // Select 4 static recommendations (e.g., one from each category)
    const recommendedIds = ['shoes_1', 'watches_1', 'clothes_3', 'specs_1'];
    const filtered = products.filter(p => recommendedIds.includes(p.id));
    setRecommendations(filtered);
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Hero Video Section */}
      <section className="relative w-full h-[70vh] md:h-[85vh] overflow-hidden flex items-center justify-center">
        <video 
          autoPlay 
          muted 
          loop 
          playsInline 
          className="absolute top-0 left-0 w-full h-full object-cover select-none pointer-events-none"
        >
          <source src="/story_video.mp4" type="video/mp4" />
        </video>
        {/* Dark overlay for readability */}
        <div className="absolute inset-0 bg-black/45 z-10" />
        
        <div className="relative z-20 text-center text-white px-4 max-w-3xl">
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-black tracking-wider uppercase mb-4 animate-fade-in font-sans">
            GEAR UP FOR GREATNESS
          </h1>
          <p className="text-base sm:text-lg md:text-xl font-medium tracking-wide text-gray-200 mb-8 max-w-md mx-auto">
            The new collection is here. Engineered for durability, design, and performance.
          </p>
          <a 
            href="/products/shoes" 
            className="inline-block bg-white text-black text-xs font-black tracking-widest uppercase px-8 py-4 rounded-none hover:bg-red-600 hover:text-white transition-all duration-300 transform hover:scale-105 active:scale-95"
          >
            SHOP NOW
          </a>
        </div>
      </section>

      {/* Shop By Category Section */}
      <section className="py-16 px-4 max-w-7xl mx-auto w-full text-center" id="categories">
        <h2 className="text-2xl sm:text-3xl font-black tracking-widest uppercase mb-2 text-black">
          SHOP BY CATEGORY
        </h2>
        <div className="h-1 w-16 bg-red-600 mx-auto mb-10" />
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          <a 
            href="/products/shoes" 
            className="group relative block overflow-hidden bg-gray-50 aspect-square sm:aspect-auto sm:h-96"
          >
            <img 
              src="/shoes.png" 
              alt="Footwear Category" 
              className="w-full h-full object-contain p-8 group-hover:scale-105 transition-transform duration-500 ease-out" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-90 group-hover:opacity-100 transition-opacity" />
            <div className="absolute bottom-6 left-6 text-left">
              <h3 className="text-xl font-black tracking-wider text-white uppercase">FOOTWEAR</h3>
              <p className="text-xs text-gray-300 font-bold tracking-widest mt-1">EXPLORE COLLECTION →</p>
            </div>
          </a>

          <a 
            href="/products/watches" 
            className="group relative block overflow-hidden bg-gray-50 aspect-square sm:aspect-auto sm:h-96"
          >
            <img 
              src="/watch.png" 
              alt="Watches Category" 
              className="w-full h-full object-contain p-8 group-hover:scale-105 transition-transform duration-500 ease-out" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-90 group-hover:opacity-100 transition-opacity" />
            <div className="absolute bottom-6 left-6 text-left">
              <h3 className="text-xl font-black tracking-wider text-white uppercase">WATCHES</h3>
              <p className="text-xs text-gray-300 font-bold tracking-widest mt-1">EXPLORE COLLECTION →</p>
            </div>
          </a>

          <a 
            href="/products/clothes" 
            className="group relative block overflow-hidden bg-gray-50 aspect-square sm:aspect-auto sm:h-96 col-span-1 sm:col-span-2 md:col-span-1"
          >
            <img 
              src="/clothes.png" 
              alt="Clothing Category" 
              className="w-full h-full object-contain p-8 group-hover:scale-105 transition-transform duration-500 ease-out" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-90 group-hover:opacity-100 transition-opacity" />
            <div className="absolute bottom-6 left-6 text-left">
              <h3 className="text-xl font-black tracking-wider text-white uppercase">APPAREL</h3>
              <p className="text-xs text-gray-300 font-bold tracking-widest mt-1">EXPLORE COLLECTION →</p>
            </div>
          </a>
        </div>
      </section>

      {/* AI Recommendations Section */}
      <section className="bg-gray-50 py-16 px-4 w-full">
        <div className="max-w-7xl mx-auto w-full text-center">
          <span className="text-xs font-bold tracking-widest text-red-600 uppercase">POWERED BY FASTAPI & MACHINE LEARNING</span>
          <h2 className="text-2xl sm:text-3xl font-black tracking-widest uppercase mt-1 mb-2 text-black">
            AI RECOMMENDATIONS (Local Engine)
          </h2>
          <div className="h-1 w-16 bg-red-600 mx-auto mb-10" />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {recommendations.length > 0 ? (
              recommendations.map((product) => (
                <div 
                  key={product.id} 
                  className="bg-white border border-gray-100 shadow-xs hover:shadow-md transition-all duration-300 group flex flex-col h-full"
                >
                  <a href={`/products/${product.category}`} className="block relative aspect-square bg-gray-50/50 overflow-hidden">
                    <img 
                      src={product.imgs[0] || '/shoes.png'} 
                      alt={product.name} 
                      className="w-full h-full object-contain p-6 group-hover:scale-105 transition-transform duration-500 ease-out"
                    />
                    {product.badge && (
                      <span className="absolute top-3 left-3 bg-black text-white text-[9px] font-extrabold tracking-widest px-2 py-1 uppercase">
                        {product.badge}
                      </span>
                    )}
                  </a>
                  <div className="p-5 flex flex-col flex-grow text-left">
                    <span className="text-gray-400 text-[10px] font-bold uppercase tracking-wider mb-1">
                      {product.category}
                    </span>
                    <h4 className="text-sm font-black text-black uppercase tracking-tight mb-2 line-clamp-2">
                      {product.name}
                    </h4>
                    <div className="mt-auto">
                      <div className="flex items-center gap-1 mb-2">
                        <span className="text-yellow-400 text-xs">{'★'.repeat(product.rating)}{'☆'.repeat(5 - product.rating)}</span>
                        <span className="text-[10px] font-mono text-gray-500">({product.reviews})</span>
                      </div>
                      <p className="text-sm font-black text-black">
                        ₹{product.price.toLocaleString('en-IN')}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full py-10 text-gray-500 font-bold">
                Loading recommendations...
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
