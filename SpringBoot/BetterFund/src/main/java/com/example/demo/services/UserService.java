package com.example.demo.services;

import com.example.demo.entities.Role;
import com.example.demo.entities.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import com.example.demo.repositories.RoleRepository;
import com.example.demo.repositories.UserRepository;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    @Autowired private UserRepository userRepository;
    @Autowired private RoleRepository roleRepository;
    @Autowired private PasswordEncoder encoder;

    public boolean register(String name, String email, String rawPassword, String adharNo, String phoneNo) {
        // Check if user already exists
        if (userRepository.findByEmail(email).isPresent()) return false;
        if (userRepository.findByAdharNo(adharNo).isPresent()) return false;
        if (userRepository.findByPhoneNo(phoneNo).isPresent()) return false;

        User user = new User();
        user.setUsername(name);
        user.setEmail(email);
        user.setPassword(encoder.encode(rawPassword));
        user.setAdharNo(adharNo);
        user.setPhoneNo(phoneNo);

        // default new users to "Donor" role (role_id = 3)
        Role userRole = roleRepository.findById(3).orElseThrow(() -> 
            new RuntimeException("Default user role not found"));
        user.setRole(userRole);

        userRepository.save(user);
        return true;
    }

//    public boolean register(String name, String email, String rawPassword) {
//        String dummyAdhar = generateDummyAdhar();
//        String dummyPhone = generateDummyPhone();
//        return register(name, email, rawPassword, dummyAdhar, dummyPhone);
//    }

    public boolean login(String email, String rawPassword) {
        return userRepository.findByEmail(email)
            .map(u -> encoder.matches(rawPassword, u.getPassword()))
            .orElse(false);
    }
    
    public User loginAndGetUser(String email, String password) {
        return userRepository.findByEmail(email)
                .filter(u -> encoder.matches(password, u.getPassword()))
                .orElse(null);
    }
    
    public User registerAndGetUser(String username, String email, String password, String adharNo, String phoneNo) {
    	if (userRepository.existsByEmail(email) || userRepository.existsByAdharNo(adharNo) || userRepository.existsByPhoneNo(phoneNo)) {
    		return null;
    	}

    	User u = new User();
    	u.setUsername(username);
    	u.setEmail(email);
    	u.setPassword(encoder.encode(password));
    	u.setAdharNo(adharNo);
    	u.setPhoneNo(phoneNo);

    	Role userRole = roleRepository.findByName("Donor").orElseThrow(() -> new RuntimeException("Default role Donor not found"));
    	u.setRole(userRole);

    	return userRepository.save(u);
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public boolean changeRole(String targetEmail, Integer newRoleId) {
        User user = userRepository.findByEmail(targetEmail).orElse(null);
        if (user == null) return false;

        Role newRole = roleRepository.findById(newRoleId).orElse(null);
        if (newRole == null) return false;

        user.setRole(newRole);
        userRepository.save(user);
        return true;
    }

//    private String generateDummyAdhar() {
//        return String.valueOf(System.currentTimeMillis()).substring(0, 12);
//    }
//
//    private String generateDummyPhone() {
//        return String.valueOf(System.currentTimeMillis() % 10000000000L);
//    }
}