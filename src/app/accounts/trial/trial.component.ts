import { Component, Input, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { GlobalService } from '../../core/services/global.service';
import { LedgerReport } from '../models/ledgerreport';
import { AccReportService } from '../services/accreport.service';

import { Store } from '@ngrx/store';
import *  as trialactions from './trial.actions';
import *  as trialreducer from './trial.reducer';

import { TrialReportState } from './trial.model'
import { Observable } from 'rxjs';


@Component({
  selector: 'app-trial',
  templateUrl: './trial.component.html',
  providers: [AccReportService]
})

export class TrialComponent {
  // Local Variables 
  title = 'Trial Balance';

  @Input() menuid: string = '';
  @Input() type: string = '';

  
  menu_record: any;
  loading = false;
  
  sub: any;
  storesub: any;

  currentTab='LIST';

  ErrorMessage = "";

  pkid: string = '';
  urlid: string = '';
  searchstring = '';
  from_date: string = '';
  to_date: string = '';
  page_count: number = 0;
  page_current: number = 0;
  page_rowcount: number = 0;
  ismaincode: boolean = false;
  page_rows: number = 0;

  trialstate: Observable<TrialReportState>;
  RecordList: LedgerReport[] = [];
  
  SearchData = {
    pkid: '',
    urlid : '',
    type: '',
    subtype: '',
    report_folder: '',
    searchstring: '',
    from_date: '',
    to_date: '',
    ismaincode: false,
    page_count: 0,
    page_current: 0,
    page_rows: 0,
    page_rowcount: 0,
    hide_ho_entries: '',
    company_code: '',
    branch_code: '',
    year_code: '',    
  };
  

  constructor(
    private mainService: AccReportService,
    private route: ActivatedRoute,
    private location : Location,
    private gs: GlobalService,
    private store: Store<trialreducer.AppState>
  ) {
    // URL Query Parameter

    this.sub = this.route.queryParams.subscribe(params => {
      this.page_rows = 20;
      this.urlid = params["id"];
      if (params["parameter"] != "") {
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

    this.storesub = this.store.select(trialreducer.getTrialStateRec(this.urlid)).subscribe(rec => {
      if (rec) {
        this.RecordList = rec.records;
        this.pkid = rec.pkid;
        this.searchstring = rec.searchstring;
        this.from_date = rec.from_date;
        this.to_date = rec.to_date;
        this.ismaincode = rec.ismaincode;
        this.page_count = rec.page_count;
        this.page_current = rec.page_current;
        this.page_rowcount = rec.page_rowcount;
        this.InitSearchData();
      }
      else {
        this.RecordList = undefined;
        this.ismaincode = false;
        this.page_count = 0;
        this.page_current = 0;
        this.page_rowcount = 0;

        this.from_date = this.gs.globalVariables.year_start_date;
        this.to_date = this.gs.globalVariables.year_end_date;        

      }
    });

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


  InitSearchData(){

    this.SearchData.pkid = this.pkid;
    this.SearchData.company_code = this.gs.globalVariables.comp_code;
    this.SearchData.branch_code = this.gs.globalVariables.branch_code;
    this.SearchData.year_code = this.gs.globalVariables.year_code;
    this.SearchData.report_folder = this.gs.globalVariables.report_folder;
    this.SearchData.hide_ho_entries = this.gs.globalVariables.hide_ho_entries;

    this.SearchData.searchstring = this.searchstring.toUpperCase();
    this.SearchData.from_date = this.from_date;
    this.SearchData.to_date = this.to_date;
    this.SearchData.ismaincode = this.ismaincode;

    this.SearchData.page_count = this.page_count;
    this.SearchData.page_current = this.page_current;
    this.SearchData.page_rowcount = this.page_rowcount;
    this.SearchData.page_rows = this.page_rows;

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
    this.mainService.List(this.SearchData)
      .subscribe(response => {
        this.loading = false;
        if (_type == 'EXCEL')
          this.Downloadfile(_type);
        else {

          const state: TrialReportState = {
            urlid: this.urlid,
            pkid: this.pkid,
            searchstring : this.SearchData.searchstring,
            from_date : this.SearchData.from_date,
            to_date : this.SearchData.to_date ,
            ismaincode: this.SearchData.ismaincode,
            page_count: response.page_count,
            page_current: response.page_current,
            page_rowcount: response.page_rowcount,
            records: response.list
          };

          if (_type == "NEW")
            this.store.dispatch(new trialactions.Add(state));
          else
            this.store.dispatch(new trialactions.Update({ id: this.urlid, changes: state }));

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

  

  drilldown(rec : LedgerReport){
    let param = {
      menuid : 'LEDGER',
      isdrildown : true,
      acc_pkid : rec.acc_pkid,
      acc_code : rec.acc_code,
      acc_name : rec.acc_name,
      from_date : this.SearchData.from_date,
      to_date : this.SearchData.to_date,
      ismaincode : this.SearchData.ismaincode
    }
    this.gs.Naviagete("accounts/ledger",JSON.stringify(param));
  }

  Close() {
    this.store.dispatch(new trialactions.Delete({ id: this.urlid}));
    this.gs.ClosePage('home');
  }
}
