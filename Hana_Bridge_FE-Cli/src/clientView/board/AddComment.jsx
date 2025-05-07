import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import ApiClient from '../../service/ApiClient';

import '../../css/Board/AddComment.css';

const AddComment = (props) => {
  const accessToken = useSelector((state) => state.user.accessToken);
  const nickName = useSelector((state) => state.user.nickName);
  // 새로 작성하는 댓글
  const [content, setContent] = useState('');
  const [createAt, setCreateAt] = useState(new Date());

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
    <div>
      {/* 댓글 작성 폼 */}
      <div className="card mb-3">
        <div className="card-body">
        <p className="mb-1"><strong>{nickName}</strong></p>
          <textarea 
            className="form-control mb-2" 
            rows="2" 
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="댓글을 입력하세요."
          />
          <button className="btn btn-primary btn-sm" onClick={() => handleAddComment()}>
            댓글 등록
          </button>
          <button className="btn btn-danger btn-sm" onClick={() => props.setNewCommentFlag(false)}>취소</button>
        </div>
      </div>
    </div>
  );
};

export default AddComment;