import React, { useEffect, useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import ApiClient from '../../service/ApiClient';

import '../../css/Board/AddComment.css';
import '../../css/Common.css';

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
      .then(() => {
        alert("댓글이 등록되었습니다. ");
        props.setNewCommentFlag(false)
      })
      .catch((err) => console.error('댓글 등록 실패:', err));
  };


  return (
    <div ref={wrapperRef} className="card mb-3">
      <div className="p-3">
        <p className="mb-2 text-start"><strong>{nickName}</strong></p>
        
        <div className="d-flex align-items-start">
          <textarea
            className="form-control me-2 custom-input"
            rows="2"
            value={content}
            onInput={handleResizeHeight}
            ref={textRef}
            onChange={(e) => setContent(e.target.value)}
            placeholder="댓글을 입력하세요."
            style={{ flex: 1, resize: 'none' }}
          />
          <div className="d-flex flex-column">
            <span onClick={() => handleAddComment()} style={{ cursor: 'pointer' }}>
              <img src="/images/send.png" alt="보내기" width="20" className="mb-1" />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddComment;