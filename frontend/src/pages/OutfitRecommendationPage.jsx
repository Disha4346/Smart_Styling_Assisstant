// src/pages/OutfitRecommendationPage.jsx
// Full outfit display: top, bottom, shoes, accessories + Save, Similar, Price Compare

import { useState, useEffect } from "react";
import { outfitApi } from "../api";

// Fallback outfits when API is not connected
const FALLBACK_OUTFITS = {
  "business-meeting": {
    name: "The Authority Look",
    occasion: "Business Meeting",
    style: "Power Dressing",
    colorPalette: ["#2C3E6B","#F0EAF8","#8B6914","#4A4A5A"],
    items: [
      { role: "Top",        name: "Crisp White Oxford Shirt",  detail: "Slim fit, poplin cotton",    emoji: "👕", color: "#F8F6F0" },
      { role: "Bottom",     name: "Charcoal Wool Trousers",    detail: "Tailored cut, side pockets", emoji: "👖", color: "#3A3A4A" },
      { role: "Outerwear",  name: "Navy Structured Blazer",    detail: "Single-breasted, peak lapel",emoji: "🥼", color: "#1a2744" },
      { role: "Shoes",      name: "Oxford Brogues",            detail: "Tan leather, Goodyear welt", emoji: "👞", color: "#8B4513" },
      { role: "Accessory",  name: "Minimal Silver Watch",      detail: "36mm case, leather strap",   emoji: "⌚", color: "#C0C0C0" },
    ],
    tags: ["power suit","minimal","authoritative","tailored"],
    tip: "Tuck the shirt fully and keep accessories minimal. A pocket square in matching navy completes the look.",
  },
  "job-interview": {
    name: "First Impression",
    occasion: "Job Interview",
    style: "Confident Professional",
    colorPalette: ["#2C3E6B","#F0EAF8","#4A4A5A","#6B8FD4"],
    items: [
      { role: "Top",        name: "Light Blue Dress Shirt",    detail: "Classic fit, easy-iron",     emoji: "👔", color: "#C5D8F0" },
      { role: "Bottom",     name: "Slate Grey Trousers",       detail: "Flat-front, mid-rise",        emoji: "👖", color: "#6B7280" },
      { role: "Outerwear",  name: "Charcoal Blazer",           detail: "Structured shoulder, notch", emoji: "🥼", color: "#3A3A4A" },
      { role: "Shoes",      name: "Black Derby Shoes",         detail: "Polished, cap toe",           emoji: "👞", color: "#1A1A1A" },
      { role: "Accessory",  name: "Subtle Tie",                detail: "Silk, solid navy/grey",       emoji: "👔", color: "#2C3E6B" },
    ],
    tags: ["confident","clean","professional","classic"],
    tip: "Arrive pressed. The light shirt against a dark blazer creates visual hierarchy — perfect for first impressions.",
  },
};

const getFallbackOutfit = (subOccasionId) =>
  FALLBACK_OUTFITS[subOccasionId] || FALLBACK_OUTFITS["business-meeting"];

const BASE_CSS = `
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

export default function OutfitRecommendationPage({
  occasionId,
  subOccasionId,
  subOccasionLabel,
  weather,
  onBack,
  onPriceCompare,
  onSimilar,
}) {
  const [outfit, setOutfit] = useState(null);
  const [saved, setSaved]   = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeItem, setActiveItem] = useState(null);

  useEffect(() => {
    setLoading(true);
    // Try to fetch from API; fall back to static data
    outfitApi.getByOccasion(occasionId, { category: subOccasionId })
      .then((res) => {
        if (res.data && res.data.length > 0) {
          const d = res.data[0];
          setOutfit({
            name: d.name,
            occasion: subOccasionLabel,
            style: d.category,
            colorPalette: ["#2C3E6B","#F0EAF8","#B49FD4","#3A3A4A"],
            items: [
              { role: "Outfit",   name: d.name,        detail: d.description || "", emoji: "👗", color: "#2C3E6B" },
            ],
            tags: d.tags || [],
            tip: d.description || "Style with confidence.",
            price: d.price,
          });
        } else {
          setOutfit(getFallbackOutfit(subOccasionId));
        }
      })
      .catch(() => setOutfit(getFallbackOutfit(subOccasionId)))
      .finally(() => setLoading(false));
  }, [occasionId, subOccasionId]);

  if (loading) return <LoadingShell />;
  if (!outfit) return null;

  return (
    <>
      <style>{BASE_CSS + `
        .or-shell{min-height:100vh;background:var(--bg);display:flex;flex-direction:column}
        /* NAV */
        .or-nav{display:flex;align-items:center;justify-content:space-between;padding:1.2rem 2.5rem;border-bottom:.5px solid var(--border)}
        .or-back{background:none;border:1px solid var(--border);border-radius:6px;padding:.4rem .9rem;font-family:var(--fb);font-size:.72rem;letter-spacing:.1em;text-transform:uppercase;color:var(--muted);cursor:pointer;transition:all .2s}
        .or-back:hover{border-color:var(--border-h);color:var(--text)}
        .or-logo{font-family:var(--ft);font-size:1.35rem;letter-spacing:.06em}
        .or-logo em{font-style:italic;color:var(--accent)}
        .or-crumb{font-size:.65rem;letter-spacing:.12em;text-transform:uppercase;color:rgba(180,159,212,.35)}
        .or-crumb span{color:var(--accent)}
        /* LAYOUT */
        .or-body{display:grid;grid-template-columns:1fr 1.1fr;gap:3rem;padding:3rem 2.5rem 4rem;max-width:1100px;margin:0 auto;width:100%;animation:fadeUp .5s ease both}
        @media(max-width:768px){.or-body{grid-template-columns:1fr;gap:2rem}}
        /* LEFT — outfit visual */
        .or-visual{display:flex;flex-direction:column;gap:1.5rem}
        .or-outfit-hero{background:var(--surface);border:1px solid var(--border);border-radius:16px;padding:3rem 2rem;display:flex;flex-direction:column;align-items:center;gap:1rem;position:relative;overflow:hidden}
        .or-outfit-glow{position:absolute;top:-60px;left:50%;transform:translateX(-50%);width:200px;height:200px;background:radial-gradient(circle,rgba(123,104,200,.2) 0%,transparent 70%);pointer-events:none}
        .or-outfit-emoji{font-size:5rem;animation:fadeDown .6s ease both}
        .or-outfit-name{font-family:var(--ft);font-size:1.8rem;font-weight:500;text-align:center;color:var(--text)}
        .or-outfit-name em{font-style:italic;color:var(--hydrangea-l)}
        .or-outfit-occasion{font-size:.7rem;letter-spacing:.18em;text-transform:uppercase;color:var(--accent);margin-top:-.3rem}
        /* COLOUR PALETTE */
        .or-palette{display:flex;gap:.5rem;margin-top:.5rem}
        .or-swatch{width:28px;height:28px;border-radius:50%;border:2px solid rgba(255,255,255,.1);transition:transform .2s}
        .or-swatch:hover{transform:scale(1.2)}
        /* TAGS */
        .or-tags{display:flex;flex-wrap:wrap;gap:.4rem;justify-content:center}
        .or-tag{font-size:.6rem;letter-spacing:.1em;text-transform:uppercase;color:var(--accent);background:rgba(180,159,212,.1);border:1px solid rgba(180,159,212,.2);border-radius:4px;padding:.2rem .5rem}
        /* STYLIST TIP */
        .or-tip{background:rgba(123,104,200,.08);border:1px solid rgba(123,104,200,.2);border-radius:10px;padding:1rem 1.2rem}
        .or-tip-label{font-size:.6rem;letter-spacing:.15em;text-transform:uppercase;color:var(--hydrangea-l);margin-bottom:.4rem}
        .or-tip-text{font-size:.82rem;color:var(--muted);line-height:1.6;font-weight:300}
        /* RIGHT — items + actions */
        .or-right{display:flex;flex-direction:column;gap:1.5rem}
        .or-section-title{font-family:var(--ft);font-size:1.6rem;font-weight:500;margin-bottom:.2rem}
        .or-section-title em{font-style:italic;color:var(--accent)}
        .or-section-sub{font-size:.78rem;color:var(--muted);font-weight:300}
        /* ITEMS LIST */
        .or-items{display:flex;flex-direction:column;gap:.7rem}
        .or-item{display:flex;align-items:center;gap:1rem;background:var(--surface);border:1px solid var(--border);border-radius:10px;padding:.9rem 1.1rem;cursor:pointer;transition:border-color .2s,background .2s}
        .or-item:hover,.or-item.active{border-color:var(--border-h);background:var(--surface-2)}
        .or-item-dot{width:10px;height:10px;border-radius:50%;flex-shrink:0;border:2px solid rgba(255,255,255,.15)}
        .or-item-role{font-size:.6rem;letter-spacing:.14em;text-transform:uppercase;color:var(--muted);min-width:70px}
        .or-item-name{font-size:.88rem;font-weight:500;color:var(--text);flex:1}
        .or-item-detail{font-size:.72rem;color:var(--muted);font-weight:300}
        /* ACTIONS */
        .or-actions{display:flex;flex-direction:column;gap:.7rem}
        .or-action-primary{background:var(--hydrangea);color:#fff;border:none;border-radius:8px;padding:.85rem 1.5rem;font-family:var(--fb);font-size:.85rem;font-weight:600;letter-spacing:.05em;cursor:pointer;transition:background .2s,transform .2s;width:100%;text-align:left;display:flex;align-items:center;gap:.7rem}
        .or-action-primary:hover{background:var(--hydrangea-l);transform:translateY(-2px)}
        .or-action-primary.saved{background:rgba(123,104,200,.25);color:var(--accent)}
        .or-action-secondary{background:none;border:1px solid var(--border);border-radius:8px;padding:.85rem 1.5rem;font-family:var(--fb);font-size:.85rem;font-weight:400;letter-spacing:.04em;cursor:pointer;transition:border-color .2s,background .2s;width:100%;text-align:left;display:flex;align-items:center;gap:.7rem;color:var(--text)}
        .or-action-secondary:hover{border-color:var(--border-h);background:var(--surface-2)}
        .or-action-icon{font-size:1.1rem;flex-shrink:0}
      `}</style>

      <div className="or-shell">
        {/* Nav */}
        <nav className="or-nav">
          <button className="or-back" onClick={onBack}>← Back</button>
          <div className="or-logo">dres<em>sed</em></div>
          <span className="or-crumb">
            {occasionId} › {subOccasionLabel} › <span>Outfit</span>
          </span>
        </nav>

        <div className="or-body">
          {/* LEFT */}
          <div className="or-visual">
            <div className="or-outfit-hero">
              <div className="or-outfit-glow" />
              <div className="or-outfit-emoji">
                {outfit.items?.[0]?.emoji || "👗"}
              </div>
              <div className="or-outfit-name">
                {outfit.name.slice(0,3)}<em>{outfit.name.slice(3)}</em>
              </div>
              <div className="or-outfit-occasion">{outfit.occasion}</div>
              <div className="or-palette">
                {outfit.colorPalette.map((c, i) => (
                  <div key={i} className="or-swatch" style={{ background: c }} title={c} />
                ))}
              </div>
              <div className="or-tags">
                {outfit.tags.map(t => <span key={t} className="or-tag">{t}</span>)}
              </div>
            </div>

            <div className="or-tip">
              <div className="or-tip-label">✦ Stylist's Tip</div>
              <div className="or-tip-text">{outfit.tip}</div>
            </div>
          </div>

          {/* RIGHT */}
          <div className="or-right">
            <div>
              <h2 className="or-section-title">
                Your <em>look</em>
              </h2>
              <p className="or-section-sub">
                {outfit.style} · {weather ? `Styled for ${weather}` : "All seasons"}
              </p>
            </div>

            <div className="or-items">
              {outfit.items.map((item, i) => (
                <div
                  key={i}
                  className={`or-item${activeItem === i ? " active" : ""}`}
                  onClick={() => setActiveItem(activeItem === i ? null : i)}
                >
                  <div className="or-item-dot" style={{ background: item.color }} />
                  <span className="or-item-role">{item.role}</span>
                  <div style={{ flex: 1 }}>
                    <div className="or-item-name">{item.name}</div>
                    {activeItem === i && (
                      <div className="or-item-detail" style={{ marginTop: ".25rem" }}>
                        {item.detail}
                      </div>
                    )}
                  </div>
                  <span style={{ fontSize: "1.4rem" }}>{item.emoji}</span>
                </div>
              ))}
            </div>

            {outfit.price && (
              <div style={{ fontSize: ".8rem", color: "var(--accent)", padding: ".4rem 0" }}>
                Starting from ₹{outfit.price.toLocaleString("en-IN")}
              </div>
            )}

            <div className="or-actions">
              <button
                className={`or-action-primary${saved ? " saved" : ""}`}
                onClick={() => setSaved(!saved)}
              >
                <span className="or-action-icon">{saved ? "✓" : "♡"}</span>
                {saved ? "Saved to Wardrobe" : "Save this Outfit"}
              </button>
              <button
                className="or-action-secondary"
                onClick={() => onPriceCompare?.(outfit)}
              >
                <span className="or-action-icon">🏷️</span>
                Compare Prices
              </button>
              <button
                className="or-action-secondary"
                onClick={() => onSimilar?.(occasionId)}
              >
                <span className="or-action-icon">✦</span>
                Show Similar Outfits
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function LoadingShell() {
  return (
    <div style={{ minHeight: "100vh", background: "#0D0A14", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.4rem", color: "rgba(180,159,212,.4)", animation: "pulse 1.4s ease-in-out infinite" }}>
        Styling your look…
      </div>
      <style>{`@keyframes pulse{0%,100%{opacity:.3}50%{opacity:1}}`}</style>
    </div>
  );
}
