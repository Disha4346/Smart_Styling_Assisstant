import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Tag, Layers, Upload, Sparkles, X, CheckCircle2 } from 'lucide-react';
import axios from 'axios';

const WardrobePage = () => {
  const [items, setItems] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [newItem, setNewItem] = useState({ category: 'Top', type: '', color: '', brand: '' });
  const fileInputRef = useRef(null);

  // Mock userId for now
  const userId = 'user_123';

  useEffect(() => {
    fetchWardrobe();
  }, []);

  const fetchWardrobe = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/wardrobe/${userId}`);
      setItems(res.data);
    } catch (err) {
      console.error('Error fetching wardrobe:', err);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleAddItem = async (e) => {
    e.preventDefault();
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('image', selectedFile);
      formData.append('userId', userId);
      formData.append('category', newItem.category);
      formData.append('type', newItem.type);
      formData.append('color', newItem.color);
      formData.append('brand', newItem.brand);

      await axios.post('http://localhost:5000/api/wardrobe/add', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setIsAddModalOpen(false);
      setSelectedFile(null);
      setPreviewUrl(null);
      setNewItem({ category: 'Top', type: '', color: '', brand: '' });
      fetchWardrobe();
    } catch (err) {
      console.error('Error adding item:', err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/wardrobe/${id}`);
      fetchWardrobe();
    } catch (err) {
      console.error('Error deleting item:', err);
    }
  };

  return (
    <div className="pt-32 pb-20 px-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
        <div>
          <h1 className="text-5xl font-bold gradient-text mb-4">Your Digital Wardrobe</h1>
          <p className="text-secondary text-lg max-w-2xl">Upload your clothes and let AI help you style them perfectly for any occasion.</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 bg-brand-dark text-white px-8 py-4 rounded-2xl hover:bg-brand-soft transition-all shadow-xl"
        >
          <Plus className="w-5 h-5" />
          <span className="font-semibold">Add New Item</span>
        </motion.button>
      </div>

      {/* Wardrobe Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        <AnimatePresence>
          {items.map((item) => (
            <motion.div
              key={item._id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="glass-card group rounded-[32px] overflow-hidden flex flex-col h-full border border-white/40 shadow-sm hover:shadow-2xl transition-all duration-500"
            >
              <div className="aspect-[4/5] bg-brand-muted relative overflow-hidden">
                {item.imageUrl ? (
                  <img src={item.imageUrl} alt={item.type} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Layers className="w-12 h-12 text-gray-300" />
                  </div>
                )}
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0">
                  <button onClick={() => handleDelete(item._id)} className="p-3 bg-white/90 backdrop-blur rounded-2xl text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-lg">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
                {item.aiSuggestions && (
                  <div className="absolute top-4 left-4">
                    <div className="flex items-center gap-1.5 bg-brand-dark/80 backdrop-blur-md text-white px-3 py-1.5 rounded-xl text-xs font-medium shadow-lg border border-white/20">
                      <Sparkles className="w-3 h-3 text-brand-soft" />
                      <span>AI Styled</span>
                    </div>
                  </div>
                )}
              </div>
              <div className="p-6 flex-grow flex flex-col">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-bold text-xl text-gray-800 line-clamp-1">{item.type || item.category}</h3>
                    <div className="flex gap-2 mt-1">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-brand-soft bg-brand-muted px-2 py-0.5 rounded-full">{item.category}</span>
                      {item.metadata?.color && (
                        <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">{item.metadata.color}</span>
                      )}
                    </div>
                  </div>
                </div>
                
                {item.aiSuggestions ? (
                  <div className="mt-auto p-4 rounded-2xl bg-brand-muted/50 border border-brand-soft/10">
                    <p className="text-xs text-secondary leading-relaxed italic">
                      "{item.aiSuggestions}"
                    </p>
                  </div>
                ) : (
                  <p className="mt-auto text-xs text-gray-400">Add detailed metadata to get better styling tips.</p>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {items.length === 0 && (
          <div className="col-span-full py-32 text-center glass-card rounded-[40px] border-dashed border-2 border-gray-200">
            <div className="w-20 h-20 bg-brand-muted rounded-full flex items-center justify-center mx-auto mb-6">
              <Layers className="w-10 h-10 text-brand-soft" />
            </div>
            <h3 className="text-2xl font-bold mb-2">Empty Wardrobe</h3>
            <p className="text-secondary mb-8">Start adding items to build your digital collection.</p>
            <button 
              onClick={() => setIsAddModalOpen(true)}
              className="bg-brand-dark text-white px-6 py-3 rounded-xl hover:bg-brand-soft transition-all"
            >
              Add Your First Item
            </button>
          </div>
        )}
      </div>

      {/* Add Item Modal */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => !isUploading && setIsAddModalOpen(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-md" 
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white w-full max-w-2xl rounded-[40px] overflow-hidden relative z-10 shadow-2xl flex flex-col md:flex-row"
            >
              {/* Image Upload Area */}
              <div className="w-full md:w-1/2 bg-gray-50 p-8 border-b md:border-b-0 md:border-r border-gray-100 flex flex-col items-center justify-center">
                {previewUrl ? (
                  <div className="relative w-full aspect-[4/5] rounded-[32px] overflow-hidden shadow-lg group">
                    <img src={previewUrl} className="w-full h-full object-cover" alt="Preview" />
                    {!isUploading && (
                      <button 
                        onClick={() => { setSelectedFile(null); setPreviewUrl(null); }}
                        className="absolute top-4 right-4 p-2 bg-white/90 rounded-xl text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-lg"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                ) : (
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full aspect-[4/5] rounded-[32px] border-2 border-dashed border-gray-200 hover:border-brand-soft flex flex-col items-center justify-center gap-4 transition-all hover:bg-white group"
                  >
                    <div className="w-16 h-16 bg-brand-muted rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Upload className="w-8 h-8 text-brand-soft" />
                    </div>
                    <div className="text-center">
                      <p className="font-bold text-gray-700">Upload Image</p>
                      <p className="text-xs text-secondary mt-1">Drag and drop or click to browse</p>
                    </div>
                  </button>
                )}
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileSelect} 
                  className="hidden" 
                  accept="image/*"
                />
              </div>

              {/* Details Form */}
              <div className="w-full md:w-1/2 p-10">
                <div className="flex items-center gap-2 mb-6">
                  <div className="p-2 bg-brand-muted rounded-xl">
                    <Sparkles className="w-5 h-5 text-brand-soft" />
                  </div>
                  <h2 className="text-2xl font-bold">Item Details</h2>
                </div>
                
                <form onSubmit={handleAddItem} className="space-y-5">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-2 ml-1">Category</label>
                      <select 
                        value={newItem.category}
                        onChange={(e) => setNewItem({...newItem, category: e.target.value})}
                        className="w-full p-4 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-brand-soft outline-none transition-all text-sm font-medium"
                      >
                        <option>Top</option>
                        <option>Bottom</option>
                        <option>Outerwear</option>
                        <option>Shoes</option>
                        <option>Accessory</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-2 ml-1">Item Type</label>
                      <input 
                        type="text" 
                        placeholder="e.g. Linen Shirt"
                        value={newItem.type}
                        className="w-full p-4 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-brand-soft outline-none transition-all text-sm font-medium"
                        onChange={(e) => setNewItem({...newItem, type: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-2 ml-1">Color</label>
                      <input 
                        type="text" 
                        placeholder="e.g. Beige"
                        value={newItem.color}
                        className="w-full p-4 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-brand-soft outline-none transition-all text-sm font-medium"
                        onChange={(e) => setNewItem({...newItem, color: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-2 ml-1">Brand</label>
                      <input 
                        type="text" 
                        placeholder="e.g. Zara"
                        value={newItem.brand}
                        className="w-full p-4 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-brand-soft outline-none transition-all text-sm font-medium"
                        onChange={(e) => setNewItem({...newItem, brand: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-100 flex gap-3 mt-4">
                    <Sparkles className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                    <p className="text-[11px] text-blue-700 leading-relaxed">
                      <strong>AI Smart Tagging:</strong> Leave details empty and upload a photo to let our AI automatically identify and style your item!
                    </p>
                  </div>

                  <button 
                    type="submit" 
                    disabled={isUploading || !selectedFile}
                    className={`w-full py-5 rounded-2xl font-bold text-lg transition-all mt-4 flex items-center justify-center gap-3 ${
                      isUploading || !selectedFile 
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                        : 'bg-brand-dark text-white hover:bg-brand-soft shadow-lg hover:shadow-xl'
                    }`}
                  >
                    {isUploading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>AI is Analyzing...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-6 h-6" />
                        <span>Save to Wardrobe</span>
                      </>
                    )}
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default WardrobePage;
