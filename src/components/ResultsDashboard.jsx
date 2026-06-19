import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, Zap, Shield, AlertCircle, 
  ArrowRight, Activity, Loader2, Code2,
  ChevronRight, CheckCircle, Sparkles, Brain, Wand2, RefreshCcw, LayoutDashboard, GitCompare, 
  Map as MapIcon, Globe, PieChart as PieIcon, Info, HelpCircle, BookOpen, ExternalLink, X, AlertTriangle, Check, Copy
} from 'lucide-react';
import bestPracticesData from '../data/bestPractices.json';
import { explainError, fixBug } from '../utils/aiFeatures';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, 
  ResponsiveContainer, PieChart, Pie, Cell, Legend 
} from 'recharts';
import Editor, { DiffEditor } from '@monaco-editor/react';
import useScrollReveal from '../hooks/useScrollReveal';
import useCountUp from '../hooks/useCountUp';

const Card = ({ children, title, icon: Icon, accentClass = "text-cosmic-blue", delay = 0, fullWidth = false, index = 0 }) => (
  <div
    style={{ animation: `cardReveal 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${index * 120}ms forwards`, opacity: 0 }}
    className={`glass-card p-6 md:p-8 flex flex-col gap-5 border border-white/10 ${fullWidth ? 'lg:col-span-2' : ''} font-inter`}
  >
    <div className="flex items-center gap-3 mb-2 border-b border-white/5 pb-3">
      <Icon size={16} className={`${accentClass}`} />
      <h3 className="text-[11px] font-[600] uppercase tracking-[2.5px] text-stardust font-space">{title}</h3>
    </div>
    <div className="flex-1 flex flex-col gap-2">
      {children}
    </div>
  </div>
);

const Sparkline = ({ data }) => {
  if (data.length < 2) return null;
  const min = Math.min(...data.map(d => d.score));
  const max = Math.max(...data.map(d => d.score));
  const range = max - min || 1;
  const width = 100;
  const height = 30;
  const points = data.map((d, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((d.score - min) / range) * height;
    return `${x},${y}`;
  }).join(' ');

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-8 overflow-visible relative">
      <polyline
        fill="none"
        stroke="var(--cosmic-blue)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
        className="draw-sparkline"
        pathLength="100"
      />
      {data.map((d, i) => (
        <circle
          key={i}
          cx={(i / (data.length - 1)) * width}
          cy={height - ((d.score - min) / range) * height}
          r="2"
          fill="var(--cosmic-blue)"
          className={`hover:r-3 transition-all cursor-crosshair ${i === data.length - 1 ? 'animate-pulse drop-shadow-[0_0_5px_rgba(72,202,228,0.8)]' : ''}`}
        >
          <title>{`${d.score}% (${d.timestamp})`}</title>
        </circle>
      ))}
    </svg>
  );
};

const TypewriterText = ({ text, delay = 0 }) => {
  const [displayedText, setDisplayedText] = React.useState('');

  React.useEffect(() => {
    setDisplayedText('');
    let i = 0;
    let timer;
    const startTimer = setTimeout(() => {
      timer = setInterval(() => {
        setDisplayedText(text.slice(0, i + 1));
        i++;
        if (i >= text.length) clearInterval(timer);
      }, 10);
    }, delay);

    return () => {
      clearTimeout(startTimer);
      if (timer) clearInterval(timer);
    };
  }, [text, delay]);

  return <span>{displayedText}</span>;
};

const FunctionMap = ({ functions, calls }) => {
  if (!functions || functions.length === 0) return (
    <div className="flex flex-col items-center justify-center py-8 text-slate-600 opacity-40">
      <MapIcon size={24} className="mb-2" />
      <span className="text-[9px] font-black uppercase tracking-widest">No functions detected</span>
    </div>
  );

  const nodes = functions.map((name, i) => ({
    id: name,
    x: 40 + Math.cos(i * 1.5) * 60 + 100,
    y: 40 + Math.sin(i * 1.5) * 60 + 100,
    color: i === 0 ? '#a855f7' : '#2dd4bf'
  }));

  const edges = calls.map((call, i) => {
    const from = nodes.find(n => n.id === call.from) || { x: 140, y: 140 };
    const to = nodes.find(n => n.id === call.to) || nodes[0];
    return { from, to, id: i };
  });

  return (
    <div className="w-full h-48 bg-black/20 rounded-xl border border-white/5 relative overflow-hidden">
      <svg className="w-full h-full" viewBox="0 0 280 280">
        <defs>
          <marker id="arrow" markerWidth="6" markerHeight="6" refX="10" refY="3" orient="auto">
            <path d="M0,0 L0,6 L6,3 Z" fill="#ffffff20" />
          </marker>
        </defs>
        {edges.map(edge => (
          <line 
            key={edge.id}
            x1={edge.from.x} y1={edge.from.y} 
            x2={edge.to.x} y2={edge.to.y} 
            stroke="#ffffff10" strokeWidth="1.5" 
            markerEnd="url(#arrow)" 
          />
        ))}
        {nodes.map(node => (
          <g key={node.id}>
            <circle 
              cx={node.x} cy={node.y} r="12" 
              fill={node.color} fillOpacity="0.2" 
              stroke={node.color} strokeWidth="2" 
              className="cursor-pointer hover:fill-opacity-40 transition-all"
            />
            <text 
              x={node.x} y={node.y + 24} 
              textAnchor="middle" 
              className="text-[8px] font-black fill-slate-500 uppercase tracking-tighter"
            >{node.id}</text>
          </g>
        ))}
      </svg>
      <div className="absolute top-2 right-2 flex flex-col gap-1">
        <div className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-purple-500" /><span className="text-[7px] font-black text-slate-500 uppercase">Entry</span></div>
        <div className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-teal-400" /><span className="text-[7px] font-black text-slate-500 uppercase">Helper</span></div>
      </div>
    </div>
  );
};

const ResultsDashboard = ({ results, isLoading, onBugClick, onExplain, onRefactor, onFixBug, aiData, history, triggerToast, setCode }) => {
  const [filterSeverity, setFilterSeverity] = React.useState('all');
  const [activeAITab, setActiveAITab] = React.useState('explain');
  const [chatMessages, setChatMessages] = React.useState([
    { role: 'assistant', content: 'Hello! I am your CodeLens AI. Ask me anything about your code or the analysis results.' }
  ]);
  const [chatInput, setChatInput] = React.useState('');
  const [selectedBugIndex, setSelectedBugIndex] = React.useState(null);
  const [isBugModalOpen, setIsBugModalOpen] = React.useState(false);
  const [expandedPracticeId, setExpandedPracticeId] = React.useState(null);

  const scrollRef = useScrollReveal();
  const [displayedExplanation, setDisplayedExplanation] = React.useState('');
  const [activeTab, setActiveTab] = React.useState('overview');
  
  // Best Practice Library States
  const [selectedPractice, setSelectedPractice] = React.useState(null);
  
  // Error Dictionary States
  const [errorInput, setErrorInput] = React.useState('');
  const [errorExplanation, setErrorExplanation] = React.useState(null);
  const [isExplainingError, setIsExplainingError] = React.useState(false);

  // AI Bug Fix Modal States
  const [activeFixBug, setActiveFixBug] = React.useState(null);
  const [fixCodeOutput, setFixCodeOutput] = React.useState('');
  const [isFixingInProgress, setIsFixingInProgress] = React.useState(false);

  const animatedTotalLines = useCountUp(results?.size?.totalLines || 0, 800);
  const animatedPayload = useCountUp(results?.size?.bytes || 0, 800);
  const animatedScore = useCountUp(results?.qualityScore || 0, 1500);

  const handleInitiateAiFix = async (bug) => {
    setActiveFixBug(bug);
    setIsFixingInProgress(true);
    setFixCodeOutput('');
    try {
      const lang = results?.languages?.[0] || 'javascript';
      const fixedCode = await fixBug(results.code, bug.message, lang);
      setFixCodeOutput(fixedCode);
    } catch (err) {
      console.error("Error fixing bug:", err);
      setFixCodeOutput(`// AI could not fix the bug: ${err.message}\n${results.code}`);
      if (triggerToast) triggerToast("AI fix failed.", "error");
    } finally {
      setIsFixingInProgress(false);
    }
  };

  const handleOpenBestPractice = (key) => {
    const practice = bestPracticesData[key];
    if (practice) {
      setSelectedPractice(practice);
    } else {
      setSelectedPractice({
        title: key.replace(/\.$/, ""),
        explanation: "Best practice logic helps you write scalable, readable, and highly maintainable systems.",
        badCode: "// Sub-optimal layout or pattern",
        goodCode: "// Optimal, clean implementation",
        docsLink: "https://developer.mozilla.org"
      });
    }
  };

  const handleExplainError = async () => {
    if (!errorInput.trim()) return;
    setIsExplainingError(true);
    setErrorExplanation(null);
    try {
      const lang = results?.languages?.[0] || 'javascript';
      const explanation = await explainError(errorInput, lang);
      setErrorExplanation(explanation);
    } catch (err) {
      console.error("Error explaining error message:", err);
      if (triggerToast) triggerToast("Failed to diagnose the error message.", "error");
    } finally {
      setIsExplainingError(false);
    }
  };
  
  // Format history for sparkline
  const chartData = [...history].reverse().map((item, index) => ({
    analysis: index + 1,
    score: item.results.qualityScore,
    timestamp: new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }));
  
  // Simulated Typewriter Effect for AI Explanation
  React.useEffect(() => {
    if (aiData.explanation && aiData.explanation !== displayedExplanation) {
      let i = 0;
      const text = aiData.explanation;
      setDisplayedExplanation('');
      const timer = setInterval(() => {
        setDisplayedExplanation(text.slice(0, i + 1));
        i++;
        if (i >= text.length) clearInterval(timer);
      }, 5);
      return () => clearInterval(timer);
    }
  }, [aiData.explanation, displayedExplanation]);

  const bigOData = React.useMemo(() => {
    if (!results) return [];
    const data = [];
    const bigO = results.complexity.bigOTime;
    for (let n = 1; n <= 10; n++) {
      let val = 1;
      if (bigO === "O(n)") val = n;
      else if (bigO === "O(n²)") val = n * n;
      else if (bigO === "O(n³)") val = n * n * n;
      else if (bigO === "O(log n)") val = Math.log2(n);
      data.push({ n, value: val });
    }
    return data;
  }, [results?.complexity?.bigOTime]);

  const COLORS = ['#3b82f6', '#2dd4bf', '#a855f7', '#f43f5e', '#f59e0b'];
  const langData = React.useMemo(() => {
    if (!results) return [];
    return Object.entries(results.languageDistribution || {}).map(([name, value]) => ({ name, value }));
  }, [results?.languageDistribution]);

  if (isLoading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center glass-card border border-white/10 bg-space-void/40 backdrop-blur-2xl font-sans-premium">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <Loader2 size={40} className="text-cosmic-blue mb-4" />
        </motion.div>
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 animate-pulse font-sans-premium">Analyzing Code Architecture</p>
      </div>
    );
  }

  if (!results) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center glass-card border border-white/10 text-slate-500 bg-space-void/20 backdrop-blur-2xl font-sans-premium">
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          <Code2 size={48} className="mb-4 opacity-10" />
        </motion.div>
        <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40 font-sans-premium">Paste your code & click <span className="text-cosmic-blue/60">Analyze</span></p>
      </div>
    );
  }

  const { size, complexity, bugs, qualityScore, performance, suggestions } = results;
  const criticalCount = bugs ? bugs.filter(b => b.severity === 'Critical').length : 0;
  const filteredBugs = bugs ? (filterSeverity === 'critical' ? bugs.filter(b => b.severity === 'Critical') : bugs) : [];

  const getScoreInfo = (score) => {
    if (score > 75) return { color: '#06D6A0', label: 'Excellent', textColor: 'text-aurora-green', glow: 'drop-shadow-[0_0_8px_rgba(6,214,160,0.8)]' };
    if (score > 50) return { color: '#FFB627', label: 'Good', textColor: 'text-solar-gold', glow: 'drop-shadow-[0_0_8px_rgba(255,182,39,0.8)]' };
    return { color: '#FF4D6D', label: 'Fair', textColor: 'text-pulsar-red', glow: 'drop-shadow-[0_0_8px_rgba(255,77,109,0.8)]' };
  };

  const scoreInfo = getScoreInfo(qualityScore);

  const getPerfColor = (val, type) => {
    if (type === 'intensity' || type === 'usage') {
      if (val === 'Low') return 'bg-aurora-green';
      if (val === 'Medium') return 'bg-amber-500';
      return 'bg-red-500';
    }
    if (val > 75) return 'bg-aurora-green';
    if (val > 50) return 'bg-amber-500';
    return 'bg-red-500';
  };


  return (
    <div className="w-full pb-8" ref={scrollRef}>
      {/* Dashboard Tabs Pill Toggle */}
      <div className="relative mx-auto mb-6 p-1 rounded-[50px] bg-[rgba(5,5,26,0.9)] w-fit border border-[rgba(157,78,221,0.2)] font-sans-premium flex items-center shadow-inner">
        {/* Animated pill background */}
        <div 
          className="absolute top-1 bottom-1 w-[calc(50%-4px)] rounded-[50px] bg-[var(--gradient-nebula)] transition-all duration-200 ease-in-out shadow-lg shadow-purple-500/20"
          style={{ left: activeTab === 'overview' ? '4px' : 'calc(50%)' }}
        />
        
        <button 
          onClick={() => setActiveTab('overview')}
          className={`relative z-10 flex items-center gap-2 px-6 py-2 rounded-[50px] text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer font-sans-premium ${
            activeTab === 'overview' ? 'text-white' : 'text-stardust bg-transparent hover:text-slate-300'
          }`}
        >
          <LayoutDashboard size={14} className={activeTab === 'overview' ? 'opacity-100' : 'opacity-50'} />
          Overview
        </button>
        <button 
          onClick={() => setActiveTab('compare')}
          className={`relative z-10 flex items-center gap-2 px-6 py-2 rounded-[50px] text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer font-sans-premium ${
            activeTab === 'compare' ? 'text-white' : 'text-stardust bg-transparent hover:text-slate-300'
          }`}
        >
          <GitCompare size={14} className={activeTab === 'compare' ? 'opacity-100' : 'opacity-50'} />
          Compare
        </button>
      </div>

      <div className="w-full">
        {/* Error Dictionary Input Section */}
        <div className="glass-card p-5 border border-white/10 mb-6 rounded-2xl flex flex-col gap-4 font-sans-premium relative overflow-hidden">
          <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-gradient-to-b from-pulsar-red to-nebula-purple"></div>
          <div className="flex items-center gap-2 mb-1 font-sans-premium pl-2">
            <motion.div 
              animate={{ rotate: [-5, 5, -5] }} 
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              className="p-1.5 rounded-lg bg-red-500/10 text-red-400"
            >
              <BookOpen size={16} />
            </motion.div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-starlight font-sans-premium">AI Error Dictionary</h3>
          </div>
          <p className="text-[11px] text-slate-400 -mt-2 font-sans-premium pl-2">Paste a compiler error, exception, or stack trace below to get an instant AI explanation and code fix.</p>
          <div className="flex flex-col md:flex-row gap-3 font-sans-premium pl-2">
            <textarea
              value={errorInput}
              onChange={(e) => setErrorInput(e.target.value)}
              placeholder="Paste an error message or stack trace here (e.g., TypeError: Cannot read properties of undefined)..."
              className="flex-1 min-h-[64px] bg-[rgba(2,2,10,0.8)] border border-[rgba(255,255,255,0.06)] rounded-xl p-3 text-[11px] font-mono text-slate-300 placeholder:text-slate-600 focus:outline-none focus:border-[rgba(157,78,221,0.5)] focus:shadow-[0_0_0_3px_rgba(157,78,221,0.1)] transition-all resize-y"
            />
            <button
              onClick={handleExplainError}
              disabled={isExplainingError || !errorInput.trim()}
              className="group md:w-36 py-2 md:py-0 px-4 rounded-xl bg-[linear-gradient(135deg,rgba(157,78,221,0.2),rgba(72,202,228,0.2))] hover:bg-[linear-gradient(135deg,rgba(157,78,221,0.4),rgba(72,202,228,0.4))] text-nebula-violet hover:text-white text-[10px] font-black uppercase tracking-widest border border-[rgba(157,78,221,0.4)] hover:border-[rgba(157,78,221,0.8)] transition-all disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer font-sans-premium shrink-0"
            >
              {isExplainingError ? (
                <>
                  <Loader2 size={12} className="animate-spin" />
                  Analyzing
                </>
              ) : (
                <>
                  Explain Error
                  <ArrowRight size={12} className="transition-transform group-hover:translate-x-[5px]" />
                </>
              )}
            </button>
          </div>

          {/* Explain Error Result Panel */}
          <AnimatePresence>
            {errorExplanation && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-4 border border-white/5 bg-black/15 rounded-2xl p-4 relative ml-2"
              >
                <button 
                  onClick={() => setErrorExplanation(null)}
                  className="absolute top-3 right-3 p-1 rounded-md text-slate-500 hover:text-white bg-white/5 hover:bg-white/10 transition-colors"
                >
                  <X size={12} />
                </button>

                <div className="flex flex-col gap-3">
                  <div className="border-l-2 border-blue-500 pl-3">
                    <span className="text-[9px] font-black text-blue-400 uppercase tracking-wider">What It Means</span>
                    <p className="text-xs text-slate-300 mt-1 leading-relaxed font-medium">
                      <TypewriterText text={errorExplanation.meaning} delay={0} />
                    </p>
                  </div>

                  <div className="border-l-2 border-amber-500 pl-3">
                    <span className="text-[9px] font-black text-amber-400 uppercase tracking-wider">Likely Cause</span>
                    <p className="text-xs text-slate-300 mt-1 leading-relaxed font-medium">
                      <TypewriterText text={errorExplanation.cause} delay={400} />
                    </p>
                  </div>

                  <div className="border-l-2 border-green-500 pl-3">
                    <span className="text-[9px] font-black text-green-400 uppercase tracking-wider">How To Fix It</span>
                    <p className="text-xs text-slate-300 mt-1 leading-relaxed whitespace-pre-line font-medium">
                      <TypewriterText text={errorExplanation.fix} delay={800} />
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-black text-purple-400 uppercase tracking-wider border-l-2 border-purple-500 pl-3">Correct Code Example</span>
                    <button 
                      onClick={() => {
                        navigator.clipboard.writeText(errorExplanation.correctCode);
                        if (triggerToast) triggerToast('Code copied to clipboard!');
                      }}
                      className="p-1 rounded bg-purple-500/10 text-purple-400 hover:bg-purple-500/20 border border-purple-500/20 text-[8px] font-black uppercase tracking-widest transition-all flex items-center gap-1"
                    >
                      <Copy size={10} /> Copy
                    </button>
                  </div>
                  <pre className="flex-1 bg-black/40 border border-white/5 rounded-xl p-3.5 text-[11px] font-mono text-slate-300 overflow-x-auto custom-scrollbar leading-relaxed">
                    <code>
                      <TypewriterText text={errorExplanation.correctCode} delay={1200} />
                    </code>
                  </pre>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <AnimatePresence mode="wait">
          {activeTab === 'overview' ? (
            <motion.div 
              key="overview"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-8 pb-8"
            >
          
          {/* 1. Code Size Card */}
          <Card title="Code Statistics" icon={FileText} accentClass="text-cosmic-blue" index={0}>
            <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-gradient-to-b from-cosmic-blue to-transparent"></div>
            <div className="flex justify-between items-start font-sans-premium relative z-10 pl-2">
              <div className="grid grid-cols-2 gap-4 flex-1 font-sans-premium">
                <div className="flex flex-col font-sans-premium">
                  <span className="text-[9px] text-slate-500 uppercase font-black tracking-widest font-sans-premium">Total Lines</span>
                  <span className="text-[36px] font-bold text-starlight leading-tight font-mono drop-shadow-[0_0_20px_rgba(72,202,228,0.4)]">{animatedTotalLines}</span>
                </div>
                <div className="flex flex-col text-right pr-4 font-sans-premium">
                  <span className="text-[9px] text-slate-500 uppercase font-black tracking-widest font-sans-premium">Payload</span>
                  <span className="text-[36px] font-bold text-starlight leading-tight font-mono drop-shadow-[0_0_20px_rgba(72,202,228,0.4)]">{(animatedPayload / 1024).toFixed(1)} <span className="text-xs text-slate-500 font-bold font-sans-premium">KB</span></span>
                </div>
              </div>
              <button 
                onClick={() => {
                  navigator.clipboard.writeText(`CodeLens Stats: ${size.totalLines} lines, ${(size.bytes / 1024).toFixed(1)}KB`);
                  if (triggerToast) triggerToast('Stats copied to clipboard!');
                }}
                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-transform hover:rotate-[20deg] cursor-pointer"
                title="Share Stats"
              >
                <ExternalLink size={14} className="text-slate-400" />
              </button>
            </div>
            <div className="mt-2 p-3 rounded-xl bg-black/20 border border-white/5 font-sans-premium pl-4 relative z-10">
              <div className="flex justify-between text-[8px] uppercase font-black mb-2 text-slate-500 tracking-widest font-sans-premium">
                <span>Composition Ratio</span>
              </div>
              <div className="w-full h-2 rounded-[4px] overflow-hidden flex bg-[rgba(255,255,255,0.05)] shadow-inner relative">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${(size.codeLines / size.totalLines) * 100}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="bg-gradient-to-r from-nebula-purple to-cosmic-blue h-full relative z-10" 
                />
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${(size.commentLines / size.totalLines) * 100}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="bg-gradient-to-r from-teal-400 to-aurora-green h-full relative z-10" 
                />
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${(size.blankLines / size.totalLines) * 100}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="bg-transparent h-full relative z-10" 
                />
                <motion.div 
                  initial={{ x: '-100%', opacity: 0 }}
                  animate={{ x: '100%', opacity: 1 }}
                  transition={{ delay: 2, duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute top-0 bottom-0 left-0 w-full bg-gradient-to-r from-transparent via-white/20 to-transparent z-20"
                />
              </div>
              <div className="flex gap-4 mt-3 font-sans-premium">
                <div className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-cosmic-blue" /><span className="text-[8px] font-black text-slate-500 uppercase tracking-tighter font-sans-premium">Logic</span></div>
                <div className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-aurora-green" /><span className="text-[8px] font-black text-slate-500 uppercase tracking-tighter font-sans-premium">Docs</span></div>
              </div>
            </div>
          </Card>

          {/* 3. Quality Score Card */}
          <Card title="Security & Bugs" icon={Shield} accentClass="text-solar-gold" index={1}>
            <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-gradient-to-b from-solar-gold to-pulsar-red z-10"></div>
            <div className="flex flex-col items-center justify-center py-1 relative font-sans-premium">
              <button 
                onClick={onRefactor}
                disabled={aiData.isLoading}
                className="absolute top-0 right-0 p-2 rounded-lg bg-teal-500/10 text-aurora-green hover:bg-teal-500/20 border border-teal-500/20 btn-premium cursor-pointer font-sans-premium z-20"
                title="AI Refactor"
              >
                <Sparkles size={16} className="group-hover:rotate-12 transition-transform" />
              </button>
              <div className="relative group font-sans-premium">
                
                <div className="relative w-36 h-36 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90">
                    <defs>
                      <linearGradient id="score-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="var(--solar-gold)" />
                        <stop offset="100%" stopColor="var(--aurora-green)" />
                      </linearGradient>
                      <filter id="glow-drop">
                        <feDropShadow dx="0" dy="0" stdDeviation="6" floodColor="#FFB627" floodOpacity="0.8" />
                      </filter>
                    </defs>
                    <circle cx="72" cy="72" r="60" stroke="rgba(255,255,255,0.06)" strokeWidth="8" fill="transparent" />
                    <motion.circle 
                      cx="72" cy="72" r="60" stroke="url(#score-grad)" strokeWidth="8" fill="transparent" 
                      strokeDasharray={376.99}
                      initial={{ strokeDashoffset: 376.99 }}
                      animate={{ strokeDashoffset: 376.99 - (376.99 * qualityScore) / 100 }}
                      transition={{ duration: 1.5, ease: "easeOut" }}
                      strokeLinecap="round"
                      filter="url(#glow-drop)"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center font-sans-premium">
                    <span className="text-[48px] font-[800] text-solar-gold font-mono drop-shadow-[0_0_30px_rgba(255,182,39,0.5)]">{animatedScore}</span>
                  </div>
                </div>
              </div>
              <span className={`mt-2 text-[11px] font-semibold tracking-[3px] uppercase ${scoreInfo.textColor} ${scoreInfo.glow} flex items-center gap-1.5 font-sans-premium transition-all`}>
                {scoreInfo.label}
              </span>

              {/* Pulsing Alert Banner for AI Correction */}
              {bugs.length > 0 && (
                <div
                  className="mt-5 px-3 py-2 bg-[rgba(255,77,109,0.1)] border border-[rgba(255,77,109,0.3)] flex items-center gap-3 cursor-pointer hover:bg-[rgba(255,77,109,0.18)] transition-all w-[90%] font-sans-premium relative overflow-hidden rounded-lg"
                  onClick={() => {
                    document.getElementById('bug-list-section')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-pulsar-red"></div>
                  <motion.div 
                    animate={{ opacity: [1, 0.4, 1] }} 
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <AlertTriangle size={14} className="text-pulsar-red shrink-0" />
                  </motion.div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-pulsar-red font-sans-premium">
                    {bugs.length} {bugs.length === 1 ? 'Error' : 'Errors'} Detected
                  </span>
                </div>
              )}

              {/* Custom SVG Sparkline Score Tracker */}
              {chartData.length > 1 && (
                <div className="w-full mt-6 px-2 font-sans-premium z-10 relative">
                  <div className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-2 text-center font-sans-premium">Score Trend</div>
                  <Sparkline data={chartData} />
                </div>
              )}
            </div>
          </Card>

          {/* 2. Complexity Card */}
          <Card title="Structural Complexity" icon={Zap} accentClass="text-nebula-purple" delay={0.3}>
            <div className="flex flex-wrap gap-2 mb-4">
              <div className="px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-400 text-[9px] font-black border border-blue-500/20 shadow-sm">TIME {complexity.bigOTime}</div>
              <div className="px-2.5 py-1 rounded-full bg-purple-500/10 text-purple-400 text-[9px] font-black border border-purple-500/20 shadow-sm">SPACE {complexity.bigOSpace}</div>
            </div>
            <div className="grid grid-cols-2 gap-4 px-2">
              <div className="flex flex-col">
                <span className="text-[9px] text-slate-600 uppercase font-black tracking-widest">Nesting Level</span>
                <span className="text-xl font-black text-white leading-tight">{complexity.nestingDepth}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[9px] text-slate-600 uppercase font-black tracking-widest">Cyclomatic</span>
                <span className="text-xl font-black text-white leading-tight">{complexity.cyclomaticScore}</span>
              </div>
            </div>

            <div className="mt-4 h-24 w-full bg-black/20 rounded-xl border border-white/5 p-2 overflow-hidden font-sans-premium">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={bigOData}>
                  <Line type="monotone" dataKey="value" stroke="#4F8EF7" strokeWidth={2} dot={false} animationDuration={1000} />
                  <XAxis dataKey="n" hide />
                  <YAxis hide />
                  <RechartsTooltip 
                    contentStyle={{ backgroundColor: 'rgba(2, 1, 10, 0.9)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '12px', backdropFilter: 'blur(20px)' }}
                    itemStyle={{ fontSize: '9px', fontWeight: 'bold', color: '#4F8EF7' }}
                    labelStyle={{ display: 'none' }}
                  />
                </LineChart>
              </ResponsiveContainer>
              <div className="absolute bottom-6 right-8 text-[8px] font-black text-blue-500/40 uppercase tracking-widest italic font-sans-premium">Growth Curve</div>
            </div>
          </Card>

          {/* 6. Performance Card */}
          <Card title="Resource Profile" icon={Activity} accentClass="text-aurora-green" delay={0.4}>
            <div className="flex flex-col gap-3.5 px-1">
              {[
                { label: 'Memory Usage', val: performance.memoryUsage, type: 'usage' },
                { label: 'CPU Intensity', val: performance.cpuIntensity, type: 'intensity' },
                { label: 'Readability', val: performance.readabilityScore, type: 'score' },
                { label: 'Maintainability', val: performance.maintainabilityScore, type: 'score' },
              ].map((item) => (
                <div key={item.label} className="flex flex-col gap-1.5">
                  <div className="flex justify-between items-center">
                    <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest">{item.label}</span>
                    <span className="text-[9px] font-black text-slate-400">{item.val}{typeof item.val === 'number' ? '%' : ''}</span>
                  </div>
                  <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden shadow-inner">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${typeof item.val === 'number' ? item.val : (item.val === 'Low' ? 33 : item.val === 'Medium' ? 66 : 100)}%` }}
                      transition={{ duration: 1.5, ease: "easeOut" }}
                      className={`h-full ${getPerfColor(item.val, item.type)} shadow-[0_0_8px_rgba(255,255,255,0.1)]`} 
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* 7. Function Map Card */}
          <Card title="Function Dependency Map" icon={MapIcon} accentClass="text-nebula-purple" delay={0.45}>
            <FunctionMap functions={results.functions} calls={results.calls} />
          </Card>

          {/* 8. Language Distribution */}
          {langData.length > 1 && (
            <Card title="Language Distribution" icon={PieIcon} accentClass="text-cosmic-blue" delay={0.5}>
              <div className="h-40 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={langData}
                      innerRadius={40}
                      outerRadius={60}
                      paddingAngle={5}
                      dataKey="value"
                      animationDuration={1500}
                    >
                      {langData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="none" />
                      ))}
                    </Pie>
                    <Legend 
                      verticalAlign="bottom" 
                      align="center"
                      iconType="circle"
                      formatter={(value) => <span className="text-[8px] font-black uppercase text-slate-500 tracking-tighter">{value}</span>}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </Card>
          )}

          {/* AI Explanation Card (Conditional) */}
          <AnimatePresence>
            {aiData.explanation && (
              <Card title="Complexity Deep Dive" icon={Zap} accentClass="text-nebula-violet" fullWidth index={4}>
                <div className="p-4 rounded-2xl bg-nebula-purple/[0.03] border border-nebula-purple/10 text-xs text-starlight leading-relaxed font-mono font-sans-premium">
                  <span className="text-cosmic-blue font-bold mr-2">CLAUDE:</span>
                  {displayedExplanation}
                  {displayedExplanation.length < aiData.explanation.length && (
                    <motion.span 
                      animate={{ opacity: [0, 1, 0] }}
                      transition={{ duration: 0.8, repeat: Infinity }}
                      className="inline-block w-1 h-4 bg-cosmic-blue ml-1 translate-y-1"
                    />
                  )}
                </div>
              </Card>
            )}
          </AnimatePresence>

          {/* AI Refactor Comparison (Conditional) */}
          <AnimatePresence>
            {aiData.refactoredCode && (
              <Card title="Refactored Result" icon={RefreshCcw} accentClass="text-aurora-green" delay={0} fullWidth={true}>
                <div className="h-[300px] w-full rounded-2xl overflow-hidden border border-white/10 flex flex-col md:flex-row font-sans-premium">
                  <div className="flex-1 border-b md:border-b-0 md:border-r border-white/10 flex flex-col">
                    <div className="px-3 py-1.5 bg-red-500/5 text-[8px] font-black uppercase text-red-400/60 tracking-widest border-b border-white/5 font-sans-premium">Original</div>
                    <div className="flex-1 opacity-50">
                      <Editor 
                        height="100%"
                        theme="vs-dark"
                        language="javascript"
                        value={aiData.refactoredCode.split('\n').map((_, i) => results.size.totalLines > i ? results.codeLines : '').join('\n')} // Mock original for visual
                        options={{ minimap: { enabled: false }, readOnly: true, fontSize: 10, lineNumbers: 'off' }}
                      />
                    </div>
                  </div>
                  <div className="flex-1 flex flex-col">
                    <div className="px-3 py-1.5 bg-green-500/5 text-[8px] font-black uppercase text-green-400 tracking-widest border-b border-white/5 font-sans-premium">Refactored</div>
                    <div className="flex-1">
                      <Editor 
                        height="100%"
                        theme="vs-dark"
                        language="javascript"
                        value={aiData.refactoredCode}
                        options={{ minimap: { enabled: false }, readOnly: true, fontSize: 10, lineNumbers: 'off' }}
                      />
                    </div>
                  </div>
                </div>
              </Card>
            )}
          </AnimatePresence>

          {/* 4. Bug Detection Card (Full Width) */}
          <Card title="Suggested Improvements" icon={AlertCircle} accentClass="text-pulsar-red" fullWidth index={5}>
            {/* Filter controls */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-2 font-sans-premium pb-3 border-b border-white/5">
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                Showing {filteredBugs.length} of {bugs.length} issues
              </span>
              <div className="flex gap-1.5 rounded-xl bg-black/40 p-1 border border-white/5 w-fit">
                <button
                  onClick={() => setFilterSeverity('all')}
                  className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all cursor-pointer ${
                    filterSeverity === 'all'
                      ? 'bg-nebula-purple text-white shadow'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  All Issues ({bugs.length})
                </button>
                <button
                  onClick={() => setFilterSeverity('critical')}
                  className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all cursor-pointer ${
                    filterSeverity === 'critical'
                      ? 'bg-red-500/20 text-[#FF5555] border border-red-500/30'
                      : 'text-slate-400 hover:text-[#FF5555]'
                  }`}
                >
                  Errors Only ({criticalCount})
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-2.5 font-sans-premium">
              {filteredBugs.length > 0 ? filteredBugs.map((bug, i) => (
                <motion.div 
                  key={i} 
                  className={`flex flex-col sm:flex-row sm:items-center sm:justify-between p-3.5 rounded-xl bg-white/[0.02] border border-white/5 transition-all group border-l-4 font-sans-premium gap-2 sm:gap-0 ${
                    bug.severity === 'Critical' ? 'border-l-[#FF5555] shadow-lg shadow-red-500/5' : 
                    bug.severity === 'Warning' ? 'border-l-[#F5A623] shadow-lg shadow-amber-500/5' : 'border-l-cosmic-blue shadow-lg shadow-blue-500/5'
                  }`}
                >
                  <div className="flex items-center gap-3 sm:gap-4 cursor-pointer font-sans-premium flex-1 min-w-0" onClick={() => onBugClick(bug.line)}>
                    <span className={`shrink-0 px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest shadow-sm font-sans-premium ${
                      bug.severity === 'Critical' ? 'bg-red-500/20 text-[#FF5555]' : 
                      bug.severity === 'Warning' ? 'bg-amber-500/20 text-[#F5A623]' : 'bg-blue-500/20 text-cosmic-blue'
                    }`}>
                      {bug.severity}
                    </span>
                    <p className="text-xs text-slate-300 font-bold group-hover:text-white transition-colors font-sans-premium truncate">{bug.message}</p>
                  </div>
                  <div className="flex items-center gap-2 sm:gap-3 font-sans-premium shrink-0 pl-0 sm:pl-2">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenBestPractice(bug.message);
                      }}
                      className="px-2 py-1 rounded bg-blue-500/10 text-cosmic-blue text-[8px] font-black uppercase tracking-widest border border-blue-500/20 btn-premium cursor-pointer transition-all flex items-center gap-1 font-sans-premium"
                    >
                      <HelpCircle size={10} /> Why?
                    </button>
                    <button 
                      onClick={() => handleInitiateAiFix(bug)}
                      className="px-2.5 py-1 rounded-lg bg-gradient-to-r from-aurora-green/20 to-cosmic-blue/20 text-aurora-green text-[8px] font-black uppercase tracking-widest border border-aurora-green/30 hover:border-aurora-green btn-premium transition-all flex items-center gap-1 shadow-[0_0_10px_rgba(0,212,170,0.05)] cursor-pointer font-sans-premium group/btn"
                    >
                      <Wand2 size={10} className="text-aurora-green group-hover/btn:rotate-12 transition-transform animate-pulse" />
                      AI Fix
                    </button>
                    <div className="hidden sm:flex items-center gap-1.5 text-slate-600 group-hover:text-slate-400 transition-colors font-sans-premium">
                      <span className="text-[9px] font-black uppercase tracking-widest font-sans-premium">Line {bug.line}</span>
                      <ChevronRight size={12} />
                    </div>
                  </div>
                </motion.div>
              )) : (
                <div className="flex flex-col items-center justify-center py-6 text-slate-700 opacity-40 font-sans-premium">
                  <CheckCircle size={32} className="mb-2 text-aurora-green" />
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] font-sans-premium">
                    {filterSeverity === 'critical' ? 'No Critical Errors Detected' : 'All Systems Clear'}
                  </span>
                </div>
              )}
            </div>
          </Card>

          {/* 5. Suggestions Card */}
          <Card title="Refinement Roadmap" icon={ArrowRight} delay={0.6} fullWidth={true}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8 mt-8">
              {suggestions.map((tip, i) => (
                <div key={i} className="flex items-start gap-4 p-4 rounded-2xl bg-white/[0.01] border border-white/5 group hover:bg-white/[0.03] hover:border-blue-500/20 transition-all">
                  <div className="mt-0.5 p-1.5 rounded-xl bg-blue-500/10 text-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-all shadow-sm">
                    <ArrowRight size={12} />
                  </div>
                  <div className="flex flex-col gap-1.5 flex-1">
                    <p className="text-xs text-slate-400 group-hover:text-slate-200 transition-colors leading-relaxed font-medium">{tip}</p>
                    <button
                      onClick={() => handleOpenBestPractice(tip)}
                      className="text-blue-400 hover:text-blue-300 hover:underline text-[9px] font-bold uppercase tracking-wider flex items-center gap-1 w-fit mt-1"
                    >
                      <HelpCircle size={10} /> Why?
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </Card>

            </motion.div>
          ) : (
            <motion.div
              key="compare"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="h-full min-h-[500px] flex flex-col gap-4"
            >
              <Card title="Code Comparison" icon={GitCompare} delay={0} fullWidth={true}>
                <div className="flex justify-between items-center mb-2 px-2">
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-red-500/50" />
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Original</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-500/50" />
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Refactored / Current</span>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex flex-col text-right">
                      <span className="text-[8px] font-black text-slate-600 uppercase">Lines</span>
                      <span className="text-xs font-bold text-white">{results.size.totalLines}</span>
                    </div>
                    <div className="flex flex-col text-right">
                      <span className="text-[8px] font-black text-slate-600 uppercase">Score</span>
                      <span className="text-xs font-bold text-teal-400">{results.qualityScore}%</span>
                    </div>
                  </div>
                </div>
                <div className="flex-1 h-[400px] rounded-2xl overflow-hidden border border-white/10 bg-black/20">
                  <DiffEditor
                    theme="vs-dark"
                    original={results.code}
                    modified={aiData.refactoredCode || results.code}
                    language="javascript"
                    options={{
                      renderSideBySide: true,
                      minimap: { enabled: false },
                      scrollBeyondLastLine: false,
                      fontSize: 12,
                      readOnly: true,
                      originalEditable: false,
                      diffCodeLens: true,
                      automaticLayout: true,
                    }}
                  />
                </div>
                {!aiData.refactoredCode && (
                  <div className="mt-4 p-4 rounded-xl bg-blue-500/5 border border-blue-500/10 text-center">
                    <p className="text-[10px] font-bold text-blue-400/60 uppercase tracking-widest">
                      Click <Sparkles size={12} className="inline mx-1" /> "AI Refactor" in Overview to see improvements
                    </p>
                  </div>
                )}
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      {/* Best Practice Explanation Modal */}
      <AnimatePresence>
        {selectedPractice && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedPractice(null)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 250 }}
              className="bg-[#080810]/95 border border-white/10 rounded-2xl w-full max-w-4xl overflow-hidden flex flex-col shadow-2xl backdrop-blur-2xl glass-card font-sans-premium"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="px-6 py-4 bg-white/[0.02] border-b border-white/5 flex items-center justify-between font-sans-premium">
                <div className="flex items-center gap-2 text-cosmic-blue font-sans-premium">
                  <HelpCircle size={18} />
                  <h2 className="text-sm font-black uppercase tracking-widest text-slate-100 font-sans-premium">{selectedPractice.title}</h2>
                </div>
                <button
                  onClick={() => setSelectedPractice(null)}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-white bg-white/5 hover:bg-white/10 transition-colors btn-premium cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Content */}
              <div className="p-6 overflow-y-auto max-h-[70vh] flex flex-col gap-6 custom-scrollbar font-sans-premium">
                {/* Explanation */}
                <div className="p-4 rounded-xl bg-blue-500/[0.03] border border-blue-500/10 flex flex-col gap-2 font-sans-premium">
                  <span className="text-[10px] font-black text-cosmic-blue uppercase tracking-widest font-sans-premium">Why This Matters</span>
                  <p className="text-xs text-slate-300 leading-relaxed font-medium font-sans-premium">{selectedPractice.explanation}</p>
                </div>

                {/* Good vs Bad Examples Side-by-side */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 font-sans-premium">
                  {/* Bad Code */}
                  <div className="flex flex-col gap-2 font-sans-premium">
                    <span className="text-[10px] font-black text-red-400 uppercase tracking-widest flex items-center gap-1.5 font-sans-premium">
                      <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                      Bad Practice
                    </span>
                    <pre className="bg-[#181014] border border-red-500/10 rounded-xl p-4 text-[11px] font-mono text-red-200 overflow-x-auto min-h-[140px] custom-scrollbar shadow-inner leading-relaxed">
                      <code>{selectedPractice.badCode}</code>
                    </pre>
                  </div>

                  {/* Good Code */}
                  <div className="flex flex-col gap-2 font-sans-premium">
                    <span className="text-[10px] font-black text-aurora-green uppercase tracking-widest flex items-center gap-1.5 font-sans-premium">
                      <div className="w-1.5 h-1.5 rounded-full bg-aurora-green shadow-[0_0_6px_rgba(0,212,170,0.6)]" />
                      Good Practice
                    </span>
                    <pre className="bg-[#0c1815] border border-green-500/10 rounded-xl p-4 text-[11px] font-mono text-green-200 overflow-x-auto min-h-[140px] custom-scrollbar shadow-inner leading-relaxed">
                      <code>{selectedPractice.goodCode}</code>
                    </pre>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="px-6 py-4 bg-white/[0.01] border-t border-white/5 flex justify-end font-sans-premium">
                <a
                  href={selectedPractice.docsLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 hover:text-blue-300 text-[10px] font-black uppercase tracking-widest border border-blue-500/20 btn-premium cursor-pointer transition-all flex items-center gap-2 font-sans-premium"
                >
                  <ExternalLink size={12} />
                  Official Documentation
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dynamic AI Bug Fix Runner Modal */}
      <AnimatePresence>
        {activeFixBug && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4"
            onClick={() => {
              if (!isFixingInProgress) setActiveFixBug(null);
            }}
          >
            <motion.div
              initial={{ scale: 0.95, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 30 }}
              transition={{ type: 'spring', damping: 25, stiffness: 250 }}
              className="bg-[#080810]/95 border border-white/10 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden backdrop-blur-2xl glass-card font-sans-premium"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="px-6 py-4 bg-white/[0.02] border-b border-white/5 flex items-center justify-between shrink-0 font-sans-premium">
                <div className="flex items-center gap-3 font-sans-premium">
                  <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 animate-pulse font-sans-premium">
                    <Wand2 size={18} />
                  </div>
                  <div>
                    <h2 className="text-xs font-black uppercase tracking-widest text-slate-100 font-sans-premium">AI Bug Resolution</h2>
                    <p className="text-[10px] text-slate-400 font-medium font-sans-premium">Resolving: <span className="text-amber-400 font-bold">{activeFixBug.message}</span></p>
                  </div>
                </div>
                {!isFixingInProgress && (
                  <button
                    onClick={() => setActiveFixBug(null)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-white bg-white/5 hover:bg-white/10 transition-colors btn-premium cursor-pointer"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>

              {/* Modal Content */}
              <div className="flex-1 overflow-hidden p-6 flex flex-col gap-4 relative font-sans-premium">
                {isFixingInProgress ? (
                  /* Loading State */
                  <div className="flex-1 flex flex-col items-center justify-center gap-6 font-sans-premium">
                    <div className="relative">
                      {/* Concentric rotating/pulsing glow */}
                      <motion.div 
                        animate={{ rotate: 360 }}
                        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                        className="w-24 h-24 rounded-full border-2 border-dashed border-emerald-500/20 absolute -inset-2"
                      />
                      <motion.div 
                        animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.8, 0.5] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                        className="w-20 h-20 rounded-full bg-emerald-500/10 blur-xl absolute inset-0"
                      />
                      <div className="w-20 h-20 rounded-full bg-black/40 border border-emerald-500/30 flex items-center justify-center relative">
                        <Loader2 size={32} className="text-emerald-400 animate-spin" />
                      </div>
                    </div>
                    
                    <div className="text-center flex flex-col gap-2 max-w-sm font-sans-premium">
                      <h3 className="text-xs font-black uppercase tracking-widest text-emerald-400 animate-pulse font-sans-premium">Rewriting Code...</h3>
                      <p className="text-[11px] text-slate-400 leading-relaxed font-sans-premium">
                        Claude is analyzing the syntax error, identifying the cause, and preparing a clean, optimized code correction.
                      </p>
                    </div>
                  </div>
                ) : (
                  /* Success/Diff Compare State */
                  <div className="flex-1 flex flex-col gap-4 h-full min-h-0 font-sans-premium">
                    <div className="flex justify-between items-center bg-white/[0.01] border border-white/5 rounded-xl px-4 py-2.5 shrink-0 font-sans-premium">
                      <div className="flex items-center gap-6 font-sans-premium">
                        <div className="flex items-center gap-2 font-sans-premium">
                          <div className="w-2 h-2 rounded-full bg-red-500/50" />
                          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest font-sans-premium">Original Code</span>
                        </div>
                        <div className="flex items-center gap-2 font-sans-premium">
                          <div className="w-2 h-2 rounded-full bg-emerald-500/50 shadow-[0_0_8px_rgba(16,185,129,0.4)]" />
                          <span className="text-[9px] font-bold text-emerald-400 uppercase tracking-widest font-sans-premium">AI Correction</span>
                        </div>
                      </div>
                      <span className="text-[8px] font-black uppercase text-slate-500 tracking-widest bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded font-sans-premium">Fix Found</span>
                    </div>

                    <div className="flex-1 rounded-2xl overflow-hidden border border-white/10 bg-black/25 min-h-0 font-sans-premium">
                      <DiffEditor
                        theme="vs-dark"
                        original={results.code}
                        modified={fixCodeOutput}
                        language={results.languages ? results.languages[0] : 'javascript'}
                        options={{
                          renderSideBySide: true,
                          minimap: { enabled: false },
                          scrollBeyondLastLine: false,
                          fontSize: 12,
                          readOnly: true,
                          originalEditable: false,
                          diffCodeLens: true,
                          automaticLayout: true,
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Footer */}
              {!isFixingInProgress && (
                <div className="px-6 py-4 bg-white/[0.01] border-t border-white/5 flex justify-end gap-3 shrink-0 font-sans-premium">
                  <button
                    onClick={() => setActiveFixBug(null)}
                    className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white text-[10px] font-black uppercase tracking-widest border border-white/10 transition-all btn-premium cursor-pointer font-sans-premium"
                  >
                    Discard Fix
                  </button>
                  <button
                    onClick={() => {
                      if (setCode) {
                        setCode(fixCodeOutput);
                        setActiveFixBug(null);
                        if (triggerToast) triggerToast('AI Correction applied successfully!');
                      }
                    }}
                    className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-[10px] font-black uppercase tracking-widest border border-emerald-500/20 shadow-lg shadow-emerald-500/10 hover:shadow-emerald-500/20 btn-premium cursor-pointer transition-all flex items-center gap-1.5 font-sans-premium"
                  >
                    <Check size={12} />
                    Apply Correction
                  </button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      </div>
    </div>
  );
};

export default ResultsDashboard;
