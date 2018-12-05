import { Component, ViewChild, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { GlobalService } from '../../core/services/global.service';

import { RightsService } from '../services/rights.service';

import { User } from '../models/user';

import { Modulem } from '../models/modulem';

import { UserRights } from '../models/userrights';

import { UserRights_VM } from '../models/userrights';

@Component({
    selector: 'app-rights',
    templateUrl: './rights.component.html',
    providers : [RightsService]
})

export class RightsComponent {

    title = 'User Rights';

    currentTab = "LIST";

    ErrorMessage: string = "";


    searchstring : string = '';
    
    module_name: string = '';

    branch_id: string  ='' ;
    user_id: string = '';
    user_name: string = '';
    branch_name: string = '';

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

    loading = false;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private rightsService: RightsService,
        private gs: GlobalService
    ) {

        this.page_count = 0;
        this.page_current = 0;
        this.List('NEW');
    }

    ngOnInit() {

    }

    List(_type: string ) {

        this.currentTab = 'LIST';

        this.ErrorMessage = "";

        let SearchData = {
            type: _type,
            rowtype: _type,
            comp_code : this.gs.globalVariables.comp_code,
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
                this.ErrorMessage = error.error;
                this.loading = false;
            }
            );
    }

    RightsList(_type: string, _Rec: User ) {

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
            comp_code : this.gs.globalVariables.comp_code,
            branchid :  _Rec.user_branch_id,
            userid  : _Rec.user_pkid,
        };

        this.loading = true;
        this.rightsService.RightsList(SearchData)
            .subscribe(response => {
                this.RecordList = response.list;
                this.ModuleList = response.modules;
                this.module_name = '';
                this.ModuleList.forEach(rec => {
                    if( this.module_name =='')
                      this.module_name = rec.module_name;
                });
                this.loading = false;
                this.ErrorMessage = "";
            },
            error => {
                this.ErrorMessage =  error.error;
                this.loading = false;
            }
            );
    }

    ActionHandler(action: string, id: string) {

        this.ErrorMessage = '';
        if (action == 'LIST' ) {
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
            },
            error => {
                this.ErrorMessage = error.error;
                this.loading = false;
            }
            );
    }

    Return2Parent() {
        this.ActionHandler('LIST', '');
    }

    Close() {
        this.gs.ClosePage('home');
    }

}


