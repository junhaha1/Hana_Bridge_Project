import React from 'react';
import ApiClient from "../../service/ApiClient";
import Header from '../Header';
import { useSelector } from 'react-redux';
import { Container, Row, Col, Button, Card, Badge } from 'react-bootstrap';
import { useEffect, useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useParams } from 'react-router-dom';

const DetailAssemble = () => {
  const nickName = useSelector((state) => state.user.nickName);
  const role = useSelector((state) => state.user.role);
  const accessToken = useSelector((state) => state.user.accessToken);

  const { assembleBoardId } = useParams(); 
  console.log(assembleBoardId);

  const [board, setBoard] = useState(null);


  const navigate = useNavigate();
  const location = useLocation();

  const category = location.state?.category;

  useEffect(() => {
    ApiClient.getAssembleBoard(assembleBoardId)
    .then((res) => {
      if (!res.ok) throw new Error(`서버 오류: ${res.status}`);
      return res.json();
    })
    .then((data) => {
      console.log(data);
      setBoard(data);
    })
    .catch((err) => console.error("API 요청 실패:", err));    
  }, [assembleBoardId]);

  if (!board) return <div>로딩 중...</div>;

  //삭제 버튼
  const boardDeleteButton = (assembleBoardId) => {
    ApiClient.deleteAssembleBoard(assembleBoardId, accessToken)
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

  return (
    <>
    <Header />
    
    <Container className="mt-4">
      <div className="container mt-4">
          {/* 게시글 카드 */}
          <div className="card mb-4">
            <div className="card-body">
              <div className="text-muted mb-2">ASSEMBLE 게시판 &lt; 상세글</div>
                <h5 className="card-title fw-bold">{board.title}</h5>
                <p className="text-secondary">작성자 {board.nickName}</p>
                <p>{board.content}</p>
              <div className="d-flex justify-content-between mt-3">
                <div>
                  <span className="me-3">👍 {board.likeCount}</span>
                  <span>💬 {board.commentsCount}</span>
                </div>
                <div>
                  {/* 글을 생성한 사람이거나 관리자인 경우만 버튼을 볼 수 있음 */}
                  {nickName === board.nickName || role === "admin" ? (
                      <>
                        <Link className="text-decoration-none text-danger" onClick={() => boardDeleteButton(assembleBoardId)}>삭제하기</Link>
                      </>
                    ) : (
                      <>
                      </>
                  )}
                </div>
              </div>
            </div>
          </div>        
      </div>
    </Container>
    </>
  );
};

export default DetailAssemble;