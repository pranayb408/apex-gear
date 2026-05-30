'use client';

import { useState, useEffect, useRef } from 'react';

interface OrderItem {
  name: string;
  qty: number;
  price: number | string;
  image?: string;
  img?: string;
}

interface Order {
  id: string | number;
  status: 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED';
  createdAt: string;
  shippingAddress: string;
  orderItems: OrderItem[];
  totalPrice: number;
  userId?: string;
}

interface ParsedAddress {
  fullName?: string;
  address?: string;
  city?: string;
  zip?: string;
  phone?: string;
  raw?: string;
}

export default function UserDashboard() {
  const [activeTab, setActiveTab] = useState<string>('orders');
  const [uid, setUid] = useState<string | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [toast, setToast] = useState<string | null>(null);
  
  // Keep track of order statuses in a ref to detect updates for notifications
  const prevStatusesRef = useRef<Record<string | number, string>>({});

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedUid = localStorage.getItem('ag_uid');
      setUid(storedUid);
    }
  }, []);

  // Poll orders every 3 seconds to catch status transitions in real-time from localStorage
  useEffect(() => {
    const fetchOrders = () => {
      try {
        const localOrdersStr = localStorage.getItem('apex_gear_orders');
        if (localOrdersStr) {
          const allOrders: Order[] = JSON.parse(localOrdersStr);
          
          // Filter by userId if present, otherwise fallback to show all since localStorage is local to browser
          const userOrders = allOrders.filter(o => !o.userId || o.userId === uid);
          
          // Check for status changes to show a notification toast
          userOrders.forEach(order => {
            const oldStatus = prevStatusesRef.current[order.id];
            if (oldStatus && oldStatus !== order.status) {
              // Trigger notification
              if (order.status === 'SHIPPED') {
                showNotification(`🚚 Order #${order.id} has been SHIPPED! Out for delivery soon.`);
              } else if (order.status === 'PROCESSING') {
                showNotification(`⚙️ Order #${order.id} is now being processed.`);
              } else if (order.status === 'DELIVERED') {
                showNotification(`🎉 Order #${order.id} has been DELIVERED! Thank you for shopping.`);
              }
            }
            // Update ref
            prevStatusesRef.current[order.id] = order.status;
          });

          setOrders(userOrders);
        } else {
          setOrders([]);
        }
      } catch (err) {
        console.error('Error fetching user orders from localStorage:', err);
      }
      setLoading(false);
    };

    fetchOrders();
    const interval = setInterval(fetchOrders, 3000);
    
    // Also listen for immediate storage events
    window.addEventListener('storage', fetchOrders);
    return () => {
      clearInterval(interval);
      window.removeEventListener('storage', fetchOrders);
    };
  }, [uid]);

  const showNotification = (message: string) => {
    setToast(message);
    setTimeout(() => setToast(null), 5000);
  };

  // Helper to determine step active state
  const getStepClass = (status: string, stepName: string): boolean => {
    const sequence = ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED'];
    const currentIdx = sequence.indexOf(status);
    const targetIdx = sequence.indexOf(stepName);
    return currentIdx >= targetIdx;
  };

  return (
    <div className="min-h-screen bg-[#fafafa] text-black font-sans">
      
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-5 right-5 bg-black text-white px-6 py-4 rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.15)] z-[9999] flex items-center gap-3 animate-slide-in font-semibold text-sm border border-white/10">
          <span>{toast}</span>
          <button 
            onClick={() => setToast(null)} 
            className="bg-transparent border-0 text-[#aaa] cursor-pointer text-base font-bold hover:text-white transition-colors"
          >
            ×
          </button>
        </div>
      )}

      {/* Header */}
      <header className="bg-white border-b border-[#eee] py-5 px-10 flex justify-between items-center">
        <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => window.location.href = '/'}>
          <span className="text-xl font-black">▲ APEX GEAR</span>
        </div>
        <button 
          onClick={() => {
            if (window.history.length > 1) {
              window.history.back();
            } else {
              window.location.href = '/';
            }
          }}
          className="bg-transparent border-1.5 border-black px-4 py-2 text-[13px] font-bold rounded-md cursor-pointer transition-colors hover:bg-black hover:text-white flex items-center gap-1.5"
        >
          ← Return to Store
        </button>
      </header>

      <div className="py-15 px-10 max-w-[1100px] mx-auto flex gap-[50px] flex-col md:flex-row">
        
        {/* Sidebar */}
        <div className="w-full md:w-[220px] shrink-0">
          <h2 className="text-sm font-black tracking-[0.1em] text-[#888] mb-6 uppercase">User Portal</h2>
          <ul className="list-none p-0 m-0 space-y-2">
            {[
              { id: 'orders', label: 'Order History', icon: '📦' },
              { id: 'profile', label: 'Profile Details', icon: '👤' },
              { id: 'addresses', label: 'My Addresses', icon: '📍' },
              { id: 'settings', label: 'Preferences', icon: '⚙️' }
            ].map(tab => (
              <li key={tab.id} className="mb-2">
                <button 
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-2.5 px-4 py-3 rounded-lg text-[15px] text-left cursor-pointer transition-all border-none ${
                    activeTab === tab.id 
                      ? 'bg-black/5 font-bold text-black' 
                      : 'bg-transparent font-medium text-[#555] hover:bg-black/2'
                  }`}
                >
                  <span>{tab.icon}</span>
                  {tab.label}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Main Content Area */}
        <div className="grow bg-white border border-[#eaeaea] rounded-2xl p-6 md:p-10 shadow-[0_4px_20px_rgba(0,0,0,0.01)]">
          
          {activeTab === 'orders' && (
            <div>
              <div className="flex justify-between items-center mb-7.5 border-b border-[#eee] pb-5">
                <h3 className="text-2xl font-black m-0">Order History</h3>
                <span className="text-sm text-[#666] bg-[#f5f5f5] px-3 py-1.5 rounded-full font-semibold">
                  {orders.length} {orders.length === 1 ? 'Order' : 'Orders'}
                </span>
              </div>
              
              {loading ? (
                <div className="text-center py-10">
                  <div className="border-3 border-[#f3f3f3] border-t-black rounded-full w-[30px] h-[30px] animate-spin mx-auto mb-4"></div>
                  <p className="text-[#666] text-[15px]">Retrieving your order records...</p>
                </div>
              ) : orders.length === 0 ? (
                <div className="text-center py-15 px-5 border-2 border-dashed border-[#eee] rounded-xl">
                  <p className="text-lg font-bold m-0 mb-2">No Orders Found</p>
                  <p className="text-[#777] text-sm mb-6">Once you purchase sneakers, clothing, or specs, your tracking and history will appear here.</p>
                  <button onClick={() => window.location.href = '/products/shoes'} className="px-6 py-3 bg-black text-white border-none font-bold rounded-md cursor-pointer hover:bg-black/90 transition-colors">Start Shopping</button>
                </div>
              ) : (
                orders.map(order => {
                  let parsedAddress: ParsedAddress = {};
                  try {
                    parsedAddress = order.shippingAddress ? JSON.parse(order.shippingAddress) : {};
                  } catch (e) {
                    parsedAddress = { raw: order.shippingAddress };
                  }

                  return (
                    <div key={order.id} className="border border-[#eee] p-5 md:p-7.5 rounded-2xl mb-6 relative">
                      
                      {/* Order Header */}
                      <div className="flex justify-between items-start mb-5 gap-5 flex-wrap">
                        <div>
                          <span className="font-black text-lg block mb-1">Order #{order.id}</span>
                          <span className="text-[#888] text-[13px]">
                            Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <div className="flex flex-col items-end">
                          <span className={`px-4 py-1.5 text-xs font-extrabold rounded-full uppercase tracking-wider ${
                            order.status === 'DELIVERED' 
                              ? 'bg-[#e8f5e9] text-[#2e7d32]' 
                              : order.status === 'SHIPPED' 
                              ? 'bg-[#e3f2fd] text-[#0d47a1]' 
                              : order.status === 'PROCESSING' 
                              ? 'bg-[#fff3e0] text-[#e65100]' 
                              : 'bg-[#f5f5f5] text-[#555]'
                          }`}>
                            {order.status}
                          </span>
                        </div>
                      </div>

                      {/* Interactive Tracking Stepper */}
                      <div className="my-9 relative">
                        <div className="flex justify-between relative z-2">
                          {[
                            { name: 'PENDING', label: 'Order Placed', desc: 'Awaiting dispatch', icon: '📝' },
                            { name: 'PROCESSING', label: 'Processing', desc: 'Packing & sorting', icon: '⚙️' },
                            { name: 'SHIPPED', label: 'Shipped', desc: 'Outbound transit', icon: '🚚' },
                            { name: 'DELIVERED', label: 'Delivered', desc: 'Successfully signed', icon: '📦' }
                          ].map((step, idx) => {
                            const isActive = getStepClass(order.status, step.name);
                            return (
                              <div key={idx} className="flex flex-col items-center text-center w-1/5">
                                <div className={`w-9 h-9 rounded-full flex items-center justify-center text-[15px] mb-2 transition-all duration-300 ${
                                  isActive 
                                    ? 'bg-black border-2 border-black text-white shadow-md' 
                                    : 'bg-white border-2.5 border-[#eaeaea] text-[#aaa]'
                                }`}>
                                  {step.icon}
                                </div>
                                <span className={`text-[13px] mb-1 ${isActive ? 'font-extrabold text-black' : 'font-medium text-[#aaa]'}`}>
                                  {step.label}
                                </span>
                                <span className="text-[10px] text-[#999] hidden">{step.desc}</span>
                              </div>
                            );
                          })}
                        </div>
                        {/* Connecting line */}
                        <div className="absolute top-4.5 left-[10%] right-[10%] h-[3px] bg-[#eaeaea] z-1">
                          <div 
                            className="h-full bg-black transition-all duration-800 ease-[cubic-bezier(0.4,0,0.2,1)]"
                            style={{ 
                              width: order.status === 'DELIVERED' ? '100%' : order.status === 'SHIPPED' ? '66%' : order.status === 'PROCESSING' ? '33%' : '0%' 
                            }} 
                          />
                        </div>
                      </div>

                      {/* Shipment Carrier and Details Alert */}
                      {(order.status === 'SHIPPED' || order.status === 'DELIVERED') && (
                        <div className="bg-[#f0f7ff] border border-[#d0e7ff] p-4 md:p-5 rounded-lg mb-5 flex justify-between items-center flex-wrap gap-3">
                          <div>
                            <span className="block text-[13px] font-extrabold text-[#0d47a1] uppercase tracking-wider">
                              🚚 APEX EXPRESS TRACKING ACTIVE
                            </span>
                            <span className="text-sm text-[#1a237e] mt-1 block">
                              Status: <strong>In Transit via Mumbai Hub</strong>. Handed over to courier partner.
                            </span>
                          </div>
                          <div className="text-right">
                            <span className="block text-[11px] text-[#5c6bc0] font-bold">TRACKING ID</span>
                            <span className="text-sm font-mono font-black text-[#0d47a1]">APX-9283742-IN</span>
                          </div>
                        </div>
                      )}

                      {/* Order Items */}
                      <div className="bg-[#fafafa] rounded-lg p-5 my-5">
                        <h4 className="m-0 mb-3 text-[13px] font-extrabold uppercase tracking-wider text-[#666]">Order Summary</h4>
                        {order.orderItems && order.orderItems.map((item, idx) => {
                          const itemImage = item.image || item.img;
                          const getDisplayPrice = (price: number | string) => {
                            if (typeof price === 'number') {
                              return `₹${price.toLocaleString('en-IN')}`;
                            }
                            if (typeof price === 'string') {
                              if (price.startsWith('₹')) return price;
                              const num = parseInt(price.replace(/[^\d]/g, ''), 10);
                              return isNaN(num) ? price : `₹${num.toLocaleString('en-IN')}`;
                            }
                            return '₹0';
                          };

                          return (
                            <div key={idx} className={`flex justify-between items-center text-sm py-2 ${idx === order.orderItems.length - 1 ? 'border-b-0' : 'border-b border-[#f0f0f0]'}`}>
                              <div className="flex items-center gap-3">
                                {itemImage && <img src={itemImage} alt={item.name} className="w-10 h-10 object-contain rounded border border-[#eee] bg-white" />}
                                <span><strong>{item.qty}x</strong> {item.name}</span>
                              </div>
                              <span className="font-bold">{getDisplayPrice(item.price)}</span>
                            </div>
                          );
                        })}
                      </div>

                      {/* Footer Totals & Address */}
                      <div className="flex justify-between flex-wrap gap-5 border-t border-[#f5f5f5] pt-5">
                        <div>
                          <span className="block text-[11px] font-bold text-[#999] uppercase tracking-wider mb-1.5">Shipping To</span>
                          {parsedAddress.fullName ? (
                            <span className="text-[13px] text-[#555] block leading-relaxed">
                              <strong>{parsedAddress.fullName}</strong><br />
                              {parsedAddress.address}, {parsedAddress.city} - {parsedAddress.zip}<br />
                              Phone: {parsedAddress.phone}
                            </span>
                          ) : (
                            <span className="text-[13px] text-[#555]">{parsedAddress.raw}</span>
                          )}
                        </div>
                        <div className="text-right">
                          <span className="text-[13px] text-[#666] block mb-1.5">Grand Total (Paid)</span>
                          <span className="text-xl font-black text-black">₹{order.totalPrice.toLocaleString('en-IN')}</span>
                        </div>
                      </div>

                    </div>
                  );
                })
              )}
            </div>
          )}

          {activeTab === 'profile' && (
            <div>
              <h3 className="text-2xl font-black mb-7.5 border-b border-[#eee] pb-5">Profile Details</h3>
              <div className="grid gap-6 max-w-[500px]">
                <div>
                  <label className="block text-[11px] font-bold mb-2 text-[#888] uppercase tracking-wider">Session Token / UID</label>
                  <input type="text" value={uid || ''} readOnly className="w-full p-3.5 border border-[#eee] bg-[#f9f9f9] rounded-lg text-sm font-mono font-bold text-[#555] focus:outline-none" />
                </div>
                <div>
                  <label className="block text-[11px] font-bold mb-2 text-[#888] uppercase tracking-wider">Email Registered</label>
                  <input type="email" value={uid ? `${uid}@apexgear.com` : ''} readOnly className="w-full p-3.5 border border-[#eee] bg-[#f9f9f9] rounded-lg text-sm font-medium text-[#555] focus:outline-none" />
                </div>
                <div>
                  <label className="block text-[11px] font-bold mb-2 text-[#888] uppercase tracking-wider">Access Tier</label>
                  <input type="text" value="GUEST SNEAKERHEAD" readOnly className="w-full p-3.5 border border-[#eee] bg-[#f9f9f9] rounded-lg text-sm font-bold text-[#0d47a1] focus:outline-none" />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'addresses' && (
            <div>
              <h3 className="text-2xl font-black mb-7.5 border-b border-[#eee] pb-5">My Addresses</h3>
              <div className="border-2 border-dashed border-[#eee] p-10 rounded-xl text-center text-[#777]">
                <span className="text-3xl block mb-4">📍</span>
                <p className="font-bold m-0 mb-1 text-black">No Saved Addresses</p>
                <p className="text-sm m-0">Addresses from your checkouts are attached directly to your orders. You can configure persistent default shipping addresses in a future release.</p>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div>
              <h3 className="text-2xl font-black mb-7.5 border-b border-[#eee] pb-5">Preferences</h3>
              <div className="flex flex-col gap-5">
                <div className="flex justify-between items-center border-b border-[#f9f9f9] pb-4">
                  <div>
                    <strong className="block text-[15px]">In-App Status Notifications</strong>
                    <span className="text-[13px] text-[#777]">Receive real-time toasts when orders change status (DEMO active).</span>
                  </div>
                  <input type="checkbox" defaultChecked disabled className="scale-[1.3] cursor-not-allowed" />
                </div>
                <div className="flex justify-between items-center border-b border-[#f9f9f9] pb-4">
                  <div>
                    <strong className="block text-[15px]">Live Order Status Polling</strong>
                    <span className="text-[13px] text-[#777]">Refetches your data automatically every 3 seconds for instant updates.</span>
                  </div>
                  <input type="checkbox" defaultChecked disabled className="scale-[1.3] cursor-not-allowed" />
                </div>
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
