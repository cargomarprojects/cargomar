
import { Injectable } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient } from '@angular/common/http';

import { SalesFollowup } from '../models/salesfollowup';
import { SearchTable } from '../../shared/models/searchtable';
import { GlobalService } from '../../core/services/global.service';

@Injectable()
export class SalesFollowupService {

  title = 'Sales Followup Report'

  index1 = -1;
  index2 = -1;
  index3 = -1;

  menuid: string = '';
  type: string = '';
  InitCompleted: boolean = false;
  menu_record: any;
  sub: any;
  urlid: string;
  ErrorMessage = "";
  Detail_title = '';
  selected_brcode = '';
  report_date: string = '';
  branch_code: string;
  sman_name: string;
  cust_name: string;
  generate_date: string;

  bExcel = false;
  bEmail = false;
  bCompany = false;
  bAdmin = false;
  bCanAdd = false;
  bCanDelete = false;
  all: boolean = false;
  loading = false;
  currentTab = 'LIST';
  distinctTab = 'SALESMAN';

  SearchData = {
    type: '',
    row_type: '',
    pkid: '',
    report_folder: '',
    company_code: '',
    branch_code: '',
    year_code: '',
    year_name: '',
    report_date: '',
    sman_name: '',
    selected_cust_name: '',
    selected_branch: '',
    selected_brcode: '',
    selected_sman_name: '',
    isadmin: false,
    iscompany: false,
    all: false
  };

  // Array For Displaying List

  ReportDateList: SalesFollowup[] = [];
  RecordList: SalesFollowup[] = [];
  RecordDetList: SalesFollowup[] = [];

  BRRECORD: SearchTable = new SearchTable();
  SALESMANRECORD: SearchTable = new SearchTable();
  CUSTRECORD: SearchTable = new SearchTable();

  modal: any;
  sSubject: string = '';
  sMsg: string = '';
  sHtml: string = '';
  AttachList: any[] = [];
  defaultto_ids: string = '';

  constructor(
    private modalService: NgbModal,
    private http2: HttpClient,
    private gs: GlobalService) {
  }


  InitPage(params: any) {
    const options = JSON.parse(params);
    this.InitCompleted = true;
    this.menuid = options.menuid;
    this.type = options.type;
    this.InitComponent();
  }

  InitComponent() {
    this.bAdmin = false;
    this.bCompany = false;
    this.bExcel = false;
    this.bCanAdd = false;
    this.bCanDelete = false;
    this.bEmail = false;
    this.menu_record = this.gs.getMenu(this.menuid);
    if (this.menu_record) {
      this.title = this.menu_record.menu_name;
      if (this.menu_record.rights_company)
        this.bCompany = true;
      if (this.menu_record.rights_admin)
        this.bAdmin = true;
      if (this.menu_record.rights_print)
        this.bExcel = true;
      if (this.menu_record.rights_add)
        this.bCanAdd = true;
      if (this.menu_record.rights_delete)
        this.bCanDelete = true;
      if (this.menu_record.rights_email)
        this.bEmail = true;
    }

    this.Init();
    this.initLov();
    this.LoadCombo();
    this.ReportList('SCREEN');
  }

  Init() {
    this.branch_code = this.gs.globalVariables.branch_code;
    this.RecordList = null;
    this.sman_name = this.gs.globalVariables.sman_name;
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
    this.SALESMANRECORD.id = this.gs.globalVariables.sman_id;
    this.SALESMANRECORD.code = "";
    this.SALESMANRECORD.name = this.gs.globalVariables.sman_name;

  }

  LoadCombo() {
    // this.loading = true;
    // let SearchData2 = {
    //   type: 'type',
    //   comp_code: this.gs.globalVariables.comp_code,
    //   branch_code: this.gs.globalVariables.branch_code
    // };

    // SearchData2.comp_code = this.gs.globalVariables.comp_code;
    // SearchData2.branch_code = this.gs.globalVariables.branch_code;

    // this.ErrorMessage = '';
    // this.LoadDefault(SearchData2)
    //   .subscribe(response => {
    //     this.loading = false;
    //     this.ReportDateList = response.reportdatelist;
    //     if (this.ReportDateList != null && this.ReportDateList != undefined) {
    //       if (this.ReportDateList.length > 0)
    //         this.report_date = this.ReportDateList[0].report_date;
    //     }

    //   },
    //     error => {
    //       this.loading = false;
    //       this.ErrorMessage = this.gs.getError(error);
    //     });
  }

  ReportList(_type: string) {
    this.currentTab = "LIST";
    this.ErrorMessage = '';
    this.loading = true;
    this.SearchData.pkid = this.gs.getGuid();
    this.SearchData.report_folder = this.gs.globalVariables.report_folder;
    this.SearchData.type = _type;
    this.SearchData.company_code = this.gs.globalVariables.comp_code;
    this.SearchData.branch_code = this.gs.globalVariables.branch_code;

    this.ErrorMessage = '';
    this.List(this.SearchData)
      .subscribe(response => {
        this.loading = false;
        if (_type == 'EXCEL')
          this.Downloadfile(response.filename, response.filetype, response.filedisplayname);
        else {
          this.ReportDateList = response.list;
        }
      },
        error => {
          this.loading = false;
          this.ReportDateList = null;
          this.ErrorMessage = this.gs.getError(error);
        });
  }

  ShowDistinctReport(_type: string, _category: string) {

    this.distinctTab = _category;

    this.ErrorMessage = '';
    this.loading = true;
    this.SearchData.type = _category;

    this.SearchData.pkid = this.gs.getGuid();
    this.SearchData.report_folder = this.gs.globalVariables.report_folder;
    this.SearchData.company_code = this.gs.globalVariables.comp_code;
    this.SearchData.report_date = this.report_date;
    this.SearchData.branch_code = this.gs.globalVariables.branch_code;
    this.SearchData.sman_name = this.gs.globalVariables.sman_name;
    this.SearchData.isadmin = this.bAdmin;
    this.SearchData.iscompany = this.bCompany;

    this.ErrorMessage = '';
    this.DistinctList(this.SearchData)
      .subscribe(response => {
        this.loading = false;

        this.RecordList = response.list;

      },
        error => {
          this.loading = false;
          this.RecordList = null;
          this.ErrorMessage = this.gs.getError(error);
        });
  }

  ShowDetailReport(_type: string, _category: string, _rec: SalesFollowup, emailsent: any) {

    this.index3 = -1;
    if (_type != "MAIL")
      this.currentTab = "DETAILLIST";
    this.ErrorMessage = '';
    this.loading = true;
    this.SearchData.row_type = _type;
    this.SearchData.type = _category;
    this.SearchData.report_date = this.report_date;
    this.SearchData.pkid = this.gs.getGuid();
    this.SearchData.report_folder = this.gs.globalVariables.report_folder;
    this.SearchData.company_code = this.gs.globalVariables.comp_code;
    this.SearchData.branch_code = this.gs.globalVariables.branch_code
    this.SearchData.sman_name = this.gs.globalVariables.sman_name;

    if (_category == "SALESMAN") {
      if (_rec == null)
        this.SearchData.selected_sman_name = this.Detail_title;
      else {
        this.SearchData.selected_sman_name = _rec.sman_name;
        this.Detail_title = _rec.sman_name;
      }
    } else
      this.SearchData.selected_sman_name = "";

    if (_category == "BRANCH") {
      if (_rec == null) {
        this.SearchData.selected_branch = this.Detail_title;
        this.SearchData.selected_brcode = this.selected_brcode;
      }
      else {
        this.SearchData.selected_branch = _rec.branch;
        this.SearchData.selected_brcode = _rec.brcode;
        this.Detail_title = _rec.branch;
        this.selected_brcode = _rec.brcode;
      }
    } else {
      this.SearchData.selected_branch = "";
      this.SearchData.selected_brcode = "";
    }

    if (_category == "PARTY") {
      if (_rec == null)
        this.SearchData.selected_cust_name = this.Detail_title;
      else {
        this.SearchData.selected_cust_name = _rec.party_name;
        this.Detail_title = _rec.party_name;
      }
    } else
      this.SearchData.selected_cust_name = "";


    this.SearchData.isadmin = this.bAdmin;
    this.SearchData.iscompany = this.bCompany;

    this.ErrorMessage = '';
    this.DetailList(this.SearchData)
      .subscribe(response => {
        this.loading = false;
        if (_type == 'EXCEL')
          this.Downloadfile(response.filename, response.filetype, response.filedisplayname);
        else if (_type == 'MAIL') {
          this.AttachList = new Array<any>();
          this.AttachList.push({ filename: response.filename, filetype: response.filetype, filedisplayname: response.filedisplayname, filesize: response.filesize });
          this.defaultto_ids = response.sman_email;
          this.setMailBody();
          this.open(emailsent);
        }
        else {
          this.RecordDetList = response.list;
        }
      },
        error => {
          this.loading = false;
          this.RecordDetList = null;
          this.ErrorMessage = this.gs.getError(error);
        });
  }
  setMailBody() {

    this.sSubject = "DEBTORS O/S FOLLOWUP";

    this.sMsg = "Dear Sir,";
    this.sMsg += " \n\n";
    this.sMsg += "  Please find the attached debtors o/s followup ";
    this.sMsg += " \n\n";
  }


  ProcessData(_type: string, _rec: SalesFollowup) {

    if (_type == 'GENERATE') {
      if (this.generate_date.toString().length <= 0) {
        this.ErrorMessage = " | Date Cannot Be Blank";
        alert(this.ErrorMessage);
        return;
      }
      if (!confirm("Generate Records")) {
        return;
      }
    }
    if (_type == 'RE-UPDATE') {
      if (!confirm("Update Records " + _rec.report_date))
        return;
    }

    this.ErrorMessage = '';
    let SearchData = {
      type: _type,
      reportdate: _type == 'RE-UPDATE' ? _rec.report_date : this.generate_date,
      company_code: this.gs.globalVariables.comp_code,
      branch_code: this.gs.globalVariables.branch_code,
      year_code: this.gs.globalVariables.year_code,
      year_name: this.gs.globalVariables.year_name,
      user_code: this.gs.globalVariables.user_code,
      fin_start_date: this.gs.globalVariables.year_start_date,
      fin_end_date: this.gs.globalVariables.year_end_date
    };

    this.loading = true;
    this.Generate(SearchData)
      .subscribe(response => {
        this.loading = false;
        if (response.retvalue) {
          this.ReportList('SCREEN');
          this.ErrorMessage = "Generate Complete";
          alert(this.ErrorMessage);
        }
      },
        error => {
          this.loading = false;
          this.ErrorMessage = this.gs.getError(error);
          alert(this.ErrorMessage);

        });
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
    this.DeleteRecord(SearchData)
      .subscribe(response => {
        this.loading = false;
        this.ErrorMessage = "Deleted Successfully";
        this.ReportDateList.splice(this.ReportDateList.findIndex(rec => rec.report_date == Id), 1);
        alert(this.ErrorMessage);
      },
        error => {
          this.loading = false;
          this.ErrorMessage = this.gs.getError(error);
          alert(this.ErrorMessage);
        });
  }

  open(content: any) {
    this.modal = this.modalService.open(content);
  }

  Downloadfile(filename: string, filetype: string, filedisplayname: string) {
    this.gs.DownloadFile(this.gs.globalVariables.report_folder, filename, filetype, filedisplayname);
  }

  List(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Report1/SalesFollowup/List', SearchData, this.gs.headerparam2('authorized'));
  }

  DistinctList(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Report1/SalesFollowup/DistinctList', SearchData, this.gs.headerparam2('authorized'));
  }

  DetailList(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Report1/SalesFollowup/DetailList', SearchData, this.gs.headerparam2('authorized'));
  }

  LoadDefault(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Report1/SalesFollowup/LoadDefault', SearchData, this.gs.headerparam2('authorized'));
  }

  RemarkList(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Report1/SalesFollowup/RemarkList', SearchData, this.gs.headerparam2('authorized'));
  }

  RemarkSave(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Report1/SalesFollowup/RemarkSave', SearchData, this.gs.headerparam2('authorized'));
  }

  Generate(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Report1/SalesFollowup/Generate', SearchData, this.gs.headerparam2('authorized'));
  }

  DeleteRecord(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Report1/SalesFollowup/DeleteRecord', SearchData, this.gs.headerparam2('authorized'));
  }
}

