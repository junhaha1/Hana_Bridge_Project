import React, { useState, useRef, useEffect } from 'react';
import { Container, Card, Form, Button, Row, Col } from 'react-bootstrap';
import ReactMarkdown from "react-markdown";
import Header from '../Header';
import ApiClient from '../../service/ApiClient';
import "./loading.css";
import { useSelector } from 'react-redux';

function AIChat() {
  const [messages, setMessages] = useState([
    { role: 'ai', content: '에러 코드를 사용중인 언어와 함께 보내주세요!' },
  ]);
  const [input, setInput] = useState('');
  //채팅의 마지막을 가르킴
  const messagesEndRef = useRef(null);  
  const textRef = useRef(null);

  const [promptLevel, setPromptLevel] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const accessToken = useSelector((state) => state.user.accessToken);

  //메시지가 추가될 때마다 거기로 스크롤 이동
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);


  const handleResizeHeight = () => {
    const element = textRef.current;
		textRef.current.style.height = 'auto';  //backspace 눌렀을 때에도 높이 자동 조절
    const maxHeight = 5 * 24; // 5줄 x 줄 높이 약 24px
    element.style.height = `${Math.min(element.scrollHeight, maxHeight)}px`; //height값 자동 조절 + 높이 제한   
    
  };


  const sendMessage = () => {
    if (!input.trim()) return;
    const newMessage = { role: 'user', content: input };
    setMessages((prev) => [...prev, newMessage]);
    setInput('');

    // 입력창 높이 초기화
    if (textRef.current) {
      textRef.current.style.height = 'auto';
    }

    console.log("promptLevel: " + promptLevel + "message: " + input );
    setIsLoading(true); 
    ApiClient.sendMessage(accessToken, promptLevel, input)
    .then((res) => {
      console.log("loading");
      return res.json();
    })
    .then((data) =>{
      const aiResponse = { role: 'ai', content: data.answer };
      setMessages((prev) => [...prev, aiResponse]);
      setIsLoading(false);
    })
    .catch((err) => console.error("API 요청 실패:", err));

    console.log("input: " + input);
  };

  //enter로 전송
  const handleKeyDown = (e) => {
    if (e.key === 'Enter'){
      e.preventDefault();  // 새로고침 방지
      sendMessage();
    } 
  };

  //답변 채택을 눌렀을때 Assemble Board만들기
  const makeAssemble = () =>{

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
              className="px-3 py-2"
              style={{ maxWidth: '75%', borderRadius: '15px' }}
            >
              <div><ReactMarkdown>{msg.content}</ReactMarkdown></div>
            </Card>
          </div>

          {msg.role === 'ai' && (
            msg.content === '에러 코드를 사용중인 언어와 함께 보내주세요!' ? (
              <></>
            ) : (
              <div className='d-flex justify-content-start'>
                <Button variant="dark" size="sm" onClick={() => makeAssemble()}>
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
    </Container></>
  );
}

export default AIChat;
