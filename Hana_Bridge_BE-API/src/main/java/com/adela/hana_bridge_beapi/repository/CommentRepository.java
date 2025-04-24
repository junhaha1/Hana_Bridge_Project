package com.adela.hana_bridge_beapi.repository;

import com.adela.hana_bridge_beapi.entity.Comment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CommentRepository extends JpaRepository<Comment, Long> {
    List<Comment> findByBoard_BoardId(Long boardId);

}
