import React, { useEffect, useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import ApiClient from '../../service/ApiClient';
import { commentInput } from '../../style/CommentStyle';
import { RiSendPlaneFill } from "react-icons/ri";


const AddComment = (props) => {
  const accessToken = useSelector((state) => state.user.accessToken);
  const nickName = useSelector((state) => state.user.nickName);
  // 새로 작성하는 댓글
  const [content, setContent] = useState('');
  const [createAt, setCreateAt] = useState(new Date());
  // 댓글창 ref (wrapperRef: 창닫기 ref, textRef: text 크기 )
  const wrapperRef = useRef(null); 
  const textRef = useRef(null);

  // 댓글 외부 클릭 감지
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        props.setNewCommentFlag(false); // 댓글창 닫기
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [props]);

  //사용자 입력창 크기 조절절
  const handleResizeHeight = () => {
    const element = textRef.current;
    textRef.current.style.height = 'auto';  //backspace 눌렀을 때에도 높이 자동 조절
    const maxHeight = 5 * 24; // 5줄 x 줄 높이 약 24px
    element.style.height = `${Math.min(element.scrollHeight, maxHeight)}px`; //height값 자동 조절 + 높이 제한   
  };  

  const handleAddComment = () => {
    console.log("addComment with boardId:  " + props.boardId );
    ApiClient.sendComment(props.boardId, accessToken, content, createAt)
    .then(async(res) => {
      if (!res.ok) {
        //error handler 받음 
        const errorData = await res.json(); // JSON으로 파싱
        console.log("errorData: " + errorData.code + " : " + errorData.message); 

        // 👇 error 객체에 code를 추가해 던짐
        const error = new Error(errorData.message || `서버 오류: ${res.status}`);
        error.code = errorData.code;
        throw error;  
      }
      // alert("댓글이 등록되었습니다. ");
      props.setNewCommentFlag(false)
    })
    .catch((err) => console.error('댓글 등록 실패:', err));
  };


  return (
    <div ref={wrapperRef} className="mb-4">
      <p className="mb-2 text-start text-white font-semibold">{nickName}</p>

      <div className="relative">
        <textarea
          rows="2"
          ref={textRef}
          value={content}
          onInput={handleResizeHeight}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault(); // 줄바꿈 방지
              handleAddComment();
            }
          }}
          placeholder="댓글을 입력하세요."
          className={commentInput}
        />
        
        <button
          onClick={handleAddComment}
          className="absolute right-3 bottom-2 -translate-y-1/2 hover:opacity-80"
        >
          <RiSendPlaneFill className='size-7 text-white'/>
        </button>
      </div>
    </div>
  );
};

export default AddComment;