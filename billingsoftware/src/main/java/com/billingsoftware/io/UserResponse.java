package com.billingsoftware.io;

import java.sql.Timestamp;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UserResponse {
    private String userId;
    private String name;
    private String email;
   
    private Timestamp createdAt;
    private Timestamp updatedAt;
    private String role;

}
