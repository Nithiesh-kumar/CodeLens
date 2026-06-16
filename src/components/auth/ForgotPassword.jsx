import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { Mail, CheckCircle, Sparkles, Loader2, ArrowLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Starfield } from "./LoginPage";

const ForgotPassword = ({ onNavigate, triggerToast }) => {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      if (triggerToast) triggerToast("Please enter your email.", "error");
      return;
    }

    setIsLoading(true);
    try {
      await resetPassword(email);
      setIsSuccess(true);
      if (triggerToast) triggerToast("Password reset link sent successfully!");
    } catch (err) {
      console.error(err);
      let errorMsg = "Failed to send password reset email.";
      if (err.message.includes("auth/user-not-found")) {
        errorMsg = "No account found with this email.";
      } else if (err.message.includes("auth/invalid-email")) {
        errorMsg = "Please enter a valid email address.";
      }
      if (triggerToast) triggerToast(errorMsg, "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center p-4 overflow-hidden select-none">
      {/* Background Starfield */}
      <Starfield />

      {/* Glassmorphic Box */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, type: "spring" }}
        className="relative z-10 w-full max-w-md glass-card p-8 flex flex-col gap-6"
      >
        <AnimatePresence mode="wait">
          {!isSuccess ? (
            /* Forgot Password Form */
            <motion.div
              key="form"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="flex flex-col gap-5 font-sans-premium"
            >
              {/* Header */}
              <div className="flex flex-col items-center gap-1.5 text-center font-sans-premium">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-nebula-purple via-cosmic-blue to-aurora-green flex items-center justify-center shadow-lg shadow-purple-500/20">
                  <Sparkles className="text-white" size={20} />
                </div>
                <h2 className="text-xl font-black text-starlight tracking-tight mt-1 font-sans-premium">
                  Reset Password
                </h2>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-relaxed font-sans-premium">
                  Enter your email address and we will send you a reset link
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="flex flex-col gap-4 font-sans-premium">
                <div className="flex flex-col gap-1 font-sans-premium">
                  <label className="text-[8px] font-black uppercase text-slate-500 tracking-wider font-sans-premium">Email Address</label>
                  <div className="relative flex items-center">
                    <Mail className="absolute left-3.5 text-slate-500" size={14} />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="developer@codelens.ai"
                      className="w-full pl-10 pr-4 py-2.5 input-premium text-xs text-white placeholder-slate-600 focus:outline-none font-sans-premium"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full mt-2 py-2.5 rounded-xl bg-gradient-to-r from-nebula-purple via-cosmic-blue to-aurora-green text-white text-[10px] font-black uppercase tracking-widest border border-white/10 shadow-lg shadow-purple-500/10 hover:shadow-purple-500/20 btn-premium flex items-center justify-center gap-2 cursor-pointer font-sans-premium"
                >
                  {isLoading ? (
                    <Loader2 className="animate-spin" size={12} />
                  ) : (
                    "Send Reset Link"
                  )}
                </button>
              </form>

              {/* Back to Login */}
              <button
                onClick={() => onNavigate("login")}
                className="flex items-center justify-center gap-1.5 text-[9px] font-black uppercase text-slate-400 hover:text-white tracking-widest btn-premium mt-2 cursor-pointer font-sans-premium"
              >
                <ArrowLeft size={12} />
                Back to Sign In
              </button>
            </motion.div>
          ) : (
            /* Success State */
            <motion.div
              key="success"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="flex flex-col items-center gap-5 text-center py-4 font-sans-premium"
            >
              {/* Glowing Success Checkmark */}
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="p-3.5 rounded-full bg-aurora-green/10 text-aurora-green border border-aurora-green/20 shadow-[0_0_20px_rgba(0,212,170,0.15)]"
              >
                <CheckCircle size={32} />
              </motion.div>

              <div className="flex flex-col gap-1.5 font-sans-premium">
                <h3 className="text-xl font-black text-starlight tracking-tight font-sans-premium">
                  Check your Email
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed max-w-xs font-sans-premium">
                  We have sent a secure password reset link to <span className="text-aurora-green font-bold">{email}</span>. Please check your inbox and spam folder.
                </p>
              </div>

              <button
                onClick={() => {
                  setIsSuccess(false);
                  onNavigate("login");
                }}
                className="w-full mt-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white text-[10px] font-black uppercase tracking-widest btn-premium cursor-pointer font-sans-premium"
              >
                Return to Sign In
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
