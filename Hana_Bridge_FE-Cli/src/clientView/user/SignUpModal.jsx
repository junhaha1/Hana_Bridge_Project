import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ApiClient from "../../service/ApiClient";

const SignUpModal = ({ onClose, onSwitch }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [checkPwd, setCheckPwd] = useState("");
  const [name, setName] = useState("");
  const [nickName, setNickName] = useState("");
  const [createAt] = useState(new Date());

  const navigate = useNavigate();

  const handleSignup = () => {
    if (password !== checkPwd) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }

    ApiClient.sendUser(email, password, name, nickName, createAt)
      .then(() => {
        if (!res.ok) throw new Error(`서버 오류: ${res.status}`);
        alert("회원가입을 축하합니다.");
        onClose();
        navigate("/");
      })
      .catch((err) => console.error("회원가입 실패:", err));
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
      {/* 바깥 껍데기: 둥근 테두리 유지 */}
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden animate-modal-fade">
        
        {/* 닫기 버튼 */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl z-10"
        >
          ✕
        </button>

        {/* 안쪽 콘텐츠: 스크롤 허용 */}
        <div className="p-8 overflow-y-hidden max-h-[90vh]">
          <h2 className="text-2xl font-bold text-center mb-8">회원가입</h2>

          <form className="space-y-6">
            <div>
              <label className="block mb-1 font-medium">
                이름 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="이름을 입력해 주세요"
                className="w-full border-b border-gray-300 py-2 focus:outline-none focus:border-blue-500"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            {/* 이메일 + 인증 */}
            <div>
              <label className="block mb-1 font-medium">
                이메일 <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="email"
                  placeholder="이메일 입력"
                  className="flex-1 border-b border-gray-300 py-2 focus:outline-none focus:border-blue-500"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <button
                  type="button"
                  className="bg-gray-200 px-3 py-1 text-sm rounded hover:bg-gray-300"
                >
                  코드발송
                </button>
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="인증코드"
                  className="flex-1 border-b border-gray-300 py-2 focus:outline-none focus:border-blue-500"
                />
                <button
                  type="button"
                  className="bg-gray-200 px-3 py-1 text-sm rounded hover:bg-gray-300"
                >
                  인증하기
                </button>
              </div>
            </div>

            <div>
              <label className="block mb-1 font-medium">
                닉네임 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="닉네임을 입력해 주세요"
                className="w-full border-b border-gray-300 py-2 focus:outline-none focus:border-blue-500"
                value={nickName}
                onChange={(e) => setNickName(e.target.value)}
              />
            </div>

            <div>
              <label className="block mb-1 font-medium">
                비밀번호 <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                placeholder="비밀번호 입력"
                className="w-full border-b border-gray-300 py-2 focus:outline-none focus:border-blue-500"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div>
              <label className="block mb-1 font-medium">
                비밀번호 확인 <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                placeholder="비밀번호 재입력"
                className="w-full border-b border-gray-300 py-2 focus:outline-none focus:border-blue-500"
                value={checkPwd}
                onChange={(e) => setCheckPwd(e.target.value)}
              />
            </div>

            <button
              type="button"
              onClick={handleSignup}
              className="w-full bg-blue-600 text-white py-3 rounded-md font-semibold hover:bg-blue-700 transition"
            >
              가입하기
            </button>

            <div className="text-center text-sm text-gray-500">
              이미 회원이신가요?{" "}
              <span
                className="text-blue-600 hover:underline cursor-pointer"
                onClick={() => {
                  onClose();
                  onSwitch("login");
                }}
              >
                로그인
              </span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUpModal;
