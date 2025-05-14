import ApiClient from "../../service/ApiClient";
import Header from '../header/Header';
import { useSelector } from 'react-redux';
import { useEffect, useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useParams } from 'react-router-dom';
import Comments from './Comments';

import '../../css/Board/DetailBoard.css';
import LeftHeader from '../header/LeftHeader';
import RightHeader from '../header/RightHeader';
import CodeHelper from '../CodeHelper';

//상세 게시글 보드
const DetailBoard = () => {
  const email = useSelector((state) => state.user.email);
  const nickName = useSelector((state) => state.user.nickName);
  const role = useSelector((state) => state.user.role);
  const accessToken = useSelector((state) => state.user.accessToken);

  const { boardId } = useParams(); 

  const [board, setBoard] = useState(null);
  const [isEdit, setIsEdit] = useState(false);

  const [isLike, setIsLike] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  const [title, setTitle] = useState('');
  const [code, setCode] = useState('');
  const [content, setContent] = useState('');
  const [updateAt, setUpdateAt] = useState(new Date());

  const navigate = useNavigate();
  const location = useLocation();

  const [category, setCategory] = useState(location.state?.category);
  const [commentCount, setCommentCount] = useState(0);

  // const category = location.state?.category;

  useEffect(() => {
    ApiClient.getBoard(boardId, accessToken)
    .then(async (res) => {
      if (!res.ok) {
        const errorData = await res.json(); // JSON으로 파싱
        alert("errorData: " + errorData.code + " : " + errorData.message);   
        throw new Error(errorData.message || `서버 오류: ${res.status}`); // message 필드 추출             
        }
      return res.json();
    })
    .then((data) => {
      console.log(data);
      setBoard(data);
      setLikeCount(data.likeCount);
      setIsLike(data.goodCheck);      
      setCommentCount(data.commentCount);
    })
    .catch((err) => console.error("API 요청 실패:", err)); 
  }, [isEdit, boardId]);

  useEffect(() => {
    if (isEdit && board) {
      setTitle(board.title);
      setContent(board.content);
      setCode(board.code); 
    }
  }, [isEdit, board]);

  if (!board) return <div>로딩 중...</div>;

  //삭제 버튼
  const boardDeleteButton = (boardId) => {
    ApiClient.deleteBoard(boardId, accessToken, category)
    .then(res => {
      if (!res.ok) {
          throw new Error(`서버 오류: ${res.status}`);
      }
      console.log("게시글 삭제 완료!");
      navigate('/');
    })
    .catch(error => {
        console.error("게시글 삭제 중 오류 발생:", error);
    });
  }

  //수정 저장 버튼
  const saveBoard = (boardId) => {
    ApiClient.updateBoard(boardId, accessToken, category, title, content, code, updateAt)
    .then(() => {
      console.log("게시글 수정 완료 ! ");
      navigate(`/detailBoard/${boardId}`, {state: {category: category}});
      setIsEdit(false);
    })
    .catch((err) => console.error("API 요청 실패:", err));
  }

  //좋아요
  const handleLike = (boardId) => {
    ApiClient.sendBoardGood(boardId, accessToken)
      .then((res) => {
        if (!res.ok) throw new Error(`서버 오류: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        console.log(data);
        setIsLike(data.goodCheck);
        setLikeCount(data.likeCount);  // 추가
      })
      .catch((err) => console.error("API 요청 실패:", err));    
  }
  //좋아요 삭제
  const handleCancelLike = (boardId) => {
    ApiClient.deleteBoardGood(boardId, accessToken)
      .then(res => {
        if (!res.ok) {
            throw new Error(`서버 오류: ${res.status}`);
        }
        return res.json();
      })
      .then((data) =>{
        console.log("좋아요 취소!");
        setIsLike(data.goodCheck);
        setLikeCount(data.likeCount);  // 추가
      })
      .catch(error => {
          console.error("삭제 중 오류 발생:", error);
      });
  }
  

  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-900 to-purple-900 w-full flex flex-col">
      <Header />

      <div className="w-full flex flex-col lg:flex-row gap-4 px-2 sm:px-6 mt-24">
        {/* 좌측 사이드바 */}
        <div className="w-full lg:w-1/5">
          <LeftHeader />
        </div>

        {/* 메인 콘텐츠 */}
        <div className="w-full lg:w-3/5">
          <div className="w-full max-w-3xl mx-auto px-4">
            {isEdit ? (
              <>
                {/* 게시글 수정 폼 */}
                <div className="mb-6 text-white">
                  <div className="text-sm text-white/60 mb-2 text-left">
                    {category === "code"
                      ? "CODE 게시판 < 상세글"
                      : "공지 게시판 < 상세글"}
                  </div>

                  <input
                    type="text"
                    className="w-full mb-3 p-2 rounded bg-transparent border border-white/30 text-white font-bold placeholder-white/50"
                    placeholder="제목을 입력해주세요"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />

                  <p className="text-sm text-white/60 text-left mb-2">
                    작성자 {board.nickName}
                  </p>

                  {category === "code"
                    ? <textarea
                      className="w-full mb-3 p-2 rounded bg-transparent border border-white/30 text-white placeholder-white/50"
                      placeholder="코드나 에러사항을 입력해주세요"
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                    />
                    : null}                  

                  <textarea
                    className="w-full p-2 rounded bg-transparent border border-white/30 text-white placeholder-white/50"
                    placeholder="내용을 입력해주세요"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                  />

                  <div className="flex justify-between items-center mt-4">
                    <div className="flex items-center space-x-6">
                      <span className="flex items-center">
                        <img src="/images/whiteGood.png" alt="좋아요" className="w-5 h-5 mr-1" />
                        {board.likeCount}
                      </span>
                      <span className="flex items-center">
                        <img src="/images/comment.png" alt="댓글" className="w-5 h-5 mr-1" />
                        {board.commentsCount}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <button
                        className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
                        onClick={() => saveBoard(boardId)}
                      >
                        저장
                      </button>
                      <button
                        className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
                        onClick={() => setIsEdit(false)}
                      >
                        취소
                      </button>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* 게시글 보기 (테두리 없이 투명 배경) */}
                <div className="mb-6 text-white">
                  <div className="text-sm text-white/60 mb-2 text-left">
                    {category === "code"
                      ? "CODE 게시판 < 상세글"
                      : "공지 게시판 < 상세글"}
                  </div>

                  <h2 className="text-2xl font-bold text-left mb-1">{board.title}</h2>
                  <p className="text-sm text-white/60 text-left mb-2">
                    작성자 {board.nickName}
                  </p>

                  <pre className="text-left whitespace-pre-wrap text-white mb-3">{board.code}</pre>
                  <p className="text-left whitespace-pre-wrap">{board.content}</p>

                  <div className="flex justify-between items-center mt-6">
                    <div className="flex items-center space-x-6">
                      {isLike ? (
                        <span
                          className="cursor-pointer flex items-center"
                          onClick={() => handleCancelLike(boardId)}
                        >
                          <img src="/images/blueGood.png" alt="좋아요" className="w-5 h-5 mr-1" />
                          {likeCount}
                        </span>
                      ) : (
                        <span
                          className="cursor-pointer flex items-center"
                          onClick={() => handleLike(boardId)}
                        >
                          <img src="/images/whiteGood.png" alt="좋아요" className="w-5 h-5 mr-1" />
                          {likeCount}
                        </span>
                      )}

                      <span className="flex items-center">
                        <img src="/images/comment.png" alt="댓글" className="w-5 h-5 mr-1" />
                        {commentCount}
                      </span>
                    </div>

                    {(nickName === board.nickName || role === "admin") && (
                      <div className="flex gap-3">
                        <button
                          onClick={() => setIsEdit(true)}
                          className="text-sm text-white hover:underline"
                        >
                          수정하기
                        </button>
                        <button
                          onClick={() => boardDeleteButton(boardId)}
                          className="text-sm text-red-400 hover:underline"
                        >
                          삭제하기
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}

            {/* 댓글 위 흰 줄 */}
            <div className="border-t-2 border-white/70 mt-10 pt-4">
              <Comments boardId={boardId} category={category} />
            </div>
          </div>
        </div>

        {/* 우측 사이드바 */}
        <div className="w-full lg:w-1/5">
          <RightHeader />
        </div>
      </div>
      {email !== "guest@email.com" && <CodeHelper />}
    </div>
  );
};

export default DetailBoard;