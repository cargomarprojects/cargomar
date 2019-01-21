import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { HttpClientModule } from '@angular/common/http';

import { AlertService } from './services/alert.service';
import { LovService } from './services/lov.service';
import { GenerateDocService } from './services/generatedoc.service';
import { GenService } from './services/gen.services';


import { AlertComponent } from './alert/alert.component';
import { AutoCompleteComponent } from './autocomplete/autocomplete.component';

import { AutoComplete2Component } from './autocomplete2/autocomplete2.component';


import { OsRemSharedComponent } from './osrem/osremshared.component';


import { DateComponent } from './date/date.component';

import { DialogComponent } from './dialog/dialog.component';
import { WaitComponent } from './dialog-wait/wait.component';

import { ErrorMessageComponent } from './error/errorMessage';


import { FileUploadComponent } from './fileupload/fileupload.component';

import { GenerateDocComponent } from './generatedoc/generatedoc.component';

import { ClipBoardComponent } from './clipboarddata/clipboard.component';

import { QtnComponent } from './qtn/qtn.component';

import { LoadQtnComponent } from './qtn/loadqtn.component';

import { MailComponent } from './mail/mail.component';
import { HistoryComponent } from './history/history.component';
import { ApprovalComponent } from './approval/approval.component';

import { PasteDataComponent } from './pastedata/pastedata.component';
import { PaymentReqComponent } from './paymentreq/paymentreq.component';
import { RateUpdateComponent } from './rateupdate/rateupdate.component';
import { XmlomsComponent } from './xmloms/xmloms.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    HttpModule,
    HttpClientModule,
    NgbModule
  ],
  declarations: [
    AlertComponent,
    AutoCompleteComponent,
    AutoComplete2Component,
    DateComponent,
    ErrorMessageComponent,
    DialogComponent,
    WaitComponent,
    FileUploadComponent,
    GenerateDocComponent,
    ClipBoardComponent,
    QtnComponent,
    LoadQtnComponent,
    MailComponent,
    HistoryComponent,
    OsRemSharedComponent,
    ApprovalComponent,
    PasteDataComponent,
    PaymentReqComponent,
    RateUpdateComponent,
    XmlomsComponent
  ],
  exports: [
    CommonModule,
    FormsModule,
    HttpModule,
    HttpClientModule,
    NgbModule,
    AlertComponent,
    AutoCompleteComponent,
    AutoComplete2Component,
    DateComponent,
    ErrorMessageComponent,
    DialogComponent,
    WaitComponent,
    FileUploadComponent,
    GenerateDocComponent,
    ClipBoardComponent,
    QtnComponent,
    LoadQtnComponent,
    MailComponent,
    HistoryComponent,
    OsRemSharedComponent,
    ApprovalComponent,
    PasteDataComponent,
    PaymentReqComponent,
    RateUpdateComponent,
    XmlomsComponent
  ],
  providers: [
    AlertService,
    LovService,
    GenerateDocService
  ]
})
export class SharedModule { }
