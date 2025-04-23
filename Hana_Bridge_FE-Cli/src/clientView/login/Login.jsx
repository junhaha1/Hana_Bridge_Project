import { Form, Button, Container } from 'react-bootstrap';
import { useNavigate, Link } from "react-router-dom";
import { useEffect, useState } from 'react';
import ApiClient from "../../service/ApiClient";

import { useDispatch } from 'react-redux';
import { setUser } from '../../store/userSlice';

function Login() {
  const [userId, setUserId] = useState("");
  const [pwd, setPwd] = useState("");
  const [name, setName] = useState('guest');

  const navigate = useNavigate(); 
  const dispatch = useDispatch();

  const handleSubmit = (id, pw) => {
    ApiClient.getUser(userId)
      .then((res) => {
        if (!res.ok) {
          throw new Error("User not found");
        }
        return res.json();
      })
      .then((data) => {
        if (id.trim() !== data.userId.trim()) {
          alert("아이디를 확인해주세요");
          return;
        }
  
        if (pw.trim() !== data.pwd.trim()) {
          alert("비밀번호를 확인해주세요");
          return;
        }
  
        dispatch(setUser({ userId: data.userId, name: data.name }));
        navigate('/');
      })
      .catch((error) => {
        console.error("Error fetching user:", error);
        alert("아이디를 확인해주세요"); // 또는 상세 메시지
      });
  }
  

  return (
    <>
      <Container className="mt-4">
        <Link to="/" style={{ textDecoration: 'none' }}>
          <h1 className="fw-bold text-dark" style={{ cursor: 'pointer' }}>
            ourproject
          </h1>
        </Link>
      </Container>
      <div className="container mt-5">
          <div className="card mx-auto" style={{ maxWidth: '400px' }}>
            <div className="card-body">
              <h2 className="card-title text-center">Login</h2>
              <input className="form-control mb-3" type="text" placeholder="ID" value={userId} onChange={(e) => setUserId(e.target.value)} />
              <input className="form-control mb-3" type="password" placeholder="PASSWORD" value={pwd} onChange={(e) => setPwd(e.target.value)} />
              <div className="d-flex justify-content-between">
                <Link to={'/'}>비밀번호 찾기 / 아이디 찾기</Link>
              </div>
              <div className="d-flex justify-content-between mt-3">
                <button className="btn btn-primary" onClick={() => handleSubmit(userId, pwd)}>로그인</button>
                <Link className="btn btn-secondary" to={'/'}>처음으로</Link>
              </div>
            </div>
          </div>
        </div>
    </>
  );
}

export default Login;