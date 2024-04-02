import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class ProductDetailsService {
  private readonly apiUrl = "http://localhost:8080/spct";

  constructor(private http: HttpClient) {}

  // public functions
  // 1
  public getQuantityOfOne(
    productId: number,
    colorId: number,
    sizeId: number
  ): Observable<number> {
    return this.http.get<number>(
      `${this.apiUrl}/get-quantity/${productId}/${colorId}/${sizeId}`
    );
  }

  // 1
  public getPriceOfOne(
    productId: number,
    colorId: number,
    sizeId: number
  ): Observable<number> {
    return this.http.get<number>(
      `${this.apiUrl}/get-price/${productId}/${colorId}/${sizeId}`
    );
  }
}
