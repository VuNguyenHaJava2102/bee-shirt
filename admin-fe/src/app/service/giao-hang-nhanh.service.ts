import { Observable } from "rxjs";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { DiaChiVaPhiVanChuyen } from "../model/class/dia-chi-va-phi-van-chuyen.class";

@Injectable({
  providedIn: "root",
})
export class GiaoHangNhanhService {
  constructor(private http: HttpClient) {}
  //token shop
  private client_token = "18076f8d-bcb9-11ee-b1d4-92b443b7a897";

  getTokenPhieuGiaoHang(order_code: string): Observable<any> {
    // set data here
    let rawData = {
      order_codes: [order_code],
    };

    // set url here
    let url =
      "https://dev-online-gateway.ghn.vn/shiip/public-api/v2/a5/gen-token";

    //set headers here
    const headers = new HttpHeaders().set("Token", this.client_token);
    return this.http.post(url, rawData, { headers });
  }
  getOrderInforByClientOrderCode(orderClientCode: string): Observable<any> {
    let rawData = {
      client_order_code: orderClientCode,
    };
    let url =
      "https://dev-online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/detail-by-client-code";
    //set headers here
    const headers = new HttpHeaders().set("Token", this.client_token);
    return this.http.post(url, rawData, { headers });
  }

  // get all tỉnh
  getAllProvince(): Observable<any> {
    let url =
      "https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/province";
    const headers = new HttpHeaders().set("Token", this.client_token);
    return this.http.get(url, { headers });
  }
  // get all huyện by tỉnh
  getAllDistrictByProvinceID(province_id: number): Observable<any> {
    let url =
      "https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/district";
    const headers = new HttpHeaders().set("Token", this.client_token);
    const rawData = { province_id: Number(province_id) };
    return this.http.post(url, rawData, { headers });
  }
  // get all xã by huyện
  getAllWardByDistrictID(DistrictID: number): Observable<any> {
    let url =
      "https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/ward?district_id";
    const headers = new HttpHeaders().set("Token", this.client_token);
    const rawData = { district_id: Number(DistrictID) };
    return this.http.post(url, rawData, { headers });
  }
  // get thời gian dự kiên
  getExpectedDeliveryTime(
    diaChiVaPhivanChuyen: DiaChiVaPhiVanChuyen
  ): Observable<any> {
    let url =
      "https://dev-online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/leadtime";
    const headers = new HttpHeaders()
      .set("Token", this.client_token)
      .set("ShopId", "190872");
    let rawData = {
      from_district_id: 3440,
      from_ward_code: "13010",
      to_ward_code: diaChiVaPhivanChuyen.xaCode,
      to_district_id: Number(diaChiVaPhivanChuyen.huyenId),
      service_id: 53320,
    };
    return this.http.post(url, rawData, { headers });
  }
  // get phí vận chuyển
  getFee(
    diaChiVaPhivanChuyen: DiaChiVaPhiVanChuyen,
    service_id: number
  ): Observable<any> {
    let shopId = 190872;
    let url =
      "https://dev-online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/fee";
    const headers = new HttpHeaders()
      .set("Token", this.client_token)
      .set("ShopId", shopId + "");

    let rawData = {
      to_district_id: Number(diaChiVaPhivanChuyen.huyenId),
      to_ward_code: diaChiVaPhivanChuyen.xaCode,
      weight: 400,
      service_id,
    };
    return this.http.post(url, rawData, { headers });
  }

  // get service
  getService(
    shop_id: number,
    from_district: number,
    to_district: number
  ): Observable<any> {
    let url =
      "https://dev-online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/available-services";
    const headers = new HttpHeaders().set("Token", this.client_token);
    let rawData = {
      shop_id: Number(shop_id),
      from_district: Number(from_district),
      to_district: Number(to_district),
    };
    return this.http.post(url, rawData, { headers });
  }
}
