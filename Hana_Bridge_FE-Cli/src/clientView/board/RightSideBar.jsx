const RightSidebar = () => {
  return (
    <div className="w-full md:w-60 flex flex-col px-4 md:px-0 mt-20 md:mt-32 z-20">
      {/* BEST POST */}
      <div className="bg-[#2d197c] rounded-xl shadow-lg p-4 text-white w-full mb-6">
        <h3 className="text-xs font-bold mb-2 text-gray-300">BEST POST</h3>
        <div className="bg-white text-black p-3 rounded text-sm">
          이게 바로 제목인가요?
          <div className="text-right text-blue-500 text-xs mt-2">
            👍 112 &nbsp; 💬 25
          </div>
        </div>
      </div>

      {/* 버튼 - 콘텐츠 아래쪽에 자연스럽게 위치 */}
      <div className="mt-auto mb-6 w-full">
        <button className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded-full shadow-md">
          ✨ Code Helper
        </button>
      </div>
    </div>
  );
};

export default RightSidebar;
