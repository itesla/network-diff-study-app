/**
 * Copyright (c) 2020, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router'

import {DiffstudyService} from '../api-diffstudy-client/diffstudy.service';
import {Diffstudy} from "../api-diffstudy-client/diffstudy";

@Component({
  selector: 'edit-diffstudy',
  templateUrl: './edit-diffstudy.component.html',
  styleUrls: ['./edit-diffstudy.component.css']
})
export class EditDiffStudyComponent implements OnInit {

  id: string;
  diffStudy: any;
  subsList = [];
  selectedSubs = [];
  submitted = false;
  updateErrors = false;

  constructor(private activatedRoute: ActivatedRoute, private diffstudyService: DiffstudyService) {
  }

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(params => {
      this.id = params.get('id');
      this.diffstudyService.getDiffstudy(this.id).subscribe(diffStudyRes => {
        console.log("diffstudy zone: " + diffStudyRes['zone']);
        this.diffStudy = diffStudyRes;
        this.selectedSubs = diffStudyRes['zone'];
        
        //retrieve the substations list for the networks
        this.diffstudyService.getDiffstudyVoltageLevels(this.id).subscribe(vlevelsRes => {
          let subVoltageMap = Object.values(vlevelsRes).reduce((subVoltageMap, item) => {
            const asub = (subVoltageMap[item.substationId] || []);
            asub.push(item.id);
            subVoltageMap[item.substationId] = asub;
            return subVoltageMap;
          }, {});
          this.subsList = Object.keys(subVoltageMap);
        });

      });
    });
  }


  onChange(sub: string, isChecked: boolean) {
    this.submitted = false;
    if (isChecked) {
      this.selectedSubs.push(sub);
    } else {
      let index = this.selectedSubs.indexOf(sub);
      this.selectedSubs.splice(index, 1);
    }
  }


  ngAfterViewChecked(): void {
    let checkBoxes = document.querySelectorAll('.form-check-input');
    checkBoxes.forEach(ele => {
      let checkSubName = ele.getAttribute('name');
      if (this.selectedSubs.includes(checkSubName)) {
        ele.setAttribute('checked', 'true');
      }
    });
  }

  submitZone() {
    console.log("update zone, selected substations: " + this.selectedSubs);
    this.submitted = true;
    this.updateErrors = false;
    this.diffstudyService.setDiffstudyZone(this.id, this.selectedSubs)
      .subscribe(res => console.log("executed set zone: " + res), error => {
      console.log(error);
      this.updateErrors = true;
    }, () => console.log("request completed"));

  }

  clearSelectedZone() {
    console.log("clear zone");
    this.selectedSubs = [];
    let checkBoxes = document.querySelectorAll('.form-check-input');
    checkBoxes.forEach(ele => {
        (document.getElementById(ele.getAttribute('id')) as HTMLInputElement).checked = false
    });
  }
}

