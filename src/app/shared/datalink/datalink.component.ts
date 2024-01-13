import { Component, Input, OnInit, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GlobalService } from '../../core/services/global.service';
import { EdiLinkm } from '../models/edilinkm';
import { DatalinkService } from '../services/datalink.service';
import { SearchTable } from '../../shared/models/searchtable';
import { targetlistm } from '../../master/models/targetlistm';
import { Param } from '../../master/models/param';
@Component({
    selector: 'app-datalink',
    templateUrl: './datalink.component.html',
    providers: [DatalinkService]
})
export class DatalinkComponent {
    // Local Variables 
    title = 'Master Linking';

    mdate: string;

    @Input() menuid: string = '';
    @Input() type: string = '';
    @Input() link_type: string = '';
    @Input() link_pkid: string = '';
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
    selectedRowIndex = 0;

    sub: any;
    urlid: string;

    ErrorMessage = "";
    InfoMessage = "";
    bpending: boolean = true;
    bAdmin: boolean = false;
    bDelete: boolean = false;
    tl_pkid = '';
    mode = '';
    pkid = '';
    targetcode: string = "";
    targetname: string = "";
    source_table = 'MEXICO-TMM';
    search_source_table = 'MEXICO-TMM';
    source_type = 'ALL';
    source_typedet = 'ALL';
    SourceTypeList: any[] = [];
    TradingPartnerList: Param[] = [];
    Value1TypeList: any[] = [];
    PARTYRECORD: SearchTable = new SearchTable();

    RecordList2: targetlistm[] = [];

    // Array For Displaying List
    RecordList: EdiLinkm[] = [];
    // Single Record for add/edit/view details
    Record: EdiLinkm = new EdiLinkm;
    constructor(
        private mainService: DatalinkService,
        private route: ActivatedRoute,
        private gs: GlobalService

    ) {
        this.page_count = 0;
        this.page_rows = 10;
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
        if (this.type) {
            this.source_table = this.type;
            this.search_source_table = this.source_table;
            this.InitCompleted = false;
        }

        if (!this.InitCompleted) {
            this.InitComponent();
        }

        this.FillSourceTypeList(this.source_table);
        // this.List('NEW');
        // if (this.link_pkid) {
        //     this.ActionHandler('EDIT', this.link_pkid, this.link_type)
        // }
    }

    InitComponent() {
        this.bAdmin = false;
        this.bDelete = false;
        this.menu_record = this.gs.getMenu(this.menuid);
        if (this.menu_record) {
            this.title = this.menu_record.menu_name;
            if (this.menu_record.rights_admin)
                this.bAdmin = true;
            this.bDelete = this.menu_record.rights_delete;
        }

        this.LoadCombo();

    }

    initlov(_type: string) {
        if (_type == 'CUSTOMER') {
            this.PARTYRECORD = new SearchTable();
            this.PARTYRECORD.controlname = "CUSTOMER";
            this.PARTYRECORD.displaycolumn = "CODE";
            this.PARTYRECORD.type = "CUSTOMER";
            this.PARTYRECORD.where = "";
            this.PARTYRECORD.id = "";
            this.PARTYRECORD.code = "";
            this.PARTYRECORD.name = "";
            this.PARTYRECORD.parentid = "";
            // this.Record.sourcename = "";
        }
        else if (_type == 'CONTAINER') {
            this.PARTYRECORD = new SearchTable();
            this.PARTYRECORD.controlname = "CONTAINER";
            this.PARTYRECORD.displaycolumn = "CODE";
            this.PARTYRECORD.type = "CONTAINER TYPE";
            this.PARTYRECORD.where = "";
            this.PARTYRECORD.id = "";
            this.PARTYRECORD.code = "";
            this.PARTYRECORD.name = "";
            this.PARTYRECORD.parentid = "";
            // this.Record.sourcename = "";
        }
        else if (_type == 'SEA CARRIER') {
            this.PARTYRECORD = new SearchTable();
            this.PARTYRECORD.controlname = "SEA CARRIER";
            this.PARTYRECORD.displaycolumn = "CODE";
            this.PARTYRECORD.type = "SEA CARRIER";
            this.PARTYRECORD.where = "";
            this.PARTYRECORD.id = "";
            this.PARTYRECORD.code = "";
            this.PARTYRECORD.name = "";
            this.PARTYRECORD.parentid = "";
            // this.Record.sourcename = "";
        }
        else if (_type == 'AIR CARRIER') {
            this.PARTYRECORD = new SearchTable();
            this.PARTYRECORD.controlname = "AIR CARRIER";
            this.PARTYRECORD.displaycolumn = "CODE";
            this.PARTYRECORD.type = "AIR CARRIER";
            this.PARTYRECORD.where = "";
            this.PARTYRECORD.id = "";
            this.PARTYRECORD.code = "";
            this.PARTYRECORD.name = "";
            this.PARTYRECORD.parentid = "";
            // this.Record.sourcename = "";
        }
        if (_type == 'CUSTOMER PLUS ADDRESS') {
            this.PARTYRECORD = new SearchTable();
            this.PARTYRECORD.controlname = "CUSTOMER";
            this.PARTYRECORD.displaycolumn = "CODE";
            this.PARTYRECORD.type = "CUSTOMER PLUS ADDRESS";
            this.PARTYRECORD.where = "";
            this.PARTYRECORD.id = "";
            this.PARTYRECORD.code = "";
            this.PARTYRECORD.name = "";
            this.PARTYRECORD.parentid = "";
            // this.Record.sourcename = "";
        }
        else {
            this.PARTYRECORD = new SearchTable();
            this.PARTYRECORD.controlname = _type;
            this.PARTYRECORD.displaycolumn = "CODE";
            this.PARTYRECORD.type = _type;
            this.PARTYRECORD.where = "";
            this.PARTYRECORD.id = "";
            this.PARTYRECORD.code = "";
            this.PARTYRECORD.name = "";
            this.PARTYRECORD.parentid = "";
            // this.Record.sourcename = "";
        }
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
            branch_code: this.gs.globalVariables.branch_code
        };

        this.ErrorMessage = '';
        this.InfoMessage = '';
        this.mainService.LoadDefault(SearchData)
            .subscribe(response => {
                this.loading = false;
                this.TradingPartnerList = response.tplist;

                this.List("NEW");
            },
                error => {
                    this.loading = false;
                    this.ErrorMessage = JSON.parse(error._body).Message;
                });


    }


    LovSelected(_Record: any) {
        // if (_Record.controlname == "CUSTOMER" || _Record.controlname == "CONTAINER" || _Record.controlname == "SEA CARRIER") {
        //   this.Record.sourceid = _Record.id;
        //   this.Record.sourcecode = _Record.code;
        //   this.Record.sourcename = _Record.name;
        // }
        this.Record.sourceid = _Record.id;
        this.Record.sourcecode = _Record.code;
        this.Record.sourcename = _Record.name;
        if (this.Record.sourcetable == "JOB") {
            this.Record.targetid = _Record.code;
            this.Record.targetdesc = _Record.name;
        }
    }

    //function for handling LIST/NEW/EDIT Buttons
    ActionHandler(action: string, id: string, _sourceType: string = '') {
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
            this.currentTab = 'DETAILS';
            this.mode = 'EDIT';
            this.ResetControls();
            this.pkid = id;
            this.GetRecord(id, _sourceType);
            this.initlov('CUSTOMER');
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
        this.search_source_table = this.source_table;
        this.loading = true;
        let SearchData = {
            type: _type,
            rowtype: this.type,
            searchstring: this.searchstring.toUpperCase(),
            company_code: this.gs.globalVariables.comp_code,
            source_table: this.source_table,
            source_type: this.source_type,
            branch_code: '',
            bpending: this.bpending
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
        this.Record = new EdiLinkm();
        this.Record.pkid = this.pkid;
        this.Record.branchcode = "";
        this.Record.searchstring = "";
        this.Record.sourceid = "";
        this.Record.sourcecode = "";
        this.Record.sourcename = "";
        this.Record.targetid = "";
        this.Record.targetdesc = "";
        this.Record.sourcetable = this.source_table;
        this.Record.sourcetype = this.source_typedet;
        this.Record.rec_mode = this.mode;
        this.setLovType();
    }

    //  Load a single Record for VIEW/EDIT
    GetRecord(Id: string, _sourceType: string = '') {
        this.loading = true;
        let SearchData = {
            pkid: Id,
            source_type: _sourceType
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


    LoadData(_Record: EdiLinkm) {
        this.Record = _Record;
        this.Record.rec_mode = this.mode;
        this.setLovType();
        this.PARTYRECORD.id = this.Record.sourceid;
        this.PARTYRECORD.code = this.Record.sourcecode;
        this.PARTYRECORD.name = this.Record.sourcename;
        this.FillSourceTypeList(this.Record.sourcetable);
        this.FillValue1TypeList(this.Record.sourcetype);
    }


    // Save Data
    Save() {

        if (!this.allvalid())
            return;

        this.loading = true;
        this.ErrorMessage = '';
        this.InfoMessage = '';

        this.Record._globalvariables = this.gs.globalVariables;

        this.mainService.Save(this.Record)
            .subscribe(response => {
                this.loading = false;
                this.InfoMessage = "Save Complete";
                this.mode = 'EDIT';
                this.Record.rec_mode = this.mode;
                this.RefreshList();
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
        if (this.Record.sourcetable.trim().length <= 0) {
            bret = false;
            sError = " | Source Table Cannot Be Blank";
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
        var REC = this.RecordList.find(rec => rec.pkid == this.Record.pkid);
        if (REC == null) {
            this.RecordList.push(this.Record);
        }
        else {
            REC.sourcetable = this.Record.sourcetable;
            REC.sourcetype = this.Record.sourcetype;
            REC.searchstring = this.Record.searchstring;
            if (this.Record.sourcetable == "JOB") {
                REC.sourcecode = this.Record.targetid;
                REC.sourcename = this.Record.targetdesc;
            }
        }
    }


    OnBlur(field: string) {
        switch (field) {
            case 'targetid':
                {
                    this.Record.targetid = this.Record.targetid.toUpperCase();
                    break;
                }
            case 'targetdesc':
                {
                    this.Record.targetdesc = this.Record.targetdesc.toUpperCase();
                    break;
                }
            case 'searchstring':
                {
                    this.Record.searchstring = this.Record.searchstring.toUpperCase();
                    break;
                }
            case 'targetcode':
                {
                    this.targetcode = this.targetcode.toUpperCase();
                    break;
                }
            case 'targetname':
                {
                    this.targetname = this.targetname.toUpperCase();
                    break;
                }
            case 'searchstring2':
                {
                    this.searchstring = this.searchstring.toUpperCase();
                    break;
                }
        }
    }
    OnChange(field: string, _type: string = "") {
        if (field == 'sourcetype') {
            this.RecordList2 = new Array<targetlistm>();
            this.source_typedet = this.Record.sourcetype;
            this.setLovType();
            this.Value1TypeList = new Array<any>();
            if (this.Record.sourcetype == "CARGO-MOVEMENT" || this.Record.sourcetype == "FREIGHT-TERMS" || this.Record.sourcetype == "CARGO-NATURE" || this.Record.sourcetype == "NFEI") {
                this.FillValue1TypeList(this.Record.sourcetype);
            }
        } else if (field == 'source_table') {
            this.RecordList2 = new Array<targetlistm>();
            this.source_typedet = this.Record.sourcetype;
            this.setLovType();
            this.FillSourceTypeList(_type)
        } else if (field == 'sourceid') {
            this.Record.targetid = this.Record.sourceid;
        }

    }

    setLovType() {
        if (this.Record.sourcetable == "JOB") {
            if (this.Record.sourcetype == "SHIPPER" || this.Record.sourcetype == "CONSIGNEE" || this.Record.sourcetype == "BUYER")
                this.initlov('CUSTOMER PLUS ADDRESS');
            else if (this.Record.sourcetype == "BILLED-TO")
                this.initlov('CUSTOMER');
            else
                this.initlov(this.Record.sourcetype);
        } else {

            if (this.Record.sourcetype == "SHIPPER" || this.Record.sourcetype == "CONSIGNEE")
                this.initlov('CUSTOMER');
            else
                this.initlov(this.Record.sourcetype);
        }
    }

    FillSourceTypeList(_type: string) {
        this.SourceTypeList = new Array<any>();
        if (_type == "JOB") {
            this.SourceTypeList = [
                { "code": "ALL", "name": "ALL" },
                { "code": "BILLED-TO", "name": "BILLED-TO" },
                { "code": "BUYER", "name": "BUYER" },
                { "code": "CARGO-MOVEMENT", "name": "CARGO-MOVEMENT" },
                { "code": "CARGO-NATURE", "name": "CARGO-NATURE" },
                { "code": "COMMODITY", "name": "COMMODITY" },
                { "code": "CONSIGNEE", "name": "CONSIGNEE" },
                { "code": "COUNTRY", "name": "COUNTRY" },
                { "code": "FREIGHT-TERMS", "name": "FREIGHT-TERMS" },
                { "code": "JOB-TYPE", "name": "JOB-TYPE" },
                { "code": "NFEI", "name": "NFEI" },
                { "code": "PLACE-OF-RECEIPT", "name": "PLACE-OF-RECEIPT" },
                { "code": "PORT", "name": "PORT" },
                { "code": "PRE-CARRIAGE", "name": "PRE-CARRIAGE" },
                { "code": "SHIPPER", "name": "SHIPPER" },
                { "code": "STATE", "name": "STATE" },
                { "code": "STUFFED-AT", "name": "STUFFED-AT" },
                { "code": "UNIT", "name": "UNIT" }
            ];

        } else {

            this.SourceTypeList = [
                { "code": "ALL", "name": "ALL" },
                { "code": "SHIPPER", "name": "SHIPPER" },
                { "code": "CONSIGNEE", "name": "CONSIGNEE" },
                { "code": "USPORT", "name": "USPORT" },
                { "code": "SHIPPER-GROUP", "name": "SHIPPER-GROUP" },
                { "code": "CONTAINER", "name": "CONTAINER" },
                { "code": "CONTAINER SERVICE CODE", "name": "CONTAINER SERVICE CODE" },
                { "code": "AIR CARRIER", "name": "AIR CARRIER" },
                { "code": "SEA CARRIER", "name": "SEA CARRIER" }
            ];
        }
    }

    FillValue1TypeList(_type: string) {
        this.Value1TypeList = new Array<any>();
        if (_type == "CARGO-MOVEMENT") {
            this.Value1TypeList = [
                { "code": "FCL/FCL", "name": "FCL/FCL" },
                { "code": "FCL/LCL", "name": "FCL/LCL" },
                { "code": "LCL", "name": "LCL" },
                { "code": "LCL/FCL", "name": "LCL/FCL" },
                { "code": "LCL/LCL", "name": "LCL/LCL" }
            ];
        } else if (_type == "FREIGHT-TERMS") {
            this.Value1TypeList = [
                { "code": "EX-WORK", "name": "EX-WORK" },
                { "code": "FREIGHT COLLECT", "name": "FREIGHT COLLECT" },
                { "code": "FREIGHT PREPAID", "name": "FREIGHT PREPAID" }
            ];
        } else if (_type == "CARGO-NATURE") {
            this.Value1TypeList = [
                { "code": "N", "name": "NA" },
                { "code": "C", "name": "Containerized Cargo" },
                { "code": "CP", "name": "Containerized & Packaged cargo" },
                { "code": "P", "name": "Packaged Cargo" },
                { "code": "LB", "name": "Liquid Bulk" },
                { "code": "DB", "name": "Dry Bulk" }
            ];
        } else if (_type == "NFEI") {
            this.Value1TypeList = [
                { "code": "Y", "name": "YES" },
                { "code": "N", "name": "NO" }
            ];
        }
    }
    RemoveList(event: any) {
        if (event.selected) {
            this.RemoveRecord(event.id);
        }
    }

    RemoveRecord(Id: string) {
        this.loading = true;
        let SearchData = {
            pkid: Id
        };

        this.ErrorMessage = '';
        this.InfoMessage = '';
        this.mainService.DeleteRecord(SearchData)
            .subscribe(response => {
                this.loading = false;
                this.RecordList.splice(this.RecordList.findIndex(rec => rec.pkid == Id), 1);
            },
                error => {
                    this.loading = false;
                    this.ErrorMessage = this.gs.getError(error);
                });
    }

    Close() {
        this.gs.ClosePage('home');
    }

    Remove(_id: string, _Code: string) {

        if (!confirm("Do you want to Delete " + _Code)) {
            return;
        }
        this.tl_pkid = _id;
        this.SearchRecord('targetlistm', 'DELETE');
    }

    SearchRecord(controlname: string, _type: string) {
        this.InfoMessage = '';
        this.ErrorMessage = '';
        if (_type == "SAVE") {
            if (this.targetcode.length <= 0) {
                this.ErrorMessage += " | Code cannot be blank"
                alert(this.ErrorMessage);
                return;
            }
        }
        this.loading = true;
        let SearchData = {
            table: controlname,
            pkid: this.tl_pkid,
            type: _type,
            rowtype: this.type,
            searchstring: '',
            company_code: this.gs.globalVariables.comp_code,
            branch_code: this.gs.globalVariables.branch_code,
            sourcetable: '',
            sourcetype: '',
            targetcode: '',
            targetname: ''
        };

        SearchData.table = controlname;
        SearchData.pkid = this.tl_pkid;
        SearchData.type = _type;
        SearchData.rowtype = this.type;
        SearchData.company_code = this.gs.globalVariables.comp_code;
        SearchData.branch_code = this.gs.globalVariables.branch_code;
        SearchData.sourcetable = this.Record.sourcetable;
        SearchData.sourcetype = this.Record.sourcetype;
        SearchData.targetcode = this.targetcode;
        SearchData.targetname = this.targetname;
        SearchData.searchstring = '';

        this.gs.SearchRecord(SearchData)
            .subscribe(response => {
                this.loading = false;
                this.InfoMessage = '';

                if (_type == "LIST")
                    this.RecordList2 = response.list;
                if (_type == "SAVE") {
                    if (response.serror.length > 0) {
                        this.ErrorMessage = response.serror;
                        alert(this.ErrorMessage);
                    } else {
                        this.targetcode = "";
                        this.targetname = "";
                        if (this.RecordList2 != null)
                            this.RecordList2.push(response.rec);
                    }
                }
                if (_type == "DELETE") {
                    this.RecordList2.splice(this.RecordList2.findIndex(rec => rec.tl_pkid == this.tl_pkid), 1);
                }
            },
                error => {
                    this.loading = false;
                    this.ErrorMessage = this.gs.getError(error);
                    alert(this.ErrorMessage);
                });
    }
    Settargetvalue(_rec: targetlistm) {
        this.Record.targetid = _rec.tl_code;
        this.Record.targetdesc = _rec.tl_name;
    }
}
