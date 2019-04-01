
import { Component, Input, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';

import { ActivatedRoute } from '@angular/router';

import { GlobalService } from '../../core/services/global.service';

import { LedgerReport } from '../models/ledgerreport';

import { AccReportService } from '../services/accreport.service';
import { SearchTable } from '../../shared/models/searchtable';


@Component({
  selector: 'app-ccreport',
  templateUrl: './ccreport.component.html',
  providers: [AccReportService]
})

export class CcReportComponent {
  // Local Variables 
  title = 'Cost Center Report';

  @Input() menuid: string = '';
  @Input() type: string = '';
  InitCompleted: boolean = false;
  menu_record: any;

  disableSave = true;
  loading = false;
  currentTab = 'LIST';

  showIncExpOnly: boolean = false;
  bAdmin: boolean = false;


  searchstring = '';

  sub: any;
  urlid: string;
  cc_type: string = "";

  to_date: string;
  from_date: string;

  CCRECORD: SearchTable = new SearchTable();

  ErrorMessage = "";

  mode = '';
  pkid = '';

  SearchData = {
    type: '',
    pkid: '',
    report_folder: '',
    company_code: '',
    branch_code: '',
    year_code: '',
    searchstring: '',
    from_date: '',
    to_date: '',
    showIncExpOnly: '',
    cc_id: '',
    cc_code: '',
    cc_name: '',
    cc_type: '',
    hide_ho_entries: '',
    cc_update: ''
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
    this.bAdmin = false;
    this.menu_record = this.gs.getMenu(this.menuid);
    if (this.menu_record) {
      this.title = this.menu_record.menu_name;
      if (this.menu_record.rights_admin)
        this.bAdmin = true;
    }

    this.from_date = "";
    this.to_date = "";

    this.LoadCombo();
    this.InitLov();

  }

  // Destroy Will be called when this component is closed
  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  InitLov() {
    this.CCRECORD = new SearchTable();
    this.CCRECORD.controlname = "COSTCENTERM";
    this.CCRECORD.displaycolumn = "CODE";
    this.CCRECORD.type = "COSTCENTERM";
    this.CCRECORD.id = "";
    this.CCRECORD.code = "";
    this.CCRECORD.name = "";

  }

  LovSelected(_Record: SearchTable) {

    if (_Record.controlname == "COSTCENTERM") {

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
  List(_type: string, _CanUpdate: string) {

    if (this.cc_type.trim().length <= 0) {
      this.ErrorMessage = 'Type Cannot Be Blank';
      alert(this.ErrorMessage);
      return;
    }
    if (this.CCRECORD.id.trim().length <= 0) {
      this.ErrorMessage = 'Code Cannot Be Blank';
      alert(this.ErrorMessage);
      return;
    }

    if (_CanUpdate == "Y" && !(this.cc_type == "MBL SEA EXPORT" || this.cc_type == "MBL SEA IMPORT" || this.cc_type == "MAWB AIR EXPORT" || this.cc_type == "MAWB AIR IMPORT")) {
      this.ErrorMessage = " Please select Master CC type and continue....";
      alert(this.ErrorMessage);
      return;
    }

    this.loading = true;

    this.pkid = this.gs.getGuid();
    this.SearchData.type = _type;
    this.SearchData.pkid = this.pkid;
    this.SearchData.hide_ho_entries = this.gs.globalVariables.hide_ho_entries;
    this.SearchData.report_folder = this.gs.globalVariables.report_folder;
    this.SearchData.company_code = this.gs.globalVariables.comp_code;
    this.SearchData.branch_code = this.gs.globalVariables.branch_code;
    this.SearchData.year_code = this.gs.globalVariables.year_code;
    this.SearchData.searchstring = this.searchstring.toUpperCase();
    this.SearchData.from_date = this.from_date;
    this.SearchData.to_date = this.to_date;
    this.SearchData.cc_id = this.CCRECORD.id;
    this.SearchData.cc_code = this.CCRECORD.code;
    this.SearchData.cc_name = this.CCRECORD.name;
    this.SearchData.cc_type = this.cc_type;
    this.SearchData.showIncExpOnly = (this.showIncExpOnly) ? 'Y' : 'N';
    this.SearchData.cc_update = _CanUpdate;


    this.ErrorMessage = '';
    this.mainService.CcReport(this.SearchData)
      .subscribe(response => {
        this.loading = false;
        if (_type == 'EXCEL')
          this.Downloadfile(_type);
        else {
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
    if (field == 'cc_type') {
      this.ChangeCCList();

    }
  }
  ChangeCCList() {
    let sWhere: string = '';

    sWhere = " cc_type ='" + this.cc_type + "'"
    if (this.cc_type != "EMPLOYEE")
      sWhere += " and cc_year =" + this.gs.globalVariables.year_code;
      
    this.CCRECORD.where = sWhere;
  }

  Close() {
    this.gs.ClosePage('home');
  }


}
