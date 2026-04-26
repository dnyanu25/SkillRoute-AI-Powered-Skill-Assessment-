package com.skillroute.skillroute_backend.dto.response;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AuthRes {
    private Long id;
    private String name;
    private String email;
    private String message;
    private boolean success;
}