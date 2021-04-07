/**
 * Copyright (c) 2021, RTE (http://www.rte-france.com)
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

  showSpinner: boolean = false;

  alertMessage: string = "Loading, please wait";

  showMap: boolean = false;

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
    this.showSpinner = false;
    this.showMap = false;
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
    this.showSpinner = false;
    this.showMap = true;

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
    this.showSpinner = true;

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
          var popupContent = "<p>no data available</p>";

          if (feature.properties && feature.properties.id) {
            popupContent = "<p><b>substation:</b> <u>" + feature.properties.id + "</u></p>";
            if (feature.properties.vlevels) {
              popupContent += "<b>v.levels:</b>";
              popupContent += '<ul class="list-group">';
              feature.properties.vlevels.forEach(function(vlevel) {
                popupContent += '<li class="list-group-item">'+ vlevel + '</li>';
              });
              popupContent += '</ul>';
            }
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
          var popupContent = "<p>no data available</p>";

          if (feature.properties && feature.properties.id && feature.properties.isDifferent ) {
            popupContent = "<p><b>line:</b> <u>" + feature.properties.id + "</u></p>";
            if (feature.properties.isDifferent === "true") {
              popupContent += "<p><table class=\"table table-bordered table-sm\">" +
              "<tr><td><b>t1 deltap: </b></td><td>" + feature.properties.t1_dp + "</td></tr>" +
              "<tr><td><b>t1 deltaq: </b></td><td>" + feature.properties.t1_dq + "</td></tr>" +
              "<tr><td><b>t1 deltai: </b></td><td>" + feature.properties.t1_di + "</td></tr>" +
              "<tr><td><b>t2 deltap: </b></td><td>" + feature.properties.t2_dp + "</td></tr>" +
              "<tr><td><b>t2 deltaq: </b></td><td>" + feature.properties.t2_dq + "</td></tr>" +
              "<tr><td><b>t2 deltai: </b></td><td>" + feature.properties.t2_di + "</td></tr>" +
              "</table></p>";
             } else {
              popupContent += "<p>no differences between the two networks   </p>";
            }
          }

          layer.bindPopup(popupContent);
        }
      });
      featureGroup.addTo(this.markersFeaturesGroup);

      this.controlLayers.addOverlay(featureGroup, "lines");
      this.controlLayers.addTo(this.map);

      this.showSpinner = false;
    });

  }

  onMapReady(map: Map) {
    this.map = map;
  }

}
