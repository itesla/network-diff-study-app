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
  templateUrl: './diffstudy-subcompare.component.html',
  styleUrls: ['./diffstudy-subcompare.component.css']
})

export class DiffstudySubcompareComponent implements OnInit {
  network1: string;
  network2: string;

  network1s: string;
  network2s: string;
  subIds: string;
  network1Names: string;
  network2Names: string;

  subId: string;
  subsDict = {};
  subs = [];
  diffResult: {};
  studies: Diffstudy[];
  study: Object;

  showDiagram: boolean = false;

  threshold: number;
  thresholdS: number;

  voltageThreshold: number;
  voltageThresholdS: number;


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

    this.voltageThreshold = 0.0;
    this.voltageThresholdS = this.voltageThreshold;

    this.showSpinner = false;
  }

  onChangeDiffStudy(study) {
    this.subIds = "";
    this.subs = [];
    this.subsDict = {};

    this.diffstudyService.getDiffstudyVoltageLevels(study["studyName"]).subscribe(vlevelsRes => {
      if (this.study['zone'] === undefined || this.study['zone'] == 0) {
        //what happens when there are no zones?
      } else {
        let subVoltageMap = Object.values(vlevelsRes).reduce((subVoltageMap, item) => {
          if (this.study['zone'].includes(item.substationId)) {
            const asub = (subVoltageMap[item.substationId] || []);
            asub.push(item.id);
            subVoltageMap[item.substationId] = asub;
          }
          return subVoltageMap;
        }, {});
        this.subsDict = subVoltageMap;
        this.subs = Object.keys(subVoltageMap);
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
    this.voltageThresholdS = Math.abs(this.voltageThreshold);

    this.showSpinner = true;

    this.diffstudyService.getDiffstudy(this.study['studyName']).subscribe(diffStudyRes => {
      let network1Uuid = diffStudyRes['network1Uuid'];
      let network2Uuid = diffStudyRes['network2Uuid'];

      this.apiService.diffSubstationUsingGET(this.thresholdS, network1Uuid, network2Uuid, this.subId, this.voltageThreshold)
        .subscribe(diffResult => {
          //set global status
          this.network1 = network1Uuid;
          this.network2 = network2Uuid;
          this.diffResult = diffResult;

          this.network1s = network1Uuid;
          this.network2s = network2Uuid;
          this.subIds = this.subId;
          this.network1Names = this.getStudyAttributeOrEmptyString("network1Id");
          this.network2Names = this.getStudyAttributeOrEmptyString("network2Id");

          this.showSpinner = false;
        });

    });
  }
}
