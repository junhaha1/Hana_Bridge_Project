//최상단 프레임
export const aiChatFrame = "w-full h-full flex flex-col bg-zinc-800 overflow-hidden relative";
//상단 메뉴바 
export const topNavi = 'flex justify-between max-md:justify-end bg-white/15 max-md:py-2';
//상단 대화창
export const chatBox = " h-full bg-white/10 p-4 overflow-x-hidden";
//초보자 전문자 버튼
export const promptButton = "w-full bg-white/10 p-2 border rounded border-white/20 shadow-md cursor-pointer hover:bg-white/30";
//AI 메시지 박스
export const aiBox = 'bg-white/20 text-white rounded-tl-2xl rounded-tr-2xl rounded-br-2xl';
//User 메시지 박스 
export const userBox = 'bg-[#322776] text-white rounded-tl-2xl rounded-tr-2xl rounded-bl-2xl';
//로딩창 
export const loding = "loader w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin";
//하단 입력창
export const inputBox = "w-full mx-auto bg-white/10 border-t-2 border-white/10 md:p-5 max-md:p-4";
//입력창 textarea
export const inputTextarea = "w-full resize-none bg-transparent text-white placeholder-gray-400 focus:outline-none border-r-2 border-white/20";
//입력창 보내기 버튼 
export const sendButton = "hover:opacity-80 hover:scale-105 transition duration-200 ease-in-out";

//게시글 등록 중 div
export const postingDiv = 'flex flex-row gap-2 justify-center items-center bg-[#C5BCFF] text-black text-sm font-semibold px-3 py-1 rounded';
//로딩 
export const sipnning = "border-t-transparent rounded-full animate-spin";
//게시글 등록 완료 div
export const postCompleteDiv = 'text-black text-sm font-semibold bg-lime-400 px-3 py-1 rounded';
//답변 채택 버튼 
export const answerChooseButton = "text-sm bg-gray-800 text-white px-3 py-1 rounded";

//모달창 
// - 최상단 div
export const upDiv = "fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[99999]";
// - 하위 div
export const settingDiv = "md:h-2/3 max-md:h-full bg-white text-black md:rounded w-full max-w-md";
export const downDiv = "bg-white text-black rounded p-6 w-full md:w-[600px] max-md:max-w-md max-md:mx-3";
// - 확인 버튼
export const okButton = "bg-indigo-600 text-white px-4 py-2 rounded";
// - 취소 버튼 
export const cancelButton = "bg-gray-300 px-4 py-2 rounded";