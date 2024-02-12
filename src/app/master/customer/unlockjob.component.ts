import { Component, Input, Output, OnInit, OnDestroy, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GlobalService } from '../../core/services/global.service';
import { JobUnlock } from '../models/jobunlock';
import { JobUnlockService } from '../services/jobunlock.service';
import { SearchTable } from '../../shared/models/searchtable';

@Component({
    selector: 'app-unlockjob',
    templateUrl: './unlockjob.component.html',
    providers: [JobUnlockService]
})
export class UnlockJobComponent {
    // Local Variables 
    title = 'Unlock Job'

    @Input() menuid: string = '';
    @Input() type: string = '';
    @Input() parentid: string = '';

    Total_Amount: number = 0;
    selectedRowIndex: number = -1;

    loading = false;
    currentTab = 'LIST';

    bChanged: boolean;

    // ben_branch_code = "";
    ErrorMessage = "";
    InfoMessage = "";
    mode = 'ADD';
    pkid = '';

    ctr: number;

    // Array For Displaying List
    RecordList: JobUnlock[] = [];
    // Single Record for add/edit/view details
    Record: JobUnlock = new JobUnlock;

    BRRECORD: SearchTable = new SearchTable();
    STATERECORD: SearchTable = new SearchTable();

    constructor(
        private mainService: JobUnlockService,
        private route: ActivatedRoute,
        public gs: GlobalService
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

        this.BRRECORD = new SearchTable();
        this.BRRECORD.controlname = "BRANCH";
        this.BRRECORD.displaycolumn = "CODE";
        this.BRRECORD.type = "BRANCH";
        this.BRRECORD.id = "";
        this.BRRECORD.code = this.gs.globalVariables.branch_code;
    }

    LovSelected(_Record: SearchTable) {
        if (_Record.controlname == "BRANCH") {
            this.Record.rec_branch_code = _Record.code;
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
        this.pkid = this.gs.getGuid();
        this.Record = new JobUnlock();
        this.Record.ul_pkid = this.pkid;
        this.Record.ul_type = 'JOB SEA EXPORT';
        this.Record.ul_remarks = '';
        this, this.Record.ul_comments = '';
        this.Record.rec_branch_code = this.gs.globalVariables.branch_code;
        this.Record.rec_created_by = this.gs.globalVariables.user_code;
        this.Record.rec_created_date = this.gs.ConvertDate2DisplayFormat(this.gs.defaultValues.today);
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

    LoadData(_Record: JobUnlock) {
        this.Record = _Record;
        this.InitLov();
        this.BRRECORD.code = this.Record.rec_branch_code;
        this.Record.rec_mode = this.mode;

    }

    // Save Data
    Save() {
        if (!this.allvalid())
            return;
        if ((this.Record.rec_branch_code != this.gs.globalVariables.branch_code) || this.Record.rec_branch_code == 'HOCPL') {
            if (!confirm("Unlock requested by  " + this.Record.rec_branch_code)) {
                return;
            }
        }

        this.loading = true;
        this.ErrorMessage = '';
        this.InfoMessage = '';
        this.Record.ul_parent_id = this.parentid;
        this.Record._globalvariables = this.gs.globalVariables;
        this.mainService.Save(this.Record)
            .subscribe(response => {
                this.loading = false;
                this.InfoMessage = "Save Complete";
                this.mode = 'EDIT';
                this.Record.rec_mode = this.mode;
                this.Record.ul_ctr = response.ul_ctr;
                this.Record.rec_created_by = response.rec_created_by;
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

        if (this.Record.rec_branch_code.trim().length <= 0) {
            bret = false;
            sError += "| Branch Code Cannot Be Blank";
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
        var REC = this.RecordList.find(rec => rec.ul_pkid == this.Record.ul_pkid);
        if (REC == null) {
            this.RecordList.push(this.Record);
        }
        else {
            REC.ul_type = this.Record.ul_type;
            REC.ul_comments = this.Record.ul_comments;
            REC.rec_branch_code = this.Record.rec_branch_code;
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
                this.RecordList.splice(this.RecordList.findIndex(rec => rec.ul_pkid == this.pkid), 1);
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

        // let CtnsTot: number = 0;
        // CtnsTot = (this.Record.pack_to - this.Record.pack_from) + 1;
        // this.Record.pack_ctns = CtnsTot;
    }

    OnBlur(field: string) {
        switch (field) {
            case 'ul_comments':
                {
                    this.Record.ul_comments = this.Record.ul_comments.toUpperCase();
                    break;
                }
        }
    }

}
