package com.datn.backend.service.impl;

import com.datn.backend.dto.request.AddSanPhamChiTietRequest;
import com.datn.backend.dto.request.CapNhatNhanhSpctReq;
import com.datn.backend.dto.request.CapNhatSpctRequest;
import com.datn.backend.dto.request.FilterSPCTParams;
import com.datn.backend.dto.response.PagedResponse;
import com.datn.backend.exception.custom_exception.ResourceExistsException;
import com.datn.backend.exception.custom_exception.ResourceNotFoundException;
import com.datn.backend.dto.response.DotGiamGiaSanPhamResponse;
import com.datn.backend.dto.response.SpctResponse;
import com.datn.backend.model.dot_giam_gia.DotGiamGiaSanPham;
import com.datn.backend.model.san_pham.ChatLieu;
import com.datn.backend.model.san_pham.CoAo;
import com.datn.backend.model.san_pham.HinhAnh;
import com.datn.backend.model.san_pham.KichCo;
import com.datn.backend.model.san_pham.KieuDang;
import com.datn.backend.model.san_pham.KieuThietKe;
import com.datn.backend.model.san_pham.MauSac;
import com.datn.backend.model.san_pham.SanPham;
import com.datn.backend.model.san_pham.SanPhamChiTiet;
import com.datn.backend.model.san_pham.TayAo;
import com.datn.backend.repository.ChatLieuRepository;
import com.datn.backend.repository.CoAoRepository;
import com.datn.backend.repository.DotGiamGiaSanPhamRepository;
import com.datn.backend.repository.HinhAnhRepository;
import com.datn.backend.repository.KichCoRepository;
import com.datn.backend.repository.KieuDangRepository;
import com.datn.backend.repository.KieuThietKeRepository;
import com.datn.backend.repository.MauSacRepository;
import com.datn.backend.repository.SanPhamChiTietRepository;
import com.datn.backend.repository.SanPhamRepository;
import com.datn.backend.repository.TayAoRepository;
import com.datn.backend.repository.custom_repository.CustomSpctRepository;
import com.datn.backend.service.SanPhamChiTietService;
import com.datn.backend.utility.CloudinaryService;
import com.datn.backend.utility.UtilityFunction;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class SanPhamChiTietServiceImpl implements SanPhamChiTietService {

    private final CustomSpctRepository customSpctRepo;
    private final SanPhamChiTietRepository spctRepo;
    private final SanPhamRepository sanPhamRepo;
    private final KieuDangRepository kieuDangRepo;
    private final KieuThietKeRepository kieuThietKeRepo;
    private final TayAoRepository tayAoRepo;
    private final CoAoRepository coAoRepo;
    private final ChatLieuRepository chatLieuRepo;
    private final KichCoRepository kichCoRepo;
    private final MauSacRepository mauSacRepo;
    private final HinhAnhRepository hinhAnhRepo;
    private final CloudinaryService cloudinaryService;
    private final ModelMapper modelMapper;
    private final DotGiamGiaSanPhamRepository dggspRepo;

    /**
     * Thêm List<SPCT> cùng lúc nhưng chúng cùng một màu sắc, kèm thêm một loạt ảnh kèm theo
     */
    @Transactional
    @Override
    public void addSpctList(AddSanPhamChiTietRequest request, MultipartFile[] multipartFiles) throws IOException {
        List<SanPhamChiTiet> spctList = new ArrayList<>();
        List<HinhAnh> hinhAnhs = new ArrayList<>();

        for (int i = 0; i < request.getRequests().getKichCoIdList().size(); ++i) {
            SanPhamChiTiet spct = new SanPhamChiTiet();
            spct = setCommonField(spct, request);
            spct.setGiaNhap(request.getRequests().getGiaNhapList().get(i));
            spct.setGiaBan(request.getRequests().getGiaBanList().get(i));
            spct.setSoLuongTon(request.getRequests().getSoLuongTonList().get(i));

            KichCo kichCo = kichCoRepo.findById(request.getRequests().getKichCoIdList().get(i)).get();
            MauSac mauSac = mauSacRepo.findById(request.getRequests().getMauSacId()).get();
            spct.setKichCo(kichCo);
            spct.setMauSac(mauSac);
            spct.setTrangThai(true);

            spctList.add(spct);
        }

        for (MultipartFile file : multipartFiles) {
            HinhAnh hinhAnh = saveHinhAnhImage(file);
            hinhAnhs.add(hinhAnh);
        }

        for (SanPhamChiTiet spct : spctList) {
            spct.setHinhAnhs(hinhAnhs);
        }

        hinhAnhRepo.saveAll(hinhAnhs);
        spctRepo.saveAll(spctList);
    }

    private HinhAnh saveHinhAnhImage(MultipartFile multipartFile) throws IOException {
        Map result = cloudinaryService.upload(multipartFile);
        return new HinhAnh(
                (String) result.get("original_filename"),
                (String) result.get("url"),
                (String) result.get("public_id"));
    }

    private SanPhamChiTiet setCommonField(SanPhamChiTiet spct, AddSanPhamChiTietRequest request) {
        SanPham sanPham = sanPhamRepo.findById(request.getSanPhamId()).get();
        KieuDang kieuDang = kieuDangRepo.findById(request.getKieuDangId()).get();
        KieuThietKe kieuThietKe = kieuThietKeRepo.findById(request.getThietKeId()).get();
        TayAo tayAo = tayAoRepo.findById(request.getTayAoId()).get();
        CoAo coAo = coAoRepo.findById(request.getCoAoId()).get();
        ChatLieu chatLieu = chatLieuRepo.findById(request.getChatLieuId()).get();

        spct.setSanPham(sanPham);
        spct.setKieuDang(kieuDang);
        spct.setThietKe(kieuThietKe);
        spct.setTayAo(tayAo);
        spct.setCoAo(coAo);
        spct.setChatLieu(chatLieu);

        return spct;
    }

    @Override
    public PagedResponse<SanPhamChiTiet> getByPage(int pageNumber, int pageSize, String search, int spId) {
        Pageable pageable = PageRequest.of(pageNumber - 1, pageSize);
        Page<SanPhamChiTiet> spctPage = spctRepo.getByPage(pageable, spId);

        PagedResponse<SanPhamChiTiet> paged = new PagedResponse<>();
        paged.setPageNumber(pageNumber);
        paged.setPageSize(pageSize);
        paged.setTotalElements((int) spctPage.getTotalElements());
        paged.setTotalPages(spctPage.getTotalPages());
        paged.setPageNumberArr(UtilityFunction.getPageNumberArr(spctPage.getTotalPages()));
        paged.setData(spctPage.getContent());
        paged.setSearch(search);

        return paged;
    }



    @Override
    public PagedResponse<SanPhamChiTiet> filterByPage(FilterSPCTParams params) {
        return customSpctRepo.filterByPage(params);
    }

    @Transactional
    @Override
    public void updateSpctNhanh(CapNhatNhanhSpctReq req) {
        for (int i = 0; i < req.getIds().size(); ++i) {
            int id = req.getIds().get(i);
            SanPhamChiTiet spct = spctRepo.findById(id)
                    .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy SPCT ID: " + id));

            spct.setGiaNhap(req.getGiaNhaps().get(i));
            spct.setGiaBan(req.getGiaBans().get(i));
            spct.setSoLuongTon(req.getSoLuongs().get(i));

            spctRepo.save(spct);
        }
    }

    @Override
    public PagedResponse<SpctResponse> getAll(int pageNumber, int pageSize, String search) {
        PageRequest pageRequest = PageRequest.of(pageNumber -1, pageSize);
//        Get list spct
        Page<SanPhamChiTiet> spcts = spctRepo.getAllBySearch(search, pageRequest);
//        find doi giam gia theo spct
        List<SpctResponse> data = mapToSpctResponse(spcts);

        return PagedResponse
                .<SpctResponse>builder()
                .pageNumber(spcts.getNumber())
                .pageSize(spcts.getSize())
                .totalPages(spcts.getTotalPages())
                .totalElements(spcts.getTotalElements())
                .pageNumberArr(UtilityFunction.getPageNumberArr(spcts.getTotalPages()))
                .search(search)
                .data(
                        data
                )
                .build();
    }

    private List<SpctResponse> mapToSpctResponse(Page<SanPhamChiTiet> spcts) {
        // Lấy danh sách spct tìm được
        List<SpctResponse> spctResponses = spcts.getContent().stream().map(spct -> {
            // map spct sang spctResponse
            SpctResponse spctResp = modelMapper.map(spct, SpctResponse.class);

            // lấy danh sách các đợt giảm giá đang hiệu lực voi spct nay
            DotGiamGiaSanPham dotGiamGiaSanPham =
                    dggspRepo.findDotGiamGiaSanPhamActiveBySanPhamChiTietId(spct.getId());

            //gán gia tri
            if (dotGiamGiaSanPham != null){
                spctResp.setDotGiamGiaSanPham(
                        modelMapper.map(dotGiamGiaSanPham,DotGiamGiaSanPhamResponse.class)
                );
            }

            return spctResp;
        }).toList();
        return spctResponses;
    }

    @Override
    public BigDecimal[] getMinAndMaxPrice(int productId) {
        BigDecimal[] result = new BigDecimal[2];
        result[0] = spctRepo.getMinPrice(productId);
        result[1] = spctRepo.getMaxPrice(productId);
        return result;
    }

    @Override
    public void changeStatus(int id) {
        SanPhamChiTiet spct = spctRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm được sản phẩm chi tiết ID: " + id));
        spct.setTrangThai(!spct.isTrangThai());
        spctRepo.save(spct);
    }

    @Override
    public SanPhamChiTiet getOneById(int spctId) {
        return spctRepo.findById(spctId)
                .orElseThrow(() -> new ResourceNotFoundException("Không thể tìm thất SPCT ID: " + spctId));
    }

    @Override
    @Transactional
    public SanPhamChiTiet update(CapNhatSpctRequest req) {
        SanPhamChiTiet spctByMauSacAndKichCo = spctRepo.findBySanPhamIdAndMauSacIdAndKichCoId(req.getSanPhamId(), req.getMauSacId(), req.getKichCoId());
        SanPhamChiTiet spctById = spctRepo.findById(req.getId()).
                orElseThrow(() -> new ResourceNotFoundException("SPCT ID: " + req.getId() + " không tồn tại!"));
        boolean isMauSacChange = req.getMauSacId() != spctById.getMauSac().getId();

        if (spctByMauSacAndKichCo != null && spctByMauSacAndKichCo.getId() != req.getId()) {
            throw new ResourceExistsException("Đã tồn tại sản phẩm có màu sắc và kích cỡ này!");
        } else {
            // nếu có thay đổi màu sắc
            if (isMauSacChange) {
                spctById = changeImagesWhenColorChange(req.getSanPhamId(), req.getMauSacId(), spctById);
            }

            int countBySanPham = spctRepo.countBySanPhamId(req.getSanPhamId());
            if (!spctRepo.existsByKieuDangIdAndSanPhamId(req.getKieuDangId(), req.getSanPhamId()) && countBySanPham > 1) {
                updateAllSpctOf1Sp(req, "kieuDang");
            } else if (!spctRepo.existsByThietKeIdAndSanPhamId(req.getThietKeId(), req.getSanPhamId()) && countBySanPham > 1) {
                updateAllSpctOf1Sp(req, "thietKe");
            } else if (!spctRepo.existsByTayAoIdAndSanPhamId(req.getTayAoId(), req.getSanPhamId()) && countBySanPham > 1) {
                updateAllSpctOf1Sp(req, "tayAo");
            } else if (!spctRepo.existsByCoAoIdAndSanPhamId(req.getCoAoId(), req.getSanPhamId()) && countBySanPham > 1) {
                updateAllSpctOf1Sp(req, "coAo");
            } else if (!spctRepo.existsByChatLieuIdAndSanPhamId(req.getChatLieuId(), req.getSanPhamId()) && countBySanPham > 1) {
                updateAllSpctOf1Sp(req, "chatLieu");
            }

            spctById.setSoLuongTon(req.getSoLuong());
            spctById.setGiaNhap(req.getGiaNhap());
            spctById.setGiaBan(req.getGiaBan());

            MauSac mauSac = mauSacRepo.findById(req.getMauSacId()).get();
            spctById.setMauSac(mauSac);

            KichCo kichCo = kichCoRepo.findById(req.getKichCoId()).get();
            spctById.setKichCo(kichCo);

            return spctRepo.save(spctById);
        }
    }

    private void updateAllSpctOf1Sp(CapNhatSpctRequest req, String field) {
        List<SanPhamChiTiet> spcts = spctRepo.findBySanPhamId(req.getSanPhamId());

        KieuDang kieuDang = kieuDangRepo.findById(req.getKieuDangId()).get();
        KieuThietKe thietKe = kieuThietKeRepo.findById(req.getThietKeId()).get();
        TayAo tayAo = tayAoRepo.findById(req.getTayAoId()).get();
        CoAo coAo = coAoRepo.findById(req.getCoAoId()).get();
        ChatLieu chatLieu = chatLieuRepo.findById(req.getChatLieuId()).get();

        for (SanPhamChiTiet spct : spcts) {
            if (field.equals("kieuDang")) {
                spct.setKieuDang(kieuDang);
            } else if (field.equals("thietKe")) {
                spct.setThietKe(thietKe);
            } else if (field.equals("tayAo")) {
                spct.setTayAo(tayAo);
            } else if (field.equals("coAo")) {
                spct.setCoAo(coAo);
            } else if (field.equals("chatLieu")) {
                spct.setChatLieu(chatLieu);
            }
            spctRepo.save(spct);
        }
    }

    private SanPhamChiTiet changeImagesWhenColorChange(int sanPhamId, int newMauSacId, SanPhamChiTiet updateSpct) {
        SanPhamChiTiet spct = spctRepo.findFirstBySanPhamIdAndMauSacId(sanPhamId, newMauSacId);


        if (spct != null) {
            updateSpct.setHinhAnhs(new ArrayList<>());
            for (HinhAnh img : spct.getHinhAnhs()) {
                updateSpct.setHinhAnh(img);
            }
            System.out.println("Bạn vừa thay đổi màu sắc. Ảnh của màu sắc mới đã tự động được thay đổi!");
        } else {
            System.out.println("Bạn vừa thay đổi màu sắc. Ảnh của màu sắc mới chưa tồn tại, hãy thay đổi ảnh phù hợp cho màu sắc mới!");
        }
        return updateSpct;

//        if (spcts.size() == 0) {
//            System.out.println("Bạn vừa thay đổi màu sắc. Ảnh của màu sắc mới chưa tồn tại, hãy thay đổi ảnh phù hợp cho màu sắc mới!");
//            return;
//        }
//
//        SanPhamChiTiet spct = spcts.get(0);
//        System.out.println("ms: " + newMauSacId);
//        System.out.println(sanPhamId);
//        System.out.println("ha size: " + spct.getHinhAnhs().size());
//
//        updateSpct.setHinhAnhs(new ArrayList<>());
//        for (HinhAnh newImg : spct.getHinhAnhs()) {
//            System.out.println(newImg.getImageId());
//            updateSpct.setHinhAnh(newImg);
//        }
//        updateSpct.setHinhAnhs(spct.getHinhAnhs());
//        spctRepo.save(updateSpct);
//        System.out.println("Bạn vừa thay đổi màu sắc. Ảnh của màu sắc mới đã tự động được thay đổi!");
    }
}
