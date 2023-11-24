import { Component, Input, Output, OnInit, OnDestroy, EventEmitter, ViewChild, ElementRef } from '@angular/core';

import { ActivatedRoute } from '@angular/router';

import { GlobalService } from '../../../core/services/global.service';

import { Containerm } from '../../models/container';

import { ImpContainerService } from '../../services/impcontainer.service';

import { SearchTable } from '../../../shared/models/searchtable';

@Component({
  selector: 'app-impcontainer',
  templateUrl: './impcontainer.component.html',
  providers: [ImpContainerService]
})
export class ImpContainerComponent {
  // Local Variables 
  title = 'Container List';

  @ViewChild('cntr_no') private cntr_no: ElementRef;
  @Input() menuid: string = '';
  @Input() type: string = '';
  @Input() parentid: string = '';
  @Input() cntrparenttype: string = '';
  selectedRowIndex: number = -1;

  Total_Amount: number = 0;

  loading = false;
  currentTab = 'LIST';

  bChanged: boolean;

  ErrorMessage = "";
  InfoMessage = "";
  mode = 'ADD';
  pkid = '';
  ctr: number;

  // Array For Displaying List
  RecordList: Containerm[] = [];
  // Single Record for add/edit/view details
  Record: Containerm = new Containerm;
  CNTRTYPERECORD: SearchTable = new SearchTable();
  constructor(
    private mainService: ImpContainerService,
    private route: ActivatedRoute,
    private gs: GlobalService
  ) {
    this.InitLov();
  }

  // Init Will be called After executing Constructor
  ngOnInit() {
    this.ActionHandler("ADD", null);
    this.List("NEW");
  }

  // Destroy Will be called when this component is closed
  ngOnDestroy() {

  }

  InitLov() {
    this.CNTRTYPERECORD = new SearchTable();
    this.CNTRTYPERECORD.controlname = "CNTR-TYPE";
    this.CNTRTYPERECORD.displaycolumn = "CODE";
    this.CNTRTYPERECORD.type = "CONTAINER TYPE";
    this.CNTRTYPERECORD.id = "";
    this.CNTRTYPERECORD.code = "";
    this.CNTRTYPERECORD.name = "";
  }

  LovSelected(_Record: SearchTable) {
    if (_Record.controlname == "CNTR-TYPE") {
      this.Record.cntr_type_id = _Record.id;
      this.Record.cntr_type_code = _Record.code;
      this.Record.cntr_type_name = _Record.name;
    }
  }

  //function for handling LIST/NEW/EDIT Buttons
  ActionHandler(action: string, id: string, _selectedRowIndex: number = -1) {
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
      this.selectedRowIndex = _selectedRowIndex;
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

  }

  List(_type: string) {
    this.loading = true;
    let SearchData = {
      type: _type,
      rowtype: this.type,
      parentid: this.parentid,
      parenttype: this.cntrparenttype,
      company_code: this.gs.globalVariables.comp_code,
      branch_code: this.gs.globalVariables.branch_code,
      year_code: this.gs.globalVariables.year_code,
      user_code: this.gs.globalVariables.user_code
    };

    this.ErrorMessage = '';
    this.InfoMessage = '';
    this.mainService.List(SearchData)
      .subscribe(response => {
        this.loading = false;
        this.RecordList = response.list;
      },
        error => {
          this.loading = false;
          this.ErrorMessage = this.gs.getError(error);
          alert(this.ErrorMessage);
        });
  }

  NewRecord() {

    this.pkid = this.gs.getGuid();
    this.Record = new Containerm();
    this.Record.cntr_pkid = this.pkid;
    this.Record.cntr_no = '';
    this.Record.cntr_type_id = '';
    this.Record.cntr_type_code = '';
    this.Record.cntr_type_name = '';
    this.Record.cntr_pcs = 0;
    this.Record.cntr_grwt = 0;
    this.Record.cntr_ntwt = 0;
    this.Record.cntr_cbm = 0;
    this.Record.cntr_asealno = '';

    this.Record.rec_mode = this.mode;
    this.InitLov();
    this.cntr_no.nativeElement.focus();
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
      },
        error => {
          this.loading = false;
          this.ErrorMessage = this.gs.getError(error);
          alert(this.ErrorMessage);
        });
  }

  LoadData(_Record: Containerm) {
    this.Record = _Record;
    this.InitLov();
    this.CNTRTYPERECORD.id = this.Record.cntr_type_id;
    this.CNTRTYPERECORD.code = this.Record.cntr_type_code;
    this.CNTRTYPERECORD.name = this.Record.cntr_type_name;
    this.Record.rec_mode = this.mode;
    this.cntr_no.nativeElement.focus();
  }

  // Save Data
  Save() {
    if (!this.allvalid())
      return;
    this.loading = true;
    this.ErrorMessage = '';
    this.InfoMessage = '';
    this.Record.rec_category = this.type;
    this.Record.cntr_parent_id = this.parentid;
    this.Record.cntr_parent_type = this.cntrparenttype;
    this.Record._globalvariables = this.gs.globalVariables;
    this.mainService.Save(this.Record)
      .subscribe(response => {
        this.loading = false;
        this.InfoMessage = "Save Complete";
        this.mode = 'EDIT';
        this.Record.rec_mode = this.mode;
        this.RefreshList();
        this.ActionHandler('ADD', null);
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

    if (this.Record.cntr_no.trim().length <= 0) {
      bret = false;
      sError += "\n\r | Container Cannot Be Blank";
    } else if (this.Record.cntr_no.trim().length < 12 || this.Record.cntr_no.trim().length > 13) {
      bret = false;
      sError += "\n\r Invalid Container";
    }
    if (this.Record.cntr_type_id.trim().length <= 0) {
      bret = false;
      sError += "\n\r | Container Type Cannot Be Blank";
    }

    if (bret === false) {
      this.ErrorMessage = sError;
      alert(this.ErrorMessage);
    }
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
      REC.cntr_pcs = this.Record.cntr_pcs;
      REC.cntr_grwt = this.Record.cntr_grwt;
      REC.cntr_ntwt = this.Record.cntr_ntwt;
      REC.cntr_cbm = this.Record.cntr_cbm;
      REC.cntr_asealno = this.Record.cntr_asealno;
      REC.cntr_type_code = this.Record.cntr_type_code;
    }
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
        this.RecordList.splice(this.RecordList.findIndex(rec => rec.cntr_pkid == this.pkid), 1);
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

  OnFocus(field: string) {
    this.bChanged = false;
  }

  OnChange(field: string) {
    this.bChanged = true;
  }

  OnBlur(field: string) {
    var oldChar = / /gi;//replace all blank space in a string
    switch (field) {

      case 'cntr_no':
        {
          this.Record.cntr_no = this.Record.cntr_no.replace(oldChar, '').toUpperCase().trim();
          break;
        }
      case 'cntr_asealno':
        {
          this.Record.cntr_asealno = this.Record.cntr_asealno.toUpperCase();
          break;
        }
      case 'cntr_cbm':
        {
          this.Record.cntr_cbm = this.gs.roundWeight(this.Record.cntr_cbm, "CBM");
          break;
        }
      case 'cntr_pcs':
        {
          this.Record.cntr_pcs = this.gs.roundWeight(this.Record.cntr_pcs, "PCS");
          break;
        }

      case 'cntr_grwt':
        {
          this.Record.cntr_grwt = this.gs.roundWeight(this.Record.cntr_grwt, "GRWT");
          break;
        }
      case 'cntr_ntwt':
        {
          this.Record.cntr_ntwt = this.gs.roundWeight(this.Record.cntr_ntwt, "NTWT");
          break;
        }
    }
  }

  FillContainer() {

    this.loading = true;
    let SearchData = {
      usercode: this.gs.globalVariables.user_code,
      parentid: this.parentid,
      parenttype: this.cntrparenttype
    };


    this.ErrorMessage = '';
    this.InfoMessage = '';
    this.mainService.FillImpContainer(SearchData)
      .subscribe(response => {
        this.loading = false;
        this.List("NEW");
      },
        error => {
          this.loading = false;
          this.ErrorMessage = this.gs.getError(error);
          alert(this.ErrorMessage);
        });
  }

}
