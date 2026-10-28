import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthService } from '../../services/auth';
import { Lock, Mail, Key, ShieldCheck, ArrowLeft, AlertCircle, Check } from 'lucide-react';
import { BUSINESS_INFO } from '../../data/business';

export const AdminLogin: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('admin@gurujiproperty.com');
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
        <a
          href="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-charcoal-600 hover:text-champagne-700 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Guruji Property Website</span>
        </a>

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
              <label className="text-xs font-semibold text-charcoal-800 block mb-1">
                Admin Email / Username
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-charcoal-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  required
                  placeholder="admin@gurujiproperty.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-sand-300 bg-ivory-50 text-xs text-charcoal-900 focus:outline-none focus:border-champagne-500"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-charcoal-800">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setPassword('Admin77#!')}
                  className="text-[10px] text-champagne-700 hover:underline font-semibold"
                >
                  Fill Master Password
                </button>
              </div>
              <div className="relative">
                <Key className="w-4 h-4 text-charcoal-400 absolute left-3.5 top-3" />
                <input
                  type="password"
                  required
                  placeholder="Enter admin password (Admin77#!)"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-sand-300 bg-ivory-50 text-xs text-charcoal-900 focus:outline-none focus:border-champagne-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 rounded-xl bg-champagne-500 hover:bg-champagne-600 text-charcoal-950 font-bold text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
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

          {/* Master Password Callout Box */}
          <div className="p-4 rounded-xl bg-ivory-100 border border-sand-300 text-xs text-charcoal-700 space-y-2">
            <div className="flex items-center gap-1.5 font-bold text-charcoal-900">
              <ShieldCheck className="w-4 h-4 text-champagne-700" />
              <span>Owner Access Credentials:</span>
            </div>
            <div className="space-y-1 text-[11px]">
              <div>
                <span className="text-charcoal-500">Email:</span>{' '}
                <code className="bg-white px-1.5 py-0.5 rounded border border-sand-200 text-charcoal-900 font-semibold">
                  admin@gurujiproperty.com
                </code>
              </div>
              <div>
                <span className="text-charcoal-500">Password:</span>{' '}
                <code className="bg-white px-1.5 py-0.5 rounded border border-sand-200 text-champagne-800 font-bold">
                  Admin77#!
                </code>
              </div>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
};
