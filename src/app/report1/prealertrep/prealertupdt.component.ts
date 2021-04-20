import { Component, Input, OnInit, OnDestroy, ViewChild, AfterViewInit, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GlobalService } from '../../core/services/global.service';
import { PreAlertRepService } from '../services/prealertrep.service';
import { SearchTable } from '../../shared/models/searchtable';
import { PreAlert } from '../models/prealert';

@Component({
    selector: 'app-prealertupdt',
    templateUrl: './prealertupdt.component.html',
    providers: [PreAlertRepService]
})

export class PrealertUpdtComponent {
    // Local Variables 
    title = '';

    @Input() bAdmin: boolean = false;
    @Input() record: PreAlert;
    @Output() ModifiedRecords = new EventEmitter<any>();

    pkid: string = '';

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
    mbl_prealert_date = "";
    mode = '';

    SearchData = {
        pkid: '',
        mbl_prealert_date: '',
        company_code: '',
        branch_code: ''
    }

    // Array For Displaying List

    // Single Record for add/edit/view details

    constructor(
        private mainService: PreAlertRepService,
        private route: ActivatedRoute,
        private gs: GlobalService

    ) {
        this.page_count = 0;
        this.page_rows = 10;
        this.page_current = 0;
    }

    // Init Will be called After executing Constructor
    ngOnInit() {

        this.pkid = this.record.mbl_pkid;
        this.mbl_prealert_date = this.record.mbl_prealert_date;
        this.InitLov();
    }

    InitComponent() {

    }

    InitLov() {

    }
    LovSelected(_Record: SearchTable) {
    }
    // Save Data
    Save(_type: string) {
        /*
        if (!this.allvalid())
          return;
        */
        this.ErrorMessage = '';
        if (this.mbl_prealert_date == null || this.mbl_prealert_date == undefined || this.mbl_prealert_date == '') {
            this.ErrorMessage = 'Date Cannot be Blank.'
            alert(this.ErrorMessage);
            return;
        }

        this.SearchData.pkid = this.pkid;
        this.SearchData.mbl_prealert_date = this.mbl_prealert_date;
        this.SearchData.company_code = this.gs.globalVariables.comp_code;
        this.SearchData.branch_code = this.gs.globalVariables.branch_code;
        this.loading = true;
        this.ErrorMessage = '';
        this.InfoMessage = '';
        this.mainService.UpdatePrealert(this.SearchData)
            .subscribe(response => {
                this.loading = false;

                if (response.status == "OK") {
                    this.record.mbl_prealert_date = this.mbl_prealert_date;
                    this.record.row_displayed = false;
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
        this.record.row_displayed = false;
    }

    OnBlur(field: string) {
        switch (field) {
            // case 'hbl_inv_remarks':
            //     {
            //         this.hbl_inv_remarks = this.hbl_inv_remarks.toUpperCase();
            //         break;
            //     }
        }
    }

}