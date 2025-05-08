import React from 'react';
import ApiClient from "../../service/ApiClient";
import Header from '../Header';
import { useSelector } from 'react-redux';
import { Container, Row, Col, Button, Card, Badge } from 'react-bootstrap';
import { useEffect, useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useParams } from 'react-router-dom';
import Comments from './Comments';

import '../../css/Board/DetailBoard.css'

const DetailBoard = () => {
  const nickName = useSelector((state) => state.user.nickName);
  const role = useSelector((state) => state.user.role);
  const accessToken = useSelector((state) => state.user.accessToken);

  const { boardId } = useParams(); 

  const [board, setBoard] = useState(null);
  const [isEdit, setIsEdit] = useState(false);

  const [isLike, setIsLike] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  const [title, setTitle] = useState('');
  const [code, setCode] = useState('');
  const [content, setContent] = useState('');
  const [updateAt, setUpdateAt] = useState(new Date());

  const navigate = useNavigate();
  const location = useLocation();

  const [category, setCategory] = useState(location.state?.category);

  const [commentCount, setCommentCount] = useState(0);

  // const category = location.state?.category;

  useEffect(() => {
    ApiClient.getBoard(boardId, accessToken)
    .then((res) => {
      if (!res.ok) throw new Error(`서버 오류: ${res.status}`);
      return res.json();
    })
    .then((data) => {
      console.log(data);
      setBoard(data);
      setLikeCount(data.likeCount);
      setIsLike(data.goodCheck);      
      setCommentCount(data.commentCount);
    })
    .catch((err) => console.error("API 요청 실패:", err)); 
  }, [isEdit, boardId]);

  useEffect(() => {
    if (isEdit && board) {
      setTitle(board.title);
      setContent(board.content);
      setCode(board.code); 
    }
  }, [isEdit, board]);

  if (!board) return <div>로딩 중...</div>;

  //삭제 버튼
  const boardDeleteButton = (boardId) => {
    ApiClient.deleteBoard(boardId, accessToken, category)
    .then(res => {
      if (!res.ok) {
          throw new Error(`서버 오류: ${res.status}`);
      }
      console.log("게시글 삭제 완료!");
      navigate('/');
    })
    .catch(error => {
        console.error("게시글 삭제 중 오류 발생:", error);
    });
  }

  //수정 저장 버튼
  const saveBoard = (boardId) => {
    ApiClient.updateBoard(boardId, accessToken, category, title, content, code, updateAt)
    .then(() => {
      console.log("게시글 수정 완료 ! ");
      navigate(`/detailBoard/${boardId}`, {state: {category: category}});
      setIsEdit(false);
    })
    .catch((err) => console.error("API 요청 실패:", err));
  }

  //좋아요
  const handleLike = (boardId) => {
    ApiClient.sendBoardGood(boardId, accessToken)
      .then((res) => {
        if (!res.ok) throw new Error(`서버 오류: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        console.log(data);
        setIsLike(data.goodCheck);
        setLikeCount(data.likeCount);  // 추가
      })
      .catch((err) => console.error("API 요청 실패:", err));    
  }
  //좋아요 삭제
  const handleCancelLike = (boardId) => {
    ApiClient.deleteBoardGood(boardId, accessToken)
      .then(res => {
        if (!res.ok) {
            throw new Error(`서버 오류: ${res.status}`);
        }
        return res.json();
      })
      .then((data) =>{
        console.log("좋아요 취소!");
        setIsLike(data.goodCheck);
        setLikeCount(data.likeCount);  // 추가
      })
      .catch(error => {
          console.error("삭제 중 오류 발생:", error);
      });
  }
  

  return (
    <>
    <Header />
    
    <Container className="mt-5">
      <div className="container mt-4">
        { isEdit === true ? (
          <>
          {/* 게시글 수정 */}
          <div className="card mb-4">
            <div className="card-body">
              {category == "code" ? (
                <><div className="text-muted mb-2 text-start">CODE 게시판 &lt; 상세글</div></>
              ):(
                <><div className="text-muted mb-2 text-start">공지 게시판 &lt; 상세글</div></>
              )}              
                <input 
                  type="text" 
                  className="board-title form-control fw-bold text-start mb-3"
                  placeholder="제목을 입력해주세요"
                  value={title}
                  onChange={e => setTitle(e.target.value)} 
                />
                <p className="text-secondary text-start">작성자 {board.nickName}</p>
                <textarea 
                  className="form-control text-start"
                  placeholder="코드나 에러사항을 입력해주세요"
                  value={code}
                  onChange={e => setCode(e.target.value)}
                />
                <textarea 
                  className="form-control text-start"
                  placeholder="내용을 입력해주세요"
                  value={content}
                  onChange={e => setContent(e.target.value)}
                />
              <div className="d-flex justify-content-between mt-3">
                <div>
                <span className="me-3"><img src="/images/whiteGood.png" alt="좋아요" width="20" className="me-1" /> {board.likeCount}</span>
                  <span><img src="/images/comment.png" alt="말풍선" width="20" className="me-1" /> {board.commentsCount}</span>
                </div>   
                <div className="d-flex justify-content-end gap-2">
                  <button className="btn btn-success" onClick={() => saveBoard(boardId)}>저장</button>
                  <button className="btn btn-danger" onClick={() => setIsEdit(false)}>취소</button>
                </div>             
              </div>
            </div>
          </div>
          </>
        ):(
          <>
          {/* 게시글 카드 */}
          {/* 게시글 보기 */}
          <div className="mb-4">
            <div>
              <div className="text-muted mb-2 text-start">
                {category === "code" ? "CODE 게시판 < 상세글" : "공지 게시판 < 상세글"}
              </div>
              <h5 className="fw-bold text-start">{board.title}</h5>
              <p className="text-secondary text-start">작성자 {board.nickName}</p>
              <p className="text-start">{board.code}</p>
              <p className="text-start">{board.content}</p>

              <div className="d-flex justify-content-between mt-3">
                <div>
                  {isLike ? (
                    <span className="me-3" onClick={() => handleCancelLike(boardId)}>
                      <img src="/images/blueGood.png" alt="좋아요" width="20" className="me-1" /> {likeCount}
                    </span>
                  ) : (
                    <span className="me-3" onClick={() => handleLike(boardId)}>
                      <img src="/images/whiteGood.png" alt="좋아요" width="20" className="me-1" /> {likeCount}
                    </span>
                  )}
                  <span>
                    <img src="/images/comment.png" alt="말풍선" width="20" className="me-1" /> {commentCount}
                  </span>
                </div>

                {/* 작성자 or 관리자만 수정/삭제 가능 */}
                {(nickName === board.nickName || role === "admin") && (
                  <div>
                    <Link className="me-2 text-decoration-none" onClick={() => setIsEdit(true)}>수정하기</Link>
                    <Link className="text-decoration-none text-danger" onClick={() => boardDeleteButton(boardId)}>삭제하기</Link>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className='board-div mb-3'></div>
          </>
        )}
        
        <Comments boardId={boardId} category={category} />
      </div>
    </Container>
    </>
  );
};

export default DetailBoard;