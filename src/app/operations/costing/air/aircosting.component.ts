import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

import { ActivatedRoute } from '@angular/router';

import { GlobalService } from '../../../core/services/global.service';

import { Costingm } from '../../models/costing';
import { Costingd } from '../../models/costing';
import { AirCostingService } from '../../services/aircosting.service';
import { SearchTable } from '../../../shared/models/searchtable';
import { FileDetails } from '../../models/filedetails';

@Component({
  selector: 'app-aircosting',
  templateUrl: './aircosting.component.html',
  providers: [AirCostingService]
})
export class AirCostingComponent {
  // Local Variables 
  title = 'Air Costing';

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

  printfcbank: boolean = false;
  lock_record: boolean = false;
  lock_date: boolean = false;
  bAdmin = false;

  sSubject: string = '';
  ftpUpdtSql: string = '';
  ftpTransfertype: string = 'AIR EXPORT COSTING';
  FtpAttachList: any[] = [];
  FileList: FileDetails[] = [];
  ftp_agent_name: string = "";
  ftp_agent_code: string = "";

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
  // RecordDetList2: Costingd[] = [];

  // Single Record for add/edit/view details
  Record: Costingm = new Costingm;
  RecordDet: Costingd = new Costingd;

  constructor(
    private modalService: NgbModal,
    private mainService: AirCostingService,
    private route: ActivatedRoute,
    private gs: GlobalService
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
      from_date: this.gs.globalData.cost_air_fromdate,
      to_date: this.gs.globalData.cost_air_todate,
      company_code: this.gs.globalVariables.comp_code,
      branch_code: this.gs.globalVariables.branch_code,
      year_code: this.gs.globalVariables.year_code,
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
        });
  }


  Process() {

    this.loading = true;

    let SearchData = {
      pkid: this.pkid,
      informrate: this.Record.cost_inform_rate,
      company_code: this.gs.globalVariables.comp_code,
      branch_code: this.gs.globalVariables.branch_code,
    };

    this.ErrorMessage = '';
    this.InfoMessage = '';
    this.mainService.Process(SearchData)
      .subscribe(response => {
        this.loading = false;
        this.RecordDetList = response.list;
        this.Record.cost_rebate = response.rebate;
        this.Record.cost_ex_works = response.exwork;
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
    this.Record.cost_inform_rate = 0;
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
    this.Record.cost_sell_chwt = 0;

    this.Record.cost_jv_agent_id = "";
    this.Record.cost_jv_agent_code = "";
    this.Record.cost_jv_agent_name = "";
    this.Record.cost_jv_agent_br_id = "";
    this.Record.cost_jv_agent_br_no = "";
    this.Record.cost_jv_agent_br_addr = "";
    this.Record.cost_jv_br_inv_id = '';

    this.Record.cost_type = 'AIR';
    this.Record.cost_source = 'AIR EXPORT COSTING';
    this.Record.cost_book_cntr = '';
    this.Record.rec_mode = this.mode;
    this.InitLov();
    // this.InitDetList();
    this.RecordDetList = new Array<Costingd>();
  }
  //InitDetList() {
  //  this.RecordDetList2 = new Array<Costingd>();
  //  this.NewDetRecord(1);
  //  this.RecordDetList2.push(this.RecordDet);
  //  this.NewDetRecord(2);
  //  this.RecordDetList2.push(this.RecordDet);
  //  this.NewDetRecord(3);
  //  this.RecordDetList2.push(this.RecordDet);
  //  this.NewDetRecord(4);
  //  this.RecordDetList2.push(this.RecordDet);
  //  this.NewDetRecord(5);
  //  this.RecordDetList2.push(this.RecordDet);
  //  this.NewDetRecord(6);
  //  this.RecordDetList2.push(this.RecordDet);
  //  this.NewDetRecord(7);
  //  this.RecordDetList2.push(this.RecordDet);
  //}
  //NewDetRecord(iCtr: number) {
  //  this.RecordDet = new Costingd();
  //  this.RecordDet.costd_pkid = this.gs.getGuid();
  //  this.RecordDet.costd_parent_id = this.pkid;
  //  this.RecordDet.costd_acc_id = "";
  //  this.RecordDet.costd_acc_name = "";
  //  this.RecordDet.costd_acc_amt = 0;
  //  this.RecordDet.costd_ctr = iCtr;
  //  this.RecordDet.costd_category = "INVOICE";
  //}
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

  LoadData(_Record: Costingm) {
    this.Record = _Record;
    this.RecordDetList = _Record.DetailList2;
    //this.InitDetList();
    //for (let rec of _Record.DetailList2) {
    //  this.RecordDetList2[rec.costd_ctr - 1].costd_pkid = rec.costd_pkid;
    //  this.RecordDetList2[rec.costd_ctr - 1].costd_parent_id = rec.costd_parent_id;
    //  this.RecordDetList2[rec.costd_ctr - 1].costd_acc_id = rec.costd_acc_id;
    //  this.RecordDetList2[rec.costd_ctr - 1].costd_acc_name = rec.costd_acc_name;
    //  this.RecordDetList2[rec.costd_ctr - 1].costd_acc_amt = rec.costd_acc_amt;
    //  this.RecordDetList2[rec.costd_ctr - 1].costd_ctr = rec.costd_ctr;
    //  this.RecordDetList2[rec.costd_ctr - 1].costd_category = rec.costd_category;
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
  }


  // Save Data
  Save() {
    if (!this.allvalid())
      return;

    this.FindTotal();

    this.loading = true;
    this.ErrorMessage = '';
    this.InfoMessage = '';
    this.Record.rec_category = this.type;
    this.Record._globalvariables = this.gs.globalVariables;
    this.Record.DetailList2 = this.RecordDetList;

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
        // alert(this.InfoMessage);
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
    if (this.Record.cost_folderno.trim().length <= 0) {
      bret = false;
      sError += "| MAWB Cannot Be Blank";
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

      if (this.Record.cost_drcr_amount == 0) {
        bret = false;
        sError += "| Invalid Amount";
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

    if (bret === false) {
      this.ErrorMessage = sError;
      alert(this.ErrorMessage);
    }
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
      case 'cost_exrate':
        {
          this.Record.cost_exrate = this.gs.roundNumber(this.Record.cost_exrate, 5);
          break;
        }
      case 'cost_buy_pp':
        {
          this.Record.cost_buy_pp = this.gs.roundNumber(this.Record.cost_buy_pp, 2);
          // this.FindTotal();
          break;
        }
      case 'cost_buy_cc':
        {
          this.Record.cost_buy_cc = this.gs.roundNumber(this.Record.cost_buy_cc, 2);
          // this.FindTotal();
          break;
        }
      case 'cost_sell_pp':
        {
          this.Record.cost_sell_pp = this.gs.roundNumber(this.Record.cost_sell_pp, 2);
          //   this.FindTotal();
          break;
        }
      case 'cost_sell_cc':
        {
          this.Record.cost_sell_cc = this.gs.roundNumber(this.Record.cost_sell_cc, 2);
          //  this.FindTotal();
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
      case 'cost_inform_rate':
        {
          this.Record.cost_inform_rate = this.gs.roundNumber(this.Record.cost_inform_rate, 2);
          this.FindTotal();
          break;
        }
      case 'cost_hand_charges':
        {
          this.Record.cost_hand_charges = this.gs.roundNumber(this.Record.cost_hand_charges, 2);
          this.FindTotal();
          break;
        }
      case 'cost_other_charges':
        {
          this.Record.cost_other_charges = this.gs.roundNumber(this.Record.cost_other_charges, 2);
          this.FindTotal();
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
      if (field == "costd_frt_pp") {
        REC.costd_frt_pp = this.gs.roundNumber(REC.costd_frt_pp, 2);
        this.FindTotal();
      }
      if (field == "costd_frt_cc") {
        REC.costd_frt_cc = this.gs.roundNumber(REC.costd_frt_cc, 2);
        this.FindTotal();
      }
      if (field == "costd_wrs_pp") {
        REC.costd_wrs_pp = this.gs.roundNumber(REC.costd_wrs_pp, 2);
        this.FindTotal();
      }
      if (field == "costd_wrs_cc") {
        REC.costd_wrs_cc = this.gs.roundNumber(REC.costd_wrs_cc, 2);
        this.FindTotal();
      }
      if (field == "costd_myc_pp") {
        REC.costd_myc_pp = this.gs.roundNumber(REC.costd_myc_pp, 2);
        this.FindTotal();
      }
      if (field == "costd_myc_cc") {
        REC.costd_myc_cc = this.gs.roundNumber(REC.costd_myc_cc, 2);
        this.FindTotal();
      }
      if (field == "costd_mcc_pp") {
        REC.costd_mcc_pp = this.gs.roundNumber(REC.costd_mcc_pp, 2);
        this.FindTotal();
      }
      if (field == "costd_mcc_cc") {
        REC.costd_mcc_cc = this.gs.roundNumber(REC.costd_mcc_cc, 2);
        this.FindTotal();
      }
      if (field == "costd_src_pp") {
        REC.costd_src_pp = this.gs.roundNumber(REC.costd_src_pp, 2);
        this.FindTotal();
      }
      if (field == "costd_src_cc") {
        REC.costd_src_cc = this.gs.roundNumber(REC.costd_src_cc, 2);
        this.FindTotal();
      }
      if (field == "costd_oth_pp") {
        REC.costd_oth_pp = this.gs.roundNumber(REC.costd_oth_pp, 2);
        this.FindTotal();
      }
      if (field == "costd_oth_cc") {
        REC.costd_oth_cc = this.gs.roundNumber(REC.costd_oth_cc, 2);
        this.FindTotal();
      }
    }
  }
  OnBlurTableCell2(field: string, fieldid: string) {
    //var REC = this.RecordDetList2.find(rec => rec.costd_pkid == fieldid);
    //if (REC != null) {
    //  if (field == "costd_acc_name")
    //    REC.costd_acc_name = REC.costd_acc_name.toUpperCase();
    //  if (field == "costd_acc_amt") {
    //    REC.costd_acc_amt = this.gs.roundNumber(REC.costd_acc_amt, 2);
    //    this.FindInvoiceTotal();
    //  }
    //}
  }
  SearchRecord(controlname: string, controlid: string = "") {
    this.ErrorMessage = '';
    this.InfoMessage = '';
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
      table: 'aircosting',
      company_code: this.gs.globalVariables.comp_code,
      branch_code: this.gs.globalVariables.branch_code,
      year_code: this.gs.globalVariables.year_code,
      awb_no: '',
      pkid: controlid
    };
    if (controlname == 'cost_folderno') {
      SearchData.rowtype = 'AIR EXPORT';
      SearchData.table = 'aircosting';
      SearchData.company_code = this.gs.globalVariables.comp_code;
      SearchData.branch_code = this.gs.globalVariables.branch_code;
      SearchData.year_code = this.gs.globalVariables.year_code;
      SearchData.awb_no = this.Record.cost_folderno;
    }
    if (controlname == 'releasecosting') {
      SearchData.table = 'releasecosting';
      SearchData.pkid = controlid;
    }
    this.gs.SearchRecord(SearchData)
      .subscribe(response => {
        this.loading = false;
        this.ErrorMessage = '';
        this.InfoMessage = '';
        if (controlname == 'cost_folderno') {
          if (response.aircosting.length > 0) {
            this.Record.cost_mblid = response.aircosting[0].cost_mblid;
            this.Record.cost_agent_id = response.aircosting[0].cost_agent_id;
            this.Record.cost_agent_name = response.aircosting[0].cost_agent_name;
            this.Record.cost_agent_code = response.aircosting[0].cost_agent_code;
            this.Record.cost_sob_date = response.aircosting[0].cost_sob_date;
            this.Record.cost_folder_recdon = response.aircosting[0].cost_folder_recdon;
            this.Record.cost_agent_br_id = response.aircosting[0].cost_agent_br_id;
            this.Record.cost_agent_br_no = response.aircosting[0].cost_agent_br_no;
            this.Record.cost_agent_br_addr = response.aircosting[0].cost_agent_br_addr;
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
            this.ErrorMessage = 'Invalid AWB No';
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
    this.Record.cost_buy_pp = 0;
    this.Record.cost_buy_cc = 0;
    this.Record.cost_sell_pp = 0;
    this.Record.cost_sell_cc = 0;
    this.Record.cost_sell_chwt = 0;
    this.Record.cost_format = "";

    for (let rec of this.RecordDetList) {
      if (rec.costd_type == "BUY") {

        rec.costd_pp = rec.costd_frt_pp;
        rec.costd_pp += rec.costd_wrs_pp;
        rec.costd_pp += rec.costd_myc_pp;
        rec.costd_pp += rec.costd_mcc_pp;
        rec.costd_pp += rec.costd_src_pp;
        rec.costd_pp += rec.costd_oth_pp;
        this.Record.cost_buy_pp += rec.costd_pp;

        rec.costd_cc = rec.costd_frt_cc;
        rec.costd_cc += rec.costd_wrs_cc;
        rec.costd_cc += rec.costd_myc_cc;
        rec.costd_cc += rec.costd_mcc_cc;
        rec.costd_cc += rec.costd_src_cc;
        rec.costd_cc += rec.costd_oth_cc;
        this.Record.cost_buy_cc += rec.costd_cc;

        rec.costd_tot = rec.costd_pp + rec.costd_cc;
      }
      if (rec.costd_type == "SELL") {

        this.Record.cost_sell_chwt += rec.costd_chwt;

        rec.costd_pp = rec.costd_frt_pp;
        rec.costd_pp += rec.costd_wrs_pp;
        rec.costd_pp += rec.costd_myc_pp;
        rec.costd_pp += rec.costd_mcc_pp;
        rec.costd_pp += rec.costd_src_pp;
        rec.costd_pp += rec.costd_oth_pp;
        this.Record.cost_sell_pp += rec.costd_pp;

        rec.costd_cc = rec.costd_frt_cc;
        rec.costd_cc += rec.costd_wrs_cc;
        rec.costd_cc += rec.costd_myc_cc;
        rec.costd_cc += rec.costd_mcc_cc;
        rec.costd_cc += rec.costd_src_cc;
        rec.costd_cc += rec.costd_oth_cc;
        this.Record.cost_sell_cc += rec.costd_cc;

        rec.costd_tot = rec.costd_pp + rec.costd_cc;
      }
    }

    this.Record.cost_buy_pp = this.gs.roundNumber(this.Record.cost_buy_pp, 2);
    this.Record.cost_buy_cc = this.gs.roundNumber(this.Record.cost_buy_cc, 2);
    this.Record.cost_sell_pp = this.gs.roundNumber(this.Record.cost_sell_pp, 2);
    this.Record.cost_sell_cc = this.gs.roundNumber(this.Record.cost_sell_cc, 2);

    this.Record.cost_buy_tot = this.Record.cost_buy_pp + this.Record.cost_buy_cc;
    this.Record.cost_buy_tot = this.gs.roundNumber(this.Record.cost_buy_tot, 2);

    this.Record.cost_sell_tot = this.Record.cost_sell_pp + this.Record.cost_sell_cc;
    this.Record.cost_sell_tot = this.gs.roundNumber(this.Record.cost_sell_tot, 2);



    if (this.Record.cost_hand_charges != 0) {
      this.Record.cost_format = "HANDLING";
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
    else if (this.Record.cost_buy_pp != 0 && this.Record.cost_sell_pp != 0 && this.Record.cost_sell_cc == 0) {
      this.Record.cost_format = "PP";

      expense = this.Record.cost_buy_tot;
      expense += this.Record.cost_rebate;
      expense += this.Record.cost_other_charges;
      expense = this.gs.roundNumber(expense, 2);

      income = this.Record.cost_sell_tot;
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


      this.Record.cost_drcr_amount = profit * -1;
      this.Record.cost_drcr_amount = this.gs.roundNumber(this.Record.cost_drcr_amount, 2);
    }
    else {
      this.Record.cost_format = "PC";

      expense = this.Record.cost_buy_tot;
      expense += this.Record.cost_rebate;
      expense += this.Record.cost_other_charges;
      expense = this.gs.roundNumber(expense, 2);

      income = this.Record.cost_sell_tot;
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


      //drcramt = this.Record.cost_sell_cc - profit;
      //drcramt += this.Record.cost_buy_pp ;
      //drcramt -= this.Record.cost_sell_pp;

      drcramt = profit;
      drcramt += this.Record.cost_buy_pp;
      drcramt -= this.Record.cost_sell_pp;

      drcramt += this.Record.cost_rebate;
      drcramt += this.Record.cost_ex_works;
      drcramt += this.Record.cost_other_charges;
      this.Record.cost_drcr_amount = this.gs.roundNumber(drcramt, 2);

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
      incometype: '',
      printfcbank: ''
    };
    SearchData.type = _type;
    SearchData.pkid = this.pkid;
    SearchData.report_folder = this.gs.globalVariables.report_folder;
    SearchData.branch_code = this.gs.globalVariables.branch_code;
    SearchData.folderid = this.folder_id;
    SearchData.comp_code = this.gs.globalVariables.comp_code;
    SearchData.printfcbank = this.printfcbank == true ? 'Y' : 'N';

    this.ErrorMessage = '';
    this.InfoMessage = '';
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

  ShowCostSent(costsent: any, id: string, _refno: string) {
    this.ErrorMessage = '';
    this.InfoMessage = '';
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

  FindInvoiceTotal() {
    this.tot_acc_amt = 0;
    for (let rec of this.Record.DetailList) {
      this.tot_acc_amt += rec.costd_acc_amt;
    }
    this.tot_acc_amt = this.gs.roundNumber(this.tot_acc_amt, 2);
  }

  GenerateXml(ftpsent: any) {
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
      agent_code: this.Record.cost_jv_agent_code,
      agent_name: this.Record.cost_jv_agent_name,
      cost_pkid: this.pkid
    };

    SearchData.report_folder = this.gs.globalVariables.report_folder;
    SearchData.company_code = this.gs.globalVariables.comp_code;
    SearchData.branch_code = this.gs.globalVariables.branch_code;
    SearchData.cost_pkid = this.pkid;
    SearchData.agent_code =  this.Record.cost_jv_agent_code;
    SearchData.agent_name =  this.Record.cost_jv_agent_name;

    this.mainService.GenerateXmlCostingInvoice(SearchData)
      .subscribe(response => {
        this.loading = false;
        // this.InfoMessage = response.savemsg;
        this.sSubject = "REF#-" + this.Record.cost_refno;
        this.ftp_agent_code = this.Record.cost_jv_agent_code;
        this.ftp_agent_name = this.Record.cost_jv_agent_name;
        this.FtpAttachList = new Array<any>();
        this.FileList = response.filelist;
        for (let rec of this.FileList) {
          this.FtpAttachList.push({ filename: rec.filename, filetype: rec.filetype, filedisplayname: rec.filedisplayname, filecategory: rec.filecategory, fileftpfolder: 'FTP-FOLDER-COSTING', fileisack: 'N', fileprocessid: rec.fileprocessid, filesize: rec.filesize, fileftptype: 'BL-FTP' });
        }
        this.open(ftpsent);
      },
        error => {
          this.ErrorMessage = this.gs.getError(error);
          alert(this.ErrorMessage);
          this.loading = false;
        });
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
    SearchData.menuadmin = this.bAdmin == true ? "Y" : "N";
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
}
