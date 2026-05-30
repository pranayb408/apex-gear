'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

type CheckoutStatus = 'idle' | 'processing' | 'success' | 'error';
type PaymentTab = 'card' | 'upi' | 'netbanking' | 'cod';

interface CartItem {
  id?: string;
  productId?: string;
  name: string;
  qty: number;
  price: number | string;
  img?: string;
}

interface Order {
  id: string;
  status: 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED';
  shippingAddress: string;
  orderItems: CartItem[];
  totalPrice: number;
  createdAt: string;
  userId?: string;
}

interface ShippingForm {
  fullName: string;
  email: string;
  address: string;
  city: string;
  zip: string;
  phone: string;
}

interface CardForm {
  number: string;
  name: string;
  expiry: string;
  cvv: string;
}

interface ValidationErrors {
  fullName?: string;
  email?: string;
  address?: string;
  city?: string;
  zip?: string;
  phone?: string;
  card_number?: string;
  card_name?: string;
  card_expiry?: string;
  card_cvv?: string;
  upi?: string;
  bank?: string;
}

export default function CheckoutPage() {
  const [status, setStatus] = useState<CheckoutStatus>('idle');
  const [progressMsg, setProgressMsg] = useState<string>('');
  const [transaction, setTransaction] = useState<string | null>(null);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loadingCart, setLoadingCart] = useState<boolean>(true);
  const [uid, setUid] = useState<string | null>(null);

  // Active Payment Tab: 'card' | 'upi' | 'netbanking' | 'cod'
  const [activeTab, setActiveTab] = useState<PaymentTab>('card');
  const [cardFlipped, setCardFlipped] = useState<boolean>(false);

  // Form States
  const [shippingForm, setShippingForm] = useState<ShippingForm>({
    fullName: '',
    email: '',
    address: '',
    city: '',
    zip: '',
    phone: ''
  });

  const [cardForm, setCardForm] = useState<CardForm>({
    number: '',
    name: '',
    expiry: '',
    cvv: ''
  });

  const [upiId, setUpiId] = useState<string>('');
  const [selectedBank, setSelectedBank] = useState<string>('');

  // Validation errors
  const [errors, setErrors] = useState<ValidationErrors>({});

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const urlUid = params.get('uid');
      const finalUid = urlUid || localStorage.getItem('ag_uid') || `guest_react_${Date.now()}`;
      localStorage.setItem('ag_uid', finalUid);
      setTimeout(() => setUid(finalUid), 0);

      // Load cart items from localStorage
      try {
        const localCartStr = localStorage.getItem('ag_cart');
        if (localCartStr) {
          setCartItems(JSON.parse(localCartStr));
        } else {
          setCartItems([]);
        }
      } catch (err) {
        console.error('Failed to load cart from localStorage:', err);
      }
      setLoadingCart(false);
    }
  }, []);

  // Pricing calculations
  const itemsPrice = cartItems.reduce((sum, item) => {
    const val = typeof item.price === 'number' ? item.price : parseInt((item.price || '0').replace(/[^\d]/g, ''));
    return sum + (val * item.qty);
  }, 0);
  const taxPrice = Math.round(itemsPrice * 0.18); // 18% GST
  const shippingPrice = itemsPrice > 5000 || itemsPrice === 0 ? 0 : 150;
  const totalPrice = itemsPrice + taxPrice + shippingPrice;

  // Handle Input Changes
  const handleShippingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setShippingForm(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof ValidationErrors]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleCardChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let { name, value } = e.target;
    
    // Formatting helpers
    if (name === 'number') {
      value = value.replace(/\D/g, '').substring(0, 16);
      value = value.replace(/(\d{4})(?=\d)/g, '$1 ');
    } else if (name === 'expiry') {
      value = value.replace(/\D/g, '').substring(0, 4);
      if (value.length > 2) {
        value = value.substring(0, 2) + '/' + value.substring(2);
      }
    } else if (name === 'cvv') {
      value = value.replace(/\D/g, '').substring(0, 3);
    }

    setCardForm(prev => ({ ...prev, [name]: value }));
    const errorKey = `card_${name}` as keyof ValidationErrors;
    if (errors[errorKey]) {
      setErrors(prev => ({ ...prev, [errorKey]: '' }));
    }
  };

  const handleCheckout = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (cartItems.length === 0) return;

    // Validate Form
    const newErrors: ValidationErrors = {};

    // Shipping Validation
    if (!shippingForm.fullName.trim()) newErrors.fullName = 'Full Name is required';
    if (!shippingForm.email.trim() || !/\S+@\S+\.\S+/.test(shippingForm.email)) newErrors.email = 'Valid Email is required';
    if (!shippingForm.address.trim()) newErrors.address = 'Shipping Address is required';
    if (!shippingForm.city.trim()) newErrors.city = 'City is required';
    if (!shippingForm.zip.trim() || shippingForm.zip.length < 5) newErrors.zip = 'Valid PIN/ZIP code required';
    if (!shippingForm.phone.trim() || shippingForm.phone.length < 10) newErrors.phone = 'Valid 10-digit Phone required';

    // Payment Validation
    if (activeTab === 'card') {
      if (cardForm.number.replace(/\s/g, '').length !== 16) newErrors.card_number = 'Valid 16-digit Card Number required';
      if (!cardForm.name.trim()) newErrors.card_name = 'Cardholder name required';
      if (cardForm.expiry.length !== 5) newErrors.card_expiry = 'Expiry MM/YY required';
      if (cardForm.cvv.length !== 3) newErrors.card_cvv = 'CVV required';
    } else if (activeTab === 'upi') {
      if (!upiId.trim() || !upiId.includes('@')) newErrors.upi = 'Valid UPI ID required (e.g. user@okhdfcbank)';
    } else if (activeTab === 'netbanking') {
      if (!selectedBank) newErrors.bank = 'Please select a bank';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      // Scroll to the first error
      const firstErrorKey = Object.keys(newErrors)[0];
      let fieldName = firstErrorKey;
      if (firstErrorKey.startsWith('card_')) {
        fieldName = firstErrorKey.replace('card_', '');
      }
      const el = document.getElementsByName(fieldName)[0];
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    setStatus('processing');
    
    // Premium transaction simulation stages
    const stages = [
      '🗺️ Verifying shipping address and details...',
      '🔒 Establishing secure payment tunnel...',
      '💳 Requesting authorization from payment gateway...',
      '⚡ Finalizing transaction and reserving inventory...'
    ];

    for (let i = 0; i < stages.length; i++) {
      setProgressMsg(stages[i]);
      await new Promise(resolve => setTimeout(resolve, 900));
    }

    try {
      const generatedTxnId = `TXN-${Math.floor(10000000 + Math.random() * 90000000)}`;
      const generatedOrderId = `AG-${Math.floor(10000 + Math.random() * 90000)}`;

      const newOrder: Order = {
        id: generatedOrderId,
        status: 'PENDING',
        shippingAddress: JSON.stringify({
          fullName: shippingForm.fullName,
          email: shippingForm.email,
          phone: shippingForm.phone,
          address: shippingForm.address,
          city: shippingForm.city,
          zip: shippingForm.zip
        }),
        orderItems: cartItems.map(item => ({
          name: item.name,
          qty: item.qty,
          price: typeof item.price === 'number' ? `₹${item.price.toLocaleString('en-IN')}` : item.price,
          img: item.img || '/shoes.png'
        })),
        totalPrice,
        createdAt: new Date().toISOString()
      };

      // Write to localStorage
      const existingOrders = JSON.parse(localStorage.getItem('apex_gear_orders') || '[]');
      existingOrders.unshift(newOrder);
      localStorage.setItem('apex_gear_orders', JSON.stringify(existingOrders));

      // Clear local cart
      localStorage.setItem('ag_cart', '[]');
      window.dispatchEvent(new Event('storage'));

      setStatus('success');
      setTransaction(generatedTxnId);
      setOrderId(generatedOrderId);

      // Simulate status transitions locally
      const updateOrderStatus = (oid: string, newStatus: 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED') => {
        try {
          const currentOrders = JSON.parse(localStorage.getItem('apex_gear_orders') || '[]');
          const updatedOrders = currentOrders.map((o: any) => {
            if (o.id === oid) {
              return { ...o, status: newStatus };
            }
            return o;
          });
          localStorage.setItem('apex_gear_orders', JSON.stringify(updatedOrders));
          window.dispatchEvent(new Event('storage'));
        } catch (e) {
          console.error('Error updating simulation status:', e);
        }
      };

      // Transition stages
      setTimeout(() => {
        updateOrderStatus(generatedOrderId, 'PROCESSING');
      }, 10000); // 10s to PROCESSING

      setTimeout(() => {
        updateOrderStatus(generatedOrderId, 'SHIPPED');
      }, 25000); // 25s to SHIPPED

      setTimeout(() => {
        updateOrderStatus(generatedOrderId, 'DELIVERED');
      }, 40000); // 40s to DELIVERED

    } catch (err) {
      console.error('Checkout error:', err);
      setStatus('error');
    }
  };

  return (
    <div className="bg-[#fcfcfc] min-h-screen py-16">
      <div className="max-w-[1200px] mx-auto px-5">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 border-b border-gray-200/60 pb-5 gap-4">
          <div>
            <h1 className="font-sans font-black tracking-tight text-3xl m-0 uppercase">SECURE CHECKOUT</h1>
            <p className="text-gray-500 mt-1 text-sm m-0">Complete your transaction safely via bank-grade encryption.</p>
          </div>
          <Link href="/products/shoes" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-black border-[1.5px] border-black px-5 py-2.5 rounded-lg transition-all duration-200 hover:bg-black hover:text-white">
            ← Back to Store
          </Link>
        </div>

        {status === 'processing' && (
          <div className="flex flex-col items-center justify-center p-10 md:p-20 bg-white border border-gray-100 rounded-2xl shadow-sm max-w-[600px] mx-auto my-10 text-center">
            <div className="w-12 h-12 border-4 border-black border-t-transparent rounded-full animate-spin mb-6"></div>
            <h3 className="text-xl font-extrabold mb-3 text-gray-900">Processing Payment</h3>
            <p className="text-gray-500 text-[15px] font-medium animate-pulse m-0">{progressMsg}</p>
          </div>
        )}

        {status === 'success' && (
          <div className="flex flex-col items-center p-8 bg-white border border-gray-100 rounded-2xl shadow-sm max-w-[600px] mx-auto my-10 text-center">
            <div className="w-16 h-16 bg-green-50 text-green-600 rounded-full flex items-center justify-center text-3xl font-black mb-5 animate-bounce">✓</div>
            <h2 className="text-2xl font-black text-green-800 mb-2">Payment Successful!</h2>
            <p className="text-gray-500 text-[15px] mb-8">Your order has been recorded and is being prepared for dispatch.</p>
            
            <div className="w-full border border-dashed border-gray-300 rounded-xl p-5 bg-gray-50 text-left mb-8">
              <h4 className="m-0 mb-4 text-[13px] font-extrabold uppercase tracking-wider text-gray-800">Order Receipt</h4>
              <div className="flex justify-between mb-2 text-sm">
                <span className="text-gray-500">Transaction ID:</span>
                <span className="font-mono font-bold text-gray-900">{transaction}</span>
              </div>
              <div className="flex justify-between mb-2 text-sm">
                <span className="text-gray-500">Order ID:</span>
                <span className="font-bold text-gray-900">{orderId}</span>
              </div>
              <div className="flex justify-between mb-2 text-sm">
                <span className="text-gray-500">Payment Method:</span>
                <span className="font-bold text-gray-900 uppercase">{activeTab}</span>
              </div>
              <div className="flex justify-between border-t border-gray-200 pt-3 mt-3 text-[15px] font-extrabold text-gray-900">
                <span>Amount Paid:</span>
                <span>₹{totalPrice.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <div className="flex flex-col gap-3 w-full">
              <button onClick={() => window.location.href = '/dashboard'} className="py-3.5 px-5 bg-black hover:bg-gray-800 text-white font-bold text-[15px] cursor-pointer rounded-lg w-full transition-colors duration-200">
                Track Order on Customer Dashboard
              </button>
              <button onClick={() => window.location.href = '/products/shoes'} className="py-3.5 px-5 bg-transparent hover:bg-gray-50 text-black border-2 border-black font-bold text-[15px] cursor-pointer rounded-lg w-full transition-all duration-200">
                Continue Shopping
              </button>
            </div>
          </div>
        )}

        {status === 'error' && (
          <div className="flex flex-col items-center p-8 bg-white border border-gray-100 rounded-2xl shadow-sm max-w-[600px] mx-auto my-10 text-center">
            <div className="w-20 h-20 rounded-full bg-red-50 text-red-600 flex items-center justify-center text-4xl mb-5">×</div>
            <h2 className="text-2xl font-black text-red-700 mb-2">Payment Failed</h2>
            <p className="text-gray-500 text-[15px] mb-8">The server was unable to process this transaction. Please ensure the backend server is running.</p>
            <button onClick={() => setStatus('idle')} className="py-3.5 px-7 bg-black hover:bg-gray-800 text-white font-bold text-[15px] cursor-pointer rounded-lg w-full transition-colors duration-200">
              Try Again
            </button>
          </div>
        )}

        {status === 'idle' && (
          <form onSubmit={handleCheckout} className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {/* Left Column: Form Details */}
            <div className="lg:col-span-2 flex flex-col gap-8">
              
              {/* Shipping Card */}
              <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                <h3 className="text-lg font-extrabold text-gray-900 border-b border-gray-100 pb-3 mb-6 tracking-tight uppercase">1. Shipping Details</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="flex flex-col gap-1.5 md:col-span-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-700">Full Name</label>
                    <input 
                      type="text" 
                      name="fullName"
                      value={shippingForm.fullName}
                      onChange={handleShippingChange}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-black focus:border-black outline-none transition-all" 
                      placeholder="e.g. John Doe"
                    />
                    {errors.fullName && <p className="text-red-700 text-xs mt-1 font-semibold">{errors.fullName}</p>}
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-700">Email Address</label>
                    <input 
                      type="email" 
                      name="email"
                      value={shippingForm.email}
                      onChange={handleShippingChange}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-black focus:border-black outline-none transition-all" 
                      placeholder="e.g. john@example.com"
                    />
                    {errors.email && <p className="text-red-700 text-xs mt-1 font-semibold">{errors.email}</p>}
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-700">Phone Number</label>
                    <input 
                      type="text" 
                      name="phone"
                      value={shippingForm.phone}
                      onChange={handleShippingChange}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-black focus:border-black outline-none transition-all" 
                      placeholder="e.g. 9876543210"
                    />
                    {errors.phone && <p className="text-red-700 text-xs mt-1 font-semibold">{errors.phone}</p>}
                  </div>

                  <div className="flex flex-col gap-1.5 md:col-span-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-700">Shipping Address</label>
                    <input 
                      type="text" 
                      name="address"
                      value={shippingForm.address}
                      onChange={handleShippingChange}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-black focus:border-black outline-none transition-all" 
                      placeholder="Street address, apartment, suite"
                    />
                    {errors.address && <p className="text-red-700 text-xs mt-1 font-semibold">{errors.address}</p>}
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-700">City</label>
                    <input 
                      type="text" 
                      name="city"
                      value={shippingForm.city}
                      onChange={handleShippingChange}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-black focus:border-black outline-none transition-all" 
                      placeholder="e.g. Bangalore"
                    />
                    {errors.city && <p className="text-red-700 text-xs mt-1 font-semibold">{errors.city}</p>}
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-700">ZIP / PIN Code</label>
                    <input 
                      type="text" 
                      name="zip"
                      value={shippingForm.zip}
                      onChange={handleShippingChange}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-black focus:border-black outline-none transition-all" 
                      placeholder="e.g. 560001"
                    />
                    {errors.zip && <p className="text-red-700 text-xs mt-1 font-semibold">{errors.zip}</p>}
                  </div>
                </div>
              </div>

              {/* Payment Options Card */}
              <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                <h3 className="text-lg font-extrabold text-gray-900 border-b border-gray-100 pb-3 mb-6 tracking-tight uppercase">2. Payment Method</h3>
                
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                  <button 
                    type="button"
                    className={`flex flex-col items-center justify-center p-4 border rounded-xl cursor-pointer transition-all duration-200 gap-2 text-sm font-semibold select-none ${
                      activeTab === 'card' 
                        ? 'border-black bg-black text-white shadow-sm' 
                        : 'border-gray-200 bg-gray-50 text-gray-600 hover:bg-gray-100 hover:border-gray-300'
                    }`}
                    onClick={() => setActiveTab('card')}
                  >
                    <span className="text-xl">💳</span>
                    <span>Card</span>
                  </button>
                  <button 
                    type="button"
                    className={`flex flex-col items-center justify-center p-4 border rounded-xl cursor-pointer transition-all duration-200 gap-2 text-sm font-semibold select-none ${
                      activeTab === 'upi' 
                        ? 'border-black bg-black text-white shadow-sm' 
                        : 'border-gray-200 bg-gray-50 text-gray-600 hover:bg-gray-100 hover:border-gray-300'
                    }`}
                    onClick={() => setActiveTab('upi')}
                  >
                    <span className="text-xl">📱</span>
                    <span>UPI</span>
                  </button>
                  <button 
                    type="button"
                    className={`flex flex-col items-center justify-center p-4 border rounded-xl cursor-pointer transition-all duration-200 gap-2 text-sm font-semibold select-none ${
                      activeTab === 'netbanking' 
                        ? 'border-black bg-black text-white shadow-sm' 
                        : 'border-gray-200 bg-gray-50 text-gray-600 hover:bg-gray-100 hover:border-gray-300'
                    }`}
                    onClick={() => setActiveTab('netbanking')}
                  >
                    <span className="text-xl">🏛️</span>
                    <span>Net Banking</span>
                  </button>
                  <button 
                    type="button"
                    className={`flex flex-col items-center justify-center p-4 border rounded-xl cursor-pointer transition-all duration-200 gap-2 text-sm font-semibold select-none ${
                      activeTab === 'cod' 
                        ? 'border-black bg-black text-white shadow-sm' 
                        : 'border-gray-200 bg-gray-50 text-gray-600 hover:bg-gray-100 hover:border-gray-300'
                    }`}
                    onClick={() => setActiveTab('cod')}
                  >
                    <span className="text-xl">💵</span>
                    <span>COD</span>
                  </button>
                </div>

                {/* Credit Card Flow */}
                {activeTab === 'card' && (
                  <div>
                    {/* Interactive Live Credit Card Mockup */}
                    <div className="w-full max-w-sm mx-auto mb-8 [perspective:1000px] h-48">
                      <div className={`relative w-full h-full transition-transform duration-700 [transform-style:preserve-3d] ${cardFlipped ? '[transform:rotateY(180deg)]' : ''}`}>
                        {/* Front of Card */}
                        <div className="absolute inset-0 w-full h-full rounded-2xl p-6 bg-gradient-to-br from-zinc-800 via-zinc-900 to-black text-white [backface-visibility:hidden] flex flex-col justify-between shadow-lg">
                          <div className="flex justify-between items-center">
                            {/* Card Chip */}
                            <div className="w-10 h-8 bg-gradient-to-r from-amber-300 to-yellow-500 rounded-md shadow-inner"></div>
                            <div className="font-black text-sm italic opacity-80 tracking-wider">PREMIUM PAY</div>
                          </div>
                          <div className="text-xl font-mono tracking-widest text-center my-4 font-bold">
                            {cardForm.number || '•••• •••• •••• ••••'}
                          </div>
                          <div className="flex justify-between items-end text-xs">
                            <div className="min-w-0 flex-1 pr-4">
                              <div className="text-[10px] text-zinc-400 uppercase tracking-wider mb-0.5">Card Holder</div>
                              <div className="font-bold truncate uppercase">{cardForm.name || 'YOUR NAME'}</div>
                            </div>
                            <div className="text-right shrink-0">
                              <div className="text-[10px] text-zinc-400 uppercase tracking-wider mb-0.5">Expires</div>
                              <div className="font-bold">{cardForm.expiry || 'MM/YY'}</div>
                            </div>
                          </div>
                        </div>

                        {/* Back of Card */}
                        <div className="absolute inset-0 w-full h-full rounded-2xl bg-gradient-to-br from-zinc-900 via-zinc-800 to-black text-white [backface-visibility:hidden] [transform:rotateY(180deg)] flex flex-col justify-between shadow-lg py-6">
                          <div className="w-full h-10 bg-zinc-950 my-1"></div>
                          <div className="mx-6 h-9 bg-zinc-200 rounded flex justify-end items-center px-4 text-black font-mono font-bold text-sm">
                            <span className="font-sans text-[9px] mr-3 text-zinc-500 tracking-wider">SECURE KEY</span>
                            {cardForm.cvv || '•••'}
                          </div>
                          <div className="px-6 text-[8px] opacity-40 leading-relaxed text-center">
                            This simulation utilizes standard mock validations. Do not enter actual credentials here.
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Inputs */}
                    <div className="flex flex-col gap-4 mt-6">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold uppercase tracking-wider text-gray-700">Card Number</label>
                        <input 
                          type="text" 
                          name="number"
                          value={cardForm.number}
                          onChange={handleCardChange}
                          onFocus={() => setCardFlipped(false)}
                          className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-black focus:border-black outline-none transition-all"
                          placeholder="4111 2222 3333 4444"
                        />
                        {errors.card_number && <p className="text-red-700 text-xs mt-1 font-semibold">{errors.card_number}</p>}
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold uppercase tracking-wider text-gray-700">Cardholder Name</label>
                        <input 
                          type="text" 
                          name="name"
                          value={cardForm.name}
                          onChange={handleCardChange}
                          onFocus={() => setCardFlipped(false)}
                          className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-black focus:border-black outline-none transition-all"
                          placeholder="e.g. JOHN DOE"
                        />
                        {errors.card_name && <p className="text-red-700 text-xs mt-1 font-semibold">{errors.card_name}</p>}
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1.5">
                          <label className="text-xs font-bold uppercase tracking-wider text-gray-700">Expiration Date</label>
                          <input 
                            type="text" 
                            name="expiry"
                            value={cardForm.expiry}
                            onChange={handleCardChange}
                            onFocus={() => setCardFlipped(false)}
                            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-black focus:border-black outline-none transition-all"
                            placeholder="MM/YY"
                          />
                          {errors.card_expiry && <p className="text-red-700 text-xs mt-1 font-semibold">{errors.card_expiry}</p>}
                        </div>

                        <div className="flex flex-col gap-1.5">
                          <label className="text-xs font-bold uppercase tracking-wider text-gray-700">CVV / CVN</label>
                          <input 
                            type="password" 
                            name="cvv"
                            value={cardForm.cvv}
                            onChange={handleCardChange}
                            onFocus={() => setCardFlipped(true)}
                            onBlur={() => setCardFlipped(false)}
                            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-black focus:border-black outline-none transition-all"
                            placeholder="•••"
                          />
                          {errors.card_cvv && <p className="text-red-700 text-xs mt-1 font-semibold">{errors.card_cvv}</p>}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* UPI Flow */}
                {activeTab === 'upi' && (
                  <div className="flex flex-col gap-5 items-center">
                    <div className="border border-gray-200 p-4 rounded-2xl bg-white text-center w-full max-w-[240px] shadow-sm">
                      <div className="w-full aspect-square bg-gray-50 flex items-center justify-center rounded-xl border border-dashed border-gray-300 mb-3 text-sm text-gray-500 font-bold">
                        [ MOCK QR CODE ]
                      </div>
                      <p className="text-[11px] text-gray-400 m-0 leading-relaxed">Scan using BHIM, Paytm, GPay or PhonePe to check out.</p>
                    </div>

                    <div className="flex flex-col gap-1.5 w-full">
                      <label className="text-xs font-bold uppercase tracking-wider text-gray-700">UPI Virtual Payment Address (VPA)</label>
                      <input 
                        type="text" 
                        name="upi"
                        value={upiId}
                        onChange={(e) => { setUpiId(e.target.value); setErrors({ ...errors, upi: '' }); }}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-black focus:border-black outline-none transition-all"
                        placeholder="username@okhdfcbank"
                      />
                      {errors.upi && <p className="text-red-700 text-xs mt-1 font-semibold">{errors.upi}</p>}
                    </div>
                  </div>
                )}

                {/* Net Banking Flow */}
                {activeTab === 'netbanking' && (
                  <div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold uppercase tracking-wider text-gray-700">Select Bank</label>
                      <select 
                        name="bank"
                        value={selectedBank}
                        onChange={(e) => { setSelectedBank(e.target.value); setErrors({ ...errors, bank: '' }); }}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-black focus:border-black outline-none transition-all cursor-pointer bg-white"
                      >
                        <option value="">-- Choose your Bank --</option>
                        <option value="sbi">State Bank of India</option>
                        <option value="hdfc">HDFC Bank</option>
                        <option value="icici">ICICI Bank</option>
                        <option value="axis">Axis Bank</option>
                        <option value="kotak">Kotak Mahindra Bank</option>
                      </select>
                      {errors.bank && <p className="text-red-700 text-xs mt-1 font-semibold">{errors.bank}</p>}
                    </div>
                    <p className="text-xs text-gray-500 mt-2">We will redirect you securely to your selected bank for verification after validation.</p>
                  </div>
                )}

                {/* Cash on Delivery Flow */}
                {activeTab === 'cod' && (
                  <div className="bg-yellow-50/50 border border-yellow-200 rounded-xl p-4 text-yellow-800">
                    <h4 className="m-0 mb-2 text-sm font-bold flex items-center gap-1">ℹ️ Cash on Delivery Selected</h4>
                    <p className="text-xs m-0 leading-relaxed">An additional verification call may be made to confirm the order before delivery. Please ensure your phone number is correct.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: Glassmorphic Order Summary */}
            <div className="lg:col-span-1 lg:sticky lg:top-10 h-fit">
              <div className="bg-white/80 backdrop-blur-md border border-gray-150 rounded-2xl p-6 shadow-md flex flex-col gap-5">
                <h3 className="m-0 font-black text-xl tracking-tight border-b-2 border-black pb-3 text-gray-900">Order Summary</h3>
                
                {loadingCart ? (
                  <p className="text-gray-500 m-0">Loading order details...</p>
                ) : cartItems.length === 0 ? (
                  <p className="text-gray-500 m-0">Your cart is empty.</p>
                ) : (
                  <>
                    {/* Item list */}
                    <div className="flex flex-col gap-4 max-h-[250px] overflow-y-auto pr-1">
                      {cartItems.map((item, idx) => (
                        <div key={idx} className="flex gap-4 items-center">
                          <img 
                            src={item.img || '/shoes.png'} 
                            alt={item.name} 
                            className="w-12 h-12 rounded-lg object-contain bg-gray-50 border border-gray-100 flex-shrink-0" 
                          />
                          <div className="flex-1 min-w-0">
                            <h4 className="text-xs font-bold truncate m-0 text-gray-900">{item.name}</h4>
                            <p className="text-[11px] text-gray-500 mt-1 m-0">Qty: {item.qty}</p>
                          </div>
                          <span className="font-bold text-xs text-gray-900 shrink-0">
                            {typeof item.price === 'number' ? `₹${item.price.toLocaleString('en-IN')}` : item.price}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Pricing details */}
                    <div className="flex flex-col gap-2.5 border-t border-gray-100 pt-4 text-sm">
                      <div className="flex justify-between text-gray-500">
                        <span>Items Subtotal:</span>
                        <span>₹{itemsPrice.toLocaleString('en-IN')}</span>
                      </div>
                      
                      <div className="flex justify-between text-gray-500">
                        <span>GST (18%):</span>
                        <span>₹{taxPrice.toLocaleString('en-IN')}</span>
                      </div>

                      <div className="flex justify-between text-gray-500">
                        <span>Shipping:</span>
                        <span>{shippingPrice === 0 ? <strong className="text-green-700 font-bold">FREE</strong> : `₹${shippingPrice}`}</span>
                      </div>

                      <div className="flex justify-between border-t-2 border-black pt-4 mt-1.5 text-lg font-black text-gray-900">
                        <span>Grand Total:</span>
                        <span>₹{totalPrice.toLocaleString('en-IN')}</span>
                      </div>
                    </div>

                    <button 
                      type="submit"
                      disabled={cartItems.length === 0 || loadingCart}
                      className="mt-2.5 w-full py-4 bg-black hover:bg-gray-800 text-white font-bold text-[15px] rounded-lg tracking-wide shadow-md transition-colors duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed uppercase"
                    >
                      PAY SECURELY NOW (₹{totalPrice.toLocaleString('en-IN')})
                    </button>
                  </>
                )}
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
