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
  tileLayer,
  geoJSON, Layer, control, Control
} from 'leaflet';

@Component({
  selector: 'comparez',
  templateUrl: './diffstudy-zonecompare.component.html',
  styleUrls: ['./diffstudy-zonecompare.component.css']
})

export class DiffstudyZonecompareComponent implements OnInit {
  network1: string;
  network2: string;

  network1s: string;
  network2s: string;
  network1Names: string;
  network2Names: string;

  studies: Diffstudy[];
  study: Object;

  mapOptions: any;
  streetmap: any;
  markersFeaturesGroup: FeatureGroup = new FeatureGroup();
  franceCenteredCoords = latLng(46.624738528968436, 2.4264306819068198);
  controlLayers: Control.Layers = control.layers({}, {});

  map: Map;

  threshold: number;
  thresholdS: number;

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

    this.threshold = 0.0;
    this.thresholdS = this.threshold;
  }

  onChangeDiffStudy(study) {
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
    let network1Uuid = "";
    let network2Uuid = "";

    this.network1 = network1Uuid;
    this.network2 = network2Uuid;

    this.thresholdS = Math.abs(this.threshold);

    this.diffstudyService.getDiffstudy(this.study['studyName']).subscribe(diffStudyRes => {
      network1Uuid = diffStudyRes['network1Uuid'];
      network2Uuid = diffStudyRes['network2Uuid'];
      this.placeElementsOnTheMap(this.study['studyName']);
    });
  }

  placeElementsOnTheMap(studyName: string) {
    this.markersFeaturesGroup.clearLayers();
    this.controlLayers.remove();
    this.controlLayers = control.layers({}, {});

    this.diffstudyService.getSubsCoordsGeoJson(studyName, this.thresholdS).subscribe(resGeo => {
      let featureGroup = geoJSON(resGeo, {
        pointToLayer: function(feature, latLng): Layer {
          return marker(
            latLng, {
              icon: icon({
                iconSize: [30, 30],
                iconUrl: 'assets/substation.png'
              }),
              title: feature.properties.id
            });
        },
        onEachFeature: function(feature, layer) {
          var popupContent = "<p></p>";

          if (feature.properties && feature.properties.popupContent) {
            popupContent += feature.properties.popupContent;
          }

          layer.bindPopup(popupContent);
        }
      });
      featureGroup.addTo(this.markersFeaturesGroup);

      //adapt map size to the substations set
      if (this.markersFeaturesGroup.getBounds().isValid()) {
        this.map.fitBounds(this.markersFeaturesGroup.getBounds(), {
          padding: point(48, 48),
          animate: true
        });
      }

      this.controlLayers.addOverlay(featureGroup, "substations");
    });

    this.diffstudyService.getLinesCoordsGeoJson(studyName, this.thresholdS).subscribe(resGeo => {
      let featureGroup = geoJSON(resGeo, {style: function (feature) {
          return feature.properties && feature.properties.style;
        },
        onEachFeature: function(feature, layer) {
          var popupContent = "<p></p>";

          if (feature.properties && feature.properties.popupContent) {
            popupContent += feature.properties.popupContent;
          }

          layer.bindPopup(popupContent);
        }
      });
      featureGroup.addTo(this.markersFeaturesGroup);

      this.controlLayers.addOverlay(featureGroup, "lines");
      this.controlLayers.addTo(this.map);
    });

  }

  onMapReady(map: Map) {
    this.map = map;
  }

}
