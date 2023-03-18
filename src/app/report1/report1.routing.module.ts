import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TeuComponent } from './teu/teu.component';
import { TonnageComponent } from './tonnage/tonnage.component';
import { BkTeuComponent } from './bkteu/bkteu.component';
import { MonrepComponent } from './monrep/monrep.component';
import { CostPendingComponent } from './costpending/costpending.component';
import { CostOsComponent } from './costos/costos.component';
import { DsrComponent } from './dsr/dsr.component';
import { OsRepComponent } from './os/osrep.component';
import { GstComponent } from './gst/gst.component';


import { RebateComponent } from './rebate/rebate.component';
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
import { TdsosComponent} from './tdsos/tdsos.component';
import { TdsosPartyComponent} from './tdsos/tdsosparty.component';
import { TdsosDetComponent} from './tdsos/tdsosdet.component';
import { AuditLogComponent} from './auditlog/auditlog.component';

import { ArrivalNoticeComponent } from './arrivalnotice/arrivalnotice.component';
import { ShipTrackComponent } from './shiptrackrep/shiptrackrep.component';
import { EinvoiceComponent } from './einvoice/einvoice.component';
import { PreAlertRepComponent } from './prealertrep/prealertrep.component';
import { CostBillingComponent } from './costbilling/costbilling.component';
import { SalesFollowupComponent } from './salesfollowup/salesfollowup.component';
import { AddReportsComponent } from './addreports/addreports.component';
import { ShipDataParentComponent } from './shipdata/shipdataparent.component';
import { UsrRightsComponent } from './usrrights/usrrights.component';

const routes: Routes = [
  { path: 'teu', component: TeuComponent },
  { path: 'tonnage', component: TonnageComponent },
  { path: 'bkteu', component: BkTeuComponent },
  { path: 'monrep', component: MonrepComponent },
  { path: 'costpending', component: CostPendingComponent },
  { path: 'costos', component: CostOsComponent },
  { path: 'dsr', component: DsrComponent },
  { path: 'osrep', component: OsRepComponent },
  { path: 'gst', component: GstComponent },
  { path: 'rebate', component: RebateComponent },
  { path: 'egm', component: EgmComponent },
  { path: 'brok', component: BrokComponent },
  { path: 'teuclr', component: TeuClrComponent },
  { path: 'coststmt', component: CoststmtComponent },
  { path: 'track', component: TrackComponent },
  { path: 'dsrrem', component: DsrRemComponent },
  { path: 'tdscertreport', component: TdsCertReportComponent },
  { path: 'mapping', component: MappingComponent },
  { path: 'ftplog', component: FtpLogComponent },
  { path: 'tdspaidreport', component: TdspaidReportComponent },
  { path: 'tdsos', component: TdsosComponent},
  { path: 'tdsosparty', component: TdsosPartyComponent},
  { path: 'tdsosdet', component: TdsosDetComponent},
  { path: 'auditlog', component: AuditLogComponent},
  { path: 'arrivalnotice', component: ArrivalNoticeComponent},
  { path: 'shiptrack', component: ShipTrackComponent},
  { path: 'einvoice', component: EinvoiceComponent },
  { path: 'prealert', component: PreAlertRepComponent},
  { path: 'costbilling', component: CostBillingComponent },
  { path: 'salesfollowup', component: SalesFollowupComponent },
  { path: 'addreports', component: AddReportsComponent },
  { path: 'shipmentdata', component: ShipDataParentComponent },
  { path: 'usrrights', component: UsrRightsComponent }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class Report1RoutingModule {
}
