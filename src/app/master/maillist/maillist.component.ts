import { Component, Input, OnInit, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GlobalService } from '../../core/services/global.service';
import { MailList } from '../models/maillist';
import { MailListService } from '../services/maillist.service';
import { SearchTable } from '../../shared/models/searchtable';
import { Param } from '../../master/models/param';
//EDIT-AJITH-24-09-2021

@Component({
    selector: 'app-maillist',
    templateUrl: './maillist.component.html',
    providers: [MailListService]
})
export class MailListComponent {
    // Local Variables 
    title = 'Mail Details';

    //   @ViewChild('addressComponent') addressComponent: any;


    mdate: string;

    @Input() menuid: string = '';
    @Input() type: string = '';
    InitCompleted: boolean = false;
    menu_record: any;

    disableSave = true;
    loading = false;
    currentTab = 'LIST';

    searchstring = '';
    searchtype = 'SHIPMENT-TRACKING';
    page_count = 0;
    page_current = 0;
    page_rows = 0;
    page_rowcount = 0;

    sub: any;
    urlid: string;

    controlname = "CUSTOMER";
    tabletype = "CUSTOMER";
    // subtype = "";
    // displaydata = "";
    // where = "";

    ErrorMessage = "";
    InfoMessage = "";

    mode = '';
    pkid = '';

    CUSTRECORD: SearchTable = new SearchTable();
    USERRECORD: SearchTable = new SearchTable();
    // Array For Displaying List
    RecordList: MailList[] = [];
    // Single Record for add/edit/view details
    Record: MailList = new MailList;
    MailingList: Param[] = [];

    constructor(
        private mainService: MailListService,
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
        if (!this.InitCompleted) {
            this.InitComponent();
        }
    }

    InitComponent() {

        this.menu_record = this.gs.getMenu(this.menuid);
        if (this.menu_record)
            this.title = this.menu_record.menu_name;
        this.InitLov();
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
            branch_code: this.gs.globalVariables.branch_code
        };

        this.ErrorMessage = '';
        this.InfoMessage = '';
        this.mainService.LoadDefault(SearchData)
            .subscribe(response => {
                this.loading = false;
                this.MailingList = response.mailinglist;
                this.List("NEW");
            },
                error => {
                    this.loading = false;
                    this.ErrorMessage = JSON.parse(error._body).Message;
                    alert(this.ErrorMessage);
                });

    }
    InitLov() {

        this.CUSTRECORD = new SearchTable();
        this.CUSTRECORD.controlname = this.controlname;
        this.CUSTRECORD.displaycolumn = "CODE";
        this.CUSTRECORD.type = this.tabletype;
        this.CUSTRECORD.id = "";
        this.CUSTRECORD.code = "";
        this.CUSTRECORD.name = "";

        this.USERRECORD = new SearchTable();
        this.USERRECORD.controlname = "USER";
        this.USERRECORD.displaycolumn = "NAME";
        this.USERRECORD.type = "USER";
        this.USERRECORD.id = "";
        this.USERRECORD.code = "";
        this.USERRECORD.name = "";
    }

    LovSelected(_Record: any) {
        if (_Record.controlname == "USER") {
            this.Record.ml_from_user_id = _Record.id;
            this.Record.ml_from_user_code = _Record.code;
            this.Record.ml_from_user_name = _Record.name;
        } else {
            this.Record.ml_cust_id = _Record.id;
            this.Record.ml_cust_code = _Record.code;
            this.Record.ml_cust_name = _Record.name;
        }
    }



    //function for handling LIST/NEW/EDIT Buttons
    ActionHandler(action: string, id: string) {
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
            searchtype: this.searchtype,
            company_code: this.gs.globalVariables.comp_code,
            branch_code: this.gs.globalVariables.branch_code,
            page_count: this.page_count,
            page_current: this.page_current,
            page_rows: this.page_rows,
            page_rowcount: this.page_rowcount
        };

        this.ErrorMessage = '';
        this.InfoMessage = '';
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
                    alert(this.ErrorMessage);
                });
    }


    NewRecord() {

        this.pkid = this.gs.getGuid();

        this.Record = new MailList();
        this.Record.ml_pkid = this.pkid;
        this.Record.ml_type = 'SHIPMENT-TRACKING';
        this.Record.ml_cust_id = '';
        this.Record.ml_cust_code = '';
        this.Record.ml_cust_name = '';
        this.Record.ml_cust_type = 'CUSTOMER';
        this.Record.ml_to_ids = '';
        this.Record.ml_cc_ids = '';
        this.Record.ml_bcc_ids = '';
        this.Record.ml_from_user_code = '';
        this.Record.ml_from_user_id = '';
        this.Record.ml_from_user_name = '';
        this.Record.rec_mode = this.mode;
        this.Record.rec_locked = false;
        this.Record.ml_remarks = '';
        this.controlname = "CUSTOMER";
        this.tabletype = "CUSTOMER";
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

    LoadData(_Record: MailList) {
        this.Record = _Record;
        this.Record.rec_mode = this.mode;
        this.controlname = this.Record.ml_cust_type;
        this.tabletype = this.Record.ml_cust_type;
        this.InitLov();
        this.CUSTRECORD.id = this.Record.ml_cust_id;
        this.CUSTRECORD.code = this.Record.ml_cust_code;
        this.CUSTRECORD.name = this.Record.ml_cust_name;
        this.USERRECORD.id = this.Record.ml_from_user_id;
        this.USERRECORD.code = this.Record.ml_from_user_code;
        this.USERRECORD.name = this.Record.ml_from_user_name;
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

        if (this.Record.ml_to_ids.trim().length <= 0 && this.Record.ml_cc_ids.trim().length <= 0 && this.Record.ml_bcc_ids.trim().length <= 0) {
            bret = false;
            sError = " | Mail IDs not Found";
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
        var REC = this.RecordList.find(rec => rec.ml_pkid == this.Record.ml_pkid);
        if (REC == null) {
            this.RecordList.push(this.Record);
        }
        else {
            REC.ml_to_ids = this.Record.ml_to_ids;
            REC.ml_cc_ids = this.Record.ml_cc_ids;
            REC.ml_bcc_ids = this.Record.ml_bcc_ids;
            REC.ml_cust_name = this.Record.ml_cust_name;
            REC.ml_cust_type = this.Record.ml_cust_type;
            REC.ml_remarks = this.Record.ml_remarks;
        }
    }


    OnBlur(field: string) {
        // if (field == 'ritc_code') {
        //   this.Record.ritc_code = this.GetSpaceTrim(this.Record.ritc_code.trim()).newstr.toUpperCase();
        // }
        if (field == 'ml_cust_name') {
            this.Record.ml_cust_name = this.Record.ml_cust_name.toUpperCase();
        }

        if (field == 'searchstring') {
            this.searchstring = this.searchstring.toUpperCase();
        }
        if (field == 'ml_remarks') {
            this.Record.ml_remarks = this.Record.ml_remarks.toUpperCase();
        }


    }
    OnChange(field: string) {
        if (field == 'ml_cust_type') {
            this.Record.ml_cust_id = '';
            this.Record.ml_cust_code = '';
            this.Record.ml_cust_name = '';
            this.controlname = this.Record.ml_cust_type;
            this.tabletype = this.Record.ml_cust_type;
            this.InitLov();
        }
    }
    GetSpaceTrim(str: string) {
        let num: number;
        let strTrim = {
            newstr: ''
        };
        if (str.trim() != "") {
            var temparr = str.split(' ');
            for (num = 0; num < temparr.length; num++) {
                strTrim.newstr = strTrim.newstr.concat(temparr[num]);
            }
        }
        return strTrim;
    }

    Close() {
        this.gs.ClosePage('home');
    }


}
