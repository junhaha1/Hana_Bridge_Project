import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css' 
import './css/Scroll.css';

import { Routes, Route } from 'react-router-dom';
import MainBoard from './clientView/MainBoard';
import DetailBoard from './clientView/board/DetailBoard';
import AddBoard from './clientView/board/AddBoard';
import DetailAssemble from './clientView/board/DetailAssemble';
import AIChat from './clientView/AIchat/AIChat';
import Home from './clientView/Home';
import DashBoard from './clientView/dashboard/DashBoard';
import NotFound from './clientView/error/NotFound';
import RenderError from './clientView/error/RenderError';

import Codi from './clientView/Codi';
import { useSelector } from 'react-redux';

function App() {
  const nickName = useSelector((state) => state.user.nickName);
  return (
    <div className='font-sans'>
      <Routes>
        <Route path="/" element={<Home />} /> {/* 홈 화면 */}
        <Route path="/dashBoard/:page" element={<DashBoard/>} />
        <Route path="/board/:category" element={<MainBoard />} /> {/* board 화면 */} 
        <Route path="/detailBoard/:boardId" element={<DetailBoard/>} /> {/* 게시글 상세 화면 */}
        <Route path="/detailAssemble/:assembleBoardId" element={<DetailAssemble/>} />{/* Assemble 게시글 상세 화면 */}
        <Route path="/write" element={<AddBoard/>} />  {/* 게시글 작성 화면 */}
        <Route path="/aiChat" element={<AIChat/>} /> {/* AI 대화 화면 */}
        <Route path="/error" element={<NotFound/>} /> {/* 404 화면 */}
        <Route path="/renderError" element={<RenderError/>} />  {/* 렌더링 오류 화면 */}
      </Routes>
      {nickName !== "guest" && (<Codi/>)}
    </div>
  );
}
export default App;