import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { ShieldCheck, Lock, Mail, ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react';

export const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const { login } = useAdminAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/admin/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg('Please enter both email and password.');
      return;
    }

    setSubmitting(true);
    setErrorMsg('');

    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      setErrorMsg(err.message || 'Invalid administrator credentials.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleFillDemo = () => {
    setEmail('admin@agrivafoods.com');
    setPassword('Admin@123');
    setErrorMsg('');
  };

  return (
    <div className="min-h-screen bg-[#F6F7F6] flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#009447] text-white shadow-lg mb-4">
          <ShieldCheck className="w-8 h-8" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#18382A] tracking-tight">
          AgrivaFoods Admin Portal
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          Sign in to manage catalog, inventory, and storefront content
        </p>
      </div>

      <div className="mt-6 sm:mt-8 sm:mx-auto sm:w-full sm:max-w-md px-3.5 sm:px-0">
        <div className="bg-white py-6 sm:py-8 px-4 sm:px-10 shadow-sm border border-gray-200 rounded-2xl">
          {errorMsg && (
            <div className="mb-5 p-3.5 bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm rounded-xl flex items-start gap-2.5">
              <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-500 mt-0.5" />
              <div>{errorMsg}</div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1.5">
                Admin Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@agrivafoods.com"
                  required
                  className="w-full pl-10 pr-3.5 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-[#009447] focus:border-[#009447] outline-none transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1.5">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-10 pr-3.5 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-[#009447] focus:border-[#009447] outline-none transition"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full mt-2 py-3 px-4 rounded-xl text-white font-semibold text-sm bg-[#009447] hover:bg-[#007A3B] transition shadow-md hover:shadow flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <span>Sign In to Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Credentials Assistant */}
          <div className="mt-6 pt-5 border-t border-gray-100">
            <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
              <span className="font-medium">Default Administrator Credentials:</span>
              <button
                type="button"
                onClick={handleFillDemo}
                className="text-[#009447] font-semibold hover:underline"
              >
                Auto-fill
              </button>
            </div>
            <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 text-xs font-mono text-gray-600 flex flex-col gap-1">
              <div>Email: <span className="text-[#18382A] font-semibold">admin@agrivafoods.com</span></div>
              <div>Pass: <span className="text-[#18382A] font-semibold">Admin@123</span></div>
            </div>
          </div>
        </div>

        <div className="text-center mt-6">
          <Link to="/" className="text-xs text-gray-500 hover:text-[#009447] transition">
            &larr; Return to AgrivaFoods Customer Storefront
          </Link>
        </div>
      </div>
    </div>
  );
};
