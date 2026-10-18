import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate, useLocation, Link } from 'react-router-dom';
import { useAdminAuth } from '../../context/AdminAuthContext';
import {
  LayoutDashboard,
  Package,
  Layers,
  Image as ImageIcon,
  Star,
  Home,
  Boxes,
  ShoppingBag,
  Settings,
  LogOut,
  Menu,
  X,
  ExternalLink,
  Bell,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';

export const AdminLayout = () => {
  const { adminUser, logout } = useAdminAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  React.useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [sidebarOpen]);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Products', path: '/admin/products', icon: Package },
    { name: 'Categories', path: '/admin/categories', icon: Layers },
    { name: 'Images & Media', path: '/admin/media', icon: ImageIcon },
    { name: 'Reviews & Ratings', path: '/admin/reviews', icon: Star },
    { name: 'Homepage Content', path: '/admin/homepage', icon: Home },
    { name: 'Inventory & Stock', path: '/admin/inventory', icon: Boxes },
    { name: 'Orders', path: '/admin/orders', icon: ShoppingBag },
    { name: 'Admin Settings', path: '/admin/settings', icon: Settings }
  ];

  const currentNav = navItems.find((item) => location.pathname.startsWith(item.path)) || { name: 'Admin Portal' };

  return (
    <div className="min-h-screen bg-[#F6F7F6] text-[#18382A] flex flex-col md:flex-row font-sans">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed md:sticky top-0 h-screen w-64 bg-[#122A1F] text-white flex flex-col z-50 transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Brand Header */}
        <div className="p-5 border-b border-[#214736] flex items-center justify-between">
          <Link to="/admin/dashboard" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#009447] flex items-center justify-center font-bold text-white shadow-md">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="font-extrabold text-base tracking-tight text-white leading-tight">AgrivaFoods</div>
              <div className="text-[11px] text-[#86D39D] font-medium uppercase tracking-wider">Store Admin</div>
            </div>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="md:hidden text-gray-300 hover:text-white"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path || (item.path !== '/admin/dashboard' && location.pathname.startsWith(item.path));
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-[#009447] text-white shadow-sm font-semibold'
                    : 'text-[#B4C9BE] hover:bg-[#1A3A2B] hover:text-white'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-[#86D39D]'}`} />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* User Info & Logout */}
        <div className="p-4 border-t border-[#214736] bg-[#0E2218]">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-full bg-[#009447]/30 border border-[#009447] flex items-center justify-center text-[#86D39D] font-bold text-sm">
              {adminUser?.name?.charAt(0) || 'A'}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-semibold text-white truncate">{adminUser?.name || 'Administrator'}</div>
              <div className="text-[10px] text-[#86D39D] truncate">{adminUser?.email || 'admin@agrivafoods.com'}</div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-300 text-xs font-medium transition"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Navbar */}
        <header className="sticky top-0 z-30 bg-white border-b border-gray-200 px-3.5 sm:px-6 md:px-8 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden p-2 text-gray-600 hover:text-gray-900 rounded-lg min-w-[36px] min-h-[36px] flex items-center justify-center active:bg-gray-100"
              aria-label="Open admin sidebar menu"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-gray-500">
              <span className="hidden xs:inline">Admin</span>
              <ChevronRight className="w-3.5 h-3.5 hidden xs:inline" />
              <span className="font-semibold text-[#18382A] truncate max-w-[150px] xs:max-w-none">{currentNav.name}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              to="/"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-medium text-gray-700 hover:bg-gray-50 hover:text-[#009447] transition shadow-sm"
            >
              <span>View Live Store</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>

            <div className="h-6 w-px bg-gray-200 hidden sm:block"></div>

            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="hidden xs:inline">API</span> Connected
              </span>
            </div>
          </div>
        </header>

        {/* Page Content Viewport */}
        <main className="flex-1 p-3 sm:p-5 md:p-8 max-w-full overflow-x-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
