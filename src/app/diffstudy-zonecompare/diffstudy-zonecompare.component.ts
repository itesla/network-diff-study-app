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
import * as L from 'leaflet';

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

  dmap: L.Map;

  overlayFeatureGroup: L.FeatureGroup = new L.FeatureGroup();
  franceCenteredCoords = L.latLng(46.624738528968436, 2.4264306819068198);
  controlLayers: L.Control.Layers;

  overlayLayersList = [];

  constructor(protected apiService: NetworkDiffServerService, protected diffstudyService: DiffstudyService) {
  }

  removeExistingMapData(): void {
    if (this.dmap) {
      this.dmap.off();
      this.dmap.remove();
    }
  }

  ngOnDestroy(): void {
    this.removeExistingMapData();
  }

  addBaseLayers(aMap: L.Map): any {
    let openStreetTileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      {
        maxZoom: 19,
        detectRetina: true,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      });

    let satelliteTileLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      {
        maxZoom: 19,
        detectRetina: true,
        attribution: '&copy; <a href="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer">Source: Esri, Maxar, GeoEye, Earthstar Geographics, CNES/Airbus DS, USDA, USGS, AeroGRID, IGN, and the GIS User Community </a> contributors'
      });

    let darkTileLayer = L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png',
      {
        maxZoom: 19,
        detectRetina: true,
        attribution: '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org">OpenMapTiles</a>, &copy; <a href="https://openstreetmap.org">OpenStreetMap</a> contributors'
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

    this.dmap = L.map('dmap', {
      center: this.franceCenteredCoords,
      zoom: 6,
      attributionControl: true,
      layers:  [this.overlayFeatureGroup]
    });

    let baseMaps = this.addBaseLayers(this.dmap);

    this.controlLayers = L.control.layers(baseMaps);
    this.controlLayers.addTo(this.dmap);
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

    this.overlayFeatureGroup.clearLayers();

    //remove the overlay entries from the control box
    this.overlayLayersList.forEach((item) => {
      this.controlLayers.removeLayer(item['layer']);
    });

    //empties the overlay list
    this.overlayLayersList = [];

    //retrieve the geoJsons
    this.diffstudyService.getGeoJsons(studyName, threshold, ["SUBS", "LINES", "LINES-SIMPLE"]).subscribe(resGeoJsons => {
      let layers = resGeoJsons['layers'];

      for (let i = 0; i < layers.length; i++) {
        let layerName = layers[i].name;
        let layerData = JSON.parse(layers[i].data);

        // console.log(layerName);
        // console.log(layerData.features.length);
        //   no data when layerData.features.length == 0

        switch (layerName) {
          case "SUBS":
            let substationsLayer = DiffstudyZonecompareComponent.createSubsOverlay(layerData);
            this.overlayLayersList.push({"id" : "Substations", "type" : layerName, "layer" : substationsLayer});

            //add this layer to the map, to have it displayed by default
            substationsLayer.addTo(this.overlayFeatureGroup);

            // adapt map size to the bounding box delimited by the substation set
            if (substationsLayer.getBounds().isValid()) {
              this.dmap.fitBounds(substationsLayer.getBounds(), {
                padding: L.point(48, 48),
                animate: true
              });
            }
            break;

          case "LINES":
            let linesLayer = DiffstudyZonecompareComponent.createLinesOverlay(layerData);
            this.overlayLayersList.push({"id" : "Lines (detailed view)", "type" : layerName, "layer" : linesLayer});

            //add this layer to the map, to have it displayed by default
            linesLayer.addTo(this.overlayFeatureGroup);
            break;

          case "LINES-SIMPLE":
            let linesSimpleViewLayer = DiffstudyZonecompareComponent.createLinesOverlay(layerData);
            this.overlayLayersList.push({"id" : "Lines (simple view)", "type" : layerName, "layer" : linesSimpleViewLayer});

            //do not add this layer to the map right now, so it is not displayed by default
            //linesSimpleViewLayer.addTo(this.featureGroup);
            break;

          default:
            console.log("unknown layer with name : " + layerName);
        }
      }

      //add layer to the controls, so it can be checked and displayed
      this.overlayLayersList.forEach((item) => {
        this.controlLayers.addOverlay(item['layer'], item['id']);
      });

      this.showSpinner = false;
    });

  }

  private static createSubsOverlay(data) : L.GeoJSON {
    return L.geoJSON(data, {
      pointToLayer: function (feature, latLng): L.Layer {
        return L.marker(
          latLng, {
            icon: L.icon({
              iconSize: [30, 30],
              iconUrl: feature.properties.isDifferent ? 'assets/substation_red.png' : 'assets/substation_blue.png'
            }),
            title: feature.properties.id
          });
      },
      onEachFeature: DiffstudyZonecompareComponent.getOnEachFeatureSubs()
    });
  }

  private static createLinesOverlay(data) : L.GeoJSON {
    return L.geoJSON(data, {
      style: function (feature) {
        return feature.properties && feature.properties.style;
      },
      onEachFeature: DiffstudyZonecompareComponent.getOnEachFeatureLines()
    });
  }

  private static getOnEachFeatureSubs() {
    return function (feature, layer) {
      let popupContent = "<p>no data available</p>";

      if (feature.properties && feature.properties.id) {
        popupContent = "<p><b>substation:</b> ";
        if (feature.properties.isDifferent) {
          popupContent += "<span class='different'>";
        } else {
          popupContent += "<span class='same'>";
        }
          popupContent += feature.properties.id + "</span></p>";
        if (feature.properties.vlevels) {
          popupContent += "<b>voltage levels:</b>";
          popupContent += "<table class=\"table table-bordered table-sm\">";
          feature.properties.vlevels.forEach(function (vlevel) {
            if (vlevel['isDifferent'] === "true") {
              popupContent += "<tr><td rowspan='2'><span class='different'>" + vlevel['id'] +
                "</span></td><td><b>delta minV</b></td><td>" + vlevel['minVDelta'] + "</td></tr>";
              popupContent += "<tr><td><b>delta maxV</b></td><td>" + vlevel['maxVDelta'] + "</td></tr>";
            } else {
              popupContent += "<tr><td><span class='same'>" + vlevel['id'] + "</span></td><td colspan='2'>no differences</td></tr>";
            }
          });
          popupContent += "</table>";
        }
      }
      //note that to make custom css work, css style declarations must be in global styles.css
      layer.bindPopup(popupContent, {
        'className' : 'subs-popup'
      });
    };
  }

  private static getOnEachFeatureLines() {
    return function (feature, layer) {
      let popupContent = "<p>no data available</p>";

      if (feature.properties && feature.properties.id && feature.properties.isDifferent) {
        if (feature.properties.isDifferent === "true") {
          popupContent = "<p><b>line:</b> <span class='different'>" + feature.properties.id + "</span></p>";
          popupContent += "<p><table class=\"table table-bordered table-sm\">" +
            "<tr><td><b>delta P1: </b></td><td>" + feature.properties.t1_dp + "</td></tr>" +
            "<tr><td><b>delta Q1: </b></td><td>" + feature.properties.t1_dq + "</td></tr>" +
            "<tr><td><b>delta I1: </b></td><td>" + feature.properties.t1_di + "</td></tr>" +
            "<tr><td><b>delta P2: </b></td><td>" + feature.properties.t2_dp + "</td></tr>" +
            "<tr><td><b>delta Q2: </b></td><td>" + feature.properties.t2_dq + "</td></tr>" +
            "<tr><td><b>delta I2: </b></td><td>" + feature.properties.t2_di + "</td></tr>" +
            "</table></p>";
        } else {
          popupContent = "<p><b>line:</b> <span class='same'>" + feature.properties.id + "</span></p>";
          popupContent += "<p>no differences between the two networks for this line</p>";
        }
      }
      // display line-id tip
      layer.bindTooltip(feature.properties.id, {sticky: true})

      //note that to make custom css work, css style declarations must be in global styles.css
      layer.bindPopup(popupContent, {
        'className' : 'lines-popup'
      });
    };
  }
}
