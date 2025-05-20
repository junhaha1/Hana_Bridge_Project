import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from "react-redux";

import Lottie from "lottie-react";
import CodeBot from '../../public/animations/codeBot.json';

import { clearPostAssembleId } from '../store/userSlice';
import { helperFrame } from '../style/CommonFrame';
import AIChat from './AIchat/AIChat';

const CodeHelper = () => {
  const navigate = useNavigate(); 
  const dispatch = useDispatch();
  const lottieRef = useRef();
  const [isHovered, setIsHovered] = useState(false);
  //확장 플래그
  const [subTalking, setSubTalking] = useState(false);

  //full 화면 플래그
  const [fullTalking, setFullTalking] = useState(false);

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
    <>
    {!subTalking && !fullTalking &&(
      <div className={helperFrame}>
        {/* 메시지 카드 */}
          <div className="relative w-fit h-fit overflow-visible">
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
            <div className="flex flex-col items-center justify-center">
              <span className='text-lg font-semibold '>AI Codi</span>
              <span>에러나 코드에 대해 대화해보세요!</span>
            </div>

            {/* 꼬리 삼각형 */}
            <div className="absolute top-1/2 right-[-6px] -translate-y-1/2 w-0 h-0 
                            border-y-[6px] border-y-transparent border-l-[6px] border-l-white shadow-md" />
            </div>

            <button 
              className="bg-none border-none cursor-pointer p-0 inline-block leading-none relative z-10 overflow-hidden" 
              onClick={() => setSubTalking(true)}
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
    )}
   {subTalking &&(
      <div className="fixed bottom-0 right-0 w-[500px] h-[600px] rounded-2xl bg-white/15 z-[9999]">
        <AIChat onClose={setSubTalking}/>
      </div>
   )}
    </>
  );
};

export default CodeHelper;
