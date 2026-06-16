import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, User, Mail, Plus, ChevronRight } from "lucide-react";

const mockAccounts = [
  {
    displayName: "Demo Developer",
    email: "demo.developer@gmail.com",
    photoURL: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150"
  },
  {
    displayName: "Lead Architect",
    email: "architect.codelens@gmail.com",
    photoURL: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=150&h=150"
  },
  {
    displayName: "Security Specialist",
    email: "security.expert@gmail.com",
    photoURL: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150"
  }
];

const MockGoogleAccountModal = ({ onSelect, onClose }) => {
  const [showCustomForm, setShowCustomForm] = useState(false);
  const [customName, setCustomName] = useState("");
  const [customEmail, setCustomEmail] = useState("");

  const handleCustomSubmit = (e) => {
    e.preventDefault();
    if (!customName.trim() || !customEmail.trim()) return;
    
    onSelect({
      displayName: customName,
      email: customEmail,
      photoURL: null
    });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Dark overlay with heavy backdrop blur */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/75 backdrop-blur-[16px] pointer-events-auto"
      />

      {/* Account Selection Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ type: "spring", duration: 0.5 }}
        className="relative z-10 w-full max-w-md glass-card p-6 flex flex-col gap-5 border border-white/10 font-sans-premium"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-500 hover:text-white bg-white/5 hover:bg-white/10 border border-white/5 transition-all cursor-pointer"
        >
          <X size={14} />
        </button>

        {/* Google Header */}
        <div className="flex flex-col items-center gap-2 text-center mt-2 border-b border-white/5 pb-4">
          <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-lg shadow-white/5 shrink-0">
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#EA4335"
                d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-5.136 4.114-3.535 0-6.403-2.868-6.403-6.403s2.868-6.403 6.403-6.403c1.782 0 3.32.72 4.417 1.889l3.078-3.078C19.294 2.45 16.002 1.2 12.24 1.2 6.136 1.2 1.2 6.136 1.2 12.24s4.936 11.04 11.04 11.04c6.19 0 10.285-4.354 10.285-10.478 0-.648-.058-1.296-.172-1.92H12.24z"
              />
            </svg>
          </div>
          <h2 className="text-lg font-black text-starlight tracking-tight mt-1">
            Choose an account
          </h2>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
            to continue to CodeLens
          </p>
        </div>

        {/* Account Selector List */}
        {!showCustomForm ? (
          <div className="flex flex-col gap-2.5">
            {mockAccounts.map((account) => (
              <button
                key={account.email}
                onClick={() => onSelect(account)}
                className="w-full p-3 rounded-xl bg-white/[0.02] hover:bg-white/[0.06] border border-white/5 hover:border-white/10 text-left transition-all duration-200 flex items-center gap-3 cursor-pointer group"
              >
                {/* Avatar */}
                <div className="relative w-8 h-8 rounded-full overflow-hidden flex items-center justify-center bg-space-deep border border-white/10 shrink-0">
                  {account.photoURL ? (
                    <img src={account.photoURL} alt={account.displayName} className="w-full h-full object-cover" loading="lazy" />
                  ) : (
                    <span className="text-[10px] font-bold text-starlight">
                      {account.displayName.split(" ").map(n => n[0]).join("")}
                    </span>
                  )}
                </div>

                {/* Name / Email */}
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-black text-starlight truncate">{account.displayName}</p>
                  <p className="text-[10px] text-slate-400 truncate">{account.email}</p>
                </div>

                <ChevronRight size={14} className="text-slate-600 group-hover:translate-x-0.5 transition-transform" />
              </button>
            ))}

            {/* Custom Account Toggle Button */}
            <button
              onClick={() => setShowCustomForm(true)}
              className="w-full p-3 rounded-xl bg-white/[0.01] hover:bg-white/[0.04] border border-dashed border-white/10 hover:border-white/20 text-left transition-all duration-200 flex items-center gap-3 cursor-pointer text-slate-400 hover:text-starlight group"
            >
              <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                <Plus size={14} className="text-slate-400 group-hover:rotate-90 transition-transform" />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider">Use another account</span>
            </button>
          </div>
        ) : (
          /* Custom Account Form */
          <form onSubmit={handleCustomSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[9px] font-black uppercase text-slate-500 tracking-wider">Display Name</label>
              <div className="relative flex items-center">
                <User className="absolute left-3.5 text-slate-500" size={14} />
                <input
                  type="text"
                  required
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full pl-10 pr-4 py-2.5 input-premium text-xs text-white placeholder-slate-600 focus:outline-none"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[9px] font-black uppercase text-slate-500 tracking-wider">Email Address</label>
              <div className="relative flex items-center">
                <Mail className="absolute left-3.5 text-slate-500" size={14} />
                <input
                  type="email"
                  required
                  value={customEmail}
                  onChange={(e) => setCustomEmail(e.target.value)}
                  placeholder="john.doe@gmail.com"
                  className="w-full pl-10 pr-4 py-2.5 input-premium text-xs text-white placeholder-slate-600 focus:outline-none"
                />
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-3.5 mt-2">
              <button
                type="button"
                onClick={() => setShowCustomForm(false)}
                className="flex-1 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer"
              >
                Back
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-nebula-purple via-cosmic-blue to-aurora-green text-white text-[10px] font-black uppercase tracking-widest border border-white/10 shadow-lg shadow-purple-500/10 btn-premium transition-all cursor-pointer"
              >
                Sign In
              </button>
            </div>
          </form>
        )}
      </motion.div>
    </div>
  );
};

export default MockGoogleAccountModal;
