import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppConnectComponent } from './app-connect.component';

describe('AppConnectComponent', () => {
  let component: AppConnectComponent;
  let fixture: ComponentFixture<AppConnectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppConnectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppConnectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
