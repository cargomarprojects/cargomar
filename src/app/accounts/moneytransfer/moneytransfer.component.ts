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
  @Input() jvid: string = '';

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
  RefNo = '';

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
    // this.PARTYRECORD.where =  " CUST_IS_SHIPPER = 'Y' ";
    this.PARTYRECORD.id = "";
    this.PARTYRECORD.code = "";
    this.PARTYRECORD.name = "";
    this.PARTYRECORD.parentid = "";

    this.BENFRECORD = new SearchTable();
    this.BENFRECORD.controlname = "BENF";
    this.BENFRECORD.displaycolumn = "CODE";
    this.BENFRECORD.type = "BENEFICIARY";
    this.BENFRECORD.where = " (ben_branch_code ='" + this.gs.globalVariables.branch_code + "' or ben_branch_code is null ) ";
    this.BENFRECORD.id = "";
    this.BENFRECORD.code = "";
    this.BENFRECORD.name = "";
    this.BENFRECORD.parentid = "";
  }

  LovSelected(_Record: SearchTable) {

    let _bchanged: boolean = false;

    if (_Record.controlname == "PARTY") {
      if (this.Record.mt_party_id != _Record.id) {
        this.Record.mt_party_id = _Record.id;
        this.Record.mt_party_code = _Record.code;
        this.Record.mt_party_name = _Record.name;
        this.Record.mt_ben_name = "";
        this.Record.mt_ben_code = "";
        this.Record.mt_ben_acc_no = "";
        this.Record.mt_ben_acc_type = "";
        this.Record.mt_ben_addr1 = "";
        this.Record.mt_ben_addr2 = "";
        this.Record.mt_ben_addr3 = "";
        this.Record.mt_ben_city = "";
        this.Record.mt_ben_state = "";
        this.Record.mt_ben_pin = "";
        this.Record.mt_ben_ifsc = "";
        this.Record.mt_ben_bank_name = "";
        this.Record.mt_ben_email1 = "";
        this.Record.mt_ben_email2 = "";
        this.Record.mt_ben_mob = "";

        this.BENFRECORD = new SearchTable();
        this.BENFRECORD.controlname = "BENF";
        this.BENFRECORD.displaycolumn = "CODE";
        this.BENFRECORD.type = "BENEFICIARY";
        this.BENFRECORD.where = " (ben_branch_code ='" + this.gs.globalVariables.branch_code + "' or ben_branch_code is null ) ";
        this.BENFRECORD.id = "";
        this.BENFRECORD.code = "";
        this.BENFRECORD.name = "";
        this.BENFRECORD.parentid = this.Record.mt_party_id;
      }
    } else if (_Record.controlname == "BENF") {

      this.Record.mt_ben_id = _Record.id;
      this.SearchRecord("BENEFICIARY", this.Record.mt_ben_id, this.Record.mt_party_id);
    }
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
      jvid: ''
    }

    SearchData.jvid = this.jvid;

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
    this.Record.rec_mode = this.mode;
    if (this.mode == "ADD")
      this.RefNo = "";
    else
      this.RefNo = this.Record.mt_cust_cfno.toString();
    this.InitLov();

    this.PARTYRECORD.id = this.Record.mt_party_id;
    this.PARTYRECORD.code = this.Record.mt_party_code;
    this.PARTYRECORD.name = this.Record.mt_party_name;
    this.BENFRECORD.id = this.Record.mt_ben_id;
    this.BENFRECORD.code = this.Record.mt_ben_code;
    this.BENFRECORD.name = this.Record.mt_ben_name;
    this.BENFRECORD.parentid = this.Record.mt_party_id;

    

  }


  // Save Data
  Save() {
    //this.FindTotal();
    if (!this.allvalid())
      return;


    this.loading = true;
    this.ErrorMessage = '';
    this.InfoMessage = '';
    this.Record._globalvariables = this.gs.globalVariables;
    this.mainService.Save(this.Record)
      .subscribe(response => {
        this.loading = false;
        if (this.mode == 'ADD')
        {
          this.Record.mt_cust_cfno = response.refno;
          this.RefNo=this.Record.mt_cust_cfno.toString();
        }
        this.mode =  "EDIT";
        this.Record.rec_mode = this.mode;
        this.InfoMessage = "Save Complete";
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

    if (this.Record.mt_txn_mode.trim().length <= 0) {
      bret = false;
      sError += " | Payment Mode Cannot Be Blank";
    }
    if (this.Record.mt_pay_type.trim().length <= 0) {
      bret = false;
      sError += " | Payment Type Cannot Be Blank";
    }
    // if (this.Record.mt_value_date.trim().length <= 0) {
    //   bret = false;
    //   sError += " | Payment Date Cannot Be Blank";
    // }

    if (this.Record.mt_corp_code.trim().length <= 0) {
      bret = false;
      sError += " | Corporate Code Cannot Be Blank";
    }

    if (this.Record.mt_corp_acc_no.trim().length <= 0) {
      bret = false;
      sError += " | Debit A/c Number Cannot Be Blank";
    }

    if (this.Record.mt_txn_amt <= 0) {
      bret = false;
      sError += " | Amount Cannot Be Blank";
    }
    if (!bret)
      this.ErrorMessage = sError;
    return bret;
  }



  OnFocus(field: string) {
    this.bChanged = false;
  }

  OnChange(field: string) {
    this.bChanged = true;
  }


  OnBlur(field: string) {

    if (field == 'mt_corp_code') {
      this.Record.mt_corp_code = this.Record.mt_corp_code.toUpperCase();
    }
    if (field == 'mt_txn_amt') {
      this.Record.mt_txn_amt = this.gs.roundNumber(this.Record.mt_txn_amt, 2);
    }
    if (field == 'mt_remarks') {
      this.Record.mt_remarks = this.Record.mt_remarks.toUpperCase();
    }
  }

  Close() {
    if (this.ModifiedRecords != null)
      this.ModifiedRecords.emit({ saction: 'CLOSE', sid: this.Record.mt_jv_id, mlock: this.Record.mt_lock });
  }

  open(content: any) {
    this.modal = this.modalService.open(content);
  }

  onLostFocus(field: string) {
    //if (field == 'jvh_cc_code') {
    //  this.SearchRecord('jvh_cc_code');
    //}
  }

  SearchRecord(controlname: string, controlid: string, controlparentid: string) {
    if (controlid.trim().length <= 0)
      return;

    this.loading = true;
    let SearchData = {
      table: 'beneficiary',
      rowtype: this.type,
      company_code: this.gs.globalVariables.comp_code,
      branch_code: this.gs.globalVariables.branch_code,
      year_code: this.gs.globalVariables.year_code,
      ben_pkid: '',
      ben_parent_id: ''
    };

    SearchData.table = 'beneficiary';
    SearchData.company_code = this.gs.globalVariables.comp_code;
    SearchData.branch_code = this.gs.globalVariables.branch_code;
    SearchData.year_code = this.gs.globalVariables.year_code;
    SearchData.ben_pkid = controlid;
    SearchData.ben_parent_id = controlparentid;

    this.ErrorMessage = '';
    this.gs.SearchRecord(SearchData)
      .subscribe(response => {
        this.loading = false;
        this.ErrorMessage = '';

        if (controlname == 'BENEFICIARY') {
          this.Record.mt_ben_name = "";
          this.Record.mt_ben_code = "";
          this.Record.mt_ben_acc_no = "";
          this.Record.mt_ben_acc_type = "";
          this.Record.mt_ben_addr1 = "";
          this.Record.mt_ben_addr2 = "";
          this.Record.mt_ben_addr3 = "";
          this.Record.mt_ben_city = "";
          this.Record.mt_ben_state = "";
          this.Record.mt_ben_pin = "";
          this.Record.mt_ben_ifsc = "";
          this.Record.mt_ben_bank_name = "";
          this.Record.mt_ben_email1 = "";
          this.Record.mt_ben_email2 = "";
          this.Record.mt_ben_mob = "";
        }

        if (response.beneficiary.length > 0) {

          if (controlname == 'BENEFICIARY') {

            this.Record.mt_ben_name = response.beneficiary[0].ben_name;
            this.Record.mt_ben_code = response.beneficiary[0].ben_code;
            this.Record.mt_ben_acc_no = response.beneficiary[0].ben_acc_no;
            this.Record.mt_ben_acc_type = response.beneficiary[0].ben_acc_type;
            this.Record.mt_ben_addr1 = response.beneficiary[0].ben_addr1;
            this.Record.mt_ben_addr2 = response.beneficiary[0].ben_addr2;
            this.Record.mt_ben_addr3 = response.beneficiary[0].ben_addr3;
            this.Record.mt_ben_city = response.beneficiary[0].ben_city;
            this.Record.mt_ben_state = response.beneficiary[0].ben_state_name;
            this.Record.mt_ben_pin = response.beneficiary[0].ben_pin;
            this.Record.mt_ben_ifsc = response.beneficiary[0].ben_ifsc;
            this.Record.mt_ben_bank_name = response.beneficiary[0].ben_bank_name;
            this.Record.mt_ben_email1 = response.beneficiary[0].ben_email1;
            this.Record.mt_ben_email2 = response.beneficiary[0].ben_email2;
            this.Record.mt_ben_mob = response.beneficiary[0].ben_mob;
          }

        }
        else {
          this.ErrorMessage = 'Invalid Details';
        }
      },
        error => {
          this.loading = false;
          this.ErrorMessage = this.gs.getError(error);
        });
  }
  Generate() {
    this.ErrorMessage = '';
    this.InfoMessage = '';
    if (this.jvid.trim().length <= 0) {
      this.ErrorMessage = "\n\r | Invalid ID";
      return;
    }

    if (!confirm("Do you want to Generate")) {
      return;
    }

    this.loading = true;
    this.ErrorMessage = '';
    let SearchData = {
      report_folder: this.gs.globalVariables.report_folder,
      company_code: this.gs.globalVariables.comp_code,
      branch_code: this.gs.globalVariables.branch_code,
      user_code: this.gs.globalVariables.user_code,
      pkid: this.jvid
    };

    SearchData.report_folder = this.gs.globalVariables.report_folder;
    SearchData.company_code = this.gs.globalVariables.comp_code;
    SearchData.branch_code = this.gs.globalVariables.branch_code;
    SearchData.user_code = this.gs.globalVariables.user_code;
    SearchData.pkid = this.jvid;

    this.mainService.GenerateEdiBank(SearchData)
      .subscribe(response => {
        this.loading = false;
        this.Record.mt_lock = response.mtlock;
        this.Record.mt_cust_uniq_ref = response.custrefno;
        // if (response.bank === 'IOB') {
        //   this.Downloadfile(response.filename, response.filetype, response.filedisplayname);
        // } else {
        //   this.InfoMessage = response.savemsg;
        //   alert(this.InfoMessage);
        // }

        if (this.ModifiedRecords != null)
          this.ModifiedRecords.emit({ saction: 'GENERATE', sid: this.Record.mt_jv_id, mlock: this.Record.mt_lock, custrefno: this.Record.mt_cust_uniq_ref });

          this.Downloadfile(response.filename, response.filetype, response.filedisplayname);
      },
        error => {
          this.loading = false;
          this.ErrorMessage = this.gs.getError(error);
        });
  }

  Downloadfile(filename: string, filetype: string, filedisplayname: string) {
    this.gs.DownloadFile(this.gs.globalVariables.report_folder, filename, filetype, filedisplayname);
  }

}
