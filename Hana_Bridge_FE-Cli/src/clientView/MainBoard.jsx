import Header from "./header/Header";
import NoticeBoard from "./board/NoticeBoard";
import CodeBoard from "./board/CodeBoard";
import AssembleBoard from "./board/AssembleBoard";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

import LeftHeader from "./header/LeftHeader";

import {mainFrame} from "../style/CommonFrame";
import MyBoard from "./board/MyBoard";

//게시판 보드
const MainBoard = () => {
  const navigate = useNavigate();
  const email = useSelector((state) => state.user.email);
  const category = useSelector((state) => state.user.category);

  return (
    <div className={mainFrame}>
      <Header />
      {/* 3열 레이아웃 구성: 좌측 / 본문 / 우측 */}
      <div className="w-full flex md:flex-row max-md:flex-col md:mt-20 ">
        {/* Left Sidebar */}
        <LeftHeader />
        {/* Main Content */}
        <div className="w-4/5 max-md:w-full ">
          {/* 게시판 분기 렌더링 */}
          {category === "me" && <MyBoard />}
          {category === "code" && <CodeBoard />}
          {category === "assemble" && <AssembleBoard />}
          {category === "notice" && <NoticeBoard />}
          {/* 게스트는 CodeHelper 안 보임 */}
        </div>
      </div>
    </div>
  );

};

export default MainBoard;
