import React from "react";
import { Container, Navbar, Nav, Button, NavDropdown } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
//유저 아이디 가져오기기
import { useSelector } from 'react-redux'; 

//store action함수 
import { useDispatch } from 'react-redux';
import { clearUser, clearAiChat } from '../store/userSlice';

import ApiClient from "../service/ApiClient";

const BoardHeader = () => {
  //유저 로그아웃
  const dispatch = useDispatch();
  //유저 로그인 정보 유지
  const email = useSelector((state) => state.user.email);
  const nickName = useSelector((state) => state.user.nickName);

  const navigate = useNavigate();

  const logoutButton = () =>{
    ApiClient.userLogout()
    .then(res =>{
      if(!res.ok){
        throw new Error(`서버 오류: ${res.status}`);
      }
      dispatch(clearUser());
      console.log("로그아웃 완료!");
      dispatch(clearUser());
      dispatch(clearAiChat()); 
      localStorage.removeItem('userState'); //localStorage 비움
    })
    .catch(err =>{
      console.error("로그아웃 중 오류 발생:", err);
    })
    navigate("/");
  }

  const myPageButton = () =>{
    navigate("/myPage");
  }
  
  return (
    <Navbar expand="lg" bg="light" variant="light" className="shadow-sm">
      <Container fluid>
        {/* 로고 */}
        <Navbar.Brand as={Link} to="/">
          <strong>SW Board</strong>
        </Navbar.Brand>

        {/* 토글 버튼 (메뉴 접기용) */}
        <Navbar.Toggle aria-controls="basic-navbar-nav" />

        {/* 메뉴들 */}
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mx-auto">
            <Nav.Link as={Link} to="/">게시판</Nav.Link>
            <Nav.Link as={Link} to="/write">글 작성</Nav.Link>
          </Nav>

          {/* 로그인 & 회원가입  / 로그아웃 */}
          <Nav className="ms-auto">
            {email === "guest@email.com" ? (
              <>
                <Button as={Link} to="/login" variant="outline-primary" className="me-2">
                  로그인
                </Button>
                <Button as={Link} to="/signup" variant="outline-primary" className="me-2">
                  회원가입
                </Button>
              </>
            ) : (
              <>
                <NavDropdown title={`${nickName}님`} id="user-dropdown" align="end">
                  <NavDropdown.Item
                    onClick={() => myPageButton()}
                  >
                    My Page
                  </NavDropdown.Item>
                  <NavDropdown.Item
                    onClick={() => logoutButton()}
                  >
                    로그아웃
                  </NavDropdown.Item>                 
                </NavDropdown>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default BoardHeader;