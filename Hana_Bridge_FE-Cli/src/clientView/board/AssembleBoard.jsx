import ApiClient from '../../service/ApiClient';
import { useEffect, useState, useRef } from "react";
import { useNavigate} from "react-router-dom";
import { useSelector } from 'react-redux';

import { scrollStyle } from "../../style/CommonStyle";
import { cardStyle } from "../../style/CommonStyle";
import { userDate } from '../../style/CommonDetail';
import {FaUser, FaSearch, FaArrowUp} from 'react-icons/fa';
import { upBottom, addButton, cardAuthor, cardBottomLayout, cardComment, cardContent, cardGood, cardTitle, cardTopLayout, inputBox, mainTitle, searchBox, sortCheckBox, sortCheckLayout } from "../../style/CommonBoardStyle";


const AssembleBoard = () => {
  const [boards, setBoards] = useState([]);
  const [category, setCategory] = useState('assemble');

  const navigate = useNavigate(); 
  const nickName = useSelector((state) => state.user.nickName);

  const scrollRef = useRef(null);
  
  //맨 위로가기 버튼 
  const scrollToTop = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };


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
    <>
    <div ref={scrollRef} className={scrollStyle + " h-[80vh] mt-5 ml-20 pr-60"}>
      <div className="flex justify-between p-1">
        <h3 className={mainTitle}>AI 답변 게시판</h3>
        <div className="w-1/2 flex justify-end gap-6">
          <div className={searchBox} >
            <FaSearch className="mt-1 mr-1.5"/>
            <input
              type="text"
              placeholder="Search Your Board"
              className={inputBox}
            />
          </div>
          {nickName === 'guest' ? null 
          :
            <button 
              className={addButton}
            >
              글 작성
            </button>
          }
        </div>
      </div>
      <div className={sortCheckLayout}>
        <label htmlFor="sort" className="sr-only">정렬 기준</label>
        <select
          id="sort"
          name="sort"
          className={sortCheckBox}
          onChange={(e) => {
            console.log('선택된 값:', e.target.value)
          }}
        >
          <option className="text-black" value="like">좋아요순</option>
          <option className="text-black" value="latest">최신순</option>
        </select>
      </div>
      {boards.map((post) => (
        <div
          key={post.assembleBoardId}
          className={cardStyle}
          onClick={() => boardClick(post.assembleBoardId)}
        >
          <div className = {cardTopLayout}>
            <h3
              className= {cardTitle}
            >
              {post.title}
            </h3>
          </div>
          <p className={cardContent}>
            {post.content}
          </p>
          <div className= {cardBottomLayout}>
            <div className={userDate}>
              <span className={cardAuthor}>
                <FaUser
                className="mt-1"
                />
                {post.nickName}
              </span>
              <span className='text-xs text-gray-300 mt-0.5'>
                {new Date(post.createAt).toISOString().slice(0, 16).replace('T', ' ')}
              </span>
            </div>
            <div className="flex gap-4">
              <span className= {cardGood}>
                <img
                  src="/images/blueGood.png"
                  alt="좋아요"
                  width="18"
                  className="mr-1"
                />
                {post.likeCount}
              </span>
              <span className= {cardComment}>
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
    <button
      onClick={scrollToTop}
      className={upBottom}
    >
      <FaArrowUp />
    </button>
    </>
  );

};

export default AssembleBoard;