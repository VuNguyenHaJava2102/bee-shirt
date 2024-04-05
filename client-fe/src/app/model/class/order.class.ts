import { Customer } from "./customer.class";
import { Discount } from "./discount.class";
import { OrderDetails } from "./order-details.class";
import { OrderHistory } from "../interface/response/order-history-resp.interface";

export class Order {
  id: number;
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  lastUpdatedBy: string;
  ma: string;
  tenNguoiNhan: string;
  sdtNguoiNhan: string;
  emailNguoiNhan: string;
  diaChiNguoiNhan: string;
  tongTien: number;
  tienGiam: number;
  phiVanChuyen: number;
  loaiHoaDon: string;
  trangThai: string;
  ghiChu: string;
  khachHang: Customer;
  phieuGiamGia: Discount;
  hoaDonChiTiets: OrderDetails[];
  lichSuHoaDons: OrderHistory[];

  //   thanhToans: ThanhToan[];
  //   orderNameTemp: string; // để lưu STT hóa đơn chờ
}
