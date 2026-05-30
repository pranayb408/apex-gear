'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface CartItem {
  name: string;
  price: string | number;
  img?: string;
  image?: string;
  qty: number;
}

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  const loadCart = () => {
    try {
      const localCart = localStorage.getItem('ag_cart');
      if (localCart) {
        setCartItems(JSON.parse(localCart));
      } else {
        setCartItems([]);
      }
    } catch (err) {
      console.error('Failed to load cart from localStorage:', err);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadCart();
    
    // Listen for storage events
    window.addEventListener('storage', loadCart);
    return () => window.removeEventListener('storage', loadCart);
  }, []);

  const saveCart = (items: CartItem[]) => {
    localStorage.setItem('ag_cart', JSON.stringify(items));
    setCartItems(items);
    // Dispatch a storage event so the Header is updated immediately
    window.dispatchEvent(new Event('storage'));
  };

  const updateQuantity = (name: string, delta: number) => {
    const updated = cartItems.map(item => {
      if (item.name === name) {
        const newQty = Math.max(1, (item.qty || 1) + delta);
        return { ...item, qty: newQty };
      }
      return item;
    });
    saveCart(updated);
  };

  const removeItem = (name: string) => {
    const updated = cartItems.filter(item => item.name !== name);
    saveCart(updated);
  };

  const parsePrice = (priceStr: string | number): number => {
    if (typeof priceStr === 'number') return priceStr;
    return parseInt(priceStr.replace(/[^\d]/g, ''), 10) || 0;
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((sum, item) => {
      const priceVal = parsePrice(item.price);
      const qty = item.qty || 1;
      return sum + (priceVal * qty);
    }, 0);
  };

  const subtotal = calculateSubtotal();

  if (loading) {
    return (
      <div className="text-center py-20 font-sans">
        <div className="w-10 h-10 border-4 border-gray-200 border-t-black rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-sm font-semibold text-gray-500">Loading your shopping cart...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-16 font-sans">
      <h1 className="text-3xl font-black tracking-widest uppercase mb-10 text-black">
        YOUR CART
      </h1>

      {cartItems.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 border border-dashed border-gray-200 rounded-lg">
          <p className="text-gray-500 font-bold text-sm tracking-wider uppercase mb-6">Your cart is empty.</p>
          <Link 
            href="/products/shoes" 
            className="inline-block bg-black text-white hover:bg-red-600 text-xs font-black tracking-widest uppercase px-8 py-4 transition-colors"
          >
            CONTINUE SHOPPING
          </Link>
        </div>
      ) : (
        <div className="space-y-8">
          <div className="border-t border-b border-gray-200 divide-y divide-gray-200">
            {cartItems.map((item, idx) => {
              const imageSrc = item.img || item.image || '/shoes.png';
              const quantity = item.qty || 1;
              const displayPrice = typeof item.price === 'number' ? `₹${item.price.toLocaleString('en-IN')}` : item.price;
              
              return (
                <div key={idx} className="py-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  {/* Product details */}
                  <div className="flex items-center gap-4">
                    <img 
                      src={imageSrc} 
                      alt={item.name} 
                      className="w-20 h-20 object-contain bg-gray-50 border border-gray-150 p-2 rounded-lg" 
                    />
                    <div>
                      <h3 className="text-sm font-black text-black uppercase tracking-tight">
                        {item.name}
                      </h3>
                      <p className="text-xs font-semibold text-gray-500 mt-1">
                        {displayPrice}
                      </p>
                    </div>
                  </div>

                  {/* Quantity and Actions */}
                  <div className="flex items-center gap-6 self-end sm:self-auto">
                    {/* Stepper */}
                    <div className="flex items-center border border-gray-200 bg-white">
                      <button 
                        onClick={() => updateQuantity(item.name, -1)} 
                        className="px-3 py-1.5 text-gray-500 hover:text-black hover:bg-gray-50 font-bold transition-colors cursor-pointer select-none"
                      >
                        -
                      </button>
                      <span className="px-3 text-xs font-mono font-black text-black">
                        {quantity}
                      </span>
                      <button 
                        onClick={() => updateQuantity(item.name, 1)} 
                        className="px-3 py-1.5 text-gray-500 hover:text-black hover:bg-gray-50 font-bold transition-colors cursor-pointer select-none"
                      >
                        +
                      </button>
                    </div>

                    {/* Remove */}
                    <button 
                      onClick={() => removeItem(item.name)} 
                      className="text-xs font-black tracking-widest text-red-600 hover:text-red-800 uppercase transition-colors cursor-pointer"
                    >
                      REMOVE
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Subtotal and checkout action */}
          <div className="flex flex-col items-end gap-4">
            <div className="text-right">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-1">Estimated Subtotal</span>
              <span className="text-2xl font-black text-black">
                ₹{subtotal.toLocaleString('en-IN')}
              </span>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <Link 
                href="/products/shoes" 
                className="inline-block text-center border-2 border-black text-black hover:bg-gray-50 text-xs font-black tracking-widest uppercase px-8 py-4 transition-all"
              >
                CONTINUE SHOPPING
              </Link>
              <Link 
                href="/checkout" 
                className="inline-block text-center bg-black text-white hover:bg-red-600 text-xs font-black tracking-widest uppercase px-8 py-4 transition-colors"
              >
                PROCEED TO CHECKOUT
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
