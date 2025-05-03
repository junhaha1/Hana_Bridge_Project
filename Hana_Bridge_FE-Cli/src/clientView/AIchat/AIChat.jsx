import React, { useState, useRef, useEffect } from 'react';
import { Container, Card, Form, Button, Row, Col, Modal } from 'react-bootstrap';
import ReactMarkdown from "react-markdown";
import remarkGfm from 'remark-gfm'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { prism } from 'react-syntax-highlighter/dist/esm/styles/prism';
import Header from '../Header';
import ApiClient from '../../service/ApiClient';
import "./loading.css";
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { setAiChat, clearAiChat } from '../../store/userSlice';


function AIChat() {
  const [messages, setMessages] = useState([
    { role: 'ai', content: '에러 코드를 사용중인 언어와 함께 보내주세요!' },
  ]);
  const [input, setInput] = useState('');
  //채팅의 마지막을 가르킴
  const messagesEndRef = useRef(null);  
  const textRef = useRef(null);

  const dispatch = useDispatch();

  const [promptLevel, setPromptLevel] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const accessToken = useSelector((state) => state.user.accessToken);
  const prevMessage = useSelector((state) => state.user.chatMessages);

  //게시판 게시 문의 모달
  const [showModal, setShowModal] = useState(false);
  const openPostModal = () => setShowModal(true);
  const closePostModal = () => setShowModal(false);
  //이전 내용 불러오기 모달
  const [showChatModel, setShowChatModel] = useState(true);
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
    const newMessage = { role: 'user', content: input };
    const updatedMessages = [...messages, newMessage]; // 사용자 메시지까지 포함한 배열
  
    setMessages(updatedMessages);
    setInput('');
  
    if (textRef.current) {
      textRef.current.style.height = 'auto';
    }
  
    setIsLoading(true); 
    ApiClient.sendMessage(accessToken, promptLevel, input)
      .then((res) => res.json())
      .then((data) => {
        const aiResponse = { role: 'ai', content: data.answer };
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
    closePostModal();
  };


  return (
    <>
    <Header />
    
    <Container
      fluid
      className="d-flex flex-column align-items-center justify-content-center mt-3"
      style={{ minHeight: '100vh', backgroundColor: '#fff' }}
    >

      <Card style={{ width: '70%', minHeight: '600px' }} className="p-3 shadow-sm">
      {messages.map((msg, idx) => (
        <React.Fragment key={idx}>
          <div
            className={`d-flex ${msg.role === 'ai' ? 'justify-content-start' : 'justify-content-end'} my-2`}
          >
            <Card
              border="primary"
              text="dark"
              bg="light"
              className="px-3 py-2 text-start"
              style={{ maxWidth: '75%', borderRadius: '15px' }}
            >
              <div>
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  code({ node, inline, className, children, ...props }) {
                    const match = /language-(\w+)/.exec(className || '');
                    return !inline && match ? (
                      // !inline && match 조건에 맞으면 하이라이팅
                      <SyntaxHighlighter {...props} style={prism} language={match[1]} PreTag="div">
                        {String(children).replace(/\n$/, '')}
                      </SyntaxHighlighter>
                    ) : (
                      // 안 맞다면 문자열 형태로 반환
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
            </Card>
          </div>

          {msg.role === 'ai' && (
            msg.content === '에러 코드를 사용중인 언어와 함께 보내주세요!' ? (
              <></>
            ) : (
              <div className='d-flex justify-content-start'>
                <Button variant="dark" size="sm" onClick={openPostModal}>
                  답변 채택
                </Button>
              </div>
            )
          )}
        </React.Fragment>
      ))}

      {/* ✅ 메시지 목록 아래에 로딩 애니메이션만 따로 출력 */}
      {isLoading && (
        <div className="d-flex justify-content-start my-2">
          <div className="loader"></div>
        </div>
      )}
        <div ref={messagesEndRef} />
      </Card>

      <Row className="align-items-center">
        <Col>
          <Button variant={promptLevel===0?"dark":"outline-dark"} size="sm" onClick={() => setPromptLevel(0)}>
            초보자
          </Button>
        </Col>
        <Col>
          <Button variant={promptLevel===1?"dark":"outline-dark"} size="sm" onClick={() => setPromptLevel(1)}>
            전문가
          </Button>
        </Col>
      </Row>
      <Form className="mt-3" style={{ width: '70%' }}>    

        <Row className="align-items-center">
          <Col xs={10}>
            <Form.Control
              as="textarea"
              rows={1}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onInput={handleResizeHeight}
              onKeyDown={handleKeyDown}
              placeholder="메시지를 입력하세요..."
              ref={textRef}
              style={{ resize: 'none', overflow: 'auto', maxHeight: '120px' }}  // 수동 조절 방지 & 스크롤 제거
            />
          </Col>
          <Col xs={2} className="d-flex justify-content-end">
            <Button variant="dark" type="button" style={{ whiteSpace: 'nowrap' }} onClick={() => sendMessage()}>
              전송
            </Button>
          </Col>
        </Row>
      </Form>
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
    </Container></>
  );
}

export default AIChat;
