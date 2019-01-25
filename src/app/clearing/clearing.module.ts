import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { ClearingRoutingModule } from './clearing.routing.module';
import { ClearingComponent } from './clearing.component';

import { JobComponent } from './job/job.component';
import { JobInvoiceComponent } from './job/invoice/jobinvoice.component';
import { EouComponent } from './job/annexure/annexure.component';
import { ItemComponent } from './job/item/item.component';
import { ItemDetComponent } from './job/itemdet/itemdet.component';
import { JobOperationsComponent } from './job/operations/joboperations.component';
import { JobOrderComponent } from './job/order/joborder.component';
import { JobPackingListComponent } from './job/packinglist/jobpackinglist.component';
import { JobContainerComponent } from './job/container/jobcontainer.component';
import { ItemLicenseComponent } from './job/license/itemlicense.component';
import { CheckSbComponent } from './job/checksb/checksb.component';
import { BlComponent } from './job/seabl/jobseabl.component';
import { OrderListComponent } from './job/orderlist/orderlist.component';
import { EsanchitLinkComponent } from './job/esanchitlink/esanchitlink.component';
import { AgentBookComponent } from './job/agentbook/agentbook.component';
import { TrackOrderComponent } from './job/trackorder/trackorder.component';
import { WeekPlanningComponent } from './job/weekplanning/weekplanning.component';
import {EdiOrderComponent } from './job/ediorder/ediorder.component';


@NgModule({
  imports: [
    SharedModule,
    ClearingRoutingModule
  ],
  declarations: [
    ClearingComponent,
    JobComponent,
    JobInvoiceComponent,
    ItemComponent,
    ItemDetComponent,
    EouComponent,
    JobOperationsComponent,
    JobOrderComponent,
    JobPackingListComponent,
    JobContainerComponent,
    ItemLicenseComponent,
    CheckSbComponent,
    BlComponent,
    OrderListComponent,
    EsanchitLinkComponent,
    AgentBookComponent,
    TrackOrderComponent,
    WeekPlanningComponent,
    EdiOrderComponent
  ],
  providers: [
  ],
})
export class ClearingModule { }
