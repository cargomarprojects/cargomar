import { Component, Input, Output, OnInit, OnDestroy, EventEmitter } from '@angular/core';

import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

import { ActivatedRoute } from '@angular/router';

import { GlobalService } from '../../core/services/global.service';

import { CostCentert } from '../models/costcentert';

import { LedgerService } from '../services/ledger.service';


import { SearchTable } from '../../shared/models/searchtable';

@Component({
  selector: 'app-costcentert',
  templateUrl: './cc.component.html',
  providers: [LedgerService]
})
export class costCenterComponent {
  // Local Variables 
  title = 'Cost Center List';

  modal: any;

  @Input() menuid: string = '';
  @Input() type: string = '';

  @Input() parentid: string = '';

  bShowClipBoard: boolean = false;

  Total_Amount: number = 0;

  loading = false;
  currentTab = 'LIST';

  ErrorMessage = "";

  mode = 'ADD';
  pkid = '';

  ctr: number;

  // Array For Displaying List
  @Input() RecordList: CostCentert[] = [];

  CCGrpList: any[] = [];

  // Single Record for add/edit/view details
  Record: CostCentert = new CostCentert;

  constructor(
    private mainService: LedgerService,
    private route: ActivatedRoute,
    private gs: GlobalService,
    private modalService: NgbModal,    
  ) {

    this.CCGrpList = [
      { "name": "CNTR SEA EXPORT" },
      { "name": "JOB SEA EXPORT" },
      { "name": "JOB AIR EXPORT" },
      { "name": "SI SEA EXPORT" },
      { "name": "SI AIR EXPORT" },
      { "name": "SI SEA IMPORT" },
      { "name": "SI AIR IMPORT" },
      { "name": "GENERAL JOB" },
      { "name": "COST CENTER" },
      { "name": "EMPLOYEE" },
    ];
    this.ActionHandler("ADD", null);
  }

  // Init Will be called After executing Constructor
  ngOnInit() {
    this.SetupGrid();
    this.findtotal();
  }

  // Destroy Will be called when this component is closed
  ngOnDestroy() {

  }

  SetupGrid() {



  }

  //function for handling LIST/NEW/EDIT Buttons
  ActionHandler(action: string, rec: CostCentert) {
    this.ErrorMessage = '';
    if (action == 'LIST') {
      this.mode = '';
      this.pkid = '';
      this.currentTab = 'LIST';
    }
    else if (action === 'ADD') {
      this.currentTab = 'DETAILS';
      this.mode = 'ADD';
      this.NewRecord();
    }
    else if (action === 'EDIT') {
      this.currentTab = 'DETAILS';
      this.mode = 'EDIT';
      this.LoadData(rec);
    }
  }



  NewRecord() {
    this.pkid = this.gs.getGuid();
    this.Record = new CostCentert();
    this.Record.ct_pkid = this.pkid;
    this.Record.ct_jv_id = this.parentid;
    this.Record.ct_category = "AIR EXPORT JOB";
    this.Record.ct_year = +this.gs.globalVariables.year_code;
    this.Record.ct_cost_year = +this.gs.globalVariables.year_code;
    this.Record.ct_cost_code = "";
    this.Record.ct_cost_name = "";
    this.Record.ct_amount = 0;
    this.RecordList.push(this.Record);
  }

  LoadData(_Record: CostCentert) {
    this.pkid = _Record.ct_pkid;
    this.Record = new CostCentert();
    this.Record.ct_jv_id = _Record.ct_jv_id;
    this.Record.ct_pkid = _Record.ct_pkid;
    this.Record.ct_category = _Record.ct_category;
    this.Record.ct_cost_year = _Record.ct_cost_year;
    this.Record.ct_cost_code = _Record.ct_cost_code;
    this.Record.ct_cost_name = _Record.ct_cost_name;
    this.Record.ct_amount = _Record.ct_amount;
  }




  // Save Data
  Save() {
    if (!this.allvalid())
      return;

    if (this.mode == "ADD") {
      //this.Record.add_city_name = this.CityList.find(rec => rec.param_pkid == this.Record.add_city_id).param_name;
      this.Record.ct_jv_id = this.parentid;
      this.RecordList.push(this.Record);
    }
    else {
      var REC = this.RecordList.find(rec => rec.ct_pkid == this.Record.ct_pkid);
      REC.ct_category = this.Record.ct_category;
      REC.ct_cost_year = this.Record.ct_cost_year;
      REC.ct_cost_code = this.Record.ct_cost_code;
      REC.ct_amount = this.Record.ct_amount;
    }
    this.findtotal();
    this.ErrorMessage = '';

    this.ActionHandler("ADD", null);

  }

  allvalid() {
    let sError: string = "";
    let bret: boolean = true;
    this.ErrorMessage = '';


    if (this.Record.ct_cost_id == '') {
      bret = false;
      sError += "\n\rInvalid Cost Center Code";
    }
    if (this.Record.ct_amount <= 0) {
      bret = false;
      sError += "\n\rAmount Cannot Be Blank";
    }
    this.RecordList.forEach(rec => {

      if (rec.ct_cost_code == ''  || rec.ct_cost_name == 'Invalid Cost Center Code') {
        bret = false;
        sError += "\n\rInvalid Cost Center";
      }
    });

    if (bret == false)
      this.ErrorMessage = sError;

    return bret;
  }

  OnChange(field: string, _rec: CostCentert) {
    if (field == 'ct_category') {
      _rec.ct_cost_id = '';
      _rec.ct_cost_code = '';
      _rec.ct_cost_name = '';
    }
  }

  OnBlur(field: string, _rec: CostCentert) {
    if (field == 'ct_cost_code') {
      this.SearchRecord('ct_cost_code', _rec);
      return;
    }
    if (field == 'ct_amount') 
    {
      _rec.ct_amount = this.gs.roundNumber( _rec.ct_amount, 2);
      this.findtotal();
      return;
    }
  }

  SearchRecord(controlname: string, _rec: CostCentert) {

    this.loading = true;

    let SearchData = {
      table: 'costcenterm',
      type: '',
      comp_code: '',
      branch_code: '',
      year: 0,
      searchstring: ''
    };

    if (controlname == 'ct_cost_code') {
      SearchData.table = 'costcenterm';
      SearchData.type = _rec.ct_category;
      SearchData.comp_code = this.gs.globalVariables.comp_code;
      SearchData.branch_code = this.gs.globalVariables.branch_code;
      SearchData.searchstring = _rec.ct_cost_code;
      SearchData.year = _rec.ct_year;
    }
    this.ErrorMessage = '';
    this.gs.SearchRecord(SearchData)
      .subscribe(response => {
        this.loading = false;
        this.Record.ct_cost_id = '';
        this.Record.ct_cost_name = '';
        this.ErrorMessage = '';
        if (response.costcenterm.length > 0) {
          _rec.ct_cost_id = response.costcenterm[0].cc_pkid;
          _rec.ct_cost_name = response.costcenterm[0].cc_name;
          _rec.ct_cost_year = +this.gs.globalVariables.year_code;
          if ( response.costcenterm[0].cc_year > 0)
            _rec.ct_cost_year = response.costcenterm[0].cc_year;
        }
        else {
          _rec.ct_cost_name = 'Invalid Cost Center Code';
        }
      },
      error => {
        this.loading = false;
        this.ErrorMessage = this.gs.getError(error);
      });
  }

  findtotal() {
    this.Total_Amount = 0;
    this.RecordList.forEach(rec => {
      this.Total_Amount += rec.ct_amount;
    });
    this.Total_Amount = this.gs.roundNumber(this.Total_Amount, 2);
  }

  RemoveRow(_rec: CostCentert) {
    this.RecordList.splice(this.RecordList.findIndex(rec => rec.ct_pkid == _rec.ct_pkid), 1);
    this.findtotal();
  }

  Close() {
    this.gs.ClosePage('home');
  }

  PasteData( content : any ) {
    this.bShowClipBoard = true;
    this.modal = this.modalService.open(content, { backdrop: 'static', keyboard: true });
  }

  ClipBoardClosed(cbdata: SearchTable[]) {

    if (cbdata != null) {

      cbdata.forEach(rec => {

        this.pkid = this.gs.getGuid();
        this.Record = new CostCentert();
        this.Record.ct_pkid = this.pkid;
        this.Record.ct_jv_id = this.parentid;
        this.Record.ct_category = rec.type ;
        this.Record.ct_year = +this.gs.globalVariables.year_code;
        this.Record.ct_cost_year = +this.gs.globalVariables.year_code;
        this.Record.ct_cost_id = rec.id;
        this.Record.ct_cost_code = rec.code;
        this.Record.ct_cost_name = rec.name;
        this.Record.ct_amount = rec.rate;
        this.RecordList.push(this.Record);

      });

      this.findtotal();
    }
    this.bShowClipBoard = false;
    this.closeModal();
  }

  closeModal() {
    this.modal.close();
 
  }


}
