import React, { useEffect, useState, useRef } from "react";
import { useSelector } from 'react-redux';
import { useNavigate, useLocation , useParams } from "react-router-dom";

import ApiClient from "../../service/ApiClient";
import Header from '../header/Header';
import LeftHeader from "../header/LeftHeader";
import ConfirmAssembleModal from "./ConfirmAssembleModal";
import MarkdownEditor from "./MarkdownEditor";
import TipModal from "./TipModal";

import { mainFrame, detailFrame } from "../../style/CommonFrame";
import { scrollStyle, buttonStyle, detailCardStyle } from "../../style/CommonStyle";
import { upBottom } from "../../style/CommonBoardStyle";
import { editTitle, editContent, liekCommentButton, liekComment, userDate, detailCategory, detailTitle, detailContent, backButton } from "../../style/CommonDetail";
import { FaUser, FaArrowUp, FaChevronDown, FaChevronUp  } from 'react-icons/fa';
import { BiLike, BiSolidLike } from "react-icons/bi";
import { FaLightbulb } from "react-icons/fa";

const categoryOptions = [
  {
    label: "프로그래밍 언어",
    items: ["Python", "Java", "JavaScript", "TypeScript", "C / C++", "기타 언어"],
  },
  {
    label: "운영체제",
    items: ["Linux", "Ubuntu", "CentOS", "기타 Linux 배포판", "Windows", "macOS", "WSL (Windows Subsystem for Linux)"],
  },
  {
    label: "데이터베이스",
    items: ["SQL 쿼리", "MySQL", "Oracle", "PostgreSQL", "NoSQL"],
  },
  {
    label: "프레임워크",
    items: ["React", "Spring Boot", "Django", "Vue.js", "Next.js", "Flask"],
  },
  {
    label: "클라우드",
    items: ["AWS", "KT Cloud", "Azure"],
  },
  {
    label: "인프라",
    items: ["Docker / 컨테이너", "Kubernetes", "Nginx / Apache", "CI/CD", "DevOps"],
  },
  {
    label: "알고리즘 & 자료구조",
    items: ["코딩 테스트", "알고리즘 이론"],
  },
  {
    label: "협업 & 도구",
    items: ["Git / GitHub"],
  },
  {
    label: "기타",
    items: ["기타 문서"],
  },
];

function CategorySelector({ categoryName, setCategoryName }) {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <div className="text-white border border-gray-100 rounded p-3 mb-4">
      <p className="text-sm mb-2">카테고리를 선택하세요</p>
      {categoryOptions.map((group, index) => (
        <div key={group.label} className="mb-2">
          <button
            type="button"
            onClick={() => setOpenIndex(openIndex === index ? null : index)}
            className="w-full flex justify-between items-center font-semibold text-sm bg-gray-700 px-3 py-1 rounded hover:bg-gray-600"
          >
            {group.label}
            {openIndex === index ? <FaChevronUp /> : <FaChevronDown />}
          </button>

          {openIndex === index && (
            <div className="mt-2 pl-4 space-y-1">
              {group.items.map((item) => (
                <label key={item} className="block text-sm">
                  <input
                    type="radio"
                    name="categoryName" // 동일한 name으로 묶어야 radio 기능이 동작함
                    value={item}
                    checked={categoryName === item}
                    onChange={() => setCategoryName(item)}
                    className="mr-2"
                  />
                  {item}
                </label>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}



const AddAssemble = () => {
  const location = useLocation();
  const { assembleTitle, assembleContent, assembleCategoryName } = location.state || {};
  //const [board, setBoard] = useState(null);

  const navigate = useNavigate();
  const scrollRef = useRef(null);

  const [title, setTitle] = useState(assembleTitle);
  const [content, setContent] = useState(assembleContent);
  const [categoryName, setCategoryName] = useState(assembleCategoryName || 'all');
  const [createAt, setCreateAt] = useState(new Date());
  const likeCount = 0;
  const nickName = useSelector((state) => state.user.nickName);

  //질문 tip
  const [isHovered, setIsHovered] = useState(false);
  //초기 안내 메시지
  const [showMessage, setShowMessage] = useState(false);

  //취소, 이전 확인 모달
  const [confirmCancelOpen, setConfirmCancelOpen] = useState(false);
  const [confirmBackOpen, setConfirmBackOpen] = useState(false);
  const [confirmSaveOpen, setConfirmSaveOpen] = useState(false);

  //tip 설명 모달
  const [tipModal, setTipModal] = useState(false);

  //유효성 검사 
  const [titleError, setTitleError] = useState("");
  const [contentError, setContentError] = useState("");

  const OpenState = useSelector((state) => state.post.isOpenLeftHeader);

  const [showCategorySelector, setShowCategorySelector] = useState(false);


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
    let isValid = true;

    if (!title || !title.trim()) {
      setTitleError("제목은 필수 입력항목입니다.");
      isValid = false;
    }

    if (!content || !content.trim()) {
      setContentError("내용은 필수 입력항목입니다.");
      isValid = false;
    }

    console.log("titleError: " + titleError + " contentError: " + contentError + "  isVaild: " + isValid);

    if (!isValid) return;


    ApiClient.saveAssemble(title, 'assemble', content, createAt, categoryName)
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
              <div className="absolute md:top-[100px] md:left-1/2 md:ml-40 max-md:left-1/2 max-md:whitespace-nowrap transform -translate-x-1/2 bg-zinc-900 rounded-full text-sm text-white font-semibold py-1 px-2 z-50">
                해당 화면을 나가면 내용이 사라집니다
              </div>
            )}
            <div ref={scrollRef} className={`${scrollStyle} ${OpenState ? 'max-md:h-[63vh] ' : 'max-md:h-[83vh]'} md:h-[90vh] mt-1 ml-20 pr-40 max-md:m-1 max-md:p-2 max-md:overflow-x-hidden`}>
              <div className="flex flex-row items-center gap-2 w-1/2 md:mt-12 mb-3 relative">
                <button
                  onClick={() => setConfirmBackOpen(true)}
                  className={buttonStyle + ' bg-white/95 font-semibold text-indigo-900 hover:!bg-[#C5BCFF] hover:text-black text-sm px-4 !py-1'}
                >
                  이전
                </button>
                <div
                  className="relative "
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                >
                  <button 
                    onClick={() => setTipModal(true)}
                    className="flex flex-row items-center m-1 p-1 text-white rounded-full hover:bg-zinc-600 hover:shadow-md"
                  >
                    <FaLightbulb className="m-0.5" />
                    Tip
                  </button>
                </div>
              </div>
  
              <div className={`border-b-2 py-3 bg-white/5 border-white/70 mb-24 rounded-t-md p-4 w-full break-words whitespace-pre-wrap overflow-hidden`}>
                <div className={detailCategory}>AI답변 게시판 &gt; {categoryName === "all" ? '상세글' : categoryName}</div>

                  <div className="mb-3">
                  <input
                    type="text"
                    className={editTitle}
                    placeholder="제목을 입력해주세요"
                    value={title}
                    onChange={(e) => {
                      setTitle(e.target.value);
                      if (titleError) setTitleError(""); // 수정 시 에러 제거
                    }}
                  />
                  {titleError && (
                    <p className="text-red-500 text-sm mt-1">{titleError}</p>
                  )}
                </div>
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

                <p
                  className="text-white font-semibold cursor-pointer hover:text-[#C5BCFF] flex flex-row"
                  onClick={() => setShowCategorySelector((prev) => !prev)}
                >
                  카테고리 - <span className="text-yellow-400">{categoryName}  </span><span>{showCategorySelector ? (<FaChevronUp className="mt-1 text-gray-400"/>) : (<FaChevronDown className="mt-1 text-gray-400"/>)}</span>
                </p>

                {showCategorySelector && (
                  <CategorySelector
                    categoryName={categoryName}
                    setCategoryName={setCategoryName}
                  />
                )}
  
                <div className="text-white">
                  {/* <MarkdownEditor content={content} onChange={setContent} /> */}
                  <MarkdownEditor
                    content={content}
                    onChange={(value) => {
                      setContent(value);
                      if (contentError) setContentError("");
                    }}
                  />
                  {contentError && (
                    <p className="text-red-500 text-sm mt-1">{contentError}</p>
                  )}
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
                      className={buttonStyle +" text-green-400 md:text-base max-md:text-sm hover:underline mr-3"} 
                      onClick={() => {setConfirmSaveOpen(true); console.log('등록')}}>
                      등록하기 
                    </button>
                    <button 
                      className={buttonStyle +" text-red-400 md:text-base max-md:text-sm hover:underline"} 
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
      {/* tip 설명 모달 */}
      {tipModal && (
        <TipModal onClose= {() => setTipModal(false)}/>
      )}

      {/* 취소 확인 모달 */}
      {confirmCancelOpen && (
        <ConfirmAssembleModal
          onConfirm={() => {
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
            setConfirmBackOpen(false);
            navigate("/board/assemble");
          }}
          onCancel={() => setConfirmBackOpen(false)}
          onMode={"back"}
        />
      )}
      {/* 등록 확인 모달 */}
      {confirmSaveOpen && (
        <ConfirmAssembleModal
          onConfirm={() => {
            saveAssemble();
            setConfirmSaveOpen(false);           
          }}
          onCancel={() => setConfirmSaveOpen(false)}
          onMode={"save"}
        />
      )}
    </div>
  );
};

export default AddAssemble;