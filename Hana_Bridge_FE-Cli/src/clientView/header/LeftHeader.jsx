import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from "react-router-dom";
import { setPage } from "../../store/userSlice";
import { setCategory } from '../../store/userSlice';
import { FaFolder} from 'react-icons/fa';

import { leftFrame } from '../../style/CommonFrame';
import { leftTitle } from '../../style/CommonLeftStyle';

const boards = [
  { id: 'myposts', label: '내 게시판' },
  { id: 'notice', label: '공지 게시판' },
  { id: 'code', label: '코드질문 게시판' },
  { id: 'assemble', label: 'AI답변 게시판' },
];

export default function LeftHeader() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const category = useSelector((state) => state.user.category);
  const nickName = useSelector((state) => state.user.nickName);
  const page = useSelector((state) => state.user.page);

  const postBoard = (id) => {
    dispatch(setCategory({ category: id }));
    dispatch(setPage({ page: "" }));
    navigate("/board/" + id);
  };

  return (
    <aside className={leftFrame}>
      <div className='mt-5'/>
        <h3 className={leftTitle}>커뮤니티</h3>
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
    </aside>
  );
}