import { Component, Input, Output, OnInit, OnDestroy, EventEmitter } from '@angular/core';

import { ActivatedRoute } from '@angular/router';

import { GlobalService } from '../../../core/services/global.service';

import { Eou } from '../../models/eou';

import { EouService } from '../../services/eou.service';

import { SearchTable } from '../../../shared/models/searchtable';

@Component({
  selector: 'app-annexure',
  templateUrl: './annexure.component.html',
  providers: [EouService]
})
export class EouComponent {
  // Local Variables 
  title = '';

  @Input() menuid: string = '';
  @Input() type: string = '';
  @Input() parentid: string = '';


  Total_Amount: number = 0;

  loading = false;
  currentTab = 'LIST';

  ErrorMessage = "";
  InfoMessage = "";
  mode = 'ADD';
  pkid = '';

  ctr: number;
  jobdisabled = false;



  // Array For Displaying List
  RecordList: Eou[] = [];
  // Single Record for add/edit/view details
  Record: Eou = new Eou;

  EXPRECORD: SearchTable = new SearchTable();
  EXPADDRRECORD: SearchTable = new SearchTable();

  constructor(
    private mainService: EouService,
    private route: ActivatedRoute,
    private gs: GlobalService
  ) {
    this.InitLov();

  }

  // Init Will be called After executing Constructor
  ngOnInit() {
    this.ActionHandler("EDIT", this.parentid);
  }

  // Destroy Will be called when this component is closed
  ngOnDestroy() {

  }

  InitLov() {

    this.EXPRECORD = new SearchTable();
    this.EXPRECORD.controlname = "SHIPPER";
    this.EXPRECORD.displaycolumn = "CODE";
    this.EXPRECORD.type = "CUSTOMER";
    this.EXPRECORD.where = " CUST_IS_SHIPPER = 'Y' ";
    this.EXPRECORD.id = "";
    this.EXPRECORD.code = "";
    this.EXPRECORD.name = "";
    this.EXPRECORD.parentid = "";

    this.EXPADDRRECORD = new SearchTable();
    this.EXPADDRRECORD.controlname = "SHIPPERADDRESS";
    this.EXPADDRRECORD.displaycolumn = "CODE";
    this.EXPADDRRECORD.type = "CUSTOMERADDRESS";
    this.EXPADDRRECORD.id = "";
    this.EXPADDRRECORD.code = "";
    this.EXPADDRRECORD.name = "";
    this.EXPADDRRECORD.parentid = "";

  }

  LovSelected(_Record: SearchTable) {

    let bchange: boolean = false;
    if (_Record.controlname == 'SHIPPER') {
      bchange = false;
      if (this.Record.eou_exp_id != _Record.id)
        bchange = true;
      this.Record.eou_exp_id = _Record.id;
      this.Record.eou_exp_name = _Record.name;

      if (bchange) {
        this.EXPADDRRECORD = new SearchTable();
        this.EXPADDRRECORD.controlname = "SHIPPERADDRESS";
        this.EXPADDRRECORD.type = "CUSTOMERADDRESS";
        this.EXPADDRRECORD.id = "";
        this.EXPADDRRECORD.code = "";
        this.EXPADDRRECORD.name = "";
        this.EXPADDRRECORD.parentid = this.Record.eou_exp_id;
        //this.Record.gj_shipper_br_addr = "";
      }

    }

    else if (_Record.controlname == "SHIPPERADDRESS") {

      this.Record.eou_br_id = _Record.id;
      this.Record.eou_br_no = _Record.code;
      //this.Record.eou_br_no = this.GetBrAddress(_Record.name).addressbrno;

    }
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
    else if (action === 'REMOVE') {
      this.currentTab = 'DETAILS';
      this.pkid = id;
      this.RemoveRecord(id);
    }
  }

  ResetControls() {
    if (this.mode == "ADD")
      this.jobdisabled = false;
    else
      this.jobdisabled = true;
  }

  List111(_type: string) {

    this.loading = true;

    let SearchData = {
      type: _type,
      rowtype: this.type,
      parentid: this.parentid,
      company_code: this.gs.globalVariables.comp_code,
      branch_code: this.gs.globalVariables.branch_code,
      year_code: this.gs.globalVariables.year_code,
    };

    this.ErrorMessage = '';
    this.InfoMessage = '';
    this.title = '';
    this.mainService.List(SearchData)
      .subscribe(response => {
        this.loading = false;
        this.RecordList = response.list;
        this.title = response.containerno;
      },
        error => {
          this.loading = false;
          this.ErrorMessage = this.gs.getError(error);
          alert(this.ErrorMessage);
        });
  }

  NewRecord() {

    this.pkid = this.gs.getGuid();
    this.Record = new Eou();
    this.Record.eou_job_id = this.parentid;
    this.Record.rec_mode = this.mode;
    this.Record.eou_exp_id = '';
    this.Record.eou_exp_code = '';
    this.Record.eou_exp_name = '';
    this.Record.eou_br_id = '';
    this.Record.eou_br_no = '';
    this.Record.eou_date = '';
    this.Record.eou_exam_officer_name = '';
    this.Record.eou_exam_officer_desg = '';
    this.Record.eou_super_name = '';
    this.Record.eou_super_desg = '';
    this.Record.eou_commissionerate = '';
    this.Record.eou_division = '';
    this.Record.eou_range = '';
    this.Record.eou_items_verified = false;
    this.Record.eou_sample_forwarded = false;
    this.Record.eou_sealno = '';

    this.InitLov();

    //this.PKGUNITRECORD.id = this.Record.pack_pkg_unit_id;
    //this.PKGUNITRECORD.code = this.Record.pack_pkg_unit_code;
  }

  // Load a single Record for VIEW/EDIT
  GetRecord(Id: string) {
    this.loading = true;

    let SearchData = {
      pkid: Id,
      parentid: this.parentid,
    };

    this.ErrorMessage = '';
    this.InfoMessage = '';
    this.mainService.GetRecord(SearchData)
      .subscribe(response => {
        this.loading = false;
        if (response.mode == "ADD")
          this.ActionHandler("ADD", null);
        else {
          this.mode = "EDIT";
          this.LoadData(response.record);
        }
      },
        error => {
          this.loading = false;
          this.ErrorMessage = this.gs.getError(error);
          alert(this.ErrorMessage);
        });
  }

  LoadData(_Record: Eou) {
    this.Record = _Record;
    this.InitLov();

    this.EXPRECORD.id = this.Record.eou_exp_id;
    this.EXPRECORD.code = this.Record.eou_exp_code;
    this.EXPRECORD.name = this.Record.eou_exp_name;

    this.EXPADDRRECORD.id = this.Record.eou_br_id;
    this.EXPADDRRECORD.code = this.Record.eou_br_no;
    this.EXPADDRRECORD.parentid = this.Record.eou_exp_id;
    //this.PKGUNITRECORD.id = this.Record.pack_pkg_unit_id;
    //this.PKGUNITRECORD.code = this.Record.pack_pkg_unit_code;

    this.Record.rec_mode = this.mode;
  }
  // Save Data
  Save() {
    if (!this.allvalid())
      return;
    this.loading = true;
    this.ErrorMessage = '';
    this.InfoMessage = '';
    this.Record.eou_job_id = this.parentid;
    this.Record._globalvariables = this.gs.globalVariables;
    this.mainService.Save(this.Record)
      .subscribe(response => {
        this.loading = false;
        this.InfoMessage = "Save Complete";
        this.mode = 'EDIT';
        this.Record.rec_mode = this.mode;
      },
        error => {
          this.loading = false;
          this.ErrorMessage = this.gs.getError(error);
          alert(this.ErrorMessage);
        });
  }

  allvalid() {
    let sError: string = "";
    let bret: boolean = true;
    this.ErrorMessage = '';
    this.InfoMessage = '';



    if (this.Record.eou_job_id.toString().trim().length <= 0) {
      bret = false;
      sError += "\n\r Job Cannot Be Blank";
    }

    //if (this.Record.eou_exp_id.toString().trim().length <= 0) {
    //  bret = false;
    //  sError += "\n\r IE Code Cannot Be Blank";
    //}



    if (bret == false) {
      this.ErrorMessage = sError;
      alert(this.ErrorMessage);
    }
    return bret;
  }

  RefreshList() {

  }

  RemoveRecord(Id: string) {
    this.loading = true;
    let SearchData = {
      pkid: Id,
      parentid: this.parentid
    };

    this.ErrorMessage = '';
    this.InfoMessage = '';
    this.mainService.DeleteRecord(SearchData)
      .subscribe(response => {
        this.loading = false;
        this.RecordList.splice(this.RecordList.findIndex(rec => rec.eou_job_id == this.pkid), 1);
        this.ActionHandler('ADD', null);
      },
        error => {
          this.loading = false;
          this.ErrorMessage = this.gs.getError(error);
          alert(this.ErrorMessage);
        });
  }


  Close() {
    this.gs.ClosePage('home');
  }

  OnBlur(field: string) {
    switch (field) {
      case 'eou_job_id':
        {
          this.Record.eou_job_id = this.Record.eou_job_id.toUpperCase();
          break;
        }
      case 'eou_exam_officer_name':
        {
          this.Record.eou_exam_officer_name = this.Record.eou_exam_officer_name.toUpperCase();
          break;
        }
      case 'eou_exam_officer_desg':
        {
          this.Record.eou_exam_officer_desg = this.Record.eou_exam_officer_desg.toUpperCase();
          break;
        }
      case 'eou_super_name':
        {
          this.Record.eou_super_name = this.Record.eou_super_name.toUpperCase();
          break;
        }
      case 'eou_super_desg':
        {
          this.Record.eou_super_desg = this.Record.eou_super_desg.toUpperCase();
          break;
        }
      case 'eou_commissionerate':
        {
          this.Record.eou_commissionerate = this.Record.eou_commissionerate.toUpperCase();
          break;
        }
      case 'eou_division':
        {
          this.Record.eou_division = this.Record.eou_division.toUpperCase();
          break;
        }
      case 'eou_range':
        {
          this.Record.eou_range = this.Record.eou_range.toUpperCase();
          break;
        }
      case 'eou_sealno':
        {
          this.Record.eou_sealno = this.Record.eou_sealno.toUpperCase();
          break;
        }
    }
  }

  //GetBrAddress(straddress: string) {
  //  let AddressSplit = {
  //    addressbrno: '',
  //    address: ''
  //  };
  //  if (straddress.trim() != "") {
  //    var temparr = straddress.split(' ');
  //    AddressSplit.addressbrno = temparr[0];
  //  }
  //  return AddressSplit;
  //}

}
