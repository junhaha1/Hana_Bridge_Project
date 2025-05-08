import React, { useState } from "react";
import { Card, Form, Button, Row, Col, Container } from "react-bootstrap";
import { useNavigate, Link } from "react-router-dom";
import ApiClient from "../../service/ApiClient";
import '../../css/user/SignUp.css';
import '../../css/Common.css';

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
    <div className="signup-wrapper">
      {/* 상단 파란 배경 */}
      <div className="banner d-flex align-items-start justify-content-center pt-4">
        <Container className="mt-4">
          <Link to="/" className="link-no-deco">
            <h1 className="top-title text-white fw-bold">
              SW Board
            </h1>
          </Link>
        </Container>
      </div>

      {/* 카드 영역 */}
      <div className="card-container d-flex justify-content-center">
        <Card className="card-layout p-4 shadow rounded-4 bg-white">
          <Card.Body>
            <div className="signup-inner">
              <Card.Title className="text-start mb-4 fs-3 fw-bold">회원가입</Card.Title>
              <Form>
              <Form.Group className="mb-3">
                <Form.Label className="text-label">
                  이름<span className="required-star-red">*</span>
                </Form.Label>
                <Form.Control 
                  type="text" 
                  placeholder="이름을 입력해 주세요" 
                  value={name} 
                  className="custom-input"
                  onChange={e => setName(e.target.value)}
                />
              </Form.Group>

                <Form.Group className="mb-2">
                  <Form.Label className="text-label">
                    이메일<span className="required-star-red">*</span>
                  </Form.Label>
                  <Row className="mb-3">
                    <Col xs={8}>
                      <Form.Control 
                        type="email" 
                        placeholder="이메일을 입력해 주세요" 
                        value={email} 
                        className="custom-input"
                        onChange={e => setEmail(e.target.value)}
                      />
                    </Col>
                    <Col xs={4}>
                      <Button variant="light" className="w-100 btn-sm">코드발송</Button>
                    </Col>
                  </Row>

                  <Row className="mb-5">
                    <Col xs={8}>
                      <Form.Control 
                        type="text" 
                        placeholder="인증코드"
                        className="custom-input"
                      />
                    </Col>
                    <Col xs={4}>
                      <Button variant="light" className="w-100 btn-sm">인증하기</Button>
                    </Col>
                  </Row>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label className="text-label">
                    닉네임<span className="required-star-red">*</span>
                  </Form.Label>
                  <Form.Control 
                    type="text" 
                    placeholder="닉네임을 입력해 주세요"
                    value={nickName} 
                    className="custom-input"
                    onChange={e => setNickName(e.target.value)} 
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label className="text-label">
                    비밀번호<span className="required-star-red">*</span>
                  </Form.Label>
                  <Form.Control 
                    type="password" 
                    placeholder="비밀번호를 입력해 주세요"
                    value={password} 
                    className="custom-input"
                    onChange={e => setPassword(e.target.value)} 
                  />
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label className="text-label">
                    비밀번호 확인<span className="required-star-red">*</span>
                  </Form.Label>
                  <Form.Control 
                    type="password" 
                    placeholder="비밀번호를 다시 입력해 주세요" 
                    value={checkPwd} 
                    className="custom-input"
                    onChange={e => setCheckPwd(e.target.value)}
                  />
                </Form.Group>

                <Link to={'/login'}>이미 회원이신가요?</Link>
                
                <Button variant="primary" className="w-100" size="lg" onClick={() => handleSignup()}>가입하기</Button>
              </Form>
            </div>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
}

export default SignUp;
