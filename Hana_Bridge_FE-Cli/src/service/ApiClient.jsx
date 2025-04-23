class ApiClient{
  static SERVER_URL = "http://localhost:8080";

  //게시글
  static BOARD = "/board";
  static ASSEMBLE_BOARD = "/assemble";
  //댓글
  static BOARD_COMMENT = "/board/comment";
  //사용자
  static USER = "/user";


  //Board 등록 
  static sendBoard(userId, title, category, content, code, createAt, updateAt){
    console.log("POST Board");
    return fetch(ApiClient.SEVER_URL + ApiClient.BOARD + '/aricle', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: userId,
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
    return fetch(ApiClient.SEVER_URL + ApiClient.Board + '/category/' + category);
  }
  //Board 상세 조회
  static getBoard(boardId){
    console.log("Get Article By boardId: " + boardId);
    return fetch(ApiClient.SEVER_URL + ApiClient.Board + '/' + boardId);
  }
  //Board 수정
  static updateBoard(boardId, title, content, code, updateAt){
    console.log("Update Boards By boardId: " + boardId);
    return fetch(ApiClient.SEVER_URL + ApiClient.Board + '/article/' + boardId, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
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
  static deleteBoard(boardId){
    console.log("Delete Board By boardId ");
    return fetch(ApiClient.SEVER_URL + ApiClient.Board + '/article/' + boardId, {
      method: "DELETE", 
      headers: {
        "Content-Type": "application/json"
      }
    });
  }


    
  //Assemble 전체 조회
  static getAssembleBoards(){
    console.log("Get AssembleBoard");
    return fetch(ApiClient.SEVER_URL + ApiClient.ASSEMBLE_BOARD);
  }
  //Assemble 상세 조회
  static getAssembleBoard(assembleBoardId){
    console.log("Get AssembleBoard By assembleBoardId: " + assembleBoardId);
    return fetch(ApiClient.SEVER_URL + ApiClient.ASSEMBLE_BOARD + '/' + assembleBoardId);
  }
  //Assemble 삭제 
  static deleteAssembleBoard(assembleBoardId){
    console.log("Delete AssembleBoard By boardId ");
    return fetch(ApiClient.SEVER_URL + ApiClient.ASSEMBLE_BOARD + '/' + assembleBoardId, {
      method: "DELETE", 
      headers: {
        "Content-Type": "application/json"
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

  







  //댓글
  // static sendComment(articleId, userId, content, codeContent, regDate, updateDate){
  //     console.log("댓글 저장 API 호출 후 : " + articleId +", " + userId );
  //     return fetch(ApiClient.SEVER_URL + ApiClient.POST_COMMENT + articleId +"/" + userId, {
  //         method: "POST",
  //         headers: {
  //             "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify({
  //             articleId: articleId,
  //             userId: userId,
  //             comment: content,
  //             codeComment: codeContent,
  //             regDate: regDate,
  //             updateDate: updateDate,
  //         }),
  //     });
  // }

  // static getComment(articleId){
  //     console.log("Get Comment By articleId ");
  //     return fetch(ApiClient.SEVER_URL + ApiClient.GET_COMMENT + articleId);
  // }

  // static updateComment(commentId, content, codeContent){
  //     return fetch(ApiClient.SEVER_URL + ApiClient.PUT_COMMENT + commentId, {
  //         method: "PUT",
  //         headers: {
  //             "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify({
  //             comment: content,
  //             codeComment: codeContent
  //         }),
  //     });
  // }
  // static deleteComment(commentId){
  //     console.log("Delete Comment By commentId ");
  //     return fetch(ApiClient.SEVER_URL + ApiClient.DELETE_COMMENT + commentId, {
  //         method: "DELETE", 
  //         headers: {
  //             "Content-Type": "application/json"
  //         }
  //     });
  // }   
}
export default ApiClient;