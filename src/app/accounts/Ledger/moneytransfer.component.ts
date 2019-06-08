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

    this.BENFRECORD = new SearchTable();
    this.BENFRECORD.controlname = "BENF";
    this.BENFRECORD.displaycolumn = "CODE";
    this.BENFRECORD.type = "BENEFICIARY";
    //    this.BENFRECORD.where = " CUST_IS_SHIPPER = 'Y' ";
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
        //    this.BENFRECORD.where = " CUST_IS_SHIPPER = 'Y' ";
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
      jvid: '',
      jvaccid: '',
      jvaccname: '',
      jvhdocno: ''
    }

    SearchData.jvhid = this.jvhid;
    SearchData.jvaccid = this.jvaccid;
    SearchData.jvaccname = this.jvaccname;
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

    this.PARTYRECORD.id = this.Record.mt_party_id;
    this.PARTYRECORD.code = this.Record.mt_party_code;
    this.PARTYRECORD.name = this.Record.mt_party_name;
    this.BENFRECORD.id = this.Record.mt_ben_id;
    this.BENFRECORD.code = this.Record.mt_ben_code;

    this.Record.rec_mode = this.mode;

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

    this.loading = true;
    this.ErrorMessage = '';
    let SearchData = {
      report_folder: this.gs.globalVariables.report_folder,
      company_code: this.gs.globalVariables.comp_code,
      branch_code: this.gs.globalVariables.branch_code,
      pkid: this.jvid
    };

    SearchData.report_folder = this.gs.globalVariables.report_folder;
    SearchData.company_code = this.gs.globalVariables.comp_code;
    SearchData.branch_code = this.gs.globalVariables.branch_code;
    SearchData.pkid = this.jvid;

    this.mainService.GenerateEdiBank(SearchData)
      .subscribe(response => {
        this.loading = false;
        this.InfoMessage = response.savemsg;
      },
        error => {
          this.loading = false;
          this.ErrorMessage = this.gs.getError(error);
        });
  }

}
