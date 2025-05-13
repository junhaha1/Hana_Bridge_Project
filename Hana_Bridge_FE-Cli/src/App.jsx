import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css' 

import { Routes, Route } from 'react-router-dom';
import MainBoard from './clientView/MainBoard';
import DetailBoard from './clientView/board/DetailBoard';
import AddBoard from './clientView/board/AddBoard';
import DetailAssemble from './clientView/board/DetailAssemble';
import MyPage from './clientView/user/MyPage';
import AIChat from './clientView/AIchat/AIChat';
import Home from './clientView/Home';
import DashBoard from './clientView/dashboard/DashBoard';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} /> {/* 홈 화면 */}
      <Route path="/dashBoard/:page" element={<DashBoard/>} />
      <Route path="/board/:category" element={<MainBoard />} /> {/* board 화면 */} 
      <Route path="/mypage" element={<MyPage/>} />  {/* 회원정보 화면 */}
      <Route path="/detailBoard/:boardId" element={<DetailBoard/>} /> {/* 게시글 상세 화면 */}
      <Route path="/detailAssemble/:assembleBoardId" element={<DetailAssemble/>} />{/* Assemble 게시글 상세 화면 */}
      <Route path="/write" element={<AddBoard/>} />  {/* 게시글 작성 화면 */}
      <Route path="/aiChat" element={<AIChat/>} /> {/* AI 대화 화면 */}
    </Routes>
  );
}
export default App;