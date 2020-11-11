/**
 * Copyright (c) 2020, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';

import { DiffstudyService } from '../api-diffstudy-client/diffstudy.service';
import { Diffstudy } from '../api-diffstudy-client/diffstudy';

@Component({
  selector: 'diffstudy-list',
  templateUrl: './diffstudy-list.component.html',
  styleUrls: ['./diffstudy-list.component.css']
})
export class DiffstudyListComponent implements OnInit {

  diffstudies: Observable<Diffstudy[]>;

  constructor(private diffstudyService: DiffstudyService) { }

  ngOnInit() : void {
    this.reloadData();
  }

  deleteDiffstudies() {
    this.diffstudyService.deleteAll()
      .subscribe(
        data => {
          console.log(data);
          this.reloadData();
        },
        error => console.log('ERROR: ' + error));
  }

  reloadData() {
    this.diffstudies = this.diffstudyService.getDiffstudyList();
  }

}


