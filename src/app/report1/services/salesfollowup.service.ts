
import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { SalesFollowup } from '../models/salesfollowup';
import { SearchTable } from '../../shared/models/searchtable';
import { GlobalService } from '../../core/services/global.service';

@Injectable()
export class SalesFollowupService {
 
  title = 'Sales Followup Report'

  menuid: string = '';
  type: string = '';
  InitCompleted: boolean = false;
  menu_record: any;
  sub: any;
  urlid: string;
  ErrorMessage = "";

  report_date: string = '';
  branch_code: string;
  sman_name: string;
  cust_name: string;

  bExcel = false;
  bCompany = false;
  bAdmin = false;
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
    isadmin: false,
    iscompany: false,
    all: false
  };

  // Array For Displaying List
  RecordList: SalesFollowup[] = [];
  ReportDateList: SalesFollowup[] = [];

  BRRECORD: SearchTable = new SearchTable();
  SALESMANRECORD: SearchTable = new SearchTable();
  CUSTRECORD: SearchTable = new SearchTable();

  constructor(
    private http2: HttpClient,
    private gs: GlobalService) {
  }

  InitComponent() {
    this.bAdmin = false;
    this.bCompany = false;
    this.bExcel = false;
    this.menu_record = this.gs.getMenu(this.menuid);
    if (this.menu_record) {
      this.title = this.menu_record.menu_name;
      if (this.menu_record.rights_company)
        this.bCompany = true;
      if (this.menu_record.rights_admin)
        this.bAdmin = true;
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
    // this.sub.unsubscribe();
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

  LoadCombo() {
    this.loading = true;
    let SearchData2 = {
      type: 'type',
      comp_code: this.gs.globalVariables.comp_code,
      branch_code: this.gs.globalVariables.branch_code
    };

    SearchData2.comp_code = this.gs.globalVariables.comp_code;
    SearchData2.branch_code = this.gs.globalVariables.branch_code;

    this.ErrorMessage = '';
    this.LoadDefault(SearchData2)
      .subscribe(response => {
        this.loading = false;
        this.ReportDateList = response.reportdatelist;
        if (this.ReportDateList != null && this.ReportDateList != undefined) {
          if (this.ReportDateList.length > 0)
            this.report_date = this.ReportDateList[0].report_date;
        }

      },
        error => {
          this.loading = false;
          this.ErrorMessage = this.gs.getError(error);
        });
  }

  ProcessReport(_type: string) {

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
    this.SearchData.isadmin = this.bAdmin;
    this.SearchData.iscompany = this.bCompany;
    this.SearchData.all = this.all;

    this.ErrorMessage = '';
    this.List(this.SearchData)
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

  List(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Report1/SalesFollowup/List', SearchData, this.gs.headerparam2('authorized'));
  }

  LoadDefault(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Report1/SalesFollowup/LoadDefault', SearchData, this.gs.headerparam2('authorized'));
  }

}

