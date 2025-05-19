import React, { useEffect, useState } from "react";
import { useSelector } from 'react-redux';
import { useNavigate, Link, useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from 'remark-gfm'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { prism } from 'react-syntax-highlighter/dist/esm/styles/prism';

import ApiClient from "../../service/ApiClient";
import Header from '../header/Header';
import LeftHeader from "../header/LeftHeader";
import RightHeader from "../header/RightHeader";
import CodeHelper from '../CodeHelper';
import { scrollStyle } from "../../style/CommonStyle";

const DetailAssemble = () => {
  const email = useSelector((state) => state.user.email);
  const nickName = useSelector((state) => state.user.nickName);
  const role = useSelector((state) => state.user.role);
  const accessToken = useSelector((state) => state.user.accessToken);

  const { assembleBoardId } = useParams();
  const [board, setBoard] = useState(null);
  const [isLike, setIsLike] = useState('');
  const [likeCount, setLikeCount] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    ApiClient.getAssembleBoard(assembleBoardId, accessToken)
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
        setBoard(data);
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

  const boardDeleteButton = (assembleBoardId) => {
    ApiClient.deleteAssembleBoard(assembleBoardId, accessToken)
      .then(async (res) => {
        if (!res.ok) {
          const errorData = await res.json();
          const error = new Error(errorData.message || `서버 오류: ${res.status}`);
          error.code = errorData.code;
          throw error;
        }
        navigate('/');
      })
      .catch((err) => {
        console.error("API 요청 실패:", err);
        if (err.code && err.code.includes('NOT_FOUND')) {
          navigate("/error");
        }
      });
  };

  const handleLike = (assembleBoardId) => {
    ApiClient.sendAssembleGood(assembleBoardId, accessToken)
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
        setIsLike(data.goodCheck);
        setLikeCount(data.likeCount);
      })
      .catch((err) => {
        console.error("좋아요 실패:", err);
      });
  };

  const handleCancelLike = (assembleBoardId) => {
    ApiClient.deleteAssembleGood(assembleBoardId, accessToken)
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
        setIsLike(data.goodCheck);
        setLikeCount(data.likeCount);
      })
      .catch((err) => {
        console.error("좋아요 취소 실패:", err);
      });
  };

  if (!board) return <div className="text-white p-4">로딩 중...</div>;

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-r from-indigo-900 to-purple-900">
      <Header />

      <div className="flex flex-1 mt-20 overflow-hidden">
        {/* 왼쪽 사이드바 */}
        <div className="w-1/5 hidden lg:block">
          <LeftHeader />
        </div>

        {/* 메인 콘텐츠 */}
        <main className="w-full lg:w-3/5 px-4 overflow-y-auto custom-scroll pb-20">
          <div className="max-w-screen-lg mx-auto">
            <div className="text-sm text-white/60 mb-2">ASSEMBLE 게시판 &lt; 상세글</div>

            <h2 className="text-2xl font-bold text-white">{board.title}</h2>
            <p className="text-sm text-white/60 mb-4">작성자 {board.nickName}</p>

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
                        className="rounded-md overflow-x-auto"
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
                {board.content}
              </ReactMarkdown>
            </div>

            {/* 좋아요, 댓글, 삭제 */}
            <div className="flex justify-between items-center mt-6">
              <div className="flex items-center space-x-6 text-white">
                {isLike ? (
                  <span className="cursor-pointer flex items-center" onClick={() => handleCancelLike(assembleBoardId)}>
                    <img src="/images/blueGood.png" alt="좋아요" className="w-5 h-5 mr-1" />
                    {likeCount}
                  </span>
                ) : (
                  <span className="cursor-pointer flex items-center" onClick={() => handleLike(assembleBoardId)}>
                    <img src="/images/whiteGood.png" alt="좋아요" className="w-5 h-5 mr-1" />
                    {likeCount}
                  </span>
                )}
              </div>

              {(nickName === board.nickName || role === "ROLE_ADMIN") && (
                <button className="text-red-400 text-sm hover:underline" onClick={() => boardDeleteButton(assembleBoardId)}>
                  삭제하기
                </button>
              )}
            </div>

            <div className="border-t-2 border-white/70 my-8" />

            <Link to="/board/assemble" className="bg-green-600 text-white px-4 py-1 rounded text-sm hover:bg-green-700">
              이전
            </Link>
          </div>
        </main>

        {/* 오른쪽 사이드바 */}
        <div className="w-1/5 hidden lg:block">
          <RightHeader />
        </div>
      </div>

      {email !== "guest@email.com" && <CodeHelper />}
    </div>
  );
};

export default DetailAssemble;
