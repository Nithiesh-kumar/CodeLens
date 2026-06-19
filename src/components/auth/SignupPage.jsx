import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { Mail, Lock, User, Sparkles, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { Starfield } from "./LoginPage";

const SignupPage = ({ onNavigate, triggerToast }) => {
  const { signup, loginWithGoogle } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Password Strength evaluation
  const getPasswordStrength = (pwd) => {
    if (!pwd) return { label: "", score: 0, color: "bg-slate-700", text: "text-slate-500" };
    if (pwd.length < 6) return { label: "Weak", score: 1, color: "bg-[#FF5555] shadow-[0_0_8px_rgba(255,85,85,0.5)]", text: "text-red-400" };
    
    let score = 2;
    const hasNumbers = /\d/.test(pwd);
    const hasNonalphas = /\W/.test(pwd);
    const hasMixed = /[a-z]/.test(pwd) && /[A-Z]/.test(pwd);

    if (pwd.length >= 8 && (hasNumbers || hasNonalphas) && hasMixed) score = 3;
    if (pwd.length >= 10 && hasNumbers && hasNonalphas && hasMixed) score = 4;

    if (score === 2) return { label: "Fair", score: 2, color: "bg-[#F5A623] shadow-[0_0_8px_rgba(245,166,35,0.5)]", text: "text-amber-400" };
    if (score === 3) return { label: "Strong", score: 3, color: "bg-cosmic-blue shadow-[0_0_8px_rgba(79,142,247,0.5)]", text: "text-blue-400" };
    return { label: "Very Strong", score: 4, color: "bg-aurora-green shadow-[0_0_10px_rgba(0,212,170,0.6)]", text: "text-aurora-green" };
  };

  const strength = getPasswordStrength(password);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password || !confirmPassword) {
      if (triggerToast) triggerToast("Please fill in all details.", "error");
      return;
    }
    if (password !== confirmPassword) {
      if (triggerToast) triggerToast("Passwords do not match.", "error");
      return;
    }
    if (password.length < 6) {
      if (triggerToast) triggerToast("Password must be at least 6 characters.", "error");
      return;
    }
    if (!termsAccepted) {
      if (triggerToast) triggerToast("You must accept the terms of service.", "error");
      return;
    }

    setIsLoading(true);
    try {
      await signup(email, password, name);
      if (triggerToast) triggerToast("Account created successfully!");
    } catch (err) {
      console.error(err);
      let errorMsg = "Sign up failed. Please check your credentials.";
      if (err.message.includes("auth/email-already-in-use")) {
         errorMsg = "This email is already in use.";
      } else if (err.message.includes("auth/invalid-email")) {
         errorMsg = "Please enter a valid email address.";
      }
      if (triggerToast) triggerToast(errorMsg, "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setIsLoading(true);
    try {
      await loginWithGoogle();
      if (triggerToast) triggerToast("Signed in with Google successfully!");
    } catch (err) {
      console.error(err);
      let errorMsg = "Google Authentication failed.";
      if (err.code === "auth/unauthorized-domain") {
        errorMsg = "Google Sign-In failed: This domain is not authorized in Firebase Console. Please add it under Authentication > Settings > Authorized domains.";
      } else if (err.code === "auth/popup-closed-by-user") {
        errorMsg = "Google Sign-In: Popup closed by user.";
      } else if (err.message) {
        errorMsg = `Google Sign-In failed: ${err.message}`;
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
        className="relative z-10 w-full max-w-md glass-card p-8 flex flex-col gap-5"
      >
        {/* Logo Header */}
        <div className="flex flex-col items-center gap-1.5 text-center font-sans-premium">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-nebula-purple via-cosmic-blue to-aurora-green flex items-center justify-center shadow-lg shadow-purple-500/20">
            <Sparkles className="text-white" size={20} />
          </div>
          <h2 className="text-xl font-black text-starlight font-sans-premium tracking-tight mt-1">
            Create Code<span className="text-aurora-green">Lens</span> Account
          </h2>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest font-sans-premium">
            Enter your details below to get started
          </p>
        </div>

        {/* Signup Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-3.5 font-sans-premium">
          {/* Full Name Input */}
          <div className="flex flex-col gap-1 font-sans-premium">
            <label className="text-[8px] font-black uppercase text-slate-500 tracking-wider font-sans-premium">Full Name</label>
            <div className="relative flex items-center">
              <User className="absolute left-3.5 text-slate-500" size={14} />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nithiesh Kumar"
                className="w-full pl-10 pr-4 py-2.5 input-premium text-xs text-white placeholder-slate-600 focus:outline-none font-sans-premium"
              />
            </div>
          </div>

          {/* Email Input */}
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

          {/* Password Input */}
          <div className="flex flex-col gap-1 font-sans-premium">
            <label className="text-[8px] font-black uppercase text-slate-500 tracking-wider font-sans-premium">Password</label>
            <div className="relative flex items-center">
              <Lock className="absolute left-3.5 text-slate-500" size={14} />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                className="w-full pl-10 pr-4 py-2.5 input-premium text-xs text-white placeholder-slate-600 focus:outline-none font-sans-premium"
              />
            </div>

            {/* Password Strength Meter */}
            {password && (
              <div className="flex flex-col gap-1 mt-1.5 px-0.5 font-sans-premium">
                <div className="flex justify-between items-center text-[8px] font-black uppercase tracking-wider font-sans-premium">
                  <span className="text-slate-500">Password Strength</span>
                  <span className={strength.text}>{strength.label}</span>
                </div>
                <div className="grid grid-cols-4 gap-1.5 h-1 w-full bg-white/5 rounded-full overflow-hidden mt-0.5">
                  <div className={`h-full rounded-full transition-all duration-300 ${strength.score >= 1 ? strength.color : "bg-transparent"}`} />
                  <div className={`h-full rounded-full transition-all duration-300 ${strength.score >= 2 ? strength.color : "bg-transparent"}`} />
                  <div className={`h-full rounded-full transition-all duration-300 ${strength.score >= 3 ? strength.color : "bg-transparent"}`} />
                  <div className={`h-full rounded-full transition-all duration-300 ${strength.score >= 4 ? strength.color : "bg-transparent"}`} />
                </div>
              </div>
            )}
          </div>

          {/* Confirm Password Input */}
          <div className="flex flex-col gap-1 font-sans-premium">
            <label className="text-[8px] font-black uppercase text-slate-500 tracking-wider font-sans-premium">Confirm Password</label>
            <div className="relative flex items-center">
              <Lock className="absolute left-3.5 text-slate-500" size={14} />
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter password"
                className="w-full pl-10 pr-4 py-2.5 input-premium text-xs text-white placeholder-slate-600 focus:outline-none font-sans-premium"
              />
            </div>
          </div>

          {/* Terms checkbox */}
          <div className="flex items-start justify-between mt-1 font-sans-premium">
            <label className="flex items-start gap-2 cursor-pointer group">
              <input
                type="checkbox"
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-4 h-4 rounded border border-white/20 bg-white/[0.02] peer-checked:bg-nebula-purple peer-checked:border-nebula-purple transition-all flex items-center justify-center shrink-0 mt-0.5">
                <div className="w-1.5 h-1.5 rounded-sm bg-white scale-0 peer-checked:scale-100 transition-transform" />
              </div>
              <span className="text-[9px] text-slate-400 group-hover:text-slate-300 font-bold uppercase tracking-wider transition-colors leading-relaxed font-sans-premium">
                I agree to the Terms of Service & Privacy Policy
              </span>
            </label>
          </div>

          {/* Sign Up Button */}
          <button
            type="submit"
            disabled={isLoading || !termsAccepted}
            className="w-full mt-2 py-2.5 rounded-xl bg-gradient-to-r from-nebula-purple via-cosmic-blue to-aurora-green disabled:opacity-40 disabled:cursor-not-allowed text-white text-[10px] font-black uppercase tracking-widest border border-white/10 shadow-lg shadow-purple-500/10 hover:shadow-purple-500/20 btn-premium flex items-center justify-center gap-2 cursor-pointer font-sans-premium"
          >
            {isLoading ? (
              <Loader2 className="animate-spin" size={12} />
            ) : (
              "Sign Up & Analyze"
            )}
          </button>
        </form>

        {/* Separator */}
        <div className="flex items-center gap-3 my-0.5 font-sans-premium">
          <div className="h-[1px] flex-1 bg-white/10" />
          <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest font-sans-premium">or</span>
          <div className="h-[1px] flex-1 bg-white/10" />
        </div>

        {/* Google Signup */}
        <button
          onClick={handleGoogleSignUp}
          disabled={isLoading}
          className="w-full py-2.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/10 text-white text-[10px] font-black uppercase tracking-widest btn-premium flex items-center justify-center gap-2 cursor-pointer font-sans-premium"
        >
          <svg className="w-4 h-4 mr-0.5" viewBox="0 0 24 24">
            <path
              fill="#EA4335"
              d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-5.136 4.114-3.535 0-6.403-2.868-6.403-6.403s2.868-6.403 6.403-6.403c1.782 0 3.32.72 4.417 1.889l3.078-3.078C19.294 2.45 16.002 1.2 12.24 1.2 6.136 1.2 1.2 6.136 1.2 12.24s4.936 11.04 11.04 11.04c6.19 0 10.285-4.354 10.285-10.478 0-.648-.058-1.296-.172-1.92H12.24z"
            />
          </svg>
          Sign In with Google
        </button>

        {/* Footer Navigation */}
        <div className="text-center text-[10px] font-bold text-slate-400 font-sans-premium">
          Already have an account?{" "}
          <button
            onClick={() => onNavigate("login")}
            className="text-nebula-purple hover:text-cosmic-blue transition-colors uppercase tracking-wider font-black font-sans-premium cursor-pointer"
          >
            Sign In
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default SignupPage;
