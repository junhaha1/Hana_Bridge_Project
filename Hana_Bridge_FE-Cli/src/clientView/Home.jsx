import React from 'react';
import Header from './Header';
import { Card, Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";


const Home = () => {
  const nickName = useSelector((state) => state.user.nickName);

  return (
    <div>
      <Header />

      {/* 상단 파란 배경 */}
      <div
        style={{
          width: "100vw",
          height: "40vh",
          background: "linear-gradient(to right, #000428, #004e92)",
          position: "relative",
          left: 0,
          top: 0,
        }}
        className="d-flex align-items-start justify-content-center pt-4"
      >
        <Container className="mt-4">
          <h1 className="text-white fw-bold" style={{ cursor: 'pointer' }}>
            Welcome Hana Bridge Community!!
          </h1>

          <Link to={nickName === "guest" ? "/login" : "/aiChat"} style={{ textDecoration: 'none' }}>
            <img src="/images/homeCodeHelper.png" alt="notice" width="170" height="50" className="me-1" />
          </Link>
        </Container>
      </div>
            

      {/* 카드 영역 */}
      <div className="d-flex justify-content-center" style={{ marginTop: "-120px" }}>
        <Card
          style={{ width: "100%", maxWidth: "450px" }}
          className="p-4 shadow rounded-4 bg-white"
        >
          <Card.Body>
            <div className="row text-center">
              {/* 공지 게시판 */}
              <div className="col">
                <Link to="/board/notice" style={{ textDecoration: 'none', color: 'black' }}>
                  <div className="d-flex flex-column align-items-center justify-content-center" style={{ height: "130px" }}>
                    <img src="/images/noticeIcon.png" alt="notice" width="90" height="90" className="mb-2" />
                    <p className="fw-semibold mb-0">공지 게시판</p>
                  </div>
                </Link>
              </div>

              {/* 코드 게시판 */}
              <div className="col">
                <Link to="/board/code" style={{ textDecoration: 'none', color: 'black' }}>
                  <div className="d-flex flex-column align-items-center justify-content-center" style={{ height: "130px" }}>
                    <img src="/images/codeIcon.png" alt="code" width="90" height="80" className="mb-2" />
                    <p className="fw-semibold mb-0">Code 게시판</p>
                  </div>
                </Link>
              </div>

              {/* 어셈블 게시판 */}
              <div className="col">
                <Link to="/board/assemble" style={{ textDecoration: 'none', color: 'black' }}>
                  <div className="d-flex flex-column align-items-center justify-content-center" style={{ height: "130px" }}>
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