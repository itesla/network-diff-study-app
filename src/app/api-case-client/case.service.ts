/**
 * Copyright (c) 2020, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CaseService {
  private baseUrl = '/v1/diff-studies';


  constructor(private http: HttpClient) { }

  searchCases(q: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/searchcase?q=${q}`);
  }

}

