import React, { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link, useParams, useLocation } from "react-router-dom";
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
import { setCategory, setItem } from '../../store/userSlice';

// LeftHeader와 동일한 toggleData 정의
const toggleData = [
  {
    title: '프로그래밍 언어',
    items: ['Python', 'Java', 'JavaScript', 'TypeScript', 'C / C++', '기타 언어'],
  },
  {
    title: '운영체제',
    items: ['Linux', 'Ubuntu', 'CentOS', '기타 Linux 배포판', 'Windows', 'macOS', 'WSL (Windows Subsystem for Linux)'],
  },
  {
    title: '데이터베이스',
    items: ['SQL 쿼리', 'MySQL', 'Oracle', 'PostgreSQL', 'NoSQL'],
  },
  {
    title: '프레임워크',
    items: ['React', 'Spring Boot', 'Django', 'Vue.js', 'Next.js', 'Flask'],
  },
  {
    title: '클라우드',
    items: ['AWS', 'KT Cloud', 'Azure'],
  },
  {
    title: '인프라',
    items: ['Docker / 컨테이너', 'Kubernetes', 'Nginx / Apache', 'CI/CD', 'DevOps'],
  },
  {
    title: '알고리즘 & 자료구조',
    items: ['코딩 테스트', '알고리즘 이론'],
  },
  {
    title: '협업 & 도구',
    items: ['Git / GitHub'],
  },
  {
    title: '기타',
    items: ['기타 문서'],
  },
];

const DetailAssemble = () => {
  const email = useSelector((state) => state.user.email);
  const nickName = useSelector((state) => state.user.nickName);
  const role = useSelector((state) => state.user.role);
  const { assembleBoardId } = useParams();
  const location = useLocation();
  const [board, setBoard] = useState(null);
  const [isLike, setIsLike] = useState('');
  const [likeCount, setLikeCount] = useState(0);

  const myCategory = useSelector((state) => state.user.category);
  console.log("myCategory: "  + myCategory);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);

  const navigate = useNavigate();
  const scrollRef = useRef(null);
  const OpenState = useSelector((state) => state.post.isOpenLeftHeader);
  const dispatch = useDispatch();

  //비회원이 좋아요 눌렀을때 띄울 메시지 
  const [showGuestMessage, setShowGuestMessage] = useState(false);
  const handleGuestClick = () => {
    setShowGuestMessage(true);
    setTimeout(() => {
      setShowGuestMessage(false);
    }, 2000); // 2초 후 자동 사라짐
  };
  
  // 카테고리 매핑 함수
  const getCategoryDisplay = (categoryName) => {
    if (categoryName === "all") return "전체보기";
    
    const categoryMapping = {
      // 프로그래밍 언어
      "Python": "프로그래밍 언어 - Python",
      "Java": "프로그래밍 언어 - Java", 
      "JavaScript": "프로그래밍 언어 - JavaScript",
      "TypeScript": "프로그래밍 언어 - TypeScript",
      "C / C++": "프로그래밍 언어 - C / C++",
      "기타 언어": "프로그래밍 언어 - 기타 언어",
      
      // 운영체제
      "Linux": "운영체제 - Linux",
      "Ubuntu": "운영체제 - Ubuntu",
      "CentOS": "운영체제 - CentOS",
      "기타 Linux 배포판": "운영체제 - 기타 Linux 배포판",
      "Windows": "운영체제 - Windows",
      "macOS": "운영체제 - macOS",
      "WSL (Windows Subsystem for Linux)": "운영체제 - WSL (Windows Subsystem for Linux)",
      
      // 데이터베이스
      "SQL 쿼리": "데이터베이스 - SQL 쿼리",
      "MySQL": "데이터베이스 - MySQL",
      "Oracle": "데이터베이스 - Oracle",
      "PostgreSQL": "데이터베이스 - PostgreSQL",
      "NoSQL": "데이터베이스 - NoSQL",
      
      // 프레임워크
      "React": "프레임워크 - React",
      "Spring Boot": "프레임워크 - Spring Boot",
      "Django": "프레임워크 - Django",
      "Vue.js": "프레임워크 - Vue.js",
      "Next.js": "프레임워크 - Next.js",
      "Flask": "프레임워크 - Flask",
      
      // 클라우드
      "AWS": "클라우드 - AWS",
      "KT Cloud": "클라우드 - KT Cloud",
      "Azure": "클라우드 - Azure",
      
      // 인프라
      "Docker / 컨테이너": "인프라 - Docker / 컨테이너",
      "Kubernetes": "인프라 - Kubernetes",
      "Nginx / Apache": "인프라 - Nginx / Apache",
      "CI/CD": "인프라 - CI/CD",
      "DevOps": "인프라 - DevOps",
      
      // 알고리즘 & 자료구조
      "코딩 테스트": "알고리즘 & 자료구조 - 코딩 테스트",
      "알고리즘 이론": "알고리즘 & 자료구조 - 알고리즘 이론",
      
      // 협업 & 도구
      "Git / GitHub": "협업 & 도구 - Git / GitHub",
      
      // 기타
      "기타 문서": "기타 - 기타 문서"
    };
    
    return categoryMapping[categoryName] || categoryName;
  };
  
  //맨 위로가기 버튼 
  const scrollToTop = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // MyBoard에서 온 경우를 확인
  const isFromMyBoard = location.state?.from === "myBoard";
  const myBoardToggle = location.state?.toggle; // MyBoard에서 전달받은 토글 상태
  const fromCategory = location.state?.categoryName; // 이전 페이지에서 전달받은 카테고리

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

  // 게시글 상세화면 진입 시 LeftHeader 카테고리 자동 세팅
  useEffect(() => {
    if (board && board.categoryName) {
      dispatch(setCategory({ category: 'assemble' }));
      dispatch(setItem(board.categoryName));
    }
  }, [board, dispatch]);

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
                   console.log("navigate 클릭됨, myCategory:", myCategory); // 디버깅
                   console.log("fromCategory:", fromCategory); // 디버깅
                   console.log("board.categoryName:", board.categoryName); // 디버깅

                    // MyBoard에서 온 경우 MyBoard로 돌아가기
                    if (isFromMyBoard) {
                      console.log("MyBoard로 이동");
                      navigate("/board/me", { 
                        state: { 
                          from: "back", 
                          toggle: myBoardToggle, // 전달받은 토글 상태 사용
                          categoryName: board.categoryName // 카테고리 정보 추가
                        } 
                      });
                    } else if (!myCategory || myCategory.trim() === "" || myCategory === "dash") {
                      console.log("대시보드로 이동");
                      navigate("/dashboard/home");
                    } else {
                      console.log("게시판으로 이동");
                      // assemble 게시판인 경우 카테고리 정보와 함께 이동
                      if (myCategory === "assemble") {
                        // fromCategory가 있으면 그것을 사용, 없으면 board.categoryName 사용
                        const targetCategory = fromCategory || board.categoryName;
                        // openIndex 계산
                        const mainCategoryIndex = toggleData.findIndex(group => group.title === targetCategory);
                        let openIndexToSend = undefined;
                        if (mainCategoryIndex === -1) {
                          // 하위 카테고리(서브카테고리)인 경우에만 openIndex 전달
                          for (let i = 0; i < toggleData.length; i++) {
                            if (toggleData[i].items.includes(targetCategory)) {
                              openIndexToSend = i;
                              break;
                            }
                          }
                        }
                        navigate(`/board/${myCategory}`, { 
                          state: { 
                            from: "back", 
                            categoryName: targetCategory,
                            isAssembleOpen: true,
                            ...(openIndexToSend !== undefined ? { openIndex: openIndexToSend } : {})
                          } 
                        });
                      } else {
                        navigate(`/board/${myCategory}`, { state: { from: "back" } });
                      }
                    }
                }}
                className={buttonStyle + backButton}
              >
                이전
              </button>

              <div className={detailCardStyle}>
                <div className={detailCategory}>AI답변 게시판 &gt; {getCategoryDisplay(board.categoryName)}</div>

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
