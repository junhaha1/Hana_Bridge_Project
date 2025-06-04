import { useState } from "react";
import { cancelButton, okButton } from "../../style/AIChatStyle";
import ApiClient from "../../service/ApiClient";
import { useDispatch } from "react-redux";
import { setUserPromptList } from "../../store/aiChatSlice";

/*프롬포트 추가창 */
const AddPrompt = ({onClose}) => {
  const dispatch = useDispatch();
  const [addPrompt, setAddPrompt] = useState({
    name: '',
    role: '',
    form: '',
    level: '',
    option: ''
  });

  //입력한 컴포넌트 추가하기
  const savePrompt = async () => {
    try {
      console.log(addPrompt);

      const res = await ApiClient.saveCustomPrompts(addPrompt);
      if (!res.ok) throw new Error(`서버 오류: ${res.status}`);
      
      console.log("저장 완료");

      // 초기화
      setAddPrompt({ 
        name: '',
        role: '',
        form: '',
        level: '',
        option: ''
      });

      alert("프롬포트가 추가되었습니다!");

      // 목록 다시 불러오기
      const listRes = await ApiClient.getCustomPrompts();
      if (!listRes.ok) throw new Error(`서버 오류: ${listRes.status}`);

      const data = await listRes.json();
      console.log(data);
      dispatch(setUserPromptList({ userPromptList: data }));

    } catch (err) {
      console.error("API 요청 실패:", err);
    }
  };

  return (
    <>
    <p className='font-semibold mb-0'>내 프롬포트 이름<span className="text-red-500">*</span></p>
    <p className="mb-0 text-sm"><span className="text-orange-500 font-semibold">예시: </span> 파이썬 전용 도우미</p>
    <input
      className={`w-full mb-3 p-2 rounded bg-transparent border border-white/30 placeholder-white/50`}
      placeholder="AI의 역할을 정해주세요."
      value={addPrompt.name}
      onChange={(e) => setAddPrompt({ ...addPrompt, name: e.target.value })}
    />
    
    <p className='font-semibold mb-0'>AI의 역할<span className="text-red-500">*</span></p>
    <p className="mb-0 text-sm"><span className="text-orange-500 font-semibold">예시: </span> 너는 친절한 프로그래밍 도우미야.</p>
    <textarea
      className={`w-full mb-3 p-2 rounded bg-transparent border border-white/30 placeholder-white/50`}
      placeholder="AI의 역할을 정해주세요."
      value={addPrompt.role}
      onChange={(e) => setAddPrompt({ ...addPrompt, role: e.target.value })}
    />
    

    <p className='font-semibold mb-0'>AI의 답변 형식<span className="text-red-500">*</span></p>
    <p className="mb-0 text-sm"><span className="text-orange-500 font-semibold">예시: </span> 요약해서 설명해줘.</p>
    <textarea
      className={`w-full mb-3 p-2 rounded bg-transparent border border-white/30 placeholder-white/50`}
      placeholder="AI의 답변 형식을 정해주세요."
      value={addPrompt.form}
      onChange={(e) => setAddPrompt({ ...addPrompt, form: e.target.value })}
    />
    

    <p className='font-semibold mb-0'>AI의 답변 수준<span className="text-red-500">*</span></p>
      <p className="mb-0 text-sm"><span className="text-orange-500 font-semibold">예시: </span> 전문가라고 생각하고 설명해줘. </p>   
    <textarea
      className={`w-full mb-3 p-2 rounded bg-transparent border border-white/30 placeholder-white/50`}
      placeholder="AI의 답변 수준을 정해주세요."
      value={addPrompt.level}
      onChange={(e) => setAddPrompt({ ...addPrompt, level: e.target.value })}
    />   

    <p className='font-semibold mb-0'>추가 설정</p>
      <p className="mb-0 text-sm"><span className="text-orange-500 font-semibold">예시: </span> 마크다운 형식으로 줘. 친근한 친구같은 반말로 해줘 </p>   
    <textarea
      className={`w-full mb-3 p-2 rounded bg-transparent border border-white/30 placeholder-white/50`}
      placeholder="AI의 답변 수준을 정해주세요."
      value={addPrompt.option}
      onChange={(e) => setAddPrompt({ ...addPrompt, option: e.target.value })}
    /> 
    <div className="flex justify-end gap-2">
      <button  className = {okButton} onClick={() => {
        if(addPrompt.name.trim() !== "")
          savePrompt();
        else
          alert("프롬포트 내용을 입력해주십시오.");
      }}>프롬포트 추가</button>
      <button className = {cancelButton} onClick={() => onClose()}>취소</button>
    </div>          
    </>
  );
}

export default AddPrompt;