import React, { useState, useRef, useEffect } from 'react';
import { Container, Card, Form, Button, Row, Col } from 'react-bootstrap';
import Header from '../Header';

function AIChat() {
  const [messages, setMessages] = useState([
    { role: 'ai', content: '안녕하세요! 무엇을 도와드릴까요?' },
  ]);
  const [input, setInput] = useState('');
  //채팅의 마지막을 가르킴
  const messagesEndRef = useRef(null);  
  const textRef = useRef(null);

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

    // 가짜 AI 응답
    setTimeout(() => {
      const aiResponse = { role: 'ai', content: `“${input}”에 대한 답변입니다.` };
      setMessages((prev) => [...prev, aiResponse]);
    }, 800);

    console.log("input: " + input);
  };

  //enter로 전송
  const handleKeyDown = (e) => {
    if (e.key === 'Enter'){
      e.preventDefault();  // 새로고침 방지
      sendMessage();
    } 
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
          <div
            key={idx}
            className={`d-flex ${msg.role === 'ai' ? 'justify-content-start' : 'justify-content-end'} my-2`}
          >
            <Card
              border="primary"
              text="dark"
              bg="light"
              className="px-3 py-2"
              style={{
                maxWidth: '75%',
                borderRadius: '15px',
              }}
            >
              <div>{msg.content}</div>
            </Card>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </Card>

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
