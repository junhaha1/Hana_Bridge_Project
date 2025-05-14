import React from 'react';
import ApiClient from '../../service/ApiClient';
import { useEffect, useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import '../../css/Board/AssembleBoard.css';
import { useSelector } from 'react-redux';


const AssembleBoard = () => {
  const [boards, setBoards] = useState([]);
  const [category, setCategory] = useState('assemble');

  const navigate = useNavigate(); 
  const nickName = useSelector((state) => state.user.nickName);

  useEffect(() => {
    ApiClient.getAssembleBoards()
    .then(async  (res) => {
        if (!res.ok) {
          //error handler 받음 
          const errorData = await res.json(); // JSON으로 파싱
          console.log("errorData: " + errorData.code + " : " + errorData.message); 

          // 👇 error 객체에 code를 추가해 던짐
          const error = new Error(errorData.message || `서버 오류: ${res.status}`);
          error.code = errorData.code;
          throw error;   
        }
      return res.json();
    })
    .then((data) => {
      console.log(data);      
      if (data === null || (Array.isArray(data) && data.length === 0)) {
        console.log("게시글이 없습니다.");
        setBoards(null);
      } else {
        setBoards(data);
      }
    })
    .catch((err) => {
      console.error("API 요청 실패:", err);
      // 게시글 없을때 -> category error
      if(err.code === 'CATEGORY_POST_NOT_FOUND'){
        setBoards(null);
      }
      // 404일 때 에러 페이지로 이동
      else if (err.code && err.code.includes('NOT_FOUND')) {
        navigate("/error");
      }
    });    
  }, [category]);

  //게시글이 없을 경우 
  if (boards === null) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] text-white bg-white/5 backdrop-blur-sm border border-white/30 rounded-lg shadow-md p-8 mx-4 text-center">
        <h3 className="text-2xl font-bold mb-2">게시글이 없습니다.</h3>
        <h2 className="text-lg text-white/80">첫 게시글을 작성해보세요 😊</h2>
        {nickName === 'guest' ? null 
        : <div> 
          <button
            type="button"
            onClick={() => { 
              navigate('/write');
            }}
            className={` font-bold hover:underline cursor-pointer px-4 py-2 rounded-full text-sm bg-white text-indigo-900 font-bold`}
          >
            글 작성
          </button>
          </div>
        }
      </div>
    );
  }

  //상세 화면으로 
  const boardClick = (assembleboardId) =>{
    console.log(assembleboardId);
    navigate(`/detailAssemble/${assembleboardId}`);
  }

  return (
    <div className="grid gap-6">
      <div className="relative mb-2">
        <input
          type="text"
          placeholder="Search Your Board"
          className="w-full pl-10 pr-4 py-2 rounded-full bg-white text-black placeholder-gray-400 shadow" />
        <span className="absolute left-3 top-2.5 text-gray-500 text-lg">🔍</span>
      </div>
      <div className="flex gap-3 justify-end">
        <span
          className="text-sm text-white/75 hover:underline cursor-pointer"
          onClick={() => {
          }}
        >
          좋아요 | 최신 날짜
        </span>
        
        {nickName === 'guest' ? null 
        : <span
            className="text-sm text-white/75 hover:underline cursor-pointer"
            onClick={() => { 
              navigate('/write');
            }}
          >
            글 작성
          </span>
        }
        
      </div>
      <div className="custom-scroll h-[75vh] overflow-y-auto space-y-5 px-3">
        {boards.map((post) => (
          <div
            key={post.assembleBoardId}
            className="border border-white/30 bg-white/5 backdrop-blur-sm rounded-md p-4 shadow-md hover:shadow-lg transition duration-200"
          >
            <div className="flex justify-between items-start">
              <h3
                onClick={() => boardClick(post.assembleBoardId)}
                className="text-white text-lg font-semibold cursor-pointer hover:underline"
              >
                {post.title}
              </h3>
              <span className="text-sm text-purple-300">{post.nickName}</span>
            </div>

            <p className="text-sm text-gray-200 mt-2 mb-4">
              {post.content.length > 80
                ? post.content.slice(0, 80) + '...'
                : post.content}
            </p>

            <div className="flex justify-end gap-4">
              <span className="text-indigo-300 flex items-center text-sm">
                <img
                  src="/images/blueGood.png"
                  alt="좋아요"
                  width="18"
                  className="mr-1"
                />
                {post.likeCount}
              </span>
              <span className="text-gray-300 flex items-center text-sm">
                <img
                  src="/images/comment.png"
                  alt="댓글"
                  width="18"
                  className="mr-1"
                />
                {post.commentCount}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

};

export default AssembleBoard;