import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthService } from '../../services/auth';
import { Lock, Mail, Key, ShieldCheck, ArrowLeft, AlertCircle } from 'lucide-react';
import { BUSINESS_INFO } from '../../data/business';

export const AdminLogin: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Check if already authenticated
    AuthService.getCurrentUser().then((user) => {
      if (user) {
        navigate('/admin');
      }
    });
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !password) {
      setError('Please enter both email and password.');
      return;
    }

    setIsLoading(true);

    try {
      const { user, error: loginErr } = await AuthService.login(email, password);
      if (loginErr || !user) {
        setError(loginErr || 'Invalid email or password.');
      } else {
        navigate('/admin');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during authentication.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-ivory-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans selection:bg-champagne-500 selection:text-charcoal-950">
      
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <button
          type="button"
          onClick={() => navigate('/')}
          className="inline-flex items-center gap-2 text-xs font-semibold text-charcoal-600 hover:text-champagne-700 mb-6 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Guruji Property Website</span>
        </button>

        <div className="w-14 h-14 rounded-2xl bg-charcoal-900 border border-champagne-500/40 text-champagne-400 flex items-center justify-center font-serif font-black text-2xl mx-auto shadow-md">
          G
        </div>

        <h2 className="mt-4 text-2xl sm:text-3xl font-bold font-serif text-charcoal-900 tracking-tight">
          Admin Portal Login
        </h2>
        <p className="mt-1 text-xs text-charcoal-600 font-light">
          {BUSINESS_INFO.name} • Sushant Lok 2, Sector 57, Gurugram
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-luxury rounded-2xl border border-sand-200 sm:px-10 space-y-6">
          
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-charcoal-800 block mb-1.5">
                Admin Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-charcoal-400 absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="admin@gurujiproperty.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-sand-300 bg-ivory-50 text-xs text-charcoal-900 focus:outline-none focus:border-champagne-500"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-charcoal-800 block mb-1.5">
                Admin Password
              </label>
              <div className="relative">
                <Key className="w-4 h-4 text-charcoal-400 absolute left-3.5 top-3" />
                <input
                  type="password"
                  required
                  autoComplete="current-password"
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-sand-300 bg-ivory-50 text-xs text-charcoal-900 focus:outline-none focus:border-champagne-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 rounded-xl bg-champagne-500 hover:bg-champagne-600 text-charcoal-950 font-bold text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm disabled:opacity-50"
            >
              {isLoading ? (
                <span>Authenticating...</span>
              ) : (
                <>
                  <Lock className="w-3.5 h-3.5" />
                  <span>Log In to Admin Dashboard</span>
                </>
              )}
            </button>
          </form>

          {/* Security Notice */}
          <div className="pt-4 border-t border-sand-100 flex items-center justify-center gap-1.5 text-[11px] text-charcoal-500">
            <ShieldCheck className="w-3.5 h-3.5 text-champagne-700" />
            <span>Authorized Personnel Only • Sector 57 Gurugram Desk</span>
          </div>

        </div>
      </div>

    </div>
  );
};
