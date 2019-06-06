import { Component, ViewEncapsulation, Input, OnInit, OnDestroy,Output, EventEmitter } from '@angular/core';
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

  CanDelete : boolean = false;

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
    this.currentTab = 'LIST';
    this.List("NEW");
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

    // if (_Record.controlname == "ACCTM") {
    //   this.Record.jvh_acc_id = _Record.id;
    //   this.Record.jvh_acc_code = _Record.code;
    //   this.Record.jvh_acc_name = _Record.name;
    // }
    // if (_Record.controlname == "CURRENCY") {
    //   this.Record.jvh_curr_id = _Record.id;
    //   this.Record.jvh_curr_code = _Record.code;
    //   this.Record.jvh_curr_name = _Record.name;
    //   this.Record.jvh_exrate = _Record.rate;
    //   this.bChanged = true;
    //   this.OnBlur('jvh_exrate');
    // }
  }


  //function for handling LIST/NEW/EDIT Buttons
  ActionHandler(action: string, id: string) {
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
      this.currentTab = 'DETAILS';
      this.mode = 'EDIT';
      this.ResetControls();
      this.pkid = id;
      this.GetRecord(id);
    }
    else if (action === 'REMOVE') {
      this.pkid = id;
      this.RemoveRecord(id);
    }
  }

  RemoveList(event: any) {
    if (event.selected) {
      if ( this.CanDelete)
        this.ActionHandler('REMOVE', event.id)
      else
        alert('Insufficient Rights')
    }
  }


  RemoveRecord(Id: string) {
    // this.loading = true;
    
    // let SearchData = {
    //   pkid: Id,
    //   comp_code: this.gs.globalVariables.comp_code,
    //   branch_code: this.gs.globalVariables.branch_code,
    //   user_code: this.gs.globalVariables.user_code,
    //   jvh_type : '',
    //   jvh_docno: '',
    //   jvh_narration : ''
    // };

    // var REC = this.RecordList.find(rec => rec.jvh_pkid == Id);
    // if (REC != null) {
    //   SearchData.jvh_type = REC.jvh_type;
    //   SearchData.jvh_docno = REC.jvh_docno;
    //   SearchData.jvh_narration = REC.jvh_acc_name + ', Dr ' + REC.jvh_debit.toString() + ',CR ' + REC.jvh_credit.toString();
    // }

    // this.ErrorMessage = '';
    // this.InfoMessage = '';
    // this.mainService.DeleteRecord(SearchData)
    //   .subscribe(response => {
    //     this.loading = false;
    //     this.RecordList.splice(this.RecordList.findIndex(rec => rec.jvh_pkid == this.pkid), 1);
    //     this.ErrorMessage = "Record Removed : " + SearchData.jvh_docno;
    //   },
    //   error => {
    //     this.loading = false;
    //     this.ErrorMessage = this.gs.getError(error);
    //   });
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


  folder_id: string;
  // Query List Data
  List(_type: string) {

    this.loading = true;

    this.folder_id = this.gs.getGuid();



    let SearchData = {
      type: _type,
      rowtype: this.type,
      subtype: '',
      showcurrency : (this.showCurrency) ? 'Y' : 'N',
      company_code: this.gs.globalVariables.comp_code,
      branch_code: this.gs.globalVariables.branch_code,
      year_code: this.gs.globalVariables.year_code,
      searchstring: this.searchstring.toUpperCase(),
      report_folder: this.gs.globalVariables.report_folder,
      folderid: this.folder_id,
      report_caption: this.title,
      page_count: this.page_count,
      page_current: this.page_current,
      page_rows: this.page_rows,
      page_rowcount: this.page_rowcount
    };


    

    if (SearchData.type == 'EXCEL2') {
      SearchData.type = 'EXCEL';
      SearchData.subtype = 'DIFFERENCE';
    }


    this.ErrorMessage = '';
    this.InfoMessage = '';
    this.mainService.List(SearchData)
      .subscribe(response => {
        this.loading = false;

        if (_type == 'EXCEL') {
          this.Downloadfile(_type);
          return;
        }

        if (_type == 'EXCEL2') {
          this.Downloadfile('EXCEL');
          return;
        }


        this.RecordList = response.list;
        this.page_count = response.page_count;
        this.page_current = response.page_current;
        this.page_rowcount = response.page_rowcount;

        if (_type == 'NEW') {
          this.DR_BAL = response.dr;
          this.CR_BAL = response.cr;
          this.BAL = response.bal;
        }

      },
      error => {
        this.loading = false;
        this.ErrorMessage = this.gs.getError(error);
      });
  }

  Downloadfile(_type: string) {
    this.gs.DownloadFile(this.gs.globalVariables.report_folder, this.folder_id, _type);
  }

  

  NewRecord() {
    this.lock_record = false;
    this.lock_date = false;

    this.pkid = this.gs.getGuid();
    this.Record = new MoneyTransfer();
     
    // this.Record.jvh_pkid = this.pkid;
    // this.Record.jvh_type = this.type;
    // this.Record.jvh_year = this.gs.globalVariables.year_code;
    // this.Record.jvh_date = '';
    // this.Record.jvh_reference = '';
    // this.Record.jvh_reference_date = '';
    // this.Record.jvh_narration = '';
    // this.Record.jvh_rec_source = 'JV';


    // this.Record.jvh_remarks = "";
    // this.Record.jvh_location = "";

    // this.Record.jvh_allocation_found = false;

    // this.Record.jvh_acc_id = '';
    // this.Record.jvh_acc_code = '';
    // this.Record.jvh_acc_name = '';
    // // this.Record.jvh_acc_br_id = '';

    // this.Record.jvh_curr_id = this.gs.defaultValues.param_curr_local_id;
    // this.Record.jvh_curr_code = this.gs.defaultValues.param_curr_local_code;
    // this.Record.jvh_curr_name = this.gs.defaultValues.param_curr_local_code;


    // this.Record.jvh_exrate = 1;

    // this.Record.jvh_cc_category = "NA";
    //this.Record.jvh_cc_code = "";
    //this.Record.jvh_cc_id = "";
    //this.Record.jvh_cc_name = "";

    //this.Record.jvh_org_invno = '';
    //this.Record.jvh_org_invdt = '';


    // this.Record.jvh_debit = 0;
    // this.Record.jvh_credit = 0;

    // this.Record.jvh_diff = 0;

    // this.Record.jvh_ftotal = 0;
    // this.Record.jvh_total = 0;
    // this.Record.jvh_bank = '';
    // this.Record.jvh_branch = '';
    // this.Record.jvh_chqno = 0;
    // this.Record.jvh_due_date = '';
    // this.Record.jvh_remarks = '';
    // this.Record.jvh_drcr = '';
    // this.Record.rec_category = '';

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
      pkid: Id,
    };

    this.ErrorMessage = '';
    this.InfoMessage = '';
    this.mainService.GetRecord(SearchData)
      .subscribe(response => {
        this.loading = false;
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
        this.RefreshList(response);
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

  RefreshList(retdata: any) {

    if (this.RecordList == null)
      return;

    // var REC = this.RecordList.find(rec => rec.jvh_pkid == this.Record.jvh_pkid);
    // if (REC == null) {
    //   this.Record.jvh_vrno = retdata.jvh_vrno;
    //   this.Record.jvh_docno = retdata.jvh_docno;
    //   this.RecordList.push(this.Record);
    // }
    // else {
    //   REC.jvh_reference = this.Record.jvh_reference;
    //   REC.jvh_narration = this.Record.jvh_narration;
    //   REC.jvh_debit = this.Record.jvh_debit;
    //   REC.jvh_credit = this.Record.jvh_credit;
    // }
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
    this.ModifiedRecords.emit({ saction: 'CLOSE', sid: ''});
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
