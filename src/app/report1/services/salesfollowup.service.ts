
import { Injectable } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient } from '@angular/common/http';

import { SalesFollowup } from '../models/salesfollowup';
import { SearchTable } from '../../shared/models/searchtable';
import { GlobalService } from '../../core/services/global.service';

//EDIT-AJITH-03-09-2021
//EDIT-AJITH-06-09-2021

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
  branch_name:string;
  generate_date: string;
  selectall: boolean = false;

  param_report_date: string = '';

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

  url = '';

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
    sdata: '',
    all: false,
    user_pkid: '',
    user_code: '',
    year_id : '',
    hostname : '',
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
    // alert(params);
    const options = JSON.parse(params);
    this.InitCompleted = true;
    this.menuid = options.menuid;
    // alert(options.type);
    this.type = decodeURIComponent(options.type);
    // alert(this.type);
    this.param_report_date = '';
    if ( options.reportdate)
      this.param_report_date = options.reportdate;
    
    //let url = this.gs.CreateURL(this.menuid);
    //console.log(url);

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
    this.report_date = this.param_report_date;
    this.param_report_date = '';
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
          if ( !this.gs.isBlank(this.type)){
            this.distinctTab = 'SALESMAN';
            this.Detail_title = this.type ;
            this.ShowDetailReport('SCREEN', this.distinctTab, null,null);
            this.ShowDetail2();
            this.type='';
          }
        }
      },
        error => {
          this.loading = false;
          this.ReportDateList = null;
          this.ErrorMessage = this.gs.getError(error);
        });
  }

  ShowDetail(_rec: SalesFollowup) {

    if (_rec.row_type == "TOTAL")
      return;
    this.index1 = -1;
    this.index2 = -1;
    this.index3 = -1;

    this.report_date = _rec.report_date;
    this.currentTab = "DISTINCTLIST";
    this.distinctTab = "SALESMAN";
    this.RecordList = null;
    this.RecordDetList = null;
    this.ShowDistinctReport('SCREEN', 'SALESMAN');
  }

  ShowDetail2() {
    this.index1 = -1;
    this.index2 = -1;
    this.index3 = -1;
    // this.report_date = this.param_report_date;
    // alert(this.param_report_date);
    this.ShowDistinctReport('SCREEN', 'SALESMAN');
  }

  ShowDistinctReport(_type: string, _category: string) {

    this.distinctTab = _category;

    this.ErrorMessage = '';
    this.loading = true;
    this.SearchData.type = _category;
    this.SearchData.row_type = _type;
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
        if (_type == 'EXCEL') {
          this.Downloadfile(response.filename, response.filetype, response.filedisplayname);
        }
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

  ShowDetailReport(_type: string, _category: string, _rec: SalesFollowup, emailsent: any) {

    if (_rec != null ) {
      if ( _rec.row_type == "TOTAL")
        return;
    }

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

    this.SearchData.user_code = this.gs.globalVariables.user_code;
    this.SearchData.year_id = this.gs.globalVariables.year_pkid;
    this.SearchData.hostname = window.location.protocol + "//" + window.location.host;
    

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
          this.defaultto_ids = response.defaultto_ids;
          this.url = response.url;
          this.setMailBody(_category);
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
  setMailBody(_category: string) {

    var str = "";
    this.sSubject = "DEBTORS O/S FOLLOWUP AS ON " + this.report_date + " - ";
    if (_category == "SALESMAN")
      this.sSubject += this.SearchData.selected_sman_name;
    if (_category == "BRANCH")
      this.sSubject += this.SearchData.selected_branch;

      str ="";
      str += "<html>";
      str += "<h3>Dear Sir, </h3>";
      str += "<br><br>";
      str += "<h4>Please find the attached debtors o/s followup </h4>";
      str += "<br><br>";
      str += "<h4>Click Below Link to update remarks </h4>" ;
      str +=" <a href='" + this.url +"'>Click Here</a> ";
      str += "<br><br>";
      str += "</html>";
      


    this.sMsg = "Dear Sir,";
    this.sMsg += " \n\n";
    this.sMsg += "Please find the attached debtors o/s followup \n\n";
    
    this.sMsg += "Click Below Link to update followup remarks \n\n " ;
    
    this.sMsg +=" <html> <a href='" + this.url +"'>Open Software</a>  </html>";

    this.sMsg += " \n\n";

    //this.sMsg = str;
    
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
      if (_rec.row_type == "TOTAL")
        return;
      if (!confirm("Update Records " + _rec.report_date))
        return;
    }

    this.ErrorMessage = '';
    let SearchData2 = {
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
    this.Generate(SearchData2)
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
    let SearchData2 = {
      rowtype: this.type,
      pkid: Id,
      comp_code: this.gs.globalVariables.comp_code,
      branch_code: this.gs.globalVariables.branch_code,
      user_code: this.gs.globalVariables.user_code,
    };

    this.ErrorMessage = '';
    this.DeleteRecord(SearchData2)
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

  MailAll() {

    if (this.distinctTab == "PARTY" || this.distinctTab == "BRANCH") {
      alert("Please Select Salesman Wise and continue.... ")
      return;
    }

    let sdata: string = "";
    for (let rec of this.RecordList.filter(rec => rec.row_checked == true)) {
      if (sdata != "")
        sdata += ",";
      if (this.distinctTab == "SALESMAN")
        sdata += rec.sman_name;
    }

    if (sdata == "") {
      alert("No Rows Selected")
      return;
    }

    if (!confirm('Send Mail to Selected ' + this.distinctTab)) {
      return;
    }

    this.SearchData.row_type = 'MAIL';
    this.SearchData.type = this.distinctTab;
    this.SearchData.report_date = this.report_date;
    this.SearchData.pkid = this.gs.getGuid();
    this.SearchData.report_folder = this.gs.globalVariables.report_folder;
    this.SearchData.company_code = this.gs.globalVariables.comp_code;
    this.SearchData.branch_code = this.gs.globalVariables.branch_code
    this.SearchData.sman_name = this.gs.globalVariables.sman_name;
    this.SearchData.selected_sman_name = "";
    this.SearchData.selected_branch = "";
    this.SearchData.selected_brcode = "";
    this.SearchData.selected_cust_name = "";
    this.SearchData.isadmin = this.bAdmin;
    this.SearchData.iscompany = this.bCompany;
    this.SearchData.sdata = sdata;
    this.SearchData.user_pkid = this.gs.globalVariables.user_pkid;
    this.SearchData.user_code = this.gs.globalVariables.user_code;
    this.SearchData.year_id = this.gs.globalVariables.year_pkid;
    this.SearchData.hostname = window.location.protocol + "//" + window.location.host;

    this.loading = true;
    this.ErrorMessage = '';
    this.FollowupMailAll(this.SearchData)
      .subscribe(response => {
        this.loading = false;

        this.ErrorMessage = response.retmessage;
        alert(this.ErrorMessage);
      },
        error => {
          this.loading = false;
          this.ErrorMessage = this.gs.getError(error);
          alert(this.ErrorMessage);
        });
  }

  SelectDeselect() {
    this.selectall = !this.selectall;
    for (let rec of this.RecordList) {
      rec.row_checked = this.selectall;
    }
  }
  IsChecked(_rec: SalesFollowup) {
    _rec.row_checked = !_rec.row_checked;
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

  FollowupMailAll(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Report1/SalesFollowup/FollowupMailAll', SearchData, this.gs.headerparam2('authorized'));
  }

  InvoiceList(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Report1/SalesFollowup/InvoiceList', SearchData, this.gs.headerparam2('authorized'));
  }
}

