/**
 * Copyright (c) 2020, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import {Component, OnInit} from '@angular/core';
import {ApiService} from '../api-client/api/api';
import {NetworkDiffResponse} from '../api-client/model/models';
import {DiffstudyService} from '../api-diffstudy-client/diffstudy.service';
import {Diffstudy} from '../api-diffstudy-client/diffstudy';

@Component({
  selector: 'comparevl',
  templateUrl: './diffstudy-vlcompare.component.html',
  styleUrls: ['./diffstudy-vlcompare.component.css']
})
export class DiffstudyVlcompareComponent implements OnInit {
  network1: string;
  network2: string;
  vlId: string;
  diffResult: NetworkDiffResponse;
  studies: Diffstudy[];
  study: Object;
  vlevels: string[];
  showDiagram: boolean;

  constructor(protected apiService: ApiService, protected diffstudyService: DiffstudyService) {
  }

  ngOnInit(): void {
    this.diffstudyService.getDiffstudyList().subscribe((res) => this.onStudyLoaded(res));
  }

  onChangeDiffStudy(study) {
    this.diffstudyService.getDiffstudyVoltageLevels(study["studyName"]).subscribe((res) => this.onVoltageLevelsLoaded(res));
  }

  private onVoltageLevelsLoaded(res: Object) {
    let temp = Object.entries(res);
    if (this.study['zone'] === undefined || this.study['zone'] == 0) {
      this.vlevels = new Array(temp.length);
      for (let i = 0; i < temp.length; i++) {
        this.vlevels[i] = res[i]['id'];
      }
    } else {
      var scount = 0;

      for (let i = 0; i < temp.length; i++) {
        if (res[i]['substationId'].localeCompare(this.study['zone'][0]) == 0) {
          scount = scount + 1;
        }
      }

      this.vlevels = new Array(scount);
      var icount = 0;
      for (let i = 0; i < temp.length; i++) {
        if (res[i]['substationId'].localeCompare(this.study['zone'][0]) == 0) {
          this.vlevels[icount] = res[i]['id'];
          icount = icount + 1;
        }
      }
    }
  }

  onStudyLoaded(stud: Diffstudy[]) {
    this.studies = stud;
  }

  networkDiff() {
    this.network1 = "";
    this.network2 = "";
    this.showDiagram = false;
    this.diffstudyService.getDiffstudy(this.study['studyName']).subscribe(res => this.onNetworkDiffSuccess0(res));
  }

  onNetworkDiffSuccess(res: NetworkDiffResponse): void {
    this.diffResult = res;
    const vlevels = this.diffResult["diff.VoltageLevels"];
    const switchestatus = vlevels[0]["vl.switchesStatus-delta"];
    if (vlevels === undefined || vlevels.length == 0) {
      this.network1 = "";
      this.network2 = "";
      this.showDiagram = false;
    }
    if (switchestatus === undefined || switchestatus.length == 0) {
      this.network1 = "";
      this.network2 = "";
      this.showDiagram = false;
    } else {
      this.showDiagram = true;
    }
  }

  onNetworkDiffSuccess0(res: Object): void {
    this.network1 = res['network1Uuid'];
    this.network2 = res['network2Uuid'];

    this.apiService.networksNetwork1UuidDiffNetwork2UuidVlVlIdPost(this.network1, this.network2, this.vlId)
      .subscribe(res => this.onNetworkDiffSuccess(res));
  }

  getUrl(networkId: string) {
    const vlevels = this.diffResult["diff.VoltageLevels"];
    if (vlevels === undefined || vlevels.length == 0) {
      return "";
    } else {
      const switchestatus = vlevels[0]["vl.switchesStatus-delta"];
      if (switchestatus === undefined || switchestatus.length == 0) {
        return "";
      } else {
        var url = 'http://localhost:6007/v1/svg/network/' + networkId + '/vl/' + this.vlId + "/";
        const diffs = this.diffResult["diff.VoltageLevels"][0]["vl.switchesStatus-delta"].join(',');
        return url + diffs;
      }
    }
  }

}
