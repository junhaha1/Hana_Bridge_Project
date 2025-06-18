import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setCategory } from '../../store/userSlice';
import { useRef, useEffect } from "react";

import { FaArrowUp  } from 'react-icons/fa';
import { upBottom } from "../../style/CommonBoardStyle";
import { scrollStyle } from "../../style/CommonStyle";
import { FaQuestionCircle} from "react-icons/fa";

import {dashCardContent, dashCardStyle, dashCardTitle, dashCardTopLayout} from "../../style/DashBoardStyle";

const DashboardCards = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const scrollRef = useRef(null);
  const OpenState = useSelector((state) => state.post.isOpenLeftHeader);

  //맨 위로가기 버튼 
  const scrollToTop = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const boards = [
    { id: 'me', title: "내 게시판", content: '내가 쓴 글을 모아볼 수 있어요.' },
    { id: 'notice', title: "공지 게시판", content: '중요한 공지사항이 올라와요.' },
    { id: 'code', title: "코드/질문 게시판", content: '막히는 코드, 궁금한 개념을 자유롭게 질문하세요.'  },
    { id: 'assemble', title: "Codi 답변 모아보기", content: 'AI Codi가 답변한 글들을 모아볼 수 있어요.'  },
  ];


  const postBoard = (id) => {
    dispatch(setCategory({ category: id }));
    navigate("/board/" + id);
  }; 

  return (
    <div ref={scrollRef} className={`${scrollStyle}  ${OpenState ? 'max-md:h-[63vh] md:h-full ' : 'max-md:h-[83vh]'} pt-8 pb-8 ml-20 pr-40 max-md:m-1 max-md:p-2 max-md:overflow-x-hidden`}>
      <div className="backdrop-blur-sm bg-white/10 border p-5 border-white/20 rounded-2xl text-center text-white shadow-2xl max-md:!p-3">
        <div className="mb-6 text-left space-y-4 text-xl font-semibold leading-snug max-md:space-y-3">
          <p className="flex items-center gap-2 max-md:text-base"><FaQuestionCircle className="text-yellow-300 size-6 shrink-0 max-md:size-5" />혼자 공부하는 게 막막하지 않으셨나요?</p>
          <p className="flex items-center gap-2 max-md:text-base"><FaQuestionCircle className="text-yellow-300 size-6 shrink-0 max-md:size-5" />수업 들을 때 한번 놓치면 따라가기 힘들진 않으셨나요?</p>
          <p className="flex items-center gap-2 max-md:text-base"><FaQuestionCircle className="text-yellow-300 size-6 shrink-0 max-md:size-5" />에러는 쏟아지고, 구글링도 한계가 느껴지진 않으셨나요?</p>
          <p className="flex items-center gap-2 max-md:text-base"><FaQuestionCircle className="text-yellow-300 size-6 shrink-0 max-md:size-5" />내가 짠 코드, 왜 이렇게 돌아가는 건지 이해 안 되진 않으셨나요?</p>
        </div>

        <div className="mt-8 text-white font-semibold leading-relaxed max-md:mt-4">
          <p>그럴 땐, <span className="text-yellow-300">AI 친구 <strong>Codi</strong></span>에게 물어보세요.</p>
          <p>코드 리뷰부터 개념 설명까지, Codi가 함께 고민해드립니다.</p>
        </div>
      </div>
      <div className="mt-12 text-left text-white text-lg leading-relaxed max-md:mt-6 max-md:text-base max-md:p-2">
        <p className="mb-2">이 사이트에는 <span className="text-yellow-300 font-semibold">Codi AI</span>의 답변뿐 아니라,</p>
        <p className="mb-2">여러분의 <strong className="text-indigo-300">코딩 질문</strong>, <strong className="text-indigo-300">공지사항</strong>, <strong className="text-indigo-300">내가 쓴 글</strong>도</p>
        <p className="">모두 모아서 확인할 수 있는 게시판이 준비되어 있어요.</p>
      </div>
      {boards.map(({id, title, content}) => (
        <div
          key={id}
          className={dashCardStyle}
          onClick={() => postBoard(id)}
        >
          <div className = {dashCardTopLayout}>
            <h3
              className= {dashCardTitle}
            >
              {title}
            </h3>
          </div>
          <p className={dashCardContent}>
            {content}
          </p>
        </div>
      ))}
      <button
        onClick={scrollToTop}
        className={upBottom}
      >
        <FaArrowUp />
      </button>
    </div>
  );
};

export default DashboardCards;
