import ApiClient from "../../service/ApiClient";
import Header from '../header/Header';
import { useSelector } from 'react-redux';
import { useEffect, useState, useRef } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useParams } from 'react-router-dom';
import Comments from './Comments';

import '../../css/Board/DetailBoard.css';
import LeftHeader from '../header/LeftHeader';

import { mainFrame, detailFrame } from "../../style/CommonFrame";
import { scrollStyle, buttonStyle, detailCardStyle } from "../../style/CommonStyle";
import { upBottom } from "../../style/CommonBoardStyle";
import { editTitle, editContent, liekCommentButton, liekComment, userDate, detailCategory, detailTitle, detailContent, backButton } from "../../style/CommonDetail";
import { FaUser, FaArrowUp } from 'react-icons/fa';

//code 마크다운
import ReactMarkdown from "react-markdown";
import remarkGfm from 'remark-gfm'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { prism } from 'react-syntax-highlighter/dist/esm/styles/prism';


//상세 게시글 보드
const DetailBoard = () => {
  const email = useSelector((state) => state.user.email);
  const nickName = useSelector((state) => state.user.nickName);
  const role = useSelector((state) => state.user.role);
  const accessToken = useSelector((state) => state.user.accessToken);

  const { boardId } = useParams(); 

  const [board, setBoard] = useState(null);
  const [isEdit, setIsEdit] = useState(false);

  const [isLike, setIsLike] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  const [title, setTitle] = useState('');
  const [code, setCode] = useState('');
  const [content, setContent] = useState('');
  const [updateAt, setUpdateAt] = useState(new Date());

  const navigate = useNavigate();
  const location = useLocation();

  const category = location.state?.category;
  console.log("category(DetailBoard): " + category)
  const [commentCount, setCommentCount] = useState(0);

  //textarea 높이 자동화
  const textareaRef = useRef(null);
  const scrollRef = useRef(null);
  
  //맨 위로가기 버튼 
  const scrollToTop = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };


  //비회원이 좋아요 눌렀을때 띄울 메시지 
  const [showGuestMessage, setShowGuestMessage] = useState(false);
  const handleGuestClick = () => {
    setShowGuestMessage(true);
    setTimeout(() => {
      setShowGuestMessage(false);
    }, 2000); // 2초 후 자동 사라짐
  };

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto"; // 높이 초기화
      textarea.style.height = textarea.scrollHeight + "px"; // 실제 콘텐츠 높이로 설정
    }
  }, [code, content]);

  useEffect(() => {
    ApiClient.getBoard(boardId, accessToken)
    .then(async (res) => {
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
      console.log(data);
      setBoard(data);
      setLikeCount(data.likeCount);
      setIsLike(data.goodCheck);      
      setCommentCount(data.commentCount);
    })
    .catch((err) => {
      console.error("API 요청 실패:", err);
      // 404일 때 에러 페이지로 이동
      if (err.code && err.code.includes('NOT_FOUND')) {
        navigate("/error");
      }
    }); 
  }, [isEdit, boardId]);

  useEffect(() => {
    if (isEdit && board) {
      setTitle(board.title);
      setContent(board.content);
      setCode(board.code); 
    }
  }, [isEdit, board]);

  if (!board) return <div>로딩 중...</div>;

  //삭제 버튼
  const boardDeleteButton = (boardId) => {
    ApiClient.deleteBoard(boardId, accessToken, category)
    .then(async (res) => {
      if (!res.ok) {
        //error handler 받음 
        const errorData = await res.json(); // JSON으로 파싱
        console.log("errorData: " + errorData.code + " : " + errorData.message); 

        // 👇 error 객체에 code를 추가해 던짐
        const error = new Error(errorData.message || `서버 오류: ${res.status}`);
        error.code = errorData.code;
        throw error;  
      }
      console.log("게시글 삭제 완료!");
      navigate('/');
    })
    .catch((err) => {
      console.error("API 요청 실패(게시글 삭제 중 오류):", err);
      // 404일 때 에러 페이지로 이동
      if (err.code && err.code.includes('NOT_FOUND')) {
        navigate("/error");
      }
    }); 
  }

  //수정 저장 버튼
  const saveBoard = (boardId) => {
    ApiClient.updateBoard(boardId, accessToken, category, title, content, code, updateAt)
    .then(async(res) => {
      if (!res.ok) {
        //error handler 받음 
        const errorData = await res.json(); // JSON으로 파싱
        console.log("errorData: " + errorData.code + " : " + errorData.message); 

        // 👇 error 객체에 code를 추가해 던짐
        const error = new Error(errorData.message || `서버 오류: ${res.status}`);
        error.code = errorData.code;
        throw error;  
      }
      console.log("게시글 수정 완료 ! ");
      navigate(`/detailBoard/${boardId}`, {state: {category: category}});
      setIsEdit(false);
    })
    .catch((err) => {
      console.error("API 요청 실패(게시글 수정 중 오류):", err);
      // 404일 때 에러 페이지로 이동
      if (err.code && err.code.includes('NOT_FOUND')) {
        navigate("/error");
      }
    }); 
  }

  //좋아요 추가 
  const handleLike = (boardId) => {
    ApiClient.sendBoardGood(boardId, accessToken)
      .then(async(res) => {
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
        console.log(data);
        setIsLike(data.goodCheck);
        setLikeCount(data.likeCount);  // 추가
      })
      .catch((err) => {
        console.error("API 요청 실패(좋아요 추가 중 오류):", err);
        // 404일 때 에러 페이지로 이동
        if (err.code && err.code.includes('NOT_FOUND')) {
          navigate("/error");
        }
    });  
  }
  //좋아요 삭제
  const handleCancelLike = (boardId) => {
    ApiClient.deleteBoardGood(boardId, accessToken)
    .then(async(res) => {
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
    .then((data) =>{
      console.log("좋아요 취소!");
      setIsLike(data.goodCheck);
      setLikeCount(data.likeCount);  // 추가
    })
    .catch((err) => {
      console.error("API 요청 실패(좋아요 취소 중 오류):", err);
      // 404일 때 에러 페이지로 이동
      if (err.code && err.code.includes('NOT_FOUND')) {
        navigate("/error");
      }
    });  
  }
  

  return (
    <div className={mainFrame}>
      <Header />
      <div className="w-full flex flex-row mt-20">
        <LeftHeader />
        {/* 메인 콘텐츠 */}
        <main className={detailFrame}>
          <div ref={scrollRef} className={scrollStyle + " h-[80vh] mt-5 ml-20 pr-40"}>
            <button
              onClick={() => navigate("/board/" + category)}
              className={buttonStyle + backButton}
            >
              이전
            </button>     
            {isEdit ? (              
              <div className={detailCardStyle}>
                {/* 게시글 수정 폼 */}
                  <div className={detailCategory}>
                    {category === "code"
                      ? "CODE 게시판 > 상세글"
                      : "공지 게시판 > 상세글"}
                  </div>

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
                      {board.nickName}
                    </span>
                    <span className='text-xs text-gray-300 mt-0.5'>
                      {new Date(board.createAt).toISOString().slice(0, 16).replace('T', ' ')}
                    </span>                  
                  </div>

                  {category === "code"
                    ? <textarea
                      ref={textareaRef}
                      className={scrollStyle + editContent}
                      placeholder="코드나 에러사항을 입력해주세요"
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                    />
                    : null}                  

                  <textarea
                    className={editContent}
                    placeholder="내용을 입력해주세요"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                  />

                  <div className={liekCommentButton}>
                    <div className={liekComment}>
                      <span className="flex items-center">
                        <img src="/images/whiteGood.png" alt="좋아요" className="w-5 h-5 mr-1" />
                        {board.likeCount}
                      </span>
                      {category === 'code' ?
                      <span className="flex items-center">
                        <img src="/images/comment.png" alt="댓글" className="w-5 h-5 mr-1" />
                        {board.commentsCount}
                      </span>
                      :null}
                      
                    </div>
                    <div className="flex gap-2">
                      <button
                        className={buttonStyle + " bg-green-600 text-white px-3 py-1 text-sm hover:bg-green-700"}
                        onClick={() => saveBoard(boardId)}
                      >
                        저장
                      </button>
                      <button
                        className={buttonStyle + " bg-red-500 text-white px-3 py-1 text-sm hover:bg-red-600"}
                        onClick={() => setIsEdit(false)}
                      >
                        취소
                      </button>
                    </div>
                  </div>
              </div>
            ) : (
              <div className={detailCardStyle}>
                {/* 게시글 보기 (테두리 없이 투명 배경) */}
                <div  className={detailCategory}>
                  {category === "code"
                    ? "CODE 게시판 > 상세글"
                    : "공지 게시판 > 상세글"}
                </div>
                <h2 className={detailTitle}>{board.title}</h2>
                <div className={userDate}>
                  <span className='flex gap-1'>
                    <FaUser
                    className="mt-0.5"
                    />
                    {board.nickName}
                  </span>
                  <span className='text-xs text-gray-300 mt-0.5'>
                    {new Date(board.createAt).toISOString().slice(0, 16).replace('T', ' ')}
                  </span>                  
                </div>
                <div className="border-t border-white/10 mb-3" />
                {category === "code"
                  ? 
                  <div className="text-white">
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      components={{
                        code({ inline, className, children, ...props }) {
                          const match = /language-(\w+)/.exec(className || '');
                          return !inline && match ? (
                            <SyntaxHighlighter
                              {...props}
                              style={prism}
                              language={match[1]}
                              PreTag="div"
                              className="rounded-md overflow-x-auto max-w-[100%]"
                            >
                              {String(children).replace(/\n$/, '')}
                            </SyntaxHighlighter>
                          ) : (
                            <code {...props} className={`${className} bg-gray-800 text-white px-1 rounded`}>
                              {children}
                            </code>
                          );
                        },
                      }}
                    >
                      {board.code}
                    </ReactMarkdown>
                    </div>
                  : <></>}
                <p className={detailContent}>{board.content}</p>

                <div className={liekCommentButton}>
                  <div className={liekComment}>
                    <span
                      className="relative cursor-pointer flex items-center"
                      onClick={() => {
                        if (nickName === 'guest') {
                          handleGuestClick();
                        } else {
                          isLike ? handleCancelLike(boardId) : handleLike(boardId);
                        }
                      }}
                    >
                      <img
                        src={isLike ? "/images/blueGood.png" : "/images/whiteGood.png"}
                        alt="좋아요"
                        className="w-5 h-5 mr-1"
                      />
                      {likeCount}

                      {showGuestMessage && (
                        <div className="absolute bottom-full mb-2
                          w-[280px]  py-2 text-sm bg-black text-white rounded-lg shadow-lg 
                          text-center">
                          ⚠ 비회원은 이용할 수 없는 기능입니다.
                        </div>
                      )}
                    </span>


                    {category === 'code'?
                    <span className="flex items-center">
                      <img src="/images/comment.png" alt="댓글" className="w-5 h-5 mr-1" />
                      {commentCount}
                    </span>
                    :null}                      
                  </div>

                  {(nickName === board.nickName || role === "admin") && (
                    <div className="flex gap-3">
                      <button
                        onClick={() => setIsEdit(true)}
                        className="text-sm text-white hover:underline"
                      >
                        수정하기
                      </button>
                      <button
                        onClick={() => boardDeleteButton(boardId)}
                        className="text-sm text-red-400 hover:underline"
                      >
                        삭제하기
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}            
            <Comments boardId={boardId} category={category} />
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
  );
};

export default DetailBoard;