import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { MarketingRoutingModule } from './marketing.routing.module';
import { ContactsComponent } from './contacts/contacts.component';
import { MarketingComponent } from './marketing/marketing.component';
import { VisitReportComponent } from './marketing/visitreport.component';
import { VisitReportChildComponent } from './marketing/visitreportchild.component';

@NgModule({
  imports: [
    SharedModule,
    MarketingRoutingModule
  ],
  declarations: [
    ContactsComponent,
    MarketingComponent,
    VisitReportComponent,
    VisitReportChildComponent
  ],
  providers: [
  ],
})
export class MarketingModule { }
