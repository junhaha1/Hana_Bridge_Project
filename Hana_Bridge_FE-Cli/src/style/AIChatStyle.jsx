//최상단 프레임
export const aiChatFrame = "w-full h-full flex flex-col bg-zinc-800 rounded-2xl overflow-y-hidden relative";
//상단 메뉴바 
export const topNavi = 'flex justify-between bg-white/15 backdrop-blur-sm';
//상단 대화창
export const chatBox = " h-full bg-white/10 backdrop-blur-sm p-4  shadow-md ";
//초보자 전문자 버튼
export const promptButton = "w-1/2 bg-white/10 p-2 backdrop-blur-sm border rounded border-white/20 shadow cursor-pointer hover:bg-white/30";
//AI 메시지 박스
export const aiBox = 'bg-white/20 text-white rounded-tl-2xl rounded-tr-2xl rounded-br-2xl';
//User 메시지 박스 
export const userBox = 'bg-[#322776] text-white rounded-tl-2xl rounded-tr-2xl rounded-bl-2xl';
//로딩창 
export const loding = "loader w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin";
//하단 입력창
export const inputBox = "w-full mx-auto bg-white/10 backdrop-blur-md rounded-bl-2xl p-4 mt-3";
//입력창 textarea
export const inputTextarea = "w-full resize-none bg-transparent text-white placeholder-gray-400 focus:outline-none border-r-2 border-white/20";
//입력창 보내기 버튼 
export const sendButton = "hover:opacity-80 hover:scale-105 transition duration-200 ease-in-out";

//게시글 등록 중 div
export const postingDiv = 'flex flex-row gap-2 justify-center items-center bg-[#C5BCFF] text-black text-sm font-semibold px-3 py-1 rounded-md';
//로딩 
export const sipnning = "border-t-transparent rounded-full animate-spin";
//게시글 등록 완료 div
export const postCompleteDiv = 'text-black text-sm font-semibold bg-lime-400 px-3 py-1 rounded-md';
//답변 채택 버튼 
export const answerChooseButton = "text-sm bg-gray-800 text-white px-3 py-1 rounded-md";

//모달창 
// - 최상단 div
export const upDiv = "fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50";
// - 하위 div
export const downDiv = "bg-white text-black rounded-md p-6 w-full max-w-md";
// - 확인 버튼
export const okButton = "bg-indigo-600 text-white px-4 py-1 rounded";
// - 취소 버튼 
export const cancelButton = "bg-gray-300 px-4 py-1 rounded";