import { HttpErrorResponse } from "@angular/common/http";
import { Component } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";

import Swal, { SweetAlertResult } from "sweetalert2";

import { KieuDang } from "src/app/model/class/kieu-dang.class";
import { PagedResponse } from "src/app/model/interface/paged-response.interface";
import { KieuDangService } from "src/app/service/kieu-dang.service";
import { NotificationService } from "src/app/service/notification.service";

@Component({
  selector: "app-danh-sach-kieu-dang",
  templateUrl: "./danh-sach-kieu-dang.component.html",
  styleUrls: ["./danh-sach-kieu-dang.component.css"],
})
export class DanhSachKieuDangComponent {
  public pagedResponse: PagedResponse<KieuDang>;
  public addForm: FormGroup;
  public updateForm: FormGroup;
  public search = "";
  public selectedDetails: KieuDang;

  // constructor, ngOn
  constructor(
    private kieuDangService: KieuDangService,
    private notifService: NotificationService
  ) {}

  ngOnInit(): void {
    this.getKieuDangList();
    this.initAddForm();
    this.initUpdateForm();
  }

  // public function
  //
  public add(): void {
    Swal.fire({
      title: "Thêm kiểu dáng áo?",
      cancelButtonText: "Hủy",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Thêm",
    }).then((result: SweetAlertResult) => {
      if (result.isConfirmed) {
        let trimmed = this.addForm.get("ten").value.trim();
        this.addForm.get("ten")?.setValue(trimmed);

        this.kieuDangService.add(this.addForm.value).subscribe({
          next: (response: KieuDang) => {
            this.goToPage(
              this.pagedResponse.pageNumber,
              this.pagedResponse.pageSize,
              this.pagedResponse.search
            );
            this.initAddForm();
            document.getElementById("closeBtn").click();
            this.notifService.success("Thêm thành công!");
          },
          error: (errorResponse: HttpErrorResponse) => {
            this.notifService.error(errorResponse.error.message);
          },
        });
      }
    });
  }

  //
  public initAddForm(): void {
    this.addForm = new FormGroup({
      ten: new FormControl("", [Validators.required]),
    });
  }

  //
  public goToPage(
    page: number = 1,
    pageSize: number = 5,
    keyword: string = ""
  ): void {
    this.kieuDangService.getByPage(page, pageSize, keyword).subscribe({
      next: (response: PagedResponse<KieuDang>) => {
        this.pagedResponse = response;
      },
      error: (errorResponse: HttpErrorResponse) => {
        this.notifService.error(errorResponse.error.message);
      },
    });
  }

  //
  public onChangePageSize(e: any): void {
    this.goToPage(1, e.target.value, this.search);
  }

  //
  public searchByName(): void {
    this.goToPage(1, this.pagedResponse.pageSize, this.search);
  }

  //
  public onClearSearchInput(): void {
    this.goToPage();
  }

  //
  public openDetailsForm(id: number): void {
    this.kieuDangService.getById(id).subscribe({
      next: (response: KieuDang) => {
        this.selectedDetails = response;
      },
      error: (errorResponse: HttpErrorResponse) => {
        this.notifService.error(errorResponse.error.message);
      },
    });
  }

  //
  public openUpdateForm(id: number): void {
    this.kieuDangService.getById(id).subscribe({
      next: (response: KieuDang) => {
        this.updateForm = new FormGroup({
          id: new FormControl(response.id),
          ten: new FormControl(response.ten, [Validators.required]),
          trangThai: new FormControl(response.trangThai),
        });
      },
      error: (errorResponse: HttpErrorResponse) => {
        this.notifService.error(errorResponse.error.message);
      },
    });
  }

  //
  public changeStatus(id: number): void {
    this.kieuDangService.changeStatus(id).subscribe({
      next: (response: string) => {
        this.goToPage(
          this.pagedResponse.pageNumber,
          this.pagedResponse.pageSize,
          this.pagedResponse.search
        );
        this.notifService.success(response);
      },
      error: (errorResponse: HttpErrorResponse) => {
        this.notifService.error(errorResponse.error.message);
      },
    });
  }

  //
  public update(): void {
    Swal.fire({
      title: "Cập nhật kiểu dáng áo?",
      cancelButtonText: "Hủy",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Cập nhật",
    }).then((result: SweetAlertResult) => {
      if (result.isConfirmed) {
        let trimmed = this.updateForm.get("ten").value.trim();
        this.updateForm.get("ten")?.setValue(trimmed);

        this.kieuDangService.update(this.updateForm.value).subscribe({
          next: (response: KieuDang) => {
            this.goToPage(
              this.pagedResponse.pageNumber,
              this.pagedResponse.pageSize,
              this.pagedResponse.search
            );
            this.initUpdateForm();
            document.getElementById("closeUpdateBtn").click();
            this.notifService.success("Cập nhật thành công!");
          },
          error: (errorResponse: HttpErrorResponse) => {
            this.notifService.error(errorResponse.error.message);
          },
        });
      }
    });
  }

  // private function
  //
  private getKieuDangList(): void {
    this.kieuDangService.getByPage().subscribe({
      next: (response: PagedResponse<KieuDang>) => {
        this.pagedResponse = response;
      },
      error: (error: HttpErrorResponse) => {
        console.log(error);
      },
    });
  }

  //
  public initUpdateForm(): void {
    this.updateForm = new FormGroup({
      id: new FormControl(0),
      ten: new FormControl("", [Validators.required]),
      trangThai: new FormControl(false),
    });
  }
}
