import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';

import { MasterRoutingModule } from './master.routing.module';

import { MasterComponent } from './master.component';
import { ParamComponent } from './param/param.component';

import { SysParamComponent } from './sysparam/sysparam.component';

import { CustomerComponent } from './customer/customer.component';

import { AddbookComponent } from './customer/addbook.component';

import { AddressmComponent } from './customer/addressm.component';

import { SettingsComponent } from './settings/settings.component';

import { DrawbackComponent } from './drawback/drawback.component';

import { RitcmComponent } from './ritcm/ritcm.component';
import { XmlComponent } from './xml/xml.component';
import { LinkmComponent } from './linkm/linkm.component';
import { Linkm2Component } from './linkm2/linkm2.component';

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
import { JobTransferComponent } from './jobtransfer/jobtransfer.component';
import { AddbookdelComponent  } from './customer/addbookdel.component';
import { BenfComponent   } from './customer/benf.component';
import { MailListComponent } from './maillist/maillist.component';
import { LocalChargeComponent } from './localcharge/localcharge.component';
import { UnlockJobComponent } from './customer/unlockjob.component';
import { BankInfo2Component } from './bankinfo/bankinfo2.component';
import { EfileUploadComponent } from './efileupload/efileupload.component';
import { AirBuyRateComponent } from './airbuyrate/airbuyrate.component';
import { SeaBuyRateComponent } from './seabuyrate/seabuyrate.component';
import { BuyrateImportComponent } from './airbuyrate/buyrateimport.component';
import { ChemCatgComponent } from './chemcatg/chemcatg.component';
import { ProcessReportComponent } from './processreport/processreport.component';

@NgModule({
  imports: [
    SharedModule,
    MasterRoutingModule
  ],
  declarations: [
    MasterComponent,
    ParamComponent,
    SysParamComponent,
    CustomerComponent,
    AddbookComponent,
    AddressmComponent,
    SettingsComponent,
    DrawbackComponent,
    RitcmComponent,
    XmlComponent,
    LinkmComponent,
    Linkm2Component,
    LinkupdateComponent,
    AllnumComponent,
    BlFormaterComponent,
    DespatchComponent,
    CustdetComponent,
    UnLockComponent,
    SearchShipmentComponent,
    BankInfoComponent,
    EsanchitComponent,
    EsanchitDownloadComponent,
    JobTransferComponent,
    AddbookdelComponent,
    BenfComponent,
    MailListComponent,
    SeaBuyRateComponent,
    LocalChargeComponent,
    UnlockJobComponent,
    BankInfo2Component,
    EfileUploadComponent,
    AirBuyRateComponent,
    BuyrateImportComponent,
    ChemCatgComponent,
    ProcessReportComponent
  ],
  providers: [
  ],
})
export class MasterModule { }
