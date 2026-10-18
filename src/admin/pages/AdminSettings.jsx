import React, { useState } from 'react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { api } from '../../services/api';
import { Settings, ShieldCheck, Key, Store, CheckCircle2, AlertCircle, RefreshCw, Mail, Bell, Send } from 'lucide-react';

export const AdminSettings = () => {
  const { adminUser } = useAdminAuth();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [savingPass, setSavingPass] = useState(false);
  const [passMsg, setPassMsg] = useState({ text: '', type: '' });

  const [apiStatus, setApiStatus] = useState('Checking...');
  const [checkingApi, setCheckingApi] = useState(false);

  const checkConnection = async () => {
    setCheckingApi(true);
    try {
      const res = await api.request('/health');
      setApiStatus(`Online (Uptime: ${Math.round(res?.data?.uptime || 0)}s, DB: ${res?.data?.database})`);
    } catch {
      setApiStatus('Disconnected');
    } finally {
      setCheckingApi(false);
    }
  };

  const [emailStatus, setEmailStatus] = useState(null);
  const [testingEmail, setTestingEmail] = useState(false);
  const [testEmailResult, setTestEmailResult] = useState(null);

  const fetchEmailStatus = async () => {
    try {
      const res = await api.request('/admin/notifications/status');
      if (res?.data) setEmailStatus(res.data);
    } catch {
      // fallback
    }
  };

  const handleSendTestEmail = async () => {
    setTestingEmail(true);
    setTestEmailResult(null);
    try {
      const res = await api.request('/admin/notifications/test', { method: 'POST' });
      setTestEmailResult({
        type: 'success',
        text: `Test alert dispatched to ${res?.data?.to || emailStatus?.adminEmail || 'admin notification address'}!`
      });
    } catch (err) {
      setTestEmailResult({
        type: 'error',
        text: err.message || 'Failed to dispatch test notification'
      });
    } finally {
      setTestingEmail(false);
    }
  };

  React.useEffect(() => {
    checkConnection();
    fetchEmailStatus();
  }, []);

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setPassMsg({ text: 'New passwords do not match.', type: 'error' });
      return;
    }
    if (newPassword.length < 6) {
      setPassMsg({ text: 'Password must be at least 6 characters.', type: 'error' });
      return;
    }

    setSavingPass(true);
    setPassMsg({ text: '', type: '' });

    try {
      await api.request('/auth/change-password', {
        method: 'POST',
        body: JSON.stringify({ currentPassword, newPassword })
      });
      setPassMsg({ text: 'Password updated successfully.', type: 'success' });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setPassMsg({ text: err.message || 'Failed to update password', type: 'error' });
    } finally {
      setSavingPass(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-[#18382A]">Admin Settings & Security</h1>
        <p className="text-xs sm:text-sm text-gray-500">Configure administrator access, store details, and view server health</p>
      </div>

      {/* Store Information */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
        <h2 className="text-sm font-bold text-gray-900 border-b border-gray-100 pb-2 flex items-center gap-2">
          <Store className="w-4 h-4 text-[#009447]" />
          <span>Brand & Contact Information</span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block text-gray-400 font-semibold mb-1">Store Name</label>
            <div className="font-bold text-sm text-[#18382A]">AgrivaFoods</div>
          </div>
          <div>
            <label className="block text-gray-400 font-semibold mb-1">Official Support Email</label>
            <div className="font-semibold text-gray-800 break-all">agrivafoods03@gmail.com</div>
          </div>
          <div>
            <label className="block text-gray-400 font-semibold mb-1">Support Phone / WhatsApp</label>
            <div className="font-semibold text-gray-800">+91 88300 52087</div>
          </div>
          <div>
            <label className="block text-gray-400 font-semibold mb-1">HQ Origin</label>
            <div className="font-semibold text-gray-800">Pune, Maharashtra, India</div>
          </div>
        </div>
      </div>

      {/* Admin Profile & Password Change */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
        <h2 className="text-sm font-bold text-gray-900 border-b border-gray-100 pb-2 flex items-center gap-2">
          <Key className="w-4 h-4 text-[#009447]" />
          <span>Change Administrator Password</span>
        </h2>

        {passMsg.text && (
          <div className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
            passMsg.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-red-50 text-red-700 border border-red-200'
          }`}>
            {passMsg.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
            <span>{passMsg.text}</span>
          </div>
        )}

        <form onSubmit={handlePasswordChange} className="space-y-3 max-w-md">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Current Password *</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
              className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl outline-none focus:border-[#009447]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">New Password *</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl outline-none focus:border-[#009447]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Confirm New Password *</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl outline-none focus:border-[#009447]"
            />
          </div>

          <button
            type="submit"
            disabled={savingPass}
            className="w-full sm:w-auto px-5 py-2.5 min-h-[44px] text-xs font-bold text-white bg-[#009447] hover:bg-[#007A3B] rounded-xl shadow-sm transition disabled:opacity-50"
          >
            {savingPass ? 'Updating...' : 'Update Password'}
          </button>
        </form>
      </div>

      {/* API Health & Environment Status */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-gray-100 pb-2">
          <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#009447]" />
            <span>Backend API Connectivity</span>
          </h2>
          <button
            onClick={checkConnection}
            className="text-xs text-[#009447] hover:underline flex items-center gap-1 font-semibold"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${checkingApi ? 'animate-spin' : ''}`} />
            <span>Test Ping</span>
          </button>
        </div>

        <div className="text-xs space-y-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-gray-50 rounded-xl gap-1">
            <span className="text-gray-500">API Endpoint:</span>
            <span className="font-mono text-gray-800 break-all">http://localhost:5000/api</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-gray-50 rounded-xl gap-1">
            <span className="text-gray-500">Status & Database:</span>
            <span className="font-semibold text-emerald-700">{apiStatus}</span>
          </div>
        </div>
      </div>

      {/* Automatic Admin Email Notifications */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-gray-100 pb-2 gap-2">
          <div>
            <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2">
              <Mail className="w-4 h-4 text-[#009447]" />
              <span>Automatic Admin Email Notifications</span>
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Instant alerts sent to administrator for orders, payments, products, users, and inquiries
            </p>
          </div>
          <button
            onClick={handleSendTestEmail}
            disabled={testingEmail}
            className="self-start sm:self-auto px-4 py-2 text-xs font-bold text-white bg-[#009447] hover:bg-[#007A3B] rounded-xl shadow-sm transition disabled:opacity-50 flex items-center gap-1.5"
          >
            <Send className={`w-3.5 h-3.5 ${testingEmail ? 'animate-pulse' : ''}`} />
            <span>{testingEmail ? 'Sending Test...' : 'Send Test Alert'}</span>
          </button>
        </div>

        {testEmailResult && (
          <div className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
            testEmailResult.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-red-50 text-red-700 border border-red-200'
          }`}>
            {testEmailResult.type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
            <span>{testEmailResult.text}</span>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3 bg-gray-50 rounded-xl">
            <span className="text-gray-500 block mb-0.5">Admin Notification Recipient</span>
            <span className="font-bold text-gray-900 font-mono break-all">
              {emailStatus?.adminEmail || 'admin@agrivafoods.com'}
            </span>
          </div>
          <div className="p-3 bg-gray-50 rounded-xl">
            <span className="text-gray-500 block mb-0.5">Delivery Service</span>
            <span className="font-bold text-gray-900">
              {emailStatus?.connection?.status === 'connected' ? (
                <span className="text-emerald-700 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> SMTP Active ({emailStatus.smtpHost})
                </span>
              ) : (
                <span className="text-amber-700 flex items-center gap-1">
                  <Bell className="w-3.5 h-3.5" /> Standby Mock Mode (Logged & Tested)
                </span>
              )}
            </span>
          </div>
        </div>

        <div className="pt-2">
          <span className="text-xs font-semibold text-gray-700 block mb-2">Automated Event Triggers:</span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-gray-600">
            <div className="flex items-center gap-2 bg-gray-50/70 p-2 rounded-lg">
              <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0"></span>
              <span><strong>New Order Placed:</strong> Customer, address & item table</span>
            </div>
            <div className="flex items-center gap-2 bg-gray-50/70 p-2 rounded-lg">
              <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0"></span>
              <span><strong>Payment Verified:</strong> Razorpay ID & status update</span>
            </div>
            <div className="flex items-center gap-2 bg-gray-50/70 p-2 rounded-lg">
              <span className="w-2 h-2 rounded-full bg-red-500 shrink-0"></span>
              <span><strong>Payment Failed:</strong> Failure reason & order ref</span>
            </div>
            <div className="flex items-center gap-2 bg-gray-50/70 p-2 rounded-lg">
              <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0"></span>
              <span><strong>Product Added:</strong> Specs, prices & variant table</span>
            </div>
            <div className="flex items-center gap-2 bg-gray-50/70 p-2 rounded-lg">
              <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0"></span>
              <span><strong>Product Updated:</strong> Before vs after diff breakdown</span>
            </div>
            <div className="flex items-center gap-2 bg-gray-50/70 p-2 rounded-lg">
              <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0"></span>
              <span><strong>Customer Registered:</strong> Name, email & account ID</span>
            </div>
            <div className="flex items-center gap-2 bg-gray-50/70 p-2 rounded-lg sm:col-span-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0"></span>
              <span><strong>Contact Inquiry:</strong> Sanitized visitor message with email link</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
