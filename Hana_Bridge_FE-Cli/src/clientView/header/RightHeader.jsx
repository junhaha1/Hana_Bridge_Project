const RightHeader = () => {
  return (
    <div className="w-full lg:w-full px-4 py-4">
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
    </div>
  );
};

export default RightHeader;