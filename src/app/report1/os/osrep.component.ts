import { Component, Input, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

import { ActivatedRoute } from '@angular/router';

import { GlobalService } from '../../core/services/global.service';

import { OsRep } from '../models/osrep';

import { RepService } from '../services/report.service';
import { SearchTable } from '../../shared/models/searchtable';
//EDIT-AJITH-25-09-2021

@Component({
  selector: 'app-osrep',
  templateUrl: './osrep.component.html',
  providers: [RepService]
})


export class OsRepComponent {
  // Local Variables 
  title = 'Os Report';

  @Input() menuid: string = '';
  @Input() type: string = '';
  InitCompleted: boolean = false;
  menu_record: any;

  disableSave = true;
  loading = false;

  loading2 = false;

  loading3 = false;

  currentTab = '';

  searchstring = '';

  sub: any;
  urlid: string;
  modal: any;

  mailtype: string = '';
  sSubject: string = '';
  sMsg: string = '';
  sHtml: string = '';
  previos_component_type: string;
  AttachList: any[] = [];

  iscompany = false;
  isadmin = false;
  IsHeader = false;
  category: string = 'OSLIST';

  PayTab = '';

  InvTab = 'BRANCH';

  period: string = '';

  ErrorMessage = "";


  pkid = '';

  SearchData = {
    pkid: '',
    type: '',
    subtype: '',
    report_folder: '',
    company_code: '',
    party: '',
    sman: '',
    branch: '',
    branch_code: '',
    year_code: '',

    iscompany: false,
    isadmin: false,
    filter_branch_code: '',
    filter_sman_id: '',
    filter_sman_name: '',

  };

  ChildData = {
    branch: '',
    branch_code: '',
    sman: '',
    party: '',
    iscompany: false,
    isadmin: false,
    filter_sman_id: '',
    filter_sman_name: '',
    category: '',
    previos_component_type: ''

  };

  // Array For Displaying List
  RecordList: OsRep[] = [];
  // Single Record for add/edit/view details
  Record: OsRep = new OsRep;

  AirList: OsRep[] = [];


  InvList: OsRep[] = [];

  constructor(
    private modalService: NgbModal,
    private mainService: RepService,
    private route: ActivatedRoute,
    public gs: GlobalService
  ) {


    // URL Query Parameter 
    this.sub = this.route.queryParams.subscribe(params => {
      if (params["parameter"] != "") {
        this.InitCompleted = true;
        var options = JSON.parse(params["parameter"]);
        this.menuid = options.menuid;
        this.currentTab = 'LIST';
        this.InitComponent();

        this.ResetControls();

        this.List('SCREEN', 'OSLIST');
        // this.AirListReport('SCREEN', 'BRANCH');
        // this.InvReport('SCREEN', 'BRANCH');


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

    this.menu_record = this.gs.getMenu(this.menuid);
    if (this.menu_record)
      this.title = this.menu_record.menu_name;


  }

  // Destroy Will be called when this component is closed
  ngOnDestroy() {
    if (this.sub != null)
      this.sub.unsubscribe();
  }



  ResetControls() {

    if (!this.menu_record)
      return;

    this.iscompany = false;
    this.isadmin = false;
    if (this.menu_record.rights_company)
      this.iscompany = true;
    if (this.menu_record.rights_admin)
      this.isadmin = true;

  }



  // Query List Data
  List(_type: string, _category: string) {

    this.loading = true;

    // OSLIST and SMANLIST

    if (_category == 'EXCEL')
      _category = this.category;

    if (_category != 'EXCEL-ALL')
      this.category = _category;

    if (this.category == 'OSLIST')
      this.title = 'OS - Branch Wise';
    if (this.category == 'SMANLIST')
      this.title = 'OS - Salesman Wise';
    if (this.category == 'PARTYLIST')
      this.title = 'OS - Party Wise';
    if (this.category == 'LEGAL') {
      this.title = 'OS - Legal Wise';

    }

    this.pkid = this.gs.getGuid();

    this.SearchData.type = _type;
    this.SearchData.subtype = _category;
    this.SearchData.pkid = this.pkid;
    this.SearchData.report_folder = this.gs.globalVariables.report_folder;
    this.SearchData.company_code = this.gs.globalVariables.comp_code;
    this.SearchData.branch_code = this.gs.globalVariables.branch_code;
    this.SearchData.year_code = this.gs.globalVariables.year_code;

    this.SearchData.isadmin = this.isadmin;
    this.SearchData.iscompany = this.iscompany;
    this.SearchData.filter_branch_code = this.gs.globalVariables.branch_code;
    this.SearchData.filter_sman_id = this.gs.globalVariables.sman_id;
    this.SearchData.filter_sman_name = this.gs.globalVariables.sman_name;


    this.ErrorMessage = '';
    this.mainService.OsReport(this.SearchData)
      .subscribe(response => {
        this.loading = false;
        if (_type == 'EXCEL')
          this.Downloadfile(response.filename, response.filetype, response.filedisplayname);

        else
          this.RecordList = response.list;
      },
        error => {
          this.loading = false;
          this.ErrorMessage = this.gs.getError(error);
        });
  }


  Downloadfile(filename: string, filetype: string, filedisplayname: string) {
    this.gs.DownloadFile(this.gs.globalVariables.report_folder, filename, filetype, filedisplayname);
  }






  Close() {
    this.gs.ClosePage('home');
  }


  openchild(_rec: OsRep) {
    if (this.category == 'OSLIST') {
      if (_rec.branch == 'TOTAL')
        return;
      this.ChildData.branch = _rec.branch;
      this.ChildData.branch_code = _rec.branch_code;

      this.ChildData.isadmin = this.isadmin;
      this.ChildData.iscompany = this.iscompany;
      this.ChildData.filter_sman_id = this.gs.globalVariables.sman_id;
      this.ChildData.filter_sman_name = this.gs.globalVariables.sman_name;

      this.currentTab = 'CHILD';
    }
    if (this.category == 'SMANLIST') {
      if (_rec.sman == 'TOTAL')
        return;
      this.ChildData.sman = _rec.sman;
      this.ChildData.isadmin = this.isadmin;
      this.ChildData.iscompany = this.iscompany;
      this.ChildData.filter_sman_id = this.gs.globalVariables.sman_id;
      this.ChildData.filter_sman_name = this.gs.globalVariables.sman_name;
      this.currentTab = 'CHILD2';
    }

    if (this.category == 'LEGAL') {
      if (_rec.party == 'TOTAL')
        return;
      if (_rec.branch == 'TOTAL')
        return;
      this.ChildData.branch = _rec.branch;
      this.ChildData.branch_code = _rec.branch_code;
      this.ChildData.sman = _rec.sman;
      this.ChildData.party = _rec.party;
      this.ChildData.isadmin = this.isadmin;
      this.ChildData.iscompany = this.iscompany;
      this.ChildData.category = this.category;
      this.ChildData.previos_component_type = this.category;
      //  this.ChildData.filter_sman_id = this.gs.globalVariables.sman_id;
      //  this.ChildData.filter_sman_name = this.gs.globalVariables.sman_name;
      this.currentTab = 'CHILD3';
    }
  }



  Mail(_type: string, mailsent: any) {

    this.mailtype = _type;
    if (_type == "OS-SALESMAN-ALL") {
      if (!confirm("Do you want to send Mail to all Sales Executives")) {
        return;
      }
    }
    this.loading = true;

    let eSearchData = {
      user_pkid: this.gs.globalVariables.user_pkid,
      user_code: this.gs.globalVariables.user_code,
      company_code: this.gs.globalVariables.comp_code,
      branch_code: this.gs.globalVariables.branch_code,
      email_type: _type,
      report_folder: this.gs.globalVariables.report_folder
    };


    this.ErrorMessage = '';
    this.gs.SendEmail(eSearchData)
      .subscribe(response => {
        this.loading = false;

        if (_type == "OS-SALESMAN-ALL") {
          if (response.retvalue)
            alert('Mail Sending Completed Successfully');
          else
            alert(response.error);
        } else {
          this.AttachList = new Array<any>();
          this.AttachList.push({ filename: response.filename, filetype: response.filetype, filedisplayname: response.filedisplayname });
          this.sSubject = response.subject;
          this.sHtml = response.message;
          this.open(mailsent);
        }
      },
        error => {
          this.loading = false;
          this.ErrorMessage = this.gs.getError(error);
        });
  }



  // Query List Data
  AirListReport(_type: string, _category: string) {

    this.loading2 = true;

    // OSLIST and SMANLIST


    this.PayTab = _category;

    let SearchData1 = {
      pkid: '',
      type: '',
      subtype: '',
      report_folder: '',
      company_code: '',
      party: '',
      sman: '',
      branch: '',
      branch_code: '',
      year_code: '',

      iscompany: false,
      isadmin: false,
      filter_branch_code: '',
      filter_sman_id: '',
      filter_sman_name: '',
    };


    this.pkid = this.gs.getGuid();

    SearchData1.type = _type;
    SearchData1.subtype = _category;
    SearchData1.pkid = this.pkid;
    SearchData1.report_folder = this.gs.globalVariables.report_folder;
    SearchData1.company_code = this.gs.globalVariables.comp_code;
    SearchData1.branch_code = this.gs.globalVariables.branch_code;
    SearchData1.year_code = this.gs.globalVariables.year_code;

    SearchData1.isadmin = this.isadmin;
    SearchData1.iscompany = this.iscompany;
    SearchData1.filter_branch_code = this.gs.globalVariables.branch_code;
    SearchData1.filter_sman_id = this.gs.globalVariables.sman_id;
    SearchData1.filter_sman_name = this.gs.globalVariables.sman_name;

    this.ErrorMessage = '';
    this.mainService.AirListReport(SearchData1)
      .subscribe(response => {
        this.loading2 = false;
        this.period = response.period;
        if (_type == 'EXCEL')
          this.Downloadfile(response.filename, response.filetype, response.filedisplayname);
        else
          this.AirList = response.list;
      },
        error => {
          this.loading2 = false;
          this.ErrorMessage = this.gs.getError(error);
        });
  }



  // Query List Data
  InvReport(_type: string, _category: string) {

    this.loading3 = true;

    // OSLIST and SMANLIST
    if (_type != 'EXCEL') {
      if (_category == 'BRANCH')
        this.InvTab = _category;
      else
        this.InvTab = 'DETAIL';
    }

    let SearchData1 = {
      pkid: '',
      type: '',
      subtype: '',
      report_folder: '',
      company_code: '',
      party: '',
      sman: '',
      branch: '',
      branch_code: '',
      year_code: '',

      iscompany: false,
      isadmin: false,
      filter_branch_code: '',
      filter_sman_id: '',
      filter_sman_name: '',
    };


    this.pkid = this.gs.getGuid();

    SearchData1.type = _type;
    SearchData1.subtype = _category;
    SearchData1.pkid = this.pkid;
    SearchData1.report_folder = this.gs.globalVariables.report_folder;
    SearchData1.company_code = this.gs.globalVariables.comp_code;
    SearchData1.branch_code = this.gs.globalVariables.branch_code;
    SearchData1.year_code = this.gs.globalVariables.year_code;

    SearchData1.isadmin = this.isadmin;
    SearchData1.iscompany = this.iscompany;
    SearchData1.filter_branch_code = this.gs.globalVariables.branch_code;
    SearchData1.filter_sman_id = this.gs.globalVariables.sman_id;
    SearchData1.filter_sman_name = this.gs.globalVariables.sman_name;

    this.ErrorMessage = '';
    this.mainService.InvListReport(SearchData1)
      .subscribe(response => {
        this.loading3 = false;
        if (_type == 'EXCEL')
          this.Downloadfile(response.filename, response.filetype, response.filedisplayname);
        else
          this.InvList = response.list;
      },
        error => {
          this.loading3 = false;
          this.ErrorMessage = this.gs.getError(error);
        });
  }


  OsBranchMail() {

    if (!confirm('Send Mail')) {
      return;
    }

    let SearchData1 = {
      report_folder: '',
      company_code: '',
      branch_code: '',
      user_pkid: '',
      user_code: '',
      user_name: ''
    };

    SearchData1.report_folder = this.gs.globalVariables.report_folder;
    SearchData1.company_code = this.gs.globalVariables.comp_code;
    SearchData1.branch_code = this.gs.globalVariables.branch_code
    SearchData1.user_pkid = this.gs.globalVariables.user_pkid;
    SearchData1.user_code = this.gs.globalVariables.user_code;
    SearchData1.user_name = this.gs.globalVariables.user_name;

    this.loading = true;
    this.ErrorMessage = '';
    this.mainService.OsBranchWiseMail(SearchData1)
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



  open(content: any) {
    this.modal = this.modalService.open(content);
  }

}
