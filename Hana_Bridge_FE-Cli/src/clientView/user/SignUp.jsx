import React, { useState } from "react";
import { Card, Form, Button, Row, Col } from "react-bootstrap";
import { useNavigate, Link } from "react-router-dom";
import ApiClient from "../../service/ApiClient";


function SignUp() {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [checkPwd, setCheckPwd] = useState('');
  const [name, setName] = useState('');
  const [nickName, setNickName] = useState('');
  const [createAt, setCreateAt] = useState(new Date());

  const navigate = useNavigate();

  console.log("name: " + name + 
    "   email " + email +
    "   nickname:  " + nickName +
    "   password: " + password
  )
  
  const handleSignup = ()=>{
    if(password !== checkPwd){
      alert("비밀번호가 일치하지 않습니다. ");
    }
    ApiClient.sendUser(email, password, name, nickName, createAt)
    .then(() => {
      alert("회원가입을 축하합니다. ");
      navigate('/');
    })
    .catch((err) => console.error("API 요청 실패:", err));
  }


  return (
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
            <Card.Title className="mb-4 fs-3 fw-bold text-center">회원가입</Card.Title>

            <Form>
              <Form.Group className="mb-3">
                <Form.Label>이름<span className="text-danger">*</span></Form.Label>
                <Form.Control type="text" placeholder="이름을 입력해 주세요" 
                value={name} onChange={e => setName(e.target.value)}/>
              </Form.Group>

              <Form.Group className="mb-2">
                <Form.Label>이메일<span className="text-danger">*</span></Form.Label>
                <Row>
                  <Col xs={8}>
                    <Form.Control type="email" placeholder="이메일을 입력해 주세요" 
                    value={email} onChange={e => setEmail(e.target.value)}/>
                  </Col>
                  <Col xs={4}>
                    <Button variant="secondary" className="w-100">코드발송</Button>
                  </Col>
                </Row>
              </Form.Group>

              <Form.Group className="mb-3">
                <Row>
                  <Col xs={8}>
                    <Form.Control type="text" placeholder="인증코드" />
                  </Col>
                  <Col xs={4}>
                    <Button variant="secondary" className="w-100">인증하기</Button>
                  </Col>
                </Row>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>닉네임<span className="text-danger">*</span></Form.Label>
                <Form.Control type="text" placeholder="닉네임을 입력해 주세요"
                value={nickName} onChange={e => setNickName(e.target.value)} />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>비밀번호<span className="text-danger">*</span></Form.Label>
                <Form.Control type="password" placeholder="비밀번호를 입력해 주세요"
                value={password} onChange={e => setPassword(e.target.value)} />
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label>비밀번호 확인<span className="text-danger">*</span></Form.Label>
                <Form.Control type="password" placeholder="비밀번호를 다시 입력해 주세요" 
                value={checkPwd} onChange={e => setCheckPwd(e.target.value)}/>
              </Form.Group>

              <Button variant="primary" className="w-100" size="lg" onClick={() => handleSignup()}>가입하기</Button>
            </Form>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
}

export default SignUp;
