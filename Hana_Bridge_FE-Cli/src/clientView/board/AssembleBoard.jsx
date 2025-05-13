import React from 'react';
import ApiClient from '../../service/ApiClient';
import { Container, Row, Col, Button, Card, Badge } from 'react-bootstrap';
import { useEffect, useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import '../../css/Board/AssembleBoard.css';


const AssembleBoard = () => {
  const [boards, setBoards] = useState([]);
  const [category, setCategory] = useState('assemble');

  const navigate = useNavigate(); 

  useEffect(() => {
    ApiClient.getAssembleBoards()
    .then((res) => {
      // 게시글이 없는 경우로 처리
      if (res.status === 404) {
        console.log("게시글 없음 (404)");
        setBoards(null);  
        return null;
      }
      if (!res.ok) throw new Error(`서버 오류: ${res.status}`);
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
    .catch((err) => console.error("API 요청 실패:", err));    
  }, [category]);

  //게시글이 없을 경우 
  if(!boards){
    return (
      <div>
        <h3>게시글이 없습니다.</h3>
        <h2>첫 게시글을 작성해보세요.😊</h2> 
      </div>
    )
  }

  //상세 화면으로 
  const boardClick = (assembleboardId) =>{
    console.log(assembleboardId);
    navigate(`/detailAssemble/${assembleboardId}`);
  }

  return (
      <div className="w-full flex flex-col">
        {/* 반응형 3열 레이아웃 */}
        <div className="w-full flex flex-col lg:flex-row gap-4 px-2 sm:px-6 mt-24">
          {/* Main Content - Assemble 게시판 */}
          <div className="w-full lg:w-3/5">
            <div className="max-w-3xl mx-auto px-4 sm:px-6">
              <h2 className="text-2xl font-bold mb-4">Assemble 게시판</h2>
              <div className="grid gap-6">
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
                        <img src="/images/blueGood.png" alt="좋아요" width="18" className="mr-1" />
                        {post.likeCount}
                      </span>
                      <span className="text-gray-300 flex items-center text-sm">
                        <img src="/images/comment.png" alt="댓글" width="18" className="mr-1" />
                        {post.commentCount}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
  );

};

export default AssembleBoard;