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

    @Input() bAdmin: boolean = false;
    @Input() record: MonRep;
    @Output() ModifiedRecords = new EventEmitter<any>();
    @Input() format_type: string = 'NOM';

    pkid: string = '';
    nomination: string = '';
    old_nomination: string = '';
    smanid: string = '';
    smanname: string = '';
    old_smanname: string = '';
    hbltype: string = '';
    hblno: string = '';
    hbl_inv_status: string = '';
    hbl_inv_remarks: string = '';

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
        old_nomination: '',
        smanid: '',
        smanname: '',
        old_smanname: '',
        company_code: '',
        branch_code: '',
        user_code: '',
        hblno: '',
        rowtype: '',
        type: '',
        periods: '',
        shipper: '',
        hbl_inv_status: '',
        hbl_inv_remarks: ''
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
        this.old_nomination = this.record.hbl_nomination;
        this.smanid = this.record.sman_id;
        this.smanname = this.record.sman_name;
        this.old_smanname = this.record.sman_name;
        this.hbltype = this.record.hbl_type;
        this.hblno = this.record.sino;
        this.hbl_inv_remarks = this.record.hbl_inv_remarks;
        this.hbl_inv_status = this.record.hbl_inv_status;
        if (this.hbl_inv_status == null || this.hbl_inv_status == undefined || this.hbl_inv_status == '')
            this.hbl_inv_status = 'P';
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
    Save(_type: string) {
        /*
        if (!this.allvalid())
          return;
        */
        this.ErrorMessage = '';

        this.SearchData.type = _type;
        this.SearchData.pkid = this.pkid;
        this.SearchData.nomination = this.nomination;
        this.SearchData.old_nomination = this.old_nomination;
        this.SearchData.smanid = this.smanid;
        this.SearchData.smanname = this.smanname;
        this.SearchData.old_smanname = this.old_smanname;
        this.SearchData.rowtype = this.hbltype;
        this.SearchData.hblno = this.hblno;
        this.SearchData.company_code = this.gs.globalVariables.comp_code;
        this.SearchData.branch_code = this.gs.globalVariables.branch_code;
        this.SearchData.user_code = this.gs.globalVariables.user_code;
        this.SearchData.periods = '';
        this.SearchData.shipper = '';
        this.SearchData.hbl_inv_status = this.hbl_inv_status;
        this.SearchData.hbl_inv_remarks = this.hbl_inv_remarks;

        if (_type === "SALESMAN-ALL") {
            if (this.ModifiedRecords != null)
                this.ModifiedRecords.emit({ saction: _type, smanid: this.smanid, smanname: this.smanname, SearchData: this.SearchData });
        } else {

            this.loading = true;
            this.ErrorMessage = '';
            this.InfoMessage = '';
            this.mainService.UpdateMonReport(this.SearchData)
                .subscribe(response => {
                    this.loading = false;

                    if (response.status == "OK") {
                        if (_type === "NOMINATION")
                            this.record.hbl_nomination = this.nomination.toUpperCase();
                        if (_type === "SALESMAN") {
                            this.record.sman_id = this.smanid;
                            this.record.sman_name = this.smanname;
                        }
                        if (_type === "PENDING-INVOICE") {
                            this.record.hbl_inv_remarks = this.hbl_inv_remarks;
                            this.record.hbl_inv_status = this.hbl_inv_status;
                        }
                        this.record.displayed = false;
                    }

                },
                    error => {
                        this.loading = false;
                        this.ErrorMessage = this.gs.getError(error);

                    });
        }
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

    OnBlur(field: string) {
        switch (field) {
            case 'hbl_inv_remarks':
                {
                    this.hbl_inv_remarks = this.hbl_inv_remarks.toUpperCase();
                    break;
                }
        }
    }

}