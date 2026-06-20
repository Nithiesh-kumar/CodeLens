import React from 'react';
import { Copy, ScanSearch, History, Clock, Code2, ChevronDown, LogOut, Menu, X, LayoutDashboard, Wrench, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const Header = ({ results, onCopy, onReview, history, onRestore, activeTab, onTabChange, onSignOut, isReviewLoading }) => {
  const [isHistoryOpen, setIsHistoryOpen] = React.useState(false);
  const [isProfileOpen, setIsProfileOpen] = React.useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const { currentUser, logout } = useAuth();

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const formatTime = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="w-full flex flex-col z-20 font-sans-premium relative">
      <header className="w-full h-[58px] px-3 sm:px-6 flex justify-between items-center bg-[rgba(2,2,10,0.88)] backdrop-blur-[32px] border-b border-[rgba(157,78,221,0.15)] relative">
        
        {/* Bottom 1px Gradient Line */}
        <div className="absolute bottom-0 left-0 right-0 h-[1px] opacity-60 bg-[linear-gradient(90deg,transparent,#9D4EDD_30%,#48CAE4_70%,transparent)] pointer-events-none" />

        {/* Left: Logo + Badge + Tabs */}
        <div className="flex items-center gap-2 sm:gap-4 min-w-0">
          <div className="flex items-center gap-2 sm:gap-3 relative shrink-0">
            {/* Logo Monogram */}
            <div className="relative w-8 h-8 rounded-lg overflow-hidden flex items-center justify-center">
              <div className="absolute inset-[-50%] bg-[conic-gradient(from_0deg,transparent,#9D4EDD,#48CAE4,transparent)] animate-[spin_4s_linear_infinite]" />
              <div className="absolute inset-[1px] bg-gradient-to-br from-nebula-purple to-cosmic-blue rounded-[7px] flex items-center justify-center">
                <span className="text-white font-black text-sm z-10">CL</span>
              </div>
            </div>
            
            <div className="flex flex-col justify-center">
              <h1 className="text-lg leading-tight tracking-tight select-none">
                <span className="text-starlight font-semibold">Code</span>
                <span className="gradient-text-premium font-bold">Lens</span>
              </h1>
              <span className="text-stardust text-[9px] font-medium tracking-wider -mt-1 block">v2.0</span>
            </div>
          </div>
          
          {/* Live Analysis Badge - hidden on smallest screens */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full border border-[rgba(6,214,160,0.4)] bg-[rgba(6,214,160,0.08)] ml-2">
            <div className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-aurora-green opacity-75" style={{ animationDuration: '2s' }}></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-aurora-green"></span>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-aurora-green">
              {results ? `Score: ${results.qualityScore}` : 'Ready'}
            </span>
          </div>

          {/* Navigation Tabs - desktop only */}
          <nav className="hidden md:flex items-center gap-2 ml-2">
            <button 
              onClick={() => onTabChange('dashboard')}
              className={`relative px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${
                activeTab === 'dashboard' 
                ? 'bg-[rgba(157,78,221,0.15)] border border-[rgba(157,78,221,0.35)] gradient-text-premium' 
                : 'text-stardust bg-transparent border border-transparent hover:bg-[rgba(157,78,221,0.08)] hover:border-[rgba(157,78,221,0.2)]'
              }`}
            >
              Dashboard
              {activeTab === 'dashboard' && (
                <div className="absolute bottom-0 left-2 right-2 h-[2px] bg-gradient-to-r from-nebula-purple to-cosmic-blue rounded-t-sm" />
              )}
            </button>
            <button 
              onClick={() => onTabChange('tools')}
              className={`relative px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${
                activeTab === 'tools' 
                ? 'bg-[rgba(157,78,221,0.15)] border border-[rgba(157,78,221,0.35)] gradient-text-premium' 
                : 'text-stardust bg-transparent border border-transparent hover:bg-[rgba(157,78,221,0.08)] hover:border-[rgba(157,78,221,0.2)]'
              }`}
            >
              Tools
              {activeTab === 'tools' && (
                <div className="absolute bottom-0 left-2 right-2 h-[2px] bg-gradient-to-r from-nebula-purple to-cosmic-blue rounded-t-sm" />
              )}
            </button>
          </nav>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2 lg:gap-3 shrink-0">
          {/* History Dropdown */}
          <div className="relative">
            <button 
              onClick={() => setIsHistoryOpen(!isHistoryOpen)}
              className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1.5 rounded-lg bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] text-stardust hover:bg-[rgba(157,78,221,0.1)] hover:border-[rgba(157,78,221,0.25)] hover:text-starlight transition-all cursor-pointer"
            >
              <History size={14} className="text-nebula-violet" />
              <span className="hidden lg:inline text-[10px] font-bold uppercase tracking-wider">History</span>
              <ChevronDown size={12} className={`text-nebula-violet transition-transform duration-300 ${isHistoryOpen ? 'rotate-180' : ''}`} />
            </button>
            <AnimatePresence>
              {isHistoryOpen && (
                <>
                  <div className="fixed inset-0 z-30" onClick={() => setIsHistoryOpen(false)} />
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-2 w-[min(72vw,320px)] glass-card z-40 overflow-hidden"
                  >
                    <div className="p-4 border-b border-white/5">
                      <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Recent Analyses</h3>
                    </div>
                    <div className="max-h-[350px] overflow-y-auto custom-scrollbar">
                      {history.length > 0 ? (
                        history.map((item) => (
                          <button
                            key={item.id}
                            onClick={() => {
                              onRestore(item);
                              setIsHistoryOpen(false);
                            }}
                            className="w-full p-4 flex items-start gap-4 hover:bg-white/[0.03] transition-colors text-left border-b border-white/[0.02] group cursor-pointer"
                          >
                            <div className="p-2 rounded-xl bg-blue-500/10 text-cosmic-blue group-hover:scale-110 transition-transform">
                              <Code2 size={16} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex justify-between items-start mb-1">
                                <span className="text-[10px] font-bold text-slate-200 truncate uppercase tracking-widest">{item.language}</span>
                                <span className={`text-[9px] font-black px-1.5 py-0.5 rounded ${
                                  item.results.qualityScore > 75 ? 'bg-aurora-green/20 text-aurora-green' :
                                  item.results.qualityScore > 50 ? 'bg-solar-gold/20 text-solar-gold' : 'bg-pulsar-red/20 text-pulsar-red'
                                }`}>
                                  {item.results.qualityScore}%
                                </span>
                              </div>
                              <p className="text-[10px] text-slate-500 font-mono truncate mb-2">{item.codePreview}</p>
                              <div className="flex items-center gap-1.5 text-slate-600">
                                <Clock size={10} />
                                <span className="text-[8px] font-medium">{formatTime(item.timestamp)}</span>
                              </div>
                            </div>
                          </button>
                        ))
                      ) : (
                        <div className="p-8 text-center">
                          <History size={24} className="mx-auto mb-2 text-slate-700 opacity-30" />
                          <p className="text-[9px] font-bold uppercase tracking-widest text-slate-600">No history yet</p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>

          <button 
            onClick={onReview}
            disabled={isReviewLoading}
            title="AI Code Review"
            className={`group flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1.5 rounded-lg border transition-all ${
              isReviewLoading
                ? 'bg-[rgba(157,78,221,0.1)] border-[rgba(157,78,221,0.3)] text-purple-400 cursor-not-allowed opacity-80'
                : 'bg-[rgba(255,255,255,0.04)] border-[rgba(255,255,255,0.08)] text-stardust hover:bg-[rgba(157,78,221,0.1)] hover:border-[rgba(157,78,221,0.25)] hover:text-starlight hover:shadow-[0_0_15px_rgba(157,78,221,0.4)] cursor-pointer'
            }`}
          >
            {isReviewLoading ? (
              <Loader2 size={14} className="animate-spin text-purple-400" />
            ) : (
              <ScanSearch size={14} className="text-nebula-violet group-hover:scale-110 transition-transform" />
            )}
            <span className="hidden lg:inline text-[10px] font-bold uppercase tracking-wider">
              {isReviewLoading ? 'Reviewing...' : 'AI Review'}
            </span>
          </button>

          <button 
            onClick={onCopy}
            title="Copy Analysis Summary"
            className="hidden sm:flex group items-center gap-2 px-3 py-1.5 rounded-lg bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] text-stardust hover:bg-[rgba(157,78,221,0.1)] hover:border-[rgba(157,78,221,0.25)] hover:text-starlight transition-all cursor-pointer"
          >
            <Copy size={14} className="text-nebula-violet group-hover:rotate-6 transition-transform" />
            <span className="hidden lg:inline text-[10px] font-bold uppercase tracking-wider">Copy</span>
          </button>

          {/* User Profile Dropdown */}
          {currentUser && (
            <div className="relative ml-1">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-1 rounded-full cursor-pointer group hover:opacity-80 transition-opacity"
              >
                {/* 36px circle with animated gradient border */}
                <div className="relative w-8 h-8 rounded-full overflow-hidden flex items-center justify-center p-[2px]">
                  <div className="absolute inset-[-50%] bg-[conic-gradient(from_0deg,#9D4EDD,#48CAE4,#06D6A0,#9D4EDD)] animate-[spin_4s_linear_infinite]" />
                  <div className="relative w-full h-full bg-space-deep rounded-full flex items-center justify-center overflow-hidden">
                    {currentUser.photoURL ? (
                      <img src={currentUser.photoURL} alt="User" className="w-full h-full object-cover" loading="lazy" />
                    ) : (
                      <span className="text-starlight text-xs font-bold">{getInitials(currentUser.displayName || currentUser.email)}</span>
                    )}
                  </div>
                </div>
                
                <span className="hidden xl:inline text-xs font-medium text-starlight pr-1 truncate max-w-[100px]">
                  {currentUser.displayName || currentUser.email.split('@')[0]}
                </span>
                <ChevronDown size={14} className={`text-nebula-violet transition-transform duration-300 ${isProfileOpen ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {isProfileOpen && (
                  <>
                    <div className="fixed inset-0 z-30" onClick={() => setIsProfileOpen(false)} />
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 mt-2 w-56 glass-card z-40 overflow-hidden p-4 flex flex-col gap-4"
                    >
                      {/* User Info */}
                      <div className="flex flex-col gap-1 border-b border-white/5 pb-3">
                        <p className="text-[10px] font-black uppercase text-slate-500 tracking-wider">Signed in as</p>
                        <p className="text-xs font-black text-starlight truncate">{currentUser.displayName || "Developer"}</p>
                        <p className="text-[10px] text-stardust truncate">{currentUser.email}</p>
                      </div>

                      {/* Actions */}
                      <button
                        onClick={async () => {
                          setIsProfileOpen(false);
                          if (onSignOut) onSignOut();
                          await logout();
                        }}
                        className="group flex items-center justify-between w-full p-2.5 rounded-xl bg-pulsar-red/10 hover:bg-pulsar-red/20 text-pulsar-red border border-pulsar-red/20 transition-all text-xs font-black uppercase tracking-widest cursor-pointer"
                      >
                        Sign Out
                        <LogOut size={14} className="group-hover:translate-x-0.5 transition-transform" />
                      </button>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* Mobile hamburger menu for nav tabs */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="flex md:hidden items-center justify-center w-8 h-8 rounded-lg bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] text-stardust hover:bg-[rgba(157,78,221,0.1)] hover:border-[rgba(157,78,221,0.25)] transition-all cursor-pointer ml-1"
          >
            {isMobileMenuOpen ? <X size={16} /> : <Menu size={16} />}
          </button>
        </div>
      </header>

      {/* Mobile Nav Dropdown */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <div className="fixed inset-0 z-30 md:hidden" onClick={() => setIsMobileMenuOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-[58px] left-0 right-0 z-40 md:hidden bg-[rgba(2,2,10,0.97)] backdrop-blur-xl border-b border-[rgba(157,78,221,0.2)] flex flex-col"
            >
              {/* Live badge on mobile */}
              <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5">
                <div className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-aurora-green opacity-75" style={{ animationDuration: '2s' }}></span>
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-aurora-green"></span>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-aurora-green">
                  {results ? `Score: ${results.qualityScore}` : 'Analysis Ready'}
                </span>
              </div>

              {/* Nav Tabs */}
              <button
                onClick={() => { onTabChange('dashboard'); setIsMobileMenuOpen(false); document.getElementById('content-section')?.scrollIntoView({ behavior: 'smooth' }); }}
                className={`flex items-center gap-3 px-4 py-3.5 text-sm font-bold uppercase tracking-widest transition-all ${
                  activeTab === 'dashboard'
                    ? 'text-white bg-[rgba(157,78,221,0.12)] border-l-2 border-nebula-purple'
                    : 'text-stardust hover:bg-white/5 border-l-2 border-transparent'
                }`}
              >
                <LayoutDashboard size={16} />
                Dashboard
              </button>
              <button
                onClick={() => { onTabChange('tools'); setIsMobileMenuOpen(false); document.getElementById('content-section')?.scrollIntoView({ behavior: 'smooth' }); }}
                className={`flex items-center gap-3 px-4 py-3.5 text-sm font-bold uppercase tracking-widest transition-all ${
                  activeTab === 'tools'
                    ? 'text-white bg-[rgba(157,78,221,0.12)] border-l-2 border-nebula-purple'
                    : 'text-stardust hover:bg-white/5 border-l-2 border-transparent'
                }`}
              >
                <Wrench size={16} />
                Developer Tools
              </button>
              <button
                onClick={() => { onCopy(); setIsMobileMenuOpen(false); }}
                className="flex items-center gap-3 px-4 py-3.5 text-sm font-bold uppercase tracking-widest text-stardust hover:bg-white/5 border-l-2 border-transparent transition-all"
              >
                <Copy size={16} />
                Copy Results
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Header;
