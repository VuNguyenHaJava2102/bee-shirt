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
  @Output() phiVanChuyen = new EventEmitter<number>();
  @Output() diaChi = new EventEmitter<string>();
  public diaChiVaPhiVanChuyen = new DiaChiVaPhiVanChuyen();
  constructor() {}
  ngOnChanges(changes: SimpleChanges): void {
    if (changes["khachHang"]) {
    }
  }
  ngOnInit(): void {}
  updatePhiVanChuyen(soTien: number) {
    this.phiVanChuyen.emit(soTien);
    this.diaChi.emit(
      `${
        this.diaChiVaPhiVanChuyen.cuThe ? this.diaChiVaPhiVanChuyen.cuThe : ""
      },${this.diaChiVaPhiVanChuyen.xa},${this.diaChiVaPhiVanChuyen.huyen},${
        this.diaChiVaPhiVanChuyen.tinh
      }`
    );
  }
  changeDiaChi(diaChi: DiaChi) {
    this.diaChiVaPhiVanChuyen = new DiaChiVaPhiVanChuyen();
    this.diaChiVaPhiVanChuyen.tinh = diaChi.tinh;
    this.diaChiVaPhiVanChuyen.huyen = diaChi.huyen;
    this.diaChiVaPhiVanChuyen.xa = diaChi.xa;
  }
}
