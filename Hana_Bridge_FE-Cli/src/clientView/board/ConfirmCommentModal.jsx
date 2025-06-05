import React from "react";

const ConfirmCommentModal = ({ onConfirm, onCancel, onMode }) => {
  //console.log(category);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* 배경 오버레이 */}
      <div className="absolute inset-0 bg-gray-900 bg-opacity-30"></div>

      {/* 모달 콘텐츠 */}
      <div className="relative bg-white shadow-xl rounded-lg border border-gray-200 w-full max-w-sm p-6 animate-fade-in text-center z-10 max-md:mx-3">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          {onMode === 'update' ? (
            <>댓글을 수정하시겠습니까?</>
          ) : (
            <>댓글을 삭제하시겠습니까?</>
          )}           
        </h3>
        
        <div className="flex justify-center space-x-4">
          <button
            onClick={onConfirm}
            className={`text-white px-4 py-2 rounded transition 
              ${onMode === 'update' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-500  hover:bg-red-600'}`}            
          >
            확인
          </button>
          <button
            onClick={onCancel}
            className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400 transition"
          >
            취소
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmCommentModal;