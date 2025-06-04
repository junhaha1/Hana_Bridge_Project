import React, { useState, useEffect } from 'react';
import ApiClient from '../../service/ApiClient';
import Header from '../header/Header';
import { useNavigate, Link } from "react-router-dom";
import { useSelector } from 'react-redux';
import LeftHeader from '../header/LeftHeader';

import { mainFrame, detailFrame } from "../../style/CommonFrame";
import { scrollStyle } from '../../style/CommonStyle';
import { addBoardButton, addTitle, addContent, addCode } from '../../style/AddBoardStyle';

import Editor, { useMonaco } from "@monaco-editor/react";
import * as monaco from 'monaco-editor';
import tomorrowNight from 'monaco-themes/themes/Tomorrow-Night.json';

const AddBoard = () => {
  const role = useSelector((state) => state.user.role);

  //이전으로 버튼을 위한 카테고리 
  const toCategory = useSelector((state) => state.user.category);
  console.log(toCategory);

  //글씨 업로드 할 카테고리
  const [category, setCategory] = useState(toCategory);
  const [title, setTitle] = useState('');
  const [code, setCode] = useState('');
  const [content, setContent] = useState('');
  const [createAt, setCreateAt] = useState(new Date());
  const [updateAt, setUpdateAt] = useState(new Date());  

  //코드 토글 버튼 
  const [isOpen, setIsOpen] = useState(false);

  //언어 선택 박스
  const [language, setLanguage] = useState("");

  const monaco = useMonaco();
  // 내가 사용할 모나코 인스턴스를 생성한다.

  useEffect(() => {
    if (!monaco) return;

    monaco.editor.defineTheme('Tomorrow-Night', tomorrowNight);
    monaco.editor.setTheme('Tomorrow-Night');
  }, [monaco]);


  const renderLanguageSelectBox = () => {
    const languages = [
      { label: "JavaScript", value: "javascript" },
      { label: "Python", value: "python" },
      { label: "Java", value: "java" },
      { label: "C++", value: "cpp" },
      { label: "C#", value: "csharp" },
      { label: "Go", value: "go" },
      { label: "Rust", value: "rust" },
      { label: "TypeScript", value: "typescript" },
      { label: "Kotlin", value: "kotlin" },
      { label: "Swift", value: "swift" },
    ];

    return (
      <div className="w-full py-2 border-t border-white/20 flex flex-row">
        <label className="my-2 mx-4 text-sm text-center">
          프로그래밍 언어 선택
        </label>
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="w-[200px] px-3 text-sm text-gray-900 font-semibold hover:bg-white rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">언어를 선택해주세요</option>
          {languages.map((lang) => (
            <option key={lang.value} value={lang.value}>
              {lang.label}
            </option>
          ))}
        </select>
      </div>
    );
  };
    

  useEffect(() =>{
    if(role !== "ROLE_ADMIN"){
      setCategory('code');
    }
  }, []);

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ category, title, content });
    setCreateAt(new Date());
    setUpdateAt(new Date());
    //const finalCode = `\`\`\`${language}\n${code}\n\`\`\``;
    //const finalCode = "```" + language + "\n" + code + "\n```";
    const finalCode = ["```" + language, code, "```"].join("\n");
    console.log(finalCode);
    // TODO: API 요청 처리
    ApiClient.sendBoard(title, category, content, finalCode, createAt, updateAt)
    .then(async (res) => {
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message);
      }
      return await res.json(); 
    })
    .then((data) => {
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

      <div className="w-full flex md:flex-row max-md:flex-col md:mt-20">
        <LeftHeader />
        <main className={detailFrame}>
          <div className={scrollStyle + " md:h-[80vh] mt-1 ml-20 pr-40 max-md:m-1 max-md:p-2 max-md:overflow-x-hidden"}>
            <h4 className="text-2xl font-bold mb-1 pb-2">글 작성하기</h4>

            <p className='text-white/80'>코드 질문 게시판</p>

            <div className="flex flex-col">
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
              {category === 'notice' ? null : (
                <div>
                  <div className="w-full mx-auto mb-3 border rounded-lg">
                    <button
                      onClick={() => setIsOpen(!isOpen)}
                      className="w-full text-left p-2 hover:bg-white/20 rounded-md flex justify-between items-center"
                    >
                      <span className="font-medium">에러 코드</span>
                      <span>{isOpen ? "▲" : "▼"}</span>
                    </button>

                    {isOpen && (
                      <div className='h-full'>
                        {renderLanguageSelectBox()}
                        <Editor
                          height="200px"
                          defaultLanguage="markdown"
                          value={code}
                          onChange={(value) => setCode(value)}
                          theme="Tomorrow-Night" 
                          options={{
                            minimap: { enabled: false },            // 🔹 오른쪽 미니맵 제거
                            fontSize: 14,
                            wordWrap: 'on',
                            scrollBeyondLastLine: false,
                            placeholder: "작성할 코드/에러를 적어 주세요", // 🔹 placeholder 직접 지정
                          }}
                          className="my-custom-class p-1"
                        />
                      </div>
                    )}
                  </div>
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
                  onClick={() => navigate(`/board/${toCategory}`)}
                  className={addBoardButton}
                >
                  처음으로
                </button>
                <button
                  onClick={handleSubmit}
                  className={addBoardButton}
                >
                  작성하기
                </button>                
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );

};

export default AddBoard;
