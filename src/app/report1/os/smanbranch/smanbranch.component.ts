
import { Component, Input, Output, OnInit, OnDestroy, ViewChild, EventEmitter, ElementRef } from '@angular/core';

import { ActivatedRoute } from '@angular/router';

import { GlobalService } from '../../../core/services/global.service';

import { OsRep } from '../../models/osrep';

import { RepService } from '../../services/report.service';


@Component({
  selector: 'app-ossmanbranch',
  templateUrl: './smanbranch.component.html',
  providers: [RepService]
})


export class OsSmanBranchComponent {
  // Local Variables 
  title = 'Branch Wise';

  @Input() ParentData: any;

  @Input() menuid: string = '';
  @Input() type: string = '';


  @Output() Return2Parent = new EventEmitter<string>();

  InitCompleted: boolean = false;
  menu_record: any;

  disableSave = true;
  loading = false;
  currentTab = '';

  searchstring = '';
  branch_code = "HOCPL";
  sub: any;
  urlid: string;


  ChildData = {
    branch: '',
    branch_code: '',
    sman: '',
    party: '',
    iscompany: false,
    isadmin: false,
    filter_sman_id: '',
    filter_sman_name: '',
  };


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


  // Array For Displaying List
  RecordList: OsRep[] = [];
  // Single Record for add/edit/view details
  Record: OsRep = new OsRep;

  constructor(
    private mainService: RepService,
    private route: ActivatedRoute,
    private gs: GlobalService
  ) {


  }

  // Init Will be called After executing Constructor
  ngOnInit() {

    this.currentTab = 'LIST';
    this.List('SCREEN');

    this.title = 'Salesman Wise - ' + this.ParentData.sman;

  }

  InitComponent() {

    this.menu_record = this.gs.getMenu(this.menuid);
    if (this.menu_record)
      this.title = this.menu_record.menu_name;

  }

  // Destroy Will be called when this component is closed
  ngOnDestroy() {
  }



  ResetControls() {
    this.disableSave = true;
    if (!this.menu_record)
      return;

    if (this.menu_record.rights_admin)
      this.disableSave = false;

    return this.disableSave;
  }

  // Query List Data
  List(_type: string) {

    this.loading = true;

    this.pkid = this.gs.getGuid();

    this.SearchData.type = _type;
    this.SearchData.subtype = 'SMANPARTYBRANCHWISE';
    this.SearchData.pkid = this.pkid;
    this.SearchData.report_folder = this.gs.globalVariables.report_folder;
    this.SearchData.company_code = this.gs.globalVariables.comp_code;
    this.SearchData.year_code = this.gs.globalVariables.year_code;
    this.SearchData.branch = this.ParentData.branch;
    //this.SearchData.branch_code = this.ParentData.branch_code;
    this.SearchData.branch_code = this.branch_code;
    this.SearchData.sman = this.ParentData.sman;


    this.SearchData.isadmin = this.ParentData.isadmin;
    this.SearchData.iscompany = this.ParentData.iscompany;
    this.SearchData.filter_branch_code = this.gs.globalVariables.branch_code;
    this.SearchData.filter_sman_id = this.gs.globalVariables.sman_id;
    this.SearchData.filter_sman_name = this.gs.globalVariables.sman_name;

    this.ErrorMessage = '';
    this.mainService.OsReport(this.SearchData)
      .subscribe(response => {
        this.loading = false;
        if (_type == 'EXCEL')
          this.Downloadfile(response.filename, response.filetype, response.filedisplayname)
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
    this.Return2Parent.emit('LIST');

  }


  openchild(_rec: OsRep) {
    if (_rec.party == 'TOTAL')
      return;
    if (_rec.branch == 'TOTAL')
      return;
    this.ChildData.branch = _rec.branch;
    this.ChildData.branch_code = _rec.branch_code;
    this.ChildData.sman = _rec.sman;
    this.ChildData.party = _rec.party;

    this.ChildData.isadmin = this.ParentData.isadmin;
    this.ChildData.iscompany = this.ParentData.iscompany;
    this.ChildData.filter_sman_id = this.gs.globalVariables.sman_id;
    this.ChildData.filter_sman_name = this.gs.globalVariables.sman_name;


    this.currentTab = 'CHILD';
  }

  Mail() {

    if (!confirm("Do you want to send Mail to " + this.ParentData.sman)) {
      return;
    }

    this.loading = true;
    let eSearchData = {
      user_pkid: this.gs.globalVariables.user_pkid,
      user_code: this.gs.globalVariables.user_code,
      company_code: this.gs.globalVariables.comp_code,
      branch_code: this.gs.globalVariables.branch_code,
      email_type: "OS-SALESMAN-ALL",
      report_folder: this.gs.globalVariables.report_folder,
      os_history_sent_on: 'MONDAY',
      single_mail: 'Y',
      mail_sman_name: this.ParentData.sman,
      test_mail: 'N'
    };

    this.ErrorMessage = '';
    this.gs.SendEmail(eSearchData)
      .subscribe(response => {
        this.loading = false;
        if (response.retvalue)
          alert('Mail Sent Successfully');
        else
          alert(response.error);
      },
        error => {
          this.loading = false;
          this.ErrorMessage = this.gs.getError(error);
        });
  }
}
