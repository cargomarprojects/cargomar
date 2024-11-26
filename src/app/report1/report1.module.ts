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
import { AuditLogComponent} from './auditlog/auditlog.component';
import { MonRepUpdtComponent } from './monrep/monrepupdt.component';
import { ArrivalNoticeComponent } from './arrivalnotice/arrivalnotice.component';
import { ShipTrackComponent } from './shiptrackrep/shiptrackrep.component';
import { EinvoiceComponent } from './einvoice/einvoice.component';
import { PreAlertRepComponent } from './prealertrep/prealertrep.component';
import { PrealertUpdtComponent } from './prealertrep/prealertupdt.component';
import { CostBillingComponent } from './costbilling/costbilling.component';

import { SalesFollowupComponent } from './salesfollowup/salesfollowup.component';
import { SalesFollowupEditComponent } from './salesfollowup/salesfollowupedit.component';
import { SalesFollowupInvComponent } from './salesfollowup/salesfollowupinv.component';
import { TdspaidCertDetComponent} from './tdspaidreport/tdspaidcertdet.component';
import { AddReportsComponent } from './addreports/addreports.component';
import { ShipDataComponent } from './shipdata/shipdata.component';
import { ShipDataParentComponent } from './shipdata/shipdataparent.component';
import { ShipReportComponent } from './shipdata/shipreport.component';
import { UsrRightsComponent } from './usrrights/usrrights.component';
import { ShipmentReportComponent } from './shipmentrpt/shipmentrpt.component';
import { UnlockJobrptComponent} from './unlockjobrpt/unlockjobrpt.component';
import { GstDetComponent } from './gst/gstdet.component';
import { CostGstRptComponent } from './costgstrpt/costgstrpt.component';
import { GenReportComponent } from './genreport/genreport.component';
import { GstReconRepComponent } from './gstreconrep/gstreconrep.component';
import { GstReconRepDetComponent } from './gstreconrep/gstreconrepdet.component';

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
    TdsosDetComponent,
    AuditLogComponent,
    MonRepUpdtComponent,
    ArrivalNoticeComponent,
    ShipTrackComponent,
    EinvoiceComponent,
    PreAlertRepComponent,
    PrealertUpdtComponent,
    CostBillingComponent,
    SalesFollowupComponent,
    SalesFollowupEditComponent,
    SalesFollowupInvComponent,
    TdspaidCertDetComponent,
    AddReportsComponent,
    ShipDataComponent,
    ShipDataParentComponent,
    ShipReportComponent,
    UsrRightsComponent,
    ShipmentReportComponent,
    UnlockJobrptComponent,
    GstDetComponent,
    CostGstRptComponent,
    GenReportComponent,
    GstReconRepComponent,
    GstReconRepDetComponent
  ],
  providers: [
  ],
})
export class Report1Module { }
