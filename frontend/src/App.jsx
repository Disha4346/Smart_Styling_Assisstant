import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import LandingPage from './pages/LandingPage';
import WardrobePage from './pages/WardrobePage';
import VirtualTryOn from './components/VirtualTryOn';
import RecommendationsPage from './pages/RecommendationsPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ProtectedRoute from './components/ProtectedRoute';
import ColorPaletteTool from './components/ColorPaletteTool';
import { Sparkles, Heart, Instagram, Twitter, Menu, X, LogOut, User } from 'lucide-react';

// ── Nav link helper ──────────────────────────────────────────────────────────
const NavLink = ({ to, children }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  return (
    <Link to={to} className={`nav-link text-[14px] ${isActive ? 'active' : ''}`}>
      {children}
    </Link>
  );
};

// ── Navbar ───────────────────────────────────────────────────────────────────
const Navbar = () => {
  const [scrolled, setScrolled]         = useState(false);
  const [menuOpen, setMenuOpen]         = useState(false);
  const [user, setUser]                 = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const stored = localStorage.getItem('user');
    setUser(stored ? JSON.parse(stored) : null);
  }, [location]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => setMenuOpen(false), [location]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setShowDropdown(false);
    navigate('/');
  };

  const firstName = user?.name?.split(' ')[0] || user?.email?.split('@')[0] || 'You';
  const initials  = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : firstName[0]?.toUpperCase();

  return (
    <nav
      id="main-nav"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'py-3 bg-white/85 backdrop-blur-xl shadow-[0_4px_24px_rgba(160,120,80,0.12)] border-b border-[#e4d4b0]/50'
          : 'py-5 bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">

        {/* Logo */}
        <Link to="/" id="nav-logo" className="flex items-center gap-2.5 group">
          <div
            className="p-2 rounded-xl transition-transform group-hover:rotate-12"
            style={{ background: 'linear-gradient(135deg, #d4bc98 0%, #a08258 100%)' }}
          >
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div>
            <span
              className="text-xl font-black tracking-tight"
              style={{
                background: 'linear-gradient(135deg, #8c6038, #c4a882, #cca820)',
                backgroundSize: '200% auto',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              SmartStyling
            </span>
            <p className="text-[9px] font-semibold tracking-[0.15em] uppercase text-[#c4a882] leading-none -mt-0.5">
              AI Fashion Studio
            </p>
          </div>
        </Link>

        {/* Desktop nav links */}
        <div className="hidden md:flex items-center gap-8">
          <NavLink to="/">Discover</NavLink>
          <NavLink to="/wardrobe">Wardrobe</NavLink>
          <NavLink to="/try-on">AI Stylist</NavLink>
          <NavLink to="/recommendations">Looks</NavLink>
        </div>

        {/* Auth CTA */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <div className="relative">
              <button
                id="nav-user-btn"
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center gap-2.5 px-3 py-2 rounded-2xl transition-all"
                style={{ background: 'transparent' }}
                onMouseEnter={e => e.currentTarget.style.background = '#f5eddf'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-md flex-shrink-0"
                  style={{ background: 'linear-gradient(135deg, #d4bc98, #c4a882, #a08258)' }}
                >
                  {initials}
                </div>
                <div className="text-left">
                  <p className="text-xs font-bold text-[#3a2010] leading-none">Hi, {firstName} ✦</p>
                  <p className="text-[10px] text-[#8a7060] leading-none mt-0.5">My Style</p>
                </div>
              </button>

              <AnimatePresence>
                {showDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.96 }}
                    className="absolute right-0 top-full mt-2 w-48 bg-white rounded-2xl overflow-hidden z-50"
                    style={{ boxShadow: '0 16px 48px rgba(160,120,80,0.18)', border: '1px solid #e4d4b0' }}
                  >
                    <div className="px-4 py-3 border-b" style={{ borderColor: '#f5eddf' }}>
                      <p className="text-xs font-bold text-[#3a2010] truncate">{user.name || user.email}</p>
                      <p className="text-[10px] text-[#8a7060] truncate">{user.email}</p>
                    </div>
                    <Link to="/wardrobe" onClick={() => setShowDropdown(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-[#8a7060] transition-colors"
                      style={{ hover: 'background:#f5eddf' }}
                      onMouseEnter={e => e.currentTarget.style.background = '#f5eddf'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <User className="w-3.5 h-3.5" /> My Wardrobe
                    </Link>
                    <button onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-400 hover:bg-red-50 transition-colors">
                      <LogOut className="w-3.5 h-3.5" /> Sign Out
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <>
              <Link to="/login" id="nav-login-btn"
                className="text-sm font-semibold text-[#8a7060] hover:text-[#8c6038] transition-colors px-4 py-2">
                Sign In
              </Link>
              <Link to="/signup" id="nav-signup-btn" className="btn-premium text-sm py-2.5 px-5">
                Get Started ✦
              </Link>
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <button
          id="nav-mobile-toggle"
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden p-2 rounded-xl text-[#8a7060] transition-colors"
          style={{ background: menuOpen ? '#f5eddf' : 'transparent' }}
        >
          {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            id="mobile-nav-drawer"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden overflow-hidden backdrop-blur-xl"
            style={{ background: 'rgba(254,252,248,0.97)', borderTop: '1px solid #e4d4b0' }}
          >
            <div className="px-6 py-6 flex flex-col gap-4">
              {[['/', 'Discover'], ['/wardrobe', 'Wardrobe'], ['/try-on', 'AI Stylist'], ['/recommendations', 'Looks']].map(([to, label]) => (
                <Link key={to} to={to} className="text-base font-semibold text-[#8a7060] hover:text-[#8c6038] transition-colors py-1">
                  {label}
                </Link>
              ))}
              <div className="section-divider mt-2 mb-2" />
              <Link to="/signup" className="btn-premium text-center text-sm">Get Started ✦</Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

// ── Footer ───────────────────────────────────────────────────────────────────
const Footer = () => (
  <footer id="main-footer" className="relative overflow-hidden"
    style={{ background: 'linear-gradient(135deg, #fefcf8 0%, #fdf8f2 50%, #f9f0e0 100%)' }}>

    <div className="blob blob-cream  w-80 h-80 -top-20 -left-20" />
    <div className="blob blob-beige  w-64 h-64 -bottom-10 right-0" />

    <div className="relative z-10 max-w-7xl mx-auto px-8 pt-16 pb-10">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">

        {/* Brand */}
        <div className="md:col-span-2">
          <div className="flex items-center gap-2.5 mb-4">
            <div className="p-2 rounded-xl"
              style={{ background: 'linear-gradient(135deg, #d4bc98, #a08258)' }}>
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-black"
              style={{
                background: 'linear-gradient(135deg, #8c6038, #c4a882, #cca820)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>
              SmartStyling AI
            </span>
          </div>
          <p className="text-sm text-[#8a7060] leading-relaxed max-w-xs">
            Your AI-powered personal fashion studio. Curate, style, and discover looks tailored uniquely to you.
          </p>
          {/* Neutral palette swatches */}
          <div className="flex gap-2 mt-5">
            {['#fdf8f2','#f0e4c8','#d4bc98','#c4a882','#a08258','#cca820'].map(c => (
              <div key={c} className="w-6 h-6 rounded-full border-2 border-white shadow-md"
                style={{ backgroundColor: c }} title={c} />
            ))}
            <span className="text-[10px] text-[#c4a882] font-semibold self-center ml-1">Our Palette</span>
          </div>
        </div>

        {/* Links */}
        <div>
          <p className="section-label mb-4">Navigate</p>
          <ul className="space-y-2.5">
            {[['/', 'Discover'], ['/wardrobe', 'Wardrobe'], ['/try-on', 'AI Stylist'], ['/recommendations', 'My Looks']].map(([to, label]) => (
              <li key={to}>
                <Link to={to} className="text-sm text-[#8a7060] hover:text-[#8c6038] transition-colors font-medium">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Social */}
        <div>
          <p className="section-label mb-4">Follow Us</p>
          <div className="flex gap-3">
            {[Instagram, Twitter].map((Icon, i) => (
              <a key={i} href="#"
                className="p-2.5 rounded-xl transition-all hover:-translate-y-1"
                style={{ background: '#fff', border: '1px solid #e4d4b0', color: '#c4a882' }}>
                <Icon className="w-4 h-4" />
              </a>
            ))}
          </div>
          <p className="text-xs text-[#8a7060] mt-6 leading-relaxed">
            Stay inspired.<br/>
            <span className="text-[#c4a882] font-semibold">@smartstyling.ai</span>
          </p>
        </div>
      </div>

      <div className="section-divider" />

      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-6">
        <p className="text-xs text-[#8a7060]">
          © 2026 SmartStyling AI — Crafted with{' '}
          <Heart className="w-3 h-3 text-[#c4a882] inline fill-[#c4a882]" />{' '}
          for the modern woman.
        </p>
        <div className="flex gap-4 text-xs text-[#8a7060]">
          <a href="#" className="hover:text-[#8c6038] transition-colors">Privacy</a>
          <a href="#" className="hover:text-[#8c6038] transition-colors">Terms</a>
        </div>
      </div>
    </div>
  </footer>
);

// ── App ───────────────────────────────────────────────────────────────────────
function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 pt-20">
          <Routes>
            <Route path="/"                element={<LandingPage />} />
            <Route path="/wardrobe"        element={<ProtectedRoute><WardrobePage /></ProtectedRoute>} />
            <Route path="/try-on"          element={<ProtectedRoute><VirtualTryOn /></ProtectedRoute>} />
            <Route path="/recommendations" element={<ProtectedRoute><RecommendationsPage /></ProtectedRoute>} />
            <Route path="/login"           element={<LoginPage />} />
            <Route path="/signup"          element={<SignupPage />} />
          </Routes>
        </main>
        <Footer />
        <ColorPaletteTool />
      </div>
    </Router>
  );
}

export default App;
