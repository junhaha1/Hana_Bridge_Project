import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from "react-markdown";
import remarkGfm from 'remark-gfm'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { prism } from 'react-syntax-highlighter/dist/esm/styles/prism';
import ApiClient from '../../service/ApiClient';

import "../../css/Scroll.css";
import { useSelector, useDispatch } from 'react-redux';
import { setAiChat, clearAiChat, setPostLoading, setPostAssembleId } from '../../store/userSlice';

function AIChat({onClose}) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');  //질문 1개 
  const [question, setQuestion] = useState(''); //질문들의 모음
  //채팅의 마지막을 가르킴
  const messagesEndRef = useRef(null);  
  const textRef = useRef(null);

  const dispatch = useDispatch();
  const lottieRef = useRef();

  const [promptLevel, setPromptLevel] = useState(0);
  //ai chat 답변 로딩
  const [isLoading, setIsLoading] = useState(false);
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
    setMessages([]);
    setInput('');
    setQuestion('');
    setPromptLevel(0);
    setIsLoading(false);
    setCoreContent('');
  };

  const startChatting = (level) => {
    setPromptLevel(level);
    setMessages([{ role: '답변', content: `CodeHelper에 오신 걸 환영합니다! \n 에러 코드와 사용 언어를 입력해보세요.` },]);
  };

  return (
    <div className="w-full h-full flex flex-col bg-zinc-800 rounded-2xl overflow-y-hidden relative">
        {/* 상단 메뉴바 */}
        <div className='flex justify-between bg-white/15 backdrop-blur-sm'>
          <button 
            className='ml-2 p-1 text-white'
          >
            새 대화창➕
          </button>
          <button 
            className='mr-2 p-1'
            onClick={()=>onClose(false)}
          >
            ✖
          </button>
        </div>
        {/* 상단 대화창 */}
        <div className="custom-scroll bg-white/10 backdrop-blur-sm p-4  shadow-md h-[60vh] overflow-y-auto">
          {messages.length === 0 &&(
            <div className="text-white mt-5">
              {/* 역할 소개 문구 */}
              <div className="rounded-2xl p-3 my-1 text-sm">
                <p className="mb-2">
                  안녕하세요! 저는 <span className="font-semibold text-yellow-300">AI Codi</span>예요.
                </p>
                <p className="mb-2">
                  막히는 코드, 이해 안 되는 개념, 자주 보는 에러 메시지까지!
                </p>
                <p>
                  궁금한 점을 자유롭게 물어보면, 최대한 쉽게 설명해드릴게요. 😊
                </p>
                <p>
                  프롬포트를 선택해주세요! 선택 시 바로 대화가 시작됩니다.
                </p>
                <p className='text-orange-300 font-semibold'>
                  ⚠ 바로 대화를 시작하면 초보자로 설정됩니다.
                </p>
                <div className='flex flex-row gap-2'>
                  {/* 초보자 프롬포트 선택 카드 */}
                  <div 
                    className="w-1/2 bg-white/10 p-2 backdrop-blur-sm border rounded border-white/20 shadow cursor-pointer
                    hover:bg-white/30"
                    onClick={()=>startChatting(0)}
                  >
                    <p className='text-lg font-semibold'>초보자</p>
                    <p>프로그래밍을 시작하지 얼마 안된 사용자에게 추천합니다. </p>
                  </div>
                  {/* 전문가 프롬포트 선택 카드 */}
                  <div 
                    className="w-1/2 bg-white/10 p-2 backdrop-blur-sm border rounded border-white/20 shadow cursor-pointer
                    hover:bg-white/30"
                    onClick={()=>startChatting(1)}
                  >
                    <p className='text-lg font-semibold'>전문가</p>
                    <p>프로그래밍을 시작하여 코드 해석이 익숙한 사용자에게 추천합니다. </p>
                  </div>
                </div>
              </div>
            </div>
          )}
          {messages.length > 0 && messages.map((msg, idx) => (
            <React.Fragment key={idx}>
              {/* 대화창 박스*/}
              <div
                className={`flex ${msg.role === '답변' ? 'justify-start' : 'justify-end'} my-2`}
              > 
                <div
                  className={`max-w-[80%] p-3 text-sm whitespace-pre-wrap ${
                    msg.role === '답변'
                      ? 'bg-white/20 text-white rounded-tl-2xl rounded-tr-2xl rounded-br-2xl'
                      : 'bg-[#322776] text-white rounded-tl-2xl rounded-tr-2xl rounded-bl-2xl'
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
              
              {/*답변 채택 버튼 박스 */}
              {msg.role === '답변' && msg.content !== `CodeHelper에 오신 걸 환영합니다! \n 에러 코드와 사용 언어를 입력해보세요.` &&(
                <div className="flex justify-start">
                  {/*답변 채택 버튼 */}
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
          {/* 로딩창 */}
          {isLoading && (
            <div className="flex justify-start my-2">
              <div className="loader w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
          {/* 자동 스크롤 영역 */}
          <div ref={messagesEndRef} />
        </div>
        <div className="w-full max-w-4xl mx-auto bg-white/10 backdrop-blur-md rounded-xl p-4 mt-3">
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
          <div className="flex justify-end border-t border-white/20 pt-2 mt-1">
            {/* 우측: 보내기 버튼 */}
            <button
              onClick={streamMessage}
              className="hover:opacity-80 hover:scale-105 transition duration-200 ease-in-out"
            >
              <img src="/images/send.png" alt="보내기" width="24" height="24" />
            </button>
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
