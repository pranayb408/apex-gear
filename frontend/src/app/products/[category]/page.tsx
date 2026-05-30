'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { products, Product } from '@/data/products';

interface CategoryPageProps {
  params: {
    category: string;
  };
}

function CategoryContent({ category }: { category: string }) {
  const searchParams = useSearchParams();
  const searchQuery = searchParams ? searchParams.get('search') : null;

  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [selectedSubcat, setSelectedSubcat] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('featured');
  const [toastMessage, setToastMessage] = useState<string>('');

  // Get all unique subcategories for the current category
  const categoryProducts = products.filter(p => p.category.toLowerCase() === category.toLowerCase());
  const subcategories = ['all', ...Array.from(new Set(categoryProducts.map(p => p.subCategory).filter(Boolean)))];

  useEffect(() => {
    let result = [...categoryProducts];

    // Filter by search query if present
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(p => p.name.toLowerCase().includes(q) || p.subCategory.toLowerCase().includes(q));
    }

    // Filter by subcategory
    if (selectedSubcat !== 'all') {
      result = result.filter(p => p.subCategory.toLowerCase() === selectedSubcat.toLowerCase());
    }

    // Sort products
    if (sortBy === 'price-asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      result.sort((a, b) => b.rating - a.rating);
    }

    setFilteredProducts(result);
  }, [category, selectedSubcat, sortBy, searchQuery]);

  const handleAddToCart = (product: Product) => {
    try {
      setToastMessage(`Adding ${product.name} to cart...`);
      
      const cartItems = JSON.parse(localStorage.getItem('ag_cart') || '[]');
      const existingItem = cartItems.find((item: any) => item.name === product.name);
      
      if (existingItem) {
        existingItem.qty += 1;
      } else {
        cartItems.push({
          name: product.name,
          price: `₹${product.price.toLocaleString('en-IN')}`,
          img: product.imgs && product.imgs[0] ? product.imgs[0] : '/shoes.png',
          qty: 1
        });
      }
      
      localStorage.setItem('ag_cart', JSON.stringify(cartItems));
      
      // Dispatch a custom event to notify the Header of cart updates immediately
      window.dispatchEvent(new Event('storage'));
      
      setToastMessage(`${product.name} added to cart!`);
      setTimeout(() => setToastMessage(''), 2500);
    } catch (err) {
      console.error('Error adding to cart:', err);
      setToastMessage('Error adding to cart');
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 font-sans">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-4 md:right-8 bg-black text-white px-6 py-3 text-xs font-bold tracking-widest uppercase z-50 shadow-2xl border-l-4 border-red-600 transition-all duration-300">
          {toastMessage}
        </div>
      )}

      {/* Category Header */}
      <div className="mb-8 border-b border-gray-100 pb-6 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <nav className="text-xs font-bold tracking-widest text-gray-400 mb-2 uppercase">
            <a href="/" className="hover:text-black transition-colors">HOME</a> / <span className="text-black">{category}</span>
          </nav>
          <h1 className="text-3xl md:text-5xl font-black tracking-wider uppercase text-black">
            {category} Collection
          </h1>
        </div>
        <div className="text-sm font-semibold text-gray-500">
          Showing {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''}
        </div>
      </div>

      {/* Filters and Sorting Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8 bg-gray-50 p-4 border border-gray-100">
        {/* Subcategory tabs */}
        <div className="flex flex-wrap gap-2">
          {subcategories.map((subcat) => (
            <button
              key={subcat}
              onClick={() => setSelectedSubcat(subcat)}
              className={`px-4 py-2 text-[10px] font-black tracking-widest uppercase border transition-all duration-200 ${
                selectedSubcat === subcat
                  ? 'bg-black text-white border-black'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-black hover:text-black'
              }`}
            >
              {subcat}
            </button>
          ))}
        </div>

        {/* Sort Select */}
        <div className="flex items-center gap-2">
          <label htmlFor="sort" className="text-[10px] font-black tracking-widest text-gray-400 uppercase">SORT BY:</label>
          <select
            id="sort"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-white border border-gray-200 text-xs font-bold py-2 px-4 uppercase tracking-wider outline-none cursor-pointer focus:border-black"
          >
            <option value="featured">FEATURED</option>
            <option value="price-asc">PRICE: LOW → HIGH</option>
            <option value="price-desc">PRICE: HIGH → LOW</option>
            <option value="rating">TOP RATED</option>
          </select>
        </div>
      </div>

      {/* Product Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <div 
              key={product.id} 
              className="bg-white border border-gray-100 flex flex-col h-full group hover:shadow-lg transition-all duration-300 relative"
            >
              {/* Image wrap */}
              <div className="aspect-square bg-gray-50/50 flex items-center justify-center p-6 relative overflow-hidden">
                <img
                  src={product.imgs[0] || '/shoes.png'}
                  alt={product.name}
                  className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-500 ease-out"
                />
                
                {/* Badges */}
                {product.badge && (
                  <span className={`absolute top-3 left-3 text-[9px] font-black tracking-widest px-2.5 py-1 text-white uppercase ${
                    product.badge.toLowerCase() === 'sale' ? 'bg-red-600' : 'bg-black'
                  }`}>
                    {product.badge}
                  </span>
                )}
              </div>

              {/* Info */}
              <div className="p-5 flex flex-col flex-grow text-left">
                <span className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-1.5">
                  {product.subCategory}
                </span>
                <h3 className="text-sm font-black text-black uppercase tracking-tight mb-2 line-clamp-2 min-h-[40px]">
                  {product.name}
                </h3>
                
                {/* Rating */}
                <div className="flex items-center gap-1.5 mb-3">
                  <span className="text-yellow-400 text-xs">{'★'.repeat(product.rating)}{'☆'.repeat(5 - product.rating)}</span>
                  <span className="text-[10px] font-mono font-bold text-gray-500">({product.reviews})</span>
                </div>

                {/* Price and CTA */}
                <div className="mt-auto">
                  <div className="flex items-baseline gap-2 mb-4">
                    <span className="text-sm font-black text-black">
                      ₹{product.price.toLocaleString('en-IN')}
                    </span>
                    {product.origPrice && product.origPrice > product.price && (
                      <span className="text-xs text-gray-400 line-through font-mono">
                        ₹{product.origPrice.toLocaleString('en-IN')}
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => handleAddToCart(product)}
                    className="w-full bg-black text-white hover:bg-red-600 text-xs font-black tracking-widest uppercase py-3 border border-black hover:border-red-600 transition-all duration-300 cursor-pointer text-center"
                  >
                    ADD TO CART
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-gray-50 border border-dashed border-gray-200">
          <p className="text-gray-500 font-bold text-sm tracking-wider uppercase">No products found in this category.</p>
        </div>
      )}
    </div>
  );
}

export default function CategoryPage({ params }: CategoryPageProps) {
  return (
    <Suspense fallback={<div className="text-center py-20 font-bold">Loading collection...</div>}>
      <CategoryContent category={params.category} />
    </Suspense>
  );
}
