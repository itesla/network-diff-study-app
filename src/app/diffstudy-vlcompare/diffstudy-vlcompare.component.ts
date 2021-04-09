/**
 * Copyright (c) 2020, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import {Component, OnInit} from '@angular/core';
import {NetworkDiffServerService} from '../api-diff-client/api/api';
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

  network1s: string;
  network2s: string;
  vlIds: string;
  network1Names: string;
  network2Names: string;

  subsDict = {};
  diffResult: {};
  studies: Diffstudy[];
  study: Object;
  vlevels: string[];
  showDiagram: boolean;

  threshold: number;
  thresholdS: number;

  showSpinner: boolean = false;

  alertMessage: string = "Loading, please wait";

  constructor(protected apiService: NetworkDiffServerService, protected diffstudyService: DiffstudyService) {
  }

  ngOnInit(): void {
    this.diffstudyService.getDiffstudyList().subscribe(studiesListRes => {
      this.studies = studiesListRes;
    });

    this.showDiagram = false;
    this.threshold = 0.0;
    this.thresholdS = this.threshold;

    this.showSpinner = false;
  }

  onChangeDiffStudy(study) {
    this.vlIds = "";
    this.vlevels = [];
    this.subsDict = {};

    this.diffstudyService.getDiffstudyVoltageLevels(study["studyName"]).subscribe(vlevelsRes => {
      this.subsDict = {};

      if (this.study['zone'] === undefined || this.study['zone'] == 0) {
        let vlevelsSize = Object.keys(vlevelsRes).length;
        this.vlevels = new Array(vlevelsSize);
        for (let i = 0; i < vlevelsSize; i++) {
          this.vlevels[i] = vlevelsRes[i]['id'];
        }
      } else {
        let vLevels = [];

        let subVoltageMap = Object.values(vlevelsRes).reduce((subVoltageMap, item) => {
          if (this.study['zone'].includes(item.substationId)) {
            const asub = (subVoltageMap[item.substationId] || []);
            asub.push(item.id);
            vLevels.push(item.id);
            subVoltageMap[item.substationId] = asub;
          }
          return subVoltageMap;
        }, {});
        this.subsDict = subVoltageMap;
        this.vlevels = vLevels;
      }
    });
  }

  getStudyAttributeOrEmptyString(attributeName:string):string {
    if (this.study == undefined) {
      return "";
    } else {
      return this.study[attributeName];
    }
  }

  networkDiff() {
    //clean global status
    this.network1 = "";
    this.network2 = "";
    this.diffResult = {'diff.VoltageLevels': [], 'diff.Branches': []};
    this.showDiagram = true;

    this.thresholdS = Math.abs(this.threshold);

    this.showSpinner = true;

    this.diffstudyService.getDiffstudy(this.study['studyName']).subscribe(diffStudyRes => {
      let network1Uuid = diffStudyRes['network1Uuid'];
      let network2Uuid = diffStudyRes['network2Uuid'];

      this.apiService.diffNetworksUsingGET(this.thresholdS, network1Uuid, network2Uuid, this.vlId)
        .subscribe(diffResult => {
          //set global status
          this.network1 = network1Uuid;
          this.network2 = network2Uuid;
          this.diffResult = diffResult;

          this.network1s = network1Uuid;
          this.network2s = network2Uuid;
          this.vlIds = this.vlId;
          this.network1Names = this.getStudyAttributeOrEmptyString("network1Id");
          this.network2Names = this.getStudyAttributeOrEmptyString("network2Id");

          this.showSpinner = false;
        });
    });
  }
}
