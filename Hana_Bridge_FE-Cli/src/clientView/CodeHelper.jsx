import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from "react-redux";

import Lottie from "lottie-react";
import CodeBot from '../../public/animations/codeBot.json';

import { clearPostAssembleId } from '../store/userSlice';

const CodeHelper = () => {
  const navigate = useNavigate(); 
  const dispatch = useDispatch();
  const lottieRef = useRef();
  const [isHovered, setIsHovered] = useState(false);

  const postLoading = useSelector((state) => state.user.postLoading);
  const postAssembleId = useSelector((state) => state.user.postAssembleId);

  const [showCompleteMessage, setShowCompleteMessage] = useState(false);
  const [countdown, setCountdown] = useState(3);

  const handleMouseEnter = () => {
    setIsHovered(true);
    lottieRef.current?.play();
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (!postLoading && !showCompleteMessage) {
      lottieRef.current?.stop();
    }
  };

  const handleMovePosting = () => {
    dispatch(clearPostAssembleId());
    navigate(`/detailAssemble/${postAssembleId}`);
  }

  useEffect(() => {
    if (!postLoading && postAssembleId !== '') {
      setShowCompleteMessage(true);
      setCountdown(5); // 3초로 초기화

      const timer = setTimeout(() => {
        setShowCompleteMessage(false);
        dispatch(clearPostAssembleId());
      }, 5000);

      const countdownInterval = setInterval(() => {
        setCountdown(prev => prev - 1);
      }, 1000);

      return () => {
        clearTimeout(timer);
        clearInterval(countdownInterval);
      };
    }
  }, [postLoading, postAssembleId]);

  useEffect(() => {
    if (postLoading || showCompleteMessage) {
      lottieRef.current?.play();
    } else {
      lottieRef.current?.stop();
    }
  }, [postLoading, showCompleteMessage]);

  return (
    <div className="fixed bottom-0 right-5 z-[9999]">
      <div className="relative w-fit h-fit overflow-visible">
        {/* 게시글 포스팅 중 메세지*/}
        {postLoading && (
            <div
              className={`
                absolute bottom-1/2 right-[140px] translate-y-1/2
                w-[220px] px-4 py-3 rounded-2xl bg-white/80 backdrop-blur-sm
                text-[13px] font-semibold text-gray-900 text-center
                shadow-xl border border-gray-200
                transition-all duration-700 ease-in-out
                opacity-100
                z-0
              `}
            >
              <div className="flex items-center justify-center gap-1">
                ✨<span className="text-indigo-600">현재 게시글이 포스팅되는 중입니다...</span>
              </div>

              {/* 꼬리 삼각형 */}
              <div className="absolute top-1/2 right-[-6px] -translate-y-1/2 w-0 h-0 
                              border-y-[6px] border-y-transparent border-l-[6px] border-l-white shadow-md" />
            </div>
        )}
        {showCompleteMessage && (
          <>
          <div
            className={`
              absolute bottom-1/2 right-[140px] translate-y-1/2
              w-[170px] px-4 py-3 rounded-2xl bg-white/90 backdrop-blur-sm
              text-[13px] font-semibold text-green-800 text-center
              shadow-xl border border-green-400
              transition-all duration-700 ease-in-out
              opacity-100
              z-0
            `}
          >
            🎉 게시 완료!
            <button
              onClick={handleMovePosting}
              className="mt-2 text-[12px] text-blue-600 hover:text-blue-800 transition"
            >
              해당 게시글 보기 → <span className="ml-1 text-gray-500">({countdown}초)</span>
            </button>
            <div className="absolute top-1/2 right-[-6px] -translate-y-1/2 w-0 h-0 
                            border-y-[6px] border-y-transparent border-l-[6px] border-l-white shadow-md" />
          </div>
          </>
        )}
        {/* 메시지 카드 */}
        {!postLoading && !showCompleteMessage &&(
          <>
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
          </>
        )}
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
