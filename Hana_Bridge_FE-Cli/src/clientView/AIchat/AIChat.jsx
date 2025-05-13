import React, { useState, useRef, useEffect } from 'react';
import { Container, Card, Form, Button, ButtonGroup, Row, Col, Modal } from 'react-bootstrap';
import { useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from 'remark-gfm'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { prism } from 'react-syntax-highlighter/dist/esm/styles/prism';
import Header from '../header/Header';
import ApiClient from '../../service/ApiClient';

import "../../css/AIChat/AIChat.css"
import "../../css/AIChat/loading.css";
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { setAiChat, clearAiChat } from '../../store/userSlice';


function AIChat() {
  const [messages, setMessages] = useState([
    { role: '답변', content: `🤖 CodeHelper에 오신 걸 환영합니다!  
      에러 코드와 사용 언어를 입력해보세요.` },
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
      .then((res) => res.json())
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
    .then((res) => res.json())
    .then((data) => {      
      const assembleboardId  = data.assembleBoardId;
      console.log(assembleboardId);
      setIsPostLoading(false);
      navigate(`/detailAssemble/${assembleboardId}`);
    })
  };


  return (
    <>
      <Header />
      <Container
        fluid
        className="d-flex flex-column align-items-center justify-content-center mt-3 ai-chat-container"
      >
        <h1>AI Code Helper</h1>
        <Card className="p-3 shadow-sm ai-chat-card">
          {messages.map((msg, idx) => (
            <React.Fragment key={idx}>
              <div
                className={`d-flex ${msg.role === '답변' ? 'justify-content-start' : 'justify-content-end'} my-2`}
              >
                 <div className={`ai-chat-message-card ${msg.role === '답변' ? 'ai' : 'user'}`}>
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      components={{
                        code({ node, inline, className, children, ...props }) {
                          const match = /language-(\w+)/.exec(className || '');
                          return !inline && match ? (
                            <SyntaxHighlighter {...props} style={prism} language={match[1]} PreTag="div">
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
  
              {msg.role === '답변' && msg.content !== '에러 코드를 사용중인 언어와 함께 보내주세요!' && (
                <div className='d-flex justify-content-start'>
                  <Button variant="dark" size="sm" onClick={() => openPostModal(msg.content)}>
                    답변 채택
                  </Button>
                </div>
              )}
            </React.Fragment>
          ))}
  
          {isLoading && (
            <div className="d-flex justify-content-start my-2">
              <div className="loader"></div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </Card>
  
        <Form className="mt-3" style={{ width: '70%' }}>
          <Row className="align-items-center">
            <Col xs={2} className="d-flex justify-content-end align-items-center">
              <ButtonGroup>
                <Button
                  variant={promptLevel === 0 ? 'dark' : 'outline-dark'}
                  size="sm"
                  onClick={() => setPromptLevel(0)}
                >
                  초보자
                </Button>
                <Button
                  variant={promptLevel === 1 ? 'dark' : 'outline-dark'}
                  size="sm"
                  onClick={() => setPromptLevel(1)}
                >
                  전문가
                </Button>
              </ButtonGroup>
            </Col>
            <Col xs={8}>
              <Form.Control
                as="textarea"
                rows={1}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onInput={handleResizeHeight}
                onKeyDown={handleKeyDown}
                placeholder="메시지를 입력하세요..."
                ref={textRef}
                className="ai-chat-input"
              />
            </Col>
            <Col xs={2} className="d-flex justify-content-end">
              <Button
                variant="dark"
                type="button"
                className="ai-chat-send-button"
                onClick={() => sendMessage()}
              >
                전송
              </Button>
            </Col>
          </Row>
        </Form>

        {isPostLoading === true?(
          <div className="loading">
          <div className="loading_text">
            <span className="loading_text_words">L</span>
            <span className="loading_text_words">O</span>
            <span className="loading_text_words">A</span>
            <span className="loading_text_words">D</span>
            <span className="loading_text_words">I</span>
            <span className="loading_text_words">N</span>
            <span className="loading_text_words">G</span>
          </div>
        </div>
        ):null}
  
        <Modal show={showModal} onHide={closePostModal} centered>
          <Modal.Header closeButton>
            <Modal.Title>답변 채택</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            해당 질문과 답변을 채택 하시겠습니까?<br />
            채택하시면 질문과 내용이 요약되어 게시됩니다.
          </Modal.Body>
          <Modal.Footer>
            <Button type="button" variant="secondary" onClick={closePostModal}>
              취소
            </Button>
            <Button type="button" variant="primary" onClick={postAssemble}>
              확인
            </Button>
          </Modal.Footer>
        </Modal>
  
        <Modal show={showChatModel} onHide={closeChatModal} centered>
          <Modal.Header closeButton>
            <Modal.Title>AI Chat 내용 가져오기 </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            지난 대화 내용을 불러오시겠습니까? <br />
            취소하시면 지난 대화 내용이 삭제 됩니다.
          </Modal.Body>
          <Modal.Footer>
            <Button type="button" variant="secondary" onClick={closeChatModal}>
              취소
            </Button>
            <Button type="button" variant="primary" onClick={() => bringMessage()}>
              불러오기
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </>
  );
  
}

export default AIChat;
