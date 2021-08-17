import { Component, Input, OnInit, OnDestroy, ViewChild, AfterViewInit, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GlobalService } from '../../core/services/global.service';
import { SearchTable } from '../../shared/models/searchtable';
import { SalesFollowup } from '../models/salesfollowup';

import { SalesFollowupService } from '../services/salesfollowup.service';

@Component({
    selector: 'app-salesfollowupedit',
    templateUrl: './salesfollowupedit.component.html',
    providers: [SalesFollowupService]
})

export class SalesFollowupEditComponent {
    // Local Variables 
    title = '';

    @Input() InputSearchData: any;
    @Output() ModifiedRecords = new EventEmitter<any>();

    pkid: string = '';
    remarks: string = '';

    InitCompleted: boolean = false;

    loading = false;
    currentTab = 'LIST';


    sub: any;
    urlid: string;

    ErrorMessage = "";
    InfoMessage = "";

    mode = '';




    // Array For Displaying List
    RecordList: SalesFollowup[] = [];
    // Single Record for add/edit/view details

    constructor(
        private mainService: SalesFollowupService,
        private route: ActivatedRoute,
        private gs: GlobalService

    ) {

    }

    // Init Will be called After executing Constructor
    ngOnInit() {
        this.pkid = this.InputSearchData.pkid;
        this.InitLov();
        this.List("NEW");
    }

    InitComponent() {

    }

    InitLov() {

    }
    LovSelected(_Record: SearchTable) {
    }

    List(_type: string) {
        this.loading = true;

        let SearchData = {
            type: _type,
            pkid: this.pkid,
            company_code: this.gs.globalVariables.comp_code,
            branch_code: this.gs.globalVariables.branch_code,
            year_code: this.gs.globalVariables.year_code
        };

        this.ErrorMessage = '';
        this.InfoMessage = '';
        this.mainService.RemarkList(SearchData)
            .subscribe(response => {
                this.loading = false;
                this.RecordList = response.list;
            },
                error => {
                    this.loading = false;
                    this.ErrorMessage = this.gs.getError(error);
                });
    }

    // Save Data
    Save(_type: string) {
        /*
        if (!this.allvalid())
          return;
        */
        this.ErrorMessage = '';
        let SearchData = {
            type: _type,
            pkid: this.pkid,
            company_code: this.gs.globalVariables.comp_code,
            branch_code: this.gs.globalVariables.branch_code,
            year_code: this.gs.globalVariables.year_code,
            user_code: this.gs.globalVariables.user_code,
            remarks: this.remarks
        };

        this.loading = true;
        this.ErrorMessage = '';
        this.InfoMessage = '';
        this.mainService.RemarkSave(SearchData)
            .subscribe(response => {
                this.loading = false;
                if (response.retvalue) {
                    if (this.ModifiedRecords != null)
                    this.ModifiedRecords.emit({ saction: "SAVE", pkid: this.pkid,remarks:this.remarks,sdate:response.sdate });
                }

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

        // if (this.nomination.toString().length <= 0) {
        //     bret = false;
        //     sError = " | Remarks Cannot Be Blank";
        // }

        //if (bret === false)
        //  this.ErrorMessage = sError;
        return bret;
    }


    Close() {
        if (this.ModifiedRecords != null)
        this.ModifiedRecords.emit({ saction: "CLOSE", pkid: this.pkid });
    }

    OnBlur(field: string) {
        switch (field) {
            case 'remarks':
                {
                    this.remarks = this.remarks.toUpperCase();
                    break;
                }
        }
    }

}