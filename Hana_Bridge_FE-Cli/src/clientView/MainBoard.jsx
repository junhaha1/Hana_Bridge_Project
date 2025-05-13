import Header from "./header/Header";
import CodeHelper from "./CodeHelper";
import NoticeBoard from "./board/NoticeBoard";
import CodeBoard from "./board/CodeBoard";
import AssembleBoard from "./board/AssembleBoard";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import LeftHeader from "./header/LeftHeader";

const MainBoard = () => {
  const navigate = useNavigate();
  const email = useSelector((state) => state.user.email);
  const category = useSelector((state) => state.user.category);

  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-900 to-purple-900 flex">
      {/* 왼쪽 사이드바 */}
      <div className="w-60">
        <LeftHeader />
      </div>

      {/* 오른쪽 메인 콘텐츠 */}
      <div className="flex-1">
        <Header />

        <div className="container mx-auto mt-6 px-4">

          {/* 게시판 분기 렌더링 */}
          {category === "code" && <CodeBoard />}
          {category === "assemble" && <AssembleBoard />}
          {category === "notice" && <NoticeBoard />}
        </div>

        {/* 게스트는 CodeHelper 안 보임 */}
        {email !== "guest@email.com" && <CodeHelper />}
      </div>
    </div>
  );

};

export default MainBoard;
