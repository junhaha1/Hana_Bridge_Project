import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import ApiClient from '../../service/ApiClient';
import AddComment from './AddComment';
import {Link} from 'react-router-dom';

import '../../css/Board/Comments.css';

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
  const [editCreateAt, setEditCreateAt] = useState(new Date());
  //새로운 댓글 Flag
  const [newCommentFlag, setNewCommentFlag] = useState(false);

  useEffect(() => {
    loadComments();
  }, [props.boardId, newCommentFlag]);

  //전체 댓글
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

  //댓글 삭제
  const handleDeleteComment = (commentId) => {
    ApiClient.deleteComment(commentId, accessToken)
      .then(() => loadComments())
      .catch((err) => console.error('댓글 삭제 실패:', err));
  };

  //댓글 수정
  const handleEditComment = (commentId, currentContent) => {
    setEditCommentId(commentId);
    setEditContent(currentContent);
  };

  //수정 댓글 저장
  const handleUpdateComment = (commentId) => {
    if (!editContent.trim()) return;
    //commentId, accessToken, content, createAt
    ApiClient.updateComment(commentId, accessToken, editContent, editCreateAt)
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
      {comments.map((comment) => (
        <div key={comment.commentId} className="mb-6 px-2">
          <div className="text-left text-white">
            {editCommentId === comment.commentId ? (
              <>
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  rows={2}
                  className="w-full p-2 mb-2 rounded bg-gray-800 text-white placeholder-white/70 border border-white/30 resize-none"
                  placeholder="댓글을 수정하세요"
                />
                <div className="mb-2 flex gap-2">
                  <button
                    className="px-3 py-1 bg-green-600 hover:bg-green-700 text-sm text-white rounded"
                    onClick={() => handleUpdateComment(comment.commentId)}
                  >
                    저장
                  </button>
                  <button
                    className="px-3 py-1 bg-gray-600 hover:bg-gray-700 text-sm text-white rounded"
                    onClick={() => setEditCommentId(null)}
                  >
                    취소
                  </button>
                </div>
              </>
            ) : (
              <>
                <p className="mb-1 font-semibold">{comment.nickName}</p>
                <p className="mb-1">{comment.content}</p>
                <div className="text-sm text-white/60 mb-2">
                  {comment.createAt} · 👍 {comment.likes} ·{" "}
                  <button className="hover:underline">신고</button>
                </div>
                {(nickName === comment.nickName || role === "admin") && (
                  <div className="mb-2 text-right flex gap-2 justify-end">
                    <button
                      className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-sm text-white rounded"
                      onClick={() => handleEditComment(comment.commentId, comment.content)}
                    >
                      수정
                    </button>
                    <button
                      className="px-3 py-1 bg-red-600 hover:bg-red-700 text-sm text-white rounded"
                      onClick={() => handleDeleteComment(comment.commentId)}
                    >
                      삭제
                    </button>
                  </div>
                )}
                {/* 구분선 */}
                <div className="border-t border-white/40 my-8" />
              </>
            )}
          </div>
        </div>
      ))}

      {/* 댓글 작성 or 작성 버튼 */}
      <div className="mt-6 flex gap-2">
        {props.category === "code" && newCommentFlag ? (
          <AddComment boardId={props.boardId} setNewCommentFlag={setNewCommentFlag} />
        ) : null}

        {props.category === "code" && !newCommentFlag && role !== 'guest' && (
          <button
            className="px-4 py-1 bg-green-600 hover:bg-green-700 text-white text-sm rounded"
            onClick={() => setNewCommentFlag(true)}
          >
            댓글 작성
          </button>
        )}

        {props.category === "code" && (
          <Link
            to="/board/code"
            className="px-4 py-1 bg-green-600 hover:bg-green-700 text-white text-sm rounded"
          >
            이전
          </Link>
        )}

        {props.category === "notice" && (
          <Link
            to="/board/notice"
            className="px-4 py-1 bg-green-600 hover:bg-green-700 text-white text-sm rounded"
          >
            이전
          </Link>
        )}
      </div>
    </div>
  );

};

export default Comments;
