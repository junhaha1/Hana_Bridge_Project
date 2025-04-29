import React from 'react';
import ApiClient from "../../service/ApiClient";
import Header from '../Header';
import { useSelector } from 'react-redux';
import { Container, Row, Col, Button, Card, Badge } from 'react-bootstrap';
import { useEffect, useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useParams } from 'react-router-dom';
import Comments from './Comments';

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
    
    <Container className="mt-4">
      <div className="container mt-4">
        { isEdit === true ? (
          <>
          {/* 게시글 수정 */}
          <div className="card mb-4">
            <div className="card-body">
              {category == "code" ? (
                <><div className="text-muted mb-2">CODE 게시판 &lt; 상세글</div></>
              ):(
                <><div className="text-muted mb-2">공지 게시판 &lt; 상세글</div></>
              )}              
                <input 
                  type="text" 
                  className="card-title fw-bold"
                  placeholder="제목을 입력해주세요"
                  value={title}
                  onChange={e => setTitle(e.target.value)} 
                />
                <p className="text-secondary">작성자 {board.nickName}</p>
                <textarea 
                  className="form-control"
                  placeholder="코드나 에러사항을 입력해주세요"
                  value={code}
                  onChange={e => setCode(e.target.value)}
                />
                <textarea 
                  className="form-control"
                  placeholder="내용을 입력해주세요"
                  value={content}
                  onChange={e => setContent(e.target.value)}
                />
              <div className="d-flex justify-content-between mt-3">
                <div>
                <span className="me-3">👍 {board.likeCount}</span>
                  <span>💬 {board.commentsCount}</span>
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
          <div className="card mb-4">
            <div className="card-body">
            {category === "code" ? (
                <><div className="text-muted mb-2">CODE 게시판 &lt; 상세글</div></>
              ):(
                <><div className="text-muted mb-2">공지 게시판 &lt; 상세글</div></>
              )}    
                <h5 className="card-title fw-bold">{board.title}</h5>
                <p className="text-secondary">작성자 {board.nickName}</p>
                <p>{board.code}</p>
                <p>{board.content}</p>
              <div className="d-flex justify-content-between mt-3">
                <div>
                {isLike === true ? (
                    <>
                      <span className="me-3" style={{ cursor: 'pointer' }} 
                        onClick={() => handleCancelLike(boardId)}>👍 {likeCount}</span>
                    </>
                  ) : (
                    <>
                      <span className="me-3" style={{ cursor: 'pointer' }} 
                        onClick={() => handleLike(boardId)}>👍🏻 {likeCount}</span>
                    </>
                  )}                  
                  <span>💬 {board.commentsCount}</span>
                </div>
                <div>
                {/* 글을 생성한 사람이거나 관리자인 경우만 버튼을 볼 수 있음 */}
                {nickName === board.nickName || role === "admin" ? (
                    <>
                      <Link className="me-2 text-decoration-none" onClick={() => setIsEdit(true)}>수정하기</Link>
                      <Link className="text-decoration-none text-danger" onClick={() => boardDeleteButton(boardId)}>삭제하기</Link>
                    </>
                  ) : (
                    <>
                    </>
                )}
                </div>
              </div>
            </div>
          </div>
          </>
        )}
        
        <Comments boardId={boardId} />
      </div>
    </Container>
    </>
  );
};

export default DetailBoard;