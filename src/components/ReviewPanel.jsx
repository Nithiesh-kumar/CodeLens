import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle2, AlertTriangle, Lightbulb, BarChart3, Loader2 } from 'lucide-react';

const ReviewPanel = ({ isOpen, onClose, feedback, isLoading }) => {
  // Parse feedback into sections
  const parseFeedback = (text) => {
    if (!text) return null;
    const sections = {
      overall: '',
      strengths: [],
      issues: [],
      recommendations: []
    };

    const lines = text.split('\n');
    let currentSection = '';
    let parsedAnySection = false;

    lines.forEach(line => {
      const upperLine = line.toUpperCase();
      if (upperLine.includes('OVERALL')) {
        currentSection = 'overall';
        parsedAnySection = true;
      } else if (upperLine.includes('STRENGTHS')) {
        currentSection = 'strengths';
        parsedAnySection = true;
      } else if (upperLine.includes('ISSUES')) {
        currentSection = 'issues';
        parsedAnySection = true;
      } else if (upperLine.includes('RECOMMENDATIONS') || upperLine.includes('NEXT STEPS') || upperLine.includes('SUGGESTIONS')) {
        currentSection = 'recommendations';
        parsedAnySection = true;
      } else if (line.trim()) {
        const content = line.replace(/^[*-]\s*|^\d+\.\s*/, '').trim(); // Remove bullets or numbers
        if (currentSection === 'overall') {
          sections.overall += (sections.overall ? ' ' : '') + content;
        } else if (currentSection === 'strengths') {
          sections.strengths.push(content);
        } else if (currentSection === 'issues') {
          sections.issues.push(content);
        } else if (currentSection === 'recommendations') {
          sections.recommendations.push(content);
        }
      }
    });

    // Fallback: If we couldn't parse any section, or overall is empty and lists are empty
    const totalItems = sections.strengths.length + sections.issues.length + sections.recommendations.length;
    if (!parsedAnySection || (sections.overall.trim() === '' && totalItems === 0)) {
      sections.overall = text;
    }

    return sections;
  };

  const data = parseFeedback(feedback);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
          />

          {/* Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-lg bg-[#080810]/95 backdrop-blur-2xl border-l border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.8)] z-[101] flex flex-col glass-card font-sans-premium"
          >
            <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/[0.02] font-sans-premium">
              <div className="flex items-center gap-3 font-sans-premium">
                <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400 font-sans-premium">
                  <BarChart3 size={20} />
                </div>
                <div>
                  <h2 className="text-lg font-black text-white uppercase tracking-wider font-sans-premium">AI Code Review</h2>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest font-sans-premium">Powered by Gemini AI</p>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-white/5 text-slate-400 hover:text-white transition-all btn-premium cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 custom-scrollbar font-sans-premium">
              {isLoading ? (
                <div className="h-full flex flex-col items-center justify-center gap-4 font-sans-premium">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  >
                    <Loader2 size={40} className="text-nebula-purple" />
                  </motion.div>
                  <p className="text-xs font-black uppercase tracking-widest text-slate-500 animate-pulse font-sans-premium">Senior dev is thinking...</p>
                </div>
              ) : data ? (
                <div className="flex flex-col gap-8 font-sans-premium">
                  {/* Overall */}
                  {data.overall && data.overall.trim() && (
                    <section className="font-sans-premium">
                      <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-3 flex items-center gap-2 font-sans-premium">
                        Overall Assessment
                      </h3>
                      <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 text-sm text-starlight leading-relaxed italic font-medium font-sans-premium">
                        "{data.overall.trim()}"
                      </div>
                    </section>
                  )}

                  {/* Strengths */}
                  {data.strengths.length > 0 && (
                    <section className="font-sans-premium">
                      <h3 className="text-[10px] font-black text-aurora-green uppercase tracking-[0.2em] mb-3 flex items-center gap-2 font-sans-premium">
                        <CheckCircle2 size={12} className="text-aurora-green" />
                        Key Strengths
                      </h3>
                      <div className="flex flex-col gap-2 font-sans-premium">
                        {data.strengths.map((item, i) => (
                          <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-aurora-green/5 border border-aurora-green/10 text-xs text-starlight font-sans-premium">
                            <div className="w-1.5 h-1.5 rounded-full bg-aurora-green mt-1.5 shrink-0 shadow-[0_0_6px_rgba(0,212,170,0.6)]" />
                            {item}
                          </div>
                        ))}
                      </div>
                    </section>
                  )}

                  {/* Issues */}
                  {data.issues.length > 0 && (
                    <section className="font-sans-premium">
                      <h3 className="text-[10px] font-black text-amber-500/60 uppercase tracking-[0.2em] mb-3 flex items-center gap-2 font-sans-premium">
                        <AlertTriangle size={12} className="text-amber-500" />
                        Identified Issues
                      </h3>
                      <div className="flex flex-col gap-2 font-sans-premium">
                        {data.issues.map((item, i) => (
                          <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-amber-500/5 border border-amber-500/10 text-xs text-starlight font-sans-premium">
                            <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0 shadow-[0_0_6px_rgba(245,166,35,0.6)]" />
                            {item}
                          </div>
                        ))}
                      </div>
                    </section>
                  )}

                  {/* Recommendations */}
                  {data.recommendations.length > 0 && (
                    <section className="font-sans-premium">
                      <h3 className="text-[10px] font-black text-blue-500/60 uppercase tracking-[0.2em] mb-3 flex items-center gap-2 font-sans-premium">
                        <Lightbulb size={12} className="text-blue-500" />
                        Next Steps
                      </h3>
                      <div className="flex flex-col gap-2 font-sans-premium">
                        {data.recommendations.map((item, i) => (
                          <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-blue-500/5 border border-blue-500/10 text-xs text-starlight font-sans-premium">
                            <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0 shadow-[0_0_6px_rgba(59,130,246,0.6)]" />
                            {item}
                          </div>
                        ))}
                      </div>
                    </section>
                  )}
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center opacity-20 font-sans-premium">
                  <BarChart3 size={64} className="mb-4" />
                  <p className="text-xs font-black uppercase tracking-widest font-sans-premium">No Review Data</p>
                </div>
              )}
            </div>

            <div className="p-6 border-t border-white/10 bg-white/[0.01] font-sans-premium">
              <button 
                onClick={onClose}
                className="w-full py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white text-xs font-bold uppercase tracking-widest transition-all border border-white/10 btn-premium cursor-pointer font-sans-premium"
              >
                Close Review
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ReviewPanel;
