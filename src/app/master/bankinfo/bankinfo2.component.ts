import { Component, Input, OnInit, OnDestroy, ViewChild, AfterViewInit, Output, EventEmitter, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GlobalService } from '../../core/services/global.service';
import { SearchTable } from '../../shared/models/searchtable';
import { Bank_Info } from '../models/bank_info';
import { BankInfoService } from '../services/bankinfo.service';
//CREATE-AJITH-30-09-2021

@Component({
    selector: 'app-bankinfo2',
    templateUrl: './bankinfo2.component.html',
    providers: [BankInfoService]
})

export class BankInfo2Component {
    // Local Variables 
    title = '';

    @ViewChild('_txtremark') private txtremark_ctrl: ElementRef;
    private _pkid: string;
    @Input() set pkid(value: string) {
        this._pkid = value;
    }
    private _source: string;
    @Input() set source(value: string) {
        this._source = value;
    }

    InitCompleted: boolean = false;

    loading = false;
    currentTab = 'LIST';


    sub: any;
    urlid: string;

    ErrorMessage = "";
    InfoMessage = "";

    mode = '';

    // Single Record for add/edit/view details
    Record: Bank_Info = new Bank_Info;

    constructor(
        private mainService: BankInfoService,
        private route: ActivatedRoute,
        private gs: GlobalService

    ) {

    }

    // Init Will be called After executing Constructor
    ngOnInit() {
        this.InitLov();
        this.GetRecord(this._pkid);
    }

    InitComponent() {

    }

    InitLov() {

    }
    LovSelected(_Record: SearchTable) {
    }

    GetRecord(Id: string) {
        let SearchData = {
            pkid: Id,
        };
        this.ErrorMessage = '';
        this.InfoMessage = '';
        this.mainService.GetRecord(SearchData)
            .subscribe(response => {
                this.loading = false;
                this.mode = response.mode;
                if (this.mode == "ADD" || this.gs.isBlank(this.mode))
                    this.NewRecord();
                else
                    this.Record = response.record;
            },
                error => {
                    this.loading = false;
                    this.ErrorMessage = this.gs.getError(error);
                });
    }

    NewRecord() {

        this.Record = new Bank_Info();
        this.Record.bi_pkid = this.gs.getGuid();
        this.Record.bi_parent_id = this._pkid;
        this.Record.bi_source = this._source;
        this.Record.bi_name = '';
        this.Record.bi_add1 = '';
        this.Record.bi_add2 = '';
        this.Record.bi_add3 = '';
        this.Record.bi_acno = '';
        this.Record.bi_identifier = '';
        this.Record.bi_curr_code = '';
        this.Record.bi_benf_name = '';
        this.Record.bi_benf_add1 = '';
        this.Record.bi_benf_add2 = '';
        this.Record.bi_benf_add3 = '';
        this.Record.rec_mode = this.mode;
        this.InitLov();

    }
    // Save Data
    Save() {

        if (!this.allvalid())
            return;
        this.Record.bi_source = this._source;
        this.Record.bi_parent_id = this._pkid;
        this.Record._globalvariables = this.gs.globalVariables;

        this.loading = true;
        this.ErrorMessage = '';
        this.InfoMessage = '';
        this.mainService.Save(this.Record)
            .subscribe(response => {
                this.loading = false;
                if (response.retvalue) {
                    this.InfoMessage = "Save Complete";
                    alert(this.InfoMessage);
                    if (this.txtremark_ctrl != null && this.txtremark_ctrl != undefined)
                        this.txtremark_ctrl.nativeElement.focus();
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

        // if (this.remarks.toString().length <= 0) {
        //     bret = false;
        //     sError = " | Remarks Cannot Be Blank";
        // }

        // if (bret === false) {
        //     this.ErrorMessage = sError;
        //     alert(this.ErrorMessage);
        // }
        return bret;
    }


    Close() {

    }

    OnBlur(field: string) {
        switch (field) {
            case 'remarks':
                {
                    // this.remarks = this.remarks.toUpperCase();
                    // break;
                }
        }
    }

}