import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { orderService } from '../../services/orderService';
import { useToast } from '../../context/ToastContext';
import {
  User,
  Package,
  MapPin,
  Heart,
  Star,
  LogOut,
  Edit2,
  Plus,
  Trash2,
  CheckCircle2,
  Clock,
  ArrowRight
} from 'lucide-react';

export const AccountPage = ({ initialTab = 'profile' }) => {
  const { user, isAuthenticated, logout, updateProfile, addAddress, deleteAddress } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const queryTab = searchParams.get('tab');
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState(queryTab || initialTab);
  const [orders, setOrders] = useState([]);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileName, setProfileName] = useState(user?.name || '');
  const [profilePhone, setProfilePhone] = useState(user?.phone || '');

  // New Address Modal state
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [newAddress, setNewAddress] = useState({
    fullName: '',
    address: '',
    apartment: '',
    city: '',
    state: '',
    pinCode: '',
    phone: ''
  });

  useEffect(() => {
    if (queryTab) {
      setActiveTab(queryTab);
    } else if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [queryTab, initialTab]);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    } else {
      setOrders(orderService.getOrders());
      setProfileName(user?.name || '');
      setProfilePhone(user?.phone || '');
    }
  }, [isAuthenticated, user, navigate]);

  if (!isAuthenticated) return null;

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    await updateProfile({ name: profileName, phone: profilePhone });
    setIsEditingProfile(false);
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    if (!newAddress.address || !newAddress.city || !newAddress.pinCode) {
      showToast('Please fill all required address fields', 'error');
      return;
    }
    await addAddress(newAddress);
    setShowAddressModal(false);
    setNewAddress({
      fullName: '',
      address: '',
      apartment: '',
      city: '',
      state: '',
      pinCode: '',
      phone: ''
    });
    showToast('Saved new address successfully!', 'success');
  };

  const navItems = [
    { id: 'profile', label: 'My Profile', icon: User },
    { id: 'orders', label: 'My Orders', icon: Package, count: orders.length },
    { id: 'addresses', label: 'Saved Addresses', icon: MapPin },
    { id: 'wishlist-link', label: 'Wishlist', icon: Heart, isLink: true, href: '/wishlist' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-black text-primary-dark">My Account</h1>
        <p className="text-xs text-muted mt-1">Manage your orders, profile, and addresses</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Side: Navigation Tabs */}
        <aside className="lg:col-span-4 bg-white rounded-3xl p-6 border border-sage-light shadow-premium self-start space-y-6">
          {/* User Badge */}
          <div className="flex items-center gap-3.5 pb-6 border-b border-sage-light">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold text-xl">
              {user?.name?.charAt(0) || 'U'}
            </div>
            <div className="min-w-0">
              <h3 className="text-sm font-bold text-foreground truncate">{user?.name}</h3>
              <p className="text-xs text-muted truncate">{user?.email}</p>
              <span className="inline-block mt-1 px-2 py-0.5 bg-primary/10 text-primary text-[10px] font-bold rounded-full">
                AgrivaFoods Member
              </span>
            </div>
          </div>

          {/* Nav List */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const IconComp = item.icon;
              if (item.isLink) {
                return (
                  <Link
                    key={item.id}
                    to={item.href}
                    className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-semibold text-foreground/80 hover:bg-[#FBF7F3] hover:text-primary transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <IconComp className="w-4 h-4 text-muted" />
                      <span>{item.label}</span>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-muted" />
                  </Link>
                );
              }

              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-semibold transition-colors ${
                    isActive
                      ? 'bg-primary text-white font-bold shadow-xs'
                      : 'text-foreground/80 hover:bg-[#FBF7F3] hover:text-primary'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <IconComp className={`w-4 h-4 ${isActive ? 'text-white' : 'text-muted'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.count !== undefined && (
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full ${
                        isActive ? 'bg-white/20 text-white' : 'bg-[#FBF7F3] text-muted'
                      }`}
                    >
                      {item.count}
                    </span>
                  )}
                </button>
              );
            })}

            <button
              onClick={logout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold text-error hover:bg-red-50 transition-colors pt-4 border-t border-sage-light mt-4"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </nav>
        </aside>

        {/* Right Side: Tab Contents */}
        <main className="lg:col-span-8">
          {/* PROFILE TAB */}
          {activeTab === 'profile' && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-sage-light shadow-premium space-y-6">
              <div className="flex justify-between items-center pb-4 border-b border-sage-light">
                <div>
                  <h2 className="text-base font-bold text-primary-dark">Personal Information</h2>
                  <p className="text-xs text-muted">Update your contact information</p>
                </div>
                {!isEditingProfile && (
                  <button
                    onClick={() => setIsEditingProfile(true)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-[#FBF7F3] border border-sage-light hover:border-primary/40 rounded-lg text-xs font-semibold text-foreground transition-colors"
                  >
                    <Edit2 className="w-3.5 h-3.5 text-primary" />
                    <span>Edit Profile</span>
                  </button>
                )}
              </div>

              {isEditingProfile ? (
                <form onSubmit={handleUpdateProfile} className="space-y-4 max-w-md">
                  <div>
                    <label className="block text-xs font-semibold text-foreground mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={profileName}
                      onChange={(e) => setProfileName(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-[#FBF7F3] border border-sage-light rounded-xl text-xs text-foreground focus:outline-none focus:border-primary"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-foreground mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={profilePhone}
                      onChange={(e) => setProfilePhone(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-[#FBF7F3] border border-sage-light rounded-xl text-xs text-foreground focus:outline-none focus:border-primary"
                    />
                  </div>
                  <div className="flex gap-2 pt-2">
                    <button
                      type="submit"
                      className="px-5 py-2 bg-primary text-white text-xs font-bold rounded-xl hover:bg-primary-dark transition-colors"
                    >
                      Save Changes
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsEditingProfile(false)}
                      className="px-5 py-2 bg-[#FBF7F3] border border-sage-light text-foreground text-xs font-semibold rounded-xl"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
                  <div className="p-4 bg-[#FBF7F3] rounded-2xl border border-sage-light">
                    <span className="text-[11px] text-muted block mb-1 font-medium">Full Name</span>
                    <span className="text-sm font-bold text-foreground">{user?.name}</span>
                  </div>
                  <div className="p-4 bg-[#FBF7F3] rounded-2xl border border-sage-light">
                    <span className="text-[11px] text-muted block mb-1 font-medium">Email Address</span>
                    <span className="text-sm font-bold text-foreground">{user?.email}</span>
                  </div>
                  <div className="p-4 bg-[#FBF7F3] rounded-2xl border border-sage-light">
                    <span className="text-[11px] text-muted block mb-1 font-medium">Contact Phone</span>
                    <span className="text-sm font-bold text-foreground">{user?.phone || 'Not added'}</span>
                  </div>
                  <div className="p-4 bg-[#FBF7F3] rounded-2xl border border-sage-light">
                    <span className="text-[11px] text-muted block mb-1 font-medium">Account Status</span>
                    <span className="text-xs font-bold text-primary flex items-center gap-1.5 mt-1">
                      <CheckCircle2 className="w-4 h-4" /> Active Customer
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ORDERS TAB */}
          {activeTab === 'orders' && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-sage-light shadow-premium space-y-6">
              <div className="pb-4 border-b border-sage-light">
                <h2 className="text-base font-bold text-primary-dark">Order History</h2>
                <p className="text-xs text-muted">Track past and current superfood shipments</p>
              </div>

              {orders.length === 0 ? (
                <div className="py-12 text-center">
                  <Package className="w-12 h-12 text-muted mx-auto mb-3 stroke-[1.2]" />
                  <p className="text-sm font-bold text-foreground">No orders yet</p>
                  <p className="text-xs text-muted mb-4">You have not placed any orders yet.</p>
                  <Link
                    to="/products"
                    className="px-5 py-2 bg-primary text-white text-xs font-bold rounded-xl inline-block"
                  >
                    Start Shopping
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((ord) => (
                    <div
                      key={ord.id}
                      className="p-5 bg-[#FBF7F3] rounded-2xl border border-sage-light space-y-3"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-sage-light/60">
                        <div>
                          <span className="text-[10px] text-muted font-bold block uppercase tracking-wider">
                            Order ID
                          </span>
                          <span className="text-xs font-bold text-primary-dark">{ord.id}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-muted font-bold block uppercase tracking-wider">
                            Date
                          </span>
                          <span className="text-xs font-semibold text-foreground">{ord.date}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-muted font-bold block uppercase tracking-wider">
                            Status
                          </span>
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                            <Clock className="w-3 h-3" /> {ord.status}
                          </span>
                        </div>
                        <div>
                          <span className="text-[10px] text-muted font-bold block uppercase tracking-wider">
                            Total
                          </span>
                          <span className="text-xs font-bold text-foreground">₹{ord.total}</span>
                        </div>
                      </div>

                      {/* Items */}
                      <div className="space-y-2 pt-1">
                        {ord.items?.map((item, idx) => (
                          <div key={idx} className="flex justify-between items-center text-xs">
                            <span className="text-foreground">
                              {item.name} ({item.weight}) × {item.quantity}
                            </span>
                            <span className="font-semibold text-foreground">
                              ₹{item.price * item.quantity}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ADDRESSES TAB */}
          {activeTab === 'addresses' && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-sage-light shadow-premium space-y-6">
              <div className="flex justify-between items-center pb-4 border-b border-sage-light">
                <div>
                  <h2 className="text-base font-bold text-primary-dark">Saved Delivery Addresses</h2>
                  <p className="text-xs text-muted">Manage your delivery locations for faster checkout</p>
                </div>
                <button
                  onClick={() => setShowAddressModal(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-primary text-white rounded-lg text-xs font-semibold hover:bg-primary-dark transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add New Address</span>
                </button>
              </div>

              {(!user?.addresses || user.addresses.length === 0) ? (
                <div className="p-8 text-center bg-[#FBF7F3] rounded-2xl border border-sage-light">
                  <MapPin className="w-8 h-8 text-muted mx-auto mb-2 stroke-[1.5]" />
                  <p className="text-xs text-muted">No saved addresses yet. Add one above.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {user.addresses.map((addr) => (
                    <div
                      key={addr.id}
                      className="p-4 bg-[#FBF7F3] rounded-2xl border border-sage-light relative flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-bold text-primary-dark">
                            {addr.fullName || user.name}
                          </span>
                          <button
                            onClick={() => deleteAddress(addr.id)}
                            className="text-muted hover:text-error transition-colors p-1"
                            title="Delete Address"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <p className="text-xs text-muted leading-relaxed">
                          {addr.address}
                          {addr.apartment && <>, {addr.apartment}</>}
                          <br />
                          {addr.city}, {addr.state} – {addr.pinCode}
                          <br />
                          Phone: {addr.phone || user.phone}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Add Address Modal */}
              {showAddressModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#184A35]/60 backdrop-blur-sm">
                  <div className="w-full max-w-md bg-white rounded-2xl p-6 shadow-2xl border border-sage-light space-y-4">
                    <h3 className="text-base font-bold text-primary-dark pb-2 border-b border-sage-light">
                      Add New Delivery Address
                    </h3>
                    <form onSubmit={handleAddAddress} className="space-y-3">
                      <div>
                        <label className="block text-[11px] font-semibold text-foreground mb-1">
                          Street Address *
                        </label>
                        <input
                          type="text"
                          value={newAddress.address}
                          onChange={(e) => setNewAddress({ ...newAddress, address: e.target.value })}
                          className="w-full px-3 py-2 bg-[#FBF7F3] border border-sage-light rounded-xl text-xs text-foreground focus:outline-none focus:border-primary"
                          placeholder="e.g. Flat 301, Sunshine Heights"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-foreground mb-1">
                          Apartment / Landmark
                        </label>
                        <input
                          type="text"
                          value={newAddress.apartment}
                          onChange={(e) => setNewAddress({ ...newAddress, apartment: e.target.value })}
                          className="w-full px-3 py-2 bg-[#FBF7F3] border border-sage-light rounded-xl text-xs text-foreground focus:outline-none focus:border-primary"
                          placeholder="Near Main Market"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] font-semibold text-foreground mb-1">
                            City *
                          </label>
                          <input
                            type="text"
                            value={newAddress.city}
                            onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                            className="w-full px-3 py-2 bg-[#FBF7F3] border border-sage-light rounded-xl text-xs text-foreground focus:outline-none focus:border-primary"
                            placeholder="Pune"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-semibold text-foreground mb-1">
                            State *
                          </label>
                          <input
                            type="text"
                            value={newAddress.state}
                            onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                            className="w-full px-3 py-2 bg-[#FBF7F3] border border-sage-light rounded-xl text-xs text-foreground focus:outline-none focus:border-primary"
                            placeholder="Maharashtra"
                            required
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-foreground mb-1">
                          PIN Code *
                        </label>
                        <input
                          type="text"
                          value={newAddress.pinCode}
                          onChange={(e) => setNewAddress({ ...newAddress, pinCode: e.target.value })}
                          className="w-full px-3 py-2 bg-[#FBF7F3] border border-sage-light rounded-xl text-xs text-foreground focus:outline-none focus:border-primary"
                          placeholder="411045"
                          required
                        />
                      </div>

                      <div className="flex gap-2 pt-3">
                        <button
                          type="submit"
                          className="flex-1 py-2.5 bg-primary text-white text-xs font-bold rounded-xl hover:bg-primary-dark transition-colors"
                        >
                          Save Address
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowAddressModal(false)}
                          className="px-4 py-2.5 bg-[#FBF7F3] border border-sage-light text-foreground text-xs font-semibold rounded-xl"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
