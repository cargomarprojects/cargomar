import { Component, Input, OnInit, OnDestroy } from '@angular/core';

import { ActivatedRoute } from '@angular/router';

import { GlobalService } from '../../core/services/global.service';

import { Acgroupm } from '../models/acgroupm';


import { AcgroupmService } from '../services/acgroupm.service';
import { SearchTable } from '../../shared/models/searchtable';


@Component({
    selector: 'app-acgroup',
    templateUrl: './acgroupm.component.html',
    providers: [AcgroupmService]
})
export class AcgroupmComponent {
    /*
    Ajith 30/05/2019 user rights enabled
    */
    // Local Variables 
    title = 'A/c Group MASTER';

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
    BSHEADRECORD: SearchTable = new SearchTable();

    AcGrpList: Acgroupm[] = [];

    // Array For Displaying List
    RecordList: Acgroupm[] = [];
    // Single Record for add/edit/view details
    Record: Acgroupm = new Acgroupm;

    constructor(
        private mainService: AcgroupmService,
        private route: ActivatedRoute,
        private gs: GlobalService
    ) {
        this.page_count = 0;
        this.page_rows = 10;
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
        this.InitLov();
    }

    // Destroy Will be called when this component is closed
    ngOnDestroy() {
        this.sub.unsubscribe();
    }

    LoadCombo() {

        this.loading = true;
        let SearchData = {
            type: 'type',
            comp_code: this.gs.globalVariables.comp_code,
            branch_code: this.gs.globalVariables.branch_code,
        };

        this.ErrorMessage = '';
        this.mainService.LoadDefault(SearchData)
            .subscribe(response => {
                this.loading = false;
                this.AcGrpList = response.list;
                this.List("NEW");
            },
                error => {
                    this.loading = false;
                    this.ErrorMessage = this.gs.getError(error);
                });
    }

    InitLov() {

        this.BSHEADRECORD = new SearchTable();
        this.BSHEADRECORD.controlname = "BSHEAD";
        this.BSHEADRECORD.displaycolumn = "NAME";
        this.BSHEADRECORD.type = "BSHEAD";
        this.BSHEADRECORD.id = "";
        this.BSHEADRECORD.code = "";
        this.BSHEADRECORD.name = "";
        this.BSHEADRECORD.parentid = "";
    }
    LovSelected(_Record: SearchTable) {
        if (_Record.controlname == "BSHEAD") {
            this.Record.acgrp_bs_id = _Record.id;
            this.Record.acgrp_bs_code = _Record.code;
            this.Record.acgrp_bs_name = _Record.name;
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
            comp_code: this.gs.globalVariables.comp_code,
            page_count: this.page_count,
            page_current: this.page_current,
            page_rows: this.page_rows,
            page_rowcount: this.page_rowcount
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

        this.Record = new Acgroupm();
        this.Record.acgrp_pkid = this.pkid;
        this.Record.acgrp_name = '';
        this.Record.acgrp_parent_id = '';
        this.Record.acgrp_parent_name = '';

        this.Record.acgrp_level = 2;

        this.Record.acgrp_drcr = 'DR';
        this.Record.acgrp_fixedasset_code = '';
        this.Record.acgrp_order = 0;
        this.Record.acgrp_bs_id = '';
        this.Record.acgrp_bs_code = '';
        this.Record.acgrp_bs_name = '';
        this.Record.acgrp_acc_update = false;
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

    LoadData(_Record: Acgroupm) {
        this.Record = _Record;
        this.Record.acgrp_acc_update = false;
        this.Record.rec_mode = this.mode;
        this.InitLov();
        this.BSHEADRECORD.id = this.Record.acgrp_bs_id;
        this.BSHEADRECORD.code = this.Record.acgrp_bs_code;
        this.BSHEADRECORD.name = this.Record.acgrp_bs_name;
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
                this.RefreshList();
            },
                error => {
                    this.ErrorMessage = this.gs.getError(error);
                    this.loading = false;
                });
    }

    allvalid() {
        let sError: string = "";
        let bret: boolean = true;
        this.ErrorMessage = '';

        if (this.Record.acgrp_name.trim().length <= 0) {
            bret = false;
            sError += "\n\rName Cannot Be Blank";
        }

        if (this.Record.acgrp_parent_id.trim().length <= 0) {
            bret = false;
            sError += "\n\rGroup Name Cannot Be Blank";
        }

        if (this.Record.acgrp_drcr.trim().length <= 0) {
            bret = false;
            sError += "\n\rDr/Cr Need To Be Selected";
        }


        if (bret) {
            this.Record.acgrp_name = this.Record.acgrp_name.toUpperCase().trim();
        }

        if (bret === false)
            this.ErrorMessage = sError;
        return bret;
    }

    RefreshList() {

        if (this.RecordList == null)
            return;
        var REC = this.RecordList.find(rec => rec.acgrp_pkid == this.Record.acgrp_pkid);
        if (REC == null) {
            this.Record.acgrp_parent_name = this.AcGrpList.find(row => row.acgrp_pkid == this.Record.acgrp_parent_id).acgrp_name;
            this.RecordList.push(this.Record);
        }
        else {
            REC.acgrp_name = this.Record.acgrp_name;
            REC.acgrp_order = this.Record.acgrp_order;
            REC.acgrp_drcr = this.Record.acgrp_drcr;
            REC.acgrp_fixedasset_code = this.Record.acgrp_fixedasset_code;
            REC.acgrp_parent_name = this.AcGrpList.find(row => row.acgrp_pkid == this.Record.acgrp_parent_id).acgrp_name;
        }
    }

    Close() {
        this.gs.ClosePage('home');
    }


}
