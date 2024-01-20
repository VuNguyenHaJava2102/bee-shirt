import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChiTietHoaDonComponent } from './chi-tiet-hoa-don.component';

describe('ChiTietHoaDonComponent', () => {
  let component: ChiTietHoaDonComponent;
  let fixture: ComponentFixture<ChiTietHoaDonComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ChiTietHoaDonComponent]
    });
    fixture = TestBed.createComponent(ChiTietHoaDonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
