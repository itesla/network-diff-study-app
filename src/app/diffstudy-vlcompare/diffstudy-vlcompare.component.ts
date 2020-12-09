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
import {
  FeatureGroup,
  icon,
  latLng,
  Map,
  marker,
  point,
  tileLayer
} from 'leaflet';

@Component({
  selector: 'comparevl',
  templateUrl: './diffstudy-vlcompare.component.html',
  styleUrls: ['./diffstudy-vlcompare.component.css']
})

export class DiffstudyVlcompareComponent implements OnInit {
  network1: string;
  network2: string;
  vlId: string;
  subsDict = {};
  diffResult: NetworkDiffResponse;
  studies: Diffstudy[];
  study: Object;
  vlevels: string[];
  showDiagram: boolean;

  mapOptions: any;
  streetmap: any;
  markersFeaturesGroup: FeatureGroup = new FeatureGroup();
  franceCenteredCoords = latLng(46.624738528968436, 2.4264306819068198);

  map: Map;

  constructor(protected apiService: ApiService, protected diffstudyService: DiffstudyService) {
  }

  ngOnInit(): void {
    this.streetmap = tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      {
        maxZoom: 18,
        detectRetina: true,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      });

    this.mapOptions = {
      layers: [this.streetmap, this.markersFeaturesGroup],
      zoom: 6,
      center: this.franceCenteredCoords
    };

    this.diffstudyService.getDiffstudyList().subscribe(studiesListRes => {
      this.studies = studiesListRes;
    });
  }

  onChangeDiffStudy(study) {
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

  networkDiff() {
    let network1Uuid = "";
    let network2Uuid = "";
    let showDiagram = false;
    let diffResult: NetworkDiffResponse;

    //clean global status
    this.network1 = network1Uuid;
    this.network2 = network2Uuid;
    this.showDiagram = showDiagram;
    this.diffResult = diffResult;

    this.diffstudyService.getDiffstudy(this.study['studyName']).subscribe(diffStudyRes => {
      network1Uuid = diffStudyRes['network1Uuid'];
      network2Uuid = diffStudyRes['network2Uuid'];
      this.apiService.networksNetwork1UuidDiffNetwork2UuidVlVlIdPost(network1Uuid, network2Uuid, this.vlId)
        .subscribe(diffNetworksVlRes => {
          diffResult = diffNetworksVlRes;
          const vlevels = diffResult["diff.VoltageLevels"];
          let switchestatus = [];
          if (vlevels === undefined || vlevels.length == 0) {
            //same vl data
          } else {
            //vl data differs
            switchestatus = vlevels[0]["vl.switchesStatus-delta"];
            if (switchestatus === undefined || switchestatus.length == 0) {
              //same switches config
            } else {
              //switches config differs
              showDiagram = true;
            }
          }

          //set global status
          this.network1 = network1Uuid;
          this.network2 = network2Uuid;
          this.showDiagram = showDiagram;
          this.diffResult = diffResult;

          //shows substations markers on the map
          this.placeSubstationsMarkersMap(this.study['studyName']);
        });

    });
  }

  placeSubstationsMarkersMap(studyName: string) {
    this.markersFeaturesGroup.clearLayers();
    this.diffstudyService.getSubstationsCoords(studyName).subscribe(resGeo => {

      for (let i = 0; i < resGeo.length; i++) {
        let vlevelsHtml = '<h4>' + resGeo[i].id + '</h4>';
        for (let vli = 0; vli < this.subsDict[resGeo[i].id].length; vli++) {
          vlevelsHtml = vlevelsHtml + '<p>' + this.subsDict[resGeo[i].id][vli] + '</p>';
        }

        let substationMarker = marker([resGeo[i].coordinate.lat, resGeo[i].coordinate.lon], {
          icon: icon({
            iconSize: [30, 30],
            iconUrl: (this.subsDict[resGeo[i].id].includes(this.vlId)) ? 'assets/substation_blue.png' : 'assets/substation.png'
          })
        }).on('click', () => {
        }).bindPopup(vlevelsHtml);
        substationMarker.addTo(this.markersFeaturesGroup);
      }

      if (this.markersFeaturesGroup.getLayers().length >0) {
        this.map.fitBounds(this.markersFeaturesGroup.getBounds(), {
          padding: point(48, 48),
          animate: true
        });
      }

    });
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
        let url = 'http://localhost:6007/v1/svg/network/' + networkId + '/vl/' + this.vlId + "/";
        const diffs = this.diffResult["diff.VoltageLevels"][0]["vl.switchesStatus-delta"].join(',');
        return url + diffs;
      }
    }
  }

  onMapReady(map: Map) {
    this.map = map;
  }

}
