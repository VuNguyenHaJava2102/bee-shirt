import { Component, Input } from "@angular/core";

@Component({
  selector: "app-order-product",
  templateUrl: "./order-product.component.html",
  styleUrls: ["./order-product.component.css"],
})
export class OrderProductComponent {
  @Input() hoaDonChiTiets: any;
}
