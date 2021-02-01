/**
 * Copyright (c) 2020, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Component, OnInit } from '@angular/core';
import { NetworkDiffServerService } from '../api-diff-client/api/api';

@Component({
  selector: 'network-diff',
  templateUrl: './network-diff.component.html',
  styleUrls: ['./network-diff.component.css']
})
export class NetworkDiffComponent implements OnInit {
  networkKeys: string[];
  networkMap: {[nId: string]: string};
  network1: string;
  network2: string;
  vlId: string;
  diffResult: {};

  constructor(protected apiService: NetworkDiffServerService) { }

  ngOnInit(): void {
    this.apiService.getNetworkIdsUsingGET().subscribe((res) => this.onNetworkIdsLoaded(res));

  }

  onNetworkIdsLoaded(networksIdsMap: {[nId: string]: string}) {
    this.networkMap = networksIdsMap;
    this.networkKeys = Object.keys(networksIdsMap);
  }

  getNetworkName(id: string) {
    return this.networkMap?  this.networkMap[id] : '';
  }

  networkDiff() {

    this.apiService.diffNetworksUsingGET(this.network1, this.network2, this.vlId)
        .subscribe(res => this.onNetworkDiffSuccess(res));
  }

  onNetworkDiffSuccess(res: String): void {
    this.diffResult = res;
  }

  getUrlSvgDiff(network1Id: string, network2Id: string) {
    if ((network1Id === undefined || network1Id.length == 0) || (network2Id === undefined || network2Id.length == 0)
      || (this.vlId === undefined || this.vlId.length == 0)) {
      return "";
    } else {
      let url = 'http://localhost:6007/v1/networks/' + network1Id + '/svgdiff/' + network2Id + '/vl/' + this.vlId;
      return url;
    }
  }
}
