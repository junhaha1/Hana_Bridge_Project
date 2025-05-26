import ApiClient from "../../service/ApiClient";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const MyPosts = () => {
  const [boards, setBoards] = useState(null); // 게시글 목록
  const [loading, setLoading] = useState(true); // 로딩 상태
  const [postType, setPostType] = useState('code'); // code or assemble

  const accessToken = useSelector((state) => state.user.accessToken);
  const navigate = useNavigate();

  useEffect(() => {
    let funcBoard = postType === 'code' ? ApiClient.getMyBoard : ApiClient.getMyAssemble;

    setLoading(true); // 요청 시작 시 로딩
    funcBoard(accessToken)
      .then(async (res) => {
        if (!res.ok) {
          setBoards(null);
          const errorData = await res.json();
          alert("errorData: " + errorData.code + " : " + errorData.message);
          throw new Error(errorData.message || `서버 오류: ${res.status}`);
        }

        if (res.status === 204) {
          setBoards(null);
          return null;
        }

        if (res.status === 200) {
          return res.json();
        }
      })
      .then((data) => {
        setBoards(data);
      })
      .catch((err) => console.error("API 요청 실패:", err))
      .finally(() => setLoading(false));
  }, [postType]);

  const boardClick = (boardId) => {
    if(postType === 'code'){
      navigate(`/detailBoard/${boardId}`, {state: {category: "code"}});
    } else{
      navigate(`/detailAssemble/${boardId}`);
    }
  };

  const cardClass =
  "no-underline bg-white text-black px-8 py-4 rounded-xl shadow-md hover:shadow-xl hover:scale-105 active:scale-95 transition-transform duration-300 flex flex-col justify-center";

  return (
    <div className="custom-scroll h-[75vh] overflow-y-auto space-y-5 px-3">
      {/* 탭 */}
      <div className="inline-flex rounded-md shadow-sm overflow-hidden border border-gray-300 mb-1">
        <button
          onClick={() => setPostType('code')}
          className={`w-full text-left flex items-center px-3 py-2 transition rounded-l-md ${
            postType === 'code'
              ? 'bg-[#C5BCFF] text-black font-bold'
              : 'text-white hover:bg-[#C5BCFF] hover:text-gray-700'
          }`}
        >
          Code 게시글
        </button>
        <button
          onClick={() => setPostType('assemble')}
          className={`w-full min-w-[160px] text-left flex items-center px-3 py-2 transition rounded-r-md ${
            postType === 'assemble'
              ? 'bg-[#C5BCFF] text-black font-bold'
              : 'text-white hover:bg-[#C5BCFF] hover:text-gray-700'
          }`}
        >
          Assemble 게시글
        </button>
      </div>
      {/* 로딩 중 */}
      {loading ? (
        <p className="text-gray-400 text-center py-10">불러오는 중...</p>
      ) : boards === null ? (
        <p className="text-white text-center py-10 text-xl font-semibold">아직 게시글이 없습니다.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 py-4 w-full">
          {boards.map((post) => (
            <button
              key={post.boardId}
              onClick={() => boardClick(post.boardId)}
              className="group overflow-hidden bg-white text-black px-8 py-4 rounded-xl shadow-md hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-300 flex flex-col justify-start max-h-[140px] hover:max-h-[220px]"
            >
              <h3 className="text-xl font-semibold mb-2 truncate group-hover:whitespace-normal group-hover:overflow-visible group-hover:text-ellipsis">
                {post.title}
              </h3>
              <p className="text-sm text-gray-700 mb-4 truncate">
                {post.content}
              </p>
              <div className="flex justify-between text-sm text-gray-500">
                <span>작성자: {post.nickName}</span>
                <div className="flex items-center gap-3">
                  {/* 좋아요 */}
                  <div className="flex items-center gap-1">
                    <img
                      src="/src/images/blueGood.png"
                      alt="좋아요"
                      width="18"
                      height="18"
                    />
                    <span>{post.likeCount}</span>
                  </div>

                  {/* 댓글 */}
                  <div className="flex items-center gap-1">
                    <img
                      src="/src/images/comment.png"
                      alt="댓글"
                      width="18"
                      height="18"
                    />
                    <span>{post.commentCount}</span>
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyPosts;
