import { Component, Input, OnInit, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GlobalService } from '../../core/services/global.service';
import { printformatm } from '../models/printformatm';
import { printformatd } from '../models/printformatd';
import { BlFormterService } from '../services/blformater.service';
import { SearchTable } from '../../shared/models/searchtable';

@Component({
  selector: 'app-blformater',
  templateUrl: './blformater.component.html',
  providers: [BlFormterService]
})
export class BlFormaterComponent {
  // Local Variables 
  title = 'BL Format';

  @ViewChild('addressComponent') addressComponent: any;


  mdate: string;

  @Input() menuid: string = '';
  @Input() type: string = '';
  InitCompleted: boolean = false;
  menu_record: any;

  disableSave = true;
  loading = false;
  currentTab = 'LIST';

  searchstring = '';
  page_count = 0;
  page_current = 0;
  page_rows = 0;
  page_rowcount = 0;

  sub: any;
  urlid: string;


  ErrorMessage = "";
  InfoMessage = "";

  mode = '';
  pkid = '';

  // Array For Displaying List
  RecordList: printformatm[] = [];
  // Single Record for add/edit/view details
  Record: printformatm = new printformatm;


  RecordListDet: printformatd[] = [];

  

  constructor(
    private mainService: BlFormterService,
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

    this.menu_record = this.gs.getMenu(this.menuid);
    if (this.menu_record)
      this.title = this.menu_record.menu_name;

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

    //    this.List("NEW");
    //  },
    //  error => {
    //    this.loading = false;
    //    this.ErrorMessage = JSON.parse(error._body).Message;
    //  });

    this.List("NEW");
  }


  LovSelected(_Record: any) {
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
      company_code: this.gs.globalVariables.comp_code,
      branch_code: this.gs.globalVariables.branch_code,
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

    this.Record = new printformatm();
    this.Record.blf_pkid = this.pkid;
    this.Record.blf_type = '';
    this.Record.blf_name = '';

    this.Record.rec_mode = this.mode;

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
        this.LoadData(response.list);
      },
      error => {
        this.loading = false;
        this.ErrorMessage = this.gs.getError(error);
      });
  }

  LoadData(_Record: printformatm) {
    this.Record = _Record;

    this.RecordListDet = _Record.FormatList;

    this.Record.rec_mode = this.mode;
  }

  changepos(pos : string, rec : printformatd) {
    if (pos == 'left') {
      rec.blf_col_x = rec.blf_col_x - 8;
    }
    if (pos == 'right') {
      rec.blf_col_x = rec.blf_col_x + 8;
    }
    if (pos == 'up') {
      rec.blf_col_y = rec.blf_col_y - 15;
    }
    if (pos == 'down') {
      rec.blf_col_y = rec.blf_col_y + 15;
    }
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
    this.InfoMessage = '';

    if (this.Record.blf_type.trim().length <= 0) {
      bret = false;
      sError = " | Invalid Type";
    }

    if (bret === false)
      this.ErrorMessage = sError;
    return bret;
  }

  RefreshList() {

    if (this.RecordList == null)
      return;
    var REC = this.RecordList.find(rec => rec.blf_pkid == this.Record.blf_pkid);
    if (REC == null) {
      this.RecordList.push(this.Record);
    }
    else {
      REC.blf_type = this.Record.blf_type;
      REC.blf_name = this.Record.blf_name;

    }
  }


  OnBlur(field: string, rec : printformatd) {
    if (field == 'blf_col_x') {

    }
    if (field == 'blf_col_y') {

    }

  }
  GetSpaceTrim(str: string) {
    let num: number;
    let strTrim = {
      newstr: ''
    };
    if (str.trim() != "") {
      var temparr = str.split(' ');
      for (num = 0; num < temparr.length; num++) {
        strTrim.newstr = strTrim.newstr.concat(temparr[num]);
      }
    }
    return strTrim;
  }

  Close() {
    this.gs.ClosePage('home');
  }


}
