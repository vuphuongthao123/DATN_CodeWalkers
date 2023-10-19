package com.example.asm_be.service.impl;

import com.example.asm_be.entities.Users;
import com.example.asm_be.repositories.UserRepository;
import com.example.asm_be.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Component;

@Component
public class UserImpl implements UserService {
    @Autowired
    private UserRepository userRepository;


    @Override
    public Page<Users> getAll(Integer pageNo,Integer sizePage) {
        Pageable pageable = PageRequest.of(pageNo,sizePage);
        return userRepository.findAll(pageable);
    }

    public Users getOne(Integer id) {
        return null;
    }

    public boolean save(Users users) {
        try {
            this.userRepository.save(users);
            return true;
        } catch (Exception var3) {
            var3.getMessage();
            return false;
        }
    }

    public boolean update( Users users) {
        try {
            this.userRepository.save(users);
            return true;
        } catch (Exception var4) {
            var4.getMessage();
            return false;
        }
    }

    public boolean delete(Integer idUsers) {
        try {
            this.userRepository.deleteById(idUsers);
            return true;
        } catch (Exception var3) {
            var3.getMessage();
            return false;
        }

    }
}