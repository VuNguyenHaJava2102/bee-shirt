package com.datn.backend.service;

import com.datn.backend.dto.request.KhachHangRequest;
import com.datn.backend.dto.response.KhachHangResponse;
import com.datn.backend.dto.response.NhanVienResponse;
import com.datn.backend.dto.response.PagedResponse;
import com.datn.backend.model.khach_hang.KhachHang;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

public interface KhachHangService {
    KhachHang add(KhachHangRequest kh, MultipartFile multipartFile) throws IOException;
    PagedResponse<KhachHangResponse> getAll(int pageNumber, int pageSize, String search);
    KhachHang update( KhachHangRequest kh, MultipartFile multipartFile) throws IOException;
    KhachHang delete(Integer id);
    KhachHangResponse getById(int id);
    PagedResponse<KhachHangResponse> filter(int pageNumber, int pageSize, List<Integer> gioiTinhFilter, List<Integer> trangThaiFilter);


}