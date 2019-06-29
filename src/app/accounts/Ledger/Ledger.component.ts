
import { Component, ViewEncapsulation, Input, OnInit, OnDestroy } from '@angular/core';

import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';


import { ActivatedRoute } from '@angular/router';

import { GlobalService } from '../../core/services/global.service';

import { Ledgerh } from '../models/ledgerh';
import { Ledgert } from '../models/ledgert';
import { LedgerService } from '../services/ledger.service';

import { CostCentert } from '../models/costcentert';
import { LedgerXref } from '../models/ledgerxref';

import { pendinglist } from '../models/pendinglist';

import { SearchTable } from '../../shared/models/searchtable';

import { PendingListComponent } from './Pendinglist.component';

@Component({
  selector: 'app-ledger',
  templateUrl: './ledger.component.html',
  encapsulation: ViewEncapsulation.None,
  providers: [LedgerService]
})
export class LedgerComponent {
  /*
   Ajith 22/05/2019 chqno and narration updation while locking
   Ajith 23/05/2019 chqno updation ReScripted due to lost code while checking
   Ajith 28/05/2019 Chqno updation include more feild and disabled after entry creation date
   Ajith 5/06/2019 Money tranfer window addeded
   Ajith 19/06/2019 rec_locked checked for tan Searchtable, separate one time  updation for tan and tan party implemented
   Ajith 29/06/2019 A label will show near save button  if allocation exist
  */

  // Local Variables 
  title = 'Ledger Details';

  @Input() menuid: string = '';
  @Input() type: string = '';
  InitCompleted: boolean = false;
  menu_record: any;

  lock_record: boolean = false;
  lock_date: boolean = false;

  bDocs: boolean = false;
  bChqprint: boolean = true;
  bChqboxvisible: boolean = false;

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
  fromdate: string = "";
  todate: string = "";

  ProcessPendingList: boolean = false;

  LockErrorMessage = "";
  ErrorMessage = "";
  InfoMessage = "";
  CostCode = "";
  CostNarration = "";

  mode = '';
  pkid = '';

  modeDetail = '';
  bapprovalstatus = '';

  diff: number = 0;


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


  PANRECORD: SearchTable = new SearchTable();
  TANRECORD: SearchTable = new SearchTable();
  TPRECORD: SearchTable = new SearchTable();


  constructor(
    private modalService: NgbModal,
    private mainService: LedgerService,
    private route: ActivatedRoute,
    private gs: GlobalService
  ) {
    this.page_count = 0;
    this.page_rows = 20;
    this.page_current = 0;


    // URL Query Parameter 
    this.sub = this.route.queryParams.subscribe(params => {
      if (params["parameter"] != "") {
        this.InitCompleted = true;
        var options = JSON.parse(params["parameter"]);
        this.menuid = options.menuid;
        this.type = options.type;
        this.InitComponent();
      }
    });

  }

  // Init Will be called After executing Constructor
  ngOnInit() {
    if (!this.InitCompleted) {
      this.InitComponent();
    }
  }

  InitComponent() {
    this.bapprovalstatus = "";
    this.bDocs = false;
    this.bChqprint = true;
    if (this.gs.defaultValues.print_cheque_only_after_ho_approved == 'Y')
      this.bChqprint = false;

    this.fromdate = this.gs.globalData.ledger_fromdate;
    this.todate = this.gs.globalData.ledger_todate;
    this.menu_record = this.gs.getMenu(this.menuid);
    if (this.menu_record) {
      this.title = this.menu_record.menu_name;
      this.title = this.title.toUpperCase();
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
    this.sub.unsubscribe();
  }

  LoadCombo() {
    this.currentTab = 'LIST';
    this.List("NEW");
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
      if (this.type == "JV")
        this.ACCRECORD.where = " acc_type_id not in(select actype_pkid from actypem where rec_company_code ='" + this.gs.globalVariables.comp_code + "' and actype_name in('CASH','BANK'))";
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

    if (saction == 'PAN' || saction == 'DETAIL' || saction == '') {
      this.PANRECORD = new SearchTable();
      this.PANRECORD.controlname = "PAN";
      this.PANRECORD.displaycolumn = "CODE";
      this.PANRECORD.type = "PAN";
      this.PANRECORD.id = "";
      this.PANRECORD.code = "";
    }
    if (saction == 'TAN' || saction == 'DETAIL' || saction == '') {
      this.TANRECORD = new SearchTable();
      this.TANRECORD.controlname = "TAN";
      this.TANRECORD.displaycolumn = "CODE";
      this.TANRECORD.type = "TAN";
      this.TANRECORD.id = "";
      this.TANRECORD.code = "";
      this.TANRECORD.where = "nvl(a.rec_locked,'N') = 'N'";
    }

    if (saction == 'TANPARTY' || saction == 'DETAIL' || saction == '') {
      this.TPRECORD = new SearchTable();
      this.TPRECORD.controlname = "TANPARTY";
      this.TPRECORD.displaycolumn = "CODE";
      this.TPRECORD.type = "ACCTM";
      this.TPRECORD.id = "";
      this.TPRECORD.code = "";
      this.TPRECORD.name = "";
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

      /*
      this.Record.jvh_acc_br_no = _Record.code;
      this.Record.job_exp_br_addr = this.GetBrAddress(_Record.name).address;
      */
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
      this.Record.jvh_gst_type = this.gs.getGstType(this.Record.jvh_gstin, this.Record.jvh_state_code, this.Record.jvh_sez);
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
      if (_Record.col4 == "Y")  //  Taxable
        this.Recorddet.jv_is_taxable = true;

      if (this.type == "BP") {
        if (this.Recorddet.jv_acc_type_name == "BANK")
          this.Recorddet.jv_doc_type = "CHEQUE";
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

    if (_Record.controlname == "PAN") {
      this.Recorddet.jv_pan_id = _Record.id;
      this.Recorddet.jv_pan_code = _Record.code;
      this.Recorddet.jv_pan_name = _Record.name;
    }
    if (_Record.controlname == "TAN") {
      this.Recorddet.jv_tan_id = _Record.id;
      this.Recorddet.jv_tan_code = _Record.code;
      this.Recorddet.jv_tan_name = _Record.name;
    }
    if (_Record.controlname == "TANPARTY") {
      this.Recorddet.jv_tan_party_id = _Record.id;
      this.Recorddet.jv_tan_party_code = _Record.code;
      this.Recorddet.jv_tan_party_name = _Record.name;
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

      for (i = this.Record.XrefList.length - 1; i >= 0; i -= 1) {
        if (this.Record.XrefList[i].xref_jv_id === event.id) {
          this.Record.XrefList.splice(i, 1);
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

  // Query List Data
  List(_type: string) {

    this.loading = true;

    let SearchData = {
      type: _type,
      rowtype: this.type,
      company_code: this.gs.globalVariables.comp_code,
      branch_code: this.gs.globalVariables.branch_code,
      year_code: this.gs.globalVariables.year_code,
      searchstring: this.searchstring.toUpperCase(),
      page_count: this.page_count,
      page_current: this.page_current,
      page_rows: this.page_rows,
      page_rowcount: this.page_rowcount,
      from_date: this.fromdate,
      to_date: this.todate
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
        });
  }

  NewRecord() {
    this.lock_record = false;
    this.lock_date = false;

    this.pkid = this.gs.getGuid();

    this.Record = new Ledgerh();
    this.Record.jvh_pkid = this.pkid;
    this.Record.jvh_type = this.type;
    this.Record.jvh_year = this.gs.globalVariables.year_code;
    this.Record.jvh_date = this.gs.defaultValues.today;
    this.Record.jvh_reference = '';
    this.Record.jvh_reference_date = '';
    this.Record.jvh_narration = '';

    this.Record.jvh_remarks = '';


    this.Record.jvh_allocation_found = false;

    this.Record.jvh_rec_source = 'JV';
    this.Record.jvh_location = "";

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

    this.Record.jvh_curr_id = this.gs.defaultValues.param_curr_local_id;
    this.Record.jvh_curr_code = this.gs.defaultValues.param_curr_local_code;
    this.Record.jvh_curr_name = this.gs.defaultValues.param_curr_local_code;

    this.Record.jvh_exrate = 1;

    this.Record.rec_category = 'OTHERS';

    this.Record.jvh_cc_category = "NA";
    this.Record.jvh_cc_code = "";
    this.Record.jvh_cc_id = "";
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
    this.Record.rec_aprvd = 'N';

    this.Record.jvh_not_over_chq = false;
    this.Record.jvh_update_chq = false;
    this.ProcessPendingList = false;

    this.InitLov();

    this.INVCURRECORD.id = this.Record.jvh_curr_id;
    this.INVCURRECORD.code = this.Record.jvh_curr_code;
    this.INVCURRECORD.name = this.Record.jvh_curr_code;

    this.Record.rec_mode = this.mode;
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
        });
  }

  LoadData(_Record: Ledgerh) {
    this.Record = _Record;

    this.Record.LedgerList = _Record.LedgerList;
    this.Record.CostCenterList = _Record.CostCenterList;
    this.Record.XrefList = _Record.XrefList;

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

    if (this.Record.jvh_edit_code.indexOf("{S}") >= 0) {
      this.lock_record = false;
    }
    if (this.Record.jvh_edit_code.indexOf("{D}") >= 0) {
      this.lock_date = false;
    }

    if (this.LockErrorMessage.length > 0) {
      this.ErrorMessage = this.LockErrorMessage;
      this.lock_record = true;
    }

    if (this.gs.defaultValues.print_cheque_only_after_ho_approved == 'Y') {
      this.bChqprint = false;
      if (this.Record.rec_aprvd == 'Y')
        this.bChqprint = true;
    }

    if (this.Record.jvh_allocation_found) {
      this.ErrorMessage += " | Cannot Edit Allocation Exists";
      this.lock_record = true;
    }

    this.FindTotal();
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
    let bCash: boolean = false;
    let bBank: boolean = false;

    this.ErrorMessage = '';
    this.InfoMessage = '';

    let isNegative: Boolean = false;
    let isGstMismatch: Boolean = false;
    let isGstBlank: Boolean = false;

    let iTotalRows: number = 0;

    let cgst_dr = 0;
    let sgst_dr = 0;
    let igst_dr = 0;

    let cgst_cr = 0;
    let sgst_cr = 0;
    let igst_cr = 0;

    let gst_dr = 0;
    let gst_cr = 0;

    let _gst_amt = 0;


    if (this.Record.jvh_rec_source.trim() != "JV") {
      bret = false;
      sError += " | Cannot Edit, Records Created In Another Module";
    }


    if (this.Record.jvh_acc_id != "") {
      if (this.Record.jvh_acc_br_id == '') {
        bret = false;
        sError += " | Invalid Address";
      }
      if (this.Record.jvh_state_id.trim() == "" || this.Record.jvh_state_code.trim() == "") {
        bret = false;
        sError += " | State Cannot Be Blank";
      }
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

    if (this.Record.jvh_rec_source.trim() == "DN" || this.Record.jvh_rec_source.trim() == "CN" || this.Record.jvh_rec_source.trim() == "DI" || this.Record.jvh_rec_source.trim() == "CI") {
      if (this.Record.jvh_org_invno.trim().length <= 0) {
        bret = false;
        sError += " | Original Inv# Invalid";
      }
      if (this.Record.jvh_org_invdt.trim().length <= 0) {
        bret = false;
        sError += " | Original Inv Date Invalid";
      }
    }

    if (this.Record.jvh_curr_id == '') {
      bret = false;
      sError += " | Invalid Currency";
    }
    if (this.Record.jvh_exrate <= 0) {
      bret = false;
      sError += " | Invalid Ex.Rate";
    }


    this.Record.LedgerList.forEach(rec => {
      if (rec.jv_acc_type_name == "CASH")
        bCash = true;
      if (this.type == "BR" && rec.jv_acc_type_name == "BANK") {
        bBank = true;
      }
      if (this.type == "BP") {
        if (rec.jv_drcr == "CR" && rec.jv_acc_type_name == "BANK")
          bBank = true;
      }

    });

    if ((this.type == "CP" || this.type == "CR") && !bCash) {
      bret = false;
      sError += " | No Cash A/c Found";
    }
    if ((this.type == "BP" || this.type == "BR") && !bBank) {
      bret = false;
      sError += " | No Bank A/c Found";
    }

    if (this.Record.jvh_narration.trim().length <= 0) {
      bret = false;
      sError += " | Narration Cannot Be Blank";
    }

    this.Record.LedgerList.forEach(rec => {
      iTotalRows++;
      if (rec.jv_debit > 0) {
        gst_dr += rec.jv_gst_amt;

        if (this.Record.jvh_gst && rec.jv_is_taxable && rec.jv_gst_amt <= 0)
          isGstBlank = true;
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

      if (this.Record.jvh_gst && rec.jv_gst_amt != _gst_amt)
        isGstMismatch = true;

      if ((this.Record.jvh_gst && rec.jv_gst_amt <= 0) && (rec.jv_cgst_rate != 0 || rec.jv_sgst_rate != 0 || rec.jv_igst_rate != 0)) {
        isGstBlank = true;
      }

      if (this.Record.jvh_gst && rec.jv_is_gst_item && rec.jv_gst_amt <= 0) {
        isGstBlank = true;
      }

    });


    if (iTotalRows < 2) {
      bret = false;
      sError += " |Invalid Rows";
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
    if (this.diff != 0) {
      bret = false;
      sError += " | Total Debit and Credit Not Equal";
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


  OnFocus(field: string) {
    this.bChanged = false;
  }

  OnChange(field: string) {
    this.bChanged = true;
    if (field == 'jvh_sez') {
      this.Record.jvh_gst_type = this.gs.getGstType(this.Record.jvh_gstin, this.Record.jvh_state_code, this.Record.jvh_sez);
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

    if (field == "jv_ftotal") {
      if (!this.bChanged)
        return;
      this.Recorddet.jv_ftotal = this.gs.roundNumber(this.Recorddet.jv_ftotal, 2);
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
      if (this.Recorddet.jv_exrate > 0) {

        //this.Recorddet.jv_ftotal = this.Recorddet.jv_total / this.Recorddet.jv_exrate;
        //this.Recorddet.jv_ftotal = this.gs.roundNumber(this.Recorddet.jv_ftotal, 2);

        this.Recorddet.jv_exrate = this.Recorddet.jv_total / this.Recorddet.jv_ftotal;
        this.Recorddet.jv_exrate = this.gs.roundNumber(this.Recorddet.jv_exrate, 5);

        this.Recorddet.jv_taxable_amt = this.Recorddet.jv_total;
        this.FindRowTotal();
      }
    }

    if (field == "jv_taxable_amt") {
      if (!this.bChanged)
        return;
      this.FindRowTotal();
    }

    if (field == 'jv_tds_rate' || field == 'jv_ftotal' || field == 'jv_total' || field == 'jv_exrate') {
      if (this.Recorddet.jv_tds_rate > 0) {
        this.Recorddet.jv_tds_gross_amt = (this.Recorddet.jv_total / this.Recorddet.jv_tds_rate) * 100;
        this.Recorddet.jv_tds_gross_amt = this.gs.roundNumber(this.Recorddet.jv_tds_gross_amt, 2);
      }
      else
        this.Recorddet.jv_tds_gross_amt = this.gs.roundNumber(this.Recorddet.jv_tds_gross_amt, 2);
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


    if (field == 'jv_chqno') {
      if (this.Recorddet.jv_chqno != 0) {
        if (this.Recorddet.jv_due_date == '') {
          this.Recorddet.jv_due_date = this.gs.defaultValues.today;
        }
      }
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


  // Detail Handling
  ActionHandlerDetail(action: string, rec: Ledgert) {
    this.ErrorMessage = '';
    this.bChqboxvisible = false;
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
    this.Recorddet = new Ledgert;
    this.Recorddet.jv_pkid = this.gs.getGuid();

    this.Recorddet.jv_acc_id = '';
    this.Recorddet.jv_acc_code = '';
    this.Recorddet.jv_acc_name = '';
    this.Recorddet.jv_acc_type_name = '';

    this.Recorddet.jv_curr_id = this.gs.defaultValues.param_curr_local_id;
    this.Recorddet.jv_curr_code = this.gs.defaultValues.param_curr_local_code;
    this.Recorddet.jv_curr_name = this.gs.defaultValues.param_curr_local_code;



    this.Recorddet.jv_ftotal = 0;
    this.Recorddet.jv_total = 0;


    this.Recorddet.jv_taxable_amt = 0;

    this.Recorddet.jv_is_taxable = false;
    this.Recorddet.jv_is_gst_item = false;

    this.Recorddet.jv_cgst_rate = 0;
    this.Recorddet.jv_sgst_rate = 0;
    this.Recorddet.jv_igst_rate = 0;

    this.Recorddet.jv_cgst_amt = 0;
    this.Recorddet.jv_sgst_amt = 0;
    this.Recorddet.jv_igst_amt = 0;
    this.Recorddet.jv_gst_amt = 0;

    this.Recorddet.jv_net_total = 0;

    this.Recorddet.jv_debit = 0;
    this.Recorddet.jv_credit = 0;

    this.Recorddet.jv_drcr = 'DR';

    this.Recorddet.jv_doc_type = 'NA';
    this.Recorddet.jv_bank = '';
    this.Recorddet.jv_branch = '';
    this.Recorddet.jv_chqno = 0;
    this.Recorddet.jv_due_date = '';

    this.Recorddet.jv_pay_reason = '';
    this.Recorddet.jv_supp_docs = '';
    this.Recorddet.jv_paid_to = '';
    this.Recorddet.jv_remarks = '';


    this.Recorddet.jv_sac_id = '';
    this.Recorddet.jv_sac_code = '';

    this.Recorddet.jv_gst_edited = false;

    this.Recorddet.jv_recon_by = '';
    this.Recorddet.jv_recon_date = '';

    this.Recorddet.jv_pan_id = '';
    this.Recorddet.jv_pan_code = '';
    this.Recorddet.jv_pan_name = '';
    this.Recorddet.jv_tds_rate = 0;
    this.Recorddet.jv_tds_gross_amt = 0;

    this.Recorddet.jv_tan_id = '';
    this.Recorddet.jv_tan_code = '';
    this.Recorddet.jv_tan_name = '';

    this.Recorddet.jv_gross_bill_amt = 0;


    this.Recorddet.jv_tan_party_id = '';
    this.Recorddet.jv_tan_party_code = '';
    this.Recorddet.jv_tan_party_name = '';


    this.Recorddet.jv_od_type = '';
    this.Recorddet.jv_od_remarks = '';
    this.Recorddet.jv_tan_update = false;
    this.CCList = new Array<CostCentert>();


    this.PendingListRecords = new Array<pendinglist>();

    this.InitLov('DETAIL');


    this.CURRECORD.id = this.Record.jvh_curr_id;
    this.CURRECORD.code = this.Record.jvh_curr_code;
    this.CURRECORD.name = this.Record.jvh_curr_code;

    this.Recorddet.jv_exrate = 1;
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

    this.Recorddet.jv_qty = _Record.jv_qty;
    this.Recorddet.jv_rate = _Record.jv_rate;

    this.Recorddet.jv_drcr = _Record.jv_drcr;
    this.Recorddet.jv_ftotal = _Record.jv_ftotal;
    this.Recorddet.jv_exrate = _Record.jv_exrate;
    this.Recorddet.jv_total = _Record.jv_total;

    this.Recorddet.jv_taxable_amt = _Record.jv_taxable_amt;

    this.Recorddet.jv_cgst_rate = _Record.jv_cgst_rate;
    this.Recorddet.jv_cgst_amt = _Record.jv_cgst_amt;

    this.Recorddet.jv_sgst_rate = _Record.jv_sgst_rate;
    this.Recorddet.jv_sgst_amt = _Record.jv_sgst_amt;

    this.Recorddet.jv_igst_rate = _Record.jv_igst_rate;
    this.Recorddet.jv_igst_amt = _Record.jv_igst_amt;

    this.Recorddet.jv_sac_id = _Record.jv_sac_id;
    this.Recorddet.jv_sac_code = _Record.jv_sac_code;

    this.Recorddet.jv_gst_rate = _Record.jv_gst_rate;

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

    this.Recorddet.jv_pan_id = _Record.jv_pan_id;
    this.Recorddet.jv_pan_code = _Record.jv_pan_code;
    this.Recorddet.jv_pan_name = _Record.jv_pan_name;

    this.Recorddet.jv_tds_rate = _Record.jv_tds_rate;
    this.Recorddet.jv_tds_gross_amt = _Record.jv_tds_gross_amt;

    this.Recorddet.jv_tan_id = _Record.jv_tan_id;
    this.Recorddet.jv_tan_code = _Record.jv_tan_code;
    this.Recorddet.jv_tan_name = _Record.jv_tan_name;
    this.Recorddet.jv_gross_bill_amt = _Record.jv_gross_bill_amt;

    this.Recorddet.jv_tan_party_id = _Record.jv_tan_party_id;
    this.Recorddet.jv_tan_party_code = _Record.jv_tan_party_code;
    this.Recorddet.jv_tan_party_name = _Record.jv_tan_party_name;

    this.Recorddet.jv_recon_by = _Record.jv_recon_by;
    this.Recorddet.jv_recon_date = _Record.jv_recon_date;
    this.Recorddet.jv_od_type = _Record.jv_od_type;
    this.Recorddet.jv_od_remarks = _Record.jv_od_remarks;
    this.Recorddet.jv_tan_update = _Record.jv_tan_update;
    
    this.InitLov('DETAIL');

    this.ACCRECORD.id = this.Recorddet.jv_acc_id;
    this.ACCRECORD.code = this.Recorddet.jv_acc_code;
    this.ACCRECORD.name = this.Recorddet.jv_acc_name;

    this.CURRECORD.id = this.Recorddet.jv_curr_id;
    this.CURRECORD.code = this.Recorddet.jv_curr_code;

    this.SACRECORD.id = this.Recorddet.jv_sac_id;
    this.SACRECORD.code = this.Recorddet.jv_sac_code;

    this.PANRECORD.id = this.Recorddet.jv_pan_id;
    this.PANRECORD.code = this.Recorddet.jv_pan_code;
    this.PANRECORD.name = this.Recorddet.jv_pan_name;

    this.TANRECORD.id = this.Recorddet.jv_tan_id;
    this.TANRECORD.code = this.Recorddet.jv_tan_code;
    this.TANRECORD.name = this.Recorddet.jv_tan_name;

    this.TPRECORD.id = this.Recorddet.jv_tan_party_id;
    this.TPRECORD.code = this.Recorddet.jv_tan_party_code;
    this.TPRECORD.name = this.Recorddet.jv_tan_party_name;

    this.CCList = this.Record.CostCenterList.filter(rec => rec.ct_jv_id == _Record.jv_pkid);


    this.PendingListRecords = new Array<pendinglist>();
  }

  ShowDocuments(doc: any) {
    this.ErrorMessage = '';
    this.open(doc);
  }

  LoadPendingList(content: any) {


    this.ErrorMessage = '';
    if (this.Recorddet.jv_acc_against_invoice == "N") {
      this.ErrorMessage = 'Allocation option not set for this account';
      return;
    }
    if (this.Recorddet.jv_acc_against_invoice == "D" && this.Recorddet.jv_drcr == "DR") {
      this.ErrorMessage = 'Only Credit Entry can be Allocated';
      return;
    }
    if (this.Recorddet.jv_acc_against_invoice == "C" && this.Recorddet.jv_drcr == "CR") {
      this.ErrorMessage = 'Only Debit Entry can be Allocated';
      return;
    }
    if (this.Recorddet.jv_total <= 0) {
      this.ErrorMessage = 'Amount is not Entered';
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

        this.Record.XrefList.forEach(Dr => {
          this.PendingListRecords.forEach(Drow => {
            // Creditors
            if (SearchData.type == 'DR' && Dr.xref_cr_jv_id == Drow.jv_pkid) {
              Drow.jv_allocation = Dr.xref_amt;
              Drow.jv_selected = true;
            }
            // Debtors
            if (SearchData.type == 'CR' && Dr.xref_dr_jv_id == Drow.jv_pkid) {
              Drow.jv_allocation = Dr.xref_amt;
              Drow.jv_selected = true;
            }
          });
        });

        this.open(content);
      },
        error => {
          this.loading = false;
          this.ErrorMessage = this.gs.getError(error);
        });
  }

  Ok() {
    let bok = true;
    let cctotal: number = 0;


    if (this.Recorddet.jv_acc_id == null) {
      this.ErrorMessage = 'A/c code Cannot Be Blank';
      alert(this.ErrorMessage);
      return;
    }

    if (this.Recorddet.jv_acc_id == '') {
      this.ErrorMessage = 'A/c code Cannot Be Blank';
      alert(this.ErrorMessage);
      return;
    }

    if (this.Recorddet.jv_curr_id == '') {
      this.ErrorMessage = 'Currency Cannot Be Blank';
      alert(this.ErrorMessage);
      return;
    }


    if (!this.gs.IsBranchWiseCodeOK(this.gs.globalVariables.branch_type, this.Recorddet.jv_acc_code, this.Recorddet.jv_acc_main_code)) {
      this.ErrorMessage = 'Invalid Sea/Air Code';
      alert(this.ErrorMessage);
      return;
    }

    if (this.Recorddet.jv_drcr == 'CR') {
      if (this.Recorddet.jv_acc_code == '194A' || this.Recorddet.jv_acc_code == '194B' || this.Recorddet.jv_acc_code == '194C' || this.Recorddet.jv_acc_code == '194H' || this.Recorddet.jv_acc_code == '194I' || this.Recorddet.jv_acc_code == '194IA' || this.Recorddet.jv_acc_code == '194J') {

        if (this.Recorddet.jv_pan_id.toString() == '' && this.Recorddet.jv_tds_rate != 20) {
          this.ErrorMessage = 'Invalid Pan | Tds% ';
          alert(this.ErrorMessage);
          return;
        }

      }
    }

    if (this.Recorddet.jv_drcr == 'DR') {
      if (this.Recorddet.jv_acc_code == 'TDS' || this.Recorddet.jv_acc_code == 'TDSPAID') {
        if (this.Recorddet.jv_tan_id.toString() == '' || this.Recorddet.jv_tan_party_id.toString() == '' || this.Recorddet.jv_gross_bill_amt <= 0) {
          this.ErrorMessage = 'Invalid Tan / Tan Party / Gross Bill Amt ';
          alert(this.ErrorMessage);
          return;
        }
      }
    }

    if (this.type == "CP") {
      if (this.Recorddet.jv_acc_type_name == 'CASH' && this.Recorddet.jv_drcr == "DR") {
        this.ErrorMessage = 'Cannot Debit Cash';
        alert(this.ErrorMessage);
        return;
      }
      if (this.Recorddet.jv_acc_type_name == 'BANK' && this.Recorddet.jv_drcr == "CR") {
        this.ErrorMessage = 'Cannot Credit Bank';
        alert(this.ErrorMessage);
        return;
      }
    }
    if (this.type == "CR") {
      if (this.Recorddet.jv_acc_type_name == 'CASH' && this.Recorddet.jv_drcr == "CR") {
        this.ErrorMessage = 'Cannot Credit Cash';
        alert(this.ErrorMessage);
        return;
      }
      if (this.Recorddet.jv_acc_type_name == 'BANK' && this.Recorddet.jv_drcr == "DR") {
        this.ErrorMessage = 'Cannot Debit Bank';
        alert(this.ErrorMessage);
        return;
      }
    }


    if (this.type == "BP") {

      if (this.Recorddet.jv_acc_type_name == 'CASH' && this.Recorddet.jv_drcr == "CR") {
        this.ErrorMessage = 'Cannot Credit Cash';
        alert(this.ErrorMessage);
        return;
      }

      if (this.Recorddet.jv_acc_type_name == 'BANK' && this.Recorddet.jv_drcr == "CR") {

        if (this.Recorddet.jv_doc_type != "NA") {
          if (this.Recorddet.jv_chqno == null) {
            this.ErrorMessage = 'Cheque Number Cannot Be Blank';
            alert(this.ErrorMessage);
            return;
          }

          if (this.Recorddet.jv_chqno <= 0) {
            this.ErrorMessage = 'Invalid Cheque Number Found.';
            alert(this.ErrorMessage);
            return;
          }

          if (this.Recorddet.jv_due_date == null) {
            this.ErrorMessage = 'Cheque Date Cannot Be Blank';
            alert(this.ErrorMessage);
            return;
          }

          if (this.Recorddet.jv_due_date == '') {
            this.ErrorMessage = 'Cheque Date Cannot Be Blank';
            alert(this.ErrorMessage);
            return;
          }
        }
      }

    }
    if (this.type == "BR") {
      if (this.Recorddet.jv_acc_type_name == 'BANK' && this.Recorddet.jv_drcr == "CR") {
        this.ErrorMessage = 'Cannot Credit Bank';
        alert(this.ErrorMessage);
        return;
      }

      if (this.Recorddet.jv_acc_type_name == 'CASH' && this.Recorddet.jv_drcr == "DR") {
        this.ErrorMessage = 'Cannot Debit Cash';
        alert(this.ErrorMessage);
        return;
      }
    }




    if (this.Recorddet.jv_total <= 0) {
      this.ErrorMessage = 'Invalid Amount';
      alert(this.ErrorMessage);
      return;
    }


    this.CCList.forEach(rec => {
      if (rec.ct_cost_code == '' || rec.ct_cost_id == '' || rec.ct_cost_name == 'Invalid Cost Center Code') {
        this.ErrorMessage = "Invalid Cost Center";
        bok = false;
      }
      cctotal += rec.ct_amount;
    });

    if (!bok) {
      if (this.ErrorMessage != '')
        alert(this.ErrorMessage);
      return;
    }

    if (this.Recorddet.jv_acc_cost_centre == "N") {
      if (this.CCList.length > 0) {
        this.ErrorMessage = 'Cost Center Cannot Be Allocated';
        alert(this.ErrorMessage);
        return;
      }
    }

    if (this.Recorddet.jv_acc_cost_centre == "Y") {
      if (this.CCList.length <= 0) {
        this.ErrorMessage = 'Cost Center Not Allocated';
        alert(this.ErrorMessage);
        return;
      }
      if (this.Recorddet.jv_total != cctotal) {
        this.ErrorMessage = 'Amount not matching with Cost Center Amt';
        alert(this.ErrorMessage);
        return;
      }
    }

    if (cctotal != 0) {
      if (this.Recorddet.jv_total != cctotal) {
        this.ErrorMessage = 'Amount not matching with Cost Center Amt';
        alert(this.ErrorMessage);
        return;
      }
    }







    if (!this.ProcessPendingList) {
      if (this.Recorddet.jv_acc_against_invoice == "D" && this.Recorddet.jv_drcr == "CR") {
        this.ErrorMessage = 'Invalid Invoice Allocation';
        alert(this.ErrorMessage);
        return;
      }
      if (this.Recorddet.jv_acc_against_invoice == "C" && this.Recorddet.jv_drcr == "DR") {
        this.ErrorMessage = 'Invalid Invoice Allocation';
        alert(this.ErrorMessage);
        return;
      }
    }


    let xref_Total: number = 0;
    this.PendingListRecords.forEach(rec => {
      if (rec.jv_allocation > 0) {
        if (this.Recorddet.jv_acc_id != rec.jv_acc_id)
          bok = false;
        if (this.Recorddet.jv_drcr == rec.jv_drcr)
          bok = false;
        xref_Total += rec.jv_allocation;
        xref_Total = this.gs.roundNumber(xref_Total, 2);
      }
    });

    if (!bok) {
      this.ErrorMessage = 'Mismatch in Invoice Allocation';
      alert(this.ErrorMessage);
      return;
    }
    if (xref_Total > 0 && xref_Total > this.Recorddet.jv_total) {
      this.ErrorMessage = 'Allocated amount is above ledger amount';
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
    this.Recorddet.jv_gst_rate = this.Recorddet.jv_cgst_rate + this.Recorddet.jv_sgst_rate + this.Recorddet.jv_igst_rate;

    if (this.Record.jvh_rc)
      this.Recorddet.jv_net_total = this.Recorddet.jv_total;
    else
      this.Recorddet.jv_net_total = this.Recorddet.jv_total + this.Recorddet.jv_gst_amt;

    this.Recorddet.jv_qty = 1;
    this.Recorddet.jv_rate = this.Recorddet.jv_ftotal;

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

      REC.jv_is_gst_item = this.Recorddet.jv_is_gst_item;

      REC.jv_curr_id = this.Recorddet.jv_curr_id;
      REC.jv_curr_code = this.Recorddet.jv_curr_code;

      REC.jv_sac_id = this.Recorddet.jv_sac_id;
      REC.jv_sac_code = this.Recorddet.jv_sac_code;

      this.Recorddet.jv_qty = 1;
      this.Recorddet.jv_rate = this.Recorddet.jv_ftotal;

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
        REC.jv_credit = null;
      }
      if (REC.jv_drcr == "CR") {
        REC.jv_row_type = 'CR-LEDGER';
        REC.jv_debit = null;
        REC.jv_credit = REC.jv_total;
      }
      REC.jv_remarks = this.Recorddet.jv_remarks;

      REC.jv_pan_id = this.Recorddet.jv_pan_id;
      REC.jv_pan_code = this.Recorddet.jv_pan_code;
      REC.jv_pan_name = this.Recorddet.jv_pan_name;

      REC.jv_bank = this.Recorddet.jv_bank;
      REC.jv_branch = this.Recorddet.jv_branch;
      REC.jv_chqno = this.Recorddet.jv_chqno;
      REC.jv_due_date = this.Recorddet.jv_due_date;
      REC.jv_pay_reason = this.Recorddet.jv_pay_reason;
      REC.jv_supp_docs = this.Recorddet.jv_supp_docs;
      REC.jv_paid_to = this.Recorddet.jv_paid_to;


      REC.jv_tds_rate = this.Recorddet.jv_tds_rate;
      REC.jv_tds_gross_amt = this.Recorddet.jv_tds_gross_amt;

      REC.jv_tan_id = this.Recorddet.jv_tan_id;
      REC.jv_tan_code = this.Recorddet.jv_tan_code;
      REC.jv_tan_name = this.Recorddet.jv_tan_name;
      REC.jv_gross_bill_amt = this.Recorddet.jv_gross_bill_amt;

      REC.jv_tan_party_id = this.Recorddet.jv_tan_party_id;
      REC.jv_tan_party_code = this.Recorddet.jv_tan_party_code;
      REC.jv_tan_party_name = this.Recorddet.jv_tan_party_name;


      REC.jv_od_type = this.Recorddet.jv_od_type;
      REC.jv_od_remarks = this.Recorddet.jv_od_remarks;


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


    // Xref Processing

    for (i = this.Record.XrefList.length - 1; i >= 0; i -= 1) {
      if (this.Record.XrefList[i].xref_jv_id === this.Recorddet.jv_pkid) {
        this.Record.XrefList.splice(i, 1);
      }
    }

    if (this.ProcessPendingList) {

      let xref: LedgerXref;
      this.PendingListRecords.forEach(rec => {
        if (rec.jv_allocation > 0) {
          xref = new LedgerXref();
          xref.xref_pkid = this.gs.getGuid();
          xref.xref_jvh_id = this.pkid;
          xref.xref_jv_id = this.Recorddet.jv_pkid;
          xref.xref_acc_id = this.Recorddet.jv_acc_id;
          xref.xref_year = +this.gs.globalVariables.year_code;
          xref.xref_amt = rec.jv_allocation;
          xref.xref_drcr = rec.jv_drcr;

          if (this.Recorddet.jv_drcr == "DR") {
            xref.xref_dr_jvh_id = this.pkid;
            xref.xref_dr_jv_id = this.Recorddet.jv_pkid;
            xref.xref_dr_jv_year = +this.gs.globalVariables.year_code;
            xref.xref_dr_jv_date = this.Record.jvh_date;

            xref.xref_cr_jvh_id = rec.jv_parent_id;
            xref.xref_cr_jv_id = rec.jv_pkid;
            xref.xref_cr_jv_year = rec.jv_year;
            xref.xref_cr_jv_date = rec.jv_date;
          }

          if (this.Recorddet.jv_drcr == "CR") {
            xref.xref_cr_jvh_id = this.pkid;
            xref.xref_cr_jv_id = this.Recorddet.jv_pkid;
            xref.xref_cr_jv_year = +this.gs.globalVariables.year_code;
            xref.xref_cr_jv_date = this.Record.jvh_date;

            xref.xref_dr_jvh_id = rec.jv_parent_id;
            xref.xref_dr_jv_id = rec.jv_pkid;
            xref.xref_dr_jv_year = rec.jv_year;
            xref.xref_dr_jv_date = rec.jv_date;
          }
          this.Record.XrefList.push(xref);
        }
      });
    }

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

      total_debit += this.gs.roundNumber(rec.jv_debit, 2);
      total_credit += this.gs.roundNumber(rec.jv_credit, 2);

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
    if (ftotamt_dr > ftotamt_cr)
      this.Record.jvh_tot_famt = ftotamt_dr;
    else if (ftotamt_cr > ftotamt_dr)
      this.Record.jvh_tot_famt = ftotamt_cr;
    else
      this.Record.jvh_tot_famt = ftotamt_dr;

    this.Record.jvh_cgst_famt = fcgstamt;
    this.Record.jvh_sgst_famt = fsgstamt;
    this.Record.jvh_igst_famt = figstamt;
    this.Record.jvh_gst_famt = fgstamt;

    if (this.Record.jvh_rc)
      this.Record.jvh_net_famt = this.Record.jvh_tot_famt;
    else
      this.Record.jvh_net_famt = this.Record.jvh_tot_famt + fgstamt;


    // Local Currency
    if (totamt_dr > totamt_cr)
      this.Record.jvh_tot_amt = totamt_dr;
    else if (totamt_cr > totamt_dr)
      this.Record.jvh_tot_amt = totamt_cr;
    else
      this.Record.jvh_tot_amt = totamt_dr;

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
    this.diff = total_debit - total_credit;
    //If Reverse Charge
    if (!this.Record.jvh_rc) {
      if (gst_drcr == 'DR')
        this.diff = (total_debit + gstamt) - total_credit;
      else
        this.diff = total_debit - (total_credit + gstamt);

      this.diff = this.gs.roundNumber(this.diff, 2);

    }
    this.Record.jvh_diff = this.diff;
  }

  PendingListOkSelected(sAction: string) {
    this.ProcessPendingList = true;
    this.modal.close();
  }
  open(content: any) {
    this.modal = this.modalService.open(content);
  }


  onLostFocus(field: string) {
    if (field == 'jvh_cc_code') {
      this.SearchRecord('jvh_cc_code');
    }
  }


  SearchRecord(controlname: string) {

    if (controlname == 'tanupdate') {
      if(this.Recorddet.jv_tan_id=='')
      {
        alert("TAN # Cannot be empty");
        return;
      }
      if(this.Recorddet.jv_tan_party_id=='')
      {
        alert("Tan Party Cannot be empty");
        return;
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
      chqno: '',
      jv_due_date: '',
      jv_pay_reason: '',
      jv_supp_docs: '',
      jv_paid_to: '',
      jv_remarks: '',
      jv_tan_id: '',
      jv_tan_party_id:''
    };
    if (controlname == 'taxcode') {
      SearchData.table = 'acctm';
      SearchData.pkid = this.Recorddet.jv_acc_id;
    }
    if (controlname == 'jvh_cc_code') {
      SearchData.table = 'costcenterm';
      SearchData.type = this.Record.jvh_cc_category;
      SearchData.comp_code = this.gs.globalVariables.comp_code;
      SearchData.branch_code = this.gs.globalVariables.branch_code;
      SearchData.year = this.gs.globalVariables.year_code;
      SearchData.searchstring = this.Record.jvh_cc_code;
    }
    if (controlname == 'cntrsinos') {
      SearchData.table = 'cntrsinos';
      SearchData.type = this.Record.jvh_cc_category;
      SearchData.comp_code = this.gs.globalVariables.comp_code;
      SearchData.branch_code = this.gs.globalVariables.branch_code;
      SearchData.year = this.gs.globalVariables.year_code;
      SearchData.searchstring = this.CostCode;
    }
    if (controlname == 'chqnoupdate') {
      SearchData.table = 'chqnoupdate';
      SearchData.pkid = this.Recorddet.jv_pkid;
      SearchData.chqno = this.Recorddet.jv_chqno.toString();
      SearchData.jv_due_date = this.Recorddet.jv_due_date.toString();
      SearchData.jv_pay_reason = this.Recorddet.jv_pay_reason.toString();
      SearchData.jv_supp_docs = this.Recorddet.jv_supp_docs.toString();
      SearchData.jv_paid_to = this.Recorddet.jv_paid_to.toString();
      SearchData.jv_remarks = this.Recorddet.jv_remarks.toString();
    }
    if (controlname == 'tanupdate') {
      SearchData.table = 'tanupdate';
      SearchData.pkid = this.Recorddet.jv_pkid;
      SearchData.jv_tan_id = this.Recorddet.jv_tan_id;
      SearchData.jv_tan_party_id=this.Recorddet.jv_tan_party_id;
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
        if (controlname == 'cntrsinos') {
          if (response.cntrsinos.length > 0) {

            if (this.CostNarration != "")
              this.CostNarration += ", ";

            this.CostNarration += "SI# " + response.cntrsinos;
            if (this.CostNarration.length > 255)
              this.CostNarration = this.CostNarration.substring(0, 255);

            if (this.CostNarration.length > 0)
              this.Record.jvh_narration = this.CostNarration;
          }
        }
        if (controlname == 'chqnoupdate') {
          for (let rec of this.Record.LedgerList.filter(rec => rec.jv_pkid == this.Recorddet.jv_pkid)) {
            rec.jv_chqno = this.Recorddet.jv_chqno;
            rec.jv_due_date = this.Recorddet.jv_due_date;
            rec.jv_pay_reason = this.Recorddet.jv_pay_reason;
            rec.jv_supp_docs = this.Recorddet.jv_supp_docs;
            rec.jv_paid_to = this.Recorddet.jv_paid_to;
            rec.jv_remarks = this.Recorddet.jv_remarks;
          }
          alert("Cheque Details Updated Successfully");
        }
        if (controlname == 'tanupdate') {
          for (let rec of this.Record.LedgerList.filter(rec => rec.jv_pkid == this.Recorddet.jv_pkid)) {
            rec.jv_tan_id = this.Recorddet.jv_tan_id;
            rec.jv_tan_code = this.Recorddet.jv_tan_code;
            rec.jv_tan_name = this.Recorddet.jv_tan_name;
            rec.jv_tan_party_id = this.Recorddet.jv_tan_party_id;
            rec.jv_tan_party_code = this.Recorddet.jv_tan_party_code;
            rec.jv_tan_party_name = this.Recorddet.jv_tan_party_name;
          }
          alert("TAN Updated Successfully");
        }
      },
        error => {
          this.loading = false;
          this.ErrorMessage = this.gs.getError(error);
        });
  }

  folder_id: string;
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



  Downloadfile(filename: string, filetype: string, filedisplayname: string) {
    this.gs.DownloadFile(this.gs.globalVariables.report_folder, filename, filetype, filedisplayname);
  }
  ChequePrint() {
    this.bChqboxvisible = !this.bChqboxvisible;
  }



  changeNarration($event: any) {

  }


  getNarration() {
    let str: string = '';
    let catg: string = '';
    let i: number = 0;
    let IsCntrWise: boolean = false;
    this.CostCode = "";
    this.CostNarration = "";

    if (this.Record.jvh_acc_name.length > 0)
      str = "BEING AMT DUE TO TO M/s " + this.Record.jvh_acc_name;
    if (this.Record.jvh_reference.length > 0)
      str += " TWDS Bill# " + this.Record.jvh_reference + " dated " + this.Record.jvh_reference_date;

    //CostCenterList
    str += this.Record.jvh_cc_name;
    this.Record.CostCenterList.forEach(rec => {
      if (i == 0) {
        str += rec.ct_category;
        if (rec.ct_category == 'CNTR SEA EXPORT')
          IsCntrWise = true;
      }
      i++;
      if (catg != '')
        catg += ',';
      catg += rec.ct_cost_code;
    });
    str += catg;;
    if (str.length > 0)
      str = str.replace('CNTR SEA EXPORT', 'CNTR# ');

    if (str.length > 255)
      str = str.substring(0, 255);

    if (str.length > 0)
      this.Record.jvh_narration = str;

    if (IsCntrWise) {
      this.CostCode = catg;
      this.CostNarration = str;
      this.SearchRecord('cntrsinos');
    }
  }

  UpdateInvoice() {
    this.loading = true;
    this.ErrorMessage = '';
    this.InfoMessage = '';
    this.Record._globalvariables = this.gs.globalVariables;
    this.mainService.UpdateInvoice(this.Record)
      .subscribe(response => {
        this.loading = false;
        this.InfoMessage = "Updated Successfully";
        alert(this.InfoMessage);
      },
        error => {
          this.ErrorMessage = this.gs.getError(error);
          this.loading = false;
          alert(this.ErrorMessage);
        });
  }

  ShowHistory(history: any) {
    this.ErrorMessage = '';
    this.open(history);
  }
  ShowApproval(approval: any, _sid: string) {
    this.ErrorMessage = '';
    this.pkid = _sid;
    this.open(approval);
  }

  ModifiedRecords(params: any) {
    var REC = this.RecordList.find(rec => rec.jvh_pkid == params.sid);
    if (REC != null) {
      if (params.stype == "BP") {
        if (params.mstatus.length > 0) {//if master updated then mstatus length greater than zero
          REC.rec_aprvd_status = params.mstatus;
          REC.rec_aprvd_remark = params.mremarks;
          REC.rec_aprvd_by = this.gs.globalVariables.user_code;
        }
      }
    }
    this.modal.close();
  }

  PrintInvoice(reportformat: string, _type: string = 'PDF', _invid: string) {
    this.ErrorMessage = '';
    this.InfoMessage = '';
    if (_invid.trim().length <= 0) {
      this.ErrorMessage = "Invalid Invoice ID";
      return;
    }

    // if (_type == "MAIL") {

    //   this.mSubject = "SALES INVOICE  " + this.Record.jvh_docno;
    //   this.mSubject += " - M/S " + this.Record.jvh_acc_name;
    //   this.mSubject += " - DT " + this.jvh_date.GetDisplayDate();
    //   if (this.Record.jvh_cc_code != "") {
    //     this.mSubject += " - " + this.Record.jvh_cc_category + "#" + this.Record.jvh_cc_code;
    //   }

    //   this.mMsg = "Dear Valued Customer,";
    //   this.mMsg += " \n\n";
    //   this.mMsg += "  Pls find the attached sales invoice for your kind reference";
    //   this.mMsg += " \n\n";
    // }


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

    SearchData.pkid = _invid;
    SearchData.report_format = reportformat;
    SearchData.report_folder = this.gs.globalVariables.report_folder;
    SearchData.company_code = this.gs.globalVariables.comp_code;
    SearchData.branch_code = this.gs.globalVariables.branch_code;
    SearchData.folderid = this.folder_id;
    SearchData.report_caption = "INVOICE";
    //SearchData.menuadmin = this.bAdmin == true ? "Y" : "N";
    SearchData.menuadmin = "N";
    this.ErrorMessage = '';
    this.mainService.GenerateInvoice(SearchData)
      .subscribe(response => {
        this.loading = false;
        // if (_type == 'MAIL') {
        //   this.AttachList = new Array<any>();
        //   this.AttachList.push({ filename: response.filename, filetype: response.filetype, filedisplayname: response.filedisplayname });
        //   this.open(mailsent);
        // } else
        this.Downloadfile(response.filename, response.filetype, response.filedisplayname);
      },
        error => {
          this.loading = false;
          this.ErrorMessage = this.gs.getError(error);
        });
  }

  ShowMoneyTransfer(moneytransfer: any) {
    this.ErrorMessage = '';
    this.open(moneytransfer);
  }
}
