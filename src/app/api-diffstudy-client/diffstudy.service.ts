/**
 * Copyright (c) 2020, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {NewDiffstudy} from "./newdiffstudy";

@Injectable({
  providedIn: 'root'
})
export class DiffstudyService {
  private baseUrl = 'http://localhost:6008/v1/diff-studies';


  constructor(private http: HttpClient) { }

  getDiffstudy(name: string): Observable<Object> {
    return this.http.get(`${this.baseUrl}/${name}`);
  }

  getDiffstudyList(): Observable<any> {
    return this.http.get(`${this.baseUrl}`);
  }

  deleteDiffstudy(name: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${name}`, { responseType: 'text' });
  }

  deleteAll(): Observable<any> {
    return this.http.delete(`${this.baseUrl}` + `/delete`, { responseType: 'text' });
  }

  getDiffstudyVoltageLevels(name: string): Observable<Object> {
    return this.http.get(`${this.baseUrl}/${name}/voltage-levels`);
  }

  createDiffstudy(newdiffstudy: NewDiffstudy): Observable<Object> {
    var formData: any = new FormData();
    formData.append("description", newdiffstudy.description);
    return this.http.post(`${this.baseUrl}/` +  newdiffstudy.diffStudyname + `/study/` + newdiffstudy.case1Uuid + `/` + newdiffstudy.case2Uuid, formData);
  }

  getSubstationsCoords(name: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/getsubscoords?diffStudyName=${name}`);
  }

  setDiffstudyZone(studyName: string, zone: string[]): Observable<Object> {
    var formData: any = new FormData();
    formData.append("zone", zone);
    return this.http.post(`${this.baseUrl}/` +  studyName + `/zone`, formData);
  }

}

