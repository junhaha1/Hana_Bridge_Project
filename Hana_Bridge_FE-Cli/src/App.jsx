import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css' 
import './css/Scroll.css';

import { Routes, Route } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { reloadUserFromStorage } from './store/userSlice';
import MainBoard from './clientView/MainBoard';
import DetailBoard from './clientView/board/DetailBoard';
import AddBoard from './clientView/board/AddBoard';
import DetailAssemble from './clientView/board/DetailAssemble';
import AddAssemble from './clientView/board/AddAssemble';
import AIChat from './clientView/AIchat/AIChat';
import Home from './clientView/Home';
import DashBoard from './clientView/dashboard/DashBoard';
import AdminPage from './clientView/admin/AdminPage';
import AIAssembleStats from './clientView/admin/AIAssembleStats';
import UserStatsPage from './clientView/admin/UserStatsPage';
import UserAIAssembleStats from './clientView/board/UserAIAssembleStats';
import AdminRoute from './component/AdminRoute';
import NotFound from './clientView/error/NotFound';
import RenderError from './clientView/error/RenderError';

import Codi from './clientView/Codi';

function App() {
  const dispatch = useDispatch();
  const nickName = useSelector((state) => state.user.nickName);
  const userRole = useSelector((state) => state.user.role);

  // 앱 시작 시 localStorage에서 사용자 정보를 다시 불러오기
  useEffect(() => {
    dispatch(reloadUserFromStorage());
  }, [dispatch]);

  return (
    <div className='font-sans'>
      <Routes>
        <Route path="/" element={<Home />} /> {/* 홈 화면 */}
        <Route path="/dashBoard/:page" element={<DashBoard/>} />
        <Route path="/board/:category" element={<MainBoard />} /> {/* board 화면 */} 
        <Route path="/detailBoard/:boardId" element={<DetailBoard/>} /> {/* 게시글 상세 화면 */}
        <Route path="/detailAssemble/:assembleBoardId" element={<DetailAssemble/>} />{/* Assemble 게시글 상세 화면 */}
        <Route path="/write" element={<AddBoard/>} />  {/* 게시글 작성 화면 */}
        <Route path="/writeAssemble" element={<AddAssemble/>} />  {/* Assemble 작성 화면 */}
        <Route path="/aiChat" element={<AIChat/>} /> {/* AI 대화 화면 */}
        <Route path="/user/ai-assemble-stats" element={<UserAIAssembleStats/>} /> {/* 사용자 AI답변 통계 페이지 */}
        <Route path="/admin" element={
          <AdminRoute>
            <AdminPage/>
          </AdminRoute>
        } /> {/* 관리자 페이지 */}
        <Route path="/admin/assemble-stats" element={
          <AdminRoute>
            <AIAssembleStats/>
          </AdminRoute>
        } /> {/* AI답변 상세 통계 페이지 */}
        <Route path="/admin/user-stats" element={
          <AdminRoute>
            <UserStatsPage/>
          </AdminRoute>
        } /> {/* 사용자 통계 페이지 */}
        <Route path="/error" element={<NotFound/>} /> {/* 404 화면 */}
        <Route path="/renderError" element={<RenderError/>} />  {/* 렌더링 오류 화면 */}
      </Routes>
      {nickName !== "guest" && userRole !== "ROLE_ADMIN" && (<Codi/>)}
    </div>
  );
}
export default App;