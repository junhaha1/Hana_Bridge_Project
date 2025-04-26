class ApiClient{
  static SERVER_URL = "http://localhost:8080";

  //게시글
  static BOARD = "/board";
  static ASSEMBLE_BOARD = "/assemble";
  //좋아요
  static GOOD = "/good";
  //댓글
  static BOARD_COMMENT = "/board/comment";
  //사용자
  static USER = "/user";


  //Board 등록 
  static sendBoard(accessToken, title, category, content, code, createAt, updateAt){
    console.log("POST Board");
    return fetch(ApiClient.SERVER_URL + ApiClient.BOARD + '/article', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${accessToken}`
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
  static getBoards(category){
    console.log("Get Boards By category: " + category);
    return fetch(ApiClient.SERVER_URL + ApiClient.BOARD + '/category/' + category);
  }
  //Board 상세 조회
  static getBoard(boardId){
    console.log("Get Article By boardId: " + boardId);
    console.log(ApiClient.SERVER_URL + ApiClient.BOARD + '/' + boardId);
    return fetch(ApiClient.SERVER_URL + ApiClient.BOARD + '/' + boardId);
  }
  //Board 수정
  static updateBoard(boardId, accessToken, title, content, code, updateAt){
    console.log("Update Boards By boardId: " + boardId);
    return fetch(ApiClient.SERVER_URL + ApiClient.BOARD + '/article/' + boardId, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${accessToken}`
      },
      body: JSON.stringify({
        title: title,
        content: content,
        code: code,
        updateAt: updateAt
      }),
    }); 
  }
  //Board 삭제 
  static deleteBoard(boardId, accessToken){
    console.log("Delete Board By boardId ");
    return fetch(ApiClient.SERVER_URL + ApiClient.BOARD + '/article/' + boardId, {
      method: "DELETE", 
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${accessToken}`
      }
    });
  }
      
  //Assemble 전체 조회
  static getAssembleBoards(){
    console.log("Get AssembleBoard");
    return fetch(ApiClient.SERVER_URL + ApiClient.ASSEMBLE_BOARD);
  }
  //Assemble 상세 조회
  static getAssembleBoard(assembleBoardId){
    console.log("Get AssembleBoard By assembleBoardId: " + assembleBoardId);
    return fetch(ApiClient.SERVER_URL + ApiClient.ASSEMBLE_BOARD + '/' + assembleBoardId);
  }
  //Assemble 삭제 
  static deleteAssembleBoard(assembleBoardId, accessToken){
    console.log("Delete AssembleBoard By boardId ");
    return fetch(ApiClient.SERVER_URL + ApiClient.ASSEMBLE_BOARD + '/' + assembleBoardId, {
      method: "DELETE", 
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${accessToken}`
      }
    });
  }


  //사용자 로그인
  static userLogin(email, password){
    console.log("login by Email: " + email + ", Password: " + password);
    return fetch(ApiClient.SERVER_URL + ApiClient.USER + '/login', {
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
    return fetch(ApiClient.SERVER_URL + ApiClient.USER + '/logout' , {
      method: "DELETE", credentials: "include",
      headers: {
          "Content-Type": "application/json",
      }
    });
  }  
  //사용자 등록
  static sendUser(){
  }
  //사용자 조회 (로그인 & 회원 페이지)
  static getUser(){
  }
  //사용자 정보 수정
  static updateUser(){
  }
  //사용자 삭제(탈퇴)
  static deleteUser(){
  }

  
  //comment 조회 /board/comment/{board_id}
  static getComments(boardId){
    console.log("Get Comments By boardId: " + boardId);
    return fetch(ApiClient.SERVER_URL + ApiClient.BOARD_COMMENT + '/' + boardId);
  }
  //comment 등록 /board/comment/{board_id}
  static sendComment(boardId, accessToken, content, createAt){
    console.log("POST Comment By boardId: " + boardId);
    return fetch(ApiClient.SERVER_URL + ApiClient.BOABOARD_COMMENTRD + '/' + boardId, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${accessToken}`        
      },
      body: JSON.stringify({
        content: content,
        createAt: createAt,
      }),
    });
  }
  //comment 수정 /board/comment/{comment_id}
  static updateComment(commentId, accessToken, content, createAt){
    console.log("Update Comment By commentId: " + commentId);
    return fetch(ApiClient.SERVER_URL + ApiClient.BOABOARD_COMMENTRD + '/' + commentId, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${accessToken}`
      },
      body: JSON.stringify({
        content: content,
        createAt: createAt,
      }),
    });
  }
  //comment 삭제 /board/comment/{comment_id}
  static deleteComment(commentId, accessToken){
    console.log("Delete Comment By commentId: " + commentId);
    return fetch(ApiClient.SERVER_URL + ApiClient.BOARD_COMMENT + '/' + commentId, {
      method: "DELETE", 
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${accessToken}`
      }
    });
  }   


  //Board Good
  //Good 삭제 /board/good/{board_id}
  static deleteBoardGood(boardId, accessToken){
    console.log("Delete BoardGood By boardId: " + boardId);
    return fetch(ApiClient.SERVER_URL + ApiClient.BOARD + '/' + ApiClient.GOOD + '/' + boardId, {
      method: "DELETE", 
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${accessToken}`
      }
    });
  }   
  //Good 등록 /board/good/{board_id}
  static sendBoardGood(boardId, accessToken){
    console.log("POST BoardGood By boardId: " + boardId);
    return fetch(ApiClient.SERVER_URL + ApiClient.BOARD + '/' + ApiClient.GOOD + '/' + boardId, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${accessToken}`
        
      },
      body: JSON.stringify({        
      }),
    });
  }   
  //Good 조회 /board/good/{board_id}
  static getBoardGood(boardId){
    console.log("Get BoardGood By boardId: " + boardId);
    return fetch(ApiClient.SERVER_URL + ApiClient.BOARD + '/' +  ApiClient.GOOD + '/' + boardId);
  }


  //Assemble Good
  //Good 삭제 /assemble/good/{assembleboard_id}
  static deleteAssembleGood(boardId, accessToken){
    console.log("Delete Assemble BoardGood By boardId: " + boardId);
    return fetch(ApiClient.SERVER_URL + ApiClient.ASSEMBLE_BOARD + '/' + ApiClient.GOOD + '/' + boardId, {
      method: "DELETE", 
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${accessToken}`
      }
    });
  }   
  //Good 등록 /assemble/good/{assembleboard_id}
  static sendAssembleGood(boardId, accessToken){
    console.log("POST Assemble BoardGood By boardId: " + boardId);
    return fetch(ApiClient.SERVER_URL + ApiClient.ASSEMBLE_BOARD + '/' + ApiClient.GOOD + '/' + boardId, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${accessToken}`
        
      },
      body: JSON.stringify({        
      }),
    });
  }   
  //Good 조회 /assemble/good/{assembleboard_id}
  static getAssembleGood(boardId){
    console.log("Get Assembel BoardGood By boardId: " + boardId);
    return fetch(ApiClient.SERVER_URL + ApiClient.BOARD + '/' +  ApiClient.GOOD + '/' + boardId);
  }
}
export default ApiClient;