
import { Component, Input, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';

import { ActivatedRoute } from '@angular/router';

import { GlobalService } from '../../core/services/global.service';

import { LedgerReport } from '../models/ledgerreport';

import { AccReportService } from '../services/accreport.service';


import { Store } from '@ngrx/store';
import *  as pandlactions from './pandl.actions';
import *  as pandlreducer from './pandl.reducer';

import { PandlReportState } from './pandl.model'
import { Observable } from 'rxjs';


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

  loading = false;
  currentTab = 'LIST';

  searchstring = '';

  sub: any;
  storesub: any;

  pkid = '';
  urlid: string;
  from_date: string;
  to_date: string;
  ismaincode: boolean = false;
  ismonthwise: boolean = false;
  ismonthwiseformat = true;
  page_count = 0;
  page_current = 0;
  page_rows = 0;
  page_rowcount = 0;

  ErrorMessage = "";

  SearchData = {
    type: '',
    urlid: '',
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
    ismonthwise: false,
    page_count: 0,
    page_current: 0,
    page_rows: 0,
    page_rowcount: 0,
    hide_ho_entries: '',
    print_excel: false,
    branch_codes: '',
  };

  // Array For Displaying List
  pandlstate: Observable<PandlReportState>;
  RecordList: LedgerReport[] = [];
  // Single Record for add/edit/view details
  Record: LedgerReport = new LedgerReport;
  BranchList: any[] = [];
  constructor(
    private mainService: AccReportService,
    private route: ActivatedRoute,
    private gs: GlobalService,
    private store: Store<pandlreducer.AppState>
  ) {
    // URL Query Parameter 
    this.sub = this.route.queryParams.subscribe(params => {
      this.page_rows = 20;
      this.urlid = params["id"];
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
  }

  InitComponent() {

    this.menu_record = this.gs.getMenu(this.menuid);
    if (this.menu_record)
      this.title = this.menu_record.menu_name;

    this.storesub = this.store.select(pandlreducer.getPandlStateRec(this.urlid)).subscribe(rec => {
      if (rec) {
        this.RecordList = rec.records;
        this.pkid = rec.pkid;
        this.searchstring = rec.searchstring;
        this.from_date = rec.from_date;
        this.to_date = rec.to_date;
        this.ismaincode = rec.ismaincode;
        this.ismonthwise = rec.ismonthwise;
        this.ismonthwiseformat = rec.ismonthwise;
        this.page_count = rec.page_count;
        this.page_current = rec.page_current;
        this.page_rowcount = rec.page_rowcount;
        this.InitSearchData();
      }
      else {
        this.RecordList = undefined;
        this.ismaincode = false;
        this.ismonthwiseformat = false;
        this.page_count = 0;
        this.page_current = 0;
        this.page_rowcount = 0;
        this.from_date = this.gs.globalVariables.year_start_date;
        this.to_date = this.gs.globalVariables.year_end_date;
      }
    });





  }

  InitSearchData() {
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

  }

  // Destroy Will be called when this component is closed
  ngOnDestroy() {
    this.sub.unsubscribe();
    this.storesub.unsubscribe();
  }



  ResetControls() {
    if (!this.menu_record)
      return;
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

    if (_type == "NEW") {
      this.pkid = this.gs.getGuid();
      this.InitSearchData();
    }

    this.SearchData.type = _type;
    this.SearchData.subtype = '';

    this.ErrorMessage = '';
    this.mainService.PandLList(this.SearchData)
      .subscribe(response => {
        this.loading = false;
        if (_type == 'EXCEL')
          this.Downloadfile(response.filename, response.filetype, response.filedisplayname);
        else {

          const state: PandlReportState = {
            urlid: this.urlid,
            pkid: this.pkid,
            searchstring: this.SearchData.searchstring,
            from_date: this.SearchData.from_date,
            to_date: this.SearchData.to_date,
            ismaincode: this.SearchData.ismaincode,
            ismonthwise: this.SearchData.ismonthwise,
            page_count: response.page_count,
            page_current: response.page_current,
            page_rowcount: response.page_rowcount,
            records: response.list
          };

          this.store.dispatch(new pandlactions.Update({ id: this.urlid, changes: state }));
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


  drilldown(rec: LedgerReport) {
    let param = {
      menuid: 'LEDGER',
      isdrildown: true,
      acc_pkid: rec.acc_pkid,
      acc_code: rec.acc_code,
      acc_name: rec.acc_name,
      from_date: this.SearchData.from_date,
      to_date: this.SearchData.to_date,
      ismaincode: this.SearchData.ismaincode
    }
    this.gs.Naviagete("accounts/ledger", JSON.stringify(param));
  }



  Close() {
    this.store.dispatch(new pandlactions.Delete({ id: this.urlid }));
    this.gs.ClosePage('home');

  }


  getAllBranch() {

    let branch_codes = '';
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
    this.SearchData.company_code = this.gs.globalVariables.comp_code;
    this.mainService.getAllBranch(this.SearchData)
      .subscribe(response => {
        this.loading = false;
        this.BranchList = response.branchlist;
        branch_codes = '';
        for (let rec of this.BranchList) {
          if (branch_codes != '')
            branch_codes += ",";
          branch_codes += rec.comp_code;
        }
        this.InitSearchData();
        this.SearchData.type = 'CONSOL';
        this.SearchData.subtype = '';
        this.SearchData.print_excel = false;
        this.SearchData.branch_codes='';
        for (let rec of this.BranchList) {
          this.SearchData.branch_code = rec.comp_code;
          this.SearchData.type = 'CONSOL';
          this.SearchData.branch_codes = branch_codes;
          this.ConsolList();
        }

      },
        error => {
          this.loading = false;
          this.ErrorMessage = this.gs.getError(error);
        });
  }

  ConsolList() {
    this.loading = true;
    this.ErrorMessage = '';
    this.mainService.PandLList(this.SearchData)
      .subscribe(response => {
        this.loading = false;

        if (response.filename!='.xls')
          this.Downloadfile(response.filename, response.filetype, response.filedisplayname);

      },
        error => {
          this.loading = false;
          this.ErrorMessage = this.gs.getError(error);
        });
  }
}
