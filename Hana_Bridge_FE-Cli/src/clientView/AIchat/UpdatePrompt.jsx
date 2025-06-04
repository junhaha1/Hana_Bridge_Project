import { useState } from "react";
import { cancelButton, okButton } from "../../style/AIChatStyle";
import { useDispatch, useSelector } from "react-redux";
import ApiClient from "../../service/ApiClient";
import { setUserPromptList } from "../../store/aiChatSlice";

/*프롬포트 갱신, 삭제창 */
const UpdatePrompt = ({onClose}) => {
  const dispatch = useDispatch();
  const userPromptList = useSelector((state)=> state.aiChat.userPromptList);
  const [tempPrompt, setTempPrompt] = useState({
    promptId: '',
    name: '',
    role: '',
    form: '',
    level: '',
    option: ''
  });
  const [targetPrompt, setTargetPrompt] = useState({
    promptId: '',
    name: '',
    role: '',
    form: '',
    level: '',
    option: ''
  });

  const [isEdit, setIsEdit] = useState(false);

  const updatePrompt = async () => {
    try {
      const res = await ApiClient.updateCustomPrompts(tempPrompt);

      if (!res.ok) throw new Error(`서버 오류: ${res.status}`);
        
      console.log("업데이트 완료");
      const data = await res.json();
      setTargetPrompt(data);
      setTempPrompt(data);

      // 목록 다시 불러오기
      const listRes = await ApiClient.getCustomPrompts();
      if (!listRes.ok) throw new Error(`서버 오류: ${listRes.status}`);

      const listdata = await listRes.json();
      console.log(listdata);
      dispatch(setUserPromptList({ userPromptList: listdata }));
      setIsEdit(false);

    } catch (err) {
      console.error("API 요청 실패:", err);
    }
  }

  const deletePrompt = async () => {
    try {
      const res = await ApiClient.deleteCustomPrompts(targetPrompt.promptId);

      if (!res.ok) throw new Error(`서버 오류: ${res.status}`);
        
      // 목록 다시 불러오기
      const listRes = await ApiClient.getCustomPrompts();
      if (!listRes.ok) throw new Error(`서버 오류: ${listRes.status}`);

      const listdata = await listRes.json();
      console.log(listdata);
      dispatch(setUserPromptList({ userPromptList: listdata }));
      setTargetPrompt({
        promptId: '',
        name: '',
        role: '',
        form: '',
        level: '',
        option: ''
      });
      setTempPrompt({
        promptId: '',
        name: '',
        role: '',
        form: '',
        level: '',
        option: ''
      });

      if(listdata.length === 0) //전부 다 지워버렸을 경우 해당 편집창 닫아버리기
        onClose();
    } catch (err) {
      console.error("API 요청 실패:", err);
    }
  }

  return (
    <>
      <div>
        <select
          className="w-full p-2 rounded text-base text-black"
          onChange={(e) => {
            console.log("프롬포트 설정: " +  e.target.value);
            const selected = userPromptList.find(
              (p) => String(p.promptId) === e.target.value
            );
            console.log(selected);
            setTargetPrompt(selected);
            setTempPrompt(selected);
            setIsEdit(false);
          }}
          value={targetPrompt?.promptId ?? ""}
        >
          <option value="" selected disabled hidden>
            선택해주세요
          </option>
          {userPromptList.map((prom) => (
            <option
              className="text-black"
              value={prom.promptId}
              key={prom.promptId}
            >
              {prom.name}
            </option>
          ))}
        </select>
      </div>
      {targetPrompt.promptId !== '' && (
        <>
          <p className='font-semibold mb-0'>내 프롬포트 이름</p>
          <p className="mb-0 text-sm"><span className="text-orange-500 font-semibold">예시: </span> 파이썬 전용 도우미</p>
          <input
            readOnly={!isEdit}
            className={`w-full mb-3 p-2 rounded bg-transparent border border-white/30 placeholder-white/50 ${!isEdit ? 'opacity-80' : ''}`}
            placeholder="AI의 역할을 정해주세요."
            value={tempPrompt.name}
            onChange={(e) => setTempPrompt({ ...tempPrompt, name: e.target.value })}
          />
          
          <p className='font-semibold mb-0'>AI의 역할</p>
          <p className="mb-0 text-sm"><span className="text-orange-500 font-semibold">예시: </span> 너는 친절한 프로그래밍 도우미야.</p>
          <textarea
            readOnly={!isEdit}
            className={`w-full mb-3 p-2 rounded bg-transparent border border-white/30 placeholder-white/50  ${!isEdit ? 'opacity-80' : ''}`}
            placeholder="AI의 역할을 정해주세요."
            value={tempPrompt.role}
            onChange={(e) => setTempPrompt({ ...tempPrompt, role: e.target.value })}
          />
          

          <p className='font-semibold mb-0'>AI의 답변 형식</p>
          <p className="mb-0 text-sm"><span className="text-orange-500 font-semibold">예시: </span> 요약해서 설명해줘.</p>
          <textarea
            readOnly={!isEdit}
            className={`w-full mb-3 p-2 rounded bg-transparent border border-white/30 placeholder-white/50  ${!isEdit ? 'opacity-80' : ''}`}
            placeholder="AI의 답변 형식을 정해주세요."
            value={tempPrompt.form}
            onChange={(e) => setTempPrompt({ ...tempPrompt, form: e.target.value })}
          />
          

          <p className='font-semibold mb-0'>AI의 답변 수준</p>
            <p className="mb-0 text-sm"><span className="text-orange-500 font-semibold">예시: </span> 전문가라고 생각하고 설명해줘. </p>   
          <textarea
            readOnly={!isEdit}
            className={`w-full mb-3 p-2 rounded bg-transparent border border-white/30 placeholder-white/50  ${!isEdit ? 'opacity-80' : ''}`}
            placeholder="AI의 답변 수준을 정해주세요."
            value={tempPrompt.level}
            onChange={(e) => setTempPrompt({ ...tempPrompt, level: e.target.value })}
          />   

          <p className='font-semibold mb-0'>추가 설정</p>
            <p className="mb-0 text-sm"><span className="text-orange-500 font-semibold">예시: </span> 마크다운 형식으로 줘. 친근한 친구같은 반말로 해줘 </p>   
          <textarea
            readOnly={!isEdit}
            className={`w-full mb-2 p-2 rounded bg-transparent border border-white/30 placeholder-white/50  ${!isEdit ? 'opacity-80' : ''}`}
            placeholder="AI의 답변 수준을 정해주세요."
            value={tempPrompt.option}
            onChange={(e) => setTempPrompt({ ...tempPrompt, option: e.target.value })}
          />
        </>
      )}
      
      <div className="flex justify-end gap-2">
        {!isEdit ? (
          <>
            <button className = {okButton} onClick={() => {
              if (tempPrompt.promptId !== "")
                setIsEdit(true);
              else
                alert("수정할 프롬포트를 선택해주십시오.");
            }}>
                수정
            </button>
            <button className = {`${cancelButton} bg-red-600 text-white`}
              onClick={()=>{
                if (tempPrompt.promptId !== "")
                  deletePrompt()
                else
                  alert("삭제할 프롬포트를 선택해주십시오.");
              }}
            >
              삭제
            </button>
          </>
        ):(
          <>
            <button className = {okButton} onClick={() => updatePrompt()}>수정 완료</button>
            <button className = {okButton} onClick={() => {
              setIsEdit(false);
              setTempPrompt(targetPrompt);
            }}>
            수정 취소</button>
          </>
        )}
          <button className = {cancelButton} onClick={() => onClose()}>취소</button>
      </div>    
    </>
  );
}

export default UpdatePrompt;