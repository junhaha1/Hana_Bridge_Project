import ApiClient from "../../service/ApiClient";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FaRegBookmark } from "react-icons/fa";

const RightHeader = () => {
  const [assembleBoards, setAssembleBoards] = useState(null); // 어셈블 목록
  const accessToken = useSelector((state) => state.user.accessToken);
  const navigate = useNavigate();

  const assembleBoardClick = (assembleBoardId) => {
    navigate(`/detailAssemble/${assembleBoardId}`);
  };

  useEffect(() => {
    ApiClient.getRecentAssemble(accessToken)
      .then(async (res) => {
        if (!res.ok) {
          setAssembleBoards(null);
          const errorData = await res.json();
          alert("errorData: " + errorData.code + " : " + errorData.message);
          throw new Error(errorData.message || `서버 오류: ${res.status}`);
        }

        if (res.status === 204) {
          console.log("없음.");
          return null;
        }

        if (res.status === 200) {
          return res.json();
        }
      })
      .then((data) => {
        console.log(data);
        setAssembleBoards(data);
      })
      .catch((err) => console.error("API 요청 실패:", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="w-full lg:w-full px-4 py-4">
      {/* BEST POST */}
      <div className="bg-[#2d197c] rounded-xl shadow-lg p-4 text-white w-full mb-6
            max-h-[500px] overflow-y-auto custom-scroll">
        <h3 className="text-xs font-bold mb-2 text-gray-300">
          <FaRegBookmark className="w-5 h-5 text-cyan-300" />
          최근 내가 작성한 POST
        </h3>
        {/* 카드 입력 구간 */}
        <div className="grid grid-cols-1 gap-2 py-2 w-full pr-1">
          {assembleBoards && assembleBoards.map((post) => (
            <button
              key={post.boardId}
              onClick={() => assembleBoardClick(post.assembleBoardId)}
              className="group overflow-hidden bg-white text-black px-4 py-2 rounded-lg shadow-md hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-300 flex flex-col justify-start"
            >
              <h3 className="text-xs font-semibold mb-1 line-clamp-2 group-hover:line-clamp-none">
                {post.title}
              </h3>
              <div className="flex justify-between text-xs text-gray-500">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <img src="/images/blueGood.png" alt="좋아요" width="14" height="14" />
                    <span>{post.likeCount}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <img src="/images/comment.png" alt="댓글" width="14" height="14" />
                    <span>{post.commentCount}</span>
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
        <div className="mt-1 mb-2 border-b border-white"/>
      </div>
    </div>
  );
};

export default RightHeader;
