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

        this.AGENTRECORD = new SearchTable();
        this.AGENTRECORD.controlname = "AGENT";
        this.AGENTRECORD.where = " CUST_IS_AGENT = 'Y' ";
        this.AGENTRECORD.displaycolumn = "NAME";
        this.AGENTRECORD.type = "CUSTOMER";
        this.AGENTRECORD.id = "";
        this.AGENTRECORD.code = "";
        this.AGENTRECORD.name = "";

        this.CURRECORD = new SearchTable();
        this.CURRECORD.controlname = "CURRENCY";
        this.CURRECORD.displaycolumn = "CODE";
        this.CURRECORD.type = "CURRENCY";
        this.CURRECORD.id = "";
        this.CURRECORD.code = "";
        this.CURRECORD.name = "";


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

        this.TargetColList = [{ "id": "ORD", "name": "INVOICE-NO" },
        { "id": "ORD", "name": "PURCHASE-ORDER" },
        { "id": "ORD", "name": "DESCRIPTION" },
        { "id": "ORD", "name": "STYLE-NO" },
        { "id": "ORD", "name": "COLOR" },
        { "id": "ORD", "name": "CARTONS" },
        { "id": "ORD", "name": "PCS" },
        { "id": "ORD", "name": "NT-WT" },
        { "id": "ORD", "name": "GR-WT" },
        { "id": "ORD", "name": "CBM" },
        { "id": "ORD", "name": "HS-CODE" },
        { "id": "ORD", "name": "BOOKING-DATE" },
        { "id": "ORD", "name": "RANDOM-DATE" },
        { "id": "ORD", "name": "RELEASE-DATE" },
        { "id": "ORD", "name": "READY-DATE" },
        { "id": "ORD", "name": "FCR-DATE" },
        { "id": "ORD", "name": "INSPECTION-DATE" },
        { "id": "ORD", "name": "STUFFING-DATE" },
        { "id": "ORD", "name": "WAREHOUSE-DATE" },
        { "id": "ORD", "name": "DELIVERY-POL-DATE" },
        { "id": "ORD", "name": "DELIVERY-POD-DATE" },
        { "id": "ORD", "name": "POL" },
        { "id": "ORD", "name": "POD" }];
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
        // if (this.from_date.trim().length <= 0) {
        //     this.ErrorMessage = "From Date Cannot Be Blank";
        //     return;
        // }
        // if (this.to_date.trim().length <= 0) {
        //     this.ErrorMessage = "To Date Cannot Be Blank";
        //     return;
        // }

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
                    this.RecordList = null;
                    this.ErrorMessage = this.gs.getError(error);
                });
    }

    OnChange(field: string) {
        this.RecordList = null;
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
        this.Record.slno = 0;
    }

    Save() {
        // if (!this.allvalid())
        // return;
        this.loading = true;
        this.ErrorMessage = '';

        this.Record._globalvariables = this.gs.globalVariables;
        this.Record.MappingList = this.RecordList;
        this.mainService.SaveMapping(this.Record)
            .subscribe(response => {
                this.loading = false;

                this.ErrorMessage = "Save Complete";

                this.mode = 'EDIT';
                this.Record.rec_mode = this.mode;


            },
                error => {
                    this.loading = false;
                    this.ErrorMessage = this.gs.getError(error);
                    alert(this.ErrorMessage);
                });
    }
}
