import { useDispatch, useSelector } from 'react-redux';
import { setCategory } from '../../store/userSlice';
import { FaHome, FaUser, FaFileAlt, FaPen, FaFolder, FaTrash, FaUsers } from 'react-icons/fa';

import Default from '../../../public/images/default.png';

const boards = [
  { id: 'code', label: 'Code 게시판' },
  { id: 'assemble', label: 'Assemble 게시판' },
  { id: 'notice', label: 'Notice 게시판' },
];

export default function LeftHeader() {
  const dispatch = useDispatch();
  const category = useSelector((state) => state.user.category);
  const email = useSelector((state) => state.user.email);
  const nickname = useSelector((state) => state.user.name);

  const postBoard = (id) => {
    dispatch(setCategory({ category: id }));
  };

  return (
    <aside className="w-full lg:w-64 h-full px-4 py-6 bg-transparent border-r border-gray-200 text-sm text-white">
      {email !== 'guest' && (
        <>
          {/* 프로필 및 워크스페이스 */}
          <div className="mb-6 flex items-center space-x-4">
            <img
              src={Default}
              alt="프로필 사진"
              className="w-14 h-14 rounded-full border border-white shadow"
            />
            <div className="text-lg font-semibold">{nickname}'s Workspace</div>
          </div>
          {/* 상단 메뉴 */}
          <div className="space-y-1 mb-6">
            <div className="text-xs font-semibold text-gray-300 px-3 mb-1">Main</div>
            <button className="flex items-center gap-2 w-full px-3 py-2 rounded text-white hover:bg-[#C5BCFF] hover:text-gray-700 transition">
              <FaHome />
              <span className="font-medium">Dashboard</span>
            </button>
            <button className="flex items-center gap-2 w-full px-3 py-2 rounded text-white hover:bg-[#C5BCFF] hover:text-gray-700 transition">
              <FaFileAlt />
              My Page
            </button>
            <button className="flex items-center gap-2 w-full px-3 py-2 rounded text-white hover:bg-[#C5BCFF] hover:text-gray-700 transition">
              <FaPen />
              My Posts
            </button>
          </div>
        </>
      )}

      {/* 게시판 영역 */}
      <div className="mb-6">
        <div className="text-xs font-semibold text-gray-300 px-3 mb-1">Boards</div>
        <div className="space-y-1">
          {boards.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => postBoard(id)}
              className={`w-full text-left flex items-center px-3 py-2 rounded transition ${
                category === id
                  ? 'bg-[#C5BCFF] text-black font-bold'
                  : 'text-white hover:bg-[#C5BCFF] hover:text-gray-700'
              }`}
            >
              <FaFolder className="mr-2" />
              {label}
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
}