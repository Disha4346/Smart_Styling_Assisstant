// src/pages/OccasionDetailPage.jsx
// Shows sub-occasions for a selected occasion (e.g., Formal → Business Meeting, Job Interview…)
// Clicking a sub-occasion navigates to OutfitRecommendationPage.

import { useState } from "react";

const OCCASION_DETAILS = {
  formal: {
    hero: "👔",
    bg: "#1a2744",
    accent: "#6B8FD4",
    title: "Formal",
    sub: "Polished, sharp, and effortlessly authoritative",
    categories: [
      { id: "business-meeting", label: "Business Meeting", emoji: "🤝", desc: "Command every room you enter", tags: ["power suit", "structured", "minimal"] },
      { id: "job-interview",    label: "Job Interview",    emoji: "📋", desc: "First impressions, perfected",  tags: ["crisp", "confident", "professional"] },
      { id: "office-day",       label: "Office Day",       emoji: "💻", desc: "Elevated everyday work style",  tags: ["smart casual", "comfortable", "put-together"] },
      { id: "corporate-event",  label: "Corporate Event",  emoji: "🏛️", desc: "Stand out while fitting in",   tags: ["blazer", "tailored", "refined"] },
      { id: "presentation",     label: "Presentation",     emoji: "📊", desc: "Dress for the spotlight",       tags: ["bold", "structured", "memorable"] },
    ],
  },
  casual: {
    hero: "👟",
    bg: "#1a3020",
    accent: "#6BA88A",
    title: "Casual",
    sub: "Effortless everyday style that moves with you",
    categories: [
      { id: "college-day",  label: "College Day",  emoji: "🎒", desc: "Campus-ready, effortlessly cool", tags: ["denim", "graphic tee", "sneakers"] },
      { id: "coffee-date",  label: "Coffee Date",  emoji: "☕", desc: "Relaxed but put-together",          tags: ["soft knit", "minimal", "cosy"] },
      { id: "movie-night",  label: "Movie Night",  emoji: "🎬", desc: "Comfort meets casual cool",         tags: ["oversized", "soft fabrics", "dark tones"] },
      { id: "shopping",     label: "Shopping Day",  emoji: "🛍️", desc: "Walk all day, look great",         tags: ["comfortable", "trendy", "functional"] },
      { id: "hangout",      label: "Hangout",       emoji: "🎮", desc: "Relaxed vibes, good company",      tags: ["streetwear", "chill", "comfortable"] },
    ],
  },
  ethnic: {
    hero: "🌺",
    bg: "#3a1520",
    accent: "#D4786A",
    title: "Ethnic",
    sub: "Timeless tradition, modern sensibility",
    categories: [
      { id: "festive",    label: "Festive Season",  emoji: "🪔", desc: "Celebrate in splendour",          tags: ["silk", "embroidery", "festive colours"] },
      { id: "wedding",    label: "Wedding Guest",   emoji: "💍", desc: "Dressed for the celebration",     tags: ["lehenga", "sherwani", "traditional"] },
      { id: "puja",       label: "Puja / Temple",   emoji: "🙏", desc: "Graceful and respectful",          tags: ["cotton", "muted tones", "modest"] },
      { id: "sangeet",    label: "Sangeet",          emoji: "💃", desc: "Dance-ready ethnic glam",          tags: ["bright", "flowy", "festive"] },
      { id: "reception",  label: "Reception",        emoji: "✨", desc: "Polished ethnic elegance",         tags: ["embellished", "grand", "structured"] },
    ],
  },
  party: {
    hero: "🎉",
    bg: "#3a1540",
    accent: "#C478D4",
    title: "Party",
    sub: "Turn heads, own the room, dance all night",
    categories: [
      { id: "club",       label: "Club Night",    emoji: "🕺", desc: "Made for the dance floor",         tags: ["sequin", "bold", "midnight"] },
      { id: "birthday",   label: "Birthday Party",emoji: "🎂", desc: "The birthday look, elevated",      tags: ["statement", "fun", "celebratory"] },
      { id: "cocktail",   label: "Cocktail Party",emoji: "🍸", desc: "Elegant evening glamour",           tags: ["velvet", "refined", "chic"] },
      { id: "festival",   label: "Music Festival",emoji: "🎵", desc: "Festival ready, all-day energy",    tags: ["bohemian", "colourful", "eclectic"] },
      { id: "rooftop",    label: "Rooftop Party", emoji: "🌃", desc: "City lights & good vibes",          tags: ["smart casual", "layered", "night-ready"] },
    ],
  },
  travel: {
    hero: "✈️",
    bg: "#102030",
    accent: "#6A9EC4",
    title: "Travel",
    sub: "Smart, comfortable, ready for anything",
    categories: [
      { id: "long-haul",  label: "Long Haul Flight", emoji: "🛫", desc: "Comfortable but polished",       tags: ["wrinkle-free", "layered", "comfortable"] },
      { id: "city-hop",   label: "City Exploration", emoji: "🗺️", desc: "Walk-ready, photo-ready",        tags: ["smart casual", "versatile", "packable"] },
      { id: "beach",      label: "Beach Holiday",    emoji: "🏖️", desc: "Resort chic at its finest",      tags: ["linen", "breezy", "relaxed"] },
      { id: "mountain",   label: "Mountain Trek",    emoji: "⛰️", desc: "Technical style, rugged beauty", tags: ["layers", "functional", "durable"] },
      { id: "city-break", label: "Weekend Getaway",  emoji: "🏙️", desc: "Capsule wardrobe perfected",     tags: ["minimal", "versatile", "stylish"] },
    ],
  },
  sports: {
    hero: "🏃",
    bg: "#102818",
    accent: "#6AC478",
    title: "Sports",
    sub: "Performance meets style",
    categories: [
      { id: "gym",        label: "Gym Workout",   emoji: "💪", desc: "Lift in style",                    tags: ["compression", "breathable", "performance"] },
      { id: "running",    label: "Running",       emoji: "🏃", desc: "Speed meets aesthetics",            tags: ["lightweight", "moisture-wicking", "dynamic"] },
      { id: "yoga",       label: "Yoga / Pilates",emoji: "🧘", desc: "Fluid movement, clean lines",      tags: ["stretchy", "minimal", "zen"] },
      { id: "cycling",    label: "Cycling",       emoji: "🚴", desc: "Aerodynamic and bold",              tags: ["fitted", "functional", "sporty"] },
      { id: "athleisure", label: "Athleisure",    emoji: "👟", desc: "Sports style for everyday life",   tags: ["trendy", "comfortable", "versatile"] },
    ],
  },
  brunch: {
    hero: "☕",
    bg: "#2a1e10",
    accent: "#C4A46A",
    title: "Brunch",
    sub: "Sunday soft, croissant in hand",
    categories: [
      { id: "outdoor-garden",label: "Garden Brunch",  emoji: "🌻", desc: "Sun-dappled and effortless",   tags: ["floral", "linen", "summer"] },
      { id: "rooftop-brunch", label: "Rooftop Brunch",emoji: "🌅", desc: "Views and vibes combined",     tags: ["smart casual", "layered", "fresh"] },
      { id: "cafe",           label: "Café Date",      emoji: "🧁", desc: "Cottagecore meets city chic",   tags: ["soft fabrics", "muted tones", "feminine"] },
      { id: "hotel-brunch",   label: "Hotel Brunch",   emoji: "🥂", desc: "Elevated Sunday elegance",     tags: ["polished", "classic", "refined"] },
      { id: "picnic",         label: "Picnic",         emoji: "🧺", desc: "Relaxed outdoor charm",        tags: ["casual", "breezy", "natural"] },
    ],
  },
};

// Hydrangea-toned colour palette for this page
const PALETTE_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,400&family=Outfit:wght@300;400;500;600&display=swap');
  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
  :root{
    --bg:#0D0A14;--surface:#13101E;--surface-2:#1A1626;
    --border:rgba(180,159,212,.12);--border-h:rgba(180,159,212,.4);
    --text:#F0EAF8;--muted:rgba(160,140,190,.55);--accent:#B49FD4;
    --hydrangea:#7B68C8;--hydrangea-l:#A696E0;
    --ft:'Cormorant Garamond',serif;--fb:'Outfit',sans-serif;
  }
  body{background:var(--bg);font-family:var(--fb);color:var(--text)}
  @keyframes fadeUp{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)}}
  @keyframes fadeDown{from{opacity:0;transform:translateY(-14px)}to{opacity:1;transform:translateY(0)}}
`;

export default function OccasionDetailPage({ occasionId, weather, onSelectSub, onBack, onCustomize }) {
  const [hovered, setHovered] = useState(null);
  const data = OCCASION_DETAILS[occasionId] || OCCASION_DETAILS.formal;

  return (
    <>
      <style>{PALETTE_CSS + `
        .od-shell{min-height:100vh;background:var(--bg);display:flex;flex-direction:column}
        /* NAV */
        .od-nav{display:flex;align-items:center;justify-content:space-between;padding:1.2rem 2.5rem;border-bottom:.5px solid var(--border)}
        .od-nav-back{background:none;border:1px solid var(--border);border-radius:6px;padding:.4rem .9rem;font-family:var(--fb);font-size:.72rem;letter-spacing:.1em;text-transform:uppercase;color:var(--muted);cursor:pointer;transition:all .2s}
        .od-nav-back:hover{border-color:var(--border-h);color:var(--text)}
        .od-logo{font-family:var(--ft);font-size:1.35rem;letter-spacing:.06em}
        .od-logo em{font-style:italic;color:var(--accent)}
        .od-crumb{font-size:.68rem;letter-spacing:.14em;text-transform:uppercase;color:rgba(180,159,212,.35)}
        .od-crumb span{color:var(--accent)}
        /* HERO */
        .od-hero{padding:3rem 2.5rem 2rem;animation:fadeDown .5s ease both}
        .od-hero-eyebrow{font-size:.68rem;letter-spacing:.22em;text-transform:uppercase;color:rgba(180,159,212,.45);margin-bottom:.6rem}
        .od-hero-title{font-family:var(--ft);font-size:clamp(2.2rem,5vw,3.8rem);font-weight:500;line-height:1.1}
        .od-hero-title em{font-style:italic;color:var(--hydrangea-l)}
        .od-hero-sub{font-size:.88rem;color:var(--muted);margin-top:.5rem;font-weight:300;max-width:480px}
        .od-hero-tag{display:inline-flex;align-items:center;gap:.4rem;margin-top:1rem;font-size:.68rem;letter-spacing:.14em;text-transform:uppercase;color:rgba(180,159,212,.5);background:rgba(123,104,200,.08);border:1px solid rgba(123,104,200,.2);border-radius:20px;padding:.3rem .8rem}
        /* CUSTOMIZE STRIP */
        .od-customize{margin:0 2.5rem 2.5rem;background:linear-gradient(135deg,rgba(123,104,200,.12) 0%,rgba(166,150,224,.06) 100%);border:1px solid rgba(123,104,200,.25);border-radius:12px;padding:1.4rem 2rem;display:flex;align-items:center;justify-content:space-between;gap:1rem;animation:fadeUp .5s .1s ease both}
        .od-customize-left h3{font-family:var(--ft);font-size:1.3rem;font-weight:500;color:var(--text)}
        .od-customize-left h3 em{font-style:italic;color:var(--hydrangea-l)}
        .od-customize-left p{font-size:.78rem;color:var(--muted);margin-top:.3rem;font-weight:300}
        .od-customize-btn{background:var(--hydrangea);color:#fff;border:none;border-radius:8px;padding:.7rem 1.8rem;font-family:var(--fb);font-size:.82rem;font-weight:600;letter-spacing:.05em;cursor:pointer;transition:background .2s,transform .2s;white-space:nowrap;flex-shrink:0}
        .od-customize-btn:hover{background:var(--hydrangea-l);transform:translateY(-2px)}
        /* CATEGORIES LABEL */
        .od-section-label{padding:0 2.5rem;font-size:.68rem;letter-spacing:.2em;text-transform:uppercase;color:rgba(180,159,212,.4);margin-bottom:1.2rem}
        /* CATEGORIES GRID */
        .od-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:1rem;padding:0 2.5rem 4rem;animation:fadeUp .55s .15s ease both}
        /* CATEGORY CARD */
        .od-card{position:relative;background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:1.8rem 1.6rem;cursor:pointer;transition:transform .28s cubic-bezier(.34,1.4,.64,1),border-color .28s,background .28s;overflow:hidden}
        .od-card:hover{transform:translateY(-5px) scale(1.01);border-color:var(--border-h);background:var(--surface-2)}
        .od-card-glow{position:absolute;top:-30px;right:-30px;width:120px;height:120px;border-radius:50%;opacity:0;transition:opacity .3s;pointer-events:none}
        .od-card:hover .od-card-glow{opacity:.12}
        .od-card-emoji{font-size:2.2rem;margin-bottom:1rem;display:block}
        .od-card-label{font-family:var(--ft);font-size:1.2rem;font-weight:500;color:var(--text);line-height:1.2;margin-bottom:.3rem}
        .od-card-desc{font-size:.76rem;color:var(--muted);font-weight:300;line-height:1.5;margin-bottom:1rem}
        .od-card-tags{display:flex;flex-wrap:wrap;gap:.4rem}
        .od-tag{font-size:.6rem;letter-spacing:.1em;text-transform:uppercase;color:var(--accent);background:rgba(180,159,212,.1);border:1px solid rgba(180,159,212,.2);border-radius:4px;padding:.2rem .5rem}
        .od-card-arrow{position:absolute;bottom:1.2rem;right:1.2rem;font-size:.9rem;color:rgba(180,159,212,.3);transition:color .2s,transform .2s}
        .od-card:hover .od-card-arrow{color:var(--accent);transform:translate(2px,-2px)}
        @media(max-width:600px){.od-grid{grid-template-columns:1fr}.od-customize{flex-direction:column;text-align:center}}
      `}</style>

      <div className="od-shell">
        {/* Nav */}
        <nav className="od-nav">
          <button className="od-nav-back" onClick={onBack}>← Occasions</button>
          <div className="od-logo">dres<em>sed</em></div>
          <span className="od-crumb">Occasions › <span>{data.title}</span></span>
        </nav>

        {/* Hero */}
        <div className="od-hero">
          <p className="od-hero-eyebrow">Outfit Curation</p>
          <h1 className="od-hero-title">
            {data.title.slice(0,2)}<em>{data.title.slice(2)}</em>
          </h1>
          <p className="od-hero-sub">{data.sub}</p>
          <span className="od-hero-tag">
            <span style={{fontSize:"1rem"}}>{data.hero}</span>
            {data.categories.length} sub-occasions
          </span>
        </div>

        {/* Customize Strip */}
        <div className="od-customize">
          <div className="od-customize-left">
            <h3>Customize your <em>outfit</em></h3>
            <p>Let AI style you from scratch based on your preferences, body type & weather</p>
          </div>
          <button className="od-customize-btn" onClick={() => onCustomize?.(occasionId)}>
            ✦ AI Styling Page
          </button>
        </div>

        {/* Section label */}
        <p className="od-section-label">Choose your setting</p>

        {/* Categories */}
        <div className="od-grid">
          {data.categories.map((cat, i) => (
            <div
              key={cat.id}
              className="od-card"
              style={{ animationDelay: `${i * 0.06}s`, animation: "fadeUp .45s ease both" }}
              onClick={() => onSelectSub?.(occasionId, cat.id, cat.label)}
              onMouseEnter={() => setHovered(cat.id)}
              onMouseLeave={() => setHovered(null)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === "Enter" && onSelectSub?.(occasionId, cat.id, cat.label)}
            >
              <div
                className="od-card-glow"
                style={{ background: data.accent }}
              />
              <span className="od-card-emoji">{cat.emoji}</span>
              <div className="od-card-label">{cat.label}</div>
              <div className="od-card-desc">{cat.desc}</div>
              <div className="od-card-tags">
                {cat.tags.map(t => (
                  <span key={t} className="od-tag">{t}</span>
                ))}
              </div>
              <span className="od-card-arrow">↗</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
