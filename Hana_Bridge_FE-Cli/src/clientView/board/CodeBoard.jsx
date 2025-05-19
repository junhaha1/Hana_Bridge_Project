import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ApiClient from "../../service/ApiClient";
import { useSelector } from "react-redux";

//디자인 
import { scrollStyle } from "../../style/CommonStyle";
import { cardStyle } from "../../style/CommonStyle";
import { buttonStyle } from "../../style/CommonStyle";

import {FaUser, FaSearch} from 'react-icons/fa';

const CodeBoard = () => {
  const [boards, setBoards] = useState([]);
  const navigate = useNavigate();
  const category = useSelector((state) => state.user.category);
  const nickName = useSelector((state) => state.user.nickName);

  useEffect(() => {
    ApiClient.getBoards(category)
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

  const boardClick = (boardId) => {
    navigate(`/detailBoard/${boardId}`, { state: { category: category } });
  };
  
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

  return (
    <div className={scrollStyle + " h-[80vh] mt-5 px-40"}>
      <div className="flex justify-between p-1">
        <h3 className="w-1/2 text-left font-bold text-white">코드 게시판</h3>
        <div className="w-1/2 flex justify-end gap-6">
          <div className="flex pl-5 py-2 rounded-full bg-white text-black placeholder-gray-400 shadow" >
            <FaSearch className="mt-1 mr-1.5"/>
            <input
              type="text"
              placeholder="Search Your Board"
              className="bg-transparent focus:outline-none"
            />
          </div>
          {nickName === 'guest' ? null 
          :
            <button 
              className="bg-white hover:!bg-[#C5BCFF] hover:text-black px-4 py-2 rounded-md text-sm font-semibold text-indigo-900 transition-colors duration-300"
            >
              글 작성
            </button>
          }
        </div>
      </div>
      <div className="flex gap-3 justify-end mt-4 mb-2">
        <label htmlFor="sort" className="sr-only">정렬 기준</label>
        <select
          id="sort"
          name="sort"
          className="text-white pr-1 py-2 text-sm bg-transparent rounded-md focus:outline-none focus:ring-0 focus:border-transparent"
          onChange={(e) => {
            console.log('선택된 값:', e.target.value)
          }}
        >
          <option className="text-black" value="like">좋아요순</option>
          <option className="text-black" value="latest">최신순</option>
        </select>
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
        {boards.map((post) => (
          <div
            key={post.boardId}
            className={cardStyle}
            onClick={() => boardClick(post.boardId)}
          >
            <div className="flex justify-between items-start">
              <h3
                className="text-white text-lg font-semibold line-clamp-1"
              >
                {post.title}
              </h3>
            </div>
            <p className="text-sm text-gray-200 line-clamp-1">
              {post.content}
            </p>

            <div className="flex justify-between gap-4">
              
              <span className="flex text-sm text-purple-300 gap-1">
                <FaUser
                className="mt-1"
                />
                {post.nickName}
              </span>
              <div className="flex gap-4">
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
          </div>
        ))}
      </div>
  );
};

export default CodeBoard;
