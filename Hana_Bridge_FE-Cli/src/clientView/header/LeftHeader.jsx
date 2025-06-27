import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from "react-router-dom";
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

  // AI답변 게시판이 선택되었을 때 자동으로 서브메뉴 펼치기
  useEffect(() => {
    if (category === 'assemble') {
      setIsAssembleOpen(true);
    } else {
      setIsAssembleOpen(false);
    }
  }, [category]);

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
    if(category !== 'assemble'){
      dispatch(clearItem());
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
                  // assemble 게시판은 자동으로 펼쳐지므로 토글 제거
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
                            setOpenIndex(openIndex === index ? null : index);
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
