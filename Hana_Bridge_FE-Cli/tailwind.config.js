/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // React에서 사용되는 모든 경로 포함
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Pretendard Variable', 'Pretendard', 'sans-serif'], //폰트 적용
      },
      screens: {
        'max-md': {'max': '767px'},  // 767px 이하 (모바일 기준)
      },
      animation: {
        'modal-fade': 'fadeInScale 0.3s ease-out forwards',
      },
      keyframes: {
        fadeInScale: {
          '0%': {
            opacity: '0',
            transform: 'scale(0.95)',
          },
          '100%': {
            opacity: '1',
            transform: 'scale(1)',
          },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/line-clamp'),
  ],
}