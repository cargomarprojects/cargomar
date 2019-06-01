import { Component, ViewChild, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { GlobalService } from '../../core/services/global.service';

import { RightsService } from '../services/rights.service';

import { User } from '../models/user';

import { Modulem } from '../models/modulem';

import { UserRights } from '../models/userrights';

import { UserRights_VM } from '../models/userrights';

import { SearchTable } from '../../shared/models/searchtable';

@Component({
    selector: 'app-rights',
    templateUrl: './rights.component.html',
    providers: [RightsService]
})

export class RightsComponent {

    /*
Ajith 31/05/2019 copy user rights from one user to another implemented
*/
    title = 'User Rights';

    currentTab = "LIST";

    ErrorMessage: string = "";


    searchstring: string = '';

    module_name: string = '';

    branch_id: string = '';
    user_id: string = '';
    user_name: string = '';
    branch_name: string = '';

    copyto_userid: string = '';
    copyto_usercode: string = '';
    copyto_username: string = '';
    copyto_branch_id: string = '';
    copyto_branch_code: string = '';

    page_count: number = 0;
    page_current: number = 0;
    page_rows: number = 50;
    page_rowcount: number = 0;


    rec_version: string = "1";

    RecordMast: User[] = [];

    RecordList: UserRights[] = [];

    ModuleList: Modulem[] = [];

    BranchList: any[] = [];
    UserList: any[] = [];
    USERRECORD: SearchTable = new SearchTable();
    BRRECORD: SearchTable = new SearchTable();
    loading = false;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private rightsService: RightsService,
        private gs: GlobalService
    ) {

        this.page_count = 0;
        this.page_current = 0;
        this.InitLov();
        this.List('NEW');
    }

    ngOnInit() {

    }
    InitLov() {
        this.USERRECORD = new SearchTable();
        this.USERRECORD.controlname = "USER";
        this.USERRECORD.displaycolumn = "NAME";
        this.USERRECORD.type = "USER";
        this.USERRECORD.where = "";
        this.USERRECORD.id = "";
        this.USERRECORD.code = "";
        this.USERRECORD.name = "";

        this.BRRECORD = new SearchTable();
        this.BRRECORD.controlname = "BRANCH";
        this.BRRECORD.displaycolumn = "CODE";
        this.BRRECORD.type = "BRANCH";
        this.BRRECORD.id = "";
        this.BRRECORD.code = "";
    }
    LovSelected(_Record: SearchTable) {

        if (_Record.controlname == "USER") {
            this.copyto_userid = _Record.id;
            this.copyto_usercode = _Record.code;
            this.copyto_username = _Record.name;
        }
        if (_Record.controlname == "BRANCH") {
            this.copyto_branch_id = _Record.id;
            this.copyto_branch_code = _Record.code;
        }
    }
    List(_type: string) {

        this.currentTab = 'LIST';

        this.ErrorMessage = "";

        let SearchData = {
            type: _type,
            rowtype: _type,
            comp_code: this.gs.globalVariables.comp_code,
            searchstring: this.searchstring.toUpperCase(),
            page_count: this.page_count,
            page_current: this.page_current,
            page_rows: this.page_rows,
            page_rowcount: this.page_rowcount
        };



        this.loading = true;

        this.rightsService.List(SearchData)
            .subscribe(response => {
                this.RecordMast = response.list;
                this.page_count = response.page_count;
                this.page_current = response.page_current;
                this.page_rowcount = response.page_rowcount;
                this.loading = false;
            },
                error => {
                    this.ErrorMessage = this.gs.getError(error);
                    this.loading = false;
                    alert(this.ErrorMessage);
                }
            );
    }

    RightsList(_type: string, _Rec: User) {

        this.currentTab = 'DETAILS';
        this.ErrorMessage = "";

        if (_type == "NEW" || _type == "FIRST")
            this.page_current = 1;
        if (_type == "PREV" && this.page_current > 1)
            this.page_current--;
        if (_type == "NEXT" && this.page_current < this.page_count)
            this.page_current++;
        if (_type == "LAST")
            this.page_current = this.page_count;

        this.user_name = _Rec.user_name;
        this.branch_name = _Rec.user_branch_name;

        let SearchData = {
            type: _type,
            searchstring: this.searchstring,
            comp_code: this.gs.globalVariables.comp_code,
            branchid: _Rec.user_branch_id,
            userid: _Rec.user_pkid,
        };

        this.loading = true;
        this.rightsService.RightsList(SearchData)
            .subscribe(response => {
                this.RecordList = response.list;
                this.ModuleList = response.modules;
                this.module_name = '';
                this.ModuleList.forEach(rec => {
                    if (this.module_name == '')
                        this.module_name = rec.module_name;
                });
                this.loading = false;
                this.ErrorMessage = "";
            },
                error => {
                    this.ErrorMessage = this.gs.getError(error);
                    this.loading = false;
                    alert(this.ErrorMessage);
                }
            );
    }

    ActionHandler(action: string, id: string) {

        this.ErrorMessage = '';
        if (action == 'LIST') {
            this.currentTab = 'LIST';
        }
        else {
            this.currentTab = 'DETAILS';
        }
    }

    Save() {
        this.loading = true;

        this.ErrorMessage = "";
        let VM = new UserRights_VM;

        VM.userRights = this.RecordList;
        VM.globalvariables = this.gs.globalVariables;

        this.rightsService.Save(VM)
            .subscribe(response => {
                this.ErrorMessage = "Save Complete";
                this.loading = false;
                alert(this.ErrorMessage);
            },
                error => {
                    this.loading = false;
                    this.ErrorMessage = this.gs.getError(error);
                    alert(this.ErrorMessage);
                }
            );
    }

    Return2Parent() {
        this.ActionHandler('LIST', '');
    }

    Close() {
        this.gs.ClosePage('home');
    }

    Copy() {
        this.ErrorMessage = "";
        if (this.copyto_userid.length <= 0) {
            this.ErrorMessage += "| Please select a user and continue....... ";
        }

        if (this.ErrorMessage.length > 0) {
            alert(this.ErrorMessage);
            return;
        }

        let Msg: string = "";

        Msg = "Do you want to Copy Rights of " + this.user_name + " to " + this.copyto_username + " of ";
        if (this.copyto_branch_code.length > 0)
            Msg += this.copyto_branch_code;
        else
            Msg += " ALL ";
        Msg += " Branch";

        if (!confirm(Msg)) {
            return;
        }

        this.loading = true;
        let VM = new UserRights_VM;
        VM.userRights = this.RecordList;
        VM.globalvariables = this.gs.globalVariables;
        VM.copyto_user_id = this.copyto_userid;
        VM.copyto_branch_id = this.copyto_branch_id;

        this.rightsService.CopyRights(VM)
            .subscribe(response => {
                this.ErrorMessage = "Save Complete";
                this.loading = false;
            },
                error => {
                    this.loading = false;
                    this.ErrorMessage = this.gs.getError(error);
                    alert(this.ErrorMessage);
                }
            );
    }
}


