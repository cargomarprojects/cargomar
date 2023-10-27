import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { GlobalService } from '../../core/services/global.service';
import { SearchTable } from '../../shared/models/searchtable';
import { SearchShipment } from '../models/searchshipment';
import { SearchShipmentService } from '../services/searchshipment.service';

@Component({
  selector: 'app-searchshipment',
  templateUrl: './searchshipment.component.html',
  providers: [SearchShipmentService]
})

export class SearchShipmentComponent {
  title = 'Search Shipment'

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
  shipper: string = "";
  consignee: string = "";
  agent: string = "";
  from_date: string = '';
  to_date: string = '';
  hbltype: string = 'ALL';
  report_format: string = 'GENERAL-SEARCH';

  page_count = 0;
  page_current = 0;
  page_rows = 0;
  page_rowcount = 0;

  disableSave = true;
  bCompany = false;
  loading = false;


  all: boolean = false;

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
    shipper: '',
    consignee: '',
    page_count: 0,
    page_current: 0,
    page_rows: 0,
    page_rowcount: 0,
    agent: '',
    from_date: '',
    to_date: '',
    all: false,
    hbltype: '',
    report_format: ''
  };

  // Array For Displaying List
  RecordList: SearchShipment[] = [];
  // Single Record for add/edit/view details
  Record: SearchShipment = new SearchShipment;

  BRRECORD: SearchTable = new SearchTable();

  constructor(
    private mainService: SearchShipmentService,
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
    this.hbltype = "ALL";
    this.job_type = "ALL";
    this.RecordList = null;
    this.shipper = "";
    this.consignee = "";
    this.branch_code = this.gs.globalVariables.branch_code;
    this.branch_name = this.gs.globalVariables.branch_name;
    this.page_count = 0;
    this.page_rows = 15;
    this.page_current = 0;

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

    if (_type != 'EXCEL') {
      if (this.report_format == "SBBE-COUNT" || this.report_format == "BL-COUNT") {
        this.ErrorMessage = "Please use Excel option......... ";
        alert(this.ErrorMessage);
        return;
      }
    }

    if (this.report_format == "SBBE-COUNT" || this.report_format == "BL-COUNT") {
      if (this.gs.isBlank(this.from_date)) {
        this.ErrorMessage = "From date cannot be blank ";
        alert(this.ErrorMessage);
        return;
      }
      if (this.gs.isBlank(this.to_date)) {
        this.ErrorMessage = "To date cannot be blank ";
        alert(this.ErrorMessage);
        return;
      }
    }
    this.ErrorMessage = '';
    // if (this.shipper.trim().length <= 0 && this.consignee.trim().length <= 0 && this.agent.trim().length <= 0) {
    //   this.RecordList = null;
    //   this.page_count = 0;
    //   this.page_rows = 15;
    //   this.page_current = 0;
    //   this.ErrorMessage = "Shipper Or Consignee Or Agent Cannot Be Blank";
    //   return;
    // }

    this.loading = true;
    this.pkid = this.gs.getGuid();
    this.SearchData.pkid = this.pkid;
    this.SearchData.report_folder = this.gs.globalVariables.report_folder;

    if (this.bCompany) {
      this.SearchData.branch_code = this.branch_code;
      this.SearchData.branch_name = this.branch_name;
    }
    else {
      this.SearchData.branch_code = this.gs.globalVariables.branch_code;
      this.SearchData.branch_name = this.gs.globalVariables.branch_name;

    }
    this.SearchData.company_code = this.gs.globalVariables.comp_code;

    this.SearchData.year_code = this.gs.globalVariables.year_code;
    this.SearchData.searchstring = this.searchstring.toUpperCase();
    this.SearchData.type = _type;
    this.SearchData.rec_category = this.rec_category;
    this.SearchData.shipper = this.shipper;
    this.SearchData.consignee = this.consignee;
    this.SearchData.agent = this.agent;
    this.SearchData.all = this.all;
    this.SearchData.from_date = this.from_date;
    this.SearchData.to_date = this.to_date;
    this.SearchData.page_count = this.page_count;
    this.SearchData.page_current = this.page_current;
    this.SearchData.page_rows = this.page_rows;
    this.SearchData.page_rowcount = this.page_rowcount;
    this.SearchData.hbltype = this.hbltype;
    this.SearchData.report_format = this.report_format;
    this.ErrorMessage = '';
    this.mainService.List(this.SearchData)
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
          this.RecordList = null;
          this.ErrorMessage = this.gs.getError(error);
          alert(this.ErrorMessage);
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
