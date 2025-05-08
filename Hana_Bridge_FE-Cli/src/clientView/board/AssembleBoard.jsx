import React from 'react';
import ApiClient from '../../service/ApiClient';
import { Container, Row, Col, Button, Card, Badge } from 'react-bootstrap';
import { useEffect, useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import '../../css/Board/AssembleBoard.css';


const AssembleBoard = () => {
  const [boards, setBoards] = useState([]);
  const [category, setCategory] = useState('assemble');

  const navigate = useNavigate(); 

  useEffect(() => {
    ApiClient.getAssembleBoards()
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
  }, [category]);

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
  const boardClick = (assembleboardId) =>{
    console.log(assembleboardId);
    navigate(`/detailAssemble/${assembleboardId}`);
  }

  return (
    <div>
      {/* 카드 게시물 리스트 */}
      <Row className="g-3">
        {boards.map((post) => (
          <Col xs={12} key={post.assembleBoardId}>
            <Card className="shadow-sm board-card">
              <Card.Body>
                <div className="d-flex justify-content-between align-items-center">
                  <Card.Title className="mb-2 board-title" onClick={() => boardClick(post.assembleBoardId)}>
                    {post.title}
                  </Card.Title>
                  <div className="text-primary text-end small">{post.nickName}</div>
                </div>
                <Card.Text className="board-text">
                    {post.content.length > 80
                    ? post.content.slice(0, 80) + '...'
                    : post.content}
                </Card.Text>
                <div className="d-flex justify-content-end gap-4">
                  <span className="text-primary">
                    <img src="/images/blueGood.png" alt="좋아요"  width="18" className="me-1"/>
                    {post.likeCount}
                  </span>
                  <span className="text-secondary">
                    <img src="/images/comment.png" alt="댓글"  width="18" className="me-1"/>
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

export default AssembleBoard;