import React, { useState, useRef, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { Mail, Lock, Eye, EyeOff, Sparkles, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

// Beautiful Canvas Starfield Background
export const Starfield = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId;
    let stars = [];
    const numStars = 150;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const createStars = () => {
      stars = [];
      for (let i = 0; i < numStars; i++) {
        stars.push({
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          radius: Math.random() * 1.6 + 0.3,
          alpha: Math.random(),
          speed: Math.random() * 0.12 + 0.04,
          twinkleSpeed: Math.random() * 0.015 + 0.005,
          direction: Math.random() * Math.PI * 2
        });
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "rgba(8, 8, 16, 1)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      stars.forEach(star => {
        // Update twinkling
        star.alpha += star.twinkleSpeed;
        if (star.alpha > 1 || star.alpha < 0.15) {
          star.twinkleSpeed = -star.twinkleSpeed;
        }

        // Move star
        star.x += Math.cos(star.direction) * star.speed;
        star.y += Math.sin(star.direction) * star.speed;

        // Wrap edges
        if (star.x < 0) star.x = canvas.width;
        if (star.x > canvas.width) star.x = 0;
        if (star.y < 0) star.y = canvas.height;
        if (star.y > canvas.height) star.y = 0;

        // Render
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${star.alpha})`;
        ctx.shadowBlur = star.radius * 2.5;
        ctx.shadowColor = "#ffffff";
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(draw);
    };

    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();
    createStars();
    draw();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 w-full h-full pointer-events-none z-0 bg-[#06060c]" />;
};

const LoginPage = ({ onNavigate, triggerToast }) => {
  const { login, loginWithGoogle } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      if (triggerToast) triggerToast("Please enter all credentials.", "error");
      return;
    }

    setIsLoading(true);
    try {
      await login(email, password, rememberMe);
      if (triggerToast) triggerToast("Logged in successfully!");
    } catch (err) {
      console.error(err);
      let errorMsg = "Login failed. Please check your credentials.";
      if (err.message.includes("auth/invalid-credential") || err.message.includes("auth/user-not-found") || err.message.includes("auth/wrong-password")) {
        errorMsg = "Invalid email or password.";
      }
      if (triggerToast) triggerToast(errorMsg, "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
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
      {/* Moving Starfield Background */}
      <Starfield />

      {/* Glassmorphic Login Box */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, type: "spring" }}
        className="relative z-10 w-full max-w-md glass-card p-8 flex flex-col gap-6"
      >
        {/* Glow Header */}
        <div className="flex flex-col items-center gap-2 text-center">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-nebula-purple via-cosmic-blue to-aurora-green flex items-center justify-center shadow-lg shadow-purple-500/20">
            <Sparkles className="text-white" size={24} />
          </div>
          <h2 className="text-2xl font-black text-starlight font-sans-premium tracking-tight mt-2">
            Welcome back to Code<span className="text-aurora-green">Lens</span>
          </h2>
          <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest font-sans-premium">
            Enter your credentials to access analysis dashboard
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Email input */}
          <div className="flex flex-col gap-1.5 font-sans-premium">
            <label className="text-[9px] font-black uppercase text-slate-500 tracking-wider">Email Address</label>
            <div className="relative flex items-center">
              <Mail className="absolute left-3.5 text-slate-500" size={16} />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="developer@codelens.ai"
                className="w-full pl-11 pr-4 py-3 input-premium text-xs text-white placeholder-slate-600 focus:outline-none font-sans-premium"
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="flex flex-col gap-1.5 font-sans-premium">
            <div className="flex justify-between items-center">
              <label className="text-[9px] font-black uppercase text-slate-500 tracking-wider">Password</label>
              <button
                type="button"
                onClick={() => onNavigate("forgot")}
                className="text-[9px] font-black uppercase text-nebula-purple hover:text-cosmic-blue tracking-wider transition-colors font-sans-premium cursor-pointer"
              >
                Forgot Password?
              </button>
            </div>
            <div className="relative flex items-center">
              <Lock className="absolute left-3.5 text-slate-500" size={16} />
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-11 pr-11 py-3 input-premium text-xs text-white placeholder-slate-600 focus:outline-none font-sans-premium"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 text-slate-500 hover:text-white transition-colors cursor-pointer"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Persist Session Option */}
          <div className="flex items-center justify-between mt-1 font-sans-premium">
            <label className="flex items-center gap-2 cursor-pointer group">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-4 h-4 rounded border border-white/20 bg-white/[0.02] peer-checked:bg-nebula-purple peer-checked:border-nebula-purple transition-all flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-sm bg-white scale-0 peer-checked:scale-100 transition-transform" />
              </div>
              <span className="text-[10px] text-slate-400 group-hover:text-slate-300 font-bold uppercase tracking-wider transition-colors font-sans-premium">
                Remember Me
              </span>
            </label>
          </div>

          {/* Sign In Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 py-3 rounded-xl bg-gradient-to-r from-nebula-purple via-cosmic-blue to-aurora-green text-white text-[10px] font-black uppercase tracking-widest border border-white/10 shadow-lg shadow-purple-500/10 hover:shadow-purple-500/20 btn-premium flex items-center justify-center gap-2 cursor-pointer font-sans-premium"
          >
            {isLoading ? (
              <Loader2 className="animate-spin" size={14} />
            ) : (
              "Sign In to Dashboard"
            )}
          </button>
        </form>

        {/* Separator */}
        <div className="flex items-center gap-3 my-1 font-sans-premium">
          <div className="h-[1px] flex-1 bg-white/10" />
          <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest font-sans-premium">or continue with</span>
          <div className="h-[1px] flex-1 bg-white/10" />
        </div>

        {/* Google Sign In */}
        <button
          onClick={handleGoogleSignIn}
          disabled={isLoading}
          className="w-full py-3 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/10 text-white text-[10px] font-black uppercase tracking-widest btn-premium flex items-center justify-center gap-2 cursor-pointer font-sans-premium"
        >
          {/* Custom SVG Google Icon */}
          <svg className="w-4 h-4 mr-0.5" viewBox="0 0 24 24">
            <path
              fill="#EA4335"
              d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-5.136 4.114-3.535 0-6.403-2.868-6.403-6.403s2.868-6.403 6.403-6.403c1.782 0 3.32.72 4.417 1.889l3.078-3.078C19.294 2.45 16.002 1.2 12.24 1.2 6.136 1.2 1.2 6.136 1.2 12.24s4.936 11.04 11.04 11.04c6.19 0 10.285-4.354 10.285-10.478 0-.648-.058-1.296-.172-1.92H12.24z"
            />
          </svg>
          Sign In with Google
        </button>

        {/* Footer info */}
        <div className="text-center text-[10px] font-bold text-slate-400 mt-2 font-sans-premium">
          New to CodeLens?{" "}
          <button
            onClick={() => onNavigate("signup")}
            className="text-nebula-purple hover:text-cosmic-blue transition-colors uppercase tracking-wider font-black font-sans-premium cursor-pointer"
          >
            Create Account
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
