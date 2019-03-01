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
  { path: 'ftplog', component: FtpLogComponent }
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
