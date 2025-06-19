import { useEffect, useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import ApiClient from "../../service/ApiClient";
import { useSelector, useDispatch } from "react-redux";
import { setCurPage, setCurPageGroup, resetPage } from "../../store/postSlice";

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
  const dispatch = useDispatch();
  const location = useLocation();
  const isBack = location.state?.from === "back";
  const backToggle = location.state?.toggle ?? "code";

  const category = useSelector((state) => state.user.category);
  const email = useSelector((state) => state.user.email);
  const nickName = useSelector((state) => state.user.nickName);
  const role = useSelector((state) => state.user.role);

  //토글에 따라 읽어오는 게시글 변경
  const [toggle, setToggle] = useState(backToggle);

  const [isLoading, setIsLoading] = useState(true);
  const [sortType, setSortType] = useState("latest");
  const scrollRef = useRef(null);

  const [searchWord, setSearchWord] = useState(""); //검색창에 입력된 단어를 갱신하는 변수
  const [fixedWord, setFixedWord] = useState(""); //검색이 확정된 단어

  const [redirect, setRedirect] = useState(false); //화면 새로고침 판단 토글변수

  const curPage = useSelector((state) => state.post.curMyPage);
  const curPageGroup = Math.floor((curPage -1) / 5 );
  const [page, setPage] = useState(curPage); // 현재 페이지 (1부터 시작)
  const [totalPages, setTotalPages] = useState(curPageGroup); // 총 페이지 갯수 
  const [pageGroup, setPageGroup] = useState(0); // 현재 5개 단위 페이지 그룹 인덱스

  const [isDropdownOpen, setIsDropdownOpen] = useState(false); //좋아요 게시판 드롭다운 변수

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
    if (!isBack) {
      dispatch(resetPage('My'));
    } else {
      // from 상태 초기화
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, []);

  //검색어로 검색하기
  const getMySearch = (word) => {
    const getSearchmyBoards = toggle === "code" ? ApiClient.getSearchUserBoards : ApiClient.getSearchUserAssembleBoards;

    getSearchmyBoards(toggle, word, sortType, page)
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
      console.log(data);
      if (toggle === "code" && data.boards.length === 0) {
        setBoards(null);
      } else if(toggle === "assemble" && data.assembleBoards.length === 0){
        setBoards(null);
      }else {
        setBoards(toggle === "code" ? data.boards : data.assembleBoards);
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
    dispatch(resetPage('my'));
  }, [sortType, searchWord]);

  // toggle 바뀌면 페이지 1
  useEffect(() =>{
    setPage(1);
    setPageGroup(0);
    dispatch(resetPage('my'));
  }, [toggle]);

  // page가 바뀌는 경우 페이지 그룹 확인 
  useEffect(() => {
    const currentGroup = Math.floor((page - 1) / 5);
    if (currentGroup !== pageGroup) {
      setPageGroup(currentGroup);
    }
  }, [page]);

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
          let res = null;
          //토글, 정렬 값에 따라 게시글 조회 호출 함수 교체
          if (toggle === "code"){
            res = await ApiClient.getMyBoard(page, sortType);
          } else if (toggle === "assemble"){
            res = await ApiClient.getMyAssemble(page, sortType);
          } else if (toggle === "goodAssemble"){
            res = await ApiClient.getMyGoodAssemble(page);
          } else if (toggle === "goodCode"){
            res = await ApiClient.getMyGoodBoard(page);
          }
          
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
          if ((toggle === "code" || toggle === "goodCode" ) && data.boards.length === 0) {
            setBoards(null);
          }
          if ((toggle === "code" || toggle === "goodCode" ) && data.boards.length != 0) {
            setBoards(data.boards);
            setTotalPages(data.totalPages);
          }
          if((toggle === "assemble" || toggle === "goodAssemble") && data.assembleBoards.length === 0){
            setBoards(null);
          }
          if((toggle === "assemble" || toggle === "goodAssemble") && data.assembleBoards.length != 0){
            setBoards(data.assembleBoards);
            setTotalPages(data.totalPages);
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
  }, [toggle, sortType, redirect, page]);

  //페이지 번호 렌더링 함수 
  const renderPagination = () => {
    if (isLoading || totalPages <= 1) return null;

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
            dispatch(setCurPage({curMyPage: newGroup * pagesPerGroup + 1}));
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
            // console.log("print i: " + i);
            dispatch(setCurPage({curMyPage: i}));
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
            dispatch(setCurPage({curMyPage: newGroup * pagesPerGroup + 1 }));
          }}
          className="px-3 py-1 mx-1 rounded-full bg-transparent text-white"
        >
          &gt;
        </button>
      );
    }
    return <div className="mt-6 flex justify-center">{pages}</div>;
  };

  //board를 클릭했을 때 이동
  const boardClick = (boardId) => {
    let address = null;
    if (toggle === "code" || toggle === "goodCode"){
      address = `/detailBoard/${boardId}`;
    } 
    if (toggle === "assemble" || toggle === "goodAssemble"){
      address = `/detailAssemble/${boardId}`;
    }
    navigate(address, { state: { category: category } });
    // console.log(category);
  };

  //enter로 전송
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      const word = e.target.value.trim();
      // console.log(word);
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
    setPage(1);
    setPageGroup(0);
    dispatch(resetPage('my'));
  }

  return (
    <>
    <div ref={scrollRef} className={`${scrollStyle} ${OpenState ? 'max-md:h-[63vh] md:h-full ' : 'max-md:h-[83vh]'} mt-1 ml-20 pr-40 max-md:m-1 max-md:p-2 max-md:overflow-x-hidden`}>
      <div className="flex justify-between p-1 md:mt-11 max-md:flex-col">
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
              setIsDropdownOpen(false)
              setToggle("code");
              resetBoards();
            }}
            className={`bg-gray-600 font-semibold px-4 py-2 rounded ${toggle === "code" ? "!bg-[#C5BCFF] !text-gray-800 hover:bg-gray-600" : "text-white hover:!bg-[#C5BCFF] hover:!text-gray-800"} whitespace-nowrap max-md:text-sm`}
          >
            {role === 'ROLE_ADMIN' ? '공지' : '코드/질문'}
          </button>
          <button
            onClick={() => {
              setIsDropdownOpen(false)
              setToggle("assemble");
              resetBoards();
            }}
            className={`bg-gray-600 font-semibold px-4 py-2 rounded ${toggle === "assemble" ? "!bg-[#C5BCFF] !text-gray-800 hover:bg-gray-600" : "text-white hover:!bg-[#C5BCFF] hover:!text-gray-800"} whitespace-nowrap max-md:text-sm`}
          >
            AI 답변
          </button>
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className={`bg-gray-600 font-semibold px-4 py-2 rounded ${toggle === "goodAssemble" || toggle === "goodCode" ? "!bg-[#C5BCFF] !text-gray-800 hover:bg-gray-600" : "text-white hover:!bg-[#C5BCFF] hover:!text-gray-800"} max-md:text-sm`}
            >
              {toggle === "goodAssemble" && "좋아요 누른 AI 답변"}
              {toggle === "goodCode" && "좋아요 누른 코드/질문"}
              {toggle !== "goodAssemble" && toggle !== "goodCode" && "좋아요"}
              <span className="max-md:text-sm">▼</span>
            </button>

            {isDropdownOpen && (
              <div className="absolute mt-2 bg-white shadow rounded w-56 z-10">
                <button 
                  onClick={() => {
                    setIsDropdownOpen(!isDropdownOpen)
                    setToggle("goodCode");
                    resetBoards();
                  }}
                  className="block px-4 py-2 hover:bg-gray-100 w-full rounded-t text-left border-b"
                >
                  좋아요 누른 코드/질문
                </button>
                <button 
                  className="block px-4 py-2 hover:bg-gray-100 w-full rounded text-left"
                  onClick={() => {
                    setIsDropdownOpen(!isDropdownOpen)
                    setToggle("goodAssemble");
                    resetBoards();
                  }}
                >
                  좋아요 누른 AI 답변
                </button>
              </div>
            )}
          </div>
        </div>
        {boards !== null && (
          <>
            <label htmlFor="sort" className="sr-only">정렬 기준</label>
            <select
              id="sort"
              name="sort"
              className={`${sortCheckBox} cursor-pointer`}
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
          ) : toggle === "assemble" ? (
            <>
              <h3 className="text-2xl font-bold mb-2">아직 AI Codi와 대화를 안 해보셨나요?</h3>
              <p className="mb-2">
                <span className="font-semibold text-yellow-300">AI Codi</span>는!
              </p>
              <p className="mb-2">막히는 코드, 이해 안 되는 개념, 자주 보는 에러 메시지까지!</p>
              <p>우측 하단에 AI Codi에게 궁금한 점을 자유롭게 물어보고</p>
              <p>원하는 답변을 자신만의 게시글로 자동 포스팅할 수 있어요!</p>
            </>
          ) : toggle === "goodCode" ? (
            <>
              <h3 className="text-2xl font-bold mb-2">아직 마음에 드는 코드/질문 게시글이 없나요?</h3>
              <p className="mb-2">
                <span className="font-semibold text-yellow-300">코드/질문 게시글</span>은!
              </p>
              <p className="mb-2">AI 답변으로도 부족한 답변, 실제 사용하는 코드, 다른 사람들의 의견까지!</p>
              <p>코드/질문 게시판에서 자유롭게 의견과 정보를 얻을 수 있어요!</p>
              <p>마음에 들거나 따로 스크랩해두고 싶은 게시글이 있나면 좋아요를 눌러서 확인해보세요!</p>
            </>
          ) : (
            <>
              <h3 className="text-2xl font-bold mb-2">아직 마음에 드는 AI 답변 게시글이 없나요?</h3>
              <p className="mb-2">
                <span className="font-semibold text-yellow-300">AI 답변 게시글</span>은!
              </p>
              <p className="mb-2">막히는 코드, 이해 안 되는 개념, 자주 보는 에러 메시지까지!</p>
              <p>다른 사람들이 AI Codi에게 답변받은 내용들을 확인해볼 수 있어요!</p>
              <p>자신에게 필요한 게시글이 이미 존재한다면 좋아요를 눌러서 확인해보세요!</p>
            </>
          )}
        </div>
      ) : (
        <>
        {boards.map((post) => {
          let boardId = null;
          if (toggle === "code" || toggle === "goodCode"){
            boardId = post.boardId
          } 
          if (toggle === "assemble" || toggle === "goodAssemble"){
            boardId = post.assembleBoardId;
          }
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
                    <FaUser className='mt-0.5' />
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
                  {toggle === 'code' && (
                    <span className={cardComment}>
                      <FaRegComment className="size-5" />
                      {post.commentCount}
                    </span>
                  )}
                  
                </div>
              </div>
            </div>
          );
        })}
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
}

export default MyBoard;