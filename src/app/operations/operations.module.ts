import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';


import { OperationsRoutingModule } from './operations.routing.module';
import { OperationsComponent } from './operations.component';

import { HblSeaAirComponent } from './hblseaair/hblseaair.component';
import { MblSeaComponent } from './mblsea/mblsea.component';
import { ContainerComponent } from './container/container.component';
import { GenJobComponent } from './genjob/genjob.component';
import { MblAirComponent } from './mblair/mblair.component';
import { PackingComponent } from './packing/packing.component';
import { BlComponent } from './hblseaair/seabl/seabl.component';
import { AirBlComponent } from './hblseaair/airbl/airbl.component';

import { JobIncomeComponent } from './jobincome/jobincome.component';

import { ImpMblSeaAirComponent } from './import/impmblseaair.component';
import { ImpHblSeaAirComponent } from './import/imphblseaair/imphblseaair.component';
import { ImpContainerComponent } from './import/container/impcontainer.component';
import { TrackingComponent } from './tracking/tracking.component';
import { StuffingComponent } from './stuffing/stuffing.component';
import { VesselLoadingComponent } from './vesselloading/vesselloading.component';
import { LandingCertificateComponent } from './landingcertificate/landingcertificate.component';
import { PreAlertComponent } from './prealert/prealert.component';
import { AirPreAlertComponent } from './prealert/airprealert.component';

import { BillingComponent } from './billing/billing.component';
import { PaymentComponent } from './billing/payment.component';
import { BuyRateComponent } from './billing/buyrate.component';
import { AirCostComponent } from './mblair/aircost/aircost.component';
import { CostingComponent } from './costing/costing.component';
import { AirCostingComponent } from './costing/air/aircosting.component';
import { DrCrComponent } from './costing/drcr/drcr.component';
import { AgentInvoiceComponent } from './costing/agentinvoice/agentinvoice.component';
import { PostingComponent } from './costing/posting/posting.component';
import { CostUpdateComponent } from './costing/costupdate/costupdate.component';
import { ImpJobComponent } from './import/impjob/impjob.component';
import { CostInvoiceComponent } from './costing/costinvoice/costinvoice.component';
import { ConsolerateComponent } from './costing/consolerate/consolerate.component';
import { ConsoleCostingComponent } from './costing/consolecosting/consolecosting.component';
import { ConsoleEditorComponent } from './costing/consoleeditor/consoleeditor.component';
import { BkmPaymentComponent } from './mblsea/bkmpayment.component';

@NgModule({
  imports: [
    SharedModule,
    OperationsRoutingModule
  ],
  declarations: [
    OperationsComponent,
    HblSeaAirComponent,
    MblSeaComponent,
    ContainerComponent,
    GenJobComponent,
    MblAirComponent,
    PackingComponent,
    BlComponent,
    AirBlComponent,
    JobIncomeComponent,
    ImpMblSeaAirComponent,
    ImpHblSeaAirComponent,
    ImpContainerComponent,
    TrackingComponent,
    StuffingComponent,
    VesselLoadingComponent,
    LandingCertificateComponent,
    PreAlertComponent,
    AirPreAlertComponent,
    BillingComponent,
    PaymentComponent,
    BuyRateComponent,
    AirCostComponent,
    AirCostingComponent,
    CostingComponent,
    DrCrComponent,
    PostingComponent,
    AgentInvoiceComponent,
    CostUpdateComponent,
    ImpJobComponent,
    CostInvoiceComponent,
    ConsolerateComponent,
    ConsoleCostingComponent,
    ConsoleEditorComponent,
    BkmPaymentComponent
  ],
  providers: [
  ],
})
export class OperationsModule { }
