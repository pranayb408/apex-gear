'use client';

import React, { useState, useEffect } from 'react';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const fetchCart = () => {
      try {
        const localCartStr = localStorage.getItem('ag_cart');
        if (localCartStr) {
          const items = JSON.parse(localCartStr) || [];
          const count = items.reduce((sum: number, item: any) => sum + (item.qty || 0), 0);
          setCartCount(count);
        } else {
          setCartCount(0);
        }
      } catch (err) {
        console.error('Error loading cart in Header:', err);
      }
    };

    fetchCart();
    
    // Sync immediately on localStorage updates
    window.addEventListener('storage', fetchCart);
    const interval = setInterval(fetchCart, 3000);
    
    return () => {
      window.removeEventListener('storage', fetchCart);
      clearInterval(interval);
    };
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/products/shoes?search=${encodeURIComponent(searchQuery.trim())}`;
    }
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm transition-all duration-300">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Mobile: Hamburger Button */}
            <div className="flex md:hidden">
              <button
                type="button"
                onClick={() => setMenuOpen(true)}
                className="inline-flex items-center justify-center rounded-md p-2 text-black hover:bg-gray-100 transition-colors focus:outline-none"
              >
                <span className="sr-only">Open main menu</span>
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>
              </button>
            </div>

            {/* Logo */}
            <div className="flex-1 flex justify-center md:justify-start">
              <a href="/" className="flex items-center gap-2">
                <span className="text-red-600 font-extrabold text-lg">▲</span>
                <span className="text-xl font-black tracking-wider text-black font-sans">APEX GEAR</span>
              </a>
            </div>

            {/* Desktop Nav Navigation */}
            <nav className="hidden md:flex space-x-8 text-sm font-bold tracking-widest text-black">
              <a href="/shoes.html" className="relative py-2 text-black hover:text-red-600 transition-colors uppercase after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:scale-x-0 hover:after:scale-x-100 after:bg-black after:transition-transform after:duration-200">
                SHOES
              </a>
              <a href="/watch.html" className="relative py-2 text-black hover:text-red-600 transition-colors uppercase after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:scale-x-0 hover:after:scale-x-100 after:bg-black after:transition-transform after:duration-200">
                WATCHES
              </a>
              <a href="/cloth.html" className="relative py-2 text-black hover:text-red-600 transition-colors uppercase after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:scale-x-0 hover:after:scale-x-100 after:bg-black after:transition-transform after:duration-200">
                CLOTHING
              </a>
            </nav>

            {/* Icons Action Area */}
            <div className="flex-1 flex items-center justify-end gap-2 sm:gap-4">
              {/* Search Toggle Icon */}
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-2 text-black hover:bg-gray-100 rounded-full transition-colors focus:outline-none"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.602 10.602Z" />
                </svg>
              </button>

              {/* Cart Icon Link */}
              <a
                href="/cart"
                className="relative p-2 text-black hover:bg-gray-100 rounded-full transition-colors focus:outline-none"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
                </svg>
                {cartCount > 0 && (
                  <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-black leading-none text-white bg-red-600 rounded-full">
                    {cartCount}
                  </span>
                )}
              </a>
            </div>
          </div>
        </div>

        {/* Slide-down Search Panel */}
        {searchOpen && (
          <div className="absolute top-full left-0 right-0 bg-white border-b border-gray-200 py-4 px-4 sm:px-6 shadow-md z-40 animate-slide-down">
            <form onSubmit={handleSearchSubmit} className="max-w-7xl mx-auto flex items-center justify-between gap-4">
              <input
                type="text"
                placeholder="SEARCH APEX GEAR..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent border-b-2 border-black py-2 text-lg font-black tracking-widest outline-none uppercase placeholder-gray-400 text-black"
                autoFocus
              />
              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                className="text-gray-500 hover:text-black transition-colors p-2"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </button>
            </form>
          </div>
        )}
      </header>

      {/* Mobile Drawer Overlay */}
      {menuOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-50 backdrop-blur-xs transition-opacity duration-300"
          onClick={() => setMenuOpen(false)}
        />
      )}

      {/* Mobile Drawer Panel */}
      <div
        className={`fixed top-0 left-0 bottom-0 w-80 bg-white z-55 shadow-2xl transition-transform duration-300 ease-in-out transform ${
          menuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <span className="text-xl font-black tracking-wider text-black font-sans">APEX GEAR</span>
          <button onClick={() => setMenuOpen(false)} className="text-gray-500 hover:text-black p-2">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <nav className="flex flex-col p-6 space-y-4">
          <a
            href="/shoes.html"
            className="text-lg font-bold tracking-widest text-black hover:text-red-600 transition-colors uppercase py-2 border-b border-gray-100"
            onClick={() => setMenuOpen(false)}
          >
            SHOES
          </a>
          <a
            href="/watch.html"
            className="text-lg font-bold tracking-widest text-black hover:text-red-600 transition-colors uppercase py-2 border-b border-gray-100"
            onClick={() => setMenuOpen(false)}
          >
            WATCHES
          </a>
          <a
            href="/cloth.html"
            className="text-lg font-bold tracking-widest text-black hover:text-red-600 transition-colors uppercase py-2 border-b border-gray-100"
            onClick={() => setMenuOpen(false)}
          >
            CLOTHING
          </a>
        </nav>
      </div>
    </>
  );
}
