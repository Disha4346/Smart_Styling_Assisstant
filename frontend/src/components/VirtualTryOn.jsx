import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Sparkles, User, Shirt, CheckCircle, RefreshCcw } from 'lucide-react';
import axios from 'axios';

const VirtualTryOn = () => {
  const [userImage, setUserImage] = useState(null);
  const [processedImage, setProcessedImage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [step, setStep] = useState(0); 

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setUserImage(URL.createObjectURL(file));
      setIsProcessing(true);
      setStep(1);

      const formData = new FormData();
      formData.append('user_image', file);

      try {
        const response = await axios.post('http://localhost:8000/try-on', formData);
        if (response.data.processed_image) {
          setProcessedImage(response.data.processed_image);
          setAnalysis({
            bodyShape: response.data.body_shape,
            recommendation: response.data.fit_recommendation
          });
          setStep(4);
        }
      } catch (err) {
        console.error('AI Processing failed:', err);
        setStep(0);
      } finally {
        setIsProcessing(false);
      }
    }
  };

  const steps = [
    "Analyzing body pose...",
    "Segmenting clothing areas...",
    "Warping garment to fit...",
    "Finalizing texture blend..."
  ];

  return (
    <div className="pt-32 pb-20 px-8 max-w-6xl mx-auto">
      <div className="text-center mb-16">
        <h1 className="text-5xl font-bold gradient-text mb-4">AI Virtual Try-On</h1>
        <p className="text-secondary text-lg">See yourself in any outfit instantly using our advanced warping technology.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        {/* Left Side: User Image / Upload */}
        <div className="glass-card rounded-[40px] p-8 aspect-square flex flex-col items-center justify-center relative overflow-hidden">
          <AnimatePresence mode="wait">
            {!userImage ? (
              <motion.label
                key="upload"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="cursor-pointer flex flex-col items-center group"
              >
                <div className="w-24 h-24 rounded-full bg-brand-muted flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <User className="w-10 h-10 text-brand-soft" />
                </div>
                <span className="text-xl font-semibold mb-2">Upload Your Photo</span>
                <span className="text-secondary text-sm text-center px-12">Full body or half body photo works best.</span>
                <input type="file" className="hidden" onChange={handleUpload} accept="image/*" />
                <div className="mt-8 px-8 py-3 bg-brand-dark text-white rounded-full flex items-center gap-2">
                  <Upload className="w-4 h-4" />
                  Select File
                </div>
              </motion.label>
            ) : (
              <motion.div key="preview" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full h-full">
                <img src={processedImage || userImage} alt="User" className="w-full h-full object-cover rounded-3xl" />
                {isProcessing && (
                  <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex flex-col items-center justify-center text-white">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      className="mb-6"
                    >
                      <RefreshCcw className="w-12 h-12" />
                    </motion.div>
                    <div className="space-y-2 text-center">
                      {steps.map((s, i) => (
                        <motion.p 
                          key={i}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: step > i ? 1 : step === i ? [0.4, 1, 0.4] : 0 }}
                          className={`text-sm ${step > i ? 'text-green-400 font-medium' : ''}`}
                        >
                          {step > i && "✓ "} {s}
                        </motion.p>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right Side: Results / Controls */}
        <div className="space-y-8">
          <div className="glass-card rounded-[32px] p-8">
            <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Shirt className="w-6 h-6 text-brand-soft" />
              Selected Item
            </h3>
            <div className="flex gap-6 items-center">
              <div className="w-24 h-32 bg-brand-muted rounded-2xl overflow-hidden">
                {/* Placeholder for selected clothing */}
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <Shirt className="w-8 h-8" />
                </div>
              </div>
              <div>
                <p className="font-semibold text-lg">Premium Linen Shirt</p>
                <p className="text-secondary">Category: Top | Color: Beige</p>
                <div className="mt-4 flex gap-2">
                  <span className="px-3 py-1 bg-green-50 text-green-600 text-xs font-bold rounded-full">INSTOCK</span>
                  <span className="px-3 py-1 bg-purple-50 text-purple-600 text-xs font-bold rounded-full">AI COMPATIBLE</span>
                </div>
              </div>
            </div>
          </div>

          <div className="glass-card rounded-[32px] p-8">
            <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-yellow-500" />
              Style Analysis
            </h3>
            <p className="text-secondary mb-6 italic">
              "{analysis?.recommendation || "Based on your skin tone and body shape, this fit will provide a relaxed yet sophisticated look."}"
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-white/50 rounded-2xl border border-gray-100">
                <p className="text-xs text-secondary uppercase font-bold tracking-widest mb-1">Detected Shape</p>
                <p className="text-2xl font-bold">{analysis?.bodyShape || "Athletic"}</p>
              </div>
              <div className="p-4 bg-white/50 rounded-2xl border border-gray-100">
                <p className="text-xs text-secondary uppercase font-bold tracking-widest mb-1">Trend Index</p>
                <p className="text-2xl font-bold">High</p>
              </div>
            </div>
          </div>

          <button 
            disabled={!userImage || isProcessing}
            className={`w-full py-6 rounded-[24px] font-bold text-xl flex items-center justify-center gap-3 transition-all shadow-xl ${
              !userImage || isProcessing 
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                : 'bg-brand-dark text-white hover:bg-brand-soft hover:-translate-y-1'
            }`}
          >
            <Sparkles className="w-6 h-6" />
            Generate Try-On
          </button>
        </div>
      </div>
    </div>
  );
};

export default VirtualTryOn;
