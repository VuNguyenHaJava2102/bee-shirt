import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from "@angular/core";
import { KhachHang } from "src/app/model/class/KhachHang.class";
import { DiaChiVaPhiVanChuyen } from "src/app/model/class/dia-chi-va-phi-van-chuyen.class";
import { DiaChi } from "src/app/model/class/dia-chi.class";

@Component({
  selector: "app-giao-hang",
  templateUrl: "./giao-hang.component.html",
  styleUrls: ["./giao-hang.component.css"],
})
export class GiaoHangComponent implements OnInit, OnChanges {
  @Input() khachHang: KhachHang; // từ khách hàng lấy ra được danh sách địa chỉ

  @Input({ required: true }) tenNguoiNhan: string;
  @Output() tenNguoiNhanChange = new EventEmitter<string>();

  @Input({ required: true }) sdtNguoiNhan: string;
  @Output() sdtNguoiNhanChange = new EventEmitter<string>();

  @Output() phiVanChuyen = new EventEmitter<number>();
  @Output() diaChi = new EventEmitter<string>();
  public diaChiVaPhiVanChuyen = new DiaChiVaPhiVanChuyen();
  // @Input({ required: true }) diaChiVaPhiVanChuyen: DiaChiVaPhiVanChuyen;
  // @Output() diaChiVaPhiVanChuyenChange =
  //   new EventEmitter<DiaChiVaPhiVanChuyen>();
  constructor() {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["khachHang"]) {
      this.diaChiVaPhiVanChuyen = new DiaChiVaPhiVanChuyen();
    }
  }

  ngOnInit(): void {}

  updatePhiVanChuyen(soTien: number) {
    this.phiVanChuyen.emit(soTien);
    this.diaChi.emit(
      `${
        this.diaChiVaPhiVanChuyen.cuThe == null || undefined
          ? ""
          : this.diaChiVaPhiVanChuyen.cuThe
      },${this.diaChiVaPhiVanChuyen.xa},${this.diaChiVaPhiVanChuyen.huyen},${
        this.diaChiVaPhiVanChuyen.tinh
      }`
    );
  }
  changeDiaChi(diaChi: DiaChi) {
    let newDCVPVC = new DiaChiVaPhiVanChuyen();
    newDCVPVC.tinh = diaChi.tinh.trim();
    newDCVPVC.huyen = diaChi.huyen.trim();
    newDCVPVC.xa = diaChi.xa.trim();
    newDCVPVC.cuThe = diaChi.duong.trim();

    this.diaChiVaPhiVanChuyen = newDCVPVC;

    // console.log(diaChi);
  }

  onTenNguoiNhanChange() {
    this.tenNguoiNhanChange.emit(this.tenNguoiNhan);
  }

  onSdtNguoiNhanChange() {
    this.sdtNguoiNhanChange.emit(this.sdtNguoiNhan);
  }
}
