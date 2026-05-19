export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        background: '#05060D',
        surface: 'rgba(7, 12, 22, 0.86)',
        surfaceStrong: 'rgba(12, 18, 36, 0.92)',
        accent: '#ff6b00',
        accentSoft: '#ff8f42',
        telemetry: '#46b3ff',
        threat: '#ff4f6d'
      },
      boxShadow: {
        panel: '0 32px 90px rgba(0, 0, 0, 0.32)',
        glow: '0 0 70px rgba(255, 107, 0, 0.18)'
      },
      backgroundImage: {
        'hero-radial': 'radial-gradient(circle at top right, rgba(96, 165, 250, 0.18), transparent 28%), radial-gradient(circle at bottom left, rgba(255, 107, 0, 0.16), transparent 24%)'
      }
    }
  },
  plugins: []
};
