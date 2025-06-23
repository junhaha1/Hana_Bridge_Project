import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from "react-markdown";
import remarkGfm from 'remark-gfm'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { prism } from 'react-syntax-highlighter/dist/esm/styles/prism';
import ApiClient from '../../service/ApiClient';
import { useSelector, useDispatch } from 'react-redux';
import { setAiChat, clearAiChat, setQuestionCount, setSummaryCount} from '../../store/userSlice';
import { setPostLoading, setPostComplete, resetPostState } from '../../store/postSlice';
import { scrollStyle } from '../../style/CommonStyle';
import { IoClose } from "react-icons/io5";
import { RiSendPlaneFill } from "react-icons/ri";
import { AiFillRobot, AiOutlineFullscreen, AiOutlineFullscreenExit } from "react-icons/ai";
import { IoCopyOutline, IoSettingsSharp } from "react-icons/io5";
import { FaCheck } from 'react-icons/fa6';
import { FaLightbulb } from "react-icons/fa";
import { MdGeneratingTokens } from "react-icons/md";
import { aiChatFrame, topNavi, chatBox, promptButton, aiBox, userBox, 
  inputBox, inputTextarea, sendButton, upDiv, downDiv, okButton, cancelButton,
 postingDiv, sipnning, postCompleteDiv, answerChooseButton } from '../../style/AIChatStyle';
import { clearUserPrompt, setUserPrompt, setUserPromptList } from '../../store/aiChatSlice';
import SettingModal from './SettingModal';
import { useNavigate } from "react-router-dom";
import { useMediaQuery } from 'react-responsive';



function AIChat({onClose, onfullTalk, onMode, setLevel, level}) {
  const prevMessage = useSelector((state) => state.user.chatMessages);

  const [messages, setMessages] = useState(prevMessage);
  const [input, setInput] = useState('');  //질문 1개 
  //채팅의 마지막을 가르킴
  const messagesEndRef = useRef(null);  
  const textRef = useRef(null);

  const navigate = useNavigate();
  
  //답변 복사
  const copyRef = useRef(null);
  //메시지 상태
  const [copied, setCopied] = useState(false); 

  const dispatch = useDispatch();

  const [promptLevel, setPromptLevel] = useState(level);
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

  const [isPostLoading, setIsPostLoading] = useState(useSelector((state) => state.post.isPostLoading));
  const [isPostComplete, setIsPostComplete] = useState(useSelector((state) => state.post.isPostComplete));
  console.log("isPostLoding: " + isPostLoading + "  isPostComplete: " + isPostComplete);

  //프롬프트 설정 모달
  const [settingModal, setSettingModal] = useState(false);
  /*사용자가 작성한 프롬포트 가져오기*/
  //사용자가 작성한 프롬포트 목록
  const userPromptList = useSelector((state) => state.aiChat.userPromptList);
  //사용자가 선택한 프롬포트
  const userPrompt = useSelector((state )=> state.aiChat.userPrompt);
  //질문 tip
  const [isHovered, setIsHovered] = useState(false);
  //답변중인지 체크 
  const [isAnswering, setIsAnswering] = useState(false);
  const [isCreated, setIsCreated] = useState(false);

  /* 사용자 질문 횟수 및 요약 횟수*/
  const [questionCount, setQuestionCount] = useState(0);
  const [summaryCount, setSummaryCount] = useState(0);
  const [isCountInfo, setIsCountInfo] = useState(false);

  //반응형 감지
  const isMobile = useMediaQuery({ maxWidth: 768 });

  //질문, 요약 횟수 갱신
  const updateQuestionAndSummaryCount = () => {
    ApiClient.getQuestionAndSummaryCount()
    .then((res) => {
        if (!res.ok) throw new Error(`서버 오류: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        console.log(data);
        setQuestionCount(data.questionCount);
        setSummaryCount(data.summaryCount);
      })
      .catch((err) => console.error("API 요청 실패:", err));
  };
    
  //사용자가 설정한 프롬포트, 질문, 요약 횟수 가져오기 (초기 렌더링)
  useEffect(() => {
    //프롬포트 조회
    ApiClient.getCustomPrompts()
      .then((res) => {
        if (!res.ok) throw new Error(`서버 오류: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        console.log(data);
        dispatch(setUserPromptList({userPromptList: data}));
      })
      .catch((err) => console.error("API 요청 실패:", err));
    //질문, 요약 횟수 조회
    updateQuestionAndSummaryCount();
  }, [])

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
    if(isPostComplete)
      setTimeout(() => setIsPostComplete(false), 3000);
  }, [isPostComplete]);

  //사용자 입력창 크기 조절절
  const handleResizeHeight = () => {
    const element = textRef.current;
		textRef.current.style.height = 'auto';  //backspace 눌렀을 때에도 높이 자동 조절
    const maxHeight = 5 * 24; // 5줄 x 줄 높이 약 24px
    element.style.height = `${Math.min(element.scrollHeight, maxHeight)}px`; //height값 자동 조절 + 높이 제한   
    
  };

  const continueMessage = async (content) => {
    console.log(content);
    const res = await ApiClient.streamMessage(promptLevel, content, "앞 문장과 자연스럽게 이어지도록 띄어쓰기, 줄바꿈을 추가하여 계속 답변 생성\n마크다운 형식 유지\n앞에 나온 내용과 중복된 내용이 없도록 답변 이어가.\n", userPrompt);

    /*스트림 연결 후에 실행 흐름 -> 로딩 종료, 답변 출력*/
    const reader = res.body.getReader();
    const decoder = new TextDecoder("utf-8");
    let partial = "";

    setIsCreated(false); //답변 이어받기 비활성화
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

          /*답변 종료에 대한 분기 코드 */
          if (raw === "stop"){ //답변이 완전히 종료
            setIsAnswering(false);
            console.log(raw);
            updateQuestionAndSummaryCount();
            return;
          } else if (raw === "length") {//답변이 중간에 끊김 -> 해당 답변 div에 재생성 버튼 추가
            setIsAnswering(false);
            setIsCreated(true); //계속 이어받을 수 있게 초기화
            console.log(raw);
            updateQuestionAndSummaryCount();
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
  }

  /*사용자 질문 보낸 뒤 스트림방식으로 답변 받아오기*/
  const streamMessage = async () => {
    /*스트림 연결 전에 실행 흐름 -> 로딩 시작, 답변 받기 전 화면 갱신*/
    setIsLoading(true);
    setIsAnswering(true);
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
    // 입력창 높이 초기화 (1줄로 복귀) 번외: 함수로 감싸는 이유: DOM 반영 후 안전하게 실행하기 위해 
    requestAnimationFrame(() => { 
      if (textRef.current) {
        textRef.current.style.height = 'auto';
      }
    });

    
    
    /* API 호출하여 스트림 연결 */
    console.log(userPrompt);
    const res = await ApiClient.streamMessage(promptLevel, result, input, userPrompt);

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

    setIsCreated(false); //답변 이어받기 비활성화

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

          /*답변 종료에 대한 분기 코드 */
          if (raw === "stop"){ //답변이 완전히 종료
            setIsAnswering(false);
            console.log(raw);
            updateQuestionAndSummaryCount();
            return;
          } else if (raw === "length") {//답변이 중간에 끊김 -> 해당 답변 div에 재생성 버튼 추가
            setIsAnswering(false);
            setIsCreated(true); //답변 이어받기 활성화
            console.log(raw);
            updateQuestionAndSummaryCount();
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
          if(questionCount === 0) {
            alert("현재 질문 횟수를 전부 사용하였습니다!")
          } else{
            e.preventDefault();
            streamMessage();
          }
        }
    }
  };

  //Assemble Board만들기
  const postAssemble = () =>{
    setIsPostLoading(true);
    dispatch(setPostLoading({isPostLoading: true}));
    closePostModal();
    //const result = messages.slice(0).map(msg => msg.role + ": " + msg.content).join('\n');

    console.log(coreContent);
    
    ApiClient.postAssemble(promptLevel, coreContent)
    .then((res) => {
      if (!res.ok) throw new Error(`서버 오류: ${res.status}`);
      return res.json();
    })
    .then((data) => {     
      const assembleTitle = data.title;
      const assembleContent = data.content;
      setIsPostComplete(true);
      dispatch(setPostComplete({isPostComplete: true}));
      setIsPostLoading(false);      
      dispatch(resetPostState());
      console.log("posting complete!");
      navigate('/writeAssemble', { state: {assembleTitle: assembleTitle, assembleContent: assembleContent}});
    })
    .catch((err) => {
      setIsPostLoading(false);
      alert("게시글 포스팅 실패");
      console.error("API 요청 실패:", err)
    }).finally(() => {
       updateQuestionAndSummaryCount();
    });
  };

  //현재 대화창 초기화하기
  const restartAiChat = () => {
    setMessages([]);
    setInput('');
    setPromptLevel(0);
    setLevel(0);
    setIsLoading(false);
    setCoreContent('');
    if (textRef.current) {
      textRef.current.style.height = 'auto';
    }
  };

  const startChatting = (level) => {
    setPromptLevel(level);
    setLevel(level);
    setMessages([{ role: '답변', content: `CodeHelper에 오신 걸 환영합니다! \n 에러 코드와 사용 언어를 입력해보세요.` },]);
  };

  return (
    <div className={aiChatFrame}>
      {/* 상단 메뉴바 */}
      <div className={`${topNavi}
                max-md:overflow-x-auto max-md:whitespace-nowrap
                max-md:[-ms-overflow-style:none]
                max-md:[scrollbar-width:none]
                max-md:[&::-webkit-scrollbar]:hidden
                flex gap-2 px-2 `}>
        {/* <div className="max-md:invisible md:visible mt-2 "> */}
          { (!isMobile && isAnswering === false) && (
            onMode === 'sub' ? (
              <button 
                className='ml-2'
                onClick={() => {
                  onfullTalk(true);
                  onClose(false);
                }}
              >
                <AiOutlineFullscreen size={20} className='text-white' />
              </button>
            ) : (
              <button 
                className='ml-2'
                onClick={() => {
                  onfullTalk(false);
                  onClose(true);
                }}
              >
                <AiOutlineFullscreenExit size={20} className='text-white' />
              </button>
            )
          )}
        {/* </div> */}
        <div className='flex flex-row gap-2 overflow-visible z-[9000] '>
          <div
            className="relative z-[9000]"            
          >
            <button 
              className="flex flex-row items-center md:m-1 md:p-1 max-md:pt-0.5 max-md:mx-1 
              text-sm text-white rounded-full hover:bg-zinc-600 hover:shadow-md"
              onMouseEnter={() => setIsCountInfo(true)}
              onMouseLeave={() => setIsCountInfo(false)}
            >
              <MdGeneratingTokens  className="m-1" />
              잔여량 확인
            </button>

            <div
              className={`absolute top-full left-0 mt-1 px-3 py-2 text-sm text-white bg-gray-900 rounded shadow-lg whitespace-nowrap transition-opacity z-[9999]`}
              style={{ 
                opacity: isCountInfo ? 1 : 0,
                pointerEvents: isHovered ? "auto" : "none",
               }}
            >
              <span className="text-yellow-400 font-semibold">남은 질문 횟수 : </span>{questionCount}<br/>
              <span className="text-yellow-400 font-semibold">남은 요약 횟수 : </span>{summaryCount} <br/>
              <span>매일 오전 6시에 초기화됩니다!</span>
            </div>
          </div>
          <div className='my-auto text-white text-sm max-md:mx-1 font-semibold'>
            {(promptLevel === -1 ? userPrompt.name : (promptLevel === 0 ? "초보자" : "전문가"))} 모드
          </div>
          <button 
            className=' md:m-1 md:p-1 max-md:pt-0.5 max-md:mx-1 rounded-full text-white text-sm hover:bg-gray-500'
            onClick={() => {
              setShowNewChatModal(true);
              dispatch(clearUserPrompt());
            }}
          >
            새 대화창
          </button>
          <div
            className="relative z-[9000]"            
          >
            <button 
              className="flex flex-row items-center md:m-1 md:p-1 max-md:pt-0.5 max-md:mr-1 text-white 
                rounded-full hover:bg-zinc-600 hover:shadow-md"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              <FaLightbulb className="m-1" />
              Tip
            </button>

            <div
              className={`absolute top-full right-0 mt-1 px-3 py-2 text-sm text-white bg-gray-900 rounded shadow-lg whitespace-nowrap transition-opacity z-[9999]`}
              style={{ 
                opacity: isHovered ? 1 : 0,
                pointerEvents: isHovered ? "auto" : "none",
             }}
            >
              설정에서 <span className="text-yellow-400 font-semibold">프롬프트</span>를 명확히 설정하고 <br/>
              <span className="text-yellow-400 font-semibold">질문을 구체적</span>으로 할수록 <br/>
              AI에게 더 좋은 답변을 받을 수 있습니다.
            </div>
          </div>

          <button
            className='md:my-2 md:p-1 max-md:mx-1 max-md:mt-0 max-md:mx-1 text-white rounded-full hover:bg-zinc-600 hover:shadow-md'
            onClick={()=>{setSettingModal(true)}}  
          >
            <IoSettingsSharp/>
          </button>
          <button 
            className='md:m-2 md:py-1 md:px-1 max-md:mt-1 max-md:mb-1 max-md:p-1 text-sm text-white rounded-full bg-zinc-500 shadow-md'
            onClick={()=>{
              onfullTalk(false);
              onClose(false);
            }}
          >
            <IoClose />
          </button>
        </div>
      </div>
            
      {/* 상단 대화창 */}
      <div className={`${scrollStyle} ${chatBox} relative`}>
        {messages.length === 0 &&(
          <div className="text-white md:mt-5 max-md:mt-0">
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
              <p className='text-orange-300 font-semibold max-md:mb-8'>
                ⚠ 바로 대화를 시작하면 초보자로 설정됩니다.
              </p>
              <div className="flex flex-col max-md:gap-3 md:gap-2">
                <div className='flex flex-row max-md:gap-3 md:gap-2'>
                  {/* 초보자 프롬포트 선택 카드 */}
                  <div 
                    className={promptButton}
                    onClick={()=>{
                      startChatting(0);
                      dispatch(clearUserPrompt());
                    }}
                  >
                    <p className='text-lg font-semibold'>초보자</p>
                    <p>프로그래밍을 시작하지 얼마 안된 사용자에게 추천합니다. </p>
                  </div>
                  {/* 전문가 프롬포트 선택 카드 */}
                  <div 
                    className={promptButton}
                    onClick={()=>{
                      startChatting(1);
                      dispatch(clearUserPrompt());
                    }}
                  >
                    <p className='text-lg font-semibold'>전문가</p>
                    <p>프로그래밍을 시작하여 코드 해석이 익숙한 사용자에게 추천합니다. </p>
                  </div>
                </div>
                {/* 사용자 프롬포트 선택하여 시작하기 */}
                {userPromptList.length > 0 ? (
                <div 
                  className={`${promptButton} w-full`}
                  onClick={() => {
                      //선택되지 않았다면 이벤트 막기
                      if (userPrompt.name === "") return
                      startChatting(-1)
                    }
                  }
                >
                  <p className='text-lg font-semibold'>사용자 설정 모드</p>
                  <p>사용자가 설정한 프롬포트를 사용합니다.</p>
                  <div>
                    <select
                      className="w-full p-2 rounded font-semibold text-base text-black"
                      // 부모 div 이벤트를 막아줌. 
                      onClick={(e) => e.stopPropagation()} 
                      onChange={(e) => {
                        e.stopPropagation();
                        console.log("프롬포트 설정: " +  e.target.value);
                        const selected = userPromptList.find(
                          (p) => String(p.promptId) === e.target.value
                        );
                        console.log(selected);
                        dispatch(setUserPrompt({ userPrompt: selected }));
                      }}
                      value={userPrompt?.promptId ?? ""}
                    >
                      <option value="" selected disabled hidden>
                        선택해주세요
                      </option>
                      {userPromptList.map((prom) => (
                        <option
                          className="text-black"
                          value={prom.promptId}
                          key={prom.promptId}
                        >
                          {prom.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                ) : (
                  <div 
                  className={`${promptButton} w-full`}
                  >
                    <p className='text-lg font-semibold'>사용자 설정 모드</p>
                    <p>
                      사용자가 설정한 프롬포트를 사용합니다.<br/>
                      아직 직접 프롬포트를 입력하지 않으셨네요!<br/>
                      필요한 경우 우측 상단 설정에서 직접 프롬포트를 입력해주세요!
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        {messages.length > 0 && messages.map((msg, idx) => (
          <React.Fragment key={idx}>
            {/* 대화창 박스*/}
            <div
              className={`flex gap-1 ${msg.role === '답변' ? 'justify-start items-end' : 'justify-end'} mt-2`}
            > 
              {msg.role === '답변' && (
                <AiFillRobot className='w-7 h-7 text-white'/>
              )}
              <div
                className={`max-w-[80%] px-3 py-2 mb-2 max-md:text-sm md:text-base whitespace-pre-wrap break-words 
                ${
                  msg.role === '답변'
                    ? aiBox
                    : userBox
                } [&>*]:m-0 transform-none will-change-auto origin-top-left isolate `}
                ref = {msg.role === '답변' ? copyRef : null}
                style={{
                  transform: "none",
                  willChange: "auto",
                  isolation: "isolate", // ✅ stacking context 분리
                }}
              >
                { msg.role === '답변' ? (
                  <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    // 코드 블록 렌더링
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
                  {msg.content.replace(/([ \t]*\n){3,}/g, '\n\n')}
                </ReactMarkdown>
                ):(
                  <p>{msg.content}</p>                  
                )}
                
                
                {msg.role === "답변" && messages.length - 1 === idx && isCreated &&(
                  <div className='mt-2 flex flex-col'>
                    <a
                      className="no-underline cursor-pointer font-semibold text-blue-100 text-sm hover:text-blue-300"
                      onClick={() => {
                        if(questionCount === 0){
                          alert("현재 질문 횟수를 전부 사용하였습니다!");
                        }
                        continueMessage(msg.content)
                      }}
                    >
                      답변 이어 생성하기 ...
                    </a>
                    <p className='text-sm text-yellow-400 font-semibold'><span className='text-red-500'>* </span>새 질문은 입력할 시 해당 답변은 이어받을 수 없습니다. </p>
                </div>
                )}
              </div>
            </div>
            
            {/*답변 채택 버튼 박스 */}
            {msg.role === '답변' && msg.content !== `CodeHelper에 오신 걸 환영합니다! \n 에러 코드와 사용 언어를 입력해보세요.` &&(
              <div className="flex justify-start gap-2 ml-8">
                {/*답변 채택 버튼 */}
                
                <button
                  className="text-white"
                  onClick={copyToClipboard}
                > 
                  {copied ? <FaCheck/> : <IoCopyOutline className='font-semibold'/>}
                </button>
                  {isPostLoading ? (
                    <div className={postingDiv}>
                      게시글 요약 중입니다. 
                      <div className="flex items-center justify-center ">
                        <div className={sipnning + " h-5 w-5 border-3 border-zinc-700"}></div>
                      </div>
                    </div>
                  ) : isPostComplete ? (
                    <div className={postCompleteDiv}>
                      게시글 등록 화면으로 이동합니다. 
                    </div>
                  ) : (
                  <button
                  className={answerChooseButton}
                  onClick={() => {
                    if (summaryCount === 0) {
                      alert("현재 요약 횟수를 전부 사용하였습니다!");
                    } else{
                      openPostModal(msg.content);
                    }
                  }}
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
            onClick={() => {
              console.log(questionCount);
              if(questionCount === 0){
                alert("현재 질문 횟수를 전부 사용하였습니다!");
              } else{
                streamMessage();
              }
            }}
            className={sendButton}
          >
            <RiSendPlaneFill className='size-7 text-black'/>
          </button>
        </div>
      </div>      

      {/* 프롬프트 설정 모달 */}
      {settingModal && (
        <SettingModal onClose= {() => setSettingModal(false)}/>
      )}
      {/* 모달: 답변 채택 */}
      {showModal && (
        <div className={upDiv}>
          <div className={downDiv}>
            <h2 className="text-xl font-semibold mb-4">답변 채택</h2>
            <p className="mb-4">해당 질문과 답변을 채택 하시겠습니까?<br />채택하시면 질문과 내용이 요약되어 게시됩니다.</p>
            <p className="mb-4">남은 요약 횟수 : {summaryCount}</p>
            <div className="flex justify-end gap-2">              
              <button className={okButton} onClick={postAssemble}>확인</button>
              <button className={cancelButton} onClick={closePostModal}>취소</button>
            </div>
          </div>
        </div>
      )}

      {/* 모달: 새로운 대화 */}
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
