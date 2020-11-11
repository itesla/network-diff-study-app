/**
 * Copyright (c) 2020, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Component, OnInit, Input } from '@angular/core';
import { DiffstudyService } from '../api-diffstudy-client/diffstudy.service';
import { Diffstudy } from '../api-diffstudy-client/diffstudy';

import { DiffstudyListComponent } from '../diffstudy-list/diffstudy-list.component';


@Component({
  selector: 'diffstudy-details',
  templateUrl: './diffstudy-details.component.html',
  styleUrls: ['./diffstudy-details.component.css']
})
export class DiffstudyDetailsComponent implements OnInit {

  @Input() diffstudy: Diffstudy;

  constructor(private diffstudyService: DiffstudyService, private listComponent: DiffstudyListComponent) { }

  ngOnInit(): void {
  }

  deleteDiffstudy() {
    this.diffstudyService.deleteDiffstudy(this.diffstudy.studyName)
      .subscribe(
        data => {
          console.log(data);
          this.listComponent.reloadData();
        },
        error => console.log(error));
  }

}
