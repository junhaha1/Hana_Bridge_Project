import ApiClient from "../../service/ApiClient";
import Header from '../header/Header';
import { useSelector } from 'react-redux';
import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useParams } from 'react-router-dom';

import ReactMarkdown from "react-markdown";
import remarkGfm from 'remark-gfm'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { prism } from 'react-syntax-highlighter/dist/esm/styles/prism';

import LeftHeader from "../header/LeftHeader";
import RightHeader from "../header/RightHeader";
import CodeHelper from '../CodeHelper';

//어셈블 상세 게시글 보드
const DetailAssemble = () => {
  const email = useSelector((state) => state.user.email);
  const nickName = useSelector((state) => state.user.nickName);
  const role = useSelector((state) => state.user.role);
  const accessToken = useSelector((state) => state.user.accessToken);

  const { assembleBoardId } = useParams(); 
  console.log(assembleBoardId);

  const [board, setBoard] = useState(null);

  const [isLike, setIsLike] = useState('');
  const [likeCount, setLikeCount] = useState(0);

  const navigate = useNavigate();

  //const category = location.state?.category;

  useEffect(() => {
    ApiClient.getAssembleBoard(assembleBoardId, accessToken)
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
      console.log(data.goodCheck);
      setBoard(data);
      setLikeCount(data.likeCount);
      setIsLike(data.goodCheck);
    })
    .catch((err) => {
      console.error("API 요청 실패:", err);
      // 404일 때 에러 페이지로 이동
      if (err.code && err.code.includes('NOT_FOUND')) {
        navigate("/error");
      }
    });     
  }, [assembleBoardId]);

  if (!board) return <div>로딩 중...</div>;

  //삭제 버튼
  const boardDeleteButton = (assembleBoardId) => {
    ApiClient.deleteAssembleBoard(assembleBoardId, accessToken)
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
      console.log("게시글 삭제 완료!");
      navigate('/');
    })
    .catch((err) => {
      console.error("API 요청 실패:", err);
      // 404일 때 에러 페이지로 이동
      if (err.code && err.code.includes('NOT_FOUND')) {
        navigate("/error");
      }
    });  
  }

  //좋아요
  const handleLike = (assembleBoardId) => {
    ApiClient.sendAssembleGood(assembleBoardId, accessToken)
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
      console.error("API 요청 실패:", err);
    });      
  }
  //좋아요 삭제
  const handleCancelLike = (assembleBoardId) => {
    ApiClient.deleteAssembleGood(assembleBoardId, accessToken)
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
      console.error("API 요청 실패:", err);
    });  
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-900 to-purple-900 flex flex-col lg:flex-row">
      <Header />
      {/* 왼쪽 사이드바 */}
      <div className="w-full lg:w-1/5">
        <LeftHeader />
      </div>

      {/* 메인 콘텐츠 */}
      <div className="w-full lg:w-3/5">       

        <div className="mt-20 max-w-screen-lg mx-auto px-4">
          {/* 게시글 카드 (테두리 제거) */}
          <div className="mb-6">
            <div className="p-6 rounded-lg bg-transparent text-white">
              {/* 경로 표시 */}
              <div className="text-sm text-white/60 mb-2 text-left">
                ASSEMBLE 게시판 &lt; 상세글
              </div>

              {/* 제목 */}
              <h2 className="text-2xl font-bold text-left mb-1">{board.title}</h2>

              {/* 작성자 */}
              <p className="text-sm text-white/60 text-left mb-4">
                작성자 {board.nickName}
              </p>

              {/* 내용 */}
              <div className="text-left">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    code({ node, inline, className, children, ...props }) {
                      const match = /language-(\w+)/.exec(className || '');
                      return !inline && match ? (
                        <SyntaxHighlighter
                          {...props}
                          style={prism}
                          language={match[1]}
                          PreTag="div"
                          className="rounded-md overflow-x-auto"
                        >
                          {String(children).replace(/\n$/, '')}
                        </SyntaxHighlighter>
                      ) : (
                        <code
                          {...props}
                          className={`${className} bg-gray-800 text-white px-1 rounded`}
                        >
                          {children}
                        </code>
                      );
                    },
                  }}
                >
                  {board.content}
                </ReactMarkdown>
              </div>

              {/* 좋아요 / 댓글 / 삭제 */}
              <div className="flex justify-between items-center mt-6">
                {/* 좋아요 & 댓글 */}
                <div className="flex items-center space-x-6 text-white">
                  {isLike ? (
                    <span
                      className="cursor-pointer flex items-center"
                      onClick={() => handleCancelLike(assembleBoardId)}
                    >
                      <img src="/images/blueGood.png" alt="좋아요" className="w-5 h-5 mr-1" />
                      {likeCount}
                    </span>
                  ) : (
                    <span
                      className="cursor-pointer flex items-center"
                      onClick={() => handleLike(assembleBoardId)}
                    >
                      <img src="/images/whiteGood.png" alt="좋아요" className="w-5 h-5 mr-1" />
                      {likeCount}
                    </span>
                  )}

                  <span className="flex items-center">
                    <img src="/images/comment.png" alt="댓글" className="w-5 h-5 mr-1" />
                    {board.commentsCount}
                  </span>
                </div>

                {/* 삭제 */}
                {(nickName === board.nickName || role === "admin") && (
                  <button
                    className="text-red-400 text-sm hover:underline"
                    onClick={() => boardDeleteButton(assembleBoardId)}
                  >
                    삭제하기
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* 구분선 */}
          <div className="border-t-2 border-white/70 my-8" />


          {/* 이전 버튼 */}
          <div className="mt-8">
            <Link
              to="/board/assemble"
              className="bg-green-600 text-white px-4 py-1 rounded text-sm hover:bg-green-700"
            >
              이전
            </Link>
          </div>
        </div>
      </div>

      {/* 오른쪽 사이드바 */}
      <div className="w-full lg:w-1/5">
        <RightHeader />
      </div>
      {email !== "guest@email.com" && <CodeHelper />}
    </div>
  );


  
};

export default DetailAssemble;