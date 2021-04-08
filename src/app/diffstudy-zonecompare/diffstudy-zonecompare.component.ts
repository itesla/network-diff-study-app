/**
 * Copyright (c) 2021, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import {AfterViewInit, Component, OnDestroy, OnInit} from '@angular/core';
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
  geoJSON, Layer, control, Control, map
} from 'leaflet';

@Component({
  selector: 'comparez',
  templateUrl: './diffstudy-zonecompare.component.html',
  styleUrls: ['./diffstudy-zonecompare.component.css']
})

export class DiffstudyZonecompareComponent implements OnInit, AfterViewInit, OnDestroy{
  studies: Diffstudy[];
  study: Diffstudy;
  threshold: number;
  thresholdS: number;
  showSpinner: boolean = false;
  alertMessage: string = "Loading, please wait";

  map: Map;

  streetmap: any;
  markersFeaturesGroup: FeatureGroup = new FeatureGroup();
  franceCenteredCoords = latLng(46.624738528968436, 2.4264306819068198);
  controlLayers: Control.Layers = control.layers({}, {});

  constructor(protected apiService: NetworkDiffServerService, protected diffstudyService: DiffstudyService) {
  }

  ngOnDestroy(): void {
    if (this.map) {
      this.map.off();
      this.map.remove();
    }
  }

  ngAfterViewInit(): void {
    if (this.map) {
      this.map.off();
      this.map.remove();
    }
    this.streetmap = tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      {
        maxZoom: 18,
        detectRetina: true,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      });

    this.map = map('map', {
      center: this.franceCenteredCoords,
      zoom: 6,
      attributionControl: false,
      layers:  [this.streetmap, this.markersFeaturesGroup]
    });
  }

  ngOnInit(): void {
    this.diffstudyService.getDiffstudyList().subscribe(studiesListRes => {
      this.studies = studiesListRes;
    });

    this.threshold = 0.0;
    this.thresholdS = this.threshold;
    this.showSpinner = false;
  }

  onChangeDiffStudy(study) {
  }

  networkDiff() {
    //clean global status
    this.showSpinner = false;
    this.thresholdS = Math.abs(this.threshold);

    this.diffstudyService.getDiffstudy(this.study['studyName']).subscribe(diffStudyRes => {
      this.populateMap(this.study['studyName']);
    });
  }

  populateMap(studyName: string) {
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
}
