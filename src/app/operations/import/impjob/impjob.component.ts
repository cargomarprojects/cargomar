import { Component, Input, Output, OnInit, OnDestroy, EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GlobalService } from '../../../core/services/global.service';
import { ImpJobm } from '../../models/impjob';
import { ImpJobService } from '../../services/impjob.service';
import { SearchTable } from '../../../shared/models/searchtable';

@Component({
  selector: 'app-impjob',
  templateUrl: './impjob.component.html',
  providers: [ImpJobService]
})
export class ImpJobComponent {
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


  // Array For Displaying List
  RecordList: ImpJobm[] = [];
  // Single Record for add/edit/view details
  Record: ImpJobm = new ImpJobm;

  EXPRECORD: SearchTable = new SearchTable();
  EXPADDRRECORD: SearchTable = new SearchTable();

  constructor(
    private mainService: ImpJobService,
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


  }

  LovSelected(_Record: SearchTable) {


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

  }
  List(_type: string) {

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
    this.Record = new ImpJobm();
    this.Record.impj_pkid = this.pkid;
    this.Record.impj_parent_id = this.parentid;
    this.Record.rec_mode = this.mode;
    this.Record.impj_be_type = 'N/A';
    this.Record.impj_docs_required = '';
    this.Record.impj_edichklst_sent_on = '';
    this.Record.impj_status = 'N/A';
    this.Record.impj_status_date = '';
    this.Record.impj_cleared_on = '';
    this.Record.impj_doc_recvd_date = '';
    this.Record.impj_doc_send_date = '';
    this.Record.impj_waybill_no = '';
    this.Record.impj_waybill_date = '';
    this.Record.impj_edi_no = 0;
    this.Record.impj_sbno = '';
    this.Record.impj_sbdate = '';
    this.Record.impj_remarks = '';

    this.InitLov();

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

  LoadData(_Record: ImpJobm) {
    this.Record = _Record;
    this.InitLov();

    this.Record.rec_mode = this.mode;
  }
  // Save Data
  Save() {
    this.Record.rec_category = this.type;
    this.Record.impj_parent_id = this.parentid;
    this.Record._globalvariables = this.gs.globalVariables;

    if (!this.allvalid())
      return;
    this.loading = true;
    this.ErrorMessage = '';
    this.InfoMessage = '';
    this.mainService.Save(this.Record)
      .subscribe(response => {
        this.loading = false;
        this.InfoMessage = "Save Complete";
        this.mode = 'EDIT';
        this.Record.rec_mode = this.mode;
        alert(this.InfoMessage);
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


    if (this.Record.impj_parent_id.toString().trim().length <= 0) {
      bret = false;
      sError += "\n\r Parent ID Cannot Be Blank";
    }

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
        this.RecordList.splice(this.RecordList.findIndex(rec => rec.impj_parent_id == this.pkid), 1);
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
      case 'impj_docs_required':
        {
          this.Record.impj_docs_required = this.Record.impj_docs_required.toUpperCase();
          break;
        }
      case 'impj_status':
        {
          this.Record.impj_status = this.Record.impj_status.toUpperCase();
          break;
        }
      case 'impj_waybill_no':
        {
          this.Record.impj_waybill_no = this.Record.impj_waybill_no.toUpperCase();
          break;
        }
      case 'impj_sbno':
        {
          this.Record.impj_sbno = this.Record.impj_sbno.toUpperCase();
          break;
        }
      case 'impj_remarks':
        {
          this.Record.impj_remarks = this.Record.impj_remarks.toUpperCase();
          break;
        }
    }
  }
}
