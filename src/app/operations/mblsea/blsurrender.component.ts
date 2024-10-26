import { Component, Input, Output, OnInit, OnDestroy, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GlobalService } from '../../core/services/global.service';
import { BlSurrender } from '../models/blsurrender';
import { BlSurrenderService } from '../services/blsurrender.service';
import { SearchTable } from '../../shared/models/searchtable';
import { AutoCompleteMultiComponent } from '../../shared/autocompletemulti/autocompletemulti.component';

@Component({
    selector: 'app-blsurrender',
    templateUrl: './blsurrender.component.html',
    providers: [BlSurrenderService]
})
export class BlSurrenderComponent {
    // Local Variables 
    title = 'BL Surrender List';

    @Input() menuid: string = '';
    @Input() type: string = '';
    @Input() parentid: string = '';

    @ViewChild('BlLov') private BlLovMulti: AutoCompleteMultiComponent;
    selectedRowIndex: number = -1;

    loading = false;
    currentTab = 'LIST';

    ErrorMessage = "";
    InfoMessage = "";
    mode = 'ADD';
    pkid = '';
    sWhere = "";
    ctr: number;

    // Array For Displaying List
    RecordList: BlSurrender[] = [];
    // Single Record for add/edit/view details
    Record: BlSurrender = new BlSurrender;



    constructor(
        private mainService: BlSurrenderService,
        private route: ActivatedRoute,
        private gs: GlobalService
    ) {

    }

    // Init Will be called After executing Constructor
    ngOnInit() {
        this.sWhere = "hbl_mbl_id='" + this.parentid + "'";
        this.List("NEW");
        this.ActionHandler("ADD", null);
    }

    // Destroy Will be called when this component is closed
    ngOnDestroy() {

    }

    InitLov() {

    }

    LovSelected(_Record: SearchTable) {
        if (_Record.controlname == "BRANCH") {
            this.Record.bls_type_id = _Record.id;
            this.Record.bls_type_code = _Record.code;
            this.Record.bls_type_name = _Record.name;
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
        this.Record = new BlSurrender();
        this.Record.bls_pkid = this.pkid;
        this.Record.bls_type_id = '';
        this.Record.bls_type_code = '';
        this.Record.bls_type_name = '';
        this.Record.rec_mode = this.mode;
    }

    // Load a single Record for VIEW/EDIT
    GetRecord(Id: string) {
    }

    // Save Data
    Save() {
        if (!this.gs.isBlank(this.BlLovMulti))
            this.BlLovMulti.Close();
        if (!this.allvalid())
            return;
        this.loading = true;
        this.ErrorMessage = '';
        this.InfoMessage = '';
        this.Record.bls_mbl_id = this.parentid;
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

        if (this.gs.isBlank(this.Record.bls_pkid)) {
            bret = false;
            sError += "\n\r | Invalid ID ";
        }
        if (this.gs.isBlank(this.Record.bls_type_id)) {
            bret = false;
            sError += "\n\r | Please select HBL to Surrender ";
        }

        if (bret === false) {
            this.ErrorMessage = sError;
            alert(this.ErrorMessage);
        }
        return bret;
    }

    RefreshList() {

        // if (this.RecordList == null)
        //   return;
        // var REC = this.RecordList.find(rec => rec.pack_pkid == this.Record.pack_pkid);
        // if (REC == null) {
        //   this.RecordList.push(this.Record);
        // }
        // else {
        //   REC.pack_from = this.Record.pack_from;
        //   REC.pack_to = this.Record.pack_to;
        //   REC.pack_type_code = this.Record.pack_type_code;
        //   REC.pack_ctns = this.Record.pack_ctns;
        // }
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
                this.RecordList.splice(this.RecordList.findIndex(rec => rec.bls_pkid == this.pkid), 1);
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

    }

    OnChange(field: string) {

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
