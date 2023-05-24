import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ContactsComponent } from './contacts/contacts.component';
import { MarketingComponent } from './marketing/marketing.component';
import { VisitReportComponent } from './marketing/visitreport.component';
import { SalesleadComponent } from './saleslead/saleslead.component';
import { SalesVolumeComponent } from './salesvolume/salesvolume.component';
import { NewCustComponent } from './newcustomer/newcust.component';
import { QuotationComponent } from './quotation/quotation.component';
import { QuotationAirComponent } from './quotation/quotation-air.component';
import { BizDevtReportComponent } from './marketing/bizdevtreport.component';
import { QuotationFclComponent } from './quotation/quotation-fcl.component';

const routes: Routes = [
    { path: 'markcontacts', component: ContactsComponent },
    { path: 'markmarketing', component: MarketingComponent },
    { path: 'markvisitrpt', component: VisitReportComponent },
    { path: 'marksaleslead', component: SalesleadComponent },
    { path: 'marksalesvolume', component: SalesVolumeComponent },
    { path: 'quotation', component: QuotationComponent },
    { path: 'newcustomer', component: NewCustComponent },
    { path: 'quotationair', component: QuotationAirComponent },
    { path: 'quotationfcl', component: QuotationFclComponent },
    { path: 'bizdevtreport', component: BizDevtReportComponent }
];

@NgModule({
    imports: [
        RouterModule.forChild(routes)
    ],
    exports: [
        RouterModule
    ]
})
export class MarketingRoutingModule {
}
