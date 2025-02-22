package com.example.asm_be.repositories;

import com.example.asm_be.entities.Address;
import com.example.asm_be.entities.Bill;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;
@Repository
public interface BillRepository extends JpaRepository<Bill, Integer> {
    List<Bill> findByUsersId(int id);
}
