import React from 'react';
import Header from './Header';
import '../css/main/Home.css';
import { Card, Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";


const Home = () => {
  const nickName = useSelector((state) => state.user.nickName);

  return (
    <div>
      <Header />

      {/* 상단 파란 배경 */}
      <div className="home-banner d-flex align-items-start justify-content-center pt-4">
        <Container className="mt-4">
          <h1 className="text-white fw-bold home-title">
            Welcome Hana Bridge Community!!
          </h1>

          <Link to={nickName === "guest" ? "/login" : "/aiChat"} className="text-decoration-none">
            <img src="/images/homeCodeHelper.png" alt="notice" width="170" height="50" className="me-1" />
          </Link>
        </Container>
      </div>
            
      {/* 카드 영역 */}
      <div className="d-flex justify-content-center card-container">
        <Card className="p-4 shadow rounded-4 bg-white card-shape">
          <Card.Body>
            <div className="row text-center">
              {/* 공지 게시판 */}
              <div className="col">
                <Link to="/board/notice" className='link-no-style'>
                  <div className="d-flex flex-column align-items-center justify-content-center board-icon">
                    <img src="/images/noticeIcon.png" alt="notice" width="90" height="90" className="mb-2" />
                    <p className="fw-semibold mb-0">공지 게시판</p>
                  </div>
                </Link>
              </div>

              {/* 코드 게시판 */}
              <div className="col">
                <Link to="/board/code" className='link-no-style'>
                  <div className="d-flex flex-column align-items-center justify-content-center board-icon">
                    <img src="/images/codeIcon.png" alt="code" width="90" height="80" className="mb-2" />
                    <p className="fw-semibold mb-0">Code 게시판</p>
                  </div>
                </Link>
              </div>

              {/* 어셈블 게시판 */}
              <div className="col">
                <Link to="/board/assemble" className='link-no-style'>
                  <div className="d-flex flex-column align-items-center justify-content-center board-icon">
                    <img src="/images/assembleIcon.png" alt="assemble" width="90" height="85" className="mb-2" />
                    <p className="fw-semibold mb-0">Assemble 게시판</p>
                  </div>
                </Link>
              </div>
            </div>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
};

export default Home;