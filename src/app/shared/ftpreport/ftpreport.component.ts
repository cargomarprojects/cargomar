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
  xmlpending: boolean = false;
  search_xmlpending: boolean = false;

  report_format: string = "DEFAULT";
  search_report_format: string = "DEFAULT";
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
    if (this.type == 'FTPLOGREPORT') {
      this.ftptype = 'RITRA';
      this.from_date = this.gs.getNewdate(-5);
      this.to_date = this.gs.defaultValues.today;
    }
  }

  // Save Data
  OnBlur(field: string) {

  }
  Close() {
    this.gs.ClosePage('home');
  }

  List(_type: string) {
    this.search_report_format = this.report_format;
    this.search_xmlpending = this.xmlpending;
    this.SearchRecord("ftpreport", _type);
  }
  SearchRecord(controlname: string, _type: string, _mblid: string = "") {
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
      user_code: this.gs.globalVariables.user_code,
      year_code: this.gs.globalVariables.year_code,
      page_count: this.page_count,
      page_current: this.page_current,
      page_rows: this.page_rows,
      page_rowcount: this.page_rowcount,
      from_date: this.from_date,
      to_date: this.to_date,
      report_format: this.report_format,
      mblid: _mblid,
      xmlpending: this.xmlpending
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
        else if (controlname == "ftpmanualsent") {
          if (response.status == 'OK') {
            this.RecordList.splice(this.RecordList.findIndex(rec => rec.ftp_mbl_id == _mblid), 1);
            alert("Successfully Update")
          }
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


  SentManually(rec: Ftplog) {
    this.ErrorMessage = '';
    if (rec.ftp_mbl_id.trim().length <= 0) {
      this.ErrorMessage = "Invalid ID";
      alert(this.ErrorMessage);
      return;
    }

    if (!confirm("Remove From Pending List?")) {
      return;
    }

    this.SearchRecord("ftpmanualsent", "UPDATE", rec.ftp_mbl_id);
  }
}
