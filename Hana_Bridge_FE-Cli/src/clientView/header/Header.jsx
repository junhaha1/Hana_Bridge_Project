import { useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setCategory, setPage } from "../../store/userSlice";
import { useNavigate } from "react-router-dom";
import { clearUser, clearAiChat } from "../../store/userSlice.js";
import Lottie from "lottie-react";
import logo from "../../../public/animations/logo.json";
import ApiClient from "../../service/ApiClient.jsx";
import LoginModal from "../user/LoginModal.jsx";
import SignUpModal from "../user/SignUpModal.jsx";
import ConfirmLogoutModal from "../user/ConfirmLogoutModal.jsx"; // ⬅️ 커스텀 로그아웃 모달 추가

const BoardHeader = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const email = useSelector((state) => state.user.email);

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

  const handleLogout = () => {
    ApiClient.userLogout()
      .then((res) => {
        if (!res.ok) throw new Error("서버 오류");
        dispatch(clearUser());
        dispatch(clearAiChat());
        localStorage.removeItem("userState");
        navigate("/");
      })
      .catch((err) => console.error("Logout error:", err));
  };

  const lottieRef = useRef();

  return (
    <>
      <div className="fixed top-0 left-0 w-full px-6 py-2 flex items-center justify-between bg-transparent text-white z-50">
        {/* 로고 + 제목 */}
        <div
          className="flex items-center space-x-4 no-underline cursor-pointer"
          onClick={() => {
            if (email && email !== "guest@email.com") {
              dispatch(setPage({page:'home'}));
              dispatch(setCategory({category:''}));
              navigate("/dashboard/home");
            } else {
              navigate("/");
            }
          }}
          onMouseEnter={() => lottieRef.current?.goToAndPlay(0, true)}
          onMouseLeave={() => lottieRef.current?.stop()}
        >
          <div className="w-[80px] h-[80px]">
            <Lottie
              lottieRef={lottieRef}
              animationData={logo}
              loop={false}
              autoplay={false}
            />
          </div>
          <strong className="text-[40px] text-white font-bold leading-[45px] no-underline">
            AIssue
          </strong>
        </div>

        {/* 로그인 / 회원가입 or 로그아웃 */}
        <div className="flex items-center space-x-2">
          {email === "guest@email.com" ? (
            <>
              <button
                onClick={() => openModal("login")}
                className="px-4 py-2 text-white hover:text-blue-300 rounded no-underline text-lg"
              >
                로그인
              </button>
              <button
                onClick={() => openModal("signup")}
                className="px-4 py-2 text-white hover:text-blue-300 rounded no-underline text-lg"
              >
                회원가입
              </button>
            </>
          ) : (
            <button
              onClick={() => setConfirmLogoutOpen(true)}
              className="block w-full text-left px-4 py-2 rounded hover:bg-[#C5BCFF]"
            >
              로그아웃
            </button>
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
