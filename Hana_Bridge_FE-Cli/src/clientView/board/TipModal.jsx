import { IoClose } from "react-icons/io5";
import { settingDiv, upDiv } from "../../style/AIChatStyle";
import { useState } from "react";
import { scrollStyle } from "../../style/CommonStyle";
import { useSelector } from "react-redux";
import Tip1 from "../../images/tip1.png";
import Tip2 from "../../images/tip2.png";
import Tip3 from "../../images/tip3.png";


/*프롬포트 설정창 */
const TipModal = ({onClose}) => {
  return (
    <div className={upDiv}>
      <div className={`${settingDiv} ${scrollStyle} p-2`}>
        <div className="w-full pt-2 pl-[6px] flex align-center justify-between items-center">
          <h2 className="text-xl font-semibold">에디터 사용 설명서</h2>
          <button 
            className='p-1 mb-2 text-sm text-white rounded-full bg-zinc-500 shadow-md'
            onClick={()=>{
              onClose();
            }}
          >
            <IoClose/>
          </button>
        </div>
        <div className='flex flex-col gap-2 p-2'>
          <p className="mb-2 text-sm"><span className="text-yellow-400 font-semibold">Tip</span>  
          <span className="font-semibold">마크다운이란?</span>
            <br />마크다운(Markdown)은 간단한 문법으로 텍스트에 서식을 적용할 수 있는 경량 마크업 언어입니다.
          </p>
          
          <div>
            <p className="text-base mb-1">마크다운 작성화면</p>
            <img src={Tip1} alt="설명1" />
          </div>
          <div>
            <p className="text-base mb-1">마크다운 작성화면과 미리보기 화면</p>
            <img src={Tip2} alt="설명2" />
          </div>
          <div>
            <p className="text-base mb-1">미리보기 화면</p>
            <img src={Tip3} alt="설명3" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default  TipModal;