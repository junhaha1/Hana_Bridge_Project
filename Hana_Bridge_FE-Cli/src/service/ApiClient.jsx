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
  //Open AI
  static AIChat = "/chat"


  //사용자 본인 게시글 조회 (CodeBoard, NoticeBoard)
  static getMyBoard(email){
    return fetch(ApiClient.SERVER_URL + ApiClient.BOARD + `/user/${email}`);
  }
  //사용자 본인 code게시글 좋아요순으로 조회
  static getSortMyBoards(email){
    return fetch(ApiClient.SERVER_URL + ApiClient.BOARD + `/sort/good/code/user/${email}`);
  }

  //좋아요 갯수 상위 5개 게시글 조회 (CodeBoard, NoticeBoard)
  static getBestBoard(){
    console.log("get Best Board");
    return fetch(ApiClient.SERVER_URL + ApiClient.BOARD + '/top',{
      method: "GET", 
      headers: {
        "Content-Type": "application/json",
      }
    })
  }

  //사용자 본인 게시글 조회 (AssembleBoard)
  static getMyAssemble(email){
    return fetch(ApiClient.SERVER_URL + ApiClient.ASSEMBLE_BOARD + `/user/${email}`);
  }

  //사용자 본인 assemble 게시글 좋아요순으로 조회
  static getSortMyAssembleBoards(email){
    return fetch(ApiClient.SERVER_URL + ApiClient.ASSEMBLE_BOARD + `/sort/good/user/${email}`);
  }

  //가장 최근 작성한 게시글 5개 조회 (AssembleBoard)
  static getRecentAssemble(accessToken){
    console.log("get My Recent Assemble Board");
    return fetch(ApiClient.SERVER_URL + ApiClient.ASSEMBLE_BOARD + '/me/recent',{
      method: "GET", 
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${accessToken}`,
      }
    })
  }
  //좋아요 갯수 상위 5개 게시글 조회 (AssembleBoard)
  static getBestAssemble(){
    console.log("get Best Board");
    return fetch(ApiClient.SERVER_URL + ApiClient.ASSEMBLE_BOARD + '/top',{
      method: "GET", 
      headers: {
        "Content-Type": "application/json",
      }
    })
  }

  //OpenAi chat
  //스트림 기반 답변 요청
  static streamMessage(accessToken, promptLevel, preContent, question){
    return fetch(ApiClient.SERVER_URL + ApiClient.AIChat + '/answer/stream',{
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "text/event-stream",
        "Authorization": `Bearer ${accessToken}`,
      },
        body: JSON.stringify({
        promptLevel: promptLevel,
        preContent: preContent,
        question: question,
      }),
    });
  }


  static sendMessage(accessToken, promptLevel, preContent, question){
    console.log("send Message to AI: " + question);
    return fetch(ApiClient.SERVER_URL + ApiClient.AIChat + '/answer',{
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${accessToken}`
      },
      body: JSON.stringify({
        promptLevel: promptLevel,
        preContent: preContent,
        question: question,
      }),
    });
  }

  //assemble게시글 등록(AI)
  static postAssemble(accessToken, promptLevel, messages, coreContent){
    console.log("make Assemble board");
    return fetch(ApiClient.SERVER_URL + ApiClient.AIChat + '/summary',{
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${accessToken}`
      },
      body: JSON.stringify({
        promptLevel: promptLevel,
        totalContent: messages,
        coreContent: coreContent,
      })
    })
  }
  
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

  //검색어를 통해 Board 조회
  static getSearchBoards(category, searchWord, sortType){
    return fetch(ApiClient.SERVER_URL + ApiClient.BOARD + `/category/${category}/search/${searchWord}/orderBy/${sortType}`);
  }

  //검색어를 통해 Board 조회
  static getSearchUserBoards(category, searchWord, sortType, email){
    console.log(`검색 : ${category}, ${searchWord}, ${sortType}, ${email}`);
    return fetch(ApiClient.SERVER_URL + ApiClient.BOARD + `/category/${category}/search/${searchWord}/orderBy/${sortType}/user/${email}`);
  }

  //좋아요순으로 정렬하여 전체 조회
  static getSortBoards(category){
    return fetch(ApiClient.SERVER_URL + ApiClient.BOARD + `/sort/good/${category}`);
  }

  //Board 상세 조회
  static getBoard(boardId, accessToken){
    console.log("Get Article By boardId: " + boardId);
    console.log(ApiClient.SERVER_URL + ApiClient.BOARD + '/' + boardId);
    return fetch(ApiClient.SERVER_URL + ApiClient.BOARD + '/' + boardId, {
      method: "GET", 
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${accessToken}`
      }
    });
  }
  //Board 수정
  static updateBoard(boardId, accessToken, category, title, content, code, updateAt){
    console.log("Update Boards By boardId: " + boardId);
    console.log(updateAt);
    return fetch(ApiClient.SERVER_URL + ApiClient.BOARD + '/article/' + boardId, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${accessToken}`
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
  static deleteBoard(boardId, accessToken, category){
    console.log("Delete Board By boardId ");
    return fetch(ApiClient.SERVER_URL + ApiClient.BOARD + '/article/' + boardId + '/' + category, {
      method: "DELETE", 
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${accessToken}`
      },
    });
  }
      
  //Assemble 전체 조회
  static getAssembleBoards(){
    console.log("Get AssembleBoard");
    return fetch(ApiClient.SERVER_URL + ApiClient.ASSEMBLE_BOARD);
  }
  static getSortAssembleBoards(){
    return fetch(ApiClient.SERVER_URL + ApiClient.ASSEMBLE_BOARD + `/sort/good`);
  }

  //Assemble 상세 조회
  static getAssembleBoard(assembleBoardId, accessToken){
    console.log("Get AssembleBoard By assembleBoardId: " + assembleBoardId);
    return fetch(ApiClient.SERVER_URL + ApiClient.ASSEMBLE_BOARD + '/' + assembleBoardId, {
      method: "GET", 
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${accessToken}`
      }
    });
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
    console.log("login by Email: " + email);
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
  static sendUser(email, password, name, nickName, createAt){
    console.log("signup: " + email + password + name + nickName + createAt);
    return fetch(ApiClient.SERVER_URL + ApiClient.USER , {
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
  static getUser(accessToken){
    console.log("get user");
    return fetch(ApiClient.SERVER_URL + ApiClient.USER + '/me', {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${accessToken}`
      }
    });
  }
  //사용자 정보 수정
  static updateUser(accessToken, email, name, nickName){
    return fetch(ApiClient.SERVER_URL + ApiClient.USER + '/me' , {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${accessToken}`
      },
      body: JSON.stringify({
        email: email,
        name: name,
        nickName: nickName,
      }),
    });
  }
  //비밀번호 변경
  static changePassword(accessToken, oldPassword, newPassword){
    return fetch(ApiClient.SERVER_URL + ApiClient.USER + '/me/password' , {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${accessToken}`
      },
      body: JSON.stringify({
        oldPassword: oldPassword,
        newPassword: newPassword,
      }),
    });
  }

  //사용자 삭제(탈퇴)
  static deleteUser(accessToken){
    return fetch(ApiClient.SERVER_URL + ApiClient.USER + '/me', {
      method: "DELETE", 
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${accessToken}`
      }
    });
  }

  
  //comment 조회 /board/comment/{board_id}
  static getComments(boardId){
    console.log("Get Comments By boardId: " + boardId);
    return fetch(ApiClient.SERVER_URL + ApiClient.BOARD_COMMENT + '/' + boardId);
  }
  //comment 등록 /board/comment/{board_id}
  static sendComment(boardId, accessToken, content, createAt){
    console.log("POST Comment By boardId: " + boardId);
    return fetch(ApiClient.SERVER_URL + ApiClient.BOARD_COMMENT + '/' + boardId, {
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
    console.log(content);
    return fetch(ApiClient.SERVER_URL + ApiClient.BOARD_COMMENT + '/' + commentId, {
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
    return fetch(ApiClient.SERVER_URL + ApiClient.BOARD + ApiClient.GOOD + '/' + boardId, {
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
    return fetch(ApiClient.SERVER_URL + ApiClient.BOARD + ApiClient.GOOD , {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${accessToken}`
        
      },
      body: JSON.stringify({        
        boardId: boardId,
      }),
    });
  }   
  //Good 조회 /board/good/{board_id}
  static getBoardGood(boardId){
    console.log("Get BoardGood By boardId: " + boardId);
    return fetch(ApiClient.SERVER_URL + ApiClient.BOARD + ApiClient.GOOD + '/' + boardId);
  }


  //Assemble Good
  //Good 삭제 /assemble/good/{assembleboard_id}
  static deleteAssembleGood(boardId, accessToken){
    console.log("Delete Assemble BoardGood By boardId: " + boardId);
    return fetch(ApiClient.SERVER_URL + ApiClient.ASSEMBLE_BOARD + ApiClient.GOOD + '/' + boardId, {
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
    return fetch(ApiClient.SERVER_URL + ApiClient.ASSEMBLE_BOARD + ApiClient.GOOD, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${accessToken}`
        
      },
      body: JSON.stringify({   
      assembleBoardId: boardId,     
      }),
    });
  }   
  //Good 조회 /assemble/good/{assembleboard_id}
  static getAssembleGood(boardId){
    console.log("Get Assembel BoardGood By boardId: " + boardId);
    return fetch(ApiClient.SERVER_URL + ApiClient.ASSEMBLE_BOARD + ApiClient.GOOD + '/' + boardId);
  }
}
export default ApiClient;