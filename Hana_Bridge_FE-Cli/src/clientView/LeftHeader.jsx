import { useDispatch, useSelector } from 'react-redux';
import { setCategory } from '../store/userSlice';
import { useState } from 'react';
import { useNavigate } from "react-router-dom";


const boards = [
  { id: 'code', label: 'Code 게시판' },
  { id: 'assemble', label: 'Assemble 게시판' },
  { id: 'notice', label: 'Notice 게시판' },
];

export default function LeftHeader() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const category = useSelector((state) => state.user.category);

  const postBoard = (id) => {
    dispatch(setCategory({ category: id })); 
    navigate('/board');
  };

  return (
    <div className="fixed top-0 left-0 h-screen w-60 bg-transparent px-6 py-4 mt-16 z-10">
      <div className="absolute top-0 left-0 h-full w-px bg-white/20" />

      <div className="space-y-2 mt-4">
        {boards.map(({ id, label }) => (
          <button
            key={id}
            onClick={() => postBoard(id)}
            className={`
              w-full text-left px-4 py-2
              transition-colors duration-200
              ${
                category === id
                  ? 'bg-[#C5BCFF] text-black font-bold'
                  : 'bg-transparent text-gray-300 hover:bg-white/10 hover:text-white'
              }
            `}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
