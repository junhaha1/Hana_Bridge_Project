import React, { useEffect, useState, useRef } from "react";
import { useSelector } from 'react-redux';
import { useNavigate, Link, useParams } from "react-router-dom";

import ApiClient from "../../service/ApiClient";
import Header from '../header/Header';
import LeftHeader from "../header/LeftHeader";
import ConfirmBoardModal from "./ConfirmBoardModal";
import MarkdownEditor from "./MarkdownEditor";

import { mainFrame, detailFrame } from "../../style/CommonFrame";
import { scrollStyle, buttonStyle, detailCardStyle } from "../../style/CommonStyle";
import { upBottom } from "../../style/CommonBoardStyle";
import { editTitle, editContent, liekCommentButton, liekComment, userDate, detailCategory, detailTitle, detailContent, backButton } from "../../style/CommonDetail";
import { FaUser, FaArrowUp  } from 'react-icons/fa';
import { BiLike, BiSolidLike } from "react-icons/bi";

const AddAssemble = () => {
  const { assembleBoardId } = useParams();
  const [board, setBoard] = useState(null);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);

  const navigate = useNavigate();
  const scrollRef = useRef(null);

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [createAt, setCreateAt] = useState(new Date());
  const [likeCount, setLikeCount] = useState(0);

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
        setTitle(data.title);
        setContent(data.content);      
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

  return (
    <div>
      <div className={mainFrame}>
            <Header />
            <div className="w-full flex md:flex-row max-md:flex-col md:mt-20">
              <LeftHeader />
              {/* 메인 콘텐츠 */}
              <main className={detailFrame}>
                <div ref={scrollRef} className={scrollStyle + " max-md:h-[65vh] md:h-[90vh] mt-1 ml-20 pr-40 max-md:m-1 max-md:p-2 max-md:overflow-x-hidden"}>
                  <button
                    onClick={() => navigate("/board/assemble")}
                    className={buttonStyle + backButton}
                  >
                    이전 나중에 수정(모달 추가)
                  </button>
      
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
                        {/* {board.nickName} */}
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
                          onClick={() => {}}>
                          등록하기 
                        </button>
                        <button 
                          className={buttonStyle +" text-red-400 text-sm hover:underline"} 
                          onClick={() => setConfirmDeleteOpen(true)}>
                          삭제하기
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
    </div>
  );
};

export default AddAssemble;