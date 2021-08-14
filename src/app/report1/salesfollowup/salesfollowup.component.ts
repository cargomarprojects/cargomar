import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { GlobalService } from '../../core/services/global.service';
import { SearchTable } from '../../shared/models/searchtable';
import { SalesFollowup } from '../models/salesfollowup';

import { SalesFollowupService } from '../services/salesfollowup.service';

@Component({
  selector: 'app-salesfollowup',
  templateUrl: './salesfollowup.component.html',
  providers: [SalesFollowupService]
})

export class SalesFollowupComponent {
  title = 'Sales Followup Report'
  
  @Input() menuid: string = '';
  @Input() type: string = '';
  InitCompleted: boolean = false;
  menu_record: any;
  sub: any;
  urlid: string;
  ErrorMessage = "";

  report_date: string ='';
  branch_code: string;
  sman_name: string;
  cust_name: string;

  bExcel = false;
  bCompany = false;
  all: boolean = false;
  loading = false;
  currentTab = 'LIST';

  SearchData = {
    type: '',
    pkid: '',
    report_folder: '',
    company_code: '',
    branch_code: '',
    year_code: '',
    report_date: '',
    sman_name: '',
    cust_name: '',
    all: false
  };
   
  // Array For Displaying List
  RecordList: SalesFollowup[] = [];
 
  BRRECORD: SearchTable = new SearchTable();
  SALESMANRECORD: SearchTable = new SearchTable();
  CUSTRECORD: SearchTable = new SearchTable();
  

  constructor(
    private ms: SalesFollowupService,
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
    this.bExcel = false;
    this.menu_record = this.gs.getMenu(this.menuid);
    if (this.menu_record) {
      this.title = this.menu_record.menu_name;
      if (this.menu_record.rights_company)
        this.bCompany = true;
      if (this.menu_record.rights_print)
        this.bExcel = true;
    }
    this.Init();
    this.initLov();
    this.LoadCombo();
  }

  Init() {
    this.branch_code = this.gs.globalVariables.branch_code;
    this.RecordList = null;
    this.sman_name = '';
    this.cust_name = '';
    this.report_date = '';
  }

  // Destroy Will be called when this component is closed
  ngOnDestroy() {
    this.sub.unsubscribe();
  }


  initLov(caption: string = '') {

    this.BRRECORD = new SearchTable();
    this.BRRECORD.controlname = "BRANCH";
    this.BRRECORD.displaycolumn = "CODE";
    this.BRRECORD.type = "BRANCH";
    this.BRRECORD.id = "";
    this.BRRECORD.code = this.gs.globalVariables.branch_code;


    this.CUSTRECORD = new SearchTable();
    this.CUSTRECORD.controlname = "PARTY";
    this.CUSTRECORD.displaycolumn = "NAME";
    this.CUSTRECORD.type = "CUSTOMER";
    this.CUSTRECORD.where = "";
    this.CUSTRECORD.id = "";
    this.CUSTRECORD.code = "";
    this.CUSTRECORD.name = "";
    this.CUSTRECORD.parentid = "";


    this.SALESMANRECORD = new SearchTable();
    this.SALESMANRECORD.controlname = "SALESMAN";
    this.SALESMANRECORD.displaycolumn = "CODE";
    this.SALESMANRECORD.type = "SALESMAN";
    this.SALESMANRECORD.id = "";
    this.SALESMANRECORD.code = "";
    this.SALESMANRECORD.name = "";

  }

  LovSelected(_Record: SearchTable) {
    // Company Settings
    if (_Record.controlname == "BRANCH") {
      this.branch_code = _Record.code;
    }

    if (_Record.controlname == "PARTY") {
      this.cust_name = _Record.name;
    }
    if (_Record.controlname == "SALESMAN") {
      this.sman_name = _Record.name;
    }
    
  }
  LoadCombo() {
  }

  // Query List Data
  List(_type: string) {

    this.ErrorMessage = '';
    if (this.report_date.trim().length <= 0) {
     this.ErrorMessage = "Date Cannot Be Blank";
     return;
    }
    
    this.loading = true;
    this.SearchData.pkid = this.gs.getGuid();
    this.SearchData.report_folder = this.gs.globalVariables.report_folder;
    this.SearchData.company_code = this.gs.globalVariables.comp_code;
   
    if (this.bCompany) {
      this.SearchData.branch_code = this.branch_code;
    }
    else {
      this.SearchData.branch_code = this.gs.globalVariables.branch_code;
    }
    this.SearchData.year_code = this.gs.globalVariables.year_code;
    this.SearchData.type = _type;
    this.SearchData.report_date = this.report_date;
    this.SearchData.sman_name = this.sman_name;
    this.SearchData.cust_name = this.cust_name;
    this.SearchData.all = this.all;
    
    this.ErrorMessage = '';
    this.ms.List(this.SearchData)
      .subscribe(response => {
        this.loading = false;
        if (_type == 'EXCEL')
          this.Downloadfile(response.filename, response.filetype, response.filedisplayname);
        else {
          this.RecordList = response.list;
        }
      },
      error => {
        this.loading = false;
        this.RecordList = null;
        this.ErrorMessage = this.gs.getError(error);
      });
  }

  Downloadfile(filename: string, filetype: string, filedisplayname: string) {
    this.gs.DownloadFile(this.gs.globalVariables.report_folder, filename, filetype, filedisplayname);
  }

  OnChange(field: string) {
    this.RecordList = null;
  }

  Close() {
    this.gs.ClosePage('home');
  }
}
