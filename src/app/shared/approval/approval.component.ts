import { Component, Input, OnInit, OnDestroy, ViewChild, AfterViewInit, Output, EventEmitter, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GlobalService } from '../../core/services/global.service';
import { SearchTable } from '../../shared/models/searchtable';
import { Approvalm } from '../../shared/models/approvalm';


@Component({
  selector: 'app-approval',
  templateUrl: './approval.component.html',
})
export class ApprovalComponent {
  // Local Variables 
  title = 'Approval Details';

  @Output() ModifiedRecords = new EventEmitter<any>();
  @Input() public pkid: string;
  @Input() public type: string = '';
  @Input() public status: string = '';

  InitCompleted: boolean = false;
  disableSave = true;
  loading = false;
  currentTab = 'LIST';
  sub: any;
  urlid: string;

  bAdd: boolean = false;
  chk_approval: boolean = false;
  chk_verified: boolean = false;
  remarks = "";
  chk_caption = "Approval";
  rule_index: number = 0;
  activePanelId: string = "panel3";

  ErrorMessage = "";
  InfoMessage = "";
  RecordList: Approvalm[] = [];
  constructor(
    private route: ActivatedRoute,
    private gs: GlobalService
  ) {
    // URL Query Parameter 
  }

  // Init Will be called After executing Constructor
  ngOnInit() {
    this.bAdd = false;
    this.chk_caption = this.status;
    this.LoadCombo();
    this.SearchRecord("approval", 'LIST');
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
    if (field == 'remarks') {
      this.remarks = this.remarks.toUpperCase();
    }
  }
  Close() {

  }

  SearchRecord(controlname: string, _type: string) {
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
    //if (this.status.length <= 0) {
    //  this.ErrorMessage = "Invalid Status";
    //  return;
    //}

    if (this.status.trim().length > 0) {
      if (this.status.trim().indexOf('/') < 1 || this.status.trim().indexOf('.') < 3) {
        this.ErrorMessage = "Invalid Format for Status - 1/4. ABCXXXXX";
        return;
      }
    }

    this.loading = true;
    let SearchData = {
      table: controlname,
      type: '',
      pkid: '',
      rowtype: this.type,
      status: this.status,
      remarks: '',
      chkapproval: '',
      company_code: this.gs.globalVariables.comp_code,
      branch_code: this.gs.globalVariables.branch_code,
      user_code: this.gs.globalVariables.user_code
    };

    SearchData.table = controlname;
    SearchData.type = _type;
    SearchData.pkid = this.pkid;
    SearchData.rowtype = this.type;
    SearchData.status = this.status;
    SearchData.remarks = this.remarks;
    SearchData.chkapproval = this.chk_approval == true ? "Y" : "N";
    SearchData.company_code = this.gs.globalVariables.comp_code;
    SearchData.branch_code = this.gs.globalVariables.branch_code;

    this.gs.SearchRecord(SearchData)
      .subscribe(response => {
        this.loading = false;
        this.InfoMessage = '';
        if (this.status.length > 0) //if(aproval rights exists then status has value)
          this.bAdd = response.badd;
        else
          this.bAdd = false;

        if (this.gs.globalVariables.user_code == 'ADMIN')
          this.bAdd = true;

        this.RecordList = response.list;
        this.rule_index = response.ruleindex;
        if (_type == "SAVE") {
          if (this.ModifiedRecords != null)
            this.ModifiedRecords.emit({ stype: this.type, sid: this.pkid, mstatus: response.mstatus, mremarks: response.mremarks });
          // this.InfoMessage = "Save Complete";
        }
        if (this.rule_index == 1)
          this.activePanelId = "panel1";
        else if (this.rule_index == 2)
          this.activePanelId = "panel2";
        else
          this.activePanelId = "panel3";
      },
      error => {
        this.loading = false;
        this.ErrorMessage = this.gs.getError(error);
      });
  }

  Save() {

    if (!this.allvalid())
      return;

    this.SearchRecord('approval', 'SAVE');
  }

  allvalid() {
    let sError: string = "";
    let bret: boolean = true;
    this.ErrorMessage = '';
    this.InfoMessage = '';
    if (this.chk_approval == false && this.remarks.trim().length <= 0) {
      sError = "No Details to Save";
      // sError = "Please select " + this.chk_caption + " and continue...";
      bret = false;
    }

    if ( this.type=='BP' && this.chk_approval == true && this.chk_verified == false) {
      sError = "Please Verify above Responsibility.";
      // sError = "Please select " + this.chk_caption + " and continue...";
      bret = false;
    }

    if (bret === false)
      this.ErrorMessage = sError;
    return bret;
  }

}
