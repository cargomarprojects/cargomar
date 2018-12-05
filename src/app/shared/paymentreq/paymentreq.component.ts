import { Component, Input, OnInit, OnDestroy, ViewChild, AfterViewInit, Output, EventEmitter, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GlobalService } from '../../core/services/global.service';
import { SearchTable } from '../../shared/models/searchtable';
//import { Auditlog } from '../../shared/models/auditlog';


@Component({
  selector: 'app-paymentreq',
  templateUrl: './paymentreq.component.html',
})
export class PaymentReqComponent {
  // Local Variables 
  title = 'Payment Request Details';

  @Input() public parentid: string = '';
  @Input() public jvhid: string = '';
  @Input() public type: string = '';
  @Input() public party_name: string = '';
  @Input() public vrno: string = '';

  InitCompleted: boolean = false;
  disableSave = true;
  loading = false;
  currentTab = 'LIST';
  sub: any;
  urlid: string;
  
  pay_date: string = '';
  pay_chq_name: string = ''; 
  pkid ='';
  ErrorMessage = "";
  InfoMessage = "";
    constructor(
    private route: ActivatedRoute,
    private gs: GlobalService
  ) {
    // URL Query Parameter 
  }

  // Init Will be called After executing Constructor
  ngOnInit() {
    this.LoadCombo();
    this.SearchRecord("paymentrequest",'LIST');
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
  Save() {

    if (!this.allvalid())
      return;

    this.SearchRecord('paymentrequest', 'SAVE');
  }

  allvalid() {
    let sError: string = "";
    let bret: boolean = true;
    this.ErrorMessage = '';
    this.InfoMessage = '';
    if (this.pay_date.trim().length <= 0) {
      sError = "Date Cannot Be Blank";
      bret = false;
    }
    if (this.pay_chq_name.trim().length <= 0) {
      sError += " | Name On Cheque Cannot Be Blank";
      bret = false;
    }
    if (bret === false)
      this.ErrorMessage = sError;
    return bret;
  }

  OnBlur(field: string) {

  }
  Close() {
    
  }
  
  SearchRecord(controlname: string, _type: string) {
    this.InfoMessage = '';
    this.ErrorMessage = '';
    if (this.parentid.trim().length <= 0 && this.jvhid.trim().length <= 0) {
      this.ErrorMessage = "Invalid ID";
      return;
    }

    this.loading = true;
    let SearchData = {
      pkid: this.pkid,
      company_code: this.gs.globalVariables.comp_code,
      branch_code: this.gs.globalVariables.branch_code,
      year_code: this.gs.globalVariables.year_code,
      user_id: this.gs.globalVariables.user_pkid,
      user_code: this.gs.globalVariables.user_code,
      jvhid: this.jvhid,
      parentid: this.parentid,
      rowtype: this.type,
      paydate: this.pay_date,
      paychqname:this.pay_chq_name,
      table: 'paymentrequest',
      type: _type,
    };

    SearchData.pkid = this.pkid;
    SearchData.paydate = this.pay_date;
    SearchData.table = 'paymentrequest';
    SearchData.company_code = this.gs.globalVariables.comp_code;
    SearchData.branch_code = this.gs.globalVariables.branch_code;
    SearchData.year_code = this.gs.globalVariables.year_code;
    SearchData.user_id = this.gs.globalVariables.user_pkid;
    SearchData.user_code = this.gs.globalVariables.user_code;
    SearchData.jvhid = this.jvhid;
    SearchData.parentid = this.parentid;
    SearchData.rowtype = this.type;
    SearchData.type = _type;
    SearchData.paychqname = this.pay_chq_name;
    


    this.gs.SearchRecord(SearchData)
      .subscribe(response => {
        this.loading = false;
        this.InfoMessage = '';
        if (_type == "LIST") {
          if (response.paydate.length <= 0) {
            this.pay_date = this.gs.defaultValues.today;
            this.pay_chq_name = this.party_name;
          }
          else {
            this.pay_date = response.paydate;
            this.pay_chq_name = response.paychqname;
          }

        } else {
          if (response.savemsg == "Save Complete")
            this.InfoMessage = response.savemsg;
          else
            this.ErrorMessage = response.savemsg;
        }
      },
      error => {
        this.loading = false;
        this.InfoMessage = this.gs.getError(error);
      });
  }
}
