import { Component, Input, ViewChild, Output, OnInit, OnDestroy, EventEmitter, ElementRef } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

import { ActivatedRoute } from '@angular/router';

import { GlobalService } from '../../../core/services/global.service';

import { Itemm } from '../../models/itemm';

import { JobInvoicem } from '../../models/jobinvoice';

import { ItemService } from '../../services/item.service';

import { SearchTable } from '../../../shared/models/searchtable';

@Component({
  selector: 'app-jobitem',
  templateUrl: './item.component.html',
  providers: [ItemService]
})
export class ItemComponent {
  /*
  Ajith Findtotal Changed ,itm amt enabled
  */
  // Local Variables 
  title = 'Item List';

  @Input() menuid: string = '';
  @Input() type: string = '';
  @Input() parentid: string = '';
  @Input() nfei: string = '';


  selectedRowIndex: number = -1;

  Total_Amount: number = 0;
  modal: any;

  loading = false;
  currentTab = 'LIST';

  search_inv_pkid: string = '';

  inv_pkid: string = '';
  inv_no: string = '';
  ex_rate: number;
  itm_code: string = '';

  ErrorMessage = "";
  InfoMessage = "";
  mode = 'ADD';
  pkid = '';

  ctr: number;

  bListLoaded: boolean = false;
  bValueChanged: boolean = false;

  Prev_item_name = '';

  // Array For Displaying List
  RecordList: Itemm[] = [];
  // Single Record for add/edit/view details
  Record: Itemm = new Itemm;

  SCHEMERECORD: SearchTable = new SearchTable();
  RITCRECORD: SearchTable = new SearchTable();
  UNITRECORD: SearchTable = new SearchTable();
  DBKRECORD: SearchTable = new SearchTable();
  STRRECORD: SearchTable = new SearchTable();
  ENDUSERECORD: SearchTable = new SearchTable();
  THRDSHPRRECORD: SearchTable = new SearchTable();
  THRDADDRRECORD: SearchTable = new SearchTable();
  ITMMASTERRECORD: SearchTable = new SearchTable();
  STATERECORD: SearchTable = new SearchTable();
  DISTRECORD: SearchTable = new SearchTable();
  TARECORD: SearchTable = new SearchTable();
  InvoiceList: JobInvoicem[] = [];

  constructor(
    private modalService: NgbModal,
    private mainService: ItemService,
    private route: ActivatedRoute,
    private gs: GlobalService
  ) {

    this.InitLov();
    this.ActionHandler("ADD", null);
  }

  // Init Will be called After executing Constructor
  ngOnInit() {
    this.LoadDefault();
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
        this.InvoiceList = response.jobexpm;
        this.ChangeInvoiceList(true);
      },
        error => {
          this.loading = false;
          this.ErrorMessage = this.gs.getError(error);
        });
  }

  ChangeInvoiceList(bfirstTime: boolean) {
    if (this.InvoiceList != null) {
      for (var i = 0; i < this.InvoiceList.length; i++) {
        if ((bfirstTime && i == 0) || (!bfirstTime && this.InvoiceList[i].jexp_pkid == this.search_inv_pkid)) {
          this.inv_pkid = this.InvoiceList[i].jexp_pkid;
          this.inv_no = this.InvoiceList[i].jexp_invoice_no;
          this.ex_rate = this.InvoiceList[i].jexp_exrate;
          this.search_inv_pkid = this.InvoiceList[i].jexp_pkid;
          this.List('NEW');
          break;
        }
      }
    }
  }


  InitLov(action: string = '') {

    if (action == '' || action == 'SCHEME') {
      this.SCHEMERECORD = new SearchTable();
      this.SCHEMERECORD.controlname = "SCHEME";
      this.SCHEMERECORD.displaycolumn = "NAME";
      this.SCHEMERECORD.type = "SCHEME CODE";
      this.SCHEMERECORD.id = "";
      this.SCHEMERECORD.code = "";
      this.SCHEMERECORD.name = "";
    }

    if (action == '' || action == 'RITC') {
      this.RITCRECORD = new SearchTable();
      this.RITCRECORD.controlname = "RITC";
      this.RITCRECORD.displaycolumn = "CODE";
      this.RITCRECORD.type = "RITCM";
      this.RITCRECORD.id = "";
      this.RITCRECORD.code = "";
      this.RITCRECORD.name = "";
    }

    if (action == '' || action == 'UNITTYPE') {
      this.UNITRECORD = new SearchTable();
      this.UNITRECORD.controlname = "UNITTYPE";
      this.UNITRECORD.displaycolumn = "CODE";
      this.UNITRECORD.type = "UNIT";
      this.UNITRECORD.id = "";
      this.UNITRECORD.code = "";
      this.UNITRECORD.name = "";
    }

    if (action == '' || action == 'DBK') {
      this.DBKRECORD = new SearchTable();
      this.DBKRECORD.controlname = "DBK";
      this.DBKRECORD.displaycolumn = "CODE";
      this.DBKRECORD.type = "DRAWBACK";
      //this.DBKRECORD.id = "";
      this.DBKRECORD.code = "";
      this.DBKRECORD.name = "";
    }

    if (action == '' || action == 'STR') {
      this.STRRECORD = new SearchTable();
      this.STRRECORD.controlname = "STR";
      this.STRRECORD.displaycolumn = "CODE";
      this.STRRECORD.type = "STRREFUNDM";
      this.STRRECORD.code = "";
      this.STRRECORD.name = "";
    }

    if (action == '' || action == 'ENDUSE') {
      this.ENDUSERECORD = new SearchTable();
      this.ENDUSERECORD.controlname = "ENDUSE";
      this.ENDUSERECORD.displaycolumn = "CODE";
      this.ENDUSERECORD.type = "END USE";
      this.ENDUSERECORD.code = "";
      this.ENDUSERECORD.name = "";
    }

    if (action == '' || action == 'THRDSHPR') {
      this.THRDSHPRRECORD = new SearchTable();
      this.THRDSHPRRECORD.controlname = "THRDSHPR";
      this.THRDSHPRRECORD.displaycolumn = "CODE";
      this.THRDSHPRRECORD.type = "CUSTOMER";
      this.THRDSHPRRECORD.where = " CUST_IS_SHIPPER = 'Y' "
      this.THRDSHPRRECORD.id = "";
      this.THRDSHPRRECORD.code = "";
      this.THRDSHPRRECORD.name = "";
      this.THRDSHPRRECORD.parentid = "";
    }

    if (action == '' || action == 'THRDADDR') {
      this.THRDADDRRECORD = new SearchTable();
      this.THRDADDRRECORD.controlname = "THRDADDR";
      this.THRDADDRRECORD.displaycolumn = "CODE";
      this.THRDADDRRECORD.type = "CUSTOMERADDRESS";
      this.THRDADDRRECORD.id = "";
      this.THRDADDRRECORD.code = "";
      this.THRDADDRRECORD.name = "";
      this.THRDADDRRECORD.parentid = "";
    }

    if (action == '' || action == 'ITEMMASTER') {
      this.ITMMASTERRECORD = new SearchTable();
      this.ITMMASTERRECORD.controlname = "ITEMMASTER";
      this.ITMMASTERRECORD.displaycolumn = "CODE";
      this.ITMMASTERRECORD.type = "ITEMMASTER";
      this.ITMMASTERRECORD.code = "";
      this.ITMMASTERRECORD.name = ""
    }

    
    if (action == '' || action == 'STATE') {
      this.STATERECORD = new SearchTable();
      this.STATERECORD.controlname = "STATE";
      this.STATERECORD.displaycolumn = "CODE";
      this.STATERECORD.type = "STATE";
      this.STATERECORD.id = "";
      this.STATERECORD.code = "";
      this.STATERECORD.name = "";
      this.STATERECORD.parentid = "";
    }
    if (action == '' || action == 'DISTRICT') {
      this.DISTRECORD = new SearchTable();
      this.DISTRECORD.controlname = "DISTRICT";
      this.DISTRECORD.displaycolumn = "CODE";
      this.DISTRECORD.type = "DISTRICT";
      this.DISTRECORD.id = "";
      this.DISTRECORD.code = "";
      this.DISTRECORD.name = "";
      this.DISTRECORD.parentid = "";
    }
    if (action == '' || action == 'TA') {
      this.TARECORD = new SearchTable();
      this.TARECORD.controlname = "TA";
      this.TARECORD.displaycolumn = "CODE";
      this.TARECORD.type = "TRADE AGREEMENTS";
      this.TARECORD.id = "";
      this.TARECORD.code = "";
      this.TARECORD.name = "";
      this.TARECORD.parentid = "";
    }
  }

  LovSelected(_Record: SearchTable) {

    if (_Record.controlname == "SCHEME") {
      this.Record.itm_scheme_id = _Record.id;
      this.Record.itm_scheme_code = _Record.code;
      this.Record.itm_scheme_name = _Record.name;
    }
    if (_Record.controlname == "RITC") {
      this.Record.itm_ritc_id = _Record.id;
      this.Record.itm_ritc_code = _Record.code;
      this.Record.itm_ritc_name = _Record.name;
    }
    if (_Record.controlname == "UNITTYPE") {
      this.Record.itm_unit_id = _Record.id;
      this.Record.itm_unit_code = _Record.code;
      this.Record.itm_unit_name = _Record.name;
    }
    if (_Record.controlname == "DBK") {
      this.Record.itm_dbk_code = _Record.code;
      this.Record.itm_dbk_name = _Record.name;
      this.SearchRecord('dbk');
    }
    if (_Record.controlname == "STR") {
      this.Record.itm_strrefund_no = _Record.code;
      this.Record.itm_strrefund_name = _Record.name;
      this.Record.itm_strrefund_rate = _Record.rate;
    }
    if (_Record.controlname == "ENDUSE") {
      this.Record.itm_end_use = _Record.code;
      this.Record.itm_end_use_name = _Record.name;
    }

    let bchange: boolean = false;

    if (_Record.controlname == "THRDSHPR") {

      bchange = false;
      if (this.Record.itm_third_party_id != _Record.id)
        bchange = true;

      this.Record.itm_third_party_id = _Record.id;
      this.Record.itm_third_party_code = _Record.code;
      this.Record.itm_third_party_name = _Record.name;

      if (bchange) {
        this.THRDADDRRECORD = new SearchTable();
        this.THRDADDRRECORD.controlname = "THRDADDR";
        this.THRDADDRRECORD.displaycolumn = "CODE";
        this.THRDADDRRECORD.type = "CUSTOMERADDRESS";
        this.THRDADDRRECORD.id = "";
        this.THRDADDRRECORD.code = "";
        this.THRDADDRRECORD.name = "";
        this.THRDADDRRECORD.parentid = this.Record.itm_third_party_id;
        this.Record.itm_third_party_br_address = "";
      }
    }
    else if (_Record.controlname == "THRDADDR") {
      this.Record.itm_third_party_br_id = _Record.id;
      this.Record.itm_third_party_br_no = _Record.code;
      this.Record.itm_third_party_br_address = this.GetBrAddress(_Record.name).address;
    }
    else if (_Record.controlname == "ITEMMASTER") {
      this.itm_code = _Record.code;
      this.itm_code = this.itm_code.toUpperCase();
      if (_Record.id != '')
        this.GetDefaultRecord(_Record.id);
    }

    if (_Record.controlname == "STATE") {

      bchange = false;
      if (this.Record.itm_state_id != _Record.id)
        bchange = true;

      this.Record.itm_state_id = _Record.id;
      this.Record.itm_state_code = _Record.code;
      this.Record.itm_state_name = _Record.name;

      if (bchange) {
        this.DISTRECORD = new SearchTable();
        this.DISTRECORD.controlname = "DISTRICT";
        this.DISTRECORD.displaycolumn = "CODE";
        this.DISTRECORD.type = "DISTRICT";
        this.DISTRECORD.id = "";
        this.DISTRECORD.code = "";
        this.DISTRECORD.name = "";
        this.DISTRECORD.parentid = this.Record.itm_state_code;
        this.Record.itm_district_name="";
      }
    }

    if (_Record.controlname == "DISTRICT") {
      this.Record.itm_district_id = _Record.id;
      this.Record.itm_district_code = _Record.code;
      this.Record.itm_district_name = _Record.name;
    }
    if (_Record.controlname == "TA") {
      this.Record.itm_ta_id = _Record.id;
      this.Record.itm_ta_code = _Record.code;
      this.Record.itm_ta_name = _Record.name;
    }

  }

  LoadDbkRate() {

  }


  SearchRecord(controlname: string) {
    if (controlname == 'dbk') {
      if (this.Record.itm_dbk_code == null || this.Record.itm_dbk_code == undefined)
        return;
    }

    this.loading = true;

    let SearchData = {
      table: 'drawback',
      dbk_slno: '',
      itm_id: '',
      itm_code: '',
      company_code: '',
      branch_code: ''
    };
    if (controlname == 'dbk') {
      SearchData.table = 'drawback';
      SearchData.dbk_slno = this.Record.itm_dbk_code;
    }
    if (controlname == 'itemmaster') {
      SearchData.table = 'itemmaster';
      SearchData.itm_id = this.Record.itm_pkid;
      SearchData.itm_code = this.itm_code;
      SearchData.company_code = this.gs.globalVariables.comp_code;
      SearchData.branch_code = this.gs.globalVariables.branch_code;
    }
    this.ErrorMessage = '';
    this.InfoMessage = '';
    this.gs.SearchRecord(SearchData)
      .subscribe(response => {
        this.loading = false;
        this.ErrorMessage = '';
        if (controlname == 'itemmaster') {
          this.InfoMessage = 'Item Master Updated For Code ';
          this.InfoMessage += response.itemmaster;
        }
        if (controlname == 'dbk') {
          this.Record.itm_dbk_type = '';
          this.Record.itm_dbk_unit = '';
          this.Record.itm_dbk_rate = 0;
          this.Record.itm_dbk_valuecap = 0;
          this.Record.itm_rosl_rate = 0;
          this.Record.itm_rosl_valuecap = 0;
          this.Record.itm_rosl_ctl_rate = 0;
          this.Record.itm_rosl_ctl_valuecap = 0;
          this.Record.itm_dbk_caption1 = '';
          this.Record.itm_dbk_caption2 = '';

          if (response.drawback.length > 0) {

            this.Record.itm_dbk_type = response.drawback[0].dbk_type;
            this.Record.itm_dbk_unit = response.drawback[0].dbk_unit;
            this.Record.itm_dbk_rate = response.drawback[0].dbk_rate;
            this.Record.itm_dbk_valuecap = response.drawback[0].dbk_valuecap;
            this.Record.itm_rosl_rate = response.drawback[0].dbk_state_rt;
            this.Record.itm_rosl_valuecap = response.drawback[0].dbk_state_valuecap;
            this.Record.itm_rosl_ctl_rate = response.drawback[0].dbk_ctl_rt;
            this.Record.itm_rosl_ctl_valuecap = response.drawback[0].dbk_ctl_valuecap;
          }
        }
      },
        error => {
          this.loading = false;
          this.ErrorMessage = this.gs.getError(error);
        });
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
    }
    else if (action === 'EDIT') {
      this.selectedRowIndex = _selectedRowIndex;
      this.currentTab = 'DETAILS';
      this.ResetControls();
      this.mode = 'EDIT';
      this.pkid = id;
      this.GetRecord(id);
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
      rowtype: this.type,
      parentid: this.inv_pkid,
      company_code: this.gs.globalVariables.comp_code,
      branch_code: this.gs.globalVariables.branch_code,
      year_code: this.gs.globalVariables.year_code,
    };

    this.ErrorMessage = '';
    this.InfoMessage = '';
    this.mainService.List(SearchData)
      .subscribe(response => {
        this.loading = false;
        this.RecordList = response.list;
        this.ActionHandler("ADD", null);
        this.bListLoaded = true;
      },
        error => {
          this.loading = false;
          this.ErrorMessage = this.gs.getError(error);
        });
  }

  NewRecord() {

    this.pkid = this.gs.getGuid();
    this.Record = new Itemm();
    this.Record.itm_pkid = this.pkid;
    this.Record.itm_job_id = this.parentid;
    this.Record.itm_invoice_id = this.inv_pkid;
    this.Record.itm_invoice_no = this.inv_no;
    this.Record.itm_desc = this.Prev_item_name;

    this.Record.itm_scheme_id = '';
    this.Record.itm_scheme_code = '';
    this.Record.itm_scheme_name = '';

    this.Record.itm_ritc_id = '';
    this.Record.itm_ritc_code = '';
    this.Record.itm_ritc_name = '';

    this.Record.itm_unit_id = '';
    this.Record.itm_unit_code = '';
    this.Record.itm_unit_name = '';

    this.Record.itm_qty = 0;
    this.Record.itm_unit_factor = 1;
    this.Record.itm_unit_rate = 0;
    this.Record.itm_amount = 0;
    this.Record.itm_pmv = 0;
    this.Record.itm_pmv_total = 0;
    this.Record.itm_cbm = 0;
    this.Record.itm_grwt = 0;
    this.Record.itm_ntwt = 0;
    this.Record.itm_total_cartons = 0;

    this.Record.itm_dbk_code = '';
    this.Record.itm_dbk_qty = 0;

    this.Record.itm_dbk_type = '';
    this.Record.itm_dbk_unit = '';

    this.Record.itm_dbk_rate = 0;
    this.Record.itm_dbk_valuecap = 0;

    this.Record.itm_rosl_rate = 0;
    this.Record.itm_rosl_valuecap = 0;
    this.Record.itm_rosl_ctl_rate = 0;
    this.Record.itm_rosl_ctl_valuecap = 0;

    this.Record.itm_strrefund_no = '';
    this.Record.itm_strrefund_rate = 0;
    this.Record.itm_accessory_status = '0';
    this.Record.itm_end_use = '';
    this.Record.itm_hawb = '';
    this.Record.itm_igst_pay_status = 'NA';
    this.Record.itm_taxable_value = 0;
    this.Record.itm_igst_amt = 0;
    this.Record.itm_igst_rate = 0;
    this.Record.itm_stmt_type = 'NA';
    this.Record.itm_stmt_code1 = false;
    this.Record.itm_stmt_code2 = false;
    this.Record.itm_stmt_code3 = false;

    this.Record.itm_third_party_id = '';
    this.Record.itm_third_party_code = '';
    this.Record.itm_third_party_name = '';

    this.Record.itm_third_party_br_id = '';
    this.Record.itm_third_party_br_no = '';
    this.Record.itm_third_party_br_address = '';

    this.Record.itm_reward = true;
    this.itm_code = '';

    this.Record.itm_state_id = '';
    this.Record.itm_state_code = '';
    this.Record.itm_state_name = '';

    this.Record.itm_district_id = '';
    this.Record.itm_district_code = '';
    this.Record.itm_district_name = '';

    this.Record.itm_ta_id = '';
    this.Record.itm_ta_code = '';
    this.Record.itm_ta_name = '';

    this.Record.rec_mode = this.mode;

    this.InitLov();

    if(this.RecordList.length>1)
    {
      this.Record.itm_state_id = this.RecordList[this.RecordList.length-1].itm_state_id;
      this.Record.itm_state_code = this.RecordList[this.RecordList.length-1].itm_state_code;
      this.Record.itm_state_name =  this.RecordList[this.RecordList.length-1].itm_state_name;

      this.Record.itm_district_id = this.RecordList[this.RecordList.length-1].itm_district_id;
      this.Record.itm_district_code =  this.RecordList[this.RecordList.length-1].itm_district_code;
      this.Record.itm_district_name =  this.RecordList[this.RecordList.length-1].itm_district_name;

      this.STATERECORD.id = this.Record.itm_state_id;
      this.STATERECORD.code = this.Record.itm_state_code;
      this.STATERECORD.name = this.Record.itm_state_name;

      this.DISTRECORD.id = this.Record.itm_district_id;
      this.DISTRECORD.code = this.Record.itm_district_code;
      this.DISTRECORD.name = this.Record.itm_district_name;
      this.DISTRECORD.parentid = this.Record.itm_state_code;
    }
  }

  // Load a single Record for VIEW/EDIT
  GetRecord(Id: string) {
    this.loading = true;

    let SearchData = {
      pkid: Id,
    };

    this.ErrorMessage = '';
    this.InfoMessage = '';
    this.mainService.GetRecord(SearchData)
      .subscribe(response => {
        this.loading = false;
        this.LoadData(response.record);
      },
        error => {
          this.loading = false;
          this.ErrorMessage = this.gs.getError(error);
        });
  }

  LoadData(_Record: Itemm) {
    this.Record = _Record;
    this.InitLov();

    this.SCHEMERECORD.id = this.Record.itm_scheme_id;
    this.SCHEMERECORD.code = this.Record.itm_scheme_code;
    this.SCHEMERECORD.name = this.Record.itm_scheme_name;

    this.RITCRECORD.id = this.Record.itm_ritc_id;
    this.RITCRECORD.code = this.Record.itm_ritc_code;
    this.RITCRECORD.name = this.Record.itm_ritc_name;

    this.UNITRECORD.id = this.Record.itm_unit_id;
    this.UNITRECORD.code = this.Record.itm_unit_code;
    this.UNITRECORD.name = this.Record.itm_unit_name;

    this.DBKRECORD.code = this.Record.itm_dbk_code;
    this.DBKRECORD.name = this.Record.itm_dbk_name;

    this.STRRECORD.code = this.Record.itm_strrefund_no;
    this.STRRECORD.name = this.Record.itm_strrefund_name;

    this.ENDUSERECORD.code = this.Record.itm_end_use;
    this.ENDUSERECORD.name = this.Record.itm_end_use_name;

    this.THRDSHPRRECORD.id = this.Record.itm_third_party_id;
    this.THRDSHPRRECORD.code = this.Record.itm_third_party_code;
    this.THRDSHPRRECORD.name = this.Record.itm_third_party_name;

    this.THRDADDRRECORD.id = this.Record.itm_third_party_br_id;
    this.THRDADDRRECORD.code = this.Record.itm_third_party_br_no;
    this.THRDADDRRECORD.parentid = this.Record.itm_third_party_br_address;

    this.STATERECORD.id = this.Record.itm_state_id;
    this.STATERECORD.code = this.Record.itm_state_code;
    this.STATERECORD.name = this.Record.itm_state_name;

    this.DISTRECORD.id = this.Record.itm_district_id;
    this.DISTRECORD.code = this.Record.itm_district_code;
    this.DISTRECORD.name = this.Record.itm_district_name;
    this.DISTRECORD.parentid = this.Record.itm_state_code;

    this.TARECORD.id = this.Record.itm_ta_id;
    this.TARECORD.code = this.Record.itm_ta_code;
    this.TARECORD.name = this.Record.itm_ta_name;

    this.Record.rec_mode = this.mode;
  }
  // Save Data
  Save() {
    if (!this.allvalid())
      return;
    this.loading = true;
    this.ErrorMessage = '';
    this.InfoMessage = '';
    this.Record.itm_job_id = this.parentid;
    this.Record._globalvariables = this.gs.globalVariables;
    this.mainService.Save(this.Record)
      .subscribe(response => {
        this.loading = false;
        this.Prev_item_name = this.Record.itm_desc;
        this.InfoMessage = "Save Complete";
        this.mode = 'EDIT';
        this.Record.rec_mode = this.mode;
        if (response.STATUS == "SPECIAL CHARACTER") {
          alert("Specical Character Found In Item Description, Pls Re-Check Data");
        }
        this.RefreshList();
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
    if (this.Record.itm_desc.trim().length <= 0) {
      bret = false;
      sError = "Description Cannot Be Blank";
    }
    if (bret === false)
      this.ErrorMessage = sError;
    return bret;
  }

  RefreshList() {

    if (this.RecordList == null)
      return;
    var REC = this.RecordList.find(rec => rec.itm_pkid == this.Record.itm_pkid);
    if (REC == null) {
      this.RecordList.push(this.Record);
    }
    else {
      REC.itm_desc = this.Record.itm_desc;
      REC.itm_qty = this.Record.itm_qty;
      REC.itm_unit_rate = this.Record.itm_unit_rate;
      REC.itm_amount = this.Record.itm_amount;
      REC.itm_state_id = this.Record.itm_state_id;
      REC.itm_state_code = this.Record.itm_state_code;
      REC.itm_state_name = this.Record.itm_state_name;
      REC.itm_district_id = this.Record.itm_district_id;
      REC.itm_district_code = this.Record.itm_district_code;
      REC.itm_district_name = this.Record.itm_district_name;
    }
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
        this.RecordList.splice(this.RecordList.findIndex(rec => rec.itm_pkid == this.pkid), 1);
        this.ActionHandler('ADD', null);
      },
        error => {
          this.loading = false;
          this.ErrorMessage = this.gs.getError(error);
        });
  }


  Close() {
    this.gs.ClosePage('home');
  }

  OnBlur(field: string) {
    switch (field) {
      case 'itm_desc': {
        this.Record.itm_desc = this.Record.itm_desc.toUpperCase();
        break;
      }

      case 'itm_qty': {
        this.Record.itm_qty = this.gs.roundNumber(this.Record.itm_qty, 3);
        this.FindTotal("itm_qty");
        break;
      }

      case 'itm_unit_factor': {
        this.Record.itm_unit_factor = this.gs.roundNumber(this.Record.itm_unit_factor, 3);
        if (this.Record.itm_unit_factor <= 0)
          this.Record.itm_unit_factor = 1;
        this.FindTotal("itm_unit_factor");
        break;
      }
      case 'itm_unit_rate': {
        this.Record.itm_unit_rate = this.gs.roundNumber(this.Record.itm_unit_rate, 5);
        this.FindTotal("itm_unit_rate");
        break;
      }

      case 'itm_amount': {
        this.Record.itm_amount = this.gs.roundNumber(this.Record.itm_amount, 3);
        this.FindTotal("itm_amount");
        break;
      }
      case 'itm_pmv': {

        break;
      }

      case 'itm_pmv_total': {

        break;
      }
      case 'itm_cbm': {
        this.Record.itm_cbm = this.gs.roundNumber(this.Record.itm_cbm, 3);
        break;
      }

      case 'itm_grwt': {
        this.Record.itm_grwt = this.gs.roundNumber(this.Record.itm_grwt, 3);
        break;
      }
      case 'itm_ntwt': {
        this.Record.itm_ntwt = this.gs.roundNumber(this.Record.itm_ntwt, 3);
        break;
      }
      case 'itm_dbk_qty': {
        this.Record.itm_dbk_qty = this.gs.roundNumber(this.Record.itm_dbk_qty, 3);
        break;
      }
      case 'itm_hawb': {
        this.Record.itm_hawb = this.Record.itm_hawb.toUpperCase();
        break;
      }
      case 'itm_taxable_value': {
        this.Record.itm_taxable_value = this.gs.roundNumber(this.Record.itm_taxable_value, 2);
        this.FindIgstAmt2();
        break;
      }
      case 'itm_igst_amt': {
        this.Record.itm_igst_amt = this.gs.roundNumber(this.Record.itm_igst_amt, 2);
        break;
      }
      case 'itm_igst_rate': {
        this.Record.itm_igst_rate = this.gs.roundNumber(this.Record.itm_igst_rate, 2);
        this.FindIgstAmt2();
        break;
      }
      case 'itm_cess_qty': {
        this.Record.itm_cess_qty = this.gs.roundNumber(this.Record.itm_cess_qty, 3);
        break;
      }
      case 'itm_strrefund_rate': {
        this.Record.itm_strrefund_rate = this.gs.roundNumber(this.Record.itm_strrefund_rate, 2);
        break;
      }
      case 'itm_code': {
        this.itm_code = this.itm_code.toUpperCase();
        break;
      }
    }
  }

  OnChange(field: string) {
    if (field == 'itm_igst_pay_status')
      this.FindIgstAmt();

    if (field == 'itm_unit_factor')
      this.bValueChanged = true;
    if (field == 'itm_qty')
      this.bValueChanged = true;
    if (field == 'itm_unit_rate')
      this.bValueChanged = true;
    if (field == 'itm_amount')
      this.bValueChanged = true;

    if (field == 'itm_taxable_value' || field == 'itm_igst_rate')
      this.bValueChanged = true;
  }

  OnFocus(field: string) {

    if (field == 'itm_unit_factor')
      this.bValueChanged = false;
    if (field == 'itm_qty')
      this.bValueChanged = false;
    if (field == 'itm_unit_rate')
      this.bValueChanged = false;
    if (field == 'itm_amount')
      this.bValueChanged = false;

    if (field == 'itm_taxable_value' || field == 'itm_igst_rate')
      this.bValueChanged = false;
  }

  CurrencyLoad() {

  }

  FindTotal(_type: string = "") {
    if (this.bValueChanged == false)
      return;

    let amt: number;
    let res: number;
    let pmv: number;
    let pmvtotal: number
    res = 0;
    if (this.Record.itm_unit_factor > 0) {
      if (_type == "itm_amount") {
        amt = this.Record.itm_amount;
        if (this.Record.itm_qty > 0) {
          this.Record.itm_unit_rate = amt / this.Record.itm_qty;
          this.Record.itm_unit_rate = this.gs.roundNumber(this.Record.itm_unit_rate, 5);
        }
      } else
        amt = this.Record.itm_unit_rate * this.Record.itm_qty;

      res = amt / this.Record.itm_unit_factor;
      pmv = (this.Record.itm_unit_rate * this.ex_rate) * 110 / 100;
      pmvtotal = (amt * this.ex_rate) * 110 / 100;
    }

    this.Record.itm_amount = this.gs.roundNumber(res, 3);
    this.Record.itm_pmv = this.gs.roundNumber(pmv, 2);
    this.Record.itm_pmv_total = this.gs.roundNumber(pmvtotal, 2);
    // this.FindIgstAmt();
  }

  FindTotalOld() {
    let amt: number;
    let res: number;
    let pmv: number;
    let pmvtotal: number
    res = 0;
    if (this.Record.itm_unit_factor > 0) {
      amt = this.Record.itm_unit_rate * this.Record.itm_qty;
      res = amt / this.Record.itm_unit_factor;
      pmv = (this.Record.itm_unit_rate * this.ex_rate) * 110 / 100;
      pmvtotal = (amt * this.ex_rate) * 110 / 100;
    }

    this.Record.itm_amount = this.gs.roundNumber(res, 3);
    this.Record.itm_pmv = this.gs.roundNumber(pmv, 2);
    this.Record.itm_pmv_total = this.gs.roundNumber(pmvtotal, 2);
    // this.FindIgstAmt();
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

  UpdateItmMaster() {
    this.ErrorMessage = '';
    this.InfoMessage = '';
    if (this.itm_code == '') {
      this.ErrorMessage = " Code Cannot be Blank. ";
      return;
    }
    if (this.Record.itm_dbk_code == null || this.Record.itm_dbk_code == undefined) {
      this.ErrorMessage = " Drawback Code Cannot be Blank. ";
      return;
    }
    this.SearchRecord('itemmaster');
  }

  GetDefaultRecord(Id: string) {
    this.loading = true;
    let SearchData = {
      pkid: Id,
    };

    this.ErrorMessage = '';
    this.InfoMessage = '';
    this.mainService.GetRecord(SearchData)
      .subscribe(response => {
        this.loading = false;

        let _NewRecord: Itemm;
        _NewRecord = response.record;
        this.Record.itm_desc = _NewRecord.itm_desc;
        this.Record.itm_scheme_id = _NewRecord.itm_scheme_id;
        this.Record.itm_scheme_code = _NewRecord.itm_scheme_code;
        this.Record.itm_scheme_name = _NewRecord.itm_scheme_name;
        this.Record.itm_ritc_id = _NewRecord.itm_ritc_id;
        this.Record.itm_ritc_code = _NewRecord.itm_ritc_code;
        this.Record.itm_ritc_name = _NewRecord.itm_ritc_name;
        this.Record.itm_dbk_code = _NewRecord.itm_dbk_code;
        this.Record.itm_dbk_name = _NewRecord.itm_dbk_name;
        this.Record.itm_unit_id = this.gs.defaultValues.param_unit_pcs_id;
        this.Record.itm_unit_code = this.gs.defaultValues.param_unit_pcs_code;

        this.InitLov('SCHEME');
        this.SCHEMERECORD.id = this.Record.itm_scheme_id;
        this.SCHEMERECORD.code = this.Record.itm_scheme_code;
        this.SCHEMERECORD.name = this.Record.itm_scheme_name;

        this.InitLov('RITC');
        this.RITCRECORD.id = this.Record.itm_ritc_id;
        this.RITCRECORD.code = this.Record.itm_ritc_code;
        this.RITCRECORD.name = this.Record.itm_ritc_name;

        this.InitLov('UNITTYPE');
        this.UNITRECORD.id = this.Record.itm_unit_id;
        this.UNITRECORD.code = this.Record.itm_unit_code;
        this.UNITRECORD.name = this.Record.itm_unit_name;

        this.InitLov('DBK');
        this.DBKRECORD.code = this.Record.itm_dbk_code;
        this.DBKRECORD.name = this.Record.itm_dbk_name;

        this.SearchRecord('dbk');
      },
        error => {
          this.loading = false;
          this.ErrorMessage = this.gs.getError(error);
        });
  }

  FindIgstAmt() {
    let igstamt: number;
    let taxbleamt: number;
    if (this.Record.itm_igst_pay_status == "P") {

      // taxbleamt = this.Record.itm_unit_rate * this.Record.itm_qty;
      taxbleamt = this.ex_rate * this.Record.itm_amount;
      taxbleamt = this.gs.roundNumber(taxbleamt, 2);
      this.Record.itm_taxable_value = taxbleamt;

      if (this.Record.itm_igst_rate > 0) {
        igstamt = taxbleamt * (this.Record.itm_igst_rate / 100);
        igstamt = this.gs.roundNumber(igstamt, 2);
        this.Record.itm_igst_amt = igstamt;
      }
    } else {
      this.Record.itm_taxable_value = 0;
      this.Record.itm_igst_rate = 0;
      this.Record.itm_igst_amt = 0;
    }
  }

  FindIgstAmt2() {
    let igstamt: number;
    if (this.bValueChanged && this.Record.itm_igst_pay_status == "P" && this.Record.itm_igst_rate > 0) {

      igstamt = this.Record.itm_taxable_value * (this.Record.itm_igst_rate / 100);
      igstamt = this.gs.roundNumber(igstamt, 2);

      this.Record.itm_igst_amt = igstamt;
    }
  }

  open(content: any) {
    this.modal = this.modalService.open(content);
  }

  LinkDocs(esanchitlink: any) {
    this.open(esanchitlink);
  }
}
