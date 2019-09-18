import { Component, Input, Output, OnInit, OnDestroy, EventEmitter } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute } from '@angular/router';
import { GlobalService } from '../../core/services/global.service';
import { Esanchit } from '../models/esanchit';
import { EsanchitDownloadService } from '../services/esanchitdownload.service';

import { SearchTable } from '../../shared/models/searchtable';
import { Settings } from '../../master/models/settings';

@Component({
  selector: 'app-esanchitdownload',
  templateUrl: './esanchitdownload.component.html',
  providers: [EsanchitDownloadService]
})
export class EsanchitDownloadComponent {
  /*
  Ajith 28/05/2019 pastedata implemented
  */
  // Local Variables 
  title = 'Esanchit List';

  @Input() menuid: string = '';
  @Input() type: string = '';
  @Input() parentid: string = '';
  selectedRowIndex: number = -1;
  InitCompleted: boolean = false;
  menu_record: any;
  modal: any;
  sub: any;
  BR_ESANCHIT_EMAIL: string = '';
  BR_ESANCHIT_EMAIL_PWD: string = '';
  BR_ESANCHIT_LOCATIONS: string = '';
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
  bShowPasteData: boolean = false;

  // Array For Displaying List
  RecordList: Esanchit[] = [];
  // Single Record for add/edit/view details
  Record: Esanchit = new Esanchit;

  constructor(
    private modalService: NgbModal, 
    private mainService: EsanchitDownloadService,
    private route: ActivatedRoute,
    private gs: GlobalService
  ) {
    this.page_count = 0;
    this.page_rows = 100;
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


  List(_type: string) {
    this.loading = true;

    let SearchData = {
      type: _type,
      rowtype: 'SEA-AIR',
      parentid: this.parentid,
      searchstring: this.searchstring.toUpperCase(),
      company_code: this.gs.globalVariables.comp_code,
      branch_code: this.gs.globalVariables.branch_code,
      year_code: this.gs.globalVariables.year_code,
      user_code: this.gs.globalVariables.user_code,
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

        this.BR_ESANCHIT_EMAIL = response.email;
        this.BR_ESANCHIT_EMAIL_PWD = response.emailpwd;
        this.BR_ESANCHIT_LOCATIONS = response.locations;

      },
        error => {
          this.loading = false;
          this.ErrorMessage = this.gs.getError(error);
        });
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
      rowtype: 'SEA-AIR',
      pkid: _id,
      br_esanchit_email: '',
      br_esanchit_email_pwd: '',
      br_esanchit_locations: '',
      br_start_index: '',
      company_code: this.gs.globalVariables.comp_code,
      branch_code: this.gs.globalVariables.branch_code,
      year_code: this.gs.globalVariables.year_code,
      user_code: this.gs.globalVariables.user_code,
      cbdata: ''
    };

    SearchData.type = _type;
    SearchData.rowtype = "SEA-AIR";
    SearchData.pkid = _id;
    SearchData.br_start_index = this.BR_START_INDEX.toString();
    SearchData.br_esanchit_email = this.BR_ESANCHIT_EMAIL;
    SearchData.br_esanchit_email_pwd = this.BR_ESANCHIT_EMAIL_PWD;
    SearchData.br_esanchit_locations = this.BR_ESANCHIT_LOCATIONS;
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
          if (response.errormsg.length > 0)
            this.InfoMessage += ", Error " + response.errormsg;
          alert(this.InfoMessage);
          this.List("NEW");
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
      case 'BR_ESANCHIT_LOCATIONS':
        {
          this.BR_ESANCHIT_LOCATIONS = this.BR_ESANCHIT_LOCATIONS.toUpperCase();
          break;
        }
    }
  }

  Settings() {
    this.user_admin = !this.user_admin;
  }

  PasteData(content:any) {
    this.bShowPasteData = true;
    this.ErrorMessage = '';
    this.InfoMessage = '';
    this.modal = this.modalService.open(content);
  }
  PasteDataClosed(cbdata: string) {
    this.bShowPasteData = false;
    this.closeModal();  
    if (cbdata == null)
      return;
    if (cbdata.toString().trim() == "")
      return;

    this.loading = true;
    this.ErrorMessage = '';
    this.InfoMessage = '';
    let SearchData = {
      type: 'PASTE-DATA',
      rowtype: 'SEA-AIR',
      pkid: '',
      br_esanchit_email: '',
      br_esanchit_email_pwd: '',
      br_esanchit_locations: '',
      br_start_index: '',
      company_code: this.gs.globalVariables.comp_code,
      branch_code: this.gs.globalVariables.branch_code,
      year_code: this.gs.globalVariables.year_code,
      user_code: this.gs.globalVariables.user_code,
      cbdata: cbdata
    };

    SearchData.type = "PASTE-DATA";
    SearchData.rowtype = "SEA-AIR";
    SearchData.company_code = this.gs.globalVariables.comp_code;
    SearchData.branch_code = this.gs.globalVariables.branch_code;
    SearchData.year_code = this.gs.globalVariables.year_code;
    SearchData.cbdata = cbdata;

    this.mainService.SaveSettings(SearchData)
      .subscribe(response => {
        this.loading = false;
        this.InfoMessage = "Save Complete";
        if (response.errormsg.length > 0)
          this.InfoMessage = ", Error " + response.errormsg;
        alert(this.InfoMessage);
        this.List("NEW");
      },
        error => {
          this.loading = false;
          this.ErrorMessage = this.gs.getError(error);
          alert(this.ErrorMessage);
        });

       
  }
  closeModal() {
    this.modal.close();
 
  }

}
