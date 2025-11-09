package com.billingsoftware.service;

import java.util.List;

import com.billingsoftware.io.UserRequest;
import com.billingsoftware.io.UserResponse;

public interface UserService {

    UserResponse createUser(UserRequest request);

    String getUserRole(String email);

    List<UserResponse> readUsers();

    void deleteUser(String id);

    
}
