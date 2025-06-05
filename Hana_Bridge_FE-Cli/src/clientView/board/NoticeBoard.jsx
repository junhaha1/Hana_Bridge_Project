import ApiClient from '../../service/ApiClient';
import { useSelector } from 'react-redux';
import { useEffect, useState, useRef } from "react";
import { useNavigate} from "react-router-dom";


import { scrollStyle } from "../../style/CommonStyle";
import { emptyDiv, writeButton } from '../../style/CommonEmptyBoard';
import { cardStyle } from "../../style/CommonStyle";
import { userDate } from "../../style/CommonDetail";
import {FaUser, FaSearch, FaArrowUp,  FaRegComment  } from 'react-icons/fa';
import { BiLike } from "react-icons/bi";
import { upBottom, inputResetButton, addButton, cardAuthor, cardBottomLayout, cardContent, cardGood, cardTitle, cardTopLayout, inputBox, mainTitle, searchBox,  } from "../../style/CommonBoardStyle";
import { IoMdClose } from "react-icons/io";

const NoticeBoard = () => {
  const [boards, setBoards] = useState(null);
  const category = useSelector((state) => state.user.category);
  const role = useSelector((state) => state.user.role);
  console.log(role);
  const navigate = useNavigate(); 
  const scrollRef = useRef(null);

  const [searchWord, setSearchWord] = useState(""); //검색창에 입력된 단어를 갱신하는 변수
  const [fixedWord, setFixedWord] = useState(""); //검색이 확정된 단어

  const [isLoading, setIsLoading] = useState(true);
  const [redirect, setRedirect] = useState(false); //화면 새로고침 판단 토글변수
  
  //맨 위로가기 버튼 
  const scrollToTop = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const getSearch = (word) => {
    ApiClient.getSearchBoards(category, word, "latest")
    .then(async  (res) => {
      if (!res.ok) {
        const errorData = await res.json(); // JSON으로 파싱
        console.log("errorData: " + errorData.code + " : " + errorData.message); 

        // 👇 error 객체에 code를 추가해 던짐
        const error = new Error(errorData.message || `서버 오류: ${res.status}`);
        error.code = errorData.code;
        throw error;   
      }
    return res.json();
    })
    .then((data) => {
      if (data === null || (Array.isArray(data) && data.length === 0)) {
        console.log("해당 게시글이 없습니다.");
        setBoards(null);
      } else {
        setBoards(data);
      }
    })
    .catch((err) => {
      console.error("API 요청 실패:", err);
      // 게시글 없을때 -> category error
      if(err.code === 'CATEGORY_POST_NOT_FOUND'){
        setBoards(null);
      }
      // 404일 때 에러 페이지로 이동
      else if (err.code && err.code.includes('NOT_FOUND')) {
        navigate("/error");
      }
    });
  }

  useEffect(() => {
    const fetchBoards = async () => {
      try{
        setIsLoading(true);
        if (searchWord.trim() !== ""){ //검색어가 존재하는 경우
          getSearch(searchWord);
        } else {
          const res = await ApiClient.getBoards(category);
          if (!res.ok) {
            //error handler 받음 
            const errorData = await res.json(); // JSON으로 파싱
            console.log("errorData: " + errorData.code + " : " + errorData.message); 

            // 👇 error 객체에 code를 추가해 던짐
            const error = new Error(errorData.message || `서버 오류: ${res.status}`);
            error.code = errorData.code;
            throw error;   
          }

          const data = await res.json();
          if (data === null || (Array.isArray(data) && data.length === 0)) {
            console.log("게시글이 없습니다.");
            setBoards(null);
          } else {
            setBoards(data);
          }
        }
      }catch(err){
        console.error("API 요청 실패:", err);
        // 게시글 없을때 -> category error
        if(err.code === 'CATEGORY_POST_NOT_FOUND'){
          setBoards(null);
        }
        // 404일 때 에러 페이지로 이동
        else if (err.code && err.code.includes('NOT_FOUND')) {
          navigate("/error");
        }
      }finally{
        setIsLoading(false);
      }
    };
    
    fetchBoards();
  }, [redirect]); // 의존성 배열에 category 추가 추천


  //상세 화면으로 
  const boardClick = (boardId) =>{
    navigate(`/detailBoard/${boardId}`, {state: {category: category}});
  }

  //enter로 전송
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      const word = e.target.value.trim();
      console.log(word);
      if (word !== ""){
        getSearch(word);
        setFixedWord(word);
      } else{ //검색창이 비어있을 때 일반 전체 검색으로 새로고침
        resetBoards();
      }
    }
  };

  //화면 새로고침을 위해 useEffect 의존 변수들을 초기화하는 함수
  const resetBoards = () => {
    setRedirect(!redirect);
    setIsLoading(true);
    setSearchWord("");
    setFixedWord("");
  }

  return (
    <>
    <div ref={scrollRef} className={scrollStyle +" max-md:h-[65vh] md:h-[90vh] mt-1 ml-20 pr-40 max-md:m-1 max-md:p-2 max-md:overflow-x-hidden"}>
      <div className="flex justify-between p-1 mb-5 md:mt-11 max-md:flex-col">
        <h3 className={mainTitle}>공지 게시판</h3>
        <div className="w-1/2 flex justify-end gap-6 mb-2 max-md:w-full">
          <div className={searchBox}>
            <FaSearch className="m-1 size-[23px] max-md:size-[17px]"/>
            <input
              className={inputBox}
              type="text"
              placeholder="게시글 검색"
              value={searchWord}
              onChange={(e) => setSearchWord(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            {searchWord.length > 0 && (
            <button 
              className={inputResetButton}
              onClick={resetBoards}
            >
              <IoMdClose/>
            </button>)}
          </div>
          {role === 'ROLE_ADMIN' && 
            <button 
              className={addButton}
              onClick={() => navigate("/write", { state: { category: 'notice' } })}            
            >
              공지글 작성
            </button>
          }
        </div>
      </div>
      {isLoading ? (
        <div>
          로딩중
        </div>
      ): boards === null ? (
        <div className={emptyDiv}>
          {fixedWord.trim().length > 0 ? (
            <>
              <h3 className="text-2xl font-bold mb-2">'{fixedWord}'에 대한 검색 결과가 없습니다.</h3>
            </>
          ):(
            <>
              <h3 className="text-2xl font-bold mb-2">아직 첫 공지가 작성되지 않았습니다. </h3>
            </>
          )}
        </div>
      ):(
        <>
        {boards.map((post) => (
          <div
            key={post.boardId}
            className={cardStyle}
            onClick={() => boardClick(post.boardId)}
          >
            <div className = {cardTopLayout}>
              <h3
                className= {cardTitle}
              >
                {post.title}
              </h3>
            </div>
            <p className={cardContent}>
              {post.content}
            </p>
            <div className= {cardBottomLayout}>
              <div className={userDate}>
                <span className={cardAuthor}>
                  <FaUser/>
                  {post.nickName}
                </span>
                <span className='hidden md:inline text-xs text-gray-300 mt-1'>
                  {new Date(post.createAt).toISOString().slice(0, 16).replace('T', ' ')}
                </span>
              </div>
              <div className="flex gap-4">
                <span className= {cardGood}>
                  <BiLike className="size-5 "/>
                  {post.likeCount}
                </span>
              </div>
            </div>
          </div>
        ))}
        </>
      )}
    </div>
    <button
      onClick={scrollToTop}
      className={upBottom}
    >
      <FaArrowUp />
    </button>
    </>
  );
};

export default NoticeBoard;