import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ApiClient from "../../service/ApiClient";
import { useSelector } from "react-redux";
import "../../css/Scroll.css";

const CodeBoard = () => {
  const [boards, setBoards] = useState([]);
  const navigate = useNavigate();
  const category = useSelector((state) => state.user.category);
  const nickName = useSelector((state) => state.user.nickName);

  useEffect(() => {
    ApiClient.getBoards(category)
      .then(async  (res) => {
        if (res.status === 404) {
          console.log("게시글 없음 (404)");
          setBoards(null);
          return null;
        }
        if (!res.ok) {
        const errorData = await res.json(); // JSON으로 파싱
        alert("errorData: " + errorData.code + " : " + errorData.message);   
        throw new Error(errorData.message || `서버 오류: ${res.status}`); // message 필드 추출             
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
      .catch((err) => console.error("API 요청 실패:", err));
  }, [category]);

  const boardClick = (boardId) => {
    navigate(`/detailBoard/${boardId}`, { state: { category } });
  };

  if (!boards) {
    return (
      <div className="text-center text-white mt-10">
        <h3 className="text-xl font-semibold">게시글이 없습니다.</h3>
        <h2 className="text-lg mt-2">첫 게시글을 작성해보세요. 😊</h2>
      </div>
    );
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
            key={post.boardId}
            className="border border-white/30 bg-white/5 backdrop-blur-sm rounded-md p-6 shadow-md hover:shadow-lg transition duration-200 "
          >
            <div className="flex justify-between items-start">
              <h3
                onClick={() => boardClick(post.boardId)}
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

export default CodeBoard;
