import React, { useEffect, useState, useRef } from "react";
import { useSelector } from 'react-redux';
import { useNavigate, useLocation , useParams } from "react-router-dom";

import ApiClient from "../../service/ApiClient";
import Header from '../header/Header';
import LeftHeader from "../header/LeftHeader";
import ConfirmAssembleModal from "./ConfirmAssembleModal";
import MarkdownEditor from "./MarkdownEditor";

import { mainFrame, detailFrame } from "../../style/CommonFrame";
import { scrollStyle, buttonStyle, detailCardStyle } from "../../style/CommonStyle";
import { upBottom } from "../../style/CommonBoardStyle";
import { editTitle, editContent, liekCommentButton, liekComment, userDate, detailCategory, detailTitle, detailContent, backButton } from "../../style/CommonDetail";
import { FaUser, FaArrowUp  } from 'react-icons/fa';
import { BiLike, BiSolidLike } from "react-icons/bi";
import { FaLightbulb } from "react-icons/fa";

const AddAssemble = () => {
  const { assembleBoardId } = useParams();
  const location = useLocation();
  const { assembleTitle, assembleContent } = location.state || {};
  //const [board, setBoard] = useState(null);

  const navigate = useNavigate();
  const scrollRef = useRef(null);

  const [title, setTitle] = useState(assembleTitle);
  const [content, setContent] = useState(assembleContent);
  const [createAt, setCreateAt] = useState(new Date());
  const [likeCount, setLikeCount] = useState(0);
  const nickName = useSelector((state) => state.user.nickName);

  //질문 tip
  const [isHovered, setIsHovered] = useState(false);
  //초기 안내 메시지
  const [showMessage, setShowMessage] = useState(false);

  //취소, 이전 확인 모달
  const [confirmCancelOpen, setConfirmCancelOpen] = useState(false);
  const [confirmBackOpen, setConfirmBackOpen] = useState(false);

  //맨 위로가기 버튼 
  const scrollToTop = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  //안내 메시지 시간
  useEffect(() => {
    setShowMessage(true);
    const timer = setTimeout(() => {
      setShowMessage(false);
    }, 3000); // 3000ms = 3초 후 메시지 숨김
    return () => clearTimeout(timer);
  }, []);

  const saveAssemble =() =>{
    ApiClient.saveAssemble(title, 'assemble', content, createAt)
    .then(async (res) => {
      if (!res.ok) throw new Error(`서버 오류: ${res.status}`);
      return res.json();      
    })
    .then((data) => {      
      const assembleBoardId  = data.assembleBoardId;
      //console.log(assembleBoardId);
      navigate(`/detailAssemble/${assembleBoardId}`);
    })
    .catch((err) => {
      alert("게시글 포스팅 실패");
      console.error("API 요청 실패:", err)
    });    
  }

  return (
    <div>
      <div className={mainFrame}>
        <Header />
        <div className="w-full flex md:flex-row max-md:flex-col md:mt-20">
          <LeftHeader />
          {/* 메인 콘텐츠 */}
          <main className={detailFrame}>
            {showMessage && (
              <div className="absolute top-[7%] left-1/2 ml-40 transform -translate-x-1/2 bg-red-300 rounded-full text-black font-semibold p-2 z-50">
                해당 화면을 나가면 내용이 사라집니다
              </div>
            )}
            <div ref={scrollRef} className={scrollStyle + " max-md:h-[65vh] md:h-[90vh] mt-1 ml-20 pr-40 max-md:m-1 max-md:p-2 max-md:overflow-x-hidden"}>
              <div className="flex flex-row items-center gap-2 w-1/2 md:mt-12 mb-3 relative">
                <button
                  onClick={() => setConfirmBackOpen(true)}
                  className={buttonStyle + ' bg-white/95 font-semibold text-indigo-900 hover:!bg-[#C5BCFF] hover:text-black text-sm px-4 !py-1'}
                >
                  이전
                </button>
                <div
                  className="relative z-[9999]"
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                >
                  <button className="flex flex-row items-center m-1 p-1 text-white rounded-full hover:bg-zinc-600 hover:shadow-md">
                    <FaLightbulb className="m-0.5" />
                    Tip
                  </button>
                  <div
                    className={`absolute top-full left-0 mt-1 px-3 py-2 text-sm text-white bg-gray-900 rounded shadow-lg whitespace-nowrap transition-opacity z-[9999]`}
                    style={{ opacity: isHovered ? 1 : 0 }}
                  >
                    <span className="text-yellow-400 font-semibold">마크다운</span> 문법으로 글을 작성하면 <br/>  
                    <span className="text-yellow-400 font-semibold">실시간 미리보기</span>를 통해 결과물을 볼 수 있어요!
                  </div>
                </div>
              </div>
  
              <div className={detailCardStyle}>
                <div className={detailCategory}>AI답변 게시판 &gt; 상세글</div>
  
                {/* <h2 className={detailTitle}>{board.title}</h2> */}
                <input
                  type="text"
                  className={editTitle}
                  placeholder="제목을 입력해주세요"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
                <div className={userDate}>
                  <span className='flex gap-1'>
                    <FaUser
                    className="mt-0.5"
                    />
                    {nickName}
                  </span>
                  <span className='text-xs text-gray-300 mt-1'>
                    {new Date(createAt).toISOString().slice(0, 16).replace('T', ' ')}
                  </span>                  
                </div>
                <div className="border-t border-white/10 mb-3" />
  
                <div className="text-white">
                  <MarkdownEditor content={content} onChange={setContent} />
                </div>
  
                {/* 좋아요, 댓글, 삭제 */}
                <div className={liekCommentButton}>
                  <div className={liekComment + " text-white"}>
                    <span
                      className="relative cursor-pointer flex items-center gap-1"
                      onClick={() => {}}
                    >                    
                      <BiLike className="size-5 "/>
                      {likeCount}
                    </span>
                  </div>
                  <div className="flex-row">
                    <button 
                      className={buttonStyle +" text-green-400 text-sm hover:underline mr-3"} 
                      onClick={() => saveAssemble()}>
                      등록하기 
                    </button>
                    <button 
                      className={buttonStyle +" text-red-400 text-sm hover:underline"} 
                      onClick={() => setConfirmCancelOpen(true)}>
                      취소하기 
                    </button>
                  </div>
                </div>              
              </div>
            </div>
            <button
              onClick={scrollToTop}
              className={upBottom}
            >
              <FaArrowUp />
            </button>
          </main>
        </div>           
      </div>
      {/* 취소 확인 모달 */}
      {confirmCancelOpen && (
        <ConfirmAssembleModal
          onConfirm={() => {
            //boardDeleteButton(assembleBoardId);
            setConfirmCancelOpen(false);
            navigate("/board/assemble");
          }}
          onCancel={() => setConfirmCancelOpen(false)}
          onMode={"cancel"}
        />
      )}
      {/* 이전 확인 모달 */}
      {confirmBackOpen && (
        <ConfirmAssembleModal
          onConfirm={() => {
            //boardDeleteButton(assembleBoardId);
            setConfirmBackOpen(false);
            navigate("/board/assemble");
          }}
          onCancel={() => setConfirmBackOpen(false)}
          onMode={"back"}
        />
      )}
    </div>
  );
};

export default AddAssemble;