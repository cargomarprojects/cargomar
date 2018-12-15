
import { Component, Input, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GlobalService } from '../../core/services/global.service';
import { LedgerReport } from '../models/ledgerreport';
import { LedgerBalService } from '../services/ledgerbal.service';
import { SearchTable } from '../../shared/models/searchtable';

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

    searchstring = '';
    page_count = 0;
    page_current = 0;
    page_rows = 0;
    page_rowcount = 0;

    sub: any;

    urlid: string;
   
    from_date: string;
    to_date: string;
    ismaincode: boolean =false;

    ErrorMessage = "";
    
    pkid = '';

    ACCRECORD: SearchTable = new SearchTable();

    SearchData = {
        type: '',
        subtype: '',
        pkid: '',
        acc_id: '',
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
        hide_ho_entries : ''
    };


    // Array For Displaying List
    RecordList: LedgerReport[] = [];
    // Single Record for add/edit/view details
    Record: LedgerReport = new LedgerReport;

    constructor(
        private mainService: LedgerBalService,
        private route: ActivatedRoute,
        private gs: GlobalService
    ) {
        this.sub = this.route.queryParams.subscribe(params => {
            this.page_rows = 20;
            this.urlid = params['id'];
            if (params["parameter"] != "") {
                this.InitCompleted = true;
                var options = JSON.parse(params["parameter"]);
                this.menuid = options.menuid;
                this.InitLov();
                if ( options.isdrildown){
                    this.CloseCaption = 'Return';
                    this.from_date = options.from_date;
                    this.to_date = options.to_date;
                    this.ACCRECORD.id = options.acc_pkid;
                    this.ACCRECORD.code = options.acc_code;
                    this.ACCRECORD.name = options.acc_name;
                }
                this.InitComponent();
            }
            else 
            {
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

        this.menu_record = this.gs.getMenu(this.menuid);
        if (this.menu_record)
            this.title = this.menu_record.menu_name;

        this.from_date = this.gs.globalVariables.year_start_date;
        this.to_date = this.gs.globalVariables.year_end_date;

    }

    // Destroy Will be called when this component is closed
    ngOnDestroy() {
        this.sub.unsubscribe();
    }


    InitLov() {

        this.ACCRECORD = new SearchTable();
        this.ACCRECORD.controlname = "ACCTM";
        this.ACCRECORD.displaycolumn = "CODE";
        this.ACCRECORD.type = "ACCTM";
        this.ACCRECORD.id = "";
        this.ACCRECORD.code = "";
        this.ACCRECORD.name = "";


    }

    LovSelected(_Record: SearchTable) {

        if (_Record.controlname == "ACCTM") {

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
            this.SearchData.pkid = this.pkid;
            this.SearchData.report_folder = this.gs.globalVariables.report_folder;
            this.SearchData.company_code = this.gs.globalVariables.comp_code;
            this.SearchData.branch_code = this.gs.globalVariables.branch_code;
            this.SearchData.year_code = this.gs.globalVariables.year_code;
            this.SearchData.searchstring = this.searchstring.toUpperCase();
            this.SearchData.from_date = this.from_date;
            this.SearchData.to_date = this.to_date;
            this.SearchData.ismaincode = this.ismaincode;
            this.SearchData.acc_id = this.ACCRECORD.id;
            this.SearchData.acc_name = this.ACCRECORD.name;

        }
        this.SearchData.hide_ho_entries = this.gs.globalVariables.hide_ho_entries;
        this.SearchData.type = _type;
        this.SearchData.subtype = '';
        this.SearchData.page_count = this.page_count;
        this.SearchData.page_current = this.page_current;
        this.SearchData.page_rows = this.page_rows;
        this.SearchData.page_rowcount = this.page_rowcount;



        this.ErrorMessage = '';
        this.mainService.List(this.SearchData)
            .subscribe(response => {
                this.loading = false;
                if (_type == 'EXCEL')
                    this.Downloadfile(_type);
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

    Downloadfile(_type : string) {
        this.gs.DownloadFile(this.gs.globalVariables.report_folder, this.pkid, _type);
    }

    Close() {
        let IsCloseButton = this.CloseCaption == 'Close' ? true : false;
        this.gs.ClosePage('home', IsCloseButton );
    }
}
