import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { MarketingRoutingModule } from './marketing.routing.module';
import { ContactsComponent } from './contacts/contacts.component';
import { MarketingComponent } from './marketing/marketing.component';
import { VisitReportComponent } from './marketing/visitreport.component';
import { VisitReportChildComponent } from './marketing/visitreportchild.component';
import { SalesleadComponent } from './saleslead/saleslead.component';
import { ActionComponent } from './saleslead/action.component';
import { MarkMarketingService } from './services/markmarketing.service';
import { SalesVolumeComponent } from './salesvolume/salesvolume.component';
import { NewCustComponent } from './newcustomer/newcust.component';
import { QtnLclComponent } from './qtnlcl/qtnlcl.component';
import { QtnLclDetComponent } from './qtnlcl/qtnlcldet.component';

@NgModule({
  imports: [
    SharedModule,
    MarketingRoutingModule
  ],
  declarations: [
    ContactsComponent,
    MarketingComponent,
    VisitReportComponent,
    VisitReportChildComponent,
    SalesleadComponent,
    ActionComponent,
    SalesVolumeComponent,
    NewCustComponent,
    QtnLclComponent,
    QtnLclDetComponent
  ],
  providers: [
    MarkMarketingService
  ],
})
export class MarketingModule { }
