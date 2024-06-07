import { Component, Input, Output, OnInit, OnDestroy, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GlobalService } from '../../core/services/global.service';
import { CustdetConsignee } from '../models/custdetconsignee';
import { CustdetConsigneeService } from '../services/custdetconsignee.service';
import { SearchTable } from '../../shared/models/searchtable';

@Component({
    selector: 'app-custdetconsignee',
    templateUrl: './custdetconsignee.component.html',
    providers: [CustdetConsigneeService]
})
export class CustdetConsigneeComponent {
    // Local Variables 
    title = 'customer salesperson details';


    @Input() menuid: string = '';
    @Input() type: string = '';
    @Input() parentid: string = '';


    branch_id: string;

    selectedRowIndex: number = -1;

    loading = false;
    currentTab = 'LIST';

    bChanged: boolean;

    ErrorMessage = "";
    InfoMessage = "";
    mode = 'ADD';
    pkid = '';

    ctr: number;

    //  Array For Displaying List
    RecordList: CustdetConsignee[] = [];
    //  Single Record for add/edit/view details
    Record: CustdetConsignee = new CustdetConsignee;
    BRRECORD: SearchTable = new SearchTable();
    SALESMANRECORD: SearchTable = new SearchTable();
    PARTYRECORD: SearchTable = new SearchTable();

    constructor(
        private mainService: CustdetConsigneeService,
        private route: ActivatedRoute,
        private gs: GlobalService
    ) {
        this.Init();
        this.InitLov();

    }

    //// Init Will be called After executing Constructor
    ngOnInit() {
        this.List("NEW");
        this.ActionHandler("ADD", null);
    }

    //// Destroy Will be called when this component is closed
    ngOnDestroy() {

    }
    Init() {


    }
    InitLov() {

        this.BRRECORD = new SearchTable();
        this.BRRECORD.controlname = "BRANCH";
        this.BRRECORD.displaycolumn = "CODE";
        this.BRRECORD.type = "BRANCH";
        this.BRRECORD.id = '';
        this.BRRECORD.name = '';
        this.BRRECORD.code = '';


        this.SALESMANRECORD = new SearchTable();
        this.SALESMANRECORD.controlname = "SALESMAN";
        this.SALESMANRECORD.displaycolumn = "NAME";
        this.SALESMANRECORD.type = "SALESMAN";
        this.SALESMANRECORD.id = '';
        this.SALESMANRECORD.code = '';
        this.SALESMANRECORD.name = '';

        this.PARTYRECORD = new SearchTable();
        this.PARTYRECORD.controlname = "PARTY";
        this.PARTYRECORD.displaycolumn = "NAME";
        this.PARTYRECORD.type = "CUSTOMER";
        this.PARTYRECORD.id = "";
        this.PARTYRECORD.code = "";
        this.PARTYRECORD.name = "";
        this.PARTYRECORD.parentid = "";
    }

    LovSelected(_Record: SearchTable) {

        if (_Record.controlname == "BRANCH") {
            this.Record.det_branch_id = _Record.id;
            this.Record.det_branch_code = _Record.code;
            this.Record.det_branch_name = _Record.name;

        }

        if (_Record.controlname == "SALESMAN") {
            this.Record.det_sman_id = _Record.id;
            this.Record.det_sman_name = _Record.name;
        }

        if (_Record.controlname == "PARTY") {
            this.Record.det_consignee_id = _Record.id;
            this.Record.det_consignee_code = _Record.code;
            this.Record.det_consignee_name = _Record.name;
        }
    }

    ////function for handling LIST/NEW/EDIT Buttons
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
        this.Record = new CustdetConsignee();
        this.Record.det_pkid = this.pkid;
        this.Record.det_cust_id = this.parentid;
        this.Record.rec_mode = this.mode;
        this.Record.det_branch_id = '';
        this.Record.det_sman_id = '';
        this.Record.det_sman_name = '';
        this.Record.det_consignee_id = '';
        this.Record.det_consignee_code = '';
        this.Record.det_consignee_name = '';
        this.InitLov();


    }

    //// Load a single Record for VIEW/EDIT
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

    LoadData(_Record: CustdetConsignee) {
        this.Record = _Record;
        this.InitLov();

        this.BRRECORD.id = this.Record.det_branch_id;
        this.BRRECORD.code = this.Record.det_branch_code;
        this.BRRECORD.name = this.Record.det_branch_name;
        this.SALESMANRECORD.id = this.Record.det_sman_id;
        this.SALESMANRECORD.name = this.Record.det_sman_name;

        this.PARTYRECORD.id = this.Record.det_consignee_id;
        this.PARTYRECORD.code = this.Record.det_consignee_code;
        this.PARTYRECORD.name = this.Record.det_consignee_name;

        this.Record.rec_mode = this.mode;

    }

    //// Save Data
    Save() {

        if (!this.allvalid())
            return;
        this.loading = true;
        this.ErrorMessage = '';
        this.InfoMessage = '';
        this.Record.det_cust_id = this.parentid;
        this.Record.det_pkid = this.pkid;
        this.Record._globalvariables = this.gs.globalVariables;
        this.Record.rec_mode = this.mode;
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



    RefreshList() {

        if (this.RecordList == null)
            return;
        var REC = this.RecordList.find(rec => rec.det_pkid == this.Record.det_pkid);
        if (REC == null) {
            this.RecordList.push(this.Record);
        }
        else {
            REC.det_branch_name = this.Record.det_branch_name;
            REC.det_sman_name = this.Record.det_sman_name;
            REC.det_consignee_name = this.Record.det_consignee_name;
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
            // parentid: this.parentid
        };

        this.ErrorMessage = '';
        this.InfoMessage = '';
        this.mainService.DeleteRecord(SearchData)
            .subscribe(response => {
                this.loading = false;
                this.RecordList.splice(this.RecordList.findIndex(rec => rec.det_pkid == this.pkid), 1);
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
        if (this.Record.det_consignee_id.trim().length <= 0) {
            bret = false;
            sError = " | Consignee Cannot Be Blank";
        }
        if (this.Record.det_sman_id.trim().length <= 0) {
            bret = false;
            sError += "\n\r | Salesman Cannot Be Blank";
        }

        if (bret === false) {
            this.ErrorMessage = sError;
            alert(this.ErrorMessage);
        }
        return bret;
    }

    Close() {
        this.gs.ClosePage('home');
    }


}
