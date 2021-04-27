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
  control,
  Control,
  FeatureGroup,
  geoJSON,
  icon,
  latLng,
  Layer,
  Map,
  map,
  marker,
  point,
  tileLayer
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
  showSpinner: boolean = false;
  alertMessage: string = "Loading, please wait";

  map: Map;

  substationsLayer: FeatureGroup;
  linesLayer: FeatureGroup;
  linesSimpleViewLayer: FeatureGroup;
  featureGroup: FeatureGroup = new FeatureGroup();
  franceCenteredCoords = latLng(46.624738528968436, 2.4264306819068198);
  controlLayers: Control.Layers;

  constructor(protected apiService: NetworkDiffServerService, protected diffstudyService: DiffstudyService) {
  }

  removeExistingMapData(): void {
    if (this.map) {
      this.map.off();
      this.map.remove();
    }
  }

  ngOnDestroy(): void {
    this.removeExistingMapData();
  }

  addBaseLayers(aMap: Map): any {
    let openStreetTileLayer = tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      {
        maxZoom: 19,
        detectRetina: true,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      });

    let satelliteTileLayer = tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      {
        maxZoom: 19,
        detectRetina: true,
        attribution: '&copy; <a href="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer">Source: Esri, Maxar, GeoEye, Earthstar Geographics, CNES/Airbus DS, USDA, USGS, AeroGRID, IGN, and the GIS User Community </a> contributors'
      });

    let darkTileLayer = tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png',
      {
        maxZoom: 19,
        detectRetina: true,
        attribution: '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org">OpenMapTiles</a>, &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
      });

    //add the default base layer to the map
    openStreetTileLayer.addTo(aMap);

    return {
      "Dark": darkTileLayer,
      "Satellite": satelliteTileLayer,
      "OpenStreetMap": openStreetTileLayer
    };
  }

  ngAfterViewInit(): void {
    this.removeExistingMapData();

    this.map = map('map', {
      center: this.franceCenteredCoords,
      zoom: 6,
      attributionControl: true,
      layers:  [this.featureGroup]
    });

    let baseMaps = this.addBaseLayers(this.map);

    this.controlLayers = control.layers(baseMaps);
    this.controlLayers.addTo(this.map);
  }

  ngOnInit(): void {
    this.diffstudyService.getDiffstudyList().subscribe(studiesListRes => {
      this.studies = studiesListRes;
    });
    this.threshold = 0.0;
    this.showSpinner = false;
  }

  networkDiff() {
    this.showSpinner = false;
    this.populateMap(this.study['studyName'], Math.abs(this.threshold));
  }

  populateMap(studyName: string, threshold: number) {
    this.showSpinner = true;

    this.featureGroup.clearLayers();

    if (this.substationsLayer) {
      this.controlLayers.removeLayer(this.substationsLayer);
    }
    if (this.linesLayer) {
      this.controlLayers.removeLayer(this.linesLayer);
    }
    if (this.linesSimpleViewLayer) {
      this.controlLayers.removeLayer(this.linesSimpleViewLayer);
    }

    this.diffstudyService.getGeoJsons(studyName, threshold).subscribe(resGeo => {
      let subsLayer = JSON.parse(resGeo['layers'][0]);
      let linesDetailedLayer = JSON.parse(resGeo['layers'][1]);
      let linesSimpleLayer = JSON.parse(resGeo['layers'][2]);

      this.substationsLayer = geoJSON(subsLayer, {
        pointToLayer: function (feature, latLng): Layer {
          return marker(
            latLng, {
              icon: icon({
                iconSize: [30, 30],
                iconUrl: 'assets/substation.png'
              }),
              title: feature.properties.id
            });
        },
        onEachFeature: this.getOnEachFeatureSubs()
      });
      this.substationsLayer.addTo(this.featureGroup);

      //adapt map size to the bounding box delimited by the substation set
      if (this.featureGroup.getBounds().isValid()) {
        this.map.fitBounds(this.featureGroup.getBounds(), {
          padding: point(48, 48),
          animate: true
        });
      }

      this.controlLayers.addOverlay(this.substationsLayer, "Substations");


      this.linesLayer = geoJSON(linesDetailedLayer, {
        style: function (feature) {
          return feature.properties && feature.properties.style;
        },
        onEachFeature: this.getOnEachFeatureLines()
      });
      this.linesLayer.addTo(this.featureGroup);
      this.controlLayers.addOverlay(this.linesLayer, "Lines (detailed view)");


      this.linesSimpleViewLayer = geoJSON(linesSimpleLayer, {
        style: function (feature) {
          return feature.properties && feature.properties.style;
        },
        onEachFeature: this.getOnEachFeatureLines()
      });
      //do not add this layer to the map right now, so it is not displayed by default
      //this.linesLayer.addTo(this.featureGroup);
      //add it to the controls, so it can be checked and displayed
      this.controlLayers.addOverlay(this.linesSimpleViewLayer, "Lines (simple view)");

      this.showSpinner = false;
    });

  }

  private getOnEachFeatureSubs() {
    return function (feature, layer) {
      let popupContent = "<p>no data available</p>";

      if (feature.properties && feature.properties.id) {
        popupContent = "<p><b>substation:</b> <u>" + feature.properties.id + "</u></p>";
        if (feature.properties.vlevels) {
          popupContent += "<b>voltage levels:</b>";
          popupContent += "<table class=\"table table-bordered table-sm\">";
          feature.properties.vlevels.forEach(function (vlevel) {
            if (vlevel['isDifferent'] === "true") {
              popupContent += "<tr><td rowspan='2'><u>" + vlevel['id'] +
                "<u></td><td><b>delta minV</b></td><td>" + vlevel['minVDelta'] + "</td></tr>";
              popupContent += "<tr><td><b>delta maxV</b></td><td>" + vlevel['maxVDelta'] + "</td></tr>";
            } else {
              popupContent += "<tr><td><u>" + vlevel['id'] + "</u></td><td colspan='2'>no differences</td></tr>";
            }
          });
          popupContent += "</table>";
        }
      }
      layer.bindPopup(popupContent);
    };
  }

  private getOnEachFeatureLines() {
    return function (feature, layer) {
      let popupContent = "<p>no data available</p>";

      if (feature.properties && feature.properties.id && feature.properties.isDifferent) {
        popupContent = "<p><b>line:</b> <u>" + feature.properties.id + "</u></p>";
        if (feature.properties.isDifferent === "true") {
          popupContent += "<p><table class=\"table table-bordered table-sm\">" +
            "<tr><td><b>t1 delta p: </b></td><td>" + feature.properties.t1_dp + "</td></tr>" +
            "<tr><td><b>t1 delta q: </b></td><td>" + feature.properties.t1_dq + "</td></tr>" +
            "<tr><td><b>t1 delta i: </b></td><td>" + feature.properties.t1_di + "</td></tr>" +
            "<tr><td><b>t2 delta p: </b></td><td>" + feature.properties.t2_dp + "</td></tr>" +
            "<tr><td><b>t2 delta q: </b></td><td>" + feature.properties.t2_dq + "</td></tr>" +
            "<tr><td><b>t2 delta i: </b></td><td>" + feature.properties.t2_di + "</td></tr>" +
            "</table></p>";
        } else {
          popupContent += "<p>no differences between the two networks   </p>";
        }
      }

      layer.bindPopup(popupContent);
    };
  }
}
