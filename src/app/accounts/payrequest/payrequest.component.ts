import { Component, Input, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GlobalService } from '../../core/services/global.service';
import { PayRequestm } from '../models/payrequestm';
import { PayRequestService } from '../services/payrequest.service';
import { SearchTable } from '../../shared/models/searchtable';
import { DateComponent } from '../../shared/date/date.component';

@Component({
  selector: 'app-payrequest',
  templateUrl: './payrequest.component.html',
  providers: [PayRequestService]
})
export class PayRequestComponent {
  // Local Variables 
  title = 'PAYREQUEST MASTER';

  @ViewChild('pay_date') private pay_date: DateComponent;

  @Input() menuid: string = '';
  @Input() type: string = '';
  InitCompleted: boolean = false;
  menu_record: any;

  disableSave = true;
  loading = false;
  currentTab = 'LIST';
  selectedRowIndex = 0;

  searchstring = '';

  page_count = 0;
  page_current = 0;
  page_rows = 0;
  page_rowcount = 0;

  sub: any;
  urlid: string;
  bDocsUpload: boolean = false;
  bExcel: boolean = false;

  ErrorMessage = "";
  InfoMessage = "";

  mode = '';
  pkid = '';
  search_ispaid = 'B';
  search_mode = 'MBL-SE';
  search_currency = '';
  search_sort = 'm.hbl_pol_etd';
  // Array For Displaying List
  RecordList: PayRequestm[] = [];
  // Single Record for add/edit/view details
  Record: PayRequestm = new PayRequestm;

  // Shipper
  PARTYRECORD: SearchTable = new SearchTable();
  CURRECORD: SearchTable = new SearchTable();

  constructor(
    private mainService: PayRequestService,
    private route: ActivatedRoute,
    private gs: GlobalService
  ) {
    this.page_count = 0;
    this.page_rows = 15;
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
    this.bDocsUpload = false;
    this.bExcel = false;
    this.menu_record = this.gs.getMenu(this.menuid);
    if (this.menu_record) {
      this.title = this.menu_record.menu_name;
      if (this.menu_record.rights_print)
        this.bExcel = true;
    }
    this.InitLov();
    this.LoadCombo();
    this.currentTab = 'LIST';
    this.List("NEW");
  }

  // Destroy Will be called when this component is closed
  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  LoadCombo() {

  }


  InitLov() {

    this.PARTYRECORD = new SearchTable();
    this.PARTYRECORD.controlname = "PARTY";
    this.PARTYRECORD.displaycolumn = "CODE";
    this.PARTYRECORD.type = "ACCTM";
    this.PARTYRECORD.id = "";
    this.PARTYRECORD.code = "";
    this.PARTYRECORD.name = "";

    this.CURRECORD = new SearchTable();
    this.CURRECORD.controlname = "CURRENCY";
    this.CURRECORD.displaycolumn = "CODE";
    this.CURRECORD.type = "CURRENCY";
    this.CURRECORD.id = "";
    this.CURRECORD.code = "";
    this.CURRECORD.name = "";

  }

  LovSelected(_Record: SearchTable) {
    if (_Record.controlname == "PARTY") {
      this.Record.pay_acc_id = _Record.id;
      this.Record.pay_acc_code = _Record.code;
      this.Record.pay_acc_name = _Record.name;
    }

    if (_Record.controlname == "CURRENCY") {
      this.search_currency = _Record.code;
    }

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
      this.pkid = id;
      this.mode = 'EDIT';
      this.ResetControls();
      this.GetRecord(id, '');
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

  // Query List Data
  List(_type: string) {
    this.loading = true;
    let SearchData = {
      type: _type,
      rowtype: this.type,
      searchstring: this.searchstring.toUpperCase(),
      company_code: this.gs.globalVariables.comp_code,
      branch_code: this.gs.globalVariables.branch_code,
      year_code: this.gs.globalVariables.year_code,
      report_folder: this.gs.globalVariables.report_folder,
      ispaid: this.search_ispaid,
      search_mode: this.search_mode,
      search_currency: this.search_currency,
      search_sort:this.search_sort,
      page_count: this.page_count,
      page_current: this.page_current,
      page_rows: this.page_rows,
      page_rowcount: this.page_rowcount
    };

    this.ErrorMessage = '';
    this.InfoMessage = '';
    this.mainService.List(SearchData)
      .subscribe(response => {
        this.loading = false;
        if (_type == 'EXCEL')
          this.Downloadfile(response.filename, response.filetype, response.filedisplayname);
        else {
          this.RecordList = response.list;
          this.page_count = response.page_count;
          this.page_current = response.page_current;
          this.page_rowcount = response.page_rowcount;
        }
      },
        error => {
          this.loading = false;
          this.ErrorMessage = this.gs.getError(error);
        });
  }
  Downloadfile(filename: string, filetype: string, filedisplayname: string) {
    this.gs.DownloadFile(this.gs.globalVariables.report_folder, filename, filetype, filedisplayname);
  }

  NewRecord() {

    this.pkid = this.gs.getGuid();
    this.Record = new PayRequestm();
    this.Record.pay_pkid = this.pkid;
    this.Record.pay_no = null;
    this.Record.pay_date = this.gs.defaultValues.today;
    this.Record.pay_acc_id = '';
    this.Record.pay_acc_code = '';
    this.Record.pay_acc_name = '';
    this.InitLov();
    this.Record.rec_mode = this.mode;
  }

  // Load a single Record for VIEW/EDIT
  GetRecord(Id: string, _type: string) {
    this.loading = true;

    let SearchData = {
      pkid: Id
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

  LoadData(_Record: PayRequestm) {
    this.Record = _Record;
    this.Record.rec_mode = this.mode;

    this.InitLov();

    this.PARTYRECORD.id = this.Record.pay_acc_id;
    this.PARTYRECORD.code = this.Record.pay_acc_code;
    this.PARTYRECORD.name = this.Record.pay_acc_name;
  }

  // Save Data
  Save() {
    if (!this.allvalid())
      return;
    this.loading = true;
    this.ErrorMessage = '';
    this.InfoMessage = '';
    this.Record._globalvariables = this.gs.globalVariables;
    this.mainService.Save(this.Record)
      .subscribe(response => {
        this.loading = false;
        if (this.mode == 'ADD') {
          this.Record.pay_no = response.payno;
          this.InfoMessage = "New Record " + this.Record.pay_no + " Generated Successfully";
        } else
          this.InfoMessage = "Save Complete";

        this.mode = 'EDIT';
        this.Record.rec_mode = this.mode;
        this.RefreshList();
        alert(this.InfoMessage);
      },
        error => {
          this.loading = false;
          this.ErrorMessage = this.gs.getError(error);
          alert(this.ErrorMessage);
        });
  }

  allvalid() {
    let sError: string = "";
    let bret: boolean = true;
    this.ErrorMessage = '';
    this.InfoMessage = '';

    if (this.Record.pay_date.trim().length <= 0) {
      bret = false;
      sError += "\n\r | Date Cannot Be Blank";
    }
    if (this.Record.pay_acc_id.trim().length <= 0) {
      bret = false;
      sError += "\n\r | Party Cannot Be Blank";
    }
    //if (this.Record.ab_exp_id.trim().length <= 0) {
    //    bret = false;
    //    sError += "\n\r | Exporter Cannot Be Blank";
    //}

    if (bret === false)
      this.ErrorMessage = sError;
    return bret;
  }

  RefreshList() {
    if (this.RecordList == null)
      return;
    var REC = this.RecordList.find(rec => rec.pay_pkid == this.Record.pay_pkid);
    if (REC == null) {
      this.RecordList.push(this.Record);
      REC = this.RecordList.find(rec => rec.pay_pkid == this.Record.pay_pkid);
      REC.pay_date = this.pay_date.GetDisplayDate();
    }
    else {
      REC.pay_acc_name = this.Record.pay_acc_name;
      REC.pay_date = this.pay_date.GetDisplayDate();
    }
  }


  OnBlur(field: string) {
    switch (field) {
      //case 'ab_remarks':
      //  {
      //    this.Record.ab_remarks = this.Record.ab_remarks.toUpperCase();
      //    break;
      //  }
    }
  }

  Close() {
    this.gs.ClosePage('home');
  }
  showhiderow(rec: PayRequestm) {
    rec.rowdisplayed = !rec.rowdisplayed;
  }
  paidStatus(rec: PayRequestm) {

    if (!confirm("Change Paid Status to " + (rec.pay_is_paid == "Y" ? "NO" : "YES"))) {
      return;
    }

    rec.pay_is_paid = rec.pay_is_paid == "Y" ? "N" : "Y";

    this.loading = true;
    let SearchData = {
      pkid: rec.pay_pkid,
      paidstatus: rec.pay_is_paid
    };

    this.ErrorMessage = '';
    this.InfoMessage = '';
    this.mainService.PaidStatus(SearchData)
      .subscribe(response => {
        this.loading = false;
        rec.pay_is_paid = response.paidstatus;
      },
        error => {
          this.loading = false;
          this.ErrorMessage = this.gs.getError(error);
        });
  }


  ProcessRemarks() {
    if (!confirm("Update Paid Status")) {
      return;
    }

    this.loading = true;
    let SearchData = {
      pkid: '',
      parentid: '',
      company_code: this.gs.globalVariables.comp_code,
      branch_code: this.gs.globalVariables.branch_code,
      year_code: this.gs.globalVariables.year_code,
      user_code: this.gs.globalVariables.user_code
    };

    this.ErrorMessage = '';
    this.InfoMessage = '';
    this.mainService.ProcessRemarks(SearchData)
      .subscribe(response => {
        this.loading = false;
        this.List("NEW");
      },
        error => {
          this.loading = false;
          this.ErrorMessage = this.gs.getError(error);
        });
  }
}
