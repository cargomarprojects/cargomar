import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { QRCodeModule } from 'angularx-qrcode';

import { AlertService } from './services/alert.service';
import { LovService } from './services/lov.service';
import { GenerateDocService } from './services/generatedoc.service';
import { GenService } from './services/gen.services';
import { GenRemarksService } from './services/genremarks.service';
import { MailDirectService } from './services/maildirect.service';


import { AlertComponent } from './alert/alert.component';
import { AutoCompleteComponent } from './autocomplete/autocomplete.component';

import { AutoComplete2Component } from './autocomplete2/autocomplete2.component';
import { AutoComplete3Component } from './autocomplete3/autocomplete3.component';
import { AutoCompleteMultiComponent } from './autocompletemulti/autocompletemulti.component';

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
import { AllReportComponent } from './allreport/allreport.component';
import { FtpReportComponent } from './ftpreport/ftpreport.component';
import { FileEditComponent } from './fileupload/fileedit.component';
import { CrLimitComponent } from './crlimit/crlimit.component';
import { GenRemarksComponent } from './genremarks/genremarks.component';
import { ReportDocsComponent } from './reportdocs/reportdocs.component';
import { GenRemarks2Component } from './genremarks/genremarks2.component';
import { GenFileUploadComponent } from './genfileupload/genfileupload.component';
import { MailDirectComponent } from './mail-direct/mail-direct.component';
import { ApprovedDetComponent } from './approveddet/approveddet.component';
import { ApprovedDetService } from './services/approveddet.service';

//EDIT-AJITH-29-09-2021
//EDIT-AJITH-01-10-2021
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NgbModule,
    QRCodeModule
  ],
  declarations: [
    AlertComponent,
    AutoCompleteComponent,
    AutoComplete2Component,
    AutoComplete3Component,
    AutoCompleteMultiComponent,
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
    XmlomsComponent,
    AllReportComponent,
    FtpReportComponent,
    FileEditComponent,
    CrLimitComponent,
    GenRemarksComponent,
    ReportDocsComponent,
    GenRemarks2Component,
    GenFileUploadComponent,
    MailDirectComponent,
    ApprovedDetComponent
  ],
  exports: [
    CommonModule,
    FormsModule,
    NgbModule,
    AlertComponent,
    AutoCompleteComponent,
    AutoComplete2Component,
    AutoComplete3Component,
    AutoCompleteMultiComponent,
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
    XmlomsComponent,
    AllReportComponent,
    FtpReportComponent,
    FileEditComponent,
    CrLimitComponent,
    GenRemarksComponent,
    ReportDocsComponent,
    GenRemarks2Component,
    GenFileUploadComponent,
    MailDirectComponent,
    ApprovedDetComponent
  ],
  providers: [
    AlertService,
    LovService,
    GenerateDocService,
    GenRemarksService,
    MailDirectService,
    ApprovedDetService
  ]
})
export class SharedModule { }
