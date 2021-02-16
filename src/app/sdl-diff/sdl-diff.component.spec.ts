import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SdlDiffComponent } from './sdl-diff.component';

describe('SdlDiffComponent', () => {
  let component: SdlDiffComponent;
  let fixture: ComponentFixture<SdlDiffComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SdlDiffComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SdlDiffComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
