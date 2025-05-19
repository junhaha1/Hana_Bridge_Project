import Header from "./header/Header";
import CodeHelper from "./CodeHelper";
import NoticeBoard from "./board/NoticeBoard";
import CodeBoard from "./board/CodeBoard";
import AssembleBoard from "./board/AssembleBoard";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";

import LeftHeader from "./header/LeftHeader";
import RightHeader from "./header/RightHeader";

import {mainFrame} from "../style/CommonFrame";

//게시판 보드
const MainBoard = () => {
  const navigate = useNavigate();
  const email = useSelector((state) => state.user.email);
  const category = useSelector((state) => state.user.category);

  return (
    <div className={mainFrame}>
      <Header />
      {/* 3열 레이아웃 구성: 좌측 / 본문 / 우측 */}
      <div className="w-full flex flex-row px-2 mt-24">
        {/* Left Sidebar */}
        <LeftHeader />
        {/* Main Content */}
        <div className="w-4/5">
          <div className="container mx-auto px-4">
            {/* 게시판 분기 렌더링 */}
            {category === "code" && <CodeBoard />}
            {category === "assemble" && <AssembleBoard />}
            {category === "notice" && <NoticeBoard />}
          </div>
          {/* 게스트는 CodeHelper 안 보임 */}
          {email !== "guest@email.com" && <CodeHelper />}
        </div>
      </div>
    </div>
  );

};

export default MainBoard;
