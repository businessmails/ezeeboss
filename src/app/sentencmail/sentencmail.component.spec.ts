import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SentencmailComponent } from './sentencmail.component';

describe('SentmailComponent', () => {
  let component: SentencmailComponent;
  let fixture: ComponentFixture<SentencmailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SentencmailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SentencmailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
