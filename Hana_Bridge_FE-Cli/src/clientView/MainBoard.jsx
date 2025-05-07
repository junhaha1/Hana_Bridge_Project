import Header from "./Header";
import CodeHelper from "./CodeHelper";
import NoticeBoard from "./board/NoticeBoard";
import CodeBoard from "./board/CodeBoard";
import AssembleBoard from "./board/AssembleBoard";
import { Container, Button } from 'react-bootstrap';
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";

const MainBoard = () => {
  const { category } = useParams(); 
  const navigate = useNavigate();
  const email = useSelector((state) => state.user.email);

  return (
    <div>
      <Header />
      <Container className="mt-4">
        {/* 글 모아보기 탭 */}
        <div className="mb-3 d-flex gap-2">
          <strong>글 모아보기</strong>
        </div>        
        <div className="mb-3 d-flex gap-2">
          <Button
            variant={category === 'code' ? 'primary' : 'light'}
            size="sm"
            onClick={() => navigate('/board/code')} 
          >
            CODE 게시판
          </Button>
          <Button
            variant={category === 'assemble' ? 'primary' : 'light'}
            size="sm"
            onClick={() => navigate('/board/assemble')}
          >
            ASSEMBLE 게시판
          </Button>
          <Button
            variant={category === 'notice' ? 'primary' : 'light'}
            size="sm"
            onClick={() => navigate('/board/notice')}
          >
            NOTICE 게시판
          </Button>
        </div>

        {/* 게시판 분기 렌더링 */}
        {category === "code" && <CodeBoard />}
        {category === "assemble" && <AssembleBoard />}
        {category === "notice" && <NoticeBoard />}
      </Container>

      {/* 게스트는 CodeHelper 안 보임 */}
      {email !== "guest@email.com" && <CodeHelper />}
    </div>
  );
};

export default MainBoard;
