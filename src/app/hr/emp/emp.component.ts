
import { Component, Input, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Location } from '@angular/common';

import { ActivatedRoute } from '@angular/router';

import { GlobalService } from '../../core/services/global.service';

import { Emp, EmpDocs } from '../models/emp';

import { EmpService } from '../services/emp.service';

import { Param } from '../../master/models/param';
import { DateComponent } from '../../shared/date/date.component';
import { SearchTable } from '../../shared/models/searchtable';
import { CustomReportD } from '../../shared/models/customreporth';

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

  bValueChanged: boolean = false;

  disableSave = true;
  loading = false;
  currentTab = 'LIST';

  upload_type = "EMPLOYEE-MASTER";
  doc_group_id = "";
  doc_type = "";
  doc_file_type = "";
  doc_file_size = 0;
  uploadedFilesName: string = '';
  searchstring = '';
  branch_id = '';
  company_id = '';
  page_count = 0;
  page_current = 0;
  page_rows = 0;
  page_rowcount = 0;
  ageinyears = '';
  search_datetype = 'DOJ';
  from_date = '';
  to_date = '';
  allbranch: boolean = false;

  format_type = "GENERAL";

  lock_record: boolean = false;
  bPrint: boolean = false;
  bAdmin: boolean = false;
  bDocs: boolean = false;
  bRelieved: boolean = false;
  bPhoto: boolean = false;
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

  fieldList: CustomReportD[] = [];

  // Array For Displaying List
  RecordList: Emp[] = [];
  // Single Record for add/edit/view details
  Record: Emp = new Emp;
  RecordDocList: EmpDocs[] = [];

  CustomReportList: any[] = [];


  constructor(
    private modalService: NgbModal,
    private mainService: EmpService,
    private location: Location,
    private route: ActivatedRoute,
    public gs: GlobalService
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
    this.bPhoto = false;
    this.menu_record = this.gs.getMenu(this.menuid);
    if (this.menu_record) {
      this.title = this.menu_record.menu_name;
      if (this.menu_record.rights_print)
        this.bPrint = true;
      if (this.menu_record.rights_admin)
        this.bAdmin = true;
      if (this.menu_record.rights_docs)
        this.bDocs = true;
      if (this.menu_record.rights_approval.length > 0) {
        if (this.menu_record.rights_approval.toString().indexOf('{PHOTO}') >= 0)
          this.bPhoto = true;
      }
    }
    if (this.gs.globalVariables.user_code == "ADMIN")
      this.bPhoto = true;
    this.LoadCombo();
    this.createCustomFields();
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
    this.GenderList = [{ "id": "N", "name": "N/A" }, { "id": "M", "name": "MALE" }, { "id": "F", "name": "FEMALE" }];


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
          alert(this.ErrorMessage);
        });
  }

  createCustomFields() {
    this.CustomReportList = [
      { "rd_ctr": 1, "rd_code": "CODE", "rd_caption": "CODE", "rd_field": "emp_no", "rd_sort_order": 1, "rd_col_width": 15, "rd_data_type": "S" },
      { "rd_ctr": 2, "rd_code": "BRANCH", "rd_caption": "BRANCH", "rd_field": "rec_branch_code", "rd_sort_order": 2, "rd_col_width": 15, "rd_data_type": "S" },
      { "rd_ctr": 3, "rd_code": "NAME", "rd_caption": "NAME", "rd_field": "emp_name", "rd_sort_order": 3, "rd_col_width": 15, "rd_data_type": "S" },
      { "rd_ctr": 4, "rd_code": "ALIAS", "rd_caption": "ALIAS", "rd_field": "emp_alias", "rd_sort_order": 4, "rd_col_width": 15, "rd_data_type": "S" },
      { "rd_ctr": 5, "rd_code": "FATHER-NAME", "rd_caption": "FATHER-NAME", "rd_field": "emp_father_name", "rd_sort_order": 5, "rd_col_width": 15, "rd_data_type": "S" },
      { "rd_ctr": 6, "rd_code": "SPOUSE-NAME", "rd_caption": "SPOUSE-NAME", "rd_field": "emp_spouse_name", "rd_sort_order": 6, "rd_col_width": 15, "rd_data_type": "S" },
      { "rd_ctr": 7, "rd_code": "BLOOD-GROUP", "rd_caption": "BLOOD-GROUP", "rd_field": "emp_blood_group", "rd_sort_order": 7, "rd_col_width": 15, "rd_data_type": "S" },
      { "rd_ctr": 8, "rd_code": "LOCAL-ADDRESS1", "rd_caption": "LOCAL-ADDRESS1", "rd_field": "emp_local_address1", "rd_sort_order": 8, "rd_col_width": 15, "rd_data_type": "S" },
      { "rd_ctr": 9, "rd_code": "LOCAL-ADDRESS2", "rd_caption": "LOCAL-ADDRESS2", "rd_field": "emp_local_address2", "rd_sort_order": 9, "rd_col_width": 15, "rd_data_type": "S" },
      { "rd_ctr": 10, "rd_code": "LOCAL-ADDRESS3", "rd_caption": "LOCAL-ADDRESS3", "rd_field": "emp_local_address3", "rd_sort_order": 10, "rd_col_width": 15, "rd_data_type": "S" },
      { "rd_ctr": 11, "rd_code": "LOCAL-CITY", "rd_caption": "LOCAL-CITY", "rd_field": "emp_local_city", "rd_sort_order": 11, "rd_col_width": 15, "rd_data_type": "S" },
      { "rd_ctr": 12, "rd_code": "LOCAL-STATE", "rd_caption": "LOCAL-STATE", "rd_field": "emp_local_state_name", "rd_sort_order": 12, "rd_col_width": 15, "rd_data_type": "S" },
      { "rd_ctr": 13, "rd_code": "LOCAL-PIN", "rd_caption": "LOCAL-PIN", "rd_field": "emp_local_pin", "rd_sort_order": 13, "rd_col_width": 15, "rd_data_type": "S" },
      { "rd_ctr": 14, "rd_code": "LOCAL-POBOX", "rd_caption": "LOCAL-POBOX", "rd_field": "emp_local_pobox", "rd_sort_order": 14, "rd_col_width": 15, "rd_data_type": "S" },
      { "rd_ctr": 15, "rd_code": "HOME-ADDRESS1", "rd_caption": "HOME-ADDRESS1", "rd_field": "emp_home_address1", "rd_sort_order": 15, "rd_col_width": 15, "rd_data_type": "S" },
      { "rd_ctr": 16, "rd_code": "HOME-ADDRESS2", "rd_caption": "HOME-ADDRESS2", "rd_field": "emp_home_address2", "rd_sort_order": 16, "rd_col_width": 15, "rd_data_type": "S" },
      { "rd_ctr": 17, "rd_code": "HOME-ADDRESS3", "rd_caption": "HOME-ADDRESS3", "rd_field": "emp_home_address3", "rd_sort_order": 17, "rd_col_width": 15, "rd_data_type": "S" },
      { "rd_ctr": 18, "rd_code": "HOME-CITY", "rd_caption": "HOME-CITY", "rd_field": "emp_home_city", "rd_sort_order": 18, "rd_col_width": 15, "rd_data_type": "S" },
      { "rd_ctr": 19, "rd_code": "HOME-STATE", "rd_caption": "HOME-STATE", "rd_field": "emp_home_state_name", "rd_sort_order": 19, "rd_col_width": 15, "rd_data_type": "S" },
      { "rd_ctr": 20, "rd_code": "HOME-PIN", "rd_caption": "HOME-PIN", "rd_field": "emp_home_pin", "rd_sort_order": 20, "rd_col_width": 15, "rd_data_type": "S" },
      { "rd_ctr": 21, "rd_code": "HOME-POBOX", "rd_caption": "HOME-POBOX", "rd_field": "emp_home_pobox", "rd_sort_order": 21, "rd_col_width": 15, "rd_data_type": "S" },
      { "rd_ctr": 22, "rd_code": "TEL-RESI", "rd_caption": "TEL-RESI", "rd_field": "emp_tel_resi", "rd_sort_order": 22, "rd_col_width": 15, "rd_data_type": "S" },
      { "rd_ctr": 23, "rd_code": "TEL-OFFICE", "rd_caption": "TEL-OFFICE", "rd_field": "emp_tel_office", "rd_sort_order": 23, "rd_col_width": 15, "rd_data_type": "S" },
      { "rd_ctr": 24, "rd_code": "MOBILE", "rd_caption": "MOBILE", "rd_field": "emp_mobile", "rd_sort_order": 24, "rd_col_width": 15, "rd_data_type": "S" },
      { "rd_ctr": 25, "rd_code": "MOBILE-OFFICE", "rd_caption": "MOBILE-OFFICE", "rd_field": "emp_mobile_office", "rd_sort_order": 25, "rd_col_width": 15, "rd_data_type": "S" },
      { "rd_ctr": 26, "rd_code": "MAIL-PERSONAL", "rd_caption": "MAIL-PERSONAL", "rd_field": "emp_email_personal", "rd_sort_order": 26, "rd_col_width": 15, "rd_data_type": "S" },
      { "rd_ctr": 27, "rd_code": "EMAIL-OFFICE", "rd_caption": "EMAIL-OFFICE", "rd_field": "emp_email_office", "rd_sort_order": 27, "rd_col_width": 15, "rd_data_type": "S" },
      { "rd_ctr": 28, "rd_code": "BANK-ACNO", "rd_caption": "BANK-ACNO", "rd_field": "emp_bank_acno", "rd_sort_order": 28, "rd_col_width": 15, "rd_data_type": "S" },
      { "rd_ctr": 29, "rd_code": "BANK-NAME", "rd_caption": "BANK-NAME", "rd_field": "emp_bank_name", "rd_sort_order": 29, "rd_col_width": 15, "rd_data_type": "S" },
      { "rd_ctr": 30, "rd_code": "BANK-BRANCH", "rd_caption": "BANK-BRANCH", "rd_field": "emp_bank_branch", "rd_sort_order": 30, "rd_col_width": 15, "rd_data_type": "S" },
      { "rd_ctr": 31, "rd_code": "IFSC-CODE", "rd_caption": "IFSC-CODE", "rd_field": "emp_ifsc_code", "rd_sort_order": 31, "rd_col_width": 15, "rd_data_type": "S" },
      { "rd_ctr": 32, "rd_code": "PFNO", "rd_caption": "PFNO", "rd_field": "emp_pfno", "rd_sort_order": 32, "rd_col_width": 15, "rd_data_type": "S" },
      { "rd_ctr": 33, "rd_code": "ESINO", "rd_caption": "ESINO", "rd_field": "emp_esino", "rd_sort_order": 33, "rd_col_width": 15, "rd_data_type": "S" },
      { "rd_ctr": 34, "rd_code": "PAN", "rd_caption": "PAN", "rd_field": "emp_pan", "rd_sort_order": 34, "rd_col_width": 15, "rd_data_type": "S" },
      { "rd_ctr": 35, "rd_code": "ADHAR-NO", "rd_caption": "ADHAR-NO", "rd_field": "emp_adhar_no", "rd_sort_order": 35, "rd_col_width": 15, "rd_data_type": "S" },
      { "rd_ctr": 36, "rd_code": "UAN-NO", "rd_caption": "UAN-NO", "rd_field": "emp_uan_no", "rd_sort_order": 36, "rd_col_width": 15, "rd_data_type": "S" },
      { "rd_ctr": 37, "rd_code": "FUEL-TYPE", "rd_caption": "FUEL-TYPE", "rd_field": "emp_fuel_type", "rd_sort_order": 37, "rd_col_width": 15, "rd_data_type": "S" },
      { "rd_ctr": 38, "rd_code": "FUEL-LIMIT", "rd_caption": "FUEL-LIMIT", "rd_field": "emp_fuel_limit", "rd_sort_order": 38, "rd_col_width": 15, "rd_data_type": "S" },
      { "rd_ctr": 39, "rd_code": "BUS-LIMIT", "rd_caption": "BUS-LIMIT", "rd_field": "emp_bus_limit", "rd_sort_order": 39, "rd_col_width": 15, "rd_data_type": "S" },
      { "rd_ctr": 40, "rd_code": "TRAIN-LIMIT", "rd_caption": "TRAIN-LIMIT", "rd_field": "emp_train_limit", "rd_sort_order": 40, "rd_col_width": 15, "rd_data_type": "S" },
      { "rd_ctr": 41, "rd_code": "VEHI-MAINT-LIMIT", "rd_caption": "VEHI-MAINT-LIMIT", "rd_field": "emp_vehi_maint_limit", "rd_sort_order": 41, "rd_col_width": 15, "rd_data_type": "S" },
      { "rd_ctr": 42, "rd_code": "MOBILE-LIMIT", "rd_caption": "MOBILE-LIMIT", "rd_field": "emp_mobile_limit", "rd_sort_order": 42, "rd_col_width": 15, "rd_data_type": "S" },
      { "rd_ctr": 43, "rd_code": "DATACARD-LIMIT", "rd_caption": "DATACARD-LIMIT", "rd_field": "emp_datacard_limit", "rd_sort_order": 43, "rd_col_width": 15, "rd_data_type": "S" },
      { "rd_ctr": 44, "rd_code": "GRADE-NAME", "rd_caption": "GRADE-NAME", "rd_field": "emp_grade_name", "rd_sort_order": 44, "rd_col_width": 15, "rd_data_type": "S" },
      { "rd_ctr": 45, "rd_code": "DEPARTMENT-NAME", "rd_caption": "DEPARTMENT-NAME", "rd_field": "emp_department_name", "rd_sort_order": 45, "rd_col_width": 15, "rd_data_type": "S" },
      { "rd_ctr": 46, "rd_code": "DESIGNATION-NAME", "rd_caption": "DESIGNATION-NAME", "rd_field": "emp_designation_name", "rd_sort_order": 46, "rd_col_width": 15, "rd_data_type": "S" },
      { "rd_ctr": 47, "rd_code": "STATUS-NAME", "rd_caption": "STATUS-NAME", "rd_field": "emp_status_name", "rd_sort_order": 47, "rd_col_width": 15, "rd_data_type": "S" },
      { "rd_ctr": 48, "rd_code": "IN-PAYROLL", "rd_caption": "IN-PAYROLL", "rd_field": "emp_in_payroll", "rd_sort_order": 48, "rd_col_width": 15, "rd_data_type": "S" },
      { "rd_ctr": 49, "rd_code": "MARITAL-STATUS", "rd_caption": "MARITAL-STATUS", "rd_field": "emp_marital_status", "rd_sort_order": 49, "rd_col_width": 15, "rd_data_type": "S" },
      { "rd_ctr": 50, "rd_code": "GENDER", "rd_caption": "GENDER", "rd_field": "emp_gender", "rd_sort_order": 50, "rd_col_width": 15, "rd_data_type": "S" },
      { "rd_ctr": 51, "rd_code": "COMP-MEDICLAIM", "rd_caption": "COMP-MEDICLAIM", "rd_field": "emp_comp_mediclaim", "rd_sort_order": 51, "rd_col_width": 15, "rd_data_type": "S" },
      { "rd_ctr": 52, "rd_code": "PREMIUM-AMT", "rd_caption": "PREMIUM-AMT", "rd_field": "emp_premium_amt", "rd_sort_order": 52, "rd_col_width": 15, "rd_data_type": "S" },
      { "rd_ctr": 53, "rd_code": "MEDICLAIM-PROVIDER", "rd_caption": "MEDICLAIM-PROVIDER", "rd_field": "emp_mediclaim_provider", "rd_sort_order": 53, "rd_col_width": 15, "rd_data_type": "S" },
      { "rd_ctr": 54, "rd_code": "DO-BIRTH", "rd_caption": "DO-BIRTH", "rd_field": "emp_do_birth", "rd_sort_order": 54, "rd_col_width": 15, "rd_data_type": "D" },
      { "rd_ctr": 55, "rd_code": "MARRIGE-DATE", "rd_caption": "MARRIGE-DATE", "rd_field": "emp_marrige_date", "rd_sort_order": 55, "rd_col_width": 15, "rd_data_type": "D" },
      { "rd_ctr": 56, "rd_code": "DO-JOINING", "rd_caption": "DO-JOINING", "rd_field": "emp_do_joining", "rd_sort_order": 56, "rd_col_width": 15, "rd_data_type": "D" },
      { "rd_ctr": 57, "rd_code": "DO-CONFIRMATION", "rd_caption": "DO-CONFIRMATION", "rd_field": "emp_do_confirmation", "rd_sort_order": 57, "rd_col_width": 15, "rd_data_type": "D" },
      { "rd_ctr": 58, "rd_code": "DO-RELIEVE", "rd_caption": "DO-RELIEVE", "rd_field": "emp_do_relieve", "rd_sort_order": 58, "rd_col_width": 15, "rd_data_type": "D" },
      { "rd_ctr": 59, "rd_code": "INCENTIVE-TYPE", "rd_caption": "INCENTIVE-TYPE", "rd_field": "emp_incentive_type", "rd_sort_order": 59, "rd_col_width": 15, "rd_data_type": "S" },
      { "rd_ctr": 60, "rd_code": "PHOTO", "rd_caption": "PHOTO", "rd_field": "emp_image_name", "rd_sort_order": 60, "rd_col_width": 15, "rd_data_type": "S" },
      { "rd_ctr": 61, "rd_code": "HOD", "rd_caption": "HOD", "rd_field": "emp_hod_name", "rd_sort_order": 61, "rd_col_width": 15, "rd_data_type": "S" },
      { "rd_ctr": 62, "rd_code": "TRNG/PROB. DAYS", "rd_caption": "TRNG/PROB. DAYS", "rd_field": "emp_training_period", "rd_sort_order": 62, "rd_col_width": 15, "rd_data_type": "N-0" },
      { "rd_ctr": 63, "rd_code": "TRNG/PROB. END DATE", "rd_caption": "TRNG/PROB. END DATE", "rd_field": "emp_training_end_dt", "rd_sort_order": 63, "rd_col_width": 15, "rd_data_type": "D" },
      { "rd_ctr": 64, "rd_code": "REMARKS", "rd_caption": "REMARKS", "rd_field": "emp_remarks", "rd_sort_order": 64, "rd_col_width": 15, "rd_data_type": "S" },
    ];

  }


  customreportcallbackevent(params: any) {
    this.format_type = params.format;
  }




  //function for handling LIST/NEW/EDIT Buttons
  ActionHandler(action: string, id: string, brcode: string = '') {
    this.ErrorMessage = '';
    this.InfoMessage = '';
    if (action == 'LIST') {
      this.mode = '';
      this.pkid = '';
      this.currentTab = 'LIST';
    }
    else if (action === 'ADD') {
      if (this.type == "EMPLOYEE-DOCUMENTS")
        this.currentTab = 'DETAILS2';
      else
        this.currentTab = 'DETAILS';
      this.mode = 'ADD';
      this.ResetControls();
      this.NewRecord();
    }
    else if (action === 'EDIT') {
      if (brcode != this.gs.globalVariables.branch_code) {
        alert("Cannot Show Details from another Branch");
        return;
      }
      if (this.type == "EMPLOYEE-DOCUMENTS")
        this.currentTab = 'DETAILS2';
      else
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
      emp_id: this.gs.globalVariables.emp_id,
      empstatus: this.radio_emp,
      isadmin: this.bAdmin,
      search_datetype: this.search_datetype,
      from_date: this.from_date,
      to_date: this.to_date,
      allbranch: this.allbranch,
      brelieved: this.bRelieved,
      format_type: this.format_type,
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
          this.fieldList = response.fieldlist;
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
    this.uploadedFilesName = '';
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
    this.Record.emp_gender = 'N';
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
    this.Record.emp_pf_exempted = false;
    this.Record.emp_image_src = '';
    this.Record.emp_image_name = '';
    this.Record.emp_hod_id = '';
    this.Record.emp_hod_code = '';
    this.Record.emp_hod_name = '';
    this.Record.emp_training_end_dt = '';
    this.Record.emp_training_period = 0;
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
        this.RecordDocList = response.doclist;
      },
        error => {
          this.loading = false;
          this.ErrorMessage = this.gs.getError(error);
          alert(this.ErrorMessage);
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

    this.Record.emp_image_src = this.getImageUrl(this.Record.emp_image_name);
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
    this.Record.emp_designation_name = this.getDesignation(this.Record.emp_designation_id);
    this.Record.emp_department_name = this.getDepartment(this.Record.emp_department_id);
    this.Record.emp_status_name = this.getStatusName(this.Record.emp_status_id);
    this.Record._globalvariables = this.gs.globalVariables;
    this.mainService.Save(this.Record)
      .subscribe(response => {
        this.loading = false;
        // this.InfoMessage = "Save Complete";
        this.mode = 'EDIT';
        this.Record.rec_mode = this.mode;
        this.ageinyears = '';
        if (this.Record.emp_do_birth != null) {
          this.ageinyears = this.GetAge().ageyears + "Yrs";
        }
        this.InfoMessage = response.retmsg;
        alert(this.InfoMessage);
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


    if (this.GetFieldName("TRAINEE").fieldid == this.Record.emp_status_id || this.GetFieldName("PROBATION").fieldid == this.Record.emp_status_id) {

      if (this.Record.emp_training_end_dt.trim().length <= 0) {
        bret = false;
        sError += "\n\r|Trainee/Probation Completion Date Cannot Be Blank";
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

    if (field == 'emp_training_period')
      this.bValueChanged = true;
  }

  OnFocus(field: string) {

    if (field == 'emp_training_period')
      this.bValueChanged = false;
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

    if (field == 'emp_training_period') {
      if (this.bValueChanged && this.Record.emp_training_period > 0)
        this.Record.emp_training_end_dt = this.getTrainingCompletionDateString(this.Record.emp_do_joining, this.Record.emp_training_period);
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
    this.upload_type = "EMPLOYEE-MASTER";
    this.doc_group_id = "";
    this.doc_type = "";
    this.doc_file_type = "";
    this.doc_file_size = 0;
    this.open(doc);
  }
  open(content: any) {
    this.modal = this.modalService.open(content, { backdrop: 'static', keyboard: true });
  }

  showUpload(_rec: EmpDocs, doc: any) {
    this.ErrorMessage = '';
    this.upload_type = "EMPLOYEE DOCUMENTS";
    this.doc_group_id = _rec.doc_pkid;
    this.doc_type = _rec.doc_name;
    this.doc_file_type = _rec.doc_file_type;
    this.doc_file_size = _rec.doc_file_size;
    this.open(doc);
  }

  DownloadEmpDocs(_id: string) {

    if (!confirm("Do you want to Download")) {
      return;
    }

    this.loading = true;
    let SearchData = {
      branch_code: this.gs.globalVariables.branch_code,
      company_code: this.gs.globalVariables.comp_code,
      root_folder: this.gs.defaultValues.root_folder,
      report_folder: this.gs.globalVariables.report_folder,
      emp_id: _id
    };

    this.ErrorMessage = '';
    this.InfoMessage = '';
    this.mainService.DownloadEmpDocs(SearchData)
      .subscribe(response => {
        this.loading = false;
        alert('Download Complete');
      },
        error => {
          this.loading = false;
          this.ErrorMessage = this.gs.getError(error);
          alert(this.ErrorMessage);
        });
  }

  getDepartment(_id: string) {
    let str = "";
    if (!this.gs.isBlank(this.DepartmentList)) {
      var REC = this.DepartmentList.find(rec => rec.param_pkid == _id);
      if (REC != null) {
        str = REC.param_name;
      }
    }
    return str;
  }
  getDesignation(_id: string) {
    let str = "";
    if (!this.gs.isBlank(this.DesignationList)) {
      var REC = this.DesignationList.find(rec => rec.param_pkid == _id);
      if (REC != null) {
        str = REC.param_name;
      }
    }
    return str;
  }
  getStatusName(_id: string) {
    let str = "";
    if (!this.gs.isBlank(this.StatusList)) {
      var REC = this.StatusList.find(rec => rec.param_pkid == _id);
      if (REC != null) {
        str = REC.param_name;
      }
    }
    return str;
  }

  setDefaultImage(event: Event) {
    (event.target as HTMLImageElement).src = this.getImageUrl("defaultphoto.png");
  }

  getImageUrl(_imgname) {
    if (this.gs.baseUrl.includes("localhost"))
      return "https://software.cargomar.in/resources/images/" + this.gs.globalVariables.comp_code.toLowerCase() + "/employee/" + _imgname;
    else
      return this.gs.baseUrl + "/resources/images/" + this.gs.globalVariables.comp_code.toLowerCase() + "/employee/" + _imgname;
  }

  callbackeventupload(params: any) {
    if (params.action == "UPLOAD") {//if master updated then mstatus length greater than zero
      this.uploadedFilesName = params.filedisplayname.replace(/\*/gi, ",");
      this.Record.emp_image_src = this.getImageUrl(this.uploadedFilesName);
      // alert('UPLOAD');
    }

  }

  disableRightClick(event: MouseEvent) {
    event.preventDefault();
  }

  LovSelected(_Record: SearchTable) {

    if (_Record.controlname == "HOD") {
      this.Record.emp_hod_id = _Record.id;
      this.Record.emp_hod_code = _Record.code;
      this.Record.emp_hod_name = _Record.name;
    }

  }


  getTrainingCompletionDateString(
    joiningDate: string,
    trainingPeriodMonths: number
  ): string {

    const date = new Date(joiningDate);
    date.setMonth(date.getMonth() + trainingPeriodMonths);

    return date.toISOString().split("T")[0];
  }
  ShowHistory(history: any) {
    this.ErrorMessage = '';
    this.open(history);
  }

}


