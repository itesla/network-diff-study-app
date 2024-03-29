import {AfterViewInit, Component, ElementRef, Input, OnChanges, OnInit, ViewChild, ViewChildren} from '@angular/core';
import {NetworkDiffServerService} from '../api-diff-client/api/api';
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import * as SvgPanZoom from 'svg-pan-zoom';


@Component({
  selector: 'app-sld-diff',
  templateUrl: './sld-diff.component.html',
  styleUrls: ['./sld-diff.component.css']
})
export class SldDiffComponent implements OnInit, OnChanges, AfterViewInit {

  @Input() sldId: string;
  @Input() network1: string;
  @Input() network2: string;
  @Input() pId: string;
  @Input() pType: string;
  @Input() threshold: number;
  @Input() voltageThreshold: number;
  @Input() thTable: Object;
  @Input() viewMode: number;

  svgPanZoom: any;

  constructor(protected apiService: NetworkDiffServerService, protected httpClient: HttpClient) {
  }

  inputDataOk(): boolean {
    if ((this.network1 === undefined || this.network1.length == 0) || (this.network2 === undefined || this.network2.length == 0)
      || (this.pId === undefined || this.pId.length == 0)
      || (this.pType === undefined || this.pType.length == 0)
      || (this.threshold === undefined)
      || (this.voltageThreshold === undefined)
      || (this.viewMode === undefined) || ((this.viewMode < 0) && (this.viewMode > 2))) {
      return false;
    } else {
      return true;
    }
  }

  @ViewChild('dataContainer') dataContainer: ElementRef;

  ngOnInit(): void {
  }

  ngOnChanges() {
    if (this.inputDataOk() == true) {
      this.dataContainer.nativeElement.innerHTML = "Loading ...";

      let diffType = "------";
      switch (this.viewMode) {
        case 0:
          diffType = "svgdiff";
          break;
        case 1:
          diffType = "mergedsvgdiff";
          break;
        case 2:
          diffType = "mergedsvgdiffcur";
          break;
      }

      let compServiceType = (this.pType === 'vl') ? 'vl' : 'sub';
      let serviceUrl = `/v1/networks/${encodeURIComponent(String(this.network1))}/${diffType}/${encodeURIComponent(String(this.network2))}/${compServiceType}/${encodeURIComponent(String(this.pId))}/${encodeURIComponent(String(this.threshold))}/${encodeURIComponent(String(this.voltageThreshold))}`;
      let httpParams = new HttpParams().set("levels", encodeURIComponent(JSON.stringify(this.thTable)));
      console.log("serviceUrl: " + serviceUrl);

      this.httpClient.get(serviceUrl, {
        params: httpParams,
        headers: new HttpHeaders({
          'Content-Type': 'image/svg+xml'
        }),
        responseType: 'text' as 'text'
      }).subscribe((svgData: any) => {
          let svgStyle = "display: inline; width: inherit; min-width: inherit; max-width: inherit; height: inherit; min-height: inherit; max-height: inherit; ";
          let viewBox = "0 0 1600 750";
          if (this.pType === 'vl') {
            viewBox = "0 0 1000 650";
          }
          let svgHead = `<svg id='${this.sldId}' viewbox='${viewBox}' style='${svgStyle}'`;
          this.dataContainer.nativeElement.innerHTML = svgData.replace("<svg ", svgHead);

          if (this.sldId != undefined) {
            let svgPanZoom: SvgPanZoom.Instance = SvgPanZoom('#'+this.sldId, {
              zoomEnabled: true,
              controlIconsEnabled: true,
              fit: true,
              center: true
            });
            svgPanZoom.updateBBox();
            this.svgPanZoom=svgPanZoom;
          }
        });
    }
  }

  ngAfterViewInit(): void {
    if (this.inputDataOk() == false) {
      let initContent="please select a study and a component";
      this.dataContainer.nativeElement.innerHTML = initContent;
    }
  }
}
