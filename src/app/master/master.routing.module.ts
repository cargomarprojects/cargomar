import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ParamComponent } from './param/param.component';
import { SysParamComponent } from './sysparam/sysparam.component';
import { CustomerComponent } from './customer/customer.component';

import { AddbookComponent } from './customer/addbook.component';

import { SettingsComponent } from './settings/settings.component';
import { DrawbackComponent } from './drawback/drawback.component';

import { RitcmComponent } from './ritcm/ritcm.component';
import { XmlComponent } from './xml/xml.component';
import { LinkmComponent } from './linkm/linkm.component';
import { Linkm2Component } from './linkm2/linkm2.component';
import { AllnumComponent } from './allnum/allnum.component';

import { BlFormaterComponent } from './blformat/blformater.component';
import { DespatchComponent } from './despatch/despatch.component';

import { CustdetComponent } from './customer/custdet.component';
import { UnLockComponent } from './unlock/unlock.component';

import { SearchShipmentComponent } from './searchshipment/searchshipment.component';

import { BankInfoComponent } from './bankinfo/bankinfo.component';
import { EsanchitComponent } from './esanchit/esanchit.component';
import { JobTransferComponent } from './jobtransfer/jobtransfer.component';
import { MailListComponent } from './maillist/maillist.component';
import { SeaBuyRateComponent } from './seabuyrate/seabuyrate.component';
import { LocalChargeComponent } from './localcharge/localcharge.component';
import { EfileUploadComponent } from './efileupload/efileupload.component';

const routes: Routes = [
    { path: 'param', component: ParamComponent },
    { path: 'sysparam', component: SysParamComponent },
    { path: 'customer', component: CustomerComponent },
    { path: 'addbook', component: AddbookComponent },
    { path: 'settings', component: SettingsComponent },
    { path: 'drawback', component: DrawbackComponent },
    { path: 'ritcm', component: RitcmComponent },
    { path: 'xml', component: XmlComponent },
    { path: 'linkm', component: LinkmComponent },
    { path: 'linkm2', component: Linkm2Component },
    { path: 'allnum', component: AllnumComponent },
    { path: 'blformat', component: BlFormaterComponent },
    { path: 'despatch', component: DespatchComponent },
    { path: 'custdet', component: CustdetComponent },
    { path: 'unlock', component: UnLockComponent },
    { path: 'searchshipment', component: SearchShipmentComponent },
    { path: 'bankinfo', component: BankInfoComponent },
    { path: 'esanchit', component: EsanchitComponent },
    { path: 'jobtransfer', component: JobTransferComponent },
    { path: 'maillist', component: MailListComponent },
    { path: 'seabuyrate', component: SeaBuyRateComponent },
    { path: 'localcharge', component: LocalChargeComponent },
    { path: 'efileupload', component: EfileUploadComponent },
];

@NgModule({
    imports: [
        RouterModule.forChild(routes)
    ],
    exports: [
        RouterModule
    ]
})
export class MasterRoutingModule {
}
