import React, { useState, useEffect, useRef, useMemo, lazy, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from './components/Header';
import CodeInputPanel from './components/CodeInputPanel';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import NotFound from './components/NotFound';
import CustomCursor from './components/CustomCursor';
import DeepSpaceBackground from './components/DeepSpaceBackground';

const AuthLayout = ({ children }) => {
  return (
    <div className="relative min-h-screen bg-space-void text-starlight overflow-hidden custom-cursor-active">
      <CustomCursor />
      <DeepSpaceBackground />
      {children}
    </div>
  );
};

const ResultsDashboard = lazy(() => import('./components/ResultsDashboard'));
const ReviewPanel = lazy(() => import('./components/ReviewPanel'));
const ToolsPanel = lazy(() => import('./components/ToolsPanel'));
import { analyzeCode } from './utils/analyzeCode';
import { 
  explainCode, 
  refactorCode, 
  fixBug, 
  generateCode, 
  reviewCode 
} from './utils/aiFeatures';
import { saveAnalysis, getHistory } from './utils/history';
import { useAuth } from './context/AuthContext';
import LoginPage from './components/auth/LoginPage';
import SignupPage from './components/auth/SignupPage';
import ForgotPassword from './components/auth/ForgotPassword';
import LoadingScreen from './components/LoadingScreen';

function App() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  
  const [isLoading, setIsLoading] = useState(false);
  const [code, setCode] = useState('// Paste your code here for analysis...\n\nfunction example() {\n  console.log("Hello CodeLens");\n}');
  const [language, setLanguage] = useState('javascript');
  const [results, setResults] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('Operation successful!');
  const [toastType, setToastType] = useState('success'); // 'success' | 'error'
  const [shakeEditor, setShakeEditor] = useState(false);
  
  // AI States
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiExplanation, setAiExplanation] = useState('');
  const [refactoredCode, setRefactoredCode] = useState('');
  const [reviewFeedback, setReviewFeedback] = useState('');
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [isReviewLoading, setIsReviewLoading] = useState(false);
  const [analysisHistory, setAnalysisHistory] = useState([]);
  const [activeTab, setActiveTab] = useState('dashboard');
  


  
  const editorRef = useRef(null);

  const triggerToast = (message, type = 'success') => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 4000);
  };

  const handleAnalyze = () => {
    if (!code || code.trim() === '' || code === '// Paste your code here for analysis...') {
      setShakeEditor(true);
      setTimeout(() => setShakeEditor(false), 500);
      return;
    }

    setIsLoading(true);
    
    // Simulate processing delay
    setTimeout(() => {
      const analysis = analyzeCode(code, language);
      setResults(analysis);
      setIsLoading(false);
      
      // Save to history
      saveAnalysis(code, language, analysis).then(updatedHistory => {
        setAnalysisHistory(updatedHistory);
      });

      // Auto-scroll to results
      setTimeout(() => {
        document.getElementById('content-section')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }, 1200);
  };

  const handleCopyResults = () => {
    if (!results) return;

    const summary = `
CodeLens Analysis Summary
-------------------------
Score: ${results.qualityScore}/100
Language: ${language}
Lines: ${results.size.totalLines}
Complexity: ${results.complexity.bigOTime}
Issues Found: ${results.bugs.length}

Suggestions:
${results.suggestions.map(s => `- ${s}`).join('\n')}
    `.trim();

    navigator.clipboard.writeText(summary).then(() => {
      triggerToast('Analysis summary copied to clipboard!');
    });
  };

  const scrollToLine = (line) => {
    if (editorRef.current) {
      editorRef.current.revealLineInCenter(line);
      editorRef.current.setPosition({ lineNumber: line, column: 1 });
      editorRef.current.focus();
    }
  };

  // AI Handlers
  const isCodeEmptyOrPlaceholder = () => {
    return !code || code.trim() === '' || code === '// Paste your code here for analysis...';
  };

  const handleExplain = async () => {
    if (isCodeEmptyOrPlaceholder()) {
      setShakeEditor(true);
      setTimeout(() => setShakeEditor(false), 500);
      triggerToast('Please write or paste some code first.', 'error');
      return;
    }
    try {
      setIsAiLoading(true);
      setAiExplanation('');
      const explanation = await explainCode(code, language);
      setAiExplanation(explanation);
    } catch (error) {
      triggerToast(error.message, 'error');
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleRefactor = async () => {
    if (isCodeEmptyOrPlaceholder()) {
      setShakeEditor(true);
      setTimeout(() => setShakeEditor(false), 500);
      triggerToast('Please write or paste some code first.', 'error');
      return;
    }
    try {
      setIsAiLoading(true);
      setRefactoredCode('');
      const refactored = await refactorCode(code, language);
      setRefactoredCode(refactored);
    } catch (error) {
      triggerToast(error.message, 'error');
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleFixBug = async (bugMessage) => {
    if (isCodeEmptyOrPlaceholder()) {
      setShakeEditor(true);
      setTimeout(() => setShakeEditor(false), 500);
      triggerToast('Please write or paste some code first.', 'error');
      return;
    }
    try {
      setIsAiLoading(true);
      const fixed = await fixBug(code, bugMessage, language);
      setCode(fixed);
      triggerToast('Bug fixed successfully!');
    } catch (error) {
      triggerToast(error.message, 'error');
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleGenerate = async (prompt) => {
    try {
      setIsAiLoading(true);
      const generated = await generateCode(prompt, language);
      setCode(generated);
      triggerToast('Code generated successfully!');
    } catch (error) {
      triggerToast(error.message, 'error');
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleReview = async () => {
    if (isCodeEmptyOrPlaceholder()) {
      setShakeEditor(true);
      setTimeout(() => setShakeEditor(false), 500);
      triggerToast('Please write or paste some code first.', 'error');
      return;
    }
    if (isReviewLoading) return;
    setIsReviewOpen(true);
    setIsReviewLoading(true);
    try {
      const feedback = await reviewCode(code, language);
      setReviewFeedback(feedback);
    } catch (error) {
      triggerToast(error.message, 'error');
      setIsReviewOpen(false);
    } finally {
      setIsReviewLoading(false);
    }
  };

  const handleRestoreHistory = (historyItem) => {
    setCode(historyItem.fullCode);
    setLanguage(historyItem.language);
    setResults(historyItem.results);
    // Clear AI states when restoring
    setAiExplanation('');
    setRefactoredCode('');
  };

  // Initial analysis and history load
  useEffect(() => {
    if (currentUser) {
      getHistory().then(history => {
        setAnalysisHistory(history);
        handleAnalyze();
      });
    } else {
      if (window.location.pathname === '/' || window.location.pathname === '') {
        navigate('/login');
      }
    }
  }, [currentUser]);

  return (
    <>
      <Routes>
        {/* Route 1: Dashboard */}
        <Route 
          path="/" 
          element={
            currentUser ? (
              <div className="relative flex flex-col min-h-screen text-starlight bg-space-void custom-cursor-active">
                <LoadingScreen onComplete={() => {}} />
                <CustomCursor />
                <DeepSpaceBackground />
                <div className="fixed top-0 left-0 right-0 z-50">
                  <Header 
                    results={results} 
                    onCopy={handleCopyResults} 
                    onReview={handleReview}
                    history={analysisHistory}
                    onRestore={handleRestoreHistory}
                    activeTab={activeTab}
                    onTabChange={(tab) => {
                       setActiveTab(tab);
                       document.getElementById('content-section')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    onSignOut={() => navigate('/login')}
                    isReviewLoading={isReviewLoading}
                  />
                </div>
                
                <main className="flex-1 flex flex-col w-full relative z-10 pt-[58px]">
                  <section id="editor-section" className="w-full flex flex-col p-3 sm:p-4 lg:p-8" style={{ minHeight: 'calc(100svh - 58px)' }}>
                    <CodeInputPanel 
                      code={code} 
                      setCode={setCode} 
                      language={language} 
                      setLanguage={setLanguage} 
                      onAnalyze={handleAnalyze}
                      onGenerate={handleGenerate}
                      isLoading={isLoading || isAiLoading}
                      shake={shakeEditor}
                      setEditorRef={(ref) => (editorRef.current = ref)}
                      results={results}
                    />
                  </section>

                  <section id="content-section" className="w-full relative">
                    <AnimatePresence mode="wait">
                      {activeTab === 'dashboard' && results ? (
                        <motion.div
                          key="dashboard"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ duration: 0.2, ease: "easeOut" }}
                          className="w-full flex flex-col p-3 sm:p-4 lg:p-8"
                        >
                          <div className="flex items-center gap-3 mb-6">
                             <h2 className="text-xl sm:text-2xl lg:text-3xl font-black uppercase tracking-[0.15em] sm:tracking-[0.2em] text-starlight drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">Analysis Dashboard</h2>
                             <div className="h-px flex-1 bg-gradient-to-r from-white/20 to-transparent"></div>
                          </div>
                          <div className="flex flex-col">
                            <Suspense fallback={<div className="panel-loading text-center p-8 text-stardust font-space text-[10px] font-black uppercase tracking-widest">Loading Dashboard...</div>}>
                              <ResultsDashboard 
                                results={results} 
                                isLoading={isLoading} 
                                onBugClick={scrollToLine}
                                onExplain={handleExplain}
                                onRefactor={handleRefactor}
                                onFixBug={handleFixBug}
                                aiData={{
                                  explanation: aiExplanation,
                                  refactoredCode,
                                  isLoading: isAiLoading
                                }}
                                history={analysisHistory}
                                triggerToast={triggerToast}
                                setCode={setCode}
                              />
                            </Suspense>
                          </div>
                        </motion.div>
                      ) : activeTab === 'tools' ? (
                        <motion.div
                          key="tools"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ duration: 0.2, ease: "easeOut" }}
                          className="w-full flex flex-col p-3 sm:p-4 lg:p-8"
                        >
                          <div className="flex items-center gap-3 mb-6">
                             <h2 className="text-xl sm:text-2xl lg:text-3xl font-black uppercase tracking-[0.15em] sm:tracking-[0.2em] text-starlight drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">Developer Tools</h2>
                             <div className="h-px flex-1 bg-gradient-to-r from-white/20 to-transparent"></div>
                          </div>
                          <div className="flex flex-col">
                            <Suspense fallback={<div className="panel-loading text-center p-8 text-stardust font-space text-[10px] font-black uppercase tracking-widest">Loading Tools...</div>}>
                              <ToolsPanel triggerToast={triggerToast} />
                            </Suspense>
                          </div>
                        </motion.div>
                      ) : null}
                    </AnimatePresence>
                  </section>
                </main>

                <Suspense fallback={null}>
                  <ReviewPanel 
                    isOpen={isReviewOpen}
                    onClose={() => setIsReviewOpen(false)}
                    feedback={reviewFeedback}
                    isLoading={isReviewLoading}
                  />
                </Suspense>

                <footer className="w-full text-center py-5 text-[rgba(157,78,221,0.4)] text-[10px] font-bold uppercase tracking-[3px] font-space relative mt-4">
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[200px] h-[1px] bg-gradient-to-r from-transparent via-nebula-purple to-transparent opacity-50" />
                  &copy; 2026 CODELENS AI. PRECISION STATIC ANALYSIS.
                </footer>
              </div>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* Route 2: Login */}
        <Route 
          path="/login" 
          element={
            !currentUser ? (
              <AuthLayout>
                <LoginPage onNavigate={(screen) => navigate(`/${screen}`)} triggerToast={triggerToast} />
              </AuthLayout>
            ) : (
              <Navigate to="/" replace />
            )
          } 
        />

        {/* Route 3: Signup */}
        <Route 
          path="/signup" 
          element={
            !currentUser ? (
              <AuthLayout>
                <SignupPage onNavigate={(screen) => navigate(`/${screen}`)} triggerToast={triggerToast} />
              </AuthLayout>
            ) : (
              <Navigate to="/" replace />
            )
          } 
        />

        {/* Route 4: Forgot Password */}
        <Route 
          path="/forgot" 
          element={
            !currentUser ? (
              <AuthLayout>
                <ForgotPassword onNavigate={(screen) => navigate(`/${screen}`)} triggerToast={triggerToast} />
              </AuthLayout>
            ) : (
              <Navigate to="/" replace />
            )
          } 
        />

        {/* Route 5: 404 Not Found */}
        <Route path="*" element={<NotFound />} />
      </Routes>

      <AnimatePresence>
        {showToast && (
          <motion.div 
            initial={{ opacity: 0, y: 50, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: 20, x: '-50%' }}
            className={`fixed bottom-10 left-1/2 -translate-x-1/2 px-6 py-3 rounded-full text-white font-bold text-sm shadow-2xl z-50 border ${
              toastType === 'error' 
                ? 'bg-red-600 shadow-red-500/40 border-red-400/30' 
                : 'bg-blue-600 shadow-blue-500/40 border-blue-400/30'
            }`}
          >
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default App;
