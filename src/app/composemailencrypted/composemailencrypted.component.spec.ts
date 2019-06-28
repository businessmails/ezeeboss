import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ComposemailencryptedComponent } from './composemailencrypted.component';

describe('ComposemailencryptedComponent', () => {
  let component: ComposemailencryptedComponent;
  let fixture: ComponentFixture<ComposemailencryptedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ComposemailencryptedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComposemailencryptedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
