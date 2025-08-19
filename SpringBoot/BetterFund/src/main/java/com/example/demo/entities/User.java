package com.example.demo.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name="user")
public class User {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="user_id")
    private Integer id;

    @Column(nullable = false, name="uname")
    private String username;
    
    @Column(nullable = false, unique = true)
    private String email;
    
    @Column(nullable = false, name="password")
    private String password;
    
    @Column(name="adhar_no", nullable = false, unique = true, length = 12)
    private String adharNo;
    
    @Column(name="phone_no", nullable = false, unique = true, length = 10)
    private String phoneNo;

    @ManyToOne
    @JoinColumn(name = "role_id", nullable = false)
    private Role role;

    public User() {
        super();
    }

    public Integer getId() { 
        return id; 
    }
    public void setId(Integer id) {
         this.id = id; 
    }
    
    public String getUsername() {
        return username; 
    }
    public void setUsername(String username) {
        this.username = username; 
    }
    
    public String getEmail() {
        return email; 
    }
    public void setEmail(String email) {
        this.email = email; 
    }
    
    public String getPassword() {
        return password; 
    }
    public void setPassword(String password) { 
        this.password = password; 
    }
    
    public String getAdharNo() { 
        return adharNo; 
    }
    public void setAdharNo(String adharNo) { 
        this.adharNo = adharNo; 
    }
    
    public String getPhoneNo() { 
        return phoneNo; 
    }
    public void setPhoneNo(String phoneNo) { 
        this.phoneNo = phoneNo; 
    }
    
    public Role getRole() { 
        return role; 
    }
    public void setRole(Role role) { 
        this.role = role; 
    }
}