import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ClearingComponent } from './clearing.component';
import { JobComponent } from './job/job.component';
import { JobOperationsComponent } from './job/operations/joboperations.component';
import { OrderListComponent } from './job/orderlist/orderlist.component';
import { AgentBookComponent } from './job/agentbook/agentbook.component';
import { WeekPlanningComponent } from './job/weekplanning/weekplanning.component';
import {EdiOrderComponent } from './job/ediorder/ediorder.component';
import { OnlineTrackComponent } from './job/onlinetrack/onlinetrack.component';
import { OnlineTrackMasterComponent } from './job/onlinetrackmaster/onlinetrackmaster.component';
import { OnlineTrackMaster2Component } from './job/onlinetrackmaster2/onlinetrackmaster2.component';
import { EdijobComponent } from './job/edijob/edijob.component';

const routes: Routes = [
  { path: 'clearing', component: ClearingComponent },
  { path: 'jobm', component: JobComponent },
  { path: 'jobopr', component: JobOperationsComponent },
  { path: 'orderlist', component: OrderListComponent },
  { path: 'orderbook', component: AgentBookComponent },
  { path: 'weekplanning', component: WeekPlanningComponent },
  { path: 'ediorders', component: EdiOrderComponent },
  { path: 'onlinetrack', component: OnlineTrackComponent },
  { path: 'onlinetrackmaster', component: OnlineTrackMasterComponent },
  { path: 'onlinetrackmaster2', component: OnlineTrackMaster2Component },
  { path: 'edijob', component: EdijobComponent }
];

@NgModule({
    imports: [
        RouterModule.forChild(routes)
    ],
    exports: [
        RouterModule
    ]
})
export class ClearingRoutingModule {
}
