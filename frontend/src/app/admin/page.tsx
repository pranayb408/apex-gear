'use client';

import React, { useState, useEffect } from 'react';

interface OrderItem {
  name: string;
  price: string;
  img: string;
  qty: number;
}

interface Order {
  id: string;
  status: 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED';
  shippingAddress: string; // stringified address object or raw string
  orderItems: OrderItem[];
  totalPrice: number;
  createdAt: string;
  userId?: string;
}

export default function AdminPanel() {
  const [stats, setStats] = useState({
    totalSales: 0,
    activeOrders: 0,
    totalUsers: 0,
    recentOrders: [] as Order[]
  });
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const showToastMessage = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const loadLocalData = () => {
    try {
      let orders: Order[] = [];
      const ordersStr = localStorage.getItem('apex_gear_orders');
      
      if (ordersStr) {
        orders = JSON.parse(ordersStr);
      } else {
        // Seed default dummy orders to showcase the admin dashboard on first load
        const dummyOrders: Order[] = [
          {
            id: "AG-89472",
            status: "PROCESSING",
            shippingAddress: JSON.stringify({
              fullName: "Arjun Mehta",
              email: "arjun.mehta@gmail.com",
              phone: "9876543210",
              address: "Flat 405, Sky Heights, Sector 15",
              city: "Mumbai",
              zip: "400001"
            }),
            orderItems: [
              { name: "Nike Air IQ3408 — Sport Blue", price: "₹12,999", img: "https://adn-static1.nykaa.com/nykdesignstudio-images/pub/media/catalog/product/5/3/5324c8eNike-IQ3408-286_1.jpg?rnd=20200526195200&tr=w-1536", qty: 1 },
              { name: "Cotton Beanie", price: "₹899", img: "https://images.unsplash.com/photo-1576871337622-98d48d1cf531?w=600&q=80", qty: 2 }
            ],
            totalPrice: 14797,
            createdAt: new Date(Date.now() - 3600000 * 2).toISOString()
          },
          {
            id: "AG-62381",
            status: "DELIVERED",
            shippingAddress: JSON.stringify({
              fullName: "Priya Sharma",
              email: "priya.sharma@yahoo.com",
              phone: "9911223344",
              address: "12B, Park Avenue Road",
              city: "Bangalore",
              zip: "560001"
            }),
            orderItems: [
              { name: "G-Shock Mudmaster", price: "₹24,995", img: "https://images.unsplash.com/photo-1612817158483-12d260ebdf70?w=600&q=80", qty: 1 }
            ],
            totalPrice: 24995,
            createdAt: new Date(Date.now() - 3600000 * 24).toISOString()
          }
        ];
        localStorage.setItem('apex_gear_orders', JSON.stringify(dummyOrders));
        orders = dummyOrders;
      }

      // Calculate stats
      const totalSales = orders.reduce((sum, o) => sum + (o.totalPrice || 0), 0);
      const activeOrders = orders.filter(o => o.status !== 'DELIVERED').length;
      
      // Count unique customer emails or fallback
      const emails = new Set<string>();
      orders.forEach(o => {
        try {
          const addr = JSON.parse(o.shippingAddress);
          if (addr.email) emails.add(addr.email.toLowerCase());
        } catch {
          // ignore
        }
      });
      const totalUsers = Math.max(3, emails.size + 2); // Seed + dynamic

      setStats({
        totalSales,
        activeOrders,
        totalUsers,
        recentOrders: orders
      });
      setLoading(false);
    } catch (err) {
      console.error('Error loading data from localStorage:', err);
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLocalData();
    
    // Listen for storage events (e.g. checkout adding new orders)
    window.addEventListener('storage', loadLocalData);
    return () => window.removeEventListener('storage', loadLocalData);
  }, []);

  const handleStatusChange = (orderId: string, newStatus: string) => {
    try {
      const ordersStr = localStorage.getItem('apex_gear_orders');
      if (!ordersStr) return;

      const orders: Order[] = JSON.parse(ordersStr);
      const updated = orders.map(o => {
        if (o.id === orderId) {
          return { ...o, status: newStatus as any };
        }
        return o;
      });

      localStorage.setItem('apex_gear_orders', JSON.stringify(updated));
      
      // Reload states
      loadLocalData();
      showToastMessage(`Order #${orderId} updated to ${newStatus}!`);
    } catch (err) {
      console.error('Error changing order status:', err);
      showToastMessage('Error updating status');
    }
  };

  const filteredOrders = stats.recentOrders.filter(order => {
    let addressObj: any = {};
    try {
      addressObj = JSON.parse(order.shippingAddress);
    } catch (e) {
      addressObj = { raw: order.shippingAddress };
    }

    const customerName = addressObj.fullName || 'Guest Shopper';
    const customerEmail = addressObj.email || 'Guest Email';
    const customerPhone = addressObj.phone || 'N/A';
    const orderIdStr = String(order.id);

    const matchesSearch = 
      orderIdStr.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customerEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customerPhone.includes(searchQuery);

    const matchesStatus = statusFilter === 'ALL' || order.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50 text-gray-800 font-sans">
      
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-5 right-5 bg-slate-900 text-white px-6 py-4 rounded-lg font-bold text-xs tracking-widest uppercase z-50 shadow-2xl border-l-4 border-red-600 transition-all duration-300">
          {toast}
        </div>
      )}

      {/* Admin Sidebar */}
      <aside className="w-full md:w-72 bg-slate-900 text-slate-100 p-8 flex flex-col gap-8 shadow-md">
        <div>
          <h2 className="text-xl font-black tracking-widest text-white flex items-center gap-2">
            <span className="text-red-500">▲</span> APEX GEAR
          </h2>
          <p className="text-[10px] text-slate-500 font-black tracking-widest uppercase mt-1">Store Control Center</p>
        </div>
        
        <nav className="flex flex-col gap-2">
          <button className="flex items-center gap-3 px-5 py-3.5 bg-slate-800 text-white text-xs font-bold tracking-wider uppercase rounded-md text-left cursor-pointer">
            <span>📊</span> Dashboard
          </button>
          <a href="/dashboard" className="flex items-center gap-3 px-5 py-3.5 text-slate-400 hover:bg-slate-800 hover:text-white text-xs font-bold tracking-wider uppercase rounded-md transition-all">
            <span>👤</span> Customer Portal
          </a>
        </nav>

        <div className="mt-auto bg-slate-800/40 border border-slate-800 p-5 rounded-lg">
          <span className="text-[9px] font-black text-slate-500 block mb-2 tracking-widest uppercase">STORE ENGINE</span>
          <div className="flex items-center gap-2.5 text-xs font-bold text-slate-300">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse block"></span>
            <span>Local Storage Engine</span>
          </div>
        </div>
      </aside>

      {/* Admin Content */}
      <main className="flex-grow p-6 md:p-12 overflow-x-hidden">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8 border-b border-gray-200 pb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight text-slate-950 uppercase">Back-Office Admin Console</h1>
            <p className="text-gray-500 text-sm mt-1">Real-time revenue monitoring, customer directory, and manual order dispatch management.</p>
          </div>
          <a 
            href="/"
            className="inline-block px-5 py-3 bg-black text-white hover:bg-red-600 text-xs font-black tracking-widest uppercase transition-all shadow-md self-start lg:self-center"
          >
            ← Storefront
          </a>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <div className="w-10 h-10 border-4 border-gray-200 border-t-black rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-sm font-semibold text-gray-500">Consolidating database aggregates...</p>
          </div>
        ) : (
          <>
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              
              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-xs flex flex-col justify-between">
                <span className="text-[10px] font-black tracking-widest text-gray-400 uppercase mb-2">Total Store Revenue</span>
                <h2 className="text-3xl font-black text-slate-950 tracking-tight">
                  ₹{stats.totalSales.toLocaleString('en-IN')}
                </h2>
                <span className="text-[10px] text-emerald-600 font-bold mt-2">↑ 100% (Prisma Compatible)</span>
              </div>
              
              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-xs flex flex-col justify-between">
                <span className="text-[10px] font-black tracking-widest text-gray-400 uppercase mb-2">Active Shipments</span>
                <h2 className="text-3xl font-black text-slate-950 tracking-tight">
                  {stats.activeOrders}
                </h2>
                <span className="text-[10px] text-amber-500 font-bold mt-2">Pending fulfillment cycles</span>
              </div>
              
              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-xs flex flex-col justify-between">
                <span className="text-[10px] font-black tracking-widest text-gray-400 uppercase mb-2">Synced Customer Accounts</span>
                <h2 className="text-3xl font-black text-slate-950 tracking-tight">
                  {stats.totalUsers}
                </h2>
                <span className="text-[10px] text-blue-500 font-bold mt-2">Synced local user profiles</span>
              </div>

            </div>

            {/* Filters Row */}
            <div className="flex flex-col md:flex-row gap-4 mb-6 items-stretch md:items-center">
              <div className="flex-grow">
                <input 
                  type="text" 
                  placeholder="🔍 Search orders by Customer name, email, phone or order ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-5 py-3.5 rounded-lg border border-gray-200 bg-white text-sm font-semibold outline-none focus:border-black shadow-xs"
                />
              </div>
              
              <div className="flex items-center gap-3">
                <span className="text-xs font-black tracking-widest text-gray-400 uppercase">FILTER:</span>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-3 border border-gray-200 bg-white text-xs font-black tracking-wider uppercase rounded-lg cursor-pointer outline-none focus:border-black"
                >
                  <option value="ALL">ALL STATUSES</option>
                  <option value="PENDING">PENDING</option>
                  <option value="PROCESSING">PROCESSING</option>
                  <option value="SHIPPED">SHIPPED</option>
                  <option value="DELIVERED">DELIVERED</option>
                </select>
              </div>
            </div>

            {/* Recent Orders Table */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-xs overflow-hidden">
              <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                <h3 className="font-black text-slate-950 text-base uppercase tracking-tight">Transaction & Full-Stack Dispatch Log</h3>
                <span className="text-xs font-bold text-gray-500">Showing {filteredOrders.length} orders</span>
              </div>
              
              {filteredOrders.length === 0 ? (
                <div className="text-center py-16 text-gray-500 bg-gray-50">
                  <p className="font-black text-sm uppercase tracking-wider">No orders found.</p>
                  <p className="text-xs mt-1 text-gray-400">Verify your search queries or reset status filters.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-100 text-gray-400 font-black uppercase tracking-wider">
                        <th className="py-4 px-6">ORDER</th>
                        <th className="py-4 px-6">CUSTOMER DETAILS</th>
                        <th className="py-4 px-6">SHIPPING ADDRESS</th>
                        <th className="py-4 px-6">ITEMS</th>
                        <th className="py-4 px-6">TOTAL</th>
                        <th className="py-4 px-6">STATUS CONTROL</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {filteredOrders.map(order => {
                        let addressObj: any = {};
                        try {
                          addressObj = JSON.parse(order.shippingAddress);
                        } catch (e) {
                          addressObj = { raw: order.shippingAddress };
                        }

                        const name = addressObj.fullName || 'Guest Shopper';
                        const email = addressObj.email || 'N/A';
                        const phone = addressObj.phone || 'N/A';
                        const fullAddress = addressObj.fullName ? `${addressObj.address}, ${addressObj.city} - ${addressObj.zip}` : addressObj.raw;

                        return (
                          <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                            <td className="py-6 px-6 font-black text-slate-950">#{order.id}</td>
                            
                            {/* Customer Details */}
                            <td className="py-6 px-6">
                              <span className="font-bold block text-sm text-slate-950">{name}</span>
                              <span className="text-[11px] text-gray-500 block mt-0.5">{email}</span>
                              <span className="text-[11px] text-gray-500 block mt-0.5">☎ {phone}</span>
                            </td>
                            
                            {/* Address details */}
                            <td className="py-6 px-6 text-gray-500 max-w-xs leading-relaxed">
                              {fullAddress}
                            </td>
                            
                            {/* Items */}
                            <td className="py-6 px-6">
                              <div className="flex flex-col gap-1.5 max-w-[200px]">
                                {order.orderItems?.map((item, index) => (
                                  <span key={index} className="bg-slate-50 border border-slate-100 text-slate-600 px-2 py-1 rounded-sm text-[10px] font-medium block truncate">
                                    <strong className="text-slate-900 font-extrabold">{item.qty}x</strong> {item.name}
                                  </span>
                                ))}
                              </div>
                            </td>
                            
                            {/* Grand Total */}
                            <td className="py-6 px-6 font-black text-sm text-slate-950">
                              ₹{order.totalPrice.toLocaleString('en-IN')}
                            </td>
                            
                            {/* Status Selector */}
                            <td className="py-6 px-6">
                              <div className="flex flex-col gap-2 items-start">
                                <span className={`px-2 py-1 text-[9px] font-black tracking-widest rounded-md uppercase border ${
                                  order.status === 'DELIVERED' 
                                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                                    : order.status === 'SHIPPED' 
                                      ? 'bg-blue-50 text-blue-700 border-blue-200' 
                                      : order.status === 'PROCESSING' 
                                        ? 'bg-amber-50 text-amber-700 border-amber-200' 
                                        : 'bg-gray-50 text-gray-700 border-gray-200'
                                }`}>
                                  {order.status}
                                </span>
                                
                                <select
                                  value={order.status}
                                  onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                  className="px-2 py-1.5 border border-gray-300 bg-white text-[11px] font-bold uppercase rounded-md cursor-pointer outline-none focus:border-black"
                                >
                                  <option value="PENDING">PENDING</option>
                                  <option value="PROCESSING">PROCESSING</option>
                                  <option value="SHIPPED">SHIPPED</option>
                                  <option value="DELIVERED">DELIVERED</option>
                                </select>
                              </div>
                            </td>

                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
