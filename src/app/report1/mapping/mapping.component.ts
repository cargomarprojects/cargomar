import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { GlobalService } from '../../core/services/global.service';
import { SearchTable } from '../../shared/models/searchtable';
import { Mappingm } from '../models/mapping';
import { RepService } from '../services/report.service';

@Component({
    selector: 'app-mapping',
    templateUrl: './mapping.component.html',
    providers: [RepService]
})

export class MappingComponent {
    title = 'Mapping Report'

    @Input() menuid: string = '';
    @Input() type: string = '';

    InitCompleted: boolean = false;
    menu_record: any;
    sub: any;
    urlid: string;

    ErrorMessage = "";
    InfoMessage = "";
    mode = '';
    pkid = '';

    table_name: string = "ORDER";

    disableSave = true;
    bCompany = false;
    all: boolean = false;
    loading = false;
    currentTab = 'LIST';
    searchstring = '';

    SearchData = {
        type: '',
        tablename: '',
        company_code: '',
        branch_code: ''
    };

    OrderColList: any[] = [];
    TargetColList: any[] = [];
    // Array For Displaying List
    RecordList: Mappingm[] = [];
    // Single Record for add/edit/view details
    Record: Mappingm = new Mappingm;

    BRRECORD: SearchTable = new SearchTable();
    AGENTRECORD: SearchTable = new SearchTable();
    CURRECORD: SearchTable = new SearchTable();

    constructor(
        private mainService: RepService,
        private route: ActivatedRoute,
        private gs: GlobalService
    ) {
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
        this.bCompany = false;
        this.menu_record = this.gs.getMenu(this.menuid);
        if (this.menu_record) {
            this.title = this.menu_record.menu_name;
            if (this.menu_record.rights_company)
                this.bCompany = true;
        }

        this.Init();
        this.initLov();
        this.LoadCombo();
    }

    Init() {


    }

    // Destroy Will be called when this component is closed
    ngOnDestroy() {
        this.sub.unsubscribe();
    }


    initLov(caption: string = '') {
        //this.BRRECORD = new SearchTable();
        //this.BRRECORD.controlname = "BRANCH";
        //this.BRRECORD.displaycolumn = "CODE";
        //this.BRRECORD.type = "BRANCH";
        //this.BRRECORD.id = "";
        //this.BRRECORD.code = this.gs.globalVariables.branch_code;
    }

    LovSelected(_Record: SearchTable) {
        // // Company Settings
        // if (_Record.controlname == "BRANCH") {
        //     this.branch_code = _Record.code;
        //     this.branch_name = _Record.name;

        // }

        // if (_Record.controlname == "AGENT") {
        //     this.agent_id = _Record.id;
        //     this.agent_code = _Record.code;
        //     this.agent_name = _Record.name;
        // }
        // if (_Record.controlname == "CURRENCY") {
        //     this.curr_id = _Record.id;
        //     this.curr_code = _Record.code;

        // }

    }
    LoadCombo() {
        this.OrderColList = [{ "id": "ORDER", "name": "INVOICE-NO" },
        { "id": "ORDER", "name": "PURCHASE-ORDER" },
        { "id": "ORDER", "name": "DESCRIPTION" },
        { "id": "ORDER", "name": "STYLE-NO" },
        { "id": "ORDER", "name": "COLOR" },
        { "id": "ORDER", "name": "CARTONS" },
        { "id": "ORDER", "name": "PCS" },
        { "id": "ORDER", "name": "NT-WT" },
        { "id": "ORDER", "name": "GR-WT" },
        { "id": "ORDER", "name": "CBM" },
        { "id": "ORDER", "name": "HS-CODE" },
        { "id": "ORDER", "name": "BOOKING-DATE" },
        { "id": "ORDER", "name": "RANDOM-DATE" },
        { "id": "ORDER", "name": "RELEASE-DATE" },
        { "id": "ORDER", "name": "READY-DATE" },
        { "id": "ORDER", "name": "FCR-DATE" },
        { "id": "ORDER", "name": "INSPECTION-DATE" },
        { "id": "ORDER", "name": "STUFFING-DATE" },
        { "id": "ORDER", "name": "WAREHOUSE-DATE" },
        { "id": "ORDER", "name": "DELIVERY-POL-DATE" },
        { "id": "ORDER", "name": "DELIVERY-POD-DATE" },
        { "id": "ORDER", "name": "POL" },
        { "id": "ORDER", "name": "POD" },
        { "id": "OTHERTYPE", "name": "..." }];//Add Other Type here

        this.FillTargetCol();
        this.List('NEW');
    }

    //function for handling LIST/NEW/EDIT Buttons
    ActionHandler(action: string, id: string) {
        this.ErrorMessage = '';
        if (action == 'LIST') {
            this.mode = '';
            this.pkid = '';
            this.currentTab = 'LIST';
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

        this.ErrorMessage = '';
        this.loading = true;
        this.pkid = this.gs.getGuid();
        this.SearchData.company_code = this.gs.globalVariables.comp_code;
        this.SearchData.branch_code = this.gs.globalVariables.branch_code;
        this.SearchData.tablename = this.table_name;
        this.SearchData.type = _type;
        this.ErrorMessage = '';
        this.mainService.MappingList(this.SearchData)
            .subscribe(response => {
                this.loading = false;
                this.RecordList = response.list;
            },
                error => {
                    this.loading = false;
                    this.ErrorMessage = this.gs.getError(error);
                });
    }

    OnChange(field: string) {
        this.FillTargetCol();
    }
    Close() {
        this.gs.ClosePage('home');
    }

    AddtoList() {
        this.NewRecord();
        this.RecordList.push(this.Record);
    }

    NewRecord() {
        this.Record = new Mappingm();
        this.Record.rec_mode = "ADD";
        this.Record.pkid = this.gs.getGuid();
        this.Record.br_code = this.gs.globalVariables.branch_code;
        this.Record.table_name = this.table_name;
        this.Record.target_col = '';
        this.Record.source_col = '';
        this.Record.slno = this.RecordList.length + 1;
    }

    Save() {
        if (!this.allvalid())
            return;
        this.loading = true;
        this.ErrorMessage = '';
        this.InfoMessage = "";
        this.Record = new Mappingm();
        this.Record.table_name = this.table_name;
        this.Record._globalvariables = this.gs.globalVariables;
        this.Record.MappingList = this.RecordList;
        this.mainService.SaveMapping(this.Record)
            .subscribe(response => {
                this.loading = false;
                this.InfoMessage = "Save Complete";
                this.mode = 'EDIT';
                this.Record.rec_mode = this.mode;
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
        for (let rec of this.RecordList) {
            if (rec.source_col == "") {
                bret = false;
                sError += "\n\r | SOURCE COL cannot be blank";
            }
            if (rec.target_col == "") {
                bret = false;
                sError += "\n\r | TARGET COL cannot be blank";
            }
            if (rec.table_name != this.table_name) {
                bret = false;
                sError += "\n\r | Table Name Mismatch Found";
            }
            if (rec.table_name != this.table_name) {
                bret = false;
                sError += "\n\r | Table Name Mismatch Found";
            }
            if (this.GetItemCount(rec.source_col, "SOURCE") > 1) {
                bret = false;
                sError += "\n\r | SOURCE COL Name Duplication Found";
            }
            if (this.GetItemCount(rec.target_col, "TARGET") > 1) {
                bret = false;
                sError += "\n\r | TARGET COL Name Duplication Found";
            }
        }
        if (bret === false)
            this.ErrorMessage = sError;
        return bret;
    }
    OnFocusTableCell(field: string, _rec: Mappingm) {

    }
    OnChangeTableCell(field: string, _rec: Mappingm) {

    }
    OnBlurTableCell(field: string, _rec: Mappingm) {
        switch (field) {
            case 'source_col':
                {
                    this.Record.source_col = this.Record.source_col.toUpperCase();
                    break;
                }
        }
    }

    FillTargetCol() {
        this.TargetColList = new Array<any>();
        for (let rec of this.OrderColList.filter(rec => rec.id == this.table_name)) {
            this.TargetColList.push(rec);
        }
    }

    GetItemCount(_Name: string, _Type: string) {
        let nCount: number = 0;
        if (_Type == "SOURCE") {
            for (let rec of this.RecordList.filter(rec => rec.source_col == _Name)) {
                nCount = nCount + 1;
            }
        } else if (_Type == "TARGET") {
            for (let rec of this.RecordList.filter(rec => rec.target_col == _Name)) {
                nCount = nCount + 1;
            }
        }
        return nCount;
    }

    Remove(_id: string) {
        this.RecordList.splice(this.RecordList.findIndex(rec => rec.pkid == _id), 1);
    }

}
