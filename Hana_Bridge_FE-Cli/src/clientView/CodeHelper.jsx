import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Lottie from "lottie-react";
import CodeBot from '../../public/animations/codeBot.json';

const CodeHelper = () => {
  const navigate = useNavigate(); 
  const lottieRef = useRef();
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
    lottieRef.current?.play();
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    lottieRef.current?.stop();
  };

  return (
    <div className="fixed bottom-0 right-5 z-[9999]">
      <div className="relative w-fit h-fit overflow-visible">
        {/* 메시지 카드 */}
        <div
          className={`
            absolute bottom-1/2 right-0 translate-y-1/2
            w-[170px] px-4 py-3 rounded-2xl bg-white/80 backdrop-blur-sm
            text-[13px] font-semibold text-gray-900 text-center
            shadow-xl border border-gray-200
            transition-all duration-700 ease-in-out
            ${isHovered ? 'opacity-100 translate-x-[-80%]' : 'opacity-0 translate-x-0'}
            z-0
          `}
        >
          <div className="flex items-center justify-center gap-1">
            ✨<span className="text-indigo-600">AI Code Helper</span>
          </div>

          {/* 꼬리 삼각형 */}
          <div className="absolute top-1/2 right-[-6px] -translate-y-1/2 w-0 h-0 
                          border-y-[6px] border-y-transparent border-l-[6px] border-l-white shadow-md" />
        </div>

        {/* Lottie 버튼 */}
        <button 
          className="bg-none border-none cursor-pointer p-0 inline-block leading-none relative z-10 overflow-hidden" 
          onClick={() => navigate(`/aiChat`)}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <Lottie 
            lottieRef={lottieRef}
            animationData={CodeBot}
            loop={true}
            autoplay={false}
            className="w-[160px] h-[160px]"
          />
        </button>
      </div>
    </div>
  );
};

export default CodeHelper;
