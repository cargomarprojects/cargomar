import { Component, Input, OnInit, OnDestroy, ViewChild, AfterViewInit, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GlobalService } from '../../core/services/global.service';
import { RepService } from '../services/report.service';
import { SearchTable } from '../../shared/models/searchtable';
import { MonRep } from '../models/monrep';

@Component({
    selector: 'app-monrepupdt',
    templateUrl: './monrepupdt.component.html',
    providers: [RepService]
})

export class MonRepUpdtComponent {
    // Local Variables 
    title = '';

    @Input() record: MonRep;

    pkid: string = '';
    nomination: string = '';
    smanid: string = '';
    smanname: string = '';
    hbltype: string = '';
    hblno:string='';

    InitCompleted: boolean = false;
    menu_record: any;

    disableSave = true;
    loading = false;
    currentTab = 'LIST';

    page_count = 0;
    page_current = 0;
    page_rows = 0;
    page_rowcount = 0;

    sub: any;
    urlid: string;

    ErrorMessage = "";
    InfoMessage = "";

    mode = '';


    SearchData = {
        pkid: '',
        nomination: '',
        smanid: '',
        smanname: '',
        company_code: '',
        branch_code: '',
        user_code: '',
        hblno: '',
        rowtype: ''
    }
    SALESMANRECORD: SearchTable = new SearchTable();

    // Array For Displaying List

    // Single Record for add/edit/view details

    constructor(
        private mainService: RepService,
        private route: ActivatedRoute,
        private gs: GlobalService

    ) {
        this.page_count = 0;
        this.page_rows = 10;
        this.page_current = 0;
    }

    // Init Will be called After executing Constructor
    ngOnInit() {
        this.pkid = this.record.hbl_pkid;
        this.nomination = this.record.hbl_nomination;
        this.smanid = this.record.sman_id;
        this.smanname = this.record.sman_name;
        this.hbltype = this.record.hbl_type;
        this.hblno = this.record.sino;
        this.InitLov();
        this.SALESMANRECORD.id = this.record.sman_id;
        this.SALESMANRECORD.name = this.record.sman_name;
    }

    InitComponent() {

    }

    InitLov() {
        this.SALESMANRECORD = new SearchTable();
        this.SALESMANRECORD.controlname = "SALESMAN";
        this.SALESMANRECORD.displaycolumn = "NAME";
        this.SALESMANRECORD.type = "SALESMAN";
        this.SALESMANRECORD.id = "";
        this.SALESMANRECORD.code = "";
        this.SALESMANRECORD.name = "";
    }
    LovSelected(_Record: SearchTable) {

        if (_Record.controlname == "SALESMAN") {
            this.smanid = _Record.id;
            this.smanname = _Record.name;
        }
    }
    // Save Data
    Save() {
        /*
        if (!this.allvalid())
          return;
        */
        this.ErrorMessage = '';
        // if (this.nomination == '') {
        //     this.ErrorMessage = 'Remarks Cannot Be Empty';
        //     return;
        // }

        this.loading = true;
        this.ErrorMessage = '';
        this.InfoMessage = '';
        this.SearchData.pkid = this.pkid;
        this.SearchData.nomination = this.nomination;
        this.SearchData.smanid = this.smanid;
        this.SearchData.smanname = this.smanname;
        this.SearchData.rowtype = this.hbltype;
        this.SearchData.hblno = this.hblno;
        this.SearchData.company_code=this.gs.globalVariables.comp_code;
        this.SearchData.branch_code=this.gs.globalVariables.branch_code;
        this.SearchData.user_code=this.gs.globalVariables.user_code;

        this.mainService.UpdateMonReport(this.SearchData)
            .subscribe(response => {
                this.loading = false;

                if (response.status == "OK") {
                    this.record.hbl_nomination = this.nomination.toUpperCase();
                    this.record.sman_id = this.smanid;
                    this.record.sman_name = this.smanname;
                    this.record.displayed = false;
                }

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
        this.record.displayed = false;

    }

}