import React from 'react';
import { useSelector, useDispatch } from "react-redux";
import { setCategory } from '../store/userSlice';
import Lottie from "lottie-react";
import Header from "./Header.jsx";

import codeHelper from "../../public/animations/codehelper.json";
import codeHome from "../../public/animations/codehome.json";
import assembleHome from "../../public/animations/assemblehome.json";

const Home = () => {
  const nickName = useSelector((state) => state.user.nickName);
  const dispatch = useDispatch();
  return (
    <>
    <Header/>
    <div className="w-screen h-screen overflow-y-scroll scroll-smooth snap-y snap-mandatory">
      {/* 첫 번째 섹션 */}
      <section className="w-screen h-screen snap-start flex flex-col md:flex-row items-center justify-center gap-12 bg-gradient-to-r from-indigo-900 to-purple-900 text-white px-6">
        <div className="flex flex-col items-center justify-center text-center max-w-2xl transform transition-transform duration-500 ease-in-out origin-center">
          <h2 className="text-5xl font-extrabold mb-8 leading-tight">"Ask. Review. Improve."</h2>
          <p className="text-xl mb-8 leading-relaxed">
            Post your code and get instant AI-powered feedback.
          </p>
          <a
            href="/aiChat"
            className="no-underline bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-3 px-6 rounded-full text-lg"
          >
            Code Helper
          </a>
        </div>
        <div className="w-[440px] h-[440px] transform transition-transform duration-500 ease-in-out origin-center">
          <Lottie animationData={codeHelper} loop={true} />
        </div>
      </section>

      {/* 두 번째 섹션 */}
      <section className="w-screen h-screen snap-start flex flex-col md:flex-row items-center justify-center gap-12 bg-gradient-to-r from-indigo-900 to-purple-900 text-white px-6">
        <div className="w-[440px] h-[440px] transform transition-transform duration-500 ease-in-out origin-center">
          <Lottie animationData={codeHome} loop={true} />
        </div>
        <div className="flex flex-col items-center justify-center text-center max-w-2xl transform transition-transform duration-500 ease-in-out origin-center">
          <h2 className="text-5xl font-extrabold mb-8 leading-tight">"Discuss. Share. Improve – Together."</h2>
          <p className="text-xl mb-8 leading-relaxed">
            Post your code, share your thoughts, and collaborate with fellow developers.
          </p>
          <a
            href="/board/code"
            onClick={() => dispatch(setCategory({category: 'code'}))}
            className="no-underline bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-3 px-6 rounded-full text-lg"
          >
            Code Board
          </a>
        </div>
      </section>

      {/* 세 번째 섹션 */}
      <section className="w-screen h-screen snap-start flex flex-col md:flex-row items-center justify-center gap-12 bg-gradient-to-r from-indigo-900 to-purple-900 text-white px-6">
        <div className="flex flex-col items-center justify-center text-center max-w-2xl transform transition-transform duration-500 ease-in-out origin-center">
          <h2 className="text-5xl font-extrabold mb-8 leading-tight">"Ask AI. Learn Together."</h2>
          <p className="text-xl mb-8 leading-relaxed">
            Browse questions answered by AI and gain insights from others' coding challenges.
          </p>
          <a
            href="/board/assemble"
            onClick={() => dispatch(setCategory({category: 'assemble'}))}
            className="no-underline bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-3 px-6 rounded-full text-lg"
          >
            Assemble Board
          </a>
        </div>
        <div className="w-[440px] h-[440px] transform transition-transform duration-500 ease-in-out origin-center">
          <Lottie animationData={assembleHome} loop={true} />
        </div>
      </section>
    </div>
    </>
  );
};

export default Home;
