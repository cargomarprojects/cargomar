import { Component, OnInit, OnDestroy } from '@angular/core';
import { Location } from '@angular/common';

import { ActivatedRoute } from '@angular/router';

import { GlobalService } from '../../core/services/global.service';

import { User } from '../models/user';
import { Userd } from '../models/userd';

import { UserService } from '../services/user.service';
import { SearchTable } from '../../shared/models/searchtable';


@Component({
    selector: 'app-user',
    templateUrl: './user.component.html',
    providers: [UserService]
})
export class UserComponent {
    /*
    Ajith 19/06/2019 Page row increase to 50,server det added in list
    */
    // Local Variables 
    title = 'User Master';
    loading = false;
    currentTab = 'LIST';
    selectedRowIndex = 0;
    searchstring = '';
    page_count = 0;
    page_current = 0;
    page_rows = 0;
    page_rowcount = 0;
    lockstatus: string = "BOTH";

    sub: any;
    urlid: string;

    ErrorMessage = "User Details";

    mode = '';
    pkid = '';
    bPrint = true;
    // Array For Displaying List
    RecordList: User[] = [];
    // Single Record for add/edit/view details
    Record: User = new User;

    RecordDet: Userd[] = [];

    SALESMANRECORD: SearchTable = new SearchTable();
    EMPRECORD: SearchTable = new SearchTable();

    constructor(
        private mainService: UserService,
        private location: Location,
        private route: ActivatedRoute,
        private gs: GlobalService
    ) {
        this.page_count = 0;
        this.page_rows = 50;
        this.page_current = 0;

        this.InitLov();
        this.List("NEW");
    }

    // Init Will be called After executing Constructor
    ngOnInit() {

    }
    // Destroy Will be called when this component is closed
    ngOnDestroy() {

    }

    InitLov() {

        this.SALESMANRECORD = new SearchTable();
        this.SALESMANRECORD.controlname = "SALESMAN";
        this.SALESMANRECORD.displaycolumn = "NAME";
        this.SALESMANRECORD.type = "SALESMAN";
        this.SALESMANRECORD.id = "";
        this.SALESMANRECORD.code = "";
        this.SALESMANRECORD.name = "";

        this.EMPRECORD = new SearchTable();
        this.EMPRECORD.controlname = "EMPLOYEE";
        this.EMPRECORD.displaycolumn = "CODE";
        this.EMPRECORD.type = "EMPLOYEE";
        this.EMPRECORD.where = "";
        this.EMPRECORD.id = "";
        this.EMPRECORD.code = "";
        this.EMPRECORD.name = "";

    }

    LovSelected(_Record: SearchTable) {
        if (_Record.controlname == "SALESMAN") {
            this.Record.user_sman_id = _Record.id;
            this.Record.user_sman_code = _Record.code;
            this.Record.user_sman_name = _Record.name;
        }
        if (_Record.controlname == "EMPLOYEE") {
            this.Record.user_emp_id = _Record.id;
            this.Record.user_emp_code = _Record.code;
            this.Record.user_emp_name = _Record.name;
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
            this.NewRecord();
        }
        else if (action === 'EDIT') {
            this.currentTab = 'DETAILS';
            this.mode = 'EDIT';
            this.pkid = id;
            this.GetRecord(id);
        }
    }

    // Query List Data
    List(_type: string) {

        this.loading = true;

        let SearchData = {
            type: _type,
            searchstring: this.searchstring.toUpperCase(),
            comp_code: this.gs.globalVariables.comp_code,
            branch_code:this.gs.globalVariables.branch_code,
            report_folder: this.gs.globalVariables.report_folder,
            lockstatus: this.lockstatus,
            page_count: this.page_count,
            page_current: this.page_current,
            page_rows: this.page_rows,
            page_rowcount: this.page_rowcount
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

        this.Record = new User();
        this.Record.user_pkid = this.pkid;
        this.Record.user_code = '';
        this.Record.user_name = '';
        this.Record.user_password = '';
        this.Record.user_email = '';
        this.Record.user_sman_id = '';
        this.Record.user_sman_code = '';
        this.Record.user_sman_name = '';
        this.Record.user_email_pwd = '';
        this.Record.user_local_server = '';
        this.Record.user_tp_code = '';
        this.Record.user_tp_name = '';
        this.Record.user_dsc_slno = '';
        this.Record.rec_mode = this.mode;
        this.Record.user_branch_user = false;
        this.Record.user_show_payroll = false;
        this.Record.user_emp_id = '';
        this.Record.user_emp_code = '';
        this.Record.user_emp_name = '';
        this.Record.rec_locked = false;
        this.Record.user_remarks = '';
        this.InitLov();
    }

    // Load a single Record for VIEW/EDIT
    GetRecord(Id: string) {
        this.loading = true;

        let SearchData = {
            pkid: Id,
            comp_id: this.gs.globalVariables.comp_pkid
        };

        this.ErrorMessage = '';
        this.mainService.GetRecord(SearchData)
            .subscribe(response => {
                this.loading = false;
                this.LoadData(response.record);
                this.RecordDet = response.recorddet;
            },
                error => {
                    this.loading = false;
                    this.ErrorMessage = this.gs.getError(error);
                });
    }

    LoadData(_Record: User) {
        this.Record = _Record;
        this.Record.rec_mode = this.mode;
        this.InitLov();
        this.SALESMANRECORD.id = this.Record.user_sman_id;
        this.SALESMANRECORD.code = this.Record.user_sman_code;
        this.SALESMANRECORD.name = this.Record.user_sman_name;
        this.EMPRECORD.id = this.Record.user_emp_id;
        this.EMPRECORD.code = this.Record.user_emp_code;
        this.EMPRECORD.name = this.Record.user_emp_name;
    }

    // Save Data
    Save() {
        if (!this.allvalid())
            return;
        this.loading = true;
        this.ErrorMessage = '';

        this.Record.RecordDet = this.RecordDet;

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
        if (this.Record.user_code.trim().length <= 0) {
            bret = false;
            sError = "Code Cannot Be Blank";
        }
        if (this.Record.user_name.trim().length <= 0) {
            bret = false;
            sError += "\n\rName Cannot Be Blank";
        }

        //if (this.Record.user_password.trim().length <= 0) {
        //    bret = false;
        //    sError += "\n\rPassword Cannot Be Blank";
        //}

        if (bret) {
            this.Record.user_code = this.Record.user_code.toUpperCase().replace(' ', '');
            this.Record.user_name = this.Record.user_name.toUpperCase().trim();
            this.Record.user_password = this.Record.user_password.toUpperCase().trim();
            this.Record.user_tp_code = this.Record.user_tp_code.toUpperCase().trim();
            this.Record.user_remarks = this.Record.user_remarks.toUpperCase().trim();
        }

        if (bret === false)
            this.ErrorMessage = sError;
        return bret;
    }

    RefreshList() {

        if (this.RecordList == null)
            return;

        var REC = this.RecordList.find(rec => rec.user_pkid == this.Record.user_pkid);
        if (REC == null) {
            this.RecordList.push(this.Record);
        }
        else {
            REC.user_code = this.Record.user_code;
            REC.user_name = this.Record.user_name;
            REC.user_email = this.Record.user_email;
            REC.user_sman_name = this.Record.user_sman_name;
            REC.rec_locked = this.Record.rec_locked;
            REC.user_remarks = this.Record.user_remarks;
            REC.user_show_payroll = this.Record.user_show_payroll;
        }
    }

    Close() {
        this.gs.ClosePage('home');
    }

}
