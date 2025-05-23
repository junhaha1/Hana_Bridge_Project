import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from "react-markdown";
import remarkGfm from 'remark-gfm'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { prism } from 'react-syntax-highlighter/dist/esm/styles/prism';
import ApiClient from '../../service/ApiClient';
import { useSelector, useDispatch } from 'react-redux';
import { setAiChat, clearAiChat } from '../../store/userSlice';
import { scrollStyle } from '../../style/CommonStyle';
import { IoClose } from "react-icons/io5";
import { AiOutlineFullscreen, AiOutlineFullscreenExit  } from "react-icons/ai";
import { IoCopyOutline } from "react-icons/io5";
import { FaCheck } from 'react-icons/fa6';
import { aiChatFrame, topNavi, chatBox, promptButton, aiBox, userBox, 
  loding, inputBox, inputTextarea, sendButton, upDiv, downDiv, okButton, cancelButton,
 postingDiv, sipnning, postCompleteDiv, answerChooseButton } from '../../style/AIChatStyle';

function AIChat({onClose, onfullTalk, onMode}) {
  const prevMessage = useSelector((state) => state.user.chatMessages);
  const accessToken = useSelector((state) => state.user.accessToken);

  const [messages, setMessages] = useState(prevMessage);
  const [input, setInput] = useState('');  //질문 1개 
  //채팅의 마지막을 가르킴
  const messagesEndRef = useRef(null);  
  const textRef = useRef(null);
  
  //답변 복사
  const copyRef = useRef(null);
  //메시지 상태
  const [copied, setCopied] = useState(false); 

  const dispatch = useDispatch();

  const [promptLevel, setPromptLevel] = useState(0);
  //ai chat 답변 로딩
  const [isLoading, setIsLoading] = useState(false);
  const [coreContent, setCoreContent] = useState('');

  //게시판 게시 문의 모달
  const [showModal, setShowModal] = useState(false);
  const openPostModal = (content) => {
    setCoreContent(content);    
    setShowModal(true);
  }
  const closePostModal = () => setShowModal(false);
  //새 대화창 초기화
  const [showNewChatModal, setShowNewChatModal] = useState(false);

  const [isPostLoading, setIsPostLoading] = useState(false);
  const [postComplete, setPostComplete] = useState(false);

  const closeNewChatModal = () => {
    setShowNewChatModal(false);
  }; 
  
  const createNewChat = () => {
    dispatch(clearAiChat()); // 메시지만 Redux에서 초기화
    restartAiChat();
    setShowNewChatModal(false);
  }

  //답변 복사해오기
  const copyToClipboard = () => {
    const text = copyRef.current.innerText;
    navigator.clipboard.writeText(text).then(() => {
      console.log("복사 성공")
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }).catch(err => {
      console.error("복사 실패:", err);
    });
  };
  
  //메세지 추가 시 스크롤 자동 이동
  //redux에 대화내용 저장
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    dispatch(setAiChat({ chatMessages: messages }));
  }, [messages]);

  useEffect(() =>{
    if(postComplete)
      setTimeout(() => setPostComplete(false), 2000);
  }, [postComplete]);

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
    setIsPostLoading(true);
    //dispatch(setPostLoading({postLoading: true}));
    closePostModal();
    const result = messages.slice(0).map(msg => msg.role + ": " + msg.content).join('\n');

    ApiClient.postAssemble(accessToken, promptLevel, result, coreContent)
    .then((res) => {
      if (!res.ok) throw new Error(`서버 오류: ${res.status}`);
      return res.json();
    })
    .then((data) => {      
      const assembleboardId  = data.assembleBoardId;
      //dispatch(setPostLoading({postLoading: false}));
      setPostComplete(true);
      setIsPostLoading(false);      
      console.log("posting complete!");
      //dispatch(setPostAssembleId({postAssembleId: assembleboardId}));
      //navigate(`/detailAssemble/${assembleboardId}`);
    })
    .catch((err) => console.error("API 요청 실패:", err));
  };

  //현재 대화창 초기화하기
  const restartAiChat = () => {
    setMessages([]);
    setInput('');
    setPromptLevel(0);
    setIsLoading(false);
    setCoreContent('');
  };

  const startChatting = (level) => {
    setPromptLevel(level);
    setMessages([{ role: '답변', content: `CodeHelper에 오신 걸 환영합니다! \n 에러 코드와 사용 언어를 입력해보세요.` },]);
  };

  return (
    <div className={aiChatFrame}>
      {/* 상단 메뉴바 */}
      <div className={topNavi}>
        {onMode === 'sub' ? (
          <button 
            className='ml-2'
            onClick={()=>{
              onfullTalk(true);
              onClose(false);
            }}
          >
            <AiOutlineFullscreen size={20} className='text-white'/>
          </button>
        ) : (
          <button 
            className='ml-2'
            onClick={()=>{
              onfullTalk(false);
              onClose(true);
            }}
          >
            <AiOutlineFullscreenExit size={20} className='text-white'/>
          </button>
        )}
          
        <div className='flex flex-row '>
          <div className='my-auto text-white text-sm font-semibold'>
          {promptLevel === 1 ? "전문가" : "초보자"} 모드
          </div>
          <button 
            className='p-1 m-1 rounded text-white text-sm hover:bg-gray-500'
            onClick={() => setShowNewChatModal(true)}
          >
            새 대화창
          </button>
          <button 
            className='m-2 p-1 text-sm text-white rounded-full bg-zinc-500 shadow-md'
            onClick={()=>{
              onfullTalk(false);
              onClose(false);
            }}
          >
            <IoClose/>
          </button>
        </div>
      </div>

            
      {/* 상단 대화창 */}
      <div className={`${scrollStyle} ${chatBox} relative`}>
        {messages.length === 0 &&(
          <div className="text-white mt-5">
            {/* 역할 소개 문구 */}
            <div className="rounded-2xl p-2 text-sm">
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
                  className={promptButton}
                  onClick={()=>startChatting(0)}
                >
                  <p className='text-lg font-semibold'>초보자</p>
                  <p>프로그래밍을 시작하지 얼마 안된 사용자에게 추천합니다. </p>
                </div>
                {/* 전문가 프롬포트 선택 카드 */}
                <div 
                  className={promptButton}
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
                    ? aiBox
                    : userBox
                } [&>*]:m-0`}
                ref = {msg.role === '답변' ? copyRef : null}
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
              <div className="flex justify-start gap-2">
                {/*답변 채택 버튼 */}
                
                <button
                  className="text-white"
                  onClick={copyToClipboard}
                > 
                  {copied ? <FaCheck/> : <IoCopyOutline className='font-semibold'/>}
                </button>
                  {isPostLoading ? (
                    <div className={postingDiv}>
                      게시글 등록 중입니다. 
                      <div className="flex items-center justify-center ">
                        <div className={sipnning + " h-5 w-5 border-3 border-zinc-700"}></div>
                      </div>
                    </div>
                  ) : postComplete ? (
                    <div className={postCompleteDiv}>
                      게시글이 등록 되었습니다.
                    </div>
                  ) : (
                    <button
                  className={answerChooseButton}
                  onClick={() => openPostModal(msg.content)}
                  >
                    답변 채택
                  </button>
                  )}
                
              </div>
            )}                    
          </React.Fragment>
        ))}
        {/* 로딩창 */}
        {isLoading && (
          // <div className="flex justify-start my-2">
          //    <Lottie animationData={Loading} loop={true} />
          // </div>
          <div className="flex justify-start my-2">
            <div className={sipnning + " h-7 w-7 border-4 border-white/20 "}></div>
          </div>
        )}        
        {/* 자동 스크롤 영역 */}
        <div ref={messagesEndRef} />
      </div>
      <div className={inputBox}>
        {/* 입력창 (윗부분) */}
        <div className='flex flex-row gap-2'>
          <textarea
            rows={1}
            className={`${scrollStyle} ${inputTextarea}`}
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
          <button
            onClick={streamMessage}
            className={sendButton}
          >
            <img src="/images/send.png" alt="보내기" width="24" height="24" />
          </button>
        </div>
      </div>       

      {/* 모달: 답변 채택 */}
      {showModal && (
        <div className={upDiv}>
          <div className={downDiv}>
            <h2 className="text-xl font-semibold mb-4">답변 채택</h2>
            <p className="mb-4">해당 질문과 답변을 채택 하시겠습니까?<br />채택하시면 질문과 내용이 요약되어 게시됩니다.</p>
            <div className="flex justify-end gap-2">              
              <button className={okButton} onClick={postAssemble}>확인</button>
              <button className={cancelButton} onClick={closePostModal}>취소</button>
            </div>
          </div>
        </div>
      )}

      {/* 모달: 지난 대화 불러오기 */}
      {showNewChatModal && (
        <div className={upDiv}>
          <div className={downDiv}>
            <h2 className="text-xl font-semibold mb-4">새 대화 시작하기</h2>
            <div>
              <p>새로운 대화를 시작하시겠습니까?<br/>
                시작하면 기존 대화 내용은 삭제됩니다.<br/>
              </p>
                <p className='font-semibold text-sm'><span className='text-2xl text-red-400'>*</span>필요한 답변에 대해 채택을 잊으신 경우 답변 채택 후 새 대화를 시작해주십시오.</p>
            </div>
            <div className="flex justify-end gap-2">
              <button className={okButton} onClick={createNewChat}>확인</button>
              <button className={cancelButton} onClick={closeNewChatModal}>취소</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AIChat;
