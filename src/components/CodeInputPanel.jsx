import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Editor from '@monaco-editor/react';
import { Play, AlertCircle, ChevronRight, X, Copy, BookOpen, Folder, FileCode2, TerminalSquare, Activity, Sparkles, ChevronDown, Minus, Plus, Loader2 } from 'lucide-react';
import { cheatSheets } from '../data/cheatSheets';

const languages = [
  { id: 'python', name: 'Python', color: '#06D6A0' },
  { id: 'javascript', name: 'JavaScript', color: '#FFB627' },
  { id: 'typescript', name: 'TypeScript', color: '#48CAE4' },
  { id: 'c', name: 'C', color: '#9D4EDD' },
  { id: 'cpp', name: 'C++', color: '#9D4EDD' },
  { id: 'java', name: 'Java', color: '#FF4D6D' },
  { id: 'go', name: 'Go', color: '#48CAE4' },
  { id: 'rust', name: 'Rust', color: '#FFB627' },
  { id: 'ruby', name: 'Ruby', color: '#FF4D6D' },
  { id: 'php', name: 'PHP', color: '#C77DFF' },
  { id: 'swift', name: 'Swift', color: '#FFB627' },
  { id: 'kotlin', name: 'Kotlin', color: '#C77DFF' },
  { id: 'csharp', name: 'C#', color: '#06D6A0' },
  { id: 'shell', name: 'Bash', color: '#48CAE4' },
  { id: 'sql', name: 'SQL', color: '#FFB627' },
];

const CodeInputPanel = ({ code, setCode, language, setLanguage, onAnalyze, onGenerate, isLoading, shake, setEditorRef, results }) => {
  const [prompt, setPrompt] = React.useState('');
  const [isHeatmapEnabled, setIsHeatmapEnabled] = React.useState(false);
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);
  
  // Cheat Sheet Sidebar States
  const [isCheatSheetOpen, setIsCheatSheetOpen] = useState(false);
  const [openSections, setOpenSections] = useState({
    dataTypes: true,
    controlFlow: false,
    functions: false,
    commonMethods: false,
    errorHandling: false,
  });

  const toggleSection = (sectionKey) => {
    setOpenSections(prev => ({
      ...prev,
      [sectionKey]: !prev[sectionKey]
    }));
  };
  const decorationsRef = React.useRef([]);
  const editorInstanceRef = React.useRef(null);

  // Handle Ctrl+Enter shortcut
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.key === 'Enter') {
        onAnalyze();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onAnalyze]);

  const handleEditorDidMount = (editor, monaco) => {
    editorInstanceRef.current = editor;
    setEditorRef(editor);

    monaco.editor.defineTheme('spaceTheme', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: 'keyword', foreground: 'C77DFF' },
        { token: 'string', foreground: '06D6A0' },
        { token: 'comment', foreground: '9D4EDD73', fontStyle: 'italic' },
        { token: 'function', foreground: '48CAE4' },
        { token: 'number', foreground: 'FFB627' },
        { token: 'variable', foreground: 'E0E0FF' },
        { token: 'operator', foreground: 'FFFFFF80' }
      ],
      colors: {
        'editor.background': '#03030F',
        'editor.lineHighlightBackground': '#9D4EDD0F',
        'editor.selectionBackground': '#9D4EDD40',
        'editorLineNumber.foreground': '#9D4EDD4D',
        'editorLineNumber.activeForeground': '#9D4EDD',
        'editorCursor.foreground': '#48CAE4',
        'editor.foreground': '#E0E0FF'
      }
    });
    monaco.editor.setTheme('spaceTheme');
  };

  useEffect(() => {
    if (!editorInstanceRef?.current || !isHeatmapEnabled || !results?.lineComplexity) {
      if (editorInstanceRef?.current) {
        decorationsRef.current = editorInstanceRef.current.deltaDecorations(decorationsRef.current, []);
      }
      return;
    }

    const newDecorations = results.lineComplexity.map((line, index) => ({
      range: { startLineNumber: index + 1, startColumn: 1, endLineNumber: index + 1, endColumn: 1 },
      options: {
        isWholeLine: true,
        className: line.complexity === 'critical' ? 'bg-red-500/20' : 
                   line.complexity === 'moderate' ? 'bg-amber-500/10' : 'bg-green-500/5',
        linesDecorationsClassName: line.complexity === 'critical' ? 'bg-red-500/40' : 
                                   line.complexity === 'moderate' ? 'bg-amber-500/30' : 'bg-green-500/20',
      }
    }));

    decorationsRef.current = editorInstanceRef.current.deltaDecorations(decorationsRef.current, newDecorations);
  }, [isHeatmapEnabled, results, code]);

  const handleGenerateClick = () => {
    if (!prompt.trim()) return;
    onGenerate(prompt);
    setPrompt('');
  };

  const selectedLangObj = languages.find(l => l.id === language) || languages[0];

  return (
    <motion.div 
      animate={shake ? { x: [-10, 10, -10, 10, 0] } : {}}
      transition={{ duration: 0.4 }}
      className={`flex-1 flex flex-col glass-card overflow-hidden border ${shake ? 'border-red-500/50 shadow-lg shadow-red-500/10' : 'border-white/10 shadow-2xl'}`}
      style={{ minHeight: 'clamp(400px, 60vh, 800px)' }}
    >
      {/* AI Prompt Bar */}
      <div className="px-3 sm:px-4 py-2 bg-space-void border-b border-white/5 flex items-center gap-2 sm:gap-3">
        <div 
          className="flex-1 flex items-center px-2 sm:px-3 py-1.5 transition-all group"
          style={{
            background: 'rgba(157, 78, 221, 0.06)',
            border: '1px solid rgba(157, 78, 221, 0.2)',
            borderRadius: '12px'
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = 'rgba(157,78,221,0.6)';
            e.currentTarget.style.boxShadow = '0 0 0 3px rgba(157,78,221,0.1)';
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = 'rgba(157,78,221,0.2)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          <div className="animate-pulse shrink-0">
            <Sparkles size={14} color="#9D4EDD" />
          </div>
          <input 
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleGenerateClick()}
            placeholder="Describe what you want to code..."
            className="w-full bg-transparent border-none px-2 sm:px-3 py-0 text-xs text-starlight focus:outline-none placeholder-[rgba(180,180,220,0.35)]"
          />
        </div>
        <button 
          onClick={handleGenerateClick}
          disabled={isLoading || !prompt.trim()}
          className="px-3 sm:px-4 py-1.5 flex items-center gap-1.5 cursor-pointer disabled:opacity-50 transition-all hover:brightness-115 hover:scale-105 shrink-0"
          style={{
            background: 'linear-gradient(135deg, #9D4EDD, #48CAE4)',
            border: 'none',
            borderRadius: '10px',
            color: 'white',
            fontWeight: 600
          }}
        >
          <Sparkles size={12} className="text-white" />
          <span className="hidden sm:inline text-[10px] uppercase tracking-widest">Generate</span>
        </button>
      </div>

      <div className="px-3 sm:px-4 py-3 border-b border-white/10 flex justify-between items-center bg-[rgba(3,3,15,0.6)] backdrop-blur-md relative z-10">
        <div className="flex items-center gap-3 sm:gap-6">
          {/* macOS window controls */}
          <div className="flex gap-1.5 group/window">
            <div className="w-3 h-3 rounded-full bg-[#FF5F57] border border-[#E0443E] flex items-center justify-center cursor-pointer">
              <X size={8} className="opacity-0 group-hover/window:opacity-100 text-[#4D0000]" />
            </div>
            <div className="w-3 h-3 rounded-full bg-[#FFBD2E] border border-[#DEA123] flex items-center justify-center cursor-pointer">
              <Minus size={8} className="opacity-0 group-hover/window:opacity-100 text-[#5C3D00]" />
            </div>
            <div className="w-3 h-3 rounded-full bg-[#28C840] border border-[#1AAB29] flex items-center justify-center cursor-pointer">
              <Plus size={8} className="opacity-0 group-hover/window:opacity-100 text-[#004D00]" />
            </div>
          </div>
          
          <div className="relative">
            <button 
              onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
              className="flex items-center gap-2 cursor-pointer transition-all"
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '8px',
                padding: '6px 12px'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'rgba(157,78,221,0.3)';
                e.currentTarget.style.backgroundColor = 'rgba(157,78,221,0.08)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
                e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.04)';
              }}
            >
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: selectedLangObj.color }} />
              <span className="text-[11px] font-bold text-slate-300 uppercase tracking-widest">{selectedLangObj.name}</span>
              <ChevronDown size={12} className="text-slate-400" />
            </button>
            
            <AnimatePresence>
              {isLangDropdownOpen && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute top-full left-0 mt-2 w-40 z-50 flex flex-col py-1 overflow-hidden"
                  style={{
                    background: 'rgba(5,5,26,0.97)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: '8px',
                    backdropFilter: 'blur(16px)'
                  }}
                >
                  {languages.map((lang) => (
                    <button
                      key={lang.id}
                      onClick={() => { setLanguage(lang.id); setIsLangDropdownOpen(false); }}
                      className="flex items-center gap-2 px-3 py-2 text-[11px] text-slate-300 hover:text-white uppercase tracking-widest font-bold group border-l-2 border-transparent hover:border-nebula-purple hover:bg-white/5 transition-all cursor-pointer text-left"
                    >
                      <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: lang.color }} />
                      {lang.name}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-3">
          {shake && (
            <motion.span 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-[10px] font-bold text-[#FF5555] uppercase tracking-tighter flex items-center gap-1"
            >
              <AlertCircle size={10} />
              <span className="hidden sm:inline">Paste code first</span>
            </motion.span>
          )}
          
          <button 
            onClick={() => setIsCheatSheetOpen(!isCheatSheetOpen)}
            className="hidden sm:block px-3 py-1.5 text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer"
            style={{
              background: isCheatSheetOpen ? 'rgba(157,78,221,0.1)' : 'rgba(255,255,255,0.04)',
              border: `1px solid ${isCheatSheetOpen ? 'rgba(157,78,221,0.35)' : 'rgba(255,255,255,0.08)'}`,
              borderRadius: '8px',
              color: isCheatSheetOpen ? 'white' : 'rgba(180,180,220,0.7)'
            }}
            onMouseEnter={(e) => {
              if(!isCheatSheetOpen) {
                e.currentTarget.style.borderColor = 'rgba(157,78,221,0.35)';
                e.currentTarget.style.color = 'white';
                e.currentTarget.style.backgroundColor = 'rgba(157,78,221,0.1)';
              }
            }}
            onMouseLeave={(e) => {
              if(!isCheatSheetOpen) {
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
                e.currentTarget.style.color = 'rgba(180,180,220,0.7)';
                e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.04)';
              }
            }}
          >
            Cheat Sheet
          </button>

          <button 
            onClick={() => setIsHeatmapEnabled(!isHeatmapEnabled)}
            className="hidden sm:block px-3 py-1.5 text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer"
            style={{
              background: isHeatmapEnabled ? 'rgba(157,78,221,0.1)' : 'rgba(255,255,255,0.04)',
              border: `1px solid ${isHeatmapEnabled ? 'rgba(157,78,221,0.35)' : 'rgba(255,255,255,0.08)'}`,
              borderRadius: '8px',
              color: isHeatmapEnabled ? 'white' : 'rgba(180,180,220,0.7)'
            }}
            onMouseEnter={(e) => {
              if(!isHeatmapEnabled) {
                e.currentTarget.style.borderColor = 'rgba(157,78,221,0.35)';
                e.currentTarget.style.color = 'white';
                e.currentTarget.style.backgroundColor = 'rgba(157,78,221,0.1)';
              }
            }}
            onMouseLeave={(e) => {
              if(!isHeatmapEnabled) {
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
                e.currentTarget.style.color = 'rgba(180,180,220,0.7)';
                e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.04)';
              }
            }}
          >
            Heatmap
          </button>

          <div className="hidden md:flex items-center gap-2" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', padding: '4px 10px' }}>
             <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Shortcut</span>
             <div className="flex gap-1">
               <span style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '5px', padding: '2px 6px', fontFamily: 'monospace', fontSize: '11px', color: 'white' }}>Ctrl</span>
               <span style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '5px', padding: '2px 6px', fontFamily: 'monospace', fontSize: '11px', color: 'white' }}>Enter</span>
             </div>
          </div>

          <button 
            onClick={onAnalyze}
            disabled={isLoading}
            className={`relative group flex items-center justify-center gap-1.5 sm:gap-2 px-4 sm:px-6 py-2 transition-all cursor-pointer ${isLoading ? 'opacity-80 cursor-not-allowed' : 'hover:scale-105 hover:brightness-110 hover:shadow-[0_0_24px_rgba(157,78,221,0.5)] animate-bg-shift'}`}
            style={{
              background: 'linear-gradient(135deg, #9D4EDD 0%, #48CAE4 100%)',
              border: 'none',
              borderRadius: '10px',
            }}
          >
            {isLoading && <div className="absolute inset-0 shimmer-sweep rounded-[10px]" />}
            {isLoading ? (
              <Loader2 size={16} className="text-white animate-spin relative z-10" />
            ) : (
              <Play size={14} fill="currentColor" className="text-white relative z-10" />
            )}
            <span className="relative z-10 font-space font-[700] text-white tracking-[1.5px] text-[11px] uppercase">
              {isLoading ? 'ANALYZING...' : 'ANALYZE'}
            </span>
          </button>
        </div>
      </div>

      <div className="flex-1 flex relative bg-[#03030F] overflow-hidden" style={{ boxShadow: 'inset 0 1px 0 rgba(157,78,221,0.15)' }}>
        {/* Mock Project Explorer (Left Sidebar) */}
        <div className="w-48 xl:w-[200px] border-r border-[rgba(157,78,221,0.1)] bg-[rgba(2,2,10,0.6)] hidden md:flex flex-col select-none shrink-0 relative">
          <div className="absolute top-0 right-0 bottom-0 w-[4px] bg-transparent hover:bg-[rgba(157,78,221,0.4)] cursor-col-resize z-20 transition-colors" />
          <div className="px-4 py-3 border-b border-white/5 flex items-center gap-2">
            <Folder size={10} className="text-[rgba(157,78,221,0.6)]" />
            <span className="text-[10px] font-space text-[rgba(157,78,221,0.6)] uppercase tracking-[2px]">Project</span>
          </div>
          <div className="flex-1 overflow-y-auto custom-scrollbar py-2 flex flex-col">
            <div className="flex items-center gap-2 pl-2 pr-4 py-1 hover:bg-[rgba(157,78,221,0.06)] hover:text-white rounded cursor-pointer transition-colors group text-[rgba(180,180,220,0.8)]">
              <ChevronRight size={12} className="transition-transform group-hover:rotate-90" />
              <Folder size={12} color="#48CAE4" />
              <span className="text-[13px]">src</span>
            </div>
            <div className="flex flex-col pl-[16px]">
               <div 
                 className="flex items-center gap-2 pl-2 pr-4 py-1 cursor-pointer transition-colors"
                 style={{
                   background: 'rgba(157,78,221,0.15)',
                   borderLeft: '2px solid #9D4EDD',
                   color: 'white'
                 }}
               >
                <FileCode2 size={12} color={language === 'javascript' ? '#FFB627' : language === 'python' ? '#06D6A0' : '#48CAE4'} />
                <span className="text-[13px]">main.{language === 'javascript' ? 'js' : language === 'python' ? 'py' : 'ts'}</span>
               </div>
               <div className="flex items-center gap-2 pl-2 pr-4 py-1 hover:bg-[rgba(255,255,255,0.04)] rounded cursor-pointer transition-colors text-[rgba(180,180,220,0.8)]">
                <FileCode2 size={12} color={language === 'javascript' ? '#FFB627' : language === 'python' ? '#06D6A0' : '#48CAE4'} />
                <span className="text-[13px]">utils.{language === 'javascript' ? 'js' : language === 'python' ? 'py' : 'ts'}</span>
               </div>
            </div>
            <div className="flex items-center gap-2 pl-2 pr-4 py-1 hover:bg-[rgba(157,78,221,0.06)] hover:text-white rounded cursor-pointer transition-colors group mt-1 text-[rgba(180,180,220,0.8)]">
              <ChevronRight size={12} className="transition-transform" />
              <Folder size={12} color="#48CAE4" />
              <span className="text-[13px]">tests</span>
            </div>
          </div>
        </div>

        <div className="flex-1 flex flex-col min-w-0 bg-[#03030F]">
          <div className="flex-1 min-h-0 relative">
            <style>{`
              .monaco-scrollable-element > .scrollbar.vertical { width: 6px !important; }
              .monaco-scrollable-element > .scrollbar.vertical > .slider { background: rgba(157,78,221,0.3) !important; border-radius: 3px !important; }
              .monaco-scrollable-element > .scrollbar.vertical > .slider:hover { background: rgba(157,78,221,0.6) !important; }
            `}</style>
            <Editor
              height="100%"
              language={language}
              value={code}
              onChange={(value) => setCode((value || '').slice(0, 50000))}
              onMount={handleEditorDidMount}
              theme="spaceTheme"
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                lineNumbers: 'on',
                roundedSelection: true,
                scrollBeyondLastLine: false,
                readOnly: isLoading,
                automaticLayout: true,
                padding: { top: 24, bottom: 24 },
                fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                cursorSmoothCaretAnimation: 'on',
                smoothScrolling: true,
                renderLineHighlight: 'all',
                overviewRulerBorder: false,
              }}
            />
          </div>

          {/* Terminal (Bottom Panel) */}
          <div className="h-32 sm:h-48 border-t border-[rgba(157,78,221,0.12)] bg-[rgba(2,2,10,0.9)] flex flex-col shrink-0 relative">
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-nebula-purple via-cosmic-blue to-aurora-green opacity-50" />
            <div className="flex items-center px-4 pt-2 border-b border-white/5">
              <div 
                className="flex items-center gap-2 px-3 py-1.5 cursor-pointer text-white font-[600]"
                style={{
                  borderBottom: '2px solid #9D4EDD',
                  background: 'rgba(157,78,221,0.08)'
                }}
              >
                <TerminalSquare size={12} className="text-white" />
                <span className="text-[10px] uppercase tracking-widest">Terminal</span>
              </div>
              <div 
                className="flex items-center gap-2 px-3 py-1.5 cursor-pointer text-[rgba(180,180,220,0.45)] hover:text-white transition-colors"
              >
                <Activity size={12} />
                <span className="hidden sm:inline text-[10px] uppercase tracking-widest">Build Output</span>
              </div>
            </div>
            <div className="flex-1 p-3 sm:p-4 font-mono text-[12px] sm:text-[13px] leading-[1.8] overflow-y-auto custom-scrollbar flex flex-col gap-1">
              <div>
                <span className="text-[#9D4EDD] font-bold">→</span> 
                <span className="text-[#48CAE4] ml-2">~/project/workspace</span>
              </div>
              <div className="text-[rgba(180,180,220,0.6)]">Initializing environment for {language}...</div>
              {isLoading && (
                <div className="text-[#48CAE4] animate-pulse">Running static analysis on main.{language === 'javascript' ? 'js' : language === 'python' ? 'py' : 'ts'}...</div>
              )}
              {results && !isLoading && (
                <div className="mt-2" style={{
                  color: '#06D6A0',
                  borderLeft: '2px solid #06D6A0',
                  background: 'rgba(6,214,160,0.05)',
                  paddingLeft: '8px',
                  borderRadius: '4px'
                }}>
                  Analysis completed. Found {results.bugs.length} issues. Score: <span className="font-bold text-[#FFB627]" style={{ textShadow: '0 0 10px rgba(255,182,39,0.4)' }}>{results.qualityScore}/100</span>
                </div>
              )}
              <div className="mt-1 flex items-center">
                <span className="text-[#9D4EDD] font-bold">→</span> 
                <span className="text-[#48CAE4] ml-2">~/project/workspace</span>
                <span className="w-[2px] h-[14px] bg-[#9D4EDD] ml-2 animate-blink-step inline-block" />
              </div>
            </div>
          </div>
        </div>

        {/* Cheat Sheet Sidebar Drawer */}
        <AnimatePresence>
          {isCheatSheetOpen && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 300, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="h-full border-l border-white/10 bg-[#080810]/95 backdrop-blur-2xl flex flex-col z-20 shrink-0 shadow-2xl overflow-hidden glass-card font-sans-premium"
            >
              {/* Header */}
              <div className="px-4 py-3 bg-white/[0.02] border-b border-white/5 flex items-center justify-between shrink-0 font-sans-premium">
                <div className="flex items-center gap-2 text-cosmic-blue font-sans-premium">
                  <BookOpen size={14} />
                  <span className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-200 font-sans-premium">
                    {language} Cheat Sheet
                  </span>
                </div>
                <button
                  onClick={() => setIsCheatSheetOpen(false)}
                  className="p-1 rounded text-slate-500 hover:text-white bg-white/5 hover:bg-white/10 transition-colors btn-premium cursor-pointer"
                >
                  <X size={12} />
                </button>
              </div>

              {/* Collapsible Sections Container */}
              <div className="flex-1 overflow-y-auto custom-scrollbar">
                {cheatSheets[language] ? (
                  <>
                    {Object.entries(cheatSheets[language]).map(([key, section]) => (
                      <div key={key} className="border-b border-white/5">
                        <button
                          onClick={() => toggleSection(key)}
                          className="w-full py-3 px-4 flex items-center justify-between hover:bg-white/[0.01] transition-colors"
                        >
                          <span className="text-[9px] font-black uppercase tracking-widest text-slate-300">{section.title}</span>
                          <ChevronRight 
                            size={12} 
                            className={`text-slate-500 transition-transform ${openSections[key] ? 'rotate-90 text-blue-400' : ''}`} 
                          />
                        </button>
                        <AnimatePresence initial={false}>
                          {openSections[key] && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.2 }}
                              className="overflow-hidden bg-black/20"
                            >
                              <div className="p-4 flex flex-col gap-4">
                                {section.details.map((item, idx) => (
                                  <div key={idx} className="flex flex-col gap-1.5">
                                    <span className="text-[8px] font-black text-slate-500 uppercase tracking-wider">{item.concept}</span>
                                    <div className="relative group/code">
                                      <pre className="p-2.5 rounded-lg bg-black/40 border border-white/5 text-[9px] font-mono text-slate-300 overflow-x-auto leading-relaxed custom-scrollbar">
                                        <code>{item.code}</code>
                                      </pre>
                                      <button
                                        onClick={() => {
                                          navigator.clipboard.writeText(item.code);
                                        }}
                                        className="absolute top-2 right-2 p-1 rounded bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white opacity-0 group-hover/code:opacity-100 transition-opacity"
                                      >
                                        <Copy size={10} />
                                      </button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ))}
                  </>
                ) : (
                  <div className="p-6 text-center text-slate-500 flex flex-col items-center justify-center h-full min-h-[200px] gap-2">
                    <BookOpen size={20} className="opacity-20" />
                    <span className="text-[9px] font-black uppercase tracking-widest opacity-40">Cheat Sheet Not Available</span>
                    <span className="text-[8px] opacity-30 tracking-tight">Try Python, JavaScript, TypeScript, C++, Java, Go, or Rust</span>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default CodeInputPanel;
