import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import { Sparkles, ShoppingBag, ExternalLink, ArrowLeft, CheckCircle2 } from 'lucide-react';
import axios from 'axios';

const RecommendationsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { weather, occasion, subOccasion, gender } = location.state || { gender: 'female', weather: 'summer', occasion: 'formal', subOccasion: 'Business Meeting' };
  
  const [outfit, setOutfit] = useState(null);
  const [prices, setPrices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [aiAdvice, setAiAdvice] = useState('');

  // Pinterest "API" logic - constructing a search URL for inspiration
  const pinterestSearchUrl = `https://www.pinterest.com/search/pins/?q=${encodeURIComponent(`${gender} ${weather} ${subOccasion} outfit fashion`)}`;

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        // 1. Fetch smart AI advice independently so it doesn't break the whole page
        try {
          const smartRes = await axios.get(`http://localhost:5000/api/recommendations/smart?userId=user_123&weather=${weather}&occasion=${subOccasion}&gender=${gender}`);
          if (smartRes.data.error) {
            setAiAdvice("AI Error: " + smartRes.data.error);
          } else {
            setAiAdvice(smartRes.data.recommendation);
          }
        } catch (err) {
          setAiAdvice("Connection Error: " + err.message);
        }

        // 2. Fetching matching outfits from backend
        const response = await axios.get(`http://localhost:5000/api/recommendations?weather=${weather}&occasion=${occasion}&gender=${gender}`);
        
        if (response.data.length > 0) {
          setOutfit(response.data[0]);
        } else {
          // Fallback to sophisticated mock data
          setOutfit({
            name: `${subOccasion} Ensemble`,
            harmonyScore: 0.94,
            items: [
              { type: gender === 'male' ? 'Suit Jacket' : 'Blazer', color: 'Midnight Navy', brand: 'Premium Label', category: 'Top' },
              { type: gender === 'male' ? 'Dress Shirt' : 'Silk Blouse', color: 'Crisp White', brand: 'Aesthetic Line', category: 'Top' },
              { type: gender === 'male' ? 'Oxford Shoes' : 'Pointed Heels', color: 'Tan Leather', brand: 'Crafted Footwear', category: 'Shoes' }
            ],
            palette: ['#000080', '#FFFFFF', '#D2B48C']
          });
        }
      } catch (err) {
        console.error('Fetch failed, using mock:', err);
        // Mock fallback
        setOutfit({
          name: `${subOccasion} Look`,
          harmonyScore: 0.88,
          items: [
            { type: 'Essential Piece', color: 'Neutral Tone', brand: 'Quality Co.', category: 'Top' },
            { type: 'Coordinated Bottom', color: 'Complementary', brand: 'Style Lab', category: 'Bottom' }
          ],
          palette: ['#E2E8F0', '#1E293B']
        });
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [weather, occasion, gender, subOccasion]);

  const handleComparePrices = async (itemType, brand) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/prices/compare?itemType=${itemType}&brand=${brand}`);
      setPrices(res.data.comparisons);
    } catch (err) {
      console.error('Price fetch failed:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div 
          animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-brand-soft border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="pt-32 pb-20 px-8 max-w-7xl mx-auto">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-secondary hover:text-brand-soft mb-8 transition-colors font-semibold tracking-wide">
        <ArrowLeft className="w-5 h-5" /> Back to selection
      </button>

      {/* Header spanning full width */}
      <div className="mb-16 text-center max-w-3xl mx-auto">
         <h1 className="text-5xl md:text-7xl font-black gradient-text mb-6 tracking-tight">{outfit.name || 'Your Curated Look'}</h1>
         <p className="text-xl md:text-2xl text-slate-500 leading-relaxed">
           A curated <span className="text-brand-dark font-black capitalize">{gender}</span> look for a <span className="text-brand-dark font-black">{weather} {occasion}</span> setting.
         </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* Left: Sticky Visuals & Pinterest (Col span 5) */}
        <div className="lg:col-span-5 space-y-8 sticky top-32">
          <div className="glass-card rounded-[40px] p-10 relative overflow-hidden flex flex-col justify-center items-center shadow-2xl border border-white/60">
             <div className="absolute top-6 right-6 bg-brand-muted/80 backdrop-blur px-5 py-2.5 rounded-full flex items-center gap-2 shadow-sm border border-brand-soft/20">
                <Sparkles className="w-4 h-4 text-brand-soft" />
                <span className="text-sm font-black text-brand-soft">AI Score: {(outfit.harmonyScore * 100).toFixed(0)}%</span>
             </div>
             
             {/* Mock visual representation */}
             <div className="flex flex-col gap-5 w-full mt-14">
                {outfit.items.map((item, i) => (
                  <motion.div 
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: i * 0.2 }}
                    key={i} 
                    className="p-6 bg-white/60 backdrop-blur-md rounded-3xl border border-white/80 flex justify-between items-center shadow-sm hover:shadow-lg transition-all hover:-translate-y-1"
                  >
                    <div>
                      <p className="text-xs font-black text-brand-soft uppercase tracking-widest mb-1.5">{item.category}</p>
                      <p className="text-xl font-bold text-slate-800">{item.type}</p>
                      <p className="text-sm text-slate-500 font-medium mt-1">{item.color} • {item.brand}</p>
                    </div>
                    <button 
                      onClick={() => handleComparePrices(item.type, item.brand)}
                      className="p-3.5 bg-brand-dark text-white rounded-2xl hover:bg-brand-soft transition-colors shadow-lg hover:scale-105 active:scale-95"
                    >
                      <ShoppingBag className="w-5 h-5" />
                    </button>
                  </motion.div>
                ))}
             </div>
          </div>
          
          <div className="flex gap-4 p-4 bg-white/50 backdrop-blur rounded-[32px] border border-white/60 shadow-lg">
            {outfit.palette.map((color, i) => (
              <div key={i} className="flex-1 h-14 rounded-2xl shadow-inner border border-black/5 hover:scale-105 transition-transform" style={{ backgroundColor: color }} />
            ))}
          </div>

          {/* Pinterest Section moved here for balance */}
          <div className="glass-card rounded-[40px] p-8 border border-rose-100 bg-gradient-to-br from-rose-50/80 to-white shadow-xl">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-2xl font-black flex items-center gap-4 text-slate-800">
                <div className="w-12 h-12 bg-rose-600 rounded-full flex items-center justify-center text-white font-black text-2xl shadow-lg shadow-rose-200">P</div>
                Pinterest
              </h3>
              <a 
                href={pinterestSearchUrl} 
                target="_blank" 
                rel="noreferrer"
                className="text-rose-600 font-bold text-sm flex items-center gap-1 hover:underline bg-rose-50 px-4 py-2 rounded-full"
              >
                VIEW ALL <ExternalLink className="w-4 h-4" />
              </a>
            </div>
            <p className="text-slate-500 mb-8 text-sm leading-relaxed">Explore thousands of trending styles on Pinterest that perfectly match your curated aesthetic.</p>
            <div className="grid grid-cols-3 gap-4">
               {[1, 2, 3].map(i => (
                 <div key={i} className="aspect-square bg-slate-100 rounded-3xl animate-pulse flex items-center justify-center text-slate-300 shadow-inner">
                    <ShoppingBag className="w-8 h-8" />
                 </div>
               ))}
            </div>
            <a 
              href={pinterestSearchUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-8 w-full py-4 bg-rose-600 text-white rounded-2xl font-black text-lg flex items-center justify-center gap-2 hover:bg-rose-700 transition-all shadow-lg shadow-rose-200 hover:shadow-rose-300 active:scale-95"
            >
              Explore Trends
            </a>
          </div>
        </div>

        {/* Right: AI Ideas (Col span 7) */}
        <div className="lg:col-span-7 space-y-8">
          {/* AI Smart Recommendation Section */}
          <div className="p-8 md:p-10 bg-brand-dark text-brand-muted rounded-[48px] shadow-2xl relative overflow-hidden group border border-brand-800">
            {/* Dynamic Background Glows */}
            <div className="absolute -top-32 -right-32 w-96 h-96 bg-brand-soft/20 rounded-full blur-3xl group-hover:bg-brand-soft/30 transition-colors duration-1000 pointer-events-none"></div>
            <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-brand-accent/20 rounded-full blur-3xl group-hover:bg-brand-accent/30 transition-colors duration-1000 pointer-events-none"></div>
            
            <div className="relative z-10">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10 border-b border-brand-800/50 pb-8">
                <div className="flex items-center gap-5">
                  <div className="p-5 bg-gradient-to-br from-brand-soft to-brand-accent rounded-3xl shadow-lg shadow-brand-soft/20">
                    <Sparkles className="w-8 h-8 text-brand-dark" />
                  </div>
                  <div>
                    <h3 className="text-3xl md:text-4xl font-black bg-clip-text text-transparent bg-gradient-to-r from-brand-muted to-brand-200 tracking-tight">5 Expert Style Ideas</h3>
                    <div className="flex items-center gap-2 text-brand-soft text-xs font-black tracking-widest uppercase mt-2">
                      <CheckCircle2 className="w-4 h-4" />
                      Curated by AI Stylist
                    </div>
                  </div>
                </div>
              </div>
              
              {aiAdvice && aiAdvice.outfits ? (
                <div className="space-y-8">
                  {aiAdvice.outfits.map((outfit, idx) => (
                    <div key={idx} className="p-8 bg-brand-800/40 backdrop-blur-md rounded-[32px] border border-brand-700/50 hover:border-brand-soft/50 transition-all hover:-translate-y-1 hover:shadow-2xl hover:shadow-brand-soft/10 group/card">
                      <div className="flex items-center gap-5 mb-5">
                        <div className="w-12 h-12 rounded-2xl bg-brand-soft/20 text-brand-300 font-black flex items-center justify-center text-xl border border-brand-soft/30 group-hover/card:bg-brand-soft group-hover/card:text-brand-dark transition-colors">
                          {idx + 1}
                        </div>
                        <h4 className="font-black text-2xl text-brand-muted tracking-tight">{outfit.name}</h4>
                      </div>
                      
                      <p className="text-brand-200 text-base mb-8 leading-relaxed bg-brand-900/40 p-5 rounded-2xl border border-brand-800/50 italic shadow-inner">
                        "{outfit.description}"
                      </p>
                      
                      <div className="space-y-4">
                        {outfit.items.map((item, i) => (
                          <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 bg-brand-900/80 p-5 rounded-2xl border border-brand-700/50 shadow-sm">
                            <span className="font-bold text-brand-100 text-sm flex-1">{item}</span>
                            <div className="flex flex-wrap gap-2">
                              <a href={`https://www.myntra.com/${encodeURIComponent(item)}`} target="_blank" rel="noreferrer" className="px-4 py-2 rounded-xl bg-brand-soft/10 text-brand-soft hover:bg-brand-soft hover:text-brand-dark transition-all text-xs font-black tracking-wide">MYNTRA</a>
                              <a href={`https://www.flipkart.com/search?q=${encodeURIComponent(item)}`} target="_blank" rel="noreferrer" className="px-4 py-2 rounded-xl bg-brand-accent/10 text-brand-accent hover:bg-brand-accent hover:text-brand-dark transition-all text-xs font-black tracking-wide">FLIPKART</a>
                              <a href={`https://www.ajio.com/search/?text=${encodeURIComponent(item)}`} target="_blank" rel="noreferrer" className="px-4 py-2 rounded-xl bg-brand-300/10 text-brand-300 hover:bg-brand-300 hover:text-brand-dark transition-all text-xs font-black tracking-wide">AJIO</a>
                              <a href={`https://www.meesho.com/search?q=${encodeURIComponent(item)}`} target="_blank" rel="noreferrer" className="px-4 py-2 rounded-xl bg-brand-400/10 text-brand-400 hover:bg-brand-400 hover:text-brand-dark transition-all text-xs font-black tracking-wide">MEESHO</a>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-20 flex flex-col items-center justify-center text-center bg-brand-800/20 rounded-3xl border border-brand-800 border-dashed">
                  <motion.div animate={{ rotate: 360 }} transition={{ duration: 3, repeat: Infinity, ease: "linear" }} className="w-16 h-16 border-4 border-brand-soft/30 border-t-brand-soft rounded-full mb-8" />
                  <p className="text-xl text-brand-300 font-medium max-w-sm leading-relaxed">{typeof aiAdvice === 'string' ? aiAdvice : "Your personal AI stylist is crafting the perfect looks..."}</p>
                </div>
              )}
            </div>
          </div>

          {prices.length > 0 && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="glass-card rounded-[40px] p-10 border border-white/60 shadow-2xl"
            >
              <h3 className="text-3xl font-black mb-8 tracking-tight text-slate-800">Price Comparison</h3>
              <div className="space-y-4">
                {prices.map((p, i) => (
                  <div key={i} className={`flex justify-between items-center p-5 rounded-2xl transition-all hover:shadow-md ${i === 0 ? 'bg-emerald-50 border border-emerald-200 shadow-sm' : 'bg-slate-50 border border-slate-100 hover:bg-white'}`}>
                    <div>
                      <p className="font-black text-lg text-slate-800">{p.storeName}</p>
                      <p className="text-sm text-emerald-600 font-semibold mt-1">Free Delivery Available</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-black text-slate-900 mb-1">₹{p.price}</p>
                      <a href={p.buyLink} target="_blank" rel="noreferrer" className="text-xs font-black text-emerald-600 flex items-center gap-1 hover:text-emerald-700 bg-emerald-100/50 px-3 py-1.5 rounded-lg w-fit ml-auto">
                        BUY NOW <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecommendationsPage;
