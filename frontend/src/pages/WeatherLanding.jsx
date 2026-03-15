// src/pages/WeatherLanding.jsx
import { useState } from "react";

const WEATHER = [
  { id:"summer",  label:"Summer",  emoji:"☀️", sub:"Hot & Sunny",       bg:"#E8871A" },
  { id:"winter",  label:"Winter",  emoji:"❄️", sub:"Cold & Crisp",       bg:"#4A6FA5" },
  { id:"monsoon", label:"Monsoon", emoji:"🌧️", sub:"Wet & Breezy",       bg:"#2E7D9E" },
  { id:"spring",  label:"Spring",  emoji:"🌸", sub:"Fresh & Blooming",   bg:"#B5547A" },
  { id:"autumn",  label:"Autumn",  emoji:"🍂", sub:"Warm & Earthy",      bg:"#9E5A1E" },
];

export default function WeatherLanding({ onSelect, onSkip }) {
  const [selected, setSelected] = useState(null);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600&family=Outfit:wght@300;400;500&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        body{background:#0D0A14;font-family:'Outfit',sans-serif}
        .page{min-height:100vh;background:#0D0A14;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:2rem;gap:3.5rem}
        .heading{text-align:center;display:flex;flex-direction:column;align-items:center;gap:.6rem;animation:fadeDown .5s ease both}
        .heading-eyebrow{font-size:.7rem;letter-spacing:.22em;text-transform:uppercase;color:rgba(180,159,212,.55);font-weight:400}
        .heading-title{font-family:'Cormorant Garamond',serif;font-size:clamp(1.9rem,4vw,3rem);font-weight:500;color:#F0EAF8;line-height:1.2}
        .heading-title em{font-style:italic;color:#B49FD4}
        .heading-sub{font-size:.82rem;color:rgba(160,140,190,.50);font-weight:300;margin-top:.1rem}
        .cards-row{display:flex;gap:1.6rem;align-items:center;justify-content:center;flex-wrap:wrap;animation:fadeUp .55s .1s ease both}
        .card{display:flex;flex-direction:column;align-items:center;cursor:pointer;gap:.85rem;transition:transform .25s cubic-bezier(.34,1.4,.64,1);outline:none;user-select:none}
        .card:hover,.card.active{transform:translateY(-6px) scale(1.03)}
        .avatar{width:130px;height:130px;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:3.4rem;position:relative;transition:box-shadow .25s ease,border-color .25s ease;border:3px solid transparent;flex-shrink:0}
        .card:hover .avatar{border-color:rgba(255,255,255,.70)}
        .card.active .avatar{border-color:#FFFFFF;box-shadow:0 0 0 3px rgba(255,255,255,.25)}
        .avatar-check{position:absolute;bottom:-10px;right:-10px;width:28px;height:28px;border-radius:50%;background:#fff;display:flex;align-items:center;justify-content:center;font-size:.85rem;color:#1a1a1a;opacity:0;transform:scale(.4);transition:opacity .2s,transform .3s cubic-bezier(.34,1.56,.64,1);box-shadow:0 2px 10px rgba(0,0,0,.35);pointer-events:none}
        .card.active .avatar-check{opacity:1;transform:scale(1)}
        .card-label{font-size:1rem;font-weight:400;color:rgba(230,220,245,.75);letter-spacing:.04em;transition:color .2s;text-align:center}
        .card:hover .card-label,.card.active .card-label{color:#F0EAF8}
        .card.active .card-label{font-weight:500}
        .card-sub{font-size:.7rem;color:rgba(160,140,190,.40);font-weight:300;margin-top:-.5rem;text-align:center;transition:color .2s}
        .card:hover .card-sub,.card.active .card-sub{color:rgba(200,185,230,.60)}
        .cta-wrap{display:flex;flex-direction:column;align-items:center;gap:1rem;animation:fadeUp .55s .2s ease both}
        .cta-btn{background:#F0EAF8;color:#1C1028;border:none;border-radius:6px;padding:.85rem 2.8rem;font-family:'Outfit',sans-serif;font-size:.9rem;font-weight:600;letter-spacing:.05em;cursor:pointer;transition:background .2s,transform .2s,opacity .2s;min-width:220px}
        .cta-btn:hover:not(:disabled){background:#ffffff;transform:translateY(-2px)}
        .cta-btn:disabled{opacity:.28;cursor:default}
        .skip-link{background:none;border:none;font-family:'Outfit',sans-serif;font-size:.76rem;color:rgba(160,140,190,.45);cursor:pointer;letter-spacing:.05em;transition:color .2s}
        .skip-link:hover{color:rgba(200,185,230,.70)}
        @keyframes fadeDown{from{opacity:0;transform:translateY(-14px)}to{opacity:1;transform:translateY(0)}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)}}
        .card:nth-child(1){animation:fadeUp .45s .05s ease both}
        .card:nth-child(2){animation:fadeUp .45s .12s ease both}
        .card:nth-child(3){animation:fadeUp .45s .19s ease both}
        .card:nth-child(4){animation:fadeUp .45s .26s ease both}
        .card:nth-child(5){animation:fadeUp .45s .33s ease both}
      `}</style>

      <div className="page">
        <div className="heading">
          <span className="heading-eyebrow">Smart Styling Assistant</span>
          <h1 className="heading-title">What's the <em>weather</em> like?</h1>
          <p className="heading-sub">Pick your weather to get started</p>
        </div>

        <div className="cards-row">
          {WEATHER.map(w => {
            const active = selected === w.id;
            return (
              <div
                key={w.id}
                className={`card${active ? " active" : ""}`}
                onClick={() => setSelected(w.id)}
                role="button" tabIndex={0}
                onKeyDown={e => e.key === "Enter" && setSelected(w.id)}
                aria-pressed={active}
              >
                <div className="avatar" style={{ background: w.bg }}>
                  {w.emoji}
                  <div className="avatar-check">✓</div>
                </div>
                <span className="card-label">{w.label}</span>
                <span className="card-sub">{w.sub}</span>
              </div>
            );
          })}
        </div>

        <div className="cta-wrap">
          <button
            className="cta-btn"
            disabled={!selected}
            onClick={() => selected && onSelect?.(selected)}
          >
            {selected ? `Continue with ${WEATHER.find(w => w.id === selected)?.label}` : "Select a weather"}
          </button>
          <button className="skip-link" onClick={() => onSkip?.()}>
            Skip — show everything
          </button>
        </div>
      </div>
    </>
  );
}
