
import { Component, Input, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GlobalService } from '../../core/services/global.service';
import { LedgerReport } from '../models/ledgerreport';
import { LedgerBalService } from '../services/ledgerbal.service';
import { SearchTable } from '../../shared/models/searchtable';

import { Store } from '@ngrx/store';
import *  as ledgerrepactions from './ledgerbal.actions';
import *  as ledgerrepreducer from './ledgerbal.reducer';

import { LedgerReportState } from './ledgerbal.model'
import { Observable } from 'rxjs';

@Component({
    selector: 'app-ledgerbal',
    templateUrl: './ledgerbal.component.html',
    providers: [LedgerBalService]
})

export class LedgerBalComponent {
    // Local Variables 
    title = 'Ledger';

    @Input() menuid: string = '';
    @Input() type: string = '';
    InitCompleted: boolean = false;

    menu_record: any;
    CloseCaption = 'Close';
    loading = false;
    currentTab = 'LIST';

    isloaded: boolean = false;

    searchstring = '';
    page_count = 0;
    page_current = 0;
    page_rows = 0;
    page_rowcount = 0;

    sub: any;
    storesub: any;

    urlid: string;

    from_date: string;
    to_date: string;
    ismaincode: boolean = false;
    bAdmin: boolean = false;

    ErrorMessage = "";

    pkid = '';

    isdrilldown: boolean = false;

    ACCRECORD: SearchTable = new SearchTable();
    ACCMAINRECORD: SearchTable = new SearchTable();

    SearchData = {
        type: '',
        subtype: '',
        pkid: '',
        urlid: '',
        acc_id: '',
        acc_code: '',
        acc_name: '',
        report_folder: '',
        company_code: '',
        branch_code: '',
        year_code: '',
        searchstring: '',
        from_date: '',
        to_date: '',
        ismaincode: false,
        page_count: 0,
        page_current: 0,
        page_rows: 0,
        page_rowcount: 0,
        hide_ho_entries: ''
    };

    ledgerreportstate: Observable<LedgerReportState>;

    // Array For Displaying List
    RecordList: LedgerReport[] = [];
    // Single Record for add/edit/view details
    Record: LedgerReport = new LedgerReport;

    constructor(
        private mainService: LedgerBalService,
        private route: ActivatedRoute,
        private gs: GlobalService,
        private store: Store<ledgerrepreducer.AppState>
    ) {
        this.sub = this.route.queryParams.subscribe(params => {
            this.page_rows = 20;
            this.urlid = params['id'];
            if (params["parameter"] != "") {
                this.InitCompleted = true;
                var options = JSON.parse(params["parameter"]);
                this.menuid = options.menuid;
                this.InitLov();
                if (options.isdrildown) {
                    this.isdrilldown = true;
                    this.CloseCaption = 'Return';
                    this.from_date = options.from_date;
                    this.to_date = options.to_date;
                    this.ismaincode = options.ismaincode;
                    if (this.ismaincode) {
                        this.ACCMAINRECORD.id = options.acc_pkid;
                        this.ACCMAINRECORD.code = options.acc_code;
                        this.ACCMAINRECORD.name = options.acc_name;
                    }
                    else {
                        this.ACCRECORD.id = options.acc_pkid;
                        this.ACCRECORD.code = options.acc_code;
                        this.ACCRECORD.name = options.acc_name;
                    }
                }
                this.InitComponent();
            }
            else {
                this.InitComponent();
            }
        });
    }

    // Init Will be called After executing Constructor
    ngOnInit() {
        /*
        if (!this.InitCompleted) {
            this.InitComponent();
        }
        */
    }

    InitComponent() {
        this.bAdmin = false;
        this.menu_record = this.gs.getMenu(this.menuid);
        if (this.menu_record) {
            this.title = this.menu_record.menu_name;
            if (this.menu_record.rights_admin)
                this.bAdmin = true;
        }
        this.storesub = this.store.select(ledgerrepreducer.getLedgerStateRec(this.urlid)).subscribe(rec => {
            if (rec) {
                this.InitLov();
                this.RecordList = rec.records;
                this.pkid = rec.pkid;
                this.searchstring = rec.searchstring;
                this.from_date = rec.from_date;
                this.isloaded = rec.isloaded;
                this.to_date = rec.to_date;
                this.ismaincode = rec.ismaincode;
                if (this.ismaincode) {
                    this.ACCMAINRECORD.id = rec.acc_pkid;
                    this.ACCMAINRECORD.code = rec.acc_code;
                    this.ACCMAINRECORD.name = rec.acc_name;
                }
                else {
                    this.ACCRECORD.id = rec.acc_pkid;
                    this.ACCRECORD.code = rec.acc_code;
                    this.ACCRECORD.name = rec.acc_name;
                }
                this.page_count = rec.page_count;
                this.page_current = rec.page_current;
                this.page_rowcount = rec.page_rowcount;
                this.InitSearchData();
            }
            else {
                this.RecordList = undefined;
                this.page_count = 0;
                this.page_current = 0;
                this.page_rowcount = 0;
                this.isloaded = false;
                if (this.isdrilldown)
                    this.List('NEW');
                else {
                    this.from_date = this.gs.globalVariables.year_start_date;
                    this.to_date = this.gs.globalVariables.year_end_date;
                }
            }
        });
    }

    InitSearchData() {
        this.SearchData.pkid = this.pkid;
        this.SearchData.report_folder = this.gs.globalVariables.report_folder;
        this.SearchData.company_code = this.gs.globalVariables.comp_code;
        this.SearchData.branch_code = this.gs.globalVariables.branch_code;
        this.SearchData.year_code = this.gs.globalVariables.year_code;
        this.SearchData.searchstring = this.searchstring.toUpperCase();
        this.SearchData.from_date = this.from_date;
        this.SearchData.to_date = this.to_date;

        this.SearchData.ismaincode = this.ismaincode;
        if (this.ismaincode) {
            this.SearchData.acc_id = this.ACCMAINRECORD.id;
            this.SearchData.acc_code = this.ACCMAINRECORD.code;
            this.SearchData.acc_name = this.ACCMAINRECORD.name;

        }
        else {
            this.SearchData.acc_id = this.ACCRECORD.id;
            this.SearchData.acc_code = this.ACCRECORD.code;
            this.SearchData.acc_name = this.ACCRECORD.name;
        }

        this.SearchData.hide_ho_entries = this.gs.globalVariables.hide_ho_entries;
        this.SearchData.page_count = this.page_count;
        this.SearchData.page_current = this.page_current;
        this.SearchData.page_rows = this.page_rows;
        this.SearchData.page_rowcount = this.page_rowcount;
    }

    // Destroy Will be called when this component is closed
    ngOnDestroy() {
        this.sub.unsubscribe();
        this.storesub.unsubscribe();
    }

    InitLov() {
        this.ACCRECORD = new SearchTable();
        this.ACCRECORD.controlname = "ACCTM";
        this.ACCRECORD.displaycolumn = "CODE";
        this.ACCRECORD.type = "ACCTM";
        this.ACCRECORD.id = "";
        this.ACCRECORD.code = "";
        this.ACCRECORD.name = "";

        this.ACCMAINRECORD = new SearchTable();
        this.ACCMAINRECORD.controlname = "ACCOUNTS MAIN CODE";
        this.ACCMAINRECORD.displaycolumn = "CODE";
        this.ACCMAINRECORD.type = "ACCOUNTS MAIN CODE";
        this.ACCMAINRECORD.id = "";
        this.ACCMAINRECORD.code = "";
        this.ACCMAINRECORD.name = "";
    }

    LovSelected(_Record: SearchTable) {
        if (_Record.controlname == "ACCTM") {
            this.ismaincode = false;

            this.ACCMAINRECORD = new SearchTable();
            this.ACCMAINRECORD.controlname = "ACCOUNTS MAIN CODE";
            this.ACCMAINRECORD.displaycolumn = "CODE";
            this.ACCMAINRECORD.type = "ACCOUNTS MAIN CODE";
            this.ACCMAINRECORD.id = "";
            this.ACCMAINRECORD.code = "";
            this.ACCMAINRECORD.name = "";

        }
        if (_Record.controlname == "ACCOUNTS MAIN CODE") {
            this.ismaincode = true;
            this.ACCRECORD = new SearchTable();
            this.ACCRECORD.controlname = "ACCTM";
            this.ACCRECORD.displaycolumn = "CODE";
            this.ACCRECORD.type = "ACCTM";
            this.ACCRECORD.id = "";
            this.ACCRECORD.code = "";
            this.ACCRECORD.name = "";
        }
    }

    // Query List Data
    List(_type: string) {
        if (this.from_date.trim().length <= 0) {
            this.ErrorMessage = 'From Date Cannot Be Blank';
            return;
        }
        if (this.to_date.trim().length <= 0) {
            this.ErrorMessage = 'To Date Cannot Be Blank';
            return;
        }
        this.loading = true;

        if (_type == "NEW") {
            this.pkid = this.gs.getGuid();
            this.InitSearchData();
        }

        this.SearchData.type = _type;
        this.SearchData.subtype = '';

        this.ErrorMessage = '';
        this.mainService.List(this.SearchData)
            .subscribe(response => {
                this.loading = false;
                if (_type == 'EXCEL')
                    this.Downloadfile(_type);
                else {
                    const state: LedgerReportState = {
                        urlid: this.urlid,
                        pkid: this.pkid,
                        isloaded: true,
                        searchstring: this.SearchData.searchstring,
                        from_date: this.SearchData.from_date,
                        to_date: this.SearchData.to_date,
                        ismaincode: this.SearchData.ismaincode,
                        acc_pkid: this.SearchData.acc_id,
                        acc_code: this.SearchData.acc_code,
                        acc_name: this.SearchData.acc_name,
                        page_count: response.page_count,
                        page_current: response.page_current,
                        page_rowcount: response.page_rowcount,
                        records: response.list
                    };

                    this.store.dispatch(new ledgerrepactions.Update({ id: this.urlid, changes: state }));
                }
            },
                error => {
                    this.loading = false;
                    this.ErrorMessage = this.gs.getError(error);
                });
    }

    Downloadfile(_type: string) {
        this.gs.DownloadFile(this.gs.globalVariables.report_folder, this.pkid, _type);
    }


    drilldown(rec: LedgerReport) {
        let param = {
            menuid: 'TRANSDETREPORT',
            acc_code: this.SearchData.acc_code,
            jvh_vrno: rec.jv_vrno,
            jvh_type: rec.jv_type,
            jvh_year: rec.jv_year,
            company_code: rec.rec_company_code,
            branch_code: rec.rec_branch_code,
            isdrildown: true,
        }
        this.gs.Naviagete("accounts/transdetreport", JSON.stringify(param));
    }




    Close() {
        let IsCloseButton = this.CloseCaption == 'Close' ? true : false;
        this.gs.ClosePage('home', IsCloseButton);
    }

    GenerateAll() {
        this.ErrorMessage = '';
        this.loading = true;
        this.InitSearchData();
        this.mainService.GenerateLedger(this.SearchData)
            .subscribe(response => {
                this.loading = false;
                this.ErrorMessage = "Generate All Ledger Complete";
            },
                error => {
                    this.loading = false;
                    this.ErrorMessage = this.gs.getError(error);
                });
    }
}
