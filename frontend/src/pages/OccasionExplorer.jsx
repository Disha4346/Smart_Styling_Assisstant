// src/pages/OccasionExplorer.jsx
// Live-data version.  Fires onOccasionClick(occId) so App.jsx can navigate
// to OccasionDetailPage — keeps explorer purely presentational.

import { useState, useRef, useEffect, forwardRef } from "react";
import { useOutfitsByOccasion } from "../hooks/useOutfits";

// ── Static occasion metadata ─────────────────────────────────────────────────
const OCCASION_META = [
  { id:"formal",  name:"Formal",     tag:"Polished & Sharp",    emoji:"👔", bg:"#1a2744", sub:"Polished, sharp, and effortlessly authoritative" },
  { id:"casual",  name:"Casual",     tag:"Everyday & Relaxed",  emoji:"👟", bg:"#1a3020", sub:"Effortless everyday style that moves with you" },
  { id:"ethnic",  name:"Ethnic",     tag:"Timeless Tradition",  emoji:"🌺", bg:"#3a1520", sub:"Timeless tradition, modern sensibility" },
  { id:"party",   name:"Party",      tag:"Bold & Festive",      emoji:"🎉", bg:"#3a1540", sub:"Turn heads, own the room, dance all night" },
  { id:"travel",  name:"Travel",     tag:"Rugged & Active",     emoji:"✈️", bg:"#102030", sub:"Smart, comfortable, ready for anything" },
  { id:"sports",  name:"Sports",     tag:"Performance Style",   emoji:"🏃", bg:"#102818", sub:"Performance meets style" },
  { id:"brunch",  name:"Brunch",     tag:"Soft & Effortful",    emoji:"☕", bg:"#2a1e10", sub:"Sunday soft, croissant in hand" },
];

const OCCASION_EMOJIS = {
  formal: ["🧥","👕","🥼","🖤","✨","🕴","📎","👖"],
  casual: ["🌿","👖","🧶","🤍","🌱","🎨"],
  ethnic: ["🌺","👘","🥻","✨","💎","🪷"],
  party:  ["✨","🍇","🎨","🥂","💫","⚡"],
  date:   ["🌸","🍷","🤍","🌺","🖤","💚"],
  brunch: ["🌾","🌻","🧡","🪸","⛵","🌼"],
  travel: ["🧳","🗺️","🌤","🏖","⛰","📦"],
  sports: ["💪","🏃","🧘","🚴","👟","⚡"],
};

const OUTFIT_PALETTES = {
  formal: ["#1e2a3a","#2a2a3a","#1a2438","#222028","#2a1f35","#181520","#1a2030","#1e2830"],
  casual: ["#1e2e1e","#1a2430","#2a2418","#1e1e28","#1a2820","#281e18"],
  ethnic: ["#3a1520","#2a1030","#381818","#201030","#2a0e18","#2a1828"],
  party:  ["#28103a","#2a0e30","#201040","#2a2010","#1e1030","#301030"],
  date:   ["#2a1018","#2a0e10","#282018","#2a1820","#180e20","#101e14"],
  brunch: ["#282018","#281e10","#2a1808","#241810","#182030","#201a10"],
  travel: ["#101a28","#161e2a","#201814","#1e2010","#141e14","#1a1a24"],
  sports: ["#102818","#0e2010","#182818","#1e2810","#142010","#101e10"],
};

// ── ShatterCanvas ─────────────────────────────────────────────────────────────
function ShatterCanvas({ canvasRef }) {
  return (
    <canvas ref={canvasRef} style={{ position:"absolute", inset:0, pointerEvents:"none", zIndex:50, display:"none" }} />
  );
}

// ── SkeletonCard ──────────────────────────────────────────────────────────────
function SkeletonCard({ idx }) {
  return (
    <div className="outfit-card skeleton-card" style={{ animationDelay:`${idx*0.04}s` }}>
      <div className="outfit-img skeleton-img" />
      <div className="outfit-meta">
        <div className="skeleton-line" style={{ width:"65%", marginBottom:"6px" }} />
        <div className="skeleton-line" style={{ width:"45%" }} />
      </div>
    </div>
  );
}

// ── OutfitCard ────────────────────────────────────────────────────────────────
function OutfitCard({ outfit, idx, occasionId }) {
  const palette = OUTFIT_PALETTES[occasionId] || OUTFIT_PALETTES.formal;
  const emojis  = OCCASION_EMOJIS[occasionId] || ["👗"];
  const bgColor = palette[idx % palette.length];
  const emoji   = emojis[idx % emojis.length];

  return (
    <div className="outfit-card" style={{ animationDelay:`${idx*0.05}s` }}>
      {outfit.imageUrl ? (
        <div className="outfit-img">
          <img src={outfit.imageUrl} alt={outfit.name} style={{ width:"100%", height:"100%", objectFit:"cover" }} loading="lazy"
            onError={(e) => {
              e.currentTarget.parentElement.innerHTML = `<span style="font-size:3rem">${emoji}</span><div class="outfit-img-overlay"></div>`;
              e.currentTarget.parentElement.style.background = bgColor;
            }}
          />
          <div className="outfit-img-overlay" />
        </div>
      ) : (
        <div className="outfit-img" style={{ background: bgColor }}>
          <span style={{ fontSize:"3rem" }}>{emoji}</span>
          <div className="outfit-img-overlay" />
        </div>
      )}
      <div className="outfit-badge">{outfit.category}</div>
      <div className="outfit-meta">
        <div className="outfit-name">{outfit.name}</div>
        <div className="outfit-desc">{outfit.description || "\u00a0"}</div>
        {outfit.price && <div className="outfit-price">₹{outfit.price.toLocaleString("en-IN")}</div>}
      </div>
    </div>
  );
}

// ── DetailPage (inline — shown after shatter, before navigating to OccasionDetailPage) ──
function DetailPage({ occ, onBack, onDiveDeeper }) {
  const [activeFilter, setActiveFilter] = useState("All");
  const { outfits, filters, loading, error } = useOutfitsByOccasion(occ?.id, activeFilter);

  useEffect(() => { setActiveFilter("All"); }, [occ]);
  if (!occ) return null;
  const titleBreak = Math.min(2, occ.name.length - 1);

  return (
    <div className="detail-page visible">
      <nav className="detail-nav">
        <button className="back-btn" onClick={onBack}>← Back</button>
        <span className="detail-breadcrumb">
          Occasions &rsaquo; <span className="breadcrumb-active">{occ.name}</span>
        </span>
        <button
          className="back-btn"
          style={{ marginLeft:"auto", borderColor:"rgba(123,104,200,.3)", color:"rgba(166,150,224,.7)" }}
          onClick={() => onDiveDeeper?.(occ.id)}
        >
          Browse Sub-Occasions →
        </button>
      </nav>
      <div className="detail-hero">
        <div className="detail-hero-left">
          <p className="eyebrow">Outfit Curation</p>
          <h2 className="detail-title">
            {occ.name.slice(0, titleBreak)}<em>{occ.name.slice(titleBreak)}</em>
          </h2>
          <p className="detail-subtitle">{occ.sub}</p>
        </div>
        <div className="detail-filters">
          {filters.map(f => (
            <button key={f} className={`filter-pill${activeFilter===f?" active":""}`} onClick={() => setActiveFilter(f)}>{f}</button>
          ))}
        </div>
      </div>
      <div className="outfit-section">
        {error && <div className="api-error">⚠ Could not load outfits: {error}</div>}
        <div className="outfit-grid">
          {loading
            ? Array.from({length:6}).map((_,i) => <SkeletonCard key={i} idx={i} />)
            : outfits.map((o,i) => <OutfitCard key={o.id||o._id} outfit={o} idx={i} occasionId={occ.id} />)
          }
          {!loading && !error && outfits.length===0 && (
            <p className="empty-state">No outfits found for this filter.</p>
          )}
        </div>
      </div>
    </div>
  );
}

// ── OccasionCard ──────────────────────────────────────────────────────────────
const OccasionCard = forwardRef(function OccasionCard({ occ, onClick, hidden }, ref) {
  return (
    <div
      ref={ref}
      className="occ-card"
      style={{ opacity: hidden ? 0 : 1 }}
      onClick={() => onClick(occ)}
      role="button"
      tabIndex={0}
      onKeyDown={e => e.key==="Enter" && onClick(occ)}
      aria-label={`Explore ${occ.name} outfits`}
    >
      <div className="occ-bg" style={{ background:occ.bg }}>{occ.emoji}</div>
      <div className="occ-overlay" />
      <div className="occ-info">
        <div className="occ-name">{occ.name}</div>
        <div className="occ-tag">{occ.tag}</div>
      </div>
      <div className="occ-arrow">↗</div>
    </div>
  );
});

// ── Main OccasionExplorer ─────────────────────────────────────────────────────
export default function OccasionExplorer({ weather, onBackToWeather, onOccasionClick }) {
  const [selectedOcc, setSelectedOcc]     = useState(null);
  const [shatterTarget, setShatterTarget] = useState(null);
  const [transitioning, setTransitioning] = useState(false);
  const canvasRef = useRef(null);
  const appRef    = useRef(null);
  const cardRefs  = useRef({});

  function triggerShatter(occ, cardEl) {
    if (transitioning) return;
    setTransitioning(true);
    setShatterTarget(occ.id);
    const canvas = canvasRef.current;
    const app    = appRef.current;
    if (!canvas || !app) return;
    const rect    = cardEl.getBoundingClientRect();
    const appRect = app.getBoundingClientRect();
    canvas.style.display = "block";
    canvas.width  = app.offsetWidth;
    canvas.height = app.offsetHeight;
    const ctx  = canvas.getContext("2d");
    const COLS = 8, ROWS = 10;
    const tw   = rect.width  / COLS;
    const th   = rect.height / ROWS;
    const ox   = rect.left - appRect.left;
    const oy   = rect.top  - appRect.top;
    const pieces = [];
    for (let row = 0; row < ROWS; row++) {
      for (let col = 0; col < COLS; col++) {
        const angle = Math.atan2(row-ROWS/2, col-COLS/2);
        const dist  = Math.sqrt((col-COLS/2)**2 + (row-ROWS/2)**2);
        const speed = 2 + dist*1.5 + Math.random()*2;
        pieces.push({ x:ox+col*tw, y:oy+row*th, w:tw-1, h:th-1, tx:Math.cos(angle)*speed, ty:Math.sin(angle)*speed, rot:0, rotSpeed:(Math.random()-.5)*.18, alpha:1, delay:Math.floor(dist*1.5), frame:0, emoji:occ.emoji, bg:occ.bg });
      }
    }
    let frame = 0;
    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let allGone = true;
      pieces.forEach(p => {
        if (p.frame < p.delay) { p.frame++; allGone = false; return; }
        p.x += p.tx*1.6; p.y += p.ty*1.6; p.rot += p.rotSpeed;
        p.alpha = Math.max(0, p.alpha - 0.032);
        if (p.alpha > 0) {
          allGone = false;
          ctx.save();
          ctx.globalAlpha = p.alpha;
          ctx.translate(p.x+p.w/2, p.y+p.h/2);
          ctx.rotate(p.rot);
          ctx.fillStyle = p.bg;
          ctx.fillRect(-p.w/2, -p.h/2, p.w, p.h);
          ctx.font = `${Math.min(p.h,p.w)*.6}px sans-serif`;
          ctx.textAlign = "center"; ctx.textBaseline = "middle";
          ctx.fillText(p.emoji, 0, 0);
          ctx.restore();
        }
      });
      if (!allGone && frame++ < 55) requestAnimationFrame(animate);
      else { canvas.style.display = "none"; setSelectedOcc(occ); setTransitioning(false); setShatterTarget(null); }
    }
    animate();
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;1,400;1,500&family=Outfit:wght@300;400;500;600&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        :root{--bg:#0D0A14;--surface:#13101E;--surface-2:#1A1626;--border:rgba(180,159,212,.12);--border-hover:rgba(180,159,212,.4);--text:#F0EAF8;--muted:rgba(160,140,190,.55);--accent:#B49FD4;--hydrangea:#7B68C8;--hydrangea-l:#A696E0;--ft:'Cormorant Garamond',serif;--fb:'Outfit',sans-serif;}
        .app-shell{min-height:100vh;background:var(--bg);font-family:var(--fb);color:var(--text);position:relative;overflow:hidden}
        .main-nav{display:flex;align-items:center;justify-content:space-between;padding:1.4rem 2.5rem;border-bottom:.5px solid var(--border);animation:fadeDown .4s ease both}
        .logo{font-family:var(--ft);font-size:1.4rem;letter-spacing:.06em}.logo em{font-style:italic;color:var(--accent)}
        .nav-links{display:flex;gap:2rem}
        .nav-link{font-size:.75rem;letter-spacing:.14em;text-transform:uppercase;color:var(--muted);cursor:pointer;background:none;border:none;font-family:var(--fb);transition:color .2s}
        .nav-link:hover,.nav-link.active{color:var(--text)}
        .nav-right{font-size:.75rem;letter-spacing:.1em;text-transform:uppercase;color:var(--muted)}
        .home-page{padding:3rem 2.5rem 4rem}
        .home-header{margin-bottom:3rem;animation:fadeDown .5s .05s ease both}
        .home-eyebrow{font-size:.68rem;letter-spacing:.22em;text-transform:uppercase;color:rgba(180,159,212,.45);margin-bottom:.6rem}
        .home-title{font-family:var(--ft);font-size:clamp(2rem,4vw,3.2rem);font-weight:500;line-height:1.18}
        .home-title em{font-style:italic;color:var(--accent)}
        .home-sub{font-size:.85rem;color:var(--muted);margin-top:.5rem;font-weight:300}
        .occasions-label{font-size:.68rem;letter-spacing:.2em;text-transform:uppercase;color:rgba(180,159,212,.4);margin-bottom:1.4rem}
        .occasions-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:1.2rem;animation:fadeUp .5s .1s ease both}
        @media(max-width:800px){.occasions-grid{grid-template-columns:repeat(3,1fr)}}
        @media(max-width:520px){.occasions-grid{grid-template-columns:repeat(2,1fr)}}
        .occ-card{position:relative;border-radius:10px;overflow:hidden;cursor:pointer;aspect-ratio:3/4;border:1px solid var(--border);transition:transform .3s cubic-bezier(.34,1.4,.64,1),border-color .3s,opacity .2s;outline:none;user-select:none}
        .occ-card:hover{transform:translateY(-5px) scale(1.02);border-color:var(--border-hover)}
        .occ-bg{width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-size:3.5rem;transition:transform .4s ease}
        .occ-card:hover .occ-bg{transform:scale(1.06)}
        .occ-overlay{position:absolute;inset:0;background:linear-gradient(to top,rgba(8,5,16,.92) 0%,rgba(8,5,16,.3) 55%,transparent 100%)}
        .occ-info{position:absolute;bottom:0;left:0;right:0;padding:1.1rem 1rem .9rem}
        .occ-name{font-family:var(--ft);font-size:1.25rem;font-weight:500;color:#fff;letter-spacing:.03em;line-height:1}
        .occ-tag{font-size:.65rem;letter-spacing:.15em;text-transform:uppercase;color:rgba(200,185,230,.55);margin-top:.35rem;font-weight:300}
        .occ-arrow{position:absolute;top:.9rem;right:.9rem;width:28px;height:28px;border-radius:50%;border:1px solid rgba(255,255,255,.15);display:flex;align-items:center;justify-content:center;opacity:0;transition:opacity .25s;color:rgba(255,255,255,.7);font-size:.8rem}
        .occ-card:hover .occ-arrow{opacity:1}
        .detail-page{position:absolute;inset:0;background:var(--bg);opacity:0;pointer-events:none;overflow-y:auto;z-index:40;min-height:100vh;transition:opacity .35s ease}
        .detail-page.visible{opacity:1;pointer-events:all}
        .detail-nav{display:flex;align-items:center;gap:1rem;padding:1.4rem 2.5rem;border-bottom:.5px solid var(--border)}
        .back-btn{background:none;border:1px solid var(--border);border-radius:6px;padding:.45rem 1rem;font-family:var(--fb);font-size:.75rem;letter-spacing:.1em;text-transform:uppercase;color:var(--muted);cursor:pointer;transition:color .2s,border-color .2s}
        .back-btn:hover{color:var(--text);border-color:var(--border-hover)}
        .detail-breadcrumb{font-size:.72rem;letter-spacing:.12em;text-transform:uppercase;color:rgba(180,159,212,.35)}
        .breadcrumb-active{color:var(--accent)}
        .detail-hero{padding:2.5rem 2.5rem 1.5rem;display:flex;align-items:flex-end;justify-content:space-between;gap:1rem;flex-wrap:wrap}
        .detail-hero-left .eyebrow{font-size:.68rem;letter-spacing:.2em;text-transform:uppercase;color:rgba(180,159,212,.45);margin-bottom:.5rem}
        .detail-title{font-family:var(--ft);font-size:clamp(2rem,5vw,3.4rem);font-weight:500;line-height:1.1}
        .detail-title em{font-style:italic;color:var(--accent)}
        .detail-subtitle{font-size:.85rem;color:var(--muted);margin-top:.4rem;font-weight:300;max-width:420px}
        .detail-filters{display:flex;gap:.6rem;flex-wrap:wrap;align-items:center}
        .filter-pill{background:none;border:1px solid var(--border);border-radius:20px;padding:.38rem .9rem;font-family:var(--fb);font-size:.7rem;letter-spacing:.1em;text-transform:uppercase;color:var(--muted);cursor:pointer;transition:all .2s}
        .filter-pill:hover,.filter-pill.active{border-color:rgba(180,159,212,.55);color:var(--text);background:rgba(180,159,212,.08)}
        .outfit-section{padding:0 2.5rem 3rem}
        .outfit-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:1rem}
        .outfit-card{border-radius:10px;overflow:hidden;border:1px solid var(--border);cursor:pointer;transition:transform .28s cubic-bezier(.34,1.4,.64,1),border-color .28s;position:relative;animation:fadeUp .4s ease both}
        .outfit-card:hover{transform:translateY(-4px);border-color:rgba(180,159,212,.35)}
        .outfit-img{width:100%;aspect-ratio:2/3;display:flex;align-items:center;justify-content:center;font-size:3rem;position:relative;overflow:hidden;transition:transform .35s ease}
        .outfit-card:hover .outfit-img{transform:scale(1.04)}
        .outfit-img-overlay{position:absolute;inset:0;background:linear-gradient(to top,rgba(8,5,16,.75) 0%,transparent 50%)}
        .outfit-meta{padding:.75rem .9rem .8rem;background:var(--surface)}
        .outfit-name{font-size:.85rem;font-weight:500;color:var(--text);line-height:1.3}
        .outfit-desc{font-size:.7rem;color:var(--muted);margin-top:.25rem;font-weight:300;min-height:1em}
        .outfit-price{font-size:.72rem;color:var(--accent);margin-top:.4rem}
        .outfit-badge{position:absolute;top:.6rem;left:.6rem;background:rgba(180,159,212,.15);border:1px solid rgba(180,159,212,.25);border-radius:4px;font-size:.58rem;letter-spacing:.12em;text-transform:uppercase;color:var(--accent);padding:.2rem .5rem}
        .skeleton-img{background:rgba(180,159,212,.06);animation:pulse 1.4s ease-in-out infinite}
        .skeleton-line{height:10px;background:rgba(180,159,212,.08);border-radius:4px;animation:pulse 1.4s ease-in-out infinite}
        @keyframes pulse{0%,100%{opacity:.5}50%{opacity:1}}
        .api-error{color:#e88;font-size:.82rem;padding:1rem 0 1.5rem}
        .empty-state{color:var(--muted);font-size:.82rem;padding:1rem 0;grid-column:1/-1}
        @keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
        @keyframes fadeDown{from{opacity:0;transform:translateY(-12px)}to{opacity:1;transform:translateY(0)}}
      `}</style>

      <div className="app-shell" ref={appRef}>
        <ShatterCanvas canvasRef={canvasRef} />

        {!selectedOcc && (
          <>
            <nav className="main-nav">
              <div className="logo">dres<em>sed</em></div>
              <div className="nav-links">
                <button className="nav-link active">Occasions</button>
                <button className="nav-link" onClick={() => onOccasionClick?.("__wardrobe__")}>Wardrobe</button>
                <button className="nav-link">Trending</button>
                <button className="nav-link">Saved</button>
              </div>
              <div className="nav-right">{weather ? `${weather} season` : "All seasons"}</div>
            </nav>

            <div className="home-page">
              <div className="home-header">
                <p className="home-eyebrow">Smart Styling Assistant</p>
                <h1 className="home-title">Dress for the <em>moment</em></h1>
                <p className="home-sub">Choose your occasion — we'll handle the rest</p>
              </div>
              <p className="occasions-label">Occasions</p>
              <div className="occasions-grid">
                {OCCASION_META.map(occ => (
                  <OccasionCard
                    key={occ.id}
                    occ={occ}
                    hidden={shatterTarget === occ.id}
                    onClick={o => {
                      const el = cardRefs.current[o.id];
                      if (el) triggerShatter(o, el);
                    }}
                    ref={el => { if (el) cardRefs.current[occ.id] = el; }}
                  />
                ))}
              </div>
            </div>
          </>
        )}

        {selectedOcc && (
          <DetailPage
            occ={selectedOcc}
            onBack={() => setSelectedOcc(null)}
            onDiveDeeper={(occId) => {
              setSelectedOcc(null);
              onOccasionClick?.(occId);
            }}
          />
        )}
      </div>
    </>
  );
}
