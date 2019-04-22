
import { Component, Input, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';

import { ActivatedRoute } from '@angular/router';

import { GlobalService } from '../../core/services/global.service';

import { Containerm } from '../models/container';

import { ContainerService } from '../services/container.service';
import { SearchTable } from '../../shared/models/searchtable';


@Component({
  selector: 'app-container',
  templateUrl: './container.component.html',
  providers: [ContainerService]
})
export class ContainerComponent {
  // Local Variables 
  title = 'Container Master';

  @Input() menuid: string = '';
  @Input() type: string = '';
  InitCompleted: boolean = false;
  menu_record: any;
  // booking_mbl_no: string;
  disableSave = true;
  loading = false;
  currentTab = 'LIST';

  searchstring = '';
  page_count = 0;
  page_current = 0;
  page_rows = 0;
  page_rowcount = 0;

  booking_no: string;
  mbl_no: string;
  cntr_egmno: string;
  cntr_egmdt: string;
  book_and_mbl: string;
  sub: any;
  urlid: string;

  ErrorMessage = "";
  InfoMessage = "";

  mode = '';
  pkid = '';

  lock_record: boolean = false;
  lock_bookingno: boolean = false;

  // Array For Displaying List
  RecordList: Containerm[] = [];
  // Single Record for add/edit/view details
  Record: Containerm = new Containerm;
  CNTRTYPERECORD: SearchTable = new SearchTable();
  SERVICECONTRACTRECORD:SearchTable = new SearchTable();

  constructor(
    private mainService: ContainerService,
    private route: ActivatedRoute,
    private gs: GlobalService
  ) {
    this.page_count = 0;
    this.page_rows = 15;
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
    this.InitLov();
    this.LoadCombo();
  }

  // Destroy Will be called when this component is closed
  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  LoadCombo() {

    //this.loading = true;
    //let SearchData = {
    //    type: 'type'
    //};

    //this.ErrorMessage = '';
    //this.InfoMessage = '';
    //this.mainService.LoadDefault(SearchData)
    //    .subscribe(response => {
    //        this.loading = false;
    //        //this.AcGrpList = response.acgroupm;
    //        //this.AcTypeList = response.actypem;

    //        this.List("NEW");
    //    },
    //    error => {
    //        this.loading = false;
    //        this.ErrorMessage = this.gs.getError(error);
    //  });

    this.List("NEW");
  }
  InitLov() {

    this.CNTRTYPERECORD = new SearchTable();
    this.CNTRTYPERECORD.controlname = "CNTR-TYPE";
    this.CNTRTYPERECORD.displaycolumn = "CODE";
    this.CNTRTYPERECORD.type = "CONTAINER TYPE";
    this.CNTRTYPERECORD.id = "";
    this.CNTRTYPERECORD.code = "";
    this.CNTRTYPERECORD.name = "";

    this.SERVICECONTRACTRECORD = new SearchTable();
    this.SERVICECONTRACTRECORD.controlname = "SERVICE-CONTRACT";
    this.SERVICECONTRACTRECORD.displaycolumn = "CODE";
    this.SERVICECONTRACTRECORD.type = "SERVICE CONTRACT";
    this.SERVICECONTRACTRECORD.id = "";
    this.SERVICECONTRACTRECORD.code = "";
    this.SERVICECONTRACTRECORD.name = "";
  }

  LovSelected(_Record: SearchTable) {

    if (_Record.controlname == "CNTR-TYPE") {
      this.Record.cntr_type_id = _Record.id;
      this.Record.cntr_type_code = _Record.code;
      this.Record.cntr_type_name = _Record.name;
    }
    if (_Record.controlname == "SERVICE-CONTRACT") {
      this.Record.cntr_service_contract_id = _Record.id;
      this.Record.cntr_service_contract_code = _Record.code;
      this.Record.cntr_service_contract_name = _Record.name;
    }
  }

  //function for handling LIST/NEW/EDIT Buttons
  ActionHandler(action: string, id: string) {
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
      this.book_and_mbl = '';

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
      year_code: this.gs.globalVariables.year_code,
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
    this.lock_record = false;
    this.lock_bookingno = false;
    this.pkid = this.gs.getGuid();
    this.Record = new Containerm();
    this.Record.cntr_pkid = this.pkid;
    this.Record.cntr_no = '';
    this.Record.cntr_csealno = '';
    this.Record.cntr_asealno = '';
    this.Record.cntr_booking_id = '';
    this.Record.cntr_booking_no = '';
    this.Record.cntr_booking_name = '';
    this.Record.cntr_type_id = '';
    this.Record.cntr_type_code = '';
    this.Record.cntr_type_name = '';
    this.Record.cntr_morh = 'N';
    this.Record.cntr_mbl_no = '';

    this.Record.cntr_clearing = true;
    this.Record.cntr_stuffed_at = '';
    this.Record.cntr_stuffed_on = '';
    this.Record.cntr_egmno = '';
    this.Record.cntr_egmdt = '';
    this.Record.cntr_trafinsp = 'N';
    this.Record.cntr_inspsup = '';
    this.Record.cntr_inspin = '';
    this.Record.cntr_service_contract_id ="";
    this.Record.cntr_service_contract_code ="";
    this.Record.cntr_service_contract_name ="";
    this.InitLov();
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
        this.LoadData(response.record);
        this.booking_no = response.record.cntr_booking_no;
        this.mbl_no = response.record.cntr_mbl_no;


        this.book_and_mbl = '';
        if (this.booking_no != "" && this.mbl_no != "") {
          this.book_and_mbl = this.booking_no + "/" + this.mbl_no;
        }
        if (this.booking_no == "" && this.mbl_no != "") {
          this.book_and_mbl = this.mbl_no;
        }
        if (this.booking_no != "" && this.mbl_no == "") {
          this.book_and_mbl = this.booking_no;
        }

      },
        error => {
          this.loading = false;
          this.ErrorMessage = this.gs.getError(error);
        });
  }

  LoadData(_Record: Containerm) {
    this.Record = _Record;
    this.InitLov();
    this.CNTRTYPERECORD.id = this.Record.cntr_type_id;
    this.CNTRTYPERECORD.code = this.Record.cntr_type_code;
    this.CNTRTYPERECORD.name = this.Record.cntr_type_name;
    this.SERVICECONTRACTRECORD.id = this.Record.cntr_service_contract_id;
    this.SERVICECONTRACTRECORD.code = this.Record.cntr_service_contract_code;
    this.SERVICECONTRACTRECORD.name = this.Record.cntr_service_contract_name;
    this.Record.rec_mode = this.mode;
    /*
    this.lock_record = true;
    this.lock_bookingno = true;

    if (this.Record.cntr_edit_code.indexOf("{S}") >= 0) {
      this.lock_record = false;
    }
    if (this.Record.cntr_booking_id.length <= 0 || (this.Record.cntr_booking_id.length > 0 && this.Record.cntr_edit_code.indexOf("{C}") >= 0)) {
      this.lock_bookingno = false;
    }
    */
  }

  // Save Data
  Save() {
    if (!this.allvalid())
      return;
    this.loading = true;
    this.ErrorMessage = '';
    this.InfoMessage = '';
    this.Record.rec_category = this.type;
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

    if (this.Record.cntr_no.trim().length <= 0) {
      bret = false;
      sError += "\n\r Container Cannot Be Blank";
    }
    else if (this.Record.cntr_no.trim().length < 12 || this.Record.cntr_no.trim().length > 13) {
      bret = false;
      sError += "\n\r Invalid Container";
    }

    if (this.Record.cntr_type_id.trim().length <= 0) {
      bret = false;
      sError += "\n\r Container Type Cannot Be Blank";
    }

    //if (!this.Record.cntr_clearing) {
    //  if (this.Record.cntr_booking_no.trim().length <= 0) {
    //    bret = false;
    //    sError = "Booking SL# Cannot Be Blank";
    //  }
    //}
    //if (!this.Record.cntr_clearing) {
    //  if (this.Record.cntr_booking_id.trim().length <= 0) {
    //    bret = false;
    //    sError += "\n\r Invalid Liner Booking SL#";
    //  }
    //}

    if (this.Record.cntr_clearing) {
      if (this.Record.cntr_booking_no.trim().length > 0) {
        bret = false;
        sError += "\n\r For Clearing Booking SL# not required";
      }
    }

    if (bret === false)
      this.ErrorMessage = sError;
    return bret;
  }

  RefreshList() {

    if (this.RecordList == null)
      return;
    var REC = this.RecordList.find(rec => rec.cntr_pkid == this.Record.cntr_pkid);
    if (REC == null) {
      this.RecordList.push(this.Record);
    }
    else {
      REC.cntr_no = this.Record.cntr_no;
      REC.cntr_teu = this.Record.cntr_teu;
      REC.cntr_type_code = this.Record.cntr_type_code;
      REC.cntr_asealno = this.Record.cntr_asealno;
      REC.cntr_csealno = this.Record.cntr_csealno;
    }
  }

  Close() {
    this.gs.ClosePage('home');
  }

  OnBlur(field: string) {
    switch (field) {
      case 'cntr_no':
        {
          // this.Record.cntr_no = this.Record.cntr_no.trim().replace(new RegExp(' '), '').toUpperCase(); 
          this.Record.cntr_no = this.GetSpaceTrim(this.Record.cntr_no.trim()).newstr.toUpperCase();
          break;
        }
      case 'cntr_asealno':
        {
          this.Record.cntr_asealno = this.Record.cntr_asealno.toUpperCase();
          break;
        }
      case 'cntr_csealno':
        {
          this.Record.cntr_csealno = this.Record.cntr_csealno.toUpperCase();
          break;
        }
      case 'cntr_booking_no':
        {
          this.Record.cntr_booking_id = '';
          this.Record.cntr_booking_name = '';
          this.book_and_mbl = '';
          this.SearchRecord('cntr_booking_no');
          break;
        }
      case 'cntr_stuffed_at':
        {
          this.Record.cntr_stuffed_at = this.Record.cntr_stuffed_at.toUpperCase();
          break;
        }
      case 'cntr_egmno':
        {
          this.Record.cntr_egmno = this.Record.cntr_egmno.toUpperCase();
          break;
        }

    }
  }

  SearchRecord(controlname: string) {
    if (this.Record.cntr_booking_no.trim().length <= 0)
      return;

    this.loading = true;
    let SearchData = {
      rowtype: this.type,
      table: 'linerbkm',
      company_code: this.gs.globalVariables.comp_code,
      branch_code: this.gs.globalVariables.branch_code,
      year_code: this.gs.globalVariables.year_code,
      book_slno: ''
    };
    if (controlname == 'cntr_booking_no') {
      SearchData.rowtype = this.type;
      SearchData.table = 'linerbkm';
      SearchData.company_code = this.gs.globalVariables.comp_code;
      SearchData.branch_code = this.gs.globalVariables.branch_code;
      SearchData.year_code = this.gs.globalVariables.year_code;
      SearchData.book_slno = this.Record.cntr_booking_no;
    }
    this.ErrorMessage = '';
    this.gs.SearchRecord(SearchData)
      .subscribe(response => {
        this.loading = false;
        this.Record.cntr_booking_id = '';
        this.ErrorMessage = '';
        if (response.linerbkm.length > 0) {
          this.Record.cntr_booking_id = response.linerbkm[0].book_pkid;
          this.Record.cntr_booking_name = response.linerbkm[0].book_no;

          this.booking_no = response.linerbkm[0].book_no;
          this.mbl_no = response.linerbkm[0].book_mblno;

          if (this.booking_no != "" && this.mbl_no != "") {
            this.book_and_mbl = this.booking_no + "/" + this.mbl_no;
          }
          if (this.booking_no == "" && this.mbl_no != "") {
            this.book_and_mbl = this.mbl_no;
          }
          if (this.booking_no != "" && this.mbl_no == "") {
            this.book_and_mbl = this.booking_no;
          }

        }
        else {
          this.ErrorMessage = 'Invalid Booking SL#';
        }
      },
        error => {
          this.loading = false;
          this.ErrorMessage = this.gs.getError(error);
        });
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

  Onchange() {

    this.Record.cntr_booking_id = '';
    this.Record.cntr_booking_name = '';
    this.Record.cntr_booking_no = '';
    this.book_and_mbl = "";
  }

}
