/**
 * Copyright (c) 2020, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Component, OnInit } from '@angular/core';
import { Case } from '../api-case-client/case';
import { CaseService } from '../api-case-client/case.service';

@Component({
  selector: 'app-search-cases',
  templateUrl: './search-cases.component.html',
  styleUrls: ['./search-cases.component.css']
})
export class SearchCasesComponent implements OnInit {

  q: string;
  cases: Case[];

  constructor(private dataService: CaseService) { }

  ngOnInit(): void {
    this.q = "";
  }

  private searchCases() {
    this.dataService.searchCases(this.q)
      .subscribe(cases => this.cases = cases);
  }

  onSubmit() {
    this.searchCases();
  }
}

