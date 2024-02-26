package com.datn.backend.service;

import com.datn.backend.dto.request.AddSanPhamChiTietRequest;
import com.datn.backend.dto.response.PagedResponse;
import com.datn.backend.model.san_pham.SanPhamChiTiet;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

public interface SanPhamChiTietService {

    void addSpctList(AddSanPhamChiTietRequest request, MultipartFile[] multipartFiles) throws IOException;

    PagedResponse<SanPhamChiTiet> getByPage(int pageNumber, int pageSize, String search, int spId);
}