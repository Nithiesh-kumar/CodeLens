import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import CustomCursor from "./CustomCursor";
import DeepSpaceBackground from "./DeepSpaceBackground";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center bg-space-void text-starlight overflow-hidden p-6 select-none">
      <CustomCursor />
      <DeepSpaceBackground />

      <div className="relative z-10 flex flex-col items-center text-center max-w-md gap-6">
        {/* Floating Astronaut SVG */}
        <motion.div
          animate={{
            y: [-12, 12, -12],
            rotate: [0, 5, -5, 0]
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="w-40 h-40 drop-shadow-[0_0_24px_rgba(72,202,228,0.4)]"
        >
          <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            {/* Astronaut Helmet */}
            <circle cx="100" cy="85" r="40" fill="rgba(255,255,255,0.08)" stroke="white" strokeWidth="3" />
            {/* Visor */}
            <path d="M72 80C72 70 82 62 100 62C118 62 128 70 128 80C128 88 116 95 100 95C84 95 72 88 72 80Z" fill="url(#visorGrad)" stroke="#48CAE4" strokeWidth="2" />
            <path d="M80 75C80 72 88 68 100 68C112 68 120 72 120 75" stroke="white" strokeWidth="1.5" opacity="0.6" />
            {/* Suit Body */}
            <path d="M60 140C60 120 75 110 100 110C125 110 140 120 140 140V165H60V140Z" fill="rgba(255,255,255,0.06)" stroke="white" strokeWidth="3" />
            {/* Control Panel on chest */}
            <rect x="85" y="120" width="30" height="20" rx="3" fill="#02020A" stroke="#9D4EDD" strokeWidth="2" />
            <circle cx="92" cy="130" r="2" fill="#FF5555" />
            <circle cx="100" cy="130" r="2" fill="#06D6A0" />
            <circle cx="108" cy="130" r="2" fill="#48CAE4" />
            {/* Connection Tube */}
            <path d="M100 150C100 170 120 185 140 185C160 185 170 170 170 150" stroke="#9D4EDD" strokeWidth="3" strokeDasharray="6,4" />
            {/* Gradients */}
            <defs>
              <linearGradient id="visorGrad" x1="100" y1="62" x2="100" y2="95" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#0B0914" />
                <stop offset="60%" stopColor="#241442" />
                <stop offset="100%" stopColor="#9D4EDD" />
              </linearGradient>
            </defs>
          </svg>
        </motion.div>

        {/* 404 Large Gradient Text */}
        <h1 className="text-8xl font-[900] tracking-tighter leading-none bg-gradient-to-br from-nebula-purple via-cosmic-blue to-aurora-green bg-clip-text text-transparent drop-shadow-[0_0_40px_rgba(157,78,221,0.25)]">
          404
        </h1>

        {/* Message */}
        <div className="flex flex-col gap-2 font-sans-premium">
          <p className="text-lg font-bold text-starlight">This page drifted into deep space</p>
          <p className="text-xs text-slate-400 max-w-xs leading-relaxed uppercase tracking-wider font-semibold">
            The coordinates you requested do not exist in the CodeLens galaxy.
          </p>
        </div>

        {/* Action Button */}
        <button
          onClick={() => navigate("/")}
          className="mt-4 px-8 py-3 rounded-xl bg-gradient-to-r from-nebula-purple via-cosmic-blue to-aurora-green text-white text-[10px] font-black uppercase tracking-widest border border-white/10 shadow-lg shadow-purple-500/10 hover:shadow-purple-500/20 btn-premium flex items-center justify-center gap-2 cursor-pointer font-sans-premium"
        >
          Return to CodeLens
        </button>
      </div>
    </div>
  );
};

export default NotFound;
