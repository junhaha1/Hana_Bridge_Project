import React, { useState, useEffect } from "react";
import ApiClient from "../../service/ApiClient";

const SignUpModal = ({ onClose, onSwitch }) => {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [checkPwd, setCheckPwd] = useState("");
  const [name, setName] = useState("");
  const [nickName, setNickName] = useState("");
  const [createAt] = useState(new Date());

  const [passwordError, setPasswordError] = useState("");
  const [shakePassword, setShakePassword] = useState(false);
  const [nameError, setNameError] = useState("");
  const [shakeName, setShakeName] = useState(false);
  const [nickNameError, setNickNameError] = useState("");
  const [shakeNickName, setShakeNickName] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [shakeEmail, setShakeEmail] = useState(false);

  const [isChecking, setIsChecking] = useState(false);
  const [isVerfied, setIsVerified] = useState(false);
  const [receiving, setReceiving] = useState(false);
  //인증 코드 입력 타이머
  const [timeLeft, setTimeLeft] = useState(300);

  useEffect(() => {
  if (!isChecking || isVerfied) return;

  const timer = setInterval(() => {
    setTimeLeft((prev) => {
      if (prev < 1) {
        clearInterval(timer);
        setIsChecking(false);
        setIsVerified(false);
        alert("인증 시간이 만료되었습니다.\n다시 시도해주십시오.");
        return 300;
      }
      return prev - 1;
    });
  }, 1000);

  return () => clearInterval(timer);
}, [isChecking, isVerfied]);

  const isValidPassword = (password) => {
    const regex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*()_+=-]).{8,}$/;
    return regex.test(password);
  };

  const sendEmailCode = (email) => {
    setReceiving(true);
    ApiClient.requestEmailCode(email)
    .then((res) => {
      if (!res.ok) 
        throw new Error(`서버 오류: ${res.status}`);
      setIsChecking(true);
      alert("인증번호가 발급되었습니다.");
    })
    .catch((err) => {
      console.error("인증 메일 실패:", err);
      setIsChecking(false);
      alert("다시 시도해주십시오.");
    })
    .finally(()=>{
      setReceiving(false);
    })
  }

  const responseEmailCode = (email, code) => {
    ApiClient.verifyCode(email, code)
    .then((res) => {
      if (!res.ok) 
          throw new Error(res.status);

      setIsVerified(true);
      alert("인증되었습니다!");
    })
    .catch((errCode) => {
      if (errCode.message === "400"){
        console.error("인증 실패:", errCode);
        alert("인증번호가 틀렸거나 만료되었습니다.\n다시 시도해주십시오.");
      } else {
        console.error("서버 오류:", errCode);
        alert("잠시 후 다시 시도해주십시오.");
      }
    });
  }

  const handleSignup = () => {
    let isValid = true;
    if (!name.trim()) {
      setNameError("아이디는 필수입니다.");
      setShakeName(true);
      setTimeout(() => setShakeName(false), 500);
      isValid = false;
    }

    if (!nickName.trim()) {
      setNickNameError("닉네임을 입력해 주세요.");
      setShakeNickName(true);
      setTimeout(() => setShakeNickName(false), 500);
      isValid = false;
    }

    if (!email.trim()) {
      setEmailError("이메일을 입력해 주세요.");
      setShakeEmail(true);
      setTimeout(() => setShakeEmail(false), 500);
      isValid = false;
    }

    if (!isValidPassword(password)) {
      setPasswordError("비밀번호는 최소 8자 이상이며, 영문자, 숫자, 특수문자를 포함해야 합니다.");
      setShakePassword(true);
      setTimeout(() => setShakePassword(false), 500);
      isValid = false;
    }

    if (password !== checkPwd) {
      setPasswordError("비밀번호가 일치하지 않습니다.");
      setShakePassword(true);
      setTimeout(() => setShakePassword(false), 500);
      isValid = false;
    }

    if (!isVerfied) {
      setEmailError("이메일 인증을 진행해주세요!");
      setShakeEmail(true);
      setTimeout(() => setShakeEmail(false), 500);
      isValid = false;
    }

    if (!isValid) return;

    ApiClient.sendUser(email, password, name, nickName, createAt)
      .then((res) => {
        if (!res.ok) 
          throw new Error(`서버 오류: ${res.status}`);
        alert("회원가입을 축하합니다.");
        onClose();
        onSwitch("login");
      })
      .catch((err) => console.error("회원가입 실패:", err));
  };

  //enter로 전송
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      // 전송하고 줄바꿈 막기
      e.preventDefault();
      handleSignup();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]">
      {/* 바깥 껍데기: 둥근 테두리 유지 */}
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden animate-modal-fade
          md:h-auto max-md:h-full max-md:h-screen max-md:max-h-screen max-md:rounded-none">                      
        {/* 닫기 버튼 */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl z-10"
        >
          ✕
        </button>

        {/* 안쪽 콘텐츠: 스크롤 허용 */}
        <div className="p-8 overflow-y-hidden max-h-[90vh]">
          <h2 className="text-2xl font-bold text-center mb-8 max-md:mt-8 max-md:mb-12">회원가입</h2>

          <form className="space-y-6">
            <div>
              <label className="block mb-1 font-medium">
                이름 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="이름을 입력해주세요"
                className={`w-full border-b py-2 focus:outline-none focus:border-blue-500
                  ${nameError ? 'border-red-500' : 'border-gray-300'}
                  ${shakeName ? 'animate-shake' : ''}`}
                value={name}
                onChange={(e) => setName(e.target.value)}
                onFocus={() => {
                  if (nameError) setNameError("");
                }}
              />
              {nameError && (
                <p className="text-red-500 text-sm mt-1">{nameError}</p>
              )}                
            </div>

            {/* 이메일 + 인증 */}
            <div>
              <label className="block mb-1 font-medium">
                이메일 <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="email"
                  placeholder="이메일을 입력해주세요"
                  className={`flex-1 border-b py-2 focus:outline-none focus:border-blue-500
                    ${emailError ? 'border-red-500' : 'border-gray-300'}
                    ${shakeEmail ? 'animate-shake' : ''}`}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => {
                    if (emailError) setEmailError("");
                  }}
                />                
                <button
                  type="button"
                  className="bg-gray-200 px-3 py-1 text-sm rounded hover:bg-gray-300"
                  disabled = {isChecking}
                  onClick={() => {
                    if (email.trim() === ""){
                      alert("이메일을 입력해주세요!");
                    } else {
                      sendEmailCode(email);
                    }
                  }}  
                >
                  코드발송
                </button>                
              </div>
              {emailError && (
                <p className="text-red-500 text-sm mt-0">{emailError}</p>
              )}
              {receiving && (
                <p className="text-red-500 text-sm mt-0">인증코드 발급 중...</p>
              )}
              {isChecking && !isVerfied && (
                <>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="인증코드"
                    className="flex-1 border-b border-gray-300 py-2 focus:outline-none focus:border-blue-500"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                  />
                  <button
                    type="button"
                    className="bg-gray-200 px-3 py-1 text-sm rounded hover:bg-gray-300"
                    onClick={() => responseEmailCode(email, code.trim())}
                  >
                    인증하기
                  </button>
                </div>
                <p className="text-red-500 text-sm mt-1">
                  {`${Math.floor(timeLeft / 60)
                    .toString()
                    .padStart(2, '0')}:${(timeLeft % 60).toString().padStart(2, '0')}`}
                </p>
                </>
              )}
            </div>

            <div>
              <label className="block mb-1 font-medium">
                닉네임 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="닉네임을 입력해주세요"
                className={`w-full border-b py-2 focus:outline-none focus:border-blue-500
                  ${nickNameError ? 'border-red-500' : 'border-gray-300'}
                  ${shakeNickName ? 'animate-shake' : ''}`}
                value={nickName}
                onChange={(e) => setNickName(e.target.value)}
                onFocus={() => {
                  if (nickNameError) setNickNameError("");
                }}
              />
              {nickNameError && (
                <p className="text-red-500 text-sm mt-1">{nickNameError}</p>
              )}
            </div>

            <div>
              <label className="block mb-1 font-medium">
                비밀번호 <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                placeholder="비밀번호를 입력해주세요"
                className={`w-full border-b py-2 focus:outline-none focus:border-blue-500
                  ${passwordError ? 'border-red-500' : 'border-gray-300'} 
                  ${shakePassword ? 'animate-shake' : ''}`}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
                onFocus={() => {
                  if (passwordError) setPasswordError("");
                }}
              />
              {passwordError && (
                <p className="text-red-500 text-sm mt-1">{passwordError}</p>
              )}
            </div>

            <div>
              <label className="block mb-1 font-medium">
                비밀번호 확인 <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                placeholder="비밀번호를 확인해주세요"
                value={checkPwd}
                className={`w-full border-b py-2 focus:outline-none focus:border-blue-500
                  ${passwordError ? 'border-red-500' : 'border-gray-300'} 
                  ${shakePassword ? 'animate-shake' : ''}`}
                onChange={(e) => {
                  setCheckPwd(e.target.value);
                }}
                onFocus={() => {
                  if (passwordError) setPasswordError("");
                }}
                onKeyDown={handleKeyDown}
              />
              {passwordError && (
                <p className="text-red-500 text-sm mt-1">{passwordError}</p>
              )}
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
