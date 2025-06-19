import { useState, useEffect, useRef} from 'react';
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from 'react-router-dom';
import { setCategory, setShouldAutoOpenHelper } from '../store/userSlice';
import { setOpenModal, setCloseModal } from '../store/modalSlice.js';
import Lottie from "lottie-react";
import Header from "./header/Header.jsx";
import LoginModal from './user/LoginModal.jsx';
import SignUpModal from "./user/SignUpModal.jsx";
import homeCodeHelper from "../animations/homecodehelper.json";
import codeHome from "../animations/codehome.json";
import assembleHome from "../animations/assemblehome.json";

import { homeFrame } from '../style/CommonFrame.jsx';
import { homeAnimation, homeButton, homeText, homeTitle, sectionBox, sectionLayout } from '../style/CommonHomeStyle.jsx';
import useScrollSnap from '../service/useScrollSnap.js';
import { FaArrowUp } from 'react-icons/fa';

const Home = () => {  
  const topSectionRef = useRef(null);
  const name = useSelector((state) => state.user.name);
  const nickName = useSelector((state) => state.user.nickName);
  const isModalOpen = useSelector((state) => state.modal.isOpen);
  const { sectionRefs, scrollToIndex } = useScrollSnap(1000, isModalOpen);
  const [currentIndex, setCurrentIndex] = useState(0); // 현재 섹션 인덱스 (방향키)

  //code helper 클릭 시 로그인 모달 이동여부
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState("login");
  const [pendingRoute, setPendingRoute] = useState("/");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  //키보드 이벤트 등록
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (isModalOpen) return; 

      if (e.key === 'ArrowDown') {
        setCurrentIndex((prevIndex) => {
          const nextIndex = Math.min(prevIndex + 1, sectionRefs.current.length - 1);
          scrollToIndex(nextIndex);
          return nextIndex;
        });
      } else if (e.key === 'ArrowUp') {
        setCurrentIndex((prevIndex) => {
          const nextIndex = Math.max(prevIndex - 1, 0);
          scrollToIndex(nextIndex);
          return nextIndex;
        });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [scrollToIndex]);

  //code helper 클릭 시에 로그인 확인
  const handleCodeHeplerClick= () => {
    if(name === 'guest'){
      //이동할 경로 설정
      setPendingRoute('/aiChat'); 
      setModalType('login');
      setModalOpen(true);
      dispatch(setOpenModal());
    } else {
      dispatch(setShouldAutoOpenHelper({shouldAutoOpenHelper: true}));
      navigate('/dashboard/home');
    }
  };

  const openModal = (type) => {
    setModalType(type);
    setModalOpen(true);
    dispatch(setOpenModal());
  };

  const closeModal = () => {
    setModalOpen(false);
    dispatch(setCloseModal());
  };

  //로그인했을 시에 해당 경로로 바로 이동
  const handleLoginSuccess = () => {
    setModalOpen(false);
    dispatch(setCloseModal());
    if (pendingRoute) {
      dispatch(setShouldAutoOpenHelper({shouldAutoOpenHelper: true}));
      navigate('/dashboard/home');
      setPendingRoute(null);
    }
  };

  const handleTopClick = () => {
    scrollToIndex(0); // 첫 번째 섹션으로 이동
  };

  return (
    <>
    <div >
    <Header/>
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
      <div id='home' className={`${!isModalOpen ? 'custom-scroll' : 'overflow-hidden'} h-screen w-screen overflow-x-hidden  bg-zinc-800`}>
        {/* 첫 번째 섹션 */}
        <section      
            ref={(el) => {          
              if (el) {
                sectionRefs.current[0] = el;
                topSectionRef.current = el;
              }
            }}
            className={sectionLayout}
          >
          <div className={sectionBox}>
            <h2 className={homeTitle}>“혼자 코딩? 이제는 Codi와 함께!”</h2>
            <p className={homeText}>
              막히는 순간, Codi가 당신의 코드 친구가 되어줄게요.
            </p>
            <a
              onClick={handleCodeHeplerClick}
              className={homeButton}
            >
              <span className="font-bold text-yellow-300">Codi</span>에게 물어보기
            </a>
          </div>
          <div className={homeAnimation}>
            <Lottie animationData={homeCodeHelper} loop={true} />
          </div>
        </section>

        {/* 두 번째 섹션 */}
        <section 
          ref={(el) => { if (el) sectionRefs.current[1] = el; }} 
          className={sectionLayout}
        >
          <div className={homeAnimation}>
            <Lottie animationData={codeHome} loop={true} />
          </div>
          <div className={sectionBox}>
            <h2 className={homeTitle}>“함께, 더 나은 개발로.”</h2>
            <p className={homeText}>
              코드를 공유하고, 학우들과 아이디어를 나누며 함께 완성해보세요.
            </p>
            <a
              href="/board/code"
              onClick={() => dispatch(setCategory({category: 'code'}))}
              className={homeButton}
            >
              코드/질문 게시판
            </a>
          </div>
        </section>

        {/* 세 번째 섹션 */}
        <section 
          ref={(el) => { if (el) sectionRefs.current[2] = el; }}
          className={sectionLayout}
        >
          <div className={sectionBox}>
            <h2 className={homeTitle}>“Codi의 답변을 보고, 함께 배워봐요.”</h2>
            <p className={homeText}>
              다른 친구들의 질문과 Codi의 답변을 보며, 나의 실력도 함께 키워보세요.
            </p>
            <a
              href="/board/assemble"
              onClick={() => dispatch(setCategory({ category: "assemble" }))}
              className={homeButton}
            >
              Codi 답변 모아보기
            </a>
          </div>
          <div className={homeAnimation}>
            <Lottie animationData={assembleHome} loop={true} />
          </div>
        </section>
        <button
          onClick={handleTopClick}
          className="fixed bottom-6 right-6 z-50 p-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full shadow-lg"
        >
          <FaArrowUp />
        </button>
      </div>
    </div>
    </>
  );
};

export default Home;