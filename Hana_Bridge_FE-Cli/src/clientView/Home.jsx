import { useState} from 'react';
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from 'react-router-dom';
import { setCategory } from '../store/userSlice';
import Lottie from "lottie-react";
import Header from "./header/Header.jsx";

import LoginModal from './user/LoginModal.jsx';
import SignUpModal from "./user/SignUpModal.jsx";

import codeHelper from "../../public/animations/codehelper.json";
import codeHome from "../../public/animations/codehome.json";
import assembleHome from "../../public/animations/assemblehome.json";

const Home = () => {
  const name = useSelector((state) => state.user.name);
  const nickName = useSelector((state) => state.user.nickName);

  //code helper 클릭 시 로그인 모달 이동여부
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState("login");
  const [pendingRoute, setPendingRoute] = useState("/");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  //code helper 클릭 시에 로그인 확인
  const handleCodeHeplerClick= () => {
    if(name === 'guest'){
      //이동할 경로 설정
      setPendingRoute('/aiChat'); 
      setModalType('login');
      setModalOpen(true);
    } else {
      navigate('/aiChat');
    }
  };

  const openModal = (type) => {
    setModalType(type);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  //로그인했을 시에 해당 경로로 바로 이동
  const handleLoginSuccess = () => {
    setModalOpen(false);
    if (pendingRoute) {
      navigate(pendingRoute);
      setPendingRoute(null);
    }
  };

  return (
    <>
    <Header/>
    <div className="w-screen h-screen overflow-y-scroll scroll-smooth snap-y snap-mandatory">
      {modalOpen && modalType === 'login' &&(
        <LoginModal
          onClose={closeModal}
          onSwitch={openModal}
          // 로그인 성공 시 이동 처리(콜백 함수)
          onSuccess={handleLoginSuccess} 
        />
      )}
      {modalOpen && modalType === "signup" && (
        <SignUpModal onClose={closeModal} onSwitch={openModal} />
      )}

      {/* 첫 번째 섹션 */}
      <section className="w-screen h-screen snap-start flex flex-col md:flex-row items-center justify-center gap-12 bg-gradient-to-r from-indigo-900 to-purple-900 text-white px-6">
        <div className="flex flex-col items-center justify-center text-center max-w-2xl transform transition-transform duration-500 ease-in-out origin-center">
          <h2 className="text-5xl font-extrabold mb-8 leading-tight">"Ask. Review. Improve."</h2>
          <p className="text-xl mb-8 leading-relaxed">
            Post your code and get instant AI-powered feedback.
          </p>
          <a
            onClick={handleCodeHeplerClick}
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
