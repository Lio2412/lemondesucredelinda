module.exports = {
  plugins: {
    'tailwindcss': {},
    'autoprefixer': {},
    // 'postcss-preset-env' peut souvent être omis avec les versions récentes de Next/Tailwind
    // Si des problèmes surviennent, il pourra être réactivé.
    // 'postcss-preset-env': {
    //   features: { 'nesting-rules': false }
    // }
  }
}