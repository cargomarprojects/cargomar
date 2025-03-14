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
import {EdiOrdUpdateComponent} from './job/ediordupdate/ediordupdate.component';
import { InfoTypeComponent } from './job/singlewindow/infotype.component';
import { ConstComponent } from './job/singlewindow/const.component';
import { ProdComponent } from './job/singlewindow/prod.component';
import { CtrlComponent } from './job/singlewindow/ctrl.component';
import { OnlineTrackComponent } from './job/onlinetrack/onlinetrack.component';
import { OnlineTrackMasterComponent } from './job/onlinetrackmaster/onlinetrackmaster.component';
import { OnlineTrackMasterDetComponent } from './job/onlinetrackmaster/onlinetrackmasterdet.component';
import { BlDataComponent } from './job/bldata/bldata.component';
import { ItemCessComponent } from './job/itemcess/itemcess.component';
import { OnlineTrackMaster2Component } from './job/onlinetrackmaster2/onlinetrackmaster2.component';
import { OnlineTrackMasterDet2Component } from './job/onlinetrackmaster2/onlinetrackmasterdet2.component';
import { EdijobComponent } from './job/edijob/edijob.component';
import { EdifileComponent } from './job/edijob/edifile.component';
import { EdijobEditComponent } from './job/edijob/edit/edijob-edit.component';
import { EdiJobpackingEditComponent } from './job/edijob/edit/edijobpacking-edit.component';
import { ItemJobworkComponent } from './job/itemjobwork/itemjobwork.component';
import { ItemReExportComponent } from './job/itemreexport/itemreexport.component';
import { CartingOrderComponent } from './job/cartingorder/cartingorder.component';

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
    EdiOrderComponent,
    EdiOrdUpdateComponent,
    InfoTypeComponent,
    ConstComponent,
    ProdComponent,
    CtrlComponent,
    OnlineTrackComponent,
    OnlineTrackMasterComponent,
    OnlineTrackMasterDetComponent,
    BlDataComponent,
    ItemCessComponent,
    OnlineTrackMaster2Component,
    OnlineTrackMasterDet2Component,
    EdijobComponent,
    EdifileComponent,
    EdijobEditComponent,
    EdiJobpackingEditComponent,
    ItemJobworkComponent,
    ItemReExportComponent,
    CartingOrderComponent
  ],
  providers: [
  ],
})
export class ClearingModule { }
