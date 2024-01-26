import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { PagedResponse } from "../model/interface/paged-response.interface";
import { PhieuGiamGia } from "../model/class/phieu-giam-gia.class";

@Injectable({
  providedIn: "root",
})
export class PhieuGiamGiaService {
  private readonly apiUrl = "http://localhost:8080/phieu-giam-gia";
  constructor(private http: HttpClient) {}

  //public function

  public getAll(
    pageNumber: number = 1,
    pageSize: number = 5,
    search: string = ""
  ): Observable<PagedResponse<PhieuGiamGia>> {
    const param = `?pageNumber=${pageNumber}&pageSize=${pageSize}&search=${search}`;
    return this.http.get<PagedResponse<PhieuGiamGia>>(
      `${this.apiUrl}/ds-phieu-giam-gia${param}`
    );
  }
}
