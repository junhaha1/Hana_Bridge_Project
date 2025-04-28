import React from 'react';
import Header from '../Header';
import ApiClient from "../../service/ApiClient";
import { Form, Card} from 'react-bootstrap';
import { useEffect, useState } from "react";
import { useSelector } from 'react-redux';
import { Link } from "react-router-dom";

const MyPage = () => {
  const accessToken = useSelector((state) => state.user.accessToken);
  const [user, setUser] = useState(null);

  //수정용 토글 변수
  const [isEdit, setIsEdit] = useState(false); 

  useEffect(() => {
    ApiClient.getUser(accessToken)
      .then((res) => {
        if (!res.ok) throw new Error(`서버 오류: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        console.log(data);        
        setUser(data);
      })
      .catch((err) => console.error("API 요청 실패:", err)); 
  }, []);

  if (!user) {
    return (
      <div>
        <Header />
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
          <h2>Loading...</h2>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Header />
      <div style={{ minHeight: "100vh", backgroundColor: "#f8f9fa" }}>
        
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
          <Link to="/" style={{ textDecoration: 'none' }}>
            <h1 className="text-white fw-bold" style={{ cursor: 'pointer' }}>
              SW Board
            </h1>
          </Link>
        </div>

        {/* 카드 영역 */}
        <div className="d-flex justify-content-center" style={{ marginTop: "-120px" }}>
          <Card
            style={{ width: "100%", maxWidth: "450px" }}
            className="p-4 shadow rounded-4 bg-white"
          >
            <Card.Body>
              <Card.Title className="mb-4 fs-3 fw-bold text-center">사용자 정보 조회</Card.Title>
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>이름<span className="text-danger">*</span></Form.Label>
                  <Form.Control type="text" value={user.name} readOnly/>
                </Form.Group>

                <Form.Group className="mb-2">
                  <Form.Label>이메일<span className="text-danger">*</span></Form.Label>
                  <Form.Control type="email" value={user.email} readOnly/>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>닉네임<span className="text-danger">*</span></Form.Label>
                  <Form.Control type="text" value={user.nickName} readOnly/>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>권한<span className="text-danger">*</span></Form.Label>
                  <Form.Control type="text" value={user.role} readOnly/>
                </Form.Group>
              </Form>
              <button className="btn btn-primary me-2">정보 수정</button>
              <button className="btn btn-danger">회원 탈퇴</button>
            </Card.Body>
          </Card>
        </div>

      </div>
    </div>
  );
};

export default MyPage;