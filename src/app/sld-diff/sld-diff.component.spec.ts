import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SldDiffComponent } from './sld-diff.component';

describe('SldDiffComponent', () => {
  let component: SldDiffComponent;
  let fixture: ComponentFixture<SldDiffComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SldDiffComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SldDiffComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
