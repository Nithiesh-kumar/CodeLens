/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        space: ['"Space Grotesk"', 'sans-serif'],
        inter: ['"Inter"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      colors: {
        dark: "#0f0f1a",
        'space-void': 'var(--space-void)',
        'space-deep': 'var(--space-deep)',
        'space-surface': 'var(--space-surface)',
        'space-elevated': 'var(--space-elevated)',
        'nebula-purple': 'var(--nebula-purple)',
        'nebula-violet': 'var(--nebula-violet)',
        'cosmic-blue': 'var(--cosmic-blue)',
        'aurora-green': 'var(--aurora-green)',
        'solar-gold': 'var(--solar-gold)',
        'pulsar-red': 'var(--pulsar-red)',
        'starlight': 'var(--starlight)',
        'stardust': 'var(--stardust)',
      },
    },
  },
  plugins: [],
}
