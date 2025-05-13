import { useEffect, useRef, useState } from "react";

import Header from "../header/Header.jsx";
import RightHeader from "../header/RightHeader.jsx";
import LeftHeader from "../header/LeftHeader.jsx";

import Lottie from "lottie-react";
import HelloWorld from "../../../public/animations/helloworld.json";

import DashboardCards from "./DashBoardCards.jsx";

const DashBoard = () => {
  const [fadeOut, setFadeOut] = useState(false);
  const [animationDone, setAnimationDone] = useState(false);
  const lottieRef = useRef();

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
    setFadeOut(true);
    setTimeout(() => setAnimationDone(true), 700);
  };

  return (
    <div className="w-screen min-h-screen bg-gradient-to-r from-indigo-900 to-purple-900 text-white overflow-auto relative">
      {/* 상단 고정 헤더 */}
      <Header />

      {/* 로딩 애니메이션 */}
      {!animationDone && (
        <div
          className={`fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-r from-indigo-900 to-purple-900
          transition-opacity duration-700 ${fadeOut ? "opacity-0 pointer-events-none" : "opacity-100"}`}
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
      {animationDone && (
        <div className="w-full flex flex-col">
          <Header />

          {/* 3열 레이아웃 구성: 좌측 / 본문 / 우측 */}
          <div className="w-full flex flex-col lg:flex-row gap-4 px-2 sm:px-6 mt-24">
            {/* Left Sidebar */}
            <div className="w-full lg:w-1/5">
              <LeftHeader />
            </div>

            {/* Main Content */}
            <div className="w-full lg:w-3/5">
              <div className="max-w-3xl mx-auto px-4 sm:px-6">
                <div className="relative mb-8">
                  <input
                    type="text"
                    placeholder="Search Your Board"
                    className="w-full pl-10 pr-4 py-2 rounded-full bg-white text-black placeholder-gray-400 shadow"
                  />
                  <span className="absolute left-3 top-2.5 text-gray-500 text-lg">🔍</span>
                </div>
                <h2 className="text-2xl font-bold mb-4">DashBoard</h2>
                <DashboardCards />
              </div>
            </div>

            {/* Right Sidebar */}
            <div className="w-full lg:w-1/5">
              <RightHeader />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashBoard;
