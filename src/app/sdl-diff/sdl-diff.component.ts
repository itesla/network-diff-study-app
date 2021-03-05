import {AfterViewInit, Component, ElementRef, Input, OnChanges, OnInit, ViewChild, ViewChildren} from '@angular/core';
import {NetworkDiffServerService} from '../api-diff-client/api/api';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import * as SvgPanZoom from 'svg-pan-zoom';


@Component({
  selector: 'app-sdl-diff',
  templateUrl: './sdl-diff.component.html',
  styleUrls: ['./sdl-diff.component.css']
})
export class SdlDiffComponent implements OnInit, OnChanges, AfterViewInit {

  @Input() sdlId: string;
  @Input() network1: string;
  @Input() network2: string;
  @Input() pId: string;
  @Input() pType: string;

  svgPanZoom: any;

  constructor(protected apiService: NetworkDiffServerService, protected httpClient: HttpClient) {
  }

  inputDataOk(): boolean {
    if ((this.network1 === undefined || this.network1.length == 0) || (this.network2 === undefined || this.network2.length == 0)
      || (this.pId === undefined || this.pId.length == 0)
      || (this.pType === undefined || this.pType.length == 0)) {
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
      this.dataContainer.nativeElement.innerHTML = "Loading ..."

      let compServiceType = (this.pType === 'vl') ? 'vl' : 'sub';
      let serviceUrl = `http://localhost:6007/v1/networks/${encodeURIComponent(String(this.network1))}/svgdiff/${encodeURIComponent(String(this.network2))}/${compServiceType}/${encodeURIComponent(String(this.pId))}`;
      //console.log("serviceUrl: " + serviceUrl);

      this.httpClient.get(serviceUrl, {
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
          let svgHead = `<svg id='${this.sdlId}' viewbox='${viewBox}' style='${svgStyle}'`;
          this.dataContainer.nativeElement.innerHTML = svgData.replace("<svg ", svgHead);

          if (this.sdlId != undefined) {
            let svgPanZoom: SvgPanZoom.Instance = SvgPanZoom('#'+this.sdlId, {
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
