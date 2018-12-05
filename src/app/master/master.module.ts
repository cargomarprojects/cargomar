import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';


import { MasterRoutingModule } from './master.routing.module';

import { MasterComponent } from './master.component';
import { ParamComponent } from './param/param.component';
import { CustomerComponent } from './customer/customer.component';

import { AddbookComponent } from './customer/addbook.component';

import { AddressmComponent } from './customer/addressm.component';

import { SettingsComponent } from './settings/settings.component';

import { DrawbackComponent } from './drawback/drawback.component';

import { RitcmComponent } from './ritcm/ritcm.component';
import { XmlComponent } from './xml/xml.component';
import { LinkmComponent } from './linkm/linkm.component';
import { LinkupdateComponent } from './linkm/linkupdate.component';
import { AllnumComponent } from './allnum/allnum.component';

import { BlFormaterComponent } from './blformat/blformater.component';
import { DespatchComponent } from './despatch/despatch.component';
import { CustdetComponent } from './customer/custdet.component';
import { UnLockComponent } from './unlock/unlock.component';
import { SearchShipmentComponent } from './searchshipment/searchshipment.component';
import { BankInfoComponent } from './bankinfo/bankinfo.component';
import { EsanchitComponent } from './esanchit/esanchit.component';
import { EsanchitDownloadComponent } from './esanchit/esanchitdownload.component';

@NgModule({
  imports: [
    SharedModule,
    MasterRoutingModule
  ],
  declarations: [
    MasterComponent,
    ParamComponent,
    CustomerComponent,
    AddbookComponent,
    AddressmComponent,
    SettingsComponent,
    DrawbackComponent,
    RitcmComponent,
    XmlComponent,
    LinkmComponent,
    LinkupdateComponent,
    AllnumComponent,
    BlFormaterComponent,
    DespatchComponent,
    CustdetComponent,
    UnLockComponent,
    SearchShipmentComponent,
    BankInfoComponent,
    EsanchitComponent,
    EsanchitDownloadComponent
  ],
  providers: [
  ],
})
export class MasterModule { }
