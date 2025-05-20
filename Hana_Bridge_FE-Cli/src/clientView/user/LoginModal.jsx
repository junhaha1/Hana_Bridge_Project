import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ApiClient from "../../service/ApiClient";
import { useDispatch } from "react-redux";
import { setUser, setPage } from "../../store/userSlice";

const LoginModal = ({ onClose, onSwitch , onSuccess}) => {
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const loginButton = (email, pw) => {
    ApiClient.userLogin(email, pw)
      .then(async  (res) => {
        if (!res.ok) {
          //error handler 받음 
          const errorData = await res.json(); // JSON으로 파싱
          console.log("errorData: " + errorData.code + " : " + errorData.message); 

          // 👇 error 객체에 code를 추가해 던짐
          const error = new Error(errorData.message || `서버 오류: ${res.status}`);
          error.code = errorData.code;
          throw error;   
        }
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
        onClose(); //모달 닫기
        dispatch(setPage({page: 'home'}));
        onSuccess();
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
          <div className="flex flex-col gap-3 items-center justify-center basis-1/2 ">
            <strong className="text-[50px] text-black font-bold leading-[45px] no-underline">
              AIssue
            </strong>
            <p className="text-black text-sm font-semibold">
              AI Codi와 함께 코딩하세요!
            </p>
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

              <div className="w-full text-center text-sm text-gray-500">
                계정을 잊으셨나요?{" "}
                <div>
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
