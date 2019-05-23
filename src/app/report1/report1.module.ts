import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';

import { Report1RoutingModule } from './report1.routing.module';

import { Report1Component } from './report1.component';
import { TeuComponent } from './teu/teu.component';
import { TonnageComponent } from './tonnage/tonnage.component';
import { BkTeuComponent } from './bkteu/bkteu.component';
import { MonrepComponent } from './monrep/monrep.component';
import { CostPendingComponent } from './costpending/costpending.component';

import { CostOsComponent } from './costos/costos.component';
import { DsrComponent } from './dsr/dsr.component';

import { OsRepComponent } from './os/osrep.component';
import { OsBranchWiseComponent } from './os/branchwise/branchwise.component';

import { OsSmanWiseComponent } from './os/smanwise/smanwise.component';


import { OsInvWiseComponent } from './os/invwise/invwise.component';

import { OsSmanBranchComponent } from './os/smanbranch/smanbranch.component';

import { GstComponent } from './gst/gst.component';

import { RebateComponent } from './rebate/rebate.component';

import { PostRebateComponent } from './rebate/postrebate.component';

import { EgmComponent } from './egm/egm.component';

import { BrokComponent } from './brok/brok.component';

import { TeuClrComponent } from './teuclr/teuclr.component';

import { CoststmtComponent } from './coststmt/coststmt.component';

import { TrackComponent } from './track/track.component';

import { DsrRemComponent } from './dsr/dsrrem.component';
import { TdsCertReportComponent } from './tdscertreport/tdscertreport.component';
import { MappingComponent } from './mapping/mapping.component';
import { FtpLogComponent } from './ftplog/ftplog.component';
import { TdspaidReportComponent } from './tdspaidreport/tdspaidreport.component';
import { TdspaidDetComponent} from './tdspaidreport/tdspaiddet.component';
import { TdsosComponent} from './tdsos/tdsos.component';
import { TdsosPartyComponent} from './tdsos/tdsosparty.component';
import { TdsosDetComponent} from './tdsos/tdsosdet.component';
@NgModule({
  imports: [
    SharedModule,
    Report1RoutingModule
  ],
  declarations: [
    Report1Component,
    TeuComponent,
    TonnageComponent,
    BkTeuComponent,
    MonrepComponent,
    CostPendingComponent,
    CostOsComponent,
    DsrComponent,
    OsRepComponent,
    OsBranchWiseComponent,
    OsSmanWiseComponent,
    OsInvWiseComponent,
    OsSmanBranchComponent,
    GstComponent,
    RebateComponent,
    PostRebateComponent,
    EgmComponent,
    BrokComponent,
    TeuClrComponent,
    CoststmtComponent,
    TrackComponent,
    DsrRemComponent,
    TdsCertReportComponent,
    MappingComponent,
    FtpLogComponent,
    TdspaidReportComponent,
    TdspaidDetComponent,
    TdsosComponent,
    TdsosPartyComponent,
    TdsosDetComponent
  ],
  providers: [
  ],
})
export class Report1Module { }
