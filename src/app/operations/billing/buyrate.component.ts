
import { Component, ViewEncapsulation, Input, OnInit, OnDestroy } from '@angular/core';

import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';


import { ActivatedRoute } from '@angular/router';

import { GlobalService } from '../../core/services/global.service';

import { Ledgerh } from '../models/ledgerh';
import { Ledgert } from '../models/ledgert';
import { ArApService } from '../services/arap.sevice';

import { CostCentert } from '../models/costcentert';
import { LedgerXref } from '../models/ledgerxref';

import { pendinglist } from '../models/pendinglist';

import { SearchTable } from '../../shared/models/searchtable';
import { ok } from 'assert';

@Component({
  selector: 'app-buyrate',
  templateUrl: './buyrate.component.html',
  providers: [ArApService]
})

export class BuyRateComponent {
  /*
  Ajith 05/06/2019 MBL No validation
  */
  // Local Variables
  title = 'BUY RATE';
  @Input() parentid: string = '';
  @Input() menuid: string = '';
  @Input() type: string = '';
  @Input() subtype: string = '';
  @Input() editdrcr: string = '';
  @Input() master_lock: boolean = false;
  @Input() mbl_no: string = '';


  headerdrcr: string = '';
  detaildrcr: string = '';

  InitCompleted: boolean = false;
  menu_record: any;

  lock_record: boolean = false;
  lock_date: boolean = false;
  lock_cc: boolean = false;
  bDocs: boolean = false;

  CanEditGstNumber = true;
  CanShowDoc = true;
  modal: any;

  disableSave = true;
  loading = false;
  currentTab = 'LIST';
  DetailTab = 'LIST';

  bChanged: boolean;
  bapprovalstatus = '';
  searchstring = '';
  page_count = 0;
  page_current = 0;
  page_rows = 0;
  page_rowcount = 0;

  sub: any;
  urlid: string;

  ProcessPendingList: boolean = false;

  LockErrorMessage = "";
  ErrorMessage = "";
  InfoMessage = "";
  remarks: boolean = false;
  mode = '';
  pkid = '';

  modeDetail = '';

  diff: number = 0;

  cc_category: string = '';


  // Array For Displaying List
  RecordList: Ledgerh[] = [];
  // Single Record for add/edit/view details
  Record: Ledgerh = new Ledgerh;

  CCList: CostCentert[] = [];


  PendingListRecords: pendinglist[] = [];

  Recorddet: Ledgert = new Ledgert;

  PARTYRECORD: SearchTable = new SearchTable();
  PARTYADDRECORD: SearchTable = new SearchTable();
  INVCURRECORD: SearchTable = new SearchTable();
  STATERECORD: SearchTable = new SearchTable();

  ACCRECORD: SearchTable = new SearchTable();
  CURRECORD: SearchTable = new SearchTable();
  SACRECORD: SearchTable = new SearchTable();

  CNTRTYPERECORD: SearchTable = new SearchTable();

  ExpBookingList: Ledgert[] = [];

  constructor(
    private modalService: NgbModal,
    private mainService: ArApService,
    private route: ActivatedRoute,
    private gs: GlobalService
  ) {
    this.page_count = 0;
    this.page_rows = 500;
    this.page_current = 0;
  }

  // Init Will be called After executing Constructor
  ngOnInit() {
    if (!this.InitCompleted) {
      this.InitComponent();
    }
  }

  InitComponent() {
    this.bDocs = false;
    this.menuid = 'APINVOICE'
    this.headerdrcr = 'CR';
    this.detaildrcr = 'DR';
    this.bapprovalstatus = "";
    if (this.type == 'SEA EXPORT')
      this.cc_category = 'MBL SEA EXPORT';
    if (this.type == 'SEA IMPORT')
      this.cc_category = 'MBL SEA IMPORT';
    if (this.type == 'AIR EXPORT')
      this.cc_category = 'MAWB AIR EXPORT';
    if (this.type == 'AIR IMPORT')
      this.cc_category = 'MAWB AIR IMPORT';


    this.menu_record = this.gs.getMenu('APINVOICE');
    if (this.menu_record) {
      this.title = 'BUY RATE';
      if (this.menu_record.rights_docs)
        this.bDocs = true;
      if (this.menu_record.rights_approval.length > 0)
        this.bapprovalstatus = this.menu_record.rights_approval.toString();
    }

    this.InitLov();
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
      rowtype: "'PN','CI', 'DI'",
      cc_category: this.cc_category,
      cc_id: this.parentid,
      company_code: this.gs.globalVariables.comp_code,
      branch_code: this.gs.globalVariables.branch_code,
      year_code: this.gs.globalVariables.year_code,
      searchstring: this.searchstring.toUpperCase(),
      page_count: this.page_count,
      page_current: this.page_current,
      page_rows: this.page_rows,
      page_rowcount: this.page_rowcount
    };


    this.ErrorMessage = '';
    this.InfoMessage = '';
    this.mainService.List(SearchData)
      .subscribe(response => {
        this.loading = false;
        this.RecordList = response.list;
        this.page_count = response.page_count;
        this.page_current = response.page_current;
        this.page_rowcount = response.page_rowcount;
      },
        error => {
          this.loading = false;
          this.ErrorMessage = this.gs.getError(error);
          alert(this.ErrorMessage);
        });
  }




  InitLov(saction: string = '') {


    if (saction == 'PARTY' || saction == '') {
      this.PARTYRECORD = new SearchTable();
      this.PARTYRECORD.controlname = "PARTY";
      this.PARTYRECORD.displaycolumn = "CODE";
      this.PARTYRECORD.type = "ACCTM";
      this.PARTYRECORD.id = "";
      this.PARTYRECORD.code = "";
      this.PARTYRECORD.name = "";

      this.PARTYRECORD.where = "";

      if (this.type == 'IN')
        this.PARTYRECORD.where = " acc_type_id in (select actype_pkid from actypem where rec_company_code ='" + this.gs.globalVariables.comp_code + "'  and actype_name = 'DEBTORS') ";
      if (this.type == 'PN')
        this.PARTYRECORD.where = " acc_type_id in (select actype_pkid from actypem where rec_company_code ='" + this.gs.globalVariables.comp_code + "'  and actype_name = 'CREDITORS') ";

    }
    if (saction == 'PARTYADDRESS' || saction == '') {
      this.PARTYADDRECORD = new SearchTable();
      this.PARTYADDRECORD.controlname = "PARTYADDRESS";
      this.PARTYADDRECORD.displaycolumn = "CODE";
      this.PARTYADDRECORD.type = "CUSTOMERADDRESS";
      this.PARTYADDRECORD.id = "";
      this.PARTYADDRECORD.code = "";
      this.PARTYADDRECORD.name = "";
      this.PARTYADDRECORD.parentid = "";
    }

    if (saction == 'INVCURRENCY' || saction == '') {
      this.INVCURRECORD = new SearchTable();
      this.INVCURRECORD.controlname = "INVCURRENCY";
      this.INVCURRECORD.displaycolumn = "CODE";
      this.INVCURRECORD.type = "CURRENCY";
      this.INVCURRECORD.id = "";
      this.INVCURRECORD.code = "";
      this.INVCURRECORD.name = "";
    }

    if (saction == 'GSTSTATE' || saction == '') {
      this.STATERECORD = new SearchTable();
      this.STATERECORD.controlname = "GSTSTATE";
      this.STATERECORD.displaycolumn = "CODE";
      this.STATERECORD.type = "STATE";
      this.STATERECORD.id = "";
      this.STATERECORD.code = "";
      this.STATERECORD.name = "";
    }

    if (saction == 'ACCTM' || saction == 'DETAIL' || saction == '') {
      this.ACCRECORD = new SearchTable();
      this.ACCRECORD.controlname = "ACCTM";
      this.ACCRECORD.displaycolumn = "CODE";
      this.ACCRECORD.type = "ACCTM";
      this.ACCRECORD.id = "";
      this.ACCRECORD.code = "";
      this.ACCRECORD.name = "";
      this.ACCRECORD.where = "";
    }
    if (saction == 'CURRENCY' || saction == 'DETAIL' || saction == '') {
      this.CURRECORD = new SearchTable();
      this.CURRECORD.controlname = "CURRENCY";
      this.CURRECORD.displaycolumn = "CODE";
      this.CURRECORD.type = "CURRENCY";
      this.CURRECORD.id = "";
      this.CURRECORD.code = "";
      this.CURRECORD.name = "";
    }

    if (saction == 'SAC' || saction == 'DETAIL' || saction == '') {
      this.SACRECORD = new SearchTable();
      this.SACRECORD.controlname = "SAC";
      this.SACRECORD.displaycolumn = "CODE";
      this.SACRECORD.type = "SAC";
      this.SACRECORD.id = "";
      this.SACRECORD.code = "";
    }

    if (saction == 'CNTRTYPE' || saction == 'DETAIL' || saction == '') {
      this.CNTRTYPERECORD = new SearchTable();
      this.CNTRTYPERECORD.controlname = "CNTRTYPE";
      this.CNTRTYPERECORD.displaycolumn = "CODE";
      this.CNTRTYPERECORD.type = "CONTAINER TYPE";
      this.CNTRTYPERECORD.id = "";
      this.CNTRTYPERECORD.code = "";
      this.CNTRTYPERECORD.name = "";
    }

  }

  LovSelected(_Record: SearchTable) {

    let _bchanged: boolean = false;

    _bchanged = false;
    if (_Record.controlname == "PARTY") {
      if (this.Record.jvh_acc_id != _Record.id)
        _bchanged = true;

      this.Record.jvh_acc_id = _Record.id;
      this.Record.jvh_acc_code = _Record.code;
      this.Record.jvh_acc_name = _Record.name;

      this.Record.jvh_narration = 'PAYABLE TO ' + _Record.name + ' AGAINST ' + this.Narration;



      if (_bchanged) {
        this.InitLov('PARTYADDRESS');
        this.PARTYADDRECORD.id = "";
        this.PARTYADDRECORD.code = "";
        this.PARTYADDRECORD.name = "";
        this.PARTYADDRECORD.parentid = this.Record.jvh_acc_id;
        this.Record.jvh_acc_br_id = "";
        this.Record.jvh_acc_br_slno = "";
        this.Record.jvh_gstin = '';

        this.InitLov('GSTSTATE');
        this.STATERECORD.id = '';
        this.STATERECORD.code = '';
        this.STATERECORD.name = '';
      }
    }
    if (_Record.controlname == "PARTYADDRESS") {
      this.Record.jvh_acc_br_id = _Record.id;
      this.Record.jvh_acc_br_slno = _Record.code;
      this.Record.jvh_acc_br_address = this.GetBrAddress(_Record.name).address;

      this.Record.jvh_gstin = _Record.col1;

      this.Record.jvh_state_id = _Record.col2;
      this.Record.jvh_state_code = _Record.col3;
      this.Record.jvh_state_name = _Record.col4;



      this.Record.jvh_sez = false;
      if (_Record.col5 == "Y")
        this.Record.jvh_sez = true;

      this.InitLov('GSTSTATE');

      this.STATERECORD.id = this.Record.jvh_state_id;
      this.STATERECORD.code = this.Record.jvh_state_code;
      this.STATERECORD.name = this.Record.jvh_state_name;

      this.Record.jvh_gst_type = this.gs.getGstType(this.Record.jvh_gstin, this.Record.jvh_state_code, this.Record.jvh_sez, this.Record.jvh_igst_exception);

      this.CanEditGstNumber = true;
      if (this.Record.jvh_gstin.toString().trim().length > 0) {
        this.CanEditGstNumber = false;
      }

    }

    if (_Record.controlname == "INVCURRENCY") {
      this.Record.jvh_curr_id = _Record.id;
      this.Record.jvh_curr_code = _Record.code;
      this.Record.jvh_curr_name = _Record.name;
      this.Record.jvh_exrate = _Record.rate;
    }

    if (_Record.controlname == "GSTSTATE") {
      this.Record.jvh_state_id = _Record.id;
      this.Record.jvh_state_code = _Record.code;
      this.Record.jvh_state_name = _Record.name;
      this.Record.jvh_gst_type = this.gs.getGstType(this.Record.jvh_gstin, this.Record.jvh_state_code, this.Record.jvh_sez, this.Record.jvh_igst_exception);
    }

    if (_Record.controlname == "ACCTM") {
      this.Recorddet.jv_acc_id = _Record.id;
      this.Recorddet.jv_acc_code = _Record.code;
      this.Recorddet.jv_acc_name = _Record.name;
      this.Recorddet.jv_acc_against_invoice = _Record.col1;   // Against Invoice
      this.Recorddet.jv_acc_cost_centre = _Record.col2;      //  Cost Center
      this.Recorddet.jv_acc_main_code = _Record.col3;      //  Main Code
      this.Recorddet.jv_acc_type_name = _Record.col6;      //  Main Code
      this.Recorddet.jv_is_taxable = false;
      if (_Record.col4 == "Y")
        this.Recorddet.jv_is_taxable = true;      //  Taxable

      //RCM-1
      this.Recorddet.jv_is_rcm = false;
      if (_Record.col8 == "Y") {
        this.Recorddet.jv_is_rcm = true;      //  Taxable
      }


      this.SearchRecord('taxcode');
    }
    if (_Record.controlname == "CURRENCY") {
      this.Recorddet.jv_curr_id = _Record.id;
      this.Recorddet.jv_curr_code = _Record.code;
      this.Recorddet.jv_curr_name = _Record.name;
      this.Recorddet.jv_exrate = _Record.rate;
      this.bChanged = true;
      this.OnBlur('jv_exrate');
    }

    if (_Record.controlname == "SAC") {
      this.Recorddet.jv_sac_id = _Record.id;
      this.Recorddet.jv_sac_code = _Record.code;
    }

    if (_Record.controlname == "CNTRTYPE") {
      this.Recorddet.jv_cntr_type_id = _Record.id;
      this.Recorddet.jv_cntr_type_code = _Record.code;
    }

  }


  //function for handling LIST/NEW/EDIT Buttons
  ActionHandler(action: string, id: string) {
    this.ErrorMessage = '';
    this.InfoMessage = '';
    if (action == 'LIST') {
      this.mode = '';
      this.pkid = '';
      this.currentTab = 'LIST';
      this.DetailTab = 'LIST';
    }
    else if (action === 'ADD') {
      this.currentTab = 'DETAILS';
      this.DetailTab = 'LIST';
      this.mode = 'ADD';
      this.ResetControls();
      this.NewRecord();
    }
    else if (action === 'EDIT') {
      this.currentTab = 'DETAILS';
      this.DetailTab = 'LIST';
      this.mode = 'EDIT';
      this.ResetControls();
      this.pkid = id;
      this.GetRecord(id);
    }
  }

  RemoveList(event: any) {
    if (event.selected) {
      var i;
      for (i = this.Record.CostCenterList.length - 1; i >= 0; i -= 1) {
        if (this.Record.CostCenterList[i].ct_jv_id === event.id) {
          this.Record.CostCenterList.splice(i, 1);
        }
      }

      this.Record.LedgerList.splice(this.Record.LedgerList.findIndex(rec => rec.jv_pkid == event.id), 1);
      this.FindTotal();
    }
  }



  ResetControls() {
    this.disableSave = true;
    if (!this.menu_record)
      return;

    if (this.menu_record.rights_admin)
      this.disableSave = false;
    if (this.mode == "ADD" && this.menu_record.rights_add)
      this.disableSave = false;
    if (this.mode == "EDIT" && this.menu_record.rights_edit)
      this.disableSave = false;

    return this.disableSave;
  }


  NewRecord() {

    this.lock_record = false;
    this.lock_date = false;
    this.lock_cc = false;


    this.CanEditGstNumber = true;

    this.pkid = this.gs.getGuid();

    this.Record = new Ledgerh();
    this.Record.jvh_pkid = this.pkid;
    this.Record.jvh_type = this.type;
    this.Record.jvh_subtype = this.subtype;
    this.Record.jvh_year = this.gs.globalVariables.year_code;
    this.Record.jvh_date = this.gs.defaultValues.today;
    this.Record.jvh_reference = '';
    this.Record.jvh_reference_date = '';
    this.Record.jvh_narration = '';

    this.Record.jvh_rec_source = 'OP';

    this.Record.jvh_acc_id = '';
    this.Record.jvh_acc_code = '';
    this.Record.jvh_acc_name = '';
    this.Record.jvh_acc_br_id = '';
    this.Record.jvh_sez = false;

    this.Record.jvh_state_id = '';
    this.Record.jvh_state_code = '';
    this.Record.jvh_state_name = '';
    this.Record.jvh_banktype = 'NA';

    this.Record.jvh_gstin = '';
    this.Record.jvh_no_brok = false;
    this.Record.jvh_basic_frt = 0;
    this.Record.jvh_brok_per = 0;
    this.Record.jvh_brok_amt = 0;
    this.Record.jvh_brok_remarks = "";
    this.Record.jvh_remarks = "";

    this.Record.jvh_gst_type = '';

    this.Record.jvh_curr_id = this.gs.defaultValues.param_curr_local_id;
    this.Record.jvh_curr_code = this.gs.defaultValues.param_curr_local_code;
    this.Record.jvh_curr_name = this.gs.defaultValues.param_curr_local_code;
    this.Record.jvh_exrate = 1;



    this.Record.jvh_cc_category = this.cc_category;
    this.Record.jvh_cc_id = this.parentid;
    this.Record.jvh_cc_code = "";
    this.Record.jvh_cc_name = "";

    this.Record.jvh_org_invno = '';
    this.Record.jvh_org_invdt = '';

    this.Record.jvh_cgst_amt = 0;
    this.Record.jvh_sgst_amt = 0;
    this.Record.jvh_igst_amt = 0;
    this.Record.jvh_gst_amt = 0;

    this.Record.jvh_debit = 0;
    this.Record.jvh_credit = 0;

    this.Record.jvh_diff = 0;

    this.Record.jvh_brok_exrate = 0;
    this.Record.jvh_brok_amt_inr = 0;
    this.Record.jvh_crdays = 0;

    this.ProcessPendingList = false;

    this.InitLov();

    this.INVCURRECORD.id = this.Record.jvh_curr_id;
    this.INVCURRECORD.code = this.Record.jvh_curr_code;
    this.INVCURRECORD.name = this.Record.jvh_curr_code;

    this.Record.rec_mode = this.mode;

    this.getNarration();

  }


  Narration: string = '';

  getNarration() {
    let SearchData = {
      table: 'narration',
      id: this.parentid
    };
    this.gs.SearchRecord(SearchData)
      .subscribe(response => {
        this.loading = false;
        this.Record.jvh_narration = 'PAYABLE TO ' + this.Record.jvh_acc_name + ' AGAINST ' + response.narration;
        this.Narration = response.narration;
      },
        error => {
          this.loading = false;
          this.ErrorMessage = this.gs.getError(error);
          alert(this.ErrorMessage);
        });
  }





  // Load a single Record for VIEW/EDIT
  GetRecord(Id: string) {
    this.loading = true;

    let SearchData = {
      pkid: Id,
    };

    this.LockErrorMessage = "";
    this.ErrorMessage = '';
    this.InfoMessage = '';
    this.mainService.GetRecord(SearchData)
      .subscribe(response => {
        this.loading = false;
        this.LockErrorMessage = response.lockedmsg;
        this.LoadData(response.record);
      },
        error => {
          this.loading = false;
          this.ErrorMessage = this.gs.getError(error);
          alert(this.ErrorMessage);
        });
  }

  LoadData(_Record: Ledgerh) {
    this.Record = _Record;

    this.Record.LedgerList = _Record.LedgerList;
    this.Record.CostCenterList = _Record.CostCenterList;
    //this.Record.XrefList = _Record.XrefList;

    this.ProcessPendingList = false;

    this.InitLov();

    this.PARTYRECORD.id = this.Record.jvh_acc_id;
    this.PARTYRECORD.code = this.Record.jvh_acc_code;
    this.PARTYRECORD.name = this.Record.jvh_acc_name;

    this.PARTYADDRECORD.id = this.Record.jvh_acc_br_id;
    this.PARTYADDRECORD.code = this.Record.jvh_acc_br_slno;
    this.PARTYADDRECORD.parentid = this.Record.jvh_acc_id;

    this.INVCURRECORD.id = this.Record.jvh_curr_id;
    this.INVCURRECORD.code = this.Record.jvh_curr_code;

    this.STATERECORD.id = this.Record.jvh_state_id;
    this.STATERECORD.code = this.Record.jvh_state_code;
    this.STATERECORD.name = this.Record.jvh_state_name;

    this.Record.rec_mode = this.mode;




    this.lock_record = true;
    this.lock_date = true;
    this.lock_cc = true;

    if (this.Record.jvh_edit_code.indexOf("{S}") >= 0)
      this.lock_record = false;
    if (this.Record.jvh_edit_code.indexOf("{D}") >= 0)
      this.lock_date = false;
    if (this.Record.jvh_edit_code.indexOf("{C}") >= 0)
      this.lock_cc = false;

    if (this.LockErrorMessage.length > 0) {
      this.ErrorMessage = this.LockErrorMessage;
      this.lock_record = true;
    }

    if (this.Record.jvh_allocation_found) {
      this.ErrorMessage += " | Cannot Edit Allocation Exists";
      this.lock_record = true;
    }

    this.FindTotal();

    this.ChangeAccList();

    this.CanEditGstNumber = true;
    if (this.Record.jvh_gstin.toString().trim().length > 0)
      this.CanEditGstNumber = false;


    if (this.Record.jvh_rec_source != 'OP') {
      alert("Cannot Edit,Created in Another Module");
    }

    if (this.ErrorMessage)
      alert(this.ErrorMessage);
  }


  // Save Data
  Save() {

    this.FindTotal();

    if (!this.allvalid())
      return;
    this.loading = true;
    this.ErrorMessage = '';
    this.InfoMessage = '';


    this.Record._globalvariables = this.gs.globalVariables;
    this.Record.jvh_drcr = this.headerdrcr;
    this.mainService.Save(this.Record)
      .subscribe(response => {
        this.loading = false;

        if (this.mode == 'ADD')
          this.InfoMessage = "New Record Successfully Saved";
        else
          this.InfoMessage = "Save Complete";

        this.mode = 'EDIT';
        this.Record.rec_mode = this.mode;
        this.RefreshList(response);

        alert(this.InfoMessage);
      },
        error => {
          this.loading = false;
          this.ErrorMessage = this.gs.getError(error);
          alert(this.ErrorMessage);
        });
  }

  allvalid() {
    let sError: string = "";
    let bret: boolean = true;
    this.ErrorMessage = '';
    this.InfoMessage = '';

    let isNegative: Boolean = false;
    let isGstMismatch: Boolean = false;
    let isGstBlank: Boolean = false;
    let Courier_Code_Found: Boolean = false;
    let Igst_Only_Code_Found: Boolean = false;





    let rowCount: number = 0;


    let cgst_dr = 0;
    let sgst_dr = 0;
    let igst_dr = 0;

    let cgst_cr = 0;
    let sgst_cr = 0;
    let igst_cr = 0;

    let gst_dr = 0;
    let gst_cr = 0;

    let _gst_amt = 0;

    if (this.Record.jvh_rec_source.trim() != "OP") {
      bret = false;
      sError += " | Cannot Edit,Created In Another Module";
    }




    if (this.Record.jvh_cc_category != 'MBL SEA EXPORT' && this.Record.jvh_cc_category != 'MBL SEA IMPORT' && this.Record.jvh_cc_category != 'MAWB AIR EXPORT' && this.Record.jvh_cc_category != 'MAWB AIR IMPORT' && this.Record.jvh_cc_category != 'GENERAL JOB') {
      bret = false;
      sError += " | Invalid Document Type";
    }

    if (this.gs.isBlank(this.Record.jvh_org_invno) || this.gs.isBlank(this.Record.jvh_org_invdt)) {
      bret = false;
      sError += " | Original INV#/DT Cannot Be Blank";
    }

    if (this.Record.jvh_state_id.trim() == "" || this.Record.jvh_state_code.trim() == "") {
      bret = false;
      sError += " | State Cannot Be Blank";
    }

    if (this.Record.jvh_gstin != "") {
      if (this.Record.jvh_gstin.length != 15) {
        bret = false;
        sError += " | Invalid GSTIN";
      }
    }

    if (this.Record.jvh_date.trim().length <= 0) {
      bret = false;
      sError += " | Date Cannot Be Blank";
    }

    if (this.Record.jvh_cc_id == '') {
      bret = false;
      sError += " |  Invalid Cost Center Id";
    }

    if (this.Record.jvh_cc_category == '') {
      bret = false;
      sError += " |  Invalid Cost Center Category";
    }


    if (this.Record.jvh_acc_id == '') {
      bret = false;
      sError += " | Party Cannot Be Blank";
    }

    if (this.Record.jvh_acc_br_id == '') {
      bret = false;
      sError += " | Party Address Cannot Be Blank";
    }

    if (this.Record.jvh_curr_id == '') {
      bret = false;
      sError += " | Invalid Currency";
    }
    if (this.Record.jvh_exrate <= 0) {
      bret = false;
      sError += " | Invalid Ex.Rate";
    }

    if (this.Record.jvh_narration.trim().length <= 0) {
      bret = false;
      sError += " | Narration Cannot Be Blank";
    }

    if (!this.Record.jvh_gst && this.Record.jvh_igst_exception) {
      bret = false;
      sError += " | Courier/Frt IGST Cannot Be Selected";
    }

    if (this.Record.jvh_no_brok) {
      if (this.Record.jvh_brok_remarks.length <= 0) {
        bret = false;
        sError += " | Pls input Remarks for no Brokerage";
      }
      if (this.Record.jvh_basic_frt > 0 || this.Record.jvh_brok_per > 0 || this.Record.jvh_brok_amt > 0) {
        bret = false;
        sError += " | Basic Frt,Brok. Per,Brok. Amt Need to be zero";
      }

    }
    if (!this.Record.jvh_no_brok) {
      if (this.Record.jvh_brok_amt <= 0) {
        bret = false;
        sError += " | Brokerage Need To Be Entered";
      }
    }

    if (this.Record.jvh_brok_amt > 0) {
      if (this.Record.jvh_brok_exrate <= 0) {
        bret = false;
        sError += " | Brokerage Exchange Rate Need To Be Entered";
      }
    }

    if (!this.Record.jvh_gst && this.Record.jvh_igst_exception) {
      bret = false;
      sError += " | Courier/Frt IGST Cannot Be Selected";
    }


    let IsRcmRecords = false;
    let IsNoRcmRecords = false;

    this.Record.LedgerList.forEach(rec => {
      rowCount++;

      if (rec.jv_debit > 0) {
        gst_dr += rec.jv_gst_amt;
        if (this.Record.jvh_gst && rec.jv_is_taxable && rec.jv_gst_amt <= 0) {
          isGstBlank = true;
        }
      }
      if (rec.jv_credit > 0) {
        gst_cr += rec.jv_gst_amt;
        if (this.Record.jvh_gst && rec.jv_is_taxable && rec.jv_gst_amt <= 0)
          isGstBlank = true;
      }

      if (rec.jv_debit <= 0 && rec.jv_credit <= 0) {
        isNegative = true;
      }
      _gst_amt = rec.jv_cgst_amt + rec.jv_sgst_amt + rec.jv_igst_amt;

      if (rec.jv_gst_amt != _gst_amt)
        isGstMismatch = true;

      if ((this.Record.jvh_gst && rec.jv_gst_amt <= 0) && (rec.jv_cgst_rate != 0 || rec.jv_sgst_rate != 0 || rec.jv_igst_rate != 0)) {
        isGstBlank = true;
      }

      if (this.Record.jvh_gst && rec.jv_is_gst_item && rec.jv_gst_amt <= 0) {
        isGstBlank = true;
      }


      //if (rec.jv_acc_code == '1105033' || rec.jv_acc_code == '1205030' || rec.jv_acc_code == '1105040' || rec.jv_acc_code == '1526' || rec.jv_acc_code == '1105111' || rec.jv_acc_code == '1205111') {

      if (this.gs.IsCourierCode(rec.jv_acc_code)) {
        Courier_Code_Found = true;
      }

      if (this.gs.IsIgstCode(rec.jv_acc_code, this.Record.jvh_date)) {
        Igst_Only_Code_Found = true;
      }



      //RCM-2
      if (rec.jv_is_rcm)
        IsRcmRecords = true;
      else
        IsNoRcmRecords = true;


    });

    if (rowCount <= 0) {
      bret = false;
      sError += " |No Rows to Save";
    }




    if (isGstBlank) {
      bret = false;
      sError += " |Invalid Gst for one or more records";
    }

    if (this.Record.jvh_igst_exception) {
      if (!Courier_Code_Found && !Igst_Only_Code_Found) {
        bret = false;
        sError += " |Invalid A/c Code selected for Courier/Frt IGST";
      }

      /*
      if (Code_Other_Than_Courier_Code_Found) {
        bret = false;
        sError += " |Only code 1205030/1105033/1105040/1526/1105111 can be used";
      }
      */
    }

    if (Igst_Only_Code_Found) {
      if (this.Record.jvh_gst_type != 'INTER-STATE') {
        bret = false;
        sError += " | GST Type Should Be INTER-STATE";
      }
    }


    if (IsRcmRecords && IsNoRcmRecords) {
      bret = false;
      sError += " |Separate invoice required for RCM/Non-RCM Items";
    }


    if (this.Record.jvh_rc && !this.Record.jvh_gst) {
      bret = false;
      sError += " |Reverse Charge Invalid";
    }


    if (IsRcmRecords && !this.Record.jvh_rc) {
      bret = false;
      sError += " |Reverse Charge Invalid";
    }

    if (!IsRcmRecords && this.Record.jvh_rc) {
      bret = false;
      sError += " |Reverse Charge Invalid";
    }



    if (gst_dr != 0 && gst_cr != 0) {
      bret = false;
      sError += " |Debit and Credit GST not possible";
    }
    if (isGstMismatch) {
      bret = false;
      sError += " |GST Calculation Error, Pls ReCalculate";
    }
    if (isNegative) {
      bret = false;
      sError += " |Debit or Credit is <=0 ";

    }
    if (this.diff <= 0) {
      bret = false;
      sError += " | Total Amount is <= 0 ";
    }

    if (this.Record.jvh_gst) {
      if (this.Record.jvh_gst_amt <= 0) {
        bret = false;
        sError += " | GST Amt not found";
      }
    }

    if (!this.Record.jvh_gst) {
      if (this.Record.jvh_gst_amt != 0) {
        bret = false;
        sError += " | GST Amt Need To be Removed";
      }
    }

    if (this.Record.jvh_gst) {

      if (this.Record.jvh_gst_type == "INTRA-STATE") {
        if (this.Record.jvh_cgst_amt <= 0 || this.Record.jvh_sgst_amt <= 0) {
          bret = false;
          sError += " | Gst Invalid";
        }
        if (this.Record.jvh_igst_amt > 0) {
          bret = false;
          sError += " | Gst Invalid";
        }
      }
      if (this.Record.jvh_gst_type == "INTER-STATE") {
        if (this.Record.jvh_cgst_amt > 0 || this.Record.jvh_sgst_amt > 0) {
          bret = false;
          sError += " | Gst Invalid";
        }
        if (this.Record.jvh_igst_amt <= 0) {
          bret = false;
          sError += " | Gst Invalid";
        }
      }

    }


    if (bret) {
      this.Record.jvh_reference = this.Record.jvh_reference.toUpperCase().replace(' ', '');
    }

    if (!bret) {
      this.ErrorMessage = sError;
      alert(this.ErrorMessage);
    }
    return bret;
  }

  RefreshList(retdata: any) {

    if (this.RecordList == null)
      return;

    var REC = this.RecordList.find(rec => rec.jvh_pkid == this.Record.jvh_pkid);
    if (REC == null) {
      this.Record.jvh_vrno = retdata.jvh_vrno;
      this.Record.jvh_docno = retdata.jvh_docno;
      this.RecordList.push(this.Record);
    }
    else {
      REC.jvh_reference = this.Record.jvh_reference;
      REC.jvh_narration = this.Record.jvh_narration;
      REC.jvh_debit = this.Record.jvh_debit;
      REC.jvh_credit = this.Record.jvh_credit;
    }
  }

  onFocusout(field: string, _content: any = null) {
    var oldChar2 = / /gi;//replace all blank space in a string
    if (field == 'jvh_reference') {
      this.Record.jvh_reference = this.Record.jvh_reference.replace(oldChar2, '').toUpperCase();
      if (!this.gs.isBlank(this.Record.jvh_reference)) {
        this.IsDupliation(this.Record.jvh_reference);
      }
    }
    if (field == 'jvh_org_invno') {
      this.Record.jvh_org_invno = this.Record.jvh_org_invno.replace(oldChar2, '').toUpperCase();
      if (!this.gs.isBlank(this.Record.jvh_org_invno)) {
        this.IsDupliation(this.Record.jvh_org_invno);
      }
    }

    if (field === 'jvh_reference_date') {
      if (!this.gs.isBlank(this.Record.jvh_date) && !this.gs.isBlank(this.Record.jvh_reference_date)) {
        this.IsDatesInSameMonth(this.Record.jvh_reference_date, _content);
      }
    }

    if (field === 'jvh_org_invdt') {
      if (!this.gs.isBlank(this.Record.jvh_date) && !this.gs.isBlank(this.Record.jvh_org_invdt)) {
        this.IsDatesInSameMonth(this.Record.jvh_org_invdt, _content);
      }
    }
  }


  OnFocus(field: string) {
    this.bChanged = false;
  }

  OnChange(field: string) {
    this.bChanged = true;
    if (field == 'jvh_sez') {
      this.Record.jvh_gst_type = this.gs.getGstType(this.Record.jvh_gstin, this.Record.jvh_state_code, this.Record.jvh_sez, this.Record.jvh_igst_exception);
    }
    if (field == 'jvh_igst_exception') {
      this.Record.jvh_gst_type = this.gs.getGstType(this.Record.jvh_gstin, this.Record.jvh_state_code, this.Record.jvh_sez, this.Record.jvh_igst_exception);
    }
  }


  OnBlur(field: string) {
    if (field == 'jv_acc_name') {
      this.Recorddet.jv_acc_name = this.Recorddet.jv_acc_name.toUpperCase();
    }
    if (field == 'jvh_basic_frt') {
      this.Record.jvh_basic_frt = this.gs.roundNumber(this.Record.jvh_basic_frt, 2);
      this.Record.jvh_brok_amt = this.Record.jvh_basic_frt * this.Record.jvh_brok_per / 100;
      this.Record.jvh_brok_amt = this.gs.roundNumber(this.Record.jvh_brok_amt, 2);
    }
    if (field == 'jvh_brok_per') {
      this.Record.jvh_brok_per = this.gs.roundNumber(this.Record.jvh_brok_per, 2);
      this.Record.jvh_brok_amt = this.Record.jvh_basic_frt * this.Record.jvh_brok_per / 100;
      this.Record.jvh_brok_amt = this.gs.roundNumber(this.Record.jvh_brok_amt, 2);
    }
    if (field == 'jvh_gstin') {
      if (this.bChanged) {
        this.Record.jvh_gstin = this.Record.jvh_gstin.toUpperCase();
        if (this.Record.jvh_gstin.length == 15)
          this.Record.jvh_gst_type = this.gs.getGstType(this.Record.jvh_gstin, this.Record.jvh_state_code, this.Record.jvh_sez, this.Record.jvh_igst_exception);
      }
    }
    if (field == "jv_qty") {
      if (!this.bChanged)
        return;

      this.Recorddet.jv_qty = this.gs.roundNumber(this.Recorddet.jv_qty, 3);

      this.Recorddet.jv_ftotal = this.Recorddet.jv_qty * this.Recorddet.jv_rate;
      this.Recorddet.jv_ftotal = this.gs.roundNumber(this.Recorddet.jv_ftotal, 3);
      this.Recorddet.jv_total = this.Recorddet.jv_ftotal * this.Recorddet.jv_exrate;
      this.Recorddet.jv_total = this.gs.roundNumber(this.Recorddet.jv_total, 2);
      this.Recorddet.jv_taxable_amt = this.Recorddet.jv_total;
      this.FindRowTotal();

    }
    if (field == "jv_rate") {
      if (!this.bChanged)
        return;

      this.Recorddet.jv_rate = this.gs.roundNumber(this.Recorddet.jv_rate, 3);
      this.Recorddet.jv_ftotal = this.Recorddet.jv_qty * this.Recorddet.jv_rate;
      this.Recorddet.jv_ftotal = this.gs.roundNumber(this.Recorddet.jv_ftotal, 3);
      this.Recorddet.jv_total = this.Recorddet.jv_ftotal * this.Recorddet.jv_exrate;
      this.Recorddet.jv_total = this.gs.roundNumber(this.Recorddet.jv_total, 2);
      this.Recorddet.jv_taxable_amt = this.Recorddet.jv_total;
      this.FindRowTotal();

    }

    if (field == "jv_ftotal") {
      if (!this.bChanged)
        return;

      this.Recorddet.jv_ftotal = this.gs.roundNumber(this.Recorddet.jv_ftotal, 2);
      if (this.Recorddet.jv_rate > 0) {
        this.Recorddet.jv_rate = this.Recorddet.jv_ftotal / this.Recorddet.jv_qty;
        this.Recorddet.jv_rate = this.gs.roundNumber(this.Recorddet.jv_rate, 3);
      }

      this.Recorddet.jv_total = this.Recorddet.jv_ftotal * this.Recorddet.jv_exrate;
      this.Recorddet.jv_total = this.gs.roundNumber(this.Recorddet.jv_total, 2);
      this.Recorddet.jv_taxable_amt = this.Recorddet.jv_total;
      this.FindRowTotal();
    }
    if (field == "jv_exrate") {
      if (!this.bChanged)
        return;
      this.Recorddet.jv_exrate = this.gs.roundNumber(this.Recorddet.jv_exrate, 5);
      this.Recorddet.jv_total = this.Recorddet.jv_ftotal * this.Recorddet.jv_exrate;
      this.Recorddet.jv_total = this.gs.roundNumber(this.Recorddet.jv_total, 2);
      this.Recorddet.jv_taxable_amt = this.Recorddet.jv_total;
      this.FindRowTotal();
    }

    if (field == "jv_total") {
      if (!this.bChanged)
        return;
      this.Recorddet.jv_total = this.gs.roundNumber(this.Recorddet.jv_total, 2);
      if (this.Recorddet.jv_exrate > 0) {
        this.Recorddet.jv_ftotal = this.Recorddet.jv_total / this.Recorddet.jv_exrate;
        this.Recorddet.jv_ftotal = this.gs.roundNumber(this.Recorddet.jv_ftotal, 2);
        this.Recorddet.jv_taxable_amt = this.Recorddet.jv_total;

        if (this.Recorddet.jv_rate > 0) {
          this.Recorddet.jv_rate = this.Recorddet.jv_ftotal / this.Recorddet.jv_qty;
          this.Recorddet.jv_rate = this.gs.roundNumber(this.Recorddet.jv_rate, 3);
        }

        this.FindRowTotal();
      }
    }

    if (field == "jv_taxable_amt") {
      if (!this.bChanged)
        return;
      this.Recorddet.jv_taxable_amt = this.gs.roundNumber(this.Recorddet.jv_taxable_amt, 2);
      this.FindRowTotal();
    }

    if (field == 'jv_bank') {
      this.Recorddet.jv_bank = this.Recorddet.jv_bank.toUpperCase();
    }
    if (field == 'jv_branch') {
      this.Recorddet.jv_branch = this.Recorddet.jv_branch.toUpperCase();
    }
    if (field == 'jv_pay_reason') {
      this.Recorddet.jv_pay_reason = this.Recorddet.jv_pay_reason.toUpperCase();
    }
    if (field == 'jv_supp_docs') {
      this.Recorddet.jv_supp_docs = this.Recorddet.jv_supp_docs.toUpperCase();
    }
    if (field == 'jv_paid_to') {
      this.Recorddet.jv_paid_to = this.Recorddet.jv_paid_to.toUpperCase();
    }
    if (field == 'jv_remarks') {
      this.Recorddet.jv_remarks = this.Recorddet.jv_remarks.toUpperCase();
    }
    if (field == 'jvh_remarks') {
      this.Record.jvh_remarks = this.Record.jvh_remarks.toUpperCase();
    }
    if (field == 'jvh_brok_exrate') {
      this.Record.jvh_brok_exrate = this.gs.roundNumber(this.Record.jvh_brok_exrate, 2);
      this.Record.jvh_brok_amt_inr = this.Record.jvh_brok_exrate * this.Record.jvh_brok_amt;
      this.Record.jvh_brok_amt_inr = this.gs.roundNumber(this.Record.jvh_brok_amt_inr, 2);
    }
  }

  FindRowTotal() {
    let namt: number = 0;

    if (this.Record.jvh_gst) {
      if (this.Recorddet.jv_is_taxable) {
        if (this.Record.jvh_gst_type == "INTRA-STATE") {
          namt = this.Recorddet.jv_taxable_amt * this.Recorddet.jv_cgst_rate / 100;
          this.Recorddet.jv_cgst_amt = this.gs.roundNumber(namt, 2);
          namt = this.Recorddet.jv_taxable_amt * this.Recorddet.jv_sgst_rate / 100;
          this.Recorddet.jv_sgst_amt = this.gs.roundNumber(namt, 2);
          this.Recorddet.jv_igst_amt = 0;
        }
        if (this.Record.jvh_gst_type == "INTER-STATE") {
          namt = this.Recorddet.jv_taxable_amt * this.Recorddet.jv_igst_rate / 100;
          this.Recorddet.jv_igst_amt = this.gs.roundNumber(namt, 2);
          this.Recorddet.jv_cgst_amt = 0;
          this.Recorddet.jv_sgst_amt = 0;
        }
      }
      else {
        this.Recorddet.jv_cgst_amt = 0;
        this.Recorddet.jv_sgst_amt = 0;
        this.Recorddet.jv_igst_amt = 0;
      }
    }
    else {
      this.Recorddet.jv_cgst_amt = 0;
      this.Recorddet.jv_sgst_amt = 0;
      this.Recorddet.jv_igst_amt = 0;
    }
  }

  Close() {
    this.gs.ClosePage('home');
  }

  NewInvoice(_type: string, _subtype: string) {
    this.ErrorMessage = "";
    if (this.mbl_no.trim() == '') {
      if (this.type.indexOf('SEA') >= 0)
        this.ErrorMessage = "MBL Number Not Found";
      else
        this.ErrorMessage = "MAWB Number Not Found";
      alert(this.ErrorMessage);
      return;
    }
    this.type = _type;
    this.subtype = _subtype;
    this.headerdrcr = 'CR';
    this.detaildrcr = 'DR';
    this.ActionHandler('ADD', '');
  }

  EditInvoice(_id: string, _type: string, _subtype: string, _rec_source: string) {



    this.type = _type;
    this.subtype = _subtype;

    this.headerdrcr = 'CR';
    this.detaildrcr = 'DR';
    this.ActionHandler('EDIT', _id);

  }




  // Detail Handling
  ActionHandlerDetail(action: string, rec: Ledgert) {
    if (this.ErrorMessage.indexOf("Transactions Locked") < 0 && this.ErrorMessage.indexOf("Cannot Edit") < 0)
      this.ErrorMessage = '';
    if (action == 'LIST') {
      this.DetailTab = 'LIST';
      this.modeDetail = '';
    }
    else if (action === 'ADD') {
      this.DetailTab = 'DETAILS';
      this.modeDetail = 'ADD';
      this.NewRecordDetail();
    }
    else if (action === 'EDIT') {
      this.DetailTab = 'DETAILS';
      this.modeDetail = 'EDIT';
      this.LoadDetail(rec);
    }
  }


  NewRecordDetail() {

    let _OldRecorddet: Ledgert;
    _OldRecorddet = this.Recorddet;

    this.Recorddet = new Ledgert;
    this.Recorddet.jv_pkid = this.gs.getGuid();

    this.Recorddet.jv_acc_id = '';
    this.Recorddet.jv_acc_code = '';
    this.Recorddet.jv_acc_name = '';
    this.Recorddet.jv_acc_type_name = '';

    this.Recorddet.jv_curr_id = this.Record.jvh_curr_id;
    this.Recorddet.jv_curr_code = this.Record.jvh_curr_code;
    this.Recorddet.jv_curr_name = this.Record.jvh_curr_name;
    this.Recorddet.jv_exrate = this.Record.jvh_exrate;

    this.Recorddet.jv_qty = 0;
    this.Recorddet.jv_rate = 0;

    this.Recorddet.jv_debit = 0;
    this.Recorddet.jv_credit = 0;

    this.Recorddet.jv_ftotal = 0;
    this.Recorddet.jv_total = 0;

    this.Recorddet.jv_taxable_amt = 0;

    this.Recorddet.jv_is_taxable = false;
    this.Recorddet.jv_is_gst_item = false;
    //RCM-3
    this.Recorddet.jv_is_rcm = false;

    this.Recorddet.jv_cgst_rate = 0;
    this.Recorddet.jv_sgst_rate = 0;
    this.Recorddet.jv_igst_rate = 0;

    this.Recorddet.jv_cgst_amt = 0;
    this.Recorddet.jv_sgst_amt = 0;
    this.Recorddet.jv_igst_amt = 0;
    this.Recorddet.jv_gst_amt = 0;

    this.Recorddet.jv_net_total = 0;


    this.Recorddet.jv_drcr = this.detaildrcr;


    this.Recorddet.jv_doc_type = 'NA';
    this.Recorddet.jv_bank = '';
    this.Recorddet.jv_branch = '';
    this.Recorddet.jv_due_date = '';

    this.Recorddet.jv_pay_reason = '';
    this.Recorddet.jv_supp_docs = '';
    this.Recorddet.jv_paid_to = '';
    this.Recorddet.jv_remarks = '';

    this.Recorddet.jv_cntr_type_id = '';
    this.Recorddet.jv_cntr_type_code = '';

    this.Recorddet.jv_sac_id = '';
    this.Recorddet.jv_sac_code = '';

    this.Recorddet.jv_gst_edited = false;


    this.CCList = new Array<CostCentert>();
    this.PendingListRecords = new Array<pendinglist>();

    this.InitLov('DETAIL');

    this.CURRECORD.id = this.Record.jvh_curr_id;
    this.CURRECORD.code = this.Record.jvh_curr_code;
    this.CURRECORD.name = this.Record.jvh_curr_code;


    if (_OldRecorddet.jv_pkid != null) {  //setting previous record data for new records
      this.Recorddet.jv_curr_id = _OldRecorddet.jv_curr_id;
      this.Recorddet.jv_curr_code = _OldRecorddet.jv_curr_code;
      this.Recorddet.jv_curr_name = _OldRecorddet.jv_curr_name;
      this.Recorddet.jv_exrate = _OldRecorddet.jv_exrate;
      this.Recorddet.jv_cntr_type_id = _OldRecorddet.jv_cntr_type_id;
      this.Recorddet.jv_cntr_type_code = _OldRecorddet.jv_cntr_type_code;

      this.InitLov('CNTRTYPE');
      this.CNTRTYPERECORD.id = this.Recorddet.jv_cntr_type_id;
      this.CNTRTYPERECORD.code = this.Recorddet.jv_cntr_type_code;
      this.InitLov('CURRENCY');
      this.CURRECORD.id = this.Recorddet.jv_curr_id;
      this.CURRECORD.code = this.Recorddet.jv_curr_code;
      this.CURRECORD.name = this.Recorddet.jv_curr_code;
    }
    this.ChangeAccList();
  }

  LoadDetail(_Record: Ledgert) {
    this.Recorddet = new Ledgert;

    this.Recorddet.jv_pkid = _Record.jv_pkid;

    this.Recorddet.jv_acc_id = _Record.jv_acc_id;
    this.Recorddet.jv_acc_code = _Record.jv_acc_code;
    this.Recorddet.jv_acc_name = _Record.jv_acc_name;
    this.Recorddet.jv_acc_type_name = _Record.jv_acc_type_name;

    this.Recorddet.jv_acc_against_invoice = _Record.jv_acc_against_invoice;
    this.Recorddet.jv_acc_cost_centre = _Record.jv_acc_cost_centre;
    this.Recorddet.jv_is_taxable = _Record.jv_is_taxable;

    this.Recorddet.jv_curr_id = _Record.jv_curr_id;
    this.Recorddet.jv_curr_code = _Record.jv_curr_code;

    this.Recorddet.jv_cntr_type_id = _Record.jv_cntr_type_id;
    this.Recorddet.jv_cntr_type_code = _Record.jv_cntr_type_code;

    this.Recorddet.jv_qty = _Record.jv_qty;
    this.Recorddet.jv_rate = _Record.jv_rate;

    this.Recorddet.jv_drcr = _Record.jv_drcr;
    this.Recorddet.jv_ftotal = _Record.jv_ftotal;
    this.Recorddet.jv_exrate = _Record.jv_exrate;
    this.Recorddet.jv_total = _Record.jv_total;

    this.Recorddet.jv_taxable_amt = _Record.jv_taxable_amt;
    //RCM-4
    this.Recorddet.jv_is_rcm = _Record.jv_is_rcm;


    this.Recorddet.jv_cgst_rate = _Record.jv_cgst_rate;
    this.Recorddet.jv_cgst_amt = _Record.jv_cgst_amt;

    this.Recorddet.jv_sgst_rate = _Record.jv_sgst_rate;
    this.Recorddet.jv_sgst_amt = _Record.jv_sgst_amt;

    this.Recorddet.jv_igst_rate = _Record.jv_igst_rate;
    this.Recorddet.jv_igst_amt = _Record.jv_igst_amt;

    this.Recorddet.jv_sac_id = _Record.jv_sac_id;
    this.Recorddet.jv_sac_code = _Record.jv_sac_code;


    this.Recorddet.jv_doc_type = _Record.jv_doc_type;
    this.Recorddet.jv_bank = _Record.jv_bank;
    this.Recorddet.jv_branch = _Record.jv_branch;
    this.Recorddet.jv_chqno = _Record.jv_chqno;
    this.Recorddet.jv_due_date = _Record.jv_due_date;

    this.Recorddet.jv_pay_reason = _Record.jv_pay_reason;
    this.Recorddet.jv_supp_docs = _Record.jv_supp_docs;
    this.Recorddet.jv_paid_to = _Record.jv_paid_to;
    this.Recorddet.jv_remarks = _Record.jv_remarks;

    this.Recorddet.jv_gst_edited = _Record.jv_gst_edited;

    this.InitLov('DETAIL');

    this.ACCRECORD.id = this.Recorddet.jv_acc_id;
    this.ACCRECORD.code = this.Recorddet.jv_acc_code;
    this.ACCRECORD.name = this.Recorddet.jv_acc_name;

    this.CURRECORD.id = this.Recorddet.jv_curr_id;
    this.CURRECORD.code = this.Recorddet.jv_curr_code;

    this.SACRECORD.id = this.Recorddet.jv_sac_id;
    this.SACRECORD.code = this.Recorddet.jv_sac_code;

    this.CNTRTYPERECORD.id = this.Recorddet.jv_cntr_type_id;
    this.CNTRTYPERECORD.code = this.Recorddet.jv_cntr_type_code;

    this.CCList = this.Record.CostCenterList.filter(rec => rec.ct_jv_id == _Record.jv_pkid);

    this.ChangeAccList();

    this.PendingListRecords = new Array<pendinglist>();
  }

  LoadPendingList(content: any) {


    this.ErrorMessage = '';
    if (this.Recorddet.jv_acc_against_invoice == "N") {
      this.ErrorMessage = 'Allocation option not set for this account';
      alert(this.ErrorMessage);
      return;
    }
    if (this.Recorddet.jv_acc_against_invoice == "D" && this.Recorddet.jv_drcr == "DR") {
      this.ErrorMessage = 'Only Credit Entry can be Allocated';
      alert(this.ErrorMessage);
      return;
    }
    if (this.Recorddet.jv_acc_against_invoice == "C" && this.Recorddet.jv_drcr == "CR") {
      this.ErrorMessage = 'Only Debit Entry can be Allocated';
      alert(this.ErrorMessage);
      return;
    }
    if (this.Recorddet.jv_total <= 0) {
      this.ErrorMessage = 'Amount is not Entered';
      alert(this.ErrorMessage);
      return;
    }

    let SearchData = {
      jvhid: this.pkid,
      jvid: this.Recorddet.jv_pkid,
      accid: this.Recorddet.jv_acc_id,
      type: "",
      company_code: this.gs.globalVariables.comp_code,
      branch_code: this.gs.globalVariables.branch_code,
      year_code: this.gs.globalVariables.year_code
    };

    if (this.Recorddet.jv_drcr == "DR")
      SearchData.type = "DR";
    if (this.Recorddet.jv_drcr == "CR")
      SearchData.type = "CR";

    this.ErrorMessage = '';
    this.InfoMessage = '';
    this.loading = true;
    this.mainService.GetPendingList(SearchData)
      .subscribe(response => {
        this.loading = false;
        this.PendingListRecords = response.list;
        this.open(content);
      },
        error => {
          this.loading = false;
          this.ErrorMessage = this.gs.getError(error);
          alert(this.ErrorMessage);
        });
  }

  Ok() {
    let bok = true;


    if (this.Recorddet.jv_qty <= 0) {
      this.ErrorMessage = 'Invalid Qty';
      alert(this.ErrorMessage);
      return;
    }
    if (this.Recorddet.jv_rate <= 0) {
      this.ErrorMessage = 'Invalid Rate';
      alert(this.ErrorMessage);
      return;
    }
    if (this.Recorddet.jv_ftotal <= 0 || this.Recorddet.jv_total <= 0) {
      this.ErrorMessage = 'Invalid Total';
      alert(this.ErrorMessage);
      return;
    }

    if (this.Recorddet.jv_curr_id == '') {
      this.ErrorMessage = 'Invalid Currency';
      alert(this.ErrorMessage);
      return;
    }


    if (this.Recorddet.jv_exrate <= 0) {
      this.ErrorMessage = 'Invalid Ex.Rate';
      alert(this.ErrorMessage);
      return;
    }

    if (this.Record.jvh_cc_category == 'NA') {
      if (this.Recorddet.jv_acc_cost_centre == "Y") {
        if (this.CCList.length <= 0) {
          this.ErrorMessage = 'Cost Center Not Allocated';
          alert(this.ErrorMessage);
          return;
        }
      }
    }


    if (!this.Recorddet.jv_is_taxable) {
      this.Recorddet.jv_taxable_amt = 0;
    }


    if (this.Record.jvh_gst) {

      if (this.Recorddet.jv_is_taxable) {

        if (this.Recorddet.jv_taxable_amt <= 0) {
          this.ErrorMessage = 'Invalid Taxable Amount';
          alert(this.ErrorMessage);
          return;
        }
        // Check GST Amt And Rate - INTRA-STATE
        if (this.Record.jvh_gst_type == "INTRA-STATE") {
          if (this.Recorddet.jv_cgst_amt <= 0 || this.Recorddet.jv_sgst_amt <= 0 || this.Recorddet.jv_cgst_rate <= 0 || this.Recorddet.jv_sgst_rate <= 0) {
            this.ErrorMessage = 'Invalid CGST/SGST Amt/Rate';
            alert(this.ErrorMessage);
            return;
          }
        }
        // Check GST Amt And Rate - INTER-STATE
        if (this.Record.jvh_gst_type == "INTER-STATE") {
          if (this.Recorddet.jv_igst_amt <= 0 || this.Recorddet.jv_igst_rate <= 0) {
            this.ErrorMessage = 'Invalid IGST Amt/Rate';
            alert(this.ErrorMessage);
            return;
          }
        }
        if (this.Record.jvh_gst_type == "INTER-STATE") {
          if (this.Recorddet.jv_cgst_amt != 0 || this.Recorddet.jv_sgst_amt != 0 || this.Recorddet.jv_cgst_rate != 0 || this.Recorddet.jv_sgst_rate != 0) {
            this.ErrorMessage = 'Invalid CGST/SGST Amt/Rate';
            alert(this.ErrorMessage);
            return;
          }
        }
        if (this.Record.jvh_gst_type == "INTRA-STATE") {
          if (this.Recorddet.jv_igst_amt != 0 || this.Recorddet.jv_igst_rate != 0) {
            this.ErrorMessage = 'Invalid IGST';
            alert(this.ErrorMessage);
            return;
          }
        }
        // Not Taxable
        if (!this.Recorddet.jv_is_taxable) {
          if (this.Recorddet.jv_cgst_amt != 0 || this.Recorddet.jv_sgst_amt != 0 || this.Recorddet.jv_igst_amt != 0 || this.Recorddet.jv_cgst_rate != 0 || this.Recorddet.jv_sgst_rate != 0 || this.Recorddet.jv_igst_rate != 0) {
            this.ErrorMessage = 'GST Amt/Rate Should Be Blank';
            alert(this.ErrorMessage);
            return;
          }
        }
      }
    }

    // No GST
    if (!this.Record.jvh_gst) {
      if (this.Recorddet.jv_is_taxable) {
        if (this.Recorddet.jv_cgst_amt != 0 || this.Recorddet.jv_sgst_amt != 0 || this.Recorddet.jv_igst_amt != 0) {
          this.ErrorMessage = 'GST Amt/Rate Should Be Blank';
          alert(this.ErrorMessage);
          return;
        }
      }
      if (!this.Recorddet.jv_is_taxable) {
        if (this.Recorddet.jv_cgst_amt != 0 || this.Recorddet.jv_sgst_amt != 0 || this.Recorddet.jv_igst_amt != 0) {
          this.ErrorMessage = 'GST Amt/Rate Should Be Blank';
          alert(this.ErrorMessage);
          return;
        }
      }
    }

    this.Recorddet.jv_qty = this.Recorddet.jv_qty;
    this.Recorddet.jv_rate = this.Recorddet.jv_rate;

    if (this.Recorddet.jv_drcr == "DR") {
      this.Recorddet.jv_row_type = 'DR-LEDGER';
      this.Recorddet.jv_debit = this.Recorddet.jv_total;
      this.Recorddet.jv_credit = 0;
    }
    if (this.Recorddet.jv_drcr == "CR") {
      this.Recorddet.jv_row_type = 'CR-LEDGER';
      this.Recorddet.jv_debit = 0;
      this.Recorddet.jv_credit = this.Recorddet.jv_total;
    }
    this.Recorddet.jv_gst_amt = this.Recorddet.jv_cgst_amt + this.Recorddet.jv_sgst_amt + this.Recorddet.jv_igst_amt;
    if (this.Record.jvh_rc)
      this.Recorddet.jv_net_total = this.Recorddet.jv_total;
    else
      this.Recorddet.jv_net_total = this.Recorddet.jv_total + this.Recorddet.jv_gst_amt;

    if (this.modeDetail == 'ADD') {
      this.Record.LedgerList.push(this.Recorddet);
    }
    if (this.modeDetail == 'EDIT') {
      var REC = this.Record.LedgerList.find(rec => rec.jv_pkid == this.Recorddet.jv_pkid);
      REC.jv_acc_id = this.Recorddet.jv_acc_id;
      REC.jv_acc_code = this.Recorddet.jv_acc_code;
      REC.jv_acc_name = this.Recorddet.jv_acc_name;
      REC.jv_acc_type_name = this.Recorddet.jv_acc_type_name;

      REC.jv_acc_against_invoice = this.Recorddet.jv_acc_against_invoice;   // Against Invoice
      REC.jv_acc_cost_centre = this.Recorddet.jv_acc_cost_centre;      //  Cost Center
      REC.jv_is_taxable = this.Recorddet.jv_is_taxable;

      //RCM-5
      REC.jv_is_rcm = this.Recorddet.jv_is_rcm;

      REC.jv_is_gst_item = this.Recorddet.jv_is_gst_item;

      REC.jv_curr_id = this.Recorddet.jv_curr_id;
      REC.jv_curr_code = this.Recorddet.jv_curr_code;

      REC.jv_sac_id = this.Recorddet.jv_sac_id;
      REC.jv_sac_code = this.Recorddet.jv_sac_code;

      REC.jv_cntr_type_id = this.Recorddet.jv_cntr_type_id;
      REC.jv_cntr_type_code = this.Recorddet.jv_cntr_type_code;

      REC.jv_qty = this.Recorddet.jv_qty;
      REC.jv_rate = this.Recorddet.jv_rate;

      REC.jv_drcr = this.Recorddet.jv_drcr;
      REC.jv_ftotal = this.Recorddet.jv_ftotal;
      REC.jv_exrate = this.Recorddet.jv_exrate;
      REC.jv_total = this.Recorddet.jv_total;
      REC.jv_taxable_amt = this.Recorddet.jv_taxable_amt;

      REC.jv_cgst_rate = this.Recorddet.jv_cgst_rate;
      REC.jv_cgst_amt = this.Recorddet.jv_cgst_amt;
      REC.jv_sgst_rate = this.Recorddet.jv_sgst_rate;
      REC.jv_sgst_amt = this.Recorddet.jv_sgst_amt;

      REC.jv_igst_rate = this.Recorddet.jv_igst_rate;
      REC.jv_igst_amt = this.Recorddet.jv_igst_amt;

      REC.jv_gst_amt = REC.jv_cgst_amt + REC.jv_sgst_amt + REC.jv_igst_amt;
      REC.jv_net_total = this.Recorddet.jv_total + REC.jv_gst_amt;

      REC.jv_gst_edited = this.Recorddet.jv_gst_edited;

      if (REC.jv_drcr == "DR") {
        REC.jv_row_type = 'DR-LEDGER';
        REC.jv_debit = REC.jv_total;
        REC.jv_credit = 0;
      }
      if (REC.jv_drcr == "CR") {
        REC.jv_row_type = 'CR-LEDGER';
        REC.jv_debit = 0;
        REC.jv_credit = REC.jv_total;
      }

      REC.jv_doc_type = this.Recorddet.jv_doc_type;
      REC.jv_bank = this.Recorddet.jv_bank;
      REC.jv_branch = this.Recorddet.jv_branch;
      REC.jv_chqno = this.Recorddet.jv_chqno;
      REC.jv_due_date = this.Recorddet.jv_due_date;

      REC.jv_pay_reason = this.Recorddet.jv_pay_reason;
      REC.jv_supp_docs = this.Recorddet.jv_supp_docs;
      REC.jv_paid_to = this.Recorddet.jv_paid_to;
      REC.jv_remarks = this.Recorddet.jv_remarks;


    }

    // CostCenter Processing
    var i;
    for (i = this.Record.CostCenterList.length - 1; i >= 0; i -= 1) {
      if (this.Record.CostCenterList[i].ct_jv_id === this.Recorddet.jv_pkid) {
        this.Record.CostCenterList.splice(i, 1);
      }
    }

    let iCtr: number = 0;
    this.CCList.forEach(rec => {
      iCtr++;
      rec.ct_ctr = iCtr;
      rec.ct_jv_id = this.Recorddet.jv_pkid;
      rec.ct_acc_id = this.Recorddet.jv_acc_id;
      this.Record.CostCenterList.push(rec);
    });





    this.FindTotal();

    if (this.modeDetail == 'ADD') {
      this.ActionHandlerDetail("ADD", null);
    }
    if (this.modeDetail == 'EDIT') {
      this.ActionHandlerDetail("LIST", null);
    }

  }

  GstCheckBox() {
    this.FindTotal();
  }

  RcCheckBox() {
    this.FindTotal();
  }

  FindTotal() {

    let gst_drcr: string = '';


    let ftotamt_dr = 0;
    let ftotamt_cr = 0;
    let ftotamt = 0;

    let fcgstamt = 0;
    let fsgstamt = 0;
    let figstamt = 0;
    let fgstamt = 0;
    let fnetamt = 0;

    let totamt_dr = 0;
    let totamt_cr = 0;

    let totamt = 0;
    let cgstamt = 0;
    let sgstamt = 0;
    let igstamt = 0;
    let gstamt = 0;
    let netamt = 0;

    let total_debit: number = 0;
    let total_credit: number = 0;


    this.diff = 0;

    this.Record.LedgerList.forEach(rec => {

      total_debit += rec.jv_debit;
      total_credit += rec.jv_credit;

      rec.jv_cgst_famt = this.gs.roundNumber(rec.jv_cgst_amt / this.Record.jvh_exrate, 2);
      rec.jv_sgst_famt = this.gs.roundNumber(rec.jv_sgst_amt / this.Record.jvh_exrate, 2);
      rec.jv_igst_famt = this.gs.roundNumber(rec.jv_igst_amt / this.Record.jvh_exrate, 2);
      rec.jv_gst_famt = rec.jv_cgst_famt + rec.jv_sgst_famt + rec.jv_igst_famt;

      rec.jv_gst_rate = rec.jv_cgst_rate + rec.jv_sgst_rate + rec.jv_igst_rate;

      if (this.Record.jvh_curr_id == rec.jv_curr_id)
        rec.jv_total_fc = rec.jv_ftotal;
      else
        rec.jv_total_fc = this.gs.roundNumber(rec.jv_total / this.Record.jvh_exrate, 2);

      if (!this.Record.jvh_rc)
        rec.jv_net_ftotal = rec.jv_total_fc + rec.jv_gst_famt;

      rec.jv_net_total = rec.jv_total;
      if (!this.Record.jvh_rc)
        rec.jv_net_total = rec.jv_total + rec.jv_gst_amt;

      //This is new added to round row net total from 13/12/2022
      rec.jv_net_total = this.gs.roundNumber(rec.jv_net_total, 2);

      cgstamt += rec.jv_cgst_amt;
      sgstamt += rec.jv_sgst_amt;
      igstamt += rec.jv_igst_amt;
      gstamt += rec.jv_gst_amt;


      fcgstamt += rec.jv_cgst_famt;
      fsgstamt += rec.jv_sgst_famt;
      figstamt += rec.jv_igst_famt;
      fgstamt += rec.jv_gst_famt;

      if (rec.jv_debit > 0) {
        ftotamt_dr += rec.jv_total_fc;
        totamt_dr += rec.jv_total;
        if (rec.jv_gst_amt != 0)
          gst_drcr = 'DR';
      }
      if (rec.jv_credit > 0) {
        ftotamt_cr += rec.jv_total_fc;
        totamt_cr += rec.jv_total;
        if (rec.jv_gst_amt != 0)
          gst_drcr = 'CR';
      }
    });

    // Foreign Currency
    if (this.headerdrcr == "DR") {
      this.Record.jvh_tot_famt = ftotamt_cr - ftotamt_dr;
    }
    if (this.headerdrcr == "CR") {
      this.Record.jvh_tot_famt = ftotamt_dr - ftotamt_cr;
    }

    this.Record.jvh_cgst_famt = fcgstamt;
    this.Record.jvh_sgst_famt = fsgstamt;
    this.Record.jvh_igst_famt = figstamt;
    this.Record.jvh_gst_famt = fgstamt;

    if (this.Record.jvh_rc)
      this.Record.jvh_net_famt = this.Record.jvh_tot_famt;
    else
      this.Record.jvh_net_famt = this.Record.jvh_tot_famt + fgstamt;


    // Local Currency
    if (this.headerdrcr == "DR") {
      this.Record.jvh_tot_amt = totamt_cr - totamt_dr;
    }
    if (this.headerdrcr == "CR") {
      this.Record.jvh_tot_amt = totamt_dr - totamt_cr;
    }

    this.Record.jvh_cgst_amt = cgstamt;
    this.Record.jvh_sgst_amt = sgstamt;
    this.Record.jvh_igst_amt = igstamt;
    this.Record.jvh_gst_amt = gstamt;
    if (this.Record.jvh_rc)
      this.Record.jvh_net_amt = this.Record.jvh_tot_amt;
    else
      this.Record.jvh_net_amt = this.Record.jvh_tot_amt + gstamt;

    // Local Currency

    this.Record.jvh_debit = total_debit;
    this.Record.jvh_credit = total_credit;

    if (this.headerdrcr == "DR")
      this.diff = (total_credit - total_debit);
    if (this.headerdrcr == "CR")
      this.diff = (total_debit - total_credit);

    //If Not Reverse Charge
    if (!this.Record.jvh_rc) {
      this.diff = this.diff + gstamt;
    }
    this.Record.jvh_diff = this.diff;
  }

  PendingListOkSelected(sAction: string) {
    this.ProcessPendingList = true;
    this.modal.close();
  }
  open(content: any) {
    this.modal = this.modalService.open(content, { backdrop: 'static', keyboard: true });
  }



  onLostFocus(field: string) {
    if (field == 'jvh_cc_code') {
      this.SearchRecord('jvh_cc_code');
    }

    if (field == 'jvh_cc_category') {
      this.Record.jvh_cc_code = '';
      this.Record.jvh_cc_id = '';
      this.Record.jvh_cc_name = 'Invalid CostCenter';
      this.ChangeAccList();
    }
  }


  SearchRecord(controlname: string) {
    this.ErrorMessage = '';

    if (controlname == 'updatebrokerage') {
      if (this.Record.jvh_brok_amt > 0) {
        if (this.Record.jvh_brok_exrate <= 0) {
          this.ErrorMessage = "Brokerage Exchange Rate Need To Be Entered";
          alert(this.ErrorMessage);
          return;
        }
      }
    }

    this.loading = true;
    let SearchData = {
      table: '',
      pkid: '',
      comp_code: '',
      branch_code: '',
      type: '',
      year: '',
      searchstring: '',
      no_brok: '',
      basic_frt: 0,
      brok_per: 0,
      brok_amt: 0,
      brok_exrate: 0,
      brok_amt_inr: 0,
      brok_remarks: '',
      jvh_reference: '',
      jvh_reference_date: '',
      jvh_org_invno: '',
      jvh_org_invdt: '',
      jvh_date: ''
    };
    if (controlname == 'taxcode') {
      SearchData.table = 'acctm';
      SearchData.pkid = this.Recorddet.jv_acc_id;
      // SearchData.jvh_date = this.Record.jvh_date;//TAXRATECHANGED
    }
    if (controlname == 'jvh_cc_code') {
      SearchData.table = 'costcenterm';
      SearchData.type = this.Record.jvh_cc_category;
      SearchData.comp_code = this.gs.globalVariables.comp_code;
      SearchData.branch_code = this.gs.globalVariables.branch_code;
      SearchData.year = this.gs.globalVariables.year_code;
      SearchData.searchstring = this.Record.jvh_cc_code;
    }

    if (controlname == 'updatebrokerage') {
      SearchData.table = 'updatebrokerage';
      SearchData.pkid = this.Record.jvh_pkid;
      SearchData.no_brok = this.Record.jvh_no_brok == true ? "Y" : "N";
      SearchData.basic_frt = this.Record.jvh_basic_frt;
      SearchData.brok_per = this.Record.jvh_brok_per;
      SearchData.brok_amt = this.Record.jvh_brok_amt;
      SearchData.brok_exrate = this.Record.jvh_brok_exrate;
      SearchData.brok_amt_inr = this.Record.jvh_brok_amt_inr;
      SearchData.brok_remarks = this.Record.jvh_brok_remarks;
      SearchData.jvh_reference = this.Record.jvh_reference;
      SearchData.jvh_reference_date = this.Record.jvh_reference_date;
      SearchData.jvh_org_invno = this.Record.jvh_org_invno;
      SearchData.jvh_org_invdt = this.Record.jvh_org_invdt;
    }

    this.ErrorMessage = '';
    this.gs.SearchRecord(SearchData)
      .subscribe(response => {
        this.loading = false;

        if (controlname == 'taxcode') {
          this.Recorddet.jv_sac_id = '';
          this.Recorddet.jv_sac_name = '';

          this.Recorddet.jv_cgst_rate = 0;
          this.Recorddet.jv_sgst_rate = 0;
          this.Recorddet.jv_igst_rate = 0;

          this.Recorddet.jv_cgst_amt = 0;
          this.Recorddet.jv_sgst_amt = 0;
          this.Recorddet.jv_igst_amt = 0;

          this.Recorddet.jv_is_gst_item = false;

          this.ErrorMessage = '';

          if (this.Recorddet.jv_taxable_amt <= 0) {
            this.Recorddet.jv_taxable_amt = this.Recorddet.jv_total;
          }

          if (response.acctm.length > 0) {
            this.Recorddet.jv_sac_id = response.acctm[0].acc_sac_id;
            this.Recorddet.jv_sac_code = response.acctm[0].acc_sac_code;

            if (response.acctm[0].acc_cgst_rate > 0 || response.acctm[0].acc_sgst_rate > 0 || response.acctm[0].acc_igst_rate > 0) {
              this.Recorddet.jv_is_gst_item = true;
            }

            if (this.Record.jvh_gst) {
              if (this.Record.jvh_gst_type == "INTRA-STATE") {
                this.Recorddet.jv_cgst_rate = response.acctm[0].acc_cgst_rate;
                this.Recorddet.jv_sgst_rate = response.acctm[0].acc_sgst_rate;
              }
              if (this.Record.jvh_gst_type == "INTER-STATE") {
                this.Recorddet.jv_igst_rate = response.acctm[0].acc_igst_rate;
              }
              /*
              if (this.Recorddet.jv_cgst_rate > 0 || this.Recorddet.jv_sgst_rate > 0 || this.Recorddet.jv_igst_rate > 0) {
                this.Recorddet.jv_is_taxable = true;
              }
              */
            }
          }
          else {
            this.ErrorMessage = 'Invalid Code';
            alert(this.ErrorMessage);
          }
          this.InitLov('SAC')
          this.SACRECORD.id = this.Recorddet.jv_sac_id;
          this.SACRECORD.code = this.Recorddet.jv_sac_code;
          this.FindRowTotal();
        }
        if (controlname == 'jvh_cc_code') {
          if (response.costcenterm.length == 0) {
            this.Record.jvh_cc_code = '';
            this.Record.jvh_cc_id = '';
            this.Record.jvh_cc_name = 'Invalid CostCenter';
          }
          else {
            this.Record.jvh_cc_id = response.costcenterm[0].cc_pkid;
            this.Record.jvh_cc_code = response.costcenterm[0].cc_code;
            this.Record.jvh_cc_name = response.costcenterm[0].cc_name;
          }
        }
        if (controlname == 'updatebrokerage') {
          this.ErrorMessage = 'Save Complete';
          alert(this.ErrorMessage);
        }
      },
        error => {
          this.loading = false;
          this.ErrorMessage = this.gs.getError(error);
          alert(this.ErrorMessage);
        });
  }
  Onchange() {
    this.remarks = !this.remarks;
  }

  GetBrAddress(straddress: string) {
    let AddressSplit = {
      addressbrno: '',
      address: ''
    };
    if (straddress.trim() != "") {
      var temparr = straddress.split(' ');
      AddressSplit.addressbrno = temparr[0];
      AddressSplit.address = straddress.substr(AddressSplit.addressbrno.length).trim();
    }
    return AddressSplit;
  }

  folder_id: string;
  PrintInvoice(reportformat: string, _type: string = 'PDF') {

    if (this.type == "DI" || this.type == "CI")
      return;


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

  PrintVoucher(Id: string, _type: string) {
    this.folder_id = this.gs.getGuid();
    this.loading = true;
    let SearchData = {
      type: _type,
      pkid: Id,
      report_folder: '',
      folderid: '',
      branch_code: '',
      report_caption: ''
    };
    SearchData.type = _type;
    SearchData.pkid = this.pkid;
    SearchData.report_folder = this.gs.globalVariables.report_folder;
    SearchData.branch_code = this.gs.globalVariables.branch_code;
    SearchData.folderid = this.folder_id;
    SearchData.report_caption = "MBL EXPENSE";

    this.ErrorMessage = '';
    this.InfoMessage = '';
    this.mainService.PrintVoucher(SearchData)
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


  ChangeAccList() {
    let str: string = '';
    this.ACCRECORD.where = "1=2";
    if (this.Record.jvh_cc_category == "SI SEA EXPORT" || this.Record.jvh_cc_category == "MBL SEA EXPORT") {
      this.ACCRECORD.where = "acc_main_code in ('1104','1105','1106','1107')";
      if (this.type == "DN" || this.type == "CN" || this.type == "DI" || this.type == "CI")
        this.ACCRECORD.where = "acc_main_code in ('1101','1102','1103','1104', '1105','1106','1107')";
    }
    if (this.Record.jvh_cc_category == "SI AIR EXPORT" || this.Record.jvh_cc_category == "MAWB AIR EXPORT") {
      this.ACCRECORD.where = "acc_main_code in ('1204','1205')";
      if (this.type == "DN" || this.type == "CN" || this.type == "DI" || this.type == "CI")
        this.ACCRECORD.where = "acc_main_code in ('1201','1202','1203','1204', '1205')";
    }
    if (this.Record.jvh_cc_category == "SI SEA IMPORT" || this.Record.jvh_cc_category == "MBL SEA IMPORT") {
      this.ACCRECORD.where = "acc_main_code in ('1304','1305', '1306','1307')";
      if (this.type == "DN" || this.type == "CN" || this.type == "DI" || this.type == "CI")
        this.ACCRECORD.where = "acc_main_code in ('1301','1302','1303','1304', '1305','1306','1307')";
    }
    if (this.Record.jvh_cc_category == "SI AIR IMPORT" || this.Record.jvh_cc_category == "MAWB AIR IMPORT") {
      this.ACCRECORD.where = "acc_main_code in ('1404','1405')";

      if (this.type == "DN" || this.type == "CN" || this.type == "DI" || this.type == "CI")
        this.ACCRECORD.where = "acc_main_code in ('1401','1402','1403','1404', '1405')";
    }
    if (this.Record.jvh_cc_category == "GENERAL JOB") {
      str = "'1105','1106','1107','1101','1102','1103','1104', '1105','1106','1107',";
      str += "'1205','1201','1202','1203','1204', '1205','1305', '1306','1307','1301','1302','1303','1304', '1305','1306','1307',";
      str += "'1405','1401','1402','1403','1404', '1405'";
      this.ACCRECORD.where = "acc_main_code in (" + str + ")";

      if (this.gs.globalVariables.comp_code != "CPL") {
        str = " acc_group_id in ( select acgrp_pkid  from acgroupm where acgrp_name  ='DIRECT INCOME' and rec_company_code = '" + this.gs.globalVariables.comp_code + "')";
        this.ACCRECORD.where = str;
      }
    }

  }

  PaymentRequest(payrequest: any) {
    this.open(payrequest);
  }

  ShowDocuments(doc: any) {
    this.CanShowDoc = true;
    this.open(doc);
  }

  ShowApproval(approval: any, _sid: string) {
    this.CanShowDoc = false;
    this.ErrorMessage = '';
    this.pkid = _sid;
    this.open(approval);
  }
  ModifiedRecords(params: any) {
    this.CanShowDoc = true;
    /* var REC = this.RecordList.find(rec => rec.jvh_pkid == params.sid);
     if (REC != null) {
       if (params.stype == "PN") {
         if (params.mstatus.length > 0) {//if master updated then mstatus length greater than zero
           REC.rec_aprvd_status = params.mstatus;
           REC.rec_aprvd_remark = params.mremarks;
           REC.rec_aprvd_by = this.gs.globalVariables.user_code;
         }
       }
     }*/
    this.modal.close();
  }

  CallbackEventPayRequest(params: any) {

    if (params.saction == "SAVE") {
      var REC = this.RecordList.find(rec => rec.jvh_pkid == params.sid);
      if (REC != null) {
        // REC.jvh_due_date = this.gs.ConvertDate2DisplayFormat(params.duedate);
        REC.jvh_crdays = params.crdays;
      }
      this.Record.jvh_crdays = params.crdays;
    }
    this.modal.close();
  }
  closeAprovalModal() {
    this.modal.close();
    this.CanShowDoc = true;
  }

  IsDupliation(_searchString: string) {

    let SearchData = {
      pkid: '',
      company_code: '',
      branch_code: '',
      type: '',
      year_code: '',
      searchstring: ''
    };

    SearchData.pkid = this.Record.jvh_pkid;
    SearchData.type = this.Record.jvh_type;
    SearchData.company_code = this.gs.globalVariables.comp_code;
    SearchData.branch_code = this.gs.globalVariables.branch_code;
    SearchData.year_code = this.gs.globalVariables.year_code;
    SearchData.searchstring = _searchString;

    this.loading = true;
    this.ErrorMessage = '';
    this.mainService.IsRefnoDuplication(SearchData)
      .subscribe(response => {
        this.loading = false;
        if (response.retvalue) {
          this.ErrorMessage = response.retstring;
          alert(this.ErrorMessage);
        }

      },
        error => {
          this.loading = false;
          this.ErrorMessage = this.gs.getError(error);
          alert(this.ErrorMessage);
        });
  }
  ProcessRemarks() {

    if (this.gs.isBlank(this.RecordList)) {
      alert('List Not Found');
      return;
    }
    if (!confirm("Update Paid Status")) {
      return;
    }

    this.loading = true;
    let SearchData = {
      pkid: '',
      parentid: this.parentid,
      company_code: this.gs.globalVariables.comp_code,
      branch_code: this.gs.globalVariables.branch_code,
      year_code: this.gs.globalVariables.year_code,
      user_code: this.gs.globalVariables.user_code
    };

    this.ErrorMessage = '';
    this.InfoMessage = '';
    this.mainService.ProcessRemarks(SearchData)
      .subscribe(response => {
        this.loading = false;
        this.currentTab = 'LIST';
        this.List("NEW");
      },
        error => {
          this.loading = false;
          this.ErrorMessage = this.gs.getError(error);
          alert(this.ErrorMessage);
        });
  }

  LoadExpBooking() {

    if (!this.gs.isBlank(this.Record.LedgerList)) {
      alert('Cannot load details exist');
      return;
    }

    if (!this.Record.jvh_gst) {
      alert('GST not selected');
      return;
    }

    if (this.gs.isBlank(this.Record.jvh_acc_name) || this.gs.isBlank(this.Record.jvh_acc_id)) {
      alert('Party cannot be blank');
      return;
    }
    if (this.gs.isBlank(this.Record.jvh_acc_br_address) || this.gs.isBlank(this.Record.jvh_acc_br_id)) {
      alert('Party address cannot be blank');
      return;
    }

    this.loading = true;
    let SearchData = {
      type: this.type,
      parentid: 'E-' + this.parentid,
      jvh_gst: this.Record.jvh_gst == true ? true : false,
      jvh_gst_type: this.Record.jvh_gst_type,
      company_code: this.gs.globalVariables.comp_code,
      branch_code: this.gs.globalVariables.branch_code,
      year_code: this.gs.globalVariables.year_code,
      user_code: this.gs.globalVariables.user_code
    };

    this.ErrorMessage = '';
    this.InfoMessage = '';
    this.mainService.LoadExpBooking(SearchData)
      .subscribe(response => {
        this.loading = false;
        let ExpList: Ledgert[] = response.list
        for (let rec of ExpList) {
          this.modeDetail = 'ADD';
          this.Recorddet = new Ledgert;
          this.Recorddet = rec;
          this.FindRowTotal();
          this.Ok();
        }
        this.ActionHandlerDetail("LIST", null);
        this.FindTotal();

      },
        error => {
          this.loading = false;
          this.ErrorMessage = this.gs.getError(error);
          alert(this.ErrorMessage);
        });
  }

  IsDatesInSameMonth(_date: string, _content: any) {

    let SearchData = {
      table: 'DATES-IN-SAME-MONTH',
      rowtype: this.type,
      company_code: this.gs.globalVariables.comp_code,
      branch_code: this.gs.globalVariables.branch_code,
      year_code: this.gs.globalVariables.year_code,
      jvh_date: this.Record.jvh_date,
      jvh_org_invdt: _date
    };

    this.loading = true;
    this.ErrorMessage = '';
    this.gs.SearchRecord(SearchData)
      .subscribe(response => {
        this.loading = false;
        if (!response.retvalue) {
          this.ErrorMessage = response.retstring;
          // alert(this.ErrorMessage);
          this.modal = this.modalService.open(_content, { size: "sm", backdrop: 'static', keyboard: false, windowClass: 'modal-custom' })
        } else {
          if (!this.gs.isBlank(this.modal))
            this.modal.close();
        }

      },
        error => {
          this.loading = false;
          this.ErrorMessage = this.gs.getError(error);
          alert(this.ErrorMessage);
        });
  }

}


