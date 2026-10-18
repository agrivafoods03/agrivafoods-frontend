import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { MiniCartDrawer } from '../components/cart/MiniCartDrawer';
import { SearchModal } from '../components/common/SearchModal';
import { FloatingContact } from '../components/common/FloatingContact';
import { ToastContainer } from '../components/common/Toast';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

export const MainLayout = () => {
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-[#FBF7F3] text-[#18382A]">
      <ScrollToTop />
      <Navbar onOpenSearch={() => setSearchOpen(true)} />

      <main className="flex-1">
        <Outlet />
      </main>

      <Footer />

      {/* Global Modals & Drawers */}
      <MiniCartDrawer />
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
      <FloatingContact />
      <ToastContainer />
    </div>
  );
};
