
import { Component, Input, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';

import { ActivatedRoute } from '@angular/router';

import { GlobalService } from '../../core/services/global.service';


import { ReconReport } from '../models/reconreport';

import { ReconService } from '../services/recon.service';

import { SearchTable } from '../../shared/models/searchtable';

@Component({
    selector: 'app-recon',
    templateUrl: './recon.component.html',
    providers: [ReconService]
})

export class ReconComponent {
    // Local Variables 
    title = 'Bank Reconciliation';


    @Input() menuid: string = '';
    @Input() type: string = '';
    InitCompleted: boolean = false;
    menu_record: any;

    disableSave = true;
    loading = false;
    currentTab = 'LIST';
    selectedRowIndex = 0;


    basedonreconcileddate: boolean = false;

    searchstring = '';
    page_count = 0;
    page_current = 0;
    page_rows = 0;
    page_rowcount = 0;

    sub: any;
    urlid: string;


    from_date: string;
    to_date: string;
    reconciled: boolean = false;
    unreconciled: boolean = false;

    ErrorMessage = "";

    mode = '';
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
        reconciled: '',
        unreconciled: '',
        ismaincode: false,
        page_count: 0,
        page_current: 0,
        page_rows: 0,
        page_rowcount: 0,
        basedonreconcileddate: false,
        hide_ho_entries: '',
        user_code: ''
    };








    // Array For Displaying List
    RecordList: ReconReport[] = [];
    // Single Record for add/edit/view details
    Record: ReconReport = new ReconReport;

    constructor(
        private mainService: ReconService,
        private route: ActivatedRoute,
        private gs: GlobalService
    ) {
        this.page_count = 0;
        this.page_rows = 20;
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

        this.from_date = this.gs.globalVariables.year_start_date;
        if (this.gs.isLatestFinancialYear())
            this.to_date = this.gs.defaultValues.today;
        else
            this.to_date = this.gs.globalVariables.year_end_date;

        this.InitLov();

        this.LoadCombo();


    }

    // Destroy Will be called when this component is closed
    ngOnDestroy() {
        this.sub.unsubscribe();
    }

    LoadCombo() {
    }


    //function for handling LIST/NEW/EDIT Buttons
    ActionHandler(action: string, id: string) {
        this.ErrorMessage = '';
        if (action == 'LIST') {
            this.mode = '';
            this.pkid = '';
            this.currentTab = 'LIST';
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


    InitLov() {

        this.ACCRECORD = new SearchTable();
        this.ACCRECORD.controlname = "ACCTM";
        this.ACCRECORD.displaycolumn = "CODE";
        this.ACCRECORD.type = "ACCTM";
        this.ACCRECORD.id = "";
        this.ACCRECORD.code = "";
        this.ACCRECORD.name = "";
        this.ACCRECORD.where = " acc_type_id in(select actype_pkid from actypem where actype_name = 'BANK' and rec_company_code = '" + this.gs.globalVariables.comp_code + "') ";

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
        if (this.ACCRECORD.id.length <= 0) {
            this.ErrorMessage = 'A/c code Cannot Be Blank';
            return;
        }

        this.SearchData.user_code = "";
        if (_type == "EXCEL2") {
            _type = "EXCEL";
            this.SearchData.user_code = this.gs.globalVariables.user_code;
        }

        this.loading = true;

        if (_type == "NEW" || _type == "EXCEL") {
            this.pkid = this.gs.getGuid();
            this.SearchData.pkid = this.pkid;
            this.SearchData.report_folder = this.gs.globalVariables.report_folder;
            this.SearchData.company_code = this.gs.globalVariables.comp_code;
            this.SearchData.branch_code = this.gs.globalVariables.branch_code;
            this.SearchData.year_code = this.gs.globalVariables.year_code;
            this.SearchData.searchstring = this.searchstring.toUpperCase();
            this.SearchData.from_date = this.from_date;
            this.SearchData.to_date = this.to_date;
            this.SearchData.acc_id = this.ACCRECORD.id;
            this.SearchData.acc_name = this.ACCRECORD.name;
        }
        this.SearchData.hide_ho_entries = this.gs.globalVariables.hide_ho_entries;
        this.SearchData.type = _type;
        if (this.reconciled)
            this.SearchData.reconciled = "Y";
        else
            this.SearchData.reconciled = "N";
        if (this.unreconciled)
            this.SearchData.unreconciled = "Y";
        else
            this.SearchData.unreconciled = "N";

        this.SearchData.subtype = '';
        this.SearchData.page_count = this.page_count;
        this.SearchData.page_current = this.page_current;
        this.SearchData.page_rows = this.page_rows;
        this.SearchData.page_rowcount = this.page_rowcount;



        this.SearchData.basedonreconcileddate = this.basedonreconcileddate;




        this.ErrorMessage = '';
        this.mainService.List(this.SearchData)
            .subscribe(response => {
                this.loading = false;
                if (_type == 'EXCEL')
                    this.Downloadfile(response.reportfile, _type, response.filedisplayname);
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




    // Downloadfile(_type : string) {
    //     this.gs.DownloadFile(this.gs.globalVariables.report_folder, this.pkid, _type);
    // }
    Downloadfile(filename: string, filetype: string, filedisplayname: string) {
        this.gs.DownloadFile(this.gs.globalVariables.report_folder, filename, filetype, filedisplayname);
    }

    showhiderow(rec: ReconReport) {
        rec.rowdisplayed = !rec.rowdisplayed;
        if (rec.jvh_not_over_chq == "Y") {
            rec.rowdisplayed = false;
            alert('Cannot Edit, Not Over Chq');
        }
    }

    RetData(params: any, rec: ReconReport) {
        if (params.saction == "CLOSE")
            rec.rowdisplayed = false;
        if (params.saction == "SAVE") {
            rec.recon_date = params.inputdate;
            rec.recon_display_date = params.displaydate;
            rec.rowdisplayed = false;
        }
    }

    Close() {
        this.gs.ClosePage('home');
    }
}
