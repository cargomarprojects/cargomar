import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { GlobalService } from '../../core/services/global.service';
import { SearchTable } from '../../shared/models/searchtable';
import { MoneyTransfer } from '../models/moneytransfer';
import { MoneyTransferService } from '../services/moneytransfer.service';

@Component({
  selector: 'app-mtreport',
  templateUrl: './mtreport.component.html',
  providers: [MoneyTransferService]
})

export class MtReportComponent {
  /*

  */
  title = 'Money Transfer Report'
  @Input() menuid: string = '';
  @Input() type: string = '';
  InitCompleted: boolean = false;
  menu_record: any;
  sub: any;
  urlid: string;
  generatedtype: string = 'PENDING';
  fromdate: string = '';
  todate: string = '';
  tot_amt: number = 0;
  ErrorMessage = "";
  InfoMessage = "";
  mode = '';
  pkid = '';
  modal: any;
  bPrint = false;
  bAdmin = false;
  bCompany = false;
  disableSave = true;
  loading = false;
  currentTab = 'LIST';
  page_count = 0;
  page_current = 0;
  page_rows = 0;
  page_rowcount = 0;
  searchstring = "";
  jv_id: string = "";
  all: boolean = false;

  SearchData = {
    type: '',
    pkid: '',
    report_folder: '',
    company_code: '',
    branch_code: '',
    year_code: '',
    searchstring: '',
    report_type: '',
    from_date: '',
    to_date: '',
    page_count: this.page_count,
    page_current: this.page_current,
    page_rows: this.page_rows,
    page_rowcount: this.page_rowcount
  };

  // Array For Displaying List
  RecordList: MoneyTransfer[] = [];
  //  Single Record for add/edit/view details
  Record: MoneyTransfer = new MoneyTransfer;

  constructor(
    private modalService: NgbModal,
    private mainService: MoneyTransferService,
    private route: ActivatedRoute,
    private gs: GlobalService
  ) {
    this.page_count = 0;
    this.page_rows = 30;
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
    this.bPrint = false;
    this.bAdmin = false;
    this.bCompany = false;
    // this.fromdate = this.gs.getNewdate(1);
    this.fromdate = this.gs.defaultValues.today;
    this.todate = this.gs.defaultValues.today;
    this.menu_record = this.gs.getMenu(this.menuid);
    if (this.menu_record) {
      this.title = this.menu_record.menu_name;
      if (this.menu_record.rights_company)
        this.bCompany = true;
      if (this.menu_record.rights_admin)
        this.bAdmin = true;
      if (this.menu_record.rights_print)
        this.bPrint = true;
    }
    this.initLov();
    this.LoadCombo();
    this.Init();
    this.List('NEW');
  }

  Init() {

  }

  // // Destroy Will be called when this component is closed
  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  initLov(caption: string = '') {

  }

  LovSelected(_Record: SearchTable) {

  }
  LoadCombo() {

  }


  //function for handling LIST/NEW/EDIT Buttons
  ActionHandler(action: string, id: string) {
    this.ErrorMessage = '';
    if (action == 'LIST') {
      this.mode = '';
      this.pkid = '';
      this.currentTab = 'LIST';
    }
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

  // // Query List Data
  List(_type: string) {

    this.ErrorMessage = '';
    this.loading = true;
    this.pkid = this.gs.getGuid();
    this.SearchData.pkid = this.pkid;
    this.SearchData.report_folder = this.gs.globalVariables.report_folder;
    this.SearchData.company_code = this.gs.globalVariables.comp_code;
    this.SearchData.branch_code = this.gs.globalVariables.branch_code;
    this.SearchData.year_code = this.gs.globalVariables.year_code;
    this.SearchData.type = _type;
    this.SearchData.page_count = this.page_count;
    this.SearchData.page_current = this.page_current;
    this.SearchData.page_rows = this.page_rows;
    this.SearchData.page_rowcount = this.page_rowcount;
    this.SearchData.searchstring = this.searchstring;
    this.SearchData.report_type = this.generatedtype;
    this.SearchData.from_date = this.fromdate;
    this.SearchData.to_date = this.todate;

    this.ErrorMessage = '';
    this.mainService.MtReport(this.SearchData)
      .subscribe(response => {
        this.loading = false;
        if (_type == 'EXCEL')
          this.Downloadfile(response.filename, response.filetype, response.filedisplayname);
        else {
          this.RecordList = response.list;
          this.page_count = response.page_count;
          this.page_current = response.page_current;
          this.page_rowcount = response.page_rowcount;
          this.tot_amt = 0;
          for (let rec of this.RecordList) {
            this.tot_amt += rec.mt_txn_amt;
          }
          this.tot_amt = this.gs.roundNumber(this.tot_amt, 2);
        }
      },
        error => {
          this.loading = false;
          this.RecordList = null;
          this.ErrorMessage = this.gs.getError(error);
        });
  }

  Downloadfile(filename: string, filetype: string, filedisplayname: string) {
    this.gs.DownloadFile(this.gs.globalVariables.report_folder, filename, filetype, filedisplayname);
  }

  OnChange(field: string) {
    this.RecordList = null;
  }

  OnBlur(field: string) {
    if (field == 'Search')
      this.searchstring = this.searchstring.toUpperCase();
  }

  Close() {
    this.gs.ClosePage('home');
  }

  open(content: any) {
    this.modal = this.modalService.open(content);
  }

  ShowMoneyTransfer(moneytransfer: any, _jvid: string = "") {
    this.ErrorMessage = '';
    this.jv_id = _jvid;
    this.open(moneytransfer);
  }

  ModifiedRecords(params: any) {

    for (let rec of this.RecordList.filter(rec => rec.mt_jv_id == params.sid)) {
      if (params.saction == "GENERATE") {
        rec.mt_lock = params.mlock;
        rec.mt_cust_uniq_ref = params.custrefno;
      }
    }
    this.modal.close();
  }

  Generate(_type: string) {
    this.ErrorMessage = '';
    this.InfoMessage = '';
    let pre_data: string = '';
    let Multiple_Bank_Found: Boolean = false;
    let Generated_Bank_Found: Boolean = false;
    let Not_Aprvd_Found: Boolean = false;
    this.jv_id = "";
    pre_data = "";
    for (let rec of this.RecordList) {
      if (rec.mt_selected) {
        if (pre_data === "")
          pre_data = rec.mt_format;
        if (pre_data != rec.mt_format)
          Multiple_Bank_Found = true;

        if (rec.mt_aprvd != 'Y')
          Not_Aprvd_Found = true;

        if (_type != 'CHECK-LIST' && rec.mt_lock === 'G')
          Generated_Bank_Found = true;

        if (this.jv_id != "")
          this.jv_id += ",";
        this.jv_id += rec.mt_jv_id;
      }
    }

    if (this.jv_id.trim().length <= 0) {
      this.ErrorMessage = "\n\r | Please select Bank and Continue.....";
      return;
    }

    if (this.gs.globalVariables.user_code != 'ADMIN') {
     
      if (Multiple_Bank_Found) {
        this.ErrorMessage = "Different Bank Found in Selected List....";
        alert(this.ErrorMessage);
        return;
      }

      if (Not_Aprvd_Found) {
        this.ErrorMessage = "Only Approved Bank Entries Can be Transfered.";
        alert(this.ErrorMessage);
        return;
      }

      if (Generated_Bank_Found) {
        this.ErrorMessage = "One or More Records Already Generated.....";
        alert(this.ErrorMessage);
        return;
      }
    }
    
    if (_type != 'CHECK-LIST')
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
      pkid: this.jv_id,
      rowtype: _type
    };

    SearchData.report_folder = this.gs.globalVariables.report_folder;
    SearchData.company_code = this.gs.globalVariables.comp_code;
    SearchData.branch_code = this.gs.globalVariables.branch_code;
    SearchData.user_code = this.gs.globalVariables.user_code;
    SearchData.pkid = this.jv_id;
    SearchData.rowtype = _type;

    this.mainService.GenerateEdiBank(SearchData)
      .subscribe(response => {
        this.loading = false;

        for (let rec of this.RecordList) {
          if (rec.mt_selected) {
            rec.mt_lock = response.mtlock;
          }
        }
        // if (response.bank === 'IOB') {
        //   this.Downloadfile(response.filename, response.filetype, response.filedisplayname);
        // } else {
        //   this.InfoMessage = response.savemsg;
        //   alert(this.InfoMessage);
        // }
        for (let rec of response.filelist) {
          this.Downloadfile(rec.filename, rec.filetype, rec.filedisplayname);
        }
        this.List('NEW');
      },
        error => {
          this.loading = false;
          this.ErrorMessage = this.gs.getError(error);
        });
  }

}
