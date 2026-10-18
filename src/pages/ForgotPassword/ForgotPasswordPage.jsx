import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';

export const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email && email.includes('@')) {
      setSubmitted(true);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-sage-light shadow-xl text-center">
        <h1 className="text-2xl font-black text-primary-dark mb-2">Reset Password</h1>
        <p className="text-xs text-muted mb-6">
          Enter the email associated with your account and we’ll send password reset instructions.
        </p>

        {submitted ? (
          <div className="p-4 bg-emerald-50 border border-primary/20 rounded-2xl text-left space-y-2 mb-6">
            <div className="flex items-center gap-2 text-primary font-bold text-xs">
              <CheckCircle2 className="w-4 h-4" />
              <span>Password Reset Link Sent</span>
            </div>
            <p className="text-[11px] text-muted">
              We sent a demo reset link to <strong>{email}</strong>. Check your inbox to choose a new password.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-left">
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">
                Your Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-10 pr-4 py-2.5 bg-[#FBF7F3] border border-sage-light rounded-xl text-xs sm:text-sm text-foreground focus:outline-none focus:border-primary"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-primary hover:bg-primary-dark text-white text-xs font-bold rounded-xl shadow-md transition-all"
            >
              Send Reset Link
            </button>
          </form>
        )}

        <div className="pt-4 border-t border-sage-light mt-6">
          <Link
            to="/login"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:underline"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Login</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
