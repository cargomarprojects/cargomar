
import { Component, Input, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';

import { ActivatedRoute } from '@angular/router';

import { GlobalService } from '../../core/services/global.service';

import { Acctm } from '../models/acctm';

import { AcctmService } from '../services/acctm.service';

import { SearchTable } from '../../shared/models/searchtable';
//EDIT-AJITH-11-11-2021

@Component({
    selector: 'app-acctm',
    templateUrl: './acctm.component.html',
    providers: [AcctmService]
})
export class AcctmComponent {
    // Local Variables 
    title = 'A/c Master';


    //editing1


    //editing 2


    //new changes\


    // new change 2

    @ViewChild('control_acc_main_code') private control_acc_main_code: ElementRef;


    @Input() menuid: string = '';
    @Input() type: string = '';
    InitCompleted: boolean = false;
    menu_record: any;

    selectedRowIndex = 0;
    
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
    bPrint = false;

    ErrorMessage = "";

    mode = '';
    pkid = '';


    AcGrpList: any[] = [];
    AcTypeList: any[] = [];

    // Array For Displaying List
    RecordList: Acctm[] = [];
    // Single Record for add/edit/view details
    Record: Acctm = new Acctm;

    SACRECORD: SearchTable = new SearchTable();

    COMPRECORD: SearchTable = new SearchTable();
    BSHEADRECORD: SearchTable = new SearchTable();

    constructor(
        private mainService: AcctmService,
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
        this.bPrint = false;
        this.menu_record = this.gs.getMenu(this.menuid);
        if (this.menu_record) {
            this.title = this.menu_record.menu_name;
            if (this.menu_record.rights_print)
                this.bPrint = true;
        }

        this.LoadCombo();


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
                this.AcGrpList = response.acgroupm;
                this.AcTypeList = response.actypem;

                this.List("NEW");
            },
                error => {
                    this.loading = false;
                    this.ErrorMessage = this.gs.getError(error);
                });
    }

    InitLov() {

        this.SACRECORD = new SearchTable();
        this.SACRECORD.controlname = "SAC";
        this.SACRECORD.displaycolumn = "CODE";
        this.SACRECORD.type = "SAC";
        this.SACRECORD.id = "";
        this.SACRECORD.code = "";


        this.COMPRECORD = new SearchTable();
        this.COMPRECORD.controlname = "BRANCH";
        this.COMPRECORD.displaycolumn = "CODE";
        this.COMPRECORD.type = "BRANCH";
        this.COMPRECORD.id = "";
        this.COMPRECORD.code = "";

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

        if (_Record.controlname == "SAC") {
            this.Record.acc_sac_id = _Record.id;
            this.Record.acc_sac_code = _Record.code;
        }
        if (_Record.controlname == "BRANCH") {
            this.Record.acc_branch_code = _Record.code;
        }
        if (_Record.controlname == "BSHEAD") {
            this.Record.acc_bs_id = _Record.id;
            this.Record.acc_bs_code = _Record.code;
            this.Record.acc_bs_name = _Record.name;
        }
    }

    SearchRecord(controlname: string) {

        this.loading = true;


        let SearchData = {
            table: 'param',
            comp_code: '',
            param_type: '',
            param_code: ''
        };

        if (controlname == 'acc_main_code') {
            SearchData.table = 'param';
            SearchData.comp_code = this.gs.globalVariables.comp_code;
            SearchData.param_type = 'ACCOUNTS MAIN CODE';
            SearchData.param_code = this.Record.acc_main_code;
            this.Record.acc_main_id = '';
            this.Record.acc_main_name = '';
        }

        this.ErrorMessage = '';
        this.gs.SearchRecord(SearchData)
            .subscribe(response => {
                this.loading = false;
                if (response.param.length > 0) {
                    this.Record.acc_main_id = response.param[0].param_pkid;
                    this.Record.acc_main_name = response.param[0].param_name;
                }
            },
                error => {
                    this.loading = false;
                    this.ErrorMessage = this.gs.getError(error);
                });
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
            report_folder: this.gs.globalVariables.report_folder
        };

        this.ErrorMessage = '';
        this.mainService.List(SearchData)
            .subscribe(response => {
                this.loading = false;
                if (_type == 'EXCEL')
                    this.Downloadfile(response.filename, response.filetype, response.filedisplayname);
                else {
                    this.RecordList = response.list;
                    this.page_count = response.page_count;
                    this.page_current = response.page_current;
                    this.page_rowcount = response.page_rowcount;
                }
            },
                error => {
                    this.loading = false;
                    this.ErrorMessage = this.gs.getError(error);
                });
    }
    Downloadfile(filename: string, filetype: string, filedisplayname: string) {
        this.gs.DownloadFile(this.gs.globalVariables.report_folder, filename, filetype, filedisplayname);
    }
    NewRecord() {

        this.pkid = this.gs.getGuid();

        this.Record = new Acctm();
        this.Record.acc_pkid = this.pkid;
        this.Record.acc_code = '';
        this.Record.acc_name = '';
        this.Record.acc_main_name = '';
        this.Record.acc_against_invoice = "N";
        this.Record.acc_cost_centre = false;
        this.Record.acc_taxable = false;
        this.Record.acc_sac_id = '';
        this.Record.acc_sac_code = '';

        this.Record.acc_branch_code = '';
        this.Record.acc_bs_id = '';
        this.Record.acc_bs_code = '';
        this.Record.acc_bs_name = '';
        
        this.Record.acc_drcr_only = 'NA';
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

    LoadData(_Record: Acctm) {
        this.Record = _Record;

        this.InitLov();

        this.SACRECORD.id = this.Record.acc_sac_id;
        this.SACRECORD.code = this.Record.acc_sac_code;

        this.COMPRECORD.code = this.Record.acc_branch_code;
        this.BSHEADRECORD.id = this.Record.acc_bs_id;
        this.BSHEADRECORD.code = this.Record.acc_bs_code;
        this.BSHEADRECORD.name = this.Record.acc_bs_name;
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
        if (this.Record.acc_code.trim().length <= 0) {
            bret = false;
            sError = "Code Cannot Be Blank";
        }
        if (this.Record.acc_name.trim().length <= 0) {
            bret = false;
            sError += "\n\rName Cannot Be Blank";
        }
        if (this.Record.acc_main_code.trim().length <= 0) {
            bret = false;
            sError += "\n\rMain Code Cannot Be Blank";
        }
        if (this.Record.acc_group_id.trim().length <= 0) {
            bret = false;
            sError += "\n\rA/c Group Cannot Be Blank";
        }
        if (this.Record.acc_type_id.trim().length <= 0) {
            bret = false;
            sError += "\n\rA/c Type Cannot Be Blank";
        }

        if (bret) {
            this.Record.acc_code = this.Record.acc_code.toUpperCase().replace(' ', '');
            this.Record.acc_name = this.Record.acc_name.toUpperCase().trim();
            this.Record.acc_main_code = this.Record.acc_main_code.toUpperCase().trim();
        }

        if (bret === false)
            this.ErrorMessage = sError;
        return bret;
    }

    RefreshList() {

        if (this.RecordList == null)
            return;
        var REC = this.RecordList.find(rec => rec.acc_pkid == this.Record.acc_pkid);
        if (REC == null) {
            this.Record.acc_group_name = this.AcGrpList.find(row => row.id == this.Record.acc_group_id).name;
            this.Record.acc_type_name = this.AcTypeList.find(row => row.id == this.Record.acc_type_id).name;
            this.RecordList.push(this.Record);
        }
        else {
            REC.acc_code = this.Record.acc_code;
            REC.acc_name = this.Record.acc_name;
            REC.acc_main_code = this.Record.acc_main_code;
            REC.acc_group_name = this.AcGrpList.find(row => row.id == this.Record.acc_group_id).name;
            REC.acc_type_name = this.AcTypeList.find(row => row.id == this.Record.acc_type_id).name;
        }
    }

    Close() {
        this.gs.ClosePage('home');
    }

    onLostFocus(controlname: string) {
        if (controlname == 'acc_main_code') {

            this.Record.acc_main_id = '';
            this.Record.acc_main_name = '';

            if (!this.Record.acc_main_code) {
                this.control_acc_main_code.nativeElement.focus();
                return;
            }
            if (this.Record.acc_main_code.trim() == '') {
                this.control_acc_main_code.nativeElement.focus();
                return;
            }
            if (this.Record.acc_code.trim() != this.Record.acc_main_code.trim()) {
                this.SearchRecord('acc_main_code');
                return;
            }

        }
    }


}
