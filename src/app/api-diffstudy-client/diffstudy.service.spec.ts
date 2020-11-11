/**
 * Copyright (c) 2020, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { TestBed } from '@angular/core/testing';

import { DiffstudyService } from './diffstudy.service';

describe('DiffstudyService', () => {
  let service: DiffstudyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DiffstudyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
