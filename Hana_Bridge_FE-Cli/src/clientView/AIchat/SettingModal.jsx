import { IoClose } from "react-icons/io5";
import { promptButton, settingDiv, upDiv } from "../../style/AIChatStyle";
import { useState } from "react";
import AddPrompt from "./AddPrompt";
import UpdatePrompt from "./UpdatePrompt";
import { scrollStyle } from "../../style/CommonStyle";
import { useSelector } from "react-redux";

/*프롬포트 설정창 */
const SettingModal = ({onClose}) => {
  const [isAddPrompt, setIsAddPrompt] = useState(false);
  const [isUpdatePrompt, setIsUpdatePrompt] = useState(false);
  const userPromptList = useSelector((state) => state.aiChat.userPromptList);

  return (
    <div className={upDiv}>
      <div className={`${settingDiv} ${scrollStyle} p-2`}>
        <div className="w-full pt-2 pl-[6px] flex align-center justify-between items-center">
          <h2 className="text-xl font-semibold">AI 사용자 프롬프트 설정</h2>
          <button 
            className='p-1 text-sm text-white rounded-full bg-zinc-500 shadow-md'
            onClick={()=>{
              setIsAddPrompt(false);
              setIsUpdatePrompt(false);
              onClose();
            }}
          >
            <IoClose/>
          </button>
        </div>
        <div className='flex flex-col gap-2 p-2'>
          {!isAddPrompt && !isUpdatePrompt &&(
            <>
            <p className="mb-3 text-sm"><span className="text-yellow-400 font-semibold">Tip  </span>프롬프트란? <br />AI에게 명확한 지시를 내리는 입력값으로 좋은 답변을 받는데 기여할 수 있습니다.  </p>
            <div 
              className={`${promptButton} w-full`}
              onClick={() => setIsAddPrompt(true)}
            >
              <p className='text-lg font-semibold'>새 사용자 프롬포트 추가</p>
              <p className='text-sm'>사용자가 직접 프롬포트를 입력하여 추가합니다.</p>
            </div>
            <div 
              className={`${promptButton} w-full ${userPromptList.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
              onClick={() => {
                if (userPromptList.length !== 0) {
                    setIsUpdatePrompt(true);
                  }
                }
              }
            >
              <p className='text-lg font-semibold'>기존 사용자 프롬포트 조회·수정·삭제</p>
              <p className='text-sm'>기존에 저장한 사용자 프롬포트를 조회·수정·삭제합니다.</p>
            </div>
            </>
          )}
          {/* 프롬포트 추가 */}
          {isAddPrompt && <AddPrompt onClose={() => setIsAddPrompt(false)} />}
          {isUpdatePrompt && <UpdatePrompt onClose={() => setIsUpdatePrompt(false)} />}
        </div>
      </div>
    </div>
  );
}

export default  SettingModal;