import { Component, Input, OnInit, OnDestroy, ViewChild, AfterViewInit, Output, EventEmitter, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GlobalService } from '../../../core/services/global.service';
import { SearchTable } from '../../../shared/models/searchtable';
import { Costingm } from '../../models/costing';
import { Costingd } from '../../models/costing';


@Component({
  selector: 'app-costinvoice',
  templateUrl: './costinvoice.component.html'
})
export class CostInvoiceComponent {
  // Local Variables 
  title = 'Invoice Details';
  @Input() public parentid: string = '';
  @Input() public type: string = '';

  InitCompleted: boolean = false;
  disableSave = true;
  loading = false;
  currentTab = 'LIST';
  sub: any;
  urlid: string;
  Total_Amount: number = 0;

  bChanged: boolean;

  pkid = "";
  ErrorMessage = "";
  InfoMessage = "";

  @Input() mRecord: Costingm = new Costingm;
  Record: Costingd = new Costingd;
  constructor(
    private route: ActivatedRoute,
    private gs: GlobalService
  ) {
    // URL Query Parameter 
  }

  // Init Will be called After executing Constructor
  ngOnInit() {
    this.LoadCombo();
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

  OnFocusTableCell(field: string, fieldid: string) {
    var REC = this.mRecord.DetailList.find(rec => rec.costd_pkid == fieldid);
    if (REC != null) {
      if (field == "costd_acc_qty" || field == "costd_acc_rate" || field == "costd_acc_amt")
        this.bChanged = false;
    }
  }

  OnChangeTableCell(field: string, fieldid: string) {
    var REC = this.mRecord.DetailList.find(rec => rec.costd_pkid == fieldid);
    if (REC != null) {
      if (field == "costd_acc_qty" || field == "costd_acc_rate" || field == "costd_acc_amt")
        this.bChanged = true;
    }
  }
   
  OnBlurTableCell(field: string, fieldid: string) {
    var REC = this.mRecord.DetailList.find(rec => rec.costd_pkid == fieldid);
    if (REC != null) {
      if (field == "costd_blno")
        REC.costd_blno = REC.costd_blno.toUpperCase();
      if (field == "costd_acc_name")
        REC.costd_acc_name = REC.costd_acc_name.toUpperCase();
      if (field == "costd_remarks")
        REC.costd_remarks = REC.costd_remarks.toUpperCase();
      if (field == "costd_acc_qty") {
        if (this.bChanged) {
          REC.costd_acc_qty = this.gs.roundNumber(REC.costd_acc_qty, 4);
          REC.costd_acc_amt = REC.costd_acc_qty * REC.costd_acc_rate;
          REC.costd_acc_amt = this.gs.roundNumber(REC.costd_acc_amt, 2);
          this.FindTotal();
        }
      } 
      if (field == "costd_acc_rate") {
        if (this.bChanged) {
          REC.costd_acc_rate = this.gs.roundNumber(REC.costd_acc_rate, 2);
          REC.costd_acc_amt = REC.costd_acc_qty * REC.costd_acc_rate;
          REC.costd_acc_amt = this.gs.roundNumber(REC.costd_acc_amt, 2);
          this.FindTotal();
        }
      }
      if (field == "costd_acc_amt") {
        if (this.bChanged) {
          REC.costd_acc_amt = this.gs.roundNumber(REC.costd_acc_amt, 2);
          if (REC.costd_acc_qty > 0) {
            REC.costd_acc_rate = REC.costd_acc_amt / REC.costd_acc_qty;
            REC.costd_acc_rate = this.gs.roundNumber(REC.costd_acc_rate, 2);
          }
          this.FindTotal();
        }
      }
    }
  }

  Close() {
    
  }

  NewRecord() {
    this.pkid = this.gs.getGuid();
    this.Record = new Costingd();
    this.Record.costd_pkid = this.pkid;
    this.Record.costd_parent_id = this.mRecord.cost_pkid;
    this.Record.costd_category = "INVOICE";
    this.Record.costd_blno = "";
    this.Record.costd_acc_name = "";
    this.Record.costd_remarks = "";
    this.Record.costd_acc_qty = 1;
    this.Record.costd_acc_rate = 1;
    this.Record.costd_acc_amt = 0;
    this.mRecord.DetailList.push(this.Record);
  }
  
  FindTotal() {
    let nAmt: number = 0;
    for (let rec of this.mRecord.DetailList) {
      nAmt += rec.costd_acc_amt;
    }
    nAmt = this.gs.roundNumber(nAmt, 2);
    if (this.type == "DRCR ISSUE")
      this.mRecord.cost_drcr_amount = nAmt;
    else
      this.mRecord.cost_tot_acc_amt = nAmt;
  }
    

  RemoveRecord(Id: string) {
    this.mRecord.DetailList.splice(this.mRecord.DetailList.findIndex(rec => rec.costd_pkid == Id), 1);
    this.FindTotal();
  }

}
