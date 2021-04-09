import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiffstudyZonecompareComponent } from './diffstudy-zonecompare.component';

describe('DiffstudyZonecompareComponent', () => {
  let component: DiffstudyZonecompareComponent;
  let fixture: ComponentFixture<DiffstudyZonecompareComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DiffstudyZonecompareComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DiffstudyZonecompareComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
