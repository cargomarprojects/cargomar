import { Component, Input, OnInit, OnDestroy, ViewChild, AfterViewInit, Output, EventEmitter, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GlobalService } from '../../core/services/global.service';
import { SearchTable } from '../../shared/models/searchtable';
import { Ftplog } from '../../shared/models/ftplog';

@Component({
  selector: 'app-ftpreport',
  templateUrl: './ftpreport.component.html',
})
export class FtpReportComponent {
  // Local Variables 
  title = 'FTP Details';

  @Input() public pkid: string;
  @Input() public type: string = '';
  @Input() menuid: string = '';

  menu_record: any;
  InitCompleted: boolean = false;
  disableSave = true;
  loading = false;
  currentTab = 'LIST';
  sub: any;
  urlid: string;

  searchstring: string = '';
  ftptype: string = '';
  from_date: string = '';
  to_date: string = '';
  page_count: number = 0;
  page_current: number = 0;
  page_rowcount: number = 0;
  page_rows: number = 0;

  ErrorMessage = "";
  InfoMessage = "";
  RecordList: Ftplog[] = [];
  FtpTypeList: any[] = [];
  constructor(
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
    this.LoadCombo();
    this.SearchRecord("param", "");
  }

  InitComponent() {
    this.menu_record = this.gs.getMenu(this.menuid);
    if (this.menu_record) {
      this.title = this.menu_record.menu_name;
    }
    this.InitLov();
  }

  InitLov() {
  }
  LovSelected(_Record: SearchTable) {
  }
  // Destroy Will be called when this component is closed
  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  LoadCombo() {
  }

  // Save Data
  OnBlur(field: string) {

  }
  Close() {
    this.gs.ClosePage('home');
  }

  List(_type: string) {
    this.SearchRecord("ftpreport", _type);
  }
  SearchRecord(controlname: string, _type: string) {
    this.InfoMessage = '';
    this.ErrorMessage = '';
    if (this.type == "FTPLOGREPORT")
      this.page_rows = 30;
    else
      this.page_rows = 10;
    this.loading = true;
    let SearchData = {
      table: controlname,
      param_type: 'PARAM',
      pkid: this.pkid,
      type: _type,
      rowtype: this.type,
      ftpto: this.ftptype,
      searchstring: this.searchstring.toUpperCase(),
      comp_code: this.gs.globalVariables.comp_code,
      branch_code: this.gs.globalVariables.branch_code,
      user_pkid: this.gs.globalVariables.user_pkid,
      year_code: this.gs.globalVariables.year_code,
      page_count: this.page_count,
      page_current: this.page_current,
      page_rows: this.page_rows,
      page_rowcount: this.page_rowcount,
      from_date: this.from_date,
      to_date: this.to_date
    };

    // SearchData.table = controlname;
    // SearchData.pkid = this.pkid;
    // SearchData.rowtype = this.type;
    // SearchData.company_code = this.gs.globalVariables.comp_code;
    // SearchData.branch_code = this.gs.globalVariables.branch_code;
    // SearchData.user_pkid = this.gs.globalVariables.user_pkid;

    this.gs.SearchRecord(SearchData)
      .subscribe(response => {
        this.loading = false;
        this.InfoMessage = '';
        if (controlname == "param") {
          this.FtpTypeList = response.param;
          this.SearchRecord("ftpreport", "LOAD");
        }
        else {
          this.RecordList = response.ftpreport;
          this.page_count = response.page_count;
          this.page_current = response.page_current;
          this.page_rowcount = response.page_rowcount;
        }
      },
        error => {
          this.loading = false;
          this.ErrorMessage = this.gs.getError(error);
        });
  }
}
