

import { Component, ViewEncapsulation, Input, OnInit, OnDestroy } from '@angular/core';

import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';


import { ActivatedRoute } from '@angular/router';

import { GlobalService } from '../../core/services/global.service';

import { Ledgerh } from '../models/ledgerh';
import { Ledgert } from '../models/ledgert';
import { BillingService } from '../services/billing.service';

import { SearchTable } from '../../shared/models/searchtable';


@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  providers: [BillingService]
})



export class PaymentComponent {
  // Local Variables 
  title = 'Billing Details';
  @Input() parentid: string = '';
  @Input() menuid: string = '';
  @Input() type: string = '';
  @Input() subtype: string = '';
  @Input() editdrcr: string = '';
  headerdrcr: string = '';
  detaildrcr: string = '';

  InitCompleted: boolean = false;
  menu_record: any;

  cc_category: string = '';

  lock_record: boolean = false;
  lock_date: boolean = false;


  modal: any;

  disableSave = true;
  loading = false;
  currentTab = 'LIST';
  DetailTab = 'LIST';

  bChanged: boolean;

  searchstring = '';
  page_count = 0;
  page_current = 0;
  page_rows = 0;
  page_rowcount = 0;

  sub: any;
  urlid: string;

  ProcessPendingList: boolean = false;

  ErrorMessage = "";
  InfoMessage = "";

  mode = '';
  pkid = '';

  modeDetail = '';

  diff: number = 0;


  // Array For Displaying List
  RecordList: Ledgerh[] = [];
  // Single Record for add/edit/view details
  Record: Ledgerh = new Ledgerh;


  Recorddet: Ledgert = new Ledgert;

  PARTYRECORD: SearchTable = new SearchTable();
  PARTYADDRECORD: SearchTable = new SearchTable();
  INVCURRECORD: SearchTable = new SearchTable();
  STATERECORD: SearchTable = new SearchTable();

  ACCRECORD: SearchTable = new SearchTable();
  CURRECORD: SearchTable = new SearchTable();
  SACRECORD: SearchTable = new SearchTable();

  CNTRTYPERECORD: SearchTable = new SearchTable();



  constructor(
    private modalService: NgbModal,
    private mainService: BillingService,
    private route: ActivatedRoute,
    private gs: GlobalService
  ) {
    this.page_count = 0;
    this.page_rows = 10;
    this.page_current = 0;

  }

  // Init Will be called After executing Constructor
  ngOnInit() {
    if (!this.InitCompleted) {
      this.InitComponent();
    }
  }

  InitComponent() {

    this.menuid = 'BILLING';
    this.headerdrcr = 'DR';
    this.detaildrcr = 'CR';

    this.cc_category = 'SI ' + this.type;
    // SI SEA EXPORT
    // SI AIR EXPORT
    // SI SEA IMPORT
    // SI SEA IMPORT

    // jvh_cc_category
    // jvh_cc_code
    // jvh_cc_name

    this.menu_record = this.gs.getMenu('APINVOICE');
    if (this.menu_record)
      this.title = this.menu_record.menu_name;
    this.LoadCombo();
  }

  // Destroy Will be called when this component is closed
  ngOnDestroy() {

  }

  LoadCombo() {
    this.currentTab = 'LIST';
    this.List("NEW");
  }


  // Query List Data
  List(_type: string) {

    this.loading = true;
    let SearchData = {
      type: _type,
      rowtype: this.cc_category,
      parentid: this.parentid,
      company_code: this.gs.globalVariables.comp_code,
      branch_code: this.gs.globalVariables.branch_code,
      year_code: this.gs.globalVariables.year_code,
      searchstring: this.searchstring.toUpperCase()
    };


    this.ErrorMessage = '';
    this.InfoMessage = '';
    this.mainService.List(SearchData)
      .subscribe(response => {
        this.loading = false;
        this.RecordList = response.list;
      },
      error => {
        this.loading = false;
        this.ErrorMessage = this.gs.getError(error);
        alert(this.ErrorMessage);
      });
  }



  folder_id: string;
  PrintInvoice(reportformat: string, _type: string = 'PDF') {

    this.loading = true;
    this.folder_id = this.gs.getGuid();

    let SearchData = {
      type: '',
      araptype: '',
      pkid: '',
      report_folder: '',
      folderid: '',
      company_code: '',
      branch_code: '',
      report_caption: '',
      report_format: ''
    }

    SearchData.pkid = this.pkid;
    SearchData.report_format = reportformat;
    SearchData.report_folder = this.gs.globalVariables.report_folder;
    SearchData.company_code = this.gs.globalVariables.comp_code;
    SearchData.branch_code = this.gs.globalVariables.branch_code;
    SearchData.folderid = this.folder_id;
    SearchData.report_caption = this.title;

    this.ErrorMessage = '';
    this.mainService.GenerateInvoice(SearchData)
      .subscribe(response => {
        this.loading = false;
        this.Downloadfile(response.filename, response.filetype, response.filedisplayname);
      },
      error => {
        this.loading = false;
        this.ErrorMessage = this.gs.getError(error);
        alert(this.ErrorMessage);
      });
  }

  Downloadfile(filename: string, filetype: string, filedisplayname: string) {
    this.gs.DownloadFile(this.gs.globalVariables.report_folder, filename, filetype, filedisplayname);
  }

}


