import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import ApiClient from "../../service/ApiClient";
import { useSelector } from "react-redux";

//디자인 
import { scrollStyle, cardStyle } from "../../style/CommonStyle";
import { emptyDiv, writeButton } from "../../style/CommonEmptyBoard";
import { userDate } from "../../style/CommonDetail";
import {FaUser, FaSearch, FaArrowUp,  FaRegComment  } from 'react-icons/fa';
import { BiLike } from "react-icons/bi"; 
import {addButton, cardAuthor, cardBottomLayout, cardComment, cardContent, cardGood, cardTitle, cardTopLayout, inputBox, inputResetButton, mainTitle, searchBox, sortCheckBox, sortCheckLayout, upBottom } from "../../style/CommonBoardStyle";
import { IoMdClose } from "react-icons/io";

const MyBoard = () => {
  const [boards, setBoards] = useState([]);
  const navigate = useNavigate();

  const category = useSelector((state) => state.user.category);
  const email = useSelector((state) => state.user.email);
  const nickName = useSelector((state) => state.user.nickName);

  //토글에 따라 읽어오는 게시글 변경
  const [toggle, setToggle] = useState("code");

  const [isLoading, setIsLoading] = useState(true);
  const [sortType, setSortType] = useState("latest");
  const scrollRef = useRef(null);

  const [searchWord, setSearchWord] = useState(""); //검색창에 입력된 단어를 갱신하는 변수
  const [fixedWord, setFixedWord] = useState(""); //검색이 확정된 단어

  const [redirect, setRedirect] = useState(false); //화면 새로고침 판단 토글변수


  //맨 위로가기 버튼 
  const scrollToTop = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  //검색어로 검색하기
  const getMySearch = (word) => {
    const getSearchmyBoards = toggle === "code" ? ApiClient.getSearchUserBoards : ApiClient.getSearchUserAssembleBoards;

    getSearchmyBoards(toggle, word, sortType, email)
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

  if(nickName === 'guest'){
    return (
      <div className="md:mt-32 ml-20 pr-40 max-md:mt-2 max-md:ml-2.5 max-md:pr-1">
        <div className={`${emptyDiv} mt-40`}>
          <h3 className="text-2xl font-bold mb-2">⚠ 비회원은 이용할 수 없는 기능입니다.</h3>
          <p>로그인을 진행해주세요. </p>
        </div>
      </div>      
    );
  }

  useEffect(() => {
    const fetchBoards = async () => {
      setIsLoading(true);
      try{
        if (searchWord.trim() !== ""){
          getMySearch(searchWord);
        }
        else{
          let getSortMyboard = null;
          //토글, 정렬 값에 따라 게시글 조회 호출 함수 교체
          if (toggle === "code"){
            if (sortType === "latest"){
              getSortMyboard = ApiClient.getMyBoard
            } 
            if (sortType === "like"){
              getSortMyboard = ApiClient.getSortMyBoards
            }
          }

          if (toggle === "assemble"){
            if (sortType === "latest"){
              getSortMyboard = ApiClient.getMyAssemble
            } 
            if (sortType === "like"){
              getSortMyboard = ApiClient.getSortMyAssembleBoards
            }
          }
          const res = await getSortMyboard(email);
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
      } catch(err) {
        console.error("API 요청 실패:", err);
        // 게시글 없을때 -> category error
        if(err.code === 'CATEGORY_POST_NOT_FOUND'){
          setBoards(null);
        }
        // 404일 때 에러 페이지로 이동
        else if (err.code && err.code.includes('NOT_FOUND')) {
          navigate("/error");
        }
      } finally {
        setIsLoading(false);
      }
    };  
    
    fetchBoards();
  }, [toggle, sortType, redirect]);

  //board를 클릭했을 때 이동
  const boardClick = (boardId) => {
    const address = toggle === "code" ? `/detailBoard/${boardId}` : `/detailAssemble/${boardId}`;
    navigate(address, { state: { category: category } });
    console.log(category);
  };

  //enter로 전송
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      const word = e.target.value.trim();
      console.log(word);
      if (word !== ""){
        getMySearch(word);
        setFixedWord(word);
      }
      else{ //검색창이 비어있을 때 일반 전체 검색으로 새로고침
        resetBoards();
      }
    }
  };

  const resetBoards = () => {
    setRedirect(!redirect);
    setSortType("latest");
    setIsLoading(true);
    setSearchWord("");
    setFixedWord("");
  }

  return (
    <>
    <div ref={scrollRef} className={scrollStyle + " h-[80vh] mt-1 ml-20 pr-40 max-md:m-1 max-md:p-2 max-md:overflow-x-hidden"}>
      <div className="flex justify-between p-1 md:mt-5 max-md:flex-col">
        <h3 className={mainTitle}>내 게시판</h3>
        <div className="w-1/2 flex justify-end gap-6 max-md:w-full">
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
          <button 
            className={addButton}
            onClick={() => navigate("/write")}
          >
            글 작성
          </button>
        </div>
      </div>
      <div className={sortCheckLayout + " justify-between"}>
        <div className="flex rounded gap-2">
          <button
            onClick={() => {
              setToggle("code");
              resetBoards();
            }}
            className={`bg-gray-600 font-semibold px-4 py-2 rounded ${toggle === "code" ? "!bg-[#C5BCFF] !text-gray-800 hover:bg-gray-600" : "text-white hover:!bg-[#C5BCFF] hover:!text-gray-800"} whitespace-nowrap max-md:text-sm`}
          >
            코드 질문
          </button>
          <button
            onClick={() => {
              setToggle("assemble");
              resetBoards();
            }}
            className={`bg-gray-600 font-semibold px-4 py-2 rounded ${toggle === "assemble" ? "!bg-[#C5BCFF] !text-gray-800 hover:bg-gray-600" : "text-white hover:!bg-[#C5BCFF] hover:!text-gray-800"} whitespace-nowrap max-md:text-sm`}
          >
            AI 답변
          </button>
        </div>
        {boards !== null && (
          <>
            <label htmlFor="sort" className="sr-only">정렬 기준</label>
            <select
              id="sort"
              name="sort"
              className={sortCheckBox}
              value={sortType}
              onChange={(e) => {
                setSortType(e.target.value)
              }}
            >
              <option className="text-black" value="latest">최신순</option>
              <option className="text-black" value="like">좋아요순</option>
            </select>
          </>
        )}
      </div>
      {isLoading ? (
        <div>
          로딩중
        </div>
      ) : boards === null ? (
        <div className={emptyDiv}>
          {fixedWord.trim().length > 0 ? (
            <>
              <h3 className="text-2xl font-bold mb-2">‘{fixedWord}’에 대한 검색 결과가 없습니다.</h3>
            </>
          ) : toggle === "code" ? (
            <>
              <h3 className="text-2xl font-bold mb-2">아직 게시글이 없습니다.</h3>
              <h2 className="text-lg text-white/80">첫 게시글을 작성해보세요 😊</h2>
            </>
          ) : (
            <>
              <h3 className="text-2xl font-bold mb-2">아직 AI Codi와 대화를 안 해보셨나요?</h3>
              <p className="mb-2">
                <span className="font-semibold text-yellow-300">AI Codi</span>는!
              </p>
              <p className="mb-2">막히는 코드, 이해 안 되는 개념, 자주 보는 에러 메시지까지!</p>
              <p>우측 하단에 AI Codi에게 궁금한 점을 자유롭게 물어보고</p>
              <p>원하는 답변을 자신만의 게시글로 자동 포스팅할 수 있어요!</p>
            </>
          )}
        </div>
      ) : (
        <>
        {boards.map((post) => {
          const boardId = toggle === "code" ? post.boardId : post.assembleBoardId;
          return (
            <div
              key={boardId}
              className={cardStyle}
              onClick={() => boardClick(boardId)}
            >
              <div className={cardTopLayout}>
                <h3 className={cardTitle}>
                  {post.title}
                </h3>
              </div>
              <p className={cardContent}>
                {post.content}
              </p>
              <div className={cardBottomLayout}>
                <div className={userDate}>
                  <span className={cardAuthor}>
                    <FaUser className="mt-1" />
                    {post.nickName}
                  </span>
                  <span className="hidden md:inline  text-xs text-gray-300 mt-0.5">
                    {new Date(post.createAt).toISOString().slice(0, 16).replace("T", " ")}
                  </span>
                </div>
                <div className="flex gap-4">
                  <span className={cardGood}>
                    <BiLike className="size-5 "/>
                    {post.likeCount}
                  </span>
                  <span className={cardComment}>
                    <FaRegComment className="size-5" />
                    {post.commentCount}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
        </>
      )}
      <button
        onClick={scrollToTop}
        className={upBottom}
      >
        <FaArrowUp />
      </button>
    </div>
    </>
  );
}

export default MyBoard;