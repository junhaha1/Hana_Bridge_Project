import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import ApiClient from '../../service/ApiClient';
import AddComment from './AddComment';
import {Link} from 'react-router-dom';

const Comments = (props) => {
  const accessToken = useSelector((state) => state.user.accessToken);
  const nickName = useSelector((state) => state.user.nickName);
  const role = useSelector((state) => state.user.role);

  // 초기에 보여주는 댓글들 
  const [comments, setComments] = useState([]);
  // 현재 수정 중인 댓글 ID
  const [editCommentId, setEditCommentId] = useState(null); 
  // 수정 중인 댓글
  const [editContent, setEditContent] = useState(''); 
  //새로운 댓글 Flag
  const [newCommentFlag, setNewCommentFlag] = useState(false);

  useEffect(() => {
    loadComments();
  }, [props.boardId, newCommentFlag]);

  const loadComments = () => {
    ApiClient.getComments(props.boardId)
      .then((res) => {
        if (!res.ok) throw new Error(`서버 오류: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        setComments(data);
      })
      .catch((err) => console.error("API 요청 실패:", err));
  };

  const handleDeleteComment = (commentId) => {
    ApiClient.deleteComment(commentId, accessToken)
      .then(() => loadComments())
      .catch((err) => console.error('댓글 삭제 실패:', err));
  };

  const handleEditComment = (commentId, currentContent) => {
    setEditCommentId(commentId);
    setEditContent(currentContent);
  };

  const handleUpdateComment = (commentId) => {
    if (!editContent.trim()) return;
    //commentId, accessToken, content, createAt
    ApiClient.updateComment(commentId, accessToken, editContent.content, editContent.createAt)
      .then(() => {
        setEditCommentId(null);
        setEditContent('');
        loadComments();
      })
      .catch((err) => console.error('댓글 수정 실패:', err));
  };

  return (
    <div>

      {/* 댓글 리스트 */}
      {comments.map(comment => (
        <div className="card mb-2" key={comment.commentId}>
          <div className="card-body">
            {/* 수정 중일 때 */}
            {editCommentId === comment.commentId ? (
              <>
                <textarea 
                  className="form-control mb-2"
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  rows="2"
                />
                <button className="btn btn-success btn-sm me-2" onClick={() => handleUpdateComment(comment.commentId)}>
                  저장
                </button>
                <button className="btn btn-secondary btn-sm" onClick={() => setEditCommentId(null)}>
                  취소
                </button>
              </>
            ) : (
              <>
                <p className="mb-1"><strong>{comment.nickName}</strong></p>
                <p className="mb-1">{comment.content}</p>
                <div className="text-muted small">
                  {comment.createAt} · 👍 {comment.likes} ·{' '}
                  <a href="#" className="text-decoration-none">신고</a>
                </div>
                {nickName === comment.nickName || role === "admin" ? (
                  <>
                  <div className="mt-2">
                  <button className="btn btn-outline-primary btn-sm me-2" onClick={() => handleEditComment(comment.commentId, comment.content)}>
                    수정
                  </button>
                  <button className="btn btn-outline-danger btn-sm" onClick={() => handleDeleteComment(comment.commentId)}>
                    삭제
                  </button>
                </div>
                </>
              ):(
              <></>
              )}
                
              </>
            )}
          </div>
        </div>
      ))}

      <div>
        {newCommentFlag == true ?(
          <><AddComment boardId={props.boardId} setNewCommentFlag={setNewCommentFlag} /></>
        ):(
          <>
          <button className="btn btn-success btn-sm me-2" onClick={() => setNewCommentFlag(true)}>
            댓글 작성
          </button>
          </>
        )}
        <Link className="btn btn-success btn-sm me-2" to="/">
          처음으로 
        </Link>
      </div>    

    </div>
  );
};

export default Comments;
