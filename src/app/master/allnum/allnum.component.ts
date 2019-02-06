import { Component, Input, OnInit, OnDestroy } from '@angular/core';

import { ActivatedRoute } from '@angular/router';

import { GlobalService } from '../../core/services/global.service';

import { Allnum } from '../models/allnum';


import { AllnumService } from '../services/allnum.service';
import { Bookblno } from '../models/bookblno';

@Component({
  selector: 'app-allnum',
  templateUrl: './allnum.component.html',
  providers: [AllnumService]
})
export class AllnumComponent {
  // Local Variables 
  title = 'BL Format';

  @Input() menuid: string = '';
  @Input() type: string = '';
  InitCompleted: boolean = false;
  menu_record: any;

  selectedRowIndex: number = -1;

  disableSave = true;
  loading = false;
  currentTab = 'LIST';

  searchstring = '';
  page_count = 0;
  page_current = 0;
  page_rows = 0;
  page_rowcount = 0;

  totblnos = 0;
  blremarks = '';

  sub: any;
  urlid: string;

  ErrorMessage = "";

  mode = '';
  pkid = '';

  // Array For Displaying List
  RecordList: Allnum[] = [];
  // Single Record for add/edit/view details
  Record: Allnum = new Allnum;

  constructor(
    private mainService: AllnumService,
    private route: ActivatedRoute,
    private gs: GlobalService
  ) {
    this.page_count = 0;
    this.page_rows = 10;
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

    this.currentTab = 'LIST';
    this.menu_record = this.gs.getMenu(this.menuid);
    if (this.menu_record)
      this.title = this.menu_record.menu_name;
    this.InitColumns();
    this.List("NEW");
  }

  InitColumns() {
  }

  // Destroy Will be called when this component is closed
  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  //function for handling LIST/NEW/EDIT Buttons
  ActionHandler(action: string, id: string, _selectedRowIndex: number = -1) {
    this.ErrorMessage = '';
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
      this.selectedRowIndex = _selectedRowIndex;
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
    this.selectedRowIndex = -1;

    let SearchData = {
      type: _type,
      rowtype: this.type,
      searchstring: this.searchstring.toUpperCase(),
      sortby: '',
      company_code: this.gs.globalVariables.comp_code,
      branch_code: this.gs.globalVariables.branch_code,
      page_count: this.page_count,
      page_current: this.page_current,
      page_rows: this.page_rows,
      page_rowcount: this.page_rowcount
    };

    this.ErrorMessage = '';
    this.mainService.List(SearchData)
      .subscribe(response => {
        this.loading = false;
        this.RecordList = response.list;
        this.page_count = response.page_count;
        this.page_current = response.page_current;
        this.page_rowcount = response.page_rowcount;
      },
        error => {
          this.loading = false;
          this.ErrorMessage = this.gs.getError(error);
        });
  }

  NewRecord() {

    this.pkid = this.gs.getGuid();
    this.Record = new Allnum();
    this.Record.table_pkid = this.pkid;
    this.Record.table_name = "";
    this.Record.table_prefix = "";
    this.Record.table_value = 0;
    this.Record.table_group = "NA";
    this.Record.rec_mode = this.mode;
    this.Record.BlList = new Array<Bookblno>();
  }

  // Load a single Record for VIEW/EDIT
  GetRecord(Id: string) {
    this.loading = true;

    let SearchData = {
      pkid: Id,
    };

    this.ErrorMessage = '';
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

  LoadData(_Record: Allnum) {
    this.Record = _Record;
    this.Record.rec_mode = this.mode;
  }


  // Save Data
  Save() {
    if (!this.allvalid())
      return;
    this.loading = true;
    this.ErrorMessage = '';

    this.Record._globalvariables = this.gs.globalVariables;
    this.mainService.Save(this.Record)
      .subscribe(response => {
        this.loading = false;
        this.ErrorMessage = "Save Complete";
        this.mode = 'EDIT';
        this.Record.rec_mode = this.mode;
        this.RefreshList();
      },
        error => {
          this.loading = false;
          this.ErrorMessage = this.gs.getError(error);
        });
  }

  allvalid() {
    let sError: string = "";
    let bret: boolean = true;
    this.ErrorMessage = '';
    if (this.Record.table_name.trim().length <= 0) {
      bret = false;
      sError = "Table Name Cannot Be Blank";
    }

    //if (this.Record.user_password.trim().length <= 0) {
    //    bret = false;
    //    sError += "\n\rPassword Cannot Be Blank";
    //}

    if (bret) {
      this.Record.table_name = this.Record.table_name.toUpperCase().replace(' ', '');
      this.Record.table_prefix = this.Record.table_prefix.toUpperCase().trim();

    }

    if (bret === false)
      this.ErrorMessage = sError;
    return bret;
  }

  RefreshList() {

    if (this.RecordList == null)
      return;
    var REC = this.RecordList.find(rec => rec.table_pkid == this.Record.table_pkid);
    if (REC == null) {
      this.RecordList.push(this.Record);
    }
    else {
      REC.table_name = this.Record.table_name;
      REC.table_prefix = this.Record.table_prefix;
      REC.table_value = this.Record.table_value;
    }
  }

  Close() {
    this.gs.ClosePage('home');
  }

  Generate(Id: string) {
    this.ErrorMessage = '';
    if (this.totblnos <= 0 || this.totblnos > 10) {
      this.ErrorMessage = "Please Enter Total Numbers <= 10 ";
      alert(this.ErrorMessage);
      return;
    }

    if (this.blremarks.trim().length <= 0) {
      this.ErrorMessage = "Remarks Cannot Be Blank";
      alert(this.ErrorMessage);
      return;
    }

    if (!confirm('BOOK BL NUMBERS')) {
      return;
    }

    this.loading = true;
    let SearchData = {
      pkid: Id,
      company_code: this.gs.globalVariables.comp_code,
      branch_code: this.gs.globalVariables.branch_code,
      user_code: this.gs.globalVariables.user_code,
      blremarks: this.blremarks,
      blnos: this.totblnos
    };


    this.mainService.GenerateBLNos(SearchData)
      .subscribe(response => {
        this.loading = false;
        this.Record.table_value = response.blno;
        if (this.Record.BlList == null)
          this.Record.BlList = new Array<Bookblno>();
        this.Record.BlList.push(response.record);
      },
        error => {
          this.loading = false;
          this.ErrorMessage = this.gs.getError(error);
        });
  }

  OnBlur(field: string) {
    switch (field) {
      case 'blremarks':
        {
          this.blremarks = this.blremarks.toUpperCase();
          break;
        }
    }
  }

}
