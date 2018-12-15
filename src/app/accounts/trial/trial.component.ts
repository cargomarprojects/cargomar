import { Component, Input, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
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


  InitCompleted: boolean = false;
  menu_record: any;

  disableSave = true;
  loading = false;
  currentTab = 'LIST';

  searchstring = '';
  sub: any;
  ErrorMessage = "";
  mode = '';

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
    page_count: 0,
    page_current: 0,
    page_rows: 0,
    page_rowcount: 0,
    hide_ho_entries: '',
  };

  from_date: string = '';
  to_date: string = '';
  pkid: string = '';
  private urlid: string = '';
  page_count: number = 0;
  page_current: number = 0;
  page_rowcount: number = 0;
  ismaincode: boolean = false;

  page_rows: number = 0;

  trialstate: Observable<TrialReportState>;

  storesub: any;

  // Array For Displaying List
  RecordList: LedgerReport[] = [];


  // Single Record for add/edit/view details
  Record: LedgerReport = new LedgerReport;

  constructor(
    private mainService: AccReportService,
    private route: ActivatedRoute,
    private gs: GlobalService,
    private store: Store<trialreducer.AppState>
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
    /*
      if (!this.InitCompleted) {
          this.InitComponent();
      }
    */
  }

  InitComponent() {

    this.menu_record = this.gs.getMenu(this.menuid);
    if (this.menu_record)
      this.title = this.menu_record.menu_name;

    this.from_date = this.gs.globalVariables.year_start_date;
    this.to_date = this.gs.globalVariables.year_end_date;

    //this.RecordList = state.entities

    this.storesub = this.store.select(trialreducer.getTrialStateRec(this.urlid)).subscribe(rec => {
      if (rec) {
        this.RecordList = rec.records;
        this.pkid = rec.pkid;
        this.urlid = rec.urlid;
        this.ismaincode = rec.ismaincode;
        this.page_count = rec.page_count;
        this.page_current = rec.page_current;
        this.page_rowcount = rec.page_rowcount;
      }
      else {
        this.RecordList = undefined;
        this.page_count = 0;
        this.page_current = 0;
        this.page_rowcount = 0;
      }
    });

  }

  // Destroy Will be called when this component is closed
  ngOnDestroy() {
    this.sub.unsubscribe();
    this.storesub.unsubscribe();
  }

  //function for handling LIST/NEW/EDIT Buttons
  ActionHandler(action: string, id: string) {
    this.ErrorMessage = '';
    if (action == 'LIST') {
      this.mode = '';
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

    if (_type == "NEW") {
      this.pkid = this.gs.getGuid();
    }

    this.SearchData.pkid = this.pkid;
    this.SearchData.report_folder = this.gs.globalVariables.report_folder;
    this.SearchData.company_code = this.gs.globalVariables.comp_code;
    this.SearchData.branch_code = this.gs.globalVariables.branch_code;
    this.SearchData.year_code = this.gs.globalVariables.year_code;
    this.SearchData.searchstring = this.searchstring.toUpperCase();
    this.SearchData.from_date = this.from_date;
    this.SearchData.to_date = this.to_date;
    this.SearchData.ismaincode = this.ismaincode;
    this.SearchData.hide_ho_entries = this.gs.globalVariables.hide_ho_entries;
    this.SearchData.type = _type;
    this.SearchData.subtype = '';
    this.SearchData.page_count = this.page_count;
    this.SearchData.page_current = this.page_current;
    this.SearchData.page_rowcount = this.page_rowcount;
    this.SearchData.page_rows = this.page_rows;

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
            ismaincode: this.ismaincode,
            page_count: response.page_count,
            page_current: response.page_current,
            page_rowcount: response.page_rowcount,
            records: response.list,
            selectedid: this.urlid
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

  Close() {
    this.gs.ClosePage('home');
  }
}
