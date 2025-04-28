package com.adela.hana_bridge_beapi.errorhandler.error;

public class UserIdNotFoundException extends IllegalArgumentException{
    public UserIdNotFoundException(Long userId) {
        super("User not found with ID: " + userId);
    }
}
