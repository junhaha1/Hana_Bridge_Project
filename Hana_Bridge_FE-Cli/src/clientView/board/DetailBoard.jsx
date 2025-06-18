import ApiClient from "../../service/ApiClient";
import Header from '../header/Header';
import { useSelector } from 'react-redux';
import { useEffect, useState, useRef } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useParams } from 'react-router-dom';
import Comments from './Comments';

import LeftHeader from '../header/LeftHeader';
import ConfirmBoardModal from "./ConfirmBoardModal";

import { mainFrame, detailFrame } from "../../style/CommonFrame";
import { scrollStyle, buttonStyle, detailCardStyle } from "../../style/CommonStyle";
import { upBottom } from "../../style/CommonBoardStyle";
import { editTitle, editContent, liekCommentButton, liekComment, userDate, detailCategory, detailTitle, detailContent, backButton } from "../../style/CommonDetail";
import { FaUser, FaArrowUp,  FaRegComment  } from 'react-icons/fa';
import { BiLike, BiSolidLike } from "react-icons/bi";

//code 마크다운
import ReactMarkdown from "react-markdown";
import remarkGfm from 'remark-gfm'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { prism } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { setCategory } from "../../store/userSlice";

//입력창 코드 테마 가져오기 
import Editor, { useMonaco } from "@monaco-editor/react";
import tomorrowNightTheme from 'monaco-themes/themes/Tomorrow-Night.json';


//상세 게시글 보드
const DetailBoard = () => {
  const email = useSelector((state) => state.user.email);
  const nickName = useSelector((state) => state.user.nickName);
  const role = useSelector((state) => state.user.role);

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

  const myCategory = location.state?.category;  
  const [category, setCategory] = useState(myCategory);
  console.log("myCategory(location.state?.category): " + myCategory);
  console.log("category(DetailBoard: useState): " + category);

  const [commentCount, setCommentCount] = useState(0);
  //전처리 된 코드 
  const [cleanedCode, setCleanedCode] = useState('');
  const [language, setLanguage] = useState('');

  //수정 삭제 확인 모달
  const [confirmUpdateOpen, setConfirmUpdateOpen] = useState(false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);

  const OpenState = useSelector((state) => state.post.isOpenLeftHeader);

  //textarea 높이 자동화
  const textareaRef = useRef(null);
  const scrollRef = useRef(null);

  // 내가 사용할 모나코 인스턴스를 생성
  const monaco = useMonaco();    
  
  //맨 위로가기 버튼 
  const scrollToTop = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    setCategory(myCategory);
  }, [myCategory]);

  //비회원이 좋아요 눌렀을때 띄울 메시지 
  const [showGuestMessage, setShowGuestMessage] = useState(false);
  const handleGuestClick = () => {
    setShowGuestMessage(true);
    setTimeout(() => {
      setShowGuestMessage(false);
    }, 2000); // 2초 후 자동 사라짐
  };

  useEffect(() => {
    if (!monaco) return; // Monaco 인스턴스가 로드되지 않았으면 바로 종료

    //tomorrowNightTheme 테마와 색 복사하여 가져오고 
    //포커스 시 나타나는 테두리(파랑)만 투명으로 
    const customTheme = {
      ...tomorrowNightTheme,
      colors: {
        ...tomorrowNightTheme.colors,
        'focusBorder': '#00000000',
        'editor.background': '#1e1e1e',
      },
    };

    //커스텀 테마 오브젝트 완성 후 이름 등록 
    monaco.editor.defineTheme('custom-theme', customTheme);
    monaco.editor.setTheme('custom-theme');
  }, [monaco]);

  //code 전처리 함수 
  const stripCodeBlock = (codeBlock) => {
    console.log(codeBlock);
    // 언어 추출
    const languageMatch = codeBlock.match(/^```(\w+)/);
    const programLanguage = languageMatch ? languageMatch[1] : null;

    setLanguage(programLanguage);

    // 코드 추출: 시작 ```언어 와 끝 ``` 제거
    return codeBlock
      .replace(/^```[\w-]*\s*/, '')  // 앞쪽: ``` + 언어명 + 공백 제거
      .replace(/\s*```$/, '');       // 뒤쪽: ``` 제거
  }

  useEffect(() => {
    //자동 스크롤
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto"; // 높이 초기화
      textarea.style.height = textarea.scrollHeight + "px"; // 실제 콘텐츠 높이로 설정
    }
  }, [code, content]);

  useEffect(() => {
    ApiClient.getBoard(boardId)
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

    //code 전처리 
    const cleaned = stripCodeBlock(code);
    setCleanedCode(cleaned);
    console.log("cleaned language: " + language);
  }, [isEdit, board]);

  //삭제 버튼
  const boardDeleteButton = (boardId) => {
    ApiClient.deleteBoard(boardId, category)
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
      navigate("/board/" + category);
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
    const finalCode = ["```" + language, cleanedCode, "```"].join("\n");
    ApiClient.updateBoard(boardId, category, title, content, finalCode, updateAt)
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
      navigate(`/detailBoard/${boardId}`);
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
    ApiClient.sendBoardGood(boardId)
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
    ApiClient.deleteBoardGood(boardId)
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
      <div className="w-full flex md:flex-row max-md:flex-col md:mt-20">
        <LeftHeader />
        {/* 메인 콘텐츠 */}
        <main className={detailFrame}>
          <div ref={scrollRef} className={`${scrollStyle} ${OpenState ? 'max-md:h-[63vh] md:h-full ' : 'max-md:h-[83vh]'} w-full max-w-full break-words mt-1 ml-20 pr-40 max-md:m-1 max-md:p-2 max-md:overflow-x-hidden`}>
            {!board ? 
            (
              <div className="text-white text-center mt-10">불러오는 중...</div>
            ):(
              <>
              <button
                onClick={() => {
                   console.log("navigate 클릭됨, category:", category); // 디버깅

                    if (!category || category.trim() === "" || category === "dash") {
                      console.log("대시보드로 이동");
                      navigate("/dashboard/home");
                    } else {
                      console.log("게시판으로 이동");
                      navigate(`/board/${category}`, { state: { from: "back" } });
                    }
                }}
                className={buttonStyle + backButton}
              >
                이전
              </button>     
              {isEdit ? (              
                <div className={detailCardStyle}>
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
                      <span className='text-xs text-gray-300 mt-1'>
                        {new Date(board.createAt).toISOString().slice(0, 16).replace('T', ' ')}
                      </span>                  
                    </div>

                    {category === "code"
                      ? 
                      <Editor
                        height="200px"
                        defaultLanguage="markdown"
                        language={language}
                        value={cleanedCode}
                        onChange={(value) => setCleanedCode(value)}
                        theme='custom-theme'
                        options={{
                          minimap: { enabled: false },            // 🔹 오른쪽 미니맵 제거
                          fontSize: 14,
                          scrollBeyondLastLine: false,            // 스크롤 밑 여백 제거
                          placeholder: "작성할 코드/에러를 적어 주세요", // 🔹 placeholder 직접 지정
                        }}
                        className="my-custom-class p-1 overflow-x-auto max-w-full"  //스크롤바 설정 가져옴
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
                          <BiLike className="size-5 mr-1"/>
                          {board.likeCount}
                        </span>
                        {category === 'code' ?
                        <span className="flex items-center">
                          <FaRegComment className="size-5 mr-1" />
                          {board.commentCount}
                        </span>
                        :null}
                        
                      </div>
                      <div className="flex gap-2">
                        <button
                          className={buttonStyle + " bg-green-600 text-white px-3 py-1 text-sm hover:bg-green-700"}
                          onClick={() => setConfirmUpdateOpen(true)}
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
                  <h2 className={detailTitle}>{board.title}</h2>
                  <div className={userDate}>
                    <span className='flex gap-1'>
                      <FaUser
                      className="mt-0.5"
                      />
                      {board.nickName}
                    </span>
                    <span className='text-xs text-gray-300 mt-1'>
                      {new Date(board.createAt).toISOString().slice(0, 16).replace('T', ' ')}
                    </span>                  
                  </div>
                  <div className="border-t border-white/10 mb-3" />
                  { (category === "code" || category === 'me') && (role !== 'ROLE_ADMIN')
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
                                className="rounded overflow-x-auto max-w-[100%]"
                                wrapLongLines={true} // ✅ 긴 줄 wrap 처리
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
                    : null}
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
                        {isLike ? <BiSolidLike  className="size-5 mr-1"/> : <BiLike className="size-5 mr-1"/>}
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
                        <FaRegComment className="size-5 mr-1" />
                        {commentCount}
                      </span>
                      :null}                      
                    </div>

                    <div className="flex gap-3">
                    {(nickName === board.nickName) && (                    
                        <button
                          onClick={() => setIsEdit(true)}
                          className="text-sm text-white hover:underline"
                        >
                          수정하기
                        </button>                    
                    )}
                    {(nickName === board.nickName || role === "ROLE_ADMIN")&&(
                      <button
                        onClick={() => setConfirmDeleteOpen(true)}
                        className="text-sm text-red-400 hover:underline"
                      >
                        삭제하기
                      </button>
                    )}
                    </div>                 
                  </div>
                </div>
              )}  
              </>
            )}
            
            <div className="max-md:p-1">
              <Comments boardId={boardId} category={category} />  
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
      
      {/* 수정 확인 모달 */}
      {confirmUpdateOpen && (
        <ConfirmBoardModal
          onConfirm={() => {
            saveBoard(boardId);
            setConfirmUpdateOpen(false);
          }}
          onCancel={() => setConfirmUpdateOpen(false)}
          onMode={"update"}
        />
      )}
      {/* 삭제 확인 모달 */}
      {confirmDeleteOpen && (
        <ConfirmBoardModal
          onConfirm={() => {
            boardDeleteButton(boardId);
            setConfirmDeleteOpen(false);
          }}
          onCancel={() => setConfirmDeleteOpen(false)}
          onMode={"delete"}
        />
      )}
    </div>
  );
};

export default DetailBoard;