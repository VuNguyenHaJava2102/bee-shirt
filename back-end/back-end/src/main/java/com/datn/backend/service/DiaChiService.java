package com.datn.backend.service;

import com.datn.backend.model.khach_hang.DiaChi;

import java.util.List;

public interface DiaChiService {

    DiaChi add(DiaChi dc);

    DiaChi updateDC(DiaChi dc);

    List<DiaChi> getAllAddressOf1Customer(int id);

    DiaChi getDCById(int id);

    DiaChi deleteDC(int id);

    DiaChi setDefault(int id);
}
