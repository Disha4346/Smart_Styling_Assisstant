// seed/seedOutfits.js
require("dotenv").config({ path: "../.env" });
const mongoose  = require("mongoose");
const connectDB = require("../config/db");
const Outfit    = require("../models/Outfit");

const outfits = [
  // ═══════════════════════ FORMAL ═══════════════════════
  {
    name: "Power Suit",
    imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500",
    occasion: "formal", subOccasion: "business meeting", category: "office meetings",
    weather: ["all"], style: "Power Dressing",
    description: "Tailored charcoal two-piece with peak lapels. The boardroom staple.",
    items: [
      { type:"Blazer", color:"Charcoal", fabric:"Wool blend", fit:"Tailored", price:8500 },
      { type:"Trousers", color:"Charcoal", fabric:"Wool blend", fit:"Slim", price:4500 },
      { type:"Shirt", color:"White", fabric:"Cotton poplin", fit:"Slim", price:2200 },
      { type:"Shoes", color:"Brown", fabric:"Leather", price:6500 },
    ],
    colorPalette: ["#3A3A4A","#F8F6F0","#8B4513"], styleTags: ["tailored","power","structured"],
    tags: ["suit","charcoal","boardroom","meeting"], rating: 4.8, featured: true, price: 21700,
  },
  {
    name: "Interview Ready",
    imageUrl: "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=500",
    occasion: "formal", subOccasion: "job interview", category: "interviews",
    weather: ["all"], style: "Confident Professional",
    description: "Light blue shirt with charcoal blazer — the classic interview formula.",
    items: [
      { type:"Shirt", color:"Light Blue", fabric:"Oxford cotton", fit:"Classic", price:2500 },
      { type:"Blazer", color:"Charcoal", fabric:"Polyester blend", fit:"Structured", price:6800 },
      { type:"Trousers", color:"Slate Grey", fabric:"Cotton blend", fit:"Flat-front", price:3200 },
      { type:"Shoes", color:"Black", fabric:"Leather", price:5500 },
    ],
    colorPalette: ["#C5D8F0","#3A3A4A","#6B7280","#1A1A1A"], styleTags: ["clean","crisp","professional"],
    tags: ["interview","confidence","professional"], rating: 4.7, featured: true, price: 18000,
  },
  {
    name: "Office Day Elevated",
    imageUrl: "https://images.unsplash.com/photo-1563178406-4cdc2923acbc?w=500",
    occasion: "formal", subOccasion: "office day", category: "business casual",
    weather: ["all"], style: "Smart Business Casual",
    description: "Camel chinos with structured navy blazer — smart without the tie.",
    items: [
      { type:"Blazer", color:"Navy", fabric:"Linen blend", fit:"Unstructured", price:5500 },
      { type:"Trousers", color:"Camel", fabric:"Cotton chino", fit:"Slim", price:2800 },
      { type:"Shirt", color:"White", fabric:"Cotton", fit:"Slim", price:1800 },
      { type:"Shoes", color:"Brown", fabric:"Suede", price:4200 },
    ],
    colorPalette: ["#1a2744","#C8B89A","#F8F6F0","#8B6040"], styleTags: ["smart casual","relaxed","elegant"],
    tags: ["office","casual","blazer","chinos"], rating: 4.5, featured: false, price: 14300,
  },
  {
    name: "Presentation Power",
    imageUrl: "https://images.unsplash.com/photo-1512361436605-a484bdb34b5f?w=500",
    occasion: "formal", subOccasion: "presentation", category: "presentations",
    weather: ["all"], style: "Monochrome Authority",
    description: "All-black monochrome ensemble. Commands every room without saying a word.",
    items: [
      { type:"Blazer", color:"Black", fabric:"Ponte fabric", fit:"Structured", price:7200 },
      { type:"Trousers", color:"Black", fabric:"Ponte fabric", fit:"Tailored", price:4200 },
      { type:"Shirt", color:"Black", fabric:"Satin", fit:"Slim", price:2800 },
      { type:"Shoes", color:"Black", fabric:"Patent leather", price:6800 },
    ],
    colorPalette: ["#1A1A1A","#2A2A2A","#3A3A3A"], styleTags: ["monochrome","bold","commanding"],
    tags: ["black","monochrome","keynote","presentation"], rating: 4.9, featured: true, price: 21000,
  },

  // ═══════════════════════ CASUAL ═══════════════════════
  {
    name: "Linen Weekend",
    imageUrl: "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=500",
    occasion: "casual", subOccasion: "weekend", category: "weekend",
    weather: ["summer","spring"], style: "Relaxed Minimal",
    description: "Oversized sage linen shirt with tailored shorts. Saturday perfected.",
    items: [
      { type:"Shirt", color:"Sage", fabric:"Linen", fit:"Oversized", price:2200 },
      { type:"Shorts", color:"Off-White", fabric:"Cotton", fit:"Relaxed", price:1800 },
      { type:"Shoes", color:"Tan", fabric:"Canvas", price:2500 },
    ],
    colorPalette: ["#6A8A70","#F0EBE0","#C8A870"], styleTags: ["linen","relaxed","summer"],
    tags: ["linen","weekend","casual","breathable"], rating: 4.6, featured: true, price: 6500,
  },
  {
    name: "Denim Classic",
    imageUrl: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=500",
    occasion: "casual", subOccasion: "hangout", category: "hangouts",
    weather: ["all"], style: "Everyday Classic",
    description: "Light wash jeans + white tee. The outfit that never fails.",
    items: [
      { type:"T-Shirt", color:"White", fabric:"Cotton jersey", fit:"Regular", price:800 },
      { type:"Jeans", color:"Light Blue", fabric:"Denim", fit:"Straight", price:3200 },
      { type:"Shoes", color:"White", fabric:"Leather", price:3500 },
    ],
    colorPalette: ["#F8F6F0","#A8C0D8","#F0F0F0"], styleTags: ["classic","simple","everyday"],
    tags: ["denim","white tee","everyday","classic"], rating: 4.4, featured: false, price: 7500,
  },
  {
    name: "College Day Look",
    imageUrl: "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=500",
    occasion: "casual", subOccasion: "college day", category: "college",
    weather: ["all"], style: "Campus Street",
    description: "Zip hoodie, straight joggers, and clean sneakers. Campus ready.",
    items: [
      { type:"Hoodie", color:"Charcoal", fabric:"Cotton fleece", fit:"Regular", price:2200 },
      { type:"Joggers", color:"Black", fabric:"Cotton blend", fit:"Straight", price:1800 },
      { type:"Shoes", color:"White", fabric:"Canvas", price:3200 },
    ],
    colorPalette: ["#3A3A4A","#1A1A1A","#F0F0F0"], styleTags: ["streetwear","comfort","campus"],
    tags: ["hoodie","joggers","sneakers","street"], rating: 4.3, featured: false, price: 7200,
  },

  // ═══════════════════════ ETHNIC ═══════════════════════
  {
    name: "Festive Kurta Set",
    imageUrl: "https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=500",
    occasion: "ethnic", subOccasion: "festive", category: "festive season",
    weather: ["autumn","winter"], style: "Festive Traditional",
    description: "Embroidered silk kurta with dhoti pants. Diwali-ready elegance.",
    items: [
      { type:"Kurta", color:"Ivory", fabric:"Silk", fit:"Regular", price:4500 },
      { type:"Dhoti Pants", color:"Ivory", fabric:"Silk", fit:"Relaxed", price:2800 },
      { type:"Shoes", color:"Gold", fabric:"Embroidered", price:3200 },
    ],
    colorPalette: ["#F0E8D0","#C8A830","#B89060"], styleTags: ["silk","embroidered","festive"],
    tags: ["kurta","festive","diwali","ethnic","traditional"], rating: 4.7, featured: true, price: 10500,
  },
  {
    name: "Sangeet Statement",
    imageUrl: "https://images.unsplash.com/photo-1606503153255-59d8b8b82176?w=500",
    occasion: "ethnic", subOccasion: "sangeet", category: "sangeet",
    weather: ["all"], style: "Celebratory Ethnic",
    description: "Vibrant lehenga-inspired co-ord — dance-ready and stunning.",
    items: [
      { type:"Top", color:"Fuchsia", fabric:"Georgette", fit:"Crop", price:3200 },
      { type:"Skirt", color:"Fuchsia + Gold", fabric:"Georgette", fit:"Flared", price:5500 },
      { type:"Shoes", color:"Gold", fabric:"Strappy", price:2800 },
    ],
    colorPalette: ["#D4207A","#C8A830","#F0C0A0"], styleTags: ["vibrant","dance","ethnic glam"],
    tags: ["lehenga","sangeet","dance","vibrant","celebration"], rating: 4.8, featured: true, price: 11500,
  },

  // ═══════════════════════ PARTY ═══════════════════════
  {
    name: "Sequin Night",
    imageUrl: "https://images.unsplash.com/photo-1566479179817-0b4d9a2de00a?w=500",
    occasion: "party", subOccasion: "club night", category: "club",
    weather: ["all"], style: "Midnight Glam",
    description: "Midnight black sequin mini dress. Catches every light on the floor.",
    items: [
      { type:"Dress", color:"Black", fabric:"Sequin", fit:"Mini", price:5500 },
      { type:"Shoes", color:"Silver", fabric:"Strappy heels", price:3200 },
      { type:"Bag", color:"Silver", fabric:"Metallic clutch", price:1800 },
    ],
    colorPalette: ["#1A1A1A","#C0C0C0","#2A2A2A"], styleTags: ["sequin","glam","midnight"],
    tags: ["sequin","club","night out","party","black"], rating: 4.9, featured: true, price: 10500,
  },
  {
    name: "Velvet Cocktail",
    imageUrl: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=500",
    occasion: "party", subOccasion: "cocktail party", category: "cocktail",
    weather: ["winter","autumn"], style: "Velvet Elegance",
    description: "Deep plum velvet blazer over a silk slip dress. Cocktail perfected.",
    items: [
      { type:"Blazer", color:"Deep Plum", fabric:"Velvet", fit:"Structured", price:7800 },
      { type:"Dress", color:"Black", fabric:"Silk", fit:"Midi", price:5200 },
      { type:"Shoes", color:"Black", fabric:"Pointed toe heels", price:4200 },
    ],
    colorPalette: ["#4A1050","#1A1A1A","#C0A0D0"], styleTags: ["velvet","plum","cocktail","luxe"],
    tags: ["velvet","plum","cocktail","sophisticated"], rating: 4.7, featured: true, price: 17200,
  },
  {
    name: "Festival Neon",
    imageUrl: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=500",
    occasion: "party", subOccasion: "music festival", category: "festival",
    weather: ["summer","spring"], style: "Festival Boho",
    description: "Colour-blocked coordinates with festival energy and all-day comfort.",
    items: [
      { type:"Top", color:"Neon Yellow", fabric:"Jersey", fit:"Crop", price:1200 },
      { type:"Shorts", color:"Electric Blue", fabric:"Denim", fit:"High-waist", price:2200 },
      { type:"Shoes", color:"White", fabric:"Platform sneakers", price:3500 },
    ],
    colorPalette: ["#E8E820","#1E40AF","#F0F0F0"], styleTags: ["bold","colour-blocked","festival"],
    tags: ["festival","neon","colour","fun","summer"], rating: 4.5, featured: false, price: 6900,
  },

  // ═══════════════════════ BRUNCH ═══════════════════════
  {
    name: "Garden Brunch",
    imageUrl: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=500",
    occasion: "brunch", subOccasion: "outdoor garden", category: "garden brunch",
    weather: ["spring","summer"], style: "Garden Party Chic",
    description: "Flowy linen midi in cream. Sunday morning in fabric form.",
    items: [
      { type:"Dress", color:"Cream", fabric:"Linen", fit:"Midi flowy", price:3800 },
      { type:"Shoes", color:"Tan", fabric:"Espadrilles", price:2200 },
      { type:"Bag", color:"Woven", fabric:"Rattan", price:1800 },
    ],
    colorPalette: ["#F0E8D0","#C8A870","#6A8A70"], styleTags: ["linen","flowy","garden"],
    tags: ["linen","midi","cream","garden","brunch"], rating: 4.6, featured: true, price: 7800,
  },
  {
    name: "Rooftop Brunch",
    imageUrl: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=500",
    occasion: "brunch", subOccasion: "rooftop brunch", category: "rooftop brunch",
    weather: ["summer","spring"], style: "City Brunch Chic",
    description: "Printed sundress with strappy sandals — city views and good vibes.",
    items: [
      { type:"Dress", color:"Floral print", fabric:"Chiffon", fit:"Wrap", price:3200 },
      { type:"Shoes", color:"Gold", fabric:"Strappy sandals", price:2500 },
      { type:"Sunglasses", color:"Tortoiseshell", price:1500 },
    ],
    colorPalette: ["#D4A0A8","#6A8A70","#F0E8D0"], styleTags: ["sundress","rooftop","floral"],
    tags: ["sundress","floral","rooftop","brunch","summer"], rating: 4.5, featured: false, price: 7200,
  },

  // ═══════════════════════ TRAVEL ═══════════════════════
  {
    name: "Long Haul Comfort",
    imageUrl: "https://images.unsplash.com/photo-1622866306950-81d17097d458?w=500",
    occasion: "travel", subOccasion: "long haul flight", category: "long haul",
    weather: ["all"], style: "Travel Smart",
    description: "Wrinkle-resistant navy travel set. Lands looking pressed, feels like pyjamas.",
    items: [
      { type:"Blazer", color:"Navy", fabric:"Wrinkle-resist", fit:"Relaxed", price:4200 },
      { type:"Trousers", color:"Navy", fabric:"Tech fabric", fit:"Straight", price:3200 },
      { type:"T-Shirt", color:"White", fabric:"Modal", fit:"Regular", price:1200 },
      { type:"Shoes", color:"White", fabric:"Slip-on sneakers", price:2800 },
    ],
    colorPalette: ["#1a2744","#F8F6F0","#A0A8B0"], styleTags: ["wrinkle-free","navy","comfortable"],
    tags: ["travel","flight","wrinkle-free","navy","comfortable"], rating: 4.7, featured: true, price: 11400,
  },
  {
    name: "Beach Holiday",
    imageUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=500",
    occasion: "travel", subOccasion: "beach", category: "beach",
    weather: ["summer"], style: "Resort Chic",
    description: "Linen shorts and a resort-print shirt. Beach to cocktails without changing.",
    items: [
      { type:"Shirt", color:"Tropical print", fabric:"Linen", fit:"Relaxed", price:2200 },
      { type:"Shorts", color:"White", fabric:"Linen", fit:"Relaxed", price:1800 },
      { type:"Shoes", color:"Tan", fabric:"Sandals", price:1500 },
      { type:"Sunglasses", color:"Black", price:1200 },
    ],
    colorPalette: ["#F0E8D0","#F8F6F0","#1E8AA8"], styleTags: ["linen","resort","tropical"],
    tags: ["beach","resort","linen","summer","holiday"], rating: 4.6, featured: false, price: 6700,
  },

  // ═══════════════════════ SPORTS ═══════════════════════
  {
    name: "Gym Performance",
    imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500",
    occasion: "sports", subOccasion: "gym workout", category: "gym",
    weather: ["all"], style: "Performance Athlete",
    description: "Compression tee, tapered joggers, cross-trainers. Built to perform.",
    items: [
      { type:"T-Shirt", color:"Black", fabric:"Dry-fit", fit:"Compression", price:1800 },
      { type:"Joggers", color:"Charcoal", fabric:"Stretch", fit:"Tapered", price:2200 },
      { type:"Shoes", color:"Black/White", fabric:"Cross-trainer", price:5500 },
    ],
    colorPalette: ["#1A1A1A","#3A3A4A","#F0F0F0"], styleTags: ["compression","performance","gym"],
    tags: ["gym","workout","performance","athletic"], rating: 4.5, featured: false, price: 9500,
  },
  {
    name: "Athleisure Daily",
    imageUrl: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=500",
    occasion: "sports", subOccasion: "athleisure", category: "athleisure",
    weather: ["all"], style: "Urban Athleisure",
    description: "Matching set that goes from yoga to coffee. Effortlessly versatile.",
    items: [
      { type:"Jacket", color:"Stone", fabric:"Fleece", fit:"Relaxed", price:3500 },
      { type:"Leggings", color:"Stone", fabric:"Stretch jersey", fit:"High-waist", price:2800 },
      { type:"Shoes", color:"White", fabric:"Chunky sneakers", price:4500 },
    ],
    colorPalette: ["#C8C0B0","#F0EDE8","#F8F6F0"], styleTags: ["athleisure","matching set","clean"],
    tags: ["athleisure","yoga","casual","sports","comfortable"], rating: 4.6, featured: true, price: 10800,
  },
];

const seed = async () => {
  try {
    await connectDB();
    if (process.argv.includes("--clear") || true) {
      await Outfit.deleteMany({});
      console.log("🗑  Cleared existing outfits");
    }
    const docs = await Outfit.insertMany(outfits);
    console.log(`✅  Seeded ${docs.length} outfits\n`);

    // Summary
    const summary = docs.reduce((a, o) => { a[o.occasion] = (a[o.occasion]||0)+1; return a; }, {});
    console.log("📊  By occasion:");
    Object.entries(summary).forEach(([k,v]) => console.log(`   ${k.padEnd(10)} ${v}`));
  } catch (e) {
    console.error("❌  Seed error:", e.message);
  } finally {
    await mongoose.connection.close();
    console.log("\n🔌  Connection closed");
    process.exit(0);
  }
};

seed();