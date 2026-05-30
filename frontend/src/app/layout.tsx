import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import type { Metadata } from 'next';

const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: 'Apex Gear',
  description: 'Full-Stack E-commerce Store',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.className}>
      <body className="bg-white text-black min-h-screen flex flex-col">
        {/* Announcement Bar */}
        <div className="bg-black text-white text-xs font-bold tracking-widest text-center py-2.5 px-4 uppercase select-none">
          FREE SHIPPING ON ORDERS OVER ₹5000 • 30-DAY EASY RETURNS
        </div>

        {/* Sticky/Responsive Navigation Header */}
        <Header />

        {/* Main Content Area */}
        <main className="flex-grow">
          {children}
        </main>

        {/* Styled Footer using Tailwind CSS v4 classes */}
        <footer className="bg-black text-white py-12 px-4 sm:px-6 lg:px-8 border-t border-gray-900 mt-auto" id="contact">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand column */}
            <div className="col-span-1 md:col-span-2">
              <span className="text-xl font-black tracking-wider flex items-center gap-2 mb-4">
                <span className="text-red-600">▲</span> APEX GEAR
              </span>
              <p className="text-sm text-gray-400 max-w-sm mb-4">
                High-performance gear built for the city and beyond. Engineered for durability, design, and function.
              </p>
              <p className="text-xs text-gray-500">
                © 2026 APEX GEAR. All Rights Reserved.
              </p>
            </div>

            {/* Shop Links */}
            <div>
              <h4 className="text-sm font-bold tracking-widest uppercase mb-4 text-red-600">SHOP</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <a href="/products/shoes" className="hover:text-white transition-colors">
                    SHOES
                  </a>
                </li>
                <li>
                  <a href="/products/watches" className="hover:text-white transition-colors">
                    WATCHES
                  </a>
                </li>
                <li>
                  <a href="/products/clothes" className="hover:text-white transition-colors">
                    CLOTHING
                  </a>
                </li>
              </ul>
            </div>

            {/* Support Links */}
            <div>
              <h4 className="text-sm font-bold tracking-widest uppercase mb-4 text-red-600">SUPPORT</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    30-DAY RETURNS
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    SHIPPING POLICY
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    CUSTOMER SERVICE
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
