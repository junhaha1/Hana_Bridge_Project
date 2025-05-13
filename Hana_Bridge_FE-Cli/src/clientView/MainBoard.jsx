import Header from "./header/Header";
import CodeHelper from "./CodeHelper";
import NoticeBoard from "./board/NoticeBoard";
import CodeBoard from "./board/CodeBoard";
import AssembleBoard from "./board/AssembleBoard";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";

import LeftHeader from "./header/LeftHeader";
import RightHeader from "./header/RightHeader";


//게시판 보드
const MainBoard = () => {
  const navigate = useNavigate();
  const email = useSelector((state) => state.user.email);
  const category = useSelector((state) => state.user.category);

  return (


    <div className="min-h-screen bg-gradient-to-r from-indigo-900 to-purple-900 flex">
      <Header />
      {/* 3열 레이아웃 구성: 좌측 / 본문 / 우측 */}
      <div className="w-full flex flex-col lg:flex-row gap-4 px-2 sm:px-6 mt-24">
        {/* Left Sidebar */}
        <div className="w-full lg:w-1/5">
          <LeftHeader />
        </div>

        {/* Main Content */}
        <div className="w-full lg:w-3/5">
          <div className="container mx-auto mt-6 px-4">

            {/* 게시판 분기 렌더링 */}
            {category === "code" && <CodeBoard />}
            {category === "assemble" && <AssembleBoard />}
            {category === "notice" && <NoticeBoard />}
          </div>

          {/* 게스트는 CodeHelper 안 보임 */}
          {email !== "guest@email.com" && <CodeHelper />}
        </div>

        {/* Right Sidebar */}
        <div className="w-full lg:w-1/5">
          <RightHeader />
        </div>
      </div>
    </div>
  );

};

export default MainBoard;
