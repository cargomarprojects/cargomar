import { Component, Input, OnInit, OnDestroy } from '@angular/core';

import { ActivatedRoute } from '@angular/router';

import { GlobalService } from '../../core/services/global.service';

import { Stmtm } from '../models/stmtm';
import { Stmtd } from '../models/stmtm';

import { StmtService } from '../services/stmtService';
import { SearchTable } from '../../shared/models/searchtable';

@Component({
  selector: 'app-coststmt',
  templateUrl: './costallocation.component.html',

  providers: [StmtService]
})
export class CostAllocationComponent {
  // Local Variables 
  title = 'BL Format';

  @Input() menuid: string = '';
  @Input() type: string = '';
  InitCompleted: boolean = false;
  menu_record: any;

  selectedRowIndex: number = -1;

  showrem = true;

  ht = 300;

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

  folder_id: string;


  sub: any;
  urlid: string;

  ErrorMessage = "";

  mode = '';
  pkid = '';

  AGENTRECORD: SearchTable = new SearchTable();
  AGENTADDRECORD: SearchTable = new SearchTable();
  CURRECORD: SearchTable = new SearchTable();
  // Array For Displaying List
  RecordList: Stmtm[] = [];
  // Single Record for add/edit/view details
  Record: Stmtm = new Stmtm;


  PendingList: Stmtd[] = [];

  constructor(
    private mainService: StmtService,
    private route: ActivatedRoute,
    private gs: GlobalService
  ) {
    this.page_count = 0;
    this.page_rows = 10;
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

    this.currentTab = 'LIST';
    this.menu_record = this.gs.getMenu(this.menuid);
    if (this.menu_record)
      this.title = this.menu_record.menu_name;
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
      this.Record.stm_currencyid = _Record.id;
      this.Record.stm_curr_code = _Record.code;
    }

    if (_Record.controlname == "AGENT") {
      bchange = false;
      if (this.Record.stm_accid != _Record.id)
        bchange = true;

      this.Record.stm_accid = _Record.id;
      this.Record.stm_acc_code = _Record.code;
      this.Record.stm_acc_name = _Record.name;

      if (bchange) {
        this.AGENTADDRECORD = new SearchTable();
        this.AGENTADDRECORD.controlname = "AGENTADDRESS";
        this.AGENTADDRECORD.displaycolumn = "CODE";
        this.AGENTADDRECORD.type = "CUSTOMERADDRESS";
        this.AGENTADDRECORD.id = "";
        this.AGENTADDRECORD.code = "";
        this.AGENTADDRECORD.name = "";
        this.AGENTADDRECORD.parentid = this.Record.stm_accid;
        this.Record.stm_acc_br_addr = "";
      }
    }

    if (_Record.controlname == "AGENTADDRESS") {
      this.Record.stm_acc_br_id = _Record.id;
      this.Record.stm_acc_br_no = _Record.code;
      this.Record.stm_acc_br_addr = this.GetBrAddress(_Record.name).address;
    }




  }
  //function for handling LIST/NEW/EDIT Buttons
  ActionHandler(action: string, id: string, _selectedRowIndex: number = -1) {
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
      company_code: this.gs.globalVariables.comp_code,
      branch_code: this.gs.globalVariables.branch_code,
      year_code: this.gs.globalVariables.year_code,
      page_count: this.page_count,
      page_current: this.page_current,
      page_rows: this.page_rows,
      page_rowcount: this.page_rowcount
    };

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


  ShowPending() {

    this.loading = true;

    let SearchData = {
      pkid: this.pkid,
      accid: this.Record.stm_accid,
      currid: this.Record.stm_currencyid,
      comp_code: this.gs.globalVariables.comp_code,
      branch_code: this.gs.globalVariables.branch_code,
      stm_date: this.Record.stm_date ,
    };

    this.ErrorMessage = '';
    this.mainService.GetPendingList(SearchData)
      .subscribe(response => {
        this.loading = false;
        this.PendingList = response.list;
        this.FindTotal();
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
    this.Record = new Stmtm();
    this.Record.stm_pkid = this.pkid;
    this.Record.stm_no = 0;
    this.Record.stm_date = this.gs.defaultValues.today;

    this.Record.stm_currencyid = this.gs.defaultValues.param_curr_foreign_id;
    this.Record.stm_curr_code = this.gs.defaultValues.param_curr_foreign_code;

    this.Record.rec_mode = this.mode;

    this.PendingList = new Array<Stmtd>();

    this.InitLov();


    this.CURRECORD.id = this.Record.stm_currencyid;
    this.CURRECORD.code = this.Record.stm_curr_code;

    this.FindTotal();

  }

  // Load a single Record for VIEW/EDIT
  GetRecord(Id: string) {
    this.loading = true;

    let SearchData = {
      pkid: Id,
    };

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

  LoadData(_Record: Stmtm) {
    this.Record = _Record;
    this.InitLov();
    this.CURRECORD.code = this.Record.stm_curr_code;
    this.AGENTRECORD.id = this.Record.stm_accid;
    this.AGENTRECORD.code = this.Record.stm_acc_code;
    this.AGENTRECORD.name = this.Record.stm_acc_name;
    
    this.AGENTADDRECORD.id = this.Record.stm_acc_br_id;
    this.AGENTADDRECORD.code = this.Record.stm_acc_br_no;
    this.AGENTADDRECORD.parentid = this.Record.stm_accid;

    this.FindTotal();

    this.lock_record = true;
    this.lock_date = true;

    if (this.Record.stm_edit_code.indexOf("{S}") >= 0)
      this.lock_record = false;
    if (this.Record.stm_edit_code.indexOf("{D}") >= 0)
      this.lock_date = false;

    this.Record.rec_mode = this.mode;

    this.ShowPending();

  }


  // Save Data
  Save() {
    if (!this.allvalid())
      return;

    this.FindTotal();

    this.Record.stm_dr = this.fdr;
    this.Record.stm_cr = this.fcr;
    this.Record.stm_bal = this.fbal;

    this.Record.stm_dr_inr = this.ldr;
    this.Record.stm_cr_inr = this.lcr;
    this.Record.stm_bal_inr = this.lbal;


    this.loading = true;
    this.ErrorMessage = '';

    //this.Record.rec_category = this.type;

    this.Record._globalvariables = this.gs.globalVariables;
    this.Record.PendingList = this.PendingList;

    this.mainService.Save(this.Record)
      .subscribe(response => {
        this.loading = false;
        if (this.mode == 'ADD') {
          this.Record.stm_no = response.stm_no;
        }
        this.ErrorMessage = "Save Complete";
        this.mode = 'EDIT';
        this.Record.rec_mode = this.mode;
        this.RefreshList();
      },
      error => {
        this.loading = false;
        this.ErrorMessage = this.gs.getError(error);
        
      });
  }

  allvalid() {
    let sError: string = "";
    let bret: boolean = true;
    this.ErrorMessage = '';

    if (this.Record.stm_date.trim().length <= 0) {
      bret = false;
      sError += "| Date Cannot Be Blank";
    }

    if (this.Record.stm_currencyid == '' || this.Record.stm_curr_code == '') {
      bret = false;
      sError += "| Currency Cannot Be Blank";
    }


    if (bret === false)
      this.ErrorMessage = sError;
    return bret;
  }

  RefreshList() {

    if (this.RecordList == null)
      return;

    var REC = this.RecordList.find(rec => rec.stm_pkid == this.Record.stm_pkid);
    if (REC == null) {

      this.RecordList.push(this.Record);
    }
    else {
      REC.stm_acc_name = this.Record.stm_acc_name;
      REC.stm_curr_code = this.Record.stm_curr_code;

    }
  }

  OnBlur(field: string) {
    switch (field) {
      case 'allocation':
        {
          

          this.FindTotal();
          break;
        }
    }
  }
  OnChange(field: string, _rec : Stmtd) {
    switch (field) {
      case 'jv_selected': {
          if (_rec.jv_selected) 
              _rec.allocation = _rec.balance;
          else 
            _rec.allocation = 0;
          this.FindTotal();
      }
    }
  }


  Close() {
    this.gs.ClosePage('home');
  }

  inrAlloc: number = 0;

  fdr: number = 0;
  fcr: number = 0;
  fbal: number = 0;

  ldr: number = 0;
  lcr: number = 0;
  lbal: number = 0;

  SeaAmt: number = 0;
  AirAmt: number = 0;
  OtherAmt: number = 0;


  FindTotal() {
    this.inrAlloc = 0;
    this.fdr = 0;
    this.fcr = 0;
    this.fbal = 0;
    this.ldr = 0;
    this.lcr = 0;
    this.lbal = 0;
    this.SeaAmt = 0;
    this.AirAmt = 0;
    this.OtherAmt = 0;

    this.PendingList.forEach(rec => {

      if (rec.allocation == 0) {
        rec.inrallocation = 0;
        rec.jv_selected = false;
      }
      if (rec.allocation > 0) {
        rec.jv_selected = true;
        this.inrAlloc = rec.jv_exchange_rate * rec.allocation;
        rec.inrallocation = this.gs.roundNumber(this.inrAlloc, 2);
      }

      //F.CURR CALCULATION
      if (rec.dr != 0) {
        this.fdr += rec.allocation;
        this.ldr += rec.inrallocation;

        if (rec.rec_category == "SEA EXPORT" || rec.rec_category == "SEA IMPORT")
          this.SeaAmt += rec.allocation;
        else if (rec.rec_category == "AIR EXPORT" || rec.rec_category == "AIR IMPORT")
          this.AirAmt += rec.allocation;
        else 
          this.OtherAmt += rec.allocation;

      }
      if (rec.cr != 0) {
        this.fcr += rec.allocation;
        this.lcr += rec.inrallocation;

        if (rec.rec_category == "SEA EXPORT" || rec.rec_category == "SEA IMPORT")
          this.SeaAmt -= rec.allocation;
        else if (rec.rec_category == "AIR EXPORT" || rec.rec_category == "AIR IMPORT")
          this.AirAmt -= rec.allocation;
        else
          this.OtherAmt -= rec.allocation;

      }


    });


    this.fdr = this.gs.roundNumber(this.fdr, 2);
    this.fcr = this.gs.roundNumber(this.fcr, 2);
    this.fbal = this.fdr - this.fcr;
    this.fbal = this.gs.roundNumber(this.fbal, 2);

    this.ldr = this.gs.roundNumber(this.ldr, 2);
    this.lcr = this.gs.roundNumber(this.lcr, 2);
    this.lbal = this.ldr - this.lcr;
    this.lbal = this.gs.roundNumber(this.lbal, 2);


    this.SeaAmt = this.gs.roundNumber(this.SeaAmt, 2);
    this.AirAmt = this.gs.roundNumber(this.AirAmt, 2);
    this.OtherAmt = this.gs.roundNumber(this.OtherAmt, 2);


  }



  PrintList(_type: string) {
    this.folder_id = this.gs.getGuid();
    this.loading = true;
    let SearchData = {
      type: _type,
      pkid: this.pkid,
      accid: this.Record.stm_accid,
      currid: this.Record.stm_currencyid,
      stm_date : this.Record.stm_date,
      report_folder: '',
      folderid: '',
      comp_code: '',
      branch_code: '',
      report_caption: ''
    };

    SearchData.type = _type;
    SearchData.pkid = this.pkid;
    SearchData.report_folder = this.gs.globalVariables.report_folder;
    SearchData.folderid = this.folder_id;
    SearchData.comp_code = this.gs.globalVariables.comp_code;
    SearchData.branch_code = this.gs.globalVariables.branch_code;
    
    SearchData.report_caption = this.title;


    this.ErrorMessage = '';
    
    this.mainService.PrintList(SearchData)
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


  getht(){
    if ( this.ht < 300)
      return '300px'; 
    else
      return this.ht + 'px';
  }


}
