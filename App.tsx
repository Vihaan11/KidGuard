
import React, { useState, useEffect, useRef } from 'react';
import { AnalysisSettings, AnalysisResult, ImageFile } from './types.ts';
import { DEFAULT_SETTINGS } from './constants.ts';
import { analyzeScreenshots } from './services/geminiService.ts';
import SettingsPanel from './components/SettingsPanel.tsx';
import ResultCard from './components/ResultCard.tsx';

const App: React.FC = () => {
  const [settings, setSettings] = useState<AnalysisSettings>(DEFAULT_SETTINGS);
  const [images, setImages] = useState<ImageFile[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (window.location.hash === '#share') {
      // Logic for handling shared files can be added here
    }
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newImages: ImageFile[] = (Array.from(files) as File[]).map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      preview: URL.createObjectURL(file)
    }));

    setImages(prev => [...prev, ...newImages]);
    setResult(null);
    setError(null);
  };

  const removeImage = (id: string) => {
    setImages(prev => prev.filter(img => img.id !== id));
  };

  const startAnalysis = async () => {
    if (images.length === 0) {
      setError("Please upload at least one screenshot.");
      return;
    }

    setIsAnalyzing(true);
    setError(null);
    try {
      const files = images.map(img => img.file);
      const analysisResult = await analyzeScreenshots(files, settings);
      setResult(analysisResult);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to analyze screenshots. Please check your API configuration.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const reset = () => {
    setImages([]);
    setResult(null);
    setError(null);
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-slate-950 px-4 py-8 md:py-12 font-sans selection:bg-blue-500 selection:text-white">
      <header className="w-full max-w-4xl flex justify-between items-center mb-8">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 p-2.5 rounded-xl shadow-lg shadow-blue-900/40">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-white tracking-tight">CCTV Guardian</h1>
            <p className="text-xs text-slate-500 font-medium uppercase tracking-widest">Intelligent Monitoring</p>
          </div>
        </div>

        <button 
          onClick={() => setShowSettings(true)}
          id="btn_open_settings"
          className="p-3 bg-slate-900 border border-slate-800 rounded-xl hover:bg-slate-800 transition-colors text-slate-400 hover:text-white"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </button>
      </header>

      <main className="w-full max-w-2xl space-y-6 flex-grow">
        <section className={`p-1 rounded-3xl bg-gradient-to-b from-slate-800 to-slate-900 border border-slate-700/50 shadow-2xl transition-all ${isAnalyzing ? 'opacity-50 pointer-events-none' : ''}`}>
          <div className="bg-slate-900 rounded-[1.4rem] p-6">
            <input 
              type="file" 
              multiple 
              accept="image/*" 
              onChange={handleFileChange}
              ref={fileInputRef}
              className="hidden"
              id="input_file_picker"
            />
            
            {images.length === 0 ? (
              <button 
                onClick={() => fileInputRef.current?.click()}
                id="btn_upload"
                className="w-full py-16 flex flex-col items-center justify-center border-2 border-dashed border-slate-800 rounded-2xl hover:border-blue-500/50 hover:bg-slate-800/30 transition-all group"
              >
                <div className="bg-slate-800 p-4 rounded-2xl mb-4 group-hover:scale-110 transition-transform">
                  <svg className="w-10 h-10 text-slate-500 group-hover:text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                </div>
                <p className="text-slate-300 font-semibold text-lg">Upload CCTV Screenshots</p>
                <p className="text-slate-500 text-sm mt-1">Supports multi-image analysis</p>
              </button>
            ) : (
              <div className="space-y-6">
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                  {images.map((img) => (
                    <div key={img.id} className="relative aspect-square group rounded-xl overflow-hidden border border-slate-700">
                      <img src={img.preview} alt="Upload" className="w-full h-full object-cover" />
                      <button 
                        onClick={() => removeImage(img.id)}
                        className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))}
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="aspect-square flex flex-col items-center justify-center bg-slate-800/50 border-2 border-dashed border-slate-700 rounded-xl hover:bg-slate-800 transition-colors"
                  >
                    <svg className="w-6 h-6 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </button>
                </div>
                
                <div className="flex gap-3">
                  <button 
                    onClick={startAnalysis}
                    id="btn_analyze"
                    className="flex-grow bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-xl transition-all shadow-xl shadow-blue-900/30 flex items-center justify-center gap-2"
                  >
                    Analyze Best Screenshot
                  </button>
                  <button 
                    onClick={reset}
                    id="btn_reset"
                    className="px-6 bg-slate-800 text-slate-400 hover:text-white rounded-xl transition-colors font-medium"
                  >
                    Reset
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>

        {isAnalyzing && (
          <div className="flex flex-col items-center justify-center py-12 space-y-4" id="loading_state">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-slate-400 font-medium animate-pulse">Running advanced vision analysis...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 p-4 rounded-xl text-red-200 text-sm flex items-center gap-3" id="error_message">
            {error}
          </div>
        )}

        {result && !isAnalyzing && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="mb-4 text-center">
              <span className="text-[10px] text-slate-500 uppercase font-bold tracking-[0.2em] mb-2 block">AI Selection: Image #{result.bestImageIndex + 1}</span>
              <div className="relative inline-block rounded-2xl overflow-hidden border-2 border-blue-500/30">
                <img 
                  src={images[result.bestImageIndex]?.preview} 
                  alt="Best Analysis Frame" 
                  className="max-h-64 object-contain bg-slate-900" 
                />
              </div>
            </div>
            <ResultCard result={result} />
          </div>
        )}
      </main>

      {showSettings && (
        <SettingsPanel 
          settings={settings} 
          onUpdate={setSettings} 
          onClose={() => setShowSettings(false)} 
        />
      )}
    </div>
  );
};

export default App;
