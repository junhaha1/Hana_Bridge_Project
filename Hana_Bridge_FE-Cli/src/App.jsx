import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import { Routes, Route } from 'react-router-dom';
import MainBoard from './clientView/MainBoard';
import Login from './clientView/login/Login';


function App() {
  return (
    <Routes>
      <Route path="/" element={<MainBoard />} /> {/* 메인 화면 */}
      <Route path="/login" element={<Login />} /> {/* Login 화면 */}
    </Routes>
  );
}
export default App;