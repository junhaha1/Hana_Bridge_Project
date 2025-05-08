import React from 'react';
import ApiClient from "../../service/ApiClient";
import Header from '../Header';
import { useSelector } from 'react-redux';
import { Container, Row, Col, Button, Card, Badge } from 'react-bootstrap';
import { useEffect, useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useParams } from 'react-router-dom';

import ReactMarkdown from "react-markdown";
import remarkGfm from 'remark-gfm'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { prism } from 'react-syntax-highlighter/dist/esm/styles/prism';

import '../../css/Board/DetailAssemble.css';

const DetailAssemble = () => {
  const nickName = useSelector((state) => state.user.nickName);
  const role = useSelector((state) => state.user.role);
  const accessToken = useSelector((state) => state.user.accessToken);

  const { assembleBoardId } = useParams(); 
  console.log(assembleBoardId);

  const [board, setBoard] = useState(null);

  const [isLike, setIsLike] = useState('');
  const [likeCount, setLikeCount] = useState(0);


  const navigate = useNavigate();
  const location = useLocation();

  //const category = location.state?.category;

  useEffect(() => {
    ApiClient.getAssembleBoard(assembleBoardId, accessToken)
    .then((res) => {
      if (!res.ok) throw new Error(`서버 오류: ${res.status}`);
      return res.json();
    })
    .then((data) => {
      console.log(data);
      console.log(data.goodCheck);
      setBoard(data);
      setLikeCount(data.likeCount);
      setIsLike(data.goodCheck);
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

  //좋아요
  const handleLike = (assembleBoardId) => {
    ApiClient.sendAssembleGood(assembleBoardId, accessToken)
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
  const handleCancelLike = (assembleBoardId) => {
    ApiClient.deleteAssembleGood(assembleBoardId, accessToken)
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
          {/* 게시글 카드 */}
          <div className="card mb-4">
            <div className="card-body">
              <div className="text-muted mb-2 text-start">ASSEMBLE 게시판 &lt; 상세글</div>
                <h5 className="card-title fw-bold text-start">{board.title}</h5>
                <p className="text-secondary text-start">작성자 {board.nickName}</p>
                <div className='text-start'>
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      code({ node, inline, className, children, ...props }) {
                        const match = /language-(\w+)/.exec(className || '');
                        return !inline && match ? (
                          // !inline && match 조건에 맞으면 하이라이팅
                          <SyntaxHighlighter {...props} style={prism} language={match[1]} PreTag="div">
                            {String(children).replace(/\n$/, '')}
                          </SyntaxHighlighter>
                        ) : (
                          // 안 맞다면 문자열 형태로 반환
                          <code {...props} className={className}>
                            {children}
                          </code>
                        );
                      },
                    }}
                  >
                    {board.content}
                  </ReactMarkdown>
                </div>
                
              <div className="d-flex justify-content-between mt-3">
                <div>
                {isLike === true ? (
                    <>
                      <span className="me-3"
                        onClick={() => handleCancelLike(assembleBoardId)}>
                        <img src="/images/blueGood.png" alt="좋아요" width="20" className="me-1" /> {likeCount}
                      </span>
                    </>
                  ) : (
                    <>
                      <span className="me-3" 
                        onClick={() => handleLike(assembleBoardId)}>
                        <img src="/images/whiteGood.png" alt="좋아요" width="20" className="me-1" /> {likeCount}
                      </span>
                    </>
                  )}
                                
                  <span><img src="/images/comment.png" alt="말풍선" width="20" className="me-1" /> {board.commentsCount}</span>
                </div>
                <div>
                  {/* 글을 생성한 사람이거나 관리자인 경우만 버튼을 볼 수 있음 */}
                  {nickName === board.nickName || role === "admin" ? (
                    <Link className="text-decoration-none text-danger" onClick={() => boardDeleteButton(assembleBoardId)}>삭제하기</Link>
                  ) : null}
                </div>
              </div>
            </div>                       
          </div>  
          <div>
            <Link className="btn btn-success btn-sm me-2" to="/board/assemble">
              처음으로 
            </Link>
          </div>       
      </div>
      
    </Container>
    </>
  );
};

export default DetailAssemble;