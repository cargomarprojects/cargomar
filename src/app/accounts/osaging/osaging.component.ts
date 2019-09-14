
import { Component, Input, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';

import { ActivatedRoute } from '@angular/router';

import { GlobalService } from '../../core/services/global.service';

import { LedgerReport } from '../models/ledgerreport';

import { AccReportService } from '../services/accreport.service';
import { SearchTable } from '../../shared/models/searchtable';


@Component({
  selector: 'app-osaging',
  templateUrl: './osaging.component.html',
  providers: [AccReportService]
})


export class OsAgingComponent {
  // Local Variables 
  title = 'Os Aging';

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
  all: boolean = false;

  to_date: string;

  

  BRRECORD: SearchTable = new SearchTable();

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
    acc_id:'',
    branch_code: '',
    branch_name: '',
    acc_name:'',
    isoverdue: false,
    all: false,
    user_name:''
  };

  
  // Array For Displaying List
  RecordList: LedgerReport[] = [];
  // Single Record for add/edit/view details
  Record: LedgerReport = new LedgerReport;

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
    this.menu_record = this.gs.getMenu(this.menuid);
    if (this.menu_record) {
      this.title = this.menu_record.menu_name;
      if (this.menu_record.rights_company)
        this.bCompany = true;
    }
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

   


    this.BRRECORD = new SearchTable();
    this.BRRECORD.controlname = "BRANCH";
    this.BRRECORD.displaycolumn = "CODE";
    this.BRRECORD.type = "BRANCH";
    this.BRRECORD.id = "";
    this.BRRECORD.code = this.gs.globalVariables.branch_code;
   

  }

  LovSelected(_Record: SearchTable) {

   

    if (_Record.controlname == "BRANCH") {
      this.branch_code = _Record.code;
      this.branch_name = _Record.name;
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
      return;
    }

    this.loading = true;

    this.pkid = this.gs.getGuid();
    this.SearchData.type = _type;
    this.SearchData.pkid = this.pkid;
    this.SearchData.report_folder = this.gs.globalVariables.report_folder;
    this.SearchData.company_code = this.gs.globalVariables.comp_code;
    this.SearchData.user_name = this.gs.globalVariables.user_name;

    if (this.bCompany) {
      this.SearchData.branch_code = this.branch_code;
      this.SearchData.branch_name = this.branch_name;
    }
    else {
      this.SearchData.branch_code = this.gs.globalVariables.branch_code;
      this.SearchData.branch_name = this.gs.globalVariables.branch_name;

    }
    this.SearchData.year_code = this.gs.globalVariables.year_code;
    this.SearchData.searchstring = this.searchstring.toUpperCase();
    this.SearchData.acc_id = '';
    this.SearchData.acc_name = '';
    this.SearchData.isoverdue = false;

    this.SearchData.all = this.all;

    this.SearchData.to_date = this.to_date;
  
   
    this.ErrorMessage = '';
    this.mainService.OsAging(this.SearchData)
      .subscribe(response => {
        this.loading = false;
        if (_type == 'EXCEL')
          this.Downloadfile(_type);
        else  if (_type != 'BAL-CONFIRM'){
          this.RecordList = response.list;
        }
      },
      error => {
        this.loading = false;
        this.ErrorMessage = this.gs.getError(error);
      });
  }


  Downloadfile(_type: string) {
    this.gs.DownloadFile(this.gs.globalVariables.report_folder, this.pkid, _type);
  }

  OnChange(field: string) {
    this.RecordList = null;

  }

  Close() {
    this.gs.ClosePage('home');
  }
}
