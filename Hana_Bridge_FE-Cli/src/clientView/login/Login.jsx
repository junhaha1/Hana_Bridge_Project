import { Form, Button, Container } from 'react-bootstrap';
import { useNavigate, Link } from "react-router-dom";
import { useEffect, useState } from 'react';
import ApiClient from "../../service/ApiClient";

import { useDispatch } from 'react-redux';
import { setUser } from '../../store/userSlice';

function Login() {
  const [email, setEmail] = useState();
  const [pwd, setPwd] = useState();
  const [userInformation, setUserInformation] = useState(null);

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
        setUserInformation(data);
        dispatch(setUser({email: data.email, name: data.name, nickName: data.nickName, accessToken: data.accessToken}));
        navigate('/');
      })
      .catch((error) => {
        console.error("Error fetching user login:", error);
        alert("아이디를 확인해주세요"); 
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
              <input className="form-control mb-3" type="text" placeholder="ID(EMAIL)" value={email} onChange={(e) => setEmail(e.target.value)} />
              <input className="form-control mb-3" type="password" placeholder="PASSWORD" value={pwd} onChange={(e) => setPwd(e.target.value)} />
              <div className="d-flex justify-content-between">
                <Link to={'/'}>비밀번호 찾기 / 아이디 찾기</Link>
              </div>
              <div className="d-flex justify-content-between mt-3">
                <button className="btn btn-primary" onClick={() => loginButton(email, pwd)}>로그인</button>
                <Link className="btn btn-secondary" to={'/'}>처음으로</Link>
              </div>
            </div>
          </div>
        </div>
    </>
  );
}

export default Login;