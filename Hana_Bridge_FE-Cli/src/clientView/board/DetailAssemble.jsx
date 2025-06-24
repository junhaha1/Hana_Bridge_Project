import React, { useEffect, useState, useRef } from "react";
import { useSelector } from 'react-redux';
import { useNavigate, Link, useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from 'remark-gfm'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { prism } from 'react-syntax-highlighter/dist/esm/styles/prism';

import ApiClient from "../../service/ApiClient";
import Header from '../header/Header';
import LeftHeader from "../header/LeftHeader";
import ConfirmBoardModal from "./ConfirmBoardModal";

import { mainFrame, detailFrame } from "../../style/CommonFrame";
import { scrollStyle, buttonStyle, detailCardStyle } from "../../style/CommonStyle";
import { upBottom } from "../../style/CommonBoardStyle";
import { liekCommentButton, liekComment, userDate, detailCategory, detailTitle, backButton } from "../../style/CommonDetail";
import { FaUser, FaArrowUp  } from 'react-icons/fa';
import { BiLike, BiSolidLike } from "react-icons/bi";

const DetailAssemble = () => {
  const email = useSelector((state) => state.user.email);
  const nickName = useSelector((state) => state.user.nickName);
  const role = useSelector((state) => state.user.role);
  const { assembleBoardId } = useParams();
  const [board, setBoard] = useState(null);
  const [isLike, setIsLike] = useState('');
  const [likeCount, setLikeCount] = useState(0);

  const myCategory = useSelector((state) => state.user.category);
  console.log("myCategory: "  + myCategory);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);

  const navigate = useNavigate();
  const scrollRef = useRef(null);
  const OpenState = useSelector((state) => state.post.isOpenLeftHeader);

  //비회원이 좋아요 눌렀을때 띄울 메시지 
  const [showGuestMessage, setShowGuestMessage] = useState(false);
  const handleGuestClick = () => {
    setShowGuestMessage(true);
    setTimeout(() => {
      setShowGuestMessage(false);
    }, 2000); // 2초 후 자동 사라짐
  };
  
  //맨 위로가기 버튼 
  const scrollToTop = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    ApiClient.getAssembleBoard(assembleBoardId)
      .then(async (res) => {
        if (!res.ok) {
          const errorData = await res.json();
          const error = new Error(errorData.message || `서버 오류: ${res.status}`);
          error.code = errorData.code;
          throw error;
        }
        return res.json();
      })
      .then((data) => {
        console.log(data);
        setBoard(data);        
        setLikeCount(data.likeCount);
        setIsLike(data.goodCheck);
      })
      .catch((err) => {
        console.error("API 요청 실패:", err);
        if (err.code && err.code.includes('NOT_FOUND')) {
          navigate("/error");
        }
      });
  }, [assembleBoardId]);

  const boardDeleteButton = (assembleBoardId) => {
    ApiClient.deleteAssembleBoard(assembleBoardId)
      .then(async (res) => {
        if (!res.ok) {
          const errorData = await res.json();
          const error = new Error(errorData.message || `서버 오류: ${res.status}`);
          error.code = errorData.code;
          throw error;
        }
        navigate("/board/notice");
      })
      .catch((err) => {
        console.error("API 요청 실패:", err);
        if (err.code && err.code.includes('NOT_FOUND')) {
          navigate("/error");
        }
      });
  };

  const handleLike = (assembleBoardId) => {
    ApiClient.sendAssembleGood(assembleBoardId)
      .then(async (res) => {
        if (!res.ok) {
          const errorData = await res.json();
          const error = new Error(errorData.message || `서버 오류: ${res.status}`);
          error.code = errorData.code;
          throw error;
        }
        return res.json();
      })
      .then((data) => {
        setIsLike(data.goodCheck);
        setLikeCount(data.likeCount);
      })
      .catch((err) => {
        console.error("좋아요 실패:", err);
      });
  };

  const handleCancelLike = (assembleBoardId) => {
    ApiClient.deleteAssembleGood(assembleBoardId)
      .then(async (res) => {
        if (!res.ok) {
          const errorData = await res.json();
          const error = new Error(errorData.message || `서버 오류: ${res.status}`);
          error.code = errorData.code;
          throw error;
        }
        return res.json();
      })
      .then((data) => {
        setIsLike(data.goodCheck);
        setLikeCount(data.likeCount);
      })
      .catch((err) => {
        console.error("좋아요 취소 실패:", err);
      });
  };

  return (
    <div className={mainFrame}>
      <Header />
      <div className="w-full flex md:flex-row max-md:flex-col md:mt-20">
        <LeftHeader />
        {/* 메인 콘텐츠 */}
        <main className={detailFrame}>
          <div 
            ref={scrollRef} 
            className={`${scrollStyle} ${OpenState ? 'max-md:h-[63vh] md:h-full ' : 'max-md:h-[83vh]'} 
              mt-1 ml-20 pr-40 max-md:m-1 max-md:p-2 max-md:overflow-x-hidden`}
            >
            {!board ? 
            (
              <div className="text-white text-center mt-10">불러오는 중...</div>
            ):(
              <>
              <button
              onClick={() => {
                   console.log("navigate 클릭됨, category:", myCategory); // 디버깅

                    if (!myCategory || myCategory.trim() === "" || myCategory === "dash") {
                      console.log("대시보드로 이동");
                      navigate("/dashboard/home");
                    } else {
                      console.log("게시판으로 이동");
                       navigate(`/board/${myCategory}`, { state: { from: "back", toggle: "assemble" } })
                    }
                }}
                className={buttonStyle + backButton}
              >
                이전
              </button>

              <div className={detailCardStyle}>
                <div className={detailCategory}>AI답변 게시판 &gt; {board.categoryName === "all" ? 상세글 : board.categoryName}</div>

                <h2 className={detailTitle}>{board.title}</h2>
                <div className={userDate}>
                  <span className='flex gap-1'>
                    <FaUser
                    className="mt-0.5"
                    />
                    {board.nickName}
                  </span>
                  <span className='text-xs text-gray-300 mt-1'>
                    {new Date(board.createAt).toISOString().slice(0, 16).replace('T', ' ')}
                  </span>                  
                </div>
                <div className="border-t border-white/10 mb-3" />

                <div className="text-white">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      code({ inline, className, children, ...props }) {
                        const match = /language-(\w+)/.exec(className || '');
                        return !inline && match ? (
                          <SyntaxHighlighter
                            {...props}
                            style={prism}
                            language={match[1]}
                            PreTag="div"
                            className="rounded overflow-x-auto"
                          >
                            {String(children).replace(/\n$/, '')}
                          </SyntaxHighlighter>
                        ) : (
                          <code {...props} className={`${className} bg-gray-800 text-white px-1 rounded`}>
                            {children}
                          </code>
                        );
                      },
                    }}
                  >
                    {board.content}
                  </ReactMarkdown>
                </div>

                {/* 좋아요, 댓글, 삭제 */}
                <div className={liekCommentButton}>
                  <div className={liekComment + " text-white"}>
                    <span
                      className="relative cursor-pointer flex items-center gap-1"
                      onClick={() => {
                        if (nickName === 'guest') {
                          handleGuestClick();
                        } else {
                          isLike ? handleCancelLike(assembleBoardId) : handleLike(assembleBoardId);
                        }
                      }}
                    >                    
                      {isLike ? <BiSolidLike className="size-5 "/> : <BiLike  className="size-5 "/>}
                      {likeCount}

                      {showGuestMessage && (
                        <div className="absolute bottom-full mb-2 
                          w-[280px]  py-2 text-sm bg-black text-white rounded-lg shadow-lg 
                          text-center">
                          ⚠ 비회원은 이용할 수 없는 기능입니다.
                        </div>
                      )}
                    </span>
                  </div>

                  {(nickName === board.nickName || role === "ROLE_ADMIN") && (
                    <button 
                      className={buttonStyle +" text-red-400 text-sm hover:underline"} 
                      onClick={() => setConfirmDeleteOpen(true)}>
                      삭제하기
                    </button>
                  )}
                </div>              
              </div>
              </>
            )}            
          </div>
          <button
            onClick={scrollToTop}
            className={upBottom}
          >
            <FaArrowUp />
          </button>
        </main>
      </div>
      {/* 삭제 확인 모달 */}
      {confirmDeleteOpen && (
        <ConfirmBoardModal
          onConfirm={() => {
            boardDeleteButton(assembleBoardId);
            setConfirmDeleteOpen(false);
          }}
          onCancel={() => setConfirmDeleteOpen(false)}
          onMode={"delete"}
        />
      )}
    </div>
  );
};

export default DetailAssemble;
