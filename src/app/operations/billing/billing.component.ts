


import { Component, ViewEncapsulation, Input, OnInit, OnDestroy, ViewChild } from '@angular/core';

import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';


import { ActivatedRoute } from '@angular/router';

import { GlobalService } from '../../core/services/global.service';

import { Ledgerh } from '../models/ledgerh';
import { Ledgert } from '../models/ledgert';
import { BillingService } from '../services/billing.service';

import { SearchTable } from '../../shared/models/searchtable';
import { DateComponent } from '../../shared/date/date.component';


@Component({
  selector: 'app-billing',
  templateUrl: './billing.component.html',
  providers: [BillingService]
})



export class BillingComponent {
  // Local Variables 
  // title = 'Billing Details';
  title = 'Invoice';
  @ViewChild('jvh_date') private jvh_date: DateComponent;
  @Input() parentid: string = '';
  @Input() menuid: string = '';
  @Input() type: string = '';
  @Input() subtype: string = '';
  @Input() editdrcr: string = '';
  headerdrcr: string = '';
  detaildrcr: string = '';

  InitCompleted: boolean = false;
  menu_record: any;


  cc_category_type: string = '';

  cc_category: string = '';

  bAdmin: boolean = false;
  lock_record: boolean = false;
  lock_date: boolean = false;


  narration: string;
  narration_shipper: string;

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

  LockErrorMessage = "";
  ErrorMessage = "";
  InfoMessage = "";

  mode = '';
  pkid = '';

  modeDetail = '';

  diff: number = 0;

  mSubject: string = '';
  mMsg: string = '';
  sHtml: string = '';
  AttachList: any[] = [];
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

    this.cc_category_type = this.type;
    this.cc_category = 'SI ' + this.type;
    this.bAdmin = false;
    // SI SEA EXPORT
    // SI AIR EXPORT
    // SI SEA IMPORT
    // SI SEA IMPORT

    // jvh_cc_category
    // jvh_cc_code
    // jvh_cc_name

    this.menu_record = this.gs.getMenu('ARINVOICE');
    if (this.menu_record) {
      this.title = this.menu_record.menu_name;
      if (this.menu_record.rights_admin)
        this.bAdmin = true;
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
      if (this.cc_category_type == "SEA EXPORT")
        this.PARTYRECORD.where = "(acc_type_id in (select actype_pkid from actypem where rec_company_code ='" + this.gs.globalVariables.comp_code + "'  and actype_name = 'DEBTORS') or acc_code= '1105001' )";
      if (this.cc_category_type == "AIR EXPORT")
        this.PARTYRECORD.where = "(acc_type_id in (select actype_pkid from actypem where rec_company_code ='" + this.gs.globalVariables.comp_code + "'  and actype_name = 'DEBTORS') or acc_code= '1205001' )";
      if (this.cc_category_type == "SEA IMPORT")
        this.PARTYRECORD.where = "(acc_type_id in (select actype_pkid from actypem where rec_company_code ='" + this.gs.globalVariables.comp_code + "'  and actype_name = 'DEBTORS') or acc_code= '1305001' )";
      if (this.cc_category_type == "AIR IMPORT")
        this.PARTYRECORD.where = "(acc_type_id in (select actype_pkid from actypem where rec_company_code ='" + this.gs.globalVariables.comp_code + "'  and actype_name = 'DEBTORS') or acc_code= '1405001' )";

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


      if (this.narration_shipper == _Record.name)
        this.Record.jvh_narration = _Record.name + ' ' + this.narration;
      else
        this.Record.jvh_narration = _Record.name + ' ON A/C OF ' + this.narration_shipper + ' ' + this.narration;


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

      this.Record.jvh_gst_type = this.gs.getGstType(this.Record.jvh_gstin, this.Record.jvh_state_code, this.Record.jvh_sez);

    }

    if (_Record.controlname == "INVCURRENCY") {
      this.Record.jvh_curr_id = _Record.id;
      this.Record.jvh_curr_code = _Record.code;
      this.Record.jvh_curr_name = _Record.name;
      this.Record.jvh_exrate = _Record.rate;
      /*
      //local currency bank have to select otherwise NA
      if (this.Record.jvh_curr_code == this.gs.defaultValues.param_curr_local_code) {
        if (this.cc_category.indexOf("AIR EXPORT") >= 0)
          this.Record.jvh_banktype = 'AE';
        else if (this.cc_category.indexOf("AIR IMPORT") >= 0)
          this.Record.jvh_banktype = 'AI';
        else if (this.cc_category.indexOf("SEA EXPORT") >= 0)
          this.Record.jvh_banktype = 'SE';
        else if (this.cc_category.indexOf("SEA IMPORT") >= 0)
          this.Record.jvh_banktype = 'SI';
        else
          this.Record.jvh_banktype = 'NA';
      } else
        this.Record.jvh_banktype = 'NA';
        */
    }

    if (_Record.controlname == "GSTSTATE") {
      this.Record.jvh_state_id = _Record.id;
      this.Record.jvh_state_code = _Record.code;
      this.Record.jvh_state_name = _Record.name;
      this.Record.jvh_gst_type = this.gs.getGstType(this.Record.jvh_gstin, this.Record.jvh_state_code, this.Record.jvh_sez);
    }


  }


  NewInvoice(_type: string, _subtype: string) {
    this.type = _type;
    this.subtype = _subtype;
    if (this.subtype == 'AR') {
      this.headerdrcr = 'DR';
      this.detaildrcr = 'CR';
    }
    if (this.subtype == 'AP') {
      this.headerdrcr = 'CR';
      this.detaildrcr = 'DR';
    }
    this.ActionHandler('ADD', '');
  }

  EditInvoice(_id: string, _type: string, _subtype: string, _rec_source: string) {




    this.type = _type;
    this.subtype = _subtype;
    if (this.subtype == 'AR') {
      this.headerdrcr = 'DR';
      this.detaildrcr = 'CR';
    }
    if (this.subtype == 'AP') {
      this.headerdrcr = 'CR';
      this.detaildrcr = 'DR';
    }
    this.ActionHandler('EDIT', _id);
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

    this.Record.jvh_gstin = '';
    this.Record.jvh_gst_type = '';


    this.Record.jvh_exwork = false;

    this.Record.jvh_curr_id = this.gs.defaultValues.param_curr_local_id;
    this.Record.jvh_curr_code = this.gs.defaultValues.param_curr_local_code;
    this.Record.jvh_curr_name = this.gs.defaultValues.param_curr_local_code;

    this.Record.jvh_exrate = 1;


    this.Record.jvh_cc_category = this.cc_category;
    this.Record.jvh_cc_code = "";
    this.Record.jvh_cc_id = this.parentid;
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

    if (this.cc_category.indexOf("AIR EXPORT") >= 0)
      this.Record.jvh_banktype = 'AE';
    else if (this.cc_category.indexOf("AIR IMPORT") >= 0)
      this.Record.jvh_banktype = 'AI';
    else if (this.cc_category.indexOf("SEA EXPORT") >= 0)
      this.Record.jvh_banktype = 'SE';
    else if (this.cc_category.indexOf("SEA IMPORT") >= 0)
      this.Record.jvh_banktype = 'SI';
    else
      this.Record.jvh_banktype = 'NA';


    this.ProcessPendingList = false;

    this.InitLov();

    this.INVCURRECORD.id = this.Record.jvh_curr_id;
    this.INVCURRECORD.code = this.Record.jvh_curr_code;
    this.INVCURRECORD.name = this.Record.jvh_curr_code;

    this.Record.rec_mode = this.mode;

    this.GetPendingList();

  }




  GetPendingList() {
    this.loading = true;

    let SearchData = {
      parentid: this.parentid
    };

    this.ErrorMessage = '';
    this.InfoMessage = '';
    this.mainService.GetPendingList(SearchData)
      .subscribe(response => {
        this.loading = false;

        this.narration = response.narration;
        this.narration_shipper = response.shipper;

        this.Record.jvh_narration = "ON A/C OF " + response.shipper + " " + response.narration;
        this.LoadPendingList(response.record);
      },
        error => {
          this.loading = false;
          this.ErrorMessage = this.gs.getError(error);
        });
  }

  LoadPendingList(_Record: Ledgerh) {

    this.Record.LedgerList = _Record.LedgerList;

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


  }

  SetNarration() {

    if (this.narration_shipper == this.Record.jvh_acc_name)
      this.Record.jvh_narration = this.Record.jvh_acc_name + ' ' + this.narration;
    else
      this.Record.jvh_narration = this.Record.jvh_acc_name + ' ON A/C OF ' + this.narration_shipper + ' ' + this.narration;

  }

  // Load a single Record for VIEW/EDIT
  GetRecord(Id: string) {
    this.loading = true;

    let SearchData = {
      parentid: this.parentid,
      pkid: Id,
    };

    this.LockErrorMessage = "";
    this.ErrorMessage = '';
    this.InfoMessage = '';
    this.mainService.GetRecord(SearchData)
      .subscribe(response => {
        this.loading = false;
        this.narration = response.narration;
        this.LockErrorMessage = response.lockedmsg;

        this.LoadData(response.record);
        this.FindTotal();
      },
        error => {
          this.loading = false;
          this.ErrorMessage = this.gs.getError(error);
        });
  }

  LoadData(_Record: Ledgerh) {
    this.Record = _Record;



    this.Record.LedgerList = _Record.LedgerList;

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


    this.lock_record = true;
    this.lock_date = true;


    if (this.Record.jvh_edit_code.indexOf("{S}") >= 0)
      this.lock_record = false;
    if (this.Record.jvh_edit_code.indexOf("{D}") >= 0)
      this.lock_date = false;

    if (this.LockErrorMessage.length > 0) {
      this.ErrorMessage = this.LockErrorMessage;
      this.lock_record = true;
    }

    if (this.Record.jvh_allocation_found) {
      this.ErrorMessage += " | Cannot Edit Allocation Exists";
      this.lock_record = true;
    }


    this.Record.rec_mode = this.mode;

    this.FindTotal();

    if (this.Record.jvh_rec_source != 'OP') {
      this.ErrorMessage = "Cannot Edit,Created in Another Module";
      return;
    }

  }


  // Save Data
  Save() {

    let msg: string = '';

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

    let isexworkitem: boolean = false;
    let isnotexworkitem: boolean = false;

    this.ErrorMessage = '';
    this.InfoMessage = '';




    let isNegative: Boolean = false;
    let isGstMismatch: Boolean = false;
    let isGstBlank: Boolean = false;
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


    this.Record.LedgerList.forEach(rec => {
      if (rec.jv_selected) {
        rowCount++;

        if (rec.jv_income_type == 'EX-WORK')
          isexworkitem = true;
        else
          isnotexworkitem = true;

        if (rec.jv_debit > 0) {
          gst_dr += rec.jv_gst_amt;
        }
        if (rec.jv_credit > 0) {
          gst_cr += rec.jv_gst_amt;
        }

        if (this.Record.jvh_gst && rec.jv_is_taxable && rec.jv_gst_amt <= 0)
          isGstBlank = true;
        if (this.Record.jvh_gst && rec.jv_is_gst_item && rec.jv_gst_amt <= 0)
          isGstBlank = true;
        if ((this.Record.jvh_gst && rec.jv_gst_amt <= 0) && (rec.jv_cgst_rate != 0 || rec.jv_sgst_rate != 0 || rec.jv_igst_rate != 0)) {
          isGstBlank = true;
        }

        if (rec.jv_debit <= 0 && rec.jv_credit <= 0) {
          isNegative = true;
        }
        _gst_amt = rec.jv_cgst_amt + rec.jv_sgst_amt + rec.jv_igst_amt;
        if (rec.jv_gst_amt != _gst_amt)
          isGstMismatch = true;

      }
    });

    if (rowCount <= 0) {
      bret = false;
      sError += " |No Rows Selected";
    }


    if (this.Record.jvh_exwork) {
      if (isnotexworkitem) {
        bret = false;
        sError += " |Only Ex-Work Items Can Be Selected";
      }
    }
    else {
      if (isexworkitem) {
        bret = false;
        sError += " |Ex-Work Items Can Not Be Selected";
      }
    }


    if (isGstBlank) {
      bret = false;
      sError += " |Invalid Gst for one or more records";
    }

    if (this.Record.jvh_rc && !this.Record.jvh_gst) {
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

    /*
    // Gst calculation is done individual row wise so this is not required
    if (this.Record.jvh_gst) {
      if (this.Record.jvh_gst_amt <= 0) {
        bret = false;
        sError += " | GST Amt not found";
      }
    }
    */

    if (!this.Record.jvh_gst) {
      if (this.Record.jvh_gst_amt != 0) {
        bret = false;
        sError += " | GST Amt Need To be Removed";
      }

      //SPECIAL ECONOMIC ZONE
      // Zero Rated Invoice Only for Sez Units
      if (this.gs.globalVariables.comp_code == "CPL") {
        if (this.Record.jvh_gst_amt <= 0 && !this.Record.jvh_sez) {
          bret = false;
          sError += " | Sez units only can generate Zero Rated Invoice";
        }
      }

    }

    if (this.Record.jvh_gst) {

      if (this.Record.jvh_gst_type == "INTRA-STATE") {
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


  OnFocus(field: string) {
    this.bChanged = false;
  }

  OnChange(field: string) {
    this.bChanged = true;
    if (field == 'jvh_sez') {
      this.Record.jvh_gst_type = this.gs.getGstType(this.Record.jvh_gstin, this.Record.jvh_state_code, this.Record.jvh_sez);
    }
  }


  RecordChange(rec: Ledgert) {
    if (rec.jv_selected) {
      this.SearchRecord('taxcode', rec);
    }
    else {

      rec.jv_cgst_rate = 0;
      rec.jv_sgst_rate = 0;
      rec.jv_igst_rate = 0;

      rec.jv_cgst_amt = 0;
      rec.jv_sgst_amt = 0;
      rec.jv_igst_amt = 0;
      rec.jv_gst_amt = 0;

      rec.jv_is_gst_item = false;

      this.FindTotal();
    }
  }


  OnBlur(field: string) {
    if (field == 'jv_acc_name') {
      this.Recorddet.jv_acc_name = this.Recorddet.jv_acc_name.toUpperCase();
    }
    if (field == 'jvh_gstin') {
      if (this.bChanged) {
        this.Record.jvh_gstin = this.Record.jvh_gstin.toUpperCase();
        if (this.Record.jvh_gstin.length == 15)
          this.Record.jvh_gst_type = this.gs.getGstType(this.Record.jvh_gstin, this.Record.jvh_state_code, this.Record.jvh_sez);
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


    let namt: number = 0;

    this.Record.LedgerList.forEach(rec => {

      rec.jv_cgst_amt = 0;
      rec.jv_sgst_amt = 0;
      rec.jv_igst_amt = 0;
      rec.jv_gst_amt = 0;
      rec.jv_gst_rate = 0;
      rec.jv_net_total = 0;

      if (rec.jv_selected) {
        total_debit += rec.jv_debit;
        total_credit += rec.jv_credit;

        if (this.Record.jvh_gst) {
          if (rec.jv_is_taxable) {
            if (this.Record.jvh_gst_type == "INTRA-STATE") {
              namt = rec.jv_taxable_amt * rec.jv_cgst_rate / 100;
              rec.jv_cgst_amt = this.gs.roundNumber(namt, 2);
              namt = rec.jv_taxable_amt * rec.jv_sgst_rate / 100;
              rec.jv_sgst_amt = this.gs.roundNumber(namt, 2);
              rec.jv_igst_amt = 0;
              rec.jv_gst_amt = rec.jv_cgst_amt + rec.jv_sgst_amt;
            }
            if (this.Record.jvh_gst_type == "INTER-STATE") {
              namt = rec.jv_taxable_amt * rec.jv_igst_rate / 100;
              rec.jv_igst_amt = this.gs.roundNumber(namt, 2);
              rec.jv_cgst_amt = 0;
              rec.jv_sgst_amt = 0;
              rec.jv_gst_amt = rec.jv_igst_amt;
            }
          }
        }


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

        cgstamt = this.gs.roundNumber(cgstamt + rec.jv_cgst_amt, 2);
        sgstamt = this.gs.roundNumber(sgstamt + rec.jv_sgst_amt, 2);
        igstamt = this.gs.roundNumber(igstamt + rec.jv_igst_amt, 2);
        gstamt = this.gs.roundNumber(gstamt + rec.jv_gst_amt, 2);


        fcgstamt = this.gs.roundNumber(fcgstamt + rec.jv_cgst_famt, 2);
        fsgstamt = this.gs.roundNumber(fsgstamt + rec.jv_sgst_famt, 2);
        figstamt = this.gs.roundNumber(figstamt + rec.jv_igst_famt, 2);
        fgstamt = this.gs.roundNumber(fgstamt + rec.jv_gst_famt, 2);

        if (rec.jv_debit > 0) {
          ftotamt_dr = ftotamt_dr + rec.jv_total_fc;
          totamt_dr = totamt_dr + rec.jv_total;
          if (rec.jv_gst_amt != 0)
            gst_drcr = 'DR';
        }
        if (rec.jv_credit > 0) {
          ftotamt_cr = ftotamt_cr + rec.jv_total_fc;
          totamt_cr = totamt_cr + rec.jv_total;
          if (rec.jv_gst_amt != 0)
            gst_drcr = 'CR';
        }
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
    this.Record.jvh_diff = this.gs.roundNumber(this.diff, 2);
  }

  PendingListOkSelected(sAction: string) {
    this.ProcessPendingList = true;
    this.modal.close();
  }
  open(content: any) {
    this.modal = this.modalService.open(content);
  }


  onLostFocus(field: string) {

  }


  SearchRecord(controlname: string, Rec: Ledgert) {

    this.loading = true;

    let SearchData = {
      table: '',
      pkid: '',
      comp_code: '',
      branch_code: '',
      type: '',
      year: '',
      searchstring: ''
    };
    if (controlname == 'taxcode') {
      SearchData.table = 'acctm';
      SearchData.pkid = Rec.jv_acc_id;
    }

    this.ErrorMessage = '';
    this.gs.SearchRecord(SearchData)
      .subscribe(response => {
        this.loading = false;

        if (controlname == 'taxcode') {

          Rec.jv_cgst_rate = 0;
          Rec.jv_sgst_rate = 0;
          Rec.jv_igst_rate = 0;

          Rec.jv_cgst_amt = 0;
          Rec.jv_sgst_amt = 0;
          Rec.jv_igst_amt = 0;
          Rec.jv_gst_amt = 0;

          Rec.jv_is_gst_item = false;



          this.ErrorMessage = '';

          if (response.acctm.length > 0) {

            if (response.acctm[0].acc_cgst_rate > 0 || response.acctm[0].acc_sgst_rate > 0 || response.acctm[0].acc_igst_rate > 0) {
              Rec.jv_is_gst_item = true;
            }

            if (this.Record.jvh_gst) {
              if (this.Record.jvh_gst_type == "INTRA-STATE") {
                Rec.jv_cgst_rate = response.acctm[0].acc_cgst_rate;
                Rec.jv_sgst_rate = response.acctm[0].acc_sgst_rate;
              }
              if (this.Record.jvh_gst_type == "INTER-STATE") {
                Rec.jv_igst_rate = response.acctm[0].acc_igst_rate;
              }
              /*
              if (Rec.jv_cgst_rate > 0 || Rec.jv_sgst_rate > 0 || Rec.jv_igst_rate > 0) {
                Rec.jv_is_taxable = true;
              }
              */
            }
          }
          else {
            this.ErrorMessage = 'Invalid Code';
          }
          this.FindTotal();
        }

      },
        error => {
          this.loading = false;
          this.ErrorMessage = this.gs.getError(error);
        });
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
  PrintInvoice(reportformat: string, _type: string = 'PDF', mailsent: any) {

    if (_type == "MAIL") {

      this.mSubject = "SALES INVOICE  " + this.Record.jvh_docno;
      this.mSubject += " - M/S " + this.Record.jvh_acc_name;
      this.mSubject += " - DT " + this.jvh_date.GetDisplayDate();
      if (this.Record.jvh_cc_code != "") {
        this.mSubject += " - " + this.Record.jvh_cc_category + "#" + this.Record.jvh_cc_code;
      }

      this.mMsg = "Dear Valued Customer,";
      this.mMsg += " \n\n";
      this.mMsg += "  Pls find the attached sales invoice for your kind reference";
      this.mMsg += " \n\n";
    }


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
      report_format: '',
      menuadmin: ''
    }

    SearchData.pkid = this.pkid;
    SearchData.report_format = reportformat;
    SearchData.report_folder = this.gs.globalVariables.report_folder;
    SearchData.company_code = this.gs.globalVariables.comp_code;
    SearchData.branch_code = this.gs.globalVariables.branch_code;
    SearchData.folderid = this.folder_id;
    SearchData.report_caption = this.title;
    SearchData.menuadmin = this.bAdmin == true ? "Y" : "N";

    this.ErrorMessage = '';
    this.mainService.GenerateInvoice(SearchData)
      .subscribe(response => {
        this.loading = false;
        if (_type == 'MAIL') {
          this.AttachList = new Array<any>();
          this.AttachList.push({ filename: response.filename, filetype: response.filetype, filedisplayname: response.filedisplayname });
          this.open(mailsent);
        } else
          this.Downloadfile(response.filename, response.filetype, response.filedisplayname);
      },
        error => {
          this.loading = false;
          this.ErrorMessage = this.gs.getError(error);
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
    SearchData.report_caption = this.title;

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
        });
  }


  Downloadfile(filename: string, filetype: string, filedisplayname: string) {
    this.gs.DownloadFile(this.gs.globalVariables.report_folder, filename, filetype, filedisplayname);
  }

}



