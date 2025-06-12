import Lottie from "lottie-react";
import send from "../../animations/send.json";
import Header from "../header/Header";
import { useNavigate } from "react-router-dom";
import { useSelector } from 'react-redux';
import { mainFrame } from "../../style/CommonFrame";
import { homeAnimation, sectionLayout } from "../../style/CommonHomeStyle";
import { errorpageButton, errorText, errorTitle } from "../../style/errorStyle";


const RenderError = () => {
  const navigate = useNavigate();
  const page = useSelector((state) => state.user.page);
  const category = useSelector((state) => state.user.category);

  //이전 버튼 
  const Back = () => {
    // switch(page){
    //   case "home":
    //     navigate("/dashboard/home");
    //     break;
    //   case "myPage":
    //     navigate("/dashboard/myPage");
    //     break;
    //   case "myPosts":
    //     navigate("/dashboard/myPosts");
    //     break;
    //   default:
    //     navigate("/board/" + category);
    //     break;
    // }
    navigate(-1);
  }

  return (
    <div className={mainFrame}>
      <Header />
      {/* 텍스트 영역 */}
      <div className={sectionLayout}>
        <div className={homeAnimation}>
          <Lottie animationData={send} loop={true} />
        </div>
        <div className="flex flex-col items-center justify-center text-center max-w-2xl transform transition-transform duration-500 ease-in-out origin-center">
          <h2 className={errorTitle}>시스템 오류가 발생했습니다.</h2>
          <p className={errorText}>
            죄송합니다. 이전 페이지로 돌아가시겠습니까?<br />
          </p>

          {/* 버튼 영역 */}
          <div className="mt-8 flex gap-3 flex-wrap justify-center">
            <button
              onClick={() => Back()}
              className={errorpageButton}
            >
              이전 페이지
            </button>
            <button
              onClick={() => navigate("/")}
              className={errorpageButton}
            >
              메인 페이지
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RenderError;
