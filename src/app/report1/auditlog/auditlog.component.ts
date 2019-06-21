import { Component, Input, OnInit, OnDestroy, ViewChild, AfterViewInit, Output, EventEmitter, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GlobalService } from '../../core/services/global.service';
import { SearchTable } from '../../shared/models/searchtable';
import { Auditlog } from '../models/auditlog';
import { RepService } from '../services/report.service';

@Component({
  selector: 'app-auditlog',
  templateUrl: './auditlog.component.html',
  providers: [RepService]
})
export class AuditLogComponent {
  // Local Variables 
  title = 'Audit Details';

  @Input() public type: string = '';
  @Input() menuid: string = '';

  menu_record: any;
  InitCompleted: boolean = false;
  disableSave = true;
  loading = false;
  currentTab = 'LIST';
  sub: any;
  urlid: string;

  pkid: string;
  searchstring: string = '';
  from_date: string = '';
  to_date: string = '';
  page_count: number = 0;
  page_current: number = 0;
  page_rowcount: number = 0;
  page_rows: number = 0;

  ErrorMessage = "";
  InfoMessage = "";
  RecordList: Auditlog[] = [];
  
  constructor(
    private mainService: RepService,
    private route: ActivatedRoute,
    private gs: GlobalService
  ) {
    this.page_count = 0;
    this.page_rows = 50;
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

    this.ErrorMessage = '';
    //if (this.from_date.trim().length <= 0) {
    //  this.ErrorMessage = "From Date Cannot Be Blank";
    //  return;
    //}
    //if (this.to_date.trim().length <= 0) {
    //  this.ErrorMessage = "To Date Cannot Be Blank";
    //  return;
    //}

    this.loading = true;
    let SearchData = {
        pkid: this.pkid,
        type: _type,
        rowtype: this.type,
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

    this.ErrorMessage = '';
    this.mainService.AuditLog(SearchData)
      .subscribe(response => {
        this.loading = false;
          this.RecordList = response.list;
          this.page_count = response.page_count;
          this.page_current = response.page_current;
          this.page_rowcount = response.page_rowcount;
      },
      error => {
        this.loading = false;
        this.RecordList = null;
        this.ErrorMessage = this.gs.getError(error);
      });
  }
 
}
