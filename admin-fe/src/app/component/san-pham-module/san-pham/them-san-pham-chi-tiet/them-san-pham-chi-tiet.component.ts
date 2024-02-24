import { HttpErrorResponse } from "@angular/common/http";
import { Component } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";

import { ToastrService } from "ngx-toastr";

import { ChatLieu } from "src/app/model/class/chat-lieu.class";
import { CoAo } from "src/app/model/class/co-ao.class";
import { HinhAnh } from "src/app/model/class/hinh-anh.class";
import { KichCo } from "src/app/model/class/kich-co.class";
import { KieuDang } from "src/app/model/class/kieu-dang.class";
import { KieuThietKe } from "src/app/model/class/kieu-thiet-ke.class";
import { MauSac } from "src/app/model/class/mau-sac.class";
import { SanPham } from "src/app/model/class/san-pham.class";
import { TayAo } from "src/app/model/class/tay-ao.class";
import { AddSPCTRequest } from "src/app/model/interface/add-spct-request.interface";
import { AddSPCTSubRequest } from "src/app/model/interface/add-spct-sub-request.interface";
import { ChatLieuService } from "src/app/service/chat-lieu.service";
import { HinhAnhSanPhamService } from "src/app/service/hinh-anh-san-pham.service";
import { KichCoService } from "src/app/service/kick-co.service";
import { KieuCoAoService } from "src/app/service/kieu-co-ao.service";
import { KieuDangService } from "src/app/service/kieu-dang.service";
import { KieuTayAoService } from "src/app/service/kieu-tay-ao.service";
import { KieuThietKeService } from "src/app/service/kieu-thiet-ke.service";
import { MauSacService } from "src/app/service/mau-sac.service";
import { SanPhamChiTietService } from "src/app/service/san-pham-chi-tiet.service";
import { SanPhamService } from "src/app/service/san-pham.service";

@Component({
  selector: "app-them-san-pham-chi-tiet",
  templateUrl: "./them-san-pham-chi-tiet.component.html",
  styleUrls: ["./them-san-pham-chi-tiet.component.css"],
})
export class ThemSanPhamChiTietComponent {
  public isLoadding = false;
  public overlayText: string = "";

  public imgIndex: number;
  public selectedTenMauSac: string;
  public selectedIdMauSac: number;
  public addForm: FormGroup;
  public sanPham: SanPham;

  public selectedMauSacList: MauSac[] = [];
  public selectedKichCoList: KichCo[] = [];
  public mauSacList: MauSac[] = [];
  public kichCoList: KichCo[] = [];
  public kieuDangList: KieuDang[] = [];
  public kieuThietKeList: KieuThietKe[] = [];
  public tayAoList: TayAo[] = [];
  public coAoList: CoAo[] = [];
  public chatLieuList: ChatLieu[] = [];

  public selectedImgFileList: File[][] = [];
  public curSelectedImgFileList: File[] = [];

  public existingImgList: HinhAnh[][] = [];
  public curExistingImgList: HinhAnh[] = [];

  public uploadImgFileList: File[][] = [];
  public curUploadImgFileList: File[] = [];

  constructor(
    private activatedRoute: ActivatedRoute,
    private toastr: ToastrService,
    private sanPhamService: SanPhamService,
    private kichCoService: KichCoService,
    private mauSacService: MauSacService,
    private kieuDangService: KieuDangService,
    private kieuThietKeService: KieuThietKeService,
    private kieuTayAoService: KieuTayAoService,
    private kieuCoAoService: KieuCoAoService,
    private chatLieuService: ChatLieuService,
    private hinhAnhSanPhamService: HinhAnhSanPhamService,
    private sanPhamChiTietService: SanPhamChiTietService
  ) {}

  ngOnInit(): void {
    this.initAddForm();
    this.getSanPhamById();
    this.getDataForSelector();
  }

  // public functions
  // 1
  public getMauSacList(): void {
    this.getAllMauSac();
  }

  // 2
  public getKichCoList(): void {
    this.getAllKichCo();
  }

  // 3
  public selectColor(ms: MauSac): void {
    if (!this.selectedMauSacList.some((item: MauSac) => item.id === ms.id)) {
      this.selectedMauSacList.push(ms);

      this.selectedImgFileList.push([]);
      this.uploadImgFileList.push([]);
    }
  }

  // 4
  public selectKichCo(kc: KichCo): void {
    if (!this.selectedKichCoList.some((item: KichCo) => item.id === kc.id)) {
      this.selectedKichCoList.push(kc);
    }
  }

  // 5
  public removeSelectedColor(colorId: number): void {
    // lấy vị trí muốn xóa
    let expectIndex: number;
    for (let i = 0; i < this.selectedMauSacList.length; i++) {
      if (this.selectedMauSacList[i].id === colorId) {
        expectIndex = i;
        break;
      }
    }
    this.selectedMauSacList.splice(expectIndex, 1);
    this.selectedImgFileList.splice(expectIndex, 1);
    this.uploadImgFileList.splice(expectIndex, 1);
  }

  // 6
  public removeSelectedSize(sizeId: number): void {
    this.selectedKichCoList = this.selectedKichCoList.filter(
      (item: KichCo) => item.id !== sizeId
    );
  }

  // Start: functions xử lý sự kiện chọn ảnh
  // 7
  public openHinhAnhModal(
    tenMau: string,
    idMau: number,
    sanPhamId: number,
    colorIndex: number
  ): void {
    this.imgIndex = colorIndex;
    this.selectedTenMauSac = tenMau;
    this.selectedIdMauSac = idMau;
    // this.getHinhAnhByMauSac(tenMau, sanPhamId);
    document.getElementById("anhSpModalBtn").click();

    // Gán lại ds ảnh đã chọn và ds ảnh đã upload của modal màu đang chọn vào
    this.curSelectedImgFileList = this.selectedImgFileList[this.imgIndex];
    this.curUploadImgFileList = this.uploadImgFileList[this.imgIndex];

    // sau khi gán các ds, ta show các ảnh đó lên
    for (let i = 0; i < this.curSelectedImgFileList.length; i++) {
      this.showImageThumbnail(
        this.curSelectedImgFileList[i],
        `selectedImg2${this.imgIndex}${i}`
      );
    }

    for (let i = 0; i < this.curUploadImgFileList.length; i++) {
      this.showImageThumbnail(
        this.curUploadImgFileList[i],
        `uploadImg${this.selectedIdMauSac}${i}`
      );
    }
  }

  // 8
  public openFileInput(imgIndex: number): void {
    document.getElementById(`fileImage${imgIndex}`).click();
  }

  // 9
  public changeInput(event: any): void {
    // dựa vào file input (các anh được chọn), ta dùng for loop gán từng file cho 'curUploadImgFileList' (đồng thời phải check xem file đó đã được chọn hay chưa)
    for (let i = 0; i < event.target["files"].length; i++) {
      let currentFile = event.target["files"][i];
      if (!this.checkUploadImage(currentFile.name, this.curUploadImgFileList)) {
        this.curUploadImgFileList.push(currentFile);
      } else {
        this.toastr.warning("Một số ảnh bạn chọn đã được tải lên!");
      }
    }

    // gán list ảnh được upload vào 'list các list ảnh' được upload
    this.uploadImgFileList[this.imgIndex] = this.curUploadImgFileList;

    // show list ảnh vừa được upload
    for (let i = 0; i < this.curUploadImgFileList.length; i++) {
      this.showImageThumbnail(
        this.curUploadImgFileList[i],
        `uploadImg${this.selectedIdMauSac}${i}`
      );
    }
  }

  // 10
  public toggleUploadImage(chkBoxIndex: number, file: File, event: any): void {
    const isChecked = event.target.checked;
    if (this.curSelectedImgFileList.length === 5 && isChecked) {
      this.toastr.warning("Không chọn quá 5 ảnh", "");

      const currentCheckbox = document.getElementById(
        `chkBoxUploadImg${chkBoxIndex}`
      ) as HTMLInputElement;
      currentCheckbox.checked = !currentCheckbox.checked;
      return;
    }

    if (isChecked) {
      this.curSelectedImgFileList.push(file);
      this.selectedImgFileList[this.imgIndex] = this.curSelectedImgFileList;
    } else {
      this.curSelectedImgFileList = this.curSelectedImgFileList.filter(
        (item: File) => item.name !== file.name
      );
      this.selectedImgFileList[this.imgIndex] = this.curSelectedImgFileList;
    }

    // show ảnh
    for (let i = 0; i < this.selectedImgFileList.length; i++) {
      let list = this.selectedImgFileList[i];
      for (let j = 0; j < list.length; j++) {
        if (this.imgIndex === i) {
          this.showImageThumbnail2(list[j], `.selectedImg1${i}${j}`);
        }
      }
    }

    for (let i = 0; i < this.curSelectedImgFileList.length; i++) {
      this.showImageThumbnail(
        this.curSelectedImgFileList[i],
        `selectedImg2${this.imgIndex}${i}`
      );
    }
  }

  public isUploadImgChecked(fileName: string): boolean {
    for (let i = 0; i < this.curSelectedImgFileList.length; i++) {
      if (this.curSelectedImgFileList[i].name === fileName) {
        return true;
      }
    }
    return false;
  }
  // end: functions xử lý sự kiện chọn ảnh

  // 11
  public formatNumber(event: any, inputName: string): void {
    let value = event.target.value;
    if (value === "") {
      this.addForm.get(inputName).setValue("0");
      return;
    }
    value = value.replace(/,/g, "");
    value = parseFloat(value).toLocaleString("en-US");
    this.addForm.get(inputName).setValue(value);
  }

  // 12
  public formatNumber2(event: any, inputNameId: string): void {
    let value = event.target.value;
    if (value === "") {
      (document.getElementById(inputNameId) as HTMLInputElement).value = "0";
      return;
    }
    value = value.replace(/,/g, "");
    value = parseFloat(value).toLocaleString("en-US");
    (document.getElementById(inputNameId) as HTMLInputElement).value = value;
  }

  // 13
  public add(): void {
    this.turnOnOverlay("Đang thêm...");

    for (let i = 0; i < this.selectedMauSacList.length; i++) {
      let mauSacEles = document.querySelectorAll(
        `.mauSacId${this.selectedMauSacList[i].id}`
      );
      let kichCoEles = document.querySelectorAll(
        `.kichCoId${this.selectedMauSacList[i].id}`
      );
      let soLuongInputs = document.querySelectorAll(
        `.soLuong${this.selectedMauSacList[i].id}`
      );

      let addSPCTSubRequest: AddSPCTSubRequest;
      for (let j = 0; j < mauSacEles.length; j++) {
        let kichCoIdList: number[] = [];
        let soLuongTonList: number[] = [];

        for (let k = 0; k < kichCoEles.length; k++) {
          let kichCoId = parseInt((kichCoEles[k] as HTMLInputElement).value);
          let soLuongTon = parseInt(
            (soLuongInputs[k] as HTMLInputElement).value.replaceAll(",", "")
          );
          kichCoIdList.push(kichCoId);
          soLuongTonList.push(soLuongTon);
        }
        addSPCTSubRequest = {
          mauSacId: this.selectedMauSacList[i].id,
          kichCoIdList: kichCoIdList,
          soLuongTonList: soLuongTonList,
        };
      }

      this.formatAddFormData(this.addForm);
      const addSpctReq: AddSPCTRequest = {
        id: this.addForm.get("id").value,
        giaNhap: this.addForm.get("giaNhap").value,
        giaBan: this.addForm.get("giaBan").value,
        sanPhamId: this.addForm.get("sanPhamId").value,
        kieuDangId: this.addForm.get("kieuDangId").value,
        thietKeId: this.addForm.get("thietKeId").value,
        tayAoId: this.addForm.get("tayAoId").value,
        coAoId: this.addForm.get("coAoId").value,
        chatLieuId: this.addForm.get("chatLieuId").value,
        requests: addSPCTSubRequest,
      };

      console.log(addSpctReq);
      console.log(this.selectedImgFileList[i].length);
      console.log("---");

      this.sanPhamChiTietService
        .add(addSpctReq, this.selectedImgFileList[i])
        .subscribe({
          next: (response: string) => {
            this.toastr.success(response, "");
            this.turnOffOverlay("");
          },
          error: (err: HttpErrorResponse) => {
            console.log(err);
            this.turnOffOverlay("");
          },
        });
    }
  }

  public deleteRow(rowId: string): void {
    const selectedRow = document.getElementById(rowId);
    console.log(selectedRow);

    if (selectedRow) {
      selectedRow.remove();
    }
  }
  // end: public functions

  public selectAllRows1Color(selectedColorId: number): void {
    const ckBoxAll = document.getElementById(
      `ckBoxAll${selectedColorId}`
    ) as HTMLInputElement;
    const selectedCkBoxs = document.querySelectorAll(
      `.ckBoxColor${selectedColorId}`
    );

    for (let i = 0; i < selectedCkBoxs.length; i++) {
      const ckBox = selectedCkBoxs[i] as HTMLInputElement;
      if (i === 0) {
        continue;
      }
      ckBox.checked = ckBoxAll.checked;
    }
  }

  public toggleUpdateFieldBtn(selectedColorId: number): boolean {
    const selectedCkBoxs = document.querySelectorAll(
      `.ckBoxColor${selectedColorId}`
    );

    for (let i = 0; i < selectedCkBoxs.length; i++) {
      const ckBox = selectedCkBoxs[i] as HTMLInputElement;
      if (ckBox.checked) {
        return true;
      }
    }
    return false;
  }

  public saveSoLuongForm(): void {
    let value = (document.getElementById("soLuongInput") as HTMLInputElement)
      .value;
    let soLuongInputs = document.querySelectorAll(
      `.soLuong${this.chinhSuaBtnId}`
    );
    for (let i = 0; i < soLuongInputs.length; i++) {
      let soLuongInput = soLuongInputs[i] as HTMLInputElement;
      let chkBoxInput = document.getElementById(
        soLuongInput.id.replace("soLuong", "ckBoxColor")
      ) as HTMLInputElement;
      if (chkBoxInput.checked) {
        soLuongInput.value = value;
      }
    }
  }

  private chinhSuaBtnId: number;
  public assignChinhSuaBtnId(id: number): void {
    this.chinhSuaBtnId = id;
  }

  // private functions
  private checkUploadImage(fileName: string, curUploadImgFileList: File[]) {
    return curUploadImgFileList.some((file: File) => file.name === fileName);
  }

  private formatAddFormData(form: FormGroup): void {
    const giaNhap = form.get("giaNhap").value;
    const giaBan = form.get("giaBan").value;
    this.addForm.get("giaNhap").setValue(giaNhap.replaceAll(",", ""));
    this.addForm.get("giaBan").setValue(giaBan.replaceAll(",", ""));
  }

  public initAddForm(): void {
    this.addForm = new FormGroup({
      id: new FormControl(0),
      giaNhap: new FormControl("0", [Validators.required]),
      giaBan: new FormControl("0", [Validators.required]),
      sanPhamId: new FormControl(0),
      chatLieuId: new FormControl(0),
      coAoId: new FormControl(0),
      kieuDangId: new FormControl(0),
      tayAoId: new FormControl(0),
      thietKeId: new FormControl(0),
    });
  }

  private getHinhAnhByMauSac(tenMau: string, sanPhamID: number): void {
    this.hinhAnhSanPhamService.getAll(tenMau, sanPhamID).subscribe({
      next: (response: HinhAnh[]) => {
        // this.existingImgList = response;
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  public showImageThumbnail(file: File, thumnailId: string): void {
    let reader = new FileReader();
    reader.onload = (e) => {
      (document.getElementById(thumnailId) as HTMLImageElement)["src"] = e
        .target.result as string;
    };
    reader.readAsDataURL(file);
  }

  private showImageThumbnail2(file: File, thumnailClass: string): void {
    let reader = new FileReader();
    reader.onload = (e) => {
      (document.querySelector(`${thumnailClass}`) as HTMLImageElement)["src"] =
        e.target.result as string;
    };
    reader.readAsDataURL(file);
  }

  private getSanPhamById(): void {
    this.activatedRoute.params.subscribe((params) => {
      this.sanPhamService.getById(params["sanPhamId"]).subscribe({
        next: (response: SanPham) => {
          this.sanPham = response;
          this.addForm.get("sanPhamId").setValue(response.id);
        },
        error: (error: HttpErrorResponse) => {
          console.log(error);
        },
      });
    });
  }

  private getDataForSelector(): void {
    this.getAllKieuDang();
    this.getAllKieuThietKe();
    this.getAllKieuTayAo();
    this.getAllKieuCoAo();
    this.getAllChatLieu();
  }

  private getAllMauSac(): void {
    this.mauSacService.getAll().subscribe({
      next: (response: MauSac[]) => {
        this.mauSacList = response;
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  private getAllKichCo(): void {
    this.kichCoService.getAll().subscribe({
      next: (response: KichCo[]) => {
        this.kichCoList = response;
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  private getAllKieuDang(): void {
    this.kieuDangService.getAll().subscribe({
      next: (response: KieuDang[]) => {
        this.kieuDangList = response;
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  private getAllKieuThietKe(): void {
    this.kieuThietKeService.getAll().subscribe({
      next: (response: KieuThietKe[]) => {
        this.kieuThietKeList = response;
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  private getAllKieuTayAo(): void {
    this.kieuTayAoService.getAll().subscribe({
      next: (response: TayAo[]) => {
        this.tayAoList = response;
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  private getAllKieuCoAo(): void {
    this.kieuCoAoService.getAll().subscribe({
      next: (response: CoAo[]) => {
        this.coAoList = response;
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  private getAllChatLieu(): void {
    this.chatLieuService.getAll().subscribe({
      next: (response: ChatLieu[]) => {
        this.chatLieuList = response;
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  private turnOnOverlay(text: string): void {
    this.overlayText = text;
    this.isLoadding = true;
  }

  private turnOffOverlay(text: string): void {
    this.overlayText = text;
    this.isLoadding = false;
  }
}
