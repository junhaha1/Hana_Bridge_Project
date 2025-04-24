import React from 'react';
import ApiClient from '../../service/ApiClient';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

const Comments = (props) => {
  const userId = useSelector((state) => state.user.userId) || 'guest';
  const nickName = useSelector((state) => state.user.nickName) || 'guest';

  const [comments, setComments] = useState([]);

  useEffect(() => {
    ApiClient.getComments(props.boardId)
    .then((res) => {
      if (!res.ok) throw new Error(`서버 오류: ${res.status}`);
      return res.json();
    })
    .then((data) => {
      console.log(data);
      setComments(data);
    })
    .catch((err) => console.error("API 요청 실패:", err));
  }, [props.boardId]);


  return (
    <div>
      {comments.map(comment => (
        <div className="card mb-2" key={comment.commentId}>
          <div className="card-body">
            <p className="mb-1"><strong>{comment.nickName}</strong></p>
            <p className="mb-1">{comment.content}</p>
            <div className="text-muted small">
              {comment.createAt} · 👍 {comment.likes} ·{' '}
              <a href="#" className="text-decoration-none">신고</a>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Comments;