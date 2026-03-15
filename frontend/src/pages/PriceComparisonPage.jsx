// src/pages/PriceComparisonPage.jsx
// Compares outfit item prices across Amazon, Myntra, Ajio, Flipkart.
// Uses mock data in dev; connect real e-commerce APIs in production.

import { useState, useEffect } from "react";

// Mock price data generator (replace with real API calls)
function generatePrices(itemName) {
  const base = Math.floor(Math.random() * 2000) + 800;
  const stores = [
    { id: "myntra",   name: "Myntra",   logo: "🛍️", color: "#FF3F6C" },
    { id: "amazon",   name: "Amazon",   logo: "📦", color: "#FF9900" },
    { id: "ajio",     name: "Ajio",     logo: "✦",  color: "#E45826" },
    { id: "flipkart", name: "Flipkart", logo: "🛒", color: "#2874F0" },
  ];
  return stores.map(s => ({
    ...s,
    price: base + Math.floor((Math.random() - 0.5) * base * 0.4),
    delivery: Math.random() > 0.5 ? "Free delivery" : `₹${Math.floor(Math.random() * 100) + 40} delivery`,
    rating: (3.5 + Math.random() * 1.5).toFixed(1),
    inStock: Math.random() > 0.15,
    link: "#",
    discount: Math.random() > 0.6 ? `${Math.floor(Math.random() * 30) + 10}% off` : null,
  }));
}

const BASE_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,400&family=Outfit:wght@300;400;500;600&display=swap');
  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
  :root{
    --bg:#0D0A14;--surface:#13101E;--surface-2:#1A1626;
    --border:rgba(180,159,212,.12);--border-h:rgba(180,159,212,.4);
    --text:#F0EAF8;--muted:rgba(160,140,190,.55);--accent:#B49FD4;
    --hydrangea:#7B68C8;--hydrangea-l:#A696E0;
    --success:#4CAF88;--warning:#E8A44A;
    --ft:'Cormorant Garamond',serif;--fb:'Outfit',sans-serif;
  }
  body{background:var(--bg);font-family:var(--fb);color:var(--text)}
  @keyframes fadeUp{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)}}
  @keyframes fadeDown{from{opacity:0;transform:translateY(-12px)}to{opacity:1;transform:translateY(0)}}
  @keyframes shimmer{0%{opacity:.5}50%{opacity:1}100%{opacity:.5}}
`;

export default function PriceComparisonPage({ outfit, onBack }) {
  const [selectedItem, setSelectedItem] = useState(0);
  const [prices, setPrices]             = useState({});
  const [loading, setLoading]           = useState(true);
  const [sortBy, setSortBy]             = useState("price");

  const items = outfit?.items || [{ name: outfit?.name || "Outfit", role: "Full Outfit" }];

  useEffect(() => {
    setLoading(true);
    // Simulate API delay
    const t = setTimeout(() => {
      const generated = {};
      items.forEach(item => {
        generated[item.name] = generatePrices(item.name);
      });
      setPrices(generated);
      setLoading(false);
    }, 900);
    return () => clearTimeout(t);
  }, [outfit]);

  const currentItem = items[selectedItem];
  const currentPrices = (prices[currentItem?.name] || []).slice().sort((a, b) =>
    sortBy === "price" ? a.price - b.price :
    sortBy === "rating" ? b.rating - a.rating : 0
  );
  const lowestPrice = currentPrices.length ? Math.min(...currentPrices.map(p => p.price)) : 0;

  return (
    <>
      <style>{BASE_CSS + `
        .pc-shell{min-height:100vh;background:var(--bg);display:flex;flex-direction:column}
        /* NAV */
        .pc-nav{display:flex;align-items:center;justify-content:space-between;padding:1.2rem 2.5rem;border-bottom:.5px solid var(--border)}
        .pc-back{background:none;border:1px solid var(--border);border-radius:6px;padding:.4rem .9rem;font-family:var(--fb);font-size:.72rem;letter-spacing:.1em;text-transform:uppercase;color:var(--muted);cursor:pointer;transition:all .2s}
        .pc-back:hover{border-color:var(--border-h);color:var(--text)}
        .pc-logo{font-family:var(--ft);font-size:1.35rem;letter-spacing:.06em}
        .pc-logo em{font-style:italic;color:var(--accent)}
        .pc-crumb{font-size:.65rem;letter-spacing:.12em;text-transform:uppercase;color:rgba(180,159,212,.35)}
        .pc-crumb span{color:var(--accent)}
        /* HERO */
        .pc-hero{padding:2.5rem 2.5rem 1.5rem;animation:fadeDown .4s ease both}
        .pc-hero-eyebrow{font-size:.68rem;letter-spacing:.22em;text-transform:uppercase;color:rgba(180,159,212,.45);margin-bottom:.6rem}
        .pc-hero-title{font-family:var(--ft);font-size:clamp(1.8rem,4vw,3rem);font-weight:500;line-height:1.1}
        .pc-hero-title em{font-style:italic;color:var(--hydrangea-l)}
        .pc-hero-sub{font-size:.82rem;color:var(--muted);margin-top:.4rem;font-weight:300}
        /* BODY */
        .pc-body{display:grid;grid-template-columns:220px 1fr;gap:2rem;padding:1.5rem 2.5rem 4rem}
        @media(max-width:700px){.pc-body{grid-template-columns:1fr}}
        /* LEFT — item selector */
        .pc-items-panel{display:flex;flex-direction:column;gap:.6rem}
        .pc-items-label{font-size:.62rem;letter-spacing:.18em;text-transform:uppercase;color:rgba(180,159,212,.4);margin-bottom:.3rem}
        .pc-item-btn{background:var(--surface);border:1px solid var(--border);border-radius:8px;padding:.8rem 1rem;text-align:left;cursor:pointer;transition:all .2s;font-family:var(--fb)}
        .pc-item-btn:hover,.pc-item-btn.active{border-color:var(--border-h);background:var(--surface-2)}
        .pc-item-btn-role{font-size:.58rem;letter-spacing:.12em;text-transform:uppercase;color:var(--muted);margin-bottom:.25rem}
        .pc-item-btn-name{font-size:.82rem;font-weight:500;color:var(--text)}
        /* RIGHT — price cards */
        .pc-right{display:flex;flex-direction:column;gap:1.2rem}
        .pc-controls{display:flex;align-items:center;justify-content:space-between;gap:1rem;flex-wrap:wrap}
        .pc-best-price{font-family:var(--ft);font-size:1.1rem;font-weight:500}
        .pc-best-price em{font-style:italic;color:var(--success)}
        .pc-sort{display:flex;gap:.5rem}
        .pc-sort-btn{background:none;border:1px solid var(--border);border-radius:6px;padding:.3rem .75rem;font-family:var(--fb);font-size:.68rem;letter-spacing:.08em;text-transform:uppercase;color:var(--muted);cursor:pointer;transition:all .2s}
        .pc-sort-btn:hover,.pc-sort-btn.active{border-color:var(--border-h);color:var(--text);background:rgba(180,159,212,.06)}
        /* STORE CARDS */
        .pc-stores{display:flex;flex-direction:column;gap:.8rem}
        .pc-store-card{background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:1.1rem 1.4rem;display:flex;align-items:center;gap:1.2rem;transition:border-color .2s,transform .2s;position:relative}
        .pc-store-card:hover{border-color:var(--border-h);transform:translateY(-2px)}
        .pc-store-card.lowest{border-color:rgba(76,175,136,.4);background:rgba(76,175,136,.04)}
        .pc-store-card.out-of-stock{opacity:.45;pointer-events:none}
        .pc-lowest-badge{position:absolute;top:-.6rem;left:1rem;background:var(--success);color:#0a2018;font-size:.55rem;letter-spacing:.1em;text-transform:uppercase;font-weight:600;border-radius:4px;padding:.15rem .5rem}
        .pc-store-logo{font-size:1.6rem;width:40px;text-align:center;flex-shrink:0}
        .pc-store-name{font-size:.85rem;font-weight:600;color:var(--text);flex:1}
        .pc-store-delivery{font-size:.68rem;color:var(--muted);font-weight:300}
        .pc-store-rating{font-size:.68rem;color:var(--warning)}
        .pc-store-right{text-align:right;flex-shrink:0}
        .pc-store-price{font-family:var(--ft);font-size:1.5rem;font-weight:500;color:var(--text)}
        .pc-store-discount{font-size:.65rem;color:var(--success);font-weight:600;letter-spacing:.05em}
        .pc-buy-btn{background:var(--hydrangea);color:#fff;border:none;border-radius:6px;padding:.4rem .9rem;font-family:var(--fb);font-size:.72rem;font-weight:600;letter-spacing:.05em;cursor:pointer;transition:background .2s,transform .2s;margin-top:.4rem;display:block;width:100%}
        .pc-buy-btn:hover{background:var(--hydrangea-l);transform:translateY(-1px)}
        .pc-skeleton{background:rgba(180,159,212,.06);border-radius:12px;height:90px;animation:shimmer 1.4s ease infinite}
        @keyframes shimmer{0%,100%{opacity:.5}50%{opacity:1}}
      `}</style>

      <div className="pc-shell">
        {/* Nav */}
        <nav className="pc-nav">
          <button className="pc-back" onClick={onBack}>← Back</button>
          <div className="pc-logo">dres<em>sed</em></div>
          <span className="pc-crumb">Outfit › <span>Price Compare</span></span>
        </nav>

        {/* Hero */}
        <div className="pc-hero">
          <p className="pc-hero-eyebrow">Best Deals</p>
          <h1 className="pc-hero-title">
            Price <em>comparison</em>
          </h1>
          <p className="pc-hero-sub">Find the best price for every piece of your outfit across top stores</p>
        </div>

        <div className="pc-body">
          {/* Item selector */}
          <div className="pc-items-panel">
            <p className="pc-items-label">Select item</p>
            {items.map((item, i) => (
              <button
                key={i}
                className={`pc-item-btn${selectedItem === i ? " active" : ""}`}
                onClick={() => setSelectedItem(i)}
              >
                <div className="pc-item-btn-role">{item.role}</div>
                <div className="pc-item-btn-name">{item.name}</div>
              </button>
            ))}
          </div>

          {/* Prices */}
          <div className="pc-right">
            <div className="pc-controls">
              <p className="pc-best-price">
                Best price: <em>₹{lowestPrice.toLocaleString("en-IN")}</em>
              </p>
              <div className="pc-sort">
                <span style={{ fontSize: ".68rem", color: "var(--muted)", alignSelf: "center", marginRight: ".3rem" }}>Sort:</span>
                {["price", "rating"].map(s => (
                  <button
                    key={s}
                    className={`pc-sort-btn${sortBy === s ? " active" : ""}`}
                    onClick={() => setSortBy(s)}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div className="pc-stores">
              {loading
                ? Array.from({length:4}).map((_,i) => <div key={i} className="pc-skeleton" style={{animationDelay:`${i*.1}s`}} />)
                : currentPrices.map((store, i) => (
                    <div
                      key={store.id}
                      className={`pc-store-card${store.price === lowestPrice ? " lowest" : ""}${!store.inStock ? " out-of-stock" : ""}`}
                      style={{ animationDelay: `${i * 0.06}s`, animation: "fadeUp .4s ease both" }}
                    >
                      {store.price === lowestPrice && (
                        <span className="pc-lowest-badge">✓ Best Price</span>
                      )}
                      <div className="pc-store-logo">{store.logo}</div>
                      <div style={{ flex: 1 }}>
                        <div className="pc-store-name" style={{ color: store.color }}>{store.name}</div>
                        <div className="pc-store-delivery">{store.delivery}</div>
                        <div className="pc-store-rating">{"★".repeat(Math.floor(store.rating))} {store.rating}</div>
                        {!store.inStock && (
                          <div style={{ fontSize: ".65rem", color: "var(--muted)", marginTop: ".2rem" }}>Out of stock</div>
                        )}
                      </div>
                      <div className="pc-store-right">
                        <div className="pc-store-price">₹{store.price.toLocaleString("en-IN")}</div>
                        {store.discount && (
                          <div className="pc-store-discount">{store.discount}</div>
                        )}
                        {store.inStock && (
                          <a href={store.link} target="_blank" rel="noopener noreferrer">
                            <button className="pc-buy-btn">Buy Now →</button>
                          </a>
                        )}
                      </div>
                    </div>
                  ))
              }
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
