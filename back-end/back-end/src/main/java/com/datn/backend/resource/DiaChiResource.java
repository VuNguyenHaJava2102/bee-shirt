package com.datn.backend.resource;

import com.datn.backend.dto.request.AddAddressReq;
import com.datn.backend.dto.request.DiaChiRequest;
import com.datn.backend.model.khach_hang.DiaChi;
import com.datn.backend.model.khach_hang.KhachHang;
import com.datn.backend.repository.DiaChiRepository;
import com.datn.backend.repository.KhachHangRepository;
import com.datn.backend.service.DiaChiService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/dia-chi")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:4200")
public class DiaChiResource {

    private final DiaChiService diaChiService;
    private final DiaChiRepository diaChiRepository;
    private final KhachHangRepository khachHangRepository;

    @GetMapping("/get-all/{custId}")
    public ResponseEntity<List<DiaChi>> getAllAddressOf1Customer(@PathVariable("custId") int custId) {
        return ResponseEntity.ok(diaChiService.getAllAddressOf1Customer(custId));
    }

    @PostMapping("/add/{id}")
    public ResponseEntity<DiaChiRequest> add(@PathVariable("id") int id,
                                             @RequestBody DiaChiRequest dc) {
        KhachHang kh = khachHangRepository.getById(id);
        DiaChi diaChi = new DiaChi();
        diaChi.setId(dc.getId());
        diaChi.setTinh(dc.getTinh());
        diaChi.setHuyen(dc.getHuyen());
        diaChi.setXa(dc.getXa());
        diaChi.setDuong(dc.getDuong());
        diaChi.setMacDinh(dc.isMacDinh());
        diaChi.setKhachHang(kh);

        DiaChi addDC = diaChiService.add(diaChi);
        DiaChiRequest dto = new DiaChiRequest();
        dto.setId(addDC.getId());
        dto.setTinh(addDC.getTinh());
        dto.setHuyen(addDC.getHuyen());
        dto.setXa(addDC.getXa());
        dto.setDuong(addDC.getDuong());
        dto.setMacDinh(addDC.isMacDinh());

        return ResponseEntity.ok(dto);
    }

    @GetMapping("/get-by-id/{id}")
    public ResponseEntity<DiaChi> getById(@PathVariable("id") int id) {
        return ResponseEntity.ok(diaChiService.getDCById(id));
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<DiaChiRequest> updateDC(@PathVariable("id") int id, @RequestBody DiaChiRequest dc) {
        KhachHang kh = diaChiRepository.findById(id).get().getKhachHang();
        DiaChi diaChi = new DiaChi();
        diaChi.setId(id);
        diaChi.setTinh(dc.getTinh());
        diaChi.setHuyen(dc.getHuyen());
        diaChi.setXa(dc.getXa());
        diaChi.setDuong(dc.getDuong());
        diaChi.setMacDinh(dc.isMacDinh());
        diaChi.setKhachHang(kh);
        DiaChi addDC = diaChiService.add(diaChi);
        DiaChiRequest dto = new DiaChiRequest();
        dto.setId(addDC.getId());
        dto.setTinh(addDC.getTinh());
        dto.setHuyen(addDC.getHuyen());
        dto.setXa(addDC.getXa());
        dto.setDuong(addDC.getDuong());
        dto.setMacDinh(addDC.isMacDinh());

        return ResponseEntity.ok(dto);
    }

    @DeleteMapping("/delete-dc/{id}")
    public ResponseEntity<DiaChi> deleteDC(@PathVariable("id") int id) {
        return ResponseEntity.ok(diaChiService.deleteDC(id));
    }

    // client resources
    @PostMapping("/set-default/{id}")
    public ResponseEntity<DiaChi> setDefaultAddress(@PathVariable int id) {
        return ResponseEntity.ok(diaChiService.setDefault(id));
    }

    @PostMapping("/client/add")
    public ResponseEntity<DiaChi> addAddress(@RequestBody AddAddressReq req) {
        return ResponseEntity.ok(diaChiService.addAddress(req));
    }
}
