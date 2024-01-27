import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { DanhSachKhachHangComponent } from "./danh-sach-khach-hang/danh-sach-khach-hang.component";
import { KhachHangDetailComponent } from "./khach-hang-detail/khach-hang-detail.component";
import { ThemKhachHangComponent } from "./them-khach-hang/them-khach-hang.component";
import { SuaKhachHangComponent } from "./sua-khach-hang/sua-khach-hang.component";

const khachHangRoutes: Routes = [
  {
    path: "khach-hang/ds-khach-hang",
    component: DanhSachKhachHangComponent,
  },
  {
    path: "khach-hang/detail/:id",
    component: KhachHangDetailComponent,
  },
  {
    path: "khach-hang/them-khach-hang",
    component: ThemKhachHangComponent,
  },
  {
    path: "khach-hang/sua-khach-hang",
    component: SuaKhachHangComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(khachHangRoutes)],
  exports: [RouterModule],
})
export class KhachHangRoutingModule {}
