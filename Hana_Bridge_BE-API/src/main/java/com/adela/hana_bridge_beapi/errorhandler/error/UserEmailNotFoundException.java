package com.adela.hana_bridge_beapi.errorhandler.error;

public class UserEmailNotFoundException extends IllegalArgumentException {
    public UserEmailNotFoundException(String email) {
        super("User not found with Email: " + email);
    }
}
