
import { Component, ViewEncapsulation, Input, OnInit, OnDestroy } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute } from '@angular/router';
import { GlobalService } from '../../core/services/global.service';
import { Ledgert } from '../models/ledgert';
import { SearchTable } from '../../shared/models/searchtable';
import { pendinglist } from '../models/pendinglist';
import { LedgerService } from '../services/ledger.service';
import { LedgerXref } from '../models/ledgerxref';

@Component({
  selector: 'app-setlmnt',
  templateUrl: './setlmnt.component.html',
 
  providers: [LedgerService]
})
export class SetlmntComponent {
  // Local Variables 
  title = 'Setilment';

  @Input() menuid: string = '';
  @Input() type: string = '';
  InitCompleted: boolean = false;
  menu_record: any;
  
  modal: any;

  disableSave = true;
  loading = false;
  currentTab = 'LIST';
  DetailTab = 'LIST';

  bChanged: boolean;

  searchstring = '';
  sub: any;
  urlid: string;
 
 
  ErrorMessage = "";
  InfoMessage = "";
 
  mode = '';
  pkid = '';


  // Allocation
  jv_dr_total: number = 0;
  jv_cr_total: number = 0;
  Total_Diff: number = 0;
  tds_amt: number = 0;
  bank_amt: number = 0;

  PendingListRecords: pendinglist[] = [];

  RecordList: pendinglist[] = [];

  // Array For Displaying List
 // RecordList: Ledgert[] = [];
  // Single Record for add/edit/view details
  Record: Ledgert = new Ledgert;
  TdsRecord: Ledgert = new Ledgert;
  BankRecord: Ledgert = new Ledgert;


  PARTYRECORD: SearchTable = new SearchTable();
  PANRECORD: SearchTable = new SearchTable();
  TDSACRECORD: SearchTable = new SearchTable();
  BANKACRECORD: SearchTable = new SearchTable();
 
  constructor(
    private modalService: NgbModal,
    private mainService: LedgerService,
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
   
    this.menu_record = this.gs.getMenu(this.menuid);
    if (this.menu_record) {
      this.title = this.menu_record.menu_name;
      this.title = this.title.toUpperCase();
    
     
    }
    this.InitLov();
    this.LoadCombo();
  }

  // Destroy Will be called when this component is closed
  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  LoadCombo() {
    this.currentTab = 'LIST';
   // this.List("NEW");
  }


  InitLov(saction: string = '') {



    if (saction == 'PARTY' || saction == '') {
      this.PARTYRECORD = new SearchTable();
      this.PARTYRECORD.controlname = "PARTY";
      this.PARTYRECORD.displaycolumn = "CODE";
      this.PARTYRECORD.type = "ACCTM";
      this.PARTYRECORD.id = "";
      this.PARTYRECORD.code = "";
      this.PARTYRECORD.name = "";
    }

    if (saction == 'PAN' || saction == '' ) {
      this.PANRECORD = new SearchTable();
      this.PANRECORD.controlname = "PAN";
      this.PANRECORD.displaycolumn = "CODE";
      this.PANRECORD.type = "PAN";
      this.PANRECORD.id = "";
      this.PANRECORD.code = "";
    }

    if (saction == 'TDSAC' || saction == '') {
      this.TDSACRECORD = new SearchTable();
      this.TDSACRECORD.controlname = "TDSAC";
      this.TDSACRECORD.displaycolumn = "CODE";
      this.TDSACRECORD.type = "ACCTM";
      this.TDSACRECORD.id = "";
      this.TDSACRECORD.code = "";
      this.TDSACRECORD.name = "";
    }

    if (saction == 'BANKAC' || saction == '') {
      this.BANKACRECORD = new SearchTable();
      this.BANKACRECORD.controlname = "BANKAC";
      this.BANKACRECORD.displaycolumn = "CODE";
      this.BANKACRECORD.type = "ACCTM";
      this.BANKACRECORD.id = "";
      this.BANKACRECORD.code = "";
      this.BANKACRECORD.name = "";
    }
  }

  LovSelected(_Record: SearchTable) {

   
    if (_Record.controlname == "PAN") {

      this.TdsRecord.jv_pan_id = _Record.id;
      this.TdsRecord.jv_pan_code = _Record.code;
      this.TdsRecord.jv_pan_name = _Record.name;
    }
    if (_Record.controlname == "PARTY") {

      this.Record.jv_acc_id = _Record.id;
      this.Record.jv_acc_code = _Record.code;
      this.Record.jv_acc_name = _Record.name;
    }
    if (_Record.controlname == "TDSAC") {

      this.TdsRecord.jv_acc_id = _Record.id;
      this.TdsRecord.jv_acc_code = _Record.code;
      this.TdsRecord.jv_acc_name = _Record.name;
    }
    if (_Record.controlname == "BANKAC") {

      this.BankRecord.jv_acc_id = _Record.id;
      this.BankRecord.jv_acc_code = _Record.code;
      this.BankRecord.jv_acc_name = _Record.name;
    }
  }


  //function for handling LIST/NEW/EDIT Buttons
  ActionHandler(action: string, id: string) {
    this.ErrorMessage = '';
    this.InfoMessage = '';
    //if (action == 'LIST') {
    //  this.mode = '';
    //  this.pkid = '';
    //  this.currentTab = 'LIST';
    //  this.DetailTab = 'LIST';
     
    //}
    //else if (action === 'ADD') {
    //  this.currentTab = 'DETAILS';
    //  this.DetailTab = 'LIST';
    //  this.mode = 'ADD';
    //  this.ResetControls();
    //  this.NewRecord();
    //}
    //else if (action === 'EDIT') {
    //  this.currentTab = 'DETAILS';
    //  this.DetailTab = 'LIST';
    //  this.mode = 'EDIT';
    //  this.ResetControls();
    //  this.pkid = id;
    //  this.GetRecord(id);
    //}

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


  LoadPendingList() {

    if (this.Record.jv_acc_id == null) {
      this.ErrorMessage = "Party Cannot Be Blank";
      return;
    }
 
    let SearchData = {
      jvhid: this.pkid,
      jvid: this.Record.jv_pkid,
      accid: this.Record.jv_acc_id,
      type: "",
      company_code: this.gs.globalVariables.comp_code,
      branch_code: this.gs.globalVariables.branch_code,
      year_code: this.gs.globalVariables.year_code
    };
    SearchData.type = "DR";
    if (this.Record.jv_drcr == "DR")
      SearchData.type = "DR";
    if (this.Record.jv_drcr == "CR")
      SearchData.type = "CR";


    this.ErrorMessage = '';
    this.InfoMessage = '';
    this.loading = true;
    this.mainService.GetSettlementList(SearchData)
      .subscribe(response => {
        this.loading = false;
        this.RecordList = response.list;
        
      },
      error => {
        this.loading = false;
        this.ErrorMessage = this.gs.getError(error);
      });
  }


  OnBlur(field: string) {

    if (field == 'jv_chqno') {
      if (this.BankRecord.jv_chqno != null) {
          this.BankRecord.jv_due_date = this.gs.defaultValues.today;        
      }
    }

    if (field == 'jv_bank') {
      this.BankRecord.jv_bank = this.BankRecord.jv_bank.toUpperCase();
    }

    if (field == 'jv_branch') {
      this.BankRecord.jv_branch = this.BankRecord.jv_branch.toUpperCase();
    }

    if (field == 'jv_pay_reason') {
      this.BankRecord.jv_pay_reason = this.BankRecord.jv_pay_reason.toUpperCase();
    }
    if (field == 'jv_supp_docs') {
      this.BankRecord.jv_supp_docs = this.BankRecord.jv_supp_docs.toUpperCase();
    }
    if (field == 'jv_paid_to') {
      this.BankRecord.jv_paid_to = this.BankRecord.jv_paid_to.toUpperCase();
    }
    if (field == 'jv_remarks') {
      this.BankRecord.jv_remarks = this.BankRecord.jv_remarks.toUpperCase();
    }
  }

  OnChange(field: string) {
    if (field == 'tds_amt') {
      this.findtotal();
    }
  }
  
  Close() {
    this.gs.ClosePage('home');
  }



  //Allocation Part
  OnChange_Allocation(field: string, _rec: pendinglist) {
    if (field == 'jv_selected') {
      if (_rec.jv_selected) {
          _rec.jv_allocation = _rec.jv_balance;
      }
      else {
        _rec.jv_allocation = 0;
      }
      this.findtotal();
    }
  }

  OnBlur_Allocation(field: string, _rec: pendinglist) {
    if (field == 'jv_allocation') {
      if (_rec.jv_allocation > _rec.jv_balance) {
        alert('Cannot Allocate More than balance ')
      }
      this.findtotal();
      return;
    }
  }



  findtotal() {

    this.jv_dr_total = 0;
    this.jv_cr_total = 0;
    this.Total_Diff = 0;

    this.RecordList.forEach(rec => {
      if (rec.jv_drcr == 'DR') {
        this.jv_dr_total += rec.jv_allocation;
      }
      if (rec.jv_drcr == 'CR') {
        this.jv_cr_total += rec.jv_allocation;
      }
    });

    this.jv_dr_total = this.gs.roundNumber(this.jv_dr_total, 2);
    this.jv_cr_total = this.gs.roundNumber(this.jv_cr_total, 2);
    this.Total_Diff = this.jv_cr_total - this.jv_dr_total;
    this.Total_Diff = this.gs.roundNumber(this.Total_Diff, 2);

    this.bank_amt = this.Total_Diff - this.tds_amt;
    this.bank_amt = this.gs.roundNumber(this.bank_amt, 2);

  }


}


