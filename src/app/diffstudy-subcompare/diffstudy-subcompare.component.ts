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

  mapOptions: any;
  streetmap: any;
  markersFeaturesGroup: FeatureGroup = new FeatureGroup();
  franceCenteredCoords = latLng(46.624738528968436, 2.4264306819068198);

  map: Map;

  showDiagram: boolean = false;

  constructor(protected apiService: NetworkDiffServerService, protected diffstudyService: DiffstudyService) {
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

    this.showDiagram = false;
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
    let network1Uuid = "";
    let network2Uuid = "";
    let diffResult: {};

    //clean global status
    this.network1 = network1Uuid;
    this.network2 = network2Uuid;
    this.diffResult = diffResult;
    this.showDiagram = true;

    this.diffstudyService.getDiffstudy(this.study['studyName']).subscribe(diffStudyRes => {
      //console.log("$$ getDiffStudy");
      network1Uuid = diffStudyRes['network1Uuid'];
      network2Uuid = diffStudyRes['network2Uuid'];

      this.apiService.diffSubstationUsingGET(network1Uuid, network2Uuid, this.subId)
        .subscribe(diffNetworksVlRes => {
          //console.log("$$ diffSubstationUsingGET");
          diffResult = diffNetworksVlRes;
          const vlevels = diffResult["diff.VoltageLevels"];
          const branches = diffResult["diff.Branches"];

          //set global status
          this.network1 = network1Uuid;
          this.network2 = network2Uuid;
          this.diffResult = diffResult;

          this.network1s = network1Uuid;
          this.network2s = network2Uuid;
          this.subIds = this.subId;
          this.network1Names = this.getStudyAttributeOrEmptyString("network1Id");
          this.network2Names = this.getStudyAttributeOrEmptyString("network2Id");

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
            iconUrl: (resGeo[i].id.includes(this.subId)) ? 'assets/substation_blue.png' : 'assets/substation.png'
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

  onMapReady(map: Map) {
    this.map = map;
  }

}
