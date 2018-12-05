import { Component, Input, OnInit, OnDestroy } from '@angular/core';

import { ActivatedRoute } from '@angular/router';

import { GlobalService } from '../../core/services/global.service';

import { Stmtm } from '../../accounts/models/stmtm';
import { Stmtd } from '../../accounts/models/stmtm';

import { RepService } from '../services/report.service';
import { SearchTable } from '../../shared/models/searchtable';

@Component({
  selector: 'app-costos',
  templateUrl: './costos.component.html',

  providers: [RepService]
})
export class CostOsComponent {
  // Local Variables 
  title = 'Costing OS Report';

  @Input() menuid: string = '';
  @Input() type: string = '';
  InitCompleted: boolean = false;
  menu_record: any;

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
  
  // Single Record for add/edit/view details
  Record: Stmtm = new Stmtm;


  PendingList: Stmtd[] = [];

  constructor(
    private mainService: RepService,
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
        this.InitComponent();
      }
    });

  }

  // Init Will be called After executing Constructor
  ngOnInit() {

      this.InitComponent();

  }

  InitComponent() {

    this.currentTab = 'LIST';
    this.menu_record = this.gs.getMenu(this.menuid);
    if (this.menu_record)
      this.title = this.menu_record.menu_name;


    this.Record.stm_date = this.gs.defaultValues.today;
    this.Record.stm_currencyid = this.gs.defaultValues.param_curr_foreign_id;
    this.Record.stm_curr_code = this.gs.defaultValues.param_curr_foreign_code;

    this.InitColumns();
    this.InitLov();

    this.CURRECORD.id = this.Record.stm_currencyid;
    this.CURRECORD.code = this.Record.stm_curr_code;
    
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
  
  ShowPending(_type : string) {

    this.loading = true;

    let SearchData = {
      type: _type,
      pkid: this.pkid,
      accid: this.Record.stm_accid,
      currid: this.Record.stm_currencyid,
      comp_code: this.gs.globalVariables.comp_code,
      branch_code: this.gs.globalVariables.branch_code,
      stm_date: this.Record.stm_date,
      report_folder : this.gs.globalVariables.report_folder,
      folderid: this.gs.getGuid(),
      agent: this.Record.stm_acc_name

    };

    this.ErrorMessage = '';
    this.mainService.GetCostOs(SearchData)
      .subscribe(response => {
        this.loading = false;
        if (_type == 'EXCEL')
          this.Downloadfile(response.filename, response.filetype, response.filedisplayname);
        else 
          this.PendingList = response.list;
      },
      error => {
        this.loading = false;
        this.ErrorMessage = this.gs.getError(error);
      });
  }
     

  Close() {
    this.gs.ClosePage('home');
  }

  

  PrintList(_type: string) {
    this.folder_id = this.gs.getGuid();
    this.loading = true;
    let SearchData = {
      type: _type,
      pkid: this.pkid,
      accid: this.Record.stm_accid,
      currid: this.Record.stm_currencyid,
      stm_date: this.Record.stm_date,
      report_folder: '',
      folderid: '',
      comp_code: '',
      branch_code: '',
      report_caption: ''
    };

    SearchData.type = _type;
    SearchData.pkid = this.pkid;
    SearchData.report_folder = this.gs.globalVariables.report_folder;
    SearchData.comp_code = this.gs.globalVariables.comp_code;
    SearchData.branch_code = this.gs.globalVariables.branch_code;
    SearchData.folderid = this.folder_id;
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


}
