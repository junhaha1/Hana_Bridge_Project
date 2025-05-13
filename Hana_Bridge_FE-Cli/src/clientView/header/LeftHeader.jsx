import { useDispatch, useSelector } from 'react-redux';
import { setCategory } from '../../store/userSlice';

const boards = [
  { id: 'code', label: 'Code 게시판' },
  { id: 'assemble', label: 'Assemble 게시판' },
  { id: 'notion', label: 'Notion 게시판' },
];

export default function LeftHeader() {
  const dispatch = useDispatch();
  const category = useSelector((state) => state.user.category);

  const postBoard = (id) => {
    dispatch(setCategory({ category: id }));
  };

  return (
    <div className="w-full lg:w-full px-4 py-4">
      <div className="space-y-2">
        {boards.map(({ id, label }) => (
          <button
            key={id}
            onClick={() => postBoard(id)}
            className={`w-full text-left px-4 py-2 rounded transition-colors duration-200 ${
              category === id
                ? 'bg-[#C5BCFF] text-black font-bold'
                : 'bg-transparent text-gray-300 hover:bg-white/10 hover:text-white'
            }`}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
