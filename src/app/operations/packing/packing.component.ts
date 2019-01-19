import { Component, Input, Output, OnInit, OnDestroy, EventEmitter, ViewChild } from '@angular/core';

import { ActivatedRoute } from '@angular/router';

import { GlobalService } from '../../core/services/global.service';

import { Packingm } from '../models/packing';

import { PackingService } from '../services/packing.service';

import { SearchTable } from '../../shared/models/searchtable';
import { Joborderm } from '../../clearing/models/joborder';

@Component({
    selector: 'app-packing',
    templateUrl: './packing.component.html',
    providers: [PackingService]
})
export class PackingComponent {
    // Local Variables 
    title = '';

    @ViewChild('pack_job_no') pack_job_no: any;

    @Input() menuid: string = '';
    @Input() type: string = '';
    @Input() parentid: string = '';

    Total_Amount : number  = 0;
    
    loading = false;
    currentTab = 'LIST';
    
    ErrorMessage = "";
    InfoMessage = "";
    mode = 'ADD';
    pkid = '';

    ctr: number;
   // jobdisabled = false;

    // Array For Displaying List
     RecordList: Packingm[] = [];
    // Single Record for add/edit/view details
     Record: Packingm = new Packingm;

     PKGUNITRECORD: SearchTable = new SearchTable();
     NETUNITRECORD: SearchTable = new SearchTable();
     GRUNITRECORD: SearchTable = new SearchTable();

    constructor(
        private mainService: PackingService,
        private route: ActivatedRoute,
        private gs: GlobalService
    ) {
      
    }

    // Init Will be called After executing Constructor
    ngOnInit() {
      this.InitLov();
      this.ActionHandler("ADD", null);
      this.List("NEW");
    }

    // Destroy Will be called when this component is closed
    ngOnDestroy() {
     
    }

    InitLov() {

      this.PKGUNITRECORD = new SearchTable();
      this.PKGUNITRECORD.controlname = "PKG-UNIT";
      this.PKGUNITRECORD.displaycolumn = "CODE";
      this.PKGUNITRECORD.type = "UNIT";
      this.PKGUNITRECORD.id = "";
      this.PKGUNITRECORD.code = "";
      this.PKGUNITRECORD.name = "";

      this.NETUNITRECORD = new SearchTable();
      this.NETUNITRECORD.controlname = "NET-UNIT";
      this.NETUNITRECORD.displaycolumn = "CODE";
      this.NETUNITRECORD.type = "UNIT";
      this.NETUNITRECORD.id = "";
      this.NETUNITRECORD.code = "";
      this.NETUNITRECORD.name = "";

      this.GRUNITRECORD = new SearchTable();
      this.GRUNITRECORD.controlname = "GR-UNIT";
      this.GRUNITRECORD.displaycolumn = "CODE";
      this.GRUNITRECORD.type = "UNIT";
      this.GRUNITRECORD.id = "";
      this.GRUNITRECORD.code = "";
      this.GRUNITRECORD.name = "";
    }

    LovSelected(_Record: SearchTable) {

      if (_Record.controlname == "PKG-UNIT") {
        this.Record.pack_pkg_unit_id = _Record.id;
        this.Record.pack_pkg_unit_code = _Record.code;
      }
      else if (_Record.controlname == "NET-UNIT") {
        this.Record.pack_ntwt_unit_id = _Record.id;
        this.Record.pack_ntwt_unit_code = _Record.code;
      }
      else if (_Record.controlname == "GR-UNIT") {
        this.Record.pack_grwt_unit_id = _Record.id;
        this.Record.pack_grwt_unit_code = _Record.code;
      }
    }


    //function for handling LIST/NEW/EDIT Buttons
    ActionHandler(action: string, id: string  ) {
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
        });
    }

    NewRecord() {

      this.pkid = this.gs.getGuid();
      this.Record = new Packingm();
      this.Record.pack_pkid = this.pkid;
      this.Record.pack_job_no = '';
      this.Record.pack_pkg = 0;
      this.Record.pack_pcs = 0;
      this.Record.pack_ntwt = 0;
      this.Record.pack_grwt = 0;
      this.Record.pack_cbm = 0;
      this.Record.pack_chwt = 0;
      this.Record.pack_pkg_unit_id = this.gs.defaultValues.param_unit_pcs_id;
      this.Record.pack_pkg_unit_code = this.gs.defaultValues.param_unit_pcs_code;
      this.Record.pack_ntwt_unit_id = this.gs.defaultValues.param_unit_kgs_id;
      this.Record.pack_ntwt_unit_code = this.gs.defaultValues.param_unit_kgs_code;
      this.Record.pack_grwt_unit_id = this.gs.defaultValues.param_unit_kgs_id;
      this.Record.pack_grwt_unit_code = this.gs.defaultValues.param_unit_kgs_code;
      this.Record.OrdList = new Array<Joborderm>();

      this.Record.rec_mode = this.mode;

      this.InitLov();

      this.PKGUNITRECORD.id = this.Record.pack_pkg_unit_id;
      this.PKGUNITRECORD.code = this.Record.pack_pkg_unit_code;
      this.NETUNITRECORD.id = this.Record.pack_ntwt_unit_id;
      this.NETUNITRECORD.code = this.Record.pack_ntwt_unit_code;
      this.GRUNITRECORD.id = this.Record.pack_grwt_unit_id;
      this.GRUNITRECORD.code = this.Record.pack_grwt_unit_code;

      this.pack_job_no.nativeElement.focus();
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
        });
    }

    LoadData(_Record: Packingm) {
      this.Record = _Record;
      this.InitLov();

      this.PKGUNITRECORD.id = this.Record.pack_pkg_unit_id;
      this.PKGUNITRECORD.code = this.Record.pack_pkg_unit_code;
      this.NETUNITRECORD.id = this.Record.pack_ntwt_unit_id;
      this.NETUNITRECORD.code = this.Record.pack_ntwt_unit_code;
      this.GRUNITRECORD.id = this.Record.pack_grwt_unit_id;
      this.GRUNITRECORD.code = this.Record.pack_grwt_unit_code;

      this.Record.rec_mode = this.mode;
      this.pack_job_no.nativeElement.focus();
    }
    // Save Data
    Save() {
      if (!this.allvalid())
        return;
      this.loading = true;
      this.ErrorMessage = '';
      this.InfoMessage = '';
      this.Record.pack_cntr_id = this.parentid;
      this.Record._globalvariables = this.gs.globalVariables;
      this.mainService.Save(this.Record)
        .subscribe(response => {
          this.loading = false;
          this.InfoMessage = "Save Complete";
          this.RefreshList();
          if (this.mode == "ADD")
            this.ActionHandler('ADD', null);
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
      if (this.Record.pack_job_no.trim().length <= 0) {
        bret = false;
        sError = "Job# Cannot Be Blank";
      }
      if ( this.Record.pack_pkg.toString().trim().length <= 0) {
        bret = false;
        sError += "\n\r Total Pkgs Cannot Be Blank";
      }
      if (this.Record.pack_pkg_unit_id.trim().length <= 0) {
        bret = false;
        sError += "\n\r Total Pkgs Unit Cannot Be Blank";
      }
      if (this.Record.pack_ntwt_unit_id.trim().length <= 0) {
        bret = false;
        sError += "\n\r Nt.Wt Unit Cannot Be Blank";
      }
      if (this.Record.pack_grwt_unit_id.trim().length <= 0) {
        bret = false;
        sError += "\n\r Gr.Wt Unit Cannot Be Blank";
      }

      if (bret === false)
        this.ErrorMessage = sError;
      return bret;
    }

    RefreshList() {

      if (this.RecordList == null)
        return;
      var REC = this.RecordList.find(rec => rec.pack_pkid == this.Record.pack_pkid);
      if (REC == null) {
        this.RecordList.push(this.Record);
      }
      else {
        REC.pack_pkg = this.Record.pack_pkg;
        REC.pack_pcs = this.Record.pack_pcs;
        REC.pack_ntwt = this.Record.pack_ntwt;
        REC.pack_grwt = this.Record.pack_grwt;
        REC.pack_cbm = this.Record.pack_cbm;
        REC.pack_chwt = this.Record.pack_chwt;
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
          this.RecordList.splice(this.RecordList.findIndex(rec => rec.pack_pkid == this.pkid), 1);
          this.ActionHandler('ADD', null);
        },
        error => {
          this.loading = false;
          this.ErrorMessage = this.gs.getError(error);
        });
    }


    Close() {
      this.gs.ClosePage('home');
    }

    OnBlur(field: string) {
      switch (field) {
        case 'pack_pkg':
          {
            this.Record.pack_pkg = this.gs.roundNumber(this.Record.pack_pkg, 0);
            break;
          }
        case 'pack_pcs':
          {
            this.Record.pack_pcs = this.gs.roundNumber(this.Record.pack_pcs, 3);
            break;
          }
        case 'pack_cbm':
          {
            this.Record.pack_cbm = this.gs.roundNumber(this.Record.pack_cbm, 3);
            break;
          }
        case 'pack_ntwt':
          {
            this.Record.pack_ntwt = this.gs.roundNumber(this.Record.pack_ntwt, 3);
            break;
          }
        case 'pack_grwt':
          {
            this.Record.pack_grwt = this.gs.roundNumber(this.Record.pack_grwt, 3);
            break;
          }
        case 'pack_chwt':
          {
            this.Record.pack_chwt = this.gs.roundNumber(this.Record.pack_chwt, 3);
            break;
          }
        case 'pack_job_no':
          {
            this.SearchRecord('pack_job_no');
            break;
          }
      }
    }

    SearchRecord(controlname: string) {
      if (this.Record.pack_job_no.trim().length <= 0)
        return;

      this.loading = true;
      let SearchData = {
        table: 'jobm',
        rowtype: this.type,
        company_code: this.gs.globalVariables.comp_code,
        branch_code: this.gs.globalVariables.branch_code,
        year_code: this.gs.globalVariables.year_code,
        job_docno: ''
      };
      if (controlname == 'pack_job_no') {
        SearchData.table = 'jobm';
        SearchData.company_code = this.gs.globalVariables.comp_code;
        SearchData.branch_code = this.gs.globalVariables.branch_code;
        SearchData.year_code = this.gs.globalVariables.year_code;
        SearchData.job_docno = this.Record.pack_job_no;
      }
      this.ErrorMessage = '';
      this.gs.SearchRecord(SearchData)
        .subscribe(response => {
          this.loading = false;
          this.Record.pack_job_id = '';
          this.ErrorMessage = '';
          if (response.jobm.length > 0) {

            this.Record.pack_job_id = response.jobm[0].job_pkid;
            this.Record.pack_pkg = response.jobm[0].job_pkg;
            this.Record.pack_pkg_unit_id = response.jobm[0].job_pkg_unit_id;
            this.Record.pack_pkg_unit_code = response.jobm[0].job_pkg_unit_code;
            this.Record.pack_pcs = response.jobm[0].job_pcs;
            this.Record.pack_ntwt = response.jobm[0].job_ntwt;
            this.Record.pack_ntwt_unit_id = response.jobm[0].job_ntwt_unit_id;
            this.Record.pack_ntwt_unit_code = response.jobm[0].job_ntwt_unit_code;
            this.Record.pack_grwt = response.jobm[0].job_grwt;
            this.Record.pack_grwt_unit_id = response.jobm[0].job_grwt_unit_id;
            this.Record.pack_grwt_unit_code = response.jobm[0].job_grwt_unit_code;
            this.Record.pack_cbm = response.jobm[0].job_cbm;
            this.Record.pack_chwt = response.jobm[0].job_chwt;
            this.Record.OrdList = response.ordlist;

            this.InitLov();
            this.PKGUNITRECORD.id = this.Record.pack_pkg_unit_id;
            this.PKGUNITRECORD.code = this.Record.pack_pkg_unit_code;
            this.NETUNITRECORD.id = this.Record.pack_ntwt_unit_id;
            this.NETUNITRECORD.code = this.Record.pack_ntwt_unit_code;
            this.GRUNITRECORD.id = this.Record.pack_grwt_unit_id;
            this.GRUNITRECORD.code = this.Record.pack_grwt_unit_code;
          }
          else {
            this.ErrorMessage = 'Invalid Job#';
          }
        },
        error => {
          this.loading = false;
          this.ErrorMessage = this.gs.getError(error);
        });
    }

}
