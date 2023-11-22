
import { Component, Input, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';

import { ActivatedRoute } from '@angular/router';

import { GlobalService } from '../../core/services/global.service';

import { TdsPaid } from '../models/tdspaid';

import { TdsPaidService } from '../services/tdspaid.service';

import { SearchTable } from '../../shared/models/searchtable';

@Component({
  selector: 'app-tdspaid',
  templateUrl: './tdspaid.component.html',
  providers: [TdsPaidService]
})

export class TdsPaidComponent {
  // Local Variables 
  title = 'TdsPaid';

  @Input() menuid: string = '';
  @Input() type: string = '';
  InitCompleted: boolean = false;
  menu_record: any;

  disableSave = true;
  loading = false;
  currentTab = 'LIST';

  searchstring = '';


  sub: any;
  urlid: string;
  branch_name: string;
  branch_code: string;


  ismaincode: boolean = false;
  bCompany = false;

  ErrorMessage = "";

  mode = '';
  pkid = '';

  ACCRECORD: SearchTable = new SearchTable();

  BRRECORD: SearchTable = new SearchTable();

  SearchData = {
    type: '',
    subtype: '',
    pkid: '',
    acc_id: '',
    acc_name: '',
    report_folder: '',
    company_code: '',
    branch_code: '',
    branch_name: '',
    year_code: '',
    searchstring: '',

    ismaincode: false,
    hide_ho_entries: '',
  };





  // Array For Displaying List
  RecordList: TdsPaid[] = [];
  // Single Record for add/edit/view details
  Record: TdsPaid = new TdsPaid;

  constructor(
    private mainService: TdsPaidService,
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

    this.InitLov();
    this.Init();
    this.LoadCombo();

  }
  Init() {
    this.branch_code = this.gs.globalVariables.branch_code;
    this.branch_name = this.gs.globalVariables.branch_name;
  }
  // Destroy Will be called when this component is closed
  ngOnDestroy() {
    this.sub.unsubscribe();
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


  InitLov() {

    this.ACCRECORD = new SearchTable();
    this.ACCRECORD.controlname = "ACCTM";
    this.ACCRECORD.displaycolumn = "CODE";
    this.ACCRECORD.type = "ACCTM";
    this.ACCRECORD.id = "";
    this.ACCRECORD.code = "";
    this.ACCRECORD.name = "";
    this.ACCRECORD.showlocked = true;


    this.BRRECORD = new SearchTable();
    this.BRRECORD.controlname = "BRANCH";
    this.BRRECORD.displaycolumn = "CODE";
    this.BRRECORD.type = "BRANCH";
    this.BRRECORD.id = "";
    this.BRRECORD.code = this.gs.globalVariables.branch_code;

  }

  LovSelected(_Record: SearchTable) {

    if (_Record.controlname == "ACCTM") {

    }

    if (_Record.controlname == "BRANCH") {
      this.branch_code = _Record.code;
      this.branch_name = _Record.name;
    }
  }



  // Query List Data
  List(_type: string) {


    this.loading = true;

    if (_type == "NEW") {
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
      this.SearchData.ismaincode = this.ismaincode;
      this.SearchData.acc_id = this.ACCRECORD.id;
      this.SearchData.acc_name = this.ACCRECORD.name;
    }
    this.SearchData.type = _type;
    this.SearchData.subtype = '';

    this.SearchData.hide_ho_entries = this.gs.globalVariables.hide_ho_entries;

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
          this.ErrorMessage = this.gs.getError(error);
          alert(this.ErrorMessage);
        });
  }




  Downloadfile(filename: string, filetype: string, filedisplayname: string) {
    this.gs.DownloadFile(this.gs.globalVariables.report_folder, filename, filetype, filedisplayname);
  }


  Close() {
    this.gs.ClosePage('home');
  }
}
