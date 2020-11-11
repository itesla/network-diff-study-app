/**
 * Copyright (c) 2020, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { TestBed } from '@angular/core/testing';

import { CaseService } from './case.service';

describe('CaseService', () => {
  let service: CaseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CaseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
