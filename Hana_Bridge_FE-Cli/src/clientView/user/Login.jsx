import { useNavigate, Link } from "react-router-dom";
import { useState } from 'react';
import ApiClient from "../../service/ApiClient";
import { Card, Form, Button, Container } from "react-bootstrap";
import { useDispatch } from 'react-redux';
import { setUser } from '../../store/userSlice';

import '../../css/user/Login.css';
import '../../css/Common.css';

function Login() {
  const [email, setEmail] = useState('');
  const [pwd, setPwd] = useState('');

  const navigate = useNavigate(); 
  const dispatch = useDispatch();

  const loginButton = (email, pw) =>{
    ApiClient.userLogin(email, pw)
      .then((res) => {
        if(!res.ok){
          throw new Error("User not found");
        }
        return res.json();
      })
      .then((data) =>{
        console.log(data);
        dispatch(setUser({email: data.email, name: data.name, nickName: data.nickName, accessToken: data.accessToken, role: data.role}));
        navigate('/');
      })
      .catch((error) => {
        console.error("Error fetching user login:", error);
        alert("아이디를 확인해주세요"); 
      });
  }

  return (
    <>
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
            <div className="d-flex flex-row justify-content-between align-items-center">
              {/* 왼쪽: 로고 */}
              <div className="login-left d-flex flex-column align-items-center">
                <h2 className="logo-text">Hana-Bridge</h2>
              </div>

              {/* 오른쪽: 일반 로그인 */}
              <div className="login-right ms-5 flex-grow-1">
                <p className="login-text fw-bold fs-5 mb-4">로그인</p>

                <Form>
                  <Form.Group className="mb-3">
                    <Form.Label className="text-label">
                      아이디 <span className="required-star-blue">*</span>
                    </Form.Label>
                    <Form.Control 
                      type="text" 
                      placeholder="아이디를 입력해 주세요" 
                      className="custom-input"
                      value={email} 
                      onChange={e => setEmail(e.target.value)} 
                    />
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <Form.Label className="text-label">
                      비밀번호 <span className="required-star-blue">*</span>
                    </Form.Label>
                    <Form.Control 
                      type="password" 
                      placeholder="비밀번호를 입력해 주세요" 
                      className="custom-input"
                      value={pwd} 
                      onChange={e => setPwd(e.target.value)} 
                    />
                  </Form.Group>

                  <Button className="w-100 login-btn mb-3" onClick={() => loginButton(email, pwd)}>로그인</Button>
                  <div className="text-center small">
                    계정을 잊으셨나요? <Link to="/recover">비밀번호 찾기</Link> | <Link to="/signup">회원가입</Link>
                  </div>
                </Form>
              </div>
            </div>
          </Card.Body>
        </Card>
      </div>
    </>
  );
}

export default Login;