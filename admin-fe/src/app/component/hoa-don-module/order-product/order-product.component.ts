import { error } from "highcharts";
import { Component, EventEmitter, Input, Output } from "@angular/core";

import { ToastrService } from "ngx-toastr";
import { HoaDonChiTiet } from "src/app/model/class/hoa-don-chi-tiet.class";
import { PhieuGiamGia } from "src/app/model/class/phieu-giam-gia.class";
import { HoaDonChiTietService } from "src/app/service/hoa-don-chi-tiet.service";
import { NotificationService } from "src/app/service/notification.service";

@Component({
  selector: "app-order-product",
  templateUrl: "./order-product.component.html",
  styleUrls: ["./order-product.component.css"],
})
export class OrderProductComponent {
  @Input({ required: true }) idHoaDon: number;
  @Input({ required: true }) loaiHoaDon: string;
  @Input({ required: true }) hoaDonChiTiets: HoaDonChiTiet[];
  @Input({ required: true }) tongTien: number;
  @Input({ required: true }) tienGiam: number;
  @Input({ required: true }) phiVanChuyen: number;
  @Input({ required: true }) phieuGiamGia: PhieuGiamGia;

  @Output() tongTienChange = new EventEmitter<number>();
  @Output() tienGiamChange = new EventEmitter<number>();
  @Output() phiVanChuyenChange = new EventEmitter<number>();

  constructor(
    private hdctService: HoaDonChiTietService,
    private toastr: ToastrService,
    private notification: NotificationService
  ) {}

  onPhiVanChuyenChange() {
    this.phiVanChuyenChange.emit(this.phiVanChuyen);
  }
  plus(hdct: any) {
    let soLuong = hdct.soLuong + 1;
    this.quantityChange(hdct, soLuong);
  }

  minus(hdct: any) {
    if (hdct.soLuong > 1) {
      let soLuong = hdct.soLuong - 1;
      this.quantityChange(hdct, soLuong);
    }
  }

  quantityChange(hdct: any, soLuong: number) {
    hdct.soLuong = soLuong;
    this.hdctService.updateHDCT(hdct).subscribe({
      next: (resp) => {
        hdct = resp;
        this.tongTien = this.hdctService.tinhTongTien(this.hoaDonChiTiets);
        this.tongTienChange.emit(this.tongTien);
        this.notification.success("Cập nhật thành công");
      },
      error: (err) => {
        console.log(err);
        this.notification.error(err.error.message);
        // hdct.soLuong = hdct.soLuong - 1;
        hdct.soLuong = soLuong;
      },
    });
  }

  inputSoLuong(hdct: HoaDonChiTiet, $event: any) {
    let soLuong = $event.target.value;
    this.quantityChange(hdct, soLuong);
  }
  delete(id: number) {
    this.hdctService.deleteHDCT(id).subscribe({
      next: (resp) => {
        // loại bỏ hdct đã xóa
        this.hoaDonChiTiets = this.hoaDonChiTiets.filter(
          (hdct) => hdct.id !== resp.id
        );
        // tính lại tổng tiền
        this.tongTien = this.hdctService.tinhTongTien(this.hoaDonChiTiets);
        this.tongTienChange.emit(this.tongTien);
        this.toastr.success("Xóa thành công", "Thành công");
      },
      error: (err) => {
        console.log(err);
        this.toastr.error(err.error.message, "Thất bại");
      },
    });
  }
}
