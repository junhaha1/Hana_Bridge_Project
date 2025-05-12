import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { clearUser, clearAiChat } from "../store/userSlice";
import Lottie from "lottie-react";
import logo from "../../public/animations/logo.json";
import ApiClient from "../service/ApiClient";

const BoardHeader = () => {
  const dispatch = useDispatch();
  const email = useSelector((state) => state.user.email);
  const nickName = useSelector((state) => state.user.nickName);
  const navigate = useNavigate();

  const logoutButton = () => {
    ApiClient.userLogout()
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Server error: ${res.status}`);
        }
        console.log("Logged out successfully!");
        dispatch(clearUser());
        dispatch(clearAiChat());
        localStorage.removeItem("userState");
        navigate("/");
      })
      .catch((err) => {
        console.error("Logout error:", err);
      });
  };

  const myPageButton = () => {
    navigate("/myPage");
  };

  return (
    <header className="bg-white shadow-sm w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        {/* Logo + Title */}
        <Link to="/" className="flex items-center space-x-4 no-underline">
          <div className="w-[100px] h-[100px]">
            <Lottie animationData={logo} loop={true} />
          </div>
          <strong className="text-[50px]  text-black font-bold leading-[55px] no-underline">AIssue</strong>
        </Link>

        {/* Right-side navigation */}
        <div className="flex items-center space-x-1">
          {email === "guest@email.com" ? (
            <>
              <Link
                to="/login"
                className="px-4 py-2  text-black hover:text-blue-800 rounded no-underline text-[20px]"
              >
                로그인
              </Link>
              <Link
                to="/signup"
                className="px-4 py-2  text-black hover:text-blue-800 rounded no-underline text-[20px]"
              >
                회원가입
              </Link>
            </>
          ) : (
            <div className="relative group">
              <button className="px-4 py-2 bg-gray-100 rounded hover:bg-gray-200">
                {nickName}님 ▾
              </button>
              <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded shadow-md hidden group-hover:block z-10">
                <button
                  onClick={myPageButton}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                >
                  My Page
                </button>
                <button
                  onClick={logoutButton}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                >
                  로그아웃
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default BoardHeader;
