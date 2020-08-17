import { Component, Input, Output, OnInit, OnDestroy, EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GlobalService } from '../../../core/services/global.service';
import { MailSB } from '../../models/mailsb';
import { MailSbService } from '../../services/mailsb.service';
import { SearchTable } from '../../../shared/models/searchtable';
import { Settings } from '../../../master/models/settings';


@Component({
  selector: 'app-checksb',
  templateUrl: './checksb.component.html',
  providers: [MailSbService]
})
export class CheckSbComponent {
  // Local Variables 
  title = 'SB List';

  @Input() menuid: string = '';
  @Input() type: string = '';
  @Input() parentid: string = '';
  selectedRowIndex: number = -1;
  InitCompleted: boolean = false;
  menu_record: any;
  sub: any;
  BR_ICEGATE_EMAIL: string = '';
  BR_ICEGATE_EMAIL_PWD: string = '';
  BR_CUSTOM_LOCATIONS: string = '';
  BR_START_INDEX: number = 0;

  page_count = 0;
  page_current = 0;
  page_rows = 0;
  page_rowcount = 0;

  loading = false;
  currentTab = 'LIST';

  bAdmin = false;
  bChanged: boolean;
  user_admin = false;

  from_date: string = "";
  searchstring = "";
  ErrorMessage = "";
  InfoMessage = "";

  mode = 'ADD';
  pkid = '';

  ctr: number;

  // Array For Displaying List
  RecordList: MailSB[] = [];
  // Single Record for add/edit/view details
  Record: MailSB = new MailSB;


  constructor(
    private mainService: MailSbService,
    private route: ActivatedRoute,
    private gs: GlobalService
  ) {
    this.page_count = 0;
    this.page_rows = 100;
    this.page_current = 0;
    this.InitLov();
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
    this.List("NEW");
  }

  InitComponent() {
    this.bAdmin = false;
    this.user_admin = false;
    this.menu_record = this.gs.getMenu(this.menuid);
    if (this.menu_record) {
      if (this.menu_record.rights_admin)
        this.bAdmin = true;
    }
    this.from_date = this.gs.getNewdate(1);
  }

  // Destroy Will be called when this component is closed
  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  InitLov() {

  }

  LovSelected(_Record: SearchTable) {

  }

  //function for handling LIST/NEW/EDIT Buttons
  ActionHandler(action: string, id: string, _selectedRowIndex: number = -1) {
    this.ErrorMessage = '';
    this.InfoMessage = '';
    /*
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
      //this.selectedRowIndex = _selectedRowIndex;
      //this.currentTab = 'DETAILS';
      //this.mode = 'EDIT';
      //this.ResetControls();
      //this.pkid = id;
      //this.GetRecord(id);
    }
   */


  }

  ResetControls() {

  }

  List(_type: string) {
    this.loading = true;

    let SearchData = {
      type: _type,
      rowtype: this.type,
      parentid: this.parentid,
      searchstring: this.searchstring.toUpperCase(),
      company_code: this.gs.globalVariables.comp_code,
      branch_code: this.gs.globalVariables.branch_code,
      year_code: this.gs.globalVariables.year_code,
      page_count: this.page_count,
      page_current: this.page_current,
      page_rows: this.page_rows,
      page_rowcount: this.page_rowcount,
      from_date: this.from_date
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

        this.BR_ICEGATE_EMAIL = response.email;
        this.BR_ICEGATE_EMAIL_PWD = response.emailpwd;
        this.BR_CUSTOM_LOCATIONS = response.locations;

      },
        error => {
          this.loading = false;
          this.ErrorMessage = this.gs.getError(error);
        });
  }

  NewRecord() {

    this.pkid = this.gs.getGuid();
    this.Record = new MailSB();
    this.Record.sb_pkid = this.pkid;
    //this.Record.ord_exp_id = '';
    //this.Record.ord_exp_name = '';
    //this.Record.ord_imp_id = '';
    //this.Record.ord_imp_name = '';
    //this.Record.ord_invno = '';
    //this.Record.ord_uneco = '';
    //this.Record.ord_po = '';
    //this.Record.ord_style = '';
    //this.Record.ord_cbm = 0;
    //this.Record.ord_pcs = 0;
    //this.Record.ord_pkg = 0;
    //this.Record.ord_grwt = 0;
    //this.Record.ord_ntwt = 0;
    //this.Record.ord_hs_code = '';
    //this.Record.ord_cargo_status = '';
    //this.Record.ord_desc = '';
    //this.Record.ord_stylename = '';
    //this.Record.ord_color = '';
    //this.Record.ord_contractno = '';
    //this.Record.rec_mode = this.mode;
    //this.InitLov();
  }

  // Load a single Record for VIEW/EDIT
  GetRecord(Id: string) {
    this.loading = true;

    let SearchData = {
      pkid: Id,
    };

    //this.ErrorMessage = '';
    //this.InfoMessage = '';
    //this.mainService.GetRecord(SearchData)
    //    .subscribe(response => {
    //        this.loading = false;
    //        this.LoadData(response.record);
    //    },
    //    error => {
    //        this.loading = false;
    //        this.ErrorMessage = this.gs.getError(error);
    //    });
  }

  LoadData(_Record: MailSB) {
    this.Record = _Record;
    this.InitLov();
    this.Record.rec_mode = this.mode;
  }

  UpdateSBData(_Record: MailSB) {
    let strmsg: string = "";
    strmsg = "UPDATE SB# " + _Record.sb_no + " WITH JOB# " + _Record.sb_job_no;
    if (confirm(strmsg)) {
      this.Save('UPDATESB', _Record.sb_pkid)
    }
  }

  // Save Data
  Save(_type: string, _id: string = "") {
    if (!this.allvalid(_type))
      return;

    this.loading = true;
    this.ErrorMessage = '';
    this.InfoMessage = '';
    let SearchData = {
      type: _type,
      rowtype: this.type,
      pkid: _id,
      br_icegate_email: '',
      br_icegate_email_pwd: '',
      br_custom_locations: '',
      br_start_index: '',
      company_code: this.gs.globalVariables.comp_code,
      branch_code: this.gs.globalVariables.branch_code,
      year_code: this.gs.globalVariables.year_code,
      user_code: this.gs.globalVariables.user_code,
      root_folder: this.gs.defaultValues.root_folder,
      sub_folder: this.gs.defaultValues.sub_folder
    };

    SearchData.type = _type;
    SearchData.rowtype = this.type;
    SearchData.pkid = _id;
    SearchData.br_start_index = this.BR_START_INDEX.toString();
    SearchData.br_icegate_email = this.BR_ICEGATE_EMAIL;
    SearchData.br_icegate_email_pwd = this.BR_ICEGATE_EMAIL_PWD;
    SearchData.br_custom_locations = this.BR_CUSTOM_LOCATIONS;
    SearchData.company_code = this.gs.globalVariables.comp_code;
    SearchData.branch_code = this.gs.globalVariables.branch_code;
    SearchData.year_code = this.gs.globalVariables.year_code;

    this.mainService.SaveSettings(SearchData)
      .subscribe(response => {
        this.loading = false;
        if (_type == "SAVE")
          this.InfoMessage = "Save Complete";
        else if (_type == "DOWNLOAD") {
          this.InfoMessage = "Download Complete";
          alert(this.InfoMessage);
          this.List("NEW");
        } if (_type == "UPDATESB") {
          if (response.sbreason.length > 0) {
            if (this.RecordList == null)
              return;
            var REC = this.RecordList.find(rec => rec.sb_pkid == _id);
            if (REC != null) {
              REC.sb_reason = response.sbreason;
            }
          }
          this.InfoMessage = response.savemsg;
          alert(this.InfoMessage);
        }
      },
        error => {
          this.loading = false;
          this.ErrorMessage = this.gs.getError(error);
        });
  }

  allvalid(_type: string) {
    let sError: string = "";
    let bret: boolean = true;
    this.ErrorMessage = '';
    this.InfoMessage = '';

    /*
      if (this.Record.ord_desc.trim().length <= 0) {
        bret = false;
        sError += "\n\r | Description Cannot Be Blank";
      }
    */


    //if (bret === false)
    //    this.ErrorMessage = sError;

    return bret;
  }

  RefreshList() {

    //if (this.RecordList == null)
    //    return;
    //var REC = this.RecordList.find(rec => rec.ord_pkid == this.Record.ord_pkid);
    //if (REC == null) {
    //    this.RecordList.push(this.Record);
    //}
    //else {
    //    REC.ord_po = this.Record.ord_po;
    //    REC.ord_style = this.Record.ord_style;
    //    REC.ord_cargo_status = this.Record.ord_cargo_status;
    //    REC.ord_desc = this.Record.ord_desc;
    //    REC.ord_color = this.Record.ord_color;
    //    REC.ord_contractno = this.Record.ord_contractno;
    //}
  }

  Close() {
    this.gs.ClosePage('home');
  }

  OnFocus(field: string) {
    this.bChanged = false;
  }

  OnChange(field: string) {
    this.bChanged = true;
  }

  OnBlur(field: string) {
    switch (field) {

      case 'BR_CUSTOM_LOCATIONS':
        {
          this.BR_CUSTOM_LOCATIONS = this.BR_CUSTOM_LOCATIONS.toUpperCase();
          break;
        }
    }
  }

  Settings() {
    this.user_admin = !this.user_admin;
  }

}
