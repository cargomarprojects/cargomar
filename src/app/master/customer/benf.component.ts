import { Component, Input, Output, OnInit, OnDestroy, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GlobalService } from '../../core/services/global.service';
import { Benfm } from '../models/benfm';
import { BenfService } from '../services/benf.service';
import { SearchTable } from '../../shared/models/searchtable';
//EDIT-AJITH-29-09-2021

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
    @Input() cust_code: string = '';
    @Input() cust_name: string = '';

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
    searchstring = "";
    ctr: number;

    // Array For Displaying List
    RecordList: Benfm[] = [];
    // Single Record for add/edit/view details
    Record: Benfm = new Benfm;

    BRRECORD: SearchTable = new SearchTable();
    STATERECORD: SearchTable = new SearchTable();

    constructor(
        private mainService: BenfService,
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

        this.STATERECORD = new SearchTable();
        this.STATERECORD.controlname = "STATE";
        this.STATERECORD.displaycolumn = "NAME";
        this.STATERECORD.type = "STATE";
        this.STATERECORD.id = "";
        this.STATERECORD.code = "";
        this.STATERECORD.name = "";

        this.BRRECORD = new SearchTable();
        this.BRRECORD.controlname = "BRANCH";
        this.BRRECORD.displaycolumn = "CODE";
        this.BRRECORD.type = "BRANCH";
        this.BRRECORD.id = "";
        this.BRRECORD.code = this.gs.globalVariables.branch_code;
    }

    LovSelected(_Record: SearchTable) {
        if (_Record.controlname == "STATE") {
            this.Record.ben_state_id = _Record.id;
            this.Record.ben_state_code = _Record.code;
            this.Record.ben_state_name = _Record.name;
        }
        if (_Record.controlname == "BRANCH") {
            this.Record.ben_branch_code = _Record.code;
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
            year_code: this.gs.globalVariables.year_code,
            searchstring: this.searchstring
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
        this.Record = new Benfm();
        this.Record.ben_pkid = this.pkid;
        this.Record.ben_code = this.cust_code;
        this.Record.ben_name = this.cust_name;
        this.Record.ben_acc_no = '';
        this.Record.ben_acc_type = '10';
        this.Record.ben_addr1 = '';
        this.Record.ben_addr2 = '';
        this.Record.ben_addr3 = '';
        this.Record.ben_city = '';
        this.Record.ben_state_id = '';
        this.Record.ben_state_code = '';
        this.Record.ben_state_name = '';
        this.Record.ben_pin = '';
        this.Record.ben_ifsc = '';
        this.Record.ben_bank_name = '';
        if (this.gs.defaultValues.branch_accounts_email == undefined || this.gs.defaultValues.branch_accounts_email == null)
            this.Record.ben_email1 = this.getBrAccEmail();
        else
            this.Record.ben_email1 = this.gs.defaultValues.branch_accounts_email;
        this.Record.ben_email2 = '';
        this.Record.ben_mob = '';
        this.Record.ben_branch_code = this.gs.globalVariables.branch_code;
        this.Record.rec_mode = this.mode;
        this.InitLov();
        this.ben_code.nativeElement.focus();
    }

    getBrAccEmail() {
        let str: string = "";

        if (this.gs.globalVariables.branch_code == "DELAF")
            str = "delacc@cargomar.in";
        else if (this.gs.globalVariables.branch_code == "DELSF")
            str = "delseaacc@cargomar.in";
        else if (this.gs.globalVariables.branch_code == "MBYAF")
            str = "mbiairacc@cargomar.in";
        else if (this.gs.globalVariables.branch_code == "MBISF")
            str = "mbiacc@cargomar.in";
        else if (this.gs.globalVariables.branch_code == "BLRAF")
            str = "blracc@cargomar.in";
        else if (this.gs.globalVariables.branch_code == "COKAF")
            str = "kochiairacc@cargomar.in";
        else if (this.gs.globalVariables.branch_code == "CHNSF" || this.gs.globalVariables.branch_code == "CHNAF")
            str = "chennaiacc@cargomar.in";
        else if (this.gs.globalVariables.branch_code == "HOCPL")
            str = "hoacc@cargomar.in";
        else if (this.gs.globalVariables.branch_code == "ABDSF")
            str = "ahmgen@cargomar.in";
        else if (this.gs.globalVariables.branch_code == "COKSF")
            str = "kochiacc@cargomar.in";
        else if (this.gs.globalVariables.branch_code == "TUTSF")
            str = "tutiacc@cargomar.in";
        else if (this.gs.globalVariables.branch_code == "SEZSF")
            str = "csezgen@cargomar.in";

        return str;
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

    LoadData(_Record: Benfm) {
        this.Record = _Record;
        this.InitLov();
        this.STATERECORD.id = this.Record.ben_state_id;
        this.STATERECORD.code = this.Record.ben_state_code;
        this.STATERECORD.name = this.Record.ben_state_name;
        this.BRRECORD.code = this.Record.ben_branch_code;
        this.Record.rec_mode = this.mode;
        this.ben_code.nativeElement.focus();
    }

    // Save Data
    Save() {
        if (!this.allvalid())
            return;
        this.loading = true;
        this.ErrorMessage = '';
        this.InfoMessage = '';
        this.Record.ben_parent_id = this.parentid;
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

        if (this.Record.ben_code.trim().length <= 0) {
            bret = false;
            sError += "| Beneficiary / Vendor Code Cannot Be Blank";
        }
        if (this.Record.ben_name.trim().length <= 0) {
            bret = false;
            sError += "| Beneficiary Name Cannot Be Blank";
        }
        if (this.Record.ben_acc_type.trim().length <= 0) {
            bret = false;
            sError += "| Beneficiary Account Type Cannot Be Blank";
        }
        if (this.Record.ben_acc_no.trim().length <= 0) {
            bret = false;
            sError += "| Beneficiary Account Number Cannot Be Blank";
        }
        if (this.Record.ben_ifsc.trim().length <= 0) {
            bret = false;
            sError += "| IFSC Cannot Be Blank";
        }

        if (this.Record.ben_city.trim().length <= 0) {
            bret = false;
            sError += "| Beneficiary City Cannot Be Blank";
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
        var REC = this.RecordList.find(rec => rec.ben_pkid == this.Record.ben_pkid);
        if (REC == null) {
            this.RecordList.push(this.Record);
        }
        else {
            REC.ben_code = this.Record.ben_code;
            REC.ben_name = this.Record.ben_name;
            REC.ben_acc_no = this.Record.ben_acc_no;
            REC.ben_acc_type = this.Record.ben_acc_type;
            REC.ben_bank_name = this.Record.ben_bank_name;
            REC.ben_ifsc = this.Record.ben_ifsc;
            REC.ben_email1 = this.Record.ben_email1;
            REC.ben_mob = this.Record.ben_mob;
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
            case 'ben_code':
                {
                    this.Record.ben_code = this.Record.ben_code.toUpperCase();
                    break;
                }
            case 'ben_name':
                {
                    this.Record.ben_name = this.Record.ben_name.toUpperCase();
                    break;
                }
            case 'ben_acc_no':
                {
                    this.Record.ben_acc_no = this.Record.ben_acc_no.toUpperCase();
                    break;
                }
            case 'ben_addr1':
                {
                    this.Record.ben_addr1 = this.Record.ben_addr1.toUpperCase();
                    break;
                }
            case 'ben_addr2':
                {
                    this.Record.ben_addr2 = this.Record.ben_addr2.toUpperCase();
                    break;
                }
            case 'ben_addr3':
                {
                    this.Record.ben_addr3 = this.Record.ben_addr3.toUpperCase();
                    break;
                }
            case 'ben_city':
                {
                    this.Record.ben_city = this.Record.ben_city.toUpperCase();
                    break;
                }
            case 'ben_pin':
                {
                    this.Record.ben_pin = this.Record.ben_pin.toUpperCase();
                    break;
                }
            case 'ben_ifsc':
                {
                    this.Record.ben_ifsc = this.Record.ben_ifsc.toUpperCase();
                    break;
                }
            case 'ben_bank_name':
                {
                    this.Record.ben_bank_name = this.Record.ben_bank_name.toUpperCase();
                    break;
                }
                case 'searchstring':
                {
                    this.searchstring = this.searchstring.toUpperCase();
                    break;
                }
        }
    }

}
