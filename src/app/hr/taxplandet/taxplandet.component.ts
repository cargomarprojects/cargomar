import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { GlobalService } from '../../core/services/global.service';
import { TaxPlanm } from '../models/taxplanm';
import { TaxplanDetService } from '../services/taxplandet.service';
import { SearchTable } from '../../shared/models/searchtable';

@Component({
  selector: 'app-taxplandet',
  templateUrl: './taxplandet.component.html',
  providers: [TaxplanDetService]
})

export class TaxplanDetComponent {
  // Local Variables 
  title = 'Employee Tax';
  title2 = '';

  @Input() menuid: string = '';
  @Input() type: string = '';
  InitCompleted: boolean = false;
  menu_record: any;

  disableSave = true;
  loading = false;
  currentTab = 'LIST';

  searchstring = '';
  branch_id = '';
  company_id = '';
  page_count = 0;
  page_current = 0;
  page_rows = 0;
  page_rowcount = 0;
  ageinyears = '';

  sub: any;
  urlid: string;
  // type: string;

  ErrorMessage = "";
  InfoMessage = "";

  bAdmin = false;
  mode = '';
  pkid = '';
  new_userid = '';
  new_usercode = '';
  new_username = '';

  // Array For Displaying List
  RecordList: TaxPlanm[] = [];
  // Single Record for add/edit/view details
  Record: TaxPlanm = new TaxPlanm;
  USERRECORD: SearchTable = new SearchTable();

  constructor(
    private mainService: TaxplanDetService,
    private location: Location,
    private route: ActivatedRoute,
    private gs: GlobalService
  ) {
    this.page_count = 0;
    this.page_rows = 10;
    this.page_current = 0;
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
    this.title2 = this.gs.globalVariables.user_name + '@' + this.gs.globalVariables.year_name;
    this.bAdmin = false;
    this.new_userid = this.gs.globalVariables.user_pkid;
    this.new_usercode = this.gs.globalVariables.user_code;
    this.new_username = this.gs.globalVariables.user_name;
    this.menu_record = this.gs.getMenu(this.menuid);
    if (this.menu_record) {
      this.title = this.menu_record.menu_name;
      if (this.menu_record.rights_admin)
        this.bAdmin = true;
    }
    this.InitLov();
    this.LoadCombo();
    this.List("NEW");
  }

  InitLov() {
    this.USERRECORD = new SearchTable();
    this.USERRECORD.controlname = "USER";
    this.USERRECORD.displaycolumn = "CODE";
    this.USERRECORD.type = "USER";
    this.USERRECORD.where = "";
    this.USERRECORD.id = "";
    this.USERRECORD.code = "";
    this.USERRECORD.name = "";
  }
  LovSelected(_Record: SearchTable) {
    let bchange: boolean = false;

    if (_Record.controlname == "USER") {
      bchange = false;
      if (this.new_userid != _Record.id)
        bchange = true;
      this.new_userid = _Record.id;
      this.new_usercode = _Record.code;
      this.new_username = _Record.name;

      if (bchange) {
        if (this.new_userid != '')
          this.GetRecord(this.pkid, this.new_userid, this.new_username);
      }
    }
  }
  // Destroy Will be called when this component is closed
  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  LoadCombo() {

  }

  //function for handling LIST/NEW/EDIT Buttons
  ActionHandler(action: string, id: string, userid: string, user_name: string = '') {
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
      id = this.pkid;
      userid = this.new_userid;
      this.GetRecord(id, userid, '');
    }
    else if (action === 'EDIT') {
      this.currentTab = 'DETAILS';
      this.mode = 'EDIT';
      this.ResetControls();
      this.title2 = user_name + '@' + this.gs.globalVariables.year_name;
      this.pkid = id;
      this.GetRecord(id, userid, '');
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
      user_pkid: this.gs.globalVariables.user_pkid,
      user_code: this.gs.globalVariables.user_code,
      page_count: this.page_count,
      page_current: this.page_current,
      page_rows: this.page_rows,
      page_rowcount: this.page_rowcount,
      is_admin: this.bAdmin ? "Y" : "N",

      report_folder: this.gs.globalVariables.report_folder,
      file_pkid: this.gs.getGuid(),
      branch_name: this.gs.globalVariables.branch_name,
      year_name: this.gs.globalVariables.year_name


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

  NewRecord() {
    this.pkid = this.gs.getGuid();
    this.Record = new TaxPlanm();
    this.Record.tpm_pkid = this.pkid;
    this.Record.tpm_user_id = "";
    this.Record.tpm_user_name = "";
    this.Record.rec_mode = this.mode;
    this.InitLov();
    this.Initdefault();
  }

  Initdefault() {
    this.title2 = this.gs.globalVariables.user_name + '@' + this.gs.globalVariables.year_name;
    this.USERRECORD.id = this.new_userid;
    this.USERRECORD.code = this.new_usercode;
    this.USERRECORD.name = this.new_username;
  }

  // Load a single Record for VIEW/EDIT
  GetRecord(Id: string, UserId: string, _type: string) {
    this.loading = true;

    let SearchData = {
      pkid: Id,
      action: this.mode,
      comp_code: this.gs.globalVariables.comp_code,
      branch_name: this.gs.globalVariables.branch_name,
      year: this.gs.globalVariables.year_code,
      user_pkid: UserId,
      type: _type,
      report_folder: this.gs.globalVariables.report_folder,
      file_pkid: this.gs.getGuid(),
      name: this.title2,
      year_name: this.gs.globalVariables.year_name
    };

    this.ErrorMessage = '';
    this.InfoMessage = '';

    this.mainService.GetRecord(SearchData)
      .subscribe(response => {
        this.loading = false;
        if (_type == 'EXCEL')
          this.Downloadfile(response.filename, response.filetype, response.filedisplayname);
        else {
          this.LoadData(response.record);
          if (this.mode == "ADD" && response.record.rec_mode == "EDIT") {
            alert("INVESTMENTS FOR " + this.new_username + " ALREADY EXISTS, CREATED BY " + response.record.rec_created_by)
            this.NewRecord();
          }
        }
      },
        error => {
          this.loading = false;
          this.ErrorMessage = this.gs.getError(error);
          alert(this.ErrorMessage);
        });
  }

  LoadData(_Record: TaxPlanm) {
    this.Record = _Record;
  }
  Downloadfile(filename: string, filetype: string, filedisplayname: string) {
    this.gs.DownloadFile(this.gs.globalVariables.report_folder, filename, filetype, filedisplayname);
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
        if (this.mode == 'ADD') {
          this.title2 = this.new_username + '@' + this.gs.globalVariables.year_name;
          this.new_userid = '';
          this.new_usercode = '';
          this.new_username = '';
        }
        this.mode = 'EDIT';
        this.Record.rec_mode = this.mode;
        this.RefreshList();
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

    if (this.Record.DetailList.length <= 0) {

      bret = false;
      sError += "\n\r| No Details to Save";
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

    //var REC = this.RecordList.find(rec => rec.tpm_pkid == this.Record.tpm_pkid);
    //if (REC == null) {
    //  this.RecordList.push(this.Record);
    //}
    //else {
    //  REC.tpm_year = this.Record.tpm_year;
    //  REC.emp_name = this.Record.emp_name;
    //  REC.emp_alias = this.Record.emp_alias;
    //  REC.emp_father_name = this.Record.emp_father_name;
    //  REC.emp_spouse_name = this.Record.emp_spouse_name;
    //  REC.emp_blood_group = this.Record.emp_blood_group;
    //}
  }

  OnChange(field: string) {

    //this.ageinyears = '';
    //if (this.Record.emp_do_birth != null) {
    //  this.ageinyears = this.GetAge().ageyears + "Yrs";
    //}
  }

  OnBlur(field: string) {
    //if (field == 'emp_name') {
    //  this.Record.emp_name = this.Record.emp_name.toUpperCase();
    //}
  }
  OnBlurTableCell(field: string, fieldid: string) {
    let TotAmt: number = 0;
    var REC = this.Record.DetailList.find(rec => rec.tpd_plan_id == fieldid);
    if (REC != null) {

      if (field == "tpd_amt_invested") {
        REC.tpd_amt_invested = this.gs.roundNumber(REC.tpd_amt_invested, 2);
        TotAmt = REC.tpd_amt_invested + REC.tpd_amt_before_dec31;
        TotAmt = this.gs.roundNumber(TotAmt, 2);
        REC.tpd_amt_tot = TotAmt;
        // this.FindTotal();
      }
      if (field == "tpd_amt_before_dec31") {
        REC.tpd_amt_before_dec31 = this.gs.roundNumber(REC.tpd_amt_before_dec31, 2);
        TotAmt = REC.tpd_amt_invested + REC.tpd_amt_before_dec31;
        TotAmt = this.gs.roundNumber(TotAmt, 2);
        REC.tpd_amt_tot = TotAmt;
        //this.FindTotal();
      }
      if (field == "tpd_amt_after_dec31") {
        REC.tpd_amt_after_dec31 = this.gs.roundNumber(REC.tpd_amt_after_dec31, 2);
      }
    }
  }

  Close() {
    this.gs.ClosePage('home');
  }

  FindTotal() {
    let nAmt: number = 0;
    for (let rec of this.Record.DetailList) {
      nAmt += rec.tpd_amt_tot;
    }
    this.Record.tpm_tot_amt = this.gs.roundNumber(nAmt, 2);
  }
}


