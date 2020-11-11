/**
 * Copyright (c) 2020, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api-client/api/api';
import { NetworkIds, NetworkDiffResponse } from '../api-client/model/models';


@Component({
  selector: 'network-diff',
  templateUrl: './network-diff.component.html',
  styleUrls: ['./network-diff.component.css']
})
export class NetworkDiffComponent implements OnInit {
  networkKeys: string[];
  neworkMap: NetworkIds;
  network1: string;
  network2: string;
  vlId: string;
  diffResult: NetworkDiffResponse;

  constructor(protected apiService: ApiService) { }

  ngOnInit(): void {
    this.apiService.networksGet().subscribe((res) => this.onNetworkIdsLoaded(res));

  }

  onNetworkIdsLoaded(nets: NetworkIds) {
    this.neworkMap = nets;
    this.networkKeys = Object.keys(nets);
  }

  getNetworkName(id: string) {
    return this.neworkMap?  this.neworkMap[id] : '';
  }

  networkDiff() {

    this.apiService.networksNetwork1UuidDiffNetwork2UuidVlVlIdPost(this.network1, this.network2, this.vlId)
        .subscribe(res => this.onNetworkDiffSuccess(res));
  }

  onNetworkDiffSuccess(res: NetworkDiffResponse): void {
    this.diffResult = res;
  }

  getUrl(networkId: string) {

    var url = 'http://localhost:6007/v1/svg/network/' + networkId + '/vl/' + this.vlId + "/";
    const diffs = this.diffResult["diff.VoltageLevels"][0]["vl.switchesStatus-delta"].join(',');

    return url + diffs;
    //return 'http://localhost:6007/v1/svg/network/' + networkId + '/vl/' + this.vlId;
  }

}
