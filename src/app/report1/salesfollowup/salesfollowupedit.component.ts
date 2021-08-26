import { Component, Input, OnInit, OnDestroy, ViewChild, AfterViewInit, Output, EventEmitter, ElementRef } from '@angular/core';
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


    @ViewChild('_txtremark') private txtremark_ctrl: ElementRef;
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
            pkid: '',
            report_date: this.InputSearchData.report_date,
            sman_name: this.InputSearchData.sman_name,
            branch: this.InputSearchData.branch,
            party_name: this.InputSearchData.party_name,
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
                if (this.txtremark_ctrl != null && this.txtremark_ctrl != undefined)
                    this.txtremark_ctrl.nativeElement.focus();
            },
                error => {
                    this.loading = false;
                    this.ErrorMessage = this.gs.getError(error);
                });
    }

    // Save Data
    Save() {

        if (!this.allvalid())
            return;

        let uid: string = this.gs.getGuid();
        this.ErrorMessage = '';
        let SearchData = {
            type: '',
            pkid: uid,
            report_date: this.InputSearchData.report_date,
            sman_name: this.InputSearchData.sman_name,
            branch: this.InputSearchData.branch,
            party_name: this.InputSearchData.party_name,
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

                    if (this.RecordList == null || this.RecordList == undefined)
                        this.RecordList = new Array<SalesFollowup>();
                    let Rec: SalesFollowup = new SalesFollowup;
                    Rec.report_remarks = this.remarks;
                    Rec.report_created_by = this.gs.globalVariables.user_code;
                    Rec.report_created_date = response.sdate;
                    Rec.uid = uid;
                    this.RecordList.push(Rec);

                    this.remarks = '';
                    if (this.txtremark_ctrl != null && this.txtremark_ctrl != undefined)
                        this.txtremark_ctrl.nativeElement.focus();

                    if (this.ModifiedRecords != null)
                        this.ModifiedRecords.emit({ saction: "SAVE", pkid: this.pkid, updatename: response.updatename });
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

        if (this.remarks.toString().length <= 0) {
            bret = false;
            sError = " | Remarks Cannot Be Blank";
        }

        if (bret === false) {
            this.ErrorMessage = sError;
            alert(this.ErrorMessage);
        }
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

    RemoveList(event: any) {
        if (event.selected) {
            this.RemoveRemarks(event.id);
        }
    }

    RemoveRemarks(Id: string) {
        this.loading = true;
        let SearchData = {
            rowtype: 'REMARKS',
            pkid: Id,
            comp_code: this.gs.globalVariables.comp_code,
            branch_code: this.gs.globalVariables.branch_code,
            user_code: this.gs.globalVariables.user_code,
        };

        this.ErrorMessage = '';
        this.mainService.DeleteRecord(SearchData)
            .subscribe(response => {
                this.loading = false;
                this.ErrorMessage = "Deleted Successfully";
                this.RecordList.splice(this.RecordList.findIndex(rec => rec.uid == Id), 1);
                alert(this.ErrorMessage);
            },
                error => {
                    this.loading = false;
                    this.ErrorMessage = this.gs.getError(error);
                    alert(this.ErrorMessage);
                });
    }
}