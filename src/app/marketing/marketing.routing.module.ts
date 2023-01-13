import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ContactsComponent } from './contacts/contacts.component';
import { MarketingComponent } from './marketing/marketing.component';
import { VisitReportComponent } from './marketing/visitreport.component';
import { SalesleadComponent } from './saleslead/saleslead.component';
import { SalesVolumeComponent } from './salesvolume/salesvolume.component';
import { NewCustComponent } from './newcustomer/newcust.component';
import { QtnLclComponent } from './qtnlcl/qtnlcl.component';

const routes: Routes = [
    { path: 'markcontacts', component: ContactsComponent },
    { path: 'markmarketing', component: MarketingComponent },
    { path: 'markvisitrpt', component: VisitReportComponent },
    { path: 'marksaleslead', component: SalesleadComponent },
    { path: 'marksalesvolume', component: SalesVolumeComponent },
    { path: 'qtnlcl', component: QtnLclComponent },
    { path: 'newcustomer', component: NewCustComponent }
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
