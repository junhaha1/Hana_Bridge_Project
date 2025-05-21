import React, { useState } from 'react';
import ApiClient from '../../service/ApiClient';
import Header from '../header/Header';
import { useNavigate, Link } from "react-router-dom";
import { useSelector } from 'react-redux';
import LeftHeader from '../header/LeftHeader';
import '../../css/Board/AddBoard.css';
import '../../css/Common.css';

import { mainFrame, detailFrame } from "../../style/CommonFrame";
import { scrollStyle } from '../../style/CommonStyle';
import { addBoardButton, addTitle, addContent } from '../../style/AddBoardStyle';

const AddBoard = () => {
  const accessToken = useSelector((state) => state.user.accessToken);
  const role = useSelector((state) => state.user.role);

  //이전으로 버튼을 위한 카테고리 
  const toCategory = useSelector((state) => state.user.category);

  //글씨 업로드 할 카테고리
  const [category, setCategory] = useState(toCategory);
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
    .then(async (res) => {
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message);
      }

      // ✅ 반드시 JSON을 return해야 다음 then에서 사용할 수 있음
      return await res.json(); 
    })
    .then((data) => {
      console.log("boardId: " + data); // 이제 data는 정상
      alert("게시글이 등록되었습니다.");
      navigate(`/detailBoard/${data}`, { state: { category: category } });
    })
    .catch((err) => {
      console.error("API 요청 실패:", err);
    });
  };

  return (
    <div className={mainFrame}>
      <Header />

      <div className="w-full flex flex-row mt-20">
        <LeftHeader />
        <main className={detailFrame}>
          <div className={scrollStyle + " h-[80vh] mt-5 ml-20 pr-60"}>
            <h4 className="text-2xl font-bold mb-1 pb-2">글 작성하기</h4>

            <p className='text-white/80'>코드 질문 게시판</p>

            <form onSubmit={handleSubmit} className="flex flex-col">
              {/* 카테고리 선택 */}
              {role === "ROLE_ADMIN" && (
                <div>                
                  <label className="block font-semibold mb-2">
                    게시판 선택 <span className="text-red-500">*</span>
                  </label>
                  <div className="flex gap-2 flex-wrap mb-3">
                    <button
                      type="button"
                      onClick={() => setCategory('notice')}
                      className={`px-4 py-2 rounded-full text-sm ${
                        category === 'notice'
                          ? 'bg-white/95 text-indigo-800 font-bold'
                          : 'border border-white text-white'
                      }`}
                    >
                      NOTICE 게시판
                    </button>
                      <button
                      type="button"
                      onClick={() => setCategory('code')}
                      className={`px-4 py-2 rounded-full text-sm ${
                        category === 'code'
                          ? 'bg-white/95 text-indigo-800 font-bold'
                          : 'border border-white text-white'
                      }`}
                    >
                      CODE 게시판
                    </button>
                  </div>
              </div>
              )}
              

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
                  className={addTitle}
                />
              </div>

              {/* 코드 작성 */}
              {category === 'code' && (
                <div>
                  <textarea
                    rows={7}
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="작성할 코드/에러를 적어 주세요"
                    className={addContent}
                  />
                </div>
              )}

              {/* 본문 작성 */}
              <div>
                <textarea
                  rows={7}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="작성할 글을 적어 주세요"
                  className={addContent}
                />
              </div>

              {/* 버튼 */}
              <div className="flex justify-center gap-4">
                <button
                  type="submit"
                  className={addBoardButton}
                >
                  작성하기
                </button>
                <button 
                  onClick={() => navigate(`/board/${toCategory}`)}
                  className={addBoardButton}
                >
                  처음으로
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );

};

export default AddBoard;
