
import { Component, Input, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';

import { ActivatedRoute } from '@angular/router';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { GlobalService } from '../../core/services/global.service';

import { OsAgentReport } from '../models/osagent';

import { AccReportService } from '../services/accreport.service';
import { SearchTable } from '../../shared/models/searchtable';
//CREATE-AJITH-25-09-2021
//EDIT-AJITH-27-09-2021
//EDIT-AJITH-28-09-2021
//EDIT-AJITH-01-10-2021
//EDIT-AJITH-04-10-2021

@Component({
  selector: 'app-osagent2',
  templateUrl: './osagent2.component.html',
  providers: [AccReportService]
})


export class OsAgent2Component {
  // Local Variables 
  title = 'OsAgent Report';

  @Input() menuid: string = '';
  @Input() type: string = '';
  InitCompleted: boolean = false;
  menu_record: any;

  selectedRowIndex = 0;

  disableSave = true;
  loading = false;
  currentTab = 'LIST';
  modal: any;
  searchstring = '';

  sub: any;
  urlid: string;
  branch_name: string;
  branch_code: string;

  agent_id: string;
  agent_code: string;
  agent_name: string;
  category: string;
  category_type: string;
  curr_id: string;
  curr_code: string;
  curr_amt_above: number = 4999;

  isoverdue: boolean = false;
  bCompany = false;
  bExcel = false;
  bMail = false;
  all: boolean = false;

  to_date: string;

  ACCRECORD: SearchTable = new SearchTable();

  BRRECORD: SearchTable = new SearchTable();
  AGENTRECORD: SearchTable = new SearchTable();
  CURRECORD: SearchTable = new SearchTable();

  ErrorMessage = "";

  mode = '';
  pkid = '';

  sSubject: string = '';
  sMsg: string = '';
  sHtml: string = '';
  sTo_ids: string = '';
  AttachList: any[] = [];

  SearchData = {
    type: '',
    pkid: '',
    report_folder: '',
    company_code: '',
    year_code: '',
    searchstring: '',
    to_date: '',
    acc_id: '',
    acc_name: '',
    branch_code: '',
    branch_name: '',
    agent_id: '',
    agent_code: '',
    agent_name: '',
    curr_id: '',
    curr_code: '',
    category: '',
    category_type: '',
    isoverdue: false,
    all: false,
    curr_amt_above: this.curr_amt_above
  };


  // Array For Displaying List
  RecordList: OsAgentReport[] = [];
  // Single Record for add/edit/view details
  Record: OsAgentReport = new OsAgentReport;

  constructor(
    private modalService: NgbModal,
    private mainService: AccReportService,
    private route: ActivatedRoute,
    public gs: GlobalService
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
    this.bExcel = false;
    this.bMail = false;
    this.menu_record = this.gs.getMenu(this.menuid);
    if (this.menu_record) {
      this.title = this.menu_record.menu_name;
      if (this.menu_record.rights_company)
        this.bCompany = true;
      if (this.menu_record.rights_print)
        this.bExcel = true;
      if (this.menu_record.rights_email)
        this.bMail = true;
    }
    this.to_date = this.gs.defaultValues.today;

    this.Init();
    this.LoadCombo();
    this.InitLov();
    this.List('NEW', 'SUMMARY');
  }
  Init() {

    this.branch_code = this.gs.globalVariables.branch_code;
    this.branch_name = this.gs.globalVariables.branch_name;
    this.agent_id = '';
    this.curr_id = '';
    this.category = "ALL";
    this.category_type = "SUMMARY";

  }
  // Destroy Will be called when this component is closed
  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  InitLov() {

    this.ACCRECORD = new SearchTable();
    this.ACCRECORD.controlname = "ACCTM";
    this.ACCRECORD.displaycolumn = "CODE";
    this.ACCRECORD.type = "ACCTM";
    this.ACCRECORD.where = "";
    this.ACCRECORD.id = "";
    this.ACCRECORD.code = "";
    this.ACCRECORD.name = "";


    this.BRRECORD = new SearchTable();
    this.BRRECORD.controlname = "BRANCH";
    this.BRRECORD.displaycolumn = "CODE";
    this.BRRECORD.type = "BRANCH";
    this.BRRECORD.id = "";
    this.BRRECORD.code = this.gs.globalVariables.branch_code;

    this.AGENTRECORD = new SearchTable();
    this.AGENTRECORD.controlname = "AGENT";
    this.AGENTRECORD.where = " CUST_IS_AGENT = 'Y' ";
    this.AGENTRECORD.displaycolumn = "NAME";
    this.AGENTRECORD.type = "CUSTOMER";
    this.AGENTRECORD.id = "";
    this.AGENTRECORD.code = "";
    this.AGENTRECORD.name = "";

    this.CURRECORD = new SearchTable();
    this.CURRECORD.controlname = "CURRENCY";
    this.CURRECORD.displaycolumn = "CODE";
    this.CURRECORD.type = "CURRENCY";
    this.CURRECORD.id = "";
    this.CURRECORD.code = "";
    this.CURRECORD.name = "";

  }

  LovSelected(_Record: SearchTable) {

    if (_Record.controlname == "ACCTM") {

    }

    if (_Record.controlname == "BRANCH") {
      this.branch_code = _Record.code;
      this.branch_name = _Record.name;
    }
    if (_Record.controlname == "AGENT") {
      this.agent_id = _Record.id;
      this.agent_code = _Record.code;
      this.agent_name = _Record.name;
    }
    if (_Record.controlname == "CURRENCY") {
      this.curr_id = _Record.id;
      this.curr_code = _Record.code;

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
  List(_type: string, _category_type: string, mailsent: any = null) {

    if (this.to_date.trim().length <= 0) {
      this.ErrorMessage = 'To Date Cannot Be Blank';
      alert(this.ErrorMessage);
      return;
    }

    this.category_type = _category_type;
    this.loading = true;

    this.pkid = this.gs.getGuid();
    this.SearchData.type = _type;
    this.SearchData.pkid = this.pkid;
    this.SearchData.report_folder = this.gs.globalVariables.report_folder;
    this.SearchData.company_code = this.gs.globalVariables.comp_code;

    //if (this.bCompany) {
    this.SearchData.branch_code = this.branch_code;
    this.SearchData.branch_name = this.branch_name;
    //}
    //else {
    //  this.SearchData.branch_code = this.gs.globalVariables.branch_code;
    //  this.SearchData.branch_name = this.gs.globalVariables.branch_name;

    //}
    this.SearchData.year_code = this.gs.globalVariables.year_code;
    this.SearchData.searchstring = this.searchstring.toUpperCase();

    this.SearchData.isoverdue = this.isoverdue;
    this.SearchData.all = this.all;

    this.SearchData.to_date = this.to_date;
    this.SearchData.acc_id = this.ACCRECORD.id;
    this.SearchData.acc_name = this.ACCRECORD.name;
    this.SearchData.agent_id = this.agent_id;
    this.SearchData.agent_name = this.agent_name;
    this.SearchData.agent_code = this.agent_code;
    this.SearchData.curr_id = this.curr_id;
    this.SearchData.curr_code = this.curr_code;
    this.SearchData.category = this.category;
    this.SearchData.category_type = this.category_type;
    this.SearchData.curr_amt_above = this.curr_amt_above;
    this.ErrorMessage = '';
    this.mainService.OsAgent2(this.SearchData)
      .subscribe(response => {
        this.loading = false;
        if (_type == 'EXCEL')
          this.Downloadfile(response.reportfile, _type, response.filedisplayname);
        else if (_type == 'MAIL') {
          this.AttachList = new Array<any>();
          if (this.gs.isBlank(response.filelist)) {
            this.AttachList.push({ filename: response.filename, filetype: response.filetype, filedisplayname: response.filedisplayname, filesize: response.filesize });
          } else {
            for (let rec of response.filelist) {
              this.AttachList.push({ filename: rec.filename, filetype: rec.filetype, filedisplayname: rec.filedisplayname, filesize: rec.filesize });
            }
          }
          this.sSubject = response.subject;
          this.sMsg = response.message;
          // this.sTo_ids = response.toids;
          this.sTo_ids = '';
          this.open(mailsent);
        }
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

  open(content: any) {
    this.modal = this.modalService.open(content, { backdrop: 'static', keyboard: true });
  }
  /*
  AutoEmail() {
    this.loading = true; //Agent Summary report
    let eSearchData = {
      user_pkid: "C2AD01C8-0585-403D-83D7-4C2E8854EE5C",
      user_code: "ADMIN",
      company_code: this.gs.globalVariables.comp_code,
      branch_code: this.gs.globalVariables.branch_code,
      type: 'MAIL',
      report_folder: this.gs.globalVariables.report_folder,
      category_type:'AGING',
      to_date:"2022-12-05"
    };

    this.ErrorMessage = '';
    this.mainService.OsAgent2(eSearchData)
      .subscribe(response => {
        this.loading = false;

        if (response.retvalue)
          alert('Sent')
      },
        error => {
          this.loading = false;
          this.ErrorMessage = this.gs.getError(error);
        });
  }
  */
}
