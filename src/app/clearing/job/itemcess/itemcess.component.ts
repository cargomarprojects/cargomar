import { Component, Input, Output, OnInit, OnDestroy, EventEmitter, ViewChild, ElementRef, OnChanges, SimpleChange } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GlobalService } from '../../../core/services/global.service';
import { ItemCess } from '../../models/itemcess';

import { ItemCessService } from '../../services/itemcess.service';
import { SearchTable } from '../../../shared/models/searchtable';

@Component({
  selector: 'app-itemcess',
  templateUrl: './itemcess.component.html',
  providers: [ItemCessService]
})
export class ItemCessComponent {
  // Local Variables 
  title = 'Item Cess';

  @ViewChild('_cess_srno') private cess_srno_ctrl: ElementRef;
  @ViewChild('_cess_rate') private cess_rate_ctrl: ElementRef;

  @Input() menuid: string = '';
  @Input() type: string = '';
  @Input() parentid: string = '';
  @Input() jobid: string = '';

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
  RecordList: ItemCess[] = [];
  // Single Record for add/edit/view details
  Record: ItemCess = new ItemCess;

  LICUNITRECORD: SearchTable = new SearchTable();

  constructor(
    private mainService: ItemCessService,
    private route: ActivatedRoute,
    private gs: GlobalService
  ) {
    this.InitLov();
  }

  // Init Will be called After executing Constructor
  ngOnInit() {
    //this.List("NEW");
    //this.ActionHandler("ADD", null);
  }

  // Destroy Will be called when this component is closed
  ngOnDestroy() {

  }

  ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
    for (let propName in changes) {
      let changedProp = changes[propName];
      let from = changedProp.previousValue;
      if (propName == 'parentid') {
        this.List("NEW");
        this.ActionHandler("ADD", null);
      }
    }
  }

  InitLov() {
    this.LICUNITRECORD = new SearchTable();
    this.LICUNITRECORD.controlname = "LIC-UNIT";
    this.LICUNITRECORD.displaycolumn = "CODE";
    this.LICUNITRECORD.type = "UNIT";
    this.LICUNITRECORD.id = "";
    this.LICUNITRECORD.code = "";
    this.LICUNITRECORD.name = "";

  }

  LovSelected(_Record: SearchTable) {
    if (_Record.controlname == "LIC-UNIT") {
      this.Record.cess_unit_id = _Record.id;
      this.Record.cess_unit_code = _Record.code;
      this.Record.cess_unit_name = _Record.name;
      if (!this.gs.isBlank(this.cess_rate_ctrl))
        this.cess_rate_ctrl.nativeElement.focus();
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
      company_code: this.gs.globalVariables.comp_code,
      branch_code: this.gs.globalVariables.branch_code,
      year_code: this.gs.globalVariables.year_code
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
    // let reg_no: string = "";
    // let reg_date: string = "";
    // let slno_parte: string = "";
    // let exp_qty: number = 0;
    // let deec: boolean = false;
    // if (this.Record.lic_reg_no != null) {
    //   reg_no = this.Record.lic_reg_no;
    //   reg_date = this.Record.lic_reg_date;
    //   slno_parte = this.Record.lic_slno_parte;
    //   exp_qty = this.Record.lic_exp_qty;
    //   deec = this.Record.lic_deec;
    // }

    this.pkid = this.gs.getGuid();
    this.Record = new ItemCess();
    this.Record.cess_pkid = this.pkid;
    this.Record.cess_srno = 0;
    this.Record.cess_code = '';
    this.Record.cess_qty = 0;
    this.Record.cess_unit_id = '';
    this.Record.cess_unit_code = '';
    this.Record.cess_unit_name = '';
    this.Record.cess_rate = 0;
    this.Record.cess_ctr = 0;
    this.Record.cess_type = 'VALUE';
    this.Record.rec_mode = this.mode;
    this.InitLov();

    // this.LICUNITRECORD.id = this.gs.defaultValues.param_unit_pcs_id;
    // this.LICUNITRECORD.code = this.gs.defaultValues.param_unit_pcs_code;
    // this.Record.cess_unit_id = this.LICUNITRECORD.id;
    // this.Record.cess_unit_code = this.LICUNITRECORD.code;
    if (!this.gs.isBlank(this.cess_srno_ctrl))
      this.cess_srno_ctrl.nativeElement.focus();
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

  LoadData(_Record: ItemCess) {
    this.Record = _Record;
    this.InitLov();
    this.LICUNITRECORD.id = this.Record.cess_unit_id;
    this.LICUNITRECORD.code = this.Record.cess_unit_code;
    this.LICUNITRECORD.name = this.Record.cess_unit_name;

    this.Record.rec_mode = this.mode;
    if (!this.gs.isBlank(this.cess_srno_ctrl))
      this.cess_srno_ctrl.nativeElement.focus();
  }

  // Save Data
  Save() {
    if (!this.allvalid())
      return;
    this.loading = true;
    this.ErrorMessage = '';
    this.InfoMessage = '';
    this.Record.cess_itm_id = this.parentid;
    this.Record.cess_job_id = this.jobid;
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

    if (this.parentid.trim().length <= 0) {
      bret = false;
      sError += "\n\r | Item ID Cannot Be Blank";
    }

    if (this.jobid.trim().length <= 0) {
      bret = false;
      sError += "\n\r | Job ID Cannot Be Blank";
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
    var REC = this.RecordList.find(rec => rec.cess_pkid == this.Record.cess_pkid);
    if (REC == null) {
      this.RecordList.push(this.Record);
    }
    else {
      REC.cess_srno = this.Record.cess_srno;
      REC.cess_code = this.Record.cess_code;
      REC.cess_qty = this.Record.cess_qty;
      REC.cess_unit_code = this.Record.cess_unit_code;
      REC.cess_rate = this.Record.cess_rate;
      REC.cess_type = this.Record.cess_type;
    }
  }

  RemoveList(event: any) {
    if (event.selected) {
      this.ActionHandler('REMOVE', event.id)
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
        this.RecordList.splice(this.RecordList.findIndex(rec => rec.cess_pkid == this.pkid), 1);
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
    switch (field) {


      //   case 'lic_slno_parte':
      //     {
      //       this.Record.lic_slno_parte = this.Record.lic_slno_parte.toUpperCase();
      //       break;
      //     }
      case 'cess_qty':
        {
          this.Record.cess_qty = this.gs.roundWeight(this.Record.cess_qty, "PCS");
          break;
        }
      case 'cess_rate':
        {
          this.Record.cess_rate = this.gs.roundWeight(this.Record.cess_rate, "EXRATE");
          break;
        }

    }
  }

}
