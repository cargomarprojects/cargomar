import { Component, Input, OnInit, OnDestroy, ViewChild, AfterViewInit, Output, EventEmitter, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GlobalService } from '../../core/services/global.service';
import { SearchTable } from '../../shared/models/searchtable';
import { Auditlog } from '../../shared/models/auditlog';


@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
})
export class HistoryComponent {
  // Local Variables 
  title = 'History Details';
  
  @Input() public pkid: string;
  @Input() public type: string = '';
  
  InitCompleted: boolean = false;
  disableSave = true;
  loading = false;
  currentTab = 'LIST';
  sub: any;
  urlid: string;
  
  ErrorMessage = "";
  InfoMessage = "";
  RecordList: Auditlog[] = [];
  constructor(
    private route: ActivatedRoute,
    private gs: GlobalService
  ) {
    // URL Query Parameter 
  }

  // Init Will be called After executing Constructor
  ngOnInit() {
    this.LoadCombo();
    this.SearchRecord("history");
  }

  InitComponent() {
    this.InitLov();
  }

  InitLov() {

   
  }
  LovSelected(_Record: SearchTable) {
   
  }
  // Destroy Will be called when this component is closed
  ngOnDestroy() {
   // this.sub.unsubscribe();
  }

  LoadCombo() {
   
   
  }
  
  // Save Data
  OnBlur(field: string) {

  }
  Close() {
    
  }
  
  SearchRecord(controlname: string) {
    this.InfoMessage = '';
    this.ErrorMessage = '';
    if (this.pkid.trim().length <= 0) {
      this.ErrorMessage = "Invalid ID";
      return;
    }
    if (this.type.trim().length <= 0) {
      this.ErrorMessage = "Invalid Type";
      return;
    }
     
    this.loading = true;
    let SearchData = {
      table: controlname,
      pkid: '',
      rowtype: this.type,
      company_code: this.gs.globalVariables.comp_code,
      branch_code: this.gs.globalVariables.branch_code,
      user_pkid: this.gs.globalVariables.user_pkid
    };

    SearchData.table = controlname;
    SearchData.pkid = this.pkid;
    SearchData.rowtype = this.type;
    SearchData.company_code = this.gs.globalVariables.comp_code;
    SearchData.branch_code = this.gs.globalVariables.branch_code;
    SearchData.user_pkid = this.gs.globalVariables.user_pkid;

    this.gs.SearchRecord(SearchData)
      .subscribe(response => {
        this.loading = false;
        this.InfoMessage = '';
        this.RecordList = response.list;
      },
      error => {
        this.loading = false;
        this.ErrorMessage = this.gs.getError(error);
      });
  }
}
