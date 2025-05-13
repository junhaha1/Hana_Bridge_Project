import { useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";
import Header from "../Header.jsx";
import RightSidebar from "./RightSideBar.jsx";
import Lottie from "lottie-react";
import HelloWorld from "../../../public/animations/helloworld.json";
import DashboardCards from "./DashBoardCards.jsx";
import LeftHeader from "../2.jsx";

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
      {/* 항상 보이는 헤더 */}
      <Header />

      {/* 전체 애니메이션 오버레이 */}
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

      {/* 대시보드 본문은 애니메이션이 끝난 후에만 표시 */}
      {animationDone && (
        <div className="flex flex-col md:flex-row w-full">
          {/*왼쪽 사이드바*/}
          <div className="w-60">
            <LeftHeader />
          </div>
          {/* 가운데 본문 */}
          <div className="flex-1 flex flex-col items-center justify-start gap-6 px-4 relative">
            {/* 상단 제목 + 검색 */}
            <div className="w-full max-w-5xl mt-20 md:mt-32 px-6">
              <div className="relative mb-8">
                <input
                  type="text"
                  placeholder="Search Your Board"
                  className="w-full pl-10 pr-4 py-2 rounded-full bg-white text-black placeholder-gray-400 shadow"
                />
                <span className="absolute left-3 top-2.5 text-gray-500 text-lg">🔍</span>
              </div>
              <h2 className="text-2xl font-bold mb-4">DashBoard</h2>
            </div>

            {/* 카드 컴포넌트 */}
            <DashboardCards />
          </div>

          {/* 오른쪽 사이드바 */}
          <RightSidebar />
        </div>
      )}
    </div>
  );
};

export default DashBoard;
