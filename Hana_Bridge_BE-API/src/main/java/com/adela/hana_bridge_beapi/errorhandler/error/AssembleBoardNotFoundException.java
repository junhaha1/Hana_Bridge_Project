package com.adela.hana_bridge_beapi.errorhandler.error;

public class AssembleBoardNotFoundException extends IllegalArgumentException {
    public AssembleBoardNotFoundException(Long assembleBoardId) {
        super("AssembleBoard not found with ID: " + assembleBoardId);
    }
}
