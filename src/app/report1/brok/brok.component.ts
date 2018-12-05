import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { GlobalService } from '../../core/services/global.service';
import { SearchTable } from '../../shared/models/searchtable';
import { Brok } from '../models/brok';
import { RepService } from '../services/report.service';

@Component({
  selector: 'app-brok',
  templateUrl: './brok.component.html',
  providers: [RepService]
})

export class BrokComponent {
  title = 'Brokerage Report'
  
  @Input() menuid: string = '';
  @Input() type: string = '';

  InitCompleted: boolean = false;
  menu_record: any;
  sub: any;
  urlid: string;

  ErrorMessage = "";
  mode = '';
  pkid = '';
  rec_category: string = "";
  branch_name: string;
  branch_code: string;
  job_type: string;

  disableSave = true;
  bCompany = false;
  loading = false;
  all: boolean = false;
  
  from_date: string = '';
  to_date: string = '';

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
    job_type: '',
    from_date: '',
    to_date:'',
    all: false,
  };
  BRRECORD: SearchTable = new SearchTable();
  // Array For Displaying List
  RecordList: Brok[] = [];
  // Single Record for add/edit/view details
  Record: Brok = new Brok;

  constructor(
    private mainService: RepService,
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
    
    this.job_type = "ALL";
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

  }

  LovSelected(_Record: SearchTable) {
    // Company Settings

    if (_Record.controlname == "BRANCH") {
      this.branch_code = _Record.code;
      this.branch_name = _Record.name;
   
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
    //if (this.searchstring.trim().length <= 0) {
    //  this.RecordList = null;
    //  this.ErrorMessage = "Container Cannot Be Blank";
    //  return;
    //}

    if (this.from_date.trim().length <= 0) {
      this.ErrorMessage = "From Date Cannot Be Blank";
      return;
    }

    if (this.to_date.trim().length <= 0) {
      this.ErrorMessage = "To Date Cannot Be Blank";
      return;
    }

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
    this.SearchData.job_type = this.job_type;
    this.SearchData.from_date = this.from_date;
    this.SearchData.to_date = this.to_date;
    this.SearchData.all = this.all;
    this.ErrorMessage = '';
    this.mainService.BrokList(this.SearchData)
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
