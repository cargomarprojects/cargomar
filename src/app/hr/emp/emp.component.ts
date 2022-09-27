
import { Component, Input, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Location } from '@angular/common';

import { ActivatedRoute } from '@angular/router';

import { GlobalService } from '../../core/services/global.service';

import { Emp } from '../models/emp';

import { EmpService } from '../services/emp.service';

import { Param } from '../../master/models/param';
import { DateComponent } from '../../shared/date/date.component';

@Component({
  selector: 'app-emp',
  templateUrl: './emp.component.html',
  providers: [EmpService]
})

export class EmpComponent {
  // Local Variables 
  title = 'EMP MASTER';

  @ViewChild('_do_relieve') private _do_relieve: DateComponent;
  @ViewChild('_do_confirmation') private _do_confirmation: DateComponent;
  @ViewChild('_do_joining') private _do_joining: DateComponent;
  @ViewChild('_do_birth') private _do_birth: DateComponent;
  @ViewChild('_trans_date') private _trans_date: DateComponent;

  @Input() menuid: string = '';
  @Input() type: string = '';
  InitCompleted: boolean = false;
  menu_record: any;
  selectedRowIndex = 0;

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
  
  lock_record: boolean = false;
  bPrint: boolean = false;
  bAdmin: boolean = false;
  bDocs: boolean = false;

  sub: any;
  urlid: string;
  // type: string;
  modal: any;

  ErrorMessage = "";
  InfoMessage = "";
  radio_emp: string = 'EMPLOYEE';

  mode = '';
  pkid = '';

  BloodGrList: any[] = [];
  GenderList: any[] = [];
  FuelList: any[] = [];
  VehicleTypeList: any[] = [];
  MaritalStatusList: any[] = [];
  GradeList: Param[] = [];
  DepartmentList: Param[] = [];
  DesignationList: Param[] = [];
  StatusList: Param[] = [];
  CountryList: Param[] = [];
  BranchList: any[] = [];
  StateList: Param[] = [];

  IncentiveTypeList: any[] = [];

  // Array For Displaying List
  RecordList: Emp[] = [];
  // Single Record for add/edit/view details
  Record: Emp = new Emp;

  constructor(
    private modalService: NgbModal,
    private mainService: EmpService,
    private location: Location,
    private route: ActivatedRoute,
    private gs: GlobalService
  ) {
    this.page_count = 0;
    this.page_rows = 30;
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
    this.bPrint = false;
    this.bAdmin = false;
    this.bDocs = false;
    this.menu_record = this.gs.getMenu(this.menuid);
    if (this.menu_record) {
      this.title = this.menu_record.menu_name;
      if (this.menu_record.rights_print)
        this.bPrint = true;
      if (this.menu_record.rights_admin)
        this.bAdmin = true;
      if (this.menu_record.rights_docs)
        this.bDocs = true;
    }
    this.LoadCombo();
  }
  // Destroy Will be called when this component is closed
  ngOnDestroy() {

  }

  LoadCombo() {

    this.BloodGrList = [{ "name": "N/A" }, { "name": "A+" }, { "name": "A-" },
    { "name": "B+" }, { "name": "B-" }, { "name": "O+" },
    { "name": "O-" }, { "name": "AB+" }, { "name": "AB-" },
    { "name": "A1" }, { "name": "A2" }, { "name": "A1B" },
    { "name": "A2B" }, { "name": "A1+" }];

    this.FuelList = [{ "name": "NIL" }, { "name": "PETROL" }, { "name": "DIESEL" }, { "name": "CNG" }];
    this.VehicleTypeList = [{ "id": "N", "name": "N/A" }, { "id": "T", "name": "2 Wheeler" }, { "id": "F", "name": "4 Wheeler" }, { "id": "B", "name": "Both" }];
    this.MaritalStatusList = [{ "id": "SINGLE", "name": "SINGLE" }, { "id": "MARRIED", "name": "MARRIED" }, { "id": "DIVORCED", "name": "DIVORCED" }];
    this.GenderList = [{ "id": "M", "name": "MALE" }, { "id": "F", "name": "FEMALE" }];

    //this.IncentiveTypeList = [{ "id": "NA", "name": "NA" }, { "id": "BIMONTHLY-A", "name": "BIMONTHLY-A" }, { "id": "BIMONTHLY-B", "name": "BIMONTHLY-B" }, { "id": "QUARTERLY", "name": "QUARTERLY" }];

    /*
    <option [value]="'NA'">NA</option>
    <option [value]="'BIMONTHLY-A'">BIMONTHLY-A</option>
    <option [value]="'BIMONTHLY-B'">BIMONTHLY-B</option>
    <option [value]="'QUARTERLY'">QUARTERLY</option>
    */


    this.loading = true;
    let SearchData = {
      type: 'type',
      comp_code: this.gs.globalVariables.comp_code,
      branch_code: this.gs.globalVariables.branch_code
    };

    SearchData.comp_code = this.gs.globalVariables.comp_code;
    SearchData.branch_code = this.gs.globalVariables.branch_code;

    this.ErrorMessage = '';
    this.InfoMessage = '';
    this.mainService.LoadDefault(SearchData)
      .subscribe(response => {
        this.loading = false;
        this.CountryList = response.countrylist;
        this.StateList = response.statelist;
        this.BranchList = response.branchlist;
        this.GradeList = response.gradelist;
        this.DepartmentList = response.departmentlist;
        this.DesignationList = response.designationlist;
        this.StatusList = response.statuslist;
        this.IncentiveTypeList = response.incentivelist;
        
        this.List("NEW");
      },
        error => {
          this.loading = false;
          this.ErrorMessage = this.gs.getError(error);
        });
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
      branch_id: this.gs.globalVariables.branch_pkid,
      company_id: this.gs.globalVariables.comp_pkid,
      branch_code: this.gs.globalVariables.branch_code,
      company_code: this.gs.globalVariables.comp_code,
      report_folder: this.gs.globalVariables.report_folder,
      empstatus: this.radio_emp,
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

    this.Record = new Emp();
    this.Record.emp_pkid = this.pkid;
    this.Record.emp_no = '';
    this.Record.emp_name = '';
    this.Record.emp_alias = '';
    this.Record.emp_father_name = '';
    this.Record.emp_spouse_name = '';
    this.Record.emp_blood_group = '';
    this.Record.emp_local_address1 = '';
    this.Record.emp_local_address2 = '';
    this.Record.emp_local_address3 = '';
    this.Record.emp_local_city = '';
    this.Record.emp_local_state_id = '';
    this.Record.emp_local_pin = '';
    this.Record.emp_local_pobox = '';
    this.Record.emp_local_country_id = '';
    this.Record.emp_home_address1 = '';
    this.Record.emp_home_address2 = '';
    this.Record.emp_home_address3 = '';
    this.Record.emp_home_city = '';
    this.Record.emp_home_state_id = '';
    this.Record.emp_home_pin = '';
    this.Record.emp_home_pobox = '';
    this.Record.emp_home_country_id = '';
    this.Record.emp_tel_resi = '';
    this.Record.emp_tel_office = '';
    this.Record.emp_mobile = '';
    this.Record.emp_mobile_office = '';
    this.Record.emp_email_personal = '';
    this.Record.emp_email_office = '';
    this.Record.emp_bank_acno = '';
    this.Record.emp_bank_name = '';
    this.Record.emp_bank_branch = '';
    this.Record.emp_ifsc_code = '';
    this.Record.emp_pfno = '';
    this.Record.emp_esino = '';
    this.Record.emp_pan = '';
    this.Record.emp_adhar_no = '';
    this.Record.emp_uan_no = '';
    this.Record.emp_fuel_type = '';
    this.Record.emp_fuel_limit = 0;
    this.Record.emp_bus_limit = 0;
    this.Record.emp_train_limit = 0;
    this.Record.emp_vehi_maint_limit = 0;
    this.Record.emp_drive_vehi_type = '';
    this.Record.emp_mobile_limit = 0;
    this.Record.emp_datacard_limit = '';
    //this.Record.emp_company_id = this.gs.globalVariables.comp_pkid;
    //this.Record.emp_branch_code = this.gs.globalVariables.branch_code;
    //this.Record.emp_branch_id = this.gs.globalVariables.branch_pkid;
    this.Record.emp_grade_id = '';
    this.Record.emp_department_id = '';
    this.Record.emp_designation_id = '';
    this.Record.emp_status_id = '';
    this.Record.emp_in_payroll = false;
    this.Record.emp_in_csv = false;
    this.Record.emp_marital_status = 'SINGLE';
    this.Record.emp_gender = 'M';
    this.Record.emp_comp_mediclaim = false;
    this.Record.emp_premium_amt = 0;
    this.Record.emp_mediclaim_provider = '';
    this.Record.emp_remarks = '';
    this.Record.emp_do_birth = '';
    this.Record.emp_marrige_date = '';
    this.Record.emp_do_joining = this.gs.defaultValues.today;
    this.Record.emp_do_confirmation = '';
    this.Record.emp_do_relieve = '';
    this.Record.emp_is_relieved = false;
    this.Record.emp_is_retired = false;
    this.Record.emp_trans_date = '';
    this.ageinyears = '';
    this.Record.emp_branch_group = 1;
    this.Record.rec_branch_code = this.gs.globalVariables.branch_code;
    this.Record.rec_mode = this.mode;
    this.Record.emp_incentive_type = 'NA';
    this.Record.emp_incentive_type_id = '';
    this.lock_record = false;
    this.Initdefault();

  }

  Initdefault() {
    this.Record.emp_blood_group = 'N/A';

    if (this.CountryList != null) {
      var REC = this.CountryList.find(rec => rec.param_name == 'INDIA');
      if (REC != null) {
        this.Record.emp_local_country_id = REC.param_pkid;
        this.Record.emp_home_country_id = REC.param_pkid;
      }
    }
    if (this.StateList != null) {
      var REC = this.StateList.find(rec => rec.param_name == 'KERALA');
      if (REC != null) {
        this.Record.emp_local_state_id = REC.param_pkid;
        this.Record.emp_home_state_id = REC.param_pkid;
      }
    }
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

  LoadData(_Record: Emp) {
    this.Record = _Record;
    this.Record.rec_mode = this.mode;
    this.Record.emp_branch_name = this.getBranchName(this.Record.rec_branch_code);
    this.ageinyears = '';
    if (this.Record.emp_do_birth != null) {
      this.ageinyears = this.GetAge().ageyears + "Yrs";
    }

    this.lock_record = true;
    if (this.Record.emp_edit_code.indexOf("{S}") >= 0)
      this.lock_record = false;
  }
  getBranchName(_BrCode: String) {
    let str = "";
    if (this.BranchList != null) {
      var REC = this.BranchList.find(rec => rec.comp_code == _BrCode);
      if (REC != null) {
        str = REC.comp_name;
      }
    }
    return str;
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
        this.ageinyears = '';
        if (this.Record.emp_do_birth != null) {
          this.ageinyears = this.GetAge().ageyears + "Yrs";
        }
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

    if (this.Record.emp_no.trim().length <= 0) {

      bret = false;
      sError += "\n\r| Code Cannot Be Blank";
    }

    if (this.Record.emp_name.trim().length <= 0) {

      bret = false;
      sError += "\n\r| Name Cannot Be Blank";
    }

    if (this.Record.emp_father_name.trim().length <= 0) {

      bret = false;
      sError += "\n\r| FatherName Cannot Be Blank";
    }

    if (this.Record.emp_do_birth.trim().length <= 0) {

      bret = false;
      sError += "\n\r| DOB Cannot Be Blank";
    }

    if (this.Record.emp_do_joining.trim().length <= 0) {

      bret = false;
      sError += "\n\r| Join Date Cannot Be Blank";
    }

    if (this.Record.emp_department_id.trim().length <= 0) {

      bret = false;
      sError += "\n\r| Department Cannot Be Blank";
    }

    if (this.Record.emp_designation_id.trim().length <= 0) {

      bret = false;
      sError += "\n\r| Designation Cannot Be Blank";
    }

    if (this.gs.isBlank(this.Record.emp_status_id)) {
      bret = false;
      sError += "\n\r| Employee Status Cannot Be Blank";
    }

    if (this.gs.isBlank(this.Record.emp_incentive_type_id)) {
      bret = false;
      sError += "\n\r| Incentive Type Cannot Be Blank";
    }
    

    if (this.GetFieldName("CONFIRMED").fieldid == this.Record.emp_status_id || this.GetFieldName("TRANSFER").fieldid == this.Record.emp_status_id) {

      if (this.Record.emp_do_confirmation.trim().length <= 0) {

        bret = false;
        sError += "\n\r| Confirm Date Cannot Be Blank";
      }
    }


    if (this.mode == 'ADD') {
      // if (this.GetFieldName("CONSULTANT").fieldid != this.Record.emp_status_id) {
      //   if (this.Record.emp_in_payroll == false) {

      //     bret = false;
      //     sError += "\n\r| Not Include in PayRoll ";

      //   }
      // }
      if (this.Record.emp_in_payroll == false) {
        bret = false;
        sError += "\n\r| Not Include in PayRoll ";
      }
    }

    if (this.mode == 'EDIT') {
      if (this.Record.emp_in_payroll == false && (this.Record.emp_trans_date.trim().length > 0) || this.Record.emp_is_relieved == true) {
        if (this.Record.emp_remarks.trim().length <= 0) {

          bret = false;
          sError += "\n\r| Please fill Transfer Remarks ";
        }

      }
    }

    // if (this.GetFieldName("CONSULTANT").fieldid == this.Record.emp_status_id) {
    //   if (this.Record.emp_in_payroll == true) {
    //     bret = false;
    //     sError += "\n\r| Please Untick Include in PayRoll ";
    //   }
    // }

    //if (this.Record.rec_branch_code != this.gs.globalVariables.branch_code) {
    //  bret = false;
    //  sError += "\n\r| selected branch and login branch are mismatch ";
    //}

    //if (this.Record.user_password.trim().length <= 0) {
    //    bret = false;
    //    sError += "\n\rPassword Cannot Be Blank";
    //}

    //if (bret) {

    //    this.Record.emp_remarks = this.Record.emp_remarks.toUpperCase();

    //}

    if (bret === false) {
      this.ErrorMessage = sError;
      alert(this.ErrorMessage);
    }
    return bret;
  }

  RefreshList() {

    if (this.RecordList == null)
      return;

    var REC = this.RecordList.find(rec => rec.emp_pkid == this.Record.emp_pkid);
    if (REC == null) {
      this.RecordList.push(this.Record);
      REC = this.RecordList.find(rec => rec.emp_pkid == this.Record.emp_pkid);
      REC.emp_do_joining = this._do_joining.GetDisplayDate();
      REC.emp_do_confirmation = this._do_confirmation.GetDisplayDate();
      REC.emp_do_relieve = this._do_relieve.GetDisplayDate();
      REC.emp_trans_date = this._trans_date.GetDisplayDate();
    }
    else {
      REC.emp_no = this.Record.emp_no;
      REC.emp_name = this.Record.emp_name;
      REC.emp_alias = this.Record.emp_alias;
      REC.emp_father_name = this.Record.emp_father_name;
      REC.emp_spouse_name = this.Record.emp_spouse_name;
      REC.emp_blood_group = this.Record.emp_blood_group;
      REC.emp_branch_name = this.Record.emp_branch_name;
      REC.emp_mobile = this.Record.emp_mobile;
      REC.emp_email_personal = this.Record.emp_email_personal;
      REC.emp_bank_acno = this.Record.emp_bank_acno;
      REC.emp_pfno = this.Record.emp_pfno;
      REC.emp_do_joining = this._do_joining.GetDisplayDate();
      REC.emp_do_confirmation = this._do_confirmation.GetDisplayDate();
      REC.emp_do_relieve = this._do_relieve.GetDisplayDate();
      REC.emp_trans_date = this._trans_date.GetDisplayDate();

    }
  }

  OnChange(field: string) {
    // if (field == 'emp_do_birth') {
    //   this.ageinyears = '';
    //   if (this.Record.emp_do_birth != null) {
    //     this.ageinyears = this.GetAge().ageyears + "Yrs";
    //   }
    // }
  }

  OnBlur(field: string) {
    if (field == 'emp_name') {
      this.Record.emp_name = this.Record.emp_name.toUpperCase();
    }
    if (field == 'emp_alias') {
      this.Record.emp_alias = this.Record.emp_alias.toUpperCase();
    }
    if (field == 'emp_father_name') {
      this.Record.emp_father_name = this.Record.emp_father_name.toUpperCase();
    }
    if (field == 'emp_spouse_name') {
      this.Record.emp_spouse_name = this.Record.emp_spouse_name.toUpperCase();
    }
    if (field == 'emp_mediclaim_provider') {
      this.Record.emp_mediclaim_provider = this.Record.emp_mediclaim_provider.toUpperCase();
    }
    if (field == 'emp_local_address1') {
      this.Record.emp_local_address1 = this.Record.emp_local_address1.toUpperCase();
    }
    if (field == 'emp_local_address2') {
      this.Record.emp_local_address2 = this.Record.emp_local_address2.toUpperCase();
    }
    if (field == 'emp_local_address3') {
      this.Record.emp_local_address3 = this.Record.emp_local_address3.toUpperCase();
    }
    if (field == 'emp_local_city') {
      this.Record.emp_local_city = this.Record.emp_local_city.toUpperCase();
    }
    if (field == 'emp_local_pobox') {
      this.Record.emp_local_pobox = this.Record.emp_local_pobox.toUpperCase();
    }
    if (field == 'emp_home_address1') {
      this.Record.emp_home_address1 = this.Record.emp_home_address1.toUpperCase();
    }
    if (field == 'emp_home_address2') {
      this.Record.emp_home_address2 = this.Record.emp_home_address2.toUpperCase();
    }
    if (field == 'emp_home_address3') {
      this.Record.emp_home_address3 = this.Record.emp_home_address3.toUpperCase();
    }
    if (field == 'emp_home_city') {
      this.Record.emp_home_city = this.Record.emp_home_city.toUpperCase();
    }
    if (field == 'emp_home_pobox') {
      this.Record.emp_home_pobox = this.Record.emp_home_pobox.toUpperCase();
    }
    if (field == 'emp_mobile') {
      this.Record.emp_mobile = this.Record.emp_mobile.toUpperCase();
    }
    if (field == 'emp_email_personal') {
      this.Record.emp_email_personal = this.Record.emp_email_personal.toUpperCase();
    }
    if (field == 'emp_email_office') {
      this.Record.emp_email_office = this.Record.emp_email_office.toUpperCase();
    }
    if (field == 'emp_bank_name') {
      this.Record.emp_bank_name = this.Record.emp_bank_name.toUpperCase();
    }
    if (field == 'emp_bank_branch') {
      this.Record.emp_bank_branch = this.Record.emp_bank_branch.toUpperCase();
    }
    if (field == 'emp_ifsc_code') {
      this.Record.emp_ifsc_code = this.Record.emp_ifsc_code.toUpperCase();
    }
    if (field == 'emp_pfno') {
      this.Record.emp_pfno = this.Record.emp_pfno.toUpperCase();
    }
    if (field == 'emp_esino') {
      this.Record.emp_esino = this.Record.emp_esino.toUpperCase();
    }
    if (field == 'emp_pan') {
      this.Record.emp_pan = this.Record.emp_pan.toUpperCase();
    }
    if (field == 'emp_remarks') {
      this.Record.emp_remarks = this.Record.emp_remarks.toUpperCase();
    }
    if (field == 'emp_adhar_no') {
      this.Record.emp_adhar_no = this.Record.emp_adhar_no.toUpperCase();
    }
    if (field == 'emp_uan_no') {
      this.Record.emp_uan_no = this.Record.emp_uan_no.toUpperCase();
    }
    //this.ageinyears = '';
    //if (field == 'emp_do_birth' && this.Record.emp_do_birth != null) {
    //  this.ageinyears = this.GetAge().ageyears;
    //}
    if (field == 'searchstring') {
      this.searchstring = this.searchstring.toUpperCase();
    }

  }


  Close() {
    this.gs.ClosePage('home');
  }



  CopyAddress(addrtype: string) {

    if (this.Record == null)
      return;

    if (addrtype === 'COPYTOPERMANENT') {
      this.Record.emp_home_address1 = this.Record.emp_local_address1;
      this.Record.emp_home_address2 = this.Record.emp_local_address2;
      this.Record.emp_home_address3 = this.Record.emp_local_address3;
      this.Record.emp_home_city = this.Record.emp_local_city;
      this.Record.emp_home_state_id = this.Record.emp_local_state_id;
      this.Record.emp_home_pin = this.Record.emp_local_pin;
      this.Record.emp_home_pobox = this.Record.emp_local_pobox;
      this.Record.emp_home_country_id = this.Record.emp_local_country_id;

    }

    else if (addrtype === 'COPYTOLOCAL') {
      this.Record.emp_local_address1 = this.Record.emp_home_address1;
      this.Record.emp_local_address2 = this.Record.emp_home_address2;
      this.Record.emp_local_address3 = this.Record.emp_home_address3;
      this.Record.emp_local_city = this.Record.emp_home_city;
      this.Record.emp_local_state_id = this.Record.emp_home_state_id;
      this.Record.emp_local_pin = this.Record.emp_home_pin;
      this.Record.emp_local_pobox = this.Record.emp_home_pobox;
      this.Record.emp_local_country_id = this.Record.emp_home_country_id;
    }

  }

  GetFieldName(fieldname: string) {

    let tablefield = {
      fieldid: ''
    };
    if (this.StatusList == null)
      return tablefield;

    var REC = this.StatusList.find(rec => rec.param_name == fieldname);
    if (REC != null) {

      tablefield.fieldid = REC.param_pkid.toString();
    }
    return tablefield;
  }

  ConvertStringToDate(sdatetype: string) {
    let datefield = {
      sdate: new Date()
    };

    if (sdatetype == null)
      return datefield;

    if (sdatetype != null) {
      let dob = new Date(sdatetype);
      datefield.sdate = dob;
    }
    return datefield;
  }

  GetAge() {
    let CalculateAge = {
      ageyears: ''
    };

    if (this.Record.emp_do_birth == null)
      return CalculateAge;
    if (this.Record.emp_do_birth.trim().length <= 0)
      return CalculateAge;
    var AgeYrs = 0;
    try {

      var tempdob = this.Record.emp_do_birth.split('-');
      let dobyr: number = +tempdob[0];
      let dobmn: number = +tempdob[1];
      let dobdy: number = +tempdob[2];

      let dob = new Date(dobyr, dobmn - 1, dobdy);
      let todaysdt = new Date();

      AgeYrs = todaysdt.getFullYear() - dob.getFullYear();
      let newdob = new Date((dobyr + AgeYrs), dobmn - 1, dobdy);

      if (todaysdt < newdob && AgeYrs != 0) {
        AgeYrs = AgeYrs - 1;
      }
    } catch (Error) {
      CalculateAge.ageyears = '';
    }
    if (AgeYrs > 0)
      CalculateAge.ageyears = AgeYrs.toString();
    return CalculateAge;
  }

  ShowDocuments(doc: any) {
    this.ErrorMessage = '';
    this.open(doc);
  }
  open(content: any) {
    this.modal = this.modalService.open(content);
  }
}


