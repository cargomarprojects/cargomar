import { Component, Input, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GlobalService } from '../../core/services/global.service';
import { LeaveReq } from '../models/leavereq';
import { LeaveReqService } from '../services/leavereq.service';
import { SearchTable } from '../../shared/models/searchtable';
import { AutoCompleteComponent } from '../../shared/autocomplete/autocomplete.component';

@Component({
  selector: 'app-leavereq',
  templateUrl: './leavereq.component.html',
  providers: [LeaveReqService]
})
export class LeaveReqComponent {
  // Local Variables 
  title = 'Leave Request';

  // @ViewChild('EmpLov') private EmpLovCtrl: AutoCompleteComponent;

  @Input() menuid: string = '';
  @Input() type: string = '';
  InitCompleted: boolean = false;
  menu_record: any;
  approvalstatus: string = '';

  selectedRowIndex = 0;

  disableSave = true;
  loading = false;
  currentTab = 'LIST';

  searchstring = '';
  fromdate: string;
  todate: string;

  levcaption1: string = "Full Day";
  levcaption2: string = "Half Day";
  levcaption3: string = "Leave Taken";
  levcaption4: string = "Leave Balance";
  levyear = 0;
  levmonth = 0;
  lev_pl_tkn = 0;
  lev_pl_bal = 0;
  lev_cl_tkn = 0;
  lev_cl_bal = 0;
  lev_sl_tkn = 0;
  lev_sl_bal = 0;

  page_count = 0;
  page_current = 0;
  page_rows = 0;
  page_rowcount = 0;

  lock_record: boolean = false;
  bChanged: boolean = false;
  sub: any;
  urlid: string;
  bJoinRelieve: boolean = false;
  bPrint: boolean = false;
  bAdmin: boolean = false;
  bCompany: boolean = false;
  porttype = 'PORT';


  ErrorMessage = "";
  InfoMessage = "";
  // emp_status = "CONFIRMED";

  mode = '';
  pkid = '';

  // Array For Displaying List
  RecordList: LeaveReq[] = [];
  // Single Record for add/edit/view details
  Record: LeaveReq = new LeaveReq;
  EMPRECORD: SearchTable = new SearchTable();

  constructor(
    private mainService: LeaveReqService,
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

  ngAfterViewInit() {

  }

  InitComponent() {
    this.bPrint = false;
    this.bAdmin = false;
    this.bCompany = false;
    this.fromdate = this.gs.globalVariables.year_start_date;
    this.todate = this.gs.defaultValues.today;
    this.menu_record = this.gs.getMenu(this.menuid);
    if (this.menu_record) {
      this.title = this.menu_record.menu_name;
      this.bPrint = this.menu_record.rights_print;
      this.bAdmin = this.menu_record.rights_admin;
      this.bCompany = this.menu_record.rights_company;
      if (this.menu_record.rights_approval.length > 0)
        this.approvalstatus = this.menu_record.rights_approval.toString().trim();
    }

    if (this.gs.isBlank(this.approvalstatus) && this.gs.globalVariables.user_code == 'ADMIN')
      this.approvalstatus = 'APPROVED,SANCTIONED,REJECTED'
    this.InitLov();
    this.LoadCombo();
  }

  // Destroy Will be called when this component is closed
  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  LoadCombo() {

    //this.loading = true;
    //let SearchData = {
    //  type: 'type',
    //  comp_code: this.gs.globalVariables.comp_code,
    //  branch_code: this.gs.globalVariables.branch_code
    //};

    //this.ErrorMessage = '';
    //this.InfoMessage = '';
    //this.mainService.LoadDefault(SearchData)
    //  .subscribe(response => {
    //    this.loading = false;
    //    this.StatusList = response.statuslist;

    //    this.List("NEW");
    //  },
    //  error => {
    //    this.loading = false;
    //    this.ErrorMessage = this.gs.getError(error);
    //  });

    this.List("NEW");
  }


  InitLov() {
    this.EMPRECORD = new SearchTable();
    this.EMPRECORD.controlname = "EMPLOYEE";
    this.EMPRECORD.displaycolumn = "CODE";
    this.EMPRECORD.type = "EMPLOYEE";
    this.EMPRECORD.where = " a.rec_branch_code ='" + this.gs.globalVariables.branch_code + "' ";
    this.EMPRECORD.id = this.gs.globalVariables.emp_id;
    this.EMPRECORD.code = this.gs.globalVariables.emp_code;
    this.EMPRECORD.name = this.gs.globalVariables.emp_name;
  }
  LovSelected(_Record: SearchTable) {
    if (_Record.controlname == "EMPLOYEE") {
      this.Record.lr_emp_id = _Record.id;
      this.Record.lr_emp_code = _Record.code;
      this.Record.lr_emp_name = _Record.name;
      this.Record.rec_category = _Record.col1;
      this.GetLeaveStatus();
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
      this.GetLeaveStatus();
    }
    else if (action === 'EDIT') {
      this.currentTab = 'DETAILS';
      this.mode = 'EDIT';
      this.ResetControls();
      this.pkid = id;
      this.GetRecord(id);
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
    if (this.mode == "EDIT")
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
      user_code: this.gs.globalVariables.user_code,
      emp_code: this.gs.globalVariables.emp_code,
      emp_id: this.gs.globalVariables.emp_id,
      fromdate: this.fromdate,
      todate: this.todate,
      is_admin: this.bAdmin,
      is_company: this.bCompany,
      report_folder: this.gs.globalVariables.report_folder,
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
          alert(this.ErrorMessage);
        });
  }
  Downloadfile(filename: string, filetype: string, filedisplayname: string) {
    this.gs.DownloadFile(this.gs.globalVariables.report_folder, filename, filetype, filedisplayname);
  }
  NewRecord() {
    this.pkid = this.gs.getGuid();
    this.Record = new LeaveReq();
    this.Record.lr_pkid = this.pkid;
    this.Record.lr_emp_id = this.gs.globalVariables.emp_id;
    this.Record.lr_emp_code = this.gs.globalVariables.emp_code;
    this.Record.lr_emp_name = this.gs.globalVariables.emp_name;
    this.Record.lr_apply_date = this.gs.defaultValues.today;
    this.Record.lr_from_date = '';
    this.Record.lr_to_date = '';
    this.Record.lr_join_date = '';
    this.Record.lr_pl_days = 0;
    this.Record.lr_pl_half_days = 0;
    this.Record.lr_cl_days = 0;
    this.Record.lr_cl_half_days = 0;
    this.Record.lr_sl_days = 0;
    this.Record.lr_sl_half_days = 0;
    this.Record.lr_lop_days = 0;
    this.Record.lr_lop_half_days = 0;
    this.Record.lr_is_travelling = false;
    this.Record.lr_travelling_days = 0;
    this.Record.lr_travelling_half_days = 0;
    this.Record.rec_category = this.gs.globalVariables.emp_status;
    this.lock_record = false;
    this.InitLov();
    this.Record.rec_mode = this.mode;
    this.lev_pl_tkn = 0;
    this.lev_pl_bal = 0;
    this.lev_cl_tkn = 0;
    this.lev_cl_bal = 0;
    this.lev_sl_tkn = 0;
    this.lev_sl_bal = 0;
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
          alert(this.ErrorMessage);
        });
  }

  LoadData(_Record: LeaveReq) {
    this.Record = _Record;
    this.Record.rec_mode = this.mode;
    this.InitLov();
    this.EMPRECORD.id = this.Record.lr_emp_id;
    this.EMPRECORD.code = this.Record.lr_emp_code;
    this.EMPRECORD.name = this.Record.lr_emp_name;
    this.lock_record = true;
    if (this.Record.lr_edit_code.indexOf("{S}") >= 0)
      this.lock_record = false;
    this.GetLeaveStatus();
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
    let _num = 0;
    let _num2 = 0;
    this.ErrorMessage = '';
    this.InfoMessage = '';
    if (this.gs.isBlank(this.Record.lr_emp_id)) {
      bret = false;
      sError += "\n\r | Emplyoee Cannot Be Blank";
    }
    if (this.gs.isBlank(this.Record.lr_from_date)) {
      bret = false;
      sError += "\n\r | From Date Cannot be Blank ";
    }

    if (this.gs.isBlank(this.Record.lr_to_date)) {
      bret = false;
      sError += "\n\r | To Date Cannot be Blank ";
    }

    if (this.gs.isBlank(this.Record.lr_join_date)) {
      bret = false;
      sError += "\n\r | Joining Date Cannot be Blank ";
    }
    _num = this.Record.lr_travelling_days + this.Record.lr_travelling_half_days;
    if (this.Record.lr_is_travelling) {
      if (_num <= 0) {
        bret = false;
        sError += "\n\r | Value required for travelling days ";
      }
    }
    if (_num > 0 && !this.Record.lr_is_travelling) {
      bret = false;
      sError += "\n\r | Please select Travelling to enter travelling days";
    }

    _num2 = this.Record.lr_pl_days + this.Record.lr_pl_half_days;
    _num2 += this.Record.lr_sl_days + this.Record.lr_sl_half_days;
    _num2 += this.Record.lr_cl_days + this.Record.lr_cl_half_days;
    _num2 += this.Record.lr_lop_days + this.Record.lr_lop_half_days;
    if (_num2 <= 0 && !this.Record.lr_is_travelling) {
      bret = false;
      sError += "\n\r | Value required for atleast one leave category";
    }

    if (_num > 0 && _num2 > 0) {
      bret = false;
      sError += "\n\r | Both leave and travel cannot be applied together. ";
    }

    if (this.gs.isBlank(this.Record.lr_remarks)) {
      bret = false;
      sError += "\n\r | Reason Cannot be Blank ";
    }

    if (bret === false) {
      this.ErrorMessage = sError;
      alert(this.ErrorMessage);
    }
    return bret;
  }

  RefreshList() {
    if (this.RecordList == null)
      return;
    var REC = this.RecordList.find(rec => rec.lr_pkid == this.Record.lr_pkid);
    if (REC == null) {
      this.RecordList.push(this.Record);
    }
    else {
      REC.lr_emp_code = this.Record.lr_emp_code;
      REC.lr_emp_name = this.Record.lr_emp_name;
      REC.lr_from_date = this.Record.lr_from_date;
      REC.lr_to_date = this.Record.lr_to_date;
      REC.lr_join_date = this.Record.lr_join_date;
      REC.lr_pl_days = this.Record.lr_pl_days;
      REC.lr_pl_half_days = this.Record.lr_pl_half_days;
      REC.lr_cl_days = this.Record.lr_cl_days;
      REC.lr_cl_half_days = this.Record.lr_cl_half_days;
      REC.lr_sl_days = this.Record.lr_sl_days;
      REC.lr_sl_half_days = this.Record.lr_sl_half_days;
      REC.lr_lop_days = this.Record.lr_lop_days;
      REC.lr_lop_half_days = this.Record.lr_lop_half_days;
    }
  }

  OnFocus(field: string) {
    if (field == 'lev_year' || field == 'lev_month')
      this.bChanged = false;
  }

  OnChange(field: string) {
    if (field == 'lev_year' || field == 'lev_month')
      this.bChanged = true;
    else if (field == 'lr_is_travelling') {

    }
  }
  OnBlur(field: string) {
    // if (field == 'lev_year') {
    //   this.FindHolidays();
    // }
    // if (field == 'lev_month') {
    //   this.FindHolidays();
    // }
    // if (field == 'lev_lp') {
    //   this.FindDaysWorked();
    // }
    // if (field == 'lev_days_worked') {
    //   this.FindLpDays();
    // }


    if (field == 'lr_pl_days') {
      this.Record.lr_pl_days = this.gs.roundNumber(this.Record.lr_pl_days, 0);
    }
    if (field == 'lr_cl_days') {
      this.Record.lr_cl_days = this.gs.roundNumber(this.Record.lr_cl_days, 0);
    }
    if (field == 'lr_sl_days') {
      this.Record.lr_sl_days = this.gs.roundNumber(this.Record.lr_sl_days, 0);
    }
    if (field == 'lr_lop_days') {
      this.Record.lr_lop_days = this.gs.roundNumber(this.Record.lr_lop_days, 0);
    }
    if (field == 'lr_travelling_days') {
      this.Record.lr_travelling_days = this.gs.roundNumber(this.Record.lr_travelling_days, 0);
    }

    if (field == 'lr_pl_half_days') {
      this.Record.lr_pl_half_days = this.gs.roundNumber(this.Record.lr_pl_half_days, 0);
    }
    if (field == 'lr_cl_half_days') {
      this.Record.lr_cl_half_days = this.gs.roundNumber(this.Record.lr_cl_half_days, 0);
    }
    if (field == 'lr_sl_half_days') {
      this.Record.lr_sl_half_days = this.gs.roundNumber(this.Record.lr_sl_half_days, 0);
    }
    if (field == 'lr_lop_half_days') {
      this.Record.lr_lop_half_days = this.gs.roundNumber(this.Record.lr_lop_half_days, 0);
    }
    if (field == 'lr_travelling_half_days') {
      this.Record.lr_travelling_half_days = this.gs.roundNumber(this.Record.lr_travelling_half_days, 0);
    }



    //sql += " select lr_pkid,lr_emp_id,lr_apply_date,lr_from_date, ";
    //sql += " lr_to_date,lr_join_date,lr_cl_days,lr_cl_half_days, ";
    //sql += " lr_sl_days,lr_sl_half_days,lr_pl_days,lr_pl_half_days, ";
    //sql += " lr_lop_days,lr_lop_half_days,lr_remarks, ";
    //sql += " lr_approved_by,lr_approved_date,lr_sanctioned_by,lr_sanctioned_date,";
    //sql += " lr_rejected_by,lr_rejected_date,lr_is_travelling,lr_travelling_days,lr_travelling_half_days";
    //sql += " ,emp_no,emp_name,c.comp_name as branch_name ";
    //sql += " ,row_number() over(order by emp_no,lr_apply_date) rn ";

    if (field == 'lr_remarks') {
      this.Record.lr_remarks = this.Record.lr_remarks.toUpperCase();
    }
  }


  Close() {
    this.gs.ClosePage('home');
  }

  GetBrAddress(straddress: string) {
    let AddressSplit = {
      addressbrno: '',
      address: ''
    };
    if (straddress.trim() != "") {
      var temparr = straddress.split(' ');
      AddressSplit.addressbrno = temparr[0];
      AddressSplit.address = straddress.substr(AddressSplit.addressbrno.length).trim();
    }

    return AddressSplit;
  }

  GetLeaveStatus() {
    this.loading = true;
    let SearchData = {
      levempid: this.Record.lr_emp_id,
      company_code: this.gs.globalVariables.comp_code,
      branch_code: this.gs.globalVariables.branch_code,
      year_code: this.gs.globalVariables.year_code
    };

    this.ErrorMessage = '';
    this.InfoMessage = '';
    this.mainService.GetLeaveStatus(SearchData)
      .subscribe(response => {
        this.loading = false;
        this.lev_pl_tkn = response.lev_pl_tkn;
        this.lev_pl_bal = response.lev_pl_bal;
        this.lev_cl_tkn = response.lev_cl_tkn;
        this.lev_cl_bal = response.lev_cl_bal;
        this.lev_sl_tkn = response.lev_sl_tkn;
        this.lev_sl_bal = response.lev_sl_bal;
      },
        error => {
          this.loading = false;
          this.ErrorMessage = this.gs.getError(error);
          alert(this.ErrorMessage);
        });
  }

  ModifiedRecords(params: any) {
    var REC = this.RecordList.find(rec => rec.lr_pkid == params.sid);
    if (REC != null) {
      REC.lr_approved_by = params.approved_by;
      REC.lr_sanctioned_by = params.sanctioned_by;
      REC.lr_rejected_by = params.rejected_by;
    }
    if (params.stype == "SAVE")
      this.lock_record = true;
  }

  MailLeaveRequest() {
    if (!confirm("Do you want to Sent Request Mail")) {
      return;
    }
    this.loading = true;
    let SearchData = {
      pkid: this.Record.lr_pkid,
      comp_code: this.gs.globalVariables.comp_code,
      branch_code: this.gs.globalVariables.branch_code,
      branch_name: this.gs.globalVariables.branch_name,
      user_code: this.gs.globalVariables.user_code,
      user_name: this.gs.globalVariables.user_name,
      user_pkid: this.gs.globalVariables.user_pkid
    };
    this.ErrorMessage = '';
    this.InfoMessage = '';
    this.mainService.MailLeaveRequest(SearchData)
      .subscribe(response => {
        this.loading = false;
        this.InfoMessage = response.mailmsg;
        alert(this.InfoMessage);
      },
        error => {
          this.loading = false;
          this.ErrorMessage = this.gs.getError(error);
          alert(this.ErrorMessage);
        });
  }

}
