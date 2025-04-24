import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import { Routes, Route } from 'react-router-dom';
import MainBoard from './clientView/MainBoard';
import Login from './clientView/login/Login';
import DetailBoard from './clientView/board/DetailBoard';
import AddBoard from './clientView/board/AddBoard';


function App() {
  return (
    <Routes>
      <Route path="/" element={<MainBoard />} /> {/* 메인 화면 */}
      <Route path="/login" element={<Login />} /> {/* Login 화면 */}
      <Route path="/detailBoard/:boardId" element={<DetailBoard/>} /> {/* 게시글 상세 화면 */}
      <Route path="/write" element={<AddBoard/>} />  {/* 게시글 작성 화면 */}
    </Routes>
  );
}
export default App;