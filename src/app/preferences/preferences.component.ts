/**
 * Copyright (c) 2021, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-preferences',
  templateUrl: './preferences.component.html',
  styleUrls: ['./preferences.component.css']
})
export class PreferencesComponent implements OnInit {

  editField: string;
  static defaultLevelList: Array<any> = [
    {id: 1, i: 0.1, v: 0.001, c: 'green'},
    {id: 2, i: 2, v: 0.05, c: 'yellow'},
    {id: 3, i: 3, v: 0.1, c: 'orange'},
    {id: 4, i: 8, v: 0.5, c: 'magenta'},
    {id: 5, i: 10, v: 0.6, c: 'red'},
  ];

  awaitingLevelList: Array<any> = [];

  levelList: Array<any>;

  constructor() {
  }

  static getConfig(storage: Storage): string {
    let config = storage.getItem('config');
    if (config === null) {
      let defaultConfig = JSON.stringify(PreferencesComponent.defaultLevelList);
      storage.setItem('config', defaultConfig);
      return defaultConfig;
    } else {
      return config;
    }
  }

  static setConfig(storage: Storage, config: string) {
    storage.setItem('config', config);
  }

  ngOnInit(): void {
    this.levelList = JSON.parse(PreferencesComponent.getConfig(localStorage));
  }

  resetConfig() {
    let defaultConfig = JSON.stringify(PreferencesComponent.defaultLevelList);
    PreferencesComponent.setConfig(localStorage, defaultConfig);
    this.levelList = JSON.parse(PreferencesComponent.getConfig(localStorage));
  }

  updateList(id: number, property: string, event: any) {
    const editField = event.target.textContent;
    this.levelList[id][property] = editField;
    PreferencesComponent.setConfig(localStorage, JSON.stringify(this.levelList))
  }

  remove(id: any) {
    this.awaitingLevelList.push(this.levelList[id]);
    this.levelList.splice(id, 1);
  }

  add() {
    if (this.awaitingLevelList.length > 0) {
      const level = this.awaitingLevelList[0];
      this.levelList.push(level);
      this.awaitingLevelList.splice(0, 1);
    }
  }

  changeValue(id: number, property: string, event: any) {
    this.editField = event.target.textContent;
  }

}
