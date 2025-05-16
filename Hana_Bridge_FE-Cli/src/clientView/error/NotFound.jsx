import React from "react";
import Lottie from "lottie-react";
import logo from "../../../public/animations/404.json";
import Header from "../header/Header";
import { useNavigate } from "react-router-dom";
import { useSelector } from 'react-redux';



const NotFounded = () => {
  const navigate = useNavigate();
  const page = useSelector((state) => state.user.page);
  const category = useSelector((state) => state.user.category);

  //이전 버튼 
  const Back = () => {
    switch(page){
      case "home":
        navigate("/dashboard/home");
        break;
      case "myPage":
        navigate("/dashboard/myPage");
        break;
      case "myPosts":
        navigate("/dashboard/myPosts");
        break;
      default:
        navigate("/board/" + category);
        break;
    }
  }

  return (
    <div className="relative min-h-screen flex flex-col lg:flex-row items-center justify-center bg-gradient-to-b from-indigo-900 to-purple-900 text-white overflow-hidden px-4">
      <Header />
      {/* 텍스트 영역 */}
      <div className="w-[440px] h-[440px] transform transition-transform duration-500 ease-in-out origin-center">
        <Lottie animationData={logo} loop={true} />
      </div>
      <div className="flex flex-col items-center justify-center text-center max-w-2xl transform transition-transform duration-500 ease-in-out origin-center">
        <h2 className="text-2xl md:text-3xl font-semibold mt-2">페이지를 찾을 수 없습니다.</h2>
        <p className="text-white/80 mt-4 text-sm md:text-base">
          페이지가 존재하지 않거나, 사용할 수 없는 페이지 입니다.<br />
          입력하신 주소가 정확한지 다시 한번 확인해주세요.
        </p>

        {/* 버튼 영역 */}
        <div className="mt-8 flex gap-3 flex-wrap justify-center">
          <button
            onClick={() => Back()}
            className="bg-white hover:!bg-[#C5BCFF] hover:text-black px-4 py-2 rounded-md text-sm font-semibold text-indigo-900 transition-colors duration-300"
          >
            이전 페이지
          </button>
          <button
            onClick={() => navigate("/")}
            className="bg-white hover:!bg-[#C5BCFF] hover:text-black px-4 py-2 rounded-md text-sm font-semibold text-indigo-900 transition-colors duration-300"
          >
            메인 페이지
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFounded;
