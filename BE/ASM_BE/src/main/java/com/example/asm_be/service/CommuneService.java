package com.example.asm_be.service;

import com.example.asm_be.entities.Commune;

import java.util.List;
import java.util.UUID;

public interface CommuneService {

    public List<Commune> getAll();

    public Commune getOne(UUID id);

    public Commune save(Commune commune);

    public Commune update(Commune commune);

    public void delete(Commune commune);

}
