import React from 'react';
import Header from './Header';
import { Card, Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

import '../css/main/Home.css';
import '../css/Common.css';

const Home = () => {
  const nickName = useSelector((state) => state.user.nickName);

  return (
    <div>
      <Header/>

      {/* 상단 파란 배경 */}
      <div className="banner d-flex align-items-start justify-content-center pt-4">
        <Container fluid className="mt-4 text-center">
          <h1 className="text-white fw-bold home-title">
            Welcome Hana Bridge Community!!
          </h1>
          <div className='d-flex justify-content-center'>
            <Link to={nickName === "guest" ? "/login" : "/aiChat"} className="text-decoration-none">
              <img 
                src="/images/homeCodeHelper.png" 
                alt="AI Code Helper" 
                className="home-code-helper-img" 
              />
            </Link>
          </div>
        </Container>
      </div>
            
      {/* 카드 영역 */}
      <div className="d-flex justify-content-center home-card-container">
        <Card className="p-4 shadow rounded-4 bg-white card-shape">
          <Card.Body>
            <div className="d-flex justify-content-around align-items-center text-center board-row">
              {/* 공지 */}
              <Link to="/board/notice" className='link-no-deco'>
                <div className="d-flex flex-column align-items-center board-icon">
                  <img src="/images/noticeIcon.png" alt="notice" width="90" height="90" className="mb-2" />
                  <p className="fw-semibold mb-0">공지 게시판</p>
                </div>
              </Link>

              {/* 코드 */}
              <Link to="/board/code" className='link-no-deco'>
                <div className="d-flex flex-column align-items-center board-icon">
                  <img src="/images/codeIcon.png" alt="code" width="90" height="80" className="mb-2" />
                  <p className="fw-semibold mb-0">
                    <span className="fw-bold">code</span> 게시판
                  </p>
                </div>
              </Link>

              {/* 어셈블 */}
              <Link to="/board/assemble" className='link-no-deco'>
                <div className="d-flex flex-column align-items-center board-icon">
                  <img src="/images/assembleIcon.png" alt="assemble" width="90" height="85" className="mb-2" />
                  <p className="fw-semibold mb-0">
                    <em>assemble</em> 게시판
                  </p>
                </div>
              </Link>
            </div>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
};

export default Home;