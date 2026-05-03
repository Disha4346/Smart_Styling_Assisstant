import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Palette, X, Check, Droplets, ChevronDown, ChevronUp } from 'lucide-react';

// ── Palette data ────────────────────────────────────────────────────────────
const PALETTE_GROUPS = [
  {
    id: 'nude',
    label: 'Nude Tones',
    description: 'Warm, earthy beige shades',
    swatch: '#e8cbb6',
    colors: [
      { name: 'Ivory',       hex: '#fdf8f5', label: 'Ivory' },
      { name: 'Cream',       hex: '#f9f0ea', label: 'Cream' },
      { name: 'Sand',        hex: '#f2e0d3', label: 'Sand' },
      { name: 'Nude',        hex: '#e8cbb6', label: 'Nude' },
      { name: 'Beige',       hex: '#d9af90', label: 'Beige' },
      { name: 'Camel',       hex: '#c7916c', label: 'Camel' },
      { name: 'Tan',         hex: '#ad7350', label: 'Tan' },
      { name: 'Warm Brown',  hex: '#8f5c3d', label: 'Warm Brown' },
    ],
  },
  {
    id: 'blush',
    label: 'Blush Pink',
    description: 'Soft, romantic pink hues',
    swatch: '#ffaac3',
    colors: [
      { name: 'Petal',      hex: '#fff5f7', label: 'Petal' },
      { name: 'Blush',      hex: '#ffe8ee', label: 'Blush' },
      { name: 'Ballet',     hex: '#ffd1df', label: 'Ballet' },
      { name: 'Rose Quartz',hex: '#ffaac3', label: 'Rose Quartz' },
      { name: 'Flamingo',   hex: '#ff7aa0', label: 'Flamingo' },
      { name: 'Hot Pink',   hex: '#f74d7b', label: 'Hot Pink' },
      { name: 'Deep Rose',  hex: '#e42b5e', label: 'Deep Rose' },
      { name: 'Fuchsia',    hex: '#c11b4d', label: 'Fuchsia' },
    ],
  },
  {
    id: 'lavender',
    label: 'Lavender & Lilac',
    description: 'Dreamy violet & purple tones',
    swatch: '#cab3fb',
    colors: [
      { name: 'Ghost White', hex: '#f8f5ff', label: 'Ghost' },
      { name: 'Whisper Lav', hex: '#f0eafe', label: 'Whisper' },
      { name: 'Soft Lilac',  hex: '#e2d5fd', label: 'Soft Lilac' },
      { name: 'Lavender',    hex: '#cab3fb', label: 'Lavender' },
      { name: 'Periwinkle',  hex: '#ac87f7', label: 'Periwinkle' },
      { name: 'Wisteria',    hex: '#8e5df1', label: 'Wisteria' },
      { name: 'Iris',        hex: '#763de3', label: 'Iris' },
      { name: 'Violet',      hex: '#612dcb', label: 'Violet' },
    ],
  },
  {
    id: 'mauve',
    label: 'Mauve & Rose',
    description: 'Dusty rose & antique mauve',
    swatch: '#dba8c1',
    colors: [
      { name: 'Linen',       hex: '#fdf6f8', label: 'Linen' },
      { name: 'Misty Rose',  hex: '#faedf2', label: 'Misty Rose' },
      { name: 'Dusty Pink',  hex: '#f5d9e4', label: 'Dusty Pink' },
      { name: 'Antique Rose',hex: '#edb8cc', label: 'Antique' },
      { name: 'Mauve',       hex: '#dba8c1', label: 'Mauve' },
      { name: 'Rose Taupe',  hex: '#cf6290', label: 'Rose Taupe' },
      { name: 'Deep Mauve',  hex: '#b74275', label: 'Deep Mauve' },
      { name: 'Plum Rose',   hex: '#97305c', label: 'Plum Rose' },
    ],
  },
];

// Outfit suggestions per color
const OUTFIT_SUGGESTIONS = {
  '#fdf8f5': 'Ivory linen co-ord with gold accessories.',
  '#f9f0ea': 'Cream wrap dress with nude sandals.',
  '#f2e0d3': 'Sand blazer + white tee + beige trousers.',
  '#e8cbb6': 'Nude slip dress with dainty pearl jewelry.',
  '#d9af90': 'Beige trench coat over all-white outfit.',
  '#c7916c': 'Camel knit cardigan with wide-leg pants.',
  '#ad7350': 'Tan leather jacket + mocha turtleneck.',
  '#8f5c3d': 'Warm brown boots with cream midi skirt.',
  '#fff5f7': 'Petal pink ruffle blouse with white jeans.',
  '#ffe8ee': 'Blush tulle skirt with a silk camisole.',
  '#ffd1df': 'Ballet pink oversized hoodie + leggings.',
  '#ffaac3': 'Rose quartz co-ord with clear heels.',
  '#ff7aa0': 'Flamingo mini dress for a cocktail event.',
  '#f74d7b': 'Hot pink power suit — make a statement!',
  '#e42b5e': 'Deep rose sequin top with black trousers.',
  '#c11b4d': 'Fuchsia structured blazer + white skirt.',
  '#f8f5ff': 'Ghost white slip skirt with lavender knitwear.',
  '#f0eafe': 'Whisper lavender linen set with wedge sandals.',
  '#e2d5fd': 'Lilac puff-sleeve blouse + straight jeans.',
  '#cab3fb': 'Lavender maxi dress for a garden event.',
  '#ac87f7': 'Periwinkle knit vest over white shirt.',
  '#8e5df1': 'Wisteria satin midi skirt + white bralette.',
  '#763de3': 'Iris velvet blazer for an evening look.',
  '#612dcb': 'Violet co-ord set with silver jewelry.',
  '#fdf6f8': 'Linen blouse in muted rose + neutral slacks.',
  '#faedf2': 'Misty rose ruched mini dress.',
  '#f5d9e4': 'Dusty pink trench belted at the waist.',
  '#edb8cc': 'Antique rose organza blouse + wide trousers.',
  '#dba8c1': 'Mauve draped dress with strappy heels.',
  '#cf6290': 'Rose taupe bodysuit + high-waisted skirt.',
  '#b74275': 'Deep mauve power blazer + matching trousers.',
  '#97305c': 'Plum rose wrap coat — effortlessly chic.',
};

// ─────────────────────────────────────────────────────────────────────────────

const ColorChip = ({ color, isSelected, onSelect }) => (
  <motion.button
    id={`color-chip-${color.hex.replace('#', '')}`}
    onClick={() => onSelect(color)}
    whileHover={{ scale: 1.22 }}
    whileTap={{ scale: 0.95 }}
    className="relative group"
    title={color.label}
    aria-label={`Select ${color.label} color`}
  >
    <div
      className="color-chip"
      style={{
        backgroundColor: color.hex,
        borderColor: isSelected ? '#fff' : 'rgba(0,0,0,0.08)',
        boxShadow: isSelected
          ? `0 0 0 3px #dba8c1, 0 4px 14px rgba(0,0,0,0.18)`
          : '0 2px 8px rgba(0,0,0,0.10)',
      }}
    />
    {isSelected && (
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="absolute inset-0 flex items-center justify-center"
      >
        <Check className="w-3 h-3 text-white drop-shadow" strokeWidth={3} />
      </motion.div>
    )}
    {/* Tooltip */}
    <span className="absolute -bottom-7 left-1/2 -translate-x-1/2 bg-white text-[#3d1f30] text-[9px] font-semibold px-2 py-0.5 rounded-full shadow-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none border border-pink-100 z-10">
      {color.label}
    </span>
  </motion.button>
);

// ─────────────────────────────────────────────────────────────────────────────

const ColorPaletteTool = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeGroup, setActiveGroup] = useState('nude');
  const [selectedColor, setSelectedColor] = useState(null);
  const [expandedOutfit, setExpandedOutfit] = useState(false);

  const currentGroup = PALETTE_GROUPS.find(g => g.id === activeGroup);
  const outfit = selectedColor ? OUTFIT_SUGGESTIONS[selectedColor.hex] : null;

  return (
    <>
      {/* ── Floating trigger button ─────────────────────────────── */}
      <motion.button
        id="color-palette-trigger"
        onClick={() => setIsOpen(true)}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.94 }}
        className="fixed bottom-8 right-8 z-40 flex items-center gap-2.5 px-5 py-3.5 rounded-2xl shadow-premium"
        style={{
          background: 'linear-gradient(135deg, #edb8cc 0%, #dba8c1 40%, #cab3fb 100%)',
          color: '#3d1f30',
        }}
        aria-label="Open Color Palette Tool"
      >
        <Palette className="w-5 h-5" />
        <span className="font-bold text-sm hidden sm:inline">Colour Palette</span>
        <span
          className="w-4 h-4 rounded-full border-2 border-white/60 inline-block"
          style={{ backgroundColor: selectedColor?.hex ?? '#dba8c1' }}
        />
      </motion.button>

      {/* ── Panel ───────────────────────────────────────────────── */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              id="palette-backdrop"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
            />

            {/* Panel */}
            <motion.div
              id="color-palette-panel"
              initial={{ opacity: 0, y: 40, scale: 0.96 }}
              animate={{ opacity: 1, y: 0,  scale: 1 }}
              exit={{ opacity: 0, y: 30, scale: 0.96 }}
              transition={{ type: 'spring', stiffness: 340, damping: 30 }}
              className="fixed bottom-24 right-8 z-50 w-[340px] palette-panel p-6 overflow-hidden"
              style={{ maxHeight: '80vh', overflowY: 'auto' }}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2.5">
                  <div
                    className="p-2 rounded-xl"
                    style={{ background: 'linear-gradient(135deg, #edb8cc, #cab3fb)' }}
                  >
                    <Droplets className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-[#3d1f30] text-sm">Colour Palette Tool</h3>
                    <p className="text-[10px] text-[#9b7a8a]">Explore feminine colour tones</p>
                  </div>
                </div>
                <button
                  id="palette-close-btn"
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-xl hover:bg-pink-50 text-[#9b7a8a] hover:text-[#b74275] transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Group tabs */}
              <div className="flex gap-1.5 mb-5 flex-wrap">
                {PALETTE_GROUPS.map(g => (
                  <button
                    key={g.id}
                    id={`palette-tab-${g.id}`}
                    onClick={() => setActiveGroup(g.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all"
                    style={
                      activeGroup === g.id
                        ? { background: 'linear-gradient(135deg, #edb8cc, #cab3fb)', color: '#3d1f30', boxShadow: '0 4px 12px rgba(219,168,193,0.3)' }
                        : { background: '#fdf6f8', color: '#9b7a8a', border: '1px solid rgba(232,196,208,0.4)' }
                    }
                  >
                    <span
                      className="w-3 h-3 rounded-full inline-block"
                      style={{ backgroundColor: g.swatch }}
                    />
                    {g.label.split(' ')[0]}
                  </button>
                ))}
              </div>

              {/* Color grid */}
              <div className="mb-4">
                <p className="text-[10px] font-semibold text-[#9b7a8a] uppercase tracking-widest mb-3">
                  {currentGroup.description}
                </p>
                <div className="flex flex-wrap gap-3">
                  {currentGroup.colors.map(color => (
                    <ColorChip
                      key={color.hex}
                      color={color}
                      isSelected={selectedColor?.hex === color.hex}
                      onSelect={setSelectedColor}
                    />
                  ))}
                </div>
              </div>

              {/* Selected colour preview */}
              <AnimatePresence>
                {selectedColor && (
                  <motion.div
                    id="palette-selected-preview"
                    key={selectedColor.hex}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="mt-4 rounded-2xl overflow-hidden border border-pink-100"
                  >
                    {/* Color bar */}
                    <div
                      className="h-14 w-full"
                      style={{ backgroundColor: selectedColor.hex }}
                    />
                    <div className="p-4 bg-white">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <p className="font-bold text-sm text-[#3d1f30]">{selectedColor.label}</p>
                          <p className="text-xs text-[#9b7a8a] font-mono">{selectedColor.hex.toUpperCase()}</p>
                        </div>
                        <button
                          id="palette-copy-btn"
                          onClick={() => navigator.clipboard.writeText(selectedColor.hex)}
                          className="text-[10px] font-bold px-3 py-1.5 rounded-xl transition-all"
                          style={{ background: '#fdf6f8', color: '#b74275', border: '1px solid #edb8cc' }}
                        >
                          Copy HEX
                        </button>
                      </div>

                      {/* Outfit suggestion */}
                      {outfit && (
                        <div className="mt-3 rounded-xl p-3" style={{ background: '#fdf6f8', border: '1px solid rgba(232,196,208,0.4)' }}>
                          <button
                            id="palette-outfit-toggle"
                            className="flex items-center justify-between w-full"
                            onClick={() => setExpandedOutfit(!expandedOutfit)}
                          >
                            <span className="text-[10px] font-bold uppercase tracking-widest text-[#dba8c1]">✦ Outfit Idea</span>
                            {expandedOutfit
                              ? <ChevronUp className="w-3 h-3 text-[#dba8c1]" />
                              : <ChevronDown className="w-3 h-3 text-[#dba8c1]" />
                            }
                          </button>
                          <AnimatePresence>
                            {expandedOutfit && (
                              <motion.p
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="text-xs text-[#9b7a8a] mt-2 leading-relaxed italic overflow-hidden"
                              >
                                {outfit}
                              </motion.p>
                            )}
                          </AnimatePresence>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* No selection hint */}
              {!selectedColor && (
                <p className="text-center text-xs text-[#9b7a8a] mt-2 italic">
                  Tap a colour to see outfit suggestions ✦
                </p>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default ColorPaletteTool;
