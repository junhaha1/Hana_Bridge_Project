import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import ApiClient from "../../service/ApiClient";
import { useSelector } from "react-redux";

//디자인 
import { scrollStyle, cardStyle } from "../../style/CommonStyle";
import { emptyDiv, writeButton } from '../../style/CommonEmptyBoard';
import { userDate } from "../../style/CommonDetail";
import {FaUser, FaSearch, FaArrowUp } from 'react-icons/fa';
import {addButton, cardAuthor, cardBottomLayout, cardComment, cardContent, cardGood, cardTitle, cardTopLayout, inputBox, inputResetButton, mainTitle, searchBox, sortCheckBox, sortCheckLayout, upBottom } from "../../style/CommonBoardStyle";
import { IoMdClose } from "react-icons/io";

const CodeBoard = () => {
  const [boards, setBoards] = useState(null);
  const navigate = useNavigate();
  const category = useSelector((state) => state.user.category);
  const email = useSelector((state) => state.user.email);
  const nickName = useSelector((state) => state.user.nickName);
  const scrollRef = useRef(null);
  const [searchWord, setSearchWord] = useState("");

  const [sortType, setSortType] = useState("latest");
  const [redirect, setRedirect] = useState(false); //화면 새로고침 판단 토글변수
  
  //맨 위로가기 버튼 
  const scrollToTop = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const getSearch = (word) => {
    ApiClient.getSearchBoards(category, word, sortType)
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
    if (searchWord.trim() !== ""){ //검색어가 존재하는 경우
      getSearch(searchWord);
    } 
    else{ //검색어가 없는 경우
      const getBoard = sortType === "latest" ? ApiClient.getBoards : ApiClient.getSortBoards;
      getBoard(category)
      .then(async  (res) => {
        if (!res.ok) {
          //error handler 받음 
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
          console.log("게시글이 없습니다.");
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
  }, [redirect, sortType]);

  const boardClick = (boardId) => {
    navigate(`/detailBoard/${boardId}`, { state: { category: category } });
  };

  //enter로 전송
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      const word = e.target.value.trim();
      console.log(word);
      if (word !== "")
        getSearch(word);
      else{ //검색창이 비어있을 때 일반 전체 검색으로 새로고침
        resetBoards();
      }
    }
  };

  //화면 새로고침을 위해 useEffect 의존 변수들을 초기화하는 함수
  const resetBoards = () => {
    setRedirect(!redirect);
    setSortType("latest");
    setSearchWord("");
  }

  return (
    <>
    <div ref={scrollRef} className={scrollStyle + " h-[80vh] mt-5 ml-20 pr-40"}>
      <div className="flex justify-between p-1">
        <h3 className={mainTitle}>코드 게시판</h3>
        <div className="w-1/2 flex justify-end gap-6">
          <div className={searchBox}>
            <FaSearch className="mt-1 mr-1.5"/>
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
          {nickName === 'guest' ? null 
          :
            <button 
              className={addButton}
              onClick={() => navigate("/write")}
            >
              글 작성
            </button>
          }
        </div>
      </div>

      {/* 게시글이 없을 경우 */}
      {boards === null && (
        <div className="flex flex-col mt-5 items-center justify-center h-[50vh] text-white bg-white/5 backdrop-blur-sm border border-white/30 rounded-lg shadow-md p-8 text-center">
          {searchWord.trim().length > 0 ? (
            <>
              <h3 className="text-2xl font-bold mb-2">'{searchWord}'에 대한 검색 결과가 없습니다.</h3>
            </>
          ):(
            <>
              <h3 className="text-2xl font-bold mb-2">아직 게시글이 없습니다.</h3>
              <h2 className="text-lg text-white/80">첫 게시글을 작성해보세요 😊</h2>
            </>
          )}
        </div>
      )}

      {boards !== null && (
        <div className={sortCheckLayout}>
          <label htmlFor="sort" className="sr-only">정렬 기준</label>
          <select
            id="sort"
            name="sort"
            value={sortType}
            className={sortCheckBox}
            onChange={(e) => {
              setSortType(e.target.value)
            }}
          >
            <option className="text-black" value="like">좋아요순</option>
            <option className="text-black" value="latest">최신순</option>
          </select>
        </div>
      )}
      
      {boards !== null && boards.map((post) => (
        <>
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
                <FaUser
                className="mt-1"
                />
                {post.nickName}
              </span>
              <span className='text-xs text-gray-300 mt-0.5'>
                {new Date(post.createAt).toISOString().slice(0, 16).replace('T', ' ')}
              </span>
            </div>
            <div className="flex gap-4">
              <span className= {cardGood}>
                <img
                  src="/src/images/blueGood.png"
                  alt="좋아요"
                  width="18"
                  className="mr-1"
                />
                {post.likeCount}
              </span>
              <span className= {cardComment}>
                <img
                  src="/src/images/comment.png"
                  alt="댓글"
                  width="18"
                  className="mr-1"
                />
                {post.commentCount}
              </span>
            </div>
          </div>
        </div>
        </>
      ))}
      <button
        onClick={scrollToTop}
        className={upBottom}
      >
        <FaArrowUp />
      </button>
    </div>
    </>
  );
};

export default CodeBoard;
