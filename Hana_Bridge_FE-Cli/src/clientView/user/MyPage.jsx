import React from 'react';
import Header from '../Header';
import ApiClient from "../../service/ApiClient";
import { Form, Card, Modal, Button} from 'react-bootstrap';
import { useEffect, useState, useRef} from "react";
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from "react-router-dom";
import { modifyUser, clearUser } from '../../store/userSlice';

const MyPage = () => {
  const accessToken = useSelector((state) => state.user.accessToken);
  
  const email = useSelector((state) => state.user.email);
  const initialEmail = useRef(email);

  const name = useSelector((state) => state.user.name);
  const nickName = useSelector((state) => state.user.nickName);
  const role = useSelector((state) => state.user.role);

  const [password, setPassword] = useState("");

  const [tempEmail, setTempEmail] = useState(email);
  const [tempNickName, setTempNickName] = useState(nickName);
  const [tempPassword, setTempPassword] = useState("");


  //회원 탈퇴용 모달
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const openDeleteModal = () => setShowDeleteModal(true);
  const closeDeleteModal = () => setShowDeleteModal(false);

  //redux 수정용
  const dispatch = useDispatch();
  const navigate = useNavigate();
  //수정용 토글 변수
  const [isEdit, setIsEdit] = useState(false); 

  //수정 취소할 시에 원래 값으로 복원
  const resetEdit = () => {
    setIsEdit(false);
    setTempEmail(email);
    setTempNickName(nickName);
    setTempPassword(password);
  };

  //정보 수정
  const updateUser = () => {
    ApiClient.updateUser(accessToken, tempEmail, tempPassword, name, tempNickName)
    .then((res) => {
      if (!res.ok) throw new Error(`서버 오류 [${res.status}]`);
      return res.json();
    })
    .then((data)=>{
      console.log("정보 수정 완료 ! ");
      setIsEdit(false);
      dispatch(modifyUser({email: data.email, name: data.name, nickName: data.nickName}));
    })
    .catch((err) => {
      console.error("API 요청 실패:", err);
      alert("회원 탈퇴 중 문제가 발생했습니다. 다시 시도해주세요.");
    });
  };

  const confirmDeleteUser = () => {
    closeDeleteModal(); // 모달 닫고
    deleteUser();       // 탈퇴 진행
  };

  //회원 탈퇴
  const deleteUser = () => {
    ApiClient.deleteUser(accessToken)
    .then((res) => {
      if (!res.ok) throw new Error(`서버 오류 [${res.status}]`);
      alert("정상적으로 탈퇴되었습니다.");
      ApiClient.userLogout();
      dispatch(clearUser());
      navigate('/');
    })
    .catch((err) => console.error("API 요청 실패:", err));
  }

  //이메일 수정 시에 로그인 화면으로 이동
  useEffect(() => {
    if (accessToken && initialEmail.current && initialEmail.current !== email) {
      ApiClient.userLogout();
      alert("이메일이 변경되었습니다. 다시 로그인 해주십시오.");
      navigate('/login');
    }
  }, [email, accessToken]);

  //닉네임만 수정 시에 화면에 닉네임을 바꾸어줌
  useEffect(() => {
    setTempNickName(nickName);
  }, [nickName]);

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
                  <Form.Control type="text" value={name} readOnly style={{backgroundColor: "#e9ecef"}}/>
                </Form.Group>

                <Form.Group className="mb-2">
                  <Form.Label>이메일<span className="text-danger">*</span></Form.Label>
                  <Form.Control type="email" value={tempEmail} readOnly={!isEdit}
                  style={{
                    backgroundColor: isEdit ? "white" : "#e9ecef",
                    cursor: isEdit ? "text" : "default"
                  }}
                  onChange={e => setTempEmail(e.target.value)}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>닉네임<span className="text-danger">*</span></Form.Label>
                  <Form.Control type="text" value={tempNickName} readOnly={!isEdit}
                  style={{
                    backgroundColor: isEdit ? "white" : "#e9ecef",
                    cursor: isEdit ? "text" : "default"
                  }}
                  onChange={e => setTempNickName(e.target.value)}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>권한<span className="text-danger">*</span></Form.Label>
                  <Form.Control type="text" value={role} readOnly style={{backgroundColor: "#e9ecef"}}/>
                </Form.Group>
              </Form>
                {isEdit ? (
                  <>
                  <button className="btn btn-success me-2" onClick={() => updateUser()}>
                    수정 완료
                  </button>
                  <button className="btn btn-success me-2" onClick={() => resetEdit()}>
                    정보 수정 취소
                  </button>
                  </>
                ) : (
                  <>
                  <button className="btn btn-primary me-2" onClick={() => setIsEdit(true)}>
                    정보 수정
                  </button>

                  <button className="btn btn-danger" onClick={() => openDeleteModal()}>
                    회원 탈퇴
                  </button>
                  </>
                )}
            </Card.Body>
            <Modal show={showDeleteModal} onHide={closeDeleteModal} centered>
              <Modal.Header closeButton>
                <Modal.Title>회원 탈퇴 확인</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                정말 회원 탈퇴하시겠습니까?<br />
                탈퇴하면 모든 정보가 삭제됩니다.
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={closeDeleteModal}>
                  취소
                </Button>
                <Button variant="danger" onClick={confirmDeleteUser}>
                  탈퇴하기
                </Button>
              </Modal.Footer>
            </Modal>
          </Card>
        </div>

      </div>
    </div>
  );
};

export default MyPage;