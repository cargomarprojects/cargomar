import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';

import { ActivatedRoute } from '@angular/router';
 
import { GlobalService } from '../../core/services/global.service';

import { Costingm } from '../models/costing';
import { Costingd } from '../models/costing';

import { CostingService } from '../services/costing.service';
import { SearchTable } from '../../shared/models/searchtable';

@Component({
  selector: 'app-costing',
  templateUrl: './costing.component.html',
  providers: [CostingService]
})
export class CostingComponent {
  // Local Variables 
  title = 'BL Format';
  
  @Input() menuid: string = '';
  @Input() type: string = '';
  InitCompleted: boolean = false;
  menu_record: any;

  modal: any;
  selectedRowIndex: number = -1;

   
  disableSave = true;
  loading = false;
  currentTab = 'LIST';

  searchstring = '';
  page_count = 0;
  page_current = 0;
  page_rows = 0;
  page_rowcount = 0;


  lock_record: boolean = false;
  lock_date: boolean = false;
  bAdmin = false;
  

  sub: any;
  urlid: string;

  ErrorMessage = "";
  InfoMessage = "";

  refno = '';
  mode = '';
  pkid = '';
  tot_acc_amt: number = 0;

  AGENTRECORD: SearchTable = new SearchTable();
  AGENTADDRECORD: SearchTable = new SearchTable();
  CURRECORD: SearchTable = new SearchTable();
  // Array For Displaying List
  RecordList: Costingm[] = [];
  RecordDetList: Costingd[] = [];
  // Single Record for add/edit/view details
  Record: Costingm = new Costingm;
  RecordDet: Costingd = new Costingd;

  constructor(
    private modalService: NgbModal,
    private mainService: CostingService,
    private route: ActivatedRoute,
    public gs: GlobalService
  ) {
    this.page_count = 0;
    this.page_rows = 30;
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
    this.bAdmin = false;
    this.currentTab = 'LIST';
    this.menu_record = this.gs.getMenu(this.menuid);
    if (this.menu_record) {
      this.title = this.menu_record.menu_name;
      if (this.menu_record.rights_admin)
        this.bAdmin = true;
    }
    this.InitColumns();
    this.InitLov();
    this.List("NEW");
  }

  InitColumns() {
  }

  // Destroy Will be called when this component is closed
  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  InitLov(action: string = '') {

    this.CURRECORD = new SearchTable();
    this.CURRECORD.controlname = "CURRENCY";
    this.CURRECORD.displaycolumn = "CODE";
    this.CURRECORD.type = "CURRENCY";
    this.CURRECORD.id = "";
    this.CURRECORD.code = "";
    this.CURRECORD.name = "";

    if (action == '' || action == 'AGENT') {
      this.AGENTRECORD = new SearchTable();
      this.AGENTRECORD.controlname = "AGENT";
      this.AGENTRECORD.displaycolumn = "CODE";
      this.AGENTRECORD.type = "CUSTOMER";
      this.AGENTRECORD.where = " CUST_IS_AGENT = 'Y' ";
      this.AGENTRECORD.id = "";
      this.AGENTRECORD.code = "";
      this.AGENTRECORD.name = "";
    }

    if (action == '' || action == 'AGENTADDRESS') {
      this.AGENTADDRECORD = new SearchTable();
      this.AGENTADDRECORD.controlname = "AGENTADDRESS";
      this.AGENTADDRECORD.displaycolumn = "CODE";
      this.AGENTADDRECORD.type = "CUSTOMERADDRESS";
      this.AGENTADDRECORD.id = "";
      this.AGENTADDRECORD.code = "";
      this.AGENTADDRECORD.name = "";
      this.AGENTADDRECORD.parentid = "";
    }

  }

  LovSelected(_Record: SearchTable) {
    let bchange: boolean = false;
    if (_Record.controlname == "CURRENCY") {
      this.Record.cost_currency_id = _Record.id;
      this.Record.cost_currency_code = _Record.code;
      this.Record.cost_exrate = _Record.rate;
    }
    if (_Record.controlname == "AGENT") {
      bchange = false;
      if (this.Record.cost_jv_agent_id != _Record.id)
        bchange = true;

      this.Record.cost_jv_agent_id = _Record.id;
      this.Record.cost_jv_agent_code = _Record.code;
      this.Record.cost_jv_agent_name = _Record.name;

      if (bchange) {
        this.AGENTADDRECORD = new SearchTable();
        this.AGENTADDRECORD.controlname = "AGENTADDRESS";
        this.AGENTADDRECORD.displaycolumn = "CODE";
        this.AGENTADDRECORD.type = "CUSTOMERADDRESS";
        this.AGENTADDRECORD.id = "";
        this.AGENTADDRECORD.code = "";
        this.AGENTADDRECORD.name = "";
        this.AGENTADDRECORD.parentid = this.Record.cost_jv_agent_id;
        this.Record.cost_jv_agent_br_addr = "";
      }
    }

    if (_Record.controlname == "AGENTADDRESS") {
      this.Record.cost_jv_agent_br_id = _Record.id;
      this.Record.cost_jv_agent_br_no = _Record.code;
      this.Record.cost_jv_agent_br_addr = this.GetBrAddress(_Record.name).address;
    }
  }
  //function for handling LIST/NEW/EDIT Buttons
  ActionHandler(action: string, id: string, _selectedRowIndex: number = -1) {
    this.InfoMessage = '';
    this.ErrorMessage = '';
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

  // Query List Data
  List(_type: string) {

    this.loading = true;
    this.selectedRowIndex = -1;

    let SearchData = {
      type: _type,
      rowtype: this.type,
      searchstring: this.searchstring.toUpperCase(),
      sortby: '',
      from_date: this.gs.globalData.cost_sea_fromdate,
      to_date: this.gs.globalData.cost_sea_todate,
      company_code: this.gs.globalVariables.comp_code,
      branch_code: this.gs.globalVariables.branch_code,
      page_count: this.page_count,
      page_current: this.page_current,
      page_rows: this.page_rows,
      page_rowcount: this.page_rowcount
    };

    this.InfoMessage = '';
    this.ErrorMessage = '';
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


  Process() {

    this.loading = true;

    let SearchData = {
      pkid: this.pkid,
      company_code: this.gs.globalVariables.comp_code,
      branch_code: this.gs.globalVariables.branch_code,
    };
    this.InfoMessage = '';
    this.ErrorMessage = '';
    this.mainService.Process(SearchData)
      .subscribe(response => {
        this.loading = false;
        this.Record.cost_buy_pp = response.buy_pp;
        this.Record.cost_buy_cc = response.buy_cc;
        this.Record.cost_sell_pp = response.sell_pp;
        this.Record.cost_sell_cc = response.sell_cc;

        this.Record.cost_rebate = response.rebate;
        this.Record.cost_ex_works = response.exwork;
        this.Record.cost_book_cntr = response.bookcntr;

        this.FindTotal();

      },
      error => {
        this.loading = false;
        this.ErrorMessage = this.gs.getError(error);
        alert(this.ErrorMessage);
      });
  }





  NewRecord() {


    this.lock_record = false;
    this.lock_date = false;


    this.pkid = this.gs.getGuid();
    this.Record = new Costingm();
    this.Record.cost_pkid = this.pkid;
    this.Record.cost_refno = "";
    this.Record.cost_folderno = "";
    this.Record.cost_mblid = "";
    this.Record.cost_sob_date = "";
    this.Record.cost_agent_id = "";
    this.Record.cost_date = this.gs.defaultValues.today;
    this.Record.cost_folder_recdon = "";
    this.Record.cost_currency_id = "";
    this.Record.cost_currency_code = "";
    this.Record.cost_format = "";
    this.Record.cost_exrate = 0;
    this.Record.cost_rebate = 0;
    this.Record.cost_ex_works = 0;
    this.Record.cost_dest_charges = 0;
    this.Record.cost_hand_charges = 0;
    this.Record.cost_kamai = 0;
    this.Record.cost_dramt = 0;
    this.Record.cost_cramt = 0;
    this.Record.cost_dramt_fc = 0;
    this.Record.cost_cramt_fc = 0;
    this.Record.cost_buy_pp = 0;
    this.Record.cost_buy_cc = 0;
    this.Record.cost_sell_pp = 0;
    this.Record.cost_sell_cc = 0;
    this.Record.cost_buy_tot = 0;
    this.Record.cost_sell_tot = 0;
    this.Record.cost_other_charges = 0;
    this.Record.cost_asper_amount = 0;
    this.Record.cost_profit = 0;
    this.Record.cost_expense = 0;
    this.Record.cost_income = 0;
    this.Record.cost_our_profit = 0;
    this.Record.cost_your_profit = 0;
    this.Record.cost_drcr_amount = 0;

    this.Record.cost_jv_agent_id = "";
    this.Record.cost_jv_agent_code = "";
    this.Record.cost_jv_agent_name = "";
    this.Record.cost_jv_agent_br_id = "";
    this.Record.cost_jv_agent_br_no = "";
    this.Record.cost_jv_agent_br_addr = "";

    this.Record.cost_type = 'SEA';
    this.Record.cost_source = 'SEA EXPORT COSTING';
    this.Record.cost_book_cntr = '';
    this.Record.rec_mode = this.mode;

    this.Record.cost_jv_posted = false;
    //this.InitDetList();
    this.InitLov();
  }
  //InitDetList() {
  //  this.RecordDetList = new Array<Costingd>();
  //  this.NewDetRecord(1);
  //  this.RecordDetList.push(this.RecordDet);
  //  this.NewDetRecord(2);
  //  this.RecordDetList.push(this.RecordDet);
  //  this.NewDetRecord(3);
  //  this.RecordDetList.push(this.RecordDet);
  //  this.NewDetRecord(4);
  //  this.RecordDetList.push(this.RecordDet);
  //  this.NewDetRecord(5);
  //  this.RecordDetList.push(this.RecordDet);
  //  this.NewDetRecord(6);
  //  this.RecordDetList.push(this.RecordDet);
  //  this.NewDetRecord(7);
  //  this.RecordDetList.push(this.RecordDet);
  //}
  //NewDetRecord(iCtr: number) {
  //  this.RecordDet = new Costingd();
  //  this.RecordDet.costd_pkid = this.gs.getGuid();
  //  this.RecordDet.costd_parent_id = this.pkid;
  //  this.RecordDet.costd_acc_id = "";
  //  this.RecordDet.costd_acc_name = "";
  //  this.RecordDet.costd_acc_amt = 0;
  //  this.RecordDet.costd_ctr = iCtr;
  //}
  // Load a single Record for VIEW/EDIT
  GetRecord(Id: string) {
    this.loading = true;

    let SearchData = {
      pkid: Id,
    };
    this.InfoMessage = '';
    this.ErrorMessage = '';
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

  LoadData(_Record: Costingm) {
    this.Record = _Record;
    //this.InitDetList();
    //for (let rec of _Record.DetailList) {
    //  this.RecordDetList[rec.costd_ctr - 1].costd_pkid = rec.costd_pkid;
    //  this.RecordDetList[rec.costd_ctr - 1].costd_parent_id = rec.costd_parent_id;
    //  this.RecordDetList[rec.costd_ctr - 1].costd_acc_id = rec.costd_acc_id;
    //  this.RecordDetList[rec.costd_ctr - 1].costd_acc_name = rec.costd_acc_name;
    //  this.RecordDetList[rec.costd_ctr - 1].costd_acc_amt = rec.costd_acc_amt;
    //  this.RecordDetList[rec.costd_ctr - 1].costd_ctr = rec.costd_ctr;
    //}

    this.FindInvoiceTotal();
    this.InitLov();
    this.CURRECORD.code = this.Record.cost_currency_code;
    this.AGENTRECORD.id = this.Record.cost_jv_agent_id;
    this.AGENTRECORD.code = this.Record.cost_jv_agent_code;
    this.AGENTRECORD.name = this.Record.cost_jv_agent_name;
    this.AGENTADDRECORD.id = this.Record.cost_jv_agent_br_id;
    this.AGENTADDRECORD.code = this.Record.cost_jv_agent_br_no;
    this.AGENTADDRECORD.parentid = this.Record.cost_jv_agent_id;

    this.lock_record = true;
    this.lock_date = true;

    if (this.Record.cost_edit_code.indexOf("{S}") >= 0)
      this.lock_record = false;
    if (this.Record.cost_edit_code.indexOf("{D}") >= 0)
      this.lock_date = false;

    this.Record.rec_mode = this.mode;

    if (this.Record.cost_jv_posted)
      this.ErrorMessage = "Cannot Edit, Already Posted/Allocated";

  }


  // Save Data
  Save() {
    if (!this.allvalid())
      return;

    this.FindTotal();

    this.loading = true;
    this.InfoMessage = '';
    this.ErrorMessage = '';
    this.Record.rec_category = this.type;
    this.Record._globalvariables = this.gs.globalVariables;
    //this.Record.DetailList = this.RecordDetList;
    this.mainService.Save(this.Record)
      .subscribe(response => {
        this.loading = false;
        if (this.mode == 'ADD') {
          this.Record.cost_refno = response.docno;
        }
        this.InfoMessage = "Save Complete";
        this.mode = 'EDIT';
        this.Record.rec_mode = this.mode;
        this.RefreshList();
           //  alert(this.InfoMessage);
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

    if (this.Record.cost_jv_posted) {
      bret = false;
      sError += "| Already Posted / Allocated";
    }

    if (this.Record.cost_folderno.trim().length <= 0) {
      bret = false;
      sError += "| Folder# Cannot Be Blank";
    }

    if (this.Record.cost_date.trim().length <= 0) {
      bret = false;
      sError += "| Date Cannot Be Blank";
    }

    if (this.mode == "EDIT") {

      if (this.Record.cost_currency_code == '' || this.Record.cost_currency_id == '') {
        bret = false;
        sError += "| Currency Cannot Be Blank";
      }

      if (this.Record.cost_exrate <= 0) {
        bret = false;
        sError += "| Invalid Exchange Rate";
      }

      let _num: number = 0;
      for (let rec of this.Record.DetailList) {
        _num += rec.costd_acc_amt;
      }
      if (_num != 0) {
        _num = this.gs.roundNumber(_num, 2);
        if (_num != this.Record.cost_drcr_amount) {
          bret = false;
          sError += "| DrCr Amount Mismatch with Details Amount";
        }
      }

    }

    if (bret === false)
      this.ErrorMessage = sError;
    return bret;
  }

  RefreshList() {

    if (this.RecordList == null)
      return;
    var REC = this.RecordList.find(rec => rec.cost_pkid == this.Record.cost_pkid);
    if (REC == null) {
      this.RecordList.push(this.Record);
    }
    else {
      REC.cost_folderno = this.Record.cost_folderno;
      REC.cost_refno = this.Record.cost_refno;
    }
  }

  OnBlur(field: string) {
    switch (field) {
      case 'cost_folderno':
        {
          this.Record.cost_folderno = this.Record.cost_folderno.toUpperCase();
          this.SearchRecord('cost_folderno');
          break;
        }
      case 'cost_buy_pp':
        {
          this.Record.cost_buy_pp = this.gs.roundNumber(this.Record.cost_buy_pp, 2);
          this.FindTotal();
          break;
        }
      case 'cost_buy_cc':
        {
          this.Record.cost_buy_cc = this.gs.roundNumber(this.Record.cost_buy_cc, 2);
          this.FindTotal();
          break;
        }
      case 'cost_sell_pp':
        {
          this.Record.cost_sell_pp = this.gs.roundNumber(this.Record.cost_sell_pp, 2);
          this.FindTotal();
          break;
        }
      case 'cost_sell_cc':
        {
          this.Record.cost_sell_cc = this.gs.roundNumber(this.Record.cost_sell_cc, 2);
          this.FindTotal();
          break;
        }
      case 'cost_kamai':
        {
          this.Record.cost_kamai = this.gs.roundNumber(this.Record.cost_kamai, 2);
          this.FindTotal();
          break;
        }
      case 'cost_rebate':
        {
          this.Record.cost_rebate = this.gs.roundNumber(this.Record.cost_rebate, 2);
          this.FindTotal();
          break;
        }
      case 'cost_ex_works':
        {
          this.Record.cost_ex_works = this.gs.roundNumber(this.Record.cost_ex_works, 2);
          this.FindTotal();
          break;
        }
      case 'cost_hand_charges':
        {
          this.Record.cost_hand_charges = this.gs.roundNumber(this.Record.cost_hand_charges, 2);
          this.FindTotal();
          break;
        }
      case 'cost_dest_charges':
        {
          this.Record.cost_dest_charges = this.gs.roundNumber(this.Record.cost_dest_charges, 2);
          this.FindTotal();
          break;
        }
      case 'cost_other_charges':
        {
          this.Record.cost_other_charges = this.gs.roundNumber(this.Record.cost_other_charges, 2);
          this.FindTotal();
          break;
        }
      case 'cost_asper_amount':
        {
          this.Record.cost_asper_amount = this.gs.roundNumber(this.Record.cost_asper_amount, 2);
          this.FindTotal();
          break;
        }
      case 'cost_exrate':
        {
          this.Record.cost_exrate = this.gs.roundNumber(this.Record.cost_exrate, 2);
          break;
        }
    }
  }
  OnChange(field: string) {
    switch (field) {

    }
  }
  OnBlurTableCell(field: string, fieldid: string) {
    var REC = this.RecordDetList.find(rec => rec.costd_pkid == fieldid);
    if (REC != null) {
      if (field == "costd_acc_name")
        REC.costd_acc_name = REC.costd_acc_name.toUpperCase();
      if (field == "costd_acc_amt") {
        REC.costd_acc_amt = this.gs.roundNumber(REC.costd_acc_amt, 2);
        this.FindInvoiceTotal();
      }
    }
  }
  SearchRecord(controlname: string, controlid: string = "") {
    this.InfoMessage = '';
    this.ErrorMessage = '';
    this.Record.cost_mblid = '';
    this.Record.cost_mblno = '';
    this.Record.cost_agent_id = '';
    this.Record.cost_agent_name = '';
    this.Record.cost_sob_date = '';
    this.Record.cost_folder_recdon = '';
    if (controlname == 'cost_folderno') {
      if (this.Record.cost_folderno.trim().length <= 0)
        return;
    }

    this.loading = true;
    let SearchData = {
      rowtype: this.type,
      table: 'costing',
      company_code: this.gs.globalVariables.comp_code,
      branch_code: this.gs.globalVariables.branch_code,
      year_code: this.gs.globalVariables.year_code,
      folder_no: '',
      pkid: controlid
    };
    if (controlname == 'cost_folderno') {
      SearchData.rowtype = 'SEA EXPORT';
      SearchData.table = 'costing';
      SearchData.company_code = this.gs.globalVariables.comp_code;
      SearchData.branch_code = this.gs.globalVariables.branch_code;
      SearchData.year_code = this.gs.globalVariables.year_code;
      SearchData.folder_no = this.Record.cost_folderno;
    }
    if (controlname == 'releasecosting') {
      SearchData.table = 'releasecosting';
      SearchData.pkid = controlid;
    }

    this.gs.SearchRecord(SearchData)
      .subscribe(response => {
        this.loading = false;
        this.InfoMessage = '';
        this.ErrorMessage = '';
        if (controlname == 'cost_folderno') {
          if (response.costing.length > 0) {
            this.Record.cost_mblid = response.costing[0].cost_mblid;
            this.Record.cost_mblno = response.costing[0].cost_mblno;
            this.Record.cost_agent_id = response.costing[0].cost_agent_id;
            this.Record.cost_agent_name = response.costing[0].cost_agent_name;
            this.Record.cost_agent_code = response.costing[0].cost_agent_code;
            this.Record.cost_sob_date = response.costing[0].cost_sob_date;
            this.Record.cost_folder_recdon = response.costing[0].cost_folder_recdon;
            this.Record.cost_book_cntr = response.costing[0].cost_book_cntr;
            this.Record.cost_agent_br_id = response.costing[0].cost_agent_br_id;
            this.Record.cost_agent_br_no = response.costing[0].cost_agent_br_no;
            this.Record.cost_agent_br_addr = response.costing[0].cost_agent_br_addr;

            this.Record.cost_date = this.Record.cost_sob_date;
            this.Record.cost_jv_agent_id = this.Record.cost_agent_id;
            this.Record.cost_jv_agent_code = this.Record.cost_agent_code;
            this.Record.cost_jv_agent_name = this.Record.cost_agent_name;
            this.Record.cost_jv_agent_br_id = this.Record.cost_agent_br_id;
            this.Record.cost_jv_agent_br_no = this.Record.cost_agent_br_no;
            this.Record.cost_jv_agent_br_addr = this.Record.cost_agent_br_addr;
            this.InitLov('AGENT');
            this.AGENTRECORD.id = this.Record.cost_jv_agent_id;
            this.AGENTRECORD.code = this.Record.cost_jv_agent_code;
            this.AGENTRECORD.name = this.Record.cost_jv_agent_name;
            this.InitLov('AGENTADDRESS');
            this.AGENTADDRECORD.id = this.Record.cost_jv_agent_br_id;
            this.AGENTADDRECORD.code = this.Record.cost_jv_agent_br_no;
            this.AGENTADDRECORD.parentid = this.Record.cost_jv_agent_id;
          }
          else {
            this.Record.cost_folderno = '';
            this.ErrorMessage = 'Invalid Folder';
          }
        }

        if (controlname == 'releasecosting') {
          var REC = this.RecordList.find(rec => rec.cost_pkid == controlid)
          if (REC != null) {
            REC.cost_jv_posted = false;
          }
          this.InfoMessage = "Successfully Released";
        }
      },
      error => {
        this.loading = false;
        this.ErrorMessage = this.gs.getError(error);
      });
  }

  Close() {
    this.gs.ClosePage('home');
  }

  FindTotal() {

    let expense = 0;
    let income = 0;
    let profit = 0;
    let actualprofit = 0;
    let drcramt = 0;
    this.Record.cost_expense = 0;
    this.Record.cost_income = 0;
    this.Record.cost_profit = 0;
    this.Record.cost_our_profit = 0;
    this.Record.cost_your_profit = 0;
    this.Record.cost_drcr_amount = 0;


    this.Record.cost_buy_tot = this.Record.cost_buy_pp + this.Record.cost_buy_cc;
    this.Record.cost_buy_tot = this.gs.roundNumber(this.Record.cost_buy_tot, 2);

    this.Record.cost_sell_tot = this.Record.cost_sell_pp + this.Record.cost_sell_cc;
    this.Record.cost_sell_tot = this.gs.roundNumber(this.Record.cost_sell_tot, 2);

    if (this.Record.cost_asper_amount != 0)
      this.Record.cost_drcr_amount = this.Record.cost_asper_amount;
    else if (this.Record.cost_hand_charges != 0) {
      this.Record.cost_profit = this.Record.cost_hand_charges;
      this.Record.cost_our_profit = 0;
      this.Record.cost_your_profit = 0;
      if (this.Record.cost_profit > 0)
        this.Record.cost_our_profit = this.Record.cost_hand_charges;
      else
        this.Record.cost_your_profit = Math.abs(this.Record.cost_hand_charges);


      this.Record.cost_drcr_amount = this.Record.cost_profit;
      this.Record.cost_drcr_amount += this.Record.cost_buy_pp;
      this.Record.cost_drcr_amount += this.Record.cost_ex_works;
      this.Record.cost_drcr_amount += this.Record.cost_other_charges;
      this.Record.cost_drcr_amount = this.gs.roundNumber(this.Record.cost_drcr_amount, 2);
    }
    else {

      expense = this.Record.cost_buy_tot;
      expense += this.Record.cost_rebate;
      expense += this.Record.cost_other_charges;
      expense = this.gs.roundNumber(expense, 2);

      income = this.Record.cost_sell_tot;
      income -= this.Record.cost_kamai;
      income = this.gs.roundNumber(income, 2);

      actualprofit = income - expense;
      actualprofit = this.gs.roundNumber(actualprofit, 2);

      profit = actualprofit / 2;
      profit = this.gs.roundNumber(profit, 2);

      this.Record.cost_expense = expense;
      this.Record.cost_income = income;
      this.Record.cost_profit = actualprofit;
      this.Record.cost_our_profit = profit;
      this.Record.cost_your_profit = profit;

      drcramt = profit;

      if (this.Record.cost_buy_pp > 0 ) {
        drcramt += this.Record.cost_buy_pp;
      }
      if ((this.Record.cost_sell_pp - this.Record.cost_kamai) > 0) {
        drcramt -= (this.Record.cost_sell_pp - this.Record.cost_kamai);
      }

      drcramt += this.Record.cost_rebate;
      drcramt += this.Record.cost_ex_works;
      drcramt += this.Record.cost_other_charges;

      this.Record.cost_drcr_amount = this.gs.roundNumber(drcramt, 2);

      // this.Record.cost_drcr_amount = this.Record.cost_profit;

    }
  }

  folder_id: string;
  
  PrintNote(_type: string) {
    this.folder_id = this.gs.getGuid();
    this.loading = true;
    let SearchData = {
      type: _type,
      pkid: this.pkid,
      report_folder: '',
      folderid: '',
      branch_code: '',
      report_caption: '',
      parentid: '',
      comp_code: '',
      incometype: ''
    };
    SearchData.type = _type;
    SearchData.pkid = this.pkid;
    SearchData.report_folder = this.gs.globalVariables.report_folder;
    SearchData.branch_code = this.gs.globalVariables.branch_code;
    SearchData.folderid = this.folder_id;
    SearchData.comp_code = this.gs.globalVariables.comp_code;

    this.InfoMessage = '';
    this.ErrorMessage = '';
    this.mainService.PrintNote(SearchData)
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

  open(content: any) {
    this.modal = this.modalService.open(content);
  }

  ShowCostSent(costsent: any, id: string,_refno:string) {
    this.InfoMessage = '';
    this.ErrorMessage = '';
    this.pkid = id;
    this.refno = _refno;
    this.open(costsent);
  }

  ModifiedRecords(params: any) {
    //var REC = this.RecordList.find(rec => rec.cost_pkid == params.sid);
    //if (REC != null) {
    //  if (params.saction == "SENT-ON")
    //    REC.cost_sent_on = params.sdate;
    //  if (params.saction == "CHECKED-ON")
    //    REC.cost_checked_on = params.sdate;
    //}

    for (let rec of this.RecordList.filter(rec => rec.cost_pkid == params.sid)) {
      if (params.saction == "SENT-ON")
        rec.cost_sent_on = params.sdate;
      if (params.saction == "CHECKED-ON")
        rec.cost_checked_on = params.sdate;
    }

    this.modal.close();
  }

  RemoveList(event: any) {
    if (event.selected) {
      this.RemoveRecord(event.id);
    }
  }

  RemoveRecord(Id: string) {
    this.loading = true;
    let SearchData = {
      rowtype: this.type,
      pkid: Id,
      comp_code: this.gs.globalVariables.comp_code,
      branch_code: this.gs.globalVariables.branch_code,
      user_code: this.gs.globalVariables.user_code,
    };

    this.ErrorMessage = '';
    this.InfoMessage = '';
    this.mainService.DeleteRecord(SearchData)
      .subscribe(response => {
        this.loading = false;
        this.InfoMessage = "Deleted Successfully";
        this.RecordList.splice(this.RecordList.findIndex(rec => rec.cost_pkid == Id), 1);
      },
      error => {
        this.loading = false;
        this.ErrorMessage = this.gs.getError(error);
        alert(this.ErrorMessage);
      });
  }

  ReleaseCosting(id: string, _refno: string) {
    let strmsg: string = "";
    strmsg = "RELEASE COSTING \n\n REF# : " + _refno;
    if (confirm(strmsg)) {
      this.SearchRecord('releasecosting', id);
    }
  }

  GenerateXml() {
    this.ErrorMessage = '';
    this.InfoMessage = '';
    if (this.pkid.trim().length <= 0) {
      this.ErrorMessage = "\n\r | Invalid ID";
      return;
    }
     
    this.loading = true;
    this.ErrorMessage = '';
    let SearchData = {
      report_folder: this.gs.globalVariables.report_folder,
      company_code: this.gs.globalVariables.comp_code,
      branch_code: this.gs.globalVariables.branch_code,
      cost_pkid: this.pkid
    };

    SearchData.report_folder = this.gs.globalVariables.report_folder;
    SearchData.company_code = this.gs.globalVariables.comp_code;
    SearchData.branch_code = this.gs.globalVariables.branch_code;
    SearchData.cost_pkid = this.pkid;

    this.mainService.GenerateXmlCostingInvoice(SearchData)
      .subscribe(response => {
        this.loading = false;
        this.InfoMessage = response.savemsg;
      },
      error => {
        this.loading = false;
        this.ErrorMessage = this.gs.getError(error);
      });
  }

  FindInvoiceTotal() {
    this.tot_acc_amt = 0;
    for (let rec of this.Record.DetailList) {
      this.tot_acc_amt += rec.costd_acc_amt;
    }
    this.tot_acc_amt = this.gs.roundNumber(this.tot_acc_amt, 2);
  }
}
