import { Component, OnInit, OnDestroy } from '@angular/core';
import { Location } from '@angular/common';

import { ActivatedRoute } from '@angular/router';

import { GlobalService } from '../../core/services/global.service';

import { Modulem } from '../models/modulem';

import { ModuleService } from '../services/module.service';

@Component({
    selector: 'app-module',
    templateUrl: './module.component.html',
    providers: [ModuleService]
})
export class ModuleComponent {
    // Local Variables 
    title = 'MODULE MASTER';
    loading = false;
    currentTab = 'LIST';
    
    searchstring = '';
    page_count = 0;
    page_current = 0;
    page_rows = 0;
    page_rowcount = 0;

    sub: any;
    urlid: string;
    type: string;

    ErrorMessage = "";
    
    mode = '';
    pkid = '';

    // Array For Displaying List
    RecordList: Modulem[] = [];
    // Single Record for add/edit/view details
    Record: Modulem = new Modulem  ;

    constructor(
        private mainService: ModuleService,
        private location: Location,
        private route: ActivatedRoute,
        private gs: GlobalService
    ) {
        this.page_count = 0;
        this.page_rows = 10;
        this.page_current = 0;

        this.List("NEW");

    }

    // Init Will be called After executing Constructor
    ngOnInit() {
    
    }
    // Destroy Will be called when this component is closed
    ngOnDestroy() {
    
    }

    //function for handling LIST/NEW/EDIT Buttons
    ActionHandler(action : string, id :string ) {
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
            this.pkid = id;
            this.GetRecord(id);
        }
    }

    // Query List Data
    List(_type: string) {

        this.loading = true;

        let SearchData = {
            type: _type,
            rowtype: this.type,
            comp_code: this.gs.globalVariables.comp_code,
            searchstring: this.searchstring.toUpperCase(),
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

        this.Record = new Modulem();
        this.Record.module_pkid = this.pkid;
        this.Record.module_name = '';
        this.Record.rec_mode = this.mode;
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

    LoadData(_Record: Modulem) {
        this.Record = _Record;
        this.Record.rec_mode = this.mode;
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
              this.loading = false;
              this.ErrorMessage = this.gs.getError(error);
                
            });
    }

    allvalid() {
        let sError: string = "";
        let bret: boolean = true;
        this.ErrorMessage = '';
        if (this.Record.module_name.trim().length <= 0) {
            bret = false;
            sError += "\n\rName Cannot Be Blank";
        }

        //if (this.Record.user_password.trim().length <= 0) {
        //    bret = false;
        //    sError += "\n\rPassword Cannot Be Blank";
        //}

        if (bret) {
        }

        if (bret === false)
            this.ErrorMessage = sError;
        return bret;
    }

    RefreshList() {

        if (this.RecordList == null)
            return;

        var REC = this.RecordList.find(rec => rec.module_pkid == this.Record.module_pkid);
        if (REC == null) {
            this.RecordList.push(this.Record);
        }
        else {
            REC.module_name = this.Record.module_name;
            REC.module_order = this.Record.module_order;
        }
    }
    
    Close() {
        this.gs.ClosePage('home');
    }


}
