import React, { useState } from 'react';
import ApiClient from '../../service/ApiClient';
import { Container, Form, Button, ToggleButtonGroup, ToggleButton } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from "react-router-dom";
import { useSelector } from 'react-redux';

const AddBoard = () => {
  const [category, setCategory] = useState('code');
  const [title, setTitle] = useState('');
  const [code, setCode] = useState('');
  const [content, setContent] = useState('');
  const [createAt, setCreateAt] = useState(new Date());

  const accessToken = useSelector((state) => state.user.accessToken);

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ boardType, title, content });
    // TODO: API 요청 처리
    ApiClient.sendBoard(accessToken, title, category, content, code, createAt)
    .then(() => {
      alert("게시글이 등록되었습니다. ");
      navigate('/');
    })
    .catch((err) => console.error("API 요청 실패:", err));
  };

  return (
    <Container className="mt-5" style={{ maxWidth: '700px' }}>
      <h4 className="fw-bold mb-4">글 작성하기</h4>

      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label className="fw-semibold">게시판 선택<span className="text-danger">*</span></Form.Label>
          <div>
            <ToggleButtonGroup
              type="radio"
              name="board"
              value={category}
              onChange={val => setCategory(val)}
            >
              <ToggleButton
                id="notice-board"
                variant={category === 'notice' ? 'primary' : 'outline-secondary'}
                value="notice"
              >
                NOTICE 게시판
              </ToggleButton>
              <ToggleButton
                id="code-board"
                variant={category === 'code' ? 'primary' : 'outline-secondary'}
                value="code"
              >
                CODE 게시판
              </ToggleButton>
            </ToggleButtonGroup>
          </div>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label className="fw-semibold">제목<span className="text-danger">*</span></Form.Label>
          <Form.Control
            type="text"
            placeholder="게시글 제목을 적어 주세요"
            value={title}
            onChange={e => setTitle(e.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-4">
          <Form.Control
            as="textarea"
            rows={10}
            placeholder="작성할 코드/에러를 적어 주세요"
            value={content}
            onChange={e => setCode(e.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-4">
          <Form.Control
            as="textarea"
            rows={10}
            placeholder="작성할 글을 적어 주세요"
            value={content}
            onChange={e => setContent(e.target.value)}
          />
        </Form.Group>

        <div className="text-center">
          <Button type="submit" variant="primary" className="px-5">
            작성하기
          </Button>
        </div>
      </Form>
    </Container>
  );
};

export default AddBoard;
