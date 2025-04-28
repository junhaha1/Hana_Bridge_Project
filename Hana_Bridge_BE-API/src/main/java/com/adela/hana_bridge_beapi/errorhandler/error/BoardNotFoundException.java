package com.adela.hana_bridge_beapi.errorhandler.error;

public class BoardNotFoundException extends IllegalArgumentException {
    public BoardNotFoundException(Long boardId) {
        super("Board not found with ID: " + boardId);
    }
}
