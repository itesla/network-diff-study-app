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
import {PreferencesComponent} from "../preferences/preferences.component";

@Component({
  selector: 'comparez',
  templateUrl: './diffstudy-zonecompare.component.html',
  styleUrls: ['./diffstudy-zonecompare.component.css']
})

export class DiffstudyZonecompareComponent implements OnInit, AfterViewInit, OnDestroy{
  studies: Diffstudy[];
  study: Diffstudy;
  threshold: number;
  voltageThreshold: number;
  showSpinner: boolean = false;
  alertMessage: string = "Loading, please wait";

  dmap: L.Map;

  overlayFeatureGroup: L.FeatureGroup = new L.FeatureGroup();
  franceCenteredCoords = L.latLng(46.624738528968436, 2.4264306819068198);
  controlLayers: L.Control.Layers;

  overlayLayersList = [];

  thTable: Object;
  legend: L.Control = null;

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

    //this.addLegend(this.dmap);
  }

  ngOnInit(): void {
    this.diffstudyService.getDiffstudyList().subscribe(studiesListRes => {
      this.studies = studiesListRes;
    });
    this.threshold = 0.0;
    this.voltageThreshold = 0.0;
    this.showSpinner = false;
  }

  networkDiff() {
    this.showSpinner = false;
    this.thTable = {
      "levels": JSON.parse(PreferencesComponent.getConfig(localStorage))
    }
    //console.log("levels " + JSON.stringify(this.thTable));
    this.addLegend(this.dmap);
    this.populateMap(this.study['studyName'], Math.abs(this.threshold), Math.abs(this.voltageThreshold), this.thTable);
  }

  populateMap(studyName: string, threshold: number, voltageThreshold: number, thTable: object) {
    this.showSpinner = true;

    this.overlayFeatureGroup.clearLayers();

    //remove the overlay entries from the control box
    this.overlayLayersList.forEach((item) => {
      this.controlLayers.removeLayer(item['layer']);
    });

    //empties the overlay list
    this.overlayLayersList = [];

    //retrieve the geoJsons
    this.diffstudyService.getGeoJsons(studyName, threshold, voltageThreshold, ["SUBS", "LINES", "LINES-SIMPLE"], thTable).subscribe(resGeoJsons => {
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
        let subColor = (feature.properties && feature.properties.subColor) ? feature.properties.subColor : 'black';
        return L.marker(
          latLng, {
            icon: L.divIcon({
              className: 'ship-div-icon',
              html: DiffstudyZonecompareComponent.subSvgIcon(subColor),
              iconAnchor: [12, 24],
              popupAnchor: [7, -16],
              iconSize: [30, 30]
            }),
            title: feature.properties.id
          });
      },
      onEachFeature: DiffstudyZonecompareComponent.getOnEachFeatureSubs()
    });
  }

  private static subSvgIcon(color: string): string {
    let retVal = '<svg width="40" height="40" viewBox="0 0 12 12">' +
      '<g transform="translate(0,-42.884277)">' +
      '<rect style="fill:#ffffff;stroke-width:0.28212407" id="rect589" width="5.1353698" height="5.8388457" x="2.8753936" y="46.429031" />' +
      '<path style="fill:' + color + ';stroke-width:0.0527857" d="M 0.8912887,50.834877 0.87749997,48.202142 0.43875099,48.186915 0,48.171707 v -0.466446 c 0,-0.39897 0.01463294,-0.476538 0.10110798,-0.536214 0.0556112,-0.03837 1.22983822,-1.012249 2.60939472,-2.16417 1.3795585,-1.151922 2.5403024,-2.094403 2.5794314,-2.094403 0.039129,0 1.2456068,0.978435 2.68106,2.174298 l 2.6099169,2.174299 0.0012,0.456317 0.0012,0.456319 -0.438749,0.01521 -0.4387465,0.01523 -0.013789,2.632735 -0.013789,2.632734 H 5.2915843 0.90507341 Z m 4.3471166,-0.225812 c 1.6533331,-1.782869 1.6466719,-1.775154 1.598733,-1.851568 -0.021978,-0.03503 -0.2247925,-0.05762 -0.5173367,-0.05762 -0.3981647,0 -0.4760891,-0.01309 -0.4516393,-0.07585 0.016241,-0.04172 0.3310703,-0.515757 0.6996013,-1.053416 0.3685309,-0.537658 0.6609465,-1.004529 0.649809,-1.037491 -0.024251,-0.07178 -2.4701607,-0.11141 -2.5801892,-0.04181 -0.092843,0.05873 -1.2948885,2.73152 -1.2748687,2.834714 0.012623,0.06502 0.1141812,0.08416 0.5108444,0.09627 l 0.4950998,0.01511 -0.035879,0.168261 c -0.019738,0.09254 -0.090911,0.345087 -0.1581764,0.561206 -0.15407,0.495035 -0.5068525,1.838198 -0.5057148,1.925433 4.02e-4,0.03602 0.030769,0.06542 0.067332,0.06533 0.036562,-1.05e-4 0.7126362,-0.696944 1.5023848,-1.548568 z" />' +
      '<path style="fill:#000000;stroke-width:0.0527857" d="M 0.89144548,50.834877 0.87765678,48.202142 0.43890579,48.186915 1.5681149e-4,48.171707 0.00254873,47.715388 0.00494066,47.259071 0.81357335,46.595598 C 1.2583202,46.230689 2.4431139,45.24636 3.4464491,44.408202 c 1.0033352,-0.838158 1.8337183,-1.523925 1.845296,-1.523925 0.011578,0 0.8419589,0.685767 1.8452941,1.523925 1.0033352,0.838158 2.1881309,1.822487 2.6328778,2.187396 l 0.808633,0.663473 0.0024,0.456317 0.0024,0.456319 -0.438749,0.01521 -0.4387555,0.01523 -0.013789,2.632735 -0.013789,2.632734 H 5.2917451 0.90523421 Z M 8.8676596,49.878708 c 0.00702,-1.584879 -0.00496,-2.90669 -0.026591,-2.937358 -0.09605,-0.136174 -3.4851898,-3.009215 -3.5497737,-3.009215 -0.064958,0 -3.4547083,2.874221 -3.5486204,3.008928 -0.048994,0.07028 -0.053766,5.762712 -0.00486,5.810883 0.019698,0.01941 1.6291184,0.02924 3.5764732,0.02183 l 3.5406466,-0.01347 z" />' +
      '</g></svg>'
    return retVal;
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
          popupContent += "<span class='same'>";
        } else {
          popupContent += "<span class='same'>";
        }
          popupContent += feature.properties.id + "</span></p>";
        if (feature.properties.vlevels) {
          popupContent += "<b>voltage levels:</b>";
          popupContent += "<table class=\"table table-bordered table-sm\">";
          feature.properties.vlevels.forEach(function (vlevel) {
            if (vlevel['isDifferent'] === "true") {
              let vlColor = vlevel['color'];
              popupContent += "<tr><td rowspan='2'><span style='color: " + vlColor + "'>" + vlevel['id'] +
                "</span></td><td><b>delta minV</b></td><td>" + vlevel['minVDelta'] + "</td><td>(" + vlevel['minVDeltaPerc'] + "%)</td></tr>";
              popupContent += "<tr><td><b>delta maxV</b></td><td>" + vlevel['maxVDelta'] + "</td><td>(" + vlevel['maxVDeltaPerc'] + "%)</td></tr>";
            } else {
              popupContent += "<tr><td><span class='same'>" + vlevel['id'] + "</span></td><td colspan='3'>no differences</td></tr>";
            }
          });
          popupContent += "</table>";
        }
      }
      //note that to make custom css work, css style declarations must be in global styles.css
      layer.bindPopup(popupContent, {
        'className' : 'subs-popup',
        'maxWidth' : 560
      });
    };
  }

  private static getOnEachFeatureLines() {
    return function (feature, layer) {
      let popupContent = "<p>no data available</p>";

      if (feature.properties && feature.properties.id && feature.properties.isDifferent) {
        if (feature.properties.isDifferent === "true") {
          popupContent = "<p><b>line:</b> <span class='same'>" + feature.properties.id + "</span></p>";
          popupContent += "<p><table class=\"table table-bordered table-sm\">" +
            "<tr><td><b>delta P1: </b></td><td>" + feature.properties.t1_dp + "</td><td>(" + feature.properties.t1_dp_perc + "%)</td></tr>" +
            "<tr><td><b>delta Q1: </b></td><td>" + feature.properties.t1_dq + "</td><td>(" + feature.properties.t1_dq_perc + "%)</td></tr>" +
            "<tr><td><b>delta I1: </b></td><td>" + feature.properties.t1_di + "</td><td>(" + feature.properties.t1_di_perc + "%)</td></tr>" +
            "<tr><td><b>delta P2: </b></td><td>" + feature.properties.t2_dp + "</td><td>(" + feature.properties.t2_dp_perc + "%)</td></tr>" +
            "<tr><td><b>delta Q2: </b></td><td>" + feature.properties.t2_dq + "</td><td>(" + feature.properties.t2_dq_perc + "%)</td></tr>" +
            "<tr><td><b>delta I2: </b></td><td>" + feature.properties.t2_di + "</td><td>(" + feature.properties.t2_di_perc + "%)</td></tr>" +
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
        'className' : 'lines-popup',
        'maxWidth' : 560
      });
    };
  }

  private addLegend(dmap: L.Map) {
    if (this.legend) {
      dmap.removeControl(this.legend);
    }
    let legend = new L.Control({position: 'bottomleft'});
    legend.onAdd = function (map) {
      let legendDiv = L.DomUtil.create('div', 'legenda-info legenda');
      let label = ['<strong>Current/Power % ; Voltage %</strong>'];
      let cats = [];
      let levels = JSON.parse(PreferencesComponent.getConfig(localStorage));
      for (let i = 0; i < levels.length; i++) {
        let level = levels[i];
        cats.push(level['i'] + '% ; ' + level['v'] + '%');
      }
      for (let i = 0; i < cats.length; i++) {
        legendDiv.innerHTML += label.push('<i style="background:' + levels[i]['c'] + '"></i> ' + (cats[i] ? cats[i] : '+'));
      }
      legendDiv.innerHTML = label.join('<br>');
      return legendDiv;
    };
    legend.addTo(dmap);
    this.legend = legend;
  }
}
