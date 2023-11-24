
import { Component, Input, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';

import { ActivatedRoute } from '@angular/router';

import { GlobalService } from '../../../core/services/global.service';

import { Posting } from '../../models/posting';

import { PostingService } from '../../services/posting.service';

import { SearchTable } from '../../../shared/models/searchtable';

@Component({
  selector: 'app-posting',
  templateUrl: './posting.component.html',
  providers: [PostingService]
})
export class PostingComponent {
  // Local Variables 
  title = 'Posting';


  @Input() pkid: string = '';
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

  einvstatus = '';

  sub: any;
  urlid: string;

  LockErrorMessage = "";
  ErrorMessage = "";

  mode = '';



  AcGrpList: any[] = [];
  AcTypeList: any[] = [];

  // Array For Displaying List

  // Single Record for add/edit/view details
  Record: Posting = new Posting;



  HORECORD: SearchTable = new SearchTable();
  BRRECORD: SearchTable = new SearchTable();

  AGENTRECORD: SearchTable = new SearchTable();
  FRTRECORD: SearchTable = new SearchTable();

  constructor(
    private mainService: PostingService,
    private route: ActivatedRoute,
    private gs: GlobalService
  ) {

    this.page_count = 0;
    this.page_rows = 15;
    this.page_current = 0;


  }

  // Init Will be called After executing Constructor
  ngOnInit() {
    this.InitComponent();
  }

  InitComponent() {

    this.menu_record = this.gs.getMenu(this.menuid);
    if (this.menu_record)
      this.title = this.menu_record.menu_name;

    this.LoadCombo();

    this.InitLov();

    this.GetRecord(this.pkid);


  }

  // Destroy Will be called when this component is closed
  ngOnDestroy() {

  }

  LoadCombo() {
  }

  InitLov() {

    this.FRTRECORD = new SearchTable();
    this.FRTRECORD.controlname = "FRT";
    this.FRTRECORD.displaycolumn = "CODE";
    this.FRTRECORD.type = "ACCTM";
    this.FRTRECORD.id = "";
    this.FRTRECORD.code = "";
    this.FRTRECORD.name = "";

    this.BRRECORD = new SearchTable();
    this.BRRECORD.controlname = "BRANCH";
    this.BRRECORD.displaycolumn = "CODE";
    this.BRRECORD.type = "ACCTM";
    this.BRRECORD.id = "";
    this.BRRECORD.code = "";
    this.BRRECORD.name = "";

    this.HORECORD = new SearchTable();
    this.HORECORD.controlname = "HO";
    this.HORECORD.displaycolumn = "CODE";
    this.HORECORD.type = "ACCTM";
    this.HORECORD.id = "";
    this.HORECORD.code = "";
    this.HORECORD.name = "";

    this.AGENTRECORD = new SearchTable();
    this.AGENTRECORD.controlname = "AGENT";
    this.AGENTRECORD.displaycolumn = "CODE";
    this.AGENTRECORD.type = "ACCTM";
    this.AGENTRECORD.id = "";
    this.AGENTRECORD.code = "";
    this.AGENTRECORD.name = "";



  }



  LovSelected(_Record: SearchTable) {
    if (_Record.controlname == "HO") {
      this.Record.jv_ho_id = _Record.id;
      this.Record.jv_ho_code = _Record.code;
      this.Record.jv_ho_name = _Record.name;
    }
    if (_Record.controlname == "BRANCH") {
      this.Record.jv_br_id = _Record.id;
      this.Record.jv_br_code = _Record.code;
      this.Record.jv_br_name = _Record.name;
    }
    if (_Record.controlname == "AGENT") {
      this.Record.jv_agent_id = _Record.id;
      this.Record.jv_agent_code = _Record.code;
      this.Record.jv_agent_name = _Record.name;
    }

    if (_Record.controlname == "FRT") {
      this.Record.jv_frt_id = _Record.id;
      this.Record.jv_frt_code = _Record.code;
      this.Record.jv_frt_name = _Record.name;
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


  NewRecord() {

    this.pkid = this.gs.getGuid();

    this.Record = new Posting();
    this.Record.jv_posted = "N";
    this.Record.rec_mode = this.mode;
    this.InitLov();

  }

  // Load a single Record for VIEW/EDIT
  GetRecord(Id: string) {
    this.loading = true;

    this.einvstatus = '';

    let SearchData = {
      pkid: Id,
    };

    this.LockErrorMessage = "";
    this.ErrorMessage = '';
    this.mainService.GetRecord(SearchData)
      .subscribe(response => {
        this.loading = false;
        this.LockErrorMessage = response.lockedmsg;
        this.LoadData(response.record);
      },
        error => {
          this.loading = false;
          this.ErrorMessage = this.gs.getError(error);
          alert(this.ErrorMessage);
        });
  }

  LoadData(_Record: Posting) {
    this.Record = _Record;

    if (this.Record.jvh_einv_status == 'G')
      this.einvstatus = 'EINVOICE STATUS : GENERATED';
    if (this.Record.jvh_einv_status == 'B')
      this.einvstatus = 'EINVOICE STATUS : B2B';

    this.InitLov();

    this.FRTRECORD.id = this.Record.jv_frt_id;
    this.FRTRECORD.code = this.Record.jv_frt_code;
    this.FRTRECORD.name = this.Record.jv_frt_name;

    this.HORECORD.id = this.Record.jv_ho_id;
    this.HORECORD.code = this.Record.jv_ho_code;
    this.HORECORD.name = this.Record.jv_ho_name;

    this.BRRECORD.id = this.Record.jv_br_id;
    this.BRRECORD.code = this.Record.jv_br_code;
    this.BRRECORD.name = this.Record.jv_br_name;

    this.AGENTRECORD.id = this.Record.jv_agent_id;
    this.AGENTRECORD.code = this.Record.jv_agent_code;
    this.AGENTRECORD.name = this.Record.jv_agent_name;

    this.Record.rec_mode = this.mode;

  }


  IsBackDateEntry() {

    let eSearchData = {
      company_code: '',
      branch_code: '',
      year_code: '',
      jv_date: ''
    };

    eSearchData.company_code = this.gs.globalVariables.comp_code;
    eSearchData.branch_code = this.gs.globalVariables.branch_code;
    eSearchData.year_code = this.gs.globalVariables.year_code;
    eSearchData.jv_date = this.Record.jv_date;

    this.loading = true;
    this.ErrorMessage = '';
    this.mainService.IsBackDateEntry(eSearchData)
      .subscribe(response => {
        this.loading = false;
        if (response.retvalue) {
          this.ErrorMessage = response.retstring;
          if (confirm(this.ErrorMessage)) {
            this.Save();
          }
        } else {
          this.Save();
        }
      },
        error => {
          this.loading = false;
          this.ErrorMessage = this.gs.getError(error);
          alert(this.ErrorMessage);
        });
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
        alert(this.ErrorMessage);
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


    if (this.Record.jv_posted == "Y") {
      bret = false;
      sError += "| Cannot Save, It is Posted / Allocated ";
    }

    if (this.Record.jvh_einv_status == "G") {
      bret = false;
      sError += "| Cannot Save, Einvoice Already Generated ";
    }

    if (this.LockErrorMessage.length > 0) {
      sError += "| Cannot Save, " + this.LockErrorMessage;
    }

    if (this.Record.jv_ho_id.trim().length <= 0) {
      bret = false;
      sError += "| HO Code Need To Be Selected";
    }
    if (this.Record.jv_br_id.trim().length <= 0) {
      bret = false;
      sError += "| Branch Code Need To Be Selected";
    }
    if (this.Record.jv_frt_id.trim().length <= 0) {
      bret = false;
      sError += "| Fright Code Need To Be Selected";
    }
    if (this.Record.jv_agent_id.trim().length <= 0) {
      bret = false;
      sError += "| Fright Code Need To Be Selected";
    }
    if (bret === false) {
      this.ErrorMessage = sError;
      alert(this.ErrorMessage);
    }
    return bret;
  }

  onLostFocus(controlname: string) {
    if (controlname == 'tax_acc_code') {
    }
  }


}
