import React from 'react';
import ApiClient from '../../service/ApiClient';
import { useSelector } from 'react-redux';
import { Container, Row, Col, Button, Card, Badge } from 'react-bootstrap';
import { useEffect, useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";

import '../../css/Board/CommonBoard.css';

const CodeBoard = () => {
  const [boards, setBoards] = useState([]);
  const [category, setCategory] = useState('code');

  const navigate = useNavigate(); 


  useEffect(() => {
    ApiClient.getBoards(category)
      .then((res) => {
        // 게시글이 없는 경우로 처리
        if (res.status === 404) {
          console.log("게시글 없음 (404)");
          setBoards(null);   
          return null;
        }

        if (!res.ok) throw new Error(`서버 오류: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        console.log(data);        
        if (data === null || (Array.isArray(data) && data.length === 0)) {
          console.log("게시글이 없습니다.");
          setBoards(null);
        } else {
          setBoards(data);
        }
      })
      .catch((err) => console.error("API 요청 실패:", err));    
  }, []);


  //게시글이 없을 경우 
  if(!boards){
    return (
      <div>
        <h3>게시글이 없습니다.</h3>
        <h2>첫 게시글을 작성해보세요.😊</h2> 
      </div>
    )
  }
  //상세 화면으로 
  const boardClick = (boardId) =>{
    navigate(`/detailBoard/${boardId}`, {state: {category: category}});
  }

  return (
    <div>
      {/* 카드 게시물 리스트 */}
      <Row className="g-3">
        {boards.map((post) => (
          <Col xs={12} key={post.boardId}>
            <Card className="shadow-sm board-card">
              <Card.Body>
                {/* 제목 + 작성자 */}
                <div className="d-flex justify-content-between align-items-start">
                  <Card.Title
                    className="mb-2 board-title cursor-pointer"
                    onClick={() => boardClick(post.boardId)}
                  >
                    {post.title}
                  </Card.Title>
                  <div className="text-primary text-end small">{post.nickName}</div>
                </div>

                {/* 내용 */}
                <Card.Text className="board-text text-muted mb-4">{post.content}</Card.Text>

                {/* 좋아요 & 댓글 아이콘 정렬 */}
                <div className="d-flex justify-content-end gap-4">
                  <span className="text-primary d-flex align-items-center">
                    <img src="/images/blueGood.png" alt="좋아요" width="18" className="me-1" />
                    {post.likeCount}
                  </span>
                  <span className="text-secondary d-flex align-items-center">
                    <img src="/images/comment.png" alt="댓글" width="18" className="me-1" />
                    {post.comments}
                  </span>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

    </div>
  );
};

export default CodeBoard;