/**
 * Copyright (c) 2020, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiffstudyVlcompareComponent } from './diffstudy-vlcompare.component';

describe('NetworkDiffComponent', () => {
  let component: DiffstudyVlcompareComponent;
  let fixture: ComponentFixture<DiffstudyVlcompareComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DiffstudyVlcompareComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DiffstudyVlcompareComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
