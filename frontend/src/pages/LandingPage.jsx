import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Cloud, Sun, Umbrella, Wind, Coffee, Briefcase,
  PartyPopper, Plane, Heart, ShoppingBag, ArrowRight,
  Sparkles, ChevronRight, Star, CheckCircle2, TrendingUp, Shirt, CalendarCheck
} from 'lucide-react';

const occasions = [
  { id: 'formal',  label: 'Formal',  icon: Briefcase,   color: 'from-nude-300 to-nude-400',      pill: 'pill-nude',     description: 'Sharp, professional looks for career milestones.' },
  { id: 'casual',  label: 'Casual',  icon: Coffee,      color: 'from-blush-200 to-blush-300',    pill: 'pill-blush',    description: 'Effortless style for your everyday moments.' },
  { id: 'party',   label: 'Party',   icon: PartyPopper, color: 'from-lavender-200 to-lavender-300', pill: 'pill-lavender', description: 'Vibrant outfits to make you the star of the show.' },
  { id: 'travel',  label: 'Travel',  icon: Plane,       color: 'from-brand-200 to-brand-300',    pill: 'pill-brand',    description: 'Comfortable yet chic ensembles for the explorer.' },
];

const weatherOptions = [
  { id: 'summer',  label: 'Summer',  icon: Sun,     bg: '#fff5e0', text: '#c07a00', emoji: '☀️' },
  { id: 'winter',  label: 'Winter',  icon: Cloud,   bg: '#eef3ff', text: '#4b6bdf', emoji: '❄️' },
  { id: 'monsoon', label: 'Monsoon', icon: Umbrella,bg: '#f0eafe', text: '#763de3', emoji: '🌧️' },
  { id: 'spring',  label: 'Spring',  icon: Wind,    bg: '#edfaf4', text: '#1a9e6c', emoji: '🌸' },
];

const features = [
  { icon: Sparkles, label: 'AI Outfit Picks',  desc: 'Smart daily recommendations based on your style profile.', color: '#f0e4c8', text: '#7c5230' },
  { icon: Heart,    label: 'Style DNA',        desc: 'We learn your preferences and refine suggestions over time.', color: '#f5eddf', text: '#6c4c28' },
  { icon: Star,     label: 'Trend Alerts',     desc: 'Stay ahead with curated seasonal colour & silhouette trends.', color: '#fdfbf4', text: '#7a6010' },
];

// Slide-in variants
const slideIn = {
  initial: { opacity: 0, x: 60 },
  animate: { opacity: 1, x: 0 },
  exit:    { opacity: 0, x: -60 },
};

// Stagger container
const staggerContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};
const fadeIn = {
  hidden: { opacity: 0 },
  show:   { opacity: 1, transition: { duration: 0.5 } },
};

const STYLE_CARDS = [
  {
    id: 'ai-pick',
    angle: 320, radius: 160, delay: 0.3, floatDuration: 4.0,
    content: (
      <div className="glass-card rounded-2xl p-3.5 w-[165px] cursor-default"
        style={{ boxShadow: '0 8px 24px rgba(160,120,80,0.12)' }}>
        <div className="flex items-center gap-2 mb-2.5">
          <div className="w-7 h-7 rounded-xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg,#d4bc98,#a08258)' }}>
            <Sparkles className="w-3.5 h-3.5 text-white" />
          </div>
          <p className="text-[10px] font-black uppercase tracking-wide text-[#8c6038]">AI Pick Today</p>
        </div>
        <p className="text-[11px] font-bold text-[#3a2010] leading-tight mb-1.5">Flowy Midi Dress</p>
        <div className="flex items-center gap-1">
          {[...Array(5)].map((_, i) => <Star key={i} className="w-2.5 h-2.5 fill-[#cca820] text-[#cca820]" />)}
          <span className="text-[9px] text-[#8a7060] ml-1">Perfect match</span>
        </div>
      </div>
    )
  },
  {
    id: 'wardrobe',
    angle: 50, radius: 160, delay: 0.5, floatDuration: 3.5,
    content: (
      <div className="glass-card rounded-2xl p-3.5 w-[160px] cursor-default"
        style={{ boxShadow: '0 8px 24px rgba(140,96,56,0.12)' }}>
        <div className="flex items-center gap-2 mb-2.5">
          <div className="w-7 h-7 rounded-xl flex items-center justify-center" style={{ background: '#f5eddf' }}>
            <Shirt className="w-3.5 h-3.5" style={{ color: '#8c6038' }} />
          </div>
          <p className="text-[10px] font-black uppercase tracking-wide" style={{ color: '#8c6038' }}>Wardrobe</p>
        </div>
        <p className="text-[11px] font-bold text-[#3a2010] mb-1">42 items matched</p>
        <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ background: '#f0e4c8' }}>
          <motion.div className="h-full rounded-full"
            style={{ background: 'linear-gradient(90deg,#d4bc98,#a08258)' }}
            initial={{ width: '0%' }} animate={{ width: '78%' }}
            transition={{ delay: 1.2, duration: 1.2, ease: 'easeOut' }} />
        </div>
        <p className="text-[9px] text-[#8a7060] mt-1">78% utilisation</p>
      </div>
    )
  },
  {
    id: 'weather',
    angle: 140, radius: 160, delay: 0.7, floatDuration: 4.5,
    content: (
      <div className="glass-card rounded-2xl p-3.5 w-[155px] cursor-default"
        style={{ boxShadow: '0 8px 24px rgba(160,120,80,0.10)' }}>
        <div className="flex items-center gap-2 mb-2">
          <div className="w-7 h-7 rounded-xl flex items-center justify-center text-base" style={{ background: '#fff5e0' }}>☀️</div>
          <p className="text-[10px] font-black uppercase tracking-wide text-[#a07820]">Today's Look</p>
        </div>
        <p className="text-[11px] font-bold text-[#3a2010] mb-0.5">Linen Blazer +</p>
        <p className="text-[11px] font-bold text-[#3a2010]">Wide-Leg Trousers</p>
        <div className="flex items-center gap-1.5 mt-2">
          <CheckCircle2 className="w-3 h-3 text-[#1a9e6c]" />
          <span className="text-[9px] text-[#8a7060]">Weather approved</span>
        </div>
      </div>
    )
  },
  {
    id: 'score',
    angle: 230, radius: 160, delay: 0.9, floatDuration: 3.8,
    content: (
      <div className="glass-card rounded-2xl p-3.5 w-[150px] cursor-default"
        style={{ boxShadow: '0 8px 24px rgba(160,120,80,0.12)' }}>
        <div className="flex items-center gap-2 mb-2.5">
          <div className="w-7 h-7 rounded-xl flex items-center justify-center" style={{ background: '#fdfbf4' }}>
            <TrendingUp className="w-3.5 h-3.5" style={{ color: '#a07820' }} />
          </div>
          <p className="text-[10px] font-black uppercase tracking-wide text-[#a07820]">Style Score</p>
        </div>
        <div className="flex items-end gap-1">
          <motion.p className="text-3xl font-black text-[#3a2010]"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.4 }}>92</motion.p>
          <p className="text-[10px] text-[#8a7060] mb-1.5">/100</p>
        </div>
        <p className="text-[9px] font-semibold" style={{ color: '#c4a882' }}>✦ Iconic this week!</p>
      </div>
    )
  },
];

const LandingPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [selections, setSelections] = useState({ gender: 'female', weather: 'summer', occasion: null, subOccasion: null });

  const handleGenderSelect  = (gender) => { setSelections(p => ({ ...p, gender })); setStep(2); };
  const handleWeatherSelect = (id)     => { setSelections(p => ({ ...p, weather: id })); setStep(3); };
  const handleOccasionSelect= (occ)    => { setSelections(p => ({ ...p, occasion: occ.id })); setStep(4); };
  const handleSubSelect     = (sub)    => navigate('/recommendations', { state: { ...selections, subOccasion: sub } });

  return (
    <div className="min-h-[90vh]">
      <AnimatePresence mode="wait">

        {/* ── Step 0: Hero ── */}
        {step === 0 && (
          <motion.div key="hero" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, scale: 0.97 }} transition={{ duration: 0.4 }}>

            {/* Hero banner */}
            <section id="hero-section" className="hero-section relative overflow-hidden px-6 pt-10 pb-24 lg:pt-16 lg:pb-32">

              {/* Animated blobs */}
              <motion.div className="blob blob-blush w-[500px] h-[500px] -top-20 -right-20 opacity-50"
                animate={{ scale: [1, 1.12, 1], x: [0, 20, 0] }} transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }} />
              <motion.div className="blob blob-lavender w-96 h-96 bottom-0 -left-10 opacity-35"
                animate={{ scale: [1, 1.08, 1], y: [0, -15, 0] }} transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 1 }} />
              <motion.div className="blob blob-nude w-72 h-72 top-1/3 left-1/3 opacity-30"
                animate={{ scale: [1, 1.15, 1], x: [0, -10, 0] }} transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut', delay: 2 }} />



              <div className="relative z-10 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

                {/* Left — staggered text reveal */}
                <motion.div
                  variants={staggerContainer}
                  initial="hidden" animate="show"
                  className="text-center lg:text-left"
                >
                  {/* Badge */}
                  <motion.div variants={fadeUp}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6"
                    style={{ background: '#f5eddf', border: '1px solid #d4bc98', color: '#8c6038' }}
                    whileHover={{ scale: 1.04 }}
                  >
                    <motion.span animate={{ rotate: [0, 20, -10, 0] }} transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 3 }}>
                      <Sparkles className="w-3.5 h-3.5" />
                    </motion.span>
                    <span className="text-xs font-bold tracking-wider uppercase">AI-Powered Personal Stylist</span>
                  </motion.div>

                  {/* Heading */}
                  <motion.h1
                    variants={fadeUp}
                    className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tight leading-[1.05] mb-6"
                    style={{ fontFamily: "'Rubik', sans-serif", color: '#3a2010' }}
                  >
                    Elevate Your<br />
                    <motion.span
                      className="gradient-text inline-block"
                      animate={{ opacity: [0.82, 1, 0.82] }}
                      transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                      style={{ backgroundSize: '100% auto' }}
                    >
                      Everyday Style
                    </motion.span>
                  </motion.h1>

                  {/* Subtext */}
                  <motion.p variants={fadeUp} className="text-base md:text-lg text-[#9b7a8a] max-w-md mx-auto lg:mx-0 mb-10 leading-relaxed">
                    Your personal fashion assistant that understands your wardrobe,
                    the weather, and every occasion — all in one beautiful space.
                  </motion.p>

                  {/* CTAs */}
                  <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                    <motion.button
                      id="hero-start-btn"
                      onClick={() => setStep(1)}
                      className="btn-premium flex items-center gap-2 group"
                      whileHover={{ scale: 1.05, y: -3 }}
                      whileTap={{ scale: 0.96 }}
                    >
                      Start Styling
                      <motion.span animate={{ x: [0, 4, 0] }} transition={{ duration: 1.2, repeat: Infinity }}>
                        <ChevronRight className="w-4 h-4" />
                      </motion.span>
                    </motion.button>
                    <motion.button
                      id="hero-wardrobe-btn"
                      onClick={() => navigate('/wardrobe')}
                      className="btn-outline-fem flex items-center gap-2"
                      whileHover={{ scale: 1.04, y: -2 }}
                      whileTap={{ scale: 0.96 }}
                    >
                      <ShoppingBag className="w-4 h-4" />
                      My Wardrobe
                    </motion.button>
                  </motion.div>
                </motion.div>

                {/* Right — Smart Styling UI cards */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.88 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.25, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                  className="relative flex justify-center items-center hidden lg:flex"
                >
                  <div className="relative w-[420px] h-[420px]">

                    {/* Pulsing glow rings */}
                    {[1, 0.65, 0.35].map((op, i) => (
                      <motion.div key={i}
                        className="absolute inset-0 rounded-full pointer-events-none"
                        style={{ border: `${1.5 - i * 0.4}px solid rgba(219,168,193,${op * 0.35})` }}
                        animate={{ scale: [1, 1.07 + i * 0.05, 1], opacity: [op * 0.5, op * 0.18, op * 0.5] }}
                        transition={{ duration: 3.2 + i, repeat: Infinity, ease: 'easeInOut', delay: i * 0.7 }}
                      />
                    ))}

                    {/* Central AI orb — slow spin with inner counter-spin icon */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <motion.div
                        className="w-[100px] h-[100px] rounded-full flex items-center justify-center"
                        style={{ background: 'linear-gradient(135deg, #d4bc98 0%, #c4a882 45%, #a08258 100%)', boxShadow: '0 12px 48px rgba(160,120,80,0.40)' }}
                        animate={{ rotate: 360 }}
                        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                      >
                        {/* counter-rotate so icon stays upright */}
                        <motion.div animate={{ rotate: -360 }} transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}>
                          <Sparkles className="w-10 h-10 text-white drop-shadow" />
                        </motion.div>
                      </motion.div>
                      {/* AI label below orb */}
                      <div className="absolute mt-28 text-center">
                        <p className="text-[10px] font-black uppercase tracking-widest text-[#c4a882]">SmartStyling AI</p>
                      </div>
                    </div>

                    {/* Orbiting smart-styling cards */}
                    {STYLE_CARDS.map(card => {
                      const rad = (card.angle * Math.PI) / 180;
                      const cx = Math.cos(rad) * card.radius;
                      const cy = Math.sin(rad) * card.radius;
                      return (
                        <motion.div
                          key={card.id}
                          className="absolute top-1/2 left-1/2"
                          initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
                          animate={{ opacity: 1, scale: 1, x: cx - 80, y: cy - 30 }}
                          transition={{ delay: card.delay, type: 'spring', stiffness: 130, damping: 16 }}
                          whileHover={{ scale: 1.06, zIndex: 20 }}
                        >
                          <motion.div
                            animate={{ y: [0, -10, 0] }}
                            transition={{ duration: card.floatDuration, repeat: Infinity, ease: 'easeInOut' }}
                          >
                            {card.content}
                          </motion.div>
                        </motion.div>
                      );
                    })}
                  </div>
                </motion.div>
              </div>
            </section>

            {/* Feature strip */}
            <section id="features-strip" className="py-16 px-6">
              <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
                {features.map((f, i) => (
                  <motion.div
                    key={f.label}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-60px' }}
                    transition={{ delay: 0.12 * i, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                    whileHover={{ y: -8, scale: 1.02 }}
                    className="premium-card rounded-3xl p-7 flex flex-col gap-4 cursor-default"
                  >
                    <motion.div
                      className="w-11 h-11 rounded-2xl flex items-center justify-center"
                      style={{ backgroundColor: f.color }}
                      whileHover={{ rotate: 10, scale: 1.15 }}
                      transition={{ type: 'spring', stiffness: 300 }}
                    >
                      <f.icon className="w-5 h-5" style={{ color: f.text }} />
                    </motion.div>
                    <div>
                      <h3 className="font-bold text-[#3d1f30] mb-1">{f.label}</h3>
                      <p className="text-sm text-[#9b7a8a] leading-relaxed">{f.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </section>
          </motion.div>
        )}

        {/* ── Step 1: Gender ── */}
        {step === 1 && (
          <motion.div key="gender" {...slideIn} transition={{ duration: 0.35 }}
            className="min-h-[80vh] flex flex-col items-center justify-center px-6 py-20">
            <p className="section-label mb-4">Personalise</p>
            <h2 className="text-4xl md:text-5xl font-black text-[#3d1f30] mb-3 tracking-tight text-center">
              Select your <span className="gradient-text">style preference</span>
            </h2>
            <p className="text-[#9b7a8a] mb-12 text-center">We'll tailor every recommendation to you.</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-3xl">
              {[
                { id: 'male',       label: 'Men',    icon: Briefcase,   bg: '#f9f0ea', iconBg: '#e8cbb6', text: '#7d4d34' },
                { id: 'female',     label: 'Women',  icon: ShoppingBag, bg: '#fff5f7', iconBg: '#ffd1df', text: '#a11942' },
                { id: 'non-binary', label: 'Unisex', icon: Sparkles,    bg: '#f8f5ff', iconBg: '#e2d5fd', text: '#612dcb' },
              ].map(g => (
                <motion.button key={g.id} id={`gender-${g.id}`}
                  whileHover={{ y: -8 }} whileTap={{ scale: 0.97 }}
                  onClick={() => handleGenderSelect(g.id)}
                  className="rounded-4xl p-10 flex flex-col items-center gap-4 border-2 transition-all"
                  style={{ background: g.bg, borderColor: g.iconBg }}>
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center"
                    style={{ backgroundColor: g.iconBg }}>
                    <g.icon className="w-7 h-7" style={{ color: g.text }} />
                  </div>
                  <p className="text-xl font-black text-[#3d1f30]">{g.label}</p>
                </motion.button>
              ))}
            </div>
            <BackBtn onClick={() => setStep(0)} />
          </motion.div>
        )}

        {/* ── Step 2: Weather ── */}
        {step === 2 && (
          <motion.div key="weather" {...slideIn} transition={{ duration: 0.35 }}
            className="min-h-[80vh] flex flex-col items-center justify-center px-6 py-20">
            <p className="section-label mb-4">Step 01 / 03</p>
            <h2 className="text-4xl md:text-5xl font-black text-[#3d1f30] mb-3 tracking-tight text-center">
              How's the <span className="gradient-text">weather</span> today?
            </h2>
            <p className="text-[#9b7a8a] mb-12 text-center">We'll adjust looks based on your climate.</p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-5 w-full max-w-3xl">
              {weatherOptions.map(w => (
                <motion.button key={w.id} id={`weather-${w.id}`}
                  whileHover={{ y: -8, scale: 1.03 }} whileTap={{ scale: 0.97 }}
                  onClick={() => handleWeatherSelect(w.id)}
                  className="premium-card rounded-3xl p-8 flex flex-col items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-xl"
                    style={{ backgroundColor: w.bg }}>
                    {w.emoji}
                  </div>
                  <span className="font-bold text-[#3d1f30]">{w.label}</span>
                </motion.button>
              ))}
            </div>
            <BackBtn onClick={() => setStep(1)} label="Back to Style" />
          </motion.div>
        )}

        {/* ── Step 3: Occasion ── */}
        {step === 3 && (
          <motion.div key="occasion" {...slideIn} transition={{ duration: 0.35 }}
            className="min-h-[80vh] flex flex-col items-center justify-center px-6 py-20">
            <p className="section-label mb-4">Step 02 / 03</p>
            <h2 className="text-4xl md:text-5xl font-black text-[#3d1f30] mb-3 tracking-tight text-center">
              What's the <span className="gradient-text">occasion</span>?
            </h2>
            <p className="text-[#9b7a8a] mb-12 text-center">Every event deserves a unique statement.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-5xl">
              {occasions.map(o => (
                <motion.button key={o.id} id={`occasion-${o.id}`}
                  whileHover={{ y: -10 }} whileTap={{ scale: 0.97 }}
                  onClick={() => handleOccasionSelect(o)}
                  className="premium-card rounded-4xl p-8 flex flex-col items-start gap-4 text-left">
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${o.color} flex items-center justify-center shadow-md`}>
                    <o.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-[#3d1f30] mb-1">{o.label}</h3>
                    <p className="text-xs text-[#9b7a8a] leading-relaxed">{o.description}</p>
                  </div>
                  <span className={`pill-badge ${o.pill}`}>{o.label}</span>
                </motion.button>
              ))}
            </div>
            <BackBtn onClick={() => setStep(2)} label="Back to Weather" />
          </motion.div>
        )}

        {/* ── Step 4: Sub-Occasion ── */}
        {step === 4 && (
          <motion.div key="sub" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            className="min-h-[80vh] flex flex-col items-center justify-center px-6 py-20">
            <p className="section-label mb-4">Final Step ✦</p>
            <h2 className="text-4xl md:text-5xl font-black text-[#3d1f30] mb-3 tracking-tight text-center">
              One last <span className="gradient-text">detail...</span>
            </h2>
            <p className="text-[#9b7a8a] mb-12 text-center">Specific details help us curate the perfect look.</p>

            <div className="flex flex-wrap justify-center gap-4 max-w-3xl">
              {occasions.find(o => o.id === selections.occasion)?.subs.map((sub, i) => (
                <motion.button key={sub} id={`sub-${sub.replace(/\s+/g,'-').toLowerCase()}`}
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  whileHover={{ scale: 1.06, y: -4 }} whileTap={{ scale: 0.96 }}
                  onClick={() => handleSubSelect(sub)}
                  className="premium-card px-8 py-5 rounded-3xl font-bold text-[#3d1f30] flex items-center gap-3 group">
                  {sub}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform text-[#dba8c1]" />
                </motion.button>
              ))}
            </div>
            <BackBtn onClick={() => setStep(3)} label="Back to Occasions" />
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
};

// Back button helper
const BackBtn = ({ onClick, label = 'Go Back' }) => (
  <button onClick={onClick}
    className="mt-12 flex items-center gap-2 text-sm text-[#9b7a8a] hover:text-[#b74275] font-semibold transition-colors">
    <span>←</span> {label}
  </button>
);

export default LandingPage;
