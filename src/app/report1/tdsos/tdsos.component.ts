import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { GlobalService } from '../../core/services/global.service';
import { SearchTable } from '../../shared/models/searchtable';
import { TdsOsReport } from '../models/tdsosreport';
import { RepService } from '../services/report.service';

@Component({
  selector: 'app-tdsos',
  templateUrl: './tdsos.component.html',
  providers: [RepService]
})

export class TdsosComponent {
  title = 'Tds OS Report'

  @Input() menuid: string = '';
  @Input() type: string = '';
  InitCompleted: boolean = false;
  menu_record: any;
  sub: any;
  urlid: string;

  ErrorMessage = "";
  mode = '';
  pkid = '';

  tds_paid: number = 0;
  tds_collected: number = 0;
  tds_pending: number = 0;

  branch_code: string = '';
  format_type: string = '';
  from_date: string = '';
  to_date: string = '';
  searchstring = '';
  display_format_type: string = '';

  bAdmin = false;
  bCompany = false;
  disableSave = true;
  loading = false;
  currentTab = 'LIST';

  all: boolean = false;

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
    format_type: '',
    all: false
  };

  // Array For Displaying List
  RecordList: TdsOsReport[] = [];
  //  Single Record for add/edit/view details
  Record: TdsOsReport = new TdsOsReport;

  constructor(
    private mainService: RepService,
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
    this.bCompany = false;
    this.menu_record = this.gs.getMenu(this.menuid);
    if (this.menu_record) {
      this.title = this.menu_record.menu_name;
      if (this.menu_record.rights_company)
        this.bCompany = true;
      if (this.menu_record.rights_admin)
        this.bAdmin = true;
    }
    this.initLov();
    this.LoadCombo();
    this.Init();
    this.List('SCREEN');
  }

  Init() {

  }

  // // Destroy Will be called when this component is closed
  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  initLov(caption: string = '') {

  }

  LovSelected(_Record: SearchTable) {
    if (_Record.controlname == "BRANCH") {
      this.branch_code = _Record.code;
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

  // // Query List Data
  List(_type: string) {

    this.ErrorMessage = '';
    this.loading = true;
    this.pkid = this.gs.getGuid();
    this.SearchData.pkid = this.pkid;
    this.SearchData.report_folder = this.gs.globalVariables.report_folder;
    this.SearchData.company_code = this.gs.globalVariables.comp_code;
    this.SearchData.branch_code = this.branch_code;
    this.SearchData.year_code = this.gs.globalVariables.year_code;
    this.SearchData.searchstring = this.searchstring.toUpperCase();
    this.SearchData.type = _type;
    this.SearchData.format_type = this.format_type;

    this.ErrorMessage = '';
    this.mainService.TdsosReport(this.SearchData)
      .subscribe(response => {
        this.loading = false;
        if (_type == 'EXCEL')
          this.Downloadfile(response.filename, response.filetype, response.filedisplayname);
        else {
          this.RecordList = response.list;
          for (let rec of this.RecordList.filter(rec => rec.row_type == 'TOTAL')) {
            this.tds_paid = rec.tds_amt;
            this.tds_collected = rec.collected_amt;
            this.tds_pending = rec.pending_amt;
          }
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

  OnChange(field: string) {
    this.RecordList = null;
  }

  OnBlur(field: string) {
    this.searchstring = this.searchstring.toUpperCase();
  }

  Close() {
    this.gs.ClosePage('home');
  }

}
