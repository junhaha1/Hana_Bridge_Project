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
        'md-md' : {'max': '1200px'}, //1200px 이하 (컴퓨터 반 이하 적용X)
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
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '20%, 60%': { transform: 'translateX(-6px)' },
          '40%, 80%': { transform: 'translateX(6px)' },
        },
      },
      animation: {
        shake: 'shake 0.5s ease-in-out',
      },
    },
  },
  plugins: [
    require('@tailwindcss/line-clamp'),
  ],
}