package com.datn.backend.service;

import com.datn.backend.dto.request.DotGiamGiaRequest;
import com.datn.backend.dto.response.DotGiamGiaResponse;
import com.datn.backend.dto.response.PagedResponse;
import com.datn.backend.dto.response.SanPhamChiTietResponse;
import com.datn.backend.model.dot_giam_gia.DotGiamGia;

import java.util.List;

public interface DotGiamGiaService {

    List<Integer> getListIdSanPham(String ids);

    List<Integer> getListIdSanPhamChiTietByIdSanPham(Integer id);

    List<Integer> getListSanPhamChiTietByIdDotGiamGiaSanPham(Integer id);

    PagedResponse<SanPhamChiTietResponse> getAllSanPhamChiTiet(int pageNumber, int pageSize, List<Integer> listSanPhamId);

    PagedResponse<SanPhamChiTietResponse> getAllSanPhamChiTietForUpdate(int pageNumber, int pageSize, List<Integer> listSanPhamId, int idDotGiamGia);

    PagedResponse<DotGiamGiaResponse> getPagination(int pageNumber, int pageSize, String search);

    PagedResponse<DotGiamGiaResponse> getFilter(int pageNumber, int pageSize, String search
            , int status, String startDate, String endDate);

    DotGiamGiaResponse getOne(Integer id);

    DotGiamGia add(DotGiamGiaRequest object);

    DotGiamGia update(Integer id, DotGiamGiaRequest object);

    boolean remove(Integer id);
}
