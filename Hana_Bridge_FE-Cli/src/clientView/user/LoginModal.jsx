import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ApiClient from "../../service/ApiClient";
import { useDispatch } from "react-redux";
import { setUser } from "../../store/userSlice";

const LoginModal = ({ onClose, onSwitch }) => {
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const loginButton = (email, pw) => {
    ApiClient.userLogin(email, pw)
      .then((res) => {
        if (!res.ok) throw new Error("User not found");
        return res.json();
      })
      .then((data) => {
        dispatch(
          setUser({
            email: data.email,
            name: data.name,
            nickName: data.nickName,
            accessToken: data.accessToken,
            role: data.role,
          })
        );
        onClose(); // 모달 닫기
        navigate("/board/code");
      })
      .catch((error) => {
        console.error("Login error:", error);
        alert("아이디 또는 비밀번호를 확인해주세요");
      });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden animate-modal-fade">
        
        {/* 내부 2단 구조 */}
        <div className="flex flex-col md:flex-row w-full h-full">
          
          {/* 왼쪽 로고 영역 */}
          <div className="flex items-center justify-center basis-1/2 bg-white border-r border-gray-100 px-6 py-12">
            <h1 className="text-3xl font-bold text-gray-800 text-center leading-snug">
              Hana-<br />Bridge
            </h1>
          </div>

          {/* 오른쪽 로그인 영역 */}
          <div className="flex flex-col justify-center basis-1/2 px-10 py-12">
            <h2 className="text-xl font-bold mb-6 text-gray-900">로그인</h2>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  아이디 <span className="text-blue-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="아이디를 입력해 주세요"
                  className="w-full border-b border-gray-300 focus:outline-none focus:border-blue-500 py-2 text-sm"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  비밀번호 <span className="text-blue-500">*</span>
                </label>
                <input
                  type="password"
                  placeholder="비밀번호를 입력해 주세요"
                  className="w-full border-b border-gray-300 focus:outline-none focus:border-blue-500 py-2 text-sm"
                  value={pwd}
                  onChange={(e) => setPwd(e.target.value)}
                />
              </div>

              <button
                onClick={() => loginButton(email, pwd)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-md text-sm font-semibold transition"
              >
                로그인
              </button>

              <div className="text-center text-sm text-gray-500">
                계정을 잊으셨나요?{" "}
                <span
                  className="text-blue-600 hover:underline cursor-pointer"
                  onClick={() => navigate("/recover")}
                >
                  비밀번호 찾기
                </span>{" "}
                |{" "}
                <span
                  className="text-blue-600 hover:underline cursor-pointer"
                  onClick={() => {
                    onClose();
                    onSwitch("signup");
                  }}
                >
                  회원가입
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 닫기 버튼 */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl z-10"
        >
          ✕
        </button>
      </div>
    </div>
  );
};

export default LoginModal;
