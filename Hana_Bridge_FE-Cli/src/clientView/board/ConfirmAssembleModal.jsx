import React from 'react';

const ConfirmAssembleModal = ({ onConfirm, onCancel, onMode }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* 배경 오버레이 */}
      <div className="absolute inset-0 bg-gray-900 bg-opacity-30"></div>

      {/* 모달 콘텐츠 */}
      <div className="relative bg-white shadow-xl rounded-lg border border-gray-200 w-full max-w-sm p-6 animate-fade-in text-center z-10 max-md:mx-3">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          {onMode === 'cancel' ? (
            <>게시글 등록을 취소하시겠습니까? <br/>대화 내용은 유지됩니다. </>
          ) : onMode === 'back' ? (
            <>페이지를 나가겠습니까? <br/>게시글은 자동으로 등록이 취소됩니다. <br/>대화 내용은 유지됩니다. </>
          ) : (
             <>게시글을 등록하시겠습니까? <br/>등록한 게시글은 삭제만 가능합니다.  </>
          )}           
        </h3>
        
        <div className="flex justify-center space-x-4">
          <button
            onClick={onConfirm}
            className={`text-white px-4 py-2 rounded transition ${onMode === 'save' ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500  hover:bg-red-600'}`}            
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

export default ConfirmAssembleModal;