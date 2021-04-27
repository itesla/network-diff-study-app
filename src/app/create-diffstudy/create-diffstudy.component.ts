/**
 * Copyright (c) 2020-2021, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import {Component, OnInit} from '@angular/core';
import {DiffstudyService} from '../api-diffstudy-client/diffstudy.service';
import {NewDiffstudy} from '../api-diffstudy-client/newdiffstudy';
import {Observable, Subject} from 'rxjs';
import {
  debounceTime, distinctUntilChanged, switchMap
} from 'rxjs/operators';
import {Case} from "../api-case-client/case";
import {CaseService} from "../api-case-client/case.service";

@Component({
  selector: 'create-diffstudy',
  templateUrl: './create-diffstudy.component.html',
  styleUrls: ['./create-diffstudy.component.css']
})
export class CreateDiffstudyComponent implements OnInit {
  cases1: Observable<Case[]>;
  cases2: Observable<Case[]>;
  newdiffstudy: NewDiffstudy = new NewDiffstudy();
  submitted = false;
  createErrors = false;
  processCompleted = false;
  showSpinner: boolean = false;
  alertMessage: string = "Processing, please wait";
  errorMsg: string = "";
  private searchTerms1 = new Subject<string>();
  private searchTerms2 = new Subject<string>();
  private case1: string;
  private case2: string;

  constructor(private diffstudyService: DiffstudyService, private caseService: CaseService) {
  }

  search1(term: string): void {
    this.searchTerms1.next(term);
  }

  search2(term: string): void {
    this.searchTerms2.next(term);
  }

  ngOnInit(): void {
    this.showSpinner = false;
    this.processCompleted = false;

    this.cases1 = this.searchTerms1.pipe(
      // wait 300ms after each keystroke before considering the term
      debounceTime(300),

      // ignore new term if same as previous term
      distinctUntilChanged(),

      // switch to new search observable each time the term changes
      switchMap((term: string) => this.caseService.searchCases(term)),
    );
    this.cases2 = this.searchTerms2.pipe(
      // wait 300ms after each keystroke before considering the term
      debounceTime(300),

      // ignore new term if same as previous term
      distinctUntilChanged(),

      // switch to new search observable each time the term changes
      switchMap((term: string) => this.caseService.searchCases(term)),
    );

  }

  newNewDiffstudy(): void {
    this.submitted = false;
    this.createErrors = false;
    this.newdiffstudy = new NewDiffstudy();
  }

  save() {
    this.processCompleted = false;
    this.createErrors = false;
    this.errorMsg = "";
    this.showSpinner = true;
    this.diffstudyService.createDiffstudy(this.newdiffstudy)
      .subscribe(data => {
        //console.log(data);
      }, error => {
        console.log(error);
        this.createErrors = true;
        this.showSpinner = false;
        this.processCompleted = true;
        if ('error' in error) {
          this.errorMsg = error.error;
        } else {
          this.errorMsg = "ERROR";
        }
      }, () => {
        console.log("request completed");
        this.createErrors = false;
        this.showSpinner = false;
        this.processCompleted = true;
        this.errorMsg = "";
      });
  }

  onSubmit() {
    this.submitted = true;
    this.save();
    //console.log(this.newdiffstudy);
    this.searchTerms1.next('');
    this.searchTerms2.next('');
  }

  onSelect1(caseid: string) {
    this.newdiffstudy.case1Uuid = caseid;
    this.searchTerms1.next('');
  }


  onSelect2(caseid: string) {
    this.newdiffstudy.case2Uuid = caseid;
    this.searchTerms2.next('');
  }

}
