
import { Component, Input, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';

import { ActivatedRoute } from '@angular/router';

import { GlobalService } from '../../core/services/global.service';

import { CostCenterm } from '../models/costcenterm';

import { CostCenterService } from '../services/costcenter.service';

import { SearchTable } from '../../shared/models/searchtable';


@Component({
  selector: 'app-costcenter',
  templateUrl: './costcenter.component.html',
    providers: [CostCenterService]
})
export class CostCenterComponent {
    // Local Variables 
    title = 'Cost Center Master';


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

    sub: any;
    urlid: string;
   

    ErrorMessage = "";

    mode = '';
    pkid = '';


    

    // Array For Displaying List
    RecordList: CostCenterm[] = [];
    // Single Record for add/edit/view details
    Record: CostCenterm = new CostCenterm;

   // COMPRECORD: SearchTable = new SearchTable();

    constructor(
      private mainService: CostCenterService,
        private route: ActivatedRoute,
        private gs: GlobalService
    ) {

        this.InitLov();

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

        this.LoadCombo();
        this.List("NEW");

    }

    // Destroy Will be called when this component is closed
    ngOnDestroy() {
        this.sub.unsubscribe();
    }

    LoadCombo() {
       
    }

    InitLov() {

        //this.COMPRECORD = new SearchTable();
        //this.COMPRECORD.controlname = "BRANCH";
        //this.COMPRECORD.displaycolumn = "CODE";
        //this.COMPRECORD.type = "BRANCH";
        //this.COMPRECORD.id = "";
        //this.COMPRECORD.code = "";
    }

    LovSelected(_Record: SearchTable) {

      //if (_Record.controlname == "BRANCH") {
      //  this.Record.rec_branch_code = _Record.code;
      //}
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
            page_count: this.page_count,
            page_current: this.page_current,
            page_rows: this.page_rows,
            page_rowcount: this.page_rowcount,
            comp_code: this.gs.globalVariables.comp_code,
            branch_code: this.gs.globalVariables.branch_code,
            cc_type: this.type
        };

        this.ErrorMessage = '';
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

        this.pkid = this.gs.getGuid();

        this.Record = new CostCenterm();
        this.Record.cc_pkid = this.pkid;
        this.Record.cc_code = '';
        this.Record.cc_name = '';
        this.Record.rec_branch_code = '';
        this.Record.rec_mode = this.mode;

        this.InitLov();
    }

    // Load a single Record for VIEW/EDIT
    GetRecord(Id: string) {
        this.loading = true;

        let SearchData = {
            pkid: Id,
        };

        this.ErrorMessage = '';
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

    LoadData(_Record: CostCenterm) {
      this.Record = _Record;
    
        this.InitLov();

        this.Record.rec_mode = this.mode;
    }


    // Save Data
    Save() {
        if (!this.allvalid())
            return;
        this.loading = true;
        this.ErrorMessage = '';
        this.Record._globalvariables = this.gs.globalVariables;
        this.Record.cc_type = this.type;
        this.mainService.Save(this.Record)
            .subscribe(response => {
                this.loading = false;
                this.ErrorMessage = "Save Complete";
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
        if (this.Record.cc_code.trim().length <= 0) {
            bret = false;
            sError = "Code Cannot Be Blank";
        }
        if (this.Record.cc_name.trim().length <= 0) {
            bret = false;
            sError += "\n\rName Cannot Be Blank";
        }
        
        if (bret === false)
            this.ErrorMessage = sError;
        return bret;
    }

    RefreshList() {

        if (this.RecordList == null)
            return;
        var REC = this.RecordList.find(rec => rec.cc_pkid == this.Record.cc_pkid);
        if (REC == null) {
            this.RecordList.push(this.Record);
        }
        else {
            REC.cc_code = this.Record.cc_code;
            REC.cc_name = this.Record.cc_name;
            REC.cc_type = this.type;
        }
    }

    Close() {
        this.gs.ClosePage('home');
    }

    OnBlur(field: string) {
      switch (field) {
        case 'cc_code':
          {
            this.Record.cc_code = this.Record.cc_code.toUpperCase();
            break;
          }
        case 'cc_name':
          {
            this.Record.cc_name = this.Record.cc_name.toUpperCase();
            break;
          }
      }
    }
}
