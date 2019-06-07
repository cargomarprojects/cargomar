import { Component, ViewEncapsulation, Input, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute } from '@angular/router';
import { GlobalService } from '../../core/services/global.service';
import { MoneyTransfer } from '../models/moneytransfer';
import { MoneyTransferService } from '../services/moneytransfer.service';
import { SearchTable } from '../../shared/models/searchtable';

@Component({
  selector: 'app-moneytransfer',
  templateUrl: './moneytransfer.component.html',
  encapsulation: ViewEncapsulation.None,
  providers: [MoneyTransferService]
})
export class MoneyTransferComponent {
  // Local Variables 
  title = 'Money Transfer Details';

  @Output() ModifiedRecords = new EventEmitter<any>();
  @Input() menuid: string = '';
  @Input() type: string = '';
  @Input() jvhid: string = '';
  @Input() jvid: string = '';
  @Input() jvaccid: string = '';
  @Input() jvaccname: string = '';
  @Input() jvhdocno: string = '';


  InitCompleted: boolean = false;
  menu_record: any;

  lock_record: boolean = false;
  lock_date: boolean = false;

  showCurrency: false;

  modal: any;

  disableSave = true;
  loading = false;
  currentTab = 'LIST';
  DetailTab = 'LIST';

  bChanged: boolean;

  searchstring = '';
  page_count = 0;
  page_current = 0;
  page_rows = 0;
  page_rowcount = 0;

  CanDelete: boolean = false;

  sub: any;
  urlid: string;

  ProcessPendingList: boolean = false;

  ErrorMessage = "";
  InfoMessage = "";

  mode = '';
  pkid = '';

  modeDetail = '';

  diff: number = 0;


  DR_BAL: number = 0;
  CR_BAL: number = 0;
  BAL: number = 0;

  // Array For Displaying List
  RecordList: MoneyTransfer[] = [];
  // Single Record for add/edit/view details
  Record: MoneyTransfer = new MoneyTransfer;

  PARTYRECORD: SearchTable = new SearchTable();
  BENFRECORD: SearchTable = new SearchTable();

  constructor(
    private modalService: NgbModal,
    private mainService: MoneyTransferService,
    private route: ActivatedRoute,
    private gs: GlobalService
  ) {
    this.page_count = 0;
    this.page_rows = 20;
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
    if (!this.InitCompleted) {
      this.InitComponent();
    }
    this.GetRecord('');
  }

  InitComponent() {
    this.CanDelete = false;
    this.menu_record = this.gs.getMenu(this.menuid);
    if (this.menu_record) {
      this.title = this.menu_record.menu_name;
      if (this.menu_record.rights_delete)
        this.CanDelete = true;
    }

    this.InitLov();
    this.LoadCombo();
   
  }

  // Destroy Will be called when this component is closed
  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  LoadCombo() {

  }

  InitLov(saction: string = '') {
    this.PARTYRECORD = new SearchTable();
    this.PARTYRECORD.controlname = "PARTY";
    this.PARTYRECORD.displaycolumn = "CODE";
    this.PARTYRECORD.type = "CUSTOMER";
    //    this.PARTYRECORD.where = " CUST_IS_SHIPPER = 'Y' ";
    this.PARTYRECORD.id = "";
    this.PARTYRECORD.code = "";
    this.PARTYRECORD.name = "";
    this.PARTYRECORD.parentid = "";
  }

  LovSelected(_Record: SearchTable) {

    let _bchanged: boolean = false;

    if (_Record.controlname == "PARTY") {
      this.Record.mt_party_id = _Record.id;
      this.Record.mt_party_code = _Record.code;
      this.Record.mt_party_name = _Record.name;
    }
    // if (_Record.controlname == "CURRENCY") {
    //   this.Record.jvh_curr_id = _Record.id;
    //   this.Record.jvh_curr_code = _Record.code;
    //   this.Record.jvh_curr_name = _Record.name;
    //   this.Record.jvh_exrate = _Record.rate;
    //   this.bChanged = true;
    //   this.OnBlur('jvh_exrate');
    // }
  }



  NewRecord() {
    this.lock_record = false;
    this.lock_date = false;

    this.pkid = this.gs.getGuid();
    this.Record = new MoneyTransfer();


    this.ProcessPendingList = false;

    this.InitLov();

    // this.CURRECORD.id = this.Record.jvh_curr_id;
    // this.CURRECORD.code = this.Record.jvh_curr_code;
    // this.CURRECORD.name = this.Record.jvh_curr_code;

    this.Record.rec_mode = this.mode;

  }
  // Load a single Record for VIEW/EDIT
  GetRecord(Id: string) {

    this.loading = true;
    let SearchData = {
      jvhid: '',
      jvid: '',
      jvaccid: '',
      jvaccname: '',
      jvhdocno: ''
    }

    SearchData.jvhid = this.jvhid;
    SearchData.jvaccid = this.jvaccid;
    SearchData.jvaccname = this.jvaccid;
    SearchData.jvid = this.jvid;
    SearchData.jvhdocno = this.jvhdocno;

    this.ErrorMessage = '';
    this.InfoMessage = '';
    this.mainService.GetRecord(SearchData)
      .subscribe(response => {
        this.loading = false;
        this.mode = response.recmode;
        this.LoadData(response.record);
      },
        error => {
          this.loading = false;
          this.ErrorMessage = this.gs.getError(error);
        });
  }

  LoadData(_Record: MoneyTransfer) {
    this.Record = _Record;
    this.InitLov();

    // this.ACCRECORD.id = this.Record.jvh_acc_id;
    // this.ACCRECORD.code = this.Record.jvh_acc_code;
    // this.ACCRECORD.name = this.Record.jvh_acc_name;
    // this.CURRECORD.id = this.Record.jvh_curr_id;
    // this.CURRECORD.code = this.Record.jvh_curr_code;

    // this.Record.rec_mode = this.mode;

    // this.lock_record = true;
    // this.lock_date = true;
    // if (this.Record.jvh_edit_code.indexOf("{S}") >= 0) {
    //   this.lock_record = false;
    // }
    // if (this.Record.jvh_edit_code.indexOf("{D}") >= 0) {
    //   this.lock_date = false;
    // }

    // if (this.Record.jvh_allocation_found) {
    //   this.ErrorMessage = "Cannot Edit Allocation Exists";
    //   this.lock_record = true;
    // }

  }


  // Save Data
  Save() {

    //this.FindTotal();

    if (!this.allvalid())
      return;
    this.loading = true;
    this.ErrorMessage = '';
    this.InfoMessage = '';

    // this.Record.jvh_date = this.Record.jvh_reference_date;
    // if (this.type == "OP")
    //   this.Record.jvh_narration = "OPENING BALANCE";
    // else if (this.type == "OB")
    //   this.Record.jvh_narration = "OPENING BANK";
    // else if (this.type == "OI")
    //   this.Record.jvh_narration = "OPENING INVOICE";
    // this.Record._globalvariables = this.gs.globalVariables;

    // if (this.Record.jvh_drcr == 'DR') {
    //   this.Record.jvh_debit = this.Record.jvh_total;
    //   this.Record.jvh_credit = 0;
    // }
    // if (this.Record.jvh_drcr == 'CR') {
    //   this.Record.jvh_debit = 0;
    //   this.Record.jvh_credit = this.Record.jvh_total;
    // }


    this.mainService.Save(this.Record)
      .subscribe(response => {
        this.loading = false;
        this.InfoMessage = "Save Complete";
        this.mode = 'EDIT';
        this.Record.rec_mode = this.mode;
      },
        error => {
          this.loading = false;
          this.ErrorMessage = this.gs.getError(error);
        });
      
  }

  allvalid() {
    let sError: string = "";
    let bret: boolean = true;
    this.ErrorMessage = '';
    this.InfoMessage = '';


    // if (this.Record.jvh_rec_source.trim() != "JV") {
    //   bret = false;
    //   sError += " | Cannot Edit, Records Created In Another Module";
    // }

    // if (this.type == "OI") {
    //   if (this.Record.jvh_reference.trim().length <= 0) {
    //     bret = false;
    //     sError += " | Reference Cannot Be Blank";
    //   }
    // }

    // if (this.Record.jvh_reference_date.trim().length <= 0) {
    //   bret = false;
    //   sError += " | Date Cannot Be Blank";
    // }

    // if (this.Record.jvh_drcr.trim().length <= 0) {
    //   bret = false;
    //   sError += " | DrCr Cannot Be Blank";
    // }

    // if (this.Record.rec_category.trim().length <= 0) {
    //   bret = false;
    //   sError += " | Category Cannot Be Blank";
    // }

    // if (this.Record.jvh_curr_id.trim().length <= 0) {
    //   bret = false;
    //   sError += " | Invalid Currency";
    // }


    // if (this.Record.jvh_total <= 0 || this.Record.jvh_ftotal <= 0 || this.Record.jvh_exrate <= 0) {
    //   bret = false;
    //   sError += " | Invalid Amount";
    // }


    // if (bret) {
    //   this.Record.jvh_reference = this.Record.jvh_reference.toUpperCase().replace(' ', '');
    // }

    // if (!bret)
    //   this.ErrorMessage = sError;
    return bret;
  }

  

  OnFocus(field: string) {
    this.bChanged = false;
  }

  OnChange(field: string) {
    this.bChanged = true;
  }


  OnBlur(field: string) {
    // if (field == 'jvh_acc_name') {
    //   this.Record.jvh_acc_name = this.Record.jvh_acc_name.toUpperCase();
    // }

    // if (field == "jvh_ftotal") {
    //   if (!this.bChanged)
    //     return;
    //   this.Record.jvh_ftotal = this.gs.roundNumber(this.Record.jvh_ftotal, 2);
    //   this.Record.jvh_total = this.Record.jvh_ftotal * this.Record.jvh_exrate;
    //   this.Record.jvh_total = this.gs.roundNumber(this.Record.jvh_total, 2);
    // }
    // if (field == "jvh_exrate") {
    //   if (!this.bChanged)
    //     return;
    //   this.Record.jvh_exrate = this.gs.roundNumber(this.Record.jvh_exrate, 5);
    //   this.Record.jvh_total = this.Record.jvh_ftotal * this.Record.jvh_exrate;
    //   this.Record.jvh_total = this.gs.roundNumber(this.Record.jvh_total, 2);
    // }

    // if (field == "jvh_total") {
    //   if (!this.bChanged)
    //     return;
    //   if (this.Record.jvh_exrate > 0) {
    //     this.Record.jvh_ftotal = this.Record.jvh_total / this.Record.jvh_exrate;
    //     this.Record.jvh_ftotal = this.gs.roundNumber(this.Record.jvh_ftotal, 2);
    //   }
    // }

    // if (field == 'jvh_bank') {
    //   this.Record.jvh_bank = this.Record.jvh_bank.toUpperCase();
    // }
    // if (field == 'jvh_branch') {
    //   this.Record.jvh_branch = this.Record.jvh_branch.toUpperCase();
    // }

    // if (field == 'jvh_remarks') {
    //   this.Record.jvh_remarks = this.Record.jvh_remarks.toUpperCase();
    // }
    // if (field == 'jvh_reference') {
    //   this.Record.jvh_reference = this.Record.jvh_reference.toUpperCase();
    // }

  }

  Close() {
    if (this.ModifiedRecords != null)
      this.ModifiedRecords.emit({ saction: 'CLOSE', sid: '' });
  }


  open(content: any) {
    this.modal = this.modalService.open(content);
  }


  onLostFocus(field: string) {
    //if (field == 'jvh_cc_code') {
    //  this.SearchRecord('jvh_cc_code');
    //}
  }

}
