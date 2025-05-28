import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from "react-redux";
import { setShouldAutoOpenHelper } from '../store/userSlice';

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
      dispatch(setShouldAutoOpenHelper(false)); // 한 번만 작동하도록 상태 초기화
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
                className="w-[130px] h-[130px]"
              />
            </button>
          </div>
      </div>
    )}
   {subTalking &&(
      <div className="fixed bottom-0 right-0 w-[500px] h-[700px] rounded-2xl p-1 z-[9999]">
        <AIChat onClose={setSubTalking} onfullTalk={setFullTalking} onMode={"sub"} setLevel={setPromptLevel} level={promptLevel}/>
      </div>
   )}
   {fullTalking &&(
      <div className="fixed top-0 left-0 flex justify-center w-screen h-screen backdrop-blur-sm rounded-2xl z-[9999]">
        <div className='h-full w-2/3 py-4'>
          <AIChat onClose={setSubTalking} onfullTalk={setFullTalking} onMode={"full"} setLevel={setPromptLevel} level={promptLevel}/>
        </div>
      </div>
   )}
    </>
  );
};

export default CodeHelper;
