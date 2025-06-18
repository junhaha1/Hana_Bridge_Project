import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from "react-router-dom";
import { setCategory } from '../../store/userSlice';
import { setIsOpenLeftHeader } from '../../store/postSlice';
import { FaFolder } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { useMediaQuery } from 'react-responsive'; // ✅ 이걸 사용

import { leftFrame } from '../../style/CommonFrame';
import { leftTitle } from '../../style/CommonLeftStyle';

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
    </aside>
  );
}
