import { useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setCategory } from "../../store/userSlice";
//import { setPage } from "../../store/userSlice";
import { useNavigate } from "react-router-dom";
import { clearUser, clearAiChat } from "../../store/userSlice.js";
import ApiClient from "../../service/ApiClient.jsx";

import LoginModal from "../user/LoginModal.jsx";
import SignUpModal from "../user/SignUpModal.jsx";
import UserInfoModal from "../user/UserInfoModal.jsx";

import ConfirmLogoutModal from "../user/ConfirmLogoutModal.jsx"; // ⬅️ 커스텀 로그아웃 모달 추가

import {headerFrame} from '../../style/CommonFrame.jsx';
import { addButton, commonButton, logoutButton, mainTitle, serviceBox, titleBox, userButton, userIcon } from "../../style/CommonHeaderStyle.jsx";
import { FaUserCircle } from "react-icons/fa";

const BoardHeader = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const email = useSelector((state) => state.user.email);
  const nickName = useSelector((state) => state.user.nickName);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState("login");
  const [confirmLogoutOpen, setConfirmLogoutOpen] = useState(false);

  const openModal = (type) => {
    setModalType(type);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const moveDashBoard = () => {
    navigate('/dashBoard/home');
  }

  const moveAddBoard = () => {
    navigate("/write");
  }

  const handleLogout = () => {
    ApiClient.userLogout()
      .then((res) => {
        if (!res.ok) throw new Error(`서버 오류: ${res.status}`);
        dispatch(clearUser());
        dispatch(clearAiChat());
        localStorage.removeItem("userState");
        navigate("/");
      })
      .catch((err) => console.error("Logout error:", err));
  };

  return (
    <>
      <div className={headerFrame}>
        {/* 로고 + 제목 */}
        <div
          className={titleBox}
          onClick={() => {
            if (email && email !== "guest@email.com") {
              //dispatch(setPage({page:'home'}));
              dispatch(setCategory({category:'dash'}));
              navigate("/dashboard/home");
            } else {
              navigate("/");
            }
          }}
        >
          <strong className={mainTitle}>
            AIssue
          </strong>
        </div>

        {/* 로그인 / 회원가입 or 로그아웃 */}
        <div className={serviceBox}>
          {email === "guest@email.com" ? (
            <>
              <button
                onClick={() => openModal("login")}
                className={commonButton}
              >
                로그인
              </button>
              <button
                //onClick={() => openModal("signup")}
                className={commonButton}
              >
                회원가입
              </button>
            </>
          ) : (
            <div className={serviceBox + "z-[9999]"}>
              <button
                onClick={moveAddBoard}
                className={addButton}
              >
                글 작성
              </button>
              
              <button
                onClick={() => openModal("myinfo")}
                className={userButton}
              >
                 <FaUserCircle className={userIcon}/> {nickName}
              </button>              
              <button
                onClick={() => setConfirmLogoutOpen(true)}
                className={logoutButton}
              >
                로그아웃
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 로그인/회원가입 모달 */}
      {modalOpen && modalType === "login" && (
        <LoginModal onClose={closeModal} onSwitch={openModal} onSuccess={moveDashBoard}/>
      )}
      {modalOpen && modalType === "signup" && (
        <SignUpModal onClose={closeModal} onSwitch={openModal} />
      )}
      {modalOpen && modalType === "myinfo" && (
        <UserInfoModal onClose={closeModal} onSwitch={openModal} />
      )}

      {/* 로그아웃 확인 모달 */}
      {confirmLogoutOpen && (
        <ConfirmLogoutModal
          onConfirm={() => {
            handleLogout();
            setConfirmLogoutOpen(false);
          }}
          onCancel={() => setConfirmLogoutOpen(false)}
        />
      )}
    </>
  );
};

export default BoardHeader;