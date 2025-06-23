import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from "react-router-dom";
import { setCategory } from '../../store/userSlice';
import { setItem } from '../../store/userSlice';
import { setIsOpenLeftHeader } from '../../store/postSlice';
import { FaFolder } from 'react-icons/fa';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { useMediaQuery } from 'react-responsive'; // ✅ 이걸 사용

import { leftFrame } from '../../style/CommonFrame';
import { leftTitle } from '../../style/CommonLeftStyle';


const toggleData = [
  {
    title: '프로그래밍 언어',
    items: ['Python', 'Java', 'JavaScript', 'TypeScript', 'C / C++', '기타 언어'],
  },
  {
    title: '운영체제',
    items: ['Ubuntu', 'CentOS', '기타 Linux 배포판', 'Windows', 'macOS', 'WSL (Windows Subsystem for Linux)'],
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
    items: ['기타'],
  },
];

function ToggleCategoryList() {
  const [openIndex, setOpenIndex] = useState(null);
  const dispatch = useDispatch();

  return (
    <div className="mt-4 space-y-2 px-1 py-1 border rounded">
      {toggleData.map((group, index) => (
        <div key={group.title}>
          <button
            onClick={() => setOpenIndex(openIndex === index ? null : index)} //여기에 상위 카테고리만 넣었을 시 그걸로 카테고리 설정하는 코드도 추가 
            className="w-full flex justify-between items-center text-left text-white font-semibold text-sm px-2 py-2 rounded hover:bg-gray-600"
          >
            {group.title}
            {openIndex === index ? <FaChevronUp /> : <FaChevronDown />}
          </button>

          <AnimatePresence initial={false}>
            {openIndex === index && (
              <motion.div
                className="pl-4 mt-2 space-y-1"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                {group.items.map((item) => (
                  <button
                    key={item}
                    className="w-full text-left text-white text-sm px-3 py-1 rounded hover:bg-[#C5BCFF] hover:text-black transition"
                    onClick={() => {
                      console.log(`카테고리 선택됨: ${item}`);
                      //리덕스에 아이템 넣기 
                      dispatch(setItem(item));
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
  );
}


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

  const isMobile = useMediaQuery({ query: '(max-width: 768px)' }); // ✅ 모바일 여부
  const [isOpen, setIsOpen] = useState(OpenState); // 모바일일 때만 토글됨

  const postBoard = (id) => {
    dispatch(setCategory({ category: id }));
    navigate("/board/" + id);
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
                onClick={() => postBoard(id)}
                className={`w-full text-left flex items-center px-3 py-1 md:py-2 rounded transition ${
                  category === id
                    ? 'bg-[#C5BCFF] text-black font-bold'
                    : 'text-white hover:bg-[#C5BCFF] hover:text-gray-700'
                }`}
              >
                <FaFolder className="mr-2" />
                {label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {category === 'assemble' && (
        <div>
          <ToggleCategoryList />
        </div>
      )}
    </aside>
  );
}
