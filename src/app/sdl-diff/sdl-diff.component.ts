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
  @Input() subsId: string;

  svgPanZoom: any;

  constructor(protected apiService: NetworkDiffServerService, protected httpClient: HttpClient) {
  }

  inputDataOk(): boolean {
    if ((this.network1 === undefined || this.network1.length == 0) || (this.network2 === undefined || this.network2.length == 0)
      || (this.subsId === undefined || this.subsId.length == 0)) {
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

      let serviceUrl = `http://localhost:6007/v1/networks/${encodeURIComponent(String(this.network1))}/svgdiff/${encodeURIComponent(String(this.network2))}/sub/${encodeURIComponent(String(this.subsId))}`;
      //console.log("serviceUrl: " + serviceUrl);

      this.httpClient.get(serviceUrl, {
        headers: new HttpHeaders({
          'Content-Type': 'image/svg+xml'
        }),
        responseType: 'text' as 'text'
      })
        .subscribe((svgData: any) => {
          let inlineSvg = svgData.replace("<svg ", "<svg id='"+this.sdlId+"' viewbox='0 0 1600 800' style='display: inline; width: inherit; min-width: inherit; max-width: inherit; height: inherit; min-height: inherit; max-height: inherit; ' ");
          this.dataContainer.nativeElement.innerHTML = inlineSvg;

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

  getUrlSvgDiff() {
    if ((this.network1 === undefined || this.network1.length == 0) || (this.network2 === undefined || this.network2.length == 0)
      || (this.subsId === undefined || this.subsId.length == 0)) {
      return "";
    } else {
      let url = 'http://localhost:6007/v1/networks/' + this.network1 + '/svgdiff/' + this.network2 + '/sub/' + this.subsId;
      return url;
    }
  }

  ngAfterViewInit(): void {
    if (this.inputDataOk() == false) {
      //let initContent="<svg id='"+this.sdlId+"' viewbox='0 0 1600 800'></svg>";
      //let initContent="<svg id='"+this.sdlId+"' viewbox='0 0 1600 800' style='stroke: #000000;  font-size: 32px;'><text x='10' y='30'>please select a study and a substation</text></svg>";
      let initContent="please select a study and a substation";
      this.dataContainer.nativeElement.innerHTML = initContent;
    }

  }
}
