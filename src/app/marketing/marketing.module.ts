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
    SalesVolumeComponent
  ],
  providers: [
    MarkMarketingService
  ],
})
export class MarketingModule { }
