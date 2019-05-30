import { Component, Input, Output, OnInit, OnDestroy, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GlobalService } from '../../core/services/global.service';
import { Benfm } from '../models/benfm';
import { BenfService } from '../services/benf.service';
import { SearchTable } from '../../shared/models/searchtable';
@Component({
    selector: 'app-benf',
    templateUrl: './benf.component.html',
    providers: [BenfService]
})
export class BenfComponent {
    // Local Variables 
    title = 'Beneficiary Details'

    @ViewChild('ben_code') private ben_code: ElementRef;

    @Input() menuid: string = '';
    @Input() type: string = '';
    @Input() parentid: string = '';

    Total_Amount: number = 0;
    selectedRowIndex: number = -1;

    loading = false;
    currentTab = 'LIST';

    bChanged: boolean;

    ErrorMessage = "";
    InfoMessage = "";
    mode = 'ADD';
    pkid = '';

    ctr: number;

    // Array For Displaying List
    RecordList: Benfm[] = [];
    // Single Record for add/edit/view details
    Record: Benfm = new Benfm;

    PKGUNITRECORD: SearchTable = new SearchTable();

    constructor(
        private mainService: BenfService,
        private route: ActivatedRoute,
        private gs: GlobalService
    ) {
        this.InitLov();
    }

    // Init Will be called After executing Constructor
    ngOnInit() {
        this.List("NEW");
        this.ActionHandler("ADD", null);
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
    }

    LovSelected(_Record: SearchTable) {
        // if (_Record.controlname == "PKG-UNIT") {
        //     this.Record.pack_type_id = _Record.id;
        //     this.Record.pack_type_code = _Record.code;
        //     this.Record.pack_type_name = _Record.name;
        // }
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
                });
    }

    NewRecord() {

        this.pkid = this.gs.getGuid();
        this.Record = new Benfm();
        this.Record.ben_pkid = this.pkid;
        // this.Record.pack_from = 0;
        // this.Record.pack_to = 0;
        // this.Record.pack_type_id = this.gs.defaultValues.param_unit_ctn_id;
        // this.Record.pack_type_code = this.gs.defaultValues.param_unit_ctn_code;;
        // this.Record.pack_type_name = '';
        // this.Record.pack_order = 0;
        // this.Record.pack_source = '';
        // this.Record.pack_ctns = 0;
        this.Record.rec_mode = this.mode;

        this.InitLov();

        // this.PKGUNITRECORD.id = this.Record.pack_type_id;
        // this.PKGUNITRECORD.code = this.Record.pack_type_code;

        this.ben_code.nativeElement.focus();
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

    LoadData(_Record: Benfm) {
        this.Record = _Record;
        // this.InitLov();
        // this.PKGUNITRECORD.id = this.Record.pack_type_id;
        // this.PKGUNITRECORD.code = this.Record.pack_type_code;
        // this.PKGUNITRECORD.name = this.Record.pack_type_name;
        // this.Record.rec_mode = this.mode;

        this.ben_code.nativeElement.focus();
    }

    // Save Data
    Save() {
        if (!this.allvalid())
            return;
        this.loading = true;
        this.ErrorMessage = '';
        this.InfoMessage = '';
        // this.Record.pack_source = this.type;
        // this.Record.pack_job_id = this.parentid;
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
                });
    }

    allvalid() {
        let sError: string = "";
        let bret: boolean = true;
        this.ErrorMessage = '';
        this.InfoMessage = '';

        // if (this.Record.pack_type_id.trim().length <= 0) {
        //     bret = false;
        //     sError += "\n\r | Pack Type Cannot Be Blank";
        // }
        // if (this.Record.pack_ctns <= 0) {
        //     bret = false;
        //     sError += "\n\r | Invalid Cartons";
        // }

        // if (bret === false)
        //     this.ErrorMessage = sError;
        return bret;
    }

    RefreshList() {

        if (this.RecordList == null)
            return;
        var REC = this.RecordList.find(rec => rec.ben_pkid == this.Record.ben_pkid);
        if (REC == null) {
            this.RecordList.push(this.Record);
        }
        else {
            // REC.pack_from = this.Record.pack_from;
            // REC.pack_to = this.Record.pack_to;
            // REC.pack_type_code = this.Record.pack_type_code;
            // REC.pack_ctns = this.Record.pack_ctns;
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
                this.RecordList.splice(this.RecordList.findIndex(rec => rec.ben_pkid == this.pkid), 1);
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

    OnFocus(field: string) {
        this.bChanged = false;
    }

    OnChange(field: string) {
        this.bChanged = true;

        // let CtnsTot: number = 0;
        // CtnsTot = (this.Record.pack_to - this.Record.pack_from) + 1;
        // this.Record.pack_ctns = CtnsTot;
    }

    OnBlur(field: string) {
        //switch (field) {

        //  case 'ord_exp_name':
        //    {
        //      this.Record.ord_exp_name = this.Record.ord_exp_name.toUpperCase();
        //      break;
        //    }

        //}
    }

}
