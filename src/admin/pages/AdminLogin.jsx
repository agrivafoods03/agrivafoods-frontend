import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { adminApi } from '../../services/api';
import {
  ShieldCheck,
  Lock,
  Mail,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  KeyRound,
  Eye,
  EyeOff,
  RefreshCw,
  ChevronLeft,
  MailCheck
} from 'lucide-react';

export const AdminLogin = () => {
  // Mode: 'login' | 'forgot_email' | 'forgot_otp' | 'forgot_new_password' | 'forgot_success'
  const [mode, setMode] = useState('login');

  // Login form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Password reset state
  const [resetEmail, setResetEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Resend OTP cooldown timer (60 seconds)
  const [cooldown, setCooldown] = useState(0);

  const { login } = useAdminAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/admin/dashboard';

  useEffect(() => {
    let timer;
    if (cooldown > 0) {
      timer = setInterval(() => {
        setCooldown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [cooldown]);

  const clearMessages = () => {
    setErrorMsg('');
    setSuccessMsg('');
  };

  // --- Handlers ---
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg('Please enter both email and password.');
      return;
    }

    setSubmitting(true);
    clearMessages();

    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      setErrorMsg(err.message || 'Invalid administrator credentials.');
    } finally {
      setSubmitting(false);
    }
  };

  // 1. Request OTP
  const handleRequestOtp = async (e) => {
    e.preventDefault();
    if (!resetEmail || !resetEmail.includes('@')) {
      setErrorMsg('Please enter a valid administrator email address.');
      return;
    }

    setSubmitting(true);
    clearMessages();

    try {
      const res = await adminApi.forgotPassword(resetEmail);
      setSuccessMsg(res.message || 'If an eligible administrator account exists, a verification code will be sent.');
      setCooldown(60);
      setMode('forgot_otp');
    } catch (err) {
      setErrorMsg(err.message || 'Failed to request verification code. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // Resend OTP
  const handleResendOtp = async () => {
    if (cooldown > 0 || submitting) return;
    setSubmitting(true);
    clearMessages();

    try {
      const res = await adminApi.forgotPassword(resetEmail);
      setSuccessMsg(res.message || 'Verification code resent successfully.');
      setCooldown(60);
    } catch (err) {
      setErrorMsg(err.message || 'Failed to resend code.');
    } finally {
      setSubmitting(false);
    }
  };

  // 2. Verify OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    const cleanOtp = otp.trim();
    if (!cleanOtp || cleanOtp.length !== 6) {
      setErrorMsg('Please enter the full 6-digit verification code.');
      return;
    }

    setSubmitting(true);
    clearMessages();

    try {
      const res = await adminApi.verifyOtp(resetEmail, cleanOtp);
      const token = res?.data?.resetToken || res?.resetToken;
      if (!token) {
        throw new Error('Verification failed. Missing reset authorization.');
      }
      setResetToken(token);
      setSuccessMsg('Code verified successfully. You may now set your new password.');
      setMode('forgot_new_password');
    } catch (err) {
      setErrorMsg(err.message || 'Invalid or expired verification code.');
    } finally {
      setSubmitting(false);
    }
  };

  // 3. Complete Reset Password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (newPassword.length < 8) {
      setErrorMsg('Password must be at least 8 characters in length.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setErrorMsg('New passwords do not match. Please verify.');
      return;
    }

    setSubmitting(true);
    clearMessages();

    try {
      await adminApi.resetPassword(resetEmail, resetToken, newPassword, confirmPassword);
      setMode('forgot_success');
    } catch (err) {
      setErrorMsg(err.message || 'Failed to reset password. Token may have expired.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleReturnToLogin = () => {
    clearMessages();
    setPassword('');
    setOtp('');
    setResetToken('');
    setNewPassword('');
    setConfirmPassword('');
    setMode('login');
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
          Secure management access for authorized administrators
        </p>
      </div>

      <div className="mt-6 sm:mt-8 sm:mx-auto sm:w-full sm:max-w-md px-3.5 sm:px-0">
        <div className="bg-white py-6 sm:py-8 px-4 sm:px-10 shadow-sm border border-gray-200 rounded-2xl">
          
          {/* Alerts */}
          {errorMsg && (
            <div className="mb-5 p-3.5 bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm rounded-xl flex items-start gap-2.5">
              <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-500 mt-0.5" />
              <div>{errorMsg}</div>
            </div>
          )}

          {successMsg && mode !== 'forgot_success' && (
            <div className="mb-5 p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm rounded-xl flex items-start gap-2.5">
              <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-emerald-600 mt-0.5" />
              <div>{successMsg}</div>
            </div>
          )}

          {/* ========================================================= */}
          {/* STATE 1: STANDARD ADMIN LOGIN */}
          {/* ========================================================= */}
          {mode === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
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
                    placeholder="Enter administrator email"
                    required
                    className="w-full pl-10 pr-3.5 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-[#009447] focus:border-[#009447] outline-none transition"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      clearMessages();
                      setResetEmail(email);
                      setMode('forgot_email');
                    }}
                    className="text-xs font-bold text-[#009447] hover:underline"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                    className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-[#009447] focus:border-[#009447] outline-none transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
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
          )}

          {/* ========================================================= */}
          {/* STATE 2: FORGOT PASSWORD - EMAIL ENTRY */}
          {/* ========================================================= */}
          {mode === 'forgot_email' && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
                <div className="p-2 bg-emerald-50 text-[#009447] rounded-xl">
                  <KeyRound className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#18382A]">Reset Administrator Password</h3>
                  <p className="text-xs text-gray-500">A verification code will be sent to your registered email</p>
                </div>
              </div>

              <form onSubmit={handleRequestOtp} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1.5">
                    Registered Admin Email
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input
                      type="email"
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      placeholder="Enter administrator email address"
                      required
                      className="w-full pl-10 pr-3.5 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-[#009447] focus:border-[#009447] outline-none transition"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3 px-4 rounded-xl text-white font-semibold text-sm bg-[#009447] hover:bg-[#007A3B] transition shadow-md flex items-center justify-center gap-2 disabled:opacity-70"
                >
                  {submitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Sending Code...</span>
                    </>
                  ) : (
                    <>
                      <span>Send Verification Code</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                <div className="text-center pt-2">
                  <button
                    type="button"
                    onClick={handleReturnToLogin}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-gray-600 hover:text-[#009447]"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                    <span>Back to Sign In</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* ========================================================= */}
          {/* STATE 3: OTP ENTRY & VERIFICATION */}
          {/* ========================================================= */}
          {mode === 'forgot_otp' && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
                <div className="p-2 bg-amber-50 text-amber-700 rounded-xl">
                  <MailCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#18382A]">Enter Verification Code</h3>
                  <p className="text-xs text-gray-500">6-digit OTP sent to: <span className="font-semibold text-gray-800">{resetEmail}</span></p>
                </div>
              </div>

              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1.5 text-center">
                    6-Digit Verification Code
                  </label>
                  <input
                    type="text"
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                    placeholder="••••••"
                    required
                    autoFocus
                    className="w-full py-3 px-4 text-center font-mono text-2xl font-bold tracking-[8px] sm:tracking-[12px] border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#009447] focus:border-[#009447] outline-none transition"
                  />
                  <p className="text-[11px] text-gray-400 text-center mt-1.5">
                    Code expires in 10 minutes. Check spam/promotions if not received.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={submitting || otp.length !== 6}
                  className="w-full py-3 px-4 rounded-xl text-white font-semibold text-sm bg-[#009447] hover:bg-[#007A3B] transition shadow-md flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {submitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Verifying Code...</span>
                    </>
                  ) : (
                    <>
                      <span>Verify Code</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                {/* Resend Cooldown Section */}
                <div className="flex items-center justify-between text-xs pt-2 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => {
                      clearMessages();
                      setMode('forgot_email');
                    }}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    Change Email
                  </button>

                  <button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={cooldown > 0 || submitting}
                    className={`font-semibold flex items-center gap-1 ${
                      cooldown > 0 ? 'text-gray-400 cursor-not-allowed' : 'text-[#009447] hover:underline'
                    }`}
                  >
                    <RefreshCw className={`w-3 h-3 ${submitting ? 'animate-spin' : ''}`} />
                    <span>{cooldown > 0 ? `Resend code in ${cooldown}s` : 'Resend Code'}</span>
                  </button>
                </div>

                <div className="text-center pt-1">
                  <button
                    type="button"
                    onClick={handleReturnToLogin}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-gray-600 hover:text-[#009447]"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                    <span>Back to Sign In</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* ========================================================= */}
          {/* STATE 4: NEW PASSWORD ENTRY */}
          {/* ========================================================= */}
          {mode === 'forgot_new_password' && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
                <div className="p-2 bg-emerald-50 text-[#009447] rounded-xl">
                  <Lock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#18382A]">Create New Password</h3>
                  <p className="text-xs text-gray-500">Minimum 8 characters with strong security</p>
                </div>
              </div>

              <form onSubmit={handleResetPassword} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1.5">
                    New Password (min. 8 characters) *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Enter new password"
                      required
                      minLength={8}
                      className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-[#009447] focus:border-[#009447] outline-none transition"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword((prev) => !prev)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                    >
                      {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1.5">
                    Confirm New Password *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm new password"
                      required
                      minLength={8}
                      className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-[#009447] focus:border-[#009447] outline-none transition"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword((prev) => !prev)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3 px-4 rounded-xl text-white font-semibold text-sm bg-[#009447] hover:bg-[#007A3B] transition shadow-md flex items-center justify-center gap-2 disabled:opacity-70"
                >
                  {submitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Updating Password...</span>
                    </>
                  ) : (
                    <>
                      <span>Save New Password</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                <div className="text-center pt-2">
                  <button
                    type="button"
                    onClick={handleReturnToLogin}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-gray-600 hover:text-[#009447]"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                    <span>Cancel and Return to Sign In</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* ========================================================= */}
          {/* STATE 5: SUCCESS STATE */}
          {/* ========================================================= */}
          {mode === 'forgot_success' && (
            <div className="text-center space-y-4 py-2">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-700 shadow-sm mx-auto">
                <CheckCircle2 className="w-8 h-8 text-[#009447]" />
              </div>
              <h3 className="text-lg font-bold text-[#18382A]">Password Reset Successful!</h3>
              <p className="text-xs text-gray-600 leading-relaxed max-w-xs mx-auto">
                Your administrator password has been updated securely. All prior reset verification codes have been invalidated.
              </p>
              <button
                type="button"
                onClick={handleReturnToLogin}
                className="w-full py-3 px-4 rounded-xl text-white font-semibold text-sm bg-[#009447] hover:bg-[#007A3B] transition shadow-md"
              >
                Sign In with New Password &rarr;
              </button>
            </div>
          )}

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

