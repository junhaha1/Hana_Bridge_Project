import CustomFetch from './CustomFetch';
import StreamFetch from './StreamFetch';

class ApiClient{
  static SERVER_URL = import.meta.env.VITE_API_URL;

  //게시글
  static BOARD = "/board";
  static ASSEMBLE_BOARD = "/assemble";
  //좋아요
  static GOOD = "/good";
  //댓글
  static BOARD_COMMENT = "/board/comment";
  //사용자
  static USER = "/user";
  //Open AI
  static AIChat = "/chat"

  //해당 이메일로 인증번호 받아오기
  static requestEmailCode(requestEmail){
    return fetch(ApiClient.SERVER_URL + "/auth/email/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: requestEmail 
      }),
    });
  }

  //인증번호 인증하기
  static verifyCode(requestEmail, inputCode) {
    return fetch(ApiClient.SERVER_URL + "/auth/email/verify", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: requestEmail,
        code: inputCode
      }),
    });
  }

  //현재 사용자의 질문, 요약 횟수 조회
  static getQuestionAndSummaryCount(){
    return CustomFetch(ApiClient.SERVER_URL + ApiClient.USER + `/question`);
  }
  
  //사용자가 작성한 프롬포트 조회해오기
  static getCustomPrompts(){ 
    return CustomFetch(ApiClient.SERVER_URL + ApiClient.AIChat + `/prompt`);
  }

  //사용자가 작성한 프롬포트 저장하기
  static saveCustomPrompts(prompt){
    return CustomFetch(ApiClient.SERVER_URL + ApiClient.AIChat + '/prompt/user', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: prompt.name,
        role: prompt.role,
        form: prompt.form,
        level: prompt.level,
        option: prompt.option,
      }),
    });
  }

  // 사용자 프롬포트 업데이트하기
  static updateCustomPrompts(prompt) {
    return CustomFetch(ApiClient.SERVER_URL + ApiClient.AIChat + '/prompt/user', {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        promptId: prompt.promptId,
        name: prompt.name,
        role: prompt.role,
        form: prompt.form,
        level: prompt.level,
        option: prompt.option,
      }),
    });
  }

  //사용자 프롬포트 삭제하기
  static deleteCustomPrompts(promptId){
    return CustomFetch(ApiClient.SERVER_URL + ApiClient.AIChat + `/prompt/${promptId}`,{
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  //사용자 본인 게시글 조회 (CodeBoard, NoticeBoard)
  static getMyBoard(page, sortType){
    return CustomFetch(ApiClient.SERVER_URL + ApiClient.BOARD + `/user/${page}/${sortType}`);
  }

  //사용자가 좋아요 누른 게시글 조회
  static getMyGoodBoard(page){
    return CustomFetch(ApiClient.SERVER_URL + ApiClient.BOARD + `/good/category/code/${page}/latest`);
  }

  //사용자 본인 게시글 조회 (AssembleBoard)
  static getMyAssemble(page, sortType, category){
      const url = `${ApiClient.SERVER_URL}${ApiClient.ASSEMBLE_BOARD}/user/${page}/${sortType}?category=${encodeURIComponent(category)}`;
    return CustomFetch(url);
  }

  //사용자 본인이 쓴 글 카테고리 가져오기 (AssembleBoard)
  static getMyAssembleCategory(){
    return CustomFetch(ApiClient.SERVER_URL + ApiClient.ASSEMBLE_BOARD + `/user/category`);
  }

  //사용자가 좋아요 누른 게시글 조회 (AssembleBoard)
  static getMyGoodAssemble(page, category){
    const url = `${ApiClient.SERVER_URL}${ApiClient.ASSEMBLE_BOARD}/good/${page}/latest?category=${encodeURIComponent(category)}`;
    return CustomFetch(url);
  }
  

  //OpenAi chat
  //스트림 기반 답변 요청
  static streamMessage(promptLevel, preContent, question, prompt){
    return StreamFetch(ApiClient.SERVER_URL + ApiClient.AIChat + '/answer/stream',{
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "text/event-stream",
      },
        body: JSON.stringify({
        promptLevel: promptLevel,
        preContent: preContent,
        question: question,

        role: prompt?.role,
        form: prompt?.form,
        level: prompt?.level,
        option: prompt?.option,
      }),
    });
  }

  //assemble게시글 내용 요약(AI)
  static postAssemble(promptLevel, messages){
    console.log("make Assemble board");
    return StreamFetch(ApiClient.SERVER_URL + ApiClient.AIChat + '/summary',{
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        promptLevel: promptLevel,
        coreContent: messages,
      })
    })
  }

  //assemble게시글 내용 저장(AI)
  static saveAssemble(title, category, content, createAt, categoryName){
    return CustomFetch(ApiClient.SERVER_URL + ApiClient.ASSEMBLE_BOARD + '/article', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: title,
        category: category,
        content: content,
        createAt: createAt,
        categoryName: categoryName,
      }),
    });
  }
  
  //Board 등록 
  static sendBoard(title, category, content, code, createAt, updateAt){
    console.log("POST Board");
    return CustomFetch(ApiClient.SERVER_URL + ApiClient.BOARD + '/article', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: title,
        category: category,
        content: content,
        code: code,
        createAt: createAt,
        updateAt: updateAt
      }),
    });
  }
  //Board 전체 조회
  static getBoards(category, page, sortType){
    console.log("Get Boards By category: " + category + page + sortType);
    return CustomFetch(ApiClient.SERVER_URL + ApiClient.BOARD + '/category/' + category + "/" + page + "/" + sortType);
  }

  //검색어를 통해 Board 조회
  static getSearchBoards(category, searchWord, sortType, page){
    return CustomFetch(ApiClient.SERVER_URL + ApiClient.BOARD + `/category/${category}/search/${searchWord}/orderBy/${sortType}/${page}`);
  }

  //검색어를 통해 Board 조회
  static getSearchUserBoards(category, searchWord, sortType, page){
    console.log(`검색 : ${category}, ${searchWord}, ${sortType}`);
    return CustomFetch(ApiClient.SERVER_URL + ApiClient.BOARD + `/category/${category}/search/${searchWord}/orderBy/${sortType}/user/${page}`);
  }

  //Board 상세 조회
  static getBoard(boardId){
    console.log("Get Article By boardId: " + boardId);
    console.log(ApiClient.SERVER_URL + ApiClient.BOARD + '/' + boardId);
    return CustomFetch(ApiClient.SERVER_URL + ApiClient.BOARD + '/' + boardId, {
      method: "GET", 
      headers: {
        "Content-Type": "application/json",
      }
    });
  }
  //Board 수정
  static updateBoard(boardId, category, title, content, code, updateAt){
    console.log("Update Boards By boardId: " + boardId);
    console.log(updateAt);
    return CustomFetch(ApiClient.SERVER_URL + ApiClient.BOARD + '/article/' + boardId, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: title,
        category: category,
        content: content,
        code: code,
        updateAt: updateAt
      }),
    }); 
  }
  //Board 삭제 
  static deleteBoard(boardId, category){
    console.log("Delete Board By boardId ");
    return CustomFetch(ApiClient.SERVER_URL + ApiClient.BOARD + '/article/' + boardId + '/' + category, {
      method: "DELETE", 
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
      
  //Assemble 전체 조회
  static getAssembleBoards(page, sortType, category){
    console.log("Get AssembleBoard" + page + "/" + sortType + '/' + category);
    const url = `${ApiClient.SERVER_URL}${ApiClient.ASSEMBLE_BOARD}/${page}/${sortType}?category=${encodeURIComponent(category)}`;
    return CustomFetch(url);
  }

  static getSearchAssembleBoards(word, sortType, page){
    return CustomFetch(ApiClient.SERVER_URL + ApiClient.ASSEMBLE_BOARD + `/search/${word}/orderBy/${sortType}/${page}`);
  }

  static getSearchUserAssembleBoards(toggle, word, sortType, page){
    return CustomFetch(ApiClient.SERVER_URL + ApiClient.ASSEMBLE_BOARD + `/search/${word}/orderBy/${sortType}/user/${page}`);
  }

  //Assemble 상세 조회
  static getAssembleBoard(assembleBoardId){
    console.log("Get AssembleBoard By assembleBoardId: " + assembleBoardId);
    return CustomFetch(ApiClient.SERVER_URL + ApiClient.ASSEMBLE_BOARD + '/' + assembleBoardId, {
      method: "GET", 
      headers: {
        "Content-Type": "application/json",
      }
    });
  }
  //Assemble 삭제 
  static deleteAssembleBoard(assembleBoardId){
    console.log("Delete AssembleBoard By boardId ");
    return CustomFetch(ApiClient.SERVER_URL + ApiClient.ASSEMBLE_BOARD + '/' + assembleBoardId, {
      method: "DELETE", 
      headers: {
        "Content-Type": "application/json",
      }
    });
  }


  //사용자 로그인
  static userLogin(email, password){
    return CustomFetch(ApiClient.SERVER_URL + ApiClient.USER + '/login', {
      method: "POST",credentials: "include", 
      headers: {
        "Content-Type": "application/json",        
      },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    });
  }
  //사용자 로그아웃
  static userLogout(){
    console.log("logout ");
    return CustomFetch(ApiClient.SERVER_URL + ApiClient.USER + '/logout' , {
      method: "DELETE", credentials: "include",
      headers: {
          "Content-Type": "application/json",
      }
    });
  }  
  //사용자 등록
  static sendUser(email, password, name, nickName, createAt){
    return CustomFetch(ApiClient.SERVER_URL + ApiClient.USER , {
      method: "POST",
      headers: {
        "Content-Type": "application/json",  
      },
      body: JSON.stringify({
        email: email,
        password: password,
        name: name,
        nickName: nickName,
        createAt: createAt
      }),
    });
  }
  //사용자 조회 (로그인 & 회원 페이지)
  static getUser(){
    console.log("get user");
    return CustomFetch(ApiClient.SERVER_URL + ApiClient.USER + '/me', {
      method: "GET",
      headers: {
      }
    });
  }
  //사용자 정보 수정
  static updateUser(email, name, nickName){
    return CustomFetch(ApiClient.SERVER_URL + ApiClient.USER + '/me' , {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        name: name,
        nickName: nickName,
      }),
    });
  }
  //비밀번호 변경
  static changePassword(oldPassword, newPassword){
    return CustomFetch(ApiClient.SERVER_URL + ApiClient.USER + '/me/password' , {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        oldPassword: oldPassword,
        newPassword: newPassword,
      }),
    });
  }

  //사용자 삭제(탈퇴)
  static deleteUser(){
    return CustomFetch(ApiClient.SERVER_URL + ApiClient.USER + '/me', {
      method: "DELETE", 
      headers: {
        "Content-Type": "application/json",
      }
    });
  }

  
  //comment 조회 /board/comment/{board_id}
  static getComments(boardId){
    console.log("Get Comments By boardId: " + boardId);
    return CustomFetch(ApiClient.SERVER_URL + ApiClient.BOARD_COMMENT + '/' + boardId);
  }
  //comment 등록 /board/comment/{board_id}
  static sendComment(boardId, content, createAt){
    console.log("POST Comment By boardId: " + boardId);
    return CustomFetch(ApiClient.SERVER_URL + ApiClient.BOARD_COMMENT + '/' + boardId, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",     
      },
      body: JSON.stringify({
        content: content,
        createAt: createAt,
      }),
    });
  }
  //comment 수정 /board/comment/{comment_id}
  static updateComment(commentId, content, createAt){
    console.log("Update Comment By commentId: " + commentId);
    console.log(content);
    return CustomFetch(ApiClient.SERVER_URL + ApiClient.BOARD_COMMENT + '/' + commentId, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        content: content,
        createAt: createAt,
      }),
    });
  }
  //comment 삭제 /board/comment/{comment_id}
  static deleteComment(commentId){
    console.log("Delete Comment By commentId: " + commentId);
    return CustomFetch(ApiClient.SERVER_URL + ApiClient.BOARD_COMMENT + '/' + commentId, {
      method: "DELETE", 
      headers: {
        "Content-Type": "application/json",
      }
    });
  }   


  //Board Good
  //Good 삭제 /board/good/{board_id}
  static deleteBoardGood(boardId){
    console.log("Delete BoardGood By boardId: " + boardId);
    return CustomFetch(ApiClient.SERVER_URL + ApiClient.BOARD + ApiClient.GOOD + '/' + boardId, {
      method: "DELETE", 
      headers: {
        "Content-Type": "application/json",
      }
    });
  }   
  //Good 등록 /board/good/{board_id}
  static sendBoardGood(boardId){
    console.log("POST BoardGood By boardId: " + boardId);
    return CustomFetch(ApiClient.SERVER_URL + ApiClient.BOARD + ApiClient.GOOD , {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        
      },
      body: JSON.stringify({        
        boardId: boardId,
      }),
    });
  }   
  //Good 조회 /board/good/{board_id}
  static getBoardGood(boardId){
    console.log("Get BoardGood By boardId: " + boardId);
    return CustomFetch(ApiClient.SERVER_URL + ApiClient.BOARD + ApiClient.GOOD + '/' + boardId);
  }


  //Assemble Good
  //Good 삭제 /assemble/good/{assembleboard_id}
  static deleteAssembleGood(boardId){
    console.log("Delete Assemble BoardGood By boardId: " + boardId);
    return CustomFetch(ApiClient.SERVER_URL + ApiClient.ASSEMBLE_BOARD + ApiClient.GOOD + '/' + boardId, {
      method: "DELETE", 
      headers: {
        "Content-Type": "application/json",
      }
    });
  }   
  //Good 등록 /assemble/good/{assembleboard_id}
  static sendAssembleGood(boardId){
    console.log("POST Assemble BoardGood By boardId: " + boardId);
    return CustomFetch(ApiClient.SERVER_URL + ApiClient.ASSEMBLE_BOARD + ApiClient.GOOD, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({   
      assembleBoardId: boardId,     
      }),
    });
  }   
  //Good 조회 /assemble/good/{assembleboard_id}
  static getAssembleGood(boardId){
    console.log("Get Assembel BoardGood By boardId: " + boardId);
    return CustomFetch(ApiClient.SERVER_URL + ApiClient.ASSEMBLE_BOARD + ApiClient.GOOD + '/' + boardId);
  }
}
export default ApiClient;
