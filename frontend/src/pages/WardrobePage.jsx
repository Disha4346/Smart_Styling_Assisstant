// src/pages/WardrobePage.jsx
// Users upload/add their own clothes. AI suggests outfit combos from those items.

import { useState } from "react";

const ITEM_TYPES = ["Shirt","T-Shirt","Blazer","Trousers","Jeans","Shorts","Dress","Skirt","Kurta","Jacket","Shoes","Sneakers","Heels","Accessories","Bag"];
const COLOURS    = ["White","Black","Navy","Grey","Beige","Brown","Blue","Red","Green","Pink","Yellow","Purple","Orange","Multi"];

const SAMPLE_WARDROBE = [
  { id:1, type:"Shirt",    colour:"White", emoji:"👕", added:"2 weeks ago" },
  { id:2, type:"Jeans",    colour:"Blue",  emoji:"👖", added:"1 month ago" },
  { id:3, type:"Blazer",   colour:"Navy",  emoji:"🥼", added:"3 days ago"  },
  { id:4, type:"Sneakers", colour:"White", emoji:"👟", added:"1 week ago"  },
  { id:5, type:"Jacket",   colour:"Black", emoji:"🧥", added:"2 months ago"},
];

const AI_SUGGESTIONS = [
  {
    id:1,
    title:"Business Casual Friday",
    vibe:"Clean · Contemporary",
    items:[2,3,1,4], // wardrobe item IDs
    desc:"Your navy blazer over the white shirt + blue jeans is a modern off-duty classic. Add white sneakers to keep it fresh.",
  },
  {
    id:2,
    title:"Street Smart",
    vibe:"Urban · Effortless",
    items:[5,1,2,4],
    desc:"Layer the black jacket over a white shirt with blue jeans. A white sneaker grounds everything.",
  },
  {
    id:3,
    title:"Smart Minimal",
    vibe:"Polished · Refined",
    items:[3,1,2],
    desc:"Structured navy blazer, white shirt, and blue jeans — three pieces, one perfect outfit.",
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
  @keyframes spin{to{transform:rotate(360deg)}}
`;

export default function WardrobePage({ onBack }) {
  const [wardrobe, setWardrobe]       = useState(SAMPLE_WARDROBE);
  const [showAdd, setShowAdd]         = useState(false);
  const [newItem, setNewItem]         = useState({ type: "Shirt", colour: "White" });
  const [suggestions, setSuggestions] = useState([]);
  const [generating, setGenerating]   = useState(false);
  const [activeTab, setActiveTab]     = useState("wardrobe"); // wardrobe | suggestions

  const addItem = () => {
    const emojis = { Shirt:"👕","T-Shirt":"👕",Blazer:"🥼",Trousers:"👖",Jeans:"👖",Shorts:"🩳",Dress:"👗",Skirt:"👗",Kurta:"🩱",Jacket:"🧥",Shoes:"👞",Sneakers:"👟",Heels:"👠",Accessories:"⌚",Bag:"👜" };
    setWardrobe([...wardrobe, {
      id: Date.now(),
      type: newItem.type,
      colour: newItem.colour,
      emoji: emojis[newItem.type] || "👔",
      added: "Just now",
    }]);
    setShowAdd(false);
  };

  const removeItem = (id) => setWardrobe(wardrobe.filter(w => w.id !== id));

  const generateSuggestions = () => {
    setGenerating(true);
    setTimeout(() => {
      setSuggestions(AI_SUGGESTIONS);
      setGenerating(false);
      setActiveTab("suggestions");
    }, 1600);
  };

  return (
    <>
      <style>{BASE_CSS + `
        .wd-shell{min-height:100vh;background:var(--bg);display:flex;flex-direction:column}
        /* NAV */
        .wd-nav{display:flex;align-items:center;justify-content:space-between;padding:1.2rem 2.5rem;border-bottom:.5px solid var(--border)}
        .wd-back{background:none;border:1px solid var(--border);border-radius:6px;padding:.4rem .9rem;font-family:var(--fb);font-size:.72rem;letter-spacing:.1em;text-transform:uppercase;color:var(--muted);cursor:pointer;transition:all .2s}
        .wd-back:hover{border-color:var(--border-h);color:var(--text)}
        .wd-logo{font-family:var(--ft);font-size:1.35rem;letter-spacing:.06em}
        .wd-logo em{font-style:italic;color:var(--accent)}
        /* TABS */
        .wd-tabs{display:flex;border-bottom:.5px solid var(--border);padding:0 2.5rem}
        .wd-tab{background:none;border:none;border-bottom:2px solid transparent;padding:1rem 0;margin-right:2rem;font-family:var(--fb);font-size:.78rem;letter-spacing:.1em;text-transform:uppercase;color:var(--muted);cursor:pointer;transition:all .2s}
        .wd-tab.active{color:var(--hydrangea-l);border-bottom-color:var(--hydrangea)}
        /* BODY */
        .wd-body{padding:2.5rem;max-width:1000px;margin:0 auto;width:100%}
        .wd-hero{margin-bottom:2rem;animation:fadeDown .4s ease both}
        .wd-hero-eyebrow{font-size:.68rem;letter-spacing:.22em;text-transform:uppercase;color:rgba(180,159,212,.45);margin-bottom:.5rem}
        .wd-hero-title{font-family:var(--ft);font-size:clamp(1.8rem,4vw,2.8rem);font-weight:500;line-height:1.15}
        .wd-hero-title em{font-style:italic;color:var(--hydrangea-l)}
        .wd-hero-sub{font-size:.82rem;color:var(--muted);margin-top:.4rem;font-weight:300}
        /* TOOLBAR */
        .wd-toolbar{display:flex;align-items:center;justify-content:space-between;margin-bottom:1.5rem;flex-wrap:wrap;gap:.8rem}
        .wd-count{font-size:.72rem;letter-spacing:.1em;text-transform:uppercase;color:var(--muted)}
        .wd-add-btn{background:var(--hydrangea);color:#fff;border:none;border-radius:8px;padding:.55rem 1.2rem;font-family:var(--fb);font-size:.78rem;font-weight:600;letter-spacing:.06em;cursor:pointer;transition:background .2s,transform .2s}
        .wd-add-btn:hover{background:var(--hydrangea-l);transform:translateY(-1px)}
        /* WARDROBE GRID */
        .wd-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:.8rem;animation:fadeUp .5s ease both}
        .wd-item{background:var(--surface);border:1px solid var(--border);border-radius:10px;padding:1.2rem 1rem;text-align:center;position:relative;transition:border-color .2s,transform .2s;animation:fadeUp .4s ease both}
        .wd-item:hover{border-color:var(--border-h);transform:translateY(-2px)}
        .wd-item-emoji{font-size:2.2rem;display:block;margin-bottom:.6rem}
        .wd-item-type{font-size:.82rem;font-weight:500;color:var(--text)}
        .wd-item-colour{font-size:.65rem;letter-spacing:.1em;text-transform:uppercase;color:var(--muted);margin-top:.2rem}
        .wd-item-added{font-size:.6rem;color:rgba(160,140,190,.3);margin-top:.4rem}
        .wd-item-remove{position:absolute;top:.5rem;right:.6rem;background:none;border:none;color:rgba(160,140,190,.25);cursor:pointer;font-size:.85rem;transition:color .2s}
        .wd-item-remove:hover{color:rgba(220,80,80,.7)}
        /* ADD FORM */
        .wd-add-form{background:var(--surface);border:1px solid rgba(123,104,200,.3);border-radius:12px;padding:1.5rem;margin-bottom:1.5rem;animation:fadeDown .3s ease both;display:flex;flex-direction:column;gap:1rem}
        .wd-add-form h3{font-family:var(--ft);font-size:1.1rem}
        .wd-form-row{display:flex;gap:1rem;flex-wrap:wrap}
        .wd-select{background:var(--surface-2);border:1px solid var(--border);border-radius:8px;padding:.6rem .9rem;font-family:var(--fb);font-size:.82rem;color:var(--text);outline:none;flex:1;min-width:140px;transition:border-color .2s}
        .wd-select:focus{border-color:var(--border-h)}
        .wd-form-actions{display:flex;gap:.6rem}
        .wd-confirm-btn{background:var(--hydrangea);color:#fff;border:none;border-radius:6px;padding:.55rem 1.2rem;font-family:var(--fb);font-size:.78rem;font-weight:600;cursor:pointer;transition:background .2s}
        .wd-confirm-btn:hover{background:var(--hydrangea-l)}
        .wd-cancel-btn{background:none;border:1px solid var(--border);border-radius:6px;padding:.55rem 1rem;font-family:var(--fb);font-size:.78rem;color:var(--muted);cursor:pointer;transition:all .2s}
        .wd-cancel-btn:hover{border-color:var(--border-h);color:var(--text)}
        /* GENERATE */
        .wd-generate{background:linear-gradient(135deg,rgba(123,104,200,.12) 0%,rgba(78,63,148,.08) 100%);border:1px solid rgba(123,104,200,.25);border-radius:12px;padding:1.4rem 2rem;display:flex;align-items:center;justify-content:space-between;gap:1rem;margin-top:1.5rem;flex-wrap:wrap}
        .wd-generate-text h4{font-family:var(--ft);font-size:1.1rem;margin-bottom:.25rem}
        .wd-generate-text h4 em{font-style:italic;color:var(--hydrangea-l)}
        .wd-generate-text p{font-size:.75rem;color:var(--muted);font-weight:300}
        .wd-generate-btn{background:linear-gradient(135deg,var(--hydrangea) 0%,var(--hydrangea-d) 100%);color:#fff;border:none;border-radius:8px;padding:.75rem 1.8rem;font-family:var(--fb);font-size:.82rem;font-weight:600;letter-spacing:.05em;cursor:pointer;transition:opacity .2s,transform .2s;flex-shrink:0}
        .wd-generate-btn:hover:not(:disabled){opacity:.9;transform:translateY(-2px)}
        .wd-generate-btn:disabled{opacity:.5;cursor:default}
        /* SUGGESTIONS */
        .wd-suggestions{display:flex;flex-direction:column;gap:1.2rem;animation:fadeUp .5s ease both}
        .wd-sug-card{background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:1.4rem 1.6rem;transition:border-color .2s}
        .wd-sug-card:hover{border-color:var(--border-h)}
        .wd-sug-header{display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:.7rem}
        .wd-sug-title{font-family:var(--ft);font-size:1.2rem;font-weight:500}
        .wd-sug-vibe{font-size:.62rem;letter-spacing:.12em;text-transform:uppercase;color:var(--accent);margin-top:.2rem}
        .wd-sug-badge{background:rgba(123,104,200,.12);border:1px solid rgba(123,104,200,.2);border-radius:4px;font-size:.58rem;letter-spacing:.1em;text-transform:uppercase;color:var(--hydrangea-l);padding:.2rem .5rem;flex-shrink:0}
        .wd-sug-items{display:flex;gap:.5rem;flex-wrap:wrap;margin-bottom:.8rem}
        .wd-sug-item{display:flex;align-items:center;gap:.35rem;background:var(--surface-2);border:1px solid var(--border);border-radius:6px;padding:.3rem .7rem;font-size:.75rem;color:var(--text)}
        .wd-sug-item-emoji{font-size:.9rem}
        .wd-sug-desc{font-size:.78rem;color:var(--muted);line-height:1.6;font-weight:300}
        .wd-spinner{width:36px;height:36px;border:2px solid rgba(123,104,200,.2);border-top-color:var(--hydrangea);border-radius:50%;animation:spin 1s linear infinite;margin:3rem auto}
      `}</style>

      <div className="wd-shell">
        {/* Nav */}
        <nav className="wd-nav">
          <button className="wd-back" onClick={onBack}>← Back</button>
          <div className="wd-logo">dres<em>sed</em></div>
          <span style={{ fontSize: ".68rem", letterSpacing: ".12em", textTransform: "uppercase", color: "rgba(180,159,212,.35)" }}>
            My Wardrobe
          </span>
        </nav>

        {/* Tabs */}
        <div className="wd-tabs">
          {[["wardrobe","My Clothes"],["suggestions","AI Suggestions"]].map(([t,l]) => (
            <button key={t} className={`wd-tab${activeTab === t ? " active" : ""}`} onClick={() => setActiveTab(t)}>
              {l}
            </button>
          ))}
        </div>

        <div className="wd-body">
          {activeTab === "wardrobe" && (
            <>
              <div className="wd-hero">
                <p className="wd-hero-eyebrow">Your Wardrobe</p>
                <h1 className="wd-hero-title">
                  What do you <em>own?</em>
                </h1>
                <p className="wd-hero-sub">Add your existing clothes — AI will build outfits from what you already have</p>
              </div>

              {showAdd && (
                <div className="wd-add-form">
                  <h3>Add a new item</h3>
                  <div className="wd-form-row">
                    <select
                      className="wd-select"
                      value={newItem.type}
                      onChange={e => setNewItem({...newItem, type: e.target.value})}
                    >
                      {ITEM_TYPES.map(t => <option key={t}>{t}</option>)}
                    </select>
                    <select
                      className="wd-select"
                      value={newItem.colour}
                      onChange={e => setNewItem({...newItem, colour: e.target.value})}
                    >
                      {COLOURS.map(c => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                  <div className="wd-form-actions">
                    <button className="wd-confirm-btn" onClick={addItem}>Add Item</button>
                    <button className="wd-cancel-btn" onClick={() => setShowAdd(false)}>Cancel</button>
                  </div>
                </div>
              )}

              <div className="wd-toolbar">
                <span className="wd-count">{wardrobe.length} items in your wardrobe</span>
                <button className="wd-add-btn" onClick={() => setShowAdd(true)}>+ Add Item</button>
              </div>

              {wardrobe.length > 0 ? (
                <div className="wd-grid">
                  {wardrobe.map((item, i) => (
                    <div key={item.id} className="wd-item" style={{ animationDelay: `${i * 0.04}s` }}>
                      <button className="wd-item-remove" onClick={() => removeItem(item.id)} title="Remove">×</button>
                      <span className="wd-item-emoji">{item.emoji}</span>
                      <div className="wd-item-type">{item.type}</div>
                      <div className="wd-item-colour">{item.colour}</div>
                      <div className="wd-item-added">{item.added}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ textAlign:"center", padding:"4rem 0", color:"var(--muted)", fontSize:".88rem" }}>
                  Your wardrobe is empty. Add some items to get started.
                </div>
              )}

              {wardrobe.length >= 2 && (
                <div className="wd-generate">
                  <div className="wd-generate-text">
                    <h4>Generate outfits from <em>my wardrobe</em></h4>
                    <p>AI will suggest the best combinations from your {wardrobe.length} items</p>
                  </div>
                  <button
                    className="wd-generate-btn"
                    onClick={generateSuggestions}
                    disabled={generating}
                  >
                    {generating ? "Generating…" : "✦ Style My Wardrobe"}
                  </button>
                </div>
              )}
            </>
          )}

          {activeTab === "suggestions" && (
            <>
              <div className="wd-hero">
                <p className="wd-hero-eyebrow">AI Suggestions</p>
                <h1 className="wd-hero-title">
                  Styled from your <em>closet</em>
                </h1>
                <p className="wd-hero-sub">Outfit combinations built entirely from your wardrobe</p>
              </div>

              {generating && <div className="wd-spinner" />}

              {!generating && suggestions.length === 0 && (
                <div style={{ textAlign:"center", padding:"3rem 0", color:"var(--muted)", fontSize:".88rem" }}>
                  Head to the Wardrobe tab and click <em style={{color:"var(--hydrangea-l)"}}>Style My Wardrobe</em> to generate outfit ideas.
                </div>
              )}

              {!generating && suggestions.length > 0 && (
                <div className="wd-suggestions">
                  {suggestions.map((s, i) => {
                    const outfitItems = s.items.map(id => wardrobe.find(w => w.id === id)).filter(Boolean);
                    return (
                      <div key={s.id} className="wd-sug-card" style={{ animationDelay: `${i * 0.08}s`, animation: "fadeUp .45s ease both" }}>
                        <div className="wd-sug-header">
                          <div>
                            <div className="wd-sug-title">{s.title}</div>
                            <div className="wd-sug-vibe">{s.vibe}</div>
                          </div>
                          <span className="wd-sug-badge">From your wardrobe</span>
                        </div>
                        <div className="wd-sug-items">
                          {outfitItems.map(item => (
                            <div key={item.id} className="wd-sug-item">
                              <span className="wd-sug-item-emoji">{item.emoji}</span>
                              {item.colour} {item.type}
                            </div>
                          ))}
                        </div>
                        <div className="wd-sug-desc">{s.desc}</div>
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}
