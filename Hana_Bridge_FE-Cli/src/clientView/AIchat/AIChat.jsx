import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from 'remark-gfm'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { prism } from 'react-syntax-highlighter/dist/esm/styles/prism';
import Header from '../header/Header';
import LeftHeader from '../header/LeftHeader';
import AiRightHeader from '../header/AiRightHeader';
import ApiClient from '../../service/ApiClient';
import CodeHelper from '../CodeHelper';

import Lottie from "lottie-react";
import NewChat from "../../../public/animations/newChat.json";

import "../../css/Scroll.css";
import { useSelector, useDispatch } from 'react-redux';
import { setAiChat, clearAiChat, setPostLoading, setPostAssembleId } from '../../store/userSlice';


function AIChat() {
  const [messages, setMessages] = useState([
    { role: '답변', content: `🤖 CodeHelper에 오신 걸 환영합니다! \n 에러 코드와 사용 언어를 입력해보세요.` },
  ]);
  const [input, setInput] = useState('');  //질문 1개 
  const [question, setQuestion] = useState(''); //질문들의 모음
  //채팅의 마지막을 가르킴
  const messagesEndRef = useRef(null);  
  const textRef = useRef(null);

  //대화 종료 여부
  const [endChat, setEndChat] = useState(false);

  const dispatch = useDispatch();
  const lottieRef = useRef();

  const [promptLevel, setPromptLevel] = useState(0);
  //ai chat 답변 로딩
  const [isLoading, setIsLoading] = useState(false);
  const [coreContent, setCoreContent] = useState('');

  const accessToken = useSelector((state) => state.user.accessToken);
  const prevMessage = useSelector((state) => state.user.chatMessages);

  //테스트 답변용
  //const [response, setResponse] = useState("");

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
  //사용자 질문 보낸 뒤 스트림방식으로 답변 받아오기
  const streamMessage = async () => {
    /*스트림 연결 전에 실행 흐름 -> 로딩 시작, 답변 받기 전 화면 갱신*/
    setIsLoading(true);
    //setResponse("");
    //질문 저장
    const newMessage = { role: '질문', content: input};    
    //전체 메세지 저장
    const updatedMessages = [...messages, newMessage];
    //보낼 이전 메세지 저장
    const result = updatedMessages.map(msg => msg.role + ": " + msg.content).join('\n');

    //기존 메세지 + 현재 질문을 화면에 출력
    setMessages(updatedMessages);
    //입력창 초기화
    setInput('');
    
    /* API 호출하여 스트림 연결 */
    const res = await ApiClient.streamMessage(accessToken, promptLevel, result, input);

    /*스트림 연결 후에 실행 흐름 -> 로딩 종료, 답변 출력*/
    const reader = res.body.getReader();
    const decoder = new TextDecoder("utf-8");
    let partial = "";

    //스트림을 통해 답변 받을 객체 생성
    const aiResponse = { role: '답변', content: "" };
    //기존 화면에 출력되는 메세지에 추가
    const finalMessages = [...updatedMessages, aiResponse];
    //화면 갱신
    setMessages(finalMessages);
    //로딩 종료
    setIsLoading(false);

    while(true){
      const {done, value} = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, {stream: true});
      partial += chunk;

      const lines = partial.split("\n\n");
      partial = lines.pop() || "";

      for (const line of lines){
        if (line.startsWith("data:")){
          const raw = line.replace("data: ", "").trim();

          if (raw === "[DONE]"){
            return;
          }

          try {
            const parsed = JSON.parse(raw);
            const delta = parsed.choices?.[0]?.delta?.content;

            if (delta) {
              //setResponse(prev => prev + delta) //로그 출력용
              //setMessages 초기화 방식 정의
              setMessages(prevMessages => {
                // 마지막 메시지의 인덱스를 구함
                const lastIndex = prevMessages.length - 1;  
                // 마지막 메시지 객체를 가져옴       
                const lastMsg = prevMessages[lastIndex];           

                 // 마지막 메시지가 AI의 답변이면
                if (lastMsg.role === '답변') { 
                  // 기존 메시지를 복사한 새 배열을 만들고                   
                  const updated = [...prevMessages];               
                  updated[lastIndex] = {
                    ...lastMsg,
                    // 해당 답변 메시지에 새로운 응답 조각(delta)을 이어붙임
                    content: lastMsg.content + delta,              
                  };
                  // 갱신된 메시지 배열을 반환하여 상태 변경
                  return updated;                                  
                }
                // 조건이 맞지 않으면 기존 메시지를 그대로 유지
                return prevMessages;                               
              });
            }
          } catch (err) {
            console.error("JSON parse error", err);
          }
        }
      }
    }
  };

  // 테스트 로그 출력용
  // useEffect(() => {
  // console.log("변경된 응답:", response);
  // }, [response]);

  //사용자 질문 보내기 -> 추후 사용될 수도 있으므로 남겨둠. 
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
    if (e.key === 'Enter') {
        if (e.ctrlKey) {
            // 줄바꿈을 수동으로 삽입
            e.preventDefault();
            const textarea = e.target;
            const cursorPosition = textarea.selectionStart;
            const textBefore = input.substring(0, cursorPosition);
            const textAfter = input.substring(cursorPosition);
            const updatedText = textBefore + '\n' + textAfter;

            // 상태 업데이트
            setInput(updatedText);

            // 커서 위치 복원은 다음 렌더링 이후에
            requestAnimationFrame(() => {
              if (textRef.current) {
                textRef.current.selectionStart = textRef.current.selectionEnd = cursorPosition + 1;
                handleResizeHeight();
                textRef.current.scrollTop = textRef.current.scrollHeight;
              }
            });
        } else {
            // 전송하고 줄바꿈 막기
            e.preventDefault();
            streamMessage();
        }
    }
  };

  //Assemble Board만들기
  const postAssemble = () =>{
    console.log(coreContent);
    dispatch(setPostLoading({postLoading: true}));
    setEndChat(true); //대화 종료 시키기
    
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
      dispatch(setPostLoading({postLoading: false}));
      dispatch(setPostAssembleId({postAssembleId: assembleboardId}));
      //navigate(`/detailAssemble/${assembleboardId}`);
    })
    .catch((err) => console.error("API 요청 실패:", err));
  };

  //현재 대화창 초기화하기
  const restartAiChat = () => {
    setMessages([
    { role: '답변', content: `🤖 CodeHelper에 오신 걸 환영합니다! \n 에러 코드와 사용 언어를 입력해보세요.` },
    ]);
    setInput('');
    setQuestion('');
    setEndChat(false);
    setPromptLevel(0);
    setIsLoading(false);
    setCoreContent('');
  };

  //애니메이션 재생 초기화
  const handleMouseEnter = () => {
    lottieRef.current?.play();
  };

  const handleMouseLeave = () => {
    lottieRef.current?.stop();
  };

  return (
    <div className="w-screen min-h-screen bg-gradient-to-r from-indigo-900 to-purple-900 overflow-auto relative">
      <Header />

      <div className="w-full flex flex-col mt-24 mb-4">
        <div className="w-full flex flex-col lg:flex-row gap-4 px-2 sm:px-6">
          <div className="w-full lg:w-1/5">
            <LeftHeader />
          </div>

          <div className="w-full lg:w-3/5">
            <div className="max-w-3xl mx-auto px-4 sm:px-6">
              <h1 className="text-3xl font-bold mb-6 text-center text-white">AI Code Helper</h1>

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

                    {msg.role === '답변' && !endChat && msg.content !== `🤖 CodeHelper에 오신 걸 환영합니다! \n 에러 코드와 사용 언어를 입력해보세요.` && (
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
                <div ref={messagesEndRef} />
              </div>
              {/*답변 채택을 통한 대화가 종료됐을 경우 */}
              {endChat && (
                <div className="w-full max-w-4xl mx-auto bg-white/5 backdrop-blur-md rounded-xl p-4 border border-white/10 mt-3">
                  <div className="flex flex-col items-center justify-center text-center space-y-4">
                    <h3 className="text-white text-lg font-semibold">대화가 종료되었습니다.</h3>

                    <button
                      onClick={restartAiChat}
                      onMouseEnter={handleMouseEnter}
                      onMouseLeave={handleMouseLeave}
                      className="px-4 py-1.5 text-sm transition-colors duration-200 rounded bg-[#C5BCFF] text-white font-bold hover:text-black hover:bg-[#b7adff] flex items-center gap-2"
                    >
                      <Lottie
                        lottieRef={lottieRef}
                        animationData={NewChat}
                        loop={true}
                        autoplay={false}
                        className="w-[40px] h-[40px]"
                      />
                      새 대화 하러가기
                    </button>
                  </div>
                </div>
              )}
              {!endChat && (
                <div className="w-full max-w-4xl mx-auto bg-white/5 backdrop-blur-md rounded-xl p-4 border border-white/10 mt-3">
                  {/* 입력창 (윗부분) */}
                  <div>
                    <textarea
                      rows={1}
                      className="custom-scroll w-full resize-none bg-transparent text-white placeholder-gray-400 focus:outline-none overflow-y-auto"
                      placeholder="메시지를 입력하세요..."
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onInput={handleResizeHeight}
                      onKeyDown={handleKeyDown}
                      ref={textRef}
                      style={{
                        maxHeight: '7.5rem',
                        lineHeight: '1.5rem',
                        paddingRight: '0.5rem',
                      }}
                    />
                  </div>
                  {/* 하단 버튼 영역 */}
                  <div className="flex items-center justify-between border-t border-white/20 pt-2 mt-1">
                    {/* 좌측: 옵션 버튼들 (탭 스타일) */}
                    <div className="inline-flex rounded-md shadow-sm overflow-hidden border border-gray-300">
                      <button
                        onClick={() => setPromptLevel(0)}
                        className={`px-4 py-1.5 text-sm transition rounded-l-md ${
                          promptLevel === 0
                            ? 'bg-[#C5BCFF] text-black font-bold'
                            : 'text-white hover:bg-[#C5BCFF] hover:text-gray-700'
                        }`}
                      >
                        초보자
                      </button>
                      <button
                        onClick={() => setPromptLevel(1)}
                        className={`px-4 py-1.5 text-sm transition rounded-r-md ${
                          promptLevel === 1
                            ? 'bg-[#C5BCFF] text-black font-bold'
                            : 'text-white hover:bg-[#C5BCFF] hover:text-gray-700'
                        }`}
                      >
                        전문가
                      </button>
                    </div>

                    {/* 우측: 보내기 버튼 */}
                    <button
                      onClick={streamMessage}
                      className="hover:opacity-80 hover:scale-105 transition duration-200 ease-in-out"
                    >
                      <img src="/images/send.png" alt="보내기" width="24" height="24" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="w-full lg:w-1/5">
            <AiRightHeader />
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
      <CodeHelper/>
    </div>
  );
}

export default AIChat;
