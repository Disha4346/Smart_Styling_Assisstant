import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Sparkles, Mail, Lock, User, ArrowRight, CheckCircle2 } from 'lucide-react';
import axios from 'axios';

const SignupPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await axios.post('http://localhost:5000/api/auth/register', formData);
      setSuccess(true);
      // We don't log them in automatically because they need to verify their email
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 pt-24 pb-12 relative overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-soft/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="w-full max-w-md z-10 text-center">
          <div className="glass-card rounded-[40px] p-10 border border-white/60 shadow-2xl backdrop-blur-xl bg-white/40 flex flex-col items-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
              <CheckCircle2 className="w-10 h-10 text-green-600" />
            </div>
            <h1 className="text-3xl font-black text-brand-dark tracking-tight mb-4">Check Your Email</h1>
            <p className="text-brand-secondary font-medium mb-8">
              We've sent a verification link to <span className="font-bold text-brand-dark">{formData.email}</span>. Please click the link to activate your account.
            </p>
            <Link to="/login" className="px-8 py-3 bg-white/80 border border-white rounded-2xl font-bold text-brand-dark hover:bg-white shadow-sm transition-all">
              Return to Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 pt-24 pb-12 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-brand-soft/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-brand-accent/20 rounded-full blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-md z-10">
        <div className="glass-card rounded-[40px] p-10 border border-white/60 shadow-2xl backdrop-blur-xl bg-white/40">
          <div className="text-center mb-8">
            <div className="inline-flex p-3 bg-white/60 rounded-2xl shadow-sm mb-4 border border-white/80">
              <Sparkles className="w-8 h-8 text-brand-soft" />
            </div>
            <h1 className="text-3xl font-black text-brand-dark tracking-tight mb-2">Join SmartStyling</h1>
            <p className="text-brand-secondary font-medium">Create your aesthetic profile.</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50/80 border border-red-100 rounded-2xl text-red-600 text-sm font-semibold text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-brand-dark uppercase tracking-widest ml-2">Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User className="w-5 h-5 text-brand-secondary/70" />
                </div>
                <input 
                  type="text" 
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full pl-12 pr-4 py-4 bg-white/60 border border-white/80 rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-soft/50 focus:bg-white text-brand-dark font-medium transition-all shadow-sm placeholder:text-brand-secondary/50"
                  placeholder="Aria Montgomery"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-brand-dark uppercase tracking-widest ml-2">Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="w-5 h-5 text-brand-secondary/70" />
                </div>
                <input 
                  type="email" 
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full pl-12 pr-4 py-4 bg-white/60 border border-white/80 rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-soft/50 focus:bg-white text-brand-dark font-medium transition-all shadow-sm placeholder:text-brand-secondary/50"
                  placeholder="hello@aesthetic.com"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-brand-dark uppercase tracking-widest ml-2">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="w-5 h-5 text-brand-secondary/70" />
                </div>
                <input 
                  type="password" 
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className="w-full pl-12 pr-4 py-4 bg-white/60 border border-white/80 rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-soft/50 focus:bg-white text-brand-dark font-medium transition-all shadow-sm placeholder:text-brand-secondary/50"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full mt-8 py-4 bg-gradient-to-r from-brand-accent to-brand-soft text-brand-dark font-black text-lg rounded-2xl shadow-lg shadow-brand-accent/20 hover:shadow-brand-soft/30 hover:scale-[1.02] active:scale-95 transition-all flex justify-center items-center gap-2 disabled:opacity-70 disabled:hover:scale-100"
            >
              {loading ? 'Creating Account...' : (
                <>Sign Up <ArrowRight className="w-5 h-5" /></>
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-brand-secondary text-sm font-medium">
              Already have an account? <Link to="/login" className="text-brand-soft font-black hover:underline">Log in</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
