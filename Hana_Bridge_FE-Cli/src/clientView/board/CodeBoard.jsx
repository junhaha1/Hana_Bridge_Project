import { useEffect, useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import ApiClient from "../../service/ApiClient";
import { useSelector, useDispatch } from "react-redux";
import { setCurPage, setCurPageGroup, resetPage } from "../../store/postSlice";

//디자인 
import { scrollStyle, cardStyle } from "../../style/CommonStyle";
import { emptyDiv, writeButton } from '../../style/CommonEmptyBoard';
import { userDate } from "../../style/CommonDetail";
import {FaUser, FaSearch, FaArrowUp, FaRegComment  } from 'react-icons/fa';
import { BiLike } from "react-icons/bi";
import {addButton, cardAuthor, cardBottomLayout, cardComment, cardContent, cardGood, cardTitle, cardTopLayout, inputBox, inputResetButton, mainTitle, searchBox, sortCheckBox, sortCheckLayout, upBottom } from "../../style/CommonBoardStyle";
import { IoMdClose } from "react-icons/io";

const CodeBoard = () => {
  const [boards, setBoards] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const isBack = location.state?.from === "back";
  const category = useSelector((state) => state.user.category);
  const nickName = useSelector((state) => state.user.nickName);
  const scrollRef = useRef(null);
  const [searchWord, setSearchWord] = useState(""); //검색창에 입력된 단어를 갱신하는 변수
  const [fixedWord, setFixedWord] = useState(""); //검색이 확정된 단어

  const [isLoading, setIsLoading] = useState(true);
  const [sortType, setSortType] = useState("latest");
  const [redirect, setRedirect] = useState(false); //화면 새로고침 판단 토글변수


  const curPage = useSelector((state) => state.post.curCodePage);
  const curPageGroup = Math.floor((curPage -1) / 5 );
  const [page, setPage] = useState(curPage); // 현재 페이지 (1부터 시작)
  console.log("curPage: " + curPage + "  page: "+ page);
  const [totalPages, setTotalPages] = useState(curPageGroup); // 총 페이지 갯수 
  const [pageGroup, setPageGroup] = useState(0); // 현재 5개 단위 페이지 그룹 인덱스
  const OpenState = useSelector((state) => state.post.isOpenLeftHeader);

  
  //맨 위로가기 버튼 
  const scrollToTop = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  //페이지 동기화 검사
  useEffect(() => {
    if (page !== curPage) {
      setPage(curPage);
    }
    if(pageGroup !== curPageGroup){
      setPageGroup(curPageGroup);
    }
  }, [curPage, curPageGroup]);

  //이전 버튼이 아니라면 초기화
  useEffect(() => {
    console.log("isBack: "+isBack);
    if (!isBack) {
      dispatch(resetPage('code'));
    } else {
      // from 상태 초기화
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, []);

  const getSearch = (word) => {
    ApiClient.getSearchBoards(category, word, sortType, page)
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
      if (data.boards.length === 0) {
        console.log("해당 게시글이 없습니다.");
        setBoards(null);
      } else {
        setBoards(data.boards);
        setTotalPages(data.totalPages);
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

  // 정렬 방법이나 검색어가 바뀌면 페이지 1
  useEffect(() =>{
    if (searchWord === "" && sortType === "latest") return;
    setPage(1);
    setPageGroup(0);
    dispatch(resetPage('code'));
  }, [sortType, searchWord]);

  // page가 바뀌는 경우 페이지 그룹 확인 
  useEffect(() => {
    const currentGroup = Math.floor((page - 1) / 5);
    if (currentGroup !== pageGroup) {
      setPageGroup(currentGroup);
    }
  }, [page]);

  useEffect(() => {
    const fetchBoards = async () => {
      setIsLoading(true);
      try{
        if (searchWord.trim() !== ""){ //검색어가 존재하는 경우
          getSearch(searchWord);
        } else { //검색어가 없는 경우
          const getBoard = ApiClient.getBoards;
          const res = await getBoard(category, page, sortType);
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
          
          if (data.boards.length === 0) {
            console.log("게시글이 없습니다.");
            setBoards(null);
          } else {
            setBoards(data.boards);
            setTotalPages(data.totalPages);
          }
        } 
      } catch (err) {
        console.error("API 요청 실패:", err);
        // 게시글 없을때 -> category error
        if(err.code === 'CATEGORY_POST_NOT_FOUND'){
          setBoards(null);
        }
        // 404일 때 에러 페이지로 이동
        else if (err.code && err.code.includes('NOT_FOUND')) {
          navigate("/error");
        }
      } finally{
        setIsLoading(false);
      }
    };

    fetchBoards();
  }, [page, redirect, sortType]);

  //페이지 버튼 렌더링 함수 
  const renderPagination = () => {
    if (isLoading || totalPages < 1) return null;

    const pages = [];
    const pagesPerGroup = 5;
    const startPage = pageGroup * pagesPerGroup + 1;
    const endPage = Math.min(startPage + pagesPerGroup - 1, totalPages);

    // 이전 그룹 이동 버튼
    if (startPage > 1) {
      pages.push(
        <button
          key="prev"
          onClick={() => {
            const newGroup = pageGroup - 1;
            setPageGroup(newGroup);
            setPage(newGroup * pagesPerGroup + 1);
            dispatch(setCurPage({curCodePage: newGroup * pagesPerGroup + 1}));
          }}
          className="px-3 py-1 mx-1 rounded bg-transparent text-white"
        >
          &lt;
        </button>
      );
    }
    // 현재 그룹의 페이지 번호
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          className={`px-3 py-1 mx-1 rounded ${i === page ? 'bg-[#C5BCFF] text-black' : 'bg-white/20 text-white'}`}
          onClick={() => {
            setPage(i);
            console.log("print i: " + i);
            dispatch(setCurPage({curCodePage: i}));
          }}
        >
          {i}
        </button>
      );
    }
    // 다음 그룹 이동 버튼
    if (endPage < totalPages) {
      pages.push(
        <button
          key="next"
          onClick={() => {
            const newGroup = pageGroup + 1;
            setPageGroup(newGroup);
            setPage(newGroup * pagesPerGroup + 1);
            dispatch(setCurPage({curCodePage: newGroup * pagesPerGroup + 1 }));
          }}
          className="px-3 py-1 mx-1 rounded-full bg-transparent text-white"
        >
          &gt;
        </button>
      );
    }
    return <div className="mt-6 mb-12 flex justify-center">{pages}</div>;
  };

  //상세보기로 
  const boardClick = (boardId) => {
    navigate(`/detailBoard/${boardId}`, { state: { category: category } });
  };

  //enter로 전송
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      const word = e.target.value.trim();
      console.log(word);
      if (word !== ""){
        setFixedWord(word);
        getSearch(word);
      }
      else{ //검색창이 비어있을 때 일반 전체 검색으로 새로고침
        resetBoards();
      }
    }
  };

  //화면 새로고침을 위해 useEffect 의존 변수들을 초기화하는 함수
  const resetBoards = () => {
    setRedirect(!redirect);
    setSortType("latest");
    setIsLoading(true);
    setSearchWord("");
    setFixedWord("");
    setPage(1);
    setPageGroup(0);
  }

  return (
    <>
    <div ref={scrollRef} className={`${scrollStyle} ${OpenState ? 'max-md:h-[63vh] ' : 'max-md:h-[83vh]'} md:h-[90vh] mt-1 ml-20 pr-40 max-md:m-1 max-md:p-2 max-md:overflow-x-hidden`}>
      <div className="flex justify-between p-1 md:mt-11 max-md:flex-col">
        <h3 className={mainTitle}>코드 게시판</h3>
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
      {isLoading ? (
        <div>
          로딩중
        </div>
      ) : boards === null ? (
        <div className={`${emptyDiv} mt-4`}>
          {fixedWord.trim().length > 0 ? (
            <>
              <h3 className="text-2xl font-bold mb-2">'{fixedWord}'에 대한 검색 결과가 없습니다.</h3>
            </>
          ):(
            <>
              <h3 className="text-2xl font-bold mb-2">아직 게시글이 없습니다.</h3>
              <h2 className="text-lg text-white/80">첫 게시글을 작성해보세요 😊</h2>
            </>
          )}
        </div>
      ) : (
        <>
        <div className={sortCheckLayout}>
          <div className="flex justify-end w-full">
            <label htmlFor="sort" className="sr-only">정렬 기준</label>
            <select
              id="sort"
              name="sort"
              value={sortType}
              className={`${sortCheckBox} cursor-pointer`}
              onChange={(e) => {
                setSortType(e.target.value)
              }}
            >
              <option className="text-black" value="like">좋아요순</option>
              <option className="text-black" value="latest">최신순</option>
            </select>
          </div>
        </div>
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
                  <FaUser className='mt-0.5'/>
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
                <span className= {cardComment}>
                  <FaRegComment className="size-5" />
                  {post.commentCount}
                </span>
              </div>
            </div>
          </div>
        ))}
        {renderPagination()}
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
};

export default CodeBoard;
