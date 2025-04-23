import React from "react";

import { Link } from "react-router-dom";
import { Container, Button } from "react-bootstrap";

//유저 아이디 가져오기기
import { useSelector } from 'react-redux'; 

//store action함수 
import { useDispatch } from 'react-redux';
import { clearUser } from '../store/userSlice' 

/* 
  페이지 헤더
  메인 로고 => BoardListView(메인화면) 이동
  로그인 버튼 => LoginForm.jsx 이동
  로그아웃 버튼 => userId 삭제 후 BoardListView(메인화면) 이동
*/
const BoardHeader = () => {
  //유저 로그아웃
  const dispatch = useDispatch();
  //유저 로그인 정보 유지
  const userId = useSelector((state) => state.user.userId) || 'guest';
  
  return (
    <Container className="mt-4">
      <Link
        to="/"
        state={{ userId: userId }}
        style={{ textDecoration: "none" }}
      >
        <h1 className="fw-bold text-dark" style={{ cursor: "pointer" }}>
          ourproject
        </h1>
      </Link>
      {userId === "guest" ? (
        <Link to="/login">
        <Button variant="secondary" className="mt-2">
          로그인
        </Button>
      </Link>
      ):(
        <>
          <p>{userId}</p>
          <Link to="/">
            <Button variant="secondary" className="mt-2" onClick={() => dispatch(clearUser())}>
              로그아웃  
            </Button>
          </Link>
        </>
      )}
    </Container>
  );
};

export default BoardHeader;