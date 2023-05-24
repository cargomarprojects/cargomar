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
import { QuotationComponent } from './quotation/quotation.component';
import { QuotationAirComponent } from './quotation/quotation-air.component';
import { BizDevtReportComponent } from './marketing/bizdevtreport.component';
import { QuotationFclComponent } from './quotation/quotation-fcl.component';
 
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
    QuotationComponent,
    BizDevtReportComponent,
    QuotationAirComponent,
    QuotationFclComponent
  ],
  providers: [
    MarkMarketingService
  ],
})
export class MarketingModule { }
