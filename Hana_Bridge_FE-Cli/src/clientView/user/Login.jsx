import { useNavigate, Link } from "react-router-dom";
import { useState } from 'react';
import '../../css/user/Login.css';
import ApiClient from "../../service/ApiClient";
import { Card, Form, Button, Container } from "react-bootstrap";

import { useDispatch } from 'react-redux';
import { setUser } from '../../store/userSlice';

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
      <div className="login-banner d-flex align-items-start justify-content-center pt-4">
        <Container className="mt-4">
          <Link to="/" style={{ textDecoration: 'none' }}>
            <h1 className="login-title text-white fw-bold">
              SW Board
            </h1>
          </Link>
        </Container>
      </div>

      {/* 카드 영역 */}
      <div className="login-card-container d-flex justify-content-center">
        <Card className="login-card p-4 shadow rounded-4 bg-white">
          <Card.Body>
            <Card.Title className="mb-4 fs-3 fw-bold text-center">Login</Card.Title>

            <Form>
              <Form.Group className="mb-3">
                <Form.Control type="text" placeholder="ID(EMAIL)" 
                value={email} onChange={e => setEmail(e.target.value)}/>
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Control type="password" placeholder="PASSWORD" 
                value={pwd} onChange={e => setPwd(e.target.value)}/>
              </Form.Group>

              <div className="d-flex justify-content-between">
                <Link to={'/'}>비밀번호 찾기 / 아이디 찾기</Link>
              </div>

              <div className="d-flex justify-content-between mt-3">
                <Button className="btn btn-primary" onClick={() => loginButton(email, pwd)}>로그인</Button>
                <Link className="btn btn-secondary" to={'/'}>처음으로</Link>
              </div>
            </Form>
          </Card.Body>
        </Card>
      </div>
    </>
  );
}

export default Login;