
import { Component, Input, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';

import { ActivatedRoute } from '@angular/router';

import { GlobalService } from '../../core/services/global.service';

import { LedgerReport } from '../models/ledgerreport';

import { AccReportService } from '../services/accreport.service';


@Component({
  selector: 'app-pandl',
  templateUrl: './pandl.component.html',
  providers: [AccReportService]
})

export class PandLComponent {
  // Local Variables 
  title = 'P&L Report';

  @Input() menuid: string = '';
  @Input() type: string = '';
  InitCompleted: boolean = false;
  menu_record: any;

  disableSave = true;
  loading = false;
  currentTab = 'LIST';

  searchstring = '';
  page_count = 0;
  page_current = 0;
  page_rows = 0;
  page_rowcount = 0;

  sub: any;
  urlid: string;

  from_date: string;
  to_date: string;
  ismaincode: boolean = false;
  ismonthwise: boolean = false;

  ismonthwiseformat = true;

  ErrorMessage = "";

  mode = '';
  pkid = '';


  SearchData = {
    type: '',
    subtype: '',
    pkid: '',
    report_folder: '',
    company_code: '',
    branch_code: '',
    year_code: '',
    searchstring: '',
    from_date: '',
    to_date: '',
    ismaincode: false,
    ismonthwise : false,
    page_count: 0,
    page_current: 0,
    page_rows: 0,
    page_rowcount: 0,
    hide_ho_entries : '',
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
    this.page_count = 0;
    this.page_rows = 10;
    this.page_current = 0;


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

    this.menu_record = this.gs.getMenu(this.menuid);
    if (this.menu_record)
      this.title = this.menu_record.menu_name;

    this.from_date = this.gs.globalVariables.year_start_date;
    this.to_date = this.gs.globalVariables.year_end_date;

    this.LoadCombo();


  }

  // Destroy Will be called when this component is closed
  ngOnDestroy() {
    this.sub.unsubscribe();
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
    if (this.from_date.trim().length <= 0) {
      this.ErrorMessage = 'From Date Cannot Be Blank';
      return;
    }
    if (this.to_date.trim().length <= 0) {
      this.ErrorMessage = 'To Date Cannot Be Blank';
      return;
    }

    this.loading = true;


    this.pkid = this.gs.getGuid();
    this.SearchData.pkid = this.pkid;
    this.SearchData.report_folder = this.gs.globalVariables.report_folder;
    this.SearchData.company_code = this.gs.globalVariables.comp_code;
    this.SearchData.branch_code = this.gs.globalVariables.branch_code;
    this.SearchData.year_code = this.gs.globalVariables.year_code;
    this.SearchData.searchstring = this.searchstring.toUpperCase();
    this.SearchData.from_date = this.from_date;
    this.SearchData.to_date = this.to_date;
    this.SearchData.ismaincode = this.ismaincode;
    this.SearchData.ismonthwise = this.ismonthwise;
    this.SearchData.hide_ho_entries = this.gs.globalVariables.hide_ho_entries;

    this.SearchData.type = _type;
    this.SearchData.subtype = '';

    this.ErrorMessage = '';
    this.mainService.PandLList(this.SearchData)
      .subscribe(response => {
        this.loading = false;
        if (_type == 'EXCEL')
          this.Downloadfile(response.filename, response.filetype, response.filedisplayname);
        else {
          this.RecordList = response.list;
          this.ismonthwiseformat = this.ismonthwise;
        }
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
}
