import { Component, Input, OnInit, OnDestroy } from '@angular/core';

import { ActivatedRoute } from '@angular/router';

import { GlobalService } from '../../core/services/global.service';

import { Param } from '../models/param';


import { ParamService } from '../services/param.service';

@Component({
  selector: 'app-param',
  templateUrl: './param.component.html',
  providers: [ParamService]
})
export class ParamComponent {
  /*Ajith 19/06/2019 LOcked TAN Enabled
  
  */
  // Local Variables 
  title = 'Param MASTER';

  @Input() menuid: string = '';
  @Input() type: string = '';
  InitCompleted: boolean = false;
  menu_record: any;

  selectedRowIndex: number = -1;

  param_rate_caption: string = '';

  disableSave = true;
  loading = false;
  currentTab = 'LIST';

  sortby: boolean = false;
  bPrint = false;

  searchstring = '';
  page_count = 0;
  page_current = 0;
  page_rows = 0;
  page_rowcount = 0;

  sub: any;
  urlid: string;

  id1: string = '';
  id2: string = '';
  id3: string = '';
  id4: string = '';

  email: string = '';


  ErrorMessage = "";

  mode = '';
  pkid = '';

  code_length: number = 10;


  // Array For Displaying List
  RecordList: Param[] = [];
  // Single Record for add/edit/view details
  Record: Param = new Param;

  constructor(
    private mainService: ParamService,
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
    this.bPrint = false;
    this.currentTab = 'LIST';
    this.menu_record = this.gs.getMenu(this.menuid);
    if (this.menu_record) {
      this.title = this.menu_record.menu_name;
      if (this.menu_record.rights_print)
        this.bPrint = true;
    }
    this.InitColumns();
    this.List("NEW");
  }

  InitColumns() {

    this.id1 = '';
    this.id2 = '';
    this.id3 = '';
    this.id4 = '';

    this.email = '';

    this.code_length = 15;

    if (this.type == 'CHALIC') {
      this.id1 = "Branch code";
      this.id2 = "Cha#";
      this.id3 = "IceGateID";
      this.id4 = "Email Pwd";
      this.email = "e-Mail";
    }


    if (this.type == 'SALESMAN') {
      this.email = "e-Mail";
    }



    if (this.type == 'AIR CARRIER') {
      this.id1 = "3DigitCode";
      this.id2 = "Type";
    }
    if (this.type == 'PAN') {
      this.id1 = "Location";
    }

    if (this.type == 'CONTAINER TYPE') {
      this.id1 = "Size(20/40/45)";
      this.id3 = "Description";
    }

    if (this.type == 'CURRENCY') {
      this.id1 = 'Ex.Rate - CLR';
      this.param_rate_caption = 'Ex.Rate - FWD';
    }

    if (this.type == 'COUNTRY') {
      this.id1 = "Region";
    }
    if (this.type == 'PARAM') {
      this.id1 = "Customer Code";
    }
    if (this.type == 'SERVICE CONTRACT') {
      this.id3 = "Group";
    }
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
      report_folder: this.gs.globalVariables.report_folder,
      company_code: this.gs.globalVariables.comp_code,
      branch_code: this.gs.globalVariables.branch_code,
      page_count: this.page_count,
      page_current: this.page_current,
      page_rows: this.page_rows,
      page_rowcount: this.page_rowcount
    };

    SearchData.sortby = "name";
    if (this.sortby)
      SearchData.sortby = "code";

    this.ErrorMessage = '';
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

    this.Record = new Param();
    this.Record.param_pkid = this.pkid;
    this.Record.param_code = '';
    this.Record.param_name = '';
    this.Record.param_id1 = '';
    this.Record.param_id2 = '';
    this.Record.param_id3 = '';
    this.Record.param_id4 = '';
    this.Record.param_email = '';
    this.Record.param_rate = 0;
    this.Record.param_type = this.type;
    this.Record.rec_locked = false;
    this.Record.rec_mode = this.mode;

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

  LoadData(_Record: Param) {
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
    if (this.Record.param_code.trim().length <= 0) {
      bret = false;
      sError = "Code Cannot Be Blank";
    }
    if (this.Record.param_name.trim().length <= 0) {
      bret = false;
      sError += "\n\rName Cannot Be Blank";
    }

    if (this.type == 'CONTAINER TYPE') {
      if (this.Record.param_id1 != "20" && this.Record.param_id1 != "40" && this.Record.param_id1 != "45") {
        bret = false;
        sError += "\n\rSize Can Be 20 / 40 / 45";
      }
    }
    this.Record.param_code = this.Record.param_code.toUpperCase().trim();

    if (this.type == 'PAN') {

      if (this.Record.param_code.length != 10) {
        bret = false;
        sError += "\n\r | Pan# Need To Be 10 Characters  ";
      }
      else {

        for (var i = 0; i <= 9; i++) {

          if (i <= 4) {
            if (this.Isnumeric(this.Record.param_code[i]) == true) {
              bret = false;
              sError += "\n\r | Invalid Pan#, Format XXXXX9999X ";
              break;
            }
          }
          else if (i <= 8) {
            if (this.Isnumeric(this.Record.param_code[i]) == false) {
              bret = false;
              sError += "\n\r | Invalid Pan#, Format XXXXX9999X ";
              break;
            }
          }
          else if (i == 9) {
            if (this.Isnumeric(this.Record.param_code[i]) == true) {
              bret = false;
              sError += "\n\r | Invalid Pan#, Format XXXXX9999X ";

            }
          }
        }

      }
    }

    if (this.type == 'TAN') {

      if (this.Record.param_code.length != 10) {
        bret = false;
        sError += "\n\r | Tan# Need To Be 10 Characters ";
      }
      else {

        for (var i = 0; i <= 9; i++) {

          if (i <= 3) {
            if (this.Isnumeric(this.Record.param_code[i]) == true) {
              bret = false;
              sError += "\n\r | Invalid Tan#, Format XXXX99999X ";
              break;
            }
          }
          else if (i <= 8) {
            if (this.Isnumeric(this.Record.param_code[i]) == false) {
              bret = false;
              sError += "\n\r | Invalid Tan#, Format XXXX99999X ";
              break;
            }
          }
          else if (i == 9) {
            if (this.Isnumeric(this.Record.param_code[i]) == true) {
              bret = false;
              sError += "\n\r | Invalid Tan#, Format XXXX99999X ";
            }
          }
        }
      }

    }


    //if (this.Record.user_password.trim().length <= 0) {
    //    bret = false;
    //    sError += "\n\rPassword Cannot Be Blank";
    //}

    if (bret) {
      this.Record.param_code = this.Record.param_code.toUpperCase().replace(' ', '');
      this.Record.param_name = this.Record.param_name.toUpperCase().trim();

      this.Record.param_id1 = this.Record.param_id1.toUpperCase().trim();
      this.Record.param_id2 = this.Record.param_id2.toUpperCase().trim();
      this.Record.param_email = this.Record.param_email.trim();

    }

    if (bret === false)
      this.ErrorMessage = sError;
    return bret;
  }


  Isnumeric(i: any) {

    if (i >= 0 && i <= 9) {
      return true;
    }
    else {
      return false;
    }

  }

  RefreshList() {

    if (this.RecordList == null)
      return;
    var REC = this.RecordList.find(rec => rec.param_pkid == this.Record.param_pkid);
    if (REC == null) {
      this.RecordList.push(this.Record);
    }
    else {
      REC.param_code = this.Record.param_code;
      REC.param_name = this.Record.param_name;
      REC.param_id1 = this.Record.param_id1;
      REC.param_id2 = this.Record.param_id2;
      REC.param_id3 = this.Record.param_id3;
      REC.param_id4 = this.Record.param_id4;
      REC.param_email = this.Record.param_email;
      REC.param_rate = this.Record.param_rate;

    }
  }

  Close() {
    this.gs.ClosePage('home');
  }


}
