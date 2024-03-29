
import { Component, Input, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';

import { ActivatedRoute } from '@angular/router';

import { GlobalService } from '../../core/services/global.service';

import { payhistoryReport } from '../models/payhistory';

import { AccReportService } from '../services/accreport.service';
import { SearchTable } from '../../shared/models/searchtable';


@Component({
  selector: 'app-agentpayhistory',
  templateUrl: './agentpayhistory.component.html',
  providers: [AccReportService]
})


export class AgentPayHistoryComponent {
  // Local Variables 
  title = 'Payment History Report';

  @Input() menuid: string = '';
  @Input() type: string = '';
  InitCompleted: boolean = false;
  menu_record: any;

  disableSave = true;
  loading = false;
  currentTab = 'LIST';

  searchstring = '';

  sub: any;
  urlid: string;
  branch_name: string;
  branch_code: string;

  isoverdue: boolean = false;
  bCompany = false;
  bAdmin = false;
  all: boolean = false;
  detail: boolean = false;

  to_date: string;
  from_date: string;
  intrest: string;
  credit_days: string;

  AGENTRECORD: SearchTable = new SearchTable();

  ErrorMessage = "";

  mode = '';
  pkid = '';

  SearchData = {
    type: '',
    pkid: '',
    report_folder: '',
    company_code: '',
    year_code: '',
    searchstring: '',
    to_date: '',
    from_date: '',
    acc_id: '',
    acc_name: '',
    branch_code: '',
    branch_name: '',
    intrest: '',
    credit_days: '',
    isoverdue: false,
    all: false,
    detail: false,
  };


  // Array For Displaying List
  RecordList: payhistoryReport[] = [];
  // Single Record for add/edit/view details
  Record: payhistoryReport = new payhistoryReport;

  constructor(
    private mainService: AccReportService,
    private route: ActivatedRoute,
    private gs: GlobalService
  ) {


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
    this.bCompany = false;
    this.bAdmin = false;
    this.menu_record = this.gs.getMenu(this.menuid);
    if (this.menu_record) {
      this.title = this.menu_record.menu_name;
      if (this.menu_record.rights_company)
        this.bCompany = true;
      if (this.menu_record.rights_admin)
        this.bAdmin = true;
    }
    this.from_date = this.gs.defaultValues.monthbegindate;
    this.to_date = this.gs.defaultValues.today;


    this.Init();
    this.LoadCombo();
    this.InitLov();

  }
  Init() {

    this.branch_code = this.gs.globalVariables.branch_code;
    this.branch_name = this.gs.globalVariables.branch_name;

  }
  // Destroy Will be called when this component is closed
  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  InitLov() {

    this.AGENTRECORD = new SearchTable();
    this.AGENTRECORD.controlname = "AGENT";
    this.AGENTRECORD.displaycolumn = "CODE";
    this.AGENTRECORD.type = "CUSTOMER";
    this.AGENTRECORD.where = " CUST_IS_AGENT = 'Y' ";
    this.AGENTRECORD.id = "";
    this.AGENTRECORD.code = "";
    this.AGENTRECORD.name = "";

  }

  LovSelected(_Record: SearchTable) {

    if (_Record.controlname == "AGENT") {

    }


  }


  LoadCombo() {
  }


  //function for handling LIST/NEW/EDIT Buttons
  ActionHandler(action: string, id: string) {
    this.ErrorMessage = '';
    if (action == 'LIST') {
      this.mode = '';
      this.pkid = '';
      this.currentTab = 'LIST';
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

    if (this.to_date.trim().length <= 0) {
      this.ErrorMessage = 'To Date Cannot Be Blank';
      alert(this.ErrorMessage);
      return;
    }
    if (this.from_date.trim().length <= 0) {
      this.ErrorMessage = 'From Date Cannot Be Blank';
      alert(this.ErrorMessage);
      return;
    }

    this.loading = true;

    this.pkid = this.gs.getGuid();
    this.SearchData.type = _type;
    this.SearchData.pkid = this.pkid;
    this.SearchData.report_folder = this.gs.globalVariables.report_folder;
    this.SearchData.company_code = this.gs.globalVariables.comp_code;
    this.SearchData.branch_code = this.gs.globalVariables.branch_code;
    this.SearchData.branch_name = this.gs.globalVariables.branch_name;
    this.SearchData.year_code = this.gs.globalVariables.year_code;
    this.SearchData.searchstring = this.searchstring.toUpperCase();
    this.SearchData.to_date = this.to_date;
    this.SearchData.from_date = this.from_date;
    this.SearchData.acc_id = this.AGENTRECORD.id;
    this.SearchData.acc_name = this.AGENTRECORD.name;
    this.SearchData.detail = this.detail;

    this.ErrorMessage = '';
    //BLAccounts/AgentPayHistoryService/List
    this.mainService.AgentPayHistory(this.SearchData)
      .subscribe(response => {
        this.loading = false;
        if (_type == 'EXCEL')
          this.Downloadfile(response.reportfile, _type, response.filedisplayname);
        else {
          this.RecordList = response.list;
        }
      },
        error => {
          this.loading = false;
          this.ErrorMessage = this.gs.getError(error);
          alert(this.ErrorMessage);
        });
  }


  // Downloadfile(_type: string) {
  //   this.gs.DownloadFile(this.gs.globalVariables.report_folder, this.pkid, _type);
  // }
  Downloadfile(filename: string, filetype: string, filedisplayname: string) {
    this.gs.DownloadFile(this.gs.globalVariables.report_folder, filename, filetype, filedisplayname);
  }
  OnChange(field: string) {
    this.RecordList = null;

  }

  Close() {
    this.gs.ClosePage('home');
  }

  //showRemarks(rec: payhistoryReport) {
  //  if (rec.pkid == null)
  //    return;
  //  if (rec.pkid !== '') {
  //    rec.displayed = !rec.displayed;
  //  }
  //}


}
