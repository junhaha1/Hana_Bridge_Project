import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from "react-redux";
import { setShouldAutoOpenHelper } from '../store/userSlice';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';

import Lottie from "lottie-react";
import CodeBot from '../animations/codebot.json';

// import { clearPostAssembleId } from '../store/userSlice';
import { helperFrame } from '../style/CommonFrame';
import AIChat from './AIchat/AIChat';

const CodeHelper = () => {
  const navigate = useNavigate(); 
  const dispatch = useDispatch();

  //홈 화면에서 AIChat 열기 
  const shouldAutoOpenHelper = useSelector((state) => state.user.shouldAutoOpenHelper);
  console.log("shouldAutoOpenHelper: " + shouldAutoOpenHelper);

  const lottieRef = useRef();
  const [isHovered, setIsHovered] = useState(false);
  //확장 플래그
  const [subTalking, setSubTalking] = useState(false);

  //full 화면 플래그
  const [fullTalking, setFullTalking] = useState(false);

  const postLoading = useSelector((state) => state.user.postLoading);
  // const postAssembleId = useSelector((state) => state.user.postAssembleId);

  const [showCompleteMessage, setShowCompleteMessage] = useState(false);
  const [promptLevel, setPromptLevel] = useState(0);


  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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

  //홈 화면에서 aichat 실행
  useEffect(() => {
    if (shouldAutoOpenHelper) {
      setFullTalking(true);
      dispatch(setShouldAutoOpenHelper({shouldAutoOpenHelper: false})); // 한 번만 작동하도록 상태 초기화
    }
  }, [shouldAutoOpenHelper, dispatch]);

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
                w-[230px] px-3 py-2 rounded-2xl bg-white/80 backdrop-blur-sm
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
              className="cursor-pointer" 
              onClick={() => {
                setSubTalking(true);
                setIsHovered(false);
              }}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <Lottie 
                lottieRef={lottieRef}
                animationData={CodeBot}
                loop={true}
                autoplay={false}
                className="w-[130px] h-[130px] max-md:w-[70px] max-md:h-[70px]"
              />
            </button>
          </div>
      </div>
    )}
    <LayoutGroup>
      <AnimatePresence mode="wait">
         {(subTalking || fullTalking) && (
          <motion.div
            key="chatBox"
            initial={{
              width: isMobile ? "100%" : subTalking ? 500 : "50vw",
              height: isMobile ? "100%" : subTalking ? 700 : "100vh",
            }}
            animate={{
              width: isMobile ? "100%" : fullTalking ? "50vw" : 500,
              height: isMobile ? "100%" : fullTalking ? "100vh" : 700,
            }}
            exit={{
              opacity: 0,
              scale: 0.95,
              transition: { duration: 0.2 },
            }}
            transition={{
              duration: 0.5,
              ease: "easeInOut",
            }}
            style={{
              width: window.innerWidth <= 768 ? "100%" : fullTalking ? "50vw" : "500px",
              height: window.innerWidth <= 768 ? "100%" : fullTalking ? "100vh" : "700px",
            }}
            className="fixed bottom-0 right-0 z-[8000] overflow-hidden
              md:border-2 md:border-white/50 md:rounded-2xl bg-black
              max-md:w-full max-md:h-full"
          >
            <div className="w-full h-full overflow-y-auto">
              <AIChat
                onClose={setSubTalking}
                onfullTalk={setFullTalking}
                onMode={fullTalking ? "full" : "sub"}
                setLevel={setPromptLevel}
                level={promptLevel}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </LayoutGroup>
    </>
  );
};

export default CodeHelper;
