import { Component, Input, OnInit, OnDestroy, ViewChild, AfterViewInit, Output, EventEmitter, ElementRef, SimpleChange } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GlobalService } from '../../core/services/global.service';
import { SearchTable } from '../../shared/models/searchtable';
import { JobUnlock } from '../../master/models/jobunlock';
import { JobUnlockService } from '../../master/services/jobunlock.service';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-crlimit',
  templateUrl: './crlimit.component.html',
  providers: [JobUnlockService]
})
export class CrLimitComponent {

  @ViewChild('content') private content: any;

  title = 'O/s Details';

  @Input() RecordList: any;
  @Input() msg: string;
  @Input() visible: boolean = false;
  @Input() type: string;
  @Input() parentid: string = '';
  @Input() customername: string = '';

  @Output() hidealert = new EventEmitter<boolean>();

  displayed: boolean = false;
  selectedRowIndex: number = -1;
  modalref: any;

  currentTab = 'LIST';
  hbl_exp_name = "";
  hbl_exp_name2 = "";
  hbl_exp_name3 = "";
  ErrorMessage = "";
  InfoMessage = "";
  mode = 'ADD';
  pkid = '';
  loading = false;
  // Array For Displaying List
  RecordList2: JobUnlock[] = [];
  // Single Record for add/edit/view details
  Record2: JobUnlock = new JobUnlock;


  constructor(
    private mainService: JobUnlockService,
    private modalService: NgbModal,
    private route: ActivatedRoute,
    private gs: GlobalService
  ) {
    // URL Query Parameter 

  }

  // Init Will be called After executing Constructor
  ngOnInit() {

  }

  /* 
    ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
      for (let propName in changes) {
        if (propName == 'visible') {
          if (this.visible)
            this.open();
          if (!this.visible)
            this.close();
  
        }
      }
    } */


  ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
    for (let propName in changes) {
      if (propName == 'visible') {
        if (this.visible) {
          if (this.parentid)
            this.List('NEW');
          this.ActionHandler("ADD", null);
        }
      }
    }
  }

  InitComponent() {

  }

  open() {
    this.displayed = true;
    this.modalref = this.modalService.open(this.content, { size: "sm", backdrop: 'static', keyboard: false, windowClass: 'modal-custom' });
  }

  close() {

    if (this.displayed) {
      this.displayed = false;
      this.hidealert.emit(false);
      this.modalref.close();
    }
  }

  close1() {
    this.visible = false
    this.hidealert.emit(false);
  }

  List(_type: string) {
    this.loading = true;
    let SearchData = {
      type: _type,
      rowtype: this.type,
      parentid: this.parentid,
      company_code: this.gs.globalVariables.comp_code,
      branch_code: this.gs.globalVariables.branch_code,
      year_code: this.gs.globalVariables.year_code,
      invoke_from: 'CHECK-CRLMT'
    };

    this.ErrorMessage = '';
    this.InfoMessage = '';
    this.mainService.List(SearchData)
      .subscribe(response => {
        this.loading = false;
        this.RecordList2 = response.list;
        this.ActionHandler("ADD", null);
      },
        error => {
          this.loading = false;
          this.ErrorMessage = this.gs.getError(error);
          alert(this.ErrorMessage);
        });
  }

  //function for handling LIST/NEW/EDIT Buttons
  ActionHandler(action: string, id: string, _selectedRowIndex: number = -1) {
    this.ErrorMessage = '';
    this.InfoMessage = '';
    if (action == 'LIST') {
      this.mode = '';
      this.pkid = '';
      this.currentTab = 'LIST';
    }
    else if (action === 'ADD') {
      this.currentTab = 'DETAILS';
      this.mode = 'ADD';
      this.ResetControls();
      this.NewRecord();
    }
    else if (action === 'EDIT') {
      this.selectedRowIndex = _selectedRowIndex;
      this.currentTab = 'DETAILS';
      this.mode = 'EDIT';
      this.ResetControls();
      this.pkid = id;
      // this.GetRecord(id);
    }
    else if (action === 'REMOVE') {
      this.currentTab = 'DETAILS';
      this.pkid = id;
      // this.RemoveRecord(id);
    }
  }

  NewRecord() {
    this.pkid = this.gs.getGuid();
    this.Record2 = new JobUnlock();
    this.Record2.ul_pkid = this.pkid;
    this.Record2.ul_type = this.type;
    this.Record2.ul_remarks = '';
    this.Record2.ul_comments = '';
    this.Record2.ul_from_email_id = this.gs.globalVariables.user_email;
    this.Record2.ul_firm_commited_date = this.gs.defaultValues.today;
    this.Record2.ul_expected_bill_amt = 0;
    this.Record2.ul_job_nos_required = 1;
    this.Record2.ul_user_remarks = '';
    this.Record2.rec_branch_code = this.gs.globalVariables.branch_code;
    this.Record2.rec_created_by = this.gs.globalVariables.user_code;
    this.Record2.rec_created_date = this.gs.ConvertDate2DisplayFormat(this.gs.defaultValues.today);
    this.Record2.rec_mode = this.mode;
    this.Record2.ul_locked = 'P';
    this.InitLov();
  }

  ResetControls() {
  }
  InitLov() {
  }

  Save() {
    if (!this.allvalid())
      return;
    this.loading = true;
    this.ErrorMessage = '';
    this.InfoMessage = '';
    this.Record2.ul_comments = this.getComments();
    this.Record2.ul_parent_id = this.parentid;
    this.Record2._globalvariables = this.gs.globalVariables;
    this.mainService.Save(this.Record2)
      .subscribe(response => {
        this.loading = false;
        this.mode = 'EDIT';
        this.Record2.rec_mode = this.mode;
        this.Record2.ul_ctr = response.ul_ctr;
        alert('Save Complete');
      },
        error => {
          this.loading = false;
          this.ErrorMessage = this.gs.getError(error);
          alert(this.ErrorMessage);
        });
  }

  getComments() {
    let sComments: string = "";
    let _totBal = 0;
    let _totOverDueAmt = 0;
    let _totOverDueDays = 0;
    if (!this.gs.isBlank(this.RecordList)) {
      for (let rec of this.RecordList) {
        _totBal += rec.creditamt;
        _totOverDueAmt += rec.overdueamt;
        if (rec.overduedays > _totOverDueDays)
          _totOverDueDays = rec.overduedays;
      }
    }
    sComments = "Balance: " + _totBal.toString() + ", Overdue Amount: " + _totOverDueAmt.toString() + ", Overdue days: " + _totOverDueDays.toString();
    sComments += ", Lock Message: " + this.msg;
    if (sComments.length > 250)
      sComments = sComments.substring(0, 250);
    return sComments;
  }

  allvalid() {
    let sError: string = "";
    let bret: boolean = true;
    this.ErrorMessage = '';
    this.InfoMessage = '';

    if (this.Record2.ul_expected_bill_amt <= 0) {
      bret = false;
      sError += "| Expected Billing Amount Cannot Be Blank";
    }
    if (this.gs.isBlank(this.Record2.ul_firm_commited_date)) {
      bret = false;
      sError += "| Firm Commitment Date Cannot Be Blank";
    }
    if (this.Record2.ul_job_nos_required <= 0) {
      bret = false;
      sError += "| Required Job Numbers Cannot Be Blank";
    }
    if (bret === false) {
      this.ErrorMessage = sError;
      alert(this.ErrorMessage);
    }
    return bret;
  }

  MailCreditLimitRequest() {

    if (!confirm("Do you want to Sent Credit Limit Request")) {
      return;
    }

    this.loading = true;
    let SearchData = {
      pkid: this.pkid,
      company_code: this.gs.globalVariables.comp_code,
      branch_code: this.gs.globalVariables.branch_code,
      branch_name: this.gs.globalVariables.branch_name,
      year_code: this.gs.globalVariables.year_code,
      user_code: this.gs.globalVariables.user_code,
      user_name: this.gs.globalVariables.user_name,
      user_pkid: this.gs.globalVariables.user_pkid
    };

    this.ErrorMessage = '';
    this.InfoMessage = '';
    this.mainService.MailCreditLimitRequest(SearchData)
      .subscribe(response => {
        this.loading = false;
        this.InfoMessage = response.error;
        alert(this.InfoMessage);
        if (response.retvalue)
          this.close1();
      },
        error => {
          this.loading = false;
          this.ErrorMessage = this.gs.getError(error);
          alert(this.ErrorMessage);
        });
  }


  DeleteRow(Id: string) {

    if (!confirm("Do you want to Delete")) {
      return;
    }

    this.loading = true;
    let SearchData = {
      rowtype: this.type,
      type: '',
      pkid: Id,
      comp_code: this.gs.globalVariables.comp_code,
      branch_code: this.gs.globalVariables.branch_code,
      user_code: this.gs.globalVariables.user_code,
    };

    this.ErrorMessage = '';
    this.InfoMessage = '';
    this.mainService.DeleteRecord(SearchData)
      .subscribe(response => {
        this.loading = false;
        this.RecordList2.splice(this.RecordList2.findIndex(rec => rec.ul_pkid == Id), 1);
        this.ActionHandler("ADD", null);
        alert("Removed Successfully");
      },
        error => {
          this.loading = false;
          this.ErrorMessage = this.gs.getError(error);
          alert(this.ErrorMessage);
        });
  }

  OnBlur(field: string) {

    if (field == 'ul_user_remarks') {
      // this.Record2.ul_user_remarks = this.Record2.ul_user_remarks.toUpperCase();
    }

  }


}

