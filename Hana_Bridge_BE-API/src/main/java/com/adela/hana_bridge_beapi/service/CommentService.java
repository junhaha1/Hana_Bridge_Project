package com.adela.hana_bridge_beapi.service;

import com.adela.hana_bridge_beapi.dto.comment.CommentAddRequest;
import com.adela.hana_bridge_beapi.dto.comment.CommentUpdateRequest;
import com.adela.hana_bridge_beapi.entity.Comment;
import com.adela.hana_bridge_beapi.errorhandler.error.BoardNotFoundException;
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
    @Transactional
    public Comment save(CommentAddRequest request) {
        return commentRepository.save(request.toEntity());
    }

    //댓글 삭제
    @Transactional
    public void delete(String email, long commentId){
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new IllegalArgumentException("not found commentId: " + commentId));
        if (!comment.getUsers().getEmail().equals(email)) {
            throw new IllegalArgumentException("Board doesn't belong to email : " + email + ", " + commentId);
        }
        commentRepository.deleteById(commentId);
    }

    //댓글 전체 조회
    public List<Comment> findComment(long boardId) {
        if(!boardRepository.existsById(boardId)){
            throw new BoardNotFoundException(boardId);
        }
        return commentRepository.findByBoard_BoardId(boardId);
    }

    //댓글 갯수 조회
    public Long countComment(long boardId) {
        if(!boardRepository.existsById(boardId)){
            throw new BoardNotFoundException(boardId);
        }
        return commentRepository.countByBoard_BoardId(boardId);
    }

    //댓글 수정
    @Transactional
    public Comment update(String email, long commentId, CommentUpdateRequest request){
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new IllegalArgumentException("not found commentId: " + commentId));

        if (!comment.getUsers().getEmail().equals(email)) {
            throw new IllegalArgumentException("Board doesn't belong to email : " + email + ", " + commentId);
        }

        comment.update(request.getContent(), request.getCreateAt());
        return comment;
    }
}
