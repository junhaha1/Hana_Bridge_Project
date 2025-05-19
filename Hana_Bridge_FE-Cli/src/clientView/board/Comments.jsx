import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import ApiClient from '../../service/ApiClient';
import AddComment from './AddComment';
import {Link} from 'react-router-dom';

import '../../css/Board/Comments.css';
import { buttonStyle } from '../../style/CommonStyle';
import { scrollStyle } from '../../style/CommonStyle';
import {FaUser} from 'react-icons/fa';


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
      return res.json();
    })
    .then((data) => {
      setComments(data);
    })
    .catch((err) => {
      console.error("API 요청 실패:", err);
      // 404일 때 에러 페이지로 이동
      if (err.code && err.code.includes('NOT_FOUND')) {
        navigate("/error");
      }
    }); 
  };

  //댓글 삭제
  const handleDeleteComment = (commentId) => {
    ApiClient.deleteComment(commentId, accessToken)
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
      loadComments();
    })
    .catch((err) => {
      console.error("API 요청 실패:", err);
    }); 
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
    .then(async (res) => {
      if (!res.ok) {
        const errorData = await res.json();
        const error = new Error(errorData.message || `서버 오류: ${res.status}`);
        error.code = errorData.code;
        throw error;
      }      
      setEditCommentId(null);
      setEditContent('');
      loadComments();
    })
    .catch((err) => {
      console.error('댓글 수정 실패:', err);
    });
  };

  return (
    <div className={scrollStyle + " h-[80vh]"}>
      {/* 댓글 리스트 */}
      {comments.map((comment) => (
        <div key={comment.commentId} className="mb-6">
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
                <div className="mb-2 pb-2 flex gap-2 border-b border-white/20">
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
                <div className="flex text-sm text-purple-200 gap-3 font-semibold mb-2">
                  <span className='flex'>
                    <FaUser
                    className="mt-1 "
                    />
                    {comment.nickName}
                  </span>
                  <span className='text-xs text-gray-300 mt-0.5'>
                    {new Date(comment.createAt).toISOString().slice(0, 16).replace('T', ' ')}
                  </span>                  
                </div>
                <div className='flex justify-between '>
                  <p className="mb-1">{comment.content}</p>

                  {(nickName === comment.nickName || role === "admin") && (
                    <>
                    <div className='px-2 flex flex-row'>
                      <button
                        className="px-3 py-1 mr-1 w-15 h-7 bg-blue-600 hover:bg-blue-700 text-sm text-white rounded whitespace-nowrap"
                        onClick={() => handleEditComment(comment.commentId, comment.content)}
                      >
                        <p>수정</p>
                      </button>
                      <button
                        className="px-3 py-1 w-15 h-7 bg-red-600 hover:bg-red-700 text-sm text-white rounded whitespace-nowrap"
                        onClick={() => handleDeleteComment(comment.commentId)}
                      >
                        삭제
                      </button>
                    </div>
                    </>
                  )}
                </div>
                
                {/* <div className="text-sm text-white/60 mb-2">
                   · 👍 {comment.likes} ·{" "}
                  <button className="hover:underline">신고</button>
                </div> */}
                
                {/* 구분선 */}
                <div className="border-t border-white/40 my-8" />
              </>
            )}
          </div>
        </div>
      ))}

      <div>
        {props.category === "code" && newCommentFlag ? (
          <AddComment boardId={props.boardId} setNewCommentFlag={setNewCommentFlag} />
        ) : null}
      </div>

      {/* 댓글 작성 or 작성 버튼 */}
      <div className="mt-6 flex gap-2">      

        {props.category === "code" && !newCommentFlag && role !== 'guest' && (
          <button
            className="px-4 py-1 bg-green-600 hover:bg-green-700 text-white text-sm rounded"
            onClick={() => setNewCommentFlag(true)}
          >
            댓글 작성
          </button>
        )}

        {props.category === "code" && (
          <></>
        )}

        {props.category === "notice" && (
          <Link
            to="/board/notice"
            className={buttonStyle + ` px-4 py-1 bg-green-600 hover:bg-green-700 text-white text-sm`}
          >
            이전
          </Link>
        )}
      </div>
    </div>
  );

};

export default Comments;
