import { Component, Input, OnInit, OnDestroy, ViewChild, AfterViewInit, Output, EventEmitter, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GlobalService } from '../../../core/services/global.service';
import { SearchTable } from '../../../shared/models/searchtable';
import { Costingm } from '../../models/costing';
import { Costingd } from '../../models/costing';
import { CostingService } from '../../services/costing.service';

@Component({
  selector: 'app-costinvoice',
  templateUrl: './costinvoice.component.html',
  providers: [CostingService]
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
  acc_sWhere = "";
  // totExworkAmt = 0;
  // diffAmt = 0;

  @Input() mRecord: Costingm = new Costingm;
  Record: Costingd = new Costingd;
  constructor(
    private mainService: CostingService,
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

  ngAfterViewInit() {

  }
  InitLov() {


  }

  LovSelected(_Record: SearchTable, _rec: Costingd) {

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
    if (field == "costd_acc_type") {
      this.FindTotal();
    } else {
      var REC = this.mRecord.DetailList.find(rec => rec.costd_pkid == fieldid);
      if (REC != null) {
        if (field == "costd_acc_qty" || field == "costd_acc_rate" || field == "costd_acc_amt")
          this.bChanged = true;
      }
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
      if (field == "costd_brate")
        REC.costd_brate = this.gs.roundNumber(REC.costd_brate, 3);
      if (field == "costd_srate")
        REC.costd_srate = this.gs.roundNumber(REC.costd_srate, 3);
      if (field == "costd_split")
        REC.costd_split = this.gs.roundNumber(REC.costd_split, 0);
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
    this.Record.costd_acc_type = "NA";
    this.Record.costd_acc_id = "";
    this.Record.costd_acc_code = "";
    this.Record.costd_acc_name = "";
    if (this.type == "SEA EXPORT COSTING")
      this.AssignFreightCode("SEA EXPORT")
    else if (this.type == "AIR EXPORT COSTING")
      this.AssignFreightCode("AIR EXPORT")
    else if (this.type == "DRCR ISSUE") {

      if (this.mRecord.cost_category.includes("SEA EXPORT"))
        this.AssignFreightCode("SEA EXPORT");
      else if (this.mRecord.cost_category.includes("AIR EXPORT"))
        this.AssignFreightCode("AIR EXPORT");
      else if (this.mRecord.cost_category.includes("SEA IMPORT"))
        this.AssignFreightCode("SEA IMPORT");
      else if (this.mRecord.cost_category.includes("AIR IMPORT"))
        this.AssignFreightCode("AIR IMPORT");
    }
    if (this.type == "SEA EXPORT COSTING" || this.type == "SE CONSOLE COSTING")
      this.Record.costd_acc_name = "OUR HANDLING CHARGES";
    this.Record.costd_remarks = "";
    this.Record.costd_acc_qty = 1;
    this.Record.costd_acc_rate = 0;
    this.Record.costd_acc_amt = 0;
    this.Record.costd_srate = 0;
    this.Record.costd_brate = 0;
    this.Record.costd_split = 0;
    this.mRecord.DetailList.push(this.Record);
  }

  FindTotal() {
    let totExworkAmt = 0;
    let otherAmt = 0;
    let nAmt: number = 0;
    for (let rec of this.mRecord.DetailList) {
      nAmt += rec.costd_acc_amt;
      if (rec.costd_acc_type == "EX-WORK")
        totExworkAmt += rec.costd_acc_amt;
      else
        otherAmt += rec.costd_acc_amt;
    }

    nAmt = this.gs.roundNumber(nAmt, 2);
    totExworkAmt = this.gs.roundNumber(totExworkAmt, 2);
    otherAmt = this.gs.roundNumber(otherAmt, 2);

    if (this.type == "DRCR ISSUE")
      this.mRecord.cost_drcr_amount = nAmt;
    else
      this.mRecord.cost_tot_acc_amt = nAmt;
    this.mRecord.cost_tot_ex_works = totExworkAmt;
    this.mRecord.cost_oth_amt = otherAmt;
  }


  RemoveRecord(Id: string) {
    this.mRecord.DetailList.splice(this.mRecord.DetailList.findIndex(rec => rec.costd_pkid == Id), 1);
    this.FindTotal();
  }

  LoadInvoiceDesc() {
    this.loading = true;
    let SearchData = {
      type: this.type,
      pkid: this.mRecord.cost_pkid,
      comp_code: this.gs.globalVariables.comp_code,
      branch_code: this.gs.globalVariables.branch_code,
      cost_category: ''
    };

    SearchData.comp_code = this.gs.globalVariables.comp_code;
    SearchData.branch_code = this.gs.globalVariables.branch_code;
    SearchData.cost_category = this.mRecord.cost_category;

    this.ErrorMessage = '';
    this.InfoMessage = '';
    this.mainService.LoadDefault(SearchData)
      .subscribe(response => {
        this.loading = false;
        this.mRecord.DetailList = response.list;
        this.FindTotal();
      },
        error => {
          this.loading = false;
          this.ErrorMessage = this.gs.getError(error);
          alert(this.ErrorMessage);
        });
  }

  AssignFreightCode(_type: string) {

    if (_type == "SEA EXPORT") {
      this.Record.costd_acc_type = "FREIGHT";
      this.Record.costd_acc_id = "DBE55D92-338A-8386-8F77-695809C9A074";
      this.Record.costd_acc_code = "1105111";
      this.Record.costd_acc_name = "OCEAN FREIGHT CHARGES - EXPORT";
    }
    else if (_type == "AIR EXPORT") {
      this.Record.costd_acc_type = "FREIGHT";
      this.Record.costd_acc_id = "418BDF96-1604-7F2E-A3DB-E365A3D985CE";
      this.Record.costd_acc_code = "1205111";
      this.Record.costd_acc_name = "AIR FRIEGHT CHARGES - EXPORT";
    }
    else if (_type == "SEA IMPORT") {
      this.Record.costd_acc_type = "FREIGHT";
      this.Record.costd_acc_id = "F7FA9F67-A627-4AB6-A285-CEE605F12A27";
      this.Record.costd_acc_code = "1305001";
      this.Record.costd_acc_name = "OCEAN FREIGHT CHARGES - IMPORT";
    }
    else if (_type == "AIR IMPORT") {
      this.Record.costd_acc_type = "FREIGHT";
      this.Record.costd_acc_id = "9D695D2D-5E1E-FE63-FAB4-1141C7B8A622";
      this.Record.costd_acc_code = "1405111";
      this.Record.costd_acc_name = "AIR FREIGHT CHARGES - AIR IMPORT";
    }
  }
}
