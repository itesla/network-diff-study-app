/**
 * Copyright (c) 2020, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {DiffstudyListComponent} from './diffstudy-list/diffstudy-list.component';
import {SearchCasesComponent} from './search-cases/search-cases.component';
import {CreateDiffstudyComponent} from './create-diffstudy/create-diffstudy.component';
import {DiffstudyVlcompareComponent} from './diffstudy-vlcompare/diffstudy-vlcompare.component';
import {NetworkDiffComponent} from "./network-diff/network-diff.component";
import {EditDiffStudyComponent} from "./diffstudy-edit/edit-diffstudy.component";

const routes: Routes = [
  {path: '', redirectTo: 'diffstudy', pathMatch: 'full'},
  {path: 'diffstudy', component: DiffstudyListComponent},
  {path: 'searchcase', component: SearchCasesComponent},
  {path: 'createstudy', component: CreateDiffstudyComponent},
  {path: 'comparevl', component: DiffstudyVlcompareComponent},
  {path: 'network-diff', component: NetworkDiffComponent},
  {path: 'editStudy/:id', component: EditDiffStudyComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule {
}
