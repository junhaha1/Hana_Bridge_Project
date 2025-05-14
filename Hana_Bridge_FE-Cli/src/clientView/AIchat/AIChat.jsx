import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from 'remark-gfm'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { prism } from 'react-syntax-highlighter/dist/esm/styles/prism';
import Header from '../header/Header';
import LeftHeader from '../header/LeftHeader';
import RightHeader from '../header/RightHeader';
import ApiClient from '../../service/ApiClient';

import "../../css/Scroll.css";
import { useSelector, useDispatch } from 'react-redux';
import { setAiChat, clearAiChat } from '../../store/userSlice';


function AIChat() {
  const [messages, setMessages] = useState([
    { role: '답변', content: `🤖 CodeHelper에 오신 걸 환영합니다! \n 에러 코드와 사용 언어를 입력해보세요.` },
  ]);
  const [input, setInput] = useState('');  //질문 1개 
  const [question, setQuestion] = useState(''); //질문들의 모음
  //채팅의 마지막을 가르킴
  const messagesEndRef = useRef(null);  
  const textRef = useRef(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [promptLevel, setPromptLevel] = useState(0);
  //ai chat 답변 로딩
  const [isLoading, setIsLoading] = useState(false);
  //ai 게시판 만들기 로딩
  const [isPostLoading, setIsPostLoading] = useState(false);
  const [coreContent, setCoreContent] = useState('');

  const accessToken = useSelector((state) => state.user.accessToken);
  const prevMessage = useSelector((state) => state.user.chatMessages);

  //게시판 게시 문의 모달
  const [showModal, setShowModal] = useState(false);
  const openPostModal = (content) => {
    setCoreContent(content);    
    setShowModal(true);
  }
  const closePostModal = () => setShowModal(false);
  //이전 내용 불러오기 모달
  const [showChatModel, setShowChatModel] = useState(false);
  const closeChatModal = () => {
    dispatch(clearAiChat()); // 메시지만 Redux에서 초기화
  
    // 기존 userState 가져오기
    const existingState = JSON.parse(localStorage.getItem('userState'));
    if (existingState) {
      existingState.chatMessages = []; // 메시지만 삭제
      localStorage.setItem('userState', JSON.stringify(existingState)); // 다시 저장
    }
  
    setShowChatModel(false);
  }; 

  //초기에 이전 내용이 없다면 "이전내용 불러오기" 모달이 뜨지 안도록 설정
  useEffect(() => {
    if (prevMessage.length === 1 && prevMessage[0]?.content === '에러 코드를 사용중인 언어와 함께 보내주세요!') {
      setShowChatModel(false);
    } else if (prevMessage.length > 0) {
      setShowChatModel(true);
    }
  }, []);
  

  //메시지가 추가될 때마다 거기로 스크롤 이동
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  //이전 내용 가져오기 함수 
  const bringMessage = () => {
    if (prevMessage && prevMessage.length > 1) {
      setMessages(prevMessage);
    } else {
      const saved = JSON.parse(localStorage.getItem('userState'));
      if (saved?.chatMessages && saved.chatMessages.length > 1) {
        setMessages(saved.chatMessages);
      }
    }
    setShowChatModel(false);
  };
  

  //사용자 입력창 크기 조절절
  const handleResizeHeight = () => {
    const element = textRef.current;
		textRef.current.style.height = 'auto';  //backspace 눌렀을 때에도 높이 자동 조절
    const maxHeight = 5 * 24; // 5줄 x 줄 높이 약 24px
    element.style.height = `${Math.min(element.scrollHeight, maxHeight)}px`; //height값 자동 조절 + 높이 제한   
    
  };

  //사용자 질문 보내기 
  const sendMessage = () => {
    if (!input.trim()) return;

    const newMessage = { role: '질문', content: input};    
    const updatedMessages = [...messages, newMessage]; // 사용자 메시지까지 포함한 배열
  
    setMessages(updatedMessages);
    setInput('');
  
    if (textRef.current) {
      textRef.current.style.height = 'auto';
    }

    const result = updatedMessages.map(msg => msg.role + ": " + msg.content).join('\n');
  
    setIsLoading(true); 
    ApiClient.sendMessage(accessToken, promptLevel, result, input)
      .then((res) => {
        if (!res.ok) throw new Error(`서버 오류: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        const aiResponse = { role: '답변', content: data.answer };
        const finalMessages = [...updatedMessages, aiResponse]; // 사용자 + AI 메시지 모두 포함
  
        setMessages(finalMessages);
        dispatch(setAiChat({ chatMessages: finalMessages }));
        setIsLoading(false);
      })
      .catch((err) => console.error("API 요청 실패:", err));
  };
  

  //enter로 전송
  const handleKeyDown = (e) => {
    if (e.key === 'Enter'){
      e.preventDefault();  // 새로고침 방지
      sendMessage();
    } 
  };

  //Assemble Board만들기
  const postAssemble = () =>{
    console.log(coreContent);

    setIsPostLoading(true);
    
    //redux, localstorage 비우기 
    dispatch(clearAiChat()); // 메시지만 Redux에서 초기화
    const existingState = JSON.parse(localStorage.getItem('userState'));
    if (existingState) {
      existingState.chatMessages = []; // 메시지만 삭제
      localStorage.setItem('userState', JSON.stringify(existingState)); // 다시 저장
    }
    closePostModal();
    const result = messages.slice(0).map(msg => msg.role + ": " + msg.content).join('\n');

    ApiClient.postAssemble(accessToken, promptLevel, result, coreContent)
    .then((res) => {
      if (!res.ok) throw new Error(`서버 오류: ${res.status}`);
      return res.json();
    })
    .then((data) => {      
      const assembleboardId  = data.assembleBoardId;
      console.log(assembleboardId);
      setIsPostLoading(false);
      navigate(`/detailAssemble/${assembleboardId}`);
    })
    .catch((err) => console.error("API 요청 실패:", err));
  };


  return (
    <div className="w-screen min-h-screen bg-gradient-to-r from-indigo-900 to-purple-900 text-white overflow-auto relative">
      <Header />

      <div className="w-full flex flex-col mt-24">
        <div className="w-full flex flex-col lg:flex-row gap-4 px-2 sm:px-6">
          <div className="w-full lg:w-1/5">
            <LeftHeader />
          </div>

          <div className="w-full lg:w-3/5">
            <div className="max-w-3xl mx-auto px-4 sm:px-6">
              <h1 className="text-3xl font-bold mb-6 text-center">AI Code Helper</h1>

              <div className="custom-scroll bg-white/10 backdrop-blur-sm p-4 rounded-md shadow-md h-[60vh] overflow-y-auto">
                {messages.map((msg, idx) => (
                  <React.Fragment key={idx}>
                    <div
                      className={`flex ${msg.role === '답변' ? 'justify-start' : 'justify-end'} my-2`}
                    >
                      <div
                        className={`max-w-[80%] p-3 rounded-lg text-sm whitespace-pre-wrap ${
                          msg.role === '답변'
                            ? 'bg-transparent text-white border border-white/40'
                            : 'bg-[#322776] text-white'
                        }`}
                      >
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
                                >
                                  {String(children).replace(/\n$/, '')}
                                </SyntaxHighlighter>
                              ) : (
                                <code {...props} className={className}>
                                  {children}
                                </code>
                              );
                            },
                          }}
                        >
                          {msg.content}
                        </ReactMarkdown>
                      </div>
                    </div>

                    {msg.role === '답변' && !isPostLoading && msg.content !== `🤖 CodeHelper에 오신 걸 환영합니다! \n 에러 코드와 사용 언어를 입력해보세요.` && (
                      <div className="flex justify-start">
                        <button
                          className="text-sm bg-gray-800 text-white px-3 py-1 rounded-md"
                          onClick={() => openPostModal(msg.content)}
                        >
                          답변 채택
                        </button>
                      </div>
                    )}                    
                  </React.Fragment>
                ))}

                {isLoading && (
                  <div className="flex justify-start my-2">
                    <div className="loader w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                  </div>
                )}
                {isPostLoading && (
                  <div className="text-center text-white mt-4 animate-pulse text-lg">LOADING...</div>
                )}
                <div ref={messagesEndRef} />
              </div>

              <div className="mt-4">
                <div className="flex justify-end mb-2 pr-2 flex gap-2 whitespace-nowrap">
                  <button
                    onClick={() => setPromptLevel(0)}
                    className={`px-2 py-0.5 rounded-full text-xs ${
                      promptLevel === 0 ? 'bg-white text-black' : 'border border-white text-white'
                    }`}
                  >
                    초보자
                  </button>
                  <button
                    onClick={() => setPromptLevel(1)}
                    className={`px-2 py-0.5 rounded-full text-xs ${
                      promptLevel === 1 ? 'bg-white text-black' : 'border border-white text-white'
                    }`}
                  >
                    전문가
                  </button>
                </div>                            

                <div className="w-full flex justify-center px-4 pb-6 mt-2">
                  <div className="relative w-full max-w-4xl bg-white/5 backdrop-blur-md rounded-xl p-3 border border-white/10">
                    {/* textarea + 버튼 */}
                    <textarea
                      rows={1}
                      className="custom-scroll w-full resize-none bg-transparent text-white placeholder-gray-400 focus:outline-none pr-10"
                      placeholder="메시지를 입력하세요..."
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onInput={handleResizeHeight}
                      onKeyDown={handleKeyDown}
                      ref={textRef}
                    />
                    <button
                      onClick={sendMessage}
                      className="absolute right-10 top-3/4 -translate-y-1/2 hover:opacity-80"
                    >
                      <img src="/images/send.png" alt="보내기" width="25" />
                    </button>
                  </div>
                </div>

              </div>              
            </div>
          </div>

          <div className="w-full lg:w-1/5">
            <RightHeader />
          </div>
        </div>
      </div>

      {/* 모달: 답변 채택 */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white text-black rounded-md p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">답변 채택</h2>
            <p className="mb-4">해당 질문과 답변을 채택 하시겠습니까?<br />채택하시면 질문과 내용이 요약되어 게시됩니다.</p>
            <div className="flex justify-end gap-2">
              <button className="bg-gray-300 px-4 py-1 rounded" onClick={closePostModal}>취소</button>
              <button className="bg-indigo-600 text-white px-4 py-1 rounded" onClick={postAssemble}>확인</button>
            </div>
          </div>
        </div>
      )}

      {/* 모달: 지난 대화 불러오기 */}
      {showChatModel && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white text-black rounded-md p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">AI Chat 내용 가져오기</h2>
            <p className="mb-4">지난 대화 내용을 불러오시겠습니까?<br />취소하시면 지난 대화 내용이 삭제 됩니다.</p>
            <div className="flex justify-end gap-2">
              <button className="bg-gray-300 px-4 py-1 rounded" onClick={closeChatModal}>취소</button>
              <button className="bg-indigo-600 text-white px-4 py-1 rounded" onClick={bringMessage}>불러오기</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
  
}

export default AIChat;
