import { Component, Input, Output, OnInit, OnDestroy, EventEmitter, ViewChild } from '@angular/core';

import { ActivatedRoute } from '@angular/router';

import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

import { GlobalService } from '../../core/services/global.service';

import { JobIncome } from '../models/jobincome';

import { AutoCompleteComponent } from '../../shared/autocomplete/autocomplete.component';

import { JobIncomeService } from '../services/jobincome.service';

import { SearchTable } from '../../shared/models/searchtable';
import { env } from 'process';

@Component({
  selector: 'app-jobincome',
  templateUrl: './jobincome.component.html',
  providers: [JobIncomeService]
})
export class JobIncomeComponent {
  // Local Variables 
  title = 'Income List';

  @Input() menuid: string = '';
  @Input() type: string = '';
  @Input() subtype: string = '';
  @Input() parentid: string = '';

  modal: any;

  @ViewChild('AcLov') private AcLovCmp: AutoCompleteComponent;

  selectedRowIndex: number = -1;

  bShowQtnList: boolean = false;
  lock_record: boolean = false;

  inv_category = '';

  lastcategory = 'FREIGHT MEMO';

  bChanged: boolean;

  income_type = 'ALL';



  pp_amt: number = 0;
  cc_amt: number = 0;
  total_amt: number = 0;
  rebate_amt: number = 0;
  rebate2_amt: number = 0;

  loading = false;
  currentTab = 'LIST';

  search_inv_pkid: string = '';


  CntrTypes: string = "";

  ncbm: string = '';
  nntwt: string = '';
  ngrwt: string = '';
  nchwt: string = '';


  old_inv_curr_id: string = '';
  old_inv_curr_code: string = '';
  old_inv_cntr_type_id: string = '';
  old_inv_cntr_type: string = '';
  old_inv_exrate: number = 1;
  old_inv_type = '';


  cntr_type_visible = true;

  inv_pkid: string = '';
  inv_no: string = '';
  ex_rate: number;

  ErrorMessage = "";
  InfoMessage = "";
  mode = 'ADD';
  pkid = '';

  ctr: number;

  //Cost Center List 

  // Array For Displaying List
  RecordList: JobIncome[] = [];
  // Single Record for add/edit/view details
  Record: JobIncome = new JobIncome;

  ACCRECORD: SearchTable = new SearchTable();
  CURRECORD: SearchTable = new SearchTable();
  CNTRTYPERECORD: SearchTable = new SearchTable();
  REBTCURRECORD: SearchTable = new SearchTable();
  REBTCURRECORD2: SearchTable = new SearchTable();

  constructor(
    private mainService: JobIncomeService,
    private route: ActivatedRoute,
    private gs: GlobalService,
    private modalService: NgbModal,
  ) {
  }

  // Init Will be called After executing Constructor
  ngOnInit() {
    this.InitLov();
    this.inv_category = '';
    if (this.type == 'SEA EXPORT')
      this.inv_category = 'SE-' + this.subtype;
    else if (this.type == 'AIR EXPORT')
      this.inv_category = 'AE-' + this.subtype;
    else if (this.type == 'SEA IMPORT')
      this.inv_category = 'SI-' + this.subtype;
    else if (this.type == 'AIR IMPORT')
      this.inv_category = 'AI-' + this.subtype;
    else if (this.type == 'GENERAL JOB')
      this.inv_category = 'GN-' + this.subtype;



    this.cntr_type_visible = false;
    if (this.type == "SEA EXPORT" || this.type == "SEA IMPORT") {
      this.cntr_type_visible = true;
    }
    this.List('NEW');
  }

  // Destroy Will be called when this component is closed
  ngOnDestroy() {

  }

  LoadDefault() {

    this.loading = true;
    let SearchData = {
      pkid: this.parentid,
      comp_code: this.gs.globalVariables.comp_code,
      branch_code: this.gs.globalVariables.branch_code,

    };

    this.ErrorMessage = '';
    this.InfoMessage = '';
    this.mainService.LoadDefault(SearchData)
      .subscribe(response => {
        this.loading = false;
      },
        error => {
          this.loading = false;
          this.ErrorMessage = this.gs.getError(error);
          alert(this.ErrorMessage);
        });

  }


  InitLov() {

    this.ACCRECORD = new SearchTable();
    this.ACCRECORD.controlname = "ACCTM";
    this.ACCRECORD.displaycolumn = "CODE";
    this.ACCRECORD.type = "ACCTM";
    this.ACCRECORD.id = "";
    this.ACCRECORD.code = "";
    this.ACCRECORD.name = "";

    this.CURRECORD = new SearchTable();
    this.CURRECORD.controlname = "CURRENCY";
    this.CURRECORD.displaycolumn = "CODE";
    this.CURRECORD.type = "CURRENCY";
    this.CURRECORD.id = "";
    this.CURRECORD.code = "";
    this.CURRECORD.name = "";

    this.CNTRTYPERECORD = new SearchTable();
    this.CNTRTYPERECORD.controlname = "CNTRTYPE";
    this.CNTRTYPERECORD.displaycolumn = "CODE";
    this.CNTRTYPERECORD.type = "CONTAINER TYPE";
    this.CNTRTYPERECORD.id = "";
    this.CNTRTYPERECORD.code = "";
    this.CNTRTYPERECORD.name = "";
    this.CNTRTYPERECORD.where = "";
    if (this.CntrTypes != "")
      this.CNTRTYPERECORD.where = " param_pkid in (" + this.CntrTypes + ")";

    this.REBTCURRECORD = new SearchTable();
    this.REBTCURRECORD.controlname = "REBATE-CURRENCY";
    this.REBTCURRECORD.displaycolumn = "CODE";
    this.REBTCURRECORD.type = "CURRENCY";
    this.REBTCURRECORD.id = "";
    this.REBTCURRECORD.code = "";
    this.REBTCURRECORD.name = "";

    this.REBTCURRECORD2 = new SearchTable();
    this.REBTCURRECORD2.controlname = "REBATE2-CURRENCY";
    this.REBTCURRECORD2.displaycolumn = "CODE";
    this.REBTCURRECORD2.type = "CURRENCY";
    this.REBTCURRECORD2.id = "";
    this.REBTCURRECORD2.code = "";
    this.REBTCURRECORD2.name = "";

  }

  LovSelected(_Record: SearchTable) {
    if (_Record.controlname == "ACCTM") {
      this.Record.inv_acc_id = _Record.id;
      this.Record.inv_acc_code = _Record.code;
      this.Record.inv_acc_name = _Record.name;
    }
    if (_Record.controlname == "CURRENCY") {
      this.Record.inv_curr_id = _Record.id;
      this.Record.inv_curr_code = _Record.code;
      this.Record.inv_exrate = _Record.rate;
      this.bChanged = true;
      this.OnBlur('inv_exrate');
    }
    if (_Record.controlname == "CNTRTYPE") {
      this.Record.inv_cntr_type_id = _Record.id;
      this.Record.inv_cntr_type = _Record.code;
    }
    if (_Record.controlname == "REBATE-CURRENCY") {
      this.Record.inv_rebate_curr_code = _Record.code;
      this.Record.inv_rebate_exrate = _Record.rate;
    }

    if (_Record.controlname == "REBATE2-CURRENCY") {
      this.Record.inv_rebate2_curr_code = _Record.code;
      this.Record.inv_rebate2_exrate = _Record.rate;
    }

  }



  //function for handling LIST/NEW/EDIT Buttons
  ActionHandler(action: string, id: string, _selectedRowIndex: number = -1) {
    this.ErrorMessage = '';
    this.InfoMessage = '';
    if (action == 'LIST') {
      this.mode = '';
      this.pkid = '';
      this.currentTab = 'LIST';
    }
    else if (action === 'ADD') {
      this.currentTab = 'DETAILS';
      this.mode = 'ADD';
      this.ResetControls();
      this.NewRecord();
      this.AcLovCmp.Focus();
    }
    else if (action === 'EDIT') {
      this.selectedRowIndex = _selectedRowIndex;
      this.currentTab = 'DETAILS';
      this.mode = 'EDIT';
      this.ResetControls();
      this.pkid = id;
      this.GetRecord(id);
      this.AcLovCmp.Focus();
    }
    else if (action === 'REMOVE') {
      this.currentTab = 'DETAILS';
      this.pkid = id;
      this.RemoveRecord(id);
    }
  }

  RemoveList(event: any) {
    if (event.selected) {
      this.ActionHandler('REMOVE', event.id)
    }
  }

  ResetControls() {

  }

  List(_type: string) {
    this.loading = true;
    let SearchData = {
      type: _type,
      subtype: this.subtype,
      rowtype: this.type,
      parentid: this.parentid,
      incometype: this.income_type,
      company_code: this.gs.globalVariables.comp_code,
      branch_code: this.gs.globalVariables.branch_code,
      year_code: this.gs.globalVariables.year_code,
      hide_ho_entries: this.gs.globalVariables.hide_ho_entries
    };

    this.ChangeAccList();

    this.ErrorMessage = '';
    this.InfoMessage = '';
    this.mainService.List(SearchData)
      .subscribe(response => {
        this.loading = false;
        this.RecordList = response.list;

        this.ncbm = response.cbm;
        this.ngrwt = response.grwt;
        this.nntwt = response.ntwt;
        this.nchwt = response.chwt;
        this.CntrTypes = response.cntrtypes;
        this.lock_record = response.hbllock;

        this.FindListTotal();
        this.ActionHandler("ADD", null);
      },
        error => {
          this.loading = false;
          this.ErrorMessage = this.gs.getError(error);
          alert(this.ErrorMessage);
        });
  }

  NewRecord() {

    this.pkid = this.gs.getGuid();

    this.Record = new JobIncome();

    this.Record.inv_source = this.lastcategory;
    if (this.income_type != 'ALL')
      this.Record.inv_source = this.income_type;

    this.Record.inv_parent_id = this.parentid;
    this.Record.inv_pkid = this.pkid;
    this.Record.inv_acc_id = '';
    this.Record.inv_acc_code = '';
    this.Record.inv_acc_name = '';

    this.Record.inv_curr_id = '';
    this.Record.inv_curr_code = '';
    this.Record.inv_cntr_type_id = '';
    this.Record.inv_cntr_type = '';
    this.Record.inv_exrate = 0;
    this.Record.inv_type = 'PREPAID';

    if (this.old_inv_curr_id != '') {
      this.Record.inv_curr_id = this.old_inv_curr_id;
      this.Record.inv_curr_code = this.old_inv_curr_code;
      this.Record.inv_cntr_type_id = this.old_inv_cntr_type_id;
      this.Record.inv_cntr_type = this.old_inv_cntr_type;
      this.Record.inv_exrate = this.old_inv_exrate;
      this.Record.inv_type = this.old_inv_type;
    }


    this.Record.inv_qty = 1;
    this.Record.inv_rate = 0;

    this.Record.inv_ftotal = 0;

    this.Record.inv_total = 0;

    this.Record.inv_drcr = 'CR';
    if (this.subtype == 'EXPENSE') {
      this.Record.inv_type = 'COLLECT';
      this.Record.inv_drcr = 'DR';
    }
    if (this.subtype == 'EXP-BOOKING') {
      this.Record.inv_type = 'PREPAID';
      this.Record.inv_drcr = 'DR';
    }

    this.Record.inv_ctr = 0;

    this.Record.inv_calcon = '';
    this.Record.inv_remarks = '';

    this.Record.inv_posted = false;
    this.Record.inv_rebate_posted = false;
    this.Record.inv_rebate2_posted = false;


    this.Record.inv_rebate_amt = 0;
    this.Record.inv_rebate_curr_code = '';
    this.Record.inv_rebate_exrate = 0;
    this.Record.inv_rebate_amt_inr = 0;

    this.Record.inv_is_rebate2 = false;
    this.Record.inv_rebate2_amt = 0;
    this.Record.inv_rebate2_curr_code = '';
    this.Record.inv_rebate2_exrate = 0;
    this.Record.inv_rebate2_amt_inr = 0;

    this.Record.inv_category = this.inv_category;

    this.Record.rec_mode = this.mode;
    this.InitLov();

    this.ChangeAccList();

    if (this.old_inv_curr_id != '') {
      this.CURRECORD.code = this.old_inv_curr_code;
      this.CNTRTYPERECORD.id = this.old_inv_cntr_type_id;
      this.CNTRTYPERECORD.code = this.old_inv_cntr_type;
    }

    //this.PKGUNITRECORD.id = this.Record.pack_pkg_unit_id;
  }

  // Load a single Record for VIEW/EDIT
  GetRecord(Id: string) {
    this.loading = true;

    let SearchData = {
      pkid: Id,
      branchid: this.gs.globalVariables.branch_pkid,
      menuid: this.menuid,
      userid: this.gs.globalVariables.user_pkid,
      usercode: this.gs.globalVariables.user_code,
      hide_ho_entries: this.gs.globalVariables.hide_ho_entries
    };

    this.ErrorMessage = '';
    this.InfoMessage = '';
    this.mainService.GetRecord(SearchData)
      .subscribe(response => {
        this.loading = false;
        this.LoadData(response.record);

        if (this.gs.globalVariables.user_code == "ADMIN") {
          this.lock_record = false;
          this.Record.inv_rebate2_posted = false;
        }



      },
        error => {
          this.loading = false;
          this.ErrorMessage = this.gs.getError(error);
          alert(this.ErrorMessage);
        });
  }

  LoadData(_Record: JobIncome) {
    this.Record = _Record;
    this.InitLov();

    this.ACCRECORD.id = this.Record.inv_acc_id;
    this.ACCRECORD.code = this.Record.inv_acc_code;
    this.ACCRECORD.name = this.Record.inv_acc_name;

    this.CURRECORD.code = this.Record.inv_curr_code;

    this.CNTRTYPERECORD.id = this.Record.inv_cntr_type_id;
    this.CNTRTYPERECORD.code = this.Record.inv_cntr_type;

    this.REBTCURRECORD.code = this.Record.inv_rebate_curr_code;
    this.REBTCURRECORD2.code = this.Record.inv_rebate2_curr_code;

    this.lastcategory = this.Record.inv_source;

    this.Record.rec_mode = this.mode;


    this.ChangeAccList();

  }
  // Save Data
  Save() {

    if (!this.allvalid())
      return;
    this.loading = true;
    this.ErrorMessage = '';
    this.InfoMessage = '';
    this.Record.inv_parent_id = this.parentid;
    this.Record.rec_category = this.type;
    this.Record._globalvariables = this.gs.globalVariables;
    this.mainService.Save(this.Record)
      .subscribe(response => {
        this.loading = false;
        this.InfoMessage = "Save Complete";
        this.lastcategory = this.Record.inv_source;
        this.RefreshList();

        this.old_inv_curr_id = this.Record.inv_curr_id;
        this.old_inv_curr_code = this.Record.inv_curr_code;
        this.old_inv_cntr_type_id = this.Record.inv_cntr_type_id;
        this.old_inv_cntr_type = this.Record.inv_cntr_type;
        this.old_inv_exrate = this.Record.inv_exrate;
        this.old_inv_type = this.Record.inv_type;

        if (this.mode == "ADD") {
          this.ActionHandler("ADD", null);
        }
        alert("Save Complete");
        this.AcLovCmp.Focus();
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

    if (this.Record.inv_acc_code.length <= 0) {
      bret = false;
      sError += "| A/c Code Cannot Be Blank";
    }
    if (this.Record.inv_acc_name.length <= 0) {
      bret = false;
      sError += "| A/c Name Cannot Be Blank";
    }

    if (this.Record.inv_curr_code.length <= 0) {
      bret = false;
      sError += "| Currency Cannot Be Blank";
    }

    if (this.type == "SEA EXPORT" || this.type == "SEA IMPORT") {
      if (this.Record.inv_source == "FREIGHT MEMO" || this.Record.inv_source == "LOCAL CHARGES") {
        if (this.Record.inv_cntr_type_id == "") {
          bret = false;
          sError += "| Container Type Cannot Be Blank";
        }
      }
    }


    if (this.Record.inv_qty <= 0) {
      bret = false;
      sError += "| Qty Cannot Be Blank";
    }
    if (this.Record.inv_rate <= 0) {
      bret = false;
      sError += "| Rate Cannot Be Blank";
    }

    if (this.Record.inv_ftotal <= 0) {
      bret = false;
      sError += "| Amount Cannot Be Blank";
    }

    if (this.Record.inv_total <= 0) {
      bret = false;
      sError += "| Total Cannot Be Blank";
    }

    if (this.Record.inv_rebate_amt > 0) {

      if (this.Record.inv_rebate_curr_code.length <= 0) {
        bret = false;
        sError += "| Pls Input Rebate Currency";
      }

      if (this.Record.inv_rebate_exrate <= 0) {
        bret = false;
        sError += "| Pls Input Rebate Ex.Rate";
      }

      if (this.Record.inv_remarks.length <= 0) {
        bret = false;
        sError += "| Pls Input Remarks for Rebate";
      }
    }


    if (bret === false) {
      this.ErrorMessage = sError;
      alert(this.ErrorMessage);
    }
    return bret;
  }

  RefreshList() {

    if (this.RecordList == null)
      return;
    var REC = this.RecordList.find(rec => rec.inv_pkid == this.Record.inv_pkid);
    if (REC == null) {
      this.RecordList.push(this.Record);
    }
    else {
      REC.inv_acc_code = this.Record.inv_acc_code;
      REC.inv_acc_name = this.Record.inv_acc_name;
      REC.inv_source = this.Record.inv_source;
      REC.inv_type = this.Record.inv_type;
      REC.inv_cntr_type = this.Record.inv_cntr_type;
      REC.inv_curr_code = this.Record.inv_curr_code;
      REC.inv_qty = this.Record.inv_qty;
      REC.inv_rate = this.Record.inv_rate;
      REC.inv_ftotal = this.Record.inv_ftotal;
      REC.inv_exrate = this.Record.inv_exrate;
      REC.inv_total = this.Record.inv_total;
      REC.inv_rebate_amt = this.Record.inv_rebate_amt;
    }
    this.FindListTotal();
  }




  RemoveRecord(Id: string) {
    this.loading = true;
    let SearchData = {
      pkid: Id,
      parentid: this.parentid
    };

    this.ErrorMessage = '';
    this.InfoMessage = '';
    this.mainService.DeleteRecord(SearchData)
      .subscribe(response => {
        this.loading = false;
        this.RecordList.splice(this.RecordList.findIndex(rec => rec.inv_pkid == this.pkid), 1);
        this.ActionHandler('ADD', null);
        this.FindListTotal();
      },
        error => {
          this.loading = false;
          this.ErrorMessage = this.gs.getError(error);
          alert(this.ErrorMessage);
        });
  }


  Close() {
    this.gs.ClosePage('home');
  }

  OnFocus(field: string) {
    this.bChanged = false;
  }

  OnChange(field: string) {
    this.bChanged = true;
    if (field == 'inv_source') {

      this.Record.inv_acc_id = '';
      this.Record.inv_acc_code = '';
      this.Record.inv_acc_name = '';


      this.ACCRECORD = new SearchTable();
      this.ACCRECORD.controlname = "ACCTM";
      this.ACCRECORD.displaycolumn = "CODE";
      this.ACCRECORD.type = "ACCTM";
      this.ACCRECORD.id = "";
      this.ACCRECORD.code = "";
      this.ACCRECORD.name = "";


      this.ChangeAccList();

    }
  }




  ChangeAccList() {
    let sWhere: string = '';

    if (this.type == 'SEA EXPORT') {
      if (this.Record.inv_source == 'CLEARING INCOME') {
        sWhere = " (acc_main_code in ('1101','1103','1104') or acc_code in ('1102003','1102004') )";
      }
      if (this.Record.inv_source == 'FREIGHT MEMO' || this.Record.inv_source == 'LOCAL CHARGES') {
        sWhere = " (acc_main_code in ('1104','1105','1106') or acc_code in('1107003','1107004','1107005') ) ";
      }
      if (this.Record.inv_source == 'EX-WORK') {
        sWhere = " ( acc_main_code in ('1101','1103','1104','1105','1106') or acc_code in('1102003','1102004','1107003','1107004','1107005') )";
      }
    }
    if (this.type == 'SEA IMPORT') {
      if (this.Record.inv_source == 'CLEARING INCOME') {
        sWhere = " (acc_main_code in ('1301', '1303', '1304') or acc_code in('1302003','1302004')) ";
      }
      if (this.Record.inv_source == 'FREIGHT MEMO' || this.Record.inv_source == 'LOCAL CHARGES') {
        sWhere = " (acc_main_code in ('1304','1305','1306') or acc_code in('1307003','1307004','1307005') )";
      }
      if (this.Record.inv_source == 'EX-WORK') {
        sWhere = " (acc_main_code in ('1301', '1303', '1304','1305','1306') or acc_code in('1302003','1302004','1307003','1307004','1307005') )";
      }
    }

    if (this.type == 'AIR EXPORT') {
      if (this.Record.inv_source == 'CLEARING INCOME') {
        sWhere = " (acc_main_code in ('1201','1203','1204') or acc_code in ('1202003','1202004') )";
      }
      if (this.Record.inv_source == 'FREIGHT MEMO' || this.Record.inv_source == 'LOCAL CHARGES') {
        sWhere = "acc_main_code in ( '1204','1205')";
      }
      if (this.Record.inv_source == 'EX-WORK') {
        sWhere = "(acc_main_code in ('1201','1203','1204','1205') or acc_code in ('1202003','1202004'))";
      }
    }

    if (this.type == 'AIR IMPORT') {
      if (this.Record.inv_source == 'CLEARING INCOME') {
        sWhere = "(acc_main_code in ('1401','1403','1404') or acc_code in ('1402003','1402004') )";
      }
      if (this.Record.inv_source == 'FREIGHT MEMO' || this.Record.inv_source == 'LOCAL CHARGES') {
        sWhere = "acc_main_code in ('1404','1405')";
      }
      if (this.Record.inv_source == 'EX-WORK') {
        sWhere = "(acc_main_code in ('1401','1403','1404','1405') or acc_code in ('1402003','1402004') )";
      }
    }

    this.ACCRECORD.where = sWhere;
  }

  // SEA EXP FRT MEMO  " (acc_main_code in ('1104','1105','1108', '4501') or acc_code ='1106002') ";
  // SEA EXP JOB sWhere = " (acc_main_code in ('1101','1102','1103','1107','4501') or acc_code ='1106001') ";


  OnBlur(field: string) {
    let amt: number;
    switch (field) {
      case 'inv_acc_name': {
        this.Record.inv_acc_name = this.Record.inv_acc_name.toUpperCase();
        break;
      }
      case 'inv_remarks': {
        this.Record.inv_remarks = this.Record.inv_remarks.toUpperCase();
        break;
      }
      case 'inv_qty': {
        if (this.bChanged) {
          this.Record.inv_qty = this.gs.roundNumber(this.Record.inv_qty, 4);
          amt = this.Record.inv_qty * this.Record.inv_rate;
          this.Record.inv_ftotal = this.gs.roundNumber(amt, 2);
          this.FindInr();
        }
        break;
      }
      case 'inv_rate': {
        if (this.bChanged) {
          this.Record.inv_rate = this.gs.roundNumber(this.Record.inv_rate, 3);
          amt = this.Record.inv_qty * this.Record.inv_rate;
          this.Record.inv_ftotal = this.gs.roundNumber(amt, 2);
          this.FindInr();
        }
        break;
      }
      case 'inv_ftotal': {
        if (this.bChanged) {
          this.Record.inv_ftotal = this.gs.roundNumber(this.Record.inv_ftotal, 2);
          if (this.Record.inv_qty > 0) {
            amt = this.Record.inv_ftotal / this.Record.inv_qty;
            this.Record.inv_rate = this.gs.roundNumber(amt, 3);
            this.FindInr();
          }
        }
        break;
      }
      case 'inv_rebate': {
        if (this.bChanged) {
          this.Record.inv_rebate_amt = this.gs.roundNumber(this.Record.inv_rebate_amt, 2);
        }
        break;
      }
      case 'inv_rebate2': {
        if (this.bChanged) {
          this.Record.inv_rebate2_amt = this.gs.roundNumber(this.Record.inv_rebate2_amt, 2);
        }
        break;
      }
      case 'inv_exrate': {
        if (this.bChanged) {
          this.Record.inv_exrate = this.gs.roundNumber(this.Record.inv_exrate, 3);
          amt = this.Record.inv_ftotal * this.Record.inv_exrate;
          this.Record.inv_total = this.gs.roundNumber(amt, 2);
          this.FindInr();
        }
        break;
      }
      case 'inv_rebate_exrate': {
        this.Record.inv_rebate_exrate = this.gs.roundNumber(this.Record.inv_rebate_exrate, 3);
        break;
      }
      case 'inv_rebate2_exrate': {
        this.Record.inv_rebate2_exrate = this.gs.roundNumber(this.Record.inv_rebate2_exrate, 3);
        break;
      }
    }
  }


  FindInr() {
    let amt: number;
    amt = this.Record.inv_ftotal * this.Record.inv_exrate;
    this.Record.inv_total = this.gs.roundNumber(amt, 2);
  }


  FindListTotal() {
    this.pp_amt = 0;
    this.cc_amt = 0;
    this.total_amt = 0;
    this.rebate_amt = 0;
    this.RecordList.forEach(rec => {
      if (rec.inv_type == "PREPAID")
        this.pp_amt += rec.inv_total;
      if (rec.inv_type == "COLLECT")
        this.cc_amt += rec.inv_total;
      this.total_amt += rec.inv_total;
      this.rebate_amt += rec.inv_rebate_amt;
    });

    this.pp_amt = this.gs.roundNumber(this.pp_amt, 2);
    this.cc_amt = this.gs.roundNumber(this.cc_amt, 2);
    this.total_amt = this.gs.roundNumber(this.total_amt, 2);
    this.rebate_amt = this.gs.roundNumber(this.rebate_amt, 2);
  }

  folder_id: string;
  PrintFrightMemo(Id: string, _type: string) {
    this.folder_id = this.gs.getGuid();
    this.loading = true;
    let SearchData = {
      type: _type,
      pkid: Id,
      report_folder: '',
      folderid: '',
      branch_code: '',
      report_caption: '',
      parentid: '',
      comp_code: '',
      incometype: '',
      subtype: this.subtype
    };
    SearchData.type = _type;
    SearchData.pkid = this.pkid;
    SearchData.parentid = this.parentid;
    SearchData.incometype = this.income_type;
    SearchData.report_folder = this.gs.globalVariables.report_folder;
    SearchData.branch_code = this.gs.globalVariables.branch_code;
    SearchData.folderid = this.folder_id;
    SearchData.report_caption = this.income_type;
    SearchData.comp_code = this.gs.globalVariables.comp_code;

    this.ErrorMessage = '';
    this.InfoMessage = '';
    this.mainService.PrintFrightMemo(SearchData)
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

  ShowQuotation() {
    if (this.Record.inv_source == 'CLEARING INCOME' && (this.type == 'SEA EXPORT' || this.type == 'AIR EXPORT' || this.type == 'SEA IMPORT' || this.type == 'AIR IMPORT')) {
      this.bShowQtnList = true;
    }
    else {
      alert('Only Clearance Quotation can be loaded ');
    }
  }

  QtnClosed(qtnid: string = '') {
    if (qtnid != '') {
      this.bShowQtnList = false;
      this.saveQuotation(qtnid);
    }
    this.bShowQtnList = false;
  }


  saveQuotation(qtnid: string = '') {

    this.loading = true;
    this.ErrorMessage = '';
    this.InfoMessage = '';


    let RecordData = {
      qtnid: qtnid,
      subtype: this.subtype,
      rowtype: this.type,
      inv_source: this.Record.inv_source,
      parentid: this.parentid,
      inv_category: this.inv_category,
      company_code: this.gs.globalVariables.comp_code,
      branch_code: this.gs.globalVariables.branch_code,
      year_code: this.gs.globalVariables.year_code,
      user_code: this.gs.globalVariables.user_code
    };

    this.mainService.SaveQuotation(RecordData)
      .subscribe(response => {
        this.loading = false;
        this.InfoMessage = "Save Complete";
        this.List('NEW');
      },
        error => {
          this.loading = false;
          this.ErrorMessage = this.gs.getError(error);
          alert(this.ErrorMessage);
        });
  }


  // Save Rebate
  SaveSpecialRebate() {


    if (this.Record.inv_rebate2_amt > 0) {
      if (this.Record.inv_rebate2_curr_code.length <= 0) {
        alert(" Pls Enter Rebate Currency");
        return;
      }
      if (this.Record.inv_rebate2_exrate <= 0) {
        alert("Pls Enter Rebate Ex.Rate");
        return;
      }
    }
    this.ErrorMessage = '';
    this.InfoMessage = '';
    this.Record.inv_parent_id = this.parentid;
    this.Record.rec_category = this.type;
    this.Record._globalvariables = this.gs.globalVariables;
    this.mainService.SaveSpecialRebate(this.Record)
      .subscribe(response => {
        alert("Save Complete");
      }, error => {
        this.ErrorMessage = this.gs.getError(error);
        alert(this.ErrorMessage);
      });
  }

  ShowHistory(history: any) {
    this.ErrorMessage = '';
    this.modal = this.modalService.open(history);

  }

}



