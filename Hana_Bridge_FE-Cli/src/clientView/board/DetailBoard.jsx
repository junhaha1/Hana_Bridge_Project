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
  const userId = useSelector((state) => state.user.userId) || 'guest';
  const nickName = useSelector((state) => state.user.nickName) || 'guest';

  const { boardId } = useParams(); 
  const [board, setBoard] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    ApiClient.getBoard(boardId)
    .then((res) => {
      if (!res.ok) throw new Error(`서버 오류: ${res.status}`);
      return res.json();
    })
    .then((data) => {
      console.log(data);
      setBoard(data);
    })
    .catch((err) => console.error("API 요청 실패:", err));
  }, [boardId]);

  //if (userId.trim() === "guest") return <div>⛔로그인 유저만 가능한 서비스 입니다.⛔</div>;
  if (!board) return <div>로딩 중...</div>;

  return (
    <>
    <Header />
    
    <Container className="mt-4">
      <div className="container mt-4">
        {/* 게시글 카드 */}
        <div className="card mb-4">
          <div className="card-body">
            <div className="text-muted mb-2">자유 게시판 &lt; 상세글</div>
            <h5 className="card-title fw-bold">{board.title}</h5>
            <p className="text-secondary">작성자 {board.nickName}</p>
            <p>{board.content}</p>
            <div className="d-flex justify-content-between mt-3">
              <div>
                <span className="me-3">👍 {board.likeCount}</span>
                <span>💬 {board.commentsCount}</span>
              </div>
              <div>
                <a href="#" className="me-2 text-decoration-none">수정하기</a>
                <a href="#" className="text-decoration-none text-danger">삭제하기</a>
              </div>
            </div>
          </div>
        </div>
        <Comments boardId={boardId} />
      </div>
    </Container>
    </>
  );
};

export default DetailBoard;