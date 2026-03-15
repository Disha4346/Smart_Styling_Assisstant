// src/pages/AIStylingPage.jsx
// Two modes:
//   Simple  → select preferences → AI generates 3-5 outfits
//   Advanced → upload photo → virtual try-on (UI complete; AI model is a stub)

import { useState } from "react";
import { outfitApi } from "../api";

const STYLE_PREFS = ["Minimal","Classic","Streetwear","Bohemian","Preppy","Edgy","Romantic","Sporty"];
const COLOURS     = [
  { name:"Black",   hex:"#1a1a1a" }, { name:"White",  hex:"#F0EAF8" },
  { name:"Navy",    hex:"#1a2744" }, { name:"Beige",  hex:"#C8B89A" },
  { name:"Burgundy",hex:"#6B1020" }, { name:"Olive",  hex:"#4A5020" },
  { name:"Sage",    hex:"#6A8A70" }, { name:"Camel",  hex:"#B08850" },
  { name:"Blush",   hex:"#D4A0A8" }, { name:"Cobalt", hex:"#1E40AF" },
];
const CLOTHING_TYPES = ["Shirt","Blazer","Dress","Saree","Kurta","Trousers","Jeans","Shorts","Skirt","Jacket"];

const GENERATED_OUTFITS = [
  {
    id:1, title:"The Refined Classic",
    items:["Crisp white Oxford shirt","Slim navy chinos","Brown leather derby shoes","Minimal silver watch"],
    palette:["#F8F6F0","#1a2744","#8B4513","#C0C0C0"],
    vibe:"Timeless · Authoritative",
  },
  {
    id:2, title:"The Modern Edge",
    items:["Black turtleneck","Tailored charcoal trousers","White trainers","Minimalist tote"],
    palette:["#1a1a1a","#3A3A4A","#F0EAF8","#B0A090"],
    vibe:"Contemporary · Sharp",
  },
  {
    id:3, title:"Soft Authority",
    items:["Beige structured blazer","White inner tee","Black chinos","Loafers"],
    palette:["#C8B89A","#F0EAF8","#1a1a1a","#3A2818"],
    vibe:"Confident · Understated",
  },
  {
    id:4, title:"Power Monochrome",
    items:["All-charcoal suit","White pocket square","Oxford brogues","Leather briefcase"],
    palette:["#3A3A4A","#4A4A5A","#F0EAF8","#8B4513"],
    vibe:"Bold · Commanding",
  },
  {
    id:5, title:"Creative Professional",
    items:["Linen blend blazer in olive","Relaxed white shirt","Slim dark jeans","Chelsea boots"],
    palette:["#4A5020","#F0EAF8","#1a1a1a","#3A2818"],
    vibe:"Creative · Effortless",
  },
];

const BASE_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,400&family=Outfit:wght@300;400;500;600&display=swap');
  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
  :root{
    --bg:#0D0A14;--surface:#13101E;--surface-2:#1A1626;
    --border:rgba(180,159,212,.12);--border-h:rgba(180,159,212,.4);
    --text:#F0EAF8;--muted:rgba(160,140,190,.55);--accent:#B49FD4;
    --hydrangea:#7B68C8;--hydrangea-l:#A696E0;--hydrangea-d:#4E3F94;
    --ft:'Cormorant Garamond',serif;--fb:'Outfit',sans-serif;
  }
  body{background:var(--bg);font-family:var(--fb);color:var(--text)}
  @keyframes fadeUp{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)}}
  @keyframes fadeDown{from{opacity:0;transform:translateY(-14px)}to{opacity:1;transform:translateY(0)}}
  @keyframes pulse{0%,100%{opacity:.4}50%{opacity:1}}
  @keyframes spin{to{transform:rotate(360deg)}}
`;

export default function AIStylingPage({ preOccasion, onBack }) {
  const [mode, setMode]           = useState("simple");   // "simple" | "advanced"
  const [step, setStep]           = useState("form");      // "form" | "generating" | "results"
  const [occasion, setOccasion]   = useState(preOccasion || "formal");
  const [weather, setWeather]     = useState("summer");
  const [colours, setColours]     = useState([]);
  const [clothingType, setClothing] = useState([]);
  const [stylePref, setStylePref] = useState([]);
  const [results, setResults]     = useState([]);
  const [savedIds, setSavedIds]   = useState([]);
  const [photo, setPhoto]         = useState(null);
  const [tryOnStatus, setTryOnStatus] = useState("idle"); // idle | processing | done

  const toggleArr = (arr, setArr, val) =>
    setArr(arr.includes(val) ? arr.filter(v => v !== val) : [...arr, val]);

  const generate = async () => {
    setStep("generating");
    // Try API first, fall back to mock
    try {
      const res = await outfitApi.getByOccasion(occasion, { limit: 5 });
      if (res.data?.length) {
        setResults(res.data.map((d, i) => ({
          id: d.id || i,
          title: d.name,
          items: [d.description || d.name],
          palette: ["#B49FD4","#1a2744","#F0EAF8","#3A3A4A"],
          vibe: d.category,
        })));
      } else {
        setResults(GENERATED_OUTFITS);
      }
    } catch {
      setResults(GENERATED_OUTFITS);
    }
    setTimeout(() => setStep("results"), 1800);
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => setPhoto(ev.target.result);
    reader.readAsDataURL(file);
  };

  const runTryOn = () => {
    setTryOnStatus("processing");
    setTimeout(() => setTryOnStatus("done"), 3000);
  };

  return (
    <>
      <style>{BASE_CSS + `
        .ai-shell{min-height:100vh;background:var(--bg);display:flex;flex-direction:column}
        /* NAV */
        .ai-nav{display:flex;align-items:center;justify-content:space-between;padding:1.2rem 2.5rem;border-bottom:.5px solid var(--border)}
        .ai-back{background:none;border:1px solid var(--border);border-radius:6px;padding:.4rem .9rem;font-family:var(--fb);font-size:.72rem;letter-spacing:.1em;text-transform:uppercase;color:var(--muted);cursor:pointer;transition:all .2s}
        .ai-back:hover{border-color:var(--border-h);color:var(--text)}
        .ai-logo{font-family:var(--ft);font-size:1.35rem;letter-spacing:.06em}
        .ai-logo em{font-style:italic;color:var(--accent)}
        /* MODE TABS */
        .ai-tabs{display:flex;border-bottom:.5px solid var(--border);padding:0 2.5rem}
        .ai-tab{background:none;border:none;border-bottom:2px solid transparent;padding:1rem 0;margin-right:2.5rem;font-family:var(--fb);font-size:.78rem;letter-spacing:.12em;text-transform:uppercase;color:var(--muted);cursor:pointer;transition:all .2s}
        .ai-tab:hover{color:var(--text)}
        .ai-tab.active{color:var(--hydrangea-l);border-bottom-color:var(--hydrangea)}
        /* BODY */
        .ai-body{flex:1;padding:2.5rem;max-width:900px;margin:0 auto;width:100%}
        /* HERO */
        .ai-hero{margin-bottom:2.5rem;animation:fadeDown .4s ease both}
        .ai-hero-eyebrow{font-size:.68rem;letter-spacing:.22em;text-transform:uppercase;color:rgba(180,159,212,.45);margin-bottom:.5rem}
        .ai-hero-title{font-family:var(--ft);font-size:clamp(1.8rem,4vw,2.8rem);font-weight:500;line-height:1.15}
        .ai-hero-title em{font-style:italic;color:var(--hydrangea-l)}
        .ai-hero-sub{font-size:.82rem;color:var(--muted);margin-top:.4rem;font-weight:300}
        /* FORM */
        .ai-form{display:flex;flex-direction:column;gap:2rem;animation:fadeUp .5s ease both}
        .ai-field-label{font-size:.68rem;letter-spacing:.18em;text-transform:uppercase;color:var(--muted);margin-bottom:.7rem}
        .ai-select{background:var(--surface);border:1px solid var(--border);border-radius:8px;padding:.7rem 1rem;font-family:var(--fb);font-size:.85rem;color:var(--text);outline:none;width:100%;max-width:260px;transition:border-color .2s;cursor:pointer}
        .ai-select:focus{border-color:var(--border-h)}
        /* PILL GRID */
        .ai-pills{display:flex;flex-wrap:wrap;gap:.5rem}
        .ai-pill{background:none;border:1px solid var(--border);border-radius:20px;padding:.35rem .85rem;font-family:var(--fb);font-size:.72rem;letter-spacing:.06em;color:var(--muted);cursor:pointer;transition:all .2s}
        .ai-pill:hover{border-color:var(--border-h);color:var(--text)}
        .ai-pill.active{border-color:var(--hydrangea);color:var(--hydrangea-l);background:rgba(123,104,200,.1)}
        /* COLOUR GRID */
        .ai-colour-grid{display:flex;flex-wrap:wrap;gap:.6rem}
        .ai-colour{width:36px;height:36px;border-radius:50%;border:2px solid transparent;cursor:pointer;transition:transform .2s,border-color .2s}
        .ai-colour:hover{transform:scale(1.15)}
        .ai-colour.active{border-color:#fff;box-shadow:0 0 0 3px rgba(255,255,255,.2)}
        /* GENERATE BUTTON */
        .ai-gen-btn{background:linear-gradient(135deg,var(--hydrangea) 0%,var(--hydrangea-d) 100%);color:#fff;border:none;border-radius:10px;padding:1rem 2.5rem;font-family:var(--fb);font-size:.92rem;font-weight:600;letter-spacing:.06em;cursor:pointer;transition:opacity .2s,transform .2s;align-self:flex-start}
        .ai-gen-btn:hover{opacity:.9;transform:translateY(-2px)}
        /* GENERATING */
        .ai-generating{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:1.5rem;padding:5rem 0}
        .ai-spinner{width:48px;height:48px;border:2px solid rgba(123,104,200,.2);border-top-color:var(--hydrangea);border-radius:50%;animation:spin 1s linear infinite}
        .ai-gen-label{font-family:var(--ft);font-size:1.2rem;color:rgba(180,159,212,.6);animation:pulse 1.4s ease-in-out infinite}
        /* RESULTS */
        .ai-results{animation:fadeUp .5s ease both}
        .ai-results-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:1.5rem;flex-wrap:wrap;gap:1rem}
        .ai-results-title{font-family:var(--ft);font-size:1.5rem;font-weight:500}
        .ai-results-title em{font-style:italic;color:var(--accent)}
        .ai-regenerate{background:none;border:1px solid var(--border);border-radius:6px;padding:.4rem .9rem;font-family:var(--fb);font-size:.72rem;letter-spacing:.1em;text-transform:uppercase;color:var(--muted);cursor:pointer;transition:all .2s}
        .ai-regenerate:hover{border-color:var(--border-h);color:var(--text)}
        .ai-outfit-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:1rem}
        .ai-outfit-card{background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:1.5rem;transition:transform .28s cubic-bezier(.34,1.4,.64,1),border-color .28s}
        .ai-outfit-card:hover{transform:translateY(-4px);border-color:var(--border-h)}
        .ai-outfit-card-title{font-family:var(--ft);font-size:1.1rem;font-weight:500;margin-bottom:.3rem}
        .ai-outfit-card-vibe{font-size:.65rem;letter-spacing:.12em;text-transform:uppercase;color:var(--accent);margin-bottom:.8rem}
        .ai-outfit-swatches{display:flex;gap:.3rem;margin-bottom:.8rem}
        .ai-outfit-swatch{width:20px;height:20px;border-radius:50%;border:1px solid rgba(255,255,255,.1)}
        .ai-outfit-items{list-style:none;display:flex;flex-direction:column;gap:.3rem}
        .ai-outfit-item{font-size:.76rem;color:var(--muted);font-weight:300;display:flex;align-items:center;gap:.4rem}
        .ai-outfit-item::before{content:"–";color:rgba(180,159,212,.3)}
        .ai-card-actions{display:flex;gap:.5rem;margin-top:1rem}
        .ai-save-btn{flex:1;background:none;border:1px solid var(--border);border-radius:6px;padding:.4rem;font-family:var(--fb);font-size:.68rem;letter-spacing:.08em;text-transform:uppercase;color:var(--muted);cursor:pointer;transition:all .2s}
        .ai-save-btn:hover,.ai-save-btn.saved{border-color:var(--hydrangea);color:var(--hydrangea-l);background:rgba(123,104,200,.08)}
        /* ADVANCED MODE */
        .ai-advanced{display:flex;flex-direction:column;gap:2rem;animation:fadeUp .5s ease both}
        .ai-upload-zone{border:2px dashed var(--border);border-radius:16px;padding:3.5rem 2rem;text-align:center;cursor:pointer;transition:border-color .2s;position:relative;overflow:hidden}
        .ai-upload-zone:hover{border-color:var(--border-h)}
        .ai-upload-icon{font-size:2.5rem;margin-bottom:1rem}
        .ai-upload-label{font-size:.88rem;color:var(--muted);font-weight:300}
        .ai-upload-hint{font-size:.72rem;color:rgba(160,140,190,.35);margin-top:.4rem}
        .ai-upload-input{position:absolute;inset:0;opacity:0;cursor:pointer}
        .ai-preview-grid{display:grid;grid-template-columns:1fr 1fr;gap:1.5rem}
        @media(max-width:600px){.ai-preview-grid{grid-template-columns:1fr}}
        .ai-preview-panel{background:var(--surface);border:1px solid var(--border);border-radius:12px;overflow:hidden}
        .ai-preview-header{padding:.8rem 1rem;border-bottom:.5px solid var(--border);font-size:.68rem;letter-spacing:.14em;text-transform:uppercase;color:var(--muted)}
        .ai-preview-img{width:100%;aspect-ratio:3/4;object-fit:cover;display:block}
        .ai-preview-placeholder{width:100%;aspect-ratio:3/4;display:flex;align-items:center;justify-content:center;flex-direction:column;gap:.8rem;background:var(--surface-2)}
        .ai-preview-placeholder-icon{font-size:3rem;opacity:.3}
        .ai-preview-placeholder-text{font-size:.75rem;color:rgba(160,140,190,.3);font-weight:300}
        .ai-tryon-btn{background:linear-gradient(135deg,var(--hydrangea) 0%,var(--hydrangea-d) 100%);color:#fff;border:none;border-radius:10px;padding:1rem 2rem;font-family:var(--fb);font-size:.88rem;font-weight:600;letter-spacing:.06em;cursor:pointer;transition:opacity .2s,transform .2s;width:100%}
        .ai-tryon-btn:hover:not(:disabled){opacity:.9;transform:translateY(-2px)}
        .ai-tryon-btn:disabled{opacity:.4;cursor:default}
        .ai-info-banner{background:rgba(123,104,200,.08);border:1px solid rgba(123,104,200,.2);border-radius:10px;padding:1rem 1.2rem;font-size:.78rem;color:var(--muted);line-height:1.6}
        .ai-info-banner strong{color:var(--hydrangea-l)}
      `}</style>

      <div className="ai-shell">
        {/* Nav */}
        <nav className="ai-nav">
          <button className="ai-back" onClick={onBack}>← Back</button>
          <div className="ai-logo">dres<em>sed</em></div>
          <span style={{ fontSize: ".68rem", letterSpacing: ".12em", textTransform: "uppercase", color: "rgba(180,159,212,.35)" }}>
            AI Styling
          </span>
        </nav>

        {/* Mode tabs */}
        <div className="ai-tabs">
          {[["simple","✦ Simple Styling"],["advanced","◈ Virtual Try-On"]].map(([m,l]) => (
            <button
              key={m}
              className={`ai-tab${mode === m ? " active" : ""}`}
              onClick={() => { setMode(m); setStep("form"); }}
            >
              {l}
            </button>
          ))}
        </div>

        <div className="ai-body">
          {/* SIMPLE MODE */}
          {mode === "simple" && (
            <>
              <div className="ai-hero">
                <p className="ai-hero-eyebrow">Simple Styling Mode</p>
                <h1 className="ai-hero-title">
                  Tell me your <em>vibe</em>
                </h1>
                <p className="ai-hero-sub">Set your preferences — AI generates 3–5 curated outfit combinations</p>
              </div>

              {step === "form" && (
                <div className="ai-form">
                  {/* Occasion */}
                  <div>
                    <p className="ai-field-label">Occasion</p>
                    <select
                      className="ai-select"
                      value={occasion}
                      onChange={e => setOccasion(e.target.value)}
                    >
                      {["formal","casual","ethnic","party","travel","sports","brunch"].map(o => (
                        <option key={o} value={o}>{o.charAt(0).toUpperCase() + o.slice(1)}</option>
                      ))}
                    </select>
                  </div>

                  {/* Weather */}
                  <div>
                    <p className="ai-field-label">Weather</p>
                    <div className="ai-pills">
                      {["Summer","Winter","Monsoon","Spring","Autumn"].map(w => (
                        <button
                          key={w}
                          className={`ai-pill${weather === w.toLowerCase() ? " active" : ""}`}
                          onClick={() => setWeather(w.toLowerCase())}
                        >
                          {w}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Preferred colours */}
                  <div>
                    <p className="ai-field-label">Preferred colours</p>
                    <div className="ai-colour-grid">
                      {COLOURS.map(c => (
                        <div
                          key={c.name}
                          className={`ai-colour${colours.includes(c.name) ? " active" : ""}`}
                          style={{ background: c.hex }}
                          title={c.name}
                          onClick={() => toggleArr(colours, setColours, c.name)}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Clothing type */}
                  <div>
                    <p className="ai-field-label">Clothing types</p>
                    <div className="ai-pills">
                      {CLOTHING_TYPES.map(c => (
                        <button
                          key={c}
                          className={`ai-pill${clothingType.includes(c) ? " active" : ""}`}
                          onClick={() => toggleArr(clothingType, setClothing, c)}
                        >
                          {c}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Style preference */}
                  <div>
                    <p className="ai-field-label">Style preference</p>
                    <div className="ai-pills">
                      {STYLE_PREFS.map(s => (
                        <button
                          key={s}
                          className={`ai-pill${stylePref.includes(s) ? " active" : ""}`}
                          onClick={() => toggleArr(stylePref, setStylePref, s)}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button className="ai-gen-btn" onClick={generate}>
                    ✦ Generate My Outfits
                  </button>
                </div>
              )}

              {step === "generating" && (
                <div className="ai-generating">
                  <div className="ai-spinner" />
                  <p className="ai-gen-label">Styling your perfect look…</p>
                </div>
              )}

              {step === "results" && (
                <div className="ai-results">
                  <div className="ai-results-header">
                    <h2 className="ai-results-title">
                      Your <em>looks</em>
                    </h2>
                    <button className="ai-regenerate" onClick={() => setStep("form")}>
                      ← Refine Preferences
                    </button>
                  </div>
                  <div className="ai-outfit-grid">
                    {results.map((o, i) => (
                      <div
                        key={o.id}
                        className="ai-outfit-card"
                        style={{ animationDelay: `${i * 0.07}s`, animation: "fadeUp .45s ease both" }}
                      >
                        <div className="ai-outfit-card-title">{o.title}</div>
                        <div className="ai-outfit-card-vibe">{o.vibe}</div>
                        <div className="ai-outfit-swatches">
                          {(o.palette || []).map((c,j) => (
                            <div key={j} className="ai-outfit-swatch" style={{ background: c }} />
                          ))}
                        </div>
                        <ul className="ai-outfit-items">
                          {(Array.isArray(o.items) ? o.items : [o.items]).map((item, j) => (
                            <li key={j} className="ai-outfit-item">{item}</li>
                          ))}
                        </ul>
                        <div className="ai-card-actions">
                          <button
                            className={`ai-save-btn${savedIds.includes(o.id) ? " saved" : ""}`}
                            onClick={() =>
                              setSavedIds(savedIds.includes(o.id)
                                ? savedIds.filter(id => id !== o.id)
                                : [...savedIds, o.id])
                            }
                          >
                            {savedIds.includes(o.id) ? "✓ Saved" : "♡ Save"}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          {/* ADVANCED MODE */}
          {mode === "advanced" && (
            <>
              <div className="ai-hero">
                <p className="ai-hero-eyebrow">Advanced Mode — Virtual Try-On</p>
                <h1 className="ai-hero-title">
                  Try it <em>on</em>
                </h1>
                <p className="ai-hero-sub">Upload your photo and see how outfits look on you using AI</p>
              </div>

              <div className="ai-advanced">
                <div className="ai-info-banner">
                  <strong>Powered by CP-VTON / VITON models.</strong> Upload a clear, full-body photo for best results.
                  The AI performs pose detection, body segmentation, and clothing warping to render the final look.
                </div>

                {!photo ? (
                  <div className="ai-upload-zone">
                    <input
                      type="file"
                      accept="image/*"
                      className="ai-upload-input"
                      onChange={handlePhotoUpload}
                    />
                    <div className="ai-upload-icon">📸</div>
                    <p className="ai-upload-label">Click or drag & drop your photo here</p>
                    <p className="ai-upload-hint">Full-body photo recommended · JPG, PNG · Max 10MB</p>
                  </div>
                ) : (
                  <>
                    <div className="ai-preview-grid">
                      <div className="ai-preview-panel">
                        <div className="ai-preview-header">Your Photo</div>
                        <img src={photo} alt="uploaded" className="ai-preview-img" />
                      </div>
                      <div className="ai-preview-panel">
                        <div className="ai-preview-header">Try-On Result</div>
                        {tryOnStatus === "idle" && (
                          <div className="ai-preview-placeholder">
                            <div className="ai-preview-placeholder-icon">✦</div>
                            <div className="ai-preview-placeholder-text">Click below to generate</div>
                          </div>
                        )}
                        {tryOnStatus === "processing" && (
                          <div className="ai-preview-placeholder">
                            <div style={{ width:"40px",height:"40px",border:"2px solid rgba(123,104,200,.2)",borderTopColor:"var(--hydrangea)",borderRadius:"50%",animation:"spin 1s linear infinite" }} />
                            <div className="ai-preview-placeholder-text">AI is styling you…</div>
                          </div>
                        )}
                        {tryOnStatus === "done" && (
                          <div className="ai-preview-placeholder" style={{ flexDirection: "column", gap: ".5rem" }}>
                            <div style={{ fontSize: "2rem" }}>✓</div>
                            <div style={{ fontSize: ".75rem", color: "var(--hydrangea-l)" }}>
                              Try-on complete
                            </div>
                            <div className="ai-preview-placeholder-text">
                              (Connect VITON model endpoint to render real result)
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div style={{ display: "flex", gap: ".8rem" }}>
                      <button
                        className="ai-tryon-btn"
                        onClick={runTryOn}
                        disabled={tryOnStatus === "processing"}
                      >
                        {tryOnStatus === "processing" ? "Processing…" : "✦ Run Virtual Try-On"}
                      </button>
                      <button
                        style={{ background:"none",border:"1px solid var(--border)",borderRadius:"10px",padding:"1rem",cursor:"pointer",color:"var(--muted)",fontFamily:"var(--fb)",fontSize:".78rem",whiteSpace:"nowrap",transition:"all .2s" }}
                        onClick={() => { setPhoto(null); setTryOnStatus("idle"); }}
                      >
                        Change Photo
                      </button>
                    </div>
                  </>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
