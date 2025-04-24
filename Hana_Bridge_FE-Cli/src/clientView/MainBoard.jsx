import Header from "./Header";
import ApiClient from "../service/ApiClient";
import CodeHelper from "./CodeHelper";
import { useSelector } from 'react-redux';
import { Container, Row, Col, Button, Card, Badge } from 'react-bootstrap';
import { useEffect, useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";


const MainBoard = () => {
  const userId = useSelector((state) => state.user.userId) || 'guest';
  const nickName = useSelector((state) => state.user.nickName) || 'guest';
  
  const [boards, setBoards] = useState([]);
  const [category, setCategory] = useState('code');
  const [like, setLike] = useState(0);

  const navigate = useNavigate(); 


  useEffect(() => {
    ApiClient.getBoards(category)
      .then((res) => {
        if (!res.ok) throw new Error(`서버 오류: ${res.status}`);
        //return res.text()
        return res.json();
      })
      .then((data) => {
        console.log(data);
        //게시글이 없을 경우 
        if(data == undefined){
          return (
            <div>
              <h3>게시글이 없습니다.</h3>
              <h2>첫 게시글을 작성해보세요.😊</h2> 
            </div>
          )
        }
        setBoards(data);
      })
      .catch((err) => console.error("API 요청 실패:", err));
  }, [category]);

  const boardClick = (boardId) =>{
    navigate(`/detailBoard/${boardId}`);
  }


  return (
    <div>
      <Header />

      <Container className="mt-4">
        {/* 글 모아보기 탭 */}
        <div className="mb-3 d-flex gap-2">
          <strong>글 모아보기</strong>
        </div>        
        <div className="mb-3 d-flex gap-2">
          <Button variant={category === 'code' ? 'primary' : 'light'} size="sm" onClick={() => setCategory('code')}>CODE 게시판</Button>
          <Button variant={category === 'assemble' ? 'primary' : 'light'} size="sm" >ASSEMBLE 게시판</Button>
          <Button variant={category === 'notice' ? 'primary' : 'light'} size="sm" onClick={() => setCategory('notice')}>NOTICE 게시판</Button>
        </div>

        {/* 카드 게시물 리스트 */}
        <Row className="g-3">
          {boards.map((post) => (
            <Col xs={12} key={post.boardId}>
              <Card className="shadow-sm">
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-center">
                    <Card.Title className="mb-2 fw-bold" style={{ cursor: 'pointer' }} onClick={() => boardClick(post.boardId)}>{post.title}</Card.Title>
                    <small className="text-muted">{post.userId}</small>
                  </div>
                  <Card.Text className="text-muted" style={{ fontSize: '0.9rem' }}>
                    {post.content}
                  </Card.Text>
                  <div className="d-flex gap-3 mt-2">
                    <span className="text-primary"><i className="bi bi-hand-thumbs-up"></i> 👍{post.likeCount}</span>
                    <span className="text-secondary"><i className="bi bi-chat-dots"></i> 💬{post.comments}</span>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>

      <CodeHelper />
    </div>
  );
};

export default MainBoard;
