/**
 * Copyright (c) 2020, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import {TabViewModule} from 'primeng/tabview';

import { DiffstudyListComponent } from './diffstudy-list/diffstudy-list.component';
import { DiffstudyDetailsComponent } from './diffstudy-details/diffstudy-details.component';
import { SearchCasesComponent } from './search-cases/search-cases.component';
import { CreateDiffstudyComponent } from './create-diffstudy/create-diffstudy.component';

import { Observable } from 'rxjs/Observable';

import { ApiModule } from './api-diff-client/api.module';
import { DiffstudyVlcompareComponent } from './diffstudy-vlcompare/diffstudy-vlcompare.component';
import { NetworkDiffComponent} from "./network-diff/network-diff.component";
import {LeafletModule} from "@asymmetrik/ngx-leaflet";
import {EditDiffStudyComponent} from "./diffstudy-edit/edit-diffstudy.component";
import { DiffstudySubcompareComponent } from './diffstudy-subcompare/diffstudy-subcompare.component';
import { SdlDiffComponent } from './sdl-diff/sdl-diff.component';


@NgModule({
  declarations: [
    AppComponent,
    DiffstudyListComponent,
    DiffstudyDetailsComponent,
    SearchCasesComponent,
    CreateDiffstudyComponent,
    DiffstudyVlcompareComponent,
    NetworkDiffComponent,
    EditDiffStudyComponent,
    DiffstudySubcompareComponent,
    SdlDiffComponent
  ],
    imports: [
        BrowserModule,
        FormsModule,
        AppRoutingModule,
        HttpClientModule,
        ApiModule,
        TabViewModule,
        LeafletModule
    ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }


