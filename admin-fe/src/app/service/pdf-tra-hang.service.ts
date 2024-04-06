import { Injectable } from "@angular/core";
import { TDocumentDefinitions } from "pdfmake/interfaces";
import { HoaDonChiTiet } from "../model/class/hoa-don-chi-tiet.class";
import * as pdfMake from "pdfmake/build/pdfmake";
import { HoaDonTraHang } from "../model/class/hoa-don-tra-hang";
@Injectable({
  providedIn: "root",
})
export class PdfTraHangService {
  constructor() {}
  storeInfo = {
    name: "Bee-Shirt",
    sdt: "0123456789",
    email: "beeshirt@gmail.com",
    address:
      "Tòa nhà FPT Polytechnic, Phố Trịnh Văn Bô, Xuân Phương, Nam Từ Liêm, Hà Nội",
  };
  public generatePDFHoaDon(hoaDon: HoaDonTraHang) {
    let hdcts = hoaDon?.hoaDonChiTiets?.map((hdct, index) => {
      let hdctNew = [
        index + 1 + "",
        `${hdct.sanPhamChiTiet?.sanPham?.ten} \n ${hdct.sanPhamChiTiet?.kichCo?.ten} - ${hdct.sanPhamChiTiet?.mauSac?.ten}`,
        hdct.soLuong.toString(),
        this.convertToVND(hdct.giaBan),
        this.convertToVND(hdct.giaBan * hdct.soLuong),
      ];
      return hdctNew;
    });
    let dd: TDocumentDefinitions = {
      content: [
        {
          text: `${this.storeInfo.name}\n`,
          alignment: "center",
          fontSize: 35,
        },
        { text: `\n` },
        { text: `Số điện thoại: ${this.storeInfo.sdt}`, alignment: "center" },
        { text: `Email: ${this.storeInfo.email}`, alignment: "center" },
        { text: `Địa chỉ: ${this.storeInfo.address}`, alignment: "center" },
        { text: `\n`, alignment: "center" },
        { text: `HOÁ ĐƠN TRẢ HÀNG`, alignment: "center", fontSize: 28 },
        {
          columns: [
            {
              width: "50%",
              text: `Tên khách hàng:${
                hoaDon.hoaDon?.khachHang != null
                  ? hoaDon.hoaDon?.khachHang.hoTen
                  : ""
              } `,
            },
            {
              width: "50%",
              text: `Mã hóa đơn: ${hoaDon.ma}`,
            },
          ],
          // optional space between columns
          columnGap: 10,
        },
        {
          columns: [
            {
              width: "50%",
              text: `Địa chỉ nhận hàng:${
                hoaDon.diaChiNguoiNhan == null ? "" : hoaDon.diaChiNguoiNhan
              } `,
            },
            {
              width: "50%",
              text: `Ngày tạo: ${
                hoaDon.createdAt == null ? "" : hoaDon.createdAt
              }`,
            },
          ],
          // optional space between columns
          columnGap: 10,
        },
        {
          columns: [
            {
              width: "50%",
              text: `Số điện thoại: ${
                hoaDon.sdtNguoiNhan == null ? "" : hoaDon.sdtNguoiNhan
              } `,
            },
            {
              width: "50%",
              text: `Email: ${
                hoaDon.emailNguoiNhan == null ? "" : hoaDon.emailNguoiNhan
              }`,
            },
          ],
          // optional space between columns
          columnGap: 10,
        },
        { text: `Ghi chú: ${hoaDon.ghiChu == null ? "" : hoaDon.ghiChu}` },
        { text: `\n` },
        { text: `DANH SÁCH SẢN PHẨM TRẢ`, alignment: "center", fontSize: 22 },
        {
          layout: "lightHorizontalLines", // optional
          table: {
            // headers are automatically repeated if the table spans over multiple pages
            // you can declare how many rows should be treated as headers
            headerRows: 1,
            widths: ["5%", "50%", "5%", "20%", "20%"],

            // body: this.genTableContent(hoaDon.hoaDonChiTiets),
            body: [
              [
                "STT",
                "Tên sản phẩm                                    ",
                "SL",
                "Đơn giá",
                "Thành tiền",
              ],
              ...hdcts,
            ],
          },
        },
        { text: "\n" },
        {
          columns: [
            {
              width: "50%",
              text: ``,
            },
            [
              {
                columns: [
                  {
                    width: "50%",
                    text: `Tổng tiền hàng:`,
                  },
                  {
                    width: "50%",
                    text: `${this.convertToVND(hoaDon.tongTien)}`,
                  },
                ],
                // optional space between columns
                columnGap: 10,
              },
              {
                columns: [
                  {
                    width: "50%",
                    text: `Phải trả khách:`,
                  },
                  {
                    width: "50%",
                    text: `${this.convertToVND(hoaDon.tongTien)}`,
                  },
                ],
                // optional space between columns
                columnGap: 10,
              },
            ],
          ],
          // optional space between columns
          columnGap: 10,
        },
        {
          columns: [
            { qr: `${hoaDon.ma}`, alignment: "center" }, // QR code
            {
              text: "Chữ ký người nhận\n(Xác nhận hàng nguyên vẹn, không móp/méo)",
              alignment: "center",
            }, // Chữ ký
          ],
          margin: [0, 20, 0, 0],
        },
      ],
    };
    const pdfDoc = pdfMake.createPdf(dd);

    // Lấy Blob của PDF và mở tài liệu trong cùng một cửa sổ
    pdfDoc.getBlob((blob) => {
      const file = new Blob([blob], { type: "application/pdf" });
      const fileURL = URL.createObjectURL(file);
      window.open(fileURL, "_blank").print(); // Mở tài liệu trong cửa sổ hiện tại
    });
  }

  public convertToVND(number: number) {
    return number.toLocaleString("en-US", {
      style: "currency",
      currency: "VND",
    });
  }

  public genTableContent(hdcts: HoaDonChiTiet[]) {
    var body = [];
    var titles = [
      "STT",
      "Tên sản phẩm                                    ",
      "SL",
      "Đơn giá",
      "Thành tiền",
    ];
    body.push(titles);
    hdcts.forEach((hdct, index) => {
      body.push([
        ...(index + 1).toString(),
        `${hdct.sanPhamChiTiet.sanPham.ten} \n ${hdct.sanPhamChiTiet.kichCo.ten} - ${hdct.sanPhamChiTiet.mauSac.ten}`,
        hdct.soLuong.toString(),
        this.convertToVND(hdct.giaBan),
        this.convertToVND(hdct.giaBan * hdct.soLuong),
      ]);
    });
    // console.log(body);
    return body;
  }
}
