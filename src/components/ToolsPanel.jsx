import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  Wand2, 
  Minimize2, 
  Search, 
  CheckCircle2, 
  ShieldCheck, 
  Hash, 
  TrendingUp, 
  Copy, 
  AlertCircle,
  FileJson
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import useScrollReveal from '../hooks/useScrollReveal';

const ToolsPanel = ({ triggerToast }) => {
  const scrollRef = useScrollReveal();

  // --- 1. Code Formatter ---
  const [formatInput, setFormatInput] = useState('');
  const [formatLang, setFormatLang] = useState('babel');
  const [formatOutput, setFormatOutput] = useState('');
  const handleFormat = async () => {
    try {
      if (!window.prettier) throw new Error('Prettier not loaded');
      const formatted = await window.prettier.format(formatInput, {
        parser: formatLang,
        plugins: window.prettierPlugins,
      });
      setFormatOutput(formatted);
      triggerToast('Code formatted!');
    } catch (err) {
      triggerToast(err.message, 'error');
    }
  };

  // --- 2. Minifier ---
  const [minifyInput, setMinifyInput] = useState('');
  const [minifyOutput, setMinifyOutput] = useState('');
  const [minifyStats, setMinifyStats] = useState(null);
  const handleMinify = () => {
    const minified = minifyInput.replace(/\s+/g, ' ').replace(/\/\*[\s\S]*?\*\/|([^\\:]|^)\/\/.*$/gm, '$1').trim();
    setMinifyOutput(minified);
    const originalSize = new Blob([minifyInput]).size;
    const minifiedSize = new Blob([minified]).size;
    const reduction = ((originalSize - minifiedSize) / originalSize * 100).toFixed(1);
    setMinifyStats({ originalSize, minifiedSize, reduction });
    triggerToast('Code minified!');
  };

  // --- 3. Regex Tester ---
  const [regexPattern, setRegexPattern] = useState('');
  const [regexText, setRegexText] = useState('');
  const regexResults = useMemo(() => {
    if (!regexPattern) return null;
    try {
      const re = new RegExp(regexPattern, 'g');
      const matches = [...regexText.matchAll(re)];
      return { matches, count: matches.length };
    } catch (e) {
      return { error: e.message };
    }
  }, [regexPattern, regexText]);

  // --- 4. JSON/YAML Validator ---
  const [validatorInput, setValidatorInput] = useState('');
  const [validatorResult, setValidatorResult] = useState(null);
  const handleValidate = (val) => {
    setValidatorInput(val);
    if (!val.trim()) {
      setValidatorResult(null);
      return;
    }
    try {
      if (val.trim().startsWith('{') || val.trim().startsWith('[')) {
        const parsed = JSON.parse(val);
        setValidatorResult({ type: 'JSON', valid: true, data: JSON.stringify(parsed, null, 2) });
      } else {
        const parsed = window.jsyaml.load(val);
        setValidatorResult({ type: 'YAML', valid: true, data: JSON.stringify(parsed, null, 2) });
      }
    } catch (e) {
      setValidatorResult({ valid: false, error: e.message });
    }
  };

  // --- 5. Encoder/Hash ---
  const [encodeInput, setEncodeInput] = useState('');
  const [encodeOutput, setEncodeOutput] = useState('');
  const handleEncode = (type) => {
    try {
      let result = '';
      switch (type) {
        case 'b64-en': result = btoa(encodeInput); break;
        case 'b64-de': result = atob(encodeInput); break;
        case 'md5': result = window.CryptoJS.MD5(encodeInput).toString(); break;
        case 'sha256': result = window.CryptoJS.SHA256(encodeInput).toString(); break;
      }
      setEncodeOutput(result);
    } catch (e) {
      triggerToast('Invalid input', 'error');
    }
  };

  // --- 6. Token Counter ---
  const [tokenText, setTokenText] = useState('');
  const tokenCounts = useMemo(() => {
    const charCount = tokenText.length;
    return {
      gpt4: Math.ceil(charCount / 3.8),
      gpt3: Math.ceil(charCount / 4),
      claude: Math.ceil(charCount / 3.5),
      llama: Math.ceil(charCount / 3.2)
    };
  }, [tokenText]);

  // --- 7. Big-O Complexity ---
  const [selectedComplexity, setSelectedComplexity] = useState('O(n)');
  const complexityData = useMemo(() => {
    const data = [];
    for (let n = 1; n <= 20; n++) {
      data.push({
        n,
        'O(1)': 1,
        'O(log n)': Math.log2(n),
        'O(n)': n,
        'O(n log n)': n * Math.log2(n),
        'O(n²)': n * n,
        'O(2^n)': Math.pow(2, n),
        'O(n!)': n > 10 ? 3628800 : [1, 1, 2, 6, 24, 120, 720, 5040, 40320, 362880, 3628800][n]
      });
    }
    return data;
  }, []);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    triggerToast('Copied!');
  };

  const tools = [
    { id: 'formatter', name: 'Code Formatter', icon: Wand2, color: 'text-blue-400', shadow: 'shadow-blue-500/20', bgGlow: 'bg-blue-500/10', border: 'border-blue-500/30' },
    { id: 'minifier', name: 'Code Minifier', icon: Minimize2, color: 'text-teal-400', shadow: 'shadow-teal-500/20', bgGlow: 'bg-teal-500/10', border: 'border-teal-500/30' },
    { id: 'regex', name: 'Regex Analyzer', icon: Search, color: 'text-amber-400', shadow: 'shadow-amber-500/20', bgGlow: 'bg-amber-500/10', border: 'border-amber-500/30' },
    { id: 'validator', name: 'Data Validator', icon: FileJson, color: 'text-purple-400', shadow: 'shadow-purple-500/20', bgGlow: 'bg-purple-500/10', border: 'border-purple-500/30' },
    { id: 'encoder', name: 'Crypto & Encoding', icon: ShieldCheck, color: 'text-indigo-400', shadow: 'shadow-indigo-500/20', bgGlow: 'bg-indigo-500/10', border: 'border-indigo-500/30' },
    { id: 'tokens', name: 'Token Estimator', icon: Hash, color: 'text-rose-400', shadow: 'shadow-rose-500/20', bgGlow: 'bg-rose-500/10', border: 'border-rose-500/30' },
    { id: 'complexity', name: 'Big-O Visualizer', icon: TrendingUp, color: 'text-fuchsia-400', shadow: 'shadow-fuchsia-500/20', bgGlow: 'bg-fuchsia-500/10', border: 'border-fuchsia-500/30' }
  ];

  const renderToolContent = (toolId) => {
    switch (toolId) {
      case 'formatter':
        return (
          <div className="flex-1 grid grid-rows-2 lg:grid-rows-1 lg:grid-cols-2 gap-6 h-full font-sans-premium">
            <textarea 
              value={formatInput}
              onChange={(e) => setFormatInput(e.target.value)}
              placeholder="Paste unformatted code here..."
              className="w-full h-full bg-black/20 border border-white/10 rounded-2xl p-6 text-sm font-mono text-slate-300 focus:outline-none focus:border-blue-500/50 resize-none custom-scrollbar shadow-inner"
            />
            <div className="relative w-full h-full bg-blue-900/10 border border-blue-500/20 rounded-2xl overflow-hidden shadow-[inset_0_0_30px_rgba(96,165,250,0.05)]">
              <pre className="w-full h-full p-6 text-sm font-mono text-blue-300 overflow-auto custom-scrollbar">
                {formatOutput || "// Output will appear here..."}
              </pre>
              {formatOutput && (
                <button 
                  onClick={() => copyToClipboard(formatOutput)}
                  className="absolute top-4 right-4 p-3 bg-blue-500/20 hover:bg-blue-500/40 rounded-xl text-blue-300 transition-all border border-blue-500/30"
                >
                  <Copy size={18} />
                </button>
              )}
            </div>
            {/* Tool specific controls floating at top */}
            <div className="absolute top-6 right-8 flex gap-3 z-20">
                <select 
                  value={formatLang} 
                  onChange={(e) => setFormatLang(e.target.value)}
                  className="bg-space-void border border-white/10 rounded-xl px-4 py-2 text-xs text-slate-300 outline-none font-bold cursor-pointer hover:border-blue-500/50 transition-colors"
                >
                  <option value="babel">JavaScript</option>
                  <option value="html">HTML</option>
                  <option value="postcss">CSS / SCSS</option>
                </select>
                <button onClick={handleFormat} className="px-6 py-2 bg-blue-500/20 hover:bg-blue-500/40 text-blue-300 text-xs font-black uppercase tracking-widest rounded-xl border border-blue-500/30 shadow-[0_0_15px_rgba(96,165,250,0.15)] transition-all">Format Code</button>
            </div>
          </div>
        );
      case 'minifier':
        return (
          <div className="flex-1 flex flex-col gap-6 h-full font-sans-premium">
             {minifyStats && (
              <div className="grid grid-cols-3 gap-6 mb-2">
                <div className="bg-white/5 p-6 rounded-2xl border border-white/10 flex flex-col items-center justify-center">
                  <span className="text-[11px] text-slate-500 uppercase font-black tracking-[0.2em] mb-2">Original</span>
                  <span className="text-2xl font-bold text-slate-200">{minifyStats.originalSize} <span className="text-sm">B</span></span>
                </div>
                <div className="bg-teal-900/20 p-6 rounded-2xl border border-teal-500/30 flex flex-col items-center justify-center shadow-[0_0_20px_rgba(45,212,191,0.1)]">
                  <span className="text-[11px] text-teal-500/70 uppercase font-black tracking-[0.2em] mb-2">Minified</span>
                  <span className="text-2xl font-bold text-teal-300">{minifyStats.minifiedSize} <span className="text-sm">B</span></span>
                </div>
                <div className="bg-teal-500/10 p-6 rounded-2xl border border-teal-500/20 flex flex-col items-center justify-center">
                  <span className="text-[11px] text-teal-400 uppercase font-black tracking-[0.2em] mb-2">Reduction</span>
                  <span className="text-3xl font-black text-teal-400 drop-shadow-[0_0_10px_rgba(45,212,191,0.3)]">-{minifyStats.reduction}%</span>
                </div>
              </div>
            )}
            <div className="flex-1 grid grid-rows-2 lg:grid-rows-1 lg:grid-cols-2 gap-6">
              <textarea 
                value={minifyInput}
                onChange={(e) => setMinifyInput(e.target.value)}
                placeholder="Paste code to minify..."
                className="w-full h-full bg-black/20 border border-white/10 rounded-2xl p-6 text-sm font-mono text-slate-300 focus:outline-none focus:border-teal-500/50 resize-none custom-scrollbar"
              />
              <textarea 
                readOnly
                value={minifyOutput}
                placeholder="// Minified output will appear here..."
                className="w-full h-full bg-teal-900/10 border border-teal-500/20 rounded-2xl p-6 text-sm font-mono text-teal-300 focus:outline-none resize-none custom-scrollbar"
              />
            </div>
             <div className="absolute top-6 right-8 flex gap-3 z-20">
               <button onClick={handleMinify} className="px-8 py-2.5 bg-teal-500/20 hover:bg-teal-500/40 text-teal-300 text-xs font-black uppercase tracking-widest rounded-xl border border-teal-500/30 shadow-[0_0_20px_rgba(45,212,191,0.2)] transition-all">Minify Code</button>
             </div>
          </div>
        );
      case 'regex':
        return (
          <div className="flex-1 flex flex-col gap-6 h-full font-sans-premium">
            <div className="relative mt-2">
              <span className="absolute left-6 top-1/2 -translate-y-1/2 text-amber-500/50 font-mono text-2xl">/</span>
              <input 
                type="text" 
                value={regexPattern}
                onChange={(e) => setRegexPattern(e.target.value)}
                placeholder="Enter regex pattern..."
                className="w-full bg-amber-900/10 border border-amber-500/30 rounded-2xl pl-12 pr-16 py-6 text-xl font-mono text-amber-300 outline-none focus:border-amber-400 transition-colors shadow-[0_0_20px_rgba(251,191,36,0.05)]"
              />
              <span className="absolute right-6 top-1/2 -translate-y-1/2 text-amber-500/50 font-mono text-2xl">/g</span>
            </div>
            <div className="flex justify-between items-center px-2">
              {regexResults && !regexResults.error && (
                <div className="py-2 text-[11px] font-black uppercase tracking-[0.2em] text-amber-500 bg-amber-500/10 px-4 rounded-lg border border-amber-500/20">
                  {regexResults.count} matches found in text
                </div>
              )}
              {regexResults && regexResults.error && (
                <div className="py-2 text-sm text-red-400 flex items-center gap-2">
                  <AlertCircle size={18} /> {regexResults.error}
                </div>
              )}
            </div>
            <textarea 
              value={regexText}
              onChange={(e) => setRegexText(e.target.value)}
              placeholder="Paste test string here..."
              className="flex-1 w-full bg-black/20 border border-white/10 rounded-2xl p-6 text-sm font-mono text-slate-300 focus:outline-none focus:border-amber-500/50 resize-none custom-scrollbar"
            />
          </div>
        );
      case 'validator':
        return (
          <div className="flex-1 grid grid-rows-2 lg:grid-rows-1 lg:grid-cols-2 gap-6 h-full font-sans-premium">
            <textarea 
              value={validatorInput}
              onChange={(e) => handleValidate(e.target.value)}
              placeholder="Paste JSON or YAML payload here for instant validation..."
              className="w-full h-full bg-black/20 border border-white/10 rounded-2xl p-6 text-sm font-mono text-slate-300 focus:outline-none focus:border-purple-500/50 resize-none custom-scrollbar shadow-inner"
            />
            <div className="w-full h-full bg-purple-900/10 border border-purple-500/20 rounded-2xl overflow-hidden flex flex-col relative shadow-[inset_0_0_30px_rgba(192,132,252,0.05)]">
              {validatorResult ? (
                <>
                  <div className={`p-4 border-b flex items-center gap-3 text-sm font-black uppercase tracking-widest ${validatorResult.valid ? 'border-purple-500/30 text-purple-400 bg-purple-500/10' : 'border-red-500/30 text-red-400 bg-red-500/10'}`}>
                     {validatorResult.valid ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                     {validatorResult.valid ? `Valid ${validatorResult.type} Detected` : 'Syntax Error'}
                  </div>
                  {validatorResult.valid ? (
                    <pre className="p-6 text-sm font-mono text-purple-300 overflow-auto flex-1 custom-scrollbar">
                      {validatorResult.data}
                    </pre>
                  ) : (
                    <div className="p-6 text-sm font-mono text-red-300 italic flex-1">
                      {validatorResult.error}
                    </div>
                  )}
                </>
              ) : (
                <div className="flex flex-col items-center justify-center flex-1 text-[11px] uppercase font-black tracking-[0.2em] text-slate-600 gap-4">
                  <FileJson size={48} className="opacity-20" />
                  Awaiting Input
                </div>
              )}
            </div>
          </div>
        );
      case 'encoder':
        return (
           <div className="flex-1 flex flex-col gap-6 h-full font-sans-premium">
            <textarea 
              value={encodeInput}
              onChange={(e) => setEncodeInput(e.target.value)}
              placeholder="Enter string to encode or hash..."
              className="w-full h-40 bg-black/20 border border-white/10 rounded-2xl p-6 text-sm font-mono text-slate-300 focus:outline-none focus:border-indigo-500/50 resize-none shadow-inner"
            />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <button onClick={() => handleEncode('b64-en')} className="py-4 bg-indigo-500/10 hover:bg-indigo-500/30 text-indigo-300 text-xs font-black uppercase tracking-widest rounded-xl border border-indigo-500/30 transition-all hover:shadow-[0_0_20px_rgba(129,140,248,0.2)]">Base64 Encode</button>
              <button onClick={() => handleEncode('b64-de')} className="py-4 bg-indigo-500/10 hover:bg-indigo-500/30 text-indigo-300 text-xs font-black uppercase tracking-widest rounded-xl border border-indigo-500/30 transition-all hover:shadow-[0_0_20px_rgba(129,140,248,0.2)]">Base64 Decode</button>
              <button onClick={() => handleEncode('md5')} className="py-4 bg-indigo-500/10 hover:bg-indigo-500/30 text-indigo-300 text-xs font-black uppercase tracking-widest rounded-xl border border-indigo-500/30 transition-all hover:shadow-[0_0_20px_rgba(129,140,248,0.2)]">MD5 Hash</button>
              <button onClick={() => handleEncode('sha256')} className="py-4 bg-indigo-500/10 hover:bg-indigo-500/30 text-indigo-300 text-xs font-black uppercase tracking-widest rounded-xl border border-indigo-500/30 transition-all hover:shadow-[0_0_20px_rgba(129,140,248,0.2)]">SHA-256 Hash</button>
            </div>
            {encodeOutput && (
              <div className="flex-1 mt-2 relative w-full bg-indigo-900/10 border border-indigo-500/30 rounded-2xl p-6 shadow-[0_0_20px_rgba(129,140,248,0.05)]">
                <p className="text-[11px] uppercase font-black tracking-[0.2em] text-indigo-500 mb-4">Generated Output</p>
                <div className="text-lg font-mono text-indigo-200 break-all select-all leading-relaxed">
                  {encodeOutput}
                </div>
                <button 
                  onClick={() => copyToClipboard(encodeOutput)}
                  className="absolute top-6 right-6 p-3 bg-indigo-500/20 hover:bg-indigo-500/40 rounded-xl text-indigo-300 transition-all border border-indigo-500/30"
                >
                  <Copy size={16} />
                </button>
              </div>
            )}
          </div>
        );
      case 'tokens':
        return (
          <div className="flex-1 flex flex-col gap-6 h-full font-sans-premium">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-2">
              <div className="bg-rose-900/10 p-6 rounded-2xl border border-rose-500/20 shadow-[0_0_20px_rgba(251,113,133,0.05)] flex flex-col items-center justify-center">
                <p className="text-[11px] font-black text-rose-500/70 uppercase tracking-[0.2em] mb-2">GPT-4</p>
                <p className="text-4xl font-black text-rose-400 drop-shadow-[0_0_10px_rgba(251,113,133,0.3)]">{tokenCounts.gpt4}</p>
              </div>
              <div className="bg-blue-900/10 p-6 rounded-2xl border border-blue-500/20 shadow-[0_0_20px_rgba(96,165,250,0.05)] flex flex-col items-center justify-center">
                <p className="text-[11px] font-black text-blue-500/70 uppercase tracking-[0.2em] mb-2">Claude 3</p>
                <p className="text-4xl font-black text-blue-400 drop-shadow-[0_0_10px_rgba(96,165,250,0.3)]">{tokenCounts.claude}</p>
              </div>
              <div className="bg-teal-900/10 p-6 rounded-2xl border border-teal-500/20 shadow-[0_0_20px_rgba(45,212,191,0.05)] flex flex-col items-center justify-center">
                <p className="text-[11px] font-black text-teal-500/70 uppercase tracking-[0.2em] mb-2">GPT-3.5</p>
                <p className="text-4xl font-black text-teal-400 drop-shadow-[0_0_10px_rgba(45,212,191,0.3)]">{tokenCounts.gpt3}</p>
              </div>
              <div className="bg-amber-900/10 p-6 rounded-2xl border border-amber-500/20 shadow-[0_0_20px_rgba(251,191,36,0.05)] flex flex-col items-center justify-center">
                <p className="text-[11px] font-black text-amber-500/70 uppercase tracking-[0.2em] mb-2">Llama 3</p>
                <p className="text-4xl font-black text-amber-400 drop-shadow-[0_0_10px_rgba(251,191,36,0.3)]">{tokenCounts.llama}</p>
              </div>
            </div>
            <textarea 
              value={tokenText}
              onChange={(e) => setTokenText(e.target.value)}
              placeholder="Paste prompt text here to estimate context size..."
              className="flex-1 w-full bg-black/20 border border-white/10 rounded-2xl p-6 text-sm font-mono text-slate-300 focus:outline-none focus:border-rose-500/50 resize-none custom-scrollbar"
            />
          </div>
        );
      case 'complexity':
        return (
          <div className="flex-1 flex flex-col gap-6 h-full font-sans-premium">
            <div className="flex-1 w-full bg-black/30 rounded-3xl border border-white/5 p-6 overflow-hidden relative">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={complexityData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                  <XAxis dataKey="n" hide />
                  <YAxis hide domain={[0, 100]} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'rgba(11, 19, 43, 0.9)', border: '1px solid rgba(232, 121, 249, 0.2)', borderRadius: '16px', backdropFilter: 'blur(20px)', padding: '12px' }}
                    itemStyle={{ fontSize: '14px', fontWeight: 'bold', color: '#E879F9' }}
                    labelStyle={{ display: 'none' }}
                  />
                  {['O(1)', 'O(log n)', 'O(n)', 'O(n log n)', 'O(n²)', 'O(2^n)'].map(key => (
                    <Line 
                      key={key} 
                      type="monotone" 
                      dataKey={key} 
                      stroke={key === selectedComplexity ? '#E879F9' : '#ffffff10'} 
                      strokeWidth={key === selectedComplexity ? 6 : 1} 
                      dot={key === selectedComplexity ? { r: 4, fill: '#E879F9' } : false} 
                      activeDot={key === selectedComplexity ? { r: 8 } : false} 
                      animationDuration={1500} 
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
              <div className="absolute bottom-8 left-8 text-xs font-black uppercase tracking-[0.2em] text-fuchsia-500/40">
                Data Volume (N) vs Operations (Time)
              </div>
            </div>
            
            <div className="absolute top-6 right-8 flex gap-3 z-20">
              <select 
                value={selectedComplexity}
                onChange={(e) => setSelectedComplexity(e.target.value)}
                className="bg-space-void border border-fuchsia-500/40 rounded-xl px-6 py-2.5 text-xs text-fuchsia-300 font-black tracking-widest outline-none cursor-pointer shadow-[0_0_20px_rgba(232,121,249,0.1)]"
              >
                <option value="O(1)">O(1) CONSTANT</option>
                <option value="O(log n)">O(LOG N) LOGARITHMIC</option>
                <option value="O(n)">O(N) LINEAR</option>
                <option value="O(n log n)">O(N LOG N) LINEARITHMIC</option>
                <option value="O(n²)">O(N²) QUADRATIC</option>
                <option value="O(2^n)">O(2^N) EXPONENTIAL</option>
              </select>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-full flex-1 flex flex-col items-center" ref={scrollRef}>
      <div className="w-full max-w-[100vw] overflow-x-auto custom-scrollbar snap-x snap-mandatory flex gap-4 sm:gap-8 pb-12 pt-4 px-4 sm:px-[5vw] lg:px-[10vw]">
        {tools.map((tool, index) => (
          <div 
            key={tool.id} 
            className={`reveal-item stagger-${(index % 5) + 1} snap-center shrink-0 w-[88vw] sm:w-[90vw] lg:w-[80vw] xl:w-[70vw] glass-card border border-white/10 p-5 sm:p-8 flex flex-col relative overflow-hidden bg-[rgba(15,23,42,0.85)] rounded-[2rem] shadow-2xl transition-all duration-500 hover:shadow-[0_30px_100px_rgba(0,0,0,0.6)]`}
            style={{ height: 'clamp(400px, 60vh, 750px)' }}
          >
            {/* Ambient Background Glow */}
            <div className={`absolute top-0 right-0 w-96 h-96 ${tool.bgGlow} blur-[120px] rounded-full pointer-events-none opacity-50`} />
            <div className={`absolute bottom-0 left-0 w-96 h-96 ${tool.bgGlow} blur-[120px] rounded-full pointer-events-none opacity-30`} />

            {/* Decorative HUD Corners */}
            <div className={`absolute top-0 left-0 w-12 h-12 border-t-4 border-l-4 ${tool.border} m-6 pointer-events-none rounded-tl-xl`} />
            <div className={`absolute top-0 right-0 w-12 h-12 border-t-4 border-r-4 ${tool.border} m-6 pointer-events-none rounded-tr-xl`} />
            <div className={`absolute bottom-0 left-0 w-12 h-12 border-b-4 border-l-4 ${tool.border} m-6 pointer-events-none rounded-bl-xl`} />
            <div className={`absolute bottom-0 right-0 w-12 h-12 border-b-4 border-r-4 ${tool.border} m-6 pointer-events-none rounded-br-xl`} />
            
            {/* Header Area */}
            <div className="flex items-center gap-3 sm:gap-4 mb-5 sm:mb-8 relative z-20">
              <div className={`p-3 sm:p-4 rounded-2xl ${tool.bgGlow} ${tool.color} shadow-lg ${tool.shadow}`}>
                <tool.icon size={22} className="sm:hidden" />
                <tool.icon size={28} className="hidden sm:block" />
              </div>
              <h2 className={`text-xl sm:text-2xl font-black uppercase tracking-[0.15em] sm:tracking-[0.2em] ${tool.color} drop-shadow-md`}>
                {tool.name}
              </h2>
            </div>

            {/* Tool Interactive Area */}
            <div className="flex-1 w-full relative z-10 flex gap-8">
              {/* Main Tool Area */}
              <div className="flex-1 flex flex-col">
                {renderToolContent(tool.id)}
              </div>
              
              {/* Decorative Server Metrics Sidebar */}
              <div className="hidden lg:flex w-64 border-l border-white/10 pl-6 flex-col gap-6 shrink-0 font-mono text-[10px] text-slate-400">
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-center text-xs font-black uppercase tracking-widest text-slate-300">
                    <span>System Load</span>
                    <span className="text-green-400">OK</span>
                  </div>
                  <div className="h-1 bg-white/10 rounded overflow-hidden">
                    <div className="h-full bg-green-500/50 w-[45%]" />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-center text-xs font-black uppercase tracking-widest text-slate-300">
                    <span>Network Latency</span>
                    <span className="text-blue-400">12ms</span>
                  </div>
                  <div className="h-1 bg-white/10 rounded overflow-hidden">
                    <div className="h-full bg-blue-500/50 w-[15%]" />
                  </div>
                </div>

                <div className="flex-1 flex flex-col gap-2 mt-4">
                  <span className="text-xs font-black uppercase tracking-widest text-slate-300 mb-2">Live Activity Log</span>
                  <div className="flex-1 overflow-hidden relative">
                     <div className="absolute inset-0 flex flex-col gap-2 opacity-60">
                       <div className="flex gap-2"><span className="text-blue-400">0x00A1</span><span>INITIATING HANDSHAKE</span></div>
                       <div className="flex gap-2"><span className="text-teal-400">0x00A2</span><span>CONNECTION SECURED</span></div>
                       <div className="flex gap-2"><span className="text-purple-400">0x00A3</span><span>AWAITING INPUT DATA</span></div>
                       <div className="flex gap-2"><span className="text-rose-400">0x00A4</span><span>PROCESS IDLE</span></div>
                       <div className="flex gap-2"><span className="text-blue-400">0x00A5</span><span>HEARTBEAT OK</span></div>
                       <div className="flex gap-2"><span className="text-teal-400">0x00A6</span><span>MEMORY ALLOC: 42MB</span></div>
                       <div className="flex gap-2"><span className="text-purple-400">0x00A7</span><span>CACHE WARMED</span></div>
                     </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Scroll indicator */}
      <div className="flex gap-2 mb-8 opacity-50">
        <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
        <div className="w-2 h-2 rounded-full bg-white animate-pulse delay-75" />
        <div className="w-2 h-2 rounded-full bg-white animate-pulse delay-150" />
        <span className="text-[10px] ml-2 uppercase font-black tracking-widest text-white">Scroll Horizontally</span>
      </div>
    </div>
  );
};

export default ToolsPanel;
