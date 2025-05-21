import { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setPlayFlag } from "../../store/userSlice.js";

import Header from "../header/Header.jsx";
import LeftHeader from "../header/LeftHeader.jsx";

import Lottie from "lottie-react";
import HelloWorld from "../../../public/animations/helloworld.json";

import DashboardCards from "./DashBoardCards.jsx";
import CodeHelper from "../Codi.jsx";

import {mainFrame} from "../../style/CommonFrame.jsx";

//대쉬보드
const DashBoard = () => {
  const [fadeOut, setFadeOut] = useState(false);
  const lottieRef = useRef();
  const playFlag = useSelector((state) => state.user.playFlag);

  const dispatch = useDispatch();
  const page = useSelector((state) => state.user.page);
  let RenderContent;

  useEffect(() => {
    if (lottieRef.current) {
      try {
        lottieRef.current.setSpeed(2);
      } catch (e) {
        console.warn("Lottie setSpeed 실패", e);
      }
    }
  }, []);

  const handleComplete = () => {
    console.log("before playFlag: " + playFlag);
    setFadeOut(true);
    setTimeout(dispatch(setPlayFlag({playFlag: false})), 700);
  };

  return (
    <div className={mainFrame}>
      <Header />
      {/* 로딩 애니메이션 */}
      {playFlag && (
        <div
          className={`fixed inset-0 z-50 flex items-center justify-center bg-zinc-800
          transition-opacity duration-700 z-[9999] ${fadeOut ? "opacity-0 pointer-events-none" : "opacity-100"}`}
        >
          <div className="bg-white rounded-full p-6 shadow-2xl">
            <Lottie
              lottieRef={lottieRef}
              animationData={HelloWorld}
              loop={false}
              onComplete={handleComplete}
              style={{ width: 500, height: 500 }}
            />
          </div>
        </div>
      )}

      {/* 대시보드 본문 */}
      {!playFlag &&(
        <>
        <div className="w-full flex flex-row mt-20">
          <LeftHeader />
          <div className="w-4/5">
            <DashboardCards />
          </div>
        </div>
        </>
      )}
    </div>
  );
};

export default DashBoard;
