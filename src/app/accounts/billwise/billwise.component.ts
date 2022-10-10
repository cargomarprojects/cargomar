import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { GlobalService } from '../../core/services/global.service';
import { SearchTable } from '../../shared/models/searchtable';
import { BillWise } from '../models/billwise';
import { BillWiseService } from '../services/billwise.service';

@Component({
  selector: 'app-billwise',
  templateUrl: './billwise.component.html',
  providers: [BillWiseService]
})

export class BillWiseComponent {
  title = 'BillWise Report'



  @Input() menuid: string = '';
  @Input() type: string = '';

  InitCompleted: boolean = false;
  main_code: boolean = false;
  menu_record: any;
  sub: any;
  urlid: string;

  ErrorMessage = "";
  mode = '';
  pkid = '';

  rec_category: string = "";
  type_date: string = '';
  from_date: string = '';
  to_date: string = '';
  code: string = '';
  branch_name: string;
  branch_code: string;

  all: boolean = false;
  disableSave = true;
  bCompany = false;
  loading = false;
  currentTab = 'LIST';
  searchstring = '';

  SearchData = {
    type: '',
    rec_category: '',
    pkid: '',
    report_folder: '',
    company_code: '',
    branch_code: '',
    branch_name: '',
    year_code: '',
    searchstring: '',
    from_date: '',
    to_date: '',
    type_date: '',
    code: '',
    acc_id: '',
    acc_name: '',
    main_code: false,
    all: false
  };

  // Array For Displaying List
  RecordList: BillWise[] = [];
  // Single Record for add/edit/view details
  Record: BillWise = new BillWise;
  ACCRECORD: SearchTable = new SearchTable();
  BRRECORD: SearchTable = new SearchTable();

  constructor(
    private mainService: BillWiseService,
    private route: ActivatedRoute,
    private gs: GlobalService
  ) {
    // URL Query Parameter 
    this.sub = this.route.queryParams.subscribe(params => {
      if (params["parameter"] != "") {
        this.InitCompleted = true;
        var options = JSON.parse(params["parameter"]);
        this.menuid = options.menuid;
        this.type = options.type;

        this.rec_category = this.type;

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
    this.bCompany = false;
    this.menu_record = this.gs.getMenu(this.menuid);
    if (this.menu_record) {
      this.title = this.menu_record.menu_name;
      if (this.menu_record.rights_company)
        this.bCompany = true;
    }
    this.Init();
    this.initLov();
    this.LoadCombo();
  }

  Init() {
    this.type_date = "INVOICE";
    this.RecordList = null;
    this.branch_code = this.gs.globalVariables.branch_code;
    this.branch_name = this.gs.globalVariables.branch_name;
    this.from_date = this.gs.defaultValues.monthbegindate;
    this.to_date = this.gs.defaultValues.today;
  }

  // Destroy Will be called when this component is closed
  ngOnDestroy() {
    this.sub.unsubscribe();
  }


  initLov(caption: string = '') {

    this.BRRECORD = new SearchTable();
    this.BRRECORD.controlname = "BRANCH";
    this.BRRECORD.displaycolumn = "CODE";
    this.BRRECORD.type = "BRANCH";
    this.BRRECORD.id = "";
    this.BRRECORD.code = this.gs.globalVariables.branch_code;

    this.ACCRECORD = new SearchTable();
    this.ACCRECORD.controlname = "ACCTM";
    this.ACCRECORD.displaycolumn = "CODE";
    this.ACCRECORD.type = "ACCTM";
    this.ACCRECORD.where = "";
    this.ACCRECORD.id = "";
    this.ACCRECORD.code = "";
    this.ACCRECORD.name = "";
    this.ACCRECORD.showlocked = true;
  }

  LovSelected(_Record: SearchTable) {
    // Company Settings
    if (_Record.controlname == "BRANCH") {
      this.branch_code = _Record.code;
      this.branch_name = _Record.name;
    }
    if (_Record.controlname == "ACCTM") {

    }

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

  // Query List Data
  List(_type: string) {

    this.ErrorMessage = '';
    //if (this.from_date.trim().length <= 0) {
    //  this.ErrorMessage = "From Date Cannot Be Blank";
    //  return;
    //}
    //if (this.to_date.trim().length <= 0) {
    //  this.ErrorMessage = "To Date Cannot Be Blank";
    //  return;
    //}

    this.loading = true;
    this.pkid = this.gs.getGuid();
    this.SearchData.pkid = this.pkid;
    this.SearchData.report_folder = this.gs.globalVariables.report_folder;
    this.SearchData.company_code = this.gs.globalVariables.comp_code;

    if (this.bCompany) {
      this.SearchData.branch_code = this.branch_code;
      this.SearchData.branch_name = this.branch_name;
    }
    else {
      this.SearchData.branch_code = this.gs.globalVariables.branch_code;
      this.SearchData.branch_name = this.gs.globalVariables.branch_name;

    }
    this.SearchData.year_code = this.gs.globalVariables.year_code;
    this.SearchData.searchstring = this.searchstring.toUpperCase();
    this.SearchData.type = _type;
    this.SearchData.rec_category = this.rec_category;
    this.SearchData.type_date = this.type_date;
    this.SearchData.from_date = this.from_date;
    this.SearchData.to_date = this.to_date;
    this.SearchData.code = this.code;
    this.SearchData.main_code = this.main_code;
    this.SearchData.acc_id = this.ACCRECORD.id;
    this.SearchData.acc_name = this.ACCRECORD.name;
    this.SearchData.all = this.all;

    this.ErrorMessage = '';
    this.mainService.List(this.SearchData)
      .subscribe(response => {
        this.loading = false;
        if (_type == 'EXCEL')
          this.Downloadfile(response.filename, response.filetype, response.filedisplayname);
        else {
          this.RecordList = response.list;
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

  Close() {
    this.gs.ClosePage('home');
  }



}
