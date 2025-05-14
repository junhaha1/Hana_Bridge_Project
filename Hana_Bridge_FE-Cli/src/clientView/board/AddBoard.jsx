import React, { useState } from 'react';
import ApiClient from '../../service/ApiClient';
import Header from '../header/Header';
import { useNavigate, Link } from "react-router-dom";
import { useSelector } from 'react-redux';
import LeftHeader from '../header/LeftHeader';
import RightHeader from '../header/RightHeader';
import '../../css/Board/AddBoard.css';
import '../../css/Common.css';

const AddBoard = () => {
  const accessToken = useSelector((state) => state.user.accessToken);
  const role = useSelector((state) => state.user.role);

  const [category, setCategory] = useState('code');
  const [title, setTitle] = useState('');
  const [code, setCode] = useState('');
  const [content, setContent] = useState('');
  const [createAt, setCreateAt] = useState(new Date());
  const [updateAt, setUpdateAt] = useState(new Date());  

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ category, title, content });
    setCreateAt(new Date());
    setUpdateAt(new Date());
    // TODO: API 요청 처리
    ApiClient.sendBoard(accessToken, title, category, content, code, createAt, updateAt)
    .then(() => {
      alert("게시글이 등록되었습니다. ");
      navigate('/');
    })
    .catch((err) => console.error("API 요청 실패:", err));
  };

  return (
    <div className="w-screen min-h-screen bg-gradient-to-r from-indigo-900 to-purple-900 text-white p-6 flex flex-col lg:flex-row">
      <Header />

      <div className="w-full lg:w-1/5">
        <LeftHeader />
      </div>

      <div className="w-full lg:w-3/5">
        <div className="container mx-auto mt-6 px-4">
          <h4 className="text-2xl font-bold mb-3 pb-2">글 작성하기</h4>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 카테고리 선택 */}
            <div>
              <label className="block font-semibold mb-2">
                {role === "ROLE_ADMIN" ? "게시판 선택" : "게시판 카테고리"}
                <span className="text-red-500">*</span>
              </label>

              <div className="flex gap-2 flex-wrap">
                {role === "ROLE_ADMIN" && (
                  <>
                    <button
                      type="button"
                      onClick={() => setCategory('notice')}
                      className={`px-4 py-2 rounded-full text-sm ${
                        category === 'notice'
                          ? 'bg-white text-indigo-900 font-bold'
                          : 'border border-white text-white'
                      }`}
                    >
                      NOTICE 게시판
                    </button>
                  </>
                )}
                <button
                  type="button"
                  onClick={() => setCategory('code')}
                  className={`px-4 py-2 rounded-full text-sm ${
                    category === 'code'
                      ? 'bg-white text-indigo-900 font-bold'
                      : 'border border-white text-white'
                  }`}
                >
                  CODE 게시판
                </button>
              </div>
            </div>

            {/* 제목 */}
            <div>
              <label className="block font-semibold mb-2">
                제목<span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="게시글 제목을 적어 주세요"
                className="w-full bg-transparent border-b border-white text-white placeholder-white/70 focus:outline-none focus:ring-0"
              />
            </div>

            {/* 코드 작성 */}
            {category === 'code' && (
              <div>
                <textarea
                  rows={10}
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="작성할 코드/에러를 적어 주세요"
                  className="w-full bg-transparent border border-white text-white placeholder-white/70 rounded-md p-3 resize-none focus:outline-none focus:ring-0"
                />
              </div>
            )}

            {/* 본문 작성 */}
            <div>
              <textarea
                rows={10}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="작성할 글을 적어 주세요"
                className="w-full bg-transparent border border-white text-white placeholder-white/70 rounded-md p-3 resize-none focus:outline-none focus:ring-0"
              />
            </div>

            {/* 버튼 */}
            <div className="flex justify-center gap-4">
              <button
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2 rounded-md"
              >
                작성하기
              </button>
              <Link
                to="/"
                className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-md text-sm"
              >
                처음으로
              </Link>
            </div>
          </form>
        </div>
      </div>
      <div className="w-full lg:w-1/5">
        <RightHeader />
      </div>
    </div>
  );

};

export default AddBoard;
