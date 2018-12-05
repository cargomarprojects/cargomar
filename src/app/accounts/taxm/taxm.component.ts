
import { Component, Input, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';

import { ActivatedRoute } from '@angular/router';

import { GlobalService } from '../../core/services/global.service';

import { Taxm } from '../models/taxm';

import { TaxmService } from '../services/taxm.service';

import { SearchTable } from '../../shared/models/searchtable';


@Component({
    selector: 'app-taxm',
    templateUrl: './taxm.component.html',
    providers: [TaxmService]
})
export class TaxmComponent {
    // Local Variables 
    title = 'Tax Setup';

    @ViewChild('control_acc_code') private control_acc_code: ElementRef;

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


    AcGrpList: any[] = [];
    AcTypeList: any[] = [];

    // Array For Displaying List
    RecordList: Taxm[] = [];
    // Single Record for add/edit/view details
    Record: Taxm = new Taxm;

    ACCRECORD: SearchTable = new SearchTable();

    constructor(
        private mainService: TaxmService,
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

        this.ACCRECORD = new SearchTable();
        this.ACCRECORD.controlname = "ACCTM";
        this.ACCRECORD.displaycolumn = "CODE";
        this.ACCRECORD.type = "ACCTM";
        this.ACCRECORD.id = "";
        this.ACCRECORD.code = "";
        this.ACCRECORD.name = "";
    }

    LovSelected(_Record: SearchTable) {
        if (_Record.controlname == "ACCTM") {
            this.Record.tax_acc_id = _Record.id;
            this.Record.tax_acc_code = _Record.code;
            this.Record.tax_acc_name = _Record.name;
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
            page_count: this.page_count,
            page_current: this.page_current,
            page_rows: this.page_rows,
            page_rowcount: this.page_rowcount,
            company_code: this.gs.globalVariables.comp_code
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

        this.Record = new Taxm();
        this.Record.tax_pkid = this.pkid;
        this.Record.tax_desc = '';
        this.Record.tax_acc_code = '';
        this.Record.tax_acc_name = '';
        this.Record.tax_cgst_rate = 0;
        this.Record.tax_sgst_rate = 0;
        this.Record.tax_igst_rate = 0;
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

    LoadData(_Record: Taxm) {
        this.Record = _Record;

        this.InitLov();

        this.ACCRECORD.id = this.Record.tax_acc_id;
        this.ACCRECORD.code = this.Record.tax_acc_code;
        this.ACCRECORD.name = this.Record.tax_acc_name;

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
        if (this.Record.tax_acc_code.trim().length <= 0) {
            bret = false;
            sError = "A/c Code Need To Be Selected";
        }
        if (bret === false)
            this.ErrorMessage = sError;
        return bret;
    }

    RefreshList() {

        if (this.RecordList == null)
            return;
        var REC = this.RecordList.find(rec => rec.tax_pkid == this.Record.tax_pkid);
        if (REC == null) {
            this.RecordList.push(this.Record);
        }
        else {
            REC.tax_acc_code = this.Record.tax_acc_code;
            REC.tax_acc_name = this.Record.tax_acc_name;
            REC.tax_cgst_rate = this.Record.tax_cgst_rate;
            REC.tax_sgst_rate = this.Record.tax_sgst_rate;
            REC.tax_igst_rate = this.Record.tax_igst_rate;
        }
    }

    Close() {
        this.gs.ClosePage('home');
    }

    onLostFocus(controlname: string) {
        if (controlname == 'tax_acc_code') {
            this.Record.tax_desc = this.Record.tax_desc.toUpperCase();
        }
    }


}
