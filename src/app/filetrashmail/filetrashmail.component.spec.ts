import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FileTransferTrashmailComponent } from './filetrashmail.component';

describe('FIleTransferTrashmailComponent', () => {
  let component: FileTransferTrashmailComponent;
  let fixture: ComponentFixture<FileTransferTrashmailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FileTransferTrashmailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FileTransferTrashmailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
