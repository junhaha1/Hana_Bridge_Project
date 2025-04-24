package com.adela.hana_bridge_beapi.service;

import com.adela.hana_bridge_beapi.dto.comment.CommentAddRequest;
import com.adela.hana_bridge_beapi.dto.comment.CommentUpdateRequest;
import com.adela.hana_bridge_beapi.entity.Comment;
import com.adela.hana_bridge_beapi.repository.BoardRepository;
import com.adela.hana_bridge_beapi.repository.CommentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CommentService {
    public final CommentRepository commentRepository;
    private final BoardRepository boardRepository;

    //댓글 저장
    public Comment save(CommentAddRequest request) {
        return commentRepository.save(request.toEntity());
    }

    //댓글 삭제
    public void delete(long commentId){
        if(!commentRepository.existsById(commentId)){
            throw new IllegalArgumentException("Not Founded commentIdL " + commentId);
        }
        commentRepository.deleteById(commentId);
    }

    //댓글 전체 조회
    public List<Comment> findComment(long boardId) {
        if(!boardRepository.existsById(boardId)){
            throw new IllegalArgumentException("Not Founded boardId " + boardId);
        }
        return commentRepository.findByBoard_BoardId(boardId);
    }

    //댓글 수정
    @Transactional
    public Comment update(long commentId, CommentUpdateRequest request){
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new IllegalArgumentException("not found commentId: " + commentId));

        comment.update(request.getContent(), request.getCreateAt());

        return comment;
    }
}
