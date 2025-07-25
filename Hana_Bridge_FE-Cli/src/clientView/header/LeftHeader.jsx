import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from "react-router-dom";
import { setCategory } from '../../store/userSlice';
import { setItem, clearItem } from '../../store/userSlice';
import { setIsOpenLeftHeader } from '../../store/postSlice';
import { FaFolder, FaCog } from 'react-icons/fa';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { useMediaQuery } from 'react-responsive'; 
import { scrollStyle } from '../../style/CommonStyle';

import { leftFrame } from '../../style/CommonFrame';
import { leftTitle } from '../../style/CommonLeftStyle';


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

const boards = [
  { id: 'me', label: '내 게시판' },
  { id: 'notice', label: '공지 게시판' },
  { id: 'code', label: '코드/질문 게시판' },
  { id: 'assemble', label: 'AI답변 게시판' },
];

export default function LeftHeader() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const category = useSelector((state) => state.user.category);
  const OpenState = useSelector((state) => state.post.isOpenLeftHeader);
  const categoryName = useSelector((state) => state.user.item);
  const userRole = useSelector((state) => state.user.role);

  const isMobile = useMediaQuery({ query: '(max-width: 768px)' }); // 모바일 여부
  const [isOpen, setIsOpen] = useState(OpenState); // 모바일일 때만 토글됨

  const [openIndex, setOpenIndex] = useState(null);
  const [isAssembleOpen, setIsAssembleOpen] = useState(false);
  const scrollContainerRef = useRef(null);

  // location.state에서 전달받은 상태 처리 (명시적으로 전달된 경우에만)
  useEffect(() => {
    if (location.state?.from === "back") {
      if (location.state?.isAssembleOpen !== undefined) {
        setIsAssembleOpen(location.state.isAssembleOpen);
      } else {
        setIsAssembleOpen(false);
      }
      if (location.state?.openIndex !== undefined) {
        setOpenIndex(location.state.openIndex);
      } else {
        setOpenIndex(null);
      }
    }
  }, [location.state]);

  // location.state가 없을 때 리덕스 상태 기준으로 자동 오픈/하이라이트
  useEffect(() => {
    // 게시글 상세화면이면 무조건 assemble 오픈
    if (location.pathname.startsWith('/board/assemble/')) {
      setIsAssembleOpen(true);
      // 상위/하위 카테고리 자동 오픈
      const mainCategoryIndex = toggleData.findIndex(group => group.title === categoryName);
      if (mainCategoryIndex !== -1) {
        setOpenIndex(mainCategoryIndex);
      } else {
        for (let i = 0; i < toggleData.length; i++) {
          if (toggleData[i].items.includes(categoryName)) {
            setOpenIndex(i);
            break;
          }
        }
      }
      return;
    }
    // 기존 로직
    if (!location.state) {
      if (category === 'assemble') {
        setIsAssembleOpen(true);
        const mainCategoryIndex = toggleData.findIndex(group => group.title === categoryName);
        if (mainCategoryIndex !== -1) {
          setOpenIndex(mainCategoryIndex);
        } else {
          for (let i = 0; i < toggleData.length; i++) {
            if (toggleData[i].items.includes(categoryName)) {
              setOpenIndex(i);
              break;
            }
          }
        }
      } else {
        setIsAssembleOpen(false);
        setOpenIndex(null);
      }
    }
  }, [category, categoryName, location.state, location.pathname]);

  // 카테고리 클릭 시 스크롤 위치 조정
  useEffect(() => {
    if (openIndex !== null && scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const categoryElements = container.querySelectorAll('[data-category]');
      const targetElement = categoryElements[openIndex];
      
      if (targetElement) {
        const containerRect = container.getBoundingClientRect();
        const elementRect = targetElement.getBoundingClientRect();
        const scrollTop = container.scrollTop;
        const elementTop = elementRect.top - containerRect.top + scrollTop;
        
        // 요소가 컨테이너의 중앙에 오도록 스크롤 조정
        const containerHeight = container.clientHeight;
        const elementHeight = elementRect.height;
        const targetScrollTop = elementTop - (containerHeight / 2) + (elementHeight / 2);
        
        container.scrollTo({
          top: targetScrollTop,
          behavior: 'smooth'
        });
      }
    }
  }, [openIndex]);

  const postBoard = (id) => {
    dispatch(setCategory({ category: id }));
    if(id === 'assemble'){
      dispatch(clearItem()); // AI답변 게시판 클릭 시 전체보기로 설정
      setIsAssembleOpen((prev) => !prev); // 토글 기능
      if (!isAssembleOpen) setOpenIndex(null); // 열릴 때는 상위만 열고 하위는 닫힘
    } else {
      setIsAssembleOpen(false); // 다른 게시판 선택 시 닫기
      setOpenIndex(null);
      if(category !== 'assemble'){
        dispatch(clearItem());
      }
    }
    navigate("/board/" + id);    
  };

  const goToAdmin = () => {
    navigate("/admin");
  };

  return (
    <aside className={leftFrame}>

      {isMobile ? (
        <button
          className={`${leftTitle} w-full text-lg focus:outline-none mt-5 max-md:ml-2 max-md:mb-0  max-md:pb-0 `}
          onClick={() => {
            if (isMobile) {
              const nextOpenState = !isOpen;
              console.log("목록 토글 isOpen (LeftHeader): " + nextOpenState);
              setIsOpen(nextOpenState);
              dispatch(setIsOpenLeftHeader(nextOpenState));
            }
          }}
        >
          커뮤니티
        </button>
      ):(
        <h3 className={`${leftTitle} mt-5`}>커뮤니티</h3>
      ) }
      

      <AnimatePresence>
        {(!isMobile || isOpen) && (
          <motion.div
            className="space-y-1 mt-1"
            initial={{ height: 0, opacity: 0, y: -10 }}   // 처음엔 위에 살짝 떠 있음
            animate={{ height: 'auto', opacity: 1, y: 0 }} // 내려오며 등장
            exit={{ height: 0, opacity: 0, y: -10 }}       // 위로 사라짐
            transition={{ duration: 0.25 }}
          >
            {boards.map(({ id, label }) => (
              <button
                key={id}
                onClick={() => {
                  postBoard(id);
                }}
                className={`w-full text-left flex items-center px-3 py-1 md:py-2 rounded transition  flex justify-between ${
                  category === id
                    ? 'bg-[#C5BCFF] text-black font-bold'
                    : 'text-white hover:bg-[#C5BCFF] hover:text-gray-700'
                }`}
              > 
                <span className='flex flex-row items-center'>
                <FaFolder className="mr-2" />
                {label}
                </span>
                {(category === 'assemble' && id === 'assemble' ) && (
                  <>
                    {isAssembleOpen 
                    ? <FaChevronUp/>
                    : <FaChevronDown/>
                    }
                  </>
                )}
              </button>
            ))}

            {/* AI답변 게시판 서브메뉴 */}
            <AnimatePresence>
              {isAssembleOpen && (
                <motion.div
                  key="assemble-submenu"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`mt-1 ml-3 space-y-2 px-1 py-1`}
                >
                  <div className={`${scrollStyle} h-[40vh] `} ref={scrollContainerRef}>
                    {toggleData.map((group, index) => (
                      <div key={group.title} data-category={index}>
                        <button
                          onClick={() => {
                            if (openIndex === index) {
                              setOpenIndex(null);
                            } else {
                              setOpenIndex(index);
                            }
                            dispatch(setItem(group.title));
                            navigate("/board/assemble", {
                              state: { categoryName: group.title },
                            });
                          }}
                          className={`w-full flex justify-between items-center text-left font-semibold 
                          text-sm px-2 py-2 rounded 
                          ${categoryName ===  group.title
                              ? 'bg-gray-600  font-bold'
                              : 'text-white hover:bg-gray-600'
                          }`}
                        >
                          {group.title}
                          {openIndex === index ? <FaChevronUp /> : <FaChevronDown />}
                        </button>

                        <AnimatePresence initial={false}>
                          {openIndex === index && (
                            <motion.div
                              className="pl-4 mt-2 space-y-1 overflow-hidden"
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.2 }}
                            >
                              {group.items.map((item) => (
                                <button
                                  key={item}
                                  className={`w-full text-left text-sm px-3 py-1 rounded transition
                                    ${categoryName === item 
                                      ? 'bg-[#C5BCFF]  font-bold text-black'
                                      : 'text-white hover:bg-[#C5BCFF] hover:text-gray-700'
                                    }`}
                                  onClick={() => {
                                    dispatch(setItem(item));
                                    navigate("/board/assemble", {
                                      state: { categoryName: item },
                                    });
                                  }}
                                >
                                  {item}
                                </button>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* 관리자 메뉴 - ROLE_ADMIN인 경우에만 표시 */}
            {userRole === 'ROLE_ADMIN' && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="pt-2 border-t border-gray-600"
              >
                <button
                  onClick={goToAdmin}
                  className={`w-full text-left flex items-center px-3 py-1 md:py-2 rounded transition ${
                    category === 'admin'
                      ? 'bg-[#C5BCFF] text-black font-bold'
                      : 'text-white hover:bg-[#C5BCFF] hover:text-gray-700'
                  }`}
                >
                  <span className='flex flex-row items-center'>
                    <FaCog className="mr-2" />
                    관리자 페이지
                  </span>
                </button>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

    </aside>
  );
}
